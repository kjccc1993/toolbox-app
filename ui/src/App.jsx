import 'bootstrap/dist/css/bootstrap.min.css'
import NavBar from './components/NavBar'
import Home from './pages/home/Home'
import { Container } from 'react-bootstrap'

function App() {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <Container>
        <Home />
      </Container>
    </>
  )
}

export default App
