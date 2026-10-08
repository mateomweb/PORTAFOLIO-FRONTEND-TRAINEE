const formulario = document.getElementById("formulario");
const inputTarea = document.getElementById("input-tarea");
const lista = document.getElementById("lista");
const contador = document.getElementById("contador");
const mensajeError = document.getElementById("mensaje-error");
const btnLimpiar = document.getElementById("btn-limpiar");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

function guardarTareas() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function mostrarTareas() {
  lista.innerHTML = "";

  tareas.forEach((tarea, indice) => {
    const item = document.createElement("li");
    item.classList.toggle("completada", tarea.completada);

    const texto = document.createElement("span");
    texto.textContent = tarea.texto;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "X";
    btnEliminar.classList.add("btn-eliminar");

    item.addEventListener("click", () => {
      tarea.completada = !tarea.completada;
      actualizar();
    });

    btnEliminar.addEventListener("click", (evento) => {
      evento.stopPropagation();
      tareas.splice(indice, 1);
      actualizar();
    });

    item.append(texto, btnEliminar);
    lista.appendChild(item);
  });

  const pendientes = tareas.filter((tarea) => !tarea.completada).length;
  contador.textContent = `${pendientes} tareas pendientes`;
}

function actualizar() {
  guardarTareas();
  mostrarTareas();
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const texto = inputTarea.value.trim();

  if (texto === "") {
    mensajeError.textContent = "La tarea no puede estar vacía";
    return;
  }

  mensajeError.textContent = "";
  tareas.push({ texto: texto, completada: false });
  inputTarea.value = "";
  actualizar();
});

btnLimpiar.addEventListener("click", () => {
  tareas = tareas.filter((tarea) => !tarea.completada);
  actualizar();
});

mostrarTareas();
