import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma.config";
import { z, ZodError } from "zod";

const demandeSchema = z.object({
  nom: z.string().min(2),
  prenom: z.string().min(2),
  email: z.string().email(),
  niveau: z.string().optional(),
  domaine: z.string().optional(),
  cv_path: z.string().optional(),
  lettre_path: z.string().optional(),
});

export async function GET() {
  try {
    const demandes = await prisma.demandeStage.findMany({
      orderBy: { date_creation: "desc" },
    });
    return NextResponse.json(demandes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erreur lors de la récupération des demandes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = demandeSchema.parse(body);

    const newDemande = await prisma.demandeStage.create({
      data: validated,
    });

    return NextResponse.json(newDemande, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof ZodError) {
      return NextResponse.json({ message: "Données invalides", errors: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ message: "Erreur lors de la création de la demande" }, { status: 500 });
  }
}
