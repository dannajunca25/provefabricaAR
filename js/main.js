let productos = [];
async function cargarProductos() {
  try {
    const response = await fetch("https://6975800a265838bbea97757a.mockapi.io/prove/products");
    const data = await response.json();

    productos = data; // guardamos los datos
    mostrarProductos(productos); // pintamos catálogo
  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}


/* ======================================================
   CATÁLOGO
====================================================== */

const gridProductos = document.getElementById("grid-productos");

function mostrarProductos(lista) {
  if (!gridProductos) return;

  gridProductos.innerHTML = "";

  lista.forEach(producto => {
    const card = document.createElement("div");
    card.classList.add("producto");

    card.innerHTML = `
      <img src="${producto.image}" alt="${producto.name}">
      <h3>${producto.name}</h3>

      <button class="btn-detalle" data-id="${producto.id}">
        Ver detalle
      </button>

      <button class="btn-ar">
        Visualizar en AR
      </button>
    `;

    // 👉 botón detalle
    card.querySelector(".btn-detalle").addEventListener("click", () => {
      verDetalle(producto.id);
    });

    // 👉 botón AR
    card.querySelector(".btn-ar").addEventListener("click", () => {
      verAR(producto.model_glb, producto.model_usdz);
    });

    gridProductos.appendChild(card);
  });
}



window.verDetalle = function (id) {
  const producto = productos.find(p => p.id == id);
  if (!producto) {
    console.warn("Producto no encontrado:", id);
    return;
  }

  // cerrar modal previo si existe
  const anterior = document.querySelector(".detalle-modal");
  if (anterior) anterior.remove();

  const modal = document.createElement("div");
  modal.className = "detalle-modal";

  modal.innerHTML = `
    <div class="detalle-header">
      <h2>${producto.name}</h2>
      <button onclick="cerrarDetalle()">✕</button>
    </div>

    <div class="detalle-contenido">
      <img src="${producto.image}" alt="${producto.name}">
      <p>${producto.description}</p>

      <div class="medidas">
        <p><strong>Alto:</strong> ${producto.height} cm</p>
        <p><strong>Ancho:</strong> ${producto.width} cm</p>
        <p><strong>Profundidad:</strong> ${producto.depth} cm</p>
      </div>

      <p class="ar-info">
        ${producto.ar_ios ? "📱 Compatible con AR en iOS" : "⚠️ AR solo disponible en iOS"}
      </p>

      <button class="btn-ar"
        onclick="verAR('${producto.model_glb}', '${producto.model_usdz}')">
        Visualizar en mi espacio
      </button>
    </div>
  `;

  document.body.appendChild(modal);
};



window.cerrarDetalle = function () {
  const modal = document.querySelector(".detalle-modal");
  if (modal) modal.remove();
};




/* ======================================================
   REALIDAD AUMENTADA
====================================================== */

window.verAR = function (modeloGLB, modeloUSDZ) {
  const modal = document.createElement("div");
  modal.className = "ar-modal";

  modal.innerHTML = `
    <div class="ar-header">
      <span>Vista en Realidad Aumentada</span>
      <button onclick="cerrarAR()">✕</button>
    </div>

    <p class="ar-instrucciones">
      Mueve tu celular para detectar una superficie plana.
      Toca la pantalla para colocar la silla.
    </p>

    <model-viewer
      src="${modeloGLB}"
      ios-src="${modeloUSDZ}"
      ar
      ar-modes="scene-viewer webxr quick-look"
      camera-controls
      disable-pan
      shadow-intensity="1"
      style="width:100%; height:80vh;">
    </model-viewer>
  `;

  document.body.appendChild(modal);
};

window.cerrarAR = function () {
  const modal = document.querySelector(".ar-modal");
  if (modal) modal.remove();
};

/* ======================================================
   INIT
====================================================== */

cargarProductos();


let estadoFiltros = {
  busqueda: "",
  categoria: "todas",
  orden: "nombre-asc"
};


function aplicarFiltros() {
  let resultado = [...productos];

  if (estadoFiltros.busqueda) {
    resultado = resultado.filter(p =>
      p.name.toLowerCase().includes(estadoFiltros.busqueda)
    );
  }

  if (estadoFiltros.categoria !== "todas") {
    resultado = resultado.filter(
      p => p.category === estadoFiltros.categoria
    );
  }

  resultado.sort((a, b) => {
    if (estadoFiltros.orden === "nombre-asc") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  mostrarProductos(resultado);
}


const inputBusqueda = document.getElementById("busqueda");
const selectCategoria = document.getElementById("categoria");
const selectOrden = document.getElementById("ordenar");

if (inputBusqueda) {
  inputBusqueda.addEventListener("input", e => {
    estadoFiltros.busqueda = e.target.value.toLowerCase();
    aplicarFiltros();
  });
}

if (selectCategoria) {
  selectCategoria.addEventListener("change", e => {
    estadoFiltros.categoria = e.target.value;
    aplicarFiltros();
  });
}

if (selectOrden) {
  selectOrden.addEventListener("change", e => {
    estadoFiltros.orden = e.target.value;
    aplicarFiltros();
  });
}
