"use client";
import React, { useRef, useState } from "react";
import { z, ZodError } from "zod";
import InputField from "./InputField";
import SelectField from "./SelectField";
import FileField from "./FileField";

// ---------- Validation Zod ----------
const schema = z.object({
  civilite: z.enum(["Madame", "Monsieur"]).optional(),
  nom: z.string().min(2, { message: "Nom invalide (au moins 2 lettres)." }),
  prenom: z.string().min(2, { message: "Prénom invalide (au moins 2 lettres)." }),
  codePostal: z.string().length(5, { message: "Code postal invalide." }),
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

type FormDataType = z.infer<typeof schema>;

const optionsCivility = [undefined, "Madame", "Monsieur"];
const optionsSituation = [undefined, "etudiant", "autre"];
const optionsInternshipStatus = [undefined, "oui", "non"];

// ---------- Formulaire ----------
const Form: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<FormDataType>({
    civilite: undefined,
    nom: "",
    prenom: "",
    codePostal: "",
    ville: "",
    telephone: "",
    email: "",
    situation: undefined,
    niveau: "",
    formation: "",
    etablissement: "",
    ancienStagiaire: undefined,
    anneeStage: "",
    niveauAncien: "",
    cv: undefined,
    lettre: undefined,
  });

  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<boolean>(false);

  // ---------- Handlers ----------
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (id: keyof FormDataType) => (file: File | null) => {
    if (file && file.size > 8 * 1024 * 1024) {
      setErrorMessages((prev) => ({ ...prev, [id]: "Le fichier doit faire moins de 8 Mo." }));
      return;
    }
    setErrorMessages((prev) => ({ ...prev, [id]: "" }));
    setFormData((prev) => ({ ...prev, [id]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      schema.parse(formData); // validation Zod
      setErrorMessages({});

      // Préparer FormData pour POST
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof File) {
            payload.append(key, value);
          } else {
            payload.append(key, value.toString());
          }
        }
      });

      const res = await fetch("/api/demandes", {
        method: "POST",
        body: payload,
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Erreur lors de l'envoi de la candidature");
      }

      setSuccess(true);
      formRef.current?.reset();
      setFormData({
        civilite: undefined,
        nom: "",
        prenom: "",
        codePostal: "",
        ville: "",
        telephone: "",
        email: "",
        situation: undefined,
        niveau: "",
        formation: "",
        etablissement: "",
        ancienStagiaire: undefined,
        anneeStage: "",
        niveauAncien: "",
        cv: undefined,
        lettre: undefined,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        const errors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          const key = issue.path[0] as string;
          errors[key] = issue.message;
        });
        setErrorMessages(errors);
        setSuccess(false);
      } else {
        setErrorMessages({ submit: (err as Error).message });
        setSuccess(false);
      }
    }
  };

  // ---------- JSX ----------
  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 text-black">
      <SelectField
        id="civilite"
        label="Civilité"
        options={optionsCivility}
        value={formData.civilite ?? ""}
        onChange={handleInputChange}
        error={errorMessages.civilite}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField id="nom" label="Nom" placeholder="Nom" value={formData.nom} onChange={handleInputChange} error={errorMessages.nom} />
        <InputField id="prenom" label="Prénom" placeholder="Prénom" value={formData.prenom} onChange={handleInputChange} error={errorMessages.prenom} />
        <InputField id="codePostal" label="Code postal" placeholder="Code postal" value={formData.codePostal} onChange={handleInputChange} error={errorMessages.codePostal} />
        <InputField id="ville" label="Ville" placeholder="Ville" value={formData.ville} onChange={handleInputChange} error={errorMessages.ville} />
        <InputField id="telephone" label="Téléphone" placeholder="Téléphone" value={formData.telephone} onChange={handleInputChange} error={errorMessages.telephone} />
        <InputField id="email" label="Email" placeholder="Email" value={formData.email} onChange={handleInputChange} error={errorMessages.email} />
      </div>

      <SelectField
        id="situation"
        label="Situation"
        options={optionsSituation}
        value={formData.situation ?? ""}
        onChange={handleInputChange}
        error={errorMessages.situation}
      />

      {formData.situation === "etudiant" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField id="niveau" label="Niveau d'études" placeholder="Niveau d'études" value={formData.niveau ?? ""} onChange={handleInputChange} error={errorMessages.niveau} />
          <InputField id="formation" label="Formation" placeholder="Formation" value={formData.formation ?? ""} onChange={handleInputChange} error={errorMessages.formation} />
          <InputField id="etablissement" label="Établissement" placeholder="Établissement" value={formData.etablissement ?? ""} onChange={handleInputChange} error={errorMessages.etablissement} />
        </div>
      )}

      <SelectField
        id="ancienStagiaire"
        label="Avez-vous déjà été stagiaire chez nous ?"
        options={optionsInternshipStatus}
        value={formData.ancienStagiaire ?? ""}
        onChange={handleInputChange}
        error={errorMessages.ancienStagiaire}
      />

      {formData.ancienStagiaire === "oui" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField id="anneeStage" label="Année du stage" placeholder="Année du stage" value={formData.anneeStage ?? ""} onChange={handleInputChange} error={errorMessages.anneeStage} />
          <InputField id="niveauAncien" label="Niveau d'études lors du stage" placeholder="Niveau d'études lors du stage" value={formData.niveauAncien ?? ""} onChange={handleInputChange} error={errorMessages.niveauAncien} />
        </div>
      )}

      <FileField id="cv" label="CV (PDF < 8 Mo)" onChange={handleFileChange("cv")} error={errorMessages.cv} />
      <FileField id="lettre" label="Lettre de motivation (PDF < 8 Mo)" onChange={handleFileChange("lettre")} error={errorMessages.lettre} />

      <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded font-semibold hover:bg-indigo-700 transition-colors">
        Envoyer la candidature
      </button>

      {success && <p className="text-green-600 text-center">Candidature envoyée ✅</p>}
      {errorMessages.submit && <p className="text-red-600 text-center">{errorMessages.submit}</p>}
    </form>
  );
};

export default Form;