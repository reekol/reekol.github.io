(() => {

   	let idx = PROJECT + ''
	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')
	let storage = window.localStorage
    let btn = document.createElement('i')
        btn.classList.add('far')
        btn.classList.add('fa-window-restore')

        nav.appendChild(btn)

    let btnClick = e => {
        window.open(window.location.href,idx ,'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=350,height=500')
        window.close()
    }
    btn.addEventListener('pointerdown',btnClick)
})()

