import { collection, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "../../repositories/config";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";


export const Products = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validación simple
  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "El nombre es obligatorio";
    if (!form.price) newErrors.price = "El precio es obligatorio";
    if (!form.stock) newErrors.stock = "El stock es obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Obtener productos
  const getProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Agregar producto
  const addProduct = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await addDoc(collection(db, "products"), {
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      setForm({ name: "", price: "", stock: "" });
      getProducts();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  // Cerrar sesión 
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };


  useEffect(() => {
    getProducts();
  }, []);

  return (
    <section
      className="d-flex flex-column align-items-center py-5"
      style={{ backgroundColor: "#1e1e2f", minHeight: "100vh" }}>

       {/* Botón de cerrar sesión */}
      <div className="w-100 d-flex justify-content-end px-5 mb-3">
        <button className="btn btn-outline-light" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
      {/* Formulario para agregar*/}
      <div
        className="card p-4 mb-5"
        style={{ width: 350, backgroundColor: "#2c2c3e", color: "#fff", borderRadius: 10 }}>
        <h3 className="text-center mb-4">Agregar Productos</h3>
        <form onSubmit={addProduct}>
          {/* Nombre */}
          <div className="mb-3">
            <label>Nombre</label>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}/>
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          {/* Precio */}
          <div className="mb-3">
            <label>Precio</label>
            <input
              type="number"
              className={`form-control ${errors.price ? "is-invalid" : ""}`}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}/>
            {errors.price && <div className="invalid-feedback">{errors.price}</div>}
          </div>

          {/* Stock */}
          <div className="mb-3">
            <label>Stock</label>
            <input
              type="number"
              className={`form-control ${errors.stock ? "is-invalid" : ""}`}
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}/>
            {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
          </div>

          <button className="btn btn-primary w-100">Agregar</button>
        </form>
      </div>

      {/* Tabla de productos */}
      {products.length === 0 ? (
        <p className="text-center text-muted">No hay productos aún</p>) : (
        <div className="table-responsive" style={{ width: "90%", maxWidth: 800 }}>
          <table className="table table-dark table-striped text-center" style={{ borderRadius: 10, overflow: "hidden" }}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>${p.price}</td>
                  <td>{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
