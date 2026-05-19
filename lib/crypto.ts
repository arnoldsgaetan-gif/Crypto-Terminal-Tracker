"use client";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function getSalt(): ArrayBuffer {
  const salt =
    process.env.NEXT_PUBLIC_ENCRYPTION_SALT ?? "crypto-terminal-salt-2026";
  return encoder.encode(salt).buffer as ArrayBuffer;
}

async function deriveKey(
  masterPassword: string,
  usage: "encrypt" | "decrypt"
): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(masterPassword).buffer as ArrayBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: getSalt(),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    [usage]
  );
}

export async function encryptData(
  data: string,
  masterPassword: string
): Promise<string> {
  const key = await deriveKey(masterPassword, "encrypt");
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(data).buffer as ArrayBuffer
  );

  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  return btoa(String.fromCharCode(...combined));
}

export async function decryptData(
  encryptedBase64: string,
  masterPassword: string
): Promise<string> {
  const combined = Uint8Array.from(atob(encryptedBase64), (c) =>
    c.charCodeAt(0)
  );

  const iv = combined.slice(0, 12);
  const encrypted = combined.slice(12);

  const key = await deriveKey(masterPassword, "decrypt");

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encrypted.buffer as ArrayBuffer
  );

  return decoder.decode(decrypted);
}
