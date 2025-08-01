// src/pages/student/StudentDashboard.jsx
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useApplications } from '../../context/ApplicationContext';
import { useInternships } from '../../context/InternshipContext';
import { useStudent } from '../../context/StudentContext';
import { FaUpload, FaTimes, FaPlay } from 'react-icons/fa';

export default function StudentDashboard() {
  const { internships } = useInternships();
  const { applications, setApplications } = useApplications();
  const { studentProfile, updateProfile } = useStudent();

  const crumbs = [
   { label: "Home", to: "/" },
   { label: "Student Dashboard"},
 ];

  // local UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPaid, setFilterPaid] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterDuration, setFilterDuration] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('internships');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(studentProfile);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({
    cv: null,
    coverLetter: null,
    certificates: [],
    extraDocuments: []
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [evaluationForm, setEvaluationForm] = useState({
    rating: 5,
    recommend: true,
    comments: '',
    status: 'draft'
  });
  const [suggestedCompanies, setSuggestedCompanies] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportViewModal, setShowReportViewModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    title: '',
    introduction: '',
    body: '',
    courses: [],
    status: 'draft'
  });
  const [reportStatus, setReportStatus] = useState({
    status: 'pending', // pending, accepted, flagged, rejected
    comments: '',
    appealMessage: ''
  });
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Mock data for majors and courses
  const majors = [
    { id: 1, name: 'Computer Science', semesters: 8, description: 'Focus on software development, algorithms, and computer systems' },
    { id: 2, name: 'Information Systems', semesters: 8, description: 'Blend of IT and business management' },
    { id: 3, name: 'Computer Engineering', semesters: 8, description: 'Hardware and software integration' },
    { id: 4, name: 'Data Science', semesters: 8, description: 'Analytics, machine learning, and statistical analysis' },
    { id: 5, name: 'Software Engineering', semesters: 8, description: 'Software development lifecycle and project management' }
  ];

  // Enhanced courses data with major associations
  const courses = [
    { id: 1, name: 'Data Structures', code: 'CS201', semester: 3, major: 'Computer Science', description: 'Study of fundamental data structures and algorithms' },
    { id: 2, name: 'Database Systems', code: 'CS301', semester: 4, major: 'Computer Science', description: 'Introduction to database design and management' },
    { id: 3, name: 'Software Engineering', code: 'CS401', semester: 5, major: 'Computer Science', description: 'Software development lifecycle and methodologies' },
    { id: 4, name: 'Web Development', code: 'CS302', semester: 4, major: 'Information Systems', description: 'Building modern web applications' },
    { id: 5, name: 'System Analysis', code: 'IS301', semester: 3, major: 'Information Systems', description: 'Analysis of information systems' },
    { id: 6, name: 'Digital Logic', code: 'CE201', semester: 3, major: 'Computer Engineering', description: 'Fundamentals of digital systems' },
    { id: 7, name: 'Machine Learning', code: 'DS301', semester: 5, major: 'Data Science', description: 'Introduction to machine learning algorithms' }
  ];

  // Mock data for suggested companies
  const mockSuggestedCompanies = [
    { id: 1, name: 'Tech Corp', industry: 'Technology', matchScore: 95 },
    { id: 2, name: 'Data Systems', industry: 'Data Science', matchScore: 88 },
    { id: 3, name: 'Web Solutions', industry: 'Web Development', matchScore: 82 }
  ];

  // Mock notifications
  const mockNotifications = [
    { id: 1, type: 'application', message: 'Your application to Tech Corp has been accepted!', read: false },
    { id: 2, type: 'report', message: 'Your internship report has been reviewed.', read: true }
  ];

  // Mock industries
  const industries = [
    'Technology',
    'Data Science',
    'Web Development',
    'Mobile Development',
    'AI/ML',
    'Cybersecurity'
  ];

  // Mock durations
  const durations = [1, 2, 3, 4, 5, 6];

  // Mock data for internship history
  const internshipHistory = [
    {
      id: 1,
      title: 'Software Development Intern',
      company: 'Tech Corp',
      startDate: '2023-06-01',
      endDate: '2023-08-31',
      status: 'completed',
      report: {
        title: 'Summer 2023 Internship Report',
        introduction: 'During my internship at Tech Corp...',
        body: 'I worked on various projects...',
        courses: ['Data Structures', 'Software Engineering'],
        submittedDate: '2023-09-01',
        status: 'accepted'
      },
      evaluation: {
        rating: 5,
        recommend: true,
        comments: 'Great learning experience...'
      }
    },
    {
      id: 2,
      title: 'Data Science Intern',
      company: 'Data Systems',
      startDate: '2024-01-01',
      endDate: null,
      status: 'current',
      report: null,
      evaluation: null
    }
  ];

  // State for report management
  const [reports, setReports] = useState([]);
  const [currentReport, setCurrentReport] = useState(null);
  const [isEditingReport, setIsEditingReport] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);

  // Mock video data for each major
  const majorVideos = {
    'Computer Science': 'https://example.com/cs-internships.mp4',
    'Information Systems': 'https://example.com/is-internships.mp4',
    'Computer Engineering': 'https://example.com/ce-internships.mp4',
    'Data Science': 'https://example.com/ds-internships.mp4',
    'Software Engineering': 'https://example.com/se-internships.mp4'
  };

  // Report management functions
  const handleCreateReport = () => {
    const newReport = {
      id: Date.now(),
      title: '',
      introduction: '',
      body: '',
      courses: [],
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setReports([...reports, newReport]);
    setCurrentReport(newReport);
    setIsEditingReport(true);
    setShowReportModal(true);
  };

  const handleUpdateReport = (updatedReport) => {
    const updatedReports = reports.map(report => 
      report.id === updatedReport.id ? { ...updatedReport, updatedAt: new Date().toISOString() } : report
    );
    setReports(updatedReports);
    setCurrentReport(updatedReport);
  };

  const handleDeleteReport = (reportId) => {
    const updatedReports = reports.filter(report => report.id !== reportId);
    setReports(updatedReports);
    setCurrentReport(null);
    setShowReportModal(false);
  };

  // Enhanced filter
  const filtered = useMemo(() => {
    // Ensure internships is an array before filtering, default to empty array if not
    const internshipsToFilter = Array.isArray(internships) ? internships : [];

    return internshipsToFilter
      .filter(i => {
        // Safely get title and companyName, defaulting to empty strings if undefined or null
        const title = i?.title || '';
        const companyName = i?.companyName || '';

        // Perform the search check on the potentially defaulted strings
        return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               companyName.toLowerCase().includes(searchTerm.toLowerCase());
      }
    )
    .filter(i =>
      filterPaid === 'all'
        ? true
        : filterPaid === 'paid'
        ? i?.paid // Added optional chaining here as well
        : i?.paid === false // Added optional chaining here as well
    )
    .filter(i =>
      filterIndustry === 'all'
        ? true
        : i?.industry === filterIndustry // Added optional chaining
    )
    .filter(i =>
      filterDuration === 'all'
        ? true
        : i?.duration === parseInt(filterDuration) // Added optional chaining
    )
    .filter(i =>
      filterStatus === 'all'
        ? true
        : i?.status === filterStatus // Added optional chaining
    );
  }, [internships, searchTerm, filterPaid, filterIndustry, filterDuration, filterStatus]);

  // Filter internship history
  const filteredHistory = useMemo(() => {
    return internshipHistory
      .filter(internship => {
        if (historyFilter === 'all') return true;
        if (historyFilter === 'current') return internship.status === 'current';
        if (historyFilter === 'completed') return internship.status === 'completed';
        return true;
      })
      .filter(internship =>
        internship.title.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
        internship.company.toLowerCase().includes(historySearchTerm.toLowerCase())
      );
  }, [internshipHistory, historyFilter, historySearchTerm]);

  // handle apply button click
  const handleApplyClick = (internship) => {
    setSelectedInternship(internship);
    setShowUploadModal(true);
  };

  // handle final application submission
  const handleFinalSubmit = () => {
    if (!selectedInternship) return;
    
    // Check if required documents are uploaded
    if (!selectedFiles.cv) {
      alert('Please upload your CV/Resume');
      return;
    }

    // Create new application
    const newApplication = {
      id: Date.now(),
      internshipId: selectedInternship.id,
      studentId: studentProfile.id,
      status: 'Pending',
      appliedDate: new Date().toISOString(),
      documents: {
        cv: selectedFiles.cv,
        coverLetter: selectedFiles.coverLetter,
        certificates: selectedFiles.certificates,
        extraDocuments: selectedFiles.extraDocuments
      },
      studentProfile: {
        name: studentProfile.name,
        email: studentProfile.email,
        major: studentProfile.major,
        semester: studentProfile.semester
      }
    };
    
    setApplications(prev => [...prev, newApplication]);
    setShowUploadModal(false);
    setSelectedFiles({
      cv: null,
      coverLetter: null,
      certificates: [],
      extraDocuments: []
    });
    setSelectedInternship(null);
    alert('Application submitted successfully!');
  };

  // profile update handler
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    setIsEditingProfile(false);
  };

  // Enhanced file upload handler with file type validation and size checks
  const handleFileUpload = (type, e) => {
    const files = e.target.files;
    const maxFileSize = 10 * 1024 * 1024; // 10MB max file size
    
    // File type validation
    const allowedTypes = {
      cv: ['.pdf', '.doc', '.docx'],
      coverLetter: ['.pdf', '.doc', '.docx'],
      certificates: ['.pdf', '.jpg', '.jpeg', '.png'],
      extraDocuments: ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png']
    };

    const validateFile = (file) => {
      // Check file size
      if (file.size > maxFileSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }

      // Check file type
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedTypes[type].includes(fileExtension)) {
        alert(`Invalid file type for ${file.name}. Allowed types: ${allowedTypes[type].join(', ')}`);
        return false;
      }

      return true;
    };

    if (type === 'certificates' || type === 'extraDocuments') {
      const validFiles = Array.from(files).filter(validateFile);
      setSelectedFiles(prev => ({
        ...prev,
        [type]: [...(prev[type] || []), ...validFiles]
      }));
    } else {
      if (files.length > 0 && validateFile(files[0])) {
        setSelectedFiles(prev => ({
          ...prev,
          [type]: files[0]
        }));
      }
    }
  };

  // Enhanced file removal handler
  const handleRemoveFile = (type, index) => {
    if (type === 'certificates' || type === 'extraDocuments') {
      setSelectedFiles(prev => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index)
      }));
    } else {
      setSelectedFiles(prev => ({
        ...prev,
        [type]: null
      }));
    }
  };

  // handle report submission
  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (reportForm.status === 'draft') {
      setReportForm(prev => ({ ...prev, status: 'submitted' }));
      alert('Report submitted for review!');
    } else if (reportForm.status === 'submitted') {
      setReportForm(prev => ({ ...prev, status: 'finalized' }));
      alert('Report finalized successfully!');
    }
    setShowReportModal(false);
  };

  // handle evaluation submission
  const handleEvaluationSubmit = (e) => {
    e.preventDefault();
    setEvaluationForm(prev => ({ ...prev, status: 'submitted' }));
    alert('Evaluation submitted successfully!');
    setShowEvaluationModal(false);
  };

  // handle report update
  const handleReportUpdate = (e) => {
    e.preventDefault();
    setReportForm(prev => ({ ...prev, status: 'draft' }));
    alert('Report updated successfully!');
    setShowReportModal(false);
  };

  // handle evaluation update
  const handleEvaluationUpdate = (e) => {
    e.preventDefault();
    setEvaluationForm(prev => ({ ...prev, status: 'draft' }));
    alert('Evaluation updated successfully!');
    setShowEvaluationModal(false);
  };

  // Handle PDF download
  const handleDownloadPDF = (type, data) => {
    // In a real application, this would generate and download a PDF
    // For now, we'll create a simple PDF-like view
    const content = document.createElement('div');
    content.innerHTML = `
      <h1>${data.title}</h1>
      <p>${data.introduction}</p>
      <p>${data.body}</p>
      <h2>Relevant Courses</h2>
      <ul>
        ${data.courses.map(course => `<li>${course}</li>`).join('')}
      </ul>
    `;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${data.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #2563eb; }
            h2 { color: #1d4ed8; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // handle report appeal
  const handleAppealSubmit = (e) => {
    e.preventDefault();
    setReportStatus(prev => ({
      ...prev,
      status: 'pending',
      appealMessage: ''
    }));
    alert('Appeal submitted successfully!');
  };

  // Add notification when report is viewed
  const handleReportView = (report) => {
    if (report.status === 'reviewed' && !notifications.some(n => n.reportId === report.id)) {
      const newNotification = {
        id: Date.now(),
        type: 'report_status',
        reportId: report.id,
        message: 'Your internship report has been reviewed.',
        read: false,
        timestamp: new Date().toISOString()
      };
      setNotifications(prev => [...prev, newNotification]);
    }
  };

  // Handle mark notification as read
  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      ).filter(notification => !notification.read) // Remove read notifications
    );
  };

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications([]); // Clear all notifications
  };

  // render profile section with enhanced features
  const renderProfile = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Student Profile</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowVideoModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-2"
          >
            <FaPlay className="text-sm" />
            <span>Watch Requirements</span>
          </button>
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isEditingProfile ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {isEditingProfile ? (
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Major</label>
            <select
              value={profileForm.major}
              onChange={(e) => setProfileForm(prev => ({ ...prev, major: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a major</option>
              {majors.map(major => (
                <option key={major.id} value={major.name}>
                  {major.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Semester</label>
            <select
              value={profileForm.semester}
              onChange={(e) => setProfileForm(prev => ({ ...prev, semester: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select semester</option>
              {Array.from({ length: 8 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Semester {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Interests</label>
            <textarea
              value={profileForm.jobInterests}
              onChange={(e) => setProfileForm(prev => ({ ...prev, jobInterests: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
              placeholder="Describe your job interests..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Previous Experience</label>
            <textarea
              value={profileForm.previousExperience}
              onChange={(e) => setProfileForm(prev => ({ ...prev, previousExperience: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
              placeholder="List your previous internships and part-time jobs..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">College Activities</label>
            <textarea
              value={profileForm.collegeActivities}
              onChange={(e) => setProfileForm(prev => ({ ...prev, collegeActivities: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="3"
              placeholder="List your college activities..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Save Changes
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1">{studentProfile.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1">{studentProfile.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Major</label>
            <p className="mt-1">{studentProfile.major}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Semester</label>
            <p className="mt-1">{studentProfile.semester}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Interests</label>
            <p className="mt-1">{studentProfile.jobInterests}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Previous Experience</label>
            <p className="mt-1">{studentProfile.previousExperience}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">College Activities</label>
            <p className="mt-1">{studentProfile.collegeActivities}</p>
          </div>
        </div>
      )}
    </div>
  );

  // Enhanced search and filter section
  const renderSearchAndFilter = () => (
    <div className="space-y-4 mb-6">
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search internships..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 border rounded p-2"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <select
          value={filterPaid}
          onChange={e => setFilterPaid(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All Compensation</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
        <select
          value={filterIndustry}
          onChange={e => setFilterIndustry(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All Industries</option>
          {industries.map(industry => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
        <select
          value={filterDuration}
          onChange={e => setFilterDuration(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All Durations</option>
          {durations.map(duration => (
            <option key={duration} value={duration}>
              {duration} {duration === 1 ? 'Month' : 'Months'}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Upcoming">Upcoming</option>
        </select>
      </div>
    </div>
  );

  // Enhanced applications section with better status display
  const renderApplications = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">My Applications</h3>
      {applications
        .filter(app => app.studentId === studentProfile.id)
        .map(app => {
          const internship = internships.find(i => i.id === app.internshipId);
          return (
            <div key={app.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{internship?.title}</h4>
                  <p className="text-sm text-gray-600">{internship?.companyName}</p>
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'Finalized' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.status}
                      </span>
                      {app.status === 'Pending' && (
                        <span className="text-sm text-gray-600">(Not yet seen)</span>
                      )}
                      {app.status === 'Finalized' && (
                        <span className="text-sm text-blue-600">(Top Applicant)</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Applied on: {new Date(app.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {app.status === 'Accepted' && (
                    <>
                      <button
                        onClick={() => setShowReportModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Submit Report
                      </button>
                      <button
                        onClick={() => setShowEvaluationModal(true)}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                      >
                        Evaluate Company
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );

  // render internship details modal
  const renderInternshipDetails = () => {
    if (!selectedInternship) return null;

    // Convert comma-separated skills string to array
    const skillsArray = selectedInternship.skills ? selectedInternship.skills.split(',').map(skill => skill.trim()) : [];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-blue-800">{selectedInternship.title}</h3>
            <button
              onClick={() => setSelectedInternship(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700">Company</h4>
              <p>{selectedInternship.companyName}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700">Description</h4>
              <p className="whitespace-pre-wrap">{selectedInternship.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700">Duration</h4>
                <p>{selectedInternship.duration} months</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Compensation</h4>
                <p>{selectedInternship.paid ? `Paid (${selectedInternship.salary})` : 'Unpaid'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Status</h4>
                <p className={`inline-block px-2 py-1 rounded text-sm ${
                  selectedInternship.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedInternship.status}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700">Required Skills</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {skillsArray.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setSelectedInternship(null)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApplyClick(selectedInternship);
                  setSelectedInternship(null);
                }}
                disabled={applications.some(a => a.internshipId === selectedInternship.id && a.studentId === studentProfile.id)}
                className={`px-4 py-2 rounded ${
                  applications.some(a => a.internshipId === selectedInternship.id && a.studentId === studentProfile.id)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white`}
              >
                {applications.some(a => a.internshipId === selectedInternship.id && a.studentId === studentProfile.id)
                  ? 'Applied'
                  : 'Apply Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // render report submission modal
  const renderReportModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold">
              {isEditingReport ? 'Edit Report' : 'View Report'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Status: <span className={`font-medium ${
                currentReport?.status === 'draft' ? 'text-yellow-600' :
                currentReport?.status === 'submitted' ? 'text-blue-600' :
                'text-green-600'
              }`}>
                {currentReport?.status?.charAt(0).toUpperCase() + currentReport?.status?.slice(1)}
              </span>
            </p>
          </div>
          <div className="flex space-x-2">
            {currentReport?.status !== 'finalized' && (
              <button
                onClick={() => setIsEditingReport(!isEditingReport)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                {isEditingReport ? 'Preview' : 'Edit'}
              </button>
            )}
            <button
              onClick={() => {
                setShowReportModal(false);
                setCurrentReport(null);
                setIsEditingReport(false);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        {isEditingReport ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            handleUpdateReport(currentReport);
            setIsEditingReport(false);
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={currentReport?.title}
                onChange={(e) => setCurrentReport({ ...currentReport, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Introduction</label>
              <textarea
                value={currentReport?.introduction}
                onChange={(e) => setCurrentReport({ ...currentReport, introduction: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="4"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Body</label>
              <textarea
                value={currentReport?.body}
                onChange={(e) => setCurrentReport({ ...currentReport, body: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="8"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Relevant Courses</label>
              <div className="grid grid-cols-2 gap-4">
                {courses
                  .filter(course => course.major === studentProfile.major)
                  .map(course => (
                    <label key={course.id} className="flex items-start space-x-2 p-2 border rounded hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={currentReport.courses.includes(course.id)}
                        onChange={(e) => {
                          const updatedCourses = e.target.checked
                            ? [...currentReport.courses, course.id]
                            : currentReport.courses.filter(id => id !== course.id);
                          setCurrentReport({ ...currentReport, courses: updatedCourses });
                        }}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium">{course.name}</p>
                        <p className="text-sm text-gray-600">{course.code} - Semester {course.semester}</p>
                      </div>
                    </label>
                  ))}
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => handleDeleteReport(currentReport.id)}
                className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50"
              >
                Delete Report
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
              {currentReport?.status === 'draft' && (
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateReport({ ...currentReport, status: 'submitted' });
                    setIsEditingReport(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Submit Report
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900">{currentReport?.title}</h4>
              <p className="text-sm text-gray-500">Last updated: {new Date(currentReport?.updatedAt).toLocaleString()}</p>
            </div>
            <div>
              <h5 className="font-medium text-gray-900">Introduction</h5>
              <p className="mt-2 text-gray-700 whitespace-pre-wrap">{currentReport?.introduction}</p>
            </div>
            <div>
              <h5 className="font-medium text-gray-900">Body</h5>
              <p className="mt-2 text-gray-700 whitespace-pre-wrap">{currentReport?.body}</p>
            </div>
            <div>
              <h5 className="font-medium text-gray-900">Relevant Courses</h5>
              <div className="mt-2 grid grid-cols-2 gap-4">
                {currentReport?.courses.map(courseId => {
                  const course = courses.find(c => c.id === courseId);
                  return course ? (
                    <div key={course.id} className="p-2 border rounded">
                      <p className="font-medium">{course.name}</p>
                      <p className="text-sm text-gray-600">{course.code} - Semester {course.semester}</p>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            {currentReport?.status === 'submitted' && (
              <div className="flex justify-end">
                <button
                  onClick={() => handleUpdateReport({ ...currentReport, status: 'finalized' })}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Finalize Report
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Enhanced file upload modal with better UI and validation messages
  const renderUploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold">Upload Documents</h3>
            <p className="text-sm text-gray-600 mt-1">
              {selectedInternship?.title} at {selectedInternship?.companyName}
            </p>
          </div>
          <button
            onClick={() => {
              setShowUploadModal(false);
              setSelectedFiles({
                cv: null,
                coverLetter: null,
                certificates: [],
                extraDocuments: []
              });
              setSelectedInternship(null);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* CV/Resume Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CV/Resume <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-2">
              <label className="flex-1 cursor-pointer">
                <div className="px-4 py-2 border-2 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                  <div className="flex items-center justify-center space-x-2">
                    <FaUpload className="text-gray-400" />
                    <span className="text-gray-600">
                      {selectedFiles.cv ? selectedFiles.cv.name : 'Upload CV'}
                    </span>
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload('cv', e)}
                  required
                />
              </label>
              {selectedFiles.cv && (
                <button
                  type="button"
                  onClick={() => handleRemoveFile('cv')}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {/* Cover Letter Section */}
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
                      {selectedFiles.coverLetter ? selectedFiles.coverLetter.name : 'Upload Cover Letter'}
                    </span>
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload('coverLetter', e)}
                />
              </label>
              {selectedFiles.coverLetter && (
                <button
                  type="button"
                  onClick={() => handleRemoveFile('coverLetter')}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {/* Certificates Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificates & Achievements
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
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={(e) => handleFileUpload('certificates', e)}
                />
              </label>
              {selectedFiles.certificates?.length > 0 && (
                <div className="space-y-2">
                  {selectedFiles.certificates.map((cert, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-600">{cert.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile('certificates', index)}
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

          {/* Extra Documents Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Documents
            </label>
            <div className="space-y-2">
              <label className="block cursor-pointer">
                <div className="px-4 py-2 border-2 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                  <div className="flex items-center justify-center space-x-2">
                    <FaUpload className="text-gray-400" />
                    <span className="text-gray-600">Upload Additional Documents</span>
                  </div>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                  multiple
                  onChange={(e) => handleFileUpload('extraDocuments', e)}
                />
              </label>
              {selectedFiles.extraDocuments?.length > 0 && (
                <div className="space-y-2">
                  {selectedFiles.extraDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-600">{doc.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile('extraDocuments', index)}
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

          <div className="mt-6">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Document Guidelines:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Maximum file size: 10MB per file</li>
                <li>• Supported formats: PDF, DOC, DOCX, PPT, PPTX, JPG, JPEG, PNG</li>
                <li>• Ensure all documents are clear and legible</li>
                <li>• Certificates should be scanned copies of originals</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                setShowUploadModal(false);
                setSelectedFiles({
                  cv: null,
                  coverLetter: null,
                  certificates: [],
                  extraDocuments: []
                });
                setSelectedInternship(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleFinalSubmit}
              disabled={!selectedFiles.cv}
              className={`px-4 py-2 rounded ${
                !selectedFiles.cv
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // render evaluation modal
  const renderEvaluationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold">Company Evaluation</h3>
            <p className="text-sm text-gray-600 mt-1">
              Status: <span className={`font-medium ${
                evaluationForm.status === 'draft' ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {evaluationForm.status.charAt(0).toUpperCase() + evaluationForm.status.slice(1)}
              </span>
            </p>
          </div>
          <button
            onClick={() => setShowEvaluationModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <form onSubmit={evaluationForm.status === 'submitted' ? handleEvaluationUpdate : handleEvaluationSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <div className="flex items-center space-x-2 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setEvaluationForm(prev => ({ ...prev, rating: star }))}
                  className={`text-2xl ${
                    star <= evaluationForm.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  disabled={evaluationForm.status === 'submitted'}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Would you recommend this company?</label>
            <div className="mt-1">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={evaluationForm.recommend}
                  onChange={() => setEvaluationForm(prev => ({ ...prev, recommend: true }))}
                  className="form-radio"
                  disabled={evaluationForm.status === 'submitted'}
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input
                  type="radio"
                  checked={!evaluationForm.recommend}
                  onChange={() => setEvaluationForm(prev => ({ ...prev, recommend: false }))}
                  className="form-radio"
                  disabled={evaluationForm.status === 'submitted'}
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Comments</label>
            <textarea
              value={evaluationForm.comments}
              onChange={(e) => setEvaluationForm(prev => ({ ...prev, comments: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="4"
              placeholder="Share your experience..."
              disabled={evaluationForm.status === 'submitted'}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowEvaluationModal(false)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            {evaluationForm.status === 'submitted' ? (
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Update Evaluation
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit Evaluation
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );

  // render suggested companies section
  const renderSuggestedCompanies = () => (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-xl font-semibold mb-4">Suggested Companies</h3>
      <div className="space-y-4">
        {mockSuggestedCompanies.map(company => (
          <div key={company.id} className="border rounded p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{company.name}</h4>
                <p className="text-sm text-gray-600">{company.industry}</p>
              </div>
              <div className="text-sm text-blue-600">
                {company.matchScore}% Match
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render internship history section
  const renderInternshipHistory = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Internship History</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search internships..."
            value={historySearchTerm}
            onChange={e => setHistorySearchTerm(e.target.value)}
            className="border rounded p-2"
          />
          <select
            value={historyFilter}
            onChange={e => setHistoryFilter(e.target.value)}
            className="border rounded p-2"
          >
            <option value="all">All Internships</option>
            <option value="current">Current Internships</option>
            <option value="completed">Completed Internships</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredHistory.map(internship => (
          <div key={internship.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{internship.title}</h4>
                <p className="text-sm text-gray-600">{internship.company}</p>
                <p className="text-sm text-gray-600">
                  {new Date(internship.startDate).toLocaleDateString()} - 
                  {internship.endDate ? new Date(internship.endDate).toLocaleDateString() : 'Present'}
                </p>
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    internship.status === 'current' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {internship.status === 'current' ? 'Current Intern' : 'Completed'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                {internship.status === 'completed' && (
                  <>
                    {internship.report && (
                      <button
                        onClick={() => {
                          setSelectedReport(internship.report);
                          setShowReportViewModal(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        View Report
                      </button>
                    )}
                    {internship.evaluation && (
                      <button
                        onClick={() => {
                          setEvaluationForm(internship.evaluation);
                          setShowEvaluationModal(true);
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                      >
                        View Evaluation
                      </button>
                    )}
                    <button
                      onClick={() => handleDownloadPDF('report', internship.report)}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Download PDF
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render report view modal
  const renderReportViewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">Internship Report</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => handleDownloadPDF('report', selectedReport)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Download PDF
            </button>
            <button
              onClick={() => setShowReportViewModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-700">Title</h4>
            <p>{selectedReport.title}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">Introduction</h4>
            <p className="whitespace-pre-wrap">{selectedReport.introduction}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">Body</h4>
            <p className="whitespace-pre-wrap">{selectedReport.body}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">Relevant Courses</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {selectedReport.courses.map((course, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">Status</h4>
            <span className={`px-2 py-1 rounded text-sm ${
              selectedReport.status === 'accepted' ? 'bg-green-100 text-green-800' :
              selectedReport.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">Submitted Date</h4>
            <p>{new Date(selectedReport.submittedDate).toLocaleDateString()}</p>
          </div>
          {renderReportStatus()}
        </div>
      </div>
    </div>
  );

  // Render report status and appeal section
  const renderReportStatus = () => (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h4 className="font-semibold mb-2">Report Status</h4>
      <div className="flex items-center space-x-2 mb-2">
        <span className={`px-2 py-1 rounded text-sm ${
          reportStatus.status === 'accepted' ? 'bg-green-100 text-green-800' :
          reportStatus.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          reportStatus.status === 'flagged' ? 'bg-orange-100 text-orange-800' :
          'bg-red-100 text-red-800'
        }`}>
          {reportStatus.status.charAt(0).toUpperCase() + reportStatus.status.slice(1)}
        </span>
      </div>
      
      {(reportStatus.status === 'flagged' || reportStatus.status === 'rejected') && (
        <div className="mt-2">
          <h5 className="font-medium text-gray-700">Reviewer Comments:</h5>
          <p className="text-gray-600 mt-1">{reportStatus.comments}</p>
          
          <form onSubmit={handleAppealSubmit} className="mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Appeal Message</label>
              <textarea
                value={reportStatus.appealMessage}
                onChange={(e) => setReportStatus(prev => ({ ...prev, appealMessage: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="4"
                placeholder="Explain why you believe the report should be reconsidered..."
                required
              />
            </div>
            <div className="mt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit Appeal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );

  // Render reports list section
  const renderReportsList = () => (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-xl font-semibold mb-4">My Reports</h3>
      <div className="space-y-4">
        <button
          onClick={handleCreateReport}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create New Report
        </button>
        {reports.map(report => (
          <div key={report.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-lg">{report.title || 'Untitled Report'}</h4>
                <p className="text-sm text-gray-600">
                  Last updated: {new Date(report.updatedAt).toLocaleString()}
                </p>
                <div className="mt-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    report.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    report.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setCurrentReport(report);
                  setShowReportModal(true);
                  setIsEditingReport(false);
                  handleReportView(report); // Add notification when viewing reviewed report
                }}
                className="px-4 py-2 text-blue-600 hover:text-blue-800"
              >
                View Report
              </button>
            </div>
          </div>
        ))}
        {reports.length === 0 && (
          <p className="text-center text-gray-500">No reports yet. Create your first report!</p>
        )}
      </div>
    </div>
  );

  // Render notifications panel
  const renderNotifications = () => (
    <div className="fixed bottom-4 right-4 w-80">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Notifications</h3>
          {notifications.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className="p-2 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="text-xs text-gray-500 hover:text-gray-700 ml-2"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-center text-gray-500 text-sm">No new notifications</p>
          )}
        </div>
      </div>
    </div>
  );

  // Render majors list section
  const renderMajorsList = () => (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-xl font-semibold mb-4">Available Majors</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {majors.map(major => (
          <div key={major.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-lg text-blue-800">{major.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{major.description}</p>
            <div className="mt-2">
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {major.semesters} Semesters
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render available courses section
  const renderAvailableCourses = () => (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Available Courses - {studentProfile.major}</h3>
        
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses
          .filter(course => course.major === studentProfile.major)
          .map(course => (
            <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-lg text-blue-800">{course.name}</h4>
              <p className="text-sm text-gray-600">{course.code}</p>
              <p className="text-sm text-gray-600 mt-1">{course.description}</p>
              <div className="mt-2">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  Semester {course.semester}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  // Render video modal
  const renderVideoModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold">Internship Requirements</h3>
            <p className="text-sm text-gray-600 mt-1">
              For {studentProfile.major} majors
            </p>
          </div>
          <button
            onClick={() => setShowVideoModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="aspect-w-16 aspect-h-9">
          <video
            controls
            className="w-full h-full rounded-lg"
            src={majorVideos[studentProfile.major]}
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="mt-4 bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Key Points:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Minimum duration requirements</li>
            <li>• Industry relevance to your major</li>
            <li>• Required technical skills</li>
            <li>• Documentation and reporting requirements</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
      <Link to="/" className="hover:underline">Home</Link>
      <span className="mx-2">/</span>
      <span className="text-gray-700">Student Dashboard</span>
      </nav>
      <h2 className="text-2xl font-bold text-blue-800 mb-6">
        Student Dashboard
      </h2>

      {/* Suggested Companies Section */}
      {activeTab === 'internships' && renderSuggestedCompanies()}

      {/* Navigation Tabs */}
      <div className="mb-6 border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('internships')}
            className={`py-2 px-1 ${
              activeTab === 'internships'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Browse Internships
          </button>
          <button
            onClick={() => setActiveTab('majors')}
            className={`py-2 px-1 ${
              activeTab === 'majors'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Majors
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 ${
              activeTab === 'history'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Internship History
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`py-2 px-1 ${
              activeTab === 'applications'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Applications
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 ${
              activeTab === 'profile'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`py-2 px-1 ${
              activeTab === 'courses'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Courses
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-2 px-1 ${
              activeTab === 'reports'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Reports
          </button>
        </nav>
      </div>

      {/* Content Sections */}
      {activeTab === 'internships' && (
        <>
          {renderSearchAndFilter()}
          {/* Internship List */}
          <ul className="space-y-4">
            {filtered.map(i => (
              <li
                key={i.id}
                className="flex justify-between items-center border rounded p-4 bg-white"
              >
                <div>
                  <h3 className="font-semibold">{i.title}</h3>
                  <p className="text-sm text-gray-600">{i.companyName}</p>
                  <p className="text-sm">
                    Duration: {i.duration} mo • {i.paid ? 'Paid' : 'Unpaid'} • {i.industry}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedInternship(i)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleApplyClick(i)}
                    disabled={applications.some(a => a.internshipId === i.id && a.studentId === studentProfile.id)}
                    className={`px-4 py-2 rounded ${
                      applications.some(a => a.internshipId === i.id && a.studentId === studentProfile.id)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                  >
                    {applications.some(a => a.internshipId === i.id && a.studentId === studentProfile.id)
                      ? 'Applied'
                      : 'Apply'}
                  </button>
                </div>
              </li>
            ))}

            {filtered.length === 0 && (
              <p className="text-gray-500 text-center">
                No internships found.
              </p>
            )}
          </ul>
        </>
      )}

      {activeTab === 'majors' && renderMajorsList()}
      {activeTab === 'history' && renderInternshipHistory()}
      {activeTab === 'profile' && renderProfile()}
      {activeTab === 'applications' && renderApplications()}
      {activeTab === 'courses' && renderAvailableCourses()}
      {activeTab === 'reports' && (
        <>
          {renderReportsList()}
          {showReportModal && renderReportModal()}
        </>
      )}
      {selectedInternship && renderInternshipDetails()}
      {showUploadModal && renderUploadModal()}
      {showReportViewModal && renderReportViewModal()}
      {showVideoModal && renderVideoModal()}
      {renderNotifications()}
    </div>
  );
}
