import React, { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import MainLayout from './layouts/LayoutMain'
import ProtectedRoute, { PublicOnlyRoute } from './components/ProtectedRoute'
import LoadingScreen from './components/LoadingScreen'

// Eager or lazy routes
const Home = lazy(() => import('./pages/Home'))
const StudentLogin = lazy(() => import('./pages/Login/StudentLogin'))
const RagLogin = lazy(() => import('./pages/Login/RagLogin'))
const FinanceLogin = lazy(() => import('./pages/Login/FinanceLogin'))
const EmailVerify = lazy(() => import('./pages/EmailVerify'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const About = lazy(() => import('./pages/About'))
const LandingPage = lazy(() => import('./pages/LandingPage'))

// Student pages
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'))
const ScholarshipApplication = lazy(() => import('./pages/student/ScholarshipApplication'))
const ViewDocuments = lazy(() => import('./pages/student/ViewDocuments'))
const UploadDocs = lazy(() => import('./pages/student/UploadDocs'))
const ApplicationStatus = lazy(() => import('./pages/student/ApplicationStatus'))
const Profile = lazy(() => import('./pages/student/Profile'))

// SAG pages
const SagApplications = lazy(() => import('./pages/sag/SagApplications'))
const SagApplicationDetail = lazy(() => import('./pages/sag/SagApplicationDetail'))

// Finance pages
const FinanceApproved = lazy(() => import('./pages/finance/FinanceApproved'))
const FinancePaymentHistory = lazy(() => import('./pages/finance/FinancePaymentHistory'))
const FinancePaymentBatches = lazy(() => import('./pages/finance/FinancePaymentBatches'))
const FinanceBatchDetail = lazy(() => import('./pages/finance/FinanceBatchDetail'))

// Admin pages
const AdminCreateUser = lazy(() => import('./pages/admin/AdminCreateUser'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Suspense fallback={<LoadingScreen message="Loading page..." />}>
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
              <Route path='/finance/batches' element={<FinancePaymentBatches/>} />
              <Route path='/finance/batch/:batchId' element={<FinanceBatchDetail/>} />
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
            <Route path='/signup' element={<StudentLogin/>} />
          </Route>

          {/* ============================================================ */}
          {/* Fully public routes — accessible immediately, no blocking    */}
          {/* ============================================================ */}
          <Route path='/' element={<LandingPage/>} />
          <Route path='/landing' element={<LandingPage/>} />
          <Route path='/email-verify' element={<EmailVerify/>} />
          <Route path='/reset-password' element={<ResetPassword/>} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App

