import "./map.scss";

let googleApiPromise = null;

/* -------------------------
   LOAD GOOGLE API ONCE
------------------------- */
function loadGoogleApi() {
  if (googleApiPromise) return googleApiPromise;

  const key = __GMAPS_KEY__ || "";

  googleApiPromise = new Promise((resolve, reject) => {
    if (!key) {
      console.warn("[MAP] Google Maps API key missing");
      return reject();
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;

    document.head.appendChild(script);
  });

  return googleApiPromise;
}

/* -------------------------
   INIT SINGLE MAP
------------------------- */
function initMap(root) {
  const canvas = root.querySelector(".map__canvas");
  if (!canvas) return;

  const lat = parseFloat(root.dataset.lat) || 0;
  const lng = parseFloat(root.dataset.lng) || 0;
  const zoom = parseInt(root.dataset.zoom) || 12;

  const map = new google.maps.Map(canvas, {
    center: { lat, lng },
    zoom,
    disableDefaultUI: true,
  });

  const markers = root.querySelectorAll("[data-map-marker]");

  markers.forEach((el) => {
    const mLat = parseFloat(el.dataset.lat) || lat;
    const mLng = parseFloat(el.dataset.lng) || lng;

    const icon = el.dataset.icon || null;

    new google.maps.Marker({
      position: { lat: mLat, lng: mLng },
      map,
      icon: icon || undefined,
    });
  });

  console.log("[MAP] initialized");
}

/* -------------------------
   PUBLIC INIT
------------------------- */
export async function init() {
  const maps = document.querySelectorAll("[data-ww-map]");
  if (!maps.length) return;

  await loadGoogleApi();

  maps.forEach(initMap);
}
