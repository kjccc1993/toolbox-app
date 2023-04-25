import 'bootstrap/dist/css/bootstrap.min.css'
import NavBar from './components/NavBar'
import Home from './pages/home/Home'
import styles from './app.module.css'

function App() {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <div className={styles.container}>
        <Home />
      </div>
    </>
  )
}

export default App
