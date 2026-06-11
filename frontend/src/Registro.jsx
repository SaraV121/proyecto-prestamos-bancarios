import { useState } from "react";
import axios from "axios";

function Registro({ volverLogin }) {

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {

    try {

      await axios.post(
        "https://proyecto-prestamos-bancarios.onrender.com/users",
        {
          nombre,
          correo,
          password,
          rol: "empleado"
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
    <div style={{ padding: "30px" }}>
      <h1>Sistema Bancario</h1>

      <h2>Registrar Usuario</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <br /><br />

      <input
        type="email"
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={register}>
        Registrarse
      </button>

      <br /><br />

      <button onClick={volverLogin}>
        Volver al Login
      </button>
    </div>
  );
}

export default Registro;