import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase"; 
import { PLANTILLAS_MOCK } from "../data/products";
import { Download } from 'lucide-react';

export default function TemplatesSection({ onOrdenarPlantilla }) {
  const [plantillas, setPlantillas] = useState([]);

  const cargarPlantillas = async () => {
    try {
      const { data, error } = await supabase
        .from("plantillas")
        .select("*")
        .order("id", { ascending: false });
      
      if (error) throw error;
      if (data) setPlantillas(data);
    } catch (err) {
      console.error("Error cargando plantillas:", err.message);
    }
  };

  useEffect(() => {
    cargarPlantillas();

    const canalPlantillas = supabase
      .channel("cambios-plantillas")
      .on(
        "postgres_changes",
        { event: "*", scheme: "public", table: "plantillas" },
        () => { cargarPlantillas(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canalPlantillas);
    };
  }, []);

  const obtenerPlantillasCombinadas = () => {
    return plantillas.map((dbItem) => {
      return {
        id: dbItem.id,
        name: dbItem.nombre || dbItem.name || "Plantilla Sin Nombre",
        price: dbItem.precio !== undefined ? dbItem.precio : (dbItem.price !== undefined ? dbItem.price : 0),
        image: dbItem.imagen || dbItem.image || "https://placehold.co/400x300?text=Crave+Details",
        description: dbItem.description || "Nueva plantilla digital de Crave Details.",
        format: dbItem.format || "PDF",
        difficulty: dbItem.difficulty || "Fácil"
      };
    });
  };

  const plantillasCombinadas = obtenerPlantillasCombinadas();

  if (plantillasCombinadas.length === 0) return null;

  return (
    <div className="w-full bg-transparent py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold tracking-widest text-[#E71B4F] uppercase block">
            Para Emprendedores y Creativos ⚡
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Moldes y Plantillas Digitales
          </h2>
          <p className="text-xs text-gray-400">Registros detectados en la nube: {plantillas.length}</p>
        </div>

        {/* 📦 Grilla de visualización forzada */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {plantillasCombinadas.map((plan) => {
            // Valores de seguridad directos por si las celdas de Supabase son NULL
            const nombreTarjeta = plan.name || "Plantilla de Prueba Activa";
            const descTarjeta = plan.description || "Esta plantilla está registrada en la base de datos pero no tiene una descripción asignada.";
            const precioTarjeta = plan.price ? parseFloat(plan.price).toLocaleString('es-CO') : "0";
            const linkImagen = plan.image || "https://placehold.co/400x300?text=Crave+Details";
            const formatoTarjeta = plan.format || "PDF";
            const difTarjeta = plan.difficulty || "Fácil";

            return (
              <div 
                key={plan.id} 
                className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-[32px] p-5 shadow-sm flex flex-col justify-between w-full min-h-[450px] hover:shadow-md hover:bg-white/80 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="w-full h-56 rounded-2xl overflow-hidden bg-neutral-50 relative border border-neutral-100">
                    <img 
                      src={linkImagen} 
                      alt={nombreTarjeta} 
                      className="w-full h-full object-cover"
                    />
                    <span className={`absolute top-3 right-3 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md text-white shadow-sm ${
                      difTarjeta === 'Difícil' ? 'bg-rose-600' : difTarjeta === 'Medio' ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}>
                      {difTarjeta}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-bold text-neutral-900 text-lg leading-tight">
                      {nombreTarjeta}
                    </h3>
                    <p className="text-xs text-neutral-500 line-clamp-3">
                      {descTarjeta}
                    </p>
                  </div>
                  
                  <div className="bg-[#FAF8F2] p-3 rounded-xl border border-neutral-200/40">
                    <span className="text-[10px] font-bold tracking-wider text-neutral-400 block uppercase mb-1">
                      Formato de descarga:
                    </span>
                    <span className="text-xs font-mono font-bold text-neutral-800 bg-white px-2 py-0.5 rounded shadow-sm border border-neutral-100">
                      {formatoTarjeta}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 mt-6 pt-4 border-t border-neutral-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-400 font-medium">Inversión:</span>
                    <span className="font-bold text-neutral-900 text-base">
                      ${precioTarjeta} COP
                    </span>
                  </div>
                  <button 
                    onClick={() => onOrdenarPlantilla && onOrdenarPlantilla(plan)}
                    className="w-full bg-neutral-950 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#E71B4F] transition flex items-center justify-center gap-1.5"
                  >
                    <Download size={14} /> Adquirir Plantilla
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}