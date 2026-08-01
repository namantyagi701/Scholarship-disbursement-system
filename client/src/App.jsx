import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import StudentLogin from './pages/Login/StudentLogin'
import RagLogin from './pages/Login/RagLogin'
import FinanceLogin from './pages/Login/FinanceLogin'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify';
import About from './pages/About'
import MainLayout from './layouts/LayoutMain'
import StudentDashboard from './pages/student/StudentDashboard'
import ScholarshipApplication from './pages/student/ScholarshipApplication'
import ViewDocuments from './pages/student/ViewDocuments'
import UploadDocs from './pages/student/UploadDocs'
import LandingPage from './pages/LandingPage'
import ApplicationStatus from './pages/student/ApplicationStatus'
import Profile from './pages/student/Profile'

// SAG pages
import SagApplications from './pages/sag/SagApplications'
import SagApplicationDetail from './pages/sag/SagApplicationDetail'

// Finance pages
import FinanceApproved from './pages/finance/FinanceApproved'
import FinancePaymentHistory from './pages/finance/FinancePaymentHistory'

// Admin pages
import AdminCreateUser from './pages/admin/AdminCreateUser'
import AdminUsers from './pages/admin/AdminUsers'

// Route protection
import ProtectedRoute, { PublicOnlyRoute } from './components/ProtectedRoute'

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        {/* ============================================================ */}
        {/* Protected routes — require authentication, wrapped in layout */}
        {/* ============================================================ */}
        <Route element={<MainLayout/>}>

          {/* Common / Student routes — any authenticated user */}
          <Route element={<ProtectedRoute />}>
            <Route path='/home' element={<Home/>} />
            <Route path='/about' element={<About/>} />
            <Route path='/dashboard' element={<StudentDashboard/>} />
            <Route path='/view-docs' element={<ViewDocuments/>} />
            <Route path='/upload-docs' element={<UploadDocs/>} />
            <Route path='/scholarship-application' element={<ScholarshipApplication/>} />
            <Route path='/application-status' element={<ApplicationStatus/>} />
            <Route path='/profile' element={<Profile/>} />
          </Route>

          {/* SAG routes — sag role only */}
          <Route element={<ProtectedRoute allowedRoles={['sag']} />}>
            <Route path='/sag/applications' element={<SagApplications/>} />
            <Route path='/sag/application/:id' element={<SagApplicationDetail/>} />
          </Route>

          {/* Finance routes — finance role only */}
          <Route element={<ProtectedRoute allowedRoles={['finance']} />}>
            <Route path='/finance/approved' element={<FinanceApproved/>} />
            <Route path='/finance/payment-history' element={<FinancePaymentHistory/>} />
          </Route>

          {/* Admin routes — admin role only */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path='/admin/create-user' element={<AdminCreateUser/>} />
            <Route path='/admin/users' element={<AdminUsers/>} />
          </Route>

        </Route>

        {/* ============================================================ */}
        {/* Public-only routes — redirect to /home if already logged in  */}
        {/* ============================================================ */}
        <Route element={<PublicOnlyRoute />}>
          <Route path='/login/student' element={<StudentLogin/>} />
          <Route path='/login/sag' element={<RagLogin/>} />
          <Route path='/login/finance' element={<FinanceLogin/>} />
          <Route path='/' element={<LandingPage/>} />
          <Route path='/landing' element={<LandingPage/>} />
          <Route path='/signup' element={<StudentLogin/>} />
        </Route>

        {/* ============================================================ */}
        {/* Fully public routes — accessible regardless of auth state    */}
        {/* ============================================================ */}
        <Route path='/email-verify' element={<EmailVerify/>} />
        <Route path='/reset-password' element={<ResetPassword/>} />
      </Routes>
    </div>
  )
}

export default App
