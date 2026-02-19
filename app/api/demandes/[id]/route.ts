import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma.config";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) return NextResponse.json({ message: "ID manquant" }, { status: 400 });

  try {
    const demande = await prisma.demandeStage.findUnique({
      where: { id: Number(id) },
    });

    if (!demande) return NextResponse.json({ message: "Demande non trouvée" }, { status: 404 });

    return NextResponse.json(demande);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erreur lors de la récupération de la demande" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) return NextResponse.json({ message: "ID manquant" }, { status: 400 });

  try {
    await prisma.demandeStage.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Demande supprimée" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erreur lors de la suppression" }, { status: 500 });
  }
}
