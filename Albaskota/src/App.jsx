import { Route, Routes } from 'react-router-dom';
import { ApplicationProvider } from './context/ApplicationContext';
import { CompanyProvider } from './context/CompanyContext';
import { InternshipProvider } from './context/InternshipContext';
import { InternshipCycleProvider } from './context/InternshipCycleContext';
import { StudentReportProvider } from './context/StudentReportContext';
import { StudentProvider } from './context/StudentContext';
import { NotificationProvider } from './context/NotificationContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterCompany from './pages/auth/RegisterCompany';
import CompanyDashboard from './pages/company/CompanyDashboard';
import CreateInternship from './pages/company/CreateInternship';
import EditInternship from './pages/company/EditInternship';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import ProStudentDashboard from './pages/student/ProStudentDashboard';
import ScadCompanyDetails from './pages/scad/ScadCompanyDetails';
import ScadDashboard from './pages/scad/ScadDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentLayout from './layouts/StudentLayout';

export default function App() {
  return (
    <NotificationProvider>
      <CompanyProvider>
        <InternshipProvider>
          <InternshipCycleProvider>
            <StudentReportProvider>
              <ApplicationProvider>
                <StudentProvider>
                  <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register/company" element={<RegisterCompany />} />
                    
                    {/* Student Routes */}
                    <Route path="/student" element={<StudentLayout />}>
                      <Route path="dashboard" element={<StudentDashboard />} />
                      <Route path="pro-student/dashboard" element={<ProStudentDashboard />} />
                    </Route>

                    {/* Company Routes */}
                    <Route path="/company/dashboard" element={<CompanyDashboard />} />
                    <Route path="/company/create-internship" element={<CreateInternship />} />
                    <Route path="/company/edit-internship/:internshipId" element={<EditInternship />} />

                    {/* SCAD Routes */}
                    <Route path="/scad/dashboard" element={<ScadDashboard />} />
                    <Route path="/scad/company/:companyId" element={<ScadCompanyDetails />} />

                    {/* Faculty Routes */}
                    <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
                  </Routes>
                </StudentProvider>
              </ApplicationProvider>
            </StudentReportProvider>
          </InternshipCycleProvider>
        </InternshipProvider>
      </CompanyProvider>
    </NotificationProvider>
  );
}
