import { useState } from 'react'
import HomePage from './pages/HomePage'
import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'



function App() {

  return (
   <div>
    <Routes>
      <Route path = "/" element = {<HomePage/>}></Route>
      <Route path = "/signin" element = {<SignIn/>}></Route>
      <Route path = "/signup" element={<SignUp/>}></Route>
    </Routes>
   </div>
  )
}

export default App
