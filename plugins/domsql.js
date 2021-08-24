
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
        return fetch(source.sanitized,{method:'GET', mode: 'cors'}).then(r => r.text())
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
                            if(x3a){
                                     if(x3a === 'text' ) actualEl = actualEl.innerText
                                else if(x3a === 'html' ) actualEl = actualEl.innerHTML
                                else if(x3a === 'outer') actualEl = actualEl.outerHTML
                            }else{
                                actualEl = actualEl.outerHTML
                            }
                            while (actualEl) {
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
}

loadScript('https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.1/sql-wasm.js', async () => {
    const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` })
    const DB = new SQL.Database() // REQUIRED implementation of .exec method
    let domsql = new DomSQL(
        `SELECT s1.{//title=>text}, s2.{//title=>outer} FROM {https://seqr.link} as s1 JOIN {https://vetshares.com} as s2`,
        DB
    )
    d(await domsql.run())
})
















;(async () => {

   	let idx = PROJECT + ''
	let nav = document.querySelector('nav')
	let cnt = document.querySelector('.container')
	let storage = window.localStorage
    let btn = document.createElement('a')
        btn.href = '#' + idx
        btn.classList.add('fas')
        btn.classList.add('fa-spider')

    let COUNT_WAITS = 0

    let sec = document.createElement('section')
        sec.id = idx

        cnt.appendChild(sec)
        nav.appendChild(btn)

	loadCss(`
        @media (orientation: landscape) {
            section {
                padding-top: 2vh
            }
        }
        @media (orientation: portrait) {
            section {
                padding-top: 8vw
            }
        }
	`)
    let alert = showAlert(sec,{title:'',message:''},false)
        alert.classList.add('someclass')
    let alertTitle = alert.querySelector('.alertHead')
    let alertBody = alert.querySelector('.alertBody')

    let btnClick = e => {
        d(e)
    }
    btn.addEventListener('pointerdown', btnClick, false)


})()

