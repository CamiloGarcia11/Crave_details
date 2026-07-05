import React, { useState, useEffect } from "react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Comprobar si el usuario ya aceptó las cookies anteriormente
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    if (!cookiesAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:max-w-md bg-neutral-900 border border-neutral-800 text-white p-5 rounded-xl shadow-2xl z-50 animate-fade-in-up">
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-pink-400 flex items-center gap-2">
          🍪 Uso de Cookies
        </h3>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Utilizamos cookies propias para mejorar tu experiencia de navegación, recordar tus preferencias y optimizar nuestra tienda de detalles.
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <button 
            onClick={handleAccept}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all duration-200"
          >
            Aceptar todo
          </button>
        </div>
      </div>
    </div>
  );
}