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

  // Run after partials are injected (Headbar/Footbar/Cookies)
  document.addEventListener("partials:loaded", () => {
    // Hook for future logic (nav highlights, burger menu, cookie logic, etc.)
    // console.log("Partials loaded.");
  });

  // If a page doesn't use includes.js, we still want DOM-ready hook.
  document.addEventListener("DOMContentLoaded", () => {
    // Page-specific logic can go here, or delegate by body data attributes.
  });
})();