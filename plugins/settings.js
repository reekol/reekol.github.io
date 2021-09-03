;( async () => {

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

	loadCss(`#${idx} {	}
		input[type=url]{
			padding: 12px;
			border: 1px solid #ccc;
			border-radius: 4px;
			box-sizing: border-box;
			margin-top: 6px;
			margin-bottom: 16px;
			resize: vertical;
			width:100%
		}

		input[type=submit] {
			background-color: #04AA6D;
			color: white;
			padding: 12px 20px;
			border: none;
			border-radius: 4px;
			cursor: pointer;
			width:100%
		}

		input[type=submit]:hover {
			background-color: #45a049;
		}
	`)

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
    let alertImport = showAlert(sec,{title:'',message:'\n\n\n'},false)
    let alertImportTitle = alertImport.querySelector('.alertHead')
    let alertImportBody = alertImport.querySelector('.alertBody')
        alertImportBody.classList.add('preformatted')

    let btnImport = document.createElement('i')
        btnImport.className = 'fas fa-file-upload'
        alertImportTitle.appendChild(btnImport)

    let btnCopy = document.createElement('i')
        btnCopy.className = 'fas fa-copy'
        alertImportTitle.appendChild(btnCopy)

    let inputRemote = document.createElement('input')
        inputRemote.type = 'url'
        inputRemote.value = localStorage.getItem('remote')
        inputRemote.placeholder = 'Remote sync server. https://'
        alertImportTitle.appendChild(inputRemote)
        alertImportTitle.appendChild(document.createElement('br'))

    let btnSubmit = document.createElement('input')
        btnSubmit.type = 'submit'
        btnSubmit.value= "Save"
        btnSubmit.style.clear = 'both'
        alertImportTitle.appendChild(btnSubmit)
		  
    let download = (filename, text) => {
    let element  = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
        element.setAttribute('download', filename)
        element.style.display = 'none';
        document.body.appendChild(element)
        element.click();
        document.body.removeChild(element)
    }

    let exportStorage = async e => {
        let storageNow = {}
        let keys = (await localStorage.apiGetKeys()).sort().reverse()
        for(let key of keys) storageNow[key] = await localStorage.apiGetItem(key)
        download('reekol-xport-' + Date.now(), JSON.stringify(storageNow, null, 4))
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

	let saveRemote = e => {
		inputRemote.value ? localStorage.setItem('remote', inputRemote.value) : localStorage.removeItem('remote')
	}
	
    file.      addEventListener('change',      filechange,     false)
    btnImport. addEventListener('click',       btnclick,       false)
    btnCopy.   addEventListener('pointerdown', exportStorage,  false)
    btnSubmit. addEventListener('pointerdown', saveRemote,	   false)
})()

// 	if(localStorage.remoteUri){ // transfer all from local storage to remote
//         let keys = Object.keys(localStorage),
// 				i = keys.length;
// 		  while ( i-- ){
// 			let item = localStorage.getItem(keys[i])
// 				localStorage.apiSetItem(keys[i], item )
// 			}
// 	}
