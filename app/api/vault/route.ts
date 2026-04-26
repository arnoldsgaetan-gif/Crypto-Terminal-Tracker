import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/vault — récupère le vault chiffré de l'utilisateur
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const vault = await prisma.userVault.findUnique({
    where: { clerkUserId: userId },
    select: { encryptedMnemonic: true, encryptedPrivKeys: true, updatedAt: true },
  });

  return NextResponse.json(vault ?? {});
}

// POST /api/vault — sauvegarde le vault chiffré (déjà chiffré côté client)
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { encryptedMnemonic, encryptedPrivKeys } = body;

  const vault = await prisma.userVault.upsert({
    where: { clerkUserId: userId },
    create: { clerkUserId: userId, encryptedMnemonic, encryptedPrivKeys },
    update: { encryptedMnemonic, encryptedPrivKeys },
  });

  return NextResponse.json({ id: vault.id, updatedAt: vault.updatedAt });
}
