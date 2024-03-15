import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import seekngoLogo from '/favicon.ico'
import './App.css'
import HomePage from './components/home-page/HomePage';
import Login from './components/Login'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
        <Routes>
        <Route path={'/'} element={
                <HomePage/>
            }>
            </Route>
            <Route path={'/Login'} element={
                <Login/>
            }>
            </Route>
        </Routes>
    </Router>
  )
}

export default App
