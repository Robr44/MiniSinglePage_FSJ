import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../repositories/config";
import { Link, useNavigate } from "react-router-dom";

// validación con Yup
const schema = yup.object({
  email: yup.string().email("Formato incorrecto").required("Email requerido"),
  password: yup.string().required("Contraseña requerida").min(8, "Mínimo 8 caracteres")
});

export const LoginComponent = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  // al enviar el formulario para iniciar sesión se ejecuta esta función
  const onSubmit = data => {
    setLoginError("");
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => navigate("/products"))
      .catch(() => setLoginError("Usuario o contraseña incorrecta"));
  };

  return (
    <section className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "#1e1e2f" }}>
      <div className="card p-4" style={{ width: 350, backgroundColor: "#2c2c3e", color: "#fff", borderRadius: 10 }}>
        <h3 className="text-center mb-4">Sign in</h3>
        {/* Formulario para Login */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label>Email:</label>
            <input type="email" className="form-control" {...register("email")} />
            <p className="text-danger">{errors.email?.message}</p>
          </div>

          <div className="mb-3">
            <label>Contraseña:</label>
            <input type="password" className="form-control" {...register("password")} />
            <p className="text-danger">{errors.password?.message}</p>
          </div>

          {loginError && <p className="text-danger text-center">{loginError}</p>}
          {/* Botón Login */}
          <button type="submit" className="btn btn-primary w-100">Entrar</button>
        </form>
        {/* Ir  a Registrarse */}
        <p className="mt-3 text-center">
          ¿No tienes cuenta? <Link to="/register" style={{ color: "#4ea8de" }}>Regístrate aquí</Link>
        </p>
      </div>
    </section>
  );
};
