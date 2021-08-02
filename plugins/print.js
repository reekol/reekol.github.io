

(() => {

	let nav = document.querySelector('nav')
	let btn = document.createElement('i')
		btn.className = 'fas fa-print'
		nav.appendChild(btn)
		btn.addEventListener('pointerdown', e => { window.print() })

	loadCss(`
		@media print {
			* {
				visibility: hidden;
				background:#fff !important
			}
			canvas {
				width:100vw;
				height:100vh;
				visibility: visible;
				background:#fff;
			}
		}`)

})()
