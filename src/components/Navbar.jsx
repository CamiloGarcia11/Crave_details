import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Menu, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { getCartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#FFF9C4]/80 backdrop-blur-md border-b border-[#FF0055]/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO TEMÁTICO DE CRAVE DETAILS */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <span className="font-display text-2xl font-black text-[#FF0055] tracking-wide">
            Crave <span className="font-sans text-sm font-light bg-[#FF0055] text-white px-2 py-0.5 rounded-full ml-1">Details</span>
          </span>
        </div>

        {/* MENÚ DE ESCRITORIO (LINKS) */}
        <div className="hidden md:flex items-center space-x-8 font-sans font-medium text-[#2D1B22]">
          <a href="#productos" className="hover:text-[#FF0055] transition-colors">Catálogo</a>
          <a href="#personalizados" className="hover:text-[#FF0055] transition-colors">Pedidos Personalizados</a>
          <a href="https://wa.me/573000000000" target="_blank" rel="noreferrer" className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 transition-colors">
            <MessageCircle size={18} />
            <span>Contacto</span>
          </a>
        </div>

        {/* BOTÓN DEL CARRITO ANIMADO CON INTERACCIONES */}
        <div className="flex items-center space-x-4">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="relative p-2 text-[#2D1B22] hover:text-[#FF0055] transition-colors"
          >
            <ShoppingBag size={26} />
            <AnimatePresence>
              {getCartCount() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-[#FF0055] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm"
                >
                  {getCartCount()}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* MENÚ HAMBURGUESA PARA CELULARES */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-[#2D1B22]">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MENÚ DESPLEGABLE EN DISPOSITIVOS MÓVILES */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-4 pt-4 border-t border-[#FF0055]/10 flex flex-col space-y-4 font-sans font-medium text-[#2D1B22]"
        >
          <a href="#productos" onClick={() => setIsOpen(false)} className="hover:text-[#FF0055]">Catálogo</a>
          <a href="#personalizados" onClick={() => setIsOpen(false)} className="hover:text-[#FF0055]">Pedidos Personalizados</a>
          <a href="https://wa.me/573000000000" target="_blank" rel="noreferrer" className="text-emerald-600">WhatsApp Directo</a>
        </motion.div>
      )}
    </nav>
  );
}