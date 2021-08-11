(() => {

   	let idx = PROJECT + ''
	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')
	let storage = window.localStorage
	let items = [1,2,3,'+','-',4,5,6,'*','/',7,8,9,'**','=',0,'(',')','%','CE']

    let clc = document.createElement('a')
		clc.href="#" + idx
		clc.className = 'fas fa-calculator'
        nav.appendChild(clc)

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
            font-size:3.0vh;
            color:#000;
            cursor:pointer;
        }
        .calcText {
            width:100%;
            outline:none;
            border:0;
            border-radius:5px;
            height:6vh;
            font-weight: bold;
            font-size:3.0vh;
            text-align:right;
            padding:10px;
        }
        .calculator{
            margin-top:9vw
        }
	`)
    let alert = showAlert(cnt,{title:'',message:''},false)
        alert.classList.add('calculator')
    let alertTitle = alert.querySelector('.alertHead')
    let alertBody = alert.querySelector('.alertBody')

    let res = document.createElement('input')
        res.type = 'text'
        res.classList.add('calcText')
        res.placeholder = 'Result'
        alertTitle.appendChild(res)

	for(let i of items){
        let btn = document.createElement('input')
            btn.type = 'button'
            btn.classList.add('calcNum')
            btn.value = i
            if(parseInt(i) !== i) btn.style.background = '#cdcdcd'
            if(i == '='){
                btn.addEventListener('pointerdown', e => { res.value = eval(res.value)  }, false)
            }else if (i == 'CE'){
                btn.addEventListener('pointerdown', e => { res.value = ''               }, false)
            }else{
                btn.addEventListener('pointerdown', e => { res.value += btn.value       } ,false)
            }
            alertBody.appendChild(btn)
    }

})()

//alert(navigator.userAgent.toLowerCase().indexOf("android")) // is android
