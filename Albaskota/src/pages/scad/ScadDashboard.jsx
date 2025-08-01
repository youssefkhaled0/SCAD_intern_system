// src/pages/scad/ScadDashboard.jsx
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompanies } from '../../context/CompanyContext';
import { useInternships } from '../../context/InternshipContext';
import { useInternshipCycles } from '../../context/InternshipCycleContext';
import { useNotify } from '../../context/NotificationContext';
import { useStudentReports } from '../../context/StudentReportContext';
import { FaCheck, FaTimes, FaBuilding, FaIndustry, FaEnvelope, FaFileAlt, FaInfoCircle, FaSyncAlt, FaFilter, FaBriefcase, FaMoneyBill, FaClock, FaSearch, FaEye, FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaGraduationCap, FaUser, FaFileUpload, FaCalendarCheck, FaUsers, FaChalkboardTeacher, FaDownload, FaFlag } from 'react-icons/fa';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function ScadDashboard() {
  const { companies, updateCompanyStatus } = useCompanies();
  const { internships } = useInternships();
  const { cycles, addCycle, updateCycle, closeCycle, activateCycle, deleteCycle } = useInternshipCycles();
  const { notify } = useNotify();
  const { students, reports } = useStudentReports();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('companies');
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [internshipSearch, setInternshipSearch] = useState('');
  const [filterPaid, setFilterPaid] = useState('all');
  const [filterDuration, setFilterDuration] = useState('all');
  const [showCycleModal, setShowCycleModal] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [cycleForm, setCycleForm] = useState({
    title: '',
    startDate: '',
    endDate: '',
    description: '',
    isGlobal: true,
    programs: []
  });


  const simulateIncomingCall = () => {
    setIncomingCall(true);
    setTimeout(() => {
      setIncomingCall(false);
    }, 10000); // auto-dismiss after 10s
  };

  // Appointments & Workshops state
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      type: 'appointment',
      title: 'Internship Interview Slot',
      date: '2024-07-10T10:00',
      status: 'upcoming',
      attendees: ['John Doe', 'Jane Smith'],
      description: 'Interview slot for internship applicants.'
    },
    {
      id: 2,
      type: 'workshop',
      title: 'Resume Building Workshop',
      date: '2024-07-15T14:00',
      status: 'upcoming',
      attendees: ['John Doe'],
      description: 'Tips and best practices for building a strong resume.'
    },
    {
      id: 3,
      type: 'workshop',
      title: 'Career Planning Seminar',
      date: '2024-06-01T09:00',
      status: 'completed',
      attendees: ['Jane Smith'],
      description: 'Seminar on career planning and goal setting.'
    }
  ]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    type: 'appointment',
    title: '',
    date: '',
    status: 'upcoming',
    attendees: [],
    description: ''
  });
  const [eventSearch, setEventSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('all');

  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilter, setStudentFilter] = useState('all');
  const [reportSearch, setReportSearch] = useState('');
  const [reportMajorFilter, setReportMajorFilter] = useState('all');
  const [reportStatusFilter, setReportStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const industries = useMemo(
    () => Array.from(new Set(companies.map(c => c.industry))),
    [companies]
  );

  const durations = useMemo(
    () => Array.from(new Set(internships.map(i => i.duration))),
    [internships]
  );

  const filtered = useMemo(() => {
    return companies
      .filter(c =>
        c.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(c =>
        filterIndustry === 'all' ? true : c.industry === filterIndustry
      )
      .filter(c =>
        filterStatus === 'all' ? true : c.status === filterStatus
      );
  }, [companies, searchTerm, filterIndustry, filterStatus]);

  const filteredInternships = useMemo(() => {
    return internships
      .filter(i =>
        i.title.toLowerCase().includes(internshipSearch.toLowerCase()) ||
        (i.companyName || '').toLowerCase().includes(internshipSearch.toLowerCase())
      )
      .filter(i =>
        filterIndustry === 'all' ? true : i.industry === filterIndustry
      )
      .filter(i =>
        filterPaid === 'all' ? true : filterPaid === 'paid' ? i.paid : !i.paid
      )
      .filter(i =>
        filterDuration === 'all' ? true : i.duration === parseInt(filterDuration)
      );
  }, [internships, internshipSearch, filterIndustry, filterPaid, filterDuration]);

  // Summary bar for cycles
  const cycleSummary = useMemo(() => ({
    total: cycles.length,
    active: cycles.filter(c => c.status === 'active').length,
    upcoming: cycles.filter(c => new Date(c.startDate) > new Date()).length,
    closed: cycles.filter(c => c.status === 'closed').length
  }), [cycles]);

  // Filter cycles
  const filteredCycles = useMemo(() => {
    return cycles.filter(cycle => {
      const matchesSearch = cycle.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' ? true : cycle.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [cycles, searchTerm, filterStatus]);

  // Summary cards
  const eventSummary = useMemo(() => ({
    total: appointments.length,
    upcoming: appointments.filter(e => e.status === 'upcoming').length,
    completed: appointments.filter(e => e.status === 'completed').length,
    cancelled: appointments.filter(e => e.status === 'cancelled').length,
    workshops: appointments.filter(e => e.type === 'workshop').length,
    appointments: appointments.filter(e => e.type === 'appointment').length
  }), [appointments]);

  // Students by program
  const studentsByProgram = students.reduce((acc, s) => {
    acc[s.program] = (acc[s.program] || 0) + 1;
    return acc;
  }, {});
  const studentsByProgramData = {
    labels: Object.keys(studentsByProgram),
    datasets: [{
      label: 'Students',
      data: Object.values(studentsByProgram),
      backgroundColor: ['#2563eb', '#10b981', '#f59e42', '#f43f5e', '#a21caf']
    }]
  };

  // Reports by status
  const reportStatusCounts = reports.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});
  const reportsByStatusData = {
    labels: Object.keys(reportStatusCounts),
    datasets: [{
      label: 'Reports',
      data: Object.values(reportStatusCounts),
      backgroundColor: ['#2563eb', '#f59e42', '#f43f5e', '#10b981']
    }]
  };

  // Internships by industry
  const internshipsByIndustry = internships.reduce((acc, i) => {
    acc[i.industry] = (acc[i.industry] || 0) + 1;
    return acc;
  }, {});
  const internshipsByIndustryData = {
    labels: Object.keys(internshipsByIndustry),
    datasets: [{
      label: 'Internships',
      data: Object.values(internshipsByIndustry),
      backgroundColor: ['#2563eb', '#10b981', '#f59e42', '#f43f5e', '#a21caf']
    }]
  };

  // Trends over time (mock: reports submitted per month)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const reportsByMonth = Array(12).fill(0);
  reports.forEach(r => {
    const d = new Date(r.submittedDate);
    reportsByMonth[d.getMonth()]++;
  });
  const reportsTrendData = {
    labels: months,
    datasets: [{
      label: 'Reports Submitted',
      data: reportsByMonth,
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37,99,235,0.2)',
      tension: 0.3,
      fill: true
    }]
  };

  // Fix: Define stats for statistics tab
  const stats = {
    totalStudents: students.length,
    totalCompanies: companies.length,
    totalInternships: internships.length,
    totalReports: reports.length,
    approvalRate: reports.length ? Math.round((reports.filter(r => r.status === 'approved').length / reports.length) * 100) : 0,
    activeCycles: cycles.filter(c => c.status === 'active').length
  };

  // Fix: Define filteredEvents for events tab
  const filteredEvents = appointments.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(eventSearch.toLowerCase());
    const matchesStatus = eventFilter === 'all' ? true : e.status === eventFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.email.toLowerCase().includes(studentSearch.toLowerCase());
      const matchesStatus = studentFilter === 'all' ? true : student.internshipStatus === studentFilter;
      return matchesSearch && matchesStatus;
    });
  }, [students, studentSearch, studentFilter]);

  // Filter reports
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(reportSearch.toLowerCase());
      const matchesMajor = reportMajorFilter === 'all' ? true : report.studentMajor === reportMajorFilter;
      const matchesStatus = reportStatusFilter === 'all' ? true : report.status === reportStatusFilter;
      return matchesSearch && matchesMajor && matchesStatus;
    });
  }, [reports, reportSearch, reportMajorFilter, reportStatusFilter]);

  // Define available majors
  const majors = [
    { id: 1, name: 'Computer Science' },
    { id: 2, name: 'Information Systems' },
    { id: 3, name: 'Computer Engineering' },
    { id: 4, name: 'Data Science' },
    { id: 5, name: 'Software Engineering' }
  ];

  // Add handleDownloadPDF function
  const handleDownloadPDF = (type, item) => {
    // Mock function for now - implement actual PDF download logic
    console.log(`Downloading ${type} for:`, item);
    notify('success', `${type.charAt(0).toUpperCase() + type.slice(1)} download started`);
  };

  const handleAccept = company => {
    updateCompanyStatus(company.id, 'Accepted');
    notify('success', `Company "${company.companyName}" was accepted.`);
  };

  const handleReject = company => {
    updateCompanyStatus(company.id, 'Rejected');
    notify('success', `Company "${company.companyName}" was rejected.`);
  };

  // Handle cycle form submission
  const handleCycleSubmit = (e) => {
    e.preventDefault();
    if (selectedCycle) {
      updateCycle(selectedCycle.id, cycleForm);
    } else {
      addCycle(cycleForm);
    }
    setShowCycleModal(false);
    setSelectedCycle(null);
    setCycleForm({
      title: '',
      startDate: '',
      endDate: '',
      description: '',
      isGlobal: true,
      programs: []
    });
  };

  // Internship details modal
  const renderInternshipDetails = () => {
    if (!selectedInternship) return null;
    const skillsArray = selectedInternship.skills ? selectedInternship.skills.split(',').map(s => s.trim()) : [];
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
              <p>{selectedInternship.description}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <h4 className="font-semibold text-gray-700">Duration</h4>
                <p>{selectedInternship.duration} months</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Compensation</h4>
                <p>{selectedInternship.paid ? 'Paid' : 'Unpaid'}{selectedInternship.paid && selectedInternship.salary ? ` (${selectedInternship.salary})` : ''}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Required Skills</h4>
              <ul className="flex flex-wrap gap-2 mt-1">
                {skillsArray.map((skill, idx) => (
                  <li key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{skill}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Status</h4>
              <span className={
                'px-2 py-1 rounded text-xs ' +
                (selectedInternship.status === 'Active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-200 text-gray-700')
              }>
                {selectedInternship.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render cycle modal
  const renderCycleModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-blue-800">
            {selectedCycle ? 'Edit Internship Cycle' : 'Create Internship Cycle'}
          </h3>
          <button
            onClick={() => {
              setShowCycleModal(false);
              setSelectedCycle(null);
              setCycleForm({
                title: '',
                startDate: '',
                endDate: '',
                description: '',
                isGlobal: true,
                programs: []
              });
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleCycleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Title *</label>
            <input
              type="text"
              required
              value={cycleForm.title}
              onChange={e => setCycleForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border rounded p-2"
              placeholder="e.g., Summer 2024"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={cycleForm.startDate}
                onChange={e => setCycleForm(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">End Date *</label>
              <input
                type="date"
                required
                value={cycleForm.endDate}
                onChange={e => setCycleForm(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full border rounded p-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea
              value={cycleForm.description}
              onChange={e => setCycleForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border rounded p-2"
              rows="3"
              placeholder="Describe the internship cycle..."
            />
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={cycleForm.isGlobal}
                onChange={e => setCycleForm(prev => ({ ...prev, isGlobal: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm font-semibold">Global Cycle (All Programs)</span>
            </label>
          </div>
          {!cycleForm.isGlobal && (
            <div>
              <label className="block text-sm font-semibold mb-1">Programs</label>
              <select
                multiple
                value={cycleForm.programs}
                onChange={e => setCycleForm(prev => ({
                  ...prev,
                  programs: Array.from(e.target.selectedOptions, option => option.value)
                }))}
                className="w-full border rounded p-2"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Systems">Information Systems</option>
                <option value="Computer Engineering">Computer Engineering</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple programs</p>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setShowCycleModal(false);
                setSelectedCycle(null);
                setCycleForm({
                  title: '',
                  startDate: '',
                  endDate: '',
                  description: '',
                  isGlobal: true,
                  programs: []
                });
              }}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {selectedCycle ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Render cycles tab
  const renderCyclesTab = () => (
    <div>
      {/* Summary Bar */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded shadow text-sm">
          <FaCalendarAlt /> Total: <span className="font-bold">{cycleSummary.total}</span>
        </div>
        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded shadow text-sm">
          <FaCheck /> Active: <span className="font-bold">{cycleSummary.active}</span>
        </div>
        <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow text-sm">
          <FaInfoCircle /> Upcoming: <span className="font-bold">{cycleSummary.upcoming}</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded shadow text-sm">
          <FaTimes /> Closed: <span className="font-bold">{cycleSummary.closed}</span>
        </div>
        <button
          onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded shadow text-sm hover:bg-gray-200"
          title="Clear Filters"
        >
          <FaSyncAlt /> Clear Filters
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search cycles..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] border rounded p-2"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
        <button
          onClick={() => {
            setSelectedCycle(null);
            setCycleForm({
              title: '',
              startDate: '',
              endDate: '',
              description: '',
              isGlobal: true,
              programs: []
            });
            setShowCycleModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FaPlus /> Create Cycle
        </button>
      </div>

      {/* Cycles Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border"><FaCalendarAlt className="inline mr-1" /> Title</th>
              <th className="p-3 border">Duration</th>
              <th className="p-3 border"><FaGraduationCap className="inline mr-1" /> Programs</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCycles.length > 0 ? (
              filteredCycles.map(cycle => (
                <tr key={cycle.id} className="hover:bg-gray-50">
                  <td className="p-3 border">
                    <div className="font-medium">{cycle.title}</div>
                    <div className="text-sm text-gray-500">{cycle.description}</div>
                  </td>
                  <td className="p-3 border">
                    {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 border">
                    {cycle.isGlobal ? (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">All Programs</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {cycle.programs.map(program => (
                          <span key={program} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                            {program}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-3 border">
                    <span className={
                      'px-2 py-1 rounded text-xs ' +
                      (cycle.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-200 text-gray-700')
                    }>
                      {cycle.status}
                    </span>
                  </td>
                  <td className="p-3 border space-x-2">
                    <button
                      onClick={() => {
                        setSelectedCycle(cycle);
                        setCycleForm({
                          title: cycle.title,
                          startDate: cycle.startDate,
                          endDate: cycle.endDate,
                          description: cycle.description,
                          isGlobal: cycle.isGlobal,
                          programs: cycle.programs
                        });
                        setShowCycleModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Cycle"
                    >
                      <FaEdit />
                    </button>
                    {cycle.status === 'active' ? (
                      <button
                        onClick={() => closeCycle(cycle.id)}
                        className="text-yellow-600 hover:text-yellow-800"
                        title="Close Cycle"
                      >
                        <FaTimes />
                      </button>
                    ) : (
                      <button
                        onClick={() => activateCycle(cycle.id)}
                        className="text-green-600 hover:text-green-800"
                        title="Activate Cycle"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this cycle?')) {
                          deleteCycle(cycle.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Cycle"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No internship cycles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // --- Render Statistics Tab ---
  const renderStatisticsTab = () => (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded shadow p-6 flex items-center gap-4">
          <FaUser className="text-3xl text-blue-600" />
          <div>
            <div className="text-gray-500 text-sm">Total Students</div>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
          </div>
        </div>
        <div className="bg-white rounded shadow p-6 flex items-center gap-4">
          <FaBuilding className="text-3xl text-green-600" />
          <div>
            <div className="text-gray-500 text-sm">Total Companies</div>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
          </div>
        </div>
        <div className="bg-white rounded shadow p-6 flex items-center gap-4">
          <FaBriefcase className="text-3xl text-yellow-600" />
          <div>
            <div className="text-gray-500 text-sm">Total Internships</div>
            <div className="text-2xl font-bold">{stats.totalInternships}</div>
          </div>
        </div>
        <div className="bg-white rounded shadow p-6 flex items-center gap-4">
          <FaFileAlt className="text-3xl text-purple-600" />
          <div>
            <div className="text-gray-500 text-sm">Total Reports</div>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
          </div>
        </div>
        <div className="bg-white rounded shadow p-6 flex items-center gap-4">
          <FaCheck className="text-3xl text-blue-600" />
          <div>
            <div className="text-gray-500 text-sm">Approval Rate</div>
            <div className="text-2xl font-bold">{stats.approvalRate}%</div>
          </div>
        </div>
        <div className="bg-white rounded shadow p-6 flex items-center gap-4">
          <FaCalendarAlt className="text-3xl text-pink-600" />
          <div>
            <div className="text-gray-500 text-sm">Active Cycles</div>
            <div className="text-2xl font-bold">{stats.activeCycles}</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded shadow p-6">
          <div className="font-semibold mb-2 flex items-center gap-2"><FaUser /> Students by Program</div>
          <Pie data={studentsByProgramData} />
        </div>
        <div className="bg-white rounded shadow p-6">
          <div className="font-semibold mb-2 flex items-center gap-2"><FaFileAlt /> Reports by Status</div>
          <Pie data={reportsByStatusData} />
        </div>
        <div className="bg-white rounded shadow p-6">
          <div className="font-semibold mb-2 flex items-center gap-2"><FaBriefcase /> Internships by Industry</div>
          <Bar data={internshipsByIndustryData} options={{ plugins: { legend: { display: false } } }} />
        </div>
        <div className="bg-white rounded shadow p-6">
          <div className="font-semibold mb-2 flex items-center gap-2"><FaFileUpload /> Reports Submitted (Monthly)</div>
          <Line data={reportsTrendData} />
        </div>
      </div>
    </div>
  );

  // Handle event form submit
  const handleEventSubmit = e => {
    e.preventDefault();
    if (selectedEvent) {
      setAppointments(prev => prev.map(ev => ev.id === selectedEvent.id ? { ...selectedEvent, ...eventForm } : ev));
      setSelectedEvent(null);
    } else {
      setAppointments(prev => [
        ...prev,
        { ...eventForm, id: Date.now() }
      ]);
    }
    setShowEventModal(false);
    setEventForm({ type: 'appointment', title: '', date: '', status: 'upcoming', attendees: [], description: '' });
  };

  // Render event modal
  const renderEventModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-blue-800">{selectedEvent ? 'Edit' : 'Create'} {eventForm.type === 'workshop' ? 'Workshop' : 'Appointment'}</h3>
          <button
            onClick={() => {
              setShowEventModal(false);
              setSelectedEvent(null);
              setEventForm({ type: 'appointment', title: '', date: '', status: 'upcoming', attendees: [], description: '' });
            }}
            className="text-gray-500 hover:text-gray-700"
          >✕</button>
        </div>
        <form onSubmit={handleEventSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Type</label>
            <select
              value={eventForm.type}
              onChange={e => setEventForm(prev => ({ ...prev, type: e.target.value }))}
              className="w-full border rounded p-2"
            >
              <option value="appointment">Appointment</option>
              <option value="workshop">Workshop</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Title *</label>
            <input
              type="text"
              required
              value={eventForm.title}
              onChange={e => setEventForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border rounded p-2"
              placeholder="e.g., Resume Workshop"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Date & Time *</label>
            <input
              type="datetime-local"
              required
              value={eventForm.date}
              onChange={e => setEventForm(prev => ({ ...prev, date: e.target.value }))}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea
              value={eventForm.description}
              onChange={e => setEventForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border rounded p-2"
              rows="3"
              placeholder="Describe the event..."
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setShowEventModal(false);
                setSelectedEvent(null);
                setEventForm({ type: 'appointment', title: '', date: '', status: 'upcoming', attendees: [], description: '' });
              }}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >Cancel</button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >{selectedEvent ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );

  // Render Appointments & Workshops tab
  const renderEventsTab = () => (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded shadow p-6 flex items-center gap-4">
          <FaCalendarCheck className="text-3xl text-blue-600" />
          <div>
            <div className="text-gray-500 text-sm">Total Events</div>
            <div className="text-2xl font-bold">{eventSummary.total}</div>
          </div>
        </div>
        <div className="bg-white rounded shadow p-6 flex items-center gap-4">
          <FaCheck className="text-3xl text-green-600" />
          <div>
            <div className="text-gray-500 text-sm">Upcoming</div>
            <div className="text-2xl font-bold">{eventSummary.upcoming}</div>
          </div>
        </div>
        <div className="bg-white rounded shadow p-6 flex items-center gap-4">
          <FaTimes className="text-3xl text-red-600" />
          <div>
            <div className="text-gray-500 text-sm">Cancelled</div>
            <div className="text-2xl font-bold">{eventSummary.cancelled}</div>
          </div>
        </div>
        <div className="bg-white rounded shadow p-6 flex items-center gap-4">
          <FaChalkboardTeacher className="text-3xl text-purple-600" />
          <div>
            <div className="text-gray-500 text-sm">Workshops</div>
            <div className="text-2xl font-bold">{eventSummary.workshops}</div>
          </div>
        </div>
        <div className="bg-white rounded shadow p-6 flex items-center gap-4">
          <FaUsers className="text-3xl text-yellow-600" />
          <div>
            <div className="text-gray-500 text-sm">Appointments</div>
            <div className="text-2xl font-bold">{eventSummary.appointments}</div>
          </div>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search events..."
          value={eventSearch}
          onChange={e => setEventSearch(e.target.value)}
          className="flex-1 min-w-[200px] border rounded p-2"
        />
        <select
          value={eventFilter}
          onChange={e => setEventFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All Statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          onClick={() => {
            setSelectedEvent(null);
            setEventForm({ type: 'appointment', title: '', date: '', status: 'upcoming', attendees: [], description: '' });
            setShowEventModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FaPlus /> Create Event
        </button>
      </div>
      {/* Events Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Type</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Date & Time</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Attendees</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map(ev => (
                <tr key={ev.id} className="hover:bg-gray-50">
                  <td className="p-3 border">
                    {ev.type === 'workshop' ? (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Workshop</span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Appointment</span>
                    )}
                  </td>
                  <td className="p-3 border font-medium">{ev.title}</td>
                  <td className="p-3 border">{new Date(ev.date).toLocaleString()}</td>
                  <td className="p-3 border">
                    <span className={
                      'px-2 py-1 rounded text-xs ' +
                      (ev.status === 'upcoming'
                        ? 'bg-green-100 text-green-800'
                        : ev.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800')
                    }>
                      {ev.status}
                    </span>
                  </td>
                  <td className="p-3 border">
                    <div className="flex flex-wrap gap-1">
                      {ev.attendees.map(a => (
                        <span key={a} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{a}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 border space-x-2">
                    <button
                      onClick={() => {
                        setSelectedEvent(ev);
                        setEventForm({ ...ev });
                        setShowEventModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Event"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this event?')) {
                          setAppointments(prev => prev.filter(e => e.id !== ev.id));
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Event"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showEventModal && renderEventModal()}
    </div>
  );

  // Render student modal
  const renderStudentModal = () => {
    if (!selectedStudent) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-blue-800">{selectedStudent.name}</h3>
            <button
              onClick={() => {
                setSelectedStudent(null);
                setShowStudentModal(false);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700">Email</h4>
                <p>{selectedStudent.email}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Major</h4>
                <p>{selectedStudent.major}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Semester</h4>
                <p>{selectedStudent.semester}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Internship Status</h4>
                <span className={
                  'px-2 py-1 rounded text-xs ' +
                  (selectedStudent.internshipStatus === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : selectedStudent.internshipStatus === 'Completed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800')
                }>
                  {selectedStudent.internshipStatus}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Reports</h4>
              <div className="space-y-2">
                {reports
                  .filter(report => report.studentId === selectedStudent.id)
                  .map(report => (
                    <div key={report.id} className="border rounded p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{report.title}</p>
                        <p className="text-sm text-gray-600">
                          Submitted: {new Date(report.submittedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={
                          'px-2 py-1 rounded text-xs ' +
                          (report.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : report.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : report.status === 'flagged'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800')
                        }>
                          {report.status}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setShowReportModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Report"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render report modal
  const renderReportModal = () => {
    if (!selectedReport) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-blue-800">{selectedReport.title}</h3>
              <p className="text-sm text-gray-600">
                By {selectedReport.studentName} ({selectedReport.studentMajor})
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDownloadPDF('report', selectedReport)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center space-x-1"
                title="Download Report"
              >
                <FaDownload className="text-sm" />
                <span>Download</span>
              </button>
              <button
                onClick={() => {
                  setSelectedReport(null);
                  setShowReportModal(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className={
                  'px-3 py-1 rounded text-sm font-medium ' +
                  (selectedReport.status === 'accepted'
                    ? 'bg-green-100 text-green-800'
                    : selectedReport.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : selectedReport.status === 'flagged'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-red-100 text-red-800')
                }>
                  {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
                </span>
                <span className="text-sm text-gray-600">
                  Submitted: {new Date(selectedReport.submittedDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Introduction</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{selectedReport.introduction}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Body</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{selectedReport.body}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Relevant Courses</h4>
              <div className="flex flex-wrap gap-2">
                {selectedReport.courses.map((course, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {course}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Attachments</h4>
              <div className="space-y-2">
                {selectedReport.attachments?.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between border rounded p-2">
                    <span>{attachment.name}</span>
                    <button
                      onClick={() => handleDownloadPDF('attachment', attachment)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Download Attachment"
                    >
                      <FaDownload />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Students & Reports tab
  const renderStudentsAndReportsTab = () => (
    <div className="space-y-8">
      {/* Students Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaUsers /> Students
        </h3>
        
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search students..."
            value={studentSearch}
            onChange={e => setStudentSearch(e.target.value)}
            className="flex-1 min-w-[200px] border rounded p-2"
          />
          <select
            value={studentFilter}
            onChange={e => setStudentFilter(e.target.value)}
            className="border rounded p-2"
          >
            <option value="all">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Major</th>
                <th className="p-3 border">Semester</th>
                <th className="p-3 border">Internship Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{student.name}</td>
                  <td className="p-3 border">{student.email}</td>
                  <td className="p-3 border">{student.major}</td>
                  <td className="p-3 border">{student.semester}</td>
                  <td className="p-3 border">
                    <span className={
                      'px-2 py-1 rounded text-xs ' +
                      (student.internshipStatus === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : student.internshipStatus === 'Completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800')
                    }>
                      {student.internshipStatus}
                    </span>
                  </td>
                  <td className="p-3 border">
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setShowStudentModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Profile"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reports Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaFileAlt /> Internship Reports
        </h3>
        
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search reports..."
            value={reportSearch}
            onChange={e => setReportSearch(e.target.value)}
            className="flex-1 min-w-[200px] border rounded p-2"
          />
          <select
            value={reportMajorFilter}
            onChange={e => setReportMajorFilter(e.target.value)}
            className="border rounded p-2"
          >
            <option value="all">All Majors</option>
            {majors.map(major => (
              <option key={major.id} value={major.name}>{major.name}</option>
            ))}
          </select>
          <select
            value={reportStatusFilter}
            onChange={e => setReportStatusFilter(e.target.value)}
            className="border rounded p-2"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="flagged">Flagged</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Student</th>
                <th className="p-3 border">Major</th>
                <th className="p-3 border">Submitted Date</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map(report => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{report.title}</td>
                  <td className="p-3 border">{report.studentName}</td>
                  <td className="p-3 border">{report.studentMajor}</td>
                  <td className="p-3 border">
                    {new Date(report.submittedDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 border">
                    <span className={
                      'px-2 py-1 rounded text-xs ' +
                      (report.status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : report.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : report.status === 'flagged'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800')
                    }>
                      {report.status}
                    </span>
                  </td>
                  <td className="p-3 border space-x-2">
                    <button
                      onClick={() => {
                        setSelectedReport(report);
                        setShowReportModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Report"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDownloadPDF('report', report)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Download Report"
                    >
                      <FaDownload />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <nav aria-label="breadcrumb" className="mb-4 text-sm text-gray-600">
        <ol className="flex space-x-2">
          <li><Link to="/" className="hover:underline">Home</Link></li>
          <li>/</li>
          <li>SCAD Dashboard</li>
        </ol>
      </nav>

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaBuilding className="text-blue-600" /> SCAD Office Dashboard
      </h2>

      <div className="mb-8 flex gap-4">
        <button
          onClick={() => setActiveTab('companies')}
          className={`px-4 py-2 rounded ${activeTab === 'companies' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Companies
        </button>
        <button
          onClick={() => setActiveTab('internships')}
          className={`px-4 py-2 rounded ${activeTab === 'internships' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Internships
        </button>
        <button
          onClick={() => setActiveTab('cycles')}
          className={`px-4 py-2 rounded ${activeTab === 'cycles' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Internship Cycles
        </button>
        <button
          onClick={() => setActiveTab('statistics')}
          className={`px-4 py-2 rounded ${activeTab === 'statistics' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Statistics
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded ${activeTab === 'events' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Appointments & Workshops
        </button>
        <button
          onClick={() => setActiveTab('students-reports')}
          className={`px-4 py-2 rounded ${activeTab === 'students-reports' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Students & Reports
        </button>
      </div>

      {activeTab === 'companies' && (
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by company name…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[200px] border rounded p-2"
          />
          <select
            value={filterIndustry}
            onChange={e => setFilterIndustry(e.target.value)}
            className="border rounded p-2"
          >
            <option value="all">All Industries</option>
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="border rounded p-2"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      )}

      {activeTab === 'companies' && (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border"><FaBuilding className="inline mr-1" /> Name</th>
                <th className="p-3 border"><FaIndustry className="inline mr-1" /> Industry</th>
                <th className="p-3 border">Size</th>
                <th className="p-3 border"><FaEnvelope className="inline mr-1" /> Email</th>
                <th className="p-3 border"><FaFileAlt className="inline mr-1" /> Proof Docs</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{c.companyName}</td>
                    <td className="p-3 border">{c.industry}</td>
                    <td className="p-3 border">{c.companySize}</td>
                    <td className="p-3 border">{c.companyEmail}</td>
                    <td className="p-3 border">
                      {c.proofDocs instanceof Blob ? (
                        <a
                          href={URL.createObjectURL(c.proofDocs)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                          title="View Proof Document"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-500">No document</span>
                      )}
                    </td>
                    <td className="p-3 border">
                      <span
                        className={
                          'px-2 py-1 rounded text-xs ' +
                          (c.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : c.status === 'Accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800')
                        }
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 border space-x-2">
                      {c.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleAccept(c)}
                            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                            title="Accept Company"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleReject(c)}
                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                            title="Reject Company"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      <Link
                        to={`/scad/company/${c.id}`}
                        className="text-blue-600 hover:underline"
                        title="View Details"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">
                    No companies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'internships' && (
        <div>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by job title or company name…"
              value={internshipSearch}
              onChange={e => setInternshipSearch(e.target.value)}
              className="flex-1 min-w-[200px] border rounded p-2"
            />
            <select
              value={filterIndustry}
              onChange={e => setFilterIndustry(e.target.value)}
              className="border rounded p-2"
            >
              <option value="all">All Industries</option>
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
            <select
              value={filterPaid}
              onChange={e => setFilterPaid(e.target.value)}
              className="border rounded p-2"
            >
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
            <select
              value={filterDuration}
              onChange={e => setFilterDuration(e.target.value)}
              className="border rounded p-2"
            >
              <option value="all">All Durations</option>
              {durations.map(d => (
                <option key={d} value={d}>{d} months</option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border"><FaBriefcase className="inline mr-1" /> Job Title</th>
                  <th className="p-3 border"><FaBuilding className="inline mr-1" /> Company</th>
                  <th className="p-3 border"><FaIndustry className="inline mr-1" /> Industry</th>
                  <th className="p-3 border"><FaClock className="inline mr-1" /> Duration</th>
                  <th className="p-3 border"><FaMoneyBill className="inline mr-1" /> Paid</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInternships.length > 0 ? (
                  filteredInternships.map(i => (
                    <tr key={i.id} className="hover:bg-gray-50">
                      <td className="p-3 border">{i.title}</td>
                      <td className="p-3 border">{i.companyName || '-'}</td>
                      <td className="p-3 border">{i.industry || '-'}</td>
                      <td className="p-3 border">{i.duration} mo</td>
                      <td className="p-3 border">{i.paid ? 'Yes' : 'No'}</td>
                      <td className="p-3 border">
                        <span className={
                          'px-2 py-1 rounded text-xs ' +
                          (i.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-200 text-gray-700')
                        }>
                          {i.status}
                        </span>
                      </td>
                      <td className="p-3 border">
                        <button
                          onClick={() => setSelectedInternship(i)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      No internships found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {renderInternshipDetails()}
        </div>
      )}

      {activeTab === 'cycles' && renderCyclesTab()}

      {activeTab === 'statistics' && renderStatisticsTab()}

      {activeTab === 'events' && renderEventsTab()}

      {activeTab === 'students-reports' && renderStudentsAndReportsTab()}

      {showCycleModal && renderCycleModal()}
      {showStudentModal && renderStudentModal()}
      {showReportModal && renderReportModal()}
    </div>
  );
}