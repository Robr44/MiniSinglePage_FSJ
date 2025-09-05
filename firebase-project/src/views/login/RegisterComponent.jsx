import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../repositories/config";
import { Link, useNavigate } from "react-router-dom";

//  validación con Yup
const schema = yup.object({
  email: yup.string().email("Formato incorrecto").required("Correo es requerido"),
  password: yup.string()
    .required("Contraseña requerida")
    .min(8, "Mínimo 8 caracteres")
    .matches(/[A-Z]/, "Debe tener una letra mayúscula")
    .matches(/[a-z]/, "Debe tener una letra minúscula")
    .matches(/[0-9]/, "Debe tener un número")
    .matches(/[!@#$%&*?.,_:<>"|]/, "Debe tener un caracter especial"),
  confirm_password: yup.string()
    .oneOf([yup.ref("password"), null], "Las contraseñas no coinciden")
});

export const RegisterComponent = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const [registerError, setRegisterError] = useState("");
  const navigate = useNavigate();

  // Función al enviar el formulario
  const onSubmit = data => {
    setRegisterError("");
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(() => navigate("/"))
      .catch(() => setRegisterError("Error al registrar el usuario"));
  };

  return (
    <section className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "#1e1e2f" }}>
      <div className="card p-4" style={{ width: 350, backgroundColor: "#2c2c3e", color: "#fff", borderRadius: 10 }}>
        <h3 className="text-center mb-4">Registrarse</h3>
        {/* Formulario para Registrar */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label>Correo:</label>
            <input type="email" className="form-control" {...register("email")} />
            <p className="text-danger">{errors.email?.message}</p>
          </div>
          <div className="mb-3">
            <label>Contraseña:</label>
            <input type="password" className="form-control" {...register("password")} />
            <p className="text-danger">{errors.password?.message}</p>
          </div>

          <div className="mb-3">
            <label>Confirmar Contraseña:</label>
            <input type="password" className="form-control" {...register("confirm_password")} />
            <p className="text-danger">{errors.confirm_password?.message}</p>
          </div>

          {registerError && <p className="text-danger text-center">{registerError}</p>}

            {/* Botón enviar */}
          <button type="submit" className="btn btn-primary w-100">Registrarse</button>
        </form>
            {/* Regresar a Login */}
        <p className="mt-3 text-center">
          ¿Ya tienes cuenta? <Link to="/" style={{ color: "#4ea8de" }}>Inicia sesión aquí</Link>
        </p>
      </div>
    </section>
  );
};
