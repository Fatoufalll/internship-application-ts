"use client"; // nécessaire pour le client-side avec Tailwind et next/image

import React from "react";
import Image from "next/image";
import Form from "../components/Form";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <main className="w-full max-w-3xl bg-white p-8 rounded shadow">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="https://bidouillesetinformatique.fr/wp-content/uploads/2025/09/cropped-Logo-Multicolor1-40x38.png"
            alt="Logo Bidouilles et Informatique"
            width={96}   // équivalent Tailwind w-24 (24 * 4px)
            height={96}  // équivalent Tailwind h-24
            className="mb-2"
            priority={true} // charge l'image en priorité pour LCP
          />
          <h2 className="text-3xl font-bold text-indigo-800">
            Bidouilles et Informatique
          </h2>
          <p className="text-indigo-600 font-medium text-center">
            Rejoindre l&apos;aventure Bidouilles et Informatique
          </p>
        </div>

        <h1 className="text-2xl font-bold text-indigo-800 mb-6 text-center">
          Demande de stage
        </h1>

        <Form />
      </main>
    </div>
  );
};

export default Home;
