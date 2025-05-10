var time = document.getElementById("time");
var params = new URLSearchParams(window.location.search);

var options = { year: 'numeric', month: 'numeric', day: 'numeric' };

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

var date = new Date();
setClock();
function setClock() {
    date = new Date();
    time.innerHTML = "Czas: " + date.toTimeString().split(" ")[0] + " " + date.toLocaleDateString("pl-PL", options);
    delay(1000).then(() => {
        setClock();
    })
}

let webManifest = {
  "name": "",
  "short_name": "",
  "theme_color": "#f5f6fb",
  "background_color": "#f5f6fb",
  "display": "standalone"
};

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (/windows phone/i.test(userAgent)) {
      return 1;
  }

  if (/android/i.test(userAgent)) {
      return 2;
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return 3;
  }

  return 4;
}

if (getMobileOperatingSystem() == 2) {
    document.querySelector(".bottom_bar").style.height = "70px";
}

let manifestElem = document.createElement('link');
manifestElem.setAttribute('rel', 'manifest');
manifestElem.setAttribute('href', 'data:application/manifest+json;base64,' + btoa(JSON.stringify(webManifest)));
document.head.prepend(manifestElem);

var unfold = document.querySelector(".info_holder");
unfold.addEventListener('click', () => {
    if (unfold.classList.contains("unfolded")) {
        unfold.classList.remove("unfolded");
    } else {
        unfold.classList.add("unfolded");
    }
})

// 🛠️ Ładowanie danych z URL

document.querySelector(".id_own_image").style.backgroundImage = `url('${params.get("image")}')`;

var birthday = params.get("birthday") || "";
var sex = params.get("sex") || "";

setData("name", (params.get("name") || "").toUpperCase());
setData("surname", (params.get("surname") || "").toUpperCase());
setData("nationality", (params.get("nationality") || "").toUpperCase());
setData("birthday", birthday);
setData("familyName", params.get("familyName") || "");
setData("sex", sex || "");
setData("fathersFamilyName", params.get("fathersFamilyName") || "");
setData("mothersFamilyName", params.get("mothersFamilyName") || "");
setData("birthPlace", params.get("birthPlace") || "");
setData("countryOfBirth", params.get("countryOfBirth") || "");
setData("adress", params.get("adress") || ""); // 🚀 Tutaj pobierasz cały adres
setData("checkInDate", params.get("checkInDate") || "");

// 🛠️ Automatyczne generowanie PESEL
if (birthday !== "" && sex !== "") {
    var birthdaySplit = birthday.split(".");
    var day = birthdaySplit[0];
    var month = birthdaySplit[1];
    var year = birthdaySplit[2];

    if (parseInt(year) >= 2000) {
        month = (20 + parseInt(month)).toString();
    }

    var later;
    if (sex.toLowerCase() === "mężczyzna") {
        later = "0295";
    } else {
        later = "0382";
    }

    var pesel = year.substring(2) + month + day + later + "7";
    setData("pesel", pesel);
}

function setData(id, value) {
    if (document.getElementById(id)) {
        document.getElementById(id).innerHTML = value;
    }
}

// Zmieniony link, który przekierowuje do folderu fObywatel
function generateLink() {
    const newLink = `https://gondzio33.github.io/fObywatel/id.html?${params.toString()}`;
    return newLink;
}

// Na przykład, jeśli chcesz wyświetlić nowy link na stronie:
document.getElementById('generatedLink').innerHTML = `<a href="${generateLink()}">Kliknij tutaj, aby zobaczyć dane</a>`;

