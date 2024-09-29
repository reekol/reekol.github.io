(() => {


	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')
	let storage = window.localStorage

	loadCss(`
        @media (orientation: landscape) {
            .container {
                padding-top: 2vh
            }
            .map{

            }

        }
        @media (orientation: portrait) {
            .container {
                padding-top: 8vw
            }
        }

        .map {
            color: #074450;
        }
	`)

  loadCssSrc("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css")
  loadScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",() => {


    let map = showAlert(cnt,{title:'Map.',message:'Loading...'},false)
    let mapTitle = map.querySelector('.alertHead')
    let mapBody = map.querySelector('.alertBody')
        mapBody.style.height = "80vh"
        mapBody.id = 'map'
        mapBody.classList.add('map')

    navigator.geolocation.getCurrentPosition(GeoPposition => {
      position = `Lat: ${GeoPposition.coords.latitude} / Lon: ${GeoPposition.coords.longitude}`
      mapTitle.innerText = position
      console.log(position)
      const map = L.map('map').setView([GeoPposition.coords.latitude, GeoPposition.coords.longitude], 13);
      const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      const marker = L.marker([GeoPposition.coords.latitude, GeoPposition.coords.longitude]).addTo(map)
//        .bindPopup(`<b>Position:</b><br />${position}`).openPopup();
    });

  })


})()



