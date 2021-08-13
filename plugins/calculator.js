(() => {

   	let idx = PROJECT + ''
	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')
	let storage = window.localStorage
	let items = [1,2,3,'+','-',4,5,6,'*','/',7,8,9,'**','=',0,'(',')','C','CE']

	loadCss(`
        #${idx}{
            font
        }
        .calculator alertBody{
            justify-content: space-around;
        }

        .calcNum {
            margin:0;
            width:20%;
            padding:4vh 0 4vh 0;
            outline:none;
            border-radius:5px;
            border:0;
            font-size:4.0vh;
            font-weight: bold;
            color:#000;
            cursor:pointer;
            background: radial-gradient(#ffffff, #cdcdcd);
        }
        .calcText {
            width:100%;
            outline:none;
            border:0;
            border-radius:5px;
            height:10vh;
            font-weight: bold;
            font-size:6.0vh;
            text-align:right;
            padding:10px;
        }
        .calculator{
            margin-top:2vh
        }
	`)
    let alert = showAlert(cnt,{title:'',message:''},false)
        alert.classList.add('calculator')
    let alertTitle = alert.querySelector('.alertHead')
    let alertBody = alert.querySelector('.alertBody')

    let res = document.createElement('input')
        res.type = 'text'
        res.classList.add('calcText')
        res.placeholder = '.'
        alertTitle.appendChild(res)

	for(let i of items){
        let btn = document.createElement('input')
            btn.type = 'button'
            btn.classList.add('calcNum')
            btn.value = i
            if(parseInt(i) !== i) btn.style.background = 'radial-gradient(#ffffff, #dedede)'
            if(i == '='){
                btn.addEventListener('pointerdown', e => { res.value = eval(res.value)  }, false)
            }else if (i == 'C'){
                btn.addEventListener('pointerdown', e => { res.value = res.value.slice(0, -1) }, false)
            }else if (i == 'CE'){
                btn.addEventListener('pointerdown', e => { res.value = ''               }, false)
            }else{
                btn.addEventListener('pointerdown', e => { res.value += btn.value       } ,false)
            }
            alertBody.appendChild(btn)
    }

})()

//alert(navigator.userAgent.toLowerCase().indexOf("android")) // is android
