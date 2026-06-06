import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

  // =========================
  // STATES
  // =========================

  const [clients, setClients] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    ci: '',
    telefono: '',
    direccion: '',
    ingresos: '',
  });

  // LOGIN
  const [correo, setCorreo] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  // MENU
  const [section, setSection] = useState('dashboard');

  // REGISTER
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [correoRegistro, setCorreoRegistro] = useState('');
  const [passwordRegistro, setPasswordRegistro] = useState('');

  // PASSWORD STRENGTH
  const [strength, setStrength] = useState('');

  // =========================
  // VALIDAR CONTRASEÑA
  // =========================

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

  // =========================
  // LOGIN
  // =========================

  const login = async () => {

  if (!correo || !loginPassword) {
    alert('Complete todos los campos');
    return;
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(correo)) {
    alert('Correo inválido');
    return;
  }

  try {

    const res = await axios.post(
      'http://localhost:3000/auth/login',
      {
        correo,
        password: loginPassword,
      }
    );

    console.log(res.data);

    localStorage.setItem(
      'token',
      res.data.token
    );

    setIsLogged(true);

  } catch {

    alert('Error en login');

  }
};

  // =========================
  // REGISTER
  // =========================

  const register = async () => {
    
    if (
    !nombreUsuario ||
    !correoRegistro ||
    !passwordRegistro
  ) {
    alert('Todos los campos son obligatorios');
    return;
  }
  
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(correoRegistro)) {
      alert('Correo electrónico inválido');
      return;
    }
    if (strength === 'Débil') {
      alert('La contraseña es muy débil');
      return;
    }
    
    try {
      
      await axios.post(
        'http://localhost:3000/users',
        {
          nombre: nombreUsuario,
          correo: correoRegistro,
          password: passwordRegistro,
          rol: 'empleado',
        }
      );
      alert('Usuario registrado');
    } catch (error) {
      alert('Error al registrar');
    }
  };

  // =========================
  // SESSION
  // =========================

  useEffect(() => {

    const token = localStorage.getItem('token');

    if (token) {
      setIsLogged(true);
    }

  }, []);

  // =========================
  // GET CLIENTS
  // =========================

  const getClients = async () => {

    const response = await axios.get(
      'http://localhost:3000/clients'
    );

    setClients(response.data);

  };

  useEffect(() => {

    if (isLogged) {
      getClients();
    }

  }, [isLogged]);

  // =========================
  // HANDLE FORM
  // =========================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  // =========================
  // CREATE / UPDATE CLIENT
  // =========================

  const createClient = async (e) => {

    e.preventDefault();
    if (
      !form.nombre ||
      !form.apellido ||
      !form.ci ||
      !form.telefono ||
      !form.direccion ||
      !form.ingresos
    ) {
      alert('Todos los campos son obligatorios');
      return;
    }

    if (isNaN(form.ci)) {
      alert('El CI debe contener solo números');
      return;
    }

    if (isNaN(form.telefono)) {
      alert('El teléfono debe contener solo números');
      return;
    }

    if (Number(form.ingresos) <= 0) {
      alert('Los ingresos deben ser mayores a 0');
      return;
    }

    if (editingId) {

      await axios.put(
        `http://localhost:3000/clients/${editingId}`,
        {
          ...form,
          ingresos: Number(form.ingresos),
        }
      );

      setEditingId(null);

    } else {

      await axios.post(
        'http://localhost:3000/clients',
        {
          ...form,
          ingresos: Number(form.ingresos),
        }
      );

    }

    setForm({
      nombre: '',
      apellido: '',
      ci: '',
      telefono: '',
      direccion: '',
      ingresos: '',
    });

    getClients();

  };

  // =========================
  // ELIMINACIÓN LÓGICA
  // =========================

  const deleteClient = async (id) => {

    const confirmar = confirm(
      '¿Desea eliminar este cliente?'
    );

    if (!confirmar) return;

    try {

      await axios.put(
        `http://localhost:3000/clients/delete/${id}`
      );

      alert('Cliente eliminado');

      getClients();

    } catch (error) {

      alert('Error al eliminar');

    }

  };

  // =========================
  // EDIT CLIENT
  // =========================

  const editClient = (client) => {

    setEditingId(client.id);

    setForm({
      nombre: client.nombre,
      apellido: client.apellido,
      ci: client.ci,
      telefono: client.telefono,
      direccion: client.direccion,
      ingresos: client.ingresos,
    });

  };

  // =========================
  // LOGIN SCREEN
  // =========================

  if (!isLogged) {

    return (

      <div style={loginContainer}>

        <div style={loginCard}>

          <h1>Sistema Bancario</h1>

          <hr />

          <h2>Registrar Usuario</h2>

          <input
            type="text"
            placeholder="Nombre"
            value={nombreUsuario}
            onChange={(e) =>
              setNombreUsuario(e.target.value)
            }
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Correo"
            value={correoRegistro}
            onChange={(e) =>
              setCorreoRegistro(e.target.value)
            }
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
            onClick={register}
            style={buttonStyle}
          >
            Registrar Usuario
          </button>

          <hr />

          <h2>Iniciar Sesión</h2>

          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) =>
              setCorreo(e.target.value)
            }
            style={inputStyle}
          />

          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={loginPassword}
            onChange={(e) =>
              setLoginPassword(e.target.value)
            }
            style={inputStyle}
          />

          <button
            onClick={login}
            style={buttonStyle}
          >
            Ingresar
          </button>

        </div>

      </div>

    );

  }

  // =========================
  // SISTEMA
  // =========================

  return (

    <div style={mainContainer}>

      {/* MENU */}

      <div style={sidebarStyle}>

        <h2 style={{ textAlign: 'center' }}>
          MENÚ
        </h2>

        <button
          style={menuButton}
          onClick={() => setSection('dashboard')}
        >
          Dashboard
        </button>

        <button
          style={menuButton}
          onClick={() => setSection('clientes')}
        >
          Clientes
        </button>

        <button
          style={menuButton}
          onClick={() => setSection('prestamos')}
        >
          Préstamos
        </button>

        <button
          style={menuButton}
          onClick={() => setSection('reportes')}
        >
          Reportes
        </button>

        <button
          style={menuButton}
          onClick={() => setSection('estadisticas')}
        >
          Estadísticas
        </button>

        <button
          style={menuButton}
          onClick={() => setSection('logs')}
        >
          Logs
        </button>

        <button
          style={logoutStyle}
          onClick={() => {
            localStorage.removeItem('token');
            setIsLogged(false);
          }}
        >
          Cerrar sesión
        </button>

      </div>

      {/* CONTENIDO */}

      <div style={contentStyle}>

        <h1>
          Sistema de Préstamos Bancarios
        </h1>

        {/* DASHBOARD */}

        {section === 'dashboard' && (

          <div style={cardStyle}>

            <h2>Dashboard</h2>

            <p>
              Bienvenido al sistema bancario.
            </p>

            <p>
              Clientes registrados:
              <strong> {clients.length}</strong>
            </p>

          </div>

        )}

        {/* CLIENTES */}

        {section === 'clientes' && (

          <>

            <div style={cardStyle}>

              <h2>
                {editingId
                  ? 'Editar Cliente'
                  : 'Registrar Cliente'}
              </h2>

              <form onSubmit={createClient}>

                <input
                  name="nombre"
                  placeholder="Nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <input
                  name="apellido"
                  placeholder="Apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <input
                  name="ci"
                  placeholder="CI"
                  value={form.ci}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <input
                  name="telefono"
                  placeholder="Teléfono"
                  value={form.telefono}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <input
                  name="direccion"
                  placeholder="Dirección"
                  value={form.direccion}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <input
                  type="number"
                  name="ingresos"
                  placeholder="Ingresos"
                  value={form.ingresos}
                  onChange={handleChange}
                  style={inputStyle}
                />

                <button
                  type="submit"
                  style={buttonStyle}
                >
                  {editingId
                    ? 'Actualizar Cliente'
                    : 'Guardar Cliente'}
                </button>

              </form>

            </div>

            <div style={cardStyle}>

              <h2>Lista de Clientes</h2>

              {clients.map((client) => (

                <div
                  key={client.id}
                  style={clientCard}
                >

                  <h3>
                    {client.nombre} {client.apellido}
                  </h3>

                  <p>CI: {client.ci}</p>
                  <p>Teléfono: {client.telefono}</p>
                  <p>Ingresos: {client.ingresos}</p>

                  <button
                    onClick={() => editClient(client)}
                    style={editStyle}
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => deleteClient(client.id)}
                    style={deleteStyle}
                  >
                    Eliminar
                  </button>

                </div>

              ))}

            </div>

          </>

        )}

        {/* OTRAS SECCIONES */}

        {section === 'prestamos' && (
          <div style={cardStyle}>
            <h2>Préstamos</h2>
            <p>Próximamente...</p>
          </div>
        )}

        {section === 'reportes' && (
          <div style={cardStyle}>
            <h2>Reportes PDF</h2>
            <p>Aquí irá el reporte PDF.</p>
          </div>
        )}

        {section === 'estadisticas' && (
          <div style={cardStyle}>
            <h2>Estadísticas</h2>
            <p>Aquí irán los gráficos.</p>
          </div>
        )}

        {section === 'logs' && (
          <div style={cardStyle}>
            <h2>Logs de Acceso</h2>
            <p>Aquí verás ingresos y salidas.</p>
          </div>
        )}

      </div>

    </div>

  );

}

