import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from '@/Store'
import ApplicationNavigator from '@/Navigators/Application'
import './Translations'
import { extendTheme, NativeBaseProvider } from 'native-base'
import Ionicons from 'react-native-vector-icons/Ionicons'
Ionicons.loadFont()

const App = () => {
  const theme = extendTheme({
    colors: {
      // Add new color
      primary: {
        50: '#dff6f6',
        100: '#b0e8e7',
        200: '#7ed9d9',
        300: '#4bc9cc',
        400: '#25bec3',
        500: '#00b3bc',
        600: '#00a3ab',
        700: '#008e92',
        800: '#037a7c',
        900: '#065753',
      },
      cyan: {
        500: '#1C2B4D',
      },
    },
  })

  return (
    <NativeBaseProvider theme={theme}>
      <Provider store={store}>
        {/**
         * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
         * and saved to redux.
         * The `loading` prop can be `null` or any react instance to show during loading (e.g. a splash screen),
         * for example `loading={<SplashScreen />}`.
         * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
         */}
        <PersistGate loading={null} persistor={persistor}>
          <ApplicationNavigator />
        </PersistGate>
      </Provider>
    </NativeBaseProvider>
  )
}

export default App
