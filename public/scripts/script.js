const xhr = new XMLHttpRequest();

let oneriInput = document.getElementById("oneriInput");

let results = document.getElementById("results");

oneriInput.addEventListener("input", () => {
    console.clear();
    results.innerHTML = "";
    xhr.open("GET", `https://api.themoviedb.org/3/search/movie?api_key=f066cb9d57ebb443ac69d62fbc7c16f5&language=tr&page=1&include_adult=false&query=${oneriInput.value}`);
    xhr.send();
    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        if ((this.status == 200) && (this.status < 300)) {
          let patates = JSON.parse(this.responseText);
          patates.results.map(film => {

            results.innerHTML += `
                <div class="shadow rounded p-2 mt-3 bgposition" style="background-image: url(https://www.themoviedb.org/t/p/w600_and_h900_bestv2${film.backdrop_path});">
                    <h4> Film Bilgileri </h4>
                    <div class="d-flex">
                        <div class="shadow rounded">
                            <img src="https://www.themoviedb.org/t/p/w600_and_h900_bestv2${film.poster_path}", alt="", width=150>
                        </div>
                        <div class="ml-1">
                            <div class="shadow p-2 transbgcolor text-light rounded"> Film Adı: ${film.title} </div>
                            <div class="shadow p-2 mt-2 transbgcolor text-light rounded"> Genel Bakış: ${film.overview} </div>
                            <button class="btn btn-primary btn-sm mt-2 mr-auto">Önerilenlere Ekle</button>
                        </div>
                    </div>
                </div>
            `;


              console.log(film);
          })
        }
      }
    }
})


    
    