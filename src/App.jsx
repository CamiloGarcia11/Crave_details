import React, { useState } from 'react';
import { ShoppingBag, Heart, Trash2, X, MessageCircle, ArrowLeft, CheckCircle, Sparkles, Calendar, Mail, User, DollarSign, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomOrder from './components/CustomOrder'; 

// LISTADO DE LAS 12 SECCIONES / CATEGORÍAS
const CATEGORIAS = [
  "Ramos Decorados",
  "Cajas Personalizadas",
  "Anchetas Dulces",
  "Detalles Empresariales",
  "Combos Especiales"
];

// LOS PRODUCTOS COMPLETOS CON TUS IMÁGENES LOCALES ASIGNADAS Y CAJAS INTEGRADAS
const PRODUCTOS_MOCK = [
 /* =========================================================
     🎁 SECCIÓN ADICIONAL: LAS 8 CAJAS INTEGRADAS AL CATÁLOGO
     ========================================================= */
  {
    id: 13,
    category: "Cajas Personalizadas",
    name: "Caja Marco Premium 'Tú Ganaste Mi Corazón'",
    tags: "#cajas #hotwheels #premium",
    price: 38000,
    image: "Regalos/Caja.jpeg", // 👈 Ruta corregida apuntando a la carpeta Regalos
    images: ["Regalos/Caja.jpeg"],
    description: "Caja de lujo con marco frontal blanco e impresión personalizada al fondo con temática Hot Wheels. Incluye carro a escala original Hot Wheels Premium, gomitas Frútica, chocolates y tarjeta personalizada con dedicatoria.",
    specs: ["Marco frontal de madera blanco", "Carro Hot Wheels Premium coleccionable", "Snacks dulces variados", "Diseño de fondo personalizado"]
  },
  {
    id: 14,
    category: "Cajas Personalizadas",
    name: "Caja Sorpresa 'Un Detalle Pensado en Ti'",
    tags: "#cajas #sorpresa #chicas",
    price: 45000,
    image: "Regalos/Caja2.jpeg", // 👈 Ruta corregida
    images: ["Regalos/Caja2.jpeg"],
    description: "Caja artesanal en Kraft con apertura superior. Viene equipada con un mini oso de felpa con moño, cepillo de cabello rosa, espejo compacto de mano, gancho de mariposa, pinza para el cabello, gomitas y un llavero sorpresa.",
    specs: ["Caja Kraft artesanal rígida", "Mini oso de felpa suave", "Set de belleza (espejo, cepillo, pinzas)", "Llavero sorpresa y gomitas"]
  },
  {
    id: 15,
    category: "Cajas Personalizadas",
    name: "Caja Sorpresa Hot Wheels 'Pista de Fuego'",
    tags: "#cajas #hotwheels #carreras",
    price: 52000,
    image: "Regalos/Caja3.jpeg", // 👈 Ruta corregida
    images: ["Regalos/Caja3.jpeg"],
    description: "Caja cuadrada decorada con diseño de pista de carreras en la tapa y lazo de cinta roja satinada. Interior con papel picado de protección, carro Hot Wheels en blister cerrado, tarjeta de felicitación y snacks seleccionados.",
    specs: ["Tapa decorada temática pistas", "Lazo de cinta satín roja", "Carro Hot Wheels original en blister", "Papel picado decorativo"]
  },
  {
    id: 16,
    category: "Cajas Personalizadas",
    name: "Combo Box Hot Wheels 'Mi Futbolista Favorito'",
    tags: "#cajas #futbol #hotwheels",
    price: 40000,
    image: "Regalos/Caja4.jpeg", // 👈 Ruta corregida
    images: ["Regalos/Caja4.jpeg"],
    description: "Edición especial futbolera con dedicatoria romántica en tarjeta temática. Trae carro Hot Wheels de colección, chocolates M&M grandes, papas Pringles y base de papel picado rojo de alta densidad.",
    specs: ["Tarjeta dedicatoria de fútbol", "Papas Pringles medianas", "Chocolates M&M grandes", "Carro coleccionable a escala"]
  },
  {
    id: 17,
    category: "Cajas Personalizadas",
    name: "Caja Box Corona & Wheels",
    tags: "#cajas #caballeros #corona",
    price: 40000,
    image: "Regalos/Caja5.jpeg", // 👈 Ruta corregida
    images: ["Regalos/Caja5.jpeg"],
    description: "El detalle perfecto que combina pasatiempos. Trae un carro de colección Hot Wheels en empaque original, una botella de cerveza Coronita Extra helada, chocolates Bon Bon Bum y tarjeta de metas inspiracional.",
    specs: ["Cerveza Coronita Extra de vidrio", "Carro Hot Wheels original", "Chocolates Bon Bon Bum", "Tarjeta motivacional de metas"]
  },
  {
    id: 18,
    category: "Cajas Personalizadas",
    name: "Lonchera Sorpresa 'Circus & Art'",
    tags: "#cajas #niños #circo #arte",
    price: 42000,
    image: "Regalos/Caja6.jpeg", // 👈 Ruta corregida
    images: ["Regalos/Caja6.jpeg"],
    description: "Caja tipo lonchera temática de Circo, ideal para los más pequeños o detalles interactivos. Incluye mini oso de felpa blanco, set de 6 marcadores de colores, mini libro/hojas de circo para colorear, gomitas y chocolates Besties.",
    specs: ["Caja lonchera decorada Circo", "Mini oso de felpa blanco", "Set de 6 marcadores escolares", "Hojas temáticas para colorear"]
  },
  {
    id: 19,
    category: "Cajas Personalizadas",
    name: "Lonchera 'Circus Max'",
    tags: "#cajas #hotwhels  #juego #carros",
    price: 50000,
    image: "Regalos/Caja7.jpeg",
    images: ["Regalos/Caja7.jpeg"],
    description: "Caja con manija temática de Circo. Versión repotenciada que incluye mini consola de videojuegos retro portátil (tipo Brick Game/Tetris), mini oso de felpa, juego de marcadores para pintar, dulces Besties y carro Hot Wheels.",
    specs: ["Mini consola retro (Tetris/Brick Game)", "Carro a escala Hot Wheels", "Mini oso de felpa", "Marcadores y dulces surtidos"]
  },
  {
    id: 20,
    category: "Cajas Personalizadas",
    name: "Mini Box Edición 'Rayo McQueen 95'",
    tags: "#cajas #cars #disney",
    price: 25000,
    image: "Regalos/Caja8.jpeg", // 👈 Ruta corregida
    images: ["Regalos/Caja8.jpeg"],
    description: "Caja de regalos compacta de color blanco con diseño superior impreso de la película Cars (Copa Pistón, Rayo McQueen y Sally). Ideal para empaquetar de forma premium joyería, accesorios pequeños, dulces finos o notas de amor.",
    specs: ["Diseño exterior impreso de Cars", "Tamaño compacto ideal joyería/accesorios", "Acabado blanco premium liso"]
  }, 

  /* =========================================================
     🌸 SECCIÓN ADICIONAL: FLORES Y RAMOS EN CARPETA REGALOS
     ========================================================= */
  {
    id: 21,
    category: "Ramos Decorados",
    name: "Rosa 'Cielo de Rosas'",
    tags: "#ramos #flores #eternas",
    price: 12000,
    image: "Regalos/Flores.jpeg",
    images: ["Regalos/Flores.jpeg"],
    description: "Espectacular ramo premium elaborado con rosas eternas satinadas hechas a mano en una combinación de tonos azul rey, celeste y blanco liso. Envuelto en papel coreano texturizado de doble vista con un lazo elegante.",
    specs: ["Rosas eternas satinadas premium", "Papel coreano impermeable importado", "Lazo de cinta de raso satinada", "Tarjeta para dedicatoria"]
  },
  {
    id: 22,
    category: "Ramos Decorados",
    name: "Ramo 'Pasión Clásica & Mariposas'",
    tags: "#ramos #rosas #detalles",
    price: 50000,
    image: "Regalos/Ramo.jpeg",
    images: ["Regalos/Ramo.jpeg"],
    description: "El detalle romántico por excelencia. Ramo de rosas eternas color rojo pasión decorado con delicadas mariposas doradas 3D caladas que simulan revolotear sobre las flores. Envuelto en papel coreano negro mate que resalta los colores.",
    specs: ["Rosas eternas color rojo vibrante", "Mariposas decorativas doradas 3D", "Envoltura premium color negro mate", "Lazo satinado doble"]
  },

  /* =========================================================
     🎁 SECCIÓN ADICIONAL: CAJAS DE ALTA PERSONALIZACIÓN
     ========================================================= */
  {
    id: 24,
    category: "Cajas Personalizadas",
    name: "Ramo Tulipanes Personalizado",
    tags: "#ramo #caja #personalizado #pareja",
    price: 20000,
    image: "Regalos/Personalizado.jpeg", // 👈 Apunta a public/Regalos/Personalizado.jpeg
    images: ["Regalos/Personalizado.jpeg"],
    description: "La caja definitiva para el fan merengue. Diseño de tapa 'Camino a la 15' personalizada con la foto de la pareja, fechas especiales y el escudo del Real Madrid. Interior con carro Hot Wheels Premium de colección, chocolates M&M grandes y Pringles.",
    specs: ["Tulipanes"]
  },
  {
    id: 25,
    category: "Cajas Personalizadas",
    name: "Calendario Pareja Personalizado",
    tags: "#amor #calendario #coleccion #premium",
    price: 40000,
    image: "Regalos/Personalizado2.jpeg", // 👈 Apunta a public/Regalos/Personalizado2.jpeg
    images: ["Regalos/Personalizado2.jpeg"],
    description: "Un detalle emotivo y de colección. Tapa personalizada con el mensaje. base de dulces variados y tarjeta dedicatoria.",
    specs: ["Tapa personalizada temática 'Pareka'", "Mix de dulces y gomitas premium", "Empaque de lujo con lazo satinado"]
  },
  {
    id: 26,
    category: "Cajas Personalizadas",
    name: "Mini Combo Box Pareja",
    tags: "#cajas #personalizado #combos",
    price: 50000,
    image: "Regalos/Personalizado3.jpeg", // 👈 Apunta a public/Regalos/Personalizado3.jpeg
    images: ["Regalos/Personalizado3.jpeg"],
    description: "La versión compacta pero cargada de emoción. Caja cuadrada personalizada en la tapa con la marca Hot Wheels. Incluye un carro Hot Wheels de línea original y una selección de dulces populares (M&M mini, chocolates y gomitas Frúticas).",
    specs: ["Caja compacta personalizada", "Carro Hot Wheels de línea original", "Mix de 3 dulces variados", "Papel picado decorativo"]
  },
  {
    id: 27,
    category: "Cajas Personalizadas",
    name: "Carta Desde El Corazon",
    tags: "#cajas #corazon #carta",
    price: 10000,
    image: "Regalos/Personalizado4.jpeg", // 👈 Apunta a public/Regalos/Personalizado4.jpeg
    images: ["Regalos/Personalizado4.jpeg"],
    description: "El regalo perfecto para compartir y jugar. Tapa personalizada con diseño de pista de carreras. Contiene un carro Hot Wheels, papas Pringles grandes y una bolsa mediana de M&M's, todo listo para disfrutar.",
    specs: ["Tapa personalizada diseño Pista", "Carro Hot Wheels original", "Papas Pringles Grandes", "Chocolates M&M's medianos"]
  },
  {
    id: 28,
    category: "Cajas Personalizadas",
    name: "Personalizacion Cajas Cumpleaños",
    tags: "#cajas #cumpleaños #regalos",
    price: 30000,
    image: "Regalos/Personalizado5.jpeg", // 👈 Apunta a public/Regalos/Personalizado5.jpeg
    images: ["Regalos/Personalizado5.jpeg"],
    description: "Elegancia y pasión por el Real Madrid en una caja. Tapa personalizada con diseño 'Hala Madrid' y escudo. Interior con carro Hot Wheels Premium, chocolates M&M, papas Pringles y cerveza Coronita para celebrar.",
    specs: ["Tapa personalizada Hala Madrid", "Carro Hot Wheels Premium", "Cerveza Coronita y Papas Pringles", "Chocolates M&M's"]
  },

  /* =========================================================
     💼 CATEGORÍA: DETALLES EMPRESARIALES
     ========================================================= */
  {
    id: 29,
    category: "Detalles Empresariales",
    name: "Detalle Religioso",
    tags: "#regalos empresariales #suculenta #stack1",
    price: 5000,
    image: "Regalos/Empresariales_1.2.jpeg", // 👈 Imagen principal para la cuadrícula
    images: ["Regalos/Empresariales_1.2.jpeg", "Regalos/Empresariales_1.jpeg"], // 👈 Las primeras dos imágenes
    description: "Una bienvenida natural para tus colaboradores. Este stack presenta dos variantes de nuestro detalle botánico: una suculenta mini en cono Kraft con tarjeta de dedicatoria, y otra versión que incluye una deliciosa gomita Frútica para endulzar el momento. Perfecto para el Día del Medio Ambiente o kits de bienvenida.",
    specs: ["Suculenta mini seleccionada", "Cono Kraft decorativo con lazo", "Tarjeta de mensaje corporativo", "Gomita Frútica (según variante)"]
  },
  {
    id: 30,
    category: "Detalles Empresariales",
    name: "Stack Dia Hombre Empresa",
    tags: "#regalos empresariales #hombre #stack2",
    price: 3000,
    image: "Regalos/Empresariales_3.jpeg", // 👈 Imagen principal para la cuadrícula
    images: ["Regalos/Empresariales_3.jpeg", "Regalos/Empresariales_4.jpeg"], // 👈 Imágenes 3 y 4
    description: "Duplica la sonrisa en la oficina con este stack versátil. Incluye un tierno osito de felpa blanco con un lazo rojo, ideal para reconocer el buen trabajo, y una combinación de snacks y chocolates Besties para disfrutar en el descanso. Un detalle que alegra el día a cualquiera.",
    specs: ["Osito de felpa blanco mini", "Set de marcadores Besties (según variante)", "Mix de dulces Besties", "Empaque Kraft decorado"]
  },
  {
    id: 31,
    category: "Detalles Empresariales",
    name: "Dia Mujer Empresa",
    tags: "#regalos empresariales #completo #mujer",
    price: 4000,
    image: "Regalos/Empresariales2.jpeg", // 👈 Quinta imagen, va sola
    images: ["Regalos/Empresariales2.jpeg"], // 👈 Una sola imagen en el array
    description: "El regalo corporativo que combina utilidad y buen gusto. Este kit 'todo en uno' para el escritorio incluye una mini suculenta para dar un toque verde, una bolsa de chocolates Ferrero Rocher para la energía y una libreta Kraft con bolígrafo para apuntar las grandes ideas. Ideal para fin de año o reconocimientos especiales.",
    specs: ["Suculenta mini en maceta decorada", "Libreta Kraft con bolígrafo a juego", "Bolsa de chocolates Ferrero Rocher", "Caja Kraft premium para presentación"]
  },

  /* =========================================================
     🍫 CATEGORÍA: ANCHETAS DULCES (PREMIUM & TECH)
     ========================================================= */
  {
    id: 32,
    category: "Anchetas Dulces",
    name: "Ancheta Vinotinto 'Celebración Eterna'",
    tags: "#anchetas #vino #chocolates #detalles",
    price: 42000,
    image: "Regalos/Ancheta.jpeg", // 👈 Apunta a public/Regalos/Ancheta.jpeg
    images: ["Regalos/Ancheta.jpeg"],
    description: "Una combinación sofisticada y dulce para fechas inolvidables. Incluye una botella de vino tinto de la casa, una selección premium de chocolates artesanales y un miniramo integrado de rosas eternas hechas a mano. Todo presentado de forma impecable en base rígida decorada.",
    specs: ["Botella de vino tinto exclusivo", "Caja de bombones y chocolates surtidos", "Ramillete de rosas eternas artesanales", "Decoración premium con lazo a juego"]
  },
  {
    id: 33,
    category: "Anchetas Dulces",
    name: "Mega Ancheta Tech 'AirPods Sorpresa & HBD'",
    tags: "#anchetas #premium #tecnologia #airpods #cumpleaños",
    price: 120000, // Ajusta el precio según la gama de los audífonos
    image: "Regalos/Airpods.jpeg", // 👈 Apunta a public/Regalos/Airpods.jpeg
    images: ["Regalos/Airpods.jpeg"],
    description: "El regalo definitivo que combina tecnología y la máxima ternura. Sorprende en grande con unos audífonos AirPods (en su caja sellada), acompañados por un tierno oso de felpa blanco, papas Pringles, chocolates M&M's grandes, dulces surtidos y un espectacular globo metalizado de feliz cumpleaños.",
    specs: ["Audífonos inalámbricos tipo AirPods en caja", "Oso de felpa blanco importado", "Papas Pringles medianas y chocolates M&M's", "Globo metalizado HBD con Helio"]
  },

  /* =========================================================
     🎁 CATEGORÍA: COMBOS ESPECIALES (SUPER PREMIUM)
     ========================================================= */
  {
    id: 34,
    category: "Combos Especiales",
    name: "Combo Perrito",
    tags: "#combos #premium #snacks #stack1",
    price: 35000, // Ajusta el precio según tus costos
    image: "Regalos/Regalo8.jpeg", // 👈 Imagen principal para la cuadrícula
    images: ["Regalos/Regalo8.jpeg"], // 👈 Stack de Imagen 1 y Imagen 5
    description: "La máxima expresión de alegría y sabor. Este combo presenta una frondosa ancheta de flores amarillas brillantes con un tierno oso de felpa y un globo metalizado personalizado con Helio, perfecto para celebrar. El stack incluye una segunda imagen que resalta el snack M&M's grandes, mostrando la abundancia de este detalle.",
    specs: ["Ramo de flores amarillas premium", "Osito de felpa blanco mini", "Globo metalizado personalizado HBD con Helio", "Chocolates M&M's grandes y dulces Besties"]
  },
  {
    id: 35,
    category: "Combos Especiales",
    name: "Combo Vitrinal Perrito",
    tags: "#combos #perrito #snacks ",
    price: 40000, // Ajusta el precio según tus costos
    image: "Regalos/Regalo9.jpeg", // 👈 Apunta a public/Regalos/Regalo9.jpeg
    images: ["Regalos/Regalo9.jpeg"], // 👈 Una sola imagen
    description: "Un detalle que combina la belleza de lo natural con la dulzura. Ancheta de flores amarillas brillantes con follaje verde silvestre, acompañada de un tierno oso de felpa blanco y un mix de dulces Besties. Todo presentado en una base Kraft decorada con lazo.",
    specs: ["Flores amarillas premium y follaje silvestre", "Osito de felpa blanco mini", "Mix de dulces y chocolates Besties", "Base Kraft decorada con lazo"]
  },
  {
    id: 36,
    category: "Combos Especiales",
    name: "Combo Vitrinal TopoGigo",
    tags: "#combos #HBD #snacks",
    price: 75000, // Ajusta el precio según tus costos
    image: "Regalos/Regalo10.jpeg", // 👈 Apunta a public/Regalos/Regalo10.jpeg
    images: ["Regalos/Regalo10.jpeg", "Regalos/Regalo10.1.jpeg"], // 👈 Una sola imagen
    description: "El kit de celebración perfecto para los amantes de los snacks. Incluye una base Kraft decorada con lazo, un ramo de flores amarillas brillantes con follaje verde silvestre, un globo metalizado personalizado HBD con Helio y un combo box completo de dulces Besties (marcadores y snacks).",
    specs: ["Flores amarillas premium y follaje silvestre", "Globo metalizado personalizado HBD con Helio", "Combo Box Besties (marcadores y snacks)", "Base Kraft decorada con lazo"]
  },
  {
    id: 37,
    category: "Combos Especiales",
    name: "Mega Combo Vitrinal Cerdito",
    tags: "#combos #flores #snacks #cerdito #besties",
    price: 40000, // Ajusta el precio según tus costos
    image: "Regalos/Regalo11.jpeg", // 👈 Apunta a public/Regalos/Regalo11.jpeg
    images: ["Regalos/Regalo11.jpeg"], // 👈 Una sola imagen
    description: "La sorpresa más grande y dulce para celebrar a lo grande. Ancheta de flores amarillas brillantes con follaje verde silvestre, acompañada de un tierno oso de felpa blanco, un globo metalizado personalizado HBD con Helio y un combo box completo de dulces Besties (marcadores y snacks). Todo en una base Kraft decorada con lazo.",
    specs: ["Flores amarillas premium y follaje silvestre", "Osito de felpa blanco mini", "Globo metalizado personalizado HBD con Helio", "Combo Box Besties (marcadores y snacks)"]
  }

  
];

// 📐 LOS 8 CAMPOS DE PLANTILLAS DIGITALES PARA EMPRENDEDORES
const PLANTILLAS_MOCK = [
  {
    id: "plt_1",
    name: "Plantilla Caja Cubo Personalizable",
    description: "Plantilla vectorizada ideal coleccionables o regalos sorpresa.",
    price: 5000,
    format: "PDF",
    difficulty: "Fácil",
    image: "/Plantillas/IMG_6589.PNG"  
  }
  
];

// 🔥 LAS 6 PROMO-DETALLES LISTOS PARA ENTREGA INMEDIATA
const PROMOS_MOCK = [
  {
    id: "promo_1",
    name: "Promo Express: Ramo Soft + Luces",
    description: "¡Listo para llevar! Incluye ramo eterno en tonos rosa pastel con luces micro LED integradas. Perfecto para un detalle de última hora.",
    priceOriginal: 55000,
    pricePromo: 39000,
    image: "image_284fc7.jpg",
    stock: "2 disponibles"
  },
  {
    id: "promo_2",
    name: "Caja Sorpresa HBD Explosiva",
    description: "Caja armada decorada con globos metalizados de feliz cumpleaños y snacks salados seleccionados. Entrega en menos de 2 horas.",
    priceOriginal: 75000,
    pricePromo: 59000,
    image: "image_fe5ff7.jpg",
    stock: "1 disponible"
  },
  {
    id: "promo_3",
    name: "Mini Ancheta Cervecera",
    description: "Cesta de mimbre decorada con lazo rojo, 2 cervezas Corona extra frías y maní especial. El regalo salvavidas para él.",
    priceOriginal: 45000,
    pricePromo: 32000,
    image: "image_fe5bdf.jpg",
    stock: "3 disponibles"
  },
  {
    id: "promo_4",
    name: "Pack Dulce Amor (Flores & Ferrero)",
    description: "Caja rígida con 6 rosas rojas impecables y empaque de chocolates Ferrero Rocher x4. Romantismo al instante.",
    priceOriginal: 60000,
    pricePromo: 45000,
    image: "image_284c86.jpg",
    stock: "2 disponibles"
  },
  {
    id: "promo_5",
    name: "Globo Burbuja Personalizado Express",
    description: "Globo gigante inflado con helio, base orgánica de globos y frase estándar '¡Te Amo!' en vinilo adhesivo.",
    priceOriginal: 48000,
    pricePromo: 35000,
    image: "image_fe6afe.jpg",
    stock: "4 disponibles"
  },
  {
    id: "promo_6",
    name: "Desayuno Crave al Instante",
    description: "Bandeja decorada con pancakes esponjosos, jugo natural y sándwich artesanal. Disponible solo para entregas matutinas rápidas.",
    priceOriginal: 50000,
    pricePromo: 39900,
    image: "image_284beb.jpg",
    stock: "Último disponible"
  }
];

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const productosFiltrados = PRODUCTOS_MOCK.filter((producto) => {
    // Si activeCategory es null, no filtra por categoría (sirve si quisieras búsqueda global)
    const coincideCategoria = !activeCategory || producto.category === activeCategory;
    
    const texto = busqueda.toLowerCase();
    const coincideTexto = 
      producto.name.toLowerCase().includes(texto) ||
      producto.description.toLowerCase().includes(texto) ||
      producto.category.toLowerCase().includes(texto) ||
      producto.tags.toLowerCase().includes(texto);

    return coincideCategoria && coincideTexto;
  });

  return (
    <div className="min-h-screen text-[#2C2C2C] antialiased bg-[#FDFCF0] overflow-x-hidden relative">
      
      {/* FONDO ANIMADO DE PARTÍCULAS FLOTANTES */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {PARTICULAS_DECORATIVAS.map((p) => {
          return (
            <motion.div
              key={p.id}
              className="absolute bottom-[-50px]"
              style={{ left: p.left }}
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

      {/* HEADER / NAVBAR */}
      <header className="w-full bg-[#FDFCF0] px-6 py-5 md:px-16 border-b border-rose-100/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setSelectedProduct(null); setActiveCategory(null); cambiarPestana('catalogo'); }}>
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
          transition={{ duration: 0.25, ease: "easeInOut" }}
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
                  transition={{ duration: 0.2 }}
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

                <main className="max-w-7xl mx-auto px-6 pb-24">
                  <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-2 border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-neutral-900 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {activeCategory ? `Sección: ${activeCategory}` : "Todos los Detalles"}
                    </h2>
                    <span className="text-xs text-gray-400 font-funny font-bold">Mostrando {productosFiltrados.length} regalos</span>
                  </div>

                  <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                      {productosFiltrados.map((producto) => (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ y: -6, transition: { duration: 0.2 } }}
                          transition={{ type: "spring", stiffness: 200, damping: 22 }}
                          key={producto.id} 
                          className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs flex flex-col justify-between p-3 group hover:shadow-md transition-all duration-300"
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
                  </motion.div>
                </main>
              </motion.div>
            ) : (
              /* PRODUCTO AL DETALLE */
              <motion.div
                key={`product-detail-${selectedProduct.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
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

        {/* SECCIÓN 4: PLANTILLAS */}
      {seccionVisual === 'plantillas' && (
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <span className="text-[#E71B4F] font-funny font-bold text-sm uppercase tracking-wider block mb-2">
              Para Emprendedores y Creativos
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-neutral-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Moldes y Plantillas Digitales
            </h2>
            <p className="text-neutral-500 max-w-xl mx-auto mt-3 text-sm font-medium">
              ¡Optimiza tus tiempos! Adquiere nuestros diseños exclusivos listos para descargar, imprimir o cortar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANTILLAS_MOCK.map((plantilla) => (
              <div key={plantilla.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 p-3 flex flex-col justify-between hover:shadow-md transition-all duration-300">
                <div>
                  <div className="h-[200px] rounded-2xl overflow-hidden bg-neutral-100 relative mb-4 group">
                    <img src={plantilla.image} alt={plantilla.name} className="w-full h-full object-cover transition transform duration-300 group-hover:scale-105" />
                    <span className="absolute bottom-2 right-2 bg-neutral-950/80 text-white font-mono text-[10px] px-2 py-0.5 rounded-md">
                      {plantilla.difficulty}
                    </span>
                  </div>
                  
                  <div className="px-1">
                    <h3 className="text-base font-bold text-neutral-900 tracking-tight mb-1">{plantilla.name}</h3>
                    <p className="text-xs text-neutral-500 line-clamp-2 mb-3 min-h-[32px]">{plantilla.description}</p>
                    <div className="bg-[#FDFCF0] border border-rose-100/40 rounded-xl p-2 mb-4">
                      <span className="text-[10px] font-black uppercase text-gray-400 block tracking-wider">Formatos Incluidos:</span>
                      <span className="text-xs font-bold text-[#9E1B41]">{plantilla.format}</span>
                    </div>
                  </div>
                </div>

                <div className="px-1 pt-2 border-t border-gray-50 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-bold">Inversión:</span>
                    <span className="text-base font-funny font-black text-neutral-900">
                      ${plantilla.price.toLocaleString('es-CO')} <span className="text-[10px] text-gray-400 font-normal">COP</span>
                    </span>
                  </div>
                  <button 
                    onClick={() => typeof handleOrdenarPlantilla === 'function' && handleOrdenarPlantilla(plantilla)}
                    className="w-full bg-neutral-900 hover:bg-[#E71B4F] text-white text-xs font-funny font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Download size={14} /> Adquirir Plantilla
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
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
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs" 
              onClick={closeCart} 
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10"
            >
              <div className="p-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <h3 className="text-lg font-bold text-neutral-900" style={{ fontFamily: 'Playfair Display, serif' }}>Mis Regalos Seleccionados</h3>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={closeCart} className="text-gray-400 hover:text-gray-600"><X size={20} /></motion.button>
                </div>
                <div className="space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
                  {cart.length === 0 ? (
                    <p className="text-sm text-neutral-400 text-center py-6 font-funny">No has añadido productos aún.</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 border-b border-gray-100 gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-neutral-800 leading-snug">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Cant: {item.quantity} x ${item.price.toLocaleString('es-CO')}</p>
                          </div>
                        </div>
                        <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 text-xs font-bold shrink-0">
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {cart.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-neutral-50 space-y-4">
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
            <p className="text-neutral-500 text-xs mt-0.5">Hecho con amor • Detalles Premium & Recursos Digitales</p>
          </div>
          <div>
            <a href="https://www.instagram.com/crave.details?igsh=ZWJ5dDRmb3o0aHo=" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium px-4 py-2 rounded-full shadow-md">
              Síguenos en Instagram
            </a>
          </div>
        </div>
      </footer>

      </div>
    </div>
  );
}