(() => {
  "use strict";

  /* ═══════════════════════════════════════════
     CONFIGURACIÓN
     ═══════════════════════════════════════════ */

  const CHANNEL_ID = "UC_STATS_PENDIENTE";
  const YOUTUBE_API_KEY = "TU_API_KEY";
  const MAX_EPISODES = 9;

  const SOCIAL_LINKS = {
    tiktok: "https://www.tiktok.com/@quehariasoficial",
    instagram: "https://www.instagram.com/quehariasoficial",
    facebook: "https://www.facebook.com/quehariasoficial"
  };

  // URLs de los capítulos en YouTube (actualizar con los IDs reales)
  const CHAPTERS = [
    { num: 7, name: "El amigo que nadie creyó", desc: "Quiso advertirle algo que podía cambiarlo todo", youtube: "https://www.youtube.com/@quehariasoficial" },
    { num: 6, name: "Crecí creyendo una mentira", desc: "Encontró unos papeles que nunca debió ver", youtube: "https://www.youtube.com/@quehariasoficial" },
    { num: 5, name: "Un verano pendiente", desc: "Estuvo a punto de decirle algo importante", youtube: "https://www.youtube.com/@quehariasoficial" },
    { num: 4, name: "El peso de lo que nunca nos dijimos", desc: "Una verdad que nadie esperaba", youtube: "https://www.youtube.com/@quehariasoficial" },
    { num: 3, name: "No colgó y se escuchó todo", desc: "Ella pensó que nadie la escuchaba", youtube: "https://www.youtube.com/@quehariasoficial" },
    { num: 2, name: "Lección para toda la vida", desc: "Una historia que no se puede olvidar", youtube: "https://www.youtube.com/@quehariasoficial" },
    { num: 1, name: "La Última Llamada", desc: "¿Hasta dónde llegarías por tu familia?", youtube: "https://www.youtube.com/@quehariasoficial" }
  ];

  /* ═══════════════════════════════════════════
     CARGAR EPISODIOS
     ═══════════════════════════════════════════ */

  async function loadEpisodes() {
    const grid = document.getElementById("episodesGrid");

    if (YOUTUBE_API_KEY === "TU_API_KEY" || CHANNEL_ID === "UC_STATS_PENDIENTE") {
      renderStaticEpisodes(grid);
      return;
    }

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}` +
        `&channelId=${CHANNEL_ID}&part=snippet&order=date&type=video&maxResults=${MAX_EPISODES}`
      );
      const data = await res.json();

      if (!data.items || data.items.length === 0) {
        renderStaticEpisodes(grid);
        return;
      }

      grid.innerHTML = data.items.map((item, i) => {
        const vid = item.id.videoId;
        const title = item.snippet.title;
        const date = new Date(item.snippet.publishedAt).toLocaleDateString("es-ES", {
          day: "numeric", month: "short", year: "numeric"
        });
        const thumb = item.snippet.thumbnails.medium.url;

        return `
          <a href="https://www.youtube.com/watch?v=${vid}" target="_blank" class="episode-card">
            <img class="episode-thumb" src="${thumb}" alt="${title}" loading="lazy">
            <div class="episode-info">
              <div class="episode-number">Episodio ${data.items.length - i}</div>
              <div class="episode-title">${escapeHtml(title)}</div>
              <div class="episode-meta">
                <span>${date}</span>
              </div>
            </div>
          </a>
        `;
      }).join("");
    } catch (err) {
      console.error("Error cargando episodios:", err);
      renderStaticEpisodes(grid);
    }
  }

  function renderStaticEpisodes(grid) {
    grid.innerHTML = CHAPTERS.map(ch => `
      <a href="${ch.youtube}" target="_blank" class="episode-card">
        <div class="episode-thumb" style="display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--bg-hover),var(--bg))">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
            <polygon points="10,8 16,12 10,16" fill="currentColor" opacity="0.3"/>
          </svg>
        </div>
        <div class="episode-info">
          <div class="episode-number">Episodio ${ch.num}</div>
          <div class="episode-title">${ch.name}</div>
          <div class="episode-meta">
            <span>${ch.desc}</span>
          </div>
        </div>
      </a>
    `).join("");
  }

  /* ═══════════════════════════════════════════
     LINKS DE REDES SOCIALES
     ═══════════════════════════════════════════ */

  function setSocialLinks() {
    const set = (id, url) => {
      const el = document.getElementById(id);
      if (el) el.href = url;
    };
    set("tiktok-link", SOCIAL_LINKS.tiktok);
    set("ig-link", SOCIAL_LINKS.instagram);
    set("fb-link", SOCIAL_LINKS.facebook);
    set("footer-ig", SOCIAL_LINKS.instagram);
    set("footer-tt", SOCIAL_LINKS.tiktok);
  }

  /* ═══════════════════════════════════════════
     UTILIDADES
     ═══════════════════════════════════════════ */

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  /* ═══════════════════════════════════════════
     INICIALIZACIÓN
     ═══════════════════════════════════════════ */

  document.addEventListener("DOMContentLoaded", () => {
    setSocialLinks();
    loadEpisodes();
  });
})();
