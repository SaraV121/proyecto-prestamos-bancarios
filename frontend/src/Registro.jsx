import { useState } from "react";
import axios from "axios";

function Registro({ volverLogin }) {

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      await axios.post(
        "https://prestamos-backend.onrender.com/users",
        {
          nombre,
          correo,
          password,
        }
      );

      alert("Usuario registrado");

      volverLogin();

    } catch (error) {
      alert("Error al registrar");
    }
  };

  return (
    <div>
      <div>

        <h1>Sistema Bancario</h1>
        <hr />

        <h2>Registrar Usuario</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Correo"
          value={correoRegistro}
          onChange={(e) => setCorreoRegistro(e.target.value)}
          style={inputStyle}
        />

        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Contraseña"
          value={passwordRegistro}
          onChange={(e) => {
            setPasswordRegistro(e.target.value);
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
          onClick={registrarUsuario}
          style={buttonStyle}
        >
          Registrarse
        </button>

        <p
          style={{
            textAlign: 'center',
            marginTop: '15px',
            color: '#1976d2',
            cursor: 'pointer'
          }}
          onClick={() => setMostrarRegistro(false)}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </p>

      </div>
    </div>
  );
}

export default Registro;