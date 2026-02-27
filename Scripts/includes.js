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
(async () => {
  // Map slot IDs to partial files
  const PARTIALS = [
    { slotId: "HeadbarSlot", file: "Partials/headbar.html" },
    { slotId: "FootbarSlot", file: "Partials/footbar.html" },
    { slotId: "CookieSlot",  file: "Partials/cookies.html" },
  ];

  async function loadPartial(slotId, file) {
    const slot = document.getElementById(slotId);
    if (!slot) return; // allow pages without certain slots

    try {
      const res = await fetch(file, { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${file}`);
      const html = await res.text();
      slot.innerHTML = html;
    } catch (err) {
      console.warn(`[includes] Failed to load ${file}:`, err);
      // Fail gracefully: keep slot empty
      slot.innerHTML = "";
    }
  }

  // Load in parallel
  await Promise.all(PARTIALS.map(p => loadPartial(p.slotId, p.file)));

  // Let other scripts know that partials are ready (optional, but handy)
  document.dispatchEvent(new CustomEvent("partials:loaded"));
})();