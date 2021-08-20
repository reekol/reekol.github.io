loadCss(`
    @media (orientation: landscape) {
        .container {
            padding-top: 2vh
        }
    }
    @media (orientation: portrait) {
        .container {
            padding-top: 8vw
        }
    }
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
        background: rgba(255, 0, 0, 0.3);
        color: white !important
    }

    .days li:hover {
        color: #00ffFF !important
    }

    .days .day6, .days .day7{
        color: #00bb99;
        font-weight:bold
    }

    .events {
        position: relative;
    }

    .events::before,
    .events::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        border-color: transparent;
        border-style: solid;
    }

    .events::before {
    }

    .events::after {
        border-width: 0.4em;
    }
`)

;(() => {

   	let idx = PROJECT + ''
	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')
	let storage = window.localStorage

	let	btnPrev = document.createElement('a')
		btnPrev.href="#" + idx
		btnPrev.className = 'fas fa-caret-left'
        nav.appendChild(btnPrev)
	let	btnMonth = document.createElement('a')
		btnMonth.href="#" + idx
		btnMonth.className = 'fas fa-calendar-alt'
        nav.appendChild(btnMonth)
	let	btnNext = document.createElement('a')
		btnNext.href="#" + idx
		btnNext.className = 'fas fa-caret-right'
        nav.appendChild(btnNext)

// 	let section = document.createElement('section')
// 		section.id = idx
// 		section.style.background = '#0c0'
//         cnt.appendChild(section)
        section = cnt
    let archive = {}


    let getCommands = text => {
        text = text.split('\n')
        let commands = {}
        let availableCommands = ['sync','color']
        for(let line of text){
            line = line.split(':')
            if(availableCommands.indexOf(line[0]) > -1) commands[line.shift()] = line.join(':')
        }
        return commands
    }

	let getAllNotes = () => {
        let re = /\d{2}.\d{2}.\d{4}/mgi;
			keys = Object.keys(localStorage).sort().reverse(),
			i = keys.length
		while ( i-- ){
			let name = keys[i]
			if(name.indexOf('note-') === 0){
                try{
                    let btoaclass = btoa(name)
                    let item = JSON.parse(localStorage.getItem(name))
                    let commands = getCommands(item.title)
                    let color = (typeof commands.color === 'undefined' ? '#FFFFFF' : commands.color)
                    let dates = item.body.matchAll(re)
                    let matched = false
                    for (const match of dates) {
                        matched = true
                        let matchDate = match[0].split('.').map( i => parseInt(i) ).join('.')
                        if(typeof archive[matchDate] === 'undefined') archive[matchDate] = []
                        archive[matchDate].push({
                            name: name,
                            class: btoaclass,
                            match: match[0],
                            start: match.index,
                            end: match.index + match[0].length,
                            color: color
                        })
                    }
                    if(matched){
                        loadCss(`.${btoaclass}::after {
                            border-width: 0.6em;
                            border-right-color: ${color};
                            border-top-color: ${color};
                        }`)
                    }
                }catch(e){
                    d(['ERR',e])
                }
			}
		}
		return archive
	}

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
        let key = [res.dayOfMonth,res.month,res.year].join('.')
            res.events = typeof archive[key] === 'undefined' ? [] : archive[key]
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

    let showDayliEvents = e => {
        let events = e.target.events
        let toDisplay = []
        for (let evt of events){
            let note = JSON.parse(localStorage.getItem(evt.name))
            toDisplay.push(note.title + '\n' + note.body)
        }
        d(toDisplay.join('\n>\n'))
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
                    li.classList.add('day' + day.dayOfWeek)
                    ul.appendChild(li)

                if(
                    today.year === day.year &&
                    today.month === day.month &&
                    today.dayOfMonth === day.dayOfMonth
                ){ li.classList.add('active') }

                if( day.events.length > 0){
                    li.classList.add('events')
                    li.events = day.events
                    for(let evt of day.events){
                        li.classList.add(evt.class)
                    }
                    li.addEventListener('pointerdown',showDayliEvents,false)
                }
            }
            alertBody.appendChild(ul)
    }

    let today = getDay()
    let year = today.year
    getAllNotes()


    btnNext. addEventListener('pointerdown', e => {
        section.innerHTML = ''
        let toYear = getYear(year++)
        for(let i = 12; i > 0; i-- ) createMonthCal(year, i)
    })

    btnPrev. addEventListener('pointerdown', e => {
        section.innerHTML = ''
        let toYear = getYear(year--)
        for(let i = 12; i > 0; i-- ) createMonthCal(year, i)
    })

    btnMonth. addEventListener('pointerdown', e => {
        section.innerHTML = ''
        year = today.year
        let toYear = getYear(year)
        for(let i = 12; i > 0; i-- ) createMonthCal(year, i)
    })
    btnMonth. dispatchEvent(new Event('pointerdown'))
})()
