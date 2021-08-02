
(() => {
	let idx = PROJECT + '-cv'
	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')

	let btn = document.createElement('a')
		btn.className = 'far fa-address-card'
		btn.href = '#' + idx

	let box = document.createElement('section')
		box.id = idx

		nav.appendChild(btn)
		cnt.appendChild(box)

	loadCss(`#${idx} {
		background:transparent,
		font-family: monospace;
		white-space: pre;
	}`)

	let alertBox = showAlert(box,{
				title:	 'ReeKol\ncupuyc@gmail.com\nhttps://github.com/reekol\nvCard',
				message: null,
				extras: {
					'client::notification':{
						click:{
							url:'https://raw.githubusercontent.com/reekol/reekol.github.io/master/assets/vcard.vcf'
						}
					}
				}
			}, false)
	let alertBody = alertBox.getElementsByClassName('alertBody')[0]
		alertBody.innerHTML = ''
			+ '<img src="https://raw.githubusercontent.com/reekol/reekol.github.io/master/assets/reekol.vcard.svg" alt="Projects page"'
			+ ' style="width: 100%" />'
		alertBody.style.background = '#fff'
		window.location.hash = '#' + idx
		//	btn.addEventListener('click', false, false)

})()
