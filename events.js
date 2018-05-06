/* 
    Events 
        $on
        $off
        $emit
        $once
*/
class EventEmitter {
    constructor() {
        this._events = {}
    }

    $on(events, fn) {
        if(Array.isArray(events)) {
            for(let i = 0, l = events.length; i < l; i++) {
                this.$on(events[i], fn)
            }
        }else {
            (this._events[events] || (this._events[events] = [])).push(fn)
        }
        return this
    }

    $emit(event) {
        let cbs = this._events[event]
        if(cbs) {
            let args = Array.prototype.slice.call(arguments, 1)
            for(let i = 0, l = cbs.length; i < l; i++) {
                try {
                    cbs[i].apply(this, args)
                }catch(e) {
                    console.error('Cannot handle the error')
                }
            }
        }
        return this
    }

    $off(events, fn) {
        if(!arguments.length) {
            this._events = Object.create(null)
            return this
        }
        if(Array.isArray(events)) {
            for(let i = 0, l = events.length; i < l; i++) {
                this.$off(events[i], fn)
            }
            return this
        }
        let cbs = this._events[events]
        if(!cbs) {
            return this
        }
        if(!fn) {
            this._events[events] = []
            return this
        }
        if(fn) {
            let cb
            let i = cbs.length
            while(i--) {
                cb = cbs[i]
                if(cb === fn || cb.fn === fn) {
                    cbs.splice(i, 1)
                    break
                }
            }
        }
        return this
    }

    $once(event, fn) {
        function on() {
            this.$off(event, on)
            fn.apply(this, arguments)
        }
        on.fn = fn
        this.$on(event, on)
        return this
    }
}
