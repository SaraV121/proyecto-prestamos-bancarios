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
      <h2>Registrar Usuario</h2>

      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={register}>
        Registrarse
      </button>

      <br /><br />

      <button onClick={volverLogin}>
        Volver al login
      </button>
    </div>
  );
}

export default Registro;