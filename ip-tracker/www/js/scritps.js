console.log("Scripts.js funcionando!!!!");

const inputIp = document.getElementById("inputIp");
const contentIpDomain = document.getElementById("content-ip-domain");
const button = document.getElementById("btnSearch");
const ip = document.getElementById("ip");
const loc = document.getElementById("location");
const timezone = document.getElementById("timezone");
const isp = document.getElementById("isp");
const main = document.getElementById("main");
let map;
const containerLoading = document.getElementById("loading-container");

button.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("clicked");

  require(inputIp.value);
});

inputIp.addEventListener("focus", () => {
  console.log("Está em focus!!!");
  contentIpDomain.style.display = "none";
});
inputIp.addEventListener("blur", () => {
  console.log("Saiu do focus");
  contentIpDomain.style.display = "flex";
});

async function require(input = "") {
  containerLoading.style.display = "flex";

  try {
    const response = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_wQDAcSbLE3632ELGZTmFDiF7nJC7D&ipAddress=${input}&domain=${input}`
    );

    const data = await response.json();
    const IP = data.ip;
    const country = data.location.country;
    const city = data.location.city;
    let postalCode;
    const utc = data.location.timezone;
    const ISP = data.isp;

    if (data.location.postalCode) {
      postalCode = data.location.postalCode;
    } else {
      postalCode = "";
    }

    contentIpDomain.style.display = "flex";

    ip.innerHTML = IP;
    loc.innerHTML = `${country}, ${city} ${postalCode}`;
    timezone.innerHTML = `UTC ${utc}`;
    isp.innerHTML = ISP;

    addMap(data.location.lat, data.location.lng);
    inputIp.value = "";
  } catch (err) {
    console.log(err);
    alert(
      `Alguma coisa deu errado. Tente novamente ou entre em contato com o nosso suporte! Erro: ${err}`
    );
  } finally {
    containerLoading.style.display = "none";
    inputIp.value = "";
    inputIp.blur();
  }
}

function addMap(lat, lng) {
  if (map) {
    map.remove();
  }

  map = L.map("map").setView([lat, lng], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  var marker = L.marker([lat, lng]).addTo(map);
}

require();
