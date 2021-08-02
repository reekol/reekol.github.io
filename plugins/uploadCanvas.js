
(() => {
	let nav = document.querySelector('nav')
 	let btn = document.createElement('i')
	let	file = document.createElement('input')
 	let canvas = document.querySelector('canvas')
	let ctx = canvas.getContext('2d')

		btn.className = 'fas fa-upload'
		nav.appendChild(btn)
		file.type = 'file'

	let btnclick = e => {
		file.click()
	}

	let filechange = e => {
		let img = new Image()
			img.onload = () => {
				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
				// scale to fit
				let scale = Math.min(canvas.width / img.width, canvas.height / img.height);
				// get the top left position of the image
				let x = (canvas.width / 2) - (img.width / 2) * scale;
				let y = (canvas.height / 2) - (img.height / 2) * scale;
				ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
				canvas. dispatchEvent(new Event('x-pushimg'))
			}
			let reader = new FileReader();
				reader.onload = () => {
					img.src = reader.result
				}
			reader.readAsDataURL(file.files[0])
		file.value=null
		file.files=null
	}

	file.	addEventListener('change',	filechange,	false)
	btn.	addEventListener('click', 	btnclick,	false)

})()
