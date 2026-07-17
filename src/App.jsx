import { AppProvider, useApp } from './context/AppContext.jsx'
import HomeScreen from './pages/HomeScreen.jsx'
import DialogScreen from './pages/DialogScreen.jsx'
import ResultScreen from './pages/ResultScreen.jsx'

function Screens() {
  const { screen } = useApp()

  return (
    <div className="app-shell">
      {screen === 'home' && <HomeScreen />}
      {screen === 'dialog' && <DialogScreen />}
      {screen === 'result' && <ResultScreen />}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Screens />
    </AppProvider>
  )
}