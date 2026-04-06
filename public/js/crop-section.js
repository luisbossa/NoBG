document.addEventListener("DOMContentLoaded", () => {
  const cropFileInput = document.getElementById("cropFileInput");
  const cropSelectBtn = document.getElementById("cropSelectBtn");
  const uploadArea = document.getElementById("uploadArea");

  const editor = document.getElementById("editor");
  const image = document.getElementById("image");

  const widthInput = document.getElementById("widthInput");
  const heightInput = document.getElementById("heightInput");

  const cropBtn = document.getElementById("cropBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  let cropper = null;
  let currentURL = null;

  // seleccionar imagen
  cropSelectBtn.addEventListener("click", () => cropFileInput.click());

  cropFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) loadImage(file);
  });

  // drag & drop
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = "#2563eb";
  });

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.style.borderColor = "#d1d5db";
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = "#d1d5db";
    const file = e.dataTransfer.files[0];
    if (file) loadImage(file);
  });

  function loadImage(file) {
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }

    if (currentURL) URL.revokeObjectURL(currentURL);

    currentURL = URL.createObjectURL(file);
    image.src = currentURL;

    image.onload = () => {
      widthInput.value = image.naturalWidth;
      heightInput.value = image.naturalHeight;

      uploadArea.style.display = "none";
      editor.classList.remove("hidden");

      cropper = new Cropper(image, {
        viewMode: 1,
        autoCropArea: 0.5,
        responsive: true,
        movable: false,
        zoomable: false,
        scalable: false,
        rotatable: false,
        cropBoxResizable: true,
        cropBoxMovable: true,
        minCropBoxWidth: 50,
        minCropBoxHeight: 50,

        crop(event) {
          widthInput.value = Math.round(event.detail.width);
          heightInput.value = Math.round(event.detail.height);
        },
      });
    };
  }

  // actualizar crop manual
  widthInput.addEventListener("input", updateCrop);
  heightInput.addEventListener("input", updateCrop);

  function updateCrop() {
    if (!cropper) return;

    const width = parseInt(widthInput.value);
    const height = parseInt(heightInput.value);

    if (!width || !height) return;

    cropper.setData({ width, height });
  }

  // recortar y descargar
  function downloadImage() {
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas({
      imageSmoothingQuality: "high",
    });

    const url = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = url;
    link.download = "imagen-recortada.png";
    link.click();
  }

  cropBtn.addEventListener("click", downloadImage);
  downloadBtn.addEventListener("click", downloadImage);
});
