import React, { useState, useRef, useEffect } from 'react';
import { useStudent } from '../../context/StudentContext';
import { 
  FaVideo, FaMicrophone, FaDesktop, FaTimes, FaBell, FaCheck, 
  FaTimes as FaX, FaEye, FaChartBar, FaGraduationCap, FaCalendarAlt,
  FaStar, FaRegStar, FaStarHalfAlt, FaDownload, FaEdit, FaTrash,
  FaChevronRight, FaChevronLeft, FaSearch, FaFilter, FaMedal, FaCircle, FaPaperPlane, FaBuilding,
  FaUser, FaBriefcase, FaUniversity, FaPlus, FaMoneyBillWave, FaClock, FaIndustry, FaUpload, FaFileAlt, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaThumbsUp,
  FaArrowLeft
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'; 

// Add internship cycles data
const internshipCycles = [
  {
    id: 1,
    name: "Spring 2024 Internship Cycle",
    startDate: "2024-01-15",
    applicationDeadline: "2024-02-15",
    endDate: "2024-06-15",
    status: "active"
  },
  {
    id: 2,
    name: "Summer 2024 Internship Cycle",
    startDate: "2024-05-15",
    applicationDeadline: "2024-06-15",
    endDate: "2024-09-15",
    status: "upcoming"
  }
];

const defaultSuggestedCompanies = [
  {
    id: 1,
    name: "Tech Innovators Inc.",
    industry: "Software Development",
    matchScore: 95,
    jobInterests: ["Full Stack Development", "Cloud Computing", "AI/ML"],
    recommendations: [
      { rating: 4.8, comment: "Great learning environment for interns!" },
      { rating: 4.5, comment: "Excellent mentorship program" }
    ]
  },
  {
    id: 2,
    name: "Data Analytics Pro",
    industry: "Data Science",
    matchScore: 88,
    jobInterests: ["Data Analysis", "Business Intelligence", "Machine Learning"],
    recommendations: [
      { rating: 4.7, comment: "Strong focus on professional development" },
      { rating: 4.6, comment: "Challenging projects with great support" }
    ]
  },
  {
    id: 3,
    name: "Cloud Solutions Hub",
    industry: "Cloud Computing",
    matchScore: 85,
    jobInterests: ["Cloud Architecture", "DevOps", "System Administration"],
    recommendations: [
      { rating: 4.4, comment: "Cutting-edge cloud technologies" },
      { rating: 4.3, comment: "Good work-life balance" }
    ]
  }
];

const defaultMajors = [
  {
    id: 1,
    name: "Computer Science",
    description: "Study of computation, automation, and information management",
    totalSemesters: 8,
    specializations: ["AI/ML", "Software Engineering", "Cybersecurity"],
    courseLoad: "Heavy",
    careerPaths: ["Software Developer", "Data Scientist", "Systems Architect"]
  },
  {
    id: 2,
    name: "Information Systems",
    description: "Integration of technology, people, and business processes",
    totalSemesters: 8,
    specializations: ["Business Analytics", "Digital Innovation", "IT Management"],
    courseLoad: "Moderate",
    careerPaths: ["Business Analyst", "IT Consultant", "Project Manager"]
  },
  {
    id: 3,
    name: "Computer Engineering",
    description: "Hardware and software systems design and implementation",
    totalSemesters: 8,
    specializations: ["Embedded Systems", "Computer Architecture", "IoT"],
    courseLoad: "Heavy",
    careerPaths: ["Hardware Engineer", "Systems Engineer", "IoT Developer"]
  }
];

const defaultInternships = [
  {
    id: 1,
    companyName: "Tech Solutions Inc.",
    jobTitle: "Frontend Developer Intern",
    duration: "6 months",
    industry: "Software Development",
    isPaid: true,
    salary: "$20/hour",
    location: "New York, NY",
    type: "Full-time",
    skills: ["React", "JavaScript", "HTML/CSS", "Git"],
    description: "Join our team as a Frontend Developer Intern and work on cutting-edge web applications...",
    requirements: ["Currently enrolled in Computer Science or related field", "Strong JavaScript skills", "Experience with React"],
    responsibilities: [
      "Develop and maintain web applications",
      "Collaborate with senior developers",
      "Participate in code reviews"
    ]
  },
  {
    id: 2,
    companyName: "Data Analytics Pro",
    jobTitle: "Data Science Intern",
    duration: "3 months",
    industry: "Data Science",
    isPaid: true,
    salary: "$25/hour",
    location: "Remote",
    type: "Part-time",
    skills: ["Python", "SQL", "Machine Learning", "Data Visualization"],
    description: "Looking for a passionate Data Science Intern to join our analytics team...",
    requirements: ["Strong analytical skills", "Python programming", "Statistics background"],
    responsibilities: [
      "Analyze large datasets",
      "Build predictive models",
      "Create data visualizations"
    ]
  }
];

const defaultApplications = [
  {
    id: 1,
    internshipId: 1,
    status: "pending",
    appliedDate: "2024-03-15",
    documents: [
      { name: "CV.pdf", type: "cv" },
      { name: "CoverLetter.pdf", type: "coverLetter" }
    ]
  }
];

// Add this near the other default data at the top
const defaultMyInternships = [
  {
    id: 1,
    companyName: "Tech Solutions Inc.",
    jobTitle: "Frontend Developer Intern",
    startDate: "2023-06-01",
    endDate: "2023-12-01",
    status: "completed",
    description: "Developed and maintained web applications using React and TypeScript",
    achievements: [
      "Improved application performance by 40%",
      "Implemented 5 major features",
      "Collaborated with 3 development teams"
    ],
    skills: ["React", "TypeScript", "Git"],
    supervisor: {
      name: "John Smith",
      position: "Senior Developer",
      contact: "john.smith@techsolutions.com"
    },
    feedback: {
      rating: 4.5,
      comments: "Excellent work ethic and quick learner"
    }
  },
  {
    id: 2,
    companyName: "Data Analytics Pro",
    jobTitle: "Data Science Intern",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    status: "current",
    description: "Working on machine learning models and data analysis",
    achievements: [
      "Developed predictive model with 90% accuracy",
      "Automated data processing pipeline"
    ],
    skills: ["Python", "Machine Learning", "SQL"],
    supervisor: {
      name: "Sarah Johnson",
      position: "Data Science Lead",
      contact: "sarah.j@dataanalytics.com"
    }
  }
];

// Add these near the other default data
const defaultCourses = {
  "Computer Science": [
    { id: 1, code: "CS101", name: "Introduction to Programming", description: "Basic programming concepts and algorithms" },
    { id: 2, code: "CS201", name: "Data Structures", description: "Advanced data structures and algorithms" },
    { id: 3, code: "CS301", name: "Database Systems", description: "Database design and management" },
    { id: 4, code: "CS401", name: "Software Engineering", description: "Software development lifecycle" }
  ],
  "Information Systems": [
    { id: 5, code: "IS101", name: "Information Systems Fundamentals", description: "Basic concepts of IS" },
    { id: 6, code: "IS201", name: "System Analysis", description: "System analysis and design" }
  ]
};

const defaultEvaluations = [
  {
    id: 1,
    companyId: 1,
    companyName: "Tech Solutions Inc.",
    rating: 4.5,
    strengths: ["Great mentorship", "Modern tech stack", "Work-life balance"],
    weaknesses: ["Limited remote work options"],
    recommendation: true,
    details: "Excellent learning environment for interns...",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  }
];

const defaultReports = [
  {
    id: 1,
    internshipId: 1,
    title: "Frontend Development Internship Experience",
    introduction: "During my six-month internship at Tech Solutions Inc...",
    body: "Throughout the internship, I worked on several key projects...",
    status: "draft", // draft, submitted, approved
    helpfulCourses: [1, 2, 4], // Course IDs
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    attachments: []
  }
];

export default function ProStudentDashboard() {
  const navigate = useNavigate();
  const { student } = useStudent();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(null);
  const [upcomingCycle, setUpcomingCycle] = useState(null);

  const defaultProfile = {
    name: '',
    email: '',
    major: '',
    semester: 1,
    jobInterests: {
      industries: [],
      roles: [],
      preferredLocations: []
    },
    skills: [],
    previousExperience: [],
    collegeActivities: []
  };

  // Add documents state at component level
  const [applicationDocuments, setApplicationDocuments] = useState({
    cv: null,
    coverLetter: null,
    certificates: []
  });

  const {
    studentProfile: rawStudentProfile,
    updateProfile,
    isProStudent,
    profileViews,
    onlineAssessments,
    workshops,
    appointments,
    suggestedCompanies,
    toggleAssessmentVisibility,
    registerForWorkshop,
    updateWorkshopNotes,
    rateWorkshop,
    requestAppointment,
    updateAppointmentStatus,
    majors,
    updateMajorAndSemester
  } = useStudent();

  // Merge default values with actual profile
  const studentProfile = { ...defaultProfile, ...(rawStudentProfile || {}) };

  const crumbs = [
   { label: "Home", to: "/" },
   { label: "Pro Student Dashboard"},
  
 ];
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callSettings, setCallSettings] = useState({
    video: true,
    audio: true,
    screen: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [onlineAppointments, setOnlineAppointments] = useState([1]); // Simulate appointment id 1 as online
  const [showWorkshopModal, setShowWorkshopModal] = useState(false);
  const [workshopModalData, setWorkshopModalData] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Alice', message: 'Welcome to the workshop!', timestamp: new Date().toLocaleTimeString() },
    { id: 2, sender: 'You', message: 'Excited to be here!', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showChatNotification, setShowChatNotification] = useState(false);
  const videoRef = useRef(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [showMajorModal, setShowMajorModal] = useState(false);
  const [localSuggestedCompanies, setLocalSuggestedCompanies] = useState(defaultSuggestedCompanies);
  const [localMajors, setLocalMajors] = useState(defaultMajors);
  const [selectedMajor, setSelectedMajor] = useState(studentProfile?.major || '');
  const [selectedSemester, setSelectedSemester] = useState(studentProfile?.semester || 1);
  const [showMajorDetails, setShowMajorDetails] = useState(null);
  const [internships, setInternships] = useState(defaultInternships);
  const [filteredInternships, setFilteredInternships] = useState(defaultInternships);
  const [applications, setApplications] = useState(defaultApplications);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showInternshipModal, setShowInternshipModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [filters, setFilters] = useState({
    industry: '',
    duration: '',
    isPaid: '',
    type: ''
  });
  // Add these new state variables
  const [myInternships, setMyInternships] = useState(defaultMyInternships);
  const [internshipSearchTerm, setInternshipSearchTerm] = useState('');
  const [internshipStatusFilter, setInternshipStatusFilter] = useState('all');
  const [selectedInternshipDetails, setSelectedInternshipDetails] = useState(null);
  const [showInternshipDetailsModal, setShowInternshipDetailsModal] = useState(false);
  const [internshipDateFilter, setInternshipDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  // Add these new state variables
  const [evaluations, setEvaluations] = useState(defaultEvaluations);
  const [reports, setReports] = useState(defaultReports);
  const [courses, setCourses] = useState(defaultCourses);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [reportStatus, setReportStatus] = useState('draft');

  // Profile Form State
  const [profileFormData, setProfileFormData] = useState({
    name: studentProfile?.name || '',
    email: studentProfile?.email || '',
    major: studentProfile?.major || '',
    semester: studentProfile?.semester || 1,
    industries: studentProfile?.jobInterests?.industries?.join(', ') || '',
    roles: studentProfile?.jobInterests?.roles?.join(', ') || '',
    locations: studentProfile?.jobInterests?.preferredLocations?.join(', ') || '',
    skills: studentProfile?.skills?.join(', ') || ''
  });

  // Update profile form data when student profile changes
  useEffect(() => {
    if (studentProfile) {
      setProfileFormData({
        name: studentProfile.name || '',
        email: studentProfile.email || '',
        major: studentProfile.major || '',
        semester: studentProfile.semester || 1,
        industries: studentProfile.jobInterests?.industries?.join(', ') || '',
        roles: studentProfile.jobInterests?.roles?.join(', ') || '',
        locations: studentProfile.jobInterests?.preferredLocations?.join(', ') || '',
        skills: studentProfile.skills?.join(', ') || ''
      });
    }
  }, [studentProfile]);

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const updates = {
      name: profileFormData.name,
      email: profileFormData.email,
      major: profileFormData.major,
      semester: parseInt(profileFormData.semester),
      jobInterests: {
        industries: profileFormData.industries.split(',').map(item => item.trim()).filter(Boolean),
        roles: profileFormData.roles.split(',').map(item => item.trim()).filter(Boolean),
        preferredLocations: profileFormData.locations.split(',').map(item => item.trim()).filter(Boolean)
      },
      skills: profileFormData.skills.split(',').map(item => item.trim()).filter(Boolean)
    };
    updateProfile(updates);
    setShowProfileModal(false);
  };

  // Add notification check effect
  useEffect(() => {
    checkInternshipCycles();
  }, []);

  const checkInternshipCycles = () => {
    const now = new Date();
    
    // Check for active cycle
    const active = internshipCycles.find(cycle => {
      const startDate = new Date(cycle.startDate);
      const endDate = new Date(cycle.endDate);
      return now >= startDate && now <= endDate;
    });

    // Check for upcoming cycle
    const upcoming = internshipCycles.find(cycle => {
      const startDate = new Date(cycle.startDate);
      const thirtyDaysFromNow = new Date(now);
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return startDate > now && startDate <= thirtyDaysFromNow;
    });

    if (active) {
      addNotification({
        id: 'active-cycle',
        type: 'success',
        message: `The ${active.name} is now active! Application deadline: ${new Date(active.applicationDeadline).toLocaleDateString()}`,
        link: 'internships'
      });
    }

    if (upcoming) {
      const daysUntilStart = Math.ceil((new Date(upcoming.startDate) - now) / (1000 * 60 * 60 * 24));
      addNotification({
        id: 'upcoming-cycle',
        type: 'info',
        message: `${upcoming.name} begins in ${daysUntilStart} days! Get your documents ready.`,
        link: 'profile'
      });
    }
  };

  const addNotification = (notification) => {
    setNotifications(prev => [...prev, notification]);
    setShowNotification(true);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Add this before the return statement
  const renderNotifications = () => {
    if (!showNotification || notifications.length === 0) return null;

    return (
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`flex items-center p-4 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-50' : 'bg-blue-50'
            } max-w-md`}
          >
            <div className="flex-1">
              <p className={`text-sm ${
                notification.type === 'success' ? 'text-green-800' : 'text-blue-800'
              }`}>
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => {
                removeNotification(notification.id);
                if (notification.link) {
                  setActiveTab(notification.link);
                }
              }}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    );
  };

  // Simulate incoming call notification
  const simulateIncomingCall = () => {
    setIncomingCall(true);
    setTimeout(() => {
      setIncomingCall(false);
    }, 10000); // auto-dismiss after 10s
  };

  // PRO Badge
  const renderProBadge = () => (
    isProStudent && (
      <div className="flex items-center space-x-2 mb-4">
        <FaMedal className="text-yellow-400 text-2xl" />
        <span className="font-bold text-yellow-700 text-lg">PRO Student</span>
      </div>
    )
  );

  // Informational Video Modal
  const renderVideoModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full relative">
        <button
          onClick={() => setShowVideoModal(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">What Counts as an Internship?</h2>
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <iframe
            width="100%"
            height="315"
            src={internshipVideos[studentProfile.major] || internshipVideos['Computer Science']}
            title="Internship Requirements"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <p className="text-gray-700">This video explains what kinds of internships count towards your requirement for the {studentProfile.major} major.</p>
      </div>
    </div>
  );

  // Incoming Call Notification
  const renderIncomingCall = () => (
    incomingCall && (
      <div className="fixed bottom-8 right-8 bg-white border border-blue-500 shadow-lg rounded-lg p-4 z-50 flex items-center space-x-4">
        <FaVideo className="text-blue-500 text-2xl animate-pulse" />
        <div>
          <div className="font-semibold">Incoming Call</div>
          <div className="text-gray-600 text-sm">Career Guidance Session</div>
        </div>
        <button
          onClick={() => { setIsCallActive(true); setIncomingCall(false); }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Accept
        </button>
        <button
          onClick={() => setIncomingCall(false)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Reject
        </button>
      </div>
    )
  );

  // Profile Views Section
  const renderProfileViews = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {renderProBadge()}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Profile Views</h2>
          <p className="text-gray-600">Companies that have viewed your profile</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowVideoModal(true)}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold"
          >
            <FaVideo className="inline mr-2" /> Internship Video
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profileViews.map(view => (
          <div key={view.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{view.companyName}</h3>
                <p className="text-blue-600 font-medium">{view.jobTitle}</p>
                <p className="text-sm text-gray-500 mt-2">
                  <FaEye className="inline mr-2" />
                  Viewed on {new Date(view.viewDate).toLocaleDateString()}
                </p>
              </div>
              <button className="text-blue-500 hover:text-blue-700">
                <FaChevronRight />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Online Assessments Section
  const renderAssessments = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Online Assessments</h2>
          <p className="text-gray-600">Track your assessment scores and progress</p>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Take New Assessment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {onlineAssessments.map(assessment => (
          <div key={assessment.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{assessment.title}</h3>
                <p className="text-gray-600 mt-2">{assessment.description}</p>
                <div className="mt-4 flex items-center space-x-4">
                  <div className="flex items-center">
                    <FaChartBar className="text-blue-500 mr-2" />
                    <span className="font-medium">{assessment.score}%</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Completed: {new Date(assessment.completedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <button
                  onClick={() => toggleAssessmentVisibility(assessment.id)}
                  className={`px-4 py-2 rounded-lg ${
                    assessment.isPublic 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-gray-500 hover:bg-gray-600'
                  } text-white transition-colors`}
                >
                  {assessment.isPublic ? 'Public' : 'Private'}
                </button>
                <button className="text-blue-500 hover:text-blue-700">
                  <FaDownload />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Certificate download (mock)
  const handleDownloadCertificate = (workshop) => {
    const certificateText = `Certificate of Attendance\n\nThis is to certify that ${studentProfile.name} attended the workshop: ${workshop.title} on ${new Date(workshop.endDate).toLocaleDateString()}.`;
    const blob = new Blob([certificateText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificate-${workshop.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Live chat send
  const handleSendChat = () => {
    if (chatInput.trim() === '') return;
    setChatMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'You', message: chatInput, timestamp: new Date().toLocaleTimeString() }
    ]);
    setChatInput('');
    // Simulate notification for other attendees
    setShowChatNotification(true);
    setTimeout(() => setShowChatNotification(false), 2000);
  };

  // Workshop Modal (details, join, chat, notes, certificate, video controls)
  const renderWorkshopModal = () => {
    if (!workshopModalData) return null;
    const isLive = workshopModalData.isLive;
    const isRegistered = workshopModalData.isRegistered;
    const hasEnded = new Date(workshopModalData.endDate) < new Date();
    const isPreRecorded = !isLive && hasEnded;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-4 max-w-lg w-full relative">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-lg font-bold">{workshopModalData.title}</h2>
            <button
              onClick={() => setShowWorkshopModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          <div className="text-sm space-y-2 mb-3">
            <div className="flex items-center text-gray-600">
              <FaCalendarAlt className="mr-2" />
              {new Date(workshopModalData.startDate).toLocaleString()}
            </div>
            <div className="flex items-center text-gray-600">
              <FaGraduationCap className="mr-2" />
              {workshopModalData.speaker}
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3">{workshopModalData.description}</p>

          {workshopModalData.agenda && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Agenda:</h4>
              <ul className="text-sm space-y-1">
                {workshopModalData.agenda.map((item, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <FaChevronRight className="text-blue-500 mr-2" size={10} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isLive && isRegistered && !hasEnded && (
            <div className="mb-3">
              <div className="text-sm font-semibold text-green-700 mb-2">Live Now</div>
              <div className="border rounded p-2 mb-2 h-32 overflow-y-auto bg-gray-50 text-sm">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`mb-1 ${msg.sender === 'You' ? 'text-right' : 'text-left'}`}>
                    <span className="font-semibold text-blue-700">{msg.sender}:</span> {msg.message}
                    <span className="text-xs text-gray-400 ml-2">{msg.timestamp}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  className="flex-1 border rounded p-1 text-sm"
                  placeholder="Type a message..."
                  onKeyDown={e => { if (e.key === 'Enter') handleSendChat(); }}
                />
                <button onClick={handleSendChat} className="bg-blue-500 text-white p-1 rounded">
                  <FaPaperPlane size={14} />
                </button>
              </div>
            </div>
          )}

          {isPreRecorded && (
            <div className="mb-3">
              <video
                ref={videoRef}
                className="w-full rounded"
                controls
                onPlay={() => setVideoPlaying(true)}
                onPause={() => setVideoPlaying(false)}
              >
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              </video>
            </div>
          )}

          {isRegistered && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  className="w-full border rounded p-2 text-sm"
                  rows={2}
                  value={workshopModalData.notes || ''}
                  onChange={e => updateWorkshopNotes(workshopModalData.id, e.target.value)}
                  placeholder="Take notes during the workshop..."
                />
              </div>

              {hasEnded && (
                <>
                  <button
                    onClick={() => handleDownloadCertificate(workshopModalData)}
                    className="w-full bg-purple-600 text-white px-3 py-1.5 rounded text-sm hover:bg-purple-700 flex items-center justify-center"
                  >
                    <FaDownload className="mr-2" /> Download Certificate
                  </button>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rate this workshop</label>
                    <div className="flex items-center space-x-2">
                      {[1,2,3,4,5].map(star => (
                        <button
                          key={star}
                          onClick={() => rateWorkshop(workshopModalData.id, star, workshopModalData.feedback)}
                          className={star <= (workshopModalData.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
                        >
                          <FaStar size={16} />
                        </button>
                      ))}
                      <input
                        type="text"
                        className="flex-1 border rounded p-1 text-sm"
                        placeholder="Add feedback..."
                        value={workshopModalData.feedback || ''}
                        onChange={e => rateWorkshop(workshopModalData.id, workshopModalData.rating || 0, e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Workshops Section (updated to open modal)
  const renderWorkshops = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Career Workshops</h2>
          <p className="text-gray-600">Enhance your skills with expert-led workshops</p>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Past Workshops
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Upcoming
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workshops.map(workshop => (
          <div key={workshop.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800">{workshop.title}</h3>
                <p className="text-gray-600 mt-2">{workshop.description}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <FaCalendarAlt className="mr-2" />
                    {new Date(workshop.startDate).toLocaleString()} - {new Date(workshop.endDate).toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaGraduationCap className="mr-2" />
                    Speaker: {workshop.speaker}
                  </div>
                </div>
                {workshop.agenda && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700">Agenda:</h4>
                    <ul className="mt-2 space-y-1">
                      {workshop.agenda.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <FaChevronRight className="text-blue-500 mr-2" size={12} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="ml-4 flex flex-col space-y-2">
                {!workshop.isRegistered ? (
                  <button
                    onClick={() => registerForWorkshop(workshop.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Register
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { setWorkshopModalData(workshop); setShowWorkshopModal(true); }}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        workshop.isLive 
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {workshop.isLive ? 'Join Now' : 'View Details'}
                    </button>
                  </>
                )}
                {/* View Details always available */}
                <button
                  onClick={() => { setWorkshopModalData(workshop); setShowWorkshopModal(true); }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showWorkshopModal && renderWorkshopModal()}
    </div>
  );

  // Appointments Section
  const renderAppointments = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Career Guidance</h2>
          <p className="text-gray-600">Schedule and manage your career guidance sessions</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => requestAppointment({
              type: 'career_guidance',
              date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              notes: 'Request for career guidance session'
            })}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Request New Appointment
          </button>
          <button
            onClick={simulateIncomingCall}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Simulate Incoming Call
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {appointments.map(appointment => (
          <div key={appointment.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Career Guidance Session</h3>
                <p className="text-gray-600 mt-2">{appointment.notes}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <FaCalendarAlt className="mr-2" />
                    {new Date(appointment.date).toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                    {/* Online status indicator */}
                    <span className="flex items-center text-xs ml-2">
                      <FaCircle className={onlineAppointments.includes(appointment.id) ? 'text-green-500' : 'text-gray-400'} />
                      <span className={onlineAppointments.includes(appointment.id) ? 'text-green-600 ml-1' : 'text-gray-500 ml-1'}>
                        {onlineAppointments.includes(appointment.id) ? 'Online' : 'Offline'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              {appointment.status === 'pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateAppointmentStatus(appointment.id, 'accepted')}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => updateAppointmentStatus(appointment.id, 'rejected')}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <FaX />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Video Call Interface
  const renderVideoCall = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 h-5/6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Video Call</h2>
            <p className="text-gray-600">Career Guidance Session</p>
          </div>
          <button
            onClick={() => setIsCallActive(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaTimes size={24} className="text-gray-500" />
          </button>
        </div>
        <div className="flex-1 bg-gray-900 rounded-lg mb-4 relative">
          {/* Video feed would go here */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 rounded-lg p-2">
            <span className="text-white text-sm">You</span>
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setCallSettings(prev => ({ ...prev, video: !prev.video }))}
            className={`p-4 rounded-full ${
              callSettings.video ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
            } text-white transition-colors`}
          >
            <FaVideo size={20} />
          </button>
          <button
            onClick={() => setCallSettings(prev => ({ ...prev, audio: !prev.audio }))}
            className={`p-4 rounded-full ${
              callSettings.audio ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
            } text-white transition-colors`}
          >
            <FaMicrophone size={20} />
          </button>
          <button
            onClick={() => setCallSettings(prev => ({ ...prev, screen: !prev.screen }))}
            className={`p-4 rounded-full ${
              callSettings.screen ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'
            } text-white transition-colors`}
          >
            <FaDesktop size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  // Add Suggested Companies Section
  const renderSuggestedCompanies = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {renderProBadge()}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Suggested Companies</h2>
          <p className="text-gray-600">Companies matching your interests and industry preferences</p>
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search companies..."
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
          >
            <FaFilter />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3">Filter By:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <select className="w-full border rounded-md p-2">
                <option value="">All Industries</option>
                <option value="software">Software Development</option>
                <option value="data">Data Science</option>
                <option value="cloud">Cloud Computing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Match Score</label>
              <select className="w-full border rounded-md p-2">
                <option value="">Any Score</option>
                <option value="90">90% and above</option>
                <option value="80">80% and above</option>
                <option value="70">70% and above</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select className="w-full border rounded-md p-2">
                <option value="match">Match Score</option>
                <option value="name">Company Name</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {localSuggestedCompanies.map(company => (
          <div key={company.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{company.name}</h3>
                  <p className="text-blue-600 font-medium">{company.industry}</p>
                </div>
                <div className="flex items-center bg-green-100 px-2 py-1 rounded">
                  <span className="text-green-700 font-semibold">{company.matchScore}% Match</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Job Interests Match:</h4>
                <div className="flex flex-wrap gap-2">
                  {company.jobInterests.map((interest, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {company.recommendations && company.recommendations.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Past Intern Feedback:</h4>
                  <div className="space-y-2">
                    {company.recommendations.map((rec, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <div className="flex items-center mb-1">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={i < Math.floor(rec.rating) ? 'text-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-gray-600">{rec.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{rec.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                  View Opportunities
                </button>
                <button className="bg-gray-100 text-gray-700 p-2 rounded hover:bg-gray-200 transition-colors">
                  <FaStar />
                </button>
              </div>
            </div>
          </div>
        ))}
        {(!localSuggestedCompanies || localSuggestedCompanies.length === 0) && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No suggested companies available at the moment
          </div>
        )}
      </div>
    </div>
  );

  // Profile Management Section
  const renderProfile = () => {
    // Ensure we have default values for all nested properties
    const profile = {
      name: studentProfile?.name || '',
      email: studentProfile?.email || '',
      major: studentProfile?.major || '',
      semester: studentProfile?.semester || 1,
      jobInterests: {
        industries: studentProfile?.jobInterests?.industries || [],
        roles: studentProfile?.jobInterests?.roles || [],
        preferredLocations: studentProfile?.jobInterests?.preferredLocations || []
      },
      skills: studentProfile?.skills || [],
      previousExperience: Array.isArray(studentProfile?.previousExperience) ? studentProfile.previousExperience : [],
      collegeActivities: Array.isArray(studentProfile?.collegeActivities) ? studentProfile.collegeActivities : []
    };

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        {renderProBadge()}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
            <p className="text-gray-600">Manage your professional information</p>
          </div>
          <button
            onClick={() => setShowProfileModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <FaEdit className="inline mr-2" /> Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-3">Basic Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {profile.name}</p>
              <p><span className="font-medium">Email:</span> {profile.email}</p>
              <p><span className="font-medium">Major:</span> {profile.major}</p>
              <p><span className="font-medium">Semester:</span> {profile.semester}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Job Interests</h3>
            <div className="space-y-2">
              <div>
                <p className="font-medium">Industries:</p>
                <div className="flex flex-wrap gap-2">
                  {profile.jobInterests.industries.map((industry, index) => (
                    <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                      {industry}
                    </span>
                  ))}
                  {profile.jobInterests.industries.length === 0 && (
                    <span className="text-gray-500 text-sm">No industries selected</span>
                  )}
                </div>
              </div>
              <div>
                <p className="font-medium">Preferred Roles:</p>
                <div className="flex flex-wrap gap-2">
                  {profile.jobInterests.roles.map((role, index) => (
                    <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                      {role}
                    </span>
                  ))}
                  {profile.jobInterests.roles.length === 0 && (
                    <span className="text-gray-500 text-sm">No roles selected</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-semibold text-lg mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
              {profile.skills.length === 0 && (
                <span className="text-gray-500 text-sm">No skills added</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Experience</h3>
            <button
              onClick={() => { setEditingExperience(null); setShowExperienceModal(true); }}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <FaPlus className="inline mr-1" /> Add Experience
            </button>
          </div>
          <div className="space-y-4">
            {profile.previousExperience.map(exp => (
              <div key={exp.id || Math.random()} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{exp.role}</h4>
                    <p className="text-blue-600">{exp.companyName}</p>
                    <p className="text-sm text-gray-500">
                      {exp.duration} ({exp.startDate ? new Date(exp.startDate).toLocaleDateString() : 'N/A'} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'N/A'})
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => { setEditingExperience(exp); setShowExperienceModal(true); }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteExperience(exp.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
                  {(exp.responsibilities || []).map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
            {profile.previousExperience.length === 0 && (
              <p className="text-gray-500 text-center py-4">No experience added yet</p>
            )}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">College Activities</h3>
            <button
              onClick={() => { setEditingActivity(null); setShowActivityModal(true); }}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <FaPlus className="inline mr-1" /> Add Activity
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.collegeActivities.map(activity => (
              <div key={activity.id || Math.random()} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{activity.name}</h4>
                    <p className="text-blue-600">{activity.role}</p>
                    <p className="text-sm text-gray-500">{activity.duration}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => { setEditingActivity(activity); setShowActivityModal(true); }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteCollegeActivity(activity.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-gray-600">{activity.description}</p>
              </div>
            ))}
            {profile.collegeActivities.length === 0 && (
              <p className="text-gray-500 text-center py-4 md:col-span-2">No activities added yet</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Profile Edit Modal
  const renderProfileModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Edit Profile</h3>
            <button
              onClick={() => setShowProfileModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={profileFormData.name}
                onChange={handleProfileInputChange}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={profileFormData.email}
                onChange={handleProfileInputChange}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Major</label>
              <input
                type="text"
                name="major"
                value={profileFormData.major}
                onChange={handleProfileInputChange}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Semester</label>
              <input
                type="number"
                name="semester"
                value={profileFormData.semester}
                onChange={handleProfileInputChange}
                min="1"
                max="8"
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Industries (comma-separated)
                <span className="text-gray-500 text-xs ml-2">e.g., Software, Data Science, AI</span>
              </label>
              <input
                type="text"
                name="industries"
                value={profileFormData.industries}
                onChange={handleProfileInputChange}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                placeholder="Enter industries separated by commas"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preferred Roles (comma-separated)
                <span className="text-gray-500 text-xs ml-2">e.g., Frontend Developer, Data Analyst</span>
              </label>
              <input
                type="text"
                name="roles"
                value={profileFormData.roles}
                onChange={handleProfileInputChange}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                placeholder="Enter roles separated by commas"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preferred Locations (comma-separated)
                <span className="text-gray-500 text-xs ml-2">e.g., New York, Remote, San Francisco</span>
              </label>
              <input
                type="text"
                name="locations"
                value={profileFormData.locations}
                onChange={handleProfileInputChange}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                placeholder="Enter locations separated by commas"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Skills (comma-separated)
                <span className="text-gray-500 text-xs ml-2">e.g., React, Python, AWS</span>
              </label>
              <input
                type="text"
                name="skills"
                value={profileFormData.skills}
                onChange={handleProfileInputChange}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                placeholder="Enter skills separated by commas"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Experience Edit Modal
  const renderExperienceModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h3 className="text-xl font-bold mb-4">
          {editingExperience ? 'Edit Experience' : 'Add Experience'}
        </h3>
        <form onSubmit={e => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const experience = {
            type: formData.get('type'),
            companyName: formData.get('companyName'),
            role: formData.get('role'),
            duration: formData.get('duration'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            responsibilities: formData.get('responsibilities').split('\n').filter(r => r.trim())
          };
          if (editingExperience) {
            updateExperience(editingExperience.id, experience);
          } else {
            addExperience(experience);
          }
          setShowExperienceModal(false);
          setEditingExperience(null);
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                name="type"
                defaultValue={editingExperience?.type || 'internship'}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
              >
                <option value="internship">Internship</option>
                <option value="part-time">Part-time Job</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                name="companyName"
                defaultValue={editingExperience?.companyName}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input
                type="text"
                name="role"
                defaultValue={editingExperience?.role}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration</label>
              <input
                type="text"
                name="duration"
                defaultValue={editingExperience?.duration}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  defaultValue={editingExperience?.startDate}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  defaultValue={editingExperience?.endDate}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Responsibilities (one per line)</label>
              <textarea
                name="responsibilities"
                defaultValue={editingExperience?.responsibilities.join('\n')}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                rows={4}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => { setShowExperienceModal(false); setEditingExperience(null); }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {editingExperience ? 'Save Changes' : 'Add Experience'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  // Activity Edit Modal
  const renderActivityModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h3 className="text-xl font-bold mb-4">
          {editingActivity ? 'Edit Activity' : 'Add Activity'}
        </h3>
        <form onSubmit={e => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const activity = {
            name: formData.get('name'),
            role: formData.get('role'),
            duration: formData.get('duration'),
            description: formData.get('description')
          };
          if (editingActivity) {
            updateCollegeActivity(editingActivity.id, activity);
          } else {
            addCollegeActivity(activity);
          }
          setShowActivityModal(false);
          setEditingActivity(null);
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Activity Name</label>
              <input
                type="text"
                name="name"
                defaultValue={editingActivity?.name}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input
                type="text"
                name="role"
                defaultValue={editingActivity?.role}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration</label>
              <input
                type="text"
                name="duration"
                defaultValue={editingActivity?.duration}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                defaultValue={editingActivity?.description}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => { setShowActivityModal(false); setEditingActivity(null); }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {editingActivity ? 'Save Changes' : 'Add Activity'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  // Add Majors Section
  const renderMajors = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {renderProBadge()}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Available Majors</h2>
          <p className="text-gray-600">Select your major and semester</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
            <span className="font-medium">Current Major:</span> {studentProfile.major || 'None Selected'}
          </div>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
            <span className="font-medium">Current Semester:</span> {studentProfile.semester || 'Not Set'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {localMajors.map(major => (
          <div 
            key={major.id} 
            className={`border rounded-lg p-6 transition-all duration-200 ${
              studentProfile.major === major.name 
                ? 'border-blue-500 shadow-lg' 
                : 'hover:shadow-md'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{major.name}</h3>
                <p className="text-gray-600 mt-1">{major.description}</p>
              </div>
              {studentProfile.major === major.name && (
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                  Current Major
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Course Load:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  major.courseLoad === 'Heavy' 
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {major.courseLoad}
                </span>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-700">Specializations:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {major.specializations.map((spec, idx) => (
                    <span 
                      key={idx}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-700">Career Paths:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {major.careerPaths.map((path, idx) => (
                    <span 
                      key={idx}
                      className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm"
                    >
                      {path}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowMajorDetails(major)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEye className="inline mr-1" /> View Details
                  </button>
                </div>
                <div className="flex space-x-2">
                  {studentProfile.major !== major.name ? (
                    <button
                      onClick={() => {
                        setSelectedMajor(major.name);
                        setShowMajorModal(true);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      Select Major
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowMajorModal(true)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                    >
                      Change Semester
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Add Semester Selection Modal
  const renderMajorModal = () => {
    const major = localMajors.find(m => m.name === (selectedMajor || studentProfile.major));
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-lg w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Select Semester</h3>
            <button
              onClick={() => setShowMajorModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="mb-6">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-blue-800 font-medium">Selected Major: {major?.name}</p>
              <p className="text-blue-600 text-sm mt-1">Total Semesters: {major?.totalSemesters}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Your Current Semester
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(major?.totalSemesters || 8)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSemester(i + 1)}
                      className={`p-3 rounded-lg text-center transition-colors ${
                        selectedSemester === i + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <FaBell className="inline mr-2" />
                  Changing your semester will update your academic progress and available courses.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowMajorModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                updateProfile({
                  ...studentProfile,
                  major: selectedMajor || studentProfile.major,
                  semester: selectedSemester
                });
                setShowMajorModal(false);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add Major Details Modal
  const renderMajorDetailsModal = () => {
    if (!showMajorDetails) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{showMajorDetails.name}</h3>
            <button
              onClick={() => setShowMajorDetails(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-lg mb-2">Description</h4>
              <p className="text-gray-600">{showMajorDetails.description}</p>
            </div>

            <div>
              <h4 className="font-medium text-lg mb-2">Program Structure</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-700 font-medium">Total Semesters:</span>
                    <span className="ml-2">{showMajorDetails.totalSemesters}</span>
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium">Course Load:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-sm ${
                      showMajorDetails.courseLoad === 'Heavy' 
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {showMajorDetails.courseLoad}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-lg mb-2">Specializations</h4>
              <div className="flex flex-wrap gap-2">
                {showMajorDetails.specializations.map((spec, idx) => (
                  <span 
                    key={idx}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-lg mb-2">Career Opportunities</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {showMajorDetails.careerPaths.map((path, idx) => (
                  <div key={idx} className="bg-purple-50 p-3 rounded-lg">
                    <FaBriefcase className="inline mr-2 text-purple-600" />
                    <span className="text-purple-800">{path}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setShowMajorDetails(null)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = internships.filter(internship => 
      internship.jobTitle.toLowerCase().includes(term.toLowerCase()) ||
      internship.companyName.toLowerCase().includes(term.toLowerCase())
    );
    applyFilters(filtered);
  };

  const applyFilters = (internshipsToFilter = internships) => {
    let filtered = [...internshipsToFilter];
    
    if (filters.industry) {
      filtered = filtered.filter(i => i.industry === filters.industry);
    }
    if (filters.duration) {
      filtered = filtered.filter(i => i.duration === filters.duration);
    }
    if (filters.isPaid !== '') {
      filtered = filtered.filter(i => i.isPaid === (filters.isPaid === 'paid'));
    }
    if (filters.type) {
      filtered = filtered.filter(i => i.type === filters.type);
    }
    
    setFilteredInternships(filtered);
  };

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    applyFilters();
  };

  const getApplicationStatus = (internshipId) => {
    const application = applications.find(app => app.internshipId === internshipId);
    return application ? application.status : null;
  };

  const renderInternships = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Available Internships</h2>
          <p className="text-gray-600">Find and apply for internships that match your interests</p>
        </div>
        <button
          onClick={() => setActiveTab('myApplications')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          My Applications
        </button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by job title or company..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
          >
            <FaFilter />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <select
                className="w-full border rounded-md p-2"
                value={filters.industry}
                onChange={(e) => handleFilterChange('industry', e.target.value)}
              >
                <option value="">All Industries</option>
                <option value="Software Development">Software Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <select
                className="w-full border rounded-md p-2"
                value={filters.duration}
                onChange={(e) => handleFilterChange('duration', e.target.value)}
              >
                <option value="">Any Duration</option>
                <option value="3 months">3 months</option>
                <option value="6 months">6 months</option>
                <option value="12 months">12 months</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                className="w-full border rounded-md p-2"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment</label>
              <select
                className="w-full border rounded-md p-2"
                value={filters.isPaid}
                onChange={(e) => handleFilterChange('isPaid', e.target.value)}
              >
                <option value="">All</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInternships.map(internship => (
          <div key={internship.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{internship.jobTitle}</h3>
                <p className="text-blue-600 font-medium">{internship.companyName}</p>
              </div>
              {getApplicationStatus(internship.id) && (
                <span className={`px-3 py-1 rounded-full text-sm ${
                  getApplicationStatus(internship.id) === 'accepted' ? 'bg-green-100 text-green-800' :
                  getApplicationStatus(internship.id) === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {getApplicationStatus(internship.id).charAt(0).toUpperCase() + getApplicationStatus(internship.id).slice(1)}
                </span>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600">
                <FaClock className="mr-2" />
                <span>{internship.duration}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaBuilding className="mr-2" />
                <span>{internship.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaMoneyBillWave className="mr-2" />
                <span>{internship.isPaid ? internship.salary : 'Unpaid'}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {internship.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSelectedInternship(internship);
                  setShowInternshipModal(true);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInternshipModal = () => {
    if (!selectedInternship) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{selectedInternship.jobTitle}</h3>
              <p className="text-blue-600 text-lg">{selectedInternship.companyName}</p>
            </div>
            <button
              onClick={() => setShowInternshipModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center text-gray-700">
                <FaClock className="mr-2" />
                <span>Duration: {selectedInternship.duration}</span>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center text-gray-700">
                <FaMoneyBillWave className="mr-2" />
                <span>{selectedInternship.isPaid ? selectedInternship.salary : 'Unpaid'}</span>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center text-gray-700">
                <FaBuilding className="mr-2" />
                <span>{selectedInternship.location}</span>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center text-gray-700">
                <FaIndustry className="mr-2" />
                <span>{selectedInternship.industry}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-lg mb-2">Description</h4>
              <p className="text-gray-600">{selectedInternship.description}</p>
            </div>

            <div>
              <h4 className="font-medium text-lg mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {selectedInternship.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-lg mb-2">Requirements</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {selectedInternship.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-lg mb-2">Responsibilities</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {selectedInternship.responsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-6 border-t">
            <button
              onClick={() => {
                setShowInternshipModal(false);
                setShowApplicationModal(true);
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderApplicationModal = () => {
    if (!selectedInternship) return null;

    const handleFileUpload = (type, files) => {
      if (type === 'certificates') {
        setApplicationDocuments(prev => ({
          ...prev,
          certificates: [...prev.certificates, ...Array.from(files)]
        }));
      } else {
        setApplicationDocuments(prev => ({
          ...prev,
          [type]: files[0]
        }));
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      // Add application logic here
      const newApplication = {
        id: applications.length + 1,
        internshipId: selectedInternship.id,
        status: 'pending',
        appliedDate: new Date().toISOString().split('T')[0],
        documents: [
          ...(applicationDocuments.cv ? [{ name: applicationDocuments.cv.name, type: 'cv' }] : []),
          ...(applicationDocuments.coverLetter ? [{ name: applicationDocuments.coverLetter.name, type: 'coverLetter' }] : []),
          ...applicationDocuments.certificates.map(cert => ({ name: cert.name, type: 'certificate' }))
        ]
      };
      setApplications([...applications, newApplication]);
      setShowApplicationModal(false);
      setSelectedInternship(null);
      // Reset documents after submission
      setApplicationDocuments({
        cv: null,
        coverLetter: null,
        certificates: []
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Apply for {selectedInternship.jobTitle}</h3>
            <button
              onClick={() => {
                setShowApplicationModal(false);
                setApplicationDocuments({
                  cv: null,
                  coverLetter: null,
                  certificates: []
                });
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CV/Resume (Required)
              </label>
              <div className="flex items-center space-x-2">
                <label className="flex-1 cursor-pointer">
                  <div className="px-4 py-2 border-2 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                    <div className="flex items-center justify-center space-x-2">
                      <FaUpload className="text-gray-400" />
                      <span className="text-gray-600">
                        {applicationDocuments.cv ? applicationDocuments.cv.name : 'Upload CV'}
                      </span>
                    </div>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload('cv', e.target.files)}
                    required
                  />
                </label>
                {applicationDocuments.cv && (
                  <button
                    type="button"
                    onClick={() => setApplicationDocuments(prev => ({ ...prev, cv: null }))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter
              </label>
              <div className="flex items-center space-x-2">
                <label className="flex-1 cursor-pointer">
                  <div className="px-4 py-2 border-2 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                    <div className="flex items-center justify-center space-x-2">
                      <FaUpload className="text-gray-400" />
                      <span className="text-gray-600">
                        {applicationDocuments.coverLetter ? applicationDocuments.coverLetter.name : 'Upload Cover Letter'}
                      </span>
                    </div>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload('coverLetter', e.target.files)}
                  />
                </label>
                {applicationDocuments.coverLetter && (
                  <button
                    type="button"
                    onClick={() => setApplicationDocuments(prev => ({ ...prev, coverLetter: null }))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Certificates
              </label>
              <div className="space-y-2">
                <label className="block cursor-pointer">
                  <div className="px-4 py-2 border-2 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                    <div className="flex items-center justify-center space-x-2">
                      <FaUpload className="text-gray-400" />
                      <span className="text-gray-600">Upload Certificates</span>
                    </div>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    multiple
                    onChange={(e) => handleFileUpload('certificates', e.target.files)}
                  />
                </label>
                {applicationDocuments.certificates.length > 0 && (
                  <div className="space-y-2">
                    {applicationDocuments.certificates.map((cert, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-600">{cert.name}</span>
                        <button
                          type="button"
                          onClick={() => setApplicationDocuments(prev => ({
                            ...prev,
                            certificates: prev.certificates.filter((_, i) => i !== index)
                          }))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowApplicationModal(false);
                  setApplicationDocuments({
                    cv: null,
                    coverLetter: null,
                    certificates: []
                  });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderMyApplications = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Applications</h2>
          <p className="text-gray-600">Track your internship applications</p>
        </div>
        <button
          onClick={() => setActiveTab('internships')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Browse Internships
        </button>
      </div>

      <div className="space-y-6">
        {applications.map(application => {
          const internship = internships.find(i => i.id === application.internshipId);
          if (!internship) return null;

          return (
            <div key={application.id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{internship.jobTitle}</h3>
                  <p className="text-blue-600">{internship.companyName}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm ${
                  application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-gray-600">
                  <FaCalendarAlt className="inline mr-2" />
                  Applied on: {new Date(application.appliedDate).toLocaleDateString()}
                </div>
                <div className="text-gray-600">
                  <FaClock className="inline mr-2" />
                  Duration: {internship.duration}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Submitted Documents:</h4>
                <div className="space-y-2">
                  {application.documents.map((doc, index) => (
                    <div key={index} className="flex items-center text-gray-600">
                      <FaFileAlt className="mr-2" />
                      {doc.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedInternship(internship);
                    setShowInternshipModal(true);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
        {applications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            You haven't applied to any internships yet
          </div>
        )}
      </div>
    </div>
  );

  // Add this new function to filter internships
  const getFilteredMyInternships = () => {
    return myInternships.filter(internship => {
      // Search filter
      const searchMatch = 
        internship.jobTitle.toLowerCase().includes(internshipSearchTerm.toLowerCase()) ||
        internship.companyName.toLowerCase().includes(internshipSearchTerm.toLowerCase());
      
      // Status filter
      const statusMatch = 
        internshipStatusFilter === 'all' || 
        internship.status === internshipStatusFilter;
      
      // Date filter
      let dateMatch = true;
      if (internshipDateFilter.startDate) {
        dateMatch = dateMatch && internship.startDate >= internshipDateFilter.startDate;
      }
      if (internshipDateFilter.endDate) {
        dateMatch = dateMatch && internship.endDate <= internshipDateFilter.endDate;
      }
      
      return searchMatch && statusMatch && dateMatch;
    });
  };

  // Add this new render function for the internship details modal
  const renderInternshipDetailsModal = () => {
    if (!selectedInternshipDetails) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{selectedInternshipDetails.jobTitle}</h3>
              <p className="text-blue-600 text-lg">{selectedInternshipDetails.companyName}</p>
            </div>
            <button
              onClick={() => setShowInternshipDetailsModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="font-medium">Duration:</span>
                <div className="text-gray-600">
                  {new Date(selectedInternshipDetails.startDate).toLocaleDateString()} - 
                  {new Date(selectedInternshipDetails.endDate).toLocaleDateString()}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="font-medium">Status:</span>
                <div className={`inline-block ml-2 px-3 py-1 rounded-full text-sm ${
                  selectedInternshipDetails.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {selectedInternshipDetails.status.charAt(0).toUpperCase() + selectedInternshipDetails.status.slice(1)}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-lg mb-2">Description</h4>
              <p className="text-gray-600">{selectedInternshipDetails.description}</p>
            </div>

            <div>
              <h4 className="font-medium text-lg mb-2">Achievements</h4>
              <ul className="list-disc list-inside space-y-1">
                {selectedInternshipDetails.achievements.map((achievement, index) => (
                  <li key={index} className="text-gray-600">{achievement}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-lg mb-2">Skills Developed</h4>
              <div className="flex flex-wrap gap-2">
                {selectedInternshipDetails.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-lg mb-2">Supervisor</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{selectedInternshipDetails.supervisor.name}</p>
                <p className="text-gray-600">{selectedInternshipDetails.supervisor.position}</p>
                <p className="text-blue-600">{selectedInternshipDetails.supervisor.contact}</p>
              </div>
            </div>

            {selectedInternshipDetails.feedback && (
              <div>
                <h4 className="font-medium text-lg mb-2">Feedback</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={star <= selectedInternshipDetails.feedback.rating 
                          ? 'text-yellow-400' 
                          : 'text-gray-300'
                        }
                      />
                    ))}
                    <span className="ml-2 text-gray-600">
                      {selectedInternshipDetails.feedback.rating.toFixed(1)}/5.0
                    </span>
                  </div>
                  <p className="text-gray-600">{selectedInternshipDetails.feedback.comments}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setShowInternshipDetailsModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add this new render function for the My Internships section
  const renderMyInternships = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Internships</h2>
          <p className="text-gray-600">View and manage your internship history</p>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by job title or company..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={internshipSearchTerm}
              onChange={(e) => setInternshipSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={internshipStatusFilter}
            onChange={(e) => setInternshipStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="current">Current Intern</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={internshipDateFilter.startDate}
              onChange={(e) => setInternshipDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={internshipDateFilter.endDate}
              onChange={(e) => setInternshipDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {getFilteredMyInternships().map(internship => (
          <div key={internship.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{internship.jobTitle}</h3>
                <p className="text-blue-600">{internship.companyName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                internship.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-gray-600">
                <FaCalendarAlt className="inline mr-2" />
                {new Date(internship.startDate).toLocaleDateString()} - 
                {new Date(internship.endDate).toLocaleDateString()}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {internship.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSelectedInternshipDetails(internship);
                  setShowInternshipDetailsModal(true);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
        {getFilteredMyInternships().length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No internships found matching your criteria
          </div>
        )}
      </div>
    </div>
  );

  // Add these helper functions
  const handleSaveEvaluation = (evaluationData) => {
    if (selectedEvaluation) {
      // Update existing evaluation
      setEvaluations(prev => prev.map(evaluation => 
        evaluation.id === selectedEvaluation.id 
          ? { ...evaluation, ...evaluationData, updatedAt: new Date().toISOString() }
          : evaluation
      ));
    } else {
      // Create new evaluation
      setEvaluations(prev => [...prev, {
        id: prev.length + 1,
        ...evaluationData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]);
    }
    setShowEvaluationModal(false);
    setSelectedEvaluation(null);
  };

  const handleDeleteEvaluation = (id) => {
    setEvaluations(prev => prev.filter(evaluation => evaluation.id !== id));
  };

  const handleSaveReport = (reportData) => {
    if (selectedReport) {
      // Update existing report
      setReports(prev => prev.map(report => 
        report.id === selectedReport.id 
          ? { ...report, ...reportData, updatedAt: new Date().toISOString() }
          : report
      ));
    } else {
      // Create new report
      setReports(prev => [...prev, {
        id: prev.length + 1,
        ...reportData,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]);
    }
    setShowReportModal(false);
    setSelectedReport(null);
  };

  const handleDeleteReport = (id) => {
    setReports(prev => prev.filter(report => report.id !== id));
  };

  const handleSubmitFinalReport = (report) => {
    setReports(prev => prev.map(r => 
      r.id === report.id 
        ? { ...r, status: 'submitted', updatedAt: new Date().toISOString() }
        : r
    ));
  };

  const generatePDF = (data, type) => {
    // This is a placeholder for PDF generation
    // In a real implementation, you would use a library like jsPDF or pdfmake
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-${new Date().toISOString()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Evaluation Form State
  const [evaluationFormData, setEvaluationFormData] = useState({
    companyName: selectedEvaluation?.companyName || '',
    rating: selectedEvaluation?.rating || 5,
    strengths: selectedEvaluation?.strengths?.join('\n') || '',
    weaknesses: selectedEvaluation?.weaknesses?.join('\n') || '',
    recommendation: selectedEvaluation?.recommendation ?? true,
    details: selectedEvaluation?.details || ''
  });

  // Update evaluation form data when selected evaluation changes
  useEffect(() => {
    if (selectedEvaluation) {
      setEvaluationFormData({
        companyName: selectedEvaluation.companyName || '',
        rating: selectedEvaluation.rating || 5,
        strengths: selectedEvaluation.strengths?.join('\n') || '',
        weaknesses: selectedEvaluation.weaknesses?.join('\n') || '',
        recommendation: selectedEvaluation.recommendation ?? true,
        details: selectedEvaluation.details || ''
      });
    }
  }, [selectedEvaluation]);

  const handleEvaluationSubmit = (e) => {
    e.preventDefault();
    handleSaveEvaluation({
      ...evaluationFormData,
      strengths: evaluationFormData.strengths.split('\n').filter(s => s.trim()),
      weaknesses: evaluationFormData.weaknesses.split('\n').filter(w => w.trim())
    });
    setShowEvaluationModal(false);
  };

  // Add these render functions for the new modals
  const renderEvaluationModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">
              {selectedEvaluation ? 'Edit Company Evaluation' : 'New Company Evaluation'}
            </h3>
            <button
              onClick={() => setShowEvaluationModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleEvaluationSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                value={evaluationFormData.companyName}
                onChange={e => setEvaluationFormData(prev => ({ ...prev, companyName: e.target.value }))}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEvaluationFormData(prev => ({ ...prev, rating: star }))}
                    className="text-2xl"
                  >
                    <FaStar className={star <= evaluationFormData.rating ? 'text-yellow-400' : 'text-gray-300'} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Strengths (one per line)
              </label>
              <textarea
                value={evaluationFormData.strengths}
                onChange={e => setEvaluationFormData(prev => ({ ...prev, strengths: e.target.value }))}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Weaknesses (one per line)
              </label>
              <textarea
                value={evaluationFormData.weaknesses}
                onChange={e => setEvaluationFormData(prev => ({ ...prev, weaknesses: e.target.value }))}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Detailed Review</label>
              <textarea
                value={evaluationFormData.details}
                onChange={e => setEvaluationFormData(prev => ({ ...prev, details: e.target.value }))}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                rows={5}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={evaluationFormData.recommendation}
                onChange={e => setEvaluationFormData(prev => ({ ...prev, recommendation: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <label className="text-sm font-medium text-gray-700">
                I recommend this company to other students
              </label>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowEvaluationModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Evaluation
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderReportModal = () => {
    const [formData, setFormData] = useState({
      title: selectedReport?.title || '',
      introduction: selectedReport?.introduction || '',
      body: selectedReport?.body || '',
      helpfulCourses: selectedReport?.helpfulCourses || []
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      handleSaveReport(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">
              {selectedReport ? 'Edit Internship Report' : 'New Internship Report'}
            </h3>
            <button
              onClick={() => setShowReportModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Report Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Introduction</label>
              <textarea
                value={formData.introduction}
                onChange={e => setFormData(prev => ({ ...prev, introduction: e.target.value }))}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                rows={5}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Body</label>
              <textarea
                value={formData.body}
                onChange={e => setFormData(prev => ({ ...prev, body: e.target.value }))}
                className="mt-1 block w-full border rounded-md shadow-sm p-2"
                rows={10}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Helpful Courses
              </label>
              <div className="grid grid-cols-2 gap-4">
                {courses[studentProfile.major]?.map(course => (
                  <div key={course.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.helpfulCourses.includes(course.id)}
                      onChange={e => {
                        const newCourses = e.target.checked
                          ? [...formData.helpfulCourses, course.id]
                          : formData.helpfulCourses.filter(id => id !== course.id);
                        setFormData(prev => ({ ...prev, helpfulCourses: newCourses }));
                      }}
                      className="rounded border-gray-300"
                    />
                    <label className="text-sm text-gray-700">
                      {course.code} - {course.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Report
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Add these new render functions for the main sections
  const renderEvaluations = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Company Evaluations</h2>
          <p className="text-gray-600">Share your experience with other students</p>
        </div>
        <button
          onClick={() => {
            setSelectedEvaluation(null);
            setShowEvaluationModal(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Evaluation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {evaluations.map(evaluation => (
          <div key={evaluation.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{evaluation.companyName}</h3>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <FaStar
                      key={star}
                      className={star <= evaluation.rating ? 'text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">{evaluation.rating.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedEvaluation(evaluation);
                    setShowEvaluationModal(true);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteEvaluation(evaluation.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Strengths:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {evaluation.strengths.map((strength, index) => (
                    <li key={index} className="text-gray-600">{strength}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Areas for Improvement:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {evaluation.weaknesses.map((weakness, index) => (
                    <li key={index} className="text-gray-600">{weakness}</li>
                  ))}
                </ul>
              </div>

              <p className="text-gray-600">{evaluation.details}</p>

              <div className={`mt-4 ${
                evaluation.recommendation ? 'text-green-600' : 'text-red-600'
              }`}>
                <FaThumbsUp className={`inline mr-2 ${
                  evaluation.recommendation ? '' : 'transform rotate-180'
                }`} />
                {evaluation.recommendation 
                  ? 'Recommended for future students'
                  : 'Not recommended for future students'
                }
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Last updated: {new Date(evaluation.updatedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Internship Reports</h2>
          <p className="text-gray-600">Document and share your internship experience</p>
        </div>
        <button
          onClick={() => {
            setSelectedReport(null);
            setShowReportModal(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          New Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map(report => (
          <div key={report.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{report.title}</h3>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                  report.status === 'submitted' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </span>
              </div>
              <div className="flex space-x-2">
                {report.status === 'draft' && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedReport(report);
                        setShowReportModal(true);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Introduction</h4>
                <p className="text-gray-600 line-clamp-3">{report.introduction}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Helpful Courses</h4>
                <div className="flex flex-wrap gap-2">
                  {report.helpfulCourses.map(courseId => {
                    const course = courses[studentProfile.major]?.find(c => c.id === courseId);
                    return course ? (
                      <span
                        key={courseId}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                      >
                        {course.code}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Last updated: {new Date(report.updatedAt).toLocaleDateString()}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => generatePDF(report, 'report')}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  <FaDownload className="inline mr-1" /> Download PDF
                </button>
                {report.status === 'draft' && (
                  <button
                    onClick={() => handleSubmitFinalReport(report)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Submit Final Version
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Update the main return statement to include the new sections and modals
  return (
    <div className="min-h-screen bg-gray-50">
      {renderNotifications()}
      <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <Link to="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Pro Student Dashboard</span>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors ${
              activeTab === 'profile' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaUser />
            <span>My Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('assessments')}
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors ${
              activeTab === 'assessments' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaChartBar />
            <span>Assessments</span>
          </button>
          <button
            onClick={() => setActiveTab('workshops')}
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors ${
              activeTab === 'workshops' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaGraduationCap />
            <span>Workshops</span>
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors ${
              activeTab === 'appointments' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaCalendarAlt />
            <span>Appointments</span>
          </button>
          <button
            onClick={() => setActiveTab('suggested')}
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors ${
              activeTab === 'suggested' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaBuilding />
            <span>Suggested Companies</span>
          </button>
          <button
            onClick={() => setActiveTab('majors')}
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors ${
              activeTab === 'majors' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaGraduationCap />
            <span>Majors</span>
          </button>
          <button
            onClick={() => setActiveTab('internships')}
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors ${
              activeTab === 'internships' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaBriefcase />
            <span>Internships</span>
          </button>
          <button
            onClick={() => setActiveTab('myInternships')}
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors ${
              activeTab === 'myInternships' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaBriefcase />
            <span>My Internships</span>
          </button>
          <button
            onClick={() => setActiveTab('evaluations')}
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors ${
              activeTab === 'evaluations' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaStar />
            <span>Evaluations</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors ${
              activeTab === 'reports' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaFileAlt />
            <span>Reports</span>
          </button>
        </div>

        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'assessments' && renderAssessments()}
        {activeTab === 'workshops' && renderWorkshops()}
        {activeTab === 'appointments' && renderAppointments()}
        {activeTab === 'suggested' && renderSuggestedCompanies()}
        {activeTab === 'majors' && renderMajors()}
        {activeTab === 'internships' && renderInternships()}
        {activeTab === 'myApplications' && renderMyApplications()}
        {activeTab === 'myInternships' && renderMyInternships()}
        {activeTab === 'evaluations' && renderEvaluations()}
        {activeTab === 'reports' && renderReports()}
        {isCallActive && renderVideoCall()}
        {showVideoModal && renderVideoModal()}
        {renderIncomingCall()}
        {showProfileModal && renderProfileModal()}
        {showExperienceModal && renderExperienceModal()}
        {showActivityModal && renderActivityModal()}
        {showMajorModal && renderMajorModal()}
        {showMajorDetails && renderMajorDetailsModal()}
        {showInternshipModal && renderInternshipModal()}
        {showApplicationModal && renderApplicationModal()}
        {showInternshipDetailsModal && renderInternshipDetailsModal()}
        {showEvaluationModal && renderEvaluationModal()}
        {showReportModal && renderReportModal()}
      </div>
    </div>
  );
} 