(() => {

   	let idx = PROJECT + ''
	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')
	let storage = window.localStorage

	let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    let recognition = new SpeechRecognition()
        recognition.continuous = true

    let ss = window.speechSynthesis

    let btn = document.createElement('a')
        btn.href = '#' + idx
        btn.classList.add('fas')
        btn.classList.add('fa-assistive-listening-systems')

    let sec = document.createElement('section')
        sec.id = idx

        cnt.appendChild(sec)
        nav.appendChild(btn)

    let tokenize = str => str.toLowerCase().split(' ').filter(a => a).join('_')
    let getFirstKey = ob => ob[Object.keys(ob)[0]]

	loadCss(`
        @media (orientation: landscape) {
            section {
                padding-top: 2vh
            }
        }
        @media (orientation: portrait) {
            section {
                padding-top: 8vw
            }
        }
	`)

    let alert = showAlert(sec,{title:'',message:''},false)
        alert.classList.add('someclass')
    let alertTitle = alert.querySelector('.alertHead')
    let alertBody = alert.querySelector('.alertBody')
        alertBody.classList.add('preformatted')

    let btnClick = e => {
        recognition.abort()
        try{
            recognition.start()
            speak('I am listening')
        }catch(e){
            d(e.message)
        }
    }

    let splitMsg = m => {
        let arr = []
        let limit = 100
        let lastIndex = 1
        while(m.length && lastIndex != -1){
            lastIndex = m.substring(0, limit).lastIndexOf(' ')
            lastIndex = lastIndex === -1 || m.length < limit ? limit : (lastIndex || m.length)
            arr.push(m.substring(0,lastIndex))
            m = m.substring(lastIndex).trim()
        }
        return arr
    }

    let speak    = message => {

        let ssu = new SpeechSynthesisUtterance()
            ssu.voice = ss.getVoices()[1]
            ssu.volume = 1
            ssu.rate = 1
            ssu.pitch = 1

        if(!Array.isArray(message)) message = splitMsg(message)

            ssu.text = message.shift()
            alertBody.innerText += '> ' + ssu.text + '\n'
            recognition.stop()

        if(message.length){
            ssu.onend = e => speak(message)
        }else{
            ssu.onend = e => recognition.start()
        }
            ss.speak(ssu)
    }

    let speakRemote = (url,cb) => {
                    fetch(url).then(response => response.json()).
                    then(data =>{ speak(cb(data)) })
    }

    let result = e => {
        let results = e.results
        let confidence = 0
        let understood = ''
        let resultIndex = e.resultIndex
//        for(let result of results)
        let result = results[resultIndex]

        for(let alternative of result){
            if(alternative.confidence > confidence){
                confidence = alternative.confidence
                understood = alternative.transcript
            }
        }

        if(understood){
            alertBody.innerText += '< ' + understood + '\n'
            let token = tokenize(understood)
            if(token.indexOf('jarvis') !== 0) return;
                token = token.split('_')
                token.shift()
                token = token.join('_')
            if(token === 'what_time_is_it'){
                speak((new Date()).toString().substring(0,21))
            }else if(token === 'show_calendar'){
                alertBody.innerText += '> Open calendar.\n'
                window.open(
                    'https://reekol.github.io/#calendar',
                    'calendar',
                    'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=350,height=500'
                )
            }else if(token === 'show_notes'){
                alertBody.innerText += '> Open notes.\n'
                window.open(
                    'https://reekol.github.io/#note',
                    'notes',
                    'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=350,height=500'
                )
            }else if(token === 'play_music'){
                alertBody.innerText += '> Open music player.\n'
                window.open(
                    'https://reekol.github.io/#audio',
                    'audioplayer',
                    'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=350,height=500'
                )
            }else{
                if(token.indexOf('wikipedia') === 0){
                    let searchFor = token.toString().split('_')[1]
                    speakRemote(
                        'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=' + searchFor + '&origin=*',
                        data => { return getFirstKey(data.query.pages).extract }
                    )
                }else if(token.indexOf('weather') === 0){
                     speakRemote('https://weather-broker-cdn.api.bbci.co.uk/en/forecast/aggregated/727011',(data) => {
                            let report = data.forecasts[0].detailed.reports[0]
                            return '' + [
                                    report.feelsLikeTemperatureC + ' degree celsius',
                                    report.weatherTypeText,
                                    report.windDescription,
                                    'visibility is ' + report.visibility,
                                ].join(', ')
                        }
                     )
                }else{
                    speak('What should i do for this command?\n' + understood)
                }
            }
        }
    }

    recognition.addEventListener('result', result, false)
    btn.addEventListener('pointerdown', btnClick, false)
})()



