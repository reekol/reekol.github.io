(() => {


	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')
	let storage = window.localStorage
  let btnSync = document.createElement('i')
      btnSync.className = "fas fa-sync-alt"
      nav.appendChild(btnSync)
      btnSync.addEventListener('pointerdown', () => window.location.reload(), false)
      loadCss(`
        .leaflet-bottom { display: none !important }
        .map section{
          all:initial
        }

        @media (orientation: landscape) {
            .container {
                padding-top: 2vh;
            }
            .map{

            }

        }
        @media (orientation: portrait) {
            .container {
                padding-top: 0vw;
            }
            .alert{
              height:100%;
              width:100%;
              margin:0;
              border-radius:0;
            }
            .alertHead {
              border-radius:0;
            }
            nav{ display:none }

        }

        .map {

        }
      `)

    loadCssSrc("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css")
    loadScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",() => {

    let description = GeoPposition => {
        return ''
               + `Accuracy: ${GeoPposition.coords.accuracy}\n`
               + `Lat: ${GeoPposition.coords.latitude} / Lon: ${GeoPposition.coords.longitude}\n`
               + `Altitude: ${GeoPposition.coords.altitude} (acc: ${GeoPposition.coords.altitudeAccuracy})\n`
               + `Heading: ${GeoPposition.coords.heading} /`
               + `Speed: ${GeoPposition.coords.speed} \n`
               + `Timestamp: ${GeoPposition.timestamp}\n`
               + `${new Date(GeoPposition.timestamp)}\n`
    }


    let map = showAlert(cnt,{title:'Map.',message:'Loading...'},false)
    let mapTitle = map.querySelector('.alertHead')
    let mapBody = map.querySelector('.alertBody')
        mapBody.style.height = "100%"
        mapBody.id = 'map'
        mapBody.classList.add('map')

    navigator.geolocation.getCurrentPosition(GeoPposition => {


      mapTitle.innerText = description(GeoPposition)

      const map = L.map('map').setView([GeoPposition.coords.latitude, GeoPposition.coords.longitude], 13);

      let bm1 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 25,
      }).addTo(map);

      let bm2 = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
        maxZoom: 25,
        subdomains:['mt0','mt1','mt2','mt3']
      }).addTo(map)

      L.control.layers({"OsmStreet": bm1, "GoogleSat": bm2 }, []).addTo(map);

      const marker = L.marker([GeoPposition.coords.latitude, GeoPposition.coords.longitude]).addTo(map)
            marker.dragging.enable()
        let p0 = marker.getLatLng()
        let popup = marker.bindPopup(`<i onpointerdown='navigator.share(this.dataset)' class='fa fa-share' data-title='Share location' data-text='Acc:${GeoPposition.coords.accuracy}' data-url='https://www.openstreetmap.org/?mlat=${p0.lat}&mlon=${p0.lng}' ></i><br />Latitude: ${p0.lat} <br />Longitude: ${p0.lng}`).openPopup();

            marker.on('dragend', event => {
                let p1 = marker.getLatLng()
                marker._popup.setContent(`<i onpointerdown='navigator.share(this.dataset)' class='fa fa-share' data-title='Share marker' data-text='Marker ( Latitude: ${p1.lat} / Longitude ${p1.lng} )' data-url='https://www.openstreetmap.org/?mlat=${p1.lat}&mlon=${p1.lng}' ></i><br />Latitude: ${p1.lat} <br />Longitude: ${p1.lng}`)
                marker.openPopup()
//                map.panTo(new L.LatLng(position.lat, position.lng))
            });
    }, alert, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

  })


})()



