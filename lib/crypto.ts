"use client";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function getSalt(): Uint8Array {
  const salt =
    process.env.NEXT_PUBLIC_ENCRYPTION_SALT ?? "crypto-terminal-salt-2026";
  return encoder.encode(salt);
}

async function deriveKey(
  masterPassword: string,
  usage: "encrypt" | "decrypt"
): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(masterPassword),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: getSalt(),
      iterations: 600_000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    [usage]
  );
}

/**
 * Chiffre une chaîne avec AES-GCM + PBKDF2 (600k itérations)
 * Retourne une string base64 contenant IV + données chiffrées
 */
export async function encryptData(
  data: string,
  masterPassword: string
): Promise<string> {
  const key = await deriveKey(masterPassword, "encrypt");
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(data)
  );

  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  return btoa(String.fromCharCode(...combined));
}

/**
 * Déchiffre une string base64 générée par encryptData
 */
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
    encrypted
  );

  return decoder.decode(decrypted);
}
