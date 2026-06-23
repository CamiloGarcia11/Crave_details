import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomOrder() {
  const [nombre, setNombre] = useState('');
  const [baseSeleccionada, setBaseSeleccionada] = useState('');
  const [globosSeleccionados, setGlobosSeleccionados] = useState([]);
  const [dulcesSeleccionados, setDulcesSeleccionados] = useState([]);
  const [descripcionLibre, setDescripcionLibre] = useState('');
  
  // 🧸 NUEVOS ESTADOS PARA LA SECCIÓN DE PELUCHES
  const [incluyePeluche, setIncluyePeluche] = useState(false);
  const [descripcionPeluche, setDescripcionPeluche] = useState('');

  // 📝 OPCIONES DISPONIBLES EN TU TIENDA
  const opcionesBases = [
    { id: 'madera', nombre: '📦 Caja de Madera Premium' },
    { id: 'carton', nombre: '🎀 Caja de Cartón con Moño' },
    { id: 'ancheta', nombre: '🧺 Ancheta Tipo Canasta' },
    { id: 'globo_burbuja', nombre: '🎈 Globo Burbuja Sorpresa' }
  ];

  const opcionesGlobos = [
    { id: 'cumple', nombre: '🎂 Feliz Cumpleaños' },
    { id: 'aniv', nombre: '❤️ Aniversario / Amor' },
    { id: 'grado', nombre: '🎓 Felicitaciones / Grado' },
    { id: 'helio', nombre: '🎈 Ramillete con Helio' }
  ];

  const opcionesDulces = [
    { id: 'ferrero', nombre: '🍫 Chocolates Ferrero Rocher' },
    { id: 'hersheys', nombre: '🍫 Barra Hershey\'s' },
    { id: 'pringles', nombre: '🥔 Papas Pringles' },
    { id: 'corona', nombre: '🍺 Cerveza Corona Extra' },
    { id: 'mms', nombre: '🍬 M&M\'s Grandes' }
  ];

  // Manejadores para selección múltiple (Globos y Dulces)
  const toggleGlobo = (nombreGlobo) => {
    if (globosSeleccionados.includes(nombreGlobo)) {
      setGlobosSeleccionados(globosSeleccionados.filter(item => item !== nombreGlobo));
    } else {
      setGlobosSeleccionados([...globosSeleccionados, nombreGlobo]);
    }
  };

  const toggleDulce = (nombreDulce) => {
    if (dulcesSeleccionados.includes(nombreDulce)) {
      setDulcesSeleccionados(dulcesSeleccionados.filter(item => item !== nombreDulce));
    } else {
      setDulcesSeleccionados([...dulcesSeleccionados, nombreDulce]);
    }
  };

  const enviarPedidoPersonalizado = (e) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      alert("Por favor, ingresa tu nombre para saber con quién hablamos.");
      return;
    }

    // 🧸 Estructuramos la línea del peluche para el mensaje
    const textoPeluche = incluyePeluche 
      ? `✅ Sí -> ${descripcionPeluche || '_(Cualquiera disponible)_'}`
      : `❌ No`;

    // Armamos el mensaje pulido para WhatsApp con la nueva sección incluida
    const mensaje = `✨ *¡NUEVO PEDIDO PERSONALIZADO!* ✨\n\n` +
                    `👤 *Cliente:* ${nombre}\n\n` +
                    `📦 *Base escogida:* ${baseSeleccionada || '_(Ninguna, prefiere sugerencia)_'}\n` +
                    `🎈 *Globos / Temática:* ${globosSeleccionados.length > 0 ? globosSeleccionados.join(', ') : '_(Ninguno seleccionado)_'}\n` +
                    `🍫 *Dulces / Snacks:* ${dulcesSeleccionados.length > 0 ? dulcesSeleccionados.join(', ') : '_(Ninguno seleccionado)_'}\n` +
                    `🧸 *Incluye Peluche:* ${textoPeluche}\n\n` +
                    `📝 *Descripción del diseño libre:* \n${descripcionLibre || '_(No añadió descripción extra)_'}`;

    const numeroTelefono = "573023399168"; 
    window.open(`https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 bg-white rounded-2xl shadow-xl mt-4 border border-neutral-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-neutral-950">🎁 Arma tu Detalle Ideal</h2>
        <p className="text-neutral-500 mt-2 text-sm">Selecciona lo que deseas incluir o cuéntanos tu idea desde cero.</p>
      </div>

      <form onSubmit={enviarPedidoPersonalizado} className="space-y-6 text-left">
        {/* 1. NOMBRE CLIENTE */}
        <div>
          <label className="block text-sm font-bold text-neutral-800 mb-2">1. Tu Nombre Completo *</label>
          <input
            type="text"
            required
            placeholder="Ej. Camilo García"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#E5738E] focus:border-[#E5738E] outline-none transition-all text-neutral-800"
          />
        </div>

        {/* 2. SELECCIÓN DE BASE */}
        <div>
          <label className="block text-sm font-bold text-neutral-800 mb-2">2. Selecciona la Base / Caja (Elige una)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {opcionesBases.map((b) => (
              <motion.button
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                key={b.id}
                onClick={() => setBaseSeleccionada(b.nombre)}
                className={`p-3 text-left rounded-xl border font-medium text-sm transition-all ${baseSeleccionada === b.nombre ? 'border-[#E5738E] bg-rose-50 text-[#E5738E] ring-2 ring-[#E5738E]' : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'}`}
              >
                {b.nombre}
              </motion.button>
            ))}
          </div>
        </div>

        {/* 3. SELECCIÓN DE GLOBOS */}
        <div>
          <label className="block text-sm font-bold text-neutral-800 mb-2">3. ¿Qué tipo de globos o temática buscas? (Puedes elegir varios)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {opcionesGlobos.map((g) => {
              const seleccionado = globosSeleccionados.includes(g.nombre);
              return (
                <motion.button
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  key={g.id}
                  onClick={() => toggleGlobo(g.nombre)}
                  className={`p-3 text-left rounded-xl border font-medium text-sm transition-all ${seleccionado ? 'border-[#E5738E] bg-rose-50 text-[#E5738E] ring-1 ring-[#E5738E]' : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'}`}
                >
                  {seleccionado ? '✅ ' : '➕ '} {g.nombre}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 4. SELECCIÓN DE DULCES */}
        <div>
          <label className="block text-sm font-bold text-neutral-800 mb-2">4. ¿Qué dulces o licores de la tienda quieres añadir? (Puedes elegir varios)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {opcionesDulces.map((d) => {
              const seleccionado = dulcesSeleccionados.includes(d.nombre);
              return (
                <motion.button
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  key={d.id}
                  onClick={() => toggleDulce(d.nombre)}
                  className={`p-3 text-left rounded-xl border font-medium text-sm transition-all ${seleccionado ? 'border-[#E5738E] bg-rose-50 text-[#E5738E] ring-1 ring-[#E5738E]' : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'}`}
                >
                  {seleccionado ? '✅ ' : '➕ '} {d.nombre}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 🧸 NUEVA SECCIÓN 5: AGREGAR PELUCHE INTERACTIVO */}
        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-bold text-neutral-800">5. ¿Deseas incluir un peluche en el detalle?</label>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">Osos gigantes, personajes de películas, animalitos...</p>
            </div>
            
            {/* Botón tipo Switch / Toggle */}
            <button
              type="button"
              onClick={() => {
                setIncluyePeluche(!incluyePeluche);
                if (incluyePeluche) setDescripcionPeluche(''); // Borra el texto si decide apagarlo
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 shrink-0 ${incluyePeluche ? 'bg-[#E5738E]' : 'bg-neutral-300'}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-all duration-300 ${incluyePeluche ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Caja de texto que aparece con una suave transición si el cliente dice que SÍ */}
          <AnimatePresence initial={false}>
            {incluyePeluche && (
              <motion.div 
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  Escribe qué tipo de peluche te gustaría o su descripción:
                </label>
                <textarea
                  rows="2"
                  value={descripcionPeluche}
                  onChange={(e) => setDescripcionPeluche(e.target.value)}
                  placeholder="Ej: Un Stitch mediano de felpa azul, o un oso de felpa gigante color café con moño..."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#E5738E] focus:border-[#E5738E] outline-none text-neutral-800 text-sm resize-none transition-all bg-white"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 6. CUADRO DE TEXTO LIBRE */}
        <div>
          <label className="block text-sm font-bold text-neutral-800 mb-2">6. ¿Prefieres diseñar otra cosa o añadir detalles extra? Escríbelo aquí:</label>
          <textarea
            rows="4"
            placeholder="Ej: Quiero que los colores de los globos sean dorados y negros, y que la tarjeta diga: ¡Feliz Mesiversario!..."
            value={descripcionLibre}
            onChange={(e) => setDescripcionLibre(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-[#E5738E] focus:border-[#E5738E] outline-none text-neutral-800 resize-none transition-all"
          />
        </div>

        {/* BOTÓN DE ENVÍO */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          className="w-full bg-gradient-to-r from-[#E5738E] to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"
        >
          🚀 Enviar Pedido Personalizado a WhatsApp
        </motion.button>
      </form>
    </div>
  );
}