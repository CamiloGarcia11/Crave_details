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
  const [format, setFormat] = useState("PDF");
  const [difficulty, setDifficulty] = useState("Fácil"); 

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

  // Obtiene la lista combinada para mostrar y editar en el panel administrativo
  const obtenerItemsCombinados = () => {
    if (pestanaActiva === "productos") {
      const finalProductos = [];
      const mergedDbIds = new Set();
      const mergedDbNombres = new Set();

      // Mocks de la página
      PRODUCTOS_MOCK.forEach((mockItem) => {
        const dbMatch = listaProductos.find(
          (p) => (p.id === mockItem.id) || (p.nombre === mockItem.name || p.name === mockItem.name)
        );
        if (dbMatch) {
          mergedDbIds.add(dbMatch.id);
          if (dbMatch.nombre) mergedDbNombres.add(dbMatch.nombre.trim().toLowerCase());
          if (dbMatch.name) mergedDbNombres.add(dbMatch.name.trim().toLowerCase());

          finalProductos.push({
            ...mockItem,
            id: dbMatch.id, // Usar el ID de la base de datos
            nombre: dbMatch.nombre || dbMatch.name || mockItem.name,
            precio: dbMatch.precio !== undefined ? dbMatch.precio : (dbMatch.price !== undefined ? dbMatch.price : mockItem.price),
            imagen: dbMatch.imagen || dbMatch.image || mockItem.image,
            categoria: dbMatch.categoria || dbMatch.category || mockItem.category,
            cantidad: dbMatch.cantidad || 0,
            description: dbMatch.descripcion || dbMatch.description || mockItem.description || "",
            tags: dbMatch.formatos || dbMatch.tags || mockItem.tags || "",
            existeEnBD: true
          });
        } else {
          finalProductos.push({
            ...mockItem,
            nombre: mockItem.name,
            precio: mockItem.price,
            imagen: mockItem.image,
            categoria: mockItem.category,
            cantidad: 0,
            existeEnBD: false
          });
        }
      });

      // Nuevos productos en la BD
      listaProductos.forEach((dbItem) => {
        const dbId = dbItem.id;
        const dbNombre = (dbItem.nombre || dbItem.name || "").trim().toLowerCase();

        const yaProcesado = mergedDbIds.has(dbId) || mergedDbNombres.has(dbNombre);

        if (!yaProcesado) {
          finalProductos.push({
            id: dbItem.id,
            nombre: dbItem.nombre || dbItem.name,
            precio: dbItem.precio !== undefined ? dbItem.precio : (dbItem.price !== undefined ? dbItem.price : 0),
            imagen: dbItem.imagen || dbItem.image,
            categoria: dbItem.categoria || dbItem.category,
            cantidad: dbItem.cantidad || 0,
            description: dbItem.descripcion || dbItem.description || "",
            tags: dbItem.formatos || dbItem.tags || "",
            existeEnBD: true
          });
        }
      });

      return finalProductos;
    } else {
      // Para plantillas
      const finalPlantillas = [];
      const mergedDbIds = new Set();
      const mergedDbNombres = new Set();

      PLANTILLAS_MOCK.forEach((mockItem) => {
        const dbMatch = listaPlantillas.find(
          (p) => (p.id === mockItem.id) || (p.nombre === mockItem.name || p.name === mockItem.name)
        );
        if (dbMatch) {
          mergedDbIds.add(dbMatch.id);
          if (dbMatch.nombre) mergedDbNombres.add(dbMatch.nombre.trim().toLowerCase());
          if (dbMatch.name) mergedDbNombres.add(dbMatch.name.trim().toLowerCase());

          finalPlantillas.push({
            ...mockItem,
            id: dbMatch.id,
            name: dbMatch.nombre || dbMatch.name || mockItem.name,
            price: dbMatch.precio !== undefined ? dbMatch.precio : (dbMatch.price !== undefined ? dbMatch.price : mockItem.price),
            image: dbMatch.imagen || dbMatch.image || mockItem.image,
            description: dbMatch.description || mockItem.description,
            format: dbMatch.format || mockItem.format,
            difficulty: dbMatch.difficulty || mockItem.difficulty,
            existeEnBD: true
          });
        } else {
          finalPlantillas.push({
            ...mockItem,
            existeEnBD: false
          });
        }
      });

      listaPlantillas.forEach((dbItem) => {
        const dbId = dbItem.id;
        const dbNombre = (dbItem.nombre || dbItem.name || "").trim().toLowerCase();

        const yaProcesado = mergedDbIds.has(dbId) || mergedDbNombres.has(dbNombre);

        if (!yaProcesado) {
          finalPlantillas.push({
            id: dbItem.id,
            name: dbItem.nombre || dbItem.name,
            price: dbItem.precio !== undefined ? dbItem.precio : (dbItem.price !== undefined ? dbItem.price : 0),
            image: dbItem.imagen || dbItem.image,
            description: dbItem.description || "Nueva plantilla.",
            format: dbItem.format || "PDF",
            difficulty: dbItem.difficulty || "Fácil",
            existeEnBD: true
          });
        }
      });

      return finalPlantillas;
    }
  };

  const itemsAMostrar = obtenerItemsCombinados();

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (pestanaActiva === "productos") {
        const payloadProd = { 
          nombre: nombreGenerico, 
          precio: parseFloat(precioGenerico) || 0, 
          imagen: imagenGenerica, 
          categoria, 
          cantidad: parseInt(cantidad) || 0,
          descripcion: description,
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
    } else {
      setNombreGenerico(item.name || "");
      setPrecioGenerico(item.price || "");
      setImagenGenerica(item.image || "");
      setDescription(item.description || "");
      setFormat(item.format || "PDF");
      setDifficulty(item.difficulty || "Fácil");
      setTags("");
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
            setImagenGenerica(data.publicUrl);
            alert("¡Imagen subida con éxito al bucket de fallback 'productos'!");
            return;
          }
        }
      }

      // Obtener URL pública de 'imagenes'
      const { data } = supabase.storage.from('imagenes').getPublicUrl(filePath);
      setImagenGenerica(data.publicUrl);
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

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase block mb-1">Imagen del Item</label>
                <div className="flex flex-col gap-2">
                  {/* File Selector */}
                  <div className="relative border border-dashed border-rose-200/60 rounded-2xl p-4 bg-white/50 flex flex-col items-center justify-center cursor-pointer hover:bg-white/80 transition-colors">
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
                </>
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
                  } ${!item.existeEnBD ? 'opacity-70 border-dashed border-pink-200 bg-pink-50/5' : ''}`}
                >
                  <div className="space-y-3">
                    <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-50 border relative">
                      <img 
                        src={(pestanaActiva === 'productos' ? item.imagen : item.image) || "https://placehold.co/400x300?text=Crave+Details"} 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                      {pestanaActiva === 'plantillas' && (
                        <span className="absolute top-2 right-2 text-[9px] font-bold bg-purple-600 text-white px-2 py-0.5 rounded shadow">
                          💪 {item.difficulty}
                        </span>
                      )}
                      {!item.existeEnBD && (
                        <span className="absolute top-2 left-2 text-[8px] font-black uppercase bg-pink-100 text-pink-700 px-2 py-0.5 rounded shadow-sm">
                          Fijo en Página 📌
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
                    {item.existeEnBD ? (
                      <button type="button" onClick={() => handleEliminar(item.id)} className="bg-rose-50 text-rose-600 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-100">Borrar</button>
                    ) : (
                      <span className="text-[10px] text-neutral-400 font-bold self-center text-center">No Borrable</span>
                    )}
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