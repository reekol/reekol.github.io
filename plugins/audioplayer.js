
(() => {

	let idx = PROJECT + ''
	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')
	let playlist = []
	let storage = window.localStorage
	let mediaRecorder

	let btnPlus = document.createElement('a')
		btnPlus.className = 'fas fa-folder-plus'
		btnPlus.href = '#' + idx

	let btnFile = document.createElement('a')
		btnFile.className = 'fas fa-file-audio'
		btnFile.href = '#' + idx

	let btnShuf = document.createElement('a')
		btnShuf.className = 'fas fa-random'
		btnShuf.href = '#' + idx

	let btnPlay = document.createElement('a')
		btnPlay.className = 'fas fa-play'
		btnPlay.href = '#' + idx

	let btnForw = document.createElement('i')
		btnForw.className = 'fas fa-fast-forward'

	let btnPrev = document.createElement('i')
		btnPrev.className = 'fas fa-fast-backward'

	let boxPlay = document.createElement('section')
		boxPlay.id = idx

	let jFilter = document.createElement('input')
		jFilter.className = 'jFilter'
		jFilter.placeholder = '(Shortcut: J key) Filter songs by name.'
		jFilter.value = ''

		nav.appendChild(btnPlus)
		nav.appendChild(btnFile)
		nav.appendChild(btnShuf)
		nav.appendChild(btnPrev)
		nav.appendChild(btnPlay)
		nav.appendChild(btnForw)
		cnt.appendChild(boxPlay)

	let frequencys = [30, 60, 120, 250, 500, 1000, 2000, 4000, 8000, 16000]

	let player = document.createElement('audio')
		player.controls = true
		player.preload="metadata"
		player.index = -1 // init with element before first one
		player.volume = 1
		player.paused = true

	let files = document.createElement('input')
		files.type = 'file'
		files.multiple = "multiple"
		files.accept ="audio/*"
		files.directory = 'directory'
		files.webkitdirectory = 'webkitdirectory'

	let audioContext,
		audioContextAnalyser,
		audioContextSrc

	let highShelf,
		lowShelf,
		highPass,
		lowPass

	let alert = showAlertCleared(
					boxPlay,
					{title: 'Currently playing:',message: ''},
					false
				)
		alert.id = 'playerList'
	let alertBody = alert.getElementsByClassName('alertBody')[0]
	let nowPlaying = alert.getElementsByClassName('alertHead')[0]
	let nowPlayingTitle = document.createElement('div')

	let nowPlayingTime = document.createElement('div')
	let nowPlayingRange = document.createElement('input')
		nowPlayingRange.type = 'range'
		nowPlayingRange.value = 0
		nowPlayingRange.min =  0
		nowPlayingRange.max = 100
		nowPlayingRange.step = 0.5
		nowPlayingRange.style.width = '100%'

	let nowPlayingVisualiser = document.createElement('canvas')
		nowPlayingVisualiser.className = 'visualiser'
		nowPlayingVisualiser.width  = 512
		nowPlayingVisualiser.height = 300
	let nowPlayingVisualiserContext = nowPlayingVisualiser.getContext("2d")

	let boxEq = document.createElement('div')
		boxEq.className = 'boxEq'

		nowPlaying.appendChild(nowPlayingTitle)
		nowPlaying.appendChild(nowPlayingTime)
		nowPlaying.appendChild(nowPlayingRange)
		nowPlaying.appendChild(document.createElement('br'))
		nowPlaying.appendChild(nowPlayingVisualiser)
		nowPlaying.appendChild(boxEq)


	let presets = [
		{ name: "Manual",	values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
		{ name: "Dance",	values: [5, 2, 0, -10, -5, 0, 6, 12, 11, 10] },
		{ name: "Rap",		values: [-13, -9, -4, 2, 8, 12, 2, -11, -2, 8] },
		{ name: "Metal",	values: [12, 7, -3, 4, 13, 8, 3, -3, 8, 12] },
		{ name: "Jazz",		values: [-8, 6, 0, 8, -8, 10, -2, 13, 8, 1] },
		{ name: "SoftRock",	values: [5, 5, 2, -2, -8, -12, -4, 0, 7, 9] },
		{ name: "Rock",		values: [6, 3, -8, -12, -4, 3, 8, 10, 10, 7] },
		{ name: "Live",		values: [-6, 0, 4, 8, 9, 9, 5, 3, 2, 1] },
		{ name: "Treble",	values: [-10, -11, -12, -6, 2, 8, 13, 13, 11, 14] },
		{ name: "Bass",		values: [11, 7, 3, 0, 0, -6, -10, -10, -2, -2] },
		{ name: "Classic",	values: [0, 7, -1, -7, -12, -8, 0, 10, 4, -5] },
		{ name: "Opera",	values: [-13, -8, 0, 6, 14, 4, -4, -7, -8, -10] },
	]

	loadCss(`

		.jFilter {
			width:100%;
			height:4vh;
			padding-left:10px;
			border:0;
			margin-bottom:5px;
			border-radius:2px;
			outline: none
		}
		.fa-microphone-alt {
			color: #FF0000
		}
		.preset {
			color:#3b4775;
			cursor:pointer;
		}
    	.boxEq {
			transform-origin:top left;
			transform: rotate(-90deg);
    		width: 100px;
    		height: 250px;
			padding:10px;
			margin:0;

			float:left;
			margin-top:0p;
			border: 0;
    		background: transparent;
    		border-radius: 10px;
    		box-shadow: 0 0 25px 0 gray;
    		display: flex;
    		align-items: left;
    		justify-content: space-around;
    		flex-direction: column;
		}

		.boxEq input[type="range"] {
     		-webkit-appearance: none;
     		outline: none;
     		width: 100%;
			float:left;
     		height: 10px;
     		background: transparent;
     		border-radius: 5px;
     		box-shadow: inset 2px 2px 5px 0 gray;
     		overflow: hidden;
     	}

     	.boxEq input[type="range"]::-webkit-slider-thumb {
     		-webkit-appearance: none;
     		width: 15px;
     		height: 15px;
     		background: #3b4775;
     		box-shadow: 0 0 5px 0 silver;
     		cursor: pointer;
			border-radius: 50%;
     	}

	.visualiser {
		height:100px;
		width:100%;
		margin-top:10px;
		border-radius:10px;
		background:#fff;
		float:left;
	}
	#${idx} .alert {
		background:transparent,
		font-family: monospace;
		white-space: pre;
		margin-top:0 !important;
		counter-reset: playlistCounter;
	}

	#${idx} .alertBody div{
		cursor:pointer;
		padding:5px;
		border-radius:5px;
	}

	#${idx} .alertBody div:hover{
		background: rgba(255, 0, 0, 0.5);
	}

	#${idx} .alertBody div::before {
		counter-increment: playlistCounter;
		content: counter(playlistCounter) ") ";
		color: #888
	}


	#${idx} .alertBody::-webkit-scrollbar {
		width: 12px;
	}

	#${idx} .alertBody::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
		border-radius: 10px;
	}

	#${idx} .alertBody::-webkit-scrollbar-thumb {
		border-radius: 10px;
		-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
	}

	#${idx} .alertHead {
		height: 200px;
		overflow:hidden;
	}

	.songPlayed {
		background: rgba(255, 0, 0, 0.1);
	}

	.songPlaying {
		background: rgba(255, 0, 0, 0.6)
	}

	.songError {
		background: rgb(255, 255, 0)
	}

	#${idx} #playerList .alertBody{
		overflow-y: auto;
		overflow-x: hidden;
		height:calc(100% - 200px);

	}
	@media (orientation: landscape) {
        #${idx} {
            padding-top: 2vh
        }
		#${idx} #playerList {
			height:95vh;
		}
	}
	@media (orientation: portrait) and (min-width: 400px) {
        #${idx} {
            padding-top: 9vw
        }
		#${idx} #playerList {
			height:85vh
		}
	}

	@media (orientation: portrait) and (min-width: 0px) and (max-width: 400px){
        #${idx} {
            padding-top: 9vw
        }
		.alert {
			width:100vw;
			margin:0;
		}
	}
	`)

	let onCanPlay = () => {
		player.currentTime = nowPlayingRange.value;
	}

	let loadMeta = () => {
 		let duration = parseInt(player.duration)
 			nowPlayingTime.innerText = 'Duration: ' + duration + ' sec.'
 			nowPlayingRange.max = duration
	}

	let updateTime = () => {
		nowPlayingTime.innerText = 'At: ' + parseInt(player.currentTime) + ' sec. / Duration: ' + parseInt(player.duration) + ' sec.'
		nowPlayingRange.value = parseInt(player.currentTime)
	}

	let play = () => {
		if(!playlist.length) return playFile()

		let currnetSongEl = document.getElementById('song-' + player.index)
			document.querySelectorAll('.songPlaying').forEach( node => node.classList.remove('songPlaying') )

 		if(!player.paused || btnPlay.className === 'fa fa-pause')
		{
			let source = URL.createObjectURL(playlist[player.index])
 				nowPlayingRange.value = 0
				player.src = source
		}

		player
			.play()
			.then( () => {
				btnPlay.className = 'fa fa-pause'
				currnetSongEl.classList.remove('songError')
				currnetSongEl.classList.add('songPlayed')
				currnetSongEl.classList.add('songPlaying')
			})
 			.catch(error => {
				currnetSongEl.classList.add('songError')
 				d(['ERR',error])
 				setTimeout(() => {
 					player.dispatchEvent(new Event('ended'))
 				}, 50)
 			})

		nowPlayingTitle.innerText = (parseInt(player.index) + 1) + '/' + playlist.length + ') ' + playlist[player.index].name
	}

	let playNext = e => {
		if(!playlist.length) return
		player.index++
		if(typeof playlist[player.index] === 'undefined') player.index = 0 // start from the begining if playlist is finished
		play()
	}

	let playPrev = e => {
		if(player.index < 1) return
		player.index--
		play()
	}

	let plToggle = e => {
 		if(player.paused){
			play()
		}else{
			player.pause()
			btnPlay.className = 'fa fa-play'
		}
	}

	let createVisualiser = e => {
		if(audioContext) return

			audioContext = new AudioContext()
			audioContextSrc = audioContext.createMediaElementSource(player)
			audioContextAnalyser = audioContext.createAnalyser()

			audioContextSrc.connect(audioContextAnalyser)
			audioContextAnalyser.connect(audioContext.destination)
			audioContextAnalyser.fftSize = 512

		let bufferLength = audioContextAnalyser.frequencyBinCount
		let dataArray = new Uint8Array(bufferLength)

		let WIDTH = nowPlayingVisualiser.width
		let HEIGHT = nowPlayingVisualiser.height

		let barWidth = 1//(WIDTH / bufferLength) * 2.5
		let barHeight
		let x = 0

		let renderFrame = () => {

			requestAnimationFrame(renderFrame)
			x = 0
			audioContextAnalyser.getByteFrequencyData(dataArray)
			nowPlayingVisualiserContext.fillStyle = "#fff";
			nowPlayingVisualiserContext.fillRect(0, 0, WIDTH, HEIGHT)

			for (var i = 0; i < bufferLength; i++) {
				barHeight = dataArray[i];
				var r = barHeight + (25 * (i/bufferLength));
				var g = 250 * (i/bufferLength);
				var b = 90;
				nowPlayingVisualiserContext.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
				nowPlayingVisualiserContext.fillRect(x, (HEIGHT - barHeight) - 5, barWidth, barHeight);
				x += barWidth + 1;
			}
		}

		renderFrame()
//		z()
		equalizerUIItem()

	}

	let equalizerUIItem = () => {
		let filters = []
		let inputs = []
		for(let i in frequencys){
			let hz = frequencys[i]
			let input = document.createElement("input")
				input.type = "range"
				input.min = "-20.0"
				input.max = "20.0"
				input.value = "0"
				input.addEventListener('input', e => {
					filter.gain.value = input.value
					let savedEq = []
					for(let f of filters) savedEq.push(f.gain.value)
					localStorage.setItem('filters',savedEq.join(','))
				})
				inputs.push(input)

			let filter = audioContext.createBiquadFilter()
				filter.type = "peaking";
				filter.frequency.value = hz
				filter.gain.value = 0
				filters.push(filter)
			boxEq.appendChild(input)
		}

		let storedEq = localStorage.getItem('filters')
		if(storedEq){
			storedEq = storedEq.split(',')
			for(let i in storedEq){
				inputs[i].value = storedEq[i]
				inputs[i].dispatchEvent(new Event('input'))
			}
		}

		for(let preset of presets){
			let set = document.createElement('div')
				set.className = 'preset'
				set.textContent = preset.name
 				set.addEventListener('click', e => {
 						for(let i in preset.values){
							inputs[i].value = preset.values[i]
							inputs[i].dispatchEvent(new Event('input'))
						}
 				})
			boxEq.appendChild(set)
		}

		audioContextSrc.connect(filters[0])
		for(var i = 0; i < filters.length - 1; i++) {
			filters[i].connect(filters[i+1]);
		}
		filters[filters.length - 1].connect(audioContext.destination);

	}

	let showList = e => {
		player.index = 0
		alertBody.innerHTML = ''
		alertBody.appendChild(jFilter)
		playlist.map((track,i) => {
				let songEl = document.createElement('div')
					songEl.classList.add('song')
					songEl.id = 'song-' + i
					songEl.innerText = track.name
					songEl.onclick = () => {
						player.index = i
						play()
					}
					alertBody.appendChild(songEl)
			})
		createVisualiser()
	}

	let playShuf = e => {
		playlist = playlist.sort((a, b) => 0.5 - Math.random()) // Shuffle
		showList()
		play()
	}

	let playFile = e => {
		if(e && e.target && e.target.className && e.target.className === 'fas fa-file-audio')
		{
			files.multiple = "multiple"
			files.accept ="audio/*"
			files.directory = false
			files.webkitdirectory = false
		}else{
			files.type = ''
			files.type = 'file'
			files.multiple = "multiple"
			files.accept ="audio/*"
			files.directory = 'directory'
			files.webkitdirectory = 'webkitdirectory'
		}
		files.click()
	}

	let playLoad = e => {
		playlist = []
		for(let file of e.target.files) if(file.type.split('/')[0] === 'audio') playlist.push(file)

		files.type = '' // Reset/empty files list
		files.type = 'file'
		showList()
		play()
	}

	let  z = () => {
		setTimeout(z, 40);
		let l = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"]
		let d = new Uint8Array(4)
		audioContextAnalyser.getByteFrequencyData(d)
		const data = Array.from(d)
		const s = data.map(v => l[Math.floor((v / 255) * 8)])
		document.title = s.join("") + ' ' + playlist[player.index].name
	}

	let resizeEq = () => {
		boxEq.style.height = nowPlayingVisualiser.offsetWidth
	}

	let keypress = e => {
//			d(e)
//		if(e.altkey)
		{
				 if (e.keyCode === 106){
					 e.preventDefault()
					 jFilter.focus() // shift + j
				 }
// 			else if (e.keyCode === 32 ) plToggle() // shift + space
// 			else if (e.keyCode === 110) playNext() // shift + n
// 			else if (e.keyCode === 112) playPrev() // shift + p
//  			else if (e.keyCode === 111) playFile() // shift + o

		}
  	}

  	let filterPl = e => {
		let filter = e.target.value.toLowerCase()
		if(filter.length > 0){
			playlist.find( (a,i) => {
				document.getElementById('song-' + i).style.display = (new RegExp(filter + '\*', 'gi')).test(a.name.toLowerCase()) ? 'block' : 'none';
			})
		}
	}

	nowPlayingRange.addEventListener('input', onCanPlay, false)
		player.		addEventListener('loadedmetadata', loadMeta, false)
		player.		addEventListener('timeupdate', updateTime, false)
		player.		addEventListener('ended',  playNext, false)
		files.		addEventListener('change', playLoad, false)
		btnPlus.	addEventListener('click',  playFile, false)
		btnFile.	addEventListener('click',  playFile, false)
		btnShuf.	addEventListener('click',  playShuf, false)
		btnPlay.	addEventListener('click',  plToggle, false)
		btnForw.	addEventListener('click',  playNext, false)
		btnPrev.	addEventListener('click',  playPrev, false)
		jFilter.	addEventListener('input',  filterPl, false)
		document.	addEventListener('keypress',keypress,	false)
		window.		addEventListener('resize', resizeEq, false)

		resizeEq()
})()

//alert(navigator.userAgent.toLowerCase().indexOf("android")) // is android
