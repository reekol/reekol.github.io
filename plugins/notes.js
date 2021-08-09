
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

    loadCss(`
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

        .fa-trash-alt{
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
            alertHead.setAttribute('contenteditable','true')
            alertHead.textContent = e.note && e.note.title ? e.note.title : 'Note Title.'

        let alertBody = newAlert.getElementsByClassName('alertBody')[0]
            alertBody.setAttribute('contenteditable','true')
            alertBody.textContent = e.note && e.note.body ? e.note.body : 'Note Contents.'

        let alertTrash = document.createElement('i')
            alertTrash.className = 'fas fa-trash-alt'
            newAlert.appendChild(alertTrash)

        let edit = e => {
                localStorage. setItem(
                    newAlert.id,
                    JSON.stringify({title: alertHead.innerText, body: alertBody.innerText })
                )
            }

        let trash = e => {
            localStorage.removeItem(newAlert.id)
            newAlert.remove()
        }

            alertHead.  addEventListener('input',       edit,  false)
            alertBody.  addEventListener('input',       edit,  false)
            alertTrash. addEventListener('pointerdown', trash, false)
    }
    btnPlus.    addEventListener('pointerdown', createNote, false)
    btnList.    addEventListener('pointerdown',  listNotes, false)
})()

//alert(navigator.userAgent.toLowerCase().indexOf("android")) // is android
