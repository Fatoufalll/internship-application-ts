-- CreateTable
CREATE TABLE "DemandeStage" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "niveau" TEXT,
    "domaine" TEXT,
    "cv_path" TEXT,
    "lettre_path" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'En attente',
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemandeStage_pkey" PRIMARY KEY ("id")
);
