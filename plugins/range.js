
var   rangeValue = 3;

(() => {
 	let btnRange = document.createElement('input')
		btnRange.type = 'range'
		btnRange.value = rangeValue
		btnRange.min =  1
		btnRange.max = 40
		btnRange.step = 0.5
		btnRange.style.position = 'fixed'
		btnRange.style.bottom = 10
		btnRange.style.right = 0

	document.body.appendChild(btnRange)

	loadCss(`
			input[type=range] {
				outline: none;
				caret-color: transparent;
			}

			input[type=range] {
				appearance: none;
				background: transparent;
				border:1px solid #cdcdcd;
				border-radius:2vh;
				padding: 1vh 1vw 1vh 1vw;
				box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
				height:5vh;
				width:20vw;
				z-index:100
			}

			@media (orientation: portrait) {
				input[type=range] {
					width:90vw !important;
					margin-left:5vw !important;
					margin-right:5vw !important;
				}
			}

			@media (orientation: landscape) {
				input[type=range] {
					width:20vw !important;
					margin-left:5vw !important;
					margin-right:5vw !important;
				}
			}
			`)
	btnRange.addEventListener('change', e => rangeValue = e.target.value)
})()
