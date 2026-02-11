import React from 'react'
import { Route , Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify';
import About from './components/About'
import MainLayout from './Layouts/LayoutMain'
import StudentDashboard from './components/StudentDasboard'
import ScholarshipApplication from './components/ScholarshipApplication'
import Sidebar from './components/Sidebar'
import ViewDocuments from './components/ViewDocuments'
import UploadDocs from './components/UploadDocs'
import LandingPage from './components/LandingPage'

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route element = {<MainLayout/>}>
        <Route path='/' element={<Home/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/dashboard' element={<StudentDashboard/>} />
        <Route path='/view-docs' element={<ViewDocuments/>} />
        <Route path='/upload-docs' element={<UploadDocs/>} />
        </Route>
        <Route path='/scholarship-application' element={<ScholarshipApplication/>}/> {/* not done */}
        <Route path='/login' element={<Login/>} />
        <Route path='/email-verify' element={<EmailVerify/>} />
        <Route path='/reset-password' element={<ResetPassword/>} />
        <Route path='/sidebar' element={<Sidebar/>} />
        <Route path='/landing' element={<LandingPage/>} />
        <Route path='/signup' element={<Login/>} />

      </Routes>
    </div>
  )
}

export default App
