
(() => {
	let idx = PROJECT + '-messageme'
	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')

	let btn = document.createElement('a')
		btn.className = 'fas fa-comment-dots'
		btn.href = '#' + idx

	let box = document.createElement('section')
		box.id = idx

		nav.appendChild(btn)
		cnt.appendChild(box)

	let sendNotification = async data => {
		fetch("https://vetshares.com/message?token=AWEzK29G4UerQfi",{
			method: 'POST',
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
			mode: 'cors',
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			body: data})
			.then(response => response.json())
			.then(data => { d('Success:', data) })
			.catch(error => { alert('Error:', error) })
	}

	let submitForm = e => {
			e.preventDefault();
			var object = {};
			let formData = new FormData(form)
			formData.forEach((value, key) => { object[key] = value })
			object.priority = 8
			object.title = "MSG::" + object.title
			sendNotification(JSON.stringify(object))
			alert('Thank you for contacting me!')
	}

	loadCss(`#${idx} {	}
		input[type=text], select, textarea {
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

	let alertBox = showAlert(box,{
				title:	 'Send me a message',
				message: '',
			}, false)

	let form = document.createElement('form')
	let title = document.createElement('input')
		title.type = 'text'
		title.name = 'title'
		title.placeholder= 'Name and/or email'
	let texta = document.createElement('textarea')
		texta.name = 'message'
		texta.placeholder = 'Subject ...'
		texta.style.height = '30vh'
	let submt = document.createElement('input')
		submt.type = 'submit'
		submt.value = 'Send message'

		form.appendChild(title)
		form.appendChild(texta)
		form.appendChild(submt)
		form.onsubmit =  submitForm

	let alertTitle = alertBox.getElementsByClassName('alertTitle')[0]
	let alertBody = alertBox.getElementsByClassName('alertBody')[0]
		alertBody.appendChild(form)

		//	btn.addEventListener('click', false, false)

})()
