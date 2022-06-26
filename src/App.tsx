import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from '@/Store'
import ApplicationNavigator from '@/Navigators/Application'
import './Translations'
import { extendTheme, NativeBaseProvider } from 'native-base'
import Ionicons from 'react-native-vector-icons/Ionicons'
import StartupContainer from './Containers/Startup'
import { Config } from './Config'
Ionicons.loadFont()

const customTheme = extendTheme({
  colors: {
    primary: {
      50: Config.APP === 'epayz' ? '#ff5f4e' : '#dcfdff',
      100: Config.APP === 'epayz' ? '#ff5f4e' : '#b7f3f5',
      200: Config.APP === 'epayz' ? '#ff5f4e' : '#8fe9ec',
      300: Config.APP === 'epayz' ? '#ff5f4e' : '#66dfe3',
      400: Config.APP === 'epayz' ? '#ff5f4e' : '#3ed5da',
      500: Config.APP === 'epayz' ? '#B11116' : '#25bcc1',
      600: Config.APP === 'epayz' ? '#b20000' : '#149296',
      700: Config.APP === 'epayz' ? '#ff5f4e' : '#04696c',
      800: Config.APP === 'epayz' ? '#ff5f4e' : '#004041',
      900: Config.APP === 'epayz' ? '#ff5f4e' : '#001717',
    },
    border: '#E7E7E9',
    subText: '#6E6D7A',
    text: '#333333',
    navBackground: Config.APP === 'epayz' ? '#B11116' : '#1c2b4d',
    while: '#ffffff',
  },
})

type CustomThemeType = typeof customTheme

declare module 'native-base' {
  interface ICustomTheme extends CustomThemeType {}
}

const App = () => {
  return (
    <NativeBaseProvider theme={customTheme}>
      <Provider store={store}>
        {/**
         * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
         * and saved to redux.
         * The `loading` prop can be `null` or any react instance to show during loading (e.g. a splash screen),
         * for example `loading={<SplashScreen />}`.
         * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
         */}
        <PersistGate loading={<StartupContainer />} persistor={persistor}>
          <ApplicationNavigator />
        </PersistGate>
      </Provider>
    </NativeBaseProvider>
  )
}

export default App
