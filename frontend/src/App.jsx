import { useEffect, useState } from 'react';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';
import Registro from "./Registro";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {

  // =========================
  // STATES
  // =========================
  const [rol, setRol] = useState('');
  const [clients, setClients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [captchaToken, setCaptchaToken] = useState('');
  const [loans, setLoans] = useState([]);
  const [logs, setLogs] = useState([]);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  

  const prestamosAprobados = loans.filter(
  loan => loan.estado === 'Aprobado'
).length;

const prestamosPendientes = loans.filter(
  loan => loan.estado === 'Pendiente'
).length;

const prestamosRechazados = loans.filter(
  loan => loan.estado === 'Rechazado'
).length;

  const [loanForm, setLoanForm] = useState({
  cliente: '',
  monto: '',
  plazo: '',
  estado: 'Pendiente',});


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
  const handleLogin = async (e) => {
  e.preventDefault();

  const data = {
    username,
    password
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  console.log(result);
};

  // MENU
  const [section, setSection] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
  window.innerWidth <= 768);



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

   //=========================
  // CHART DATA
  //=========================

  const chartData = {
  labels: clients.map(client => client.nombre),

  datasets: [
    {
      label: 'Ingresos',
      data: clients.map(client => client.ingresos),
      backgroundColor: 'rgba(37, 99, 235, 0.8)',
    },
  ],
};

const loansChartData = {

  labels: [
    'Aprobados',
    'Pendientes',
    'Rechazados',
  ],

  datasets: [
    {
      label: 'Préstamos',

      data: [
        prestamosAprobados,
        prestamosPendientes,
        prestamosRechazados,
      ],

      backgroundColor: [
        '#22c55e',
        '#f59e0b',
        '#ef4444',
      ],
    },
  ],
};

// =========================
// PESTAMOS
// =========================

const getLoans = async () => {

  const response = await axios.get(
    'https://proyecto-prestamos-bancarios.onrender.com/loans'
  );

  setLoans(response.data);
};

const createLoan = async (e) => {

  e.preventDefault();

  await axios.post(
    'https://proyecto-prestamos-bancarios.onrender.com/loans',
    {
      ...loanForm,
      monto: Number(loanForm.monto),
      plazo: Number(loanForm.plazo),
    }
  );

  getLoans();
};


// 

 // =========================
  // Logs de acceso
  // =========================

  const getLogs = async () => {

  const response = await axios.get(
    'https://proyecto-prestamos-bancarios.onrender.com/logs'
  );

  setLogs(response.data);

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

  if (!captchaToken) {
    alert('Complete el CAPTCHA');
    return;
  }

  try {

    const res = await axios.post(
      'https://proyecto-prestamos-bancarios.onrender.com/auth/login',
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

    localStorage.setItem(
  'usuario',
  correo
);

    localStorage.setItem(
      'rol',
      res.data.rol
    );
    setRol(res.data.rol);

    setIsLogged(true);
     alert('Login exitoso');

  } catch(error)  {

    alert('Error en login');

  }
};

  // =========================
  // SESSION
  // =========================

  useEffect(() => {

  const token = localStorage.getItem('token');
  const rolGuardado = localStorage.getItem('rol');


  if (token) {
    setIsLogged(true);
    setRol(rolGuardado);
  }
}, []);

useEffect(() => {

  const handleResize = () => {

    setIsMobile(
      window.innerWidth <= 768
    );

  };

  window.addEventListener(
    'resize',
    handleResize
  );

  return () =>
    window.removeEventListener(
      'resize',
      handleResize
    );

}, []);

  // =========================
  // GET CLIENTS
  // =========================

  const getClients = async () => {

    const response = await axios.get(
      'https://proyecto-prestamos-bancarios.onrender.com/clients'
    );

    setClients(response.data);

  };

  useEffect(() => {

    if (isLogged) {
      getClients();
      getLoans();
      getLogs();
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
  // CAPTCHA
  // =========================
  const handleCaptcha = (token) => {
    setCaptchaToken(token);

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
        `https://proyecto-prestamos-bancarios.onrender.com/clients/${editingId}`,
        {
          ...form,
          ingresos: Number(form.ingresos),
        }
      );

      setEditingId(null);

    } else {

      await axios.post(
        'https://proyecto-prestamos-bancarios.onrender.com/clients',
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
    const token = localStorage.getItem('token');
    const confirmar = confirm(
      '¿Desea eliminar este cliente?'
    );

    if (!confirmar) return;

    try {

      await axios.put(
        `https://proyecto-prestamos-bancarios.onrender.com/clients/delete/${id}`,
        {},
        {
          headers: {
            Authorization:
            `Bearer ${token}`,
          },
        }
      );

      alert('Cliente eliminado');

      getClients();

    } catch (error) {
      console.error(error);
      
      console.log(error.response);

      alert('Error al eliminar');

    }

  };

  // =========================
  // GENERAR PDF
  // =========================

  const generarPDFPrestamos = () => {

  const doc = new jsPDF();

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 30, 'F');

  doc.setTextColor(255, 255, 255);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);

  doc.text(
    'PRESTAMOS BANCARIOS',
    105,
    15,
    { align: 'center' }
  );

  doc.setFontSize(12);

  doc.text(
    'Reporte Oficial de Prestamos',
    105,
    24,
    { align: 'center' }
  );

  doc.setTextColor(0, 0, 0);

  doc.text(
    `Fecha: ${new Date().toLocaleDateString()}`,
    14,
    45
  );

  doc.text(
    `Total de Prestamos: ${loans.length}`,
    14,
    55
  );

  autoTable(doc, {

    startY: 70,

    head: [[
      'ID',
      'Cliente',
      'Monto',
      'Plazo',
      'Estado'
    ]],

    body: loans.map(loan => [
      loan.id,
      loan.cliente,
      `Bs. ${loan.monto}`,
      `${loan.plazo} meses`,
      loan.estado
    ]),

    headStyles: {
      fillColor: [30, 64, 175],
    },

  });
  doc.setFontSize(10);

  doc.text(
  'Generado automaticamente por el Sistema de Prestamos',
  105,
  285,
  { align: 'center' }
);

  doc.save(
    'reporte_prestamos.pdf'
  );

};

  const generarPDF = () => {

  const doc = new jsPDF();

  // Encabezado
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('PRESTAMOS BANCARIOS', 105, 15, {
    align: 'center',
  });

  doc.setFontSize(12);
  doc.text('Reporte Oficial de Clientes', 105, 24, {
    align: 'center',
  });


  doc.setTextColor(0, 0, 0);

  doc.setFontSize(11);

  doc.text(
    `Fecha: ${new Date().toLocaleDateString()}`,
    14,
    45
  );

  doc.text(
    `Hora: ${new Date().toLocaleTimeString()}`,
    14,
    52
  );

  doc.text(
    `Total de Clientes: ${clients.length}`,
    14,
    59
  );

  autoTable(doc, {
    startY: 70,

    head: [[
      'ID',
      'Nombre',
      'Apellido',
      'CI',
      'Telefono',
      'Ingresos'
    ]],

    body: clients.map(client => [
      client.id,
      client.nombre,
      client.apellido,
      client.ci,
      client.telefono,
      `Bs. ${client.ingresos}`
    ]),

    headStyles: {
      fillColor: [30, 64, 175],
      fontStyle: 'bold',
      halign: 'center',
    },

    styles: {
      fontSize: 10,
      cellPadding: 3,
    },

    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  });
  doc.setFontSize(10);



doc.text(
  'Generado automaticamente por el Sistema de Prestamos',
  105,
  285,
  { align: 'center' }
);

  doc.save('reporte_clientes.pdf');

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



  if (mostrarRegistro) {
  return (
    <Registro
      volverLogin={() => setMostrarRegistro(false)}
    />
  );
}

  // =========================
  // LOGIN SCREEN
  // =========================

  if (!isLogged) {

    return (

      <div style={loginContainer }>

        <div style={loginCard}>

          <h1
  style={{
    fontSize: isMobile ? '23px' : '32px',
    wordBreak: 'break-word',
  }}
>
  Sistema de Préstamos
</h1>

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
          <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '15px',
            marginBottom: '20px',
            }}
          >

          <div
  style={{
    display: 'flex',
    justifyContent: 'center',
    marginTop: '15px',
    marginBottom: '20px',
  }}
>
  <div
    style={{
      transform: isMobile ? 'scale(0.85)' : 'scale(1)',
      transformOrigin: 'center',
    }}
  >
    <ReCAPTCHA
      sitekey="6LfRwRUtAAAAAJw61FcKYqVSPvaatcLU0AbQE68D"
      onChange={handleCaptcha}
    />
  </div>
</div>
          </div>

          <button
            onClick={login}
            style={buttonStyle}
          >
            Ingresar
          </button>

          <p
  style={{
    textAlign: 'center',
    marginTop: '15px',
    color: '#1976d2',
    cursor: 'pointer'
  }}
  onClick={() => setMostrarRegistro(true)}
>
  ¿No tienes cuenta? Regístrate aquí
</p>

        </div>

      </div>

    );

  }

  // =========================
  // SISTEMA
  // =========================

  return (

    <div style={mainContainer}>
    {isMobile && (

  <button
    onClick={() => setMenuOpen(!menuOpen)}
    style={{
      position: 'fixed',
      top: '15px',
      left: '15px',
      zIndex: 1000,
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 15px',
      fontSize: '22px',
      cursor: 'pointer'
    }}
  >
    ☰
  </button>

)}

      {/* MENU */}
      

      <div
  style={{
    ...sidebarStyle,

    display:
      isMobile
        ? (menuOpen ? 'block' : 'none')
        : 'block',

    position:
      isMobile
        ? 'fixed'
        : 'relative',

    zIndex: 999,

    height:
      isMobile
        ? '100vh'
        : 'auto',

    left: 0,
    top: 0
  }}
>

        <h2 style={{ textAlign: 'center' }}>
          MENÚ
        </h2>

        <button
          style={menuButton}
          onClick={() => {setSection('dashboard');  if (isMobile) {setMenuOpen(false);}}}
        >
          Panel
        </button>

        <button
          style={menuButton}
          onClick={() => {setSection('clientes');
            if (isMobile) {
              setMenuOpen(false);}
            }}
        >
          Clientes
        </button>

        <button
          style={menuButton}
          onClick={() => {setSection('prestamos'); if (isMobile) {setMenuOpen(false);}}}
        >
          Préstamos
        </button>

        <button
          style={menuButton}
          onClick={() => {setSection('reportes'); if (isMobile) {setMenuOpen(false);}}}
        >
          Reportes
        </button>

        <button
          style={menuButton}
          onClick={() => {setSection('estadisticas'); if (isMobile) {setMenuOpen(false);}}}
        >
          Estadísticas
        </button>

        <button
          style={menuButton}
          onClick={() => {setSection('logs'); if (isMobile) {setMenuOpen(false);}}}
        >
          Registros
        </button>

       <button
  style={logoutStyle}
  onClick={async () => {

    try {
      await axios.post(
        'https://proyecto-prestamos-bancarios.onrender.com/logs',
        {
          usuario: localStorage.getItem('usuario'),
          ip: '::1',
          navegador: navigator.userAgent,
          evento: 'Salida',
          fechaHora: new Date(),
        }
      );

      console.log('Salida registrada');
    } catch (error) {
      console.error(error);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuario');

    setCorreo('');
    setLoginPassword('');
    setCaptchaToken('');

    setIsLogged(false);
    setRol('');
  }}
>
  Cerrar sesión
</button>

      </div>

      {/* CONTENIDO */}

      <div style={contentStyle}>

        <h1>
          Sistema de Préstamos
        </h1>

        <p>
          Rol actual:
          <strong> {rol}</strong>
        </p>

        {/* DASHBOARD */}

        {section === 'dashboard' && (

          <div style={cardStyle}>

            <h2>Panel de Control</h2>

            <p>
              Bienvenido al sistema de Préstamos.
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

                  {rol === 'admin' && (
                    <button
                    onClick={() => deleteClient(client.id)}
                    style={deleteStyle}
                    >
                      Eliminar
                      </button>
                    )}

                </div>

              ))}

            </div>

          </>

        )}

        {/* OTRAS SECCIONES */}

        {section === 'prestamos' && (
  <div style={cardStyle}>

    <h2>Préstamos</h2>

    <form onSubmit={createLoan}>

      {/* CLIENTE */}
      <select
        value={loanForm.cliente}
        onChange={(e) =>
          setLoanForm({
            ...loanForm,
            cliente: e.target.value
          })
        }
        style={inputStyle}
      >
        <option value="">
          Seleccionar Cliente
        </option>

        {clients.map(client => (
          <option
            key={client.id}
            value={`${client.nombre} ${client.apellido}`}
          >
            {client.nombre} {client.apellido}
          </option>
        ))}
      </select>

      {/* MONTO */}
      <input
        type="number"
        placeholder="Monto"
        value={loanForm.monto}
        onChange={(e) =>
          setLoanForm({
            ...loanForm,
            monto: e.target.value
          })
        }
        style={inputStyle}
      />

      {/* PLAZO */}
      <input
        type="number"
        placeholder="Plazo (meses)"
        value={loanForm.plazo}
        onChange={(e) =>
          setLoanForm({
            ...loanForm,
            plazo: e.target.value
          })
        }
        style={inputStyle}
      />

      {/* ESTADO */}
      <select
        value={loanForm.estado}
        onChange={(e) =>
          setLoanForm({
            ...loanForm,
            estado: e.target.value
          })
        }
        style={inputStyle}
      >
        <option>Pendiente</option>
        <option>Aprobado</option>
        <option>Rechazado</option>
      </select>

      <button
        type="submit"
        style={buttonStyle}
      >
        Guardar Préstamo
      </button>

    </form>

    <hr style={{ margin: '30px 0' }} />

    <h2>Préstamos Registrados</h2>

    {loans.map((loan) => (

      <div
        key={loan.id}
        style={{
          background: '#1e293b',
          padding: '15px',
          marginBottom: '15px',
          borderRadius: '10px',
        }}
      >

        <p>
          <strong>Cliente:</strong> {loan.cliente}
        </p>

        <p>
          <strong>Monto:</strong> Bs. {loan.monto}
        </p>

        <p>
          <strong>Plazo:</strong> {loan.plazo} meses
        </p>

        <p>
          <strong>Estado:</strong> {loan.estado}
        </p>

      </div>

    ))}

  </div>
)}

        {section === 'reportes' && (
          <div style={cardStyle}>
            <h2>Reportes PDF</h2>
            <button
            onClick={generarPDF}
            style={buttonStyle}
            >
              📄 Generar Reporte Clientes
            </button>

            <br /><br />
            <button
            onClick={generarPDFPrestamos}
            style={buttonStyle}>
              📄 Generar Reporte Préstamos
            </button>
          </div>
        )}

        {section === 'estadisticas' && (

  <div style={cardStyle}>

    <h2>Estadísticas</h2>

    <div
  style={{
    display: 'grid',
    gridTemplateColumns: isMobile
      ? '1fr'
      : 'repeat(4, 1fr)',
    gap: '20px',
  }}
>

      <div style={statCard}>
        <h3>Clientes</h3>
        <h2>{clients.length}</h2>
      </div>

      <div style={statCard}>
        <h3>Préstamos</h3>
        <h2>{loans.length}</h2>
      </div>

      <div style={statCard}>
        <h3>Aprobados</h3>
        <h1>{prestamosAprobados}</h1>
      </div>

      <div style={statCard}>
        <h3>Pendientes</h3>
        <h1>{prestamosPendientes}</h1>
      </div>

    </div>

    <h2>Ingresos por Cliente</h2>

   <div
  style={{
    width: '100%',
    overflowX: 'auto',
  }}
>
  <div
    style={{
      minWidth: isMobile ? '500px' : '100%',
      height: '300px',
    }}
  >
    <Bar
      data={chartData}
      options={{
        maintainAspectRatio: false,
        responsive: true,
      }}
    />
  </div>
</div>

    <br />
    <br />

    <h2>Estado de Préstamos</h2>

    <div
  style={{
    width: '100%',
    height: '300px',
  }}
>
  <Bar
    data={loansChartData}
    options={{
      responsive: true,
      maintainAspectRatio: false,
    }}
  />
</div>

  </div>

)}

        {section === 'logs' && (
          <div style={cardStyle}>
            <h2>Registros de Acceso</h2>

           <div style={{ overflowX: 'auto', width: '100%' }}>
 <div
  style={{
    overflowX: 'auto',
    width: '100%',
  }}
>
  <table   style={{
    minWidth: '700px'
  }}>
      <thead>

        <tr>
          <th style={thStyle}>
            Navegador
          </th>

          <th style={thStyle}>
            Usuario
          </th>

          <th style={thStyle}>
            Evento
          </th>

          <th style={thStyle}>
            IP
          </th>

          <th style={thStyle}>
            Fecha
          </th>

        </tr>

      </thead>

      <tbody>

        {logs.map((log) => (

          <tr key={log.id}>

            <td style={tdStyle}>
  {log.navegador.includes('Chrome')
    ? 'Chrome'
    : log.navegador.includes('Firefox')
    ? 'Firefox'
    : log.navegador.includes('Edge')
    ? 'Edge'
    : 'Otro'}
</td>

            <td style={tdStyle}>
              {log.usuario}
            </td>

            <td style={tdStyle}>
              {log.evento === 'Ingreso'
              ? '🟢 Ingreso'
              : '🔴 Salida'}
            </td>

            <td style={tdStyle}>
              {log.ip}
            </td>

            <td style={tdStyle}>
              {new Date(
                log.fechaHora
              ).toLocaleString()}
            </td>

          </tr>

        ))}

      </tbody>

        </table>
        </div>
        </div>
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
  padding: '20px',
  boxSizing: 'border-box',
};

const loginCard = {
  background: '#1e293b',
  padding: '40px',
  borderRadius: '20px',
  width: '90%',
  maxWidth: '400px',
  color: 'white',
  textAlign: 'center',
  boxSizing: 'border-box',
};

const mainContainer = {
  display: 'flex',
  flexWrap: 'wrap',
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
  gap: '25px',
};

const contentStyle = {
  flex: 1,
  padding: '40px',
  width: '100%',
  overflowX: 'auto',
};

const menuButton = {
  width: '100%',
  padding: '12px',
  background: '#334155',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  marginBottom: '10px',
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

const statCard = {

  background: '#1e293b',

  padding: '20px',

  borderRadius: '12px',

  textAlign: 'center',

  boxShadow:
    '0 0 10px rgba(0,0,0,0.3)',

  width: '100%',
  boxSizing: 'border-box',

};

const thStyle = {
  border: '1px solid #334155',
  padding: '12px',
  background: '#1e293b',
  color: 'white',
};

const tdStyle = {
  border: '1px solid #334155',
  padding: '10px',
};

export default App;