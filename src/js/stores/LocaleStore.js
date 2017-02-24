import { addLocaleData, IntlProvider, FormattedMessage } from 'react-intl'
import enLocaleData from 'react-intl/locale-data/en'
import frLocaleData from 'react-intl/locale-data/fr'
import * as ScomConstants from '../constants/ScomConstants'
import AScomStore from './AScomStore'
import scomAppDispatcherInstance from '../dispatcher/ScomAppDispatcher'
import config from '../../../config/config.json'
import enUS from '../../intl/en-US.json'
import frFR from '../../intl/fr-FR.json'

addLocaleData(enLocaleData)
addLocaleData(frLocaleData)

/**
 * Add here the new locales
 * that we support. Two actions are needed
 *  - addLocaleData
 *  - new json file to load
 */
class LocaleStore extends AScomStore {

    constructor(scomAppDispatcher) {
        super(scomAppDispatcher)
        console.log('constructor ' + ScomConstants.default_locale)
        this.locale = ScomConstants.default_locale
    }

    onAction(action) {
        console.log('LocaleStore onAction')
        console.log(action)
        switch(action.action) {
            case ScomConstants.locale_change:
                this.locale = action.locale
                super.emitChange()
                break
            default:
                break
        }
    }

    getLocale() {
        return this.locale
    }

    flatten(inEntries){
        let keys = Object.keys(inEntries)
        let result = []
        for(let idx in keys){
            let k = keys[idx]
            let value = inEntries[k]
            if(typeof value === 'string'){

                // end of recursion
                let entry = {}
                entry.key = k
                entry.value = value
                result.push(entry)
            } else if(typeof value === 'object'){

                // This is still an object
                let outEntries = this.flatten(value)

                for(let outEntryIdx in outEntries){
                    let outEntry = outEntries[outEntryIdx]
                    let data = {}
                    data.key = k + '.' + outEntry.key
                    data.value = outEntry.value
                    result.push(data)
                }
            }
        }
        return result
    }

    toJson(entries){
        let result = {}
        for(let entryIdx in entries){
            let entry = entries[entryIdx]
            result[entry.key] = entry.value
        }
        return result
    }

    load(){

        // TODO Improve the way locale data
        // is loaded in the client
        console.log('load')
        this.localeData = {
            'en-US' : this.toJson(this.flatten(enUS)),
            'fr-FR' : this.toJson(this.flatten(frFR))
        }
    }

    getLocaleData(){
        return this.localeData
    }

}

const instance = new LocaleStore(scomAppDispatcherInstance)
instance.load()
export default instance
