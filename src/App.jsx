import React, { useState, useEffect, useMemo } from "react";
import { ShoppingBag, Heart, Trash2, X, MessageCircle, ArrowLeft, CheckCircle, Sparkles, Calendar, Mail, User, DollarSign, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomOrder from './components/CustomOrder'; 
import AvisoInformativo from "./components/AvisoInformativo";
import { supabase } from "./lib/supabase";
import AdminPanel from "./components/AdminPanel"; 
import BannerCarousel from "./components/BannerCarousel";
import CategoriesSection from "./components/CategoriesSection";
import TemplatesSection from "./components/TemplatesSection";
import { CATEGORIAS, PRODUCTOS_MOCK, PLANTILLAS_MOCK, PROMOS_MOCK } from "./data/products";

// 🎈 CONFIGURACIÓN DE PARTÍCULAS FLOTANTES DE FONDO
const PARTICULAS_DECORATIVAS = Array.from({ length: 18 }).map((_, i) => ({
  id: i,
  left: `${(i * 7) % 95 + 3}%`, 
  size: (i % 3) === 0 ? 12 : (i % 3 === 1 ? 18 : 24),
  delay: (i * 0.7) % 8,
  duration: 12 + (i * 1.5) % 15,
  type: (i % 3) === 0 ? 'heart' : ((i % 3) === 1 ? 'sparkle' : 'dot'),
}));

export default function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartAnimating, setCartAnimating] = useState(false); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTabImage, setActiveTabImage] = useState("");
  const [seccionActual, setSeccionActual] = useState('catalogo');
  const [seccionVisual, setSeccionVisual] = useState('catalogo'); 
  const [isChangingTab, setIsChangingTab] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState([]);
  const [esAdminView, setEsAdminView] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [plantillas, setPlantillas] = useState([]);


  // 2. Esta función ahora recargará TODO al mismo tiempo
  const refrescarTodoDesdeBD = async () => {
    try {
      setCargando(true);
      
      // Consultar productos físicos
      const { data: prodData, error: prodError } = await supabase
        .from("productos")
        .select("*")
        .order("id", { ascending: false });
      if (prodError) throw prodError;
      if (prodData) setProductos(prodData);

      // Consultar plantillas digitales
      const { data: planData, error: planError } = await supabase
        .from("plantillas")
        .select("*")
        .order("id", { ascending: false });
      if (planError) throw planError;
      if (planData) setPlantillas(planData);

    } catch (err) {
      console.error("Error sincronizando bases de datos:", err.message);
    } finally {
      setCargando(false);
    }
  };

  // 2. EL EFECTO PARA CONECTAR A SUPABASE (carga productos y plantillas)
  useEffect(() => {
    refrescarTodoDesdeBD();
  }, []);

  // Estados para el huevo de pascua (3 clics abren el admin)
  const [clickCount, setClickCount] = useState(0);
  const [lastClick, setLastClick] = useState(0);

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClick < 1000) {
      const currentCount = clickCount + 1;
      if (currentCount >= 3) {
        setEsAdminView(true);
        setClickCount(0);
      } else {
        setClickCount(currentCount);
      }
    } else {
      setClickCount(1);
    }
    setLastClick(now);

    // Navegar de regreso a la tienda
    setSelectedProduct(null);
    setActiveCategory(null);
    cambiarPestana('catalogo');
  };

  // Unifica PRODUCTOS_MOCK con lo editado o agregado en Supabase (Memoizado para mayor fluidez)
  const productosCombinados = useMemo(() => {
    const finalProductos = [];
    const mergedDbIds = new Set();
    const mergedDbNombres = new Set();

    // Primero procesamos los mocks, sobreescribiéndolos con su versión de la base de datos si existe
    PRODUCTOS_MOCK.forEach((mockItem) => {
      const dbMatch = productos.find(
        (p) => (p.id === mockItem.id) || (p.nombre === mockItem.name || p.name === mockItem.name)
      );
      if (dbMatch) {
        mergedDbIds.add(dbMatch.id);
        if (dbMatch.nombre) mergedDbNombres.add(dbMatch.nombre.trim().toLowerCase());
        if (dbMatch.name) mergedDbNombres.add(dbMatch.name.trim().toLowerCase());

        finalProductos.push({
          ...mockItem,
          id: dbMatch.id, // ID de Supabase
          name: dbMatch.nombre || dbMatch.name || mockItem.name,
          price: dbMatch.precio !== undefined ? dbMatch.precio : (dbMatch.price !== undefined ? dbMatch.price : mockItem.price),
          image: dbMatch.imagen || dbMatch.image || mockItem.image,
          category: dbMatch.categoria || dbMatch.category || mockItem.category,
          // Mantenemos o sobreescribimos la descripción, tags y specs si están en DB
          description: dbMatch.descripcion || dbMatch.description || mockItem.description,
          tags: dbMatch.formatos || dbMatch.tags || mockItem.tags || "",
          specs: dbMatch.specs || mockItem.specs,
          images: dbMatch.images || [dbMatch.imagen || dbMatch.image || mockItem.image]
        });
      } else {
        finalProductos.push(mockItem);
      }
    });

    // Luego añadimos los productos de la base de datos que son totalmente nuevos
    productos.forEach((dbItem) => {
      const dbId = dbItem.id;
      const dbNombre = (dbItem.nombre || dbItem.name || "").trim().toLowerCase();

      const yaProcesado = mergedDbIds.has(dbId) || mergedDbNombres.has(dbNombre);

      if (!yaProcesado) {
        finalProductos.push({
          id: dbItem.id,
          name: dbItem.nombre || dbItem.name,
          price: dbItem.precio !== undefined ? dbItem.precio : (dbItem.price !== undefined ? dbItem.price : 0),
          image: dbItem.imagen || dbItem.image || "https://placehold.co/400x300?text=Crave+Details",
          category: dbItem.categoria || dbItem.category || "Otros",
          tags: dbItem.formatos || dbItem.tags || "#nuevo",
          description: dbItem.descripcion || dbItem.description || "Nuevo detalle premium en nuestro catálogo.",
          specs: dbItem.specs || ["Detalle hecho a mano", "Diseño personalizado"],
          images: dbItem.images || [dbItem.imagen || dbItem.image || "https://placehold.co/400x300?text=Crave+Details"]
        });
      }
    });

    return finalProductos;
  }, [productos]);


  // 3. LA VALIDACIÓN DE CARGA (Ponlo justo antes del "return (")
  

  // Estados para métodos de pago
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [activePaymentTab, setActivePaymentTab] = useState("transfer");

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => {
      setCopiedText("");
    }, 2000);
  };

  // Estados para el formulario de Eventos / Contacto
  const [contactoNombre, setContactoNombre] = useState('');
  const [contactoEvento, setContactoEvento] = useState('Aniversario');
  const [contactoFecha, setContactoFecha] = useState('');
  const [contactoPresupuesto, setContactoPresupuesto] = useState('');
  const [contactoDetalles, setContactoDetalles] = useState('');

  // Cambiar pestañas de manera fluida con timeout
  const cambiarPestana = (targetTab) => {
    if (targetTab === seccionActual) return;
    setIsChangingTab(true);
    setTimeout(() => {
      setSeccionActual(targetTab);
      setSeccionVisual(targetTab);
      setIsChangingTab(false);
    }, 200); 
  };

  // Carrito con estados de transición
  const openCart = () => {
    setCartOpen(true);
  };

  const closeCart = () => {
    setCartOpen(false);
  };

  const addToCart = (producto) => {
    setCart((prevCart) => {
      const existe = prevCart.find((item) => item.id === producto.id);
      if (existe) {
        return prevCart.map((item) =>
          item.id === producto.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...producto, quantity: 1 }];
    });
    openCart();
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateCartQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const getCartTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const getCartCount = () => cart.reduce((count, item) => count + item.quantity, 0);

  const handleCheckout = () => {
    const listaRegalos = cart.map(item => `• ${item.name} (Cant: ${item.quantity}) -> $${(item.price * item.quantity).toLocaleString('es-CO')}`).join('\n');
    const mensaje = encodeURIComponent(
      `¡Hola Crave Details! 🌸\n\nMe gustaría encargar el siguiente pedido para Cúcuta:\n\n${listaRegalos}\n\n• *Total Estimado:* $${getCartTotal().toLocaleString('es-CO')}`
    );
    window.open(`https://wa.me/573023399168?text=${mensaje}`, '_blank');
  };

  const handleOrdenarPlantilla = (plantilla) => {
    const mensaje = encodeURIComponent(
      `¡Hola Crave Details! 📐✨\n\nEstoy interesado en adquirir la siguiente plantilla digital para mi negocio:\n\n• *Plantilla:* ${plantilla.name}\n• *Formatos:* ${plantilla.format}\n• *Inversión:* $${plantilla.price.toLocaleString('es-CO')} COP\n\nQuedo atento(a) para realizar el pago correspondiente y recibir los archivos.`
    );
    window.open(`https://wa.me/573023399168?text=${mensaje}`, '_blank');
  };

  const handleContactoWhatsApp = (e) => {
    e.preventDefault();
    const mensaje = encodeURIComponent(
      `¡Hola Crave Details! 🌟\n\nMe gustaría cotizar un evento/decoración en Cúcuta:\n\n• *Nombre:* ${contactoNombre || 'No especificado'}\n• *Tipo de Evento:* ${contactoEvento}\n• *Fecha Tentativa:* ${contactoFecha || 'Por definir'}\n• *Presupuesto Estimado:* ${contactoPresupuesto || 'No especificado'}\n• *Detalles:* ${contactoDetalles}`
    );
    window.open(`https://wa.me/573023399168?text=${mensaje}`, '_blank');
  };

  const handleContactoEmail = () => {
  const asunto = encodeURIComponent(`🌸 SOLICITUD DE COTIZACIÓN: Evento / Decoración - ${contactoEvento}`);
  
  // Estructuramos el texto con un diseño limpio y profesional
  const cuerpo = encodeURIComponent(
    `¡Hola Crave Details!\n\n` +
    `Me gustaría solicitar una cotización formal para el diseño y decoración de un evento en Cúcuta. A continuación, comparto los detalles de mi idea:\n\n` +
    `=========================================\n` +
    `   📋 DATOS DE LA SOLICITUD\n` +
    `=========================================\n\n` +
    `• Nombre del Cliente: ${contactoNombre || 'No especificado'}\n` +
    `• Tipo de Evento: ${contactoEvento}\n` +
    `• Fecha Tentativa: ${contactoFecha || 'Por definir'}\n` +
    `• Presupuesto Estimado: $${contactoPresupuesto || 'Por definir'} COP\n\n` +
    `=========================================\n` +
    `   ✨ DETALLES DE LA IDEA / TEMÁTICA\n` +
    `=========================================\n\n` +
    `${contactoDetalles || 'Sin detalles adicionales.'}\n\n` +
    `-----------------------------------------\n` +
    `Quedo atento(a) a su respuesta, disponibilidad de agenda y propuesta económica.\n\n` +
    `¡Muchas gracias!`
  );
  
  window.open(`mailto:cravedetails@gmail.com?subject=${asunto}&body=${cuerpo}`);
};

  const verEspecificaciones = (producto) => {
    setSelectedProduct(producto);
    setActiveTabImage(producto.images[0]);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  // Filtrado memoizado para máxima fluidez al escribir en la barra de búsqueda
  const productosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();
    if (!texto && !activeCategory) return productosCombinados;

    return productosCombinados.filter((producto) => {
      const coincideCategoria = !activeCategory || producto.category === activeCategory || producto.categoria === activeCategory;
      if (!coincideCategoria) return false;

      if (!texto) return true;
      const nombreItem = producto.name || producto.nombre || "";
      const descItem = producto.description || producto.descripcion || "";
      const tagsItem = producto.tags || "";

      return (
        nombreItem.toLowerCase().includes(texto) ||
        descItem.toLowerCase().includes(texto) ||
        tagsItem.toLowerCase().includes(texto)
      );
    });
  }, [productosCombinados, activeCategory, busqueda]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-pink-50/20 flex flex-col items-center justify-center font-sans">
        <span className="text-4xl animate-bounce">🌸</span>
        <p className="text-pink-600 font-black uppercase tracking-widest text-xs mt-4 animate-pulse">
          Cargando detalles hermosos...
        </p>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-pink-50/20 relative overflow-x-hidden font-sans select-none">
      
      {/* FONDO ANIMADO DE PARTÍCULAS Y LUCES AMBIENTALES DE ALTO IMPACTO */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-tr from-[#FFF5F5] via-[#FFFDF5] to-[#FFFAFA]">
        
        {/* Esfera de Luz 1 (Rosa Romántico) */}
        <motion.div 
          className="absolute rounded-full bg-[#FFCAD4] opacity-[0.35] blur-[100px] md:blur-[140px] w-[350px] h-[350px] md:w-[650px] md:h-[650px]"
          animate={{
            x: [-80, 120, -40],
            y: [-120, 80, -40],
            scale: [1, 1.15, 0.9]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '5%', left: '10%', willChange: 'transform' }}
        />

        {/* Esfera de Luz 2 (Durazno Dulce) */}
        <motion.div 
          className="absolute rounded-full bg-[#FFE5D9] opacity-[0.32] blur-[110px] md:blur-[150px] w-[300px] h-[300px] md:w-[550px] md:h-[550px]"
          animate={{
            x: [80, -100, 40],
            y: [40, -80, 120],
            scale: [0.95, 1.1, 1]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '40%', right: '5%', willChange: 'transform' }}
        />

        {/* Esfera de Luz 3 (Crema Suave) */}
        <motion.div 
          className="absolute rounded-full bg-[#FAF0D7] opacity-[0.28] blur-[90px] md:blur-[130px] w-[250px] h-[250px] md:w-[450px] md:h-[450px]"
          animate={{
            x: [-40, 60, -20],
            y: [100, -40, 40],
            scale: [1, 0.85, 1.05]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ bottom: '10%', left: '30%', willChange: 'transform' }}
        />

        {/* Partículas Flotantes Decorativas */}
        {PARTICULAS_DECORATIVAS.map((p) => {
          return (
            <motion.div
              key={p.id}
              className="absolute bottom-[-50px]"
              style={{ left: p.left, willChange: 'transform' }}
              initial={{ y: 0, opacity: 0, scale: 0.8 }}
              animate={{ 
                y: "-115vh", 
                opacity: [0, 0.25, 0.25, 0], 
                scale: [0.8, 1.1, 1.1, 0.8],
                x: [0, (p.id % 2 === 0 ? 40 : -40), 0]
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "linear"
              }}
            >
              {p.type === 'heart' && <Heart size={p.size} className="text-[#E5738E]" fill="#E5738E" />}
              {p.type === 'sparkle' && <Sparkles size={p.size} className="text-[#9E1B41]" />}
              {p.type === 'dot' && <div style={{ width: p.size, height: p.size }} className="rounded-full bg-[#E5738E]" />}
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        {/* ANIMACIONES CSS AGREGADAS DIRECTAMENTE */}
      <style>{`
        .tab-view {
          transition: opacity 200ms ease-in-out, transform 200ms ease-in-out;
        }
        .tab-active { opacity: 1; transform: translateY(0px); }
        .tab-hidden { opacity: 0; transform: translateY(8px); }
        
        .fade-bg-enter { animation: fadeInBg 250ms forwards ease-out; }
        .fade-bg-exit { animation: fadeOutBg 250ms forwards ease-in; }
        .slide-cart-enter { animation: slideInC 250ms forwards cubic-bezier(0.16, 1, 0.3, 1); }
        .slide-cart-exit { animation: slideOutC 250ms forwards cubic-bezier(0.16, 1, 0.3, 1); }
        
        @keyframes fadeInBg { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOutBg { from { opacity: 1; } to { opacity: 0; } }
        @keyframes slideInC { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes slideOutC { from { transform: translateX(0); } to { transform: translateX(100%); } }
      `}</style>

      {esAdminView ? (
        <AdminPanel 
          setEsAdminView={setEsAdminView} 
          onProductoCambiado={refrescarTodoDesdeBD} 
          PRODUCTOS_MOCK={PRODUCTOS_MOCK}
          PLANTILLAS_MOCK={PLANTILLAS_MOCK}
        />
      ) : (
        <>
          {/* HEADER / NAVBAR CON GLASSMORPHISM PEGADO */}
          <header className="w-full sticky top-0 z-50 bg-[#FDFCF0]/80 backdrop-blur-md px-6 py-4 md:px-16 border-b border-rose-100/20 shadow-[0_2px_20px_rgba(229,115,142,0.03)] transition-all">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      
      {/* LOGO CON HUEVO DE PASCUA (3 CLICS ABREN EL ADMIN) */}
      <div 
        className="flex items-center gap-2 cursor-pointer select-none" 
        onClick={handleLogoClick}
      >
        <span className="text-3xl font-bold tracking-tight text-[#9E1B41]" style={{ color: '#9E1B41', fontFamily: 'Playfair Display, serif' }}>
          Crave
        </span>
        <span className="bg-[#E71B4F] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest">
          Details
        </span>
      </div>

          <div className="flex items-center gap-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPaymentModalOpen(true)}
              className="bg-white border border-rose-100/50 hover:bg-rose-50/50 text-[#9E1B41] font-funny font-bold px-4 py-2 rounded-full text-xs tracking-wide flex items-center gap-1.5 transition-all shadow-xs"
            >
              💳 Métodos de Pago
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                scale: getCartCount() > 0 ? [1, 1.15, 1] : 1,
                rotate: getCartCount() > 0 ? [0, -3, 3, -3, 0] : 0
              }}
              key={getCartCount()}
              transition={{ duration: 0.4, type: "spring" }}
              onClick={openCart}
              className="bg-[#2C2627] hover:bg-neutral-800 text-white font-funny font-bold px-5 py-2 rounded-full text-sm tracking-wide flex items-center gap-2 transition-all shadow-xs"
            >
              Mi Pedido
              <span className="bg-[#E71B4F] text-white text-[11px] px-2 py-0.5 rounded-full font-sans font-black">
                {getCartCount()}
              </span>
            </motion.button>
          </div>
        </div>
      </header>
 
      {/* CINTA SATINADA */}
      <div className="w-full h-8 bg-[#E5738E] relative shadow-inner overflow-hidden flex items-center" />
 
      {/* BOTONES DE NAVEGACIÓN */}
      <div className="flex flex-wrap justify-center gap-3 my-8 px-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSeccionVisual('catalogo')}
          className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-200 shadow-sm ${seccionVisual === 'catalogo' ? 'bg-[#E5738E] text-white' : 'bg-white text-neutral-700 border border-neutral-200'}`}
        >
          🛍️ Ver Catálogo
        </motion.button>
 
        {/* 🚫 OCULTADO POR AHORA
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSeccionVisual('promos')}
          className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-200 shadow-sm ${seccionVisual === 'promos' ? 'bg-[#9E1B41] text-white animate-pulse' : 'bg-white text-neutral-700 border border-neutral-200'}`}
        >
          🔥 Promos Flash
        </motion.button>
        */}
 
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSeccionVisual('personalizado')}
          className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-200 shadow-sm ${seccionVisual === 'personalizado' ? 'bg-[#E5738E] text-white' : 'bg-white text-neutral-700 border border-neutral-200'}`}
        >
          🎁 Arma tu Detalle
        </motion.button>
 
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSeccionVisual('contacto')}
          className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-200 shadow-sm ${seccionVisual === 'contacto' ? 'bg-[#E5738E] text-white' : 'bg-white text-neutral-700 border border-neutral-200'}`}
        >
          ✨ Eventos & Decoración
        </motion.button>
 
        { 
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSeccionVisual('plantillas')}
          className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-200 shadow-sm ${seccionVisual === 'plantillas' ? 'bg-[#E5738E] text-white' : 'bg-white text-neutral-700 border border-neutral-200'}`}
        >
          📐 Plantillas & Recursos
        </motion.button>
        }
      </div>
 
      {/* 🔍 BARRA DE BÚSQUEDA AGREGADA */}
      <div className="max-w-md mx-auto mt-8 mb-4 px-4">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="🔍 ¿Qué regalo buscas? (Ej: Stitch, Hot Wheels, Vino...)"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full px-5 py-3 pl-12 rounded-full border border-gray-200 focus:border-[#E5738E] focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all shadow-xs text-neutral-800 placeholder-neutral-400 text-sm"
          />
          {busqueda && (
            <button 
              onClick={() => setBusqueda("")}
              className="absolute right-4 text-neutral-400 hover:text-neutral-600 font-bold text-xs"
            >
              ✕
            </button>
          )}
        </div>
        {busqueda && (
          <p className="text-[11px] text-neutral-400 mt-1.5 text-center font-funny">
            Resultados que coinciden con "{busqueda}"
          </p>
        )}
      </div>
       
      {/* CONTENEDOR CON TRANSICIÓN DE PESTAÑAS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={seccionVisual}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
        >
           
          {/* SECCIÓN 1: CATÁLOGO */}
          {seccionVisual === 'catalogo' && (
            <AnimatePresence mode="wait">
              {!selectedProduct ? (
                <motion.div
                  key="catalogo-listado"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
               <section className="text-center px-6 pt-16 pb-8 max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center text-[#9E1B41] font-funny font-bold text-sm mb-4 tracking-wide">
            Crave Details Cúcuta ✨
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-neutral-950 leading-[1.2] mb-4 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Hecho a mano con amor ✨<br />
            Detalles <span className="text-[#E71B4F]">únicos</span> para ocasiones <span className="text-[#E71B4F]">especiales</span>
          </h1>
        </section>
 
        <CategoriesSection onSelectSubcategoria={(sub) => {
          setBusqueda(sub);
          setActiveCategory(null);
          window.scrollTo({ top: 460, behavior: 'smooth' });
        }} />
        <BannerCarousel />

        {/* 🌸 Sección de Filtros */}
        <div className="w-full max-w-7xl mx-auto px-6 mb-12">
          <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
            <Sparkles size={16} className="text-[#E71B4F]" />
            <h3 className="font-funny font-bold text-sm text-neutral-500 uppercase tracking-widest">Explora por Sección</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(null)}
              className={`font-funny font-bold text-xs px-5 py-3 rounded-2xl whitespace-nowrap transition-all border snap-start ${!activeCategory ? 'bg-[#E71B4F] text-white border-transparent shadow-sm' : 'bg-white text-neutral-700 border-gray-100'}`}
            >
              🌸 Ver Todo
            </motion.button>
            {CATEGORIAS.map((cat, idx) => (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`font-funny font-bold text-xs px-5 py-3 rounded-2xl whitespace-nowrap transition-all border snap-start ${activeCategory === cat ? 'bg-[#E71B4F] text-white border-transparent shadow-sm' : 'bg-white text-neutral-700 border-gray-100'}`}
              >
                🎁 {cat}
              </motion.button>
            ))}
          </div>
        </div>

        {/* 📦 Catálogo Principal de Regalos Físicos */}
        <main className="max-w-7xl mx-auto px-6 pb-24">
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-2 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              {activeCategory ? `Sección: ${activeCategory}` : "Todos los Detalles"}
            </h2>
            <span className="text-xs text-gray-400 font-funny font-bold">Mostrando {productosFiltrados.length} regalos</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {productosFiltrados.map((producto) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -6, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  key={producto.id} 
                  className="bg-white/70 backdrop-blur-sm rounded-[32px] overflow-hidden border border-white/60 shadow-[0_8px_30px_rgba(231,27,79,0.02)] flex flex-col justify-between p-3 group hover:shadow-[0_20px_50px_rgba(231,27,79,0.06)] hover:bg-white/85 transition-all duration-300"
                >
                  <div className="cursor-pointer" onClick={() => verEspecificaciones(producto)}>
                    <div className="h-[240px] rounded-2xl overflow-hidden bg-neutral-50 mb-4 relative">
                      <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs font-funny text-[10px] font-bold px-2 py-0.5 rounded-lg text-[#9E1B41]">
                        {producto.category}
                      </span>
                      <img src={producto.image} alt={producto.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="px-1">
                      <h3 className="text-base font-bold text-neutral-900 mb-0.5 tracking-tight group-hover:text-[#E71B4F] transition-colors">{producto.name}</h3>
                      <span className="text-[12px] text-gray-400 font-funny block mb-3">{producto.tags}</span>
                    </div>
                  </div>

                  <div className="px-1 pb-1 flex items-center justify-between">
                    <span className="text-lg font-funny font-bold text-neutral-900">${producto.price.toLocaleString('es-CO')}</span>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addToCart(producto)} 
                      className="bg-[#E71B4F] text-white p-2.5 rounded-xl hover:bg-[#d01443] transition-all"
                    >
                      <Heart size={16} fill="white" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </main>

      </motion.div>
    ) : (
              /* PRODUCTO AL DETALLE */
              <motion.div
                key={`product-detail-${selectedProduct.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="max-w-5xl mx-auto px-6 py-12"
              >
                <button onClick={() => setSelectedProduct(null)} className="inline-flex items-center gap-2 text-sm font-funny font-bold text-neutral-600 hover:text-[#E71B4F] mb-8 bg-white px-4 py-2 rounded-full border border-gray-100">
                  <ArrowLeft size={16} /> Volver al Catálogo principal
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
                  <div>
                    <div className="h-[380px] md:h-[450px] rounded-2xl overflow-hidden bg-neutral-50 mb-4">
                      <img src={activeTabImage} alt={selectedProduct.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedProduct.images.map((imgUrl, index) => (
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          key={index} 
                          onClick={() => setActiveTabImage(imgUrl)} 
                          className={`h-20 rounded-xl overflow-hidden border-2 bg-neutral-50 ${activeTabImage === imgUrl ? 'border-[#E71B4F]' : 'border-transparent opacity-70'}`}
                        >
                          <img src={imgUrl} alt="Miniatura" className="w-full h-full object-cover" />
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <span className="text-[12px] bg-rose-50 text-[#E71B4F] font-funny font-bold px-3 py-1 rounded-full uppercase mb-3 inline-block">Sección: {selectedProduct.category}</span>
                      <h2 className="text-3xl font-black text-neutral-950 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>{selectedProduct.name}</h2>
                      <div className="text-2xl font-funny font-bold text-[#E71B4F] mb-6">${selectedProduct.price.toLocaleString('es-CO')} COP</div>
                      <div className="border-t border-gray-100 pt-4 mb-6">
                        <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Descripción:</h4>
                        <p className="text-sm text-neutral-600 leading-relaxed font-medium">{selectedProduct.description}</p>
                      </div>
                      <div className="mb-6">
                        <h4 className="text-xs font-bold uppercase text-gray-400 mb-3">¿Qué incluye este detalle?</h4>
                        <ul className="space-y-2.5">
                          {selectedProduct.specs.map((spec, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-neutral-700">
                              <CheckCircle size={16} className="text-[#E71B4F] mt-0.5 shrink-0" />
                              <span>{spec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addToCart(selectedProduct)} 
                      className="w-full bg-[#E71B4F] text-white font-funny font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <ShoppingBag size={18} /> Añadir al Carrito
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* SECCIÓN 2: ARMA TU DETALLE */}
        {seccionVisual === 'personalizado' && <CustomOrder />}

        {/* SECCIÓN 3: EVENTOS */}
        {seccionVisual === 'contacto' && (
          <main className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center mb-10">
              <span className="text-[#E71B4F] font-funny font-bold text-sm uppercase tracking-wider block mb-2">Planes Especiales</span>
              <h2 className="text-3xl md:text-5xl font-black text-neutral-900" style={{ fontFamily: 'Playfair Display, serif' }}>Eventos y Decoraciones Premium</h2>
              <p className="text-neutral-500 max-w-lg mx-auto mt-3 text-sm font-medium">¿Tienes un cumpleaños, propuesta de matrimonio o evento empresarial en Cúcuta? Compátenos los detalles y crearemos un escenario inolvidable.</p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-10 shadow-sm">
              <form onSubmit={handleContactoWhatsApp} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase text-neutral-500 mb-2 flex items-center gap-1.5"><User size={14} className="text-[#E71B4F]" /> Tu Nombre</label>
                    <input type="text" required placeholder="Ej. María Paulina" value={contactoNombre} onChange={(e) => setContactoNombre(e.target.value)} className="w-full bg-[#FDFCF0]/50 border rounded-2xl px-4 py-3.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-neutral-500 mb-2 flex items-center gap-1.5"><Sparkles size={14} className="text-[#E71B4F]" /> Tipo de Decoración</label>
                    <select value={contactoEvento} onChange={(e) => setContactoEvento(e.target.value)} className="w-full bg-[#FDFCF0]/50 border rounded-2xl px-4 py-3.5 text-sm">
                      <option value="Aniversario">Aniversario Romántico</option>
                      <option value="Cumpleaños Temático">Cumpleaños Temático</option>
                      <option value="Propuesta de Matrimonio">Propuesta de Matrimonio</option>
                      <option value="Baby Shower / Gender Reveal">Baby Shower / Gender Reveal</option>
                      <option value="Evento Corporativo">Evento Corporativo</option>
                      <option value="Arreglo Monumental">Arreglo Monumental a Domicilio</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase text-neutral-500 mb-2 flex items-center gap-1.5"><Calendar size={14} className="text-[#E71B4F]" /> Fecha Estimada</label>
                    <input type="date" required value={contactoFecha} onChange={(e) => setContactoFecha(e.target.value)} className="w-full bg-[#FDFCF0]/50 border rounded-2xl px-4 py-3.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-neutral-500 mb-2 flex items-center gap-1.5"><DollarSign size={14} className="text-[#E71B4F]" /> Presupuesto Estimado (COP)</label>
                    <input type="text" placeholder="Ej. $300,000" value={contactoPresupuesto} onChange={(e) => setContactoPresupuesto(e.target.value)} className="w-full bg-[#FDFCF0]/50 border rounded-2xl px-4 py-3.5 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-neutral-500 mb-2 flex items-center gap-1.5"><FileText size={14} className="text-[#E71B4F]" /> Cuéntanos los detalles de tu idea</label>
                  <textarea rows="4" required placeholder="Describe colores, globos, si necesitas flores, catering o locación específica..." value={contactoDetalles} onChange={(e) => setContactoDetalles(e.target.value)} className="w-full bg-[#FDFCF0]/50 border rounded-2xl px-4 py-3.5 text-sm resize-none" />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button type="submit" className="flex-1 bg-[#25D366] text-white font-funny font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#20ba56] transition-all">
                    <MessageCircle size={18} fill="white" /> Enviar Consulta a WhatsApp
                  </button>
                  <button type="button" onClick={handleContactoEmail} className="flex-1 bg-neutral-900 text-white font-funny font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all">
                    <Mail size={18} /> Enviar por Correo Electrónico
                  </button>
                </div>
              </form>
            </div>
          </main>
        )}

      {seccionVisual === 'plantillas' && (
        <TemplatesSection onOrdenarPlantilla={handleOrdenarPlantilla} />
      )}

      {/* =========================================================
          ⚡ SECCIÓN 5: PROMOS FLASH (TOTALMENTE INDEPENDIENTE)
         ========================================================= */}
      {seccionVisual === 'promos' && (
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <span className="bg-[#9E1B41] text-white font-funny font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full inline-block mb-3 animate-bounce">
              ⚡ ¡Entrega Inmediata Cúcuta! ⚡
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-neutral-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Promociones Flash de la Semana
            </h2>
            <p className="text-neutral-500 max-w-xl mx-auto mt-3 text-sm font-medium">
              Detalles exclusivos listos para salir de nuestra tienda hoy mismo. Precios especiales por tiempo limitado o hasta agotar existencias.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROMOS_MOCK.map((promo) => {
              const ahorro = Math.round(((promo.priceOriginal - promo.pricePromo) / promo.priceOriginal) * 100);
              
              const pedirPromoWhatsApp = () => {
                const mensaje = encodeURIComponent(
                  `¡Hola Crave Details! ⚡🌸\n\nEstoy interesado(a) en adquirir la *PROMO DE ENTREGA INMEDIATA*:\n\n• *Detalle:* ${promo.name}\n• *Precio Promo:* $${promo.pricePromo.toLocaleString('es-CO')} COP\n\n¿Sigue disponible para envío inmediato en Cúcuta?`
                );
                window.open(`https://wa.me/573023399168?text=${mensaje}`, '_blank');
              };

              return (
                <div key={promo.id} className="bg-white rounded-3xl overflow-hidden border border-red-100 shadow-xs p-3 flex flex-col justify-between hover:shadow-md transition-all duration-300 relative text-left">
                  <div className="absolute top-5 right-5 z-10 bg-[#E71B4F] text-white text-xs font-black px-3 py-1 rounded-full shadow-sm">
                    -{ahorro}% OFF
                  </div>

                  <div>
                    <div className="h-[260px] rounded-2xl overflow-hidden bg-neutral-100 mb-4">
                      <img src={promo.image} alt={promo.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="px-1">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[11px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                          ⏳ {promo.stock}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-neutral-900 tracking-tight mb-1">{promo.name}</h3>
                      <p className="text-xs text-neutral-500 font-medium leading-relaxed mb-4">{promo.description}</p>
                    </div>
                  </div>

                  <div className="px-1 pt-3 border-t border-gray-50 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs text-gray-400 line-through block font-medium">
                        ${promo.priceOriginal.toLocaleString('es-CO')}
                      </span>
                      <span className="text-xl font-funny font-black text-[#E71B4F]">
                        ${promo.pricePromo.toLocaleString('es-CO')} <span className="text-[10px] text-gray-400 font-normal">COP</span>
                      </span>
                    </div>
                    
                    <button 
                      onClick={pedirPromoWhatsApp}
                      className="bg-[#25D366] hover:bg-[#1ebd59] text-white text-xs font-funny font-bold px-4 py-3 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
                    >
                      ⚡ Lo quiero ya
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

        </motion.div>
      </AnimatePresence>

      {/* CARRITO LATERAL INTERACTIVO */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs" 
              onClick={closeCart} 
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-md bg-white/85 backdrop-blur-lg h-full shadow-2xl flex flex-col justify-between z-10 border-l border-white/30"
            >
              <div className="p-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <h3 className="text-lg font-bold text-neutral-900" style={{ fontFamily: 'Playfair Display, serif' }}>Mis Regalos Seleccionados</h3>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={closeCart} className="text-gray-400 hover:text-gray-600"><X size={20} /></motion.button>
                </div>
                <div className="space-y-4 overflow-y-auto pr-1" style={{ maxHeight: 'calc(100vh - 260px)' }}>
                  <AnimatePresence initial={false}>
                    {cart.length === 0 ? (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm text-neutral-400 text-center py-6 font-funny"
                      >
                        No has añadido productos aún.
                      </motion.p>
                    ) : (
                      cart.map((item) => (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 300, damping: 28 }}
                          key={item.id} 
                          className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-white/40 shadow-xs hover:bg-white/60 hover:shadow-sm transition-all gap-3 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-rose-100/50">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-bold text-sm text-neutral-800 leading-snug">{item.name}</p>
                              <span className="text-[10px] font-funny font-black text-[#E71B4F] block">
                                ${(item.price).toLocaleString('es-CO')} c/u
                              </span>
                              
                              {/* Control de Cantidad */}
                              <div className="flex items-center gap-2 mt-1 bg-white/80 rounded-lg p-0.5 border border-rose-100/30 w-fit">
                                <button 
                                  type="button"
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                  className="w-5 h-5 rounded-md bg-rose-50/50 hover:bg-rose-100 text-[#9E1B41] font-extrabold flex items-center justify-center text-xs transition-colors"
                                >
                                  -
                                </button>
                                <span className="text-xs font-funny font-bold text-neutral-700 min-w-4 text-center select-none">{item.quantity}</span>
                                <button 
                                  type="button"
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                  className="w-5 h-5 rounded-md bg-rose-50/50 hover:bg-[#E71B4F] hover:text-white text-neutral-700 font-extrabold flex items-center justify-center text-xs transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end justify-between min-h-[60px] py-1 shrink-0">
                            <motion.button 
                              whileHover={{ scale: 1.15 }} 
                              whileTap={{ scale: 0.85 }} 
                              onClick={() => removeFromCart(item.id)} 
                              className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                            <span className="text-sm font-funny font-black text-neutral-800">
                              ${(item.price * item.quantity).toLocaleString('es-CO')}
                            </span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              {cart.length > 0 && (
                <div className="p-6 border-t border-white/40 bg-[#FFFDF5]/40 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-neutral-600">Total:</span>
                    <span className="text-2xl font-bold text-[#E71B4F]">${getCartTotal().toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex flex-col gap-2 pt-1">
                    <button 
                      onClick={() => setPaymentModalOpen(true)}
                      className="text-xs text-[#9E1B41] hover:text-[#E71B4F] font-bold text-center underline"
                    >
                      💳 Ver Cuentas y Códigos QR de Pago
                    </button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout} 
                      className="w-full bg-[#25D366] text-white py-4 rounded-xl font-funny font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#20ba56] transition-all"
                    >
                      <MessageCircle size={18} fill="white" /> Enviar Pedido por WhatsApp
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL MÉTODOS DE PAGO */}
      <AnimatePresence>
        {paymentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setPaymentModalOpen(false)}
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-neutral-100 z-10 p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  <span>💳 Métodos de Pago</span>
                </h3>
                <motion.button 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.9 }} 
                  onClick={() => setPaymentModalOpen(false)} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Tabs */}
              <div className="flex bg-neutral-100 rounded-xl p-1 mb-6">
                <button
                  type="button"
                  onClick={() => setActivePaymentTab("transfer")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activePaymentTab === 'transfer' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'}`}
                >
                  Transferencia
                </button>
                <button
                  type="button"
                  onClick={() => setActivePaymentTab("qr")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activePaymentTab === 'qr' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'}`}
                >
                  Código QR
                </button>
              </div>

              {/* Tab Content */}
              <div className="min-h-[220px] flex flex-col justify-between">
                {activePaymentTab === "transfer" ? (
                  <div className="space-y-4 text-left">
                    {/* Nequi */}
                    <div className="bg-[#E5738E]/5 border border-[#E5738E]/10 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#E5738E] uppercase tracking-wider block">Celular Nequi</span>
                        <span className="text-lg font-black text-neutral-900 font-funny">302 339 9168</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCopy("3023399168", "nequi")}
                        className="bg-[#E5738E] hover:bg-[#d85c79] text-white text-xs font-bold px-3 py-2 rounded-xl transition-all"
                      >
                        {copiedText === 'nequi' ? '¡Copiado! ✓' : 'Copiar Celular'}
                      </motion.button>
                    </div>

                    {/* Bancolombia */}
                    <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Bancolombia (Ahorros)</span>
                        <span className="text-lg font-black text-neutral-900 font-funny">912-662699-31</span>
                        <p className="text-[10px] text-gray-400">Titular: Camilo Garcia</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCopy("91266269931", "bancolombia")}
                        className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all"
                      >
                        {copiedText === 'bancolombia' ? '¡Copiado! ✓' : 'Copiar Cuenta'}
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-2 text-center">
                    <p className="text-xs text-neutral-500 mb-4 max-w-[280px]">Escanea este código QR desde tu celular para transferir o chatear con soporte:</p>
                    <div className="w-[160px] h-[160px] bg-neutral-50 border rounded-2xl flex items-center justify-center p-2 mb-2">
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wa.me/573023399168" 
                        alt="QR Pago Crave Details" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">QR generado para Crave Details Cúcuta</span>
                  </div>
                )}

                {/* PDF Link & Notice */}
                <div className="pt-4 border-t border-gray-100 mt-6 flex flex-col gap-2.5">
                  <p className="text-[10px] text-center text-gray-400 leading-normal">
                    ⚠️ Después de realizar tu pago, por favor envía el comprobante de transferencia a nuestro WhatsApp para procesar tu pedido.
                  </p>
                  
                  {/* PDF Download Button */}
                  <a 
                    href="/Metodos_de_Pago_Crave.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all text-center"
                  >
                    <Download size={14} /> Descargar PDF de cuentas completo
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="bg-neutral-900 text-white py-8 mt-12 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <h3 className="font-bold text-lg text-pink-400">Crave Details</h3>
            <p className="text-neutral-400 text-sm mt-1">📍 Cúcuta, Norte de Santander, Colombia</p>
            <p className="text-neutral-500 text-xs mt-0.5">
              Hecho con amor • Detalles Premium & Recursos Digitales •{' '}
              <button 
                type="button" 
                onClick={() => setEsAdminView(true)} 
                className="text-neutral-600 hover:text-pink-400 transition-colors text-[10px] underline ml-1 focus:outline-none"
              >
                Acceso Admin
              </button>
            </p>
          </div>
          <div>
            <a href="https://www.instagram.com/crave.details?igsh=ZWJ5dDRmb3o0aHo=" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium px-4 py-2 rounded-full shadow-md">
              Síguenos en Instagram
            </a>
          </div>
        </div>
      </footer>

       <AvisoInformativo />
        </>
      )}

      </div>
    </div>
  );
}