import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import seekngoLogo from '/favicon.ico'
import './App.css'
import HomePage from './components/home/HomePage';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LoginRegisterPage from './views/Login-register-page/LoginRegisterPage'

function App() {
  return (
    <Router>
        <Routes>
            <Route path={'/'} element={
                <HomePage/>
            }>
            </Route>
            <Route path={'/Register'} element={
                <LoginRegisterPage/>
            }>
            </Route>
        </Routes>
    </Router>
  )
}

export default App
