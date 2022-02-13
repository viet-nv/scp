import i18n, { ModuleType } from 'i18next'
import { initReactI18next } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as resources from './resources'

const LANGUAGE_DETECTOR = {
  type: 'languageDetector' as ModuleType,
  async: true,
  detect: (callback: any) => {
    AsyncStorage.getItem('user-language', (err, language) => {
      // if error fetching stored data or no language was stored
      // display errors when in DEV mode as console statements
      if (err || !language) {
        if (err) {
          console.log('Error fetching Languages from asyncstorage ', err)
        } else {
          console.log('No language is set, choosing English as fallback')
        }

        callback(language || 'en')
        return
      }
      callback(language)
    })
  },
  init: () => {},
  cacheUserLanguage: (language: string) => {
    AsyncStorage.setItem('user-language', language)
  },
}

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      ...Object.entries(resources).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: {
            translation: value,
          },
        }),
        {},
      ),
    },
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
