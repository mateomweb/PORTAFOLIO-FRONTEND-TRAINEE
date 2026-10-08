import type { Gasto } from "./types";

interface Props {
  gasto: Gasto;
  onEliminar: (id: number) => void;
}

function GastoItem({ gasto, onEliminar }: Props) {
  return (
    <li className="gasto">
      <div>
        <p>{gasto.descripcion}</p>
        <small>{gasto.categoria}</small>
      </div>
      <div className="gasto-derecha">
        <strong>${gasto.monto.toLocaleString("es-CL")}</strong>
        <button onClick={() => onEliminar(gasto.id)}>X</button>
      </div>
    </li>
  );
}

export default GastoItem;
