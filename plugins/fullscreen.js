
(() => {
	const nav = document.querySelector('nav')
 	const btn = document.createElement('i')
		  btn.className = 'fas fa-expand-arrows-alt'
		  nav.appendChild(btn)

	btn.addEventListener('click', e => {
		let elem = document.querySelector("body")
		if (!document.fullscreenElement) {
			elem.requestFullscreen().catch(err => {
			alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`)
			})
		} else {
			document.exitFullscreen()
		}
		screen.orientation.lock(screen.orientation.type) // Lock to current orientation type
	})
})()
