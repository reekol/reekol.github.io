
(() => {

	let idx = PROJECT + ''
	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')
	let storage = window.localStorage
	let playlist = []

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
                        .alert, .alert .alertHead, .alert .alertBody {
                            visibility: visible !important;
                            background: #fff;
                            color: #000;
                        }
                        .alert .fa-trash-alt, .alert .fa-print {
                            display:none !important
                        }
                    }`)
                window.onafterprint =  e => { css.remove() }
                window.print()

        },false)

    loadCss(`
        .confirm{
            color:#FFFF00;
        }
        .container {
            padding-top: 8vw
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
        }

        .fa-trash-alt, .fa-dice-one, .fa-dice-two, .fa-dice-three, .fa-dice-four, .fa-dice-five, .fa-dice-six{
            float:right
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

    let createNote = e => {
        let newAlert  = showAlert(cnt,{title: '',message: ''},false)
            newAlert.classList.add('newNote')
            newAlert.id = e.note && e.note.id ? e.note.id : 'note-' + Date.now()

        let alertHead = newAlert.getElementsByClassName('alertHead')[0]
            alertHead.setAttribute('placeholder','Note title.')
            alertHead.setAttribute('contenteditable','true')
            alertHead.textContent = e.note && e.note.title ? e.note.title : ''

        let alertBody = newAlert.getElementsByClassName('alertBody')[0]
            alertBody.setAttribute('placeholder','Note body.')
            alertBody.setAttribute('contenteditable','true')
            alertBody.textContent = e.note && e.note.body ? e.note.body : ''

        let alertTrash = document.createElement('i')
            alertTrash.className = 'fas fa-trash-alt'
            newAlert.appendChild(alertTrash)

        let alertShare = document.createElement('i')
            alertShare.className = 'fas fa-print'
            newAlert.appendChild(alertShare)

            alertShare.addEventListener('pointerdown', e => {
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
                        #${newAlert.id},#${newAlert.id} .alertHead,#${newAlert.id} .alertBody {
                            visibility: visible !important;
                            background: #fff;
                            color: #000;
                        }
                        #${newAlert.id} .fa-trash-alt, #${newAlert.id} .fa-print {
                            display:none
                        }
                    }`)
                window.onafterprint =  e => { css.remove() }
                window.print()
            })

        let edit = e => {
                localStorage. setItem(
                    newAlert.id,
                    JSON.stringify({title: alertHead.innerText, body: alertBody.innerText })
                )
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

            alertHead.  addEventListener('input',       edit,  false)
            alertBody.  addEventListener('input',       edit,  false)
            alertTrash. addEventListener('pointerdown', trash, false)
    }
    btnPlus.    addEventListener('pointerdown', createNote, false)
    btnList.    addEventListener('pointerdown',  listNotes, false)
    btnList.    dispatchEvent(new Event('pointerdown'))
})()

//alert(navigator.userAgent.toLowerCase().indexOf("android")) // is android
