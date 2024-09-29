(() => {


	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')
	let storage = window.localStorage

	loadCss(`
        .map section{
          all:initial
        }

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
      position = `Acc: ${GeoPposition.coords.accuracy} / Lat: ${GeoPposition.coords.latitude} / Lon: ${GeoPposition.coords.longitude}`
      mapTitle.innerText = position
      console.log(position)

      const map = L.map('map').setView([GeoPposition.coords.latitude, GeoPposition.coords.longitude], 13);

      let bm1 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      let bm2 = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
      }).addTo(map)

      L.control.layers({"OsmStreet": bm1, "GoogleSat": bm2 }, []).addTo(map);

      const marker = L.marker([GeoPposition.coords.latitude, GeoPposition.coords.longitude]).addTo(map)
//        .bindPopup(`<b>Position:</b><br />${position}`).openPopup();
    }, alert, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

  })


})()



