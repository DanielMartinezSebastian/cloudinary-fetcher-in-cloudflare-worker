// WORKER IN CLOUDFLARE TO GET RESOURCES FROM CLOUDINARY
// https://github.com/DanielMartinezSebastian/cloudinary-fetcher-in-cloudflare-worker

/**
 * Fetches resources from Cloudinary and generates an HTML response with formatted images and videos.
 * @param {Request} request - The request object.
 * @param {Object} env - The environment variables.
 * @param {Object} ctx - The context object.
 * @returns {Response} The HTML response with formatted images and videos.
 */
export default {
  async fetch(request, env, ctx) {
    const cloudName = env.CLOUD_NAME;
    const apiKey = env.API_KEY;
    const apiSecret = env.API_SECRET;

    async function getAllResources(type) {
      let allResources = [];
      let nextCursor = null;

      do {
        const url = nextCursor
          ? `https://api.cloudinary.com/v1_1/${cloudName}/resources/${type}?next_cursor=${nextCursor}`
          : `https://api.cloudinary.com/v1_1/${cloudName}/resources/${type}`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Basic ${btoa(`${apiKey}:${apiSecret}`)}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener recursos de Cloudinary");
        }

        const responseData = await response.json();
        const resources = responseData.resources || [];
        allResources = [...allResources, ...resources];

        nextCursor = getNextCursor(responseData);
      } while (nextCursor);

      return allResources;
    }

    const imageResources = await getAllResources("image");
    const videoResources = await getAllResources("video");

    function getNextCursor(responseData) {
      return responseData.next_cursor || null;
    }

    function formatResources(resources, type) {
      const files = resources.map((resource) => ({
        name: resource.public_id,
        url: resource.secure_url,
      }));

      const formattedFiles = type;
      if (type === "Imagen") {
        return files
          .map(
            (file) =>
              `<article style="display: flex; flex-direction: column; align-items: center">
                <a href="${file.url}" target="_blank">
                 <img
                  src="${file.url}"
                  alt="${file.name}"
                  caption="${file.name}"
                  lazy="loading"
                  width="150"
                 />
                </a>    
               </article>`
          )
          .join("");
      } else if (type === "Video") {
        return files
          .map(
            (file) =>
              `<article style="display: flex; flex-direction: column; align-items: center;">
                 <a
                  href="${file.url}"
                  target="_blank"
                  >
                  <video src="${file.url}" alt="${file.name}" caption="${file.name}"  width="300" controls  loop muted autoplay playsinline lazy="loading"></video>
                 </a>
               </article>`
          )
          .join("");
      }
      return `${formattedFiles}`;
    }

    const formattedImages = formatResources(imageResources, "Imagen");
    const formattedVideos = formatResources(videoResources, "Video");

    const htmlResponse = `
  <!DOCTYPE html>
<html>
  <head>
    <title>Archivos en Cloudinary</title>
    <meta charset="utf-8" />
    <meta name="description" content="Cargando archivos de Cloudinary mediante Workers de Cloudflare">
    <meta property="og:title" content="Archivos en Cloudinary">
    <meta property="og:description" content="Cargando archivos de Cloudinary mediante Workers de Cloudflare">
    <meta property="og:image" content="https://res.cloudinary.com/martinezsebastian-test/image/upload/v1701113111/cld-sample-3.jpg">
    <meta property="og:url" content="https://cloudinary.elotromartinezsebastian.workers.dev/">
    <meta property="og:type" content="website">
    <meta name="author" content="Daniel Martínez Sebastián">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      h1 {
        font-size: 4rem;
        text-align: left;
        margin-bottom: -3rem;
      }
      @media (max-width: 600px) {
        h1 {
          margin-bottom: -1rem;
        }
      }
      h4 {
        font-size: 2rem;
        margin-bottom: 1.4rem;
        text-align: right;
      }
      hr {
        margin: 1rem 0;
        border: 0;
        border-top: 1px solid #333;
        margin-bottom: 2rem;
      }
      body {
        font-family: Roboto, sans-serif;
        margin: 0 auto;
        padding: 20px;
        background-color: #f5f5f5;
        color: #333;
        max-width: 800px;
        text-align: center;
      }
      section {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
      }
      section.videos {
        grid-template-columns: repeat(2, 1fr);
      }
      section article {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20px;
      }
      section article a {
        display: block;
        text-align: center;
        text-decoration: none;
      }
      section article a img {
        width: 100%;
        height: auto;
        max-width: 100%;
        border-radius: 10px;
      }
      section article a video {
        width: 100%;
        height: 100%;
        max-width: 100%;
        border-radius: 10px;
      }
      section article:first-child {
        width: 100%;
        grid-column: 1 / span 2;
      }
      footer {
        margin-top: 2rem;
      }
      footer p {
        margin: 0;
      }
      footer p span {
        font-size: 1.2rem;
        margin-bottom: .4rem;
      }
      footer p a {
        display: flex;
        flex-direction: column;
        color: #333;
        text-decoration: none;
      }
      .github {
        position: fixed;
        bottom: 0;
        right: 0;
        margin-right: 10px;
        margin-bottom: 10px;
      }
    
      .github a {
        text-decoration: none;
      }
    </style>
  </head>
  <body>
  <span class="github">
    <a href="https://github.com/DanielMartinezSebastian/cloudinary-fetcher-in-cloudflare-worker" target="_blank">
      <img src="https://res.cloudinary.com/martinezsebastian-test/image/upload/v1701172035/icons/ly7h0ssaorev80fdu1wi.png" alt="GitHub" width="50" />
    </a>
  </span>
    <h1>Cloudinary</h1>
    <h4>Imágenes</h4>
    <hr />
    <section class="images">${formattedImages}</section>
    <h4>Vídeos</h4>
    <hr />
    <section class="videos">${formattedVideos}</section>
    <footer>
      <p>
        <a href="#" style="text-decoration: none; color: #333">
          <span>&#9650;</span>
          <strong>Volver Arriba</strong>
        </a>
      </p>
    </footer>
    <script>
      window.onload = function () {
        const imagesSection = document.querySelector(".images");
        const videosSection = document.querySelector(".videos");

        adjustLastRow(imagesSection);
        adjustLastRow(videosSection);
      };

      function adjustLastRow(section) {
        const articles = section.querySelectorAll("article");
        const lastRowLength = articles.length % 2;
        const lastRow = articles.length - lastRowLength;
        const halfArticles = articles.length / 2;

        if (lastRowLength === 1) {
          articles[lastRow].style.width = "100%";
        } else if (lastRowLength === 0) {
          articles[halfArticles - 1].style.gridColumn = "2 / span 2";
          if (articles.length >= lastRow - 6 && lastRow - 6 >= 0) {
            articles[lastRow - 6].style.gridColumn = "2 / span 2";
          }
          if (articles.length >= lastRow - 3 && lastRow - 3 >= 0) {
            articles[lastRow - 3].style.gridColumn = "2 / span 2";
          }
          if (articles.length >= lastRow - 4 && lastRow - 4 >= 0) {
            articles[lastRow - 4].style.width = "100%";
          }
        }
      }
    </script>
  </body>
</html>
`;

    return new Response(htmlResponse, {
      headers: { "Content-Type": "text/html" },
      status: 200,
    });
  },
};
