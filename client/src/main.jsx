import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store, persistor } from './app/store.js'
import { Toaster } from 'sonner'
import { PersistGate } from 'redux-persist/integration/react'


createRoot(document.getElementById('root')).render(

  // redux store provider
  <Provider store={store}>
    {/* persistor store */}
    <PersistGate loading={null} persistor={persistor} >
      <App />
      <Toaster />
    </PersistGate>
  </Provider>,
)
