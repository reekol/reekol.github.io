
(() => {

	let idx = PROJECT + ''
	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')
	let playing = false
	let playlist = []
	let nowPlaying
	let nowPlayingTitle = document.createElement('div')

	let nowPlayingTime = document.createElement('div')
	let nowPlayingRange = document.createElement('input')
		nowPlayingRange.type = 'range'
		nowPlayingRange.value = 0
		nowPlayingRange.min =  0
		nowPlayingRange.max = 100
		nowPlayingRange.step = 0.5
		nowPlayingRange.style.width = '100%'

	let btnPlus = document.createElement('a')
		btnPlus.className = 'fas fa-folder-plus'
		btnPlus.href = '#' + idx

	let btnShuf = document.createElement('a')
		btnShuf.className = 'fas fa-random'
		btnShuf.href = '#' + idx

	let btnPlay = document.createElement('a')
		btnPlay.className = 'fas fa-play'
		btnPlay.href = '#' + idx

	let btnStop = document.createElement('i')
		btnStop.className = 'fas fa-stop'

	let btnForw = document.createElement('i')
		btnForw.className = 'fas fa-fast-forward'

	let btnPrev = document.createElement('i')
		btnPrev.className = 'fas fa-fast-backward'

	let boxPlay = document.createElement('section')
		boxPlay.id = idx

		nav.appendChild(btnPlus)
		nav.appendChild(btnShuf)
		nav.appendChild(btnPrev)
		nav.appendChild(btnPlay)
		nav.appendChild(btnForw)
		cnt.appendChild(boxPlay)

	let player = document.createElement('audio')
		player.controls = true
		player.preload="metadata"
		player.index = -1 // init with element before first one
		player	.play() //workaround for initial error
				.catch(e => d(['Ugly workaround', e]))

	let files = document.createElement('input')
		files.type = 'file'
  		files.webkitdirectory = true
   		files.directory = true
		files.multiple = "multiple"
		files.accept ="audio/*"

	let audioContext,
		audioContextAnalyser,
		audioContextSrc

	let highShelf,
		lowShelf,
		highPass,
		lowPass

	let nowPlayingVisualiser = document.createElement('canvas')
		nowPlayingVisualiser.className = 'visualiser'
		nowPlayingVisualiser.width  = 512
		nowPlayingVisualiser.height = 300
	let nowPlayingVisualiserContext = nowPlayingVisualiser.getContext("2d")

	loadCss(`
	.visualiser {
		height:100px;
		width:100%;
		margin-top:10px;
		border-radius:10px;
		background:blue
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
	}

	#${idx} #playerList .alertBody{
		overflow-y: auto;
		overflow-x: hidden;
		height:calc(100% - 200px);

	}
	@media (orientation: landscape) {
		#${idx} #playerList {
			height:95vh
		}
	}
	@media (orientation: portrait) {
		#${idx} #playerList {
			height:85vh
		}
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

		let currnetSongEl = document.getElementById('song-' + player.index)
			document.querySelectorAll('.songPlaying').forEach( node => node.classList.remove('songPlaying') )

		if(!player.paused){
			let source = URL.createObjectURL(playlist[player.index])
				nowPlayingRange.value = 0
				player.src = source
		}

		player
			.play()
			.then( () => {
				playing = true
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
		document.title = playlist[player.index].name
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
 		if(playing){
			player.pause()
			playing = false
			btnPlay.className = 'fa fa-play'
		}else{
			play()
		}
	}

	let createVisualiser = e => {

		if(!audioContext) 			audioContext = new AudioContext()
		if(!audioContextSrc) 		audioContextSrc = audioContext.createMediaElementSource(player)
		if(!audioContextAnalyser)	audioContextAnalyser = audioContext.createAnalyser()

			audioContextSrc.connect(audioContextAnalyser)
			audioContextAnalyser.connect(audioContext.destination)
			audioContextAnalyser.fftSize = 512

			highShelf = audioContext.createBiquadFilter()
			lowShelf = audioContext.createBiquadFilter()
			highPass = audioContext.createBiquadFilter()
			lowPass = audioContext.createBiquadFilter()

			highShelf.connect(lowShelf)
			lowShelf.connect(highPass)
			highPass.connect(lowPass)
			lowPass.connect(audioContext.destination)

			highShelf.type = "highshelf"
			highShelf.frequency.value = 4700
			highShelf.gain.value = 1

			lowShelf.type = "lowshelf"
			lowShelf.frequency.value = 35
			lowShelf.gain.value = 1

			highPass.type = "highpass"
			highPass.frequency.value = 800
			highPass.Q.value = 0.1

			lowPass.type = "lowpass"
			lowPass.frequency.value = 880
			lowPass.Q.value = 0.1

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
				var b = barHeight + (25 * (i/bufferLength));
				var g = 250 * (i/bufferLength);
				var r = 90;
				nowPlayingVisualiserContext.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
				nowPlayingVisualiserContext.fillRect(x, (HEIGHT - barHeight) - 5, barWidth, barHeight);
				x += barWidth + 1;
			}
		}

		renderFrame()

	}

	let showList = e => {
		let alert = showAlertCleared(boxPlay,{
			title: 'Currently playing:',
			message: ''
		},false)
		alert.id = 'playerList'

		player.index = 0
		alertBody = alert.getElementsByClassName('alertBody')[0]
		playlist.map((track,i) => {
				let songEl = document.createElement('div')
					songEl.id = 'song-' + i
					songEl.innerText = track.name
					songEl.onclick = () => {
						player.index = i
						play()
					}
					alertBody.appendChild(songEl)
			})
		nowPlaying = alert.getElementsByClassName('alertHead')[0]
		nowPlaying.appendChild(nowPlayingTitle)
		nowPlaying.appendChild(nowPlayingTime)
		nowPlaying.appendChild(nowPlayingRange)
		nowPlaying.appendChild(document.createElement('br'))
		nowPlaying.appendChild(nowPlayingVisualiser)

		createVisualiser()
	}

	let playShuf = e => {
		playlist = playlist.sort((a, b) => 0.5 - Math.random()) // Shuffle
		showList()
	}

	let playFile = e => {
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

	nowPlayingRange.addEventListener('input', onCanPlay, false)
		player.		addEventListener('loadedmetadata', loadMeta, false)
		player.		addEventListener('timeupdate', updateTime, false)
		player.		addEventListener('ended',  playNext, false)
		files.		addEventListener('change', playLoad, false)
		btnPlus.	addEventListener('click',  playFile, false)
		btnShuf.	addEventListener('click',  playShuf, false)
		btnPlay.	addEventListener('click',  plToggle, false)
		btnForw.	addEventListener('click',  playNext, false)
		btnPrev.	addEventListener('click',  playPrev, false)
})()
