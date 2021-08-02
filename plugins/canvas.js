
loadCss(`
nav, .fa-paint-brush 		{ order: 0 }
nav, .fa-fingerprint 		{ order: 1 }
nav, .fa-palette 			{ order: 2 }
nav, .fa-undo-alt 			{ order: 3 }
nav, .fa-redo-alt 			{ order: 4 }
nav, .fa-print 				{ order: 5 }
nav, .fa-upload 			{ order: 6 }
nav, .fa-pen-fancy			{ order: 7 }
nav, .fa-wikipedia-w		{ order: 8 }
nav, .fa-expand-arrows-alt	{ order: 9 }`);

(() => {
	let idx = PROJECT + '-canvas'
	let	nav = document.querySelector('nav')
	let container = document.querySelector('.container')
	let link = document.createElement('a')
		link.href="#" + idx
		link.className="fas fa-paint-brush"

	let	btnFinger = document.createElement('i')
		btnFinger.className = 'fas fa-fingerprint'

		nav.appendChild(link)
		nav.appendChild(btnFinger)

	let section = document.createElement('section')
		section.id = idx
		section.style.background = '#fff'
	let canvas  = document.createElement('canvas')
		canvas.style.objectFit = 'contain'

		section.appendChild(canvas)
		container.appendChild(section)

	let trackFinger		= true
	let lineCap			= 'round'
	let brushColor 		= '#000'
	let fillStyle 		= '#ff0000'
	let lineWidth 		= 6
	let strokes 		= 0
	let img 			= new Image
	let points			= []

	canvas.style.position = 'absolute'
	canvas.style.top 	= 0
	canvas.style.left 	= 0
	canvas.height 		= window.innerHeight
	canvas.width 		= window.innerWidth

	let ctx = canvas.getContext('2d')
		ctx.fillStyle = fillStyle
		ctx.imageSmoothingEnabled = true
		ctx.drawImage(img, 0, 0, img.width, img.height)

	let pointermove = e => {
		strokes++
		points.push({ x: e.clientX, y: e.clientY })
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
		ctx.drawImage(img, 0, 0, img.width, img.height)
		ctx.beginPath()
		ctx.moveTo(points[0].x, points[0].y)
		ctx.lineJoin = ctx.lineCap = lineCap

		ctx.strokeStyle = typeof paletteBrushColor === 'undefined' ? brushColor : paletteBrushColor
		ctx.lineWidth = typeof rangeValue === 'undefined' ? lineWidth : rangeValue // (e.pressure * 10) < 0.20 ? e.pressure : e.pressure * 10;

		for (i = 1; i < points.length - 2; i ++)
		{
			var xc = (points[i].x + points[i + 1].x) / 2;
			var yc = (points[i].y + points[i + 1].y) / 2;
			ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
		}
		ctx.stroke()
		ctx.closePath()
	}

	let pointerdown = e => {
		if(e.pointerType == 'touch' && !trackFinger) return;
		points.push({ x: e.clientX, y: e.clientY })
		canvas.addEventListener('pointermove', pointermove, false)
	}

	let pointerup = e => {
		canvas.removeEventListener('pointermove', pointermove, false)
		img 	= new Image
		img.src = canvas.toDataURL("image/png")
		points 	= []
	}

	let pointerout = e => {
		canvas.removeEventListener('pointermove', pointermove, false)
		img 	= new Image
		img.src = canvas.toDataURL("image/png")
		points 	= []
	}

	let windowresize = e => {
		canvas.height 		= window.innerHeight
		canvas.width 		= window.innerWidth
		ctx.drawImage(img, 0, 0, img.width, img.height)
	}

	let fingerTrack = e => {
		trackFinger = !trackFinger
		e.target.style.color = trackFinger ? '#00ff00' : '#cdcdcd'
	}

	let clearCanvas = e => {
		window.location.reload()
	}

	let xpushimg = e => {
		img 	= new Image
		img.src = canvas.toDataURL("image/png")
	}

	window		.addEventListener('resize',			windowresize,	false)
	canvas		.addEventListener('pointerdown', 	pointerdown,	false)
	canvas		.addEventListener('pointerup',   	pointerup,		false)
	canvas		.addEventListener('pointerout',  	pointerout,		false)
	btnFinger	.addEventListener('pointerdown', 	fingerTrack,	false)
	link		.addEventListener('dblclick',		clearCanvas,	false)
	canvas		.addEventListener('x-pushimg',		xpushimg,		false)
	//Init finger tracking styling
	trackFinger = !trackFinger; fingerTrack({target:btnFinger})

	window.location.hash = ''
 	window.location.hash = idx

})()
