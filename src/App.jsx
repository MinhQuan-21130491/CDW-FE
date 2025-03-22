import { useState } from 'react'
import HomePage from './pages/HomePage'
import { Route, Routes } from 'react-router-dom'
import Status from './pages/Status'
import StatusViewer from './pages/StatusViewer'
import SignIn from './pages/SignIn'
import Register from './pages/Register'


function App() {

  return (
   <div>
    <Routes>
      <Route path = "/" element = {<HomePage/>}></Route>
  
    </Routes>
   </div>
  )
}

export default App
