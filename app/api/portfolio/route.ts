import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/portfolio — positions ouvertes de l'utilisateur
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const positions = await prisma.position.findMany({
    where: { clerkUserId: userId, isOpen: true },
    orderBy: { openedAt: "desc" },
  });

  return NextResponse.json(positions);
}

// POST /api/portfolio — ouvre une nouvelle position
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { symbol, asset, type, quantity, entryPrice } = body;

  if (!symbol  !asset  !type  !quantity  !entryPrice) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const position = await prisma.position.create({
    data: {
      clerkUserId:  userId,
      symbol,
      asset,
      type,
      quantity:     Number(quantity),
      entryPrice:   Number(entryPrice),
      currentPrice: Number(entryPrice),
    },
  });

  return NextResponse.json(position, { status: 201 });
}
