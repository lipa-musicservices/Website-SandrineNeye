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

  function setupHeadbarBurger(){
    const burger = document.querySelector(".Headbar__burger");
    const menu = document.getElementById("MobileMenu");
    const headbar = document.querySelector(".Headbar");

    if(!burger || !menu) return;

    const openMenu = () => {
      menu.classList.add("is-open");
      burger.setAttribute("aria-expanded", "true");
    };

    const closeMenu = () => {
      menu.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    };

    const toggleMenu = () => {
      const isOpen = menu.classList.contains("is-open");
      isOpen ? closeMenu() : openMenu();
    };

    // Toggle on burger click
    burger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });

    // Prevent clicks inside menu from bubbling to document (so it doesn't close)
    menu.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if(!menu.classList.contains("is-open")) return;

      const clickedBurger = burger.contains(e.target);
      const clickedMenu = menu.contains(e.target);
      const clickedHeadbar = headbar ? headbar.contains(e.target) : false;

      // If click is NOT in burger/menu/headbar area => close
      if(!clickedBurger && !clickedMenu && !clickedHeadbar){
        closeMenu();
      }
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
      if(e.key !== "Escape") return;
      if(!menu.classList.contains("is-open")) return;
      closeMenu();
    });

    // Close after clicking a link inside menu
    menu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => closeMenu());
    });

    // Auto close when resizing to desktop
    window.addEventListener("resize", () => {
      if(window.matchMedia("(max-width: 980px)").matches) return;
      closeMenu();
    });

    // Ensure initial state
    burger.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
  }

  // Run after partials are injected (Headbar/Footbar/Cookies)
  document.addEventListener("partials:loaded", () => {
    setupHeadbarBurger();
    // Hook for future logic (nav highlights, cookie logic, etc.)
    // console.log("Partials loaded.");
  });

  // If a page doesn't use includes.js, we still want DOM-ready hook.
  document.addEventListener("DOMContentLoaded", () => {
    // Fallback: try to set up anyway (in case headbar is already in DOM)
    setupHeadbarBurger();
  });
})();

function setFooterYear(){
  // Wichtig: querySelectorAll, falls es mehrere Footers gibt oder doppelt geladen wird
  document.querySelectorAll("#YearSlot").forEach(el => {
    el.textContent = String(new Date().getFullYear());
  });
}

document.addEventListener("partials:loaded", () => {
  setFooterYear();
});

document.addEventListener("DOMContentLoaded", () => {
  setFooterYear(); // Fallback, falls jemand die Seite ohne Partials lädt
});

/* ==============================================================================
   Cookie Consent – Stable Version
============================================================================== */

(function(){
  "use strict";

  const STORAGE_KEY = "lipa.cookieConsent.v1";

  function initCookie(){

    const overlay = document.getElementById("CookieOverlay");
    const accept  = document.getElementById("CookieAccept");
    const decline = document.getElementById("CookieDecline");

    if(!overlay || !accept || !decline) return;

    // Prevent double binding
    if(overlay.dataset.initialized === "1") return;
    overlay.dataset.initialized = "1";

    function closeBanner(){
      overlay.style.display = "none";      // <- NICHT hidden, sondern display
      document.body.style.overflow = "";
    }

    function openBanner(){
      overlay.style.display = "flex";
      document.body.style.overflow = "hidden";
    }

    function setConsent(value){
      localStorage.setItem(STORAGE_KEY, value);
      document.documentElement.dataset.consent = value;
    }

    const existing = localStorage.getItem(STORAGE_KEY);

    if(!existing){
      openBanner();
    } else {
      closeBanner();
      document.documentElement.dataset.consent = existing;
    }

    accept.addEventListener("click", function(){
      setConsent("accept");
      closeBanner();
    });

    decline.addEventListener("click", function(){
      setConsent("decline");
      closeBanner();
    });
  }

  document.addEventListener("partials:loaded", initCookie);
  document.addEventListener("DOMContentLoaded", initCookie);

})();