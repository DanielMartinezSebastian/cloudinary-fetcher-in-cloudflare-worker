# README.md

### ****Cloudinary Fetcher running in Cloudflare Worker****

Este script de JavaScript se ejecuta en un entorno de Cloudflare Workers y se utiliza para obtener y formatear recursos de Cloudinary, un servicio de gestión de activos digitales.

![webpage caption](webpage-caption.jpg)

### Funciones

- **`fetch(request, env, ctx)`**: Esta función asíncrona es el punto de entrada del script. Obtiene las variables de entorno necesarias para la autenticación con Cloudinary y luego llama a la función **`getAllResources(type)`** para obtener todos los recursos de imagen y video. Luego, formatea estos recursos en HTML y devuelve una respuesta HTML.
- **`getAllResources(type)`**: Esta función asíncrona obtiene todos los recursos de un tipo específico (imágenes o videos) de Cloudinary. Utiliza un bucle **`do...while`** para hacer solicitudes a la API de Cloudinary hasta que no haya más recursos para obtener.
- **`getNextCursor(responseData)`**: Esta función devuelve el cursor de la próxima página de la respuesta de la API, o **`null`** si no hay cursor de próxima página.
- **`formatResources(resources, type)`**: Esta función toma una matriz de recursos y un tipo de recurso, y devuelve una cadena de HTML que representa los recursos.

### Uso

Para utilizar este script, necesitarás configurar las siguientes variables de entorno:

- **`CLOUD_NAME`**: El nombre de tu nube en Cloudinary.
- **`API_KEY`**: Tu clave de API de Cloudinary.
- **`API_SECRET`**: Tu secreto de API de Cloudinary.

Luego, puedes desplegar este script en un Worker de Cloudflare y hacer solicitudes a él para obtener una respuesta HTML con tus recursos de Cloudinary formateados.

### Ejemplo de respuesta

La respuesta HTML generada por este script incluirá secciones para imágenes y videos, cada una con los recursos correspondientes formateados en elementos **`article`**. Cada recurso incluirá un enlace al recurso en Cloudinary y, en el caso de los videos, controles de reproducción.

Además, la respuesta incluirá un enlace para volver al principio de la página y un script para ajustar el diseño de la última fila de recursos si su longitud es impar.
