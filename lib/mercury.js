
class Mercury {

  constructor() {
    this._root = document.createElement('mercury')
    this._subscriptions = []
    this._root.value = null
    this._el = []
  }

  push(el){
    el.mercury = {
        name: el.getAttribute('mercury'),
        into: el.hasAttribute('value') ? 'value' : 'textContent'
    }
    this.observe(el)
    this._el.push(el)
  }

  observe(el){
     const ReactorObserver = new MutationObserver(() => this.value = el[el.mercury.into] )
     ReactorObserver.observe(el, {characterData: true, childList: true, attributes: true});
    el.addEventListener('change', () => this.value = el[el.mercury.into], false)
    el.addEventListener('input', () => this.value = el[el.mercury.into], false)
  }

  subscribe(cb){
     this._subscriptions.push(cb)
  }

  get value() {
    return this._root.value
  }

 /**
  * @param {string} val - Reactive value
  */
  set value(val) {
    val = val + ''
    if( this._root.value === val ) return this.value
    this._root.value = val
    this._el.forEach( el => el[el.mercury.into] = val )
    this._subscriptions.forEach( subscription => { subscription(val) })
  }
}


let sheet = document.createElement('style')
    sheet.innerHTML = "[mercury]{ visibility:hidden }";
    document.head.appendChild(sheet);

const MercuryInit = (doc, cb) => {
    window.onload = (async () => {
        doc.querySelectorAll('[mercury]').forEach( el => {
            let name = el.getAttribute('mercury'); if(typeof window[name] === 'undefined'){ window[name] = new Mercury() }
            window[name].push(el)
            el.style.visibility = 'visible'
        })
        cb()
    })
}
