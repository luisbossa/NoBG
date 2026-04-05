const fileInput = document.getElementById("fileInput");
const selectBtn = document.getElementById("selectBtn");
const uploadBox = document.getElementById("uploadBox");

const imgBefore = document.getElementById("imgBefore");
const imgAfter = document.getElementById("imgAfter");
const imgAfterWrapper = document.getElementById("imgAfterWrapper");

const slider = document.querySelector('input[type="range"]');
const sliderLine = document.getElementById("sliderLine");
const sliderHandle = document.querySelector(".slider-handle");

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
  uploadBox.style.borderColor = "#2563eb";
  uploadBox.style.background = "#eff6ff";
});

uploadBox.addEventListener("dragleave", () => {
  uploadBox.style.borderColor = "#ddd";
  uploadBox.style.background = "white";
});

uploadBox.addEventListener("drop", (e) => {
  e.preventDefault();

  uploadBox.style.borderColor = "#ddd";
  uploadBox.style.background = "white";

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
  imgBefore.src = URL.createObjectURL(file);

  imgAfter.style.opacity = "0.5";

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
      return;
    }

    resultImage = data.result;

    imgAfter.src = resultImage;
    imgAfter.style.opacity = "1";
  } catch (err) {
    console.error(err);
    alert("Error procesando imagen");
  }
}

/* =========================
   SLIDER (ANTES / DESPUÉS)
========================= */
function updateSlider(value) {
  imgAfterWrapper.style.clipPath = `inset(0 ${100 - value}% 0 0)`;

  sliderLine.style.left = value + "%";

  if (sliderHandle) {
    sliderHandle.style.left = value + "%";
  }
}

slider.addEventListener("input", () => {
  updateSlider(slider.value);
});

/* iniciar slider en 50% */
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
