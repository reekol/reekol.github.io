;(async () => {

	let history = []
	let histImg = new Image
	let pos = 0
	const size = 10
 	const nav = document.querySelector('nav')
 	const canvas = document.querySelector('canvas')
	const ctx = canvas.getContext('2d')
	const btnUndo = document.createElement('i')
		  btnUndo.className = 'fas fa-undo-alt'

	const btnRedo = document.createElement('i')
		  btnRedo.className = 'fas fa-redo-alt'
	
			nav.appendChild(btnRedo)
			nav.insertBefore(btnUndo,btnRedo)

	histImg 	= new Image
	histImg.src = canvas.toDataURL("image/png")
	history.push(histImg)
		
	canvas.addEventListener('pointerup', e => {
		if( history.length > size ) history.shift()
		histImg 	= new Image
		histImg.src = canvas.toDataURL("image/png")
		history.push(histImg)
        localStorage.apiSetItem('canvas_0',histImg.src)
		pos = history.length - 1
	},false)

	let undo = e => {
		pos--
		if(typeof history[pos] === 'undefined'){
			pos++
		}else{
			let img = history[pos]
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			ctx.drawImage(img, 0, 0, img.width, img.height)
			canvas. dispatchEvent(new Event('x-pushimg'))
            localStorage.apiSetItem('canvas_0',img.src)
		}
	}

	let redo = e => {
		pos++
		if(typeof history[pos] === 'undefined'){
			pos--
		}else{
			let img = history[pos]
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			ctx.drawImage(img, 0, 0, img.width, img.height)
			canvas. dispatchEvent(new Event('x-pushimg'))
            localStorage.apiSetItem('canvas_0',img.src)
		}
	}

	let keypress = e => {
      if (e.keyCode == 26 && e.ctrlKey && !e.shiftKey ) undo()
      if (e.keyCode == 26 && e.ctrlKey &&  e.shiftKey ) redo()
	}

	let img = new Image
		img.src = await localStorage.apiGetItem('canvas_0')
		history.push(img)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, img.width, img.height)
        canvas. dispatchEvent(new Event('x-pushimg'))

	btnUndo	.addEventListener('pointerdown', undo, 	false)
	btnRedo	.addEventListener('pointerdown', redo, 	false)
	document.addEventListener('keypress', keypress,	false)

})()
