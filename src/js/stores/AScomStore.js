import EventEmitter from 'events'
import scomAppDispatcherInstance from '../dispatcher/ScomAppDispatcher'

const CHANGE_EVENT = 'change'

class AScomStore extends EventEmitter{

    constructor(scomAppDispatcher) {
        super()

        this.emitChange = this.emitChange.bind(this)
        this.addChangeListener = this.addChangeListener.bind(this)
        this.removeChangeListener = this.removeChangeListener.bind(this)
        this.onAction = this.onAction.bind(this)

        scomAppDispatcher.register(this.onAction)

    }

    emitChange(){
        this.emit(CHANGE_EVENT)
    }

    addChangeListener(callback){
        this.on(CHANGE_EVENT, callback)
    }

    removeChangeListener(callback){
        this.removeListener(CHANGE_EVENT, callback)
    }

}
export default AScomStore