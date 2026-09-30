# Sitio web informativo

Página estática (HTML + CSS + JS), sin base de datos ni servidor.

## Estructura

```
index.html       Página principal (todas las secciones)
css/styles.css   Estilos — colores de marca en :root
js/main.js       Menú móvil, animaciones y formulario de contacto
img/             Logo, favicon e ilustraciones (reemplázalos por los tuyos)
```

## Cómo verla

Abre `index.html` con doble clic en tu navegador.

## Personalizar

1. **Textos**: edita `index.html` (nombre de la empresa, servicios, testimonios, datos de contacto).
2. **Colores**: cambia `--color-primary` y demás variables al inicio de `css/styles.css`.
3. **WhatsApp del formulario**: cambia `WHATSAPP_NUMBER` en `js/main.js`. El formulario abre WhatsApp con el mensaje de cita ya redactado.
4. **Imágenes**: reemplaza los archivos de `img/` manteniendo los nombres, o actualiza las rutas en el HTML.

## Publicar

Sube la carpeta tal cual a cualquier hosting estático: GitHub Pages, Netlify, Vercel o el hosting de tu dominio.
