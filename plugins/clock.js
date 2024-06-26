(() => {

   	let idx = PROJECT + ''
	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')
	let storage = window.localStorage
    let initTime = Date.now()
    let API = 'https://worldtimeapi.org/api/ip'
    let btnSync = document.createElement('i')
        btnSync.className = "fas fa-sync-alt"
        nav.appendChild(btnSync)

    loadCssSrc('https://fonts.googleapis.com/css?family=Orbitron')
	loadCss(`
        @media (orientation: landscape) {
            .container {
                padding-top: 2vh
            }
            .clock{
                font-size: 5vw;
                letter-spacing: 2vw;
            }

        }
        @media (orientation: portrait) {
            .container {
                padding-top: 8vw
            }
            .clock{
                font-size: 12vw;
                letter-spacing: 2vw;
            }
        }

        .clock {
            color: #17D4FE;
            font-family: 'Orbitron', sans-serif, monospace !important;
            font-weight: bold;
        }
	`)


    let alertStopWatch = showAlert(cnt,{title:'Stop watch.',message:'0'},false)
    let alertUTC = showAlert(cnt,{title:'UTC',message:'00:00:00'},false)
    let alertTZ = showAlert(cnt,{title:'00:00:00',message:'TZ'},false)

    let alertTitleStopWatch = alertStopWatch.querySelector('.alertHead')
    let alertBodyStopWatch = alertStopWatch.querySelector('.alertBody')
        alertBodyStopWatch.classList.add('clock')


    let alertTitleTZ = alertTZ.querySelector('.alertHead')
        alertTitleTZ.classList.add('clock')

    let alertBodyTZ = alertTZ.querySelector('.alertBody')
        alertBodyTZ.classList.add('preformatted')

    let alertTitleUTC = alertUTC.querySelector('.alertHead')

    let alertBodyUTC = alertUTC.querySelector('.alertBody')
        alertBodyUTC.classList.add('clock')

    let textNode = document.createTextNode('')
    let clocksInterval = setInterval( e => e ,1000)
    let sync = e => {
        btnSync.classList.add('rotating')
        fetch(API)
        .then(response => response.json())
        .then(data => {
            btnSync.classList.remove('rotating')
            let now = new Date()
            let dateTz = new Date(data.datetime.split('.')[0].replace('T',' '))
            let dateUtc = new Date(data.utc_datetime.split('.')[0].replace('T',' '))
            let dateUtcDiff = (dateUtc - dateTz)
            let dateTzDiff = (now - dateTz)
                alertTitleUTC.innerText = 'Utc'
                textNode.remove()
                textNode = document.createTextNode([
                `Client IP: ${data.client_ip}`,
                `Timezone: [${data.abbreviation}] ${data.timezone}`,
                `UTC offset: ${data.utc_offset}`,
                `Day of the week: ${data.day_of_week}`,
                `Day of the year: ${data.day_of_year}`,
                `Is Daylight saving: ${data.dst}`,
                `Daylight saving from: ${data.dst_from}`,
                `Daylight saving seconds: ${data.dst_offset}`,
                `Daylight saving to:${data.dst_until}`
            ].join(',\n'))
                alertBodyTZ.appendChild(textNode)

            d(['diff: UTC, Tz',dateUtcDiff,dateTzDiff])
            let showNow = e => {

                    let dtTZ  = new Date()
                    let dtUTC = new Date()

                        dtTZ. setMilliseconds(dtTZ. getMilliseconds() + dateTzDiff )
                        dtUTC.setMilliseconds(dtUTC.getMilliseconds() + dateUtcDiff)

                    alertTitleTZ.innerText = [
                            dtTZ.  getHours().toString().padStart(2,0),
                            dtTZ.getMinutes().toString().padStart(2,0),
                            dtTZ.getSeconds().toString().padStart(2,0),
                        ].join(':')

                    alertBodyUTC.innerText = [
                            dtUTC.  getHours().toString().padStart(2,0),
                            dtUTC.getMinutes().toString().padStart(2,0),
                            dtUTC.getSeconds().toString().padStart(2,0),
                        ].join(':')
            }
            showNow()
            clearInterval(clocksInterval)
            clocksInterval = setInterval( showNow ,1000)
        })
        .catch(e => {
            btnSync.classList.remove('rotating')
            d(e)
        })
    }
    sync()
    let stopWatchTimer = false
    let toggleStopWatch = () => {
        if(stopWatchTimer){
            clearInterval(stopWatchTimer)
            stopWatchTimer = false
            return
        }
        let delay = 1 //ms
        let timerStartedAt = Date.now()
            alertBodyStopWatch.innerText = 0

        stopWatchTimer = setInterval(() => {
                alertBodyStopWatch.innerText = (Date.now() - timerStartedAt) / 1000
            },delay)
    }
    alertStopWatch. addEventListener('pointerdown', toggleStopWatch, false)
    btnSync.        addEventListener('pointerdown', sync, false)
})()

