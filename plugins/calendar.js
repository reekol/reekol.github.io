loadCss(`
    ul {list-style-type: none;}
    ul, li {box-sizing: border-box;}
    .days {
        padding: 10px 0;
        margin: 0;
    }

    .days li {
        list-style-type: none;
        display: inline-block;
        width: 13.6%;
        text-align: center;
        font-size: 1.5vh;
        color: #fff;
        cursor:pointer;
        padding:0.5vh;
    }

    .days .active {
        background: #1abc9c;
        color: white !important
    }

    .days li:hover {
        color: white !important
    }

    .days .day6, .days .day7{
        color: #00bb99;
        font-weight:bold
    }
`);


(() => {

   	let idx = PROJECT + ''
	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')
	let storage = window.localStorage

	let	btnMonth = document.createElement('a')
		btnMonth.href="#" + idx
		btnMonth.className = 'fas fa-calendar-alt'
        nav.appendChild(btnMonth)
        btnMonth.dispatchEvent(new Event('pointerdown'))

	let section = document.createElement('section')
		section.id = idx
		section.style.background = 'transparent'
        cnt.appendChild(section)

	let getDay = (year, month, day) => {
        let date = new Date()
            if(year)  date.setYear(year)
            if(month) date.setMonth(month - 1)
            if(day)   date.setDate(day)
        let res = {
            obj:        date,
            year:       date.getFullYear(),
            month:      date.getMonth() + 1,
            dayOfMonth: date.getDate(),
            dayOfWeek:  date.getDay(),
        }

        res.dayOfWeek = (res.dayOfWeek === 0 ? 7 : res.dayOfWeek)
        return res
    }

    let getMonth = (year, month) => {
        let days = []
        let day = 1
        let date = getDay(year, month, day)
         while (date.month === month){
             date = getDay(year, month, day++)
             if(date.month === month) days.push(date)
         }
        return days
    }

    let getYear = year => {
        let months = []
        for(let i = 1; i < 13; i++) months.push(getMonth(year, i))
        return months
    }

    let createMonthCal = (year, month) => {
        let today = getDay()
        let toMonth = getMonth(year, month)
        let alert = showAlert(section,{
                title:year + '. ' + month + '.',
                message:''
            },false)
        alert.classList.add('month-' + month)
        let alertBody = alert.querySelector('.alertBody')
        let ul = document.createElement('ul')
            ul.className = 'days'
            for(let pre = 1; pre < toMonth[0].dayOfWeek; pre++) ul.appendChild(document.createElement('li')) // add empty lists at the begining of the month
            for(let day of toMonth){
                let li = document.createElement('li')
                    li.innerText = day.dayOfMonth
                    li.className = 'day' + day.dayOfWeek
                    ul.appendChild(li)

                if(
                    today.year === day.year &&
                    today.month === day.month &&
                    today.dayOfMonth === day.dayOfMonth
                ){ li.className = 'active' }
            }
            alertBody.appendChild(ul)
    }


    let today = getDay()
//    createMonthCal(today.year, today.month)
    let toMonth = getMonth(today.year, today.month)

    let toYear = getYear(today.year)

    for(let i = 12; i > 0; i-- ) createMonthCal(today.year, i)
})()
