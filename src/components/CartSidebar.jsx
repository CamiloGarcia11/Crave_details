import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CartSidebar({ isOpen, onClose }) {
  const { cart, removeFromCart, getCartTotal, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
        >
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#FFF9C4]/50">
            <h2 className="text-xl font-bold text-[#2D1B22] flex items-center gap-2">
              <ShoppingBag className="text-[#FF0055]" /> Mi Pedido
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-[#FF0055] transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <p className="text-center text-gray-400 mt-12">Tu carrito está esperando por detalles hermosos... 🌸</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-[#FFF9C4]/20 rounded-2xl border border-[#FF0055]/5">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                    <div>
                      <h4 className="font-bold text-[#2D1B22] text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500">Cant: {item.quantity}</p>
                      <p className="text-[#FF0055] font-black text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
              <div className="flex justify-between text-lg font-bold text-[#2D1B22]">
                <span>Total estimado:</span>
                <span className="text-[#FF0055] text-2xl font-black">${getCartTotal().toFixed(2)}</span>
              </div>
              <button 
                onClick={() => {
                  const mensaje = encodeURIComponent(`¡Hola Crave Details! Me gustaría encargar estos productos de mi carrito. Total: $${getCartTotal().toFixed(2)}`);
                  window.open(`https://wa.me/573023399168?text=${mensaje}`, '_blank');
                }}
                className="w-full bg-[#FF0055] hover:bg-[#d60048] text-white text-center font-bold py-4 rounded-2xl shadow-lg transition-all"
              >
                Confirmar Pedido por WhatsApp 💬
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}