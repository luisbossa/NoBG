const fileInput = document.getElementById("fileInput");
const selectBtn = document.getElementById("selectBtn");
const uploadBox = document.getElementById("uploadBox");

const imgBefore = document.getElementById("imgBefore");
const imgAfter = document.getElementById("imgAfter");
const imgAfterWrapper = document.getElementById("imgAfterWrapper");

const slider = document.querySelector('input[type="range"]');
const sliderLine = document.getElementById("sliderLine");
const sliderHandle = document.querySelector(".slider-handle");
const previewBox = document.querySelector(".preview-box");

let resultImage = "";

/* =========================
   SELECT BUTTON
========================= */
selectBtn.addEventListener("click", () => fileInput.click());

/* =========================
   INPUT FILE
========================= */
fileInput.addEventListener("change", handleFile);

/* =========================
   DRAG & DROP
========================= */
uploadBox.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadBox.classList.add("drag");
});

uploadBox.addEventListener("dragleave", () => {
  uploadBox.classList.remove("drag");
});

uploadBox.addEventListener("drop", (e) => {
  e.preventDefault();

  uploadBox.classList.remove("drag");

  const file = e.dataTransfer.files[0];
  if (file) processImage(file);
});

/* =========================
   HANDLE FILE INPUT
========================= */
function handleFile() {
  const file = fileInput.files[0];
  if (!file) return;

  processImage(file);
}

/* =========================
   PROCESS IMAGE
========================= */
async function processImage(file) {
  const previewBox = document.querySelector(".preview-box");

  /* activar loading inmediatamente */
  previewBox.classList.add("loading");

  const localImage = URL.createObjectURL(file);

  /* mostrar imagen BEFORE inmediatamente */
  imgBefore.src = localImage;

  /* limpiar AFTER */
  imgAfter.src = "";
  imgAfter.style.opacity = "0";

  /* reiniciar slider */
  slider.value = 50;
  updateSlider(50);

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch("/remove-bg", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!data.result) {
      alert("Error en respuesta");
      previewBox.classList.remove("loading");
      return;
    }

    resultImage = data.result;

    imgAfter.src = resultImage;

    /* cuando la imagen cargue quitar skeleton */
    imgAfter.onload = () => {
      previewBox.classList.remove("loading");
      imgAfter.style.opacity = "1";
    };
  } catch (err) {
    console.error(err);
    alert("Error procesando imagen");
    previewBox.classList.remove("loading");
  }
}

/* =========================
   SLIDER (ANTES / DESPUÉS)
========================= */
function updateSlider(value) {
  imgAfterWrapper.style.clipPath = `inset(0 0 0 ${value}%)`;

  sliderLine.style.left = value + "%";

  if (sliderHandle) {
    sliderHandle.style.left = value + "%";
  }
}

slider.addEventListener("input", () => {
  updateSlider(slider.value);
});

/* iniciar slider */
updateSlider(slider.value);

/* =========================
   DOWNLOAD BUTTON
========================= */
const downloadBtn = document.createElement("button");

downloadBtn.innerHTML = `
<span class="material-symbols-rounded">download</span>
Descargar imagen HD
`;

downloadBtn.className = "btn-download";

document.querySelector(".preview-box").appendChild(downloadBtn);

downloadBtn.addEventListener("click", () => {
  if (!resultImage) {
    alert("Primero procesa una imagen");
    return;
  }

  const link = document.createElement("a");
  link.href = resultImage;
  link.download = "sin-fondo.png";
  link.click();
});
