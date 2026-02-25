import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma.config";
import { z, ZodError } from "zod";
import { Prisma } from "@prisma/client";
import fs from "fs";
import path from "path";
import { sendEmail } from "@/lib/sendEmail";

// Schéma Zod pour validation
const demandeSchema = z.object({
  civilite: z.enum(["Madame", "Monsieur"]).optional(),
  nom: z.string().min(2),
  prenom: z.string().min(2),
  codePostal: z.string().length(5),
  ville: z.string().min(2),
  telephone: z.string().min(8),
  email: z.string().email(),
  situation: z.enum(["etudiant", "autre"]).optional(),
  niveau: z.string().optional(),
  formation: z.string().optional(),
  etablissement: z.string().optional(),
  ancienStagiaire: z.enum(["oui", "non"]).optional(),
  anneeStage: z.string().optional(),
  niveauAncien: z.string().optional(),
  cv_path: z.string().optional(),
  lettre_path: z.string().optional(),
});

// ---------- GET toutes les demandes ----------
export async function GET() {
  try {
    const demandes = await prisma.demandeStage.findMany({
      orderBy: { date_creation: "desc" },
    });
    return NextResponse.json(demandes);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des demandes" },
      { status: 500 }
    );
  }
}

// ---------- POST : créer une demande ----------
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // ---------- Gestion des enums ----------
    const civilite = ["Madame", "Monsieur"].includes(formData.get("civilite")?.toString() || "")
      ? (formData.get("civilite") as "Madame" | "Monsieur")
      : undefined;

    const situation = ["etudiant", "autre"].includes(formData.get("situation")?.toString() || "")
      ? (formData.get("situation") as "etudiant" | "autre")
      : undefined;

    const ancienStagiaire = ["oui", "non"].includes(formData.get("ancienStagiaire")?.toString() || "")
      ? (formData.get("ancienStagiaire") as "oui" | "non")
      : undefined;

    // ---------- Création de l'objet de base ----------
    const fields: z.infer<typeof demandeSchema> = {
      civilite,
      nom: formData.get("nom")?.toString() || "",
      prenom: formData.get("prenom")?.toString() || "",
      codePostal: formData.get("codePostal")?.toString() || "",
      ville: formData.get("ville")?.toString() || "",
      telephone: formData.get("telephone")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      situation,
      niveau: formData.get("niveau")?.toString() || undefined,
      formation: formData.get("formation")?.toString() || undefined,
      etablissement: formData.get("etablissement")?.toString() || undefined,
      ancienStagiaire,
      anneeStage: formData.get("anneeStage")?.toString() || undefined,
      niveauAncien: formData.get("niveauAncien")?.toString() || undefined,
      cv_path: undefined,
      lettre_path: undefined,
    };

    // ---------- Gestion des fichiers ----------
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const timestamp = Date.now();

    const cvFile = formData.get("cv") as File | null;
    if (cvFile && cvFile.size > 0) {
      const ext = path.extname(cvFile.name) || ".pdf";
      const cvFileName = `${timestamp}_cv${ext}`;
      const cvBuffer = Buffer.from(await cvFile.arrayBuffer());
      fs.writeFileSync(path.join(uploadDir, cvFileName), cvBuffer);
      fields.cv_path = cvFileName;
    }

    const lettreFile = formData.get("lettre") as File | null;
    if (lettreFile && lettreFile.size > 0) {
      const ext = path.extname(lettreFile.name) || ".pdf";
      const lettreFileName = `${timestamp}_lettre${ext}`;
      const lettreBuffer = Buffer.from(await lettreFile.arrayBuffer());
      fs.writeFileSync(path.join(uploadDir, lettreFileName), lettreBuffer);
      fields.lettre_path = lettreFileName;
    }

    // ---------- Validation Zod ----------
    const validated = demandeSchema.parse(fields);

    // ---------- Création en base ----------
    const prismaData: Prisma.DemandeStageCreateInput = {
      nom: validated.nom,
      prenom: validated.prenom,
      codePostal: validated.codePostal,
      ville: validated.ville,
      telephone: validated.telephone,
      email: validated.email,
      civilite: validated.civilite || "Monsieur",
      situation: validated.situation || "autre",
      niveau: validated.niveau || "",
      formation: validated.formation || "",
      etablissement: validated.etablissement || "",
      ancienStagiaire: validated.ancienStagiaire || "non",
      anneeStage: validated.anneeStage || "",
      niveauAncien: validated.niveauAncien || "",
      cv_path: validated.cv_path || "",
      lettre_path: validated.lettre_path || "",
    };

  const newDemande = await prisma.demandeStage.create({ data: prismaData });

// ✅ On protège l'envoi d'email
try {
  await sendEmail(
    validated.email,
    "Confirmation de réception – BIDOUILLE ET INFORMATIQUE",
    `
    <div style="font-family: Arial, sans-serif;">
      <h2>BIDOUILLE ET INFORMATIQUE</h2>
      <p>Bonjour ${validated.prenom},</p>
      <p>Nous avons bien reçu votre demande de stage.</p>
      <p>Elle est actuellement en cours d’étude.</p>
    </div>
    `
  );
} catch (emailError) {
  console.error("Erreur envoi email :", emailError);
}

// ✅ Ensuite on retourne la réponse API
return NextResponse.json(newDemande, { status: 201 });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Données invalides", errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Erreur lors de la création de la demande" },
      { status: 500 }
    );
  }
  
}