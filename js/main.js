const productos = [
  {
    nombre: "Silla Erghohuman",
    img: "img/silla1.jpg",
    glb: "models/SNOW.glb",
    usdz: "models/SNOW.usdz"
  },
  {
    nombre: "Silla Executive",
    img: "img/silla2.jpg",
    glb: "models/silla2.glb",
    usdz: "models/silla2.usdz"
  },
  {
    nombre: "Silla Comfort",
    img: "img/silla3.jpg",
    glb: "models/silla3.glb",
    usdz: "models/silla3.usdz"
  }
];

const gridProductos = document.getElementById("grid-productos");

function mostrarProductos(lista) {
  gridProductos.innerHTML = "";
  lista.forEach(producto => {
    const div = document.createElement("div");
    div.classList.add("producto");

    div.innerHTML = `
      <img src="${producto.img}" alt="${producto.nombre}" width="100%">
      <h3>${producto.nombre}</h3>
      <button onclick="verAR('${producto.glb}', '${producto.usdz}')">
        Visualizar en AR
      </button>
    `;

    gridProductos.appendChild(div);
  });
}

function verAR(modeloGLB, modeloUSDZ) {
  const modal = document.createElement("div");
  modal.className = "ar-modal";

  modal.innerHTML = `
    <div class="ar-header">
      <span>Experiencia AR</span>
      <button onclick="cerrarAR()">✕</button>
    </div>

    <p class="ar-instrucciones">
      Mueve tu celular para detectar una superficie plana y toca la pantalla
      para colocar la silla en tu espacio.
    </p>

    <model-viewer
      src="${modeloGLB}"
      ios-src="${modeloUSDZ}"
      ar
      ar-modes="quick-look scene-viewer webxr"
      camera-controls
      autoplay
      style="width:100%; height:80vh;">
    </model-viewer>
  `;

  document.body.appendChild(modal);
}

function cerrarAR() {
  const modal = document.querySelector(".ar-modal");
  if (modal) modal.remove();
}

mostrarProductos(productos);
