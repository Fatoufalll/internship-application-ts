/*
  Warnings:

  - Added the required column `ancienStagiaire` to the `DemandeStage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anneeStage` to the `DemandeStage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `civilite` to the `DemandeStage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codePostal` to the `DemandeStage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `etablissement` to the `DemandeStage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formation` to the `DemandeStage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `niveauAncien` to the `DemandeStage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `situation` to the `DemandeStage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telephone` to the `DemandeStage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ville` to the `DemandeStage` table without a default value. This is not possible if the table is not empty.
  - Made the column `niveau` on table `DemandeStage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cv_path` on table `DemandeStage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lettre_path` on table `DemandeStage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DemandeStage" ADD COLUMN     "ancienStagiaire" TEXT NOT NULL,
ADD COLUMN     "anneeStage" TEXT NOT NULL,
ADD COLUMN     "civilite" TEXT NOT NULL,
ADD COLUMN     "codePostal" TEXT NOT NULL,
ADD COLUMN     "etablissement" TEXT NOT NULL,
ADD COLUMN     "formation" TEXT NOT NULL,
ADD COLUMN     "niveauAncien" TEXT NOT NULL,
ADD COLUMN     "situation" TEXT NOT NULL,
ADD COLUMN     "telephone" TEXT NOT NULL,
ADD COLUMN     "ville" TEXT NOT NULL,
ALTER COLUMN "niveau" SET NOT NULL,
ALTER COLUMN "cv_path" SET NOT NULL,
ALTER COLUMN "lettre_path" SET NOT NULL,
ALTER COLUMN "statut" SET DEFAULT 'en_attente';