// =========================
// STYLES
// =========================

const loginContainer = {
  background: '#0f172a',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const loginCard = {
  background: '#1e293b',
  padding: '40px',
  borderRadius: '20px',
  width: '400px',
  color: 'white',
  textAlign: 'center',
};

const mainContainer = {
  display: 'flex',
  minHeight: '100vh',
  background: '#0f172a',
  color: 'white',
};

const sidebarStyle = {
  width: '250px',
  background: '#1e293b',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const contentStyle = {
  flex: 1,
  padding: '40px',
};

const menuButton = {
  padding: '12px',
  background: '#334155',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
};

const cardStyle = {
  background: '#1e293b',
  padding: '25px',
  borderRadius: '15px',
  marginBottom: '25px',
};

const clientCard = {
  background: '#334155',
  padding: '20px',
  borderRadius: '10px',
  marginBottom: '15px',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '15px',
  borderRadius: '10px',
  border: 'none',
  boxSizing: 'border-box',
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  background: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
};

const deleteStyle = {
  padding: '10px',
  background: '#dc2626',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  marginRight: '10px',
  cursor: 'pointer',
};

const editStyle = {
  padding: '10px',
  background: '#ca8a04',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  marginRight: '10px',
  cursor: 'pointer',
};

const logoutStyle = {
  padding: '12px',
  background: '#dc2626',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
};

export default App;