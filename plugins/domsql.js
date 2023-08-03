;(async () => {

   	let idx = PROJECT + ''
	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')
	let storage = window.localStorage
    let stored = null; try{ stored = JSON.parse(await storage.apiGetItem('domsql_0')) }catch(e){}
    let now = Date.now()
    if(!stored) stored = { // Example config if nothing stored in localStorage
        sql:`/* ${now} */
/* This is going to be in the [1] weblet */

    SELECT
        '<base href="https://www.accuweather.com/">' as base, /* set base path for resulted html */
        {//*[@rel="stylesheet"]=>outer} as styles, /* use page styles */
        {//*[@class="hourly-wrapper content-module"]=>outer} as html /* get the html */
    FROM {https://www.accuweather.com/bg/bg/rosoman/51035/hourly-weather-forecast/51035};

/* This is going to be in the [2] weblet */

    SELECT
        '<base href="https://www.accuweather.com/">' as base, /* set base path for resulted html */
        {//*[@rel="stylesheet"]=>outer} as styles, /* use page styles */
        {//*[@class="daily-wrapper"]=>outer} as html /* get the html */
    FROM    {https://www.accuweather.com/bg/bg/rosoman/15035/daily-weather-forecast/15035};

            `,
        js:`
// Add absolute path.
    document.querySelectorAll('img')
            .forEach(el => {
                el.src = el.dataset.src ? 'https://www.accuweather.com/' + el.dataset.src : el.src
            })`,
        css:`
br{
    display:none;
}
.language-json{
    font-family: monospace;
    white-space: pre;
}`,
        drf:`/* worldtimeapi */
SELECT
    {//*[@rel="stylesheet"]=>outer},
    {//*[@class="language-json"]=>outer}
FROM    {https://worldtimeapi.org/}
`,
        ato:false
    }

    let btn = document.createElement('a')
        btn.href = '#' + idx
        btn.classList.add('fas')
        btn.classList.add('fa-spider')

    let btnDoc = document.createElement('a')
        btnDoc.href = '#' + idx + '-doc'
        btnDoc.classList.add('fas')
        btnDoc.classList.add('fa-question-circle')

    let btnAto = document.createElement('a')
        btnAto.href = '#' + idx
        btnAto.selected = stored.ato ? stored.ato : false
        btnAto.style.color = btnAto.selected ? '#0F0' : '#FFF'
        btnAto.classList.add('fas')
        btnAto.classList.add('fa-running')
        btnAto.addEventListener('pointerdown', e => {
            btnAto.selected = !btnAto.selected
            btnAto.style.color = btnAto.selected ? '#0F0' : '#FFF'
            if(btnAto.selected) btnRun.dispatchEvent(new Event('pointerdown'))
            else save()
        } , false)

    let sec = document.createElement('section')
        sec.id = idx

    let doc = document.createElement('section')
        doc.id = idx + '-doc'

        cnt.appendChild(sec)
        cnt.appendChild(doc)

        nav.appendChild(btn)
        nav.appendChild(btnAto)
        nav.appendChild(btnDoc)

    let SQL, DB, editorSql, editorCb, editorCss, editorWeb, editorRes
    let EXAMPLE = `
// Required dependency: <script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js' ></script>

;(async () => { // You can use this code to generate DomSQL weblets and append them to the body of your webpage.
    let qry = \`\${qry}\`
    let css = \`\${css}\`
    let js  = \`\${js}\`
    let domsql = new DomSQL(new (await initSqlJs({ locateFile: file => \`https://sql.js.org/dist/\${file}\` })).Database())
        domsql.run(qry).then( r => r.map( res => document.body.appendChild(domsql.weblet(res, css, js)) ) )
})()`

    showAlert(doc, {title:'Provided by:', message: 'ReeKol - Nikolay Terziev (reekol.github.com).'}, false)
    loadScript('lib/domsql.js?t=' + Date.now(), () => {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js', () => {
             jsdoc(DomSQL).reverse().map( dc => {
                 if(dc.indexOf('@public') > 0){ // Document only public functions
                    let d = showAlert(doc, {title:'', message: dc }, false)
                        d.classList.add('preformatted')
                        d.querySelector('.alertHead').style.display = 'none'
                    let body = d.querySelector('.alertBody')
                        body.innerHTML = body.innerHTML
                                            .replace('* @public', '')
                                            .replace('@name','<span class="docRed">@name</span>')
                                            .replaceAll('@example','<span class="docGreen">@example</span>')
                                            .split('\n')
                                            .map( line => line.trim() )
                                            .filter( a => a )
                                            .slice(1,-1)
                                            .join('\n')
                }
             })
             showAlert(doc, {title:'Documentation:', message: 'As extracted from jsdoc.'}, false)

        })
    })

	loadCss(`
        @media (orientation: landscape) {
            section {
                padding-top: 2vh
            }
            .alert{
                width:85vw
            }
        }
        @media (orientation: portrait) {
            section {
                padding-top: 8vw
            }
            .alert{
                width:100vw;
                margin-left:0;
                margin-right:0;
            }
        }
	`)

    loadCss(`
        .docRed     { color: #f00 }
        .docGreen   { color: #0f0 }
        .docBlue    { color: #00f }
        .alertBody  { overflow-x: auto;}
        .btnRun, .btnClose{
            border-top-left-radius:0 !important;
            border-top-right-radius:0 !important;
        }
        input[type=button] {
            background-color: #04AA6D;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width:100%
        }
        input[type=button]:hover {
            background-color: #45a049;
        }
        `)

    let alert = showAlertTabs(sec,['Sql','Js','Css','Results','Weblet', 'Drafts'],false)
        alert.classList.add('domsql')
    let alertTitle = alert.querySelector('.alertHead')
    let alertBody = alert.querySelector('.alertBody')
        alertTitle
                .querySelectorAll('.tabList')
                .forEach( (el, i) => el.addEventListener('pointerdown', e => alertBody.style.display = 'block' ,false) )

    let alertEditorSql = document.querySelector('.tabContent_0')
        alertEditorSql.style.height = '30vh'
        alertEditorSql.id = 'editorSql'

    let alertEditorJs = document.querySelector('.tabContent_1')
        alertEditorJs.style.height = '30vh'
        alertEditorJs.id = 'editorJs'

    let alertEditorCss = document.querySelector('.tabContent_2')
        alertEditorCss.style.height = '30vh'
        alertEditorCss.id = 'editorCss'

    let alertEditorRes = document.querySelector('.tabContent_3')
        alertEditorRes.style.height = '30vh'
        alertEditorRes.id = 'editorRes'

    let alertEditorWeb = document.querySelector('.tabContent_4')
        alertEditorWeb.style.height = '30vh'
        alertEditorWeb.id = 'editorWeb'

    let alertEditorDrf = document.querySelector('.tabContent_5')
        alertEditorDrf.style.height = '30vh'
        alertEditorDrf.id = 'editorDrf'

    let btnRun = document.createElement('input')
        btnRun.classList.add('btnRun')
        btnRun.type = 'button'
        btnRun.value = 'Run / Save'
        alert.appendChild(btnRun)

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js', () => {

        editorSql = ace.edit('editorSql',{ mode:'ace/mode/sql',  fontSize: "1.5vh" /* theme:'ace/theme/dracula'*/ })
        editorJs  = ace.edit('editorJs', { mode:'ace/mode/javascript',  fontSize: "1.5vh" })
        editorCss = ace.edit('editorCss',{ mode:'ace/mode/css',  fontSize: "1.5vh"})
        editorRes = ace.edit('editorRes',{ mode:'ace/mode/json',  fontSize: "1.5vh"})
        editorWeb = ace.edit('editorWeb',{ mode:'ace/mode/javascript',  fontSize: "1.5vh"})
        editorDrf = ace.edit('editorDrf',{ mode:'ace/mode/text',  fontSize: "1.5vh"})

        if(typeof stored.sql !== 'undefined') editorSql.setValue(stored.sql, -1)
        if(typeof stored.js  !== 'undefined') editorJs .setValue(stored.js , -1)
        if(typeof stored.css !== 'undefined') editorCss.setValue(stored.css, -1)
        if(typeof stored.drf !== 'undefined') editorDrf.setValue(stored.drf, -1)
    })

    let save = async () => {
        return storage.apiSetItem('domsql_0',JSON.stringify({
            sql:editorSql.getValue(),
            js:editorJs.getValue(),
            css:editorCss.getValue(),
            drf:editorDrf.getValue(),
            ato:btnAto.selected
        }))
    }

    let btnClick = async e => {
        save()
        alertBody.style.display = 'none'
        let domsql = new DomSQL(
//            new (await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` })).Database()
            new (await initSqlJs({ locateFile: file => `https://sql.js.org/dist/sql-wasm.wasm` })).Database()
        )
        let res = await domsql.run(editorSql.getValue())

        let tabs = Array(res.length)
            tabs.fill('*')
        let results = showAlertTabs(sec, tabs, false)
        //  if(results.previousElementSibling)  results.parentNode.insertBefore(results, results.previousElementSibling) // Move up
            if(results.nextElementSibling)      results.parentNode.insertBefore(results.nextElementSibling, results) // Move down
        let resClose = document.createElement('input')
            resClose.classList.add('btnClose')
            resClose.type = 'button'
            resClose.value = 'Close'
            resClose.addEventListener('pointerdown', e => results.remove(), false)
            results.appendChild(resClose)

        editorWeb. setValue(EXAMPLE
            .replaceAll('${qry}',editorSql.getValue().replaceAll('\n',' ').replace(/\s\s+/g, ' '))
            .replaceAll('${css}',editorCss.getValue().replaceAll('\n',' ').replace(/\s\s+/g, ' '))
            .replaceAll('${js}', editorJs .getValue())
        )
        res.map( (result, i) => {
                let title = results.querySelector('.tabList_' + i)
                    title.innerText = (i + 1)
                let contents = results.querySelector('.tabContent_' + i)
                    contents.innerHTML = ''
                let weblet = domsql.weblet(result, editorCss.getValue(), editorJs .getValue())
                    weblet.style.width = '100%'
                    weblet.style.height = '65vh'
                contents.appendChild(weblet)
        })
        editorRes.setValue(JSON.stringify(res, null, 4), -1)
    }

    btnRun.addEventListener('pointerdown', btnClick, false)
    btn.click()

    if(btnAto.selected){
        setTimeout( e => btnRun.dispatchEvent(new Event('pointerdown')),1000 )
    }

})()
