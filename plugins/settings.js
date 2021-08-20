(() => {

   	let idx = PROJECT + ''
	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')
   	let	file = document.createElement('input')
        file.type = 'file'
        file.accept ="text/*"

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
    let alertExport = showAlert(sec,{title:'',message:''},false)
    let alertImport = showAlert(sec,{title:'',message:'\n\n\n'},false)
    let alertImportTitle = alertImport.querySelector('.alertHead')
    let alertImportBody = alertImport.querySelector('.alertBody')
        alertImportBody.classList.add('preformatted')

    let btnImport = document.createElement('i')
        btnImport.className = 'fas fa-file-upload'
        alertImportTitle.appendChild(btnImport)

    let alertExportTitle = alertExport.querySelector('.alertHead')
    let alertExportBody = alertExport.querySelector('.alertBody')
    let alertExportBodyTextNode = document.createTextNode('')
    let btnCopy = document.createElement('i')
        btnCopy.className = 'fas fa-copy'
        alertExportTitle.appendChild(btnCopy)

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
        download('reekol-xport-' + Date.now(), JSON.stringify(storage, null, 4))
    }

	let btnclick = e => {
		file.click()
	}

	let filechange = e => {
        let reader = new FileReader();
            reader.onload = () => {
                let data = false
                alertImportBody.innerText = ''
                try{ data = JSON.parse(reader.result) }catch(e){ d(e) }
                if(data){
                    alertImportTitle.style.background = 'green'
                    Object.keys(data).forEach( k => {
                        localStorage.setItem(k, data[k])
                        alertImportBody.innerText += `Imported: ${k}\n`
                    })
                }else{
                    alertImportTitle.style.background = 'red'
                }
            }
        reader.readAsText(file.files[0])
		file.value=null
		file.files=null
	}

    file.      addEventListener('change',      filechange,     false)
    btnImport. addEventListener('click',       btnclick,       false)
    btnCopy.   addEventListener('pointerdown', exportStorage,  false)
})()

