import HomePage from './pages/HomePage'
import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Status from './pages/Status'
import StatusViewer from './pages/StatusViewer'

function App() {

  return (
   <div>
    <Routes>
      <Route path = "/" element = {<HomePage/>}></Route>
      <Route path = "/signin" element = {<SignIn/>}></Route>
      <Route path = "/signup" element={<SignUp/>}></Route>
      <Route path = "/status" element = {<Status/>}></Route>
      <Route path = "/status/:userId" element = {<StatusViewer/>}></Route>
    </Routes>
   </div>
  )
}

export default App
