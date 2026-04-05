# Remove Background App

Aplicación web para **quitar el fondo de imágenes** usando Inteligencia Artificial.  
El backend está hecho con **Node.js** y **Express**, y utiliza la API de **WithoutBG** para procesar imágenes en formato Base64.

---

## Características

- Subida de imágenes vía **drag & drop** o botón de selección.  
- Visualización **antes y después** con **slider interactivo**.  
- Descarga de la imagen resultante en **PNG con fondo transparente**.  
- Compatible con **JPG, PNG, WebP, TIFF, BMP y GIF**.  
- Uso de la API de WithoutBG mediante **Base64**, evitando errores de CORS o 403.  

---

## Tecnologías

- **Backend:** Node.js, Express, multer, node-fetch  
- **Frontend:** HTML, CSS, JavaScript  
- **API externa:** [WithoutBG](https://withoutbg.com)  
- **Entorno:** Docker opcional  

---

## Requisitos

- Node.js >= 18  
- npm  
- Clave de API de WithoutBG (`WITHOUTBG_API_KEY`)  
- Imagen de prueba para subir  

---

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/remove-bg-app.git
cd remove-bg-app