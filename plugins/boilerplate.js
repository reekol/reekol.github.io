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
    let alert = showAlert(sec,{title:'',message:''},false)
        alert.classList.add('someclass')
    let alertTitle = alert.querySelector('.alertHead')
    let alertBody = alert.querySelector('.alertBody')

    let btnClick = e => {
        d(e)
    }
    btn.addEventListener('pointerdown', btnClick, false)
})()

