
(() => {

    let ANDROID = (navigator.userAgent.toLowerCase().indexOf("android") > -1)// is android
	let idx = PROJECT + ''
	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')
	let storage = window.localStorage
	let playlist = []
    let qrious = document.createElement('script')
        qrious.type = 'text/javascript'
        qrious.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js'
        document.head.appendChild(qrious)

	let btnList = document.createElement('a')
		btnList.className = 'fas fa-list'
		btnList.href = '#' + idx
		nav.appendChild(btnList)

	let btnPlus = document.createElement('a')
		btnPlus.className = 'fas fa-plus-square'
		btnPlus.href = '#' + idx
		nav.appendChild(btnPlus)

	let btnPrint = document.createElement('a')
		btnPrint.className = 'fas fa-print'
		btnPrint.href = '#' + idx
		nav.appendChild(btnPrint)

        btnPrint.addEventListener('pointerdown', e => {
                let css = loadCss(`
                    @media print {
                        * {
                            visibility: hidden;
                        }
                        html, body{
                            background:#fff
                        }
                        .alert{
                            width:90vw;
                            float:left;
                            visibility: visible !important;
                            border:1px solid rgba(0, 0, 0, 1) !important
                        }
                        .alert .alertHead{
                            border-bottom:1px solid rgba(0, 0, 0, 1) !important
                        }
                        .alert, .alert .alertHead, .alert .alertBody, .alert .sharingQr {
                            visibility: visible !important;
                            background: #fff;
                            color: #000;
                        }
                        .alert .days, .alert .days li {
                            visibility: visible !important;
                            background: #fff !important;
                            color: #000 !important;
                        }
                        .alert .fa-trash-alt, .alert .fa-print, .alert .fa-qrcode {
                            display:none !important
                        }
                    }`)
                // Fix for android's chrome not detecting afterprint as it should
                window.addEventListener('afterprint', e => { setTimeout( i => css.remove(), ANDROID ? 3000 : 0) }, false)
                window.print()

        },false)

    loadCss(`
        @media (orientation: landscape) {
            .container {
                padding-top: 2vh
            }
        }
        @media (orientation: portrait) {
            .container {
                padding-top: 8vw
            }
        }
        .confirm{
            color:#FFFF00;
        }
        .newNote .alertHead {
            outline:none;
            font-family: monospace;
            white-space: pre;
        }
        .newNote .alertBody {
            min-height:5vh;
            outline:none;
            font-family: monospace;
            white-space: pre;
            overflow-x: auto;
        }
        .fa-trash-alt, .fa-dice-one, .fa-dice-two, .fa-dice-three, .fa-dice-four, .fa-dice-five, .fa-dice-six{
            float:right
        }
        .sharingQr {
            width:100%
        }
    `)

	let getAllNotes = () => {
		let archive = {},
			keys = Object.keys(localStorage).sort().reverse(),
			i = keys.length
		while ( i-- ){
			let name = keys[i]
			if(name.indexOf('note-') === 0){
                try{
                    archive[name] = JSON.parse(localStorage.getItem(name))
                }catch(e){
                    d(['ERR',e])
                }
			}
		}
		return archive;
	}

    let listNotes  = e =>{
        let notes = getAllNotes()
        while (cnt.firstChild) cnt.removeChild(cnt.firstChild)
        for(let name in notes){
            let note = notes[name]
            createNote({note: {id: name, title:note.title, body: note.body}})
        }
    }

    let download = (filename, text) => {
        var element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
        element.setAttribute('download', filename)
        element.style.display = 'none';
        document.body.appendChild(element)
        element.click();
        document.body.removeChild(element)
    }

    let exportStorage = e => {
        download( e.exportName + '-' + Date.now(), JSON.stringify(e.exportData, null, 4))
    }

    let createNote = e => {
        let newAlert  = showAlert(cnt,{title: '',message: ''},false)
            newAlert.classList.add('newNote')
            newAlert.id = e.note && e.note.id ? e.note.id : 'note-' + Date.now()

        let alertHead = newAlert.getElementsByClassName('alertHead')[0]
            alertHead.setAttribute('placeholder','Note title.')
            alertHead.setAttribute('contenteditable','true')
            alertHead.textContent = e.note && e.note.title ? e.note.title : ''
        let color = (alertHead.innerText.charAt(0) === '#' ? alertHead.innerText.split(' ')[0] : false)
        if(color){
            alertHead.style.color = ('#cdcdcd' < color ? '#000' : '#fff')
            alertHead.style.background = color
        }
        let alertBody = newAlert.getElementsByClassName('alertBody')[0]
            alertBody.setAttribute('placeholder','Note body.')
            alertBody.setAttribute('contenteditable','true')
            alertBody.textContent = e.note && e.note.body ? e.note.body : ''

        let alertTrash = document.createElement('i')
            alertTrash.className = 'fas fa-trash-alt'
            newAlert.appendChild(alertTrash)

        let alertPrint = document.createElement('i')
            alertPrint.className = 'fas fa-print'
            newAlert.appendChild(alertPrint)

        let alertQr = document.createElement('i')
            alertQr.className = 'fas fa-qrcode'
            newAlert.appendChild(alertQr)

        let alertSave = document.createElement('i')
            alertSave.className = 'fas fa-save'
            newAlert.appendChild(alertSave)

        let shareQr = e => {
                document.querySelectorAll('.sharingQr').forEach( el => el.remove() )
                let href = window.location.href.split('#')[0] + '#note-add?' +
                    btoa(
                        encodeURIComponent(
                            JSON.stringify({title:alertHead.textContent, body: alertBody.textContent})
                        )
                    )

                let a = document.createElement('a')
                    a.href = href

                let image = (new QRious({level: 'H', size: 500, value: href}).image)
                    image.className = 'sharingQr'
                    image.removeAttribute('height')

                a.appendChild(image)
                newAlert.appendChild(a)

            }

        let print = e => {
                let css = loadCss(`
                    @media print {
                        * {
                            visibility: hidden;
                        }
                        html, body{
                            background:#fff
                        }
                        #${newAlert.id}{
                            position:absolute;
                            top:5vh;
                            width:90vw;
                            float:left;
                            visibility: visible !important;
                            border:1px solid rgba(0, 0, 0, 1) !important
                        }
                        #${newAlert.id} .alertHead{
                            border-bottom:1px solid rgba(0, 0, 0, 1) !important
                        }
                        #${newAlert.id},#${newAlert.id} .alertHead,#${newAlert.id} .alertBody, #${newAlert.id} .sharingQr {
                            visibility: visible !important;
                            background: #fff;
                            color: #000;
                        }
                        #${newAlert.id} .fa-trash-alt, #${newAlert.id} .fa-print, #${newAlert.id} .fa-qrcode {
                            display:none
                        }
                    }`)
                // Fix for android's chrome not detecting afterprint as it should
                window.addEventListener('afterprint', e => { setTimeout( i => css.remove(), ANDROID ? 3000 : 0) }, false)
                window.print()

            }

        let edit = e => {
                document.querySelectorAll('.sharingQr').forEach( el => el.remove() )
                localStorage. setItem(
                    newAlert.id,
                    JSON.stringify({title: alertHead.innerText, body: alertBody.innerText })
                )
            }
        let save = e => {
            e.exportName = alertHead.innerText
            e.exportData = { }
            e.exportData[newAlert.id] =  storage.getItem(newAlert.id)
            exportStorage(e)
        }
        let trash = e => {

            if(!alertTrash.classList.contains('confirm'))
            {
                alertTrash.classList.add('confirm')
                blink(alertTrash)
                setTimeout(() => { alertTrash.classList.replace('fa-trash-alt','fa-dice-six')}, 1000)
                setTimeout(() => { alertTrash.classList.replace('fa-dice-six','fa-dice-five')}, 2000)
                setTimeout(() => { alertTrash.classList.replace('fa-dice-five','fa-dice-four')}, 3000)
                setTimeout(() => { alertTrash.classList.replace('fa-dice-four','fa-dice-three')}, 4000)
                setTimeout(() => { alertTrash.classList.replace('fa-dice-three','fa-dice-two')}, 5000)
                setTimeout(() => { alertTrash.classList.replace('fa-dice-two','fa-dice-one')}, 6000)
                setTimeout(() => {
                    alertTrash.classList.replace('fa-dice-one','fa-trash-alt')
                    alertTrash.classList.remove('confirm')
                },7000)
                return
            }
            localStorage.removeItem(newAlert.id)
            newAlert.remove()
        }

        alertHead.  addEventListener('pointerdown', edit,    false)
        alertBody.  addEventListener('pointerdown', edit,    false)
        alertHead.  addEventListener('input',       edit,    false)
        alertBody.  addEventListener('input',       edit,    false)
        alertTrash. addEventListener('pointerdown', trash,   false)
        alertSave.  addEventListener('pointerdown', save,   false)
        alertPrint. addEventListener('pointerdown', print,   false)
        alertQr.    addEventListener('pointerdown', shareQr, false)
        alertHead.  addEventListener('input', () => {
            let color = (alertHead.innerText.charAt(0) === '#' ? alertHead.innerText.split(' ')[0] : false)
            if(color){
                alertHead.style.color = ('#cdcdcd' < color ? '#000' : '#fff')
                alertHead.style.background = color
            }
        },false)
        return newAlert

    }
    btnPlus.    addEventListener('pointerdown',  createNote, false)
    btnList.    addEventListener('pointerdown',  listNotes, false)
    btnList.    dispatchEvent(new Event('pointerdown'))

    let hash = window.location.hash.split('?')
    if(hash[0] === '#' + PROJECT + '-add' && hash[1])
    {
        d(decodeURIComponent(atob(hash[1])))
        let note = createNote({
            note:JSON.parse(
                decodeURIComponent(
                    atob(hash[1])))
        })
        note.getElementsByClassName('alertHead')[0] .dispatchEvent(new Event('input'))
        note.getElementsByClassName('alertBody')[0] .dispatchEvent(new Event('input'))
        window.location.hash = PROJECT
    }

})()


