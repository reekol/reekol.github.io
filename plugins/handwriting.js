
(() => {
	let idx = PROJECT + '-hwr'
	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')

	let btn = document.createElement('i')
		btn.className = 'fas fa-pen-fancy'

 	let hwr = document.createElement('a')
		hwr.href ='#' + idx
		hwr.className = 'fab fa-wikipedia-w'

	let box = document.createElement('section')
		box.id = idx

 		nav.appendChild(btn)
		cnt.appendChild(box)
		nav.appendChild(hwr)

	let canvas = document.querySelector('canvas')
	let ctx = canvas.getContext('2d')
	let enabled = false

	let points = [[[],[]]]
	let index = 0
	let minIndexToSend = 5

	let pointerdown = e => {
		if(!enabled) return
		points.push([[],[]])
		index = points.length - 1
	}

	let pointermove = e => {
		if(!enabled) return
		points[index][0].push(e.clientX)
		points[index][1].push(e.clientY)
	}

	let analyze = e => {
		if(!enabled) return
		if(index < minIndexToSend) return
		fetch('https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8', {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
			body: JSON.stringify({
					"options": "enable_pre_space",
					"requests": [{
						"writing_guide": {
							"writing_area_width": canvas.width,
							"writing_area_height": canvas.height
						},
						"ink": points,
						"language": "en",
					}]
				})
		})
		.then(response 	=> response.json() )
		.then(data 		=> { if(data[0] === 'SUCCESS') success(data[1][0]) })
		.catch(error 	=> { d(error) })
	}

	let getwiki = async term => {
		let res = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${term}&limit=1&origin=*`)
		return res.json()
	}

	let togglehwr = e => {
		enabled = !enabled
		e.target.style.color = enabled ? '#00ff00' : '#cdcdcd'
		if(!enabled){
			cnt.removeChild(box)
			nav.removeChild(hwr)
		}
	}

	let success = async data => {
		let wikiTerm = data[1][0]
		let title = data[0]
		let link = '#'

			cnt.appendChild(box)
			nav.appendChild(hwr)

		if(wikiTerm.length > 5){
			let wiki = await getwiki(wikiTerm)
			title = '(Wiki) ' + wiki[1][0]
			link  = wiki[3][0]
		}

		showAlert(box,{
			title:	 title,
			message: data[1].join(', '),
			extras: {
				'client::notification':{
					click:{
						url:link
					}
				}
			}
		}, true)

		blink(hwr)
	}

	canvas.	addEventListener('pointerdown',	pointerdown, false)
	canvas.	addEventListener('pointermove',	pointermove, false)
	canvas.	addEventListener('pointerup',	analyze,	 false)
	btn.	addEventListener('click',		togglehwr,	 false)
	enabled = !enabled; togglehwr({target:btn})
})()
