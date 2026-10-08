export type Categoria = "Comida" | "Transporte" | "Ocio" | "Otros";

export interface Gasto {
  id: number;
  descripcion: string;
  monto: number;
  categoria: Categoria;
}
