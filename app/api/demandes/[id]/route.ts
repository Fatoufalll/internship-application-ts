import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma.config";
import { Prisma } from "@prisma/client";
import { sendEmail } from "@/lib/sendEmail";
// -------------------- PUT : mettre à jour le statut --------------------
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = Number(idStr);

    if (isNaN(id)) {
      return NextResponse.json({ message: "ID invalide" }, { status: 400 });
    }

    const body = await req.json();
    const statut: string = body.statut;

    if (!statut) {
      return NextResponse.json({ message: "Statut requis" }, { status: 400 });
    }

    const updatedDemande = await prisma.demandeStage.update({
      where: { id },
      data: { statut },
    });

    // ✅ Envoi email (protégé)
    try {
      await sendEmail(
        updatedDemande.email,
        "Mise à jour de votre candidature – BIDOUILLE ET INFORMATIQUE",
        `
        <div style="font-family: Arial, sans-serif;">
          <h2>BIDOUILLE ET INFORMATIQUE</h2>
          <p>Bonjour ${updatedDemande.prenom},</p>
          <p>Le statut de votre demande est maintenant :</p>
          <strong>${updatedDemande.statut}</strong>
        </div>
        `
      );
    } catch (emailError) {
      console.error("Erreur envoi email :", emailError);
    }

    return NextResponse.json(updatedDemande);

  } catch (error) {
    console.error(error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Demande non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Erreur lors de la mise à jour du statut" },
      { status: 500 }
    );
  }
}