
class DomSQL {

    constructor(query, db){
        this.db = db
        this.query = query
        this.events = {}
        this.data = false
    }

    run = async () => {
        return this.tokenize(this.query).then( tokenized => {
            return this.handleEventTokenized(tokenized)
        })
    }

    getSource = async source => {
//        window.navigator.userAgent = 'DomSQL client'
        return fetch(source.sanitized,{
            method:'GET',
            mode: 'cors',
            headers: new Headers({ "User-Agent"   : "MY-UA-STRING" }),
        }).then(r => r.text())
    }

    handleEventTokenized = async tokenized => {
        let promises = []
        for(let source in tokenized.sources){
            this.db.exec(`CREATE TABLE ${source} (` + Object.keys(tokenized.fields).join(',') + `);`);
            promises.push(
                this
                    .getSource(tokenized.tokens[source])
                    .then(xhtml => {
                        let fieldRes = {}
                        let doc = new DOMParser()
                        let dom = doc.parseFromString(xhtml, "text/html")
                        for(let field in tokenized.fields){
                            let xpath = tokenized.tokens[field].sanitized
                            let x3a = tokenized.tokens[field].x3a
                                fieldRes[field] = []
                            let xp = dom.evaluate( xpath, dom, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null )
                            let actualEl = xp.iterateNext()

                            while (actualEl) {
                                if(x3a){
                                         if(x3a === 'text' ) actualEl = actualEl.innerText
                                    else if(x3a === 'html' ) actualEl = actualEl.innerHTML
                                    else if(x3a === 'outer') actualEl = actualEl.outerHTML
                                }else{
                                    actualEl = actualEl.outerHTML
                                }
                                this.db.exec(`INSERT INTO ${source} (${field}) VALUES (?)`, [actualEl])
                                fieldRes[field].push(actualEl)
                                actualEl = xp.iterateNext()
                            }
                        }
                        return {
                            source: source,
                            fields: fieldRes
                        }
                    })
                    .catch(e =>{
                        d(e)
                    })
            )
        }
        return Promise
                .allSettled(promises)
                .then( res => {
                    return this.db.exec(tokenized.qryProcessed)
                })
    }

    hashCode = str =>  { // https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
        var hash = 0, i, chr;
        if (str.length === 0) return hash;
        for (i = 0; i < str.length; i++) {
            chr   = str.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return 't_' +  ( hash < 0 ? '0' + (hash * -1) : hash)  // replace minus sign with 0
    }

    xpath = ob => {
        let x3a = ob.sanitized.split('=>')
        ob.sanitized = x3a[0]
        ob.x3a = x3a[1] || false
        ob.proto = 'xpath'
        return ob
    }

    postprocess = str => {
        let sanitized = str.substring(1, str.length-1)
        let ob = {}
            ob.str = str
            ob.x3a = false
            ob.sanitized = sanitized
            sanitized = sanitized.split(':')
             if(sanitized[0] === 'http')   ob.proto = 'http'
        else if(sanitized[0] === 'https')  ob.proto = 'https'
        else if(sanitized[0] === 'imap')   ob.proto = 'imap'
        else if(sanitized[0] === 'base64') ob.proto = 'base64'
        else if(sanitized[0] === 'data')   ob.proto = 'data'
        else                               ob = this.xpath(ob)
        return ob
    }

    tokenize = async qry => {
        let query = qry.split('')
        let qryProcessed = qry
        let tokens = {}
        let sources = {}
        let fields = {}
        let tagOpen = false
        let tagString = ''
        let isEscaped = false
        let symbolPrev = ''

        for(let symbol of query){
            isEscaped = symbolPrev === '\\'
            if(symbol === '{' && !isEscaped){
                tagOpen = true
                tagString = ''
            }

            if(tagOpen) tagString += symbol

            if(symbol === '}' && !isEscaped){
                if (tagOpen){
                    let hc = this.hashCode(tagString)
                    tokens[hc] = this.postprocess(tagString)
                    if(tokens[hc].proto === 'xpath'){
                        if(typeof fields[hc] === 'undefined') fields[hc] = 0
                        fields[hc]++
                    }else{
                        if(typeof sources[hc] === 'undefined') sources[hc] = 0
                        sources[hc]++
                    }
                    tagString = ''
                }
                tagOpen = false
            }
            symbolPrev = symbol
        }
        for(let key of Object.keys(tokens)) qryProcessed = qryProcessed.replaceAll(tokens[key].str, key)
        return {
            qry: qry,
            qryProcessed: qryProcessed,
            sources: sources,
            fields: fields,
            tokens: tokens
        }
    }

    weblet = (res, css, js) => {
        let body = '' //JSON.stringify(res, null, 4)
        for(let val of res.values){
            let dsql = document.createElement('domsql')
                dsql.innerHTML = val.join('<br />')
            body += dsql.outerHTML
        }

        let ifrm  = document.createElement('iframe')
            ifrm.style.border=0
            ifrm.style.background = 'transparent'

        let html = `<html><style>${css}</style><body>${body}<script type='text/javascript' >try{ ${js} }catch(e){ console.log(e) }</script></body></html>`
            ifrm.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
        return ifrm
    }
}

// loadScript('https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.1/sql-wasm.js', async () => {
//     const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` })
//     const DB = new SQL.Database() // REQUIRED implementation of .exec method
//     let domsql = new DomSQL(
//         `SELECT s1.{//title=>text}, s2.{//title=>outer} FROM {https://seqr.link} as s1 JOIN {https://vetshares.com} as s2`,
//         DB
//     )
//     d(await domsql.run())
//})
















;(async () => {

   	let idx = PROJECT + ''
	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')
	let storage = window.localStorage
    let btn = document.createElement('a')
        btn.href = '#' + idx
        btn.classList.add('fas')
        btn.classList.add('fa-spider')

    let sec = document.createElement('section')
        sec.id = idx

    let stored = JSON.parse(storage.getItem('domsql_0'))

        cnt.appendChild(sec)
        nav.appendChild(btn)

    let SQL, DB, editorSql, editorCb, editorCss, editorWeb, editorRes

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.1/sql-wasm.js', async () => { })

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
        }
	`)

    loadCss(`
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

    let alert = showAlertTabs(sec,['Sql','Js','Css','Results','Table'],false)
        alert.classList.add('domsql')
    let alertTitle = alert.querySelector('.alertHead')
    let alertBody = alert.querySelector('.alertBody')

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

    let btnRun = document.createElement('input')
        btnRun.type = 'button'
        btnRun.value = 'Run query'
        alert.appendChild(btnRun)

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js', () => {

        editorSql = ace.edit('editorSql',{ mode:'ace/mode/text',  fontSize: "1.5vh" /* theme:'ace/theme/dracula'*/ })
        editorJs  = ace.edit('editorJs', { mode:'ace/mode/javascript',  fontSize: "1.5vh" })
        editorCss = ace.edit('editorCss',{ mode:'ace/mode/css',  fontSize: "1.5vh"})
        editorRes = ace.edit('editorRes',{ mode:'ace/mode/json',  fontSize: "1.5vh"})

        if(typeof stored.sql !== 'undefined') editorSql.setValue(stored.sql, -1)
        if(typeof stored.js  !== 'undefined') editorJs .setValue(stored.js , -1)
        if(typeof stored.css !== 'undefined') editorCss.setValue(stored.css, -1)
    })

    let btnClick = async e => {

        storage.setItem('domsql_0',JSON.stringify({
            sql:editorSql.getValue(),
            js:editorJs.getValue(),
            css:editorCss.getValue(),
        }))
        let domsql = new DomSQL(
            editorSql.getValue(),
            new (await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` })).Database())
        let res = await domsql.run()

        let tabs = Array(res.length)
            tabs.fill('*')
        let results = showAlertTabs(sec, tabs, false)
            // if(results.previousElementSibling) results.parentNode.insertBefore(results, results.previousElementSibling) // Move up
            if(results.nextElementSibling) results.parentNode.insertBefore(results.nextElementSibling, results) // Move down
        let resClose = document.createElement('input')
            resClose.type = 'button'
            resClose.value = 'Close'
            resClose.addEventListener('pointerdown', e => results.remove(), false)
            results.appendChild(resClose)

        res.map( (result, i) => {
                let title = results.querySelector('.tabList_' + i)
                    title.innerText = (i + 1)
                let contents = results.querySelector('.tabContent_' + i)
                    contents.innerHTML = ''
                let weblet = domsql.weblet(result, editorCss.getValue(), editorJs .getValue())
                    weblet.style.border = '0px solid red'
                    weblet.style.width = '100%'
                    weblet.style.height = '40vh'
                contents.appendChild(weblet)
        })
        editorRes.setValue(JSON.stringify(res, null, 4), -1)
    }

    btnRun.addEventListener('pointerdown', btnClick, false)

})()

/*

 SELECT
  s2.{//title=>text} as title,
  s2.{//*[@class='wfWrapper']=>text} as Weather
  FROM
   {https://www.sinoptik.bg/sofia-bulgaria-100727011/hourly} as s2;

SELECT strftime('%s','now') as now

*/
