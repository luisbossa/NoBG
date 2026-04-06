document.addEventListener("DOMContentLoaded", () => {
  const convertFileInput = document.getElementById("convertFileInput");
  const convertSelectBtn = document.getElementById("convertSelectBtn");
  const convertUploadArea = document.getElementById("convertUploadArea");
  const convertPreview = document.getElementById("convertPreview");
  const convertImage = document.getElementById("convertImage");
  const convertBtn = document.getElementById("convertBtn");

  let currentURL = convertImage.src; // Imagen inicial

  // Botón para seleccionar imagen
  convertSelectBtn.addEventListener("click", () => convertFileInput.click());

  // Drag & Drop
  convertUploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    convertUploadArea.style.borderColor = "#2563eb";
  });

  convertUploadArea.addEventListener("dragleave", () => {
    convertUploadArea.style.borderColor = "#d1d5db";
  });

  convertUploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    convertUploadArea.style.borderColor = "#d1d5db";
    handleFile(e.dataTransfer.files[0]);
  });

  // Selección de archivo
  convertFileInput.addEventListener("change", (e) =>
    handleFile(e.target.files[0]),
  );

  function handleFile(file) {
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      alert("Solo se permiten archivos JPG, JPEG o PNG");
      return;
    }

    if (currentURL && currentURL.startsWith("blob:"))
      URL.revokeObjectURL(currentURL);
    currentURL = URL.createObjectURL(file);
    convertImage.src = currentURL;
  }

  // Convertir a WebP
  convertBtn.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.src = convertImage.src;

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "imagen.webp";
          link.click();
          URL.revokeObjectURL(url);
        },
        "image/webp",
        0.95,
      );
    };
  });
});
