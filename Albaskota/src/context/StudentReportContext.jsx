import { createContext, useContext, useState } from 'react';
import { useNotify } from './NotificationContext';

const StudentReportContext = createContext();

export function useStudentReports() {
  return useContext(StudentReportContext);
}

export function StudentReportProvider({ children }) {
  const { notify } = useNotify();
  const [reports, setReports] = useState([
    {
      id: 1,
      studentId: 1,
      studentName: 'John Doe',
      program: 'Computer Science',
      year: 3,
      internshipId: 1,
      internshipTitle: 'Software Development Intern',
      companyName: 'Tech Corp',
      cycleId: 1,
      title: 'Summer 2024 Internship Report',
      introduction: 'During my internship at Tech Corp, I worked on developing a new web application...',
      body: 'The main project I worked on was a customer portal that allowed users to...',
      courses: ['Data Structures', 'Software Engineering', 'Web Development'],
      status: 'submitted', // submitted, flagged, approved, rejected
      submittedDate: '2024-08-15T10:00:00Z',
      reviewerComments: '',
      appealMessage: '',
      evaluation: {
        rating: 4.5,
        recommend: true,
        comments: 'Excellent performance and learning outcomes.'
      }
    },
    {
      id: 2,
      studentId: 2,
      studentName: 'Jane Smith',
      program: 'Information Systems',
      year: 2,
      internshipId: 2,
      internshipTitle: 'Data Science Intern',
      companyName: 'Data Systems',
      cycleId: 2,
      title: 'Winter 2024 Internship Report',
      introduction: 'My internship at Data Systems focused on data analysis and visualization...',
      body: 'I was responsible for analyzing customer data and creating visualizations...',
      courses: ['Database Systems', 'Data Analysis', 'Machine Learning'],
      status: 'flagged',
      submittedDate: '2024-03-15T14:30:00Z',
      reviewerComments: 'Please provide more details about the technical challenges faced and how they were overcome.',
      appealMessage: 'I can provide more technical details about the challenges and solutions.',
      evaluation: {
        rating: 4.0,
        recommend: true,
        comments: 'Good performance, but could improve technical documentation.'
      }
    }
  ]);

  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      program: 'Computer Science',
      year: 3,
      gpa: 3.8,
      status: 'active',
      internshipHistory: [
        {
          id: 1,
          title: 'Software Development Intern',
          company: 'Tech Corp',
          startDate: '2024-06-01',
          endDate: '2024-08-31',
          status: 'completed',
          reportId: 1
        }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      program: 'Information Systems',
      year: 2,
      gpa: 3.9,
      status: 'active',
      internshipHistory: [
        {
          id: 2,
          title: 'Data Science Intern',
          company: 'Data Systems',
          startDate: '2024-01-01',
          endDate: '2024-03-31',
          status: 'completed',
          reportId: 2
        }
      ]
    }
  ]);

  // Report management functions
  const updateReportStatus = (reportId, status, comments = '') => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            status, 
            reviewerComments: comments,
            updatedAt: new Date().toISOString()
          }
        : report
    ));
    notify('success', `Report status updated to ${status}.`);
  };

  const handleAppeal = (reportId, appealMessage) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            appealMessage,
            status: 'flagged',
            updatedAt: new Date().toISOString()
          }
        : report
    ));
    notify('success', 'Appeal submitted successfully.');
  };

  const updateEvaluation = (reportId, evaluation) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            evaluation,
            updatedAt: new Date().toISOString()
          }
        : report
    ));
    notify('success', 'Evaluation updated successfully.');
  };

  // Student management functions
  const updateStudentStatus = (studentId, status) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, status, updatedAt: new Date().toISOString() }
        : student
    ));
    notify('success', `Student status updated to ${status}.`);
  };

  const addStudent = (student) => {
    const newStudent = {
      ...student,
      id: Date.now(),
      status: 'active',
      internshipHistory: [],
      createdAt: new Date().toISOString()
    };
    setStudents(prev => [...prev, newStudent]);
    notify('success', `Student ${student.name} added successfully.`);
  };

  const updateStudent = (studentId, updates) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, ...updates, updatedAt: new Date().toISOString() }
        : student
    ));
    notify('success', 'Student information updated successfully.');
  };

  return (
    <StudentReportContext.Provider value={{
      reports,
      students,
      updateReportStatus,
      handleAppeal,
      updateEvaluation,
      updateStudentStatus,
      addStudent,
      updateStudent
    }}>
      {children}
    </StudentReportContext.Provider>
  );
} 