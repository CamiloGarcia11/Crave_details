import React from 'react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

export default function ProductGrid() {
  const { addToCart } = useCart();

  return (
    <section id="productos" className="py-16 px-6 bg-[#FFF9C4]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#2D1B22]">Nuestro Catálogo</h2>
          <div className="w-24 h-1 bg-[#FF0055] mx-auto mt-4 rounded-full" />
        </div>

        {/* Grilla responsiva de tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-[#FF0055]/10 flex flex-col justify-between"
            >
              {/* Contenedor de la Imagen */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#FFF9C4] text-[#2D1B22] text-xs font-semibold px-3 py-1 rounded-full shadow-sm capitalize font-sans">
                  {product.category}
                </span>
              </div>

              {/* Contenido Técnico */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#2D1B22] line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm text-[#2D1B22]/70 font-sans line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="font-sans text-2xl font-black text-[#FF0055]">
                    ${product.price.toFixed(2)}
                  </span>
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToCart(product)}
                    className="p-3 bg-[#FF0055] hover:bg-[#d60048] text-white rounded-2xl transition-colors shadow-md flex items-center justify-center"
                    title="Añadir al carrito"
                  >
                    <ShoppingCart size={20} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}