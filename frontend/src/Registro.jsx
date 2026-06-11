import { useState } from "react";
import axios from "axios";

function Registro({ volverLogin }) {

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const [strength, setStrength] = useState('');

  // =========================
  // REGISTER
  // =========================

  const register = async () => {

    if (
    !nombre ||
    !correo ||
    !password 
  ) {
    alert('Todos los campos son obligatorios');
    return;
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(correo)) {
      alert('Correo electrónico inválido');
      return;
    }
    if (strength === 'Débil') {
      alert('La contraseña es muy débil');
      return;
    }

    try {

      await axios.post(
        'https://proyecto-prestamos-bancarios.onrender.com/users',
        {
          nombre: nombre,
          correo: correo,
          password: password,
          rol: 'empleado',
        }
      );
      alert('Usuario registrado');

      volverLogin();

    } catch (error) {
      alert('Error al registrar');
    }
  };

  const checkPasswordStrength = (value) => {

  if (value.length < 6) {
    setStrength('Débil');
  } else if (
    value.match(/[a-z]/) &&
    value.match(/[0-9]/)
  ) {
    setStrength('Intermedia');
  }

  if (
    value.match(/[A-Z]/) &&
    value.match(/[0-9]/) &&
    value.match(/[^A-Za-z0-9]/) &&
    value.length >= 8
  ) {
    setStrength('Fuerte');
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
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ padding: '10px', width: '100%' }}
        />

        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          style={{ padding: '10px', width: '100%' }}
        />

        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Contraseña"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            checkPasswordStrength(e.target.value);
          }}
          style={{ padding: '10px', width: '100%' }}
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
          style={{padding: '10px', width: '100%', cursor: 'pointer'}}
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
          onClick={() => volverLogin()}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </p>

      </div>
    </div>
  );
}

export default Registro;