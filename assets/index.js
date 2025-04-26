// Wybieramy upload
var upload = document.querySelector(".upload");

// Tworzymy input typu file
var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = ".jpeg,.png,.gif";

// Usuwanie błędu po kliknięciu w pole tekstowe
document.querySelectorAll(".input_holder").forEach((element) => {
    var input = element.querySelector(".input");
    input.addEventListener('click', () => {
        element.classList.remove("error_shown");
    });
});

// Kliknięcie na upload otwiera wybór pliku
upload.addEventListener('click', () => {
    imageInput.click();
});

// Obsługa wyboru pliku
imageInput.addEventListener('change', (event) => {
    upload.classList.remove("upload_loaded");
    upload.classList.add("upload_loading");
    upload.removeAttribute("selected");

    var file = imageInput.files[0];
    var data = new FormData();
    data.append("image", file);

    fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
            'Authorization': 'Client-ID 4ecc257cbb25ccc'
        },
        body: data
    })
    .then(result => result.json())
    .then(response => {
        if (response.success) {
            var url = response.data.link;
            upload.classList.remove("error_shown");
            upload.setAttribute("selected", url);
            upload.classList.add("upload_loaded");
            upload.classList.remove("upload_loading");
            upload.querySelector(".upload_uploaded").src = url;
        } else {
            alert("Nie udało się załadować zdjęcia. Spróbuj ponownie.");
            upload.classList.remove("upload_loading");
        }
    })
    .catch(error => {
        console.error("Błąd przy uploadzie:", error);
        alert("Wystąpił błąd przy wgrywaniu zdjęcia.");
        upload.classList.remove("upload_loading");
    });
});

// Kliknięcie przycisku "Dalej"
document.querySelector(".go").addEventListener('click', () => {
    var empty = [];
    var params = new URLSearchParams();

    // Sprawdzanie, czy jest zdjęcie
    if (!upload.hasAttribute("selected")) {
        empty.push(upload);
        upload.classList.add("error_shown");
    } else {
        params.append("image", upload.getAttribute("selected"));
    }

    // Sprawdzanie pól tekstowych
    document.querySelectorAll(".input_holder").forEach((element) => {
        var input = element.querySelector(".input");
        params.append(input.id, input.value);

        if (isEmpty(input.value)) {
            empty.push(element);
            element.classList.add("error_shown");
        }
    });

    // Jeśli są puste pola, skroluj do pierwszego
    if (empty.length != 0) {
        empty[0].scrollIntoView();
    } else {
        forwardToId(params);
    }
});

// Funkcja sprawdzająca czy pole jest puste
function isEmpty(value) {
    let pattern = /^\s*$/;
    return pattern.test(value);
}

// Funkcja przekierowania na stronę id.html z parametrami
function forwardToId(params) {
    location.href = "/id.html?" + params;
}

// Rozwijanie i zwijanie instrukcji
var guide = document.querySelector(".guide_holder");
guide.addEventListener('click', () => {
    if (guide.classList.contains("unfolded")) {
        guide.classList.remove("unfolded");
    } else {
        guide.classList.add("unfolded");
    }
});
