
var   paletteBrushColor = '#ff0000';

(() => {

	const nav = document.querySelector('nav')
	const btnColorPicker = document.createElement('i')
		  btnColorPicker.className="fas fa-palette"

	nav.appendChild(btnColorPicker)

	loadCss(`
			.jscolor-picker-wrap {
				position:absolute !important;
				top:0 !important;
				left:0 !important;
			}`)

	loadScript('https://cdnjs.cloudflare.com/ajax/libs/jscolor/2.4.5/jscolor.min.js',() => {

			let myPicker 		= new JSColor(btnColorPicker,{
				'showOnClick':true,
				'format':'rgba',
				'previewSize': 400,
		 		'width': 180,
		 		'height': 150,
		 		'position': 'left',
		 		'backgroundColor': '#333',
		 		'onChange':() => {
		 			paletteBrushColor = btnColorPicker.dataset.currentColor
		 			btnColorPicker.style.background = 'transparent'
		 			btnColorPicker.style.color = paletteBrushColor
		 		},
		 		'hideOnPaletteClick':true,
		 		'value':paletteBrushColor,
		 		'palette': [
		 			'#000000', '#7d7d7d', '#870014', '#ec1c23', '#ff7e26',
		 			'#fef100', '#22b14b', '#00a1e7', '#3f47cc', '#a349a4',
		 			'#ffffff', '#c3c3c3', '#b87957', '#feaec9', '#ffc80d',
					'#eee3af', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7',
					]})
			jscolor.init()

		 	btnColorPicker.style.background = 'transparent'
		 	btnColorPicker.style.color = paletteBrushColor
	})

})()
