import { useState, type FormEvent } from "react";
import type { Categoria, Gasto } from "./types";
import GastoItem from "./GastoItem";

const categorias: Categoria[] = ["Comida", "Transporte", "Ocio", "Otros"];

function App() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState<Categoria>("Comida");
  const [error, setError] = useState("");

  const total = gastos.reduce((suma, gasto) => suma + gasto.monto, 0);

  function agregarGasto(evento: FormEvent) {
    evento.preventDefault();

    const montoNumero = Number(monto);

    if (descripcion.trim() === "" || montoNumero <= 0) {
      setError("Completa la descripción y un monto mayor a 0");
      return;
    }

    const nuevoGasto: Gasto = {
      id: Date.now(),
      descripcion: descripcion.trim(),
      monto: montoNumero,
      categoria: categoria,
    };

    setGastos([...gastos, nuevoGasto]);
    setDescripcion("");
    setMonto("");
    setError("");
  }

  function eliminarGasto(id: number) {
    setGastos(gastos.filter((gasto) => gasto.id !== id));
  }

  return (
    <main className="contenedor">
      <h1>Control de <span>Gastos</span></h1>

      <form onSubmit={agregarGasto}>
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value as Categoria)}
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button type="submit">Agregar gasto</button>
      </form>

      {error && <p className="error">{error}</p>}

      {gastos.length === 0 ? (
        <p className="vacio">No hay gastos registrados</p>
      ) : (
        <ul>
          {gastos.map((gasto) => (
            <GastoItem key={gasto.id} gasto={gasto} onEliminar={eliminarGasto} />
          ))}
        </ul>
      )}

      <h2 className="total">Total: ${total.toLocaleString("es-CL")}</h2>
    </main>
  );
}

export default App;
