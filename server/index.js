import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const upload = multer();

app.use(cors());
app.use(express.static("public"));
app.use(express.json({ limit: "20mb" }));

const WITHOUTBG_API_KEY = process.env.WITHOUTBG_API_KEY;

// Endpoint para remover fondo usando base64
app.post("/remove-bg", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Imagen requerida" });

    // Convertimos la imagen a Base64 (sin prefijo data:)
    const imageBase64 = req.file.buffer.toString("base64");

    // Llamamos a la API de WithoutBG
    const response = await fetch(
      "https://api.withoutbg.com/v1.0/image-without-background-base64",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": WITHOUTBG_API_KEY,
        },
        body: JSON.stringify({ image_base64: imageBase64 }),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("ERROR WITHOUTBG:", text);
      return res.status(500).json({ error: "Error en WithoutBG" });
    }

    const data = await response.json();

    const resultBase64 = `data:image/png;base64,${data.img_without_background_base64}`;

    res.json({ result: resultBase64 });
  } catch (error) {
    console.error("ERROR procesando imagen:", error);
    res.status(500).json({ error: "Error procesando imagen" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});
