import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Status from './pages/Status'
import StatusViewer from './pages/StatusViewer'
import ProtectedRoute from './utils/ProtectedRoute'
import HomePage from './pages/HomePage'

function App() {

  return (
   <div>
    <Routes>
    <Route path = "/signin" element = {<SignIn/>}></Route>
    <Route path = "/signup" element={<SignUp/>}></Route>
      <Route path = "/" 
        element = {
          <ProtectedRoute>
              <HomePage/>
          </ProtectedRoute>
          }
      />
      <Route path = "/status" 
        element = {
            <ProtectedRoute>
                <Status/>
            </ProtectedRoute>
            }
      />
      <Route path = "/status/:userId"
         element = {
            <ProtectedRoute>
                <StatusViewer/>
            </ProtectedRoute>
            }
      />
    </Routes>
   </div>
  )
}

export default App
