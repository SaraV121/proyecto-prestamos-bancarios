import { useState } from "react";
import axios from "axios";

function Registro({ volverLogin }) {

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState("");

  const checkPasswordStrength = (value) => {

    if (value.length < 6) {
      setStrength("Débil");
    } else if (
      value.match(/[a-z]/) &&
      value.match(/[0-9]/)
    ) {
      setStrength("Intermedia");
    }

    if (
      value.match(/[A-Z]/) &&
      value.match(/[0-9]/) &&
      value.match(/[^A-Za-z0-9]/) &&
      value.length >= 8
    ) {
      setStrength("Fuerte");
    }
  };

  const register = async () => {

    if (!nombre || !correo || !password) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(correo)) {
      alert("Correo electrónico inválido");
      return;
    }

    if (strength === "Débil") {
      alert("La contraseña es muy débil");
      return;
    }

    try {

      await axios.post(
        "https://proyecto-prestamos-bancarios.onrender.com/users",
        {
          nombre,
          correo,
          password,
          rol: "empleado",
        }
      );

      alert("Usuario registrado");

      volverLogin();

    } catch (error) {

      console.error(error);
      alert("Error al registrar");

    }
  };

  return (
  <div style={loginContainer}>
    <div style={loginCard}>

      <h1>Sistema Bancario</h1>

      <hr />

      <h2>Registrar Usuario</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        style={inputStyle}
      />

      <input
        type="email"
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        style={inputStyle}
      />

      <input
        type={showPassword ? "text" : "password"}
        placeholder="Contraseña"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          checkPasswordStrength(e.target.value);
        }}
        style={inputStyle}
      />

      <p>
        Fortaleza:
        <strong> {strength}</strong>
      </p>

      <label>
        <input
          type="checkbox"
          checked={showPassword}
          onChange={(e) =>
            setShowPassword(e.target.checked)
          }
        />
        Mostrar contraseña
      </label>

      <br /><br />

      <button
        onClick={register}
        style={buttonStyle}
      >
        Registrarse
      </button>

      <p
        style={{
          marginTop: "15px",
          color: "#3b82f6",
          cursor: "pointer"
        }}
        onClick={volverLogin}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </p>

    </div>
  </div>
);
}

const loginContainer = {
  minHeight: "100vh",
  backgroundColor: "#06153A",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const loginCard = {
  backgroundColor: "#1E2A44",
  padding: "40px",
  borderRadius: "20px",
  width: "400px",
  textAlign: "center",
  color: "white",
};

const inputStyle = {
  width: "90%",
  padding: "12px",
  marginTop: "10px",
  borderRadius: "8px",
  border: "none",
};

const buttonStyle = {
  width: "96%",
  padding: "12px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default Registro;