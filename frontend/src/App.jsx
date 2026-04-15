import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    ci: '',
    telefono: '',
    direccion: '',
    ingresos: '',
  });

  const getClients = async () => {
    const response = await axios.get('http://localhost:3000/clients');
    setClients(response.data);
  };

  useEffect(() => {
    getClients();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createClient = async (e) => {
    e.preventDefault();

    await axios.post('http://localhost:3000/clients', {
      ...form,
      ingresos: Number(form.ingresos),
    });

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

  const deleteClient = async (id) => {
    await axios.delete(`http://localhost:3000/clients/${id}`);
    getClients();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Sistema de Préstamos Bancarios</h1>

      <h2>Registrar Cliente</h2>

      <form onSubmit={createClient}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="text"
          name="ci"
          placeholder="CI"
          value={form.ci}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={form.direccion}
          onChange={handleChange}
        />
        <br /><br />

        <input
          type="number"
          name="ingresos"
          placeholder="Ingresos"
          value={form.ingresos}
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">Guardar Cliente</button>
      </form>

      <hr />

      <h2>Lista de Clientes</h2>

      {clients.map((client) => (
        <div
          key={client.id}
          style={{
            border: '1px solid gray',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          <p><strong>{client.nombre} {client.apellido}</strong></p>
          <p>CI: {client.ci}</p>
          <p>Teléfono: {client.telefono}</p>
          <p>Ingresos: {client.ingresos}</p>

          <button onClick={() => deleteClient(client.id)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;