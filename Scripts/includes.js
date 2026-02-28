/* ==============================================================================
    __    _ ____            __  ___           _         _____                 _
   / /   (_) __ \____ _    /  |/  /_  _______(_)____   / ___/___  ______   __(_)_______  _____
  / /   / / /_/ / __ `/   / /|_/ / / / / ___/ / ___/   \__ \/ _ \/ ___/ | / / / ___/ _ \/ ___/
 / /___/ / ____/ /_/ /   / /  / / /_/ (__  ) / /__    ___/ /  __/ /   | |/ / / /__/  __(__  )
/_____/_/_/    \__,_/   /_/  /_/\__,_/____/_/\___/   /____/\___/_/    |___/_/\___/\___/____/

   LiPa Music Services – Abteilung Webentwicklung
   © 2026 LiPa Music Services GbR
   https://www.lipamusicservices.com
============================================================================== */

(function () {
  "use strict";

  // liefert "de" oder "en" anhand der URL
  function getLangFolder() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    // z.B. ["de","index.html"] oder ["de","Pages","vita.html"]
    const first = (parts[0] || "").toLowerCase();
    if (first === "de" || first === "en") return first;
    // fallback: deutsch
    return "de";
  }

  function absUrl(path) {
    // baut absolute URL aus Origin + "/de/Partials/..."
    return window.location.origin + "/" + path.replace(/^\/+/, "");
  }

  async function inject(slotId, url) {
    const slot = document.getElementById(slotId);
    if (!slot) return;

    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      slot.innerHTML = await res.text();
    } catch (e) {
      console.warn(`[includes] ${slotId} failed:`, url, e);
      slot.innerHTML = "";
    }
  }

  async function loadPartials() {
    const lang = getLangFolder(); // "de" | "en"
    await Promise.all([
      inject("HeadbarSlot", absUrl(`${lang}/Partials/headbar.html`)),
      inject("FootbarSlot", absUrl(`${lang}/Partials/footbar.html`)),
      inject("CookieSlot",  absUrl(`${lang}/Partials/cookies.html`)),
    ]);

    document.dispatchEvent(new Event("partials:loaded"));
  }

  // DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadPartials);
  } else {
    loadPartials();
  }
})();