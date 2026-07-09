import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; 

export default function AdminPanel({ setEsAdminView, onProductoCambiado, PRODUCTOS_MOCK = [], PLANTILLAS_MOCK = [] }) {
  const [sesion, setSesion] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [pestanaActiva, setPestanaActiva] = useState("productos"); 
  const [listaProductos, setListaProductos] = useState([]);
  const [listaPlantillas, setListaPlantillas] = useState([]);

  const [nombreGenerico, setNombreGenerico] = useState("");
  const [precioGenerico, setPrecioGenerico] = useState(""); 
  const [imagenGenerica, setImagenGenerica] = useState(""); 
  const [categoria, setCategoria] = useState(""); 
  const [editandoId, setEditandoId] = useState(null);
  const [cantidad, setCantidad] = useState("");
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  const [description, setDescription] = useState(""); 
  const [tags, setTags] = useState(""); 
  const [imagenesList, setImagenesList] = useState([]);
  const [urlNueva, setUrlNueva] = useState("");
  const [specsList, setSpecsList] = useState([]);
  const [specNueva, setSpecNueva] = useState("");
  const [tipoVariante, setTipoVariante] = useState("ninguno"); // "ninguno", "ramo", "cuadro"
  const [preciosVariantes, setPreciosVariantes] = useState({}); // object e.g. { Rojo: 25000 }
  const [format, setFormat] = useState("PDF");
  const [difficulty, setDifficulty] = useState("Fácil"); 


  const agregarUrlImagen = () => {
    if (urlNueva.trim()) {
      setImagenesList(prev => [...prev, urlNueva.trim()]);
      setUrlNueva("");
    }
  };

  const agregarSpec = () => {
    if (specNueva.trim()) {
      setSpecsList(prev => [...prev, specNueva.trim()]);
      setSpecNueva("");
    }
  };

  const eliminarSpec = (index) => {
    setSpecsList(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const verificarSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSesion(session);
    };
    verificarSesion();
    cargarDatos();
  }, []);

  useEffect(() => {
    if (!sesion) return;

    let timeoutId;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      // Inactividad por 5 minutos
      timeoutId = setTimeout(() => {
        handleLogout();
        alert("Tu sesión ha expirado por inactividad. Por favor, inicia sesión de nuevo.");
      }, 5 * 60 * 1000);
    };

    // Registrar eventos para detectar actividad
    const eventos = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    eventos.forEach(evt => window.addEventListener(evt, resetTimer));
    
    // Iniciar temporizador
    resetTimer();

    // Evento de salir de la pestaña (visibilitychange)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleLogout();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      eventos.forEach(evt => window.removeEventListener(evt, resetTimer));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sesion]);

  const cargarDatos = async () => {
    try {
      const { data: prodData, error: errProd } = await supabase.from('productos').select('*').order('id', { ascending: false });
      if (errProd) throw errProd;
      if (prodData) setListaProductos(prodData);

      const { data: planData, error: errPlan } = await supabase.from('plantillas').select('*').order('id', { ascending: false });
      if (errPlan) throw errPlan;
      if (planData) setListaPlantillas(planData);
    } catch (err) {
      console.error("Error cargando bases de datos:", err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setSesion(data.session);
      await cargarDatos();
    } catch (error) {
      alert("Error de autenticación: " + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSesion(null);
  };

  // Obtiene la lista directa de la base de datos sin mocks para evitar publicaciones fijas
  const obtenerItemsCombinados = () => {
    if (pestanaActiva === "productos") {
      return listaProductos.map((dbItem) => {
        const imageList = dbItem.imagen ? dbItem.imagen.split(',').map((s) => s.trim()).filter(Boolean) : [];
        
        const descRaw = dbItem.descripcion || dbItem.description || "";
        let parsedDesc = descRaw;
        let parsedSpecs = [];
        
        let variantType = "ninguno";
        let variantPrices = {};

        // Primero separamos por precios de variantes si existen
        let mainPart = descRaw;
        if (descRaw.includes("|||prices:")) {
          const partsForPrices = descRaw.split("|||prices:");
          mainPart = partsForPrices[0];
          const pricesStr = partsForPrices[1] || "";
          
          // Parsear precios
          const pairs = pricesStr.split(',').map(s => s.trim()).filter(Boolean);
          pairs.forEach(pair => {
            const [k, v] = pair.split('=');
            if (k && v) {
              if (k === "tipo") {
                variantType = v;
              } else {
                variantPrices[k] = parseFloat(v) || 0;
              }
            }
          });
        }

        // Luego separamos por specs de la parte principal
        if (mainPart.includes("|||")) {
          const parts = mainPart.split("|||");
          parsedDesc = parts[0].trim();
          parsedSpecs = (parts[1] || "").split(',').map(s => s.trim()).filter(Boolean);
        } else {
          parsedDesc = mainPart.trim();
        }

        return {
          id: dbItem.id,
          nombre: dbItem.nombre || dbItem.name || "Detalle Sin Nombre",
          precio: dbItem.precio !== undefined ? dbItem.precio : (dbItem.price !== undefined ? dbItem.price : 0),
          imagen: dbItem.imagen || dbItem.image || "",
          categoria: dbItem.categoria || dbItem.category || "Otros",
          cantidad: dbItem.cantidad || 0,
          description: parsedDesc,
          tags: dbItem.formatos || dbItem.tags || "",
          existeEnBD: true,
          imagenesList: imageList,
          specs: parsedSpecs,
          variantType,
          variantPrices
        };
      });
    } else {
      return listaPlantillas.map((dbItem) => {
        return {
          id: dbItem.id,
          name: dbItem.nombre || dbItem.name || "Plantilla Sin Nombre",
          price: dbItem.precio !== undefined ? dbItem.precio : (dbItem.price !== undefined ? dbItem.price : 0),
          image: dbItem.imagen || dbItem.image || "",
          description: dbItem.description || "",
          format: dbItem.format || "PDF",
          difficulty: dbItem.difficulty || "Fácil",
          existeEnBD: true
        };
      });
    }
  };

  const itemsAMostrar = obtenerItemsCombinados();

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (pestanaActiva === "productos") {
        // Serializar las especificaciones y precios de variantes al final del campo de descripción
        let descriptionWithSpecs = specsList.length > 0 
          ? `${description.trim()}|||${specsList.join(',')}`
          : description.trim();

        if (tipoVariante !== "ninguno") {
          const pricesStr = Object.entries(preciosVariantes)
            .filter(([_, v]) => v !== undefined && v !== "")
            .map(([k, v]) => `${k}=${v}`)
            .join(',');
          descriptionWithSpecs += `|||prices:tipo=${tipoVariante},${pricesStr}`;
        }

        const payloadProd = { 
          nombre: nombreGenerico, 
          precio: parseFloat(precioGenerico) || 0, 
          imagen: imagenesList.join(','), 
          categoria, 
          cantidad: parseInt(cantidad) || 0,
          descripcion: descriptionWithSpecs,
          formatos: tags
        };
        const existeEnBD = editandoId && listaProductos.some(p => p.id === editandoId);
        if (existeEnBD) {
          const { error } = await supabase.from('productos').update(payloadProd).eq('id', editandoId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('productos').insert([payloadProd]);
          if (error) throw error;
        }
      } else {
        const payloadPlan = { 
          name: nombreGenerico, 
          price: parseFloat(precioGenerico) || 0, 
          image: imagenGenerica, 
          description, 
          format,
          difficulty
        };
        const existeEnBD = editandoId && listaPlantillas.some(p => p.id === editandoId);
        if (existeEnBD) {
          const { error } = await supabase.from('plantillas').update(payloadPlan).eq('id', editandoId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('plantillas').insert([payloadPlan]);
          if (error) throw error;
        }
      }

      limpiarFormulario();
      await cargarDatos();
      if (onProductoCambiado) onProductoCambiado();
      alert("¡Registro guardado correctamente!");
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
  };

  const activarEdicion = (item) => {
    setEditandoId(item.id);
    if (pestanaActiva === "productos") {
      setNombreGenerico(item.nombre || "");
      setPrecioGenerico(item.precio || "");
      setImagenGenerica(item.imagen || "");
      setCategoria(item.categoria || "");
      setCantidad(item.cantidad || "0");
      setDescription(item.description || item.descripcion || "");
      setTags(item.tags || item.formatos || "");
      setImagenesList(item.imagenesList || (item.imagen ? item.imagen.split(',').map(s => s.trim()).filter(Boolean) : []));
      setSpecsList(item.specs && item.specs.length > 0 ? item.specs : ["Detalle hecho a mano", "Diseño personalizado"]);

      // Auto-detección y pre-población de tipo y precios de variantes para productos existentes
      let detectedType = item.variantType || "ninguno";
      let prices = item.variantPrices || {};

      if (detectedType === "ninguno") {
        const catLower = (item.categoria || "").toLowerCase();
        const nameLower = (item.nombre || item.name || "").toLowerCase();
        const esRamo = catLower.includes("ramo") || nameLower.includes("ramo");
        const esCuadro = catLower.includes("portaretrato") || catLower.includes("cuadro") || catLower.includes("calendario") ||
                         nameLower.includes("portaretrato") || nameLower.includes("cuadro") || nameLower.includes("calendario");

        if (esRamo) {
          detectedType = "ramo";
          prices = {};
          ["Rojo", "Rosado", "Azul", "Morado", "Amarillo", "Blanco"].forEach(c => {
            prices[c] = item.precio || 0;
          });
        } else if (esCuadro) {
          detectedType = "cuadro";
          prices = {};
          ["10x15", "13x18", "15x20", "20x30"].forEach(s => {
            prices[s] = item.precio || 0;
          });
        }
      }

      setTipoVariante(detectedType);
      setPreciosVariantes(prices);
    } else {
      setNombreGenerico(item.name || "");
      setPrecioGenerico(item.price || "");
      setImagenGenerica(item.image || "");
      setDescription(item.description || "");
      setFormat(item.format || "PDF");
      setDifficulty(item.difficulty || "Fácil");
      setTags("");
      setImagenesList([]);
      setSpecsList([]);
      setTipoVariante("ninguno");
      setPreciosVariantes({});
    }
  };

  const limpiarFormulario = () => {
    setEditandoId(null);
    setNombreGenerico("");
    setPrecioGenerico("");
    setImagenGenerica("");
    setCategoria("");
    setCantidad("");
    setDescription("");
    setFormat("PDF");
    setDifficulty("Fácil");
    setTags("");
    setImagenesList([]);
    setUrlNueva("");
    setSpecsList([]);
    setSpecNueva("");
    setTipoVariante("ninguno");
    setPreciosVariantes({});
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSubiendoImagen(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Intentar subir al bucket 'imagenes'
      let { error: uploadError } = await supabase.storage
        .from('imagenes')
        .upload(filePath, file);

      if (uploadError) {
        console.warn("Fallo subida a 'imagenes', intentando crear bucket...", uploadError.message);
        
        // Intentar crear el bucket 'imagenes' públicamente
        const { error: bucketError } = await supabase.storage.createBucket('imagenes', { public: true });
        
        if (!bucketError) {
          // Reintentar subir
          const { error: retryError } = await supabase.storage
            .from('imagenes')
            .upload(filePath, file);
          
          if (retryError) throw retryError;
        } else {
          // Intentar subir al bucket 'productos' como fallback
          let { error: prodBucketError } = await supabase.storage
            .from('productos')
            .upload(filePath, file);
          
          if (prodBucketError) {
            throw new Error("No se pudo subir la imagen. Por favor, crea un bucket llamado 'imagenes' de acceso público en el panel de Supabase Storage. Detalle del error: " + uploadError.message);
          } else {
            // Caso exitoso en bucket 'productos'
            const { data } = supabase.storage.from('productos').getPublicUrl(filePath);
            const publicUrl = data.publicUrl;
            if (pestanaActiva === "productos") {
              setImagenesList(prev => [...prev, publicUrl]);
            } else {
              setImagenGenerica(publicUrl);
            }
            alert("¡Imagen subida con éxito al bucket de fallback 'productos'!");
            return;
          }
        }
      }

      // Obtener URL pública de 'imagenes'
      const { data } = supabase.storage.from('imagenes').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;
      if (pestanaActiva === "productos") {
        setImagenesList(prev => [...prev, publicUrl]);
      } else {
        setImagenGenerica(publicUrl);
      }
      alert("¡Imagen subida con éxito!");
    } catch (err) {
      alert("Error al subir archivo: " + err.message);
      console.error(err);
    } finally {
      setSubiendoImagen(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!id) return;
    if (confirm(`¿Eliminar permanentemente de la tabla ${pestanaActiva}?`)) {
      try {
        const nombreDeLaTabla = pestanaActiva === "productos" ? "productos" : "plantillas";
        const { error } = await supabase.from(nombreDeLaTabla).delete().eq('id', id);
        if (error) throw error;
        await cargarDatos();
        if (onProductoCambiado) onProductoCambiado();
      } catch (err) {
        alert("No se pudo eliminar: " + err.message);
      }
    }
  };

  if (!sesion) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center font-sans p-4 relative z-10">
        <form onSubmit={handleLogin} className="bg-white/70 backdrop-blur-md border border-white/60 p-8 rounded-[32px] shadow-2xl max-w-sm w-full space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-[#9E1B41]" style={{ fontFamily: 'Playfair Display, serif' }}>Crave Details</h2>
            <span className="bg-[#E71B4F] text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Modo Administrador 🔐
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Correo Electrónico</label>
              <input type="email" placeholder="ejemplo@crave.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl text-neutral-800 focus:outline-[#E71B4F] bg-white/80" required />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Contraseña</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl text-neutral-800 focus:outline-[#E71B4F] bg-white/80" required />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#E71B4F] text-white p-3 rounded-xl font-black uppercase tracking-wider text-xs shadow-sm hover:bg-[#d01443] transition-colors">
            Iniciar Sesión
          </button>
          
          <button type="button" onClick={() => setEsAdminView(false)} className="w-full text-neutral-400 hover:text-neutral-600 text-xs font-bold text-center block hover:underline">
            Volver a la Tienda
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full py-4 md:py-8 font-sans text-neutral-800 relative z-10">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Superior */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/70 backdrop-blur-md p-6 rounded-[32px] shadow-sm border border-white/60 gap-4">
          <div>
            <h1 className="text-2xl font-black text-neutral-800">Panel Base de Datos 🗄️</h1>
            <p className="text-gray-500 text-xs">Administra tus tablas físicas y digitales de forma aislada</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={() => setEsAdminView(false)} className="bg-neutral-200/70 hover:bg-neutral-200 text-neutral-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors">Ver Tienda</button>
            <button onClick={handleLogout} className="bg-[#E71B4F] hover:bg-[#d01443] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors">Cerrar Sesión</button>
          </div>
        </div>

        {/* Selector de pestañas */}
        <div className="flex gap-2 border-b border-gray-200 pb-px">
          <button 
            type="button"
            onClick={() => { setPestanaActiva("productos"); limpiarFormulario(); }}
            className={`px-5 py-2.5 rounded-t-xl text-xs font-black uppercase tracking-wider border-t border-x transition-all ${
              pestanaActiva === "productos" ? "bg-white border-gray-200 text-pink-600 shadow-sm" : "bg-gray-100/60 border-transparent text-gray-400 hover:text-neutral-700"
            }`}
          >
            📦 Tabla: Productos Físicos
          </button>
          <button 
            type="button"
            onClick={() => { setPestanaActiva("plantillas"); limpiarFormulario(); }}
            className={`px-5 py-2.5 rounded-t-xl text-xs font-black uppercase tracking-wider border-t border-x transition-all ${
              pestanaActiva === "plantillas" ? "bg-white border-gray-200 text-purple-600 shadow-sm" : "bg-gray-100/60 border-transparent text-gray-400 hover:text-neutral-700"
            }`}
          >
            💻 Tabla: Plantillas Digitales
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Formulario */}
          <div className="lg:col-span-1">
            <form onSubmit={handleGuardar} className="bg-white/75 backdrop-blur-md p-6 rounded-[32px] shadow-sm space-y-4 sticky top-24 border border-white/60">
              <h3 className="font-black text-sm uppercase tracking-wider text-gray-400">
                {editandoId ? "✏️ Modificar" : "➕ Agregar"} {pestanaActiva === "productos" ? "Producto Físico" : "Plantilla Digital"}
              </h3>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Nombre del Item</label>
                <input type="text" value={nombreGenerico} onChange={(e) => setNombreGenerico(e.target.value)} className="w-full border p-3 rounded-xl focus:outline-pink-400 text-sm text-black bg-white" required />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Precio ($)</label>
                  <input type="number" value={precioGenerico} onChange={(e) => setPrecioGenerico(e.target.value)} className="w-full border p-3 rounded-xl focus:outline-pink-400 text-sm text-black bg-white" required />
                </div>
                
                {pestanaActiva === "productos" ? (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase">Stock</label>
                    {/* 🌟 AQUÍ ESTÁ LA CORRECCIÓN CLAVE: setCantidad en lugar de setBadge */}
                    <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} className="w-full border p-3 rounded-xl focus:outline-pink-400 text-sm text-black bg-white" />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase">Formato</label>
                    <input type="text" value={format} onChange={(e) => setFormat(e.target.value)} className="w-full border p-3 rounded-xl focus:outline-pink-400 text-sm font-mono font-bold text-black bg-white" required />
                  </div>
                )}
              </div>

              {pestanaActiva === "plantillas" && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase">Dificultad</label>
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full border p-3 rounded-xl focus:outline-pink-400 text-sm bg-white font-bold text-neutral-700">
                      <option value="Fácil">🟢 Fácil</option>
                      <option value="Medio">🟡 Medio</option>
                      <option value="Difícil">🔴 Difícil</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase">Descripción</label>
                    <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-3 rounded-xl focus:outline-pink-400 text-xs text-black bg-white" required />
                  </div>
                </>
              )}

              {pestanaActiva === "productos" && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase">Categoría</label>
                    <input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full border p-3 rounded-xl focus:outline-pink-400 text-sm text-black bg-white" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase">Descripción</label>
                    <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-3 rounded-xl focus:outline-pink-400 text-xs text-black bg-white" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase">Hashtags / Etiquetas</label>
                    <input type="text" placeholder="Ej: #cajas #hotwheels #amor" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full border p-3 rounded-xl focus:outline-pink-400 text-sm text-black bg-white" />
                  </div>

                  {/* Gestor de Specs (Lo que incluye el detalle) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase block mb-1">¿Qué incluye el detalle? ({specsList.length})</label>
                    {specsList.length > 0 && (
                      <div className="space-y-1.5 p-2 bg-gray-50 rounded-2xl border border-gray-100 max-h-[140px] overflow-y-auto">
                        {specsList.map((spec, index) => (
                          <div key={index} className="flex justify-between items-center bg-white px-3 py-1.5 rounded-lg border border-rose-100/50 shadow-xs">
                            <span className="text-xs text-neutral-700 font-medium select-none">{spec}</span>
                            <button 
                              type="button" 
                              onClick={() => eliminarSpec(index)}
                              className="text-red-500 hover:text-red-700 font-bold text-xs px-1"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Ej: Oso de felpa mini, Globo HBD..." 
                        value={specNueva} 
                        onChange={(e) => setSpecNueva(e.target.value)} 
                        className="flex-1 border p-2.5 rounded-xl focus:outline-pink-400 text-xs text-black bg-white/80" 
                      />
                      <button 
                        type="button" 
                        onClick={agregarSpec} 
                        className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 rounded-xl text-xs font-bold transition-colors"
                      >
                        Añadir
                      </button>
                    </div>
                  </div>

                  {/* Configuración de Precios por Variante (Ramos y Cuadros) */}
                  <div className="space-y-3 border-t border-gray-100 pt-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Tipo de Opciones / Variantes</label>
                      <select 
                        value={tipoVariante} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setTipoVariante(val);
                          if (val !== "ninguno") {
                            const basePrice = precioGenerico || 0;
                            const newPrices = {};
                            const keys = val === "ramo" 
                              ? ["Rojo", "Rosado", "Azul", "Morado", "Amarillo", "Blanco"]
                              : ["10x15", "13x18", "15x20", "20x30"];
                            keys.forEach(k => {
                              newPrices[k] = basePrice;
                            });
                            setPreciosVariantes(newPrices);
                          } else {
                            setPreciosVariantes({});
                          }
                        }}
                        className="w-full border p-3 rounded-xl focus:outline-pink-400 text-sm bg-white font-bold text-neutral-700"
                      >
                        <option value="ninguno">Ninguno (Precio Fijo)</option>
                        <option value="ramo">Ramo (Precio por Color)</option>
                        <option value="cuadro">Retrato/Cuadro (Precio por Tamaño)</option>
                      </select>
                    </div>

                    {tipoVariante === "ramo" && (
                      <div className="space-y-2 bg-[#FFFDF5]/40 p-3 rounded-2xl border border-rose-100/10">
                        <span className="text-[10px] uppercase font-black text-rose-500 block">Precios por Color ($):</span>
                        <div className="grid grid-cols-2 gap-2">
                          {["Rojo", "Rosado", "Azul", "Morado", "Amarillo", "Blanco"].map((color) => (
                            <div key={color} className="space-y-0.5">
                              <label className="text-[10px] font-bold text-gray-500">{color}</label>
                              <input 
                                type="number" 
                                placeholder="Ej: 25000" 
                                value={preciosVariantes[color] || ""} 
                                onChange={(e) => setPreciosVariantes(prev => ({ ...prev, [color]: e.target.value }))}
                                className="w-full border p-2 rounded-xl focus:outline-pink-400 text-xs text-black bg-white" 
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {tipoVariante === "cuadro" && (
                      <div className="space-y-2 bg-[#FFFDF5]/40 p-3 rounded-2xl border border-rose-100/10">
                        <span className="text-[10px] uppercase font-black text-rose-500 block">Precios por Tamaño ($):</span>
                        <div className="grid grid-cols-2 gap-2">
                          {["10x15", "13x18", "15x20", "20x30"].map((size) => (
                            <div key={size} className="space-y-0.5">
                              <label className="text-[10px] font-bold text-gray-500">{size}</label>
                              <input 
                                type="number" 
                                placeholder="Ej: 15000" 
                                value={preciosVariantes[size] || ""} 
                                onChange={(e) => setPreciosVariantes(prev => ({ ...prev, [size]: e.target.value }))}
                                className="w-full border p-2 rounded-xl focus:outline-pink-400 text-xs text-black bg-white" 
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Gestor de Múltiples Imágenes para Productos */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Imágenes del Producto ({imagenesList.length})</label>
                    {imagenesList.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 p-2 bg-gray-50 rounded-2xl border border-gray-100 max-h-[160px] overflow-y-auto">
                        {imagenesList.map((imgUrl, index) => (
                          <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-rose-100 bg-white shadow-xs group">
                            <img src={imgUrl} alt={`Previa ${index}`} className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              onClick={() => setImagenesList(prev => prev.filter((_, i) => i !== index))}
                              className="absolute top-0.5 right-0.5 bg-red-500 hover:bg-red-600 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] shadow"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      {/* File Selector */}
                      <div className="relative border border-dashed border-rose-200/60 rounded-xl p-3 bg-white/50 flex flex-col items-center justify-center cursor-pointer hover:bg-white/80 transition-colors">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange} 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={subiendoImagen}
                        />
                        <span className="text-xs text-neutral-500 font-bold text-center">
                          {subiendoImagen ? "⏳ Subiendo archivo..." : "📁 Subir desde dispositivo"}
                        </span>
                      </div>
                      
                      {/* Fallback Text Input */}
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Pega una URL de imagen..." 
                          value={urlNueva} 
                          onChange={(e) => setUrlNueva(e.target.value)} 
                          className="flex-1 border p-2.5 rounded-xl focus:outline-pink-400 text-xs text-black bg-white/80" 
                        />
                        <button 
                          type="button" 
                          onClick={agregarUrlImagen} 
                          className="bg-neutral-900 hover:bg-neutral-800 text-white px-3 rounded-xl text-xs font-bold transition-colors"
                        >
                          Añadir
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {pestanaActiva === "plantillas" && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Imagen de la Plantilla</label>
                  <div className="flex flex-col gap-2">
                    {/* File Selector */}
                    <div className="relative border border-dashed border-rose-200/60 rounded-xl p-3 bg-white/50 flex flex-col items-center justify-center cursor-pointer hover:bg-white/80 transition-colors">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={subiendoImagen}
                      />
                      <span className="text-xs text-neutral-500 font-bold text-center">
                        {subiendoImagen ? "⏳ Subiendo archivo..." : "📁 Subir desde dispositivo"}
                      </span>
                    </div>
                    
                    {/* Fallback Text Input */}
                    <input 
                      type="text" 
                      placeholder="O pega una URL de imagen..." 
                      value={imagenGenerica} 
                      onChange={(e) => setImagenGenerica(e.target.value)} 
                      className="w-full border p-3 rounded-xl focus:outline-pink-400 text-xs text-black bg-white/80" 
                    />
                  </div>
                  {imagenGenerica && (
                    <div className="mt-2 relative w-16 h-16 rounded-xl overflow-hidden border border-rose-100 bg-white/80 flex items-center justify-center">
                      <img src={imagenGenerica} alt="Vista previa" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setImagenGenerica("")}
                        className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 rounded-bl hover:bg-red-600 text-[9px] flex items-center justify-center font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 flex flex-col gap-2">
                <button type="submit" className={`w-full text-white p-3 rounded-xl font-black uppercase tracking-wider text-xs shadow-sm transition-colors ${pestanaActiva === 'productos' ? 'bg-pink-500 hover:bg-pink-600' : 'bg-purple-600 hover:bg-purple-700'}`}>
                  {editandoId ? "Guardar Cambios" : `Agregar ${pestanaActiva === "productos" ? "Producto" : "Plantilla"}`}
                </button>
                {editandoId && <button type="button" onClick={limpiarFormulario} className="bg-gray-100 text-gray-500 py-2 rounded-xl text-xs font-bold hover:bg-gray-200">Cancelar</button>}
              </div>
            </form>
          </div>

          {/* Grilla de Visualización */}
          <div className="lg:col-span-2 bg-white/75 backdrop-blur-md p-6 rounded-[32px] shadow-sm border border-white/60">
            <h3 className="font-black text-lg text-neutral-800 mb-4 uppercase tracking-wide">
              {pestanaActiva === "productos" ? "📦 Productos Físicos Registrados" : "💻 Plantillas Digitales Registradas"} ({itemsAMostrar.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
              {itemsAMostrar.map((item) => (
                <div 
                  key={`${pestanaActiva}-item-${item.id}`} 
                  className={`p-4 border rounded-xl flex flex-col justify-between transition-all ${
                    pestanaActiva === 'plantillas' ? 'bg-purple-50/10 border-purple-100' : 'bg-white border-gray-100'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-50 border relative">
                      <img 
                        src={(pestanaActiva === 'productos' ? (item.imagenesList && item.imagenesList[0] || item.imagen) : item.image) || "https://placehold.co/400x300?text=Crave+Details"} 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                      {pestanaActiva === 'plantillas' && (
                        <span className="absolute top-2 right-2 text-[9px] font-bold bg-purple-600 text-white px-2 py-0.5 rounded shadow">
                          💪 {item.difficulty}
                        </span>
                      )}
                    </div>
                    <div>
                      {pestanaActiva === "productos" && (
                        <>
                          <span className="text-[10px] font-black uppercase text-neutral-400">{item.categoria}</span>
                          <h4 className="font-bold text-neutral-800 text-sm line-clamp-1">
                            {item.nombre}
                          </h4>
                          <p className="text-xs font-black text-neutral-900 mt-1">
                            ${(parseFloat(item.precio) || 0).toLocaleString('es-CO')}
                          </p>
                          {item.description && <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">{item.description}</p>}
                          {item.tags && <p className="text-[10px] text-pink-500 font-mono mt-1">{item.tags}</p>}
                        </>
                      )}
                      {pestanaActiva === "plantillas" && (
                        <>
                          <h4 className="font-bold text-neutral-800 text-sm line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-xs font-black text-neutral-900 mt-1">
                            ${(parseFloat(item.price) || 0).toLocaleString('es-CO')}
                          </p>
                          <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">{item.description}</p>
                          <p className="text-[10px] text-neutral-500 font-mono mt-1">Formato: <b>{item.format}</b></p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-2 border-t border-gray-50">
                    <button type="button" onClick={() => activarEdicion(item)} className="bg-amber-400 text-white py-1.5 rounded-lg text-xs font-bold hover:bg-amber-500">Editar</button>
                    <button type="button" onClick={() => handleEliminar(item.id)} className="bg-rose-50 text-rose-600 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-100">Borrar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}