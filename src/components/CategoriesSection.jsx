import React, { useState } from "react";

export default function CategoriesSection({ onSelectSubcategoria }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const menuEstructurado = [
    {
      titulo: "💝 Detalles Especiales",
      items: ["Aniversarios", "Cumpleaños", "Grados", "Cajas de Rosas"]
    },
    {
      titulo: "🍳 Desayunos",
      items: ["Sorpresa Premium", "Fitness / Saludable", "Infantiles", "meriendas"]
    },
    {
      titulo: "📸 Recuerdos & Fotos",
      items: ["Álbumes de Figuritas", "Portarretratos (Cuadros)", "Polaroids", "Libros de Aventuras"]
    },
    {
      titulo: "🧸 Complementos",
      items: ["Peluches Gigantes", "Globos con Helio", "Chocolatería", "Tarjetas Personalizadas"]
    },
    {
      titulo: "🔥 Especiales",
      items: ["Combos del Mes", "Detalles Rápidos", "Ofertas Imperdibles"],
      esDestacado: true
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-6 mb-6 font-sans flex justify-center relative z-50">
      
      {/* CONTENEDOR INTEGRADO */}
      <div 
        className="relative"
        onMouseEnter={() => setMenuAbierto(true)}
        onMouseLeave={() => setMenuAbierto(false)}
      >
        {/* BOTÓN ESTILIZADO */}
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="flex items-center gap-2 px-6 py-2.5 text-xs md:text-sm font-black uppercase tracking-widest text-neutral-800 hover:text-[#E71B4F] transition-all bg-neutral-100/60 hover:bg-pink-50 rounded-full border border-neutral-200/40 shadow-sm"
        >
          <span>Categorías</span>
          <svg 
            className={`w-3.5 h-3.5 transition-transform duration-300 text-[#E71B4F] ${menuAbierto ? "rotate-180" : ""}`} 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* MEGA PANEL PREMIUM CORREGIDO */}
        {menuAbierto && (
          /* 🌟 CAMBIO: Se eliminó mt-3 y se agregó pt-4 como puente invisible. 
             También se movieron los estilos de fondo y bordes al contenedor hijo */
          <div className="absolute left-1/2 transform -translate-x-1/2 top-full pt-4 w-[90vw] max-w-4xl animate-fadeIn z-50">
            
            {/* Contenedor real con el diseño visual de cristal */}
            <div className="w-full bg-white/95 backdrop-blur-md border border-neutral-200/50 rounded-[32px] shadow-[0_20px_50px_rgba(231,27,79,0.08)] p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
              {menuEstructurado.map((columna, idx) => (
                <div key={idx} className="space-y-3">
                  {/* Título interno de la columna */}
                  <h4 className={`text-[11px] font-black uppercase tracking-widest pb-1.5 border-b border-pink-100/40 ${
                    columna.esDestacado ? "text-[#E71B4F]" : "text-neutral-900"
                  }`}>
                    {columna.titulo}
                  </h4>
                  
                  {/* Items */}
                  <ul className="flex flex-col gap-2">
                    {columna.items.map((item, itemIdx) => (
                      <li key={itemIdx}>
                        <button
                          onClick={() => {
                            if (onSelectSubcategoria) onSelectSubcategoria(item);
                            setMenuAbierto(false);
                          }}
                          className="w-full text-left text-xs md:text-sm font-medium text-neutral-500 hover:text-[#E71B4F] transition-colors py-0.5"
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

    </div>
  );
}