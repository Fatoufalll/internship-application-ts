"use client";

import React, { useEffect, useState } from "react";

interface DemandeStage {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  civilite?: string;
  situation?: string;
  niveau?: string;
  formation?: string;
  etablissement?: string;
  ancienStagiaire?: string;
  anneeStage?: string;
  niveauAncien?: string;
  cv_path?: string;
  lettre_path?: string;
  statut: string;
  date_creation: string;
}

function AdminDashboard() {
  const [demandes, setDemandes] = useState<DemandeStage[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);
  const [estCharge, setEstCharge] = useState<boolean>(true);

  const handleFetchError = (status: number, message: string) => {
    setErreur(`Erreur ${status}: ${message}`);
    setEstCharge(false);
  };

  // Fonction pour générer l'URL correcte du fichier
  const getFileUrl = (fileName?: string) => (fileName ? `/uploads/${fileName}` : "#");

  const fetchDemandes = async () => {
    setEstCharge(true);
    try {
      const res = await fetch("/api/demandes");
      if (!res.ok) {
        const messageErreur = await res.text();
        handleFetchError(res.status, messageErreur);
        return;
      }

      const data = await res.json();
      if (!data || !Array.isArray(data)) throw new Error("Données invalides reçues");

      setDemandes(data);
      setErreur(null);
    } catch (err) {
      setErreur("Erreur lors de la récupération des demandes : " + (err as Error).message);
      console.error(err);
    } finally {
      setEstCharge(false);
    }
  };

  const changeStatut = async (id: number, statut: string) => {
    try {
      const res = await fetch(`/api/demandes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut }),
      });

      if (!res.ok) {
        const messageErreur = await res.text();
        throw new Error(`Erreur réseau lors de la mise à jour : ${res.status}. Détails : ${messageErreur}`);
      }

      await fetchDemandes(); // Recharger les données
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut:", err);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-800">
        Admin
      </h1>

      {erreur && <p className="text-red-500">{erreur}</p>}

      {estCharge ? (
        <p>Chargement des demandes...</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-indigo-100">
            <tr>
              <th className="border px-2 py-1">Nom</th>
              <th className="border px-2 py-1">Prénom</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Statut</th>
              <th className="border px-2 py-1">Documents</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {demandes.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="border px-2 py-1">{d.nom}</td>
                <td className="border px-2 py-1">{d.prenom}</td>
                <td className="border px-2 py-1">{d.email}</td>
                <td className="border px-2 py-1">{d.statut}</td>
                <td className="border px-2 py-1">
                  {d.cv_path && (
                    <a
                      href={getFileUrl(d.cv_path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline mr-2"
                    >
                      CV
                    </a>
                  )}
                  {d.lettre_path && (
                    <a
                      href={getFileUrl(d.lettre_path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Lettre
                    </a>
                  )}
                </td>
                <td className="border px-2 py-1">
                  <button
                    onClick={() => changeStatut(d.id, "Accepté")}
                    className="mr-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Accepté
                  </button>
                  <button
                    onClick={() => changeStatut(d.id, "Refusé")}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Refusé
                  </button>
                </td>
              </tr>
            ))}
            {demandes.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Aucune demande pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;