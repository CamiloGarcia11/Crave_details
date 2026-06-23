import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center bg-[#FFF9C4] px-6 py-20 text-center overflow-hidden">
      {/* Círculos decorativos de fondo con los colores del logo */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#FF0055]/10 rounded-full filter blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FF0055]/5 rounded-full filter blur-3xl" />

      <div className="relative max-w-3xl mx-auto">
        <motion.span 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-block bg-[#FF0055] text-white text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full font-sans mb-6 shadow-sm"
        >
          Hecho a mano con amor ✨
        </motion.span>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-5xl md:text-7xl font-black text-[#2D1B22] leading-tight"
        >
          Detalles únicos para <br />
          <span className="text-[#FF0055]">ocasiones especiales</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-6 text-lg md:text-xl font-sans text-[#2D1B22]/80 max-w-xl mx-auto"
        >
          En Crave Details creamos ramos eternos, regalos personalizados y sorpresas inolvidables a la medida de tus sentimientos.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10"
        >
          <a 
            href="#productos" 
            className="inline-flex items-center space-x-2 bg-[#FF0055] hover:bg-[#d60048] text-white font-sans font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            <span>Explorar Catálogo</span>
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}