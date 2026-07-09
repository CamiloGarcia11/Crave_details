// src/data/products.js

// 1. LISTADO DE LAS CATEGORÍAS PRINCIPALES
export const CATEGORIAS = [
  "Ramos Decorados",
  "Cajas Personalizadas",
  "Anchetas Dulces",
  "Detalles Empresariales",
  "Combos Especiales"
];

// 2. CATÁLOGO COMPLETO DE PRODUCTOS MOCK
export const PRODUCTOS_MOCK = [
  {
    id: 13,
    category: "Cajas Personalizadas",
    name: "Caja Marco Premium 'Tú Ganaste Mi Corazón'",
    tags: "#cajas #hotwheels #premium",
    price: 38000,
    image: "Regalos/Caja.jpeg",
    images: ["Regalos/Caja.jpeg"],
    description: "Caja de lujo con marco frontal blanco e impresión personalizada al fondo con temática Hot Wheels.",
    specs: ["Caja Ventanal", "Hot Wheels Premium", "Snacks dulces"]
  },
  {
    id: 14,
    category: "Cajas Personalizadas",
    name: "Caja Sorpresa 'Un Detalle Pensado en Ti'",
    tags: "#cajas #sorpresa #chicas",
    price: 45000,
    image: "Regalos/Caja2.jpeg",
    images: ["Regalos/Caja2.jpeg"],
    description: "Caja artesanal en Kraft con apertura superior. Viene equipada con un mini oso de felpa. Peina de Cartera. Moña de Seda. Gancho Floral. Silicona ",
    specs: ["Caja Kraft rígida", "Mini oso de felpa", "Set de belleza"]
  },
  {
    id: 15,
    category: "Cajas Personalizadas",
    name: "Caja Sorpresa Hot Wheels 'Pista de Fuego'",
    tags: "#cajas #hotwheels #carreras",
    price: 52000,
    image: "Regalos/Caja3.jpeg",
    images: ["Regalos/Caja3.jpeg"],
    description: "Caja cuadrada decorada con diseño de pista de carreras en la tapa.",
    specs: ["Tapa decorada", "Lazo satín", "Carro Hot Wheels"]
  },
  {
    id: 16,
    category: "Cajas Personalizadas",
    name: "Combo Box Hot Wheels 'Mi Futbolista Favorito'",
    tags: "#cajas #futbol #hotwheels",
    price: 40000,
    image: "Regalos/Caja4.jpeg",
    images: ["Regalos/Caja4.jpeg"],
    description: "Edición especial futbolera con dedicatoria romántica en tarjeta temática.",
    specs: ["Tarjeta de fútbol", "Papas Pringles", "M&M grandes"]
  },
  {
    id: 17,
    category: "Cajas Personalizadas",
    name: "Caja Box Corona & Wheels",
    tags: "#cajas #caballeros #corona",
    price: 40000,
    image: "Regalos/Caja5.jpeg",
    images: ["Regalos/Caja5.jpeg"],
    description: "El detalle perfecto que combina pasatiempos. Trae una Coronita Extra.",
    specs: ["Cerveza Coronita", "Hot Wheels original", "Bon Bon Bum"]
  },
  {
    id: 18,
    category: "Cajas Personalizadas",
    name: "Lonchera Sorpresa 'Circus & Art'",
    tags: "#cajas #niños #circo #arte",
    price: 42000,
    image: "Regalos/Caja6.jpeg",
    images: ["Regalos/Caja6.jpeg"],
    description: "Caja tipo lonchera temática de Circo, ideal para los más pequeños.",
    specs: ["Lonchera Circo", "Mini oso de felpa", "Set de marcadores"]
  },
  {
    id: 19,
    category: "Cajas Personalizadas",
    name: "Lonchera 'Circus Max'",
    tags: "#cajas #hotwhels #juego #carros",
    price: 50000,
    image: "Regalos/Caja7.jpeg",
    images: ["Regalos/Caja7.jpeg"],
    description: "Caja con manija temática de Circo con mini consola retro.",
    specs: ["Mini consola retro", "Carro Hot Wheels", "Mini oso"]
  },
  {
    id: 20,
    category: "Cajas Personalizadas",
    name: "Mini Box Edición 'Rayo McQueen 95'",
    tags: "#cajas #cars #disney",
    price: 25000,
    image: "Regalos/Caja8.jpeg",
    images: ["Regalos/Caja8.jpeg"],
    description: "Caja de regalos compacta de color blanco con diseño impreso de Cars.",
    specs: ["Diseño de Cars", "Tamaño compacto", "Acabado premium"]
  },
  {
    id: 21,
    category: "Ramos Decorados",
    name: "Rosa 'Cielo de Rosas'",
    tags: "#ramos #flores #eternas",
    price: 12000,
    image: "Regalos/Flores.jpeg",
    images: ["Regalos/Flores.jpeg"],
    description: "Espectacular ramo premium elaborado con rosas eternas satinadas hechas a mano.",
    specs: ["Rosas eternas", "Papel coreano", "Lazo satinado"]
  },
  {
    id: 22,
    category: "Ramos Decorados",
    name: "Ramo 'Pasión Clásica & Mariposas'",
    tags: "#ramos #rosas #detalles",
    price: 50000,
    image: "Regalos/Ramo.jpeg",
    images: ["Regalos/Ramo.jpeg"],
    description: "Ramo de rosas eternas color rojo pasión decorado con mariposas doradas 3D.",
    specs: ["Rosas rojas", "Mariposas doradas 3D", "Envoltura negra"]
  },
  {
    id: 24,
    category: "Cajas Personalizadas",
    name: "Ramo Tulipanes Personalizado",
    tags: "#ramo #caja #personalizado",
    price: 20000,
    image: "Regalos/Personalizado.jpeg",
    images: ["Regalos/Personalizado.jpeg"],
    description: "La caja definitiva para el fan merengue personalizada con fotos.",
    specs: ["Tulipanes"]
  },
  {
    id: 25,
    category: "Cajas Personalizadas",
    name: "Calendario Pareja Personalizado",
    tags: "#amor #calendario #premium",
    price: 40000,
    image: "Regalos/Personalizado2.jpeg",
    images: ["Regalos/Personalizado2.jpeg"],
    description: "Un detalle emotivo y de colección con mensaje y dulces.",
    specs: ["Tapa personalizada", "Mix de dulces", "Empaque de lujo"]
  },
  {
    id: 26,
    category: "Cajas Personalizadas",
    name: "Mini Combo Box Pareja",
    tags: "#cajas #personalizado #combos",
    price: 50000,
    image: "Regalos/Personalizado3.jpeg",
    images: ["Regalos/Personalizado3.jpeg"],
    description: "Versión compacta con carro Hot Wheels y dulces populares.",
    specs: ["Caja personalizada", "Hot Wheels original", "Mix de dulces"]
  },
  {
    id: 27,
    category: "Cajas Personalizadas",
    name: "Carta Desde El Corazon",
    tags: "#cajas #corazon #carta",
    price: 10000,
    image: "Regalos/Personalizado4.jpeg",
    images: ["Regalos/Personalizado4.jpeg"],
    description: "El regalo perfecto para compartir y jugar con diseño de pista.",
    specs: ["Diseño Pista", "Hot Wheels", "Pringles Grandes"]
  },
  {
    id: 28,
    category: "Cajas Personalizadas",
    name: "Personalizacion Cajas Cumpleaños",
    tags: "#cajas #cumpleaños #regalos",
    price: 30000,
    image: "Regalos/Personalizado5.jpeg",
    images: ["Regalos/Personalizado5.jpeg"],
    description: "Elegancia y pasión por el Real Madrid con diseño 'Hala Madrid'.",
    specs: ["Tapa Hala Madrid", "Hot Wheels Premium", "Cerveza Coronita"]
  },
  {
    id: 29,
    category: "Detalles Empresariales",
    name: "Detalle Religioso",
    tags: "#regalos #suculenta #empresa",
    price: 5000,
    image: "Regalos/Empresariales_1.2.jpeg",
    images: ["Regalos/Empresariales_1.2.jpeg", "Regalos/Empresariales_1.jpeg"],
    description: "Una bienvenida natural para tus colaboradores con suculenta mini.",
    specs: ["Suculenta mini", "Cono Kraft", "Tarjeta corporativa"]
  },
  {
    id: 30,
    category: "Detalles Empresariales",
    name: "Stack Dia Hombre Empresa",
    tags: "#regalos #hombre #empresa",
    price: 3000,
    image: "Regalos/Empresariales_3.jpeg",
    images: ["Regalos/Empresariales_3.jpeg", "Regalos/Empresariales_4.jpeg"],
    description: "Incluye un tierno osito de felpa blanco con un lazo rojo.",
    specs: ["Osito mini", "Set marcadores", "Mix dulces"]
  },
  {
    id: 31,
    category: "Detalles Empresariales",
    name: "Dia Mujer Empresa",
    tags: "#regalos #mujer #empresa",
    price: 4000,
    image: "Regalos/Empresariales2.jpeg",
    images: ["Regalos/Empresariales2.jpeg"],
    description: "El regalo corporativo que combina utilidad y buen gusto.",
    specs: ["Suculenta maceta", "Libreta Kraft", "Chocolates Ferrero"]
  },
  {
    id: 32,
    category: "Anchetas Dulces",
    name: "Ancheta Vinotinto 'Celebración Eterna'",
    tags: "#anchetas #vino #chocolates",
    price: 42000,
    image: "Regalos/Ancheta.jpeg",
    images: ["Regalos/Ancheta.jpeg"],
    description: "Incluye una botella de vino tinto de la casa y rosas eternas.",
    specs: ["Vino tinto", "Bombones", "Rosas eternas"]
  },
  {
    id: 33,
    category: "Anchetas Dulces",
    name: "Mega Ancheta Tech 'AirPods Sorpresa & HBD'",
    tags: "#anchetas #premium #tecnologia #airpods",
    price: 120000,
    image: "Regalos/Airpods.jpeg",
    images: ["Regalos/Airpods.jpeg"],
    description: "Audífonos AirPods acompañados por un tierno oso de felpa.",
    specs: ["AirPods en caja", "Oso importado", "Pringles y M&M"]
  },
  {
    id: 34,
    category: "Combos Especiales",
    name: "Combo Perrito",
    tags: "#combos #premium #snacks",
    price: 35000,
    image: "Regalos/Regalo8.jpeg",
    images: ["Regalos/Regalo8.jpeg"],
    description: "Ancheta de flores amarillas con un tierno oso de felpa.",
    specs: ["Flores amarillas", "Osito mini", "Globo HBD Helio"]
  },
  {
    id: 35,
    category: "Combos Especiales",
    name: "Combo Vitrinal Perrito",
    tags: "#combos #perrito #snacks",
    price: 40000,
    image: "Regalos/Regalo9.jpeg",
    images: ["Regalos/Regalo9.jpeg"],
    description: "Ancheta de flores amarillas brillantes con un mix de dulces.",
    specs: ["Flores amarillas", "Osito mini", "Mix dulces Besties"]
  },
  {
    id: 36,
    category: "Combos Especiales",
    name: "Combo Vitrinal TopoGigo",
    tags: "#combos #HBD #snacks",
    price: 75000,
    image: "Regalos/Regalo10.jpeg",
    images: ["Regalos/Regalo10.jpeg", "Regalos/Regalo10.1.jpeg"],
    description: "El kit de celebración perfecto para los amantes de los snacks.",
    specs: ["Flores amarillas", "Globo Helio", "Combo Box Besties"]
  },
  {
    id: 37,
    category: "Combos Especiales",
    name: "Mega Combo Vitrinal Cerdito",
    tags: "#combos #flores #snacks",
    price: 40000,
    image: "Regalos/Regalo11.jpeg",
    images: ["Regalos/Regalo11.jpeg"],
    description: "Ancheta de flores amarillas con globo metalizado personalizado.",
    specs: ["Flores amarillas", "Osito mini", "Globo Helio HBD"]
  }
];

// 3. SECCIÓN DE PLANTILLAS MOCK
export const PLANTILLAS_MOCK = [
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

// 4. SECCIÓN DE PROMOS MOCK
export const PROMOS_MOCK = [
  {
    id: "promo_1",
    name: "Promo Express: Ramo Soft + Luces",
    description: "Incluye ramo eterno en tonos rosa pastel con luces micro LED.",
    priceOriginal: 55000,
    pricePromo: 39000,
    image: "image_284fc7.jpg",
    stock: "2 disponibles"
  },
  {
    id: "promo_2",
    name: "Caja Sorpresa HBD Explosiva",
    description: "Caja armada decorada con globos metalizados de feliz cumpleaños.",
    priceOriginal: 75000,
    pricePromo: 59000,
    image: "image_fe5ff7.jpg",
    stock: "1 disponible"
  }
];