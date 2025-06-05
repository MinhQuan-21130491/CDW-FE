import { Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ProtectedRoute from './utils/ProtectedRoute'
import HomePage from './pages/HomePage'
import { ChangePassword } from './pages/ChangePassword'
import { ForgetPassword } from './pages/ForgetPassword'

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
      
      <Route path = "/change-password"
         element = {
            <ProtectedRoute>
                <ChangePassword/>
            </ProtectedRoute>
            }
      />
      <Route path = "/forget-password"
         element = {
                <ForgetPassword/>
            }
      />
    </Routes>
   </div>
  )
}

export default App
