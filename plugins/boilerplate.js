(() => {

   	let idx = PROJECT + ''
	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')
	let storage = window.localStorage
    let btn = document.createElement('i')
        btn.classList.add('far')
        btn.classList.add('fa-window-restore')

        nav.appendChild(btn)
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
	`)
    let alert = showAlert(cnt,{title:'',message:''},false)
        alert.classList.add('someclass')
    let alertTitle = alert.querySelector('.alertHead')
    let alertBody = alert.querySelector('.alertBody')

    let btnClick = e => {
        window.open(window.location.href,idx ,'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350')
    }
    btn.addEventListener('pointerdown',btnClick)
})()

