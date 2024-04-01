import './App.css'
import HomePage from './components/home/HomePage';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LoginRegisterPage from './views/Login-register-page/LoginRegisterPage'
import { DatePickerDemo } from './components/ui/datepicker'

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
            <Route path={'/Date'} element={
                <DatePickerDemo/>
            }>
            </Route>
        </Routes>
    </Router>
  )
}

export default App
