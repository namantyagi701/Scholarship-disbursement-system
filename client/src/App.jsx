import React from 'react'
import { Route , Routes } from 'react-router-dom'
import Home from './pages/Home'
import StudentLogin from './pages/Login/StudentLogin'
import RagLogin from './pages/Login/RagLogin'
import FinanceLogin from './pages/Login/FinanceLogin'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify';
import About from './pages/About'
import MainLayout from './Layouts/LayoutMain'
import StudentDashboard from './pages/StudentDasboard' // Note: actual filename has typo
import ScholarshipApplication from './pages/ScholarshipApplication'

import ViewDocuments from './pages/ViewDocuments'
import UploadDocs from './pages/UploadDocs'
import LandingPage from './pages/LandingPage'
import ApplicationStatus from './pages/ApplicationStatus'
import Profile from './pages/Profile'

// SAG pages
import SagApplications from './pages/sag/SagApplications'
import SagApplicationDetail from './pages/sag/SagApplicationDetail'

// Finance pages
import FinanceApproved from './pages/finance/FinanceApproved'
import FinancePaymentHistory from './pages/finance/FinancePaymentHistory'

// Admin pages
import AdminCreateUser from './pages/admin/AdminCreateUser'
import AdminUsers from './pages/admin/AdminUsers'

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route element = {<MainLayout/>}>
        {/* Common */}
        <Route path='/home' element={<Home/>} />
        
        {/* Student routes */}
        <Route path='/about' element={<About/>} />
        <Route path='/dashboard' element={<StudentDashboard/>} />
        <Route path='/view-docs' element={<ViewDocuments/>} />
        <Route path='/upload-docs' element={<UploadDocs/>} />
        <Route path='/scholarship-application' element={<ScholarshipApplication/>} />
        <Route path='/application-status' element={<ApplicationStatus/>} />
        <Route path='/profile' element={<Profile/>} />
        
        {/* SAG routes */}
        <Route path='/sag/applications' element={<SagApplications/>} />
        <Route path='/sag/application/:id' element={<SagApplicationDetail/>} />
        
        {/* Finance routes */}
        <Route path='/finance/approved' element={<FinanceApproved/>} />
        <Route path='/finance/payment-history' element={<FinancePaymentHistory/>} />
        
        {/* Admin routes */}
        <Route path='/admin/create-user' element={<AdminCreateUser/>} />
        <Route path='/admin/users' element={<AdminUsers/>} />
        </Route>
        <Route path='/login/student' element={<StudentLogin/>} />
        <Route path='/login/sag' element={<RagLogin/>} />
        <Route path='/login/finance' element={<FinanceLogin/>} />
        <Route path='/email-verify' element={<EmailVerify/>} />
        <Route path='/reset-password' element={<ResetPassword/>} />
        <Route path='/' element={<LandingPage/>} />
        <Route path='/landing' element={<LandingPage/>} />
        <Route path='/signup' element={<StudentLogin/>} />

      </Routes>
    </div>
  )
}

export default App
