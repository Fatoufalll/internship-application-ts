"use client"
import React, { useRef, useState } from "react";
import { z } from "zod";
import InputField from "./InputField";
import SelectField from "./SelectField";
import FileField from "./FileField";

// Définir le schéma de validation avec Zod
const schema = z.object({
  civilite: z.enum(["Madame", "Monsieur"]).optional(),
  nom: z.string().min(2, { message: "Nom invalide (au moins 2 lettres)." }),
  prenom: z.string().min(2, { message: "Prénom invalide (au moins 2 lettres)." }),
  codePostal: z.string().length(5, { message: "Code postal invalide (ex : 75001)." }),
  ville: z.string().min(2, { message: "Ville invalide (au moins 2 lettres)." }),
  telephone: z.string().regex(/^(0|\+33)[1-9]\d{8}$/, { message: "Téléphone invalide." }),
  email: z.string().email({ message: "Email invalide." }),
  situation: z.enum(["etudiant", "autre"]).optional(),
  niveau: z.string().optional(),
  formation: z.string().optional(),
  etablissement: z.string().optional(),
  ancienStagiaire: z.enum(["oui", "non"]).optional(),
  anneeStage: z.string().optional(),
  niveauAncien: z.string().optional(),
  cv: z.instanceof(File).optional(),
  lettre: z.instanceof(File).optional(),
});

const optionsCivility = ["", "Madame", "Monsieur"];
const optionsSituation = ["", "etudiant", "autre"];
const optionsInternshipStatus = ["", "oui", "non"];

const Form: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<any>({
    civilite: "",
    nom: "",
    prenom: "",
    codePostal: "",
    ville: "",
    telephone: "",
    email: "",
    situation: "",
    niveau: "",
    formation: "",
    etablissement: "",
    ancienStagiaire: "",
    anneeStage: "",
    niveauAncien: "",
    cv: null,
    lettre: null,
  });
  
  const [errorMessages, setErrorMessages] = useState<any>({});
  const [success, setSuccess] = useState<boolean>(false);

  const handleFileChange = (id: string) => (file: File | null) => {
    if (file && file.size > 8 * 1024 * 1024) {
      setErrorMessages((prev: any) => ({ ...prev, [id]: "Le fichier doit faire moins de 8 Mo." }));
      return;
    }
    setErrorMessages((prev: any) => ({ ...prev, [id]: "" }));
    setFormData((prev: any) => ({ ...prev, [id]: file }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation avec Zod
    const result = schema.safeParse(formData);
    
    if (!result.success) {
      const errors: any = {};
      result.error.errors.forEach((error) => {
        errors[error.path[0]] = error.message; // Map des messages d'erreur
      });
      setErrorMessages(errors);
      return;
    }
    
    setSuccess(true);
    formRef.current?.reset();
    
    setFormData({
      civilite: "",
      nom: "",
      prenom: "",
      codePostal: "",
      ville: "",
      telephone: "",
      email: "",
      situation: "",
      niveau: "",
      formation: "",
      etablissement: "",
      ancienStagiaire: "",
      anneeStage: "",
      niveauAncien: "",
      cv: null,
      lettre: null,
    });
    setErrorMessages({});
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 text-black">
      <SelectField
        id="civilite"
        label="Civilité"
        options={optionsCivility}
        value={formData.civilite}
        onChange={handleInputChange}
        error={errorMessages.civilite}
      />
      <InputField
        id="nom"
        label="Nom"
        placeholder="Nom"
        value={formData.nom}
        onChange={handleInputChange}
        error={errorMessages.nom}
      />
      <InputField
        id="prenom"
        label="Prénom"
        placeholder="Prénom"
        value={formData.prenom}
        onChange={handleInputChange}
        error={errorMessages.prenom}
      />
      <InputField
        id="codePostal"
        label="Code postal"
        placeholder="Code postal"
        value={formData.codePostal}
        onChange={handleInputChange}
        error={errorMessages.codePostal}
      />
      <InputField
        id="ville"
        label="Ville"
        placeholder="Ville"
        value={formData.ville}
        onChange={handleInputChange}
        error={errorMessages.ville}
      />
      <InputField
        id="telephone"
        label="Téléphone"
        placeholder="Téléphone (ex : 06 12 34 56 78)"
        value={formData.telephone}
        onChange={handleInputChange}
        error={errorMessages.telephone}
      />
      <InputField
        id="email"
        label="Email"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
        error={errorMessages.email}
      />
      <SelectField
        id="situation"
        label="Situation"
        options={optionsSituation}
        value={formData.situation}
        onChange={handleInputChange}
        error={errorMessages.situation}
      />
      {formData.situation === "etudiant" && (
        <>
          <InputField
            id="niveau"
            label="Niveau d'études"
            placeholder="Niveau d'études"
            value={formData.niveau}
            onChange={handleInputChange}
            error={errorMessages.niveau}
          />
          <InputField
            id="formation"
            label="Formation"
            placeholder="Formation"
            value={formData.formation}
            onChange={handleInputChange}
            error={errorMessages.formation}
          />
          <InputField
            id="etablissement"
            label="Établissement"
            placeholder="Établissement"
            value={formData.etablissement}
            onChange={handleInputChange}
            error={errorMessages.etablissement}
          />
        </>
      )}
      <SelectField
        id="ancienStagiaire"
        label="Avez-vous déjà été stagiaire chez nous ?"
        options={optionsInternshipStatus}
        value={formData.ancienStagiaire}
        onChange={handleInputChange}
        error={errorMessages.ancienStagiaire}
      />
      {formData.ancienStagiaire === "oui" && (
        <>
          <InputField
            id="anneeStage"
            label="Année du stage"
            placeholder="Année du stage"
            value={formData.anneeStage}
            onChange={handleInputChange}
            error={errorMessages.anneeStage}
          />
          <InputField
            id="niveauAncien"
            label="Niveau d'études lors du stage"
            placeholder="Niveau d'études lors du stage"
            value={formData.niveauAncien}
            onChange={handleInputChange}
            error={errorMessages.niveauAncien}
          />
        </>
      )}
      <FileField
        id="cv"
        label="Votre CV (PDF &lt; 8 Mo)"
        onChange={handleFileChange("cv")}
        error={errorMessages.cv}
      />
      <FileField
        id="lettre"
        label="Lettre de motivation (PDF &lt; 8 Mo)"
        onChange={handleFileChange("lettre")}
        error={errorMessages.lettre}
      />
      <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded font-semibold hover:bg-indigo-700 transition-colors">
        Envoyer la candidature
      </button>
      {success && <p className="text-green-600 text-center">Candidature envoyée ✅</p>}
    </form>
  );
};

export default Form;
