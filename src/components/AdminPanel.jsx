import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; 

export default function AdminPanel({ productos, setEsAdminView }) {
  // Estados para el Login
  const [sesion, setSesion] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Estado local para almacenar el catálogo de productos
  const [listaProductos, setListaProductos] = useState([]);

  // Estados para el formulario de administración
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [nuevaImagen, setNuevaImagen] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [nuevaCantidad, setNuevaCantidad] = useState(""); 
  const [editandoId, setEditandoId] = useState(null);

  // Consultar directamente a Supabase al cargar el componente
  useEffect(() => {
    const cargarDirecto = async () => {
      try {
        const { data, error } = await supabase.from('productos').select('*');
        if (error) {
          console.error("Error consultando a Supabase:", error.message);
        } else if (data) {
          setListaProductos(data);
        }
      } catch (err) {
        console.error("Error en la conexión:", err);
      }
    };
    
    cargarDirecto();
  }, [productos]);

  // Manejo de Inicio de Sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Error de autenticación: " + error.message);
    } else {
      setSesion(data.session);
    }
  };

  // Manejo de Cierre de Sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSesion(null);
  };

  // Insertar o Actualizar Productos en la base de datos
  const guardarProducto = async (e) => {
    e.preventDefault();
    
    // Objeto base con las columnas confirmadas que tienes en Supabase
    const payload = {
      nombre: nuevoNombre,
      precio: parseFloat(nuevoPrecio),
      imagen: nuevaImagen,
      categoria: nuevaCategoria
    };

    // NOTA: Si en el futuro agregas la columna 'cantidad' por SQL Editor, 
    // puedes descomentar la siguiente línea de código:
    // payload.cantidad = parseInt(nuevaCantidad) || 0;

    if (editandoId) {
      const { error } = await supabase.from('productos').update(payload).eq('id', editandoId);
      if (error) alert("Error al editar: " + error.message);
    } else {
      const { error } = await supabase.from('productos').insert([payload]);
      if (error) alert("Error al agregar: " + error.message);
    }

    cancelarEdicion();
    // Volver a consultar para refrescar la grilla visual de inmediato
    const { data } = await supabase.from('productos').select('*');
    if (data) setListaProductos(data);
  };

  const activarEdicion = (prod) => {
    setEditandoId(prod.id);
    setNuevoNombre(prod.nombre || "");
    setNuevoPrecio(prod.precio || "");
    setNuevaImagen(prod.imagen || "");
    setNuevaCategoria(prod.categoria || "");
    setNuevaCantidad(prod.cantidad || "0");
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setNuevoNombre("");
    setNuevoPrecio("");
    setNuevaImagen("");
    setNuevaCategoria("");
    setNuevaCantidad("");
  };

  const eliminarProducto = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto permanentemente?")) {
      const { error } = await supabase.from('productos').delete().eq('id', id);
      if (error) {
        alert("Error al eliminar: " + error.message);
      } else {
        const { data } = await supabase.from('productos').select('*');
        if (data) setListaProductos(data);
      }
    }
  };

  // VISTA 1: INTERFAZ DE LOGIN DE ADMINISTRADOR
  if (!sesion) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center font-sans p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full space-y-4">
          <h2 className="text-2xl font-black text-center text-pink-600">Admin Crave Details 🌟</h2>
          <p className="text-gray-500 text-sm text-center">Ingresa tus credenciales para administrar la tienda</p>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Correo Electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded-xl focus:outline-pink-400" required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 rounded-xl focus:outline-pink-400" required />
          </div>
          <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-xl font-bold transition shadow-sm">Ingresar</button>
          <button type="button" onClick={() => setEsAdminView(false)} className="w-full text-gray-500 text-sm hover:underline text-center block">Volver a la Tienda</button>
        </form>
      </div>
    );
  }

  // VISTA 2: PANEL OPERATIVO CON GRId INTERACTIVO
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Barra superior */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm gap-4">
          <div>
            <h1 className="text-3xl font-black text-neutral-800">Control de Inventario 📦</h1>
            <p className="text-gray-500 text-sm">Gestiona tus productos y contenidos en tiempo real</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={() => setEsAdminView(false)} className="flex-1 sm:flex-initial bg-neutral-200 text-neutral-700 px-5 py-2.5 rounded-xl font-bold hover:bg-neutral-300 transition">Ver Tienda</button>
            <button onClick={handleLogout} className="flex-1 sm:flex-initial bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-600 transition">Cerrar Sesión</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Formulario lateral */}
          <div className="lg:col-span-1">
            <form onSubmit={guardarProducto} className="bg-white p-6 rounded-2xl shadow-sm space-y-4 sticky top-6 border border-gray-100">
              <h3 className="font-black text-lg text-neutral-800">
                {editandoId ? "✏️ Editando Producto" : "➕ Nuevo Producto"}
              </h3>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Nombre</label>
                <input type="text" placeholder="Ej: Desayuno Sorpresa Amor" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} className="w-full border p-3 rounded-xl focus:outline-pink-400" required />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Precio ($)</label>
                  <input type="number" placeholder="Ej: 85000" value={nuevoPrecio} onChange={(e) => setNuevoPrecio(e.target.value)} className="w-full border p-3 rounded-xl focus:outline-pink-400" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Stock (Cant.)</label>
                  <input type="number" placeholder="Ej: 15" value={nuevaCantidad} onChange={(e) => setNuevaCantidad(e.target.value)} className="w-full border p-3 rounded-xl focus:outline-pink-400" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Enlace Imagen (URL)</label>
                <input type="text" placeholder="https://..." value={nuevaImagen} onChange={(e) => setNuevaImagen(e.target.value)} className="w-full border p-3 rounded-xl focus:outline-pink-400" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Categoría</label>
                <input type="text" placeholder="Ej: Desayunos" value={nuevaCategoria} onChange={(e) => setNuevaCategoria(e.target.value)} className="w-full border p-3 rounded-xl focus:outline-pink-400" required />
              </div>

              <div className="pt-2 space-y-2">
                <button type="submit" className="w-full bg-pink-500 text-white p-3.5 rounded-xl font-bold hover:bg-pink-600 transition shadow-sm">
                  {editandoId ? "Guardar Cambios" : "Agregar al Catálogo"}
                </button>
                {editandoId && (
                  <button type="button" onClick={cancelarEdicion} className="w-full bg-neutral-100 text-neutral-600 p-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-200 transition">
                    Cancelar Edición
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Grilla de tarjetas conectadas con tolerancia a nulos */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-black text-xl text-neutral-800 mb-4">Catálogo en la Nube ({listaProductos.length} items)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[650px] overflow-y-auto pr-2">
                {listaProductos.map((prod) => (
                  <div key={prod.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                    <div className="space-y-3">
                      <div className="relative w-full h-40 rounded-xl overflow-hidden bg-neutral-50 border border-neutral-100">
                        <img 
                          src={prod.imagen || "https://placehold.co/400x300?text=Sin+Imagen"} 
                          alt={prod.nombre || "Producto"} 
                          className="w-full h-full object-cover" 
                        />
                        <span className="absolute top-2 left-2 text-[10px] bg-neutral-900/80 text-white font-mono px-2 py-0.5 rounded-md">
                          ID: {prod.id ? prod.id.toString().slice(0, 8) : "---"}...
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-black text-pink-500 uppercase tracking-wider">{prod.categoria || "General"}</span>
                        <h4 className="font-bold text-lg text-neutral-800 leading-tight mt-0.5">{prod.nombre || "Sin Nombre"}</h4>
                      </div>
                      
                      {/* Desglose de variables estilo terminal de desarrollo */}
                      <div className="bg-neutral-900 text-neutral-300 font-mono text-[11px] p-3 rounded-xl space-y-1 border border-neutral-800 shadow-inner">
                        <p><span className="text-blue-400">const</span> <span className="text-yellow-300">detalles</span> = {"{"}</p>
                        <p className="pl-4"><span className="text-purple-400">precio</span>: <span className="text-emerald-400">{prod.precio || 0}</span>,</p>
                        <p className="pl-4"><span className="text-purple-400">stock</span>: <span className="text-emerald-400">{prod.cantidad !== undefined ? prod.cantidad : 0}</span></p>
                        <p>{"}"};</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-50">
                      <button onClick={() => activarEdicion(prod)} className="w-full bg-amber-400 hover:bg-amber-500 text-white py-2 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-sm">⚙️ Modificar</button>
                      <button onClick={() => eliminarProducto(prod.id)} className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition">🗑️ Eliminar</button>
                    </div>
                  </div>
                ))}
                {listaProductos.length === 0 && (
                  <p className="text-gray-400 text-center py-8 col-span-2">No se encontraron productos. Por favor desactiva la directiva RLS en Supabase y recarga.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}