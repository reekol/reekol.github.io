
(() => {
	const GotifyServerURI = 'vetshares.com'
	const AppToken = 'ATa0g0zZNwpOEH3'

	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')

	let idx1 = PROJECT + ''
	let btn1 = document.createElement('a')
		btn1.className = 'fab fa-watchman-monitoring'
		btn1.href = '#' + idx1

	let box1 = document.createElement('section')
		box1.id = idx1

		nav.appendChild(btn1)
		cnt.appendChild(box1)

	let idx2 = PROJECT + '-track'
	let btn2 = document.createElement('a')
		btn2.className = 'fas fa-satellite-dish'
		btn2.href = '#' + idx2

	let box2 = document.createElement('section')
		box2.id = idx2

		nav.appendChild(btn2)
		cnt.appendChild(box2)

	loadCss(`
		input[type=text], input[type=password], select, textarea {
			padding: 12px;
			border: 1px solid #ccc;
			border-radius: 4px;
			box-sizing: border-box;
			margin-top: 6px;
			margin-bottom: 16px;
			resize: vertical;
			width:100%
		}

		input[type=submit] {
			background-color: #04AA6D;
			color: white;
			padding: 12px 20px;
			border: none;
			border-radius: 4px;
			cursor: pointer;
			width:100%
		}

		input[type=submit]:hover {
			background-color: #45a049;
		}
	`)

	let onLogin = 	e => {
		e.preventDefault();
		fetch('https://' + GotifyServerURI + '/client', {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			headers: {
				"content-type": "application/json; charset=utf-8",
				"authorization": "Basic " + 	btoa(e.target.user.value + ':' + e.target.pass.value)
			},
			body: `{"name":"Web"}`,
			credentials: "include"
		})
		.then(response => response.json())
		.then(data => {
			d('Success:', data)
			box1.innerHTML = ''
			showAlert(box1,{title: 'Name:' + data.name, message: 'id: ' + data.id + '\nToken:' + data.token})
			ClientToken = data.token
			let connectSocket = () => {
				let wss = new WebSocket('wss://' + GotifyServerURI + '/stream?token=' + ClientToken)
				wss._retryTime  = 5000
				wss.onopen      = (e  ) => {  }
				wss.onclose     = (e  ) => {  }
				wss.onerror     = (e  ) => {  d(e) }
				wss.sendJson    = (msg) => {  }
				wss.onmessage   = (e  ) => {
					let msg = JSON.parse(e.data)
					showAlert(box1,msg,true)
				}
			}
			connectSocket()
		})
		.catch(error => { d('Error:', error) })
	}

	let sendNotification = (data,cb) => {
		fetch( 'https://' + GotifyServerURI + '/message?token=' + AppToken,{
			method: 'POST',
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
			mode: 'cors',
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			body: JSON.stringify(data) })
			.then(response => response.json())
			.then(data => { d('Success:', data); if(cb) cb(data) })
			.catch(error => { d('Error:', error) })
	}

	let geoSuccess = position => {
		const latitude  = position.coords.latitude;
		const longitude = position.coords.longitude;

		let msg = {
			"title":`ALERT [${window.location.host}]`,
			"message":`Latitude: ${latitude} °, Longitude: ${longitude} °`,
			"priority":9,
			"extras": {
				"x-reekol":{
					"lat":latitude,
					"lon":longitude
				},
				"client::notification": {
					"click": {
						"url": `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`
					}
				}
			}
		}
		sendNotification(msg, msg => { 	showAlert(box2,msg) })
		setTimeout(geoFindMe,10000)
	}

	let geoFindMe = () => {
		if(!navigator.geolocation) {
			d('Geolocation is not supported by your browser')
		} else {
			navigator.geolocation.getCurrentPosition(geoSuccess, e => { d('Unable to retrieve your location') })
		}
	}

	let form = document.createElement('form')
	let user = document.createElement('input')
		user.type = 'text'
		user.name = 'user'
		user.placeholder= 'Username'

	let pass = document.createElement('input')
		pass.type = 'password'
		pass.name = 'pass'
		pass.placeholder= 'Password'

	let subm = document.createElement('input')
		subm.type = 'submit'
		subm.value = 'Login'

		form.appendChild(user)
		form.appendChild(pass)
		form.appendChild(subm)

		form.onsubmit = onLogin

	let alertBox = showAlert(box1,{
				title:	 'Login to your gotify service.',
				message: '',
			}, false)

	let alertTitle = alertBox.getElementsByClassName('alertTitle')[0]
	let alertBody = alertBox.getElementsByClassName('alertBody')[0]
		alertBody.appendChild(form)
		btn2.addEventListener('click', geoFindMe, false)

		//	btn.addEventListener('click', false, false)

})()
