import './App.css'
import HomePage from './components/home-page/HomePage';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LoginRegisterPage from './views/Login-register-page/RegisterPage'
import LoginPage from './views/Login-register-page/LoginPage';

function App() {
  return (
    // <h1 className='text-xl font-bold text-blue-800'>tailwind tes</h1>
    <Router>
        <Routes>
            <Route path={'/'} element={
                <HomePage/>
            }
            ></Route>
            <Route path={'/Register'} element={
                <LoginRegisterPage/>
            }
            ></Route>
            <Route path={'/Login'} element={
                <LoginPage/>
            }
            ></Route>
        </Routes>
    </Router>
  )
}

export default App
