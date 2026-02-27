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

(function(){
  "use strict";

  const PARTIALS = [
    { slotId: "HeadbarSlot", name: "headbar.html" },
    { slotId: "FootbarSlot", name: "footbar.html" },
    { slotId: "CookieSlot",  name: "cookies.html"  },
  ];

  function detectLangRoot(){
    // robust für:
    // /de/index.html
    // /de/Pages/vita.html
    // /en/index.html
    // /en/Pages/...
    const parts = window.location.pathname.split("/").filter(Boolean);
    const lang = (parts[0] === "de" || parts[0] === "en") ? parts[0] : "de";
    return `/${lang}/`;
  }

  async function fetchText(url){
    const res = await fetch(url, { cache: "no-cache" });
    if(!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.text();
  }

  async function inject(slotId, url){
    const slot = document.getElementById(slotId);
    if(!slot) return;

    const html = await fetchText(url);
    slot.innerHTML = html;
  }

  async function loadOnce(){
    const langRoot = detectLangRoot();          // "/de/" oder "/en/"
    const base = `${langRoot}Partials/`;        // "/de/Partials/"
    await Promise.all(
      PARTIALS.map(p => inject(p.slotId, base + p.name).catch(err => {
        console.warn(`[includes] Failed ${base + p.name}:`, err);
        const slot = document.getElementById(p.slotId);
        if(slot) slot.innerHTML = "";
      }))
    );
  }

  async function loadWithRetry(){
    // 1–2 Retries helfen manchmal bei Local Dev Reload/Timing
    const tries = 3;
    for(let i=0; i<tries; i++){
      await loadOnce();

      // Check: mindestens Headbar sollte geladen sein
      const hb = document.getElementById("HeadbarSlot");
      const ok = hb && hb.children && hb.children.length > 0;

      if(ok) break;
      await new Promise(r => setTimeout(r, 80));
    }

    document.dispatchEvent(new CustomEvent("partials:loaded"));
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", loadWithRetry, { once:true });
  }else{
    loadWithRetry();
  }

})();