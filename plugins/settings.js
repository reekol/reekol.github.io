(() => {

   	let idx = PROJECT + ''
	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')
	let storage = window.localStorage
    let btn = document.createElement('a')
        btn.href = '#' + idx
        btn.classList.add('fas')
        btn.classList.add('fa-tools')

    let sec = document.createElement('section')
        sec.id = idx

        cnt.appendChild(sec)
        nav.appendChild(btn)

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
    let alert = showAlert(sec,{title:'Export your local storage.',message:''},false)
    let alertImport = showAlert(sec,{title:'Import your data here.',message:'\n\n\n'},false)
    let alertImportTitle = alertImport.querySelector('.alertHead')
    let alertImportBody = alertImport.querySelector('.alertBody')
        alertImportBody.classList.add('preformatted')
        alertImportBody.contentEditable = 'true'
        alertImportBody.style.outline = 'none'

    let alertTitle = alert.querySelector('.alertHead')
    let alertBody = alert.querySelector('.alertBody')
    let alertBodyTextNode = document.createTextNode('')
    let btnCopy = document.createElement('i')
        btnCopy.className = 'fas fa-copy'
        alertBody.appendChild(btnCopy)


    let copy = data => {
        navigator.clipboard.writeText(data).then(() => {
            alertBodyTextNode.remove()
            alertBodyTextNode = document.createTextNode('Copying local storage to clipboard was successful!')
            alertBody.appendChild(alertBodyTextNode)
        }, err => {
            d(['Async: Could not copy text: ', err]);
        })
    }

    let tryToImport = e => {
        let el = e.target
        let data = false
        try{
            data = JSON.parse(e.target.innerText)
        }catch(e){
            d(e)
        }
        if(data){
            e.target.style.background = 'green'
            Object.keys(data).forEach( k => localStorage.setItem(k, data[k]) )
        }else{
            e.target.style.background = 'red'
        }
    }

    let exportStorage = e => {
        copy(JSON.stringify(storage, null, 4))
    }

        btnCopy.addEventListener('pointerdown', exportStorage, false)
        alertImportBody.addEventListener('input', tryToImport, false)
})()

