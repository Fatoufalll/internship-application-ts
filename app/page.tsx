import React from "react";
import Form from "../components/Form";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <main className="w-full max-w-3xl bg-white p-8 rounded shadow">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://bidouillesetinformatique.fr/wp-content/uploads/2025/09/cropped-Logo-Multicolor1-40x38.png"
            alt="Logo Bidouilles et Informatique"
            className="w-24 h-24 mb-2"
          />
          <h2 className="text-3xl font-bold text-indigo-800">Bidouilles et Informatique</h2>
          <p className="text-indigo-600 font-medium text-center">Rejoindre l'aventure Bidouilles et Informatique</p>
        </div>
        <h1 className="text-2xl font-bold text-indigo-800 mb-6 text-center">Demande de stage</h1>
        <Form />
      </main>
    </div>
  );
};

export default Home;
