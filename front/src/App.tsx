import './App.css'
import {SnackbarProvider} from 'notistack'
import Main from './pages/Main'

function App() {

  return (
    <SnackbarProvider>
      <Main />
    </SnackbarProvider>
  )
}

export default App
