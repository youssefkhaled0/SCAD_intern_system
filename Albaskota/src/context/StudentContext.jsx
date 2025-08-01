import { createContext, useContext, useState } from 'react';

const StudentContext = createContext();

export function StudentProvider({ children }) {
  // Mock data for student profile
  const [studentProfile, setStudentProfile] = useState({
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    major: 'Computer Science',
    semester: 6,
    jobInterests: 'Software Development, Web Development, AI/ML',
    previousExperience: 'Summer Intern at Tech Corp (2023)',
    collegeActivities: 'Computer Science Club, Hackathon Organizer'
  });

  // Mock data for reports
  const [reports, setReports] = useState([
    {
      id: 1,
      internshipId: 1,
      title: 'Summer 2023 Internship Report',
      introduction: 'During my internship at Tech Corp, I worked on developing a new web application...',
      body: 'The main project I worked on was a customer portal that allowed users to...',
      courses: ['Data Structures', 'Software Engineering', 'Web Development'],
      status: 'accepted',
      submittedDate: '2023-09-01',
      reviewerComments: '',
      appealMessage: ''
    },
    {
      id: 2,
      internshipId: 2,
      title: 'Winter 2024 Internship Report',
      introduction: 'My internship at Data Systems focused on data analysis and visualization...',
      body: 'I was responsible for analyzing customer data and creating visualizations...',
      courses: ['Database Systems', 'Data Analysis', 'Machine Learning'],
      status: 'flagged',
      submittedDate: '2024-02-15',
      reviewerComments: 'Please provide more details about the technical challenges faced and how they were overcome.',
      appealMessage: 'I can provide more technical details about the challenges and solutions.'
    },
    {
      id: 3,
      internshipId: 3,
      title: 'Spring 2024 Internship Report',
      introduction: 'At Web Solutions, I worked on frontend development...',
      body: 'The project involved creating responsive web interfaces...',
      courses: ['Web Development', 'UI/UX Design', 'JavaScript'],
      status: 'rejected',
      submittedDate: '2024-04-01',
      reviewerComments: 'The report lacks sufficient technical depth and implementation details.',
      appealMessage: 'I will revise the report to include more technical implementation details.'
    }
  ]);

  // Mock data for evaluations
  const [evaluations, setEvaluations] = useState([
    {
      id: 1,
      internshipId: 1,
      companyId: 1,
      rating: 5,
      recommend: true,
      comments: 'Great learning environment with supportive mentors. The projects were challenging and educational.',
      status: 'submitted',
      submittedDate: '2023-09-01'
    },
    {
      id: 2,
      internshipId: 2,
      companyId: 2,
      rating: 4,
      recommend: true,
      comments: 'Good experience overall. The team was helpful, but the projects could have been more challenging.',
      status: 'draft',
      submittedDate: '2024-02-15'
    }
  ]);

  // Mock data for notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'report_status',
      message: 'Your internship report has been accepted!',
      read: false,
      timestamp: '2023-09-02T10:00:00Z'
    },
    {
      id: 2,
      type: 'report_status',
      message: 'Your internship report has been flagged. Please check the comments.',
      read: false,
      timestamp: '2024-02-16T14:30:00Z'
    },
    {
      id: 3,
      type: 'report_status',
      message: 'Your internship report has been rejected. You can submit an appeal.',
      read: false,
      timestamp: '2024-04-02T09:15:00Z'
    },
    {
      id: 4,
      type: 'application_status',
      message: 'Your application to Tech Corp has been accepted!',
      read: true,
      timestamp: '2023-05-15T11:20:00Z'
    }
  ]);

  // Mock data for internship history
  const [internshipHistory, setInternshipHistory] = useState([
    {
      id: 1,
      title: 'Software Development Intern',
      company: 'Tech Corp',
      startDate: '2023-06-01',
      endDate: '2023-08-31',
      status: 'completed',
      reportId: 1,
      evaluationId: 1
    },
    {
      id: 2,
      title: 'Data Science Intern',
      company: 'Data Systems',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      status: 'completed',
      reportId: 2,
      evaluationId: 2
    },
    {
      id: 3,
      title: 'Frontend Development Intern',
      company: 'Web Solutions',
      startDate: '2024-03-01',
      endDate: null,
      status: 'current',
      reportId: 3,
      evaluationId: null
    }
  ]);

  // PRO Student specific state
  const [isProStudent, setIsProStudent] = useState(true); // For testing PRO features
  const [profileViews, setProfileViews] = useState([
    {
      id: 1,
      companyName: 'Tech Corp',
      viewDate: '2024-03-15T10:30:00Z',
      jobTitle: 'Software Development Intern'
    },
    {
      id: 2,
      companyName: 'Data Systems',
      viewDate: '2024-03-14T15:45:00Z',
      jobTitle: 'Data Science Intern'
    }
  ]);

  const [onlineAssessments, setOnlineAssessments] = useState([
    {
      id: 1,
      title: 'Technical Skills Assessment',
      description: 'Test your programming and problem-solving skills',
      score: 85,
      isPublic: true,
      completedDate: '2024-03-10T14:00:00Z'
    },
    {
      id: 2,
      title: 'Soft Skills Assessment',
      description: 'Evaluate your communication and teamwork abilities',
      score: 90,
      isPublic: false,
      completedDate: '2024-03-12T11:30:00Z'
    }
  ]);

  const [workshops, setWorkshops] = useState([
    {
      id: 1,
      title: 'Career Development Workshop',
      description: 'Learn how to build your professional brand',
      startDate: '2024-04-01T10:00:00Z',
      endDate: '2024-04-01T12:00:00Z',
      speaker: 'Jane Smith',
      speakerBio: 'Career Coach with 10+ years of experience',
      agenda: ['Building your brand', 'Networking tips', 'Interview preparation'],
      isRegistered: true,
      isLive: false,
      notes: '',
      rating: null,
      feedback: ''
    },
    {
      id: 2,
      title: 'Technical Interview Preparation',
      description: 'Master the art of technical interviews',
      startDate: '2024-04-05T14:00:00Z',
      endDate: '2024-04-05T16:00:00Z',
      speaker: 'John Doe',
      speakerBio: 'Senior Software Engineer at Tech Corp',
      agenda: ['Common interview questions', 'Problem-solving strategies', 'System design basics'],
      isRegistered: false,
      isLive: false,
      notes: '',
      rating: null,
      feedback: ''
    }
  ]);

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      type: 'career_guidance',
      date: '2024-04-02T15:00:00Z',
      status: 'pending',
      notes: 'Discuss career path in software development'
    }
  ]);

  // Update profile function
  const updateProfile = (newProfile) => {
    setStudentProfile(prev => ({ ...prev, ...newProfile }));
  };

  // Add report function
  const addReport = (report) => {
    setReports(prev => [...prev, { ...report, id: Date.now() }]);
  };

  // Update report function
  const updateReport = (reportId, updates) => {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, ...updates } : report
    ));
  };

  // Add evaluation function
  const addEvaluation = (evaluation) => {
    setEvaluations(prev => [...prev, { ...evaluation, id: Date.now() }]);
  };

  // Update evaluation function
  const updateEvaluation = (evaluationId, updates) => {
    setEvaluations(prev => prev.map(evaluation => 
      evaluation.id === evaluationId ? { ...evaluation, ...updates } : evaluation
    ));
  };

  // Add notification function
  const addNotification = (notification) => {
    setNotifications(prev => [...prev, { ...notification, id: Date.now() }]);
  };

  // Mark notification as read function
  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    ));
  };

  // Mark all notifications as read function
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  // PRO Student specific functions
  const toggleAssessmentVisibility = (assessmentId) => {
    setOnlineAssessments(prev => prev.map(assessment =>
      assessment.id === assessmentId 
        ? { ...assessment, isPublic: !assessment.isPublic }
        : assessment
    ));
  };

  const registerForWorkshop = (workshopId) => {
    setWorkshops(prev => prev.map(workshop =>
      workshop.id === workshopId
        ? { ...workshop, isRegistered: true }
        : workshop
    ));
    addNotification({
      type: 'workshop_registration',
      message: `You have registered for the workshop: ${workshops.find(w => w.id === workshopId)?.title}`,
      read: false,
      timestamp: new Date().toISOString()
    });
  };

  const updateWorkshopNotes = (workshopId, notes) => {
    setWorkshops(prev => prev.map(workshop =>
      workshop.id === workshopId
        ? { ...workshop, notes }
        : workshop
    ));
  };

  const rateWorkshop = (workshopId, rating, feedback) => {
    setWorkshops(prev => prev.map(workshop =>
      workshop.id === workshopId
        ? { ...workshop, rating, feedback }
        : workshop
    ));
  };

  const requestAppointment = (appointment) => {
    setAppointments(prev => [...prev, { ...appointment, id: Date.now(), status: 'pending' }]);
    addNotification({
      type: 'appointment_request',
      message: 'Your appointment request has been sent',
      read: false,
      timestamp: new Date().toISOString()
    });
  };

  const updateAppointmentStatus = (appointmentId, status) => {
    setAppointments(prev => prev.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, status }
        : appointment
    ));
    addNotification({
      type: 'appointment_status',
      message: `Your appointment has been ${status}`,
      read: false,
      timestamp: new Date().toISOString()
    });
  };

  // Add login function for student
  const login = (profile) => {
    setStudentProfile(prev => ({ ...prev, ...profile }));
    if (profile.isProStudent) {
      setIsProStudent(true);
    } else {
      setIsProStudent(false);
    }
  };

  const value = {
    studentProfile,
    updateProfile,
    reports,
    addReport,
    updateReport,
    evaluations,
    addEvaluation,
    updateEvaluation,
    notifications,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    internshipHistory,
    isProStudent,
    profileViews,
    onlineAssessments,
    workshops,
    appointments,
    toggleAssessmentVisibility,
    registerForWorkshop,
    updateWorkshopNotes,
    rateWorkshop,
    requestAppointment,
    updateAppointmentStatus,
    login
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
} 