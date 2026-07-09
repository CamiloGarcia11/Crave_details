import React, { useState, useEffect } from "react";

export default function BannerCarousel() {
  // Lista de imágenes
  const imagenes = [
    "/IMG_7760.jpg", // Tu banner de "Bienvenidos a Crave Details"
    "/IMG_7762.jpg" 
  ];

  const [indiceActual, setIndiceActual] = useState(0);

  // Cambio automático cada 4 segundos
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceActual((prevIndice) => (prevIndice + 1) % imagenes.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, [imagenes.length]);

  return (
    <div className="w-full max-w-5xl mx-auto px-6 mb-12">
      {/* 🌟 CAMBIO AQUÍ: Eliminamos la altura fija (h-[...]) y usamos h-auto */}
      <div className="relative w-full h-auto rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-sm group">
        
        {/* 🌟 CAMBIO AQUÍ: Usamos w-full, h-auto y object-contain para que la imagen se reduzca o crezca manteniendo su forma original exacta sin recortar las letras */}
        <img
          src={imagenes[indiceActual]}
          alt={`Novedad Crave Details ${indiceActual + 1}`}
          className="w-full h-auto object-contain block transition-all duration-750 ease-in-out"
        />

        {/* Capa de degradado sutil con el rosa de tu marca */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#E71B4F]/10 to-transparent pointer-events-none" />

        {/* Indicadores de bolitas inferiores */}
        <div className="absolute bottom-3 sm:bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2 bg-neutral-950/20 px-3 py-1.5 rounded-full backdrop-blur-md">
          {imagenes.map((_, index) => (
            <button
              key={index}
              onClick={() => setIndiceActual(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === indiceActual ? "bg-[#E71B4F] w-5" : "bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}