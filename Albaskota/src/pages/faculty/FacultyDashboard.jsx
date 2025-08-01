// src/pages/faculty/FacultyDashboard.jsx
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';
import { useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { FaCheck, FaCommentDots, FaExclamationTriangle, FaFileAlt, FaFilter, FaGraduationCap, FaInfoCircle, FaSearch, FaStar, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useStudentReports } from '../../context/StudentReportContext';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend);

export default function FacultyDashboard() {
  const { reports, students, updateReportStatus } = useStudentReports();
  const [activeTab, setActiveTab] = useState('reports');
  const [filterMajor, setFilterMajor] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [clarification, setClarification] = useState('');
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  // Get unique majors from students
  const majors = useMemo(() => Array.from(new Set(students.map(s => s.program))), [students]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const student = students.find(s => s.id === r.studentId);
      const matchesMajor = filterMajor === 'all' ? true : student?.program === filterMajor;
      const matchesStatus = filterStatus === 'all' ? true : r.status === filterStatus;
      const matchesSearch =
        r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesMajor && matchesStatus && matchesSearch;
    });
  }, [reports, students, filterMajor, filterStatus, searchTerm]);

  // Summary
  const reportSummary = useMemo(() => ({
    total: reports.length,
    pending: reports.filter(r => r.status === 'submitted').length,
    flagged: reports.filter(r => r.status === 'flagged').length,
    accepted: reports.filter(r => r.status === 'approved').length,
    rejected: reports.filter(r => r.status === 'rejected').length
  }), [reports]);

  // Evaluation Reports: reports with evaluation object
  const evaluationReports = useMemo(() => reports.filter(r => r.evaluation), [reports]);

  // --- Statistics Data ---
  // Reports per cycle
  const reportsPerCycle = useMemo(() => {
    const map = {};
    reports.forEach(r => {
      const cycle = r.cycleId || 'Unassigned';
      if (!map[cycle]) map[cycle] = { accepted: 0, rejected: 0, flagged: 0, total: 0 };
      if (r.status === 'approved') map[cycle].accepted++;
      if (r.status === 'rejected') map[cycle].rejected++;
      if (r.status === 'flagged') map[cycle].flagged++;
      map[cycle].total++;
    });
    return map;
  }, [reports]);

  // Average review time (mock: difference between submittedDate and updatedAt)
  const avgReviewTime = useMemo(() => {
    const times = reports
      .filter(r => r.updatedAt && r.submittedDate)
      .map(r => (new Date(r.updatedAt) - new Date(r.submittedDate)) / (1000 * 60 * 60 * 24));
    if (!times.length) return 0;
    return (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1);
  }, [reports]);

  // Most frequently used courses
  const courseCounts = useMemo(() => {
    const map = {};
    reports.forEach(r => {
      r.courses.forEach(c => {
        map[c] = (map[c] || 0) + 1;
      });
    });
    return map;
  }, [reports]);
  const topCourses = Object.entries(courseCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Top rated companies
  const companyRatings = useMemo(() => {
    const map = {};
    reports.forEach(r => {
      if (r.companyName && r.evaluation) {
        if (!map[r.companyName]) map[r.companyName] = [];
        map[r.companyName].push(r.evaluation.rating);
      }
    });
    return Object.entries(map).map(([company, ratings]) => ({
      company,
      avg: ratings.reduce((a, b) => a + b, 0) / ratings.length,
      count: ratings.length
    })).sort((a, b) => b.avg - a.avg).slice(0, 5);
  }, [reports]);

  // Top companies by internship count
  const companyCounts = useMemo(() => {
    const map = {};
    reports.forEach(r => {
      if (r.companyName) map[r.companyName] = (map[r.companyName] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [reports]);

  // Chart data
  const cycles = Object.keys(reportsPerCycle);
  const acceptedData = cycles.map(c => reportsPerCycle[c].accepted);
  const rejectedData = cycles.map(c => reportsPerCycle[c].rejected);
  const flaggedData = cycles.map(c => reportsPerCycle[c].flagged);
  const reportsPerCycleData = {
    labels: cycles,
    datasets: [
      { label: 'Accepted', data: acceptedData, backgroundColor: '#10b981' },
      { label: 'Rejected', data: rejectedData, backgroundColor: '#f43f5e' },
      { label: 'Flagged', data: flaggedData, backgroundColor: '#f59e42' }
    ]
  };
  const topCoursesData = {
    labels: topCourses.map(([c]) => c),
    datasets: [{ label: 'Count', data: topCourses.map(([, n]) => n), backgroundColor: '#2563eb' }]
  };
  const topCompanyRatingsData = {
    labels: companyRatings.map(c => c.company),
    datasets: [{ label: 'Avg Rating', data: companyRatings.map(c => c.avg), backgroundColor: '#f59e42' }]
  };
  const topCompanyCountsData = {
    labels: companyCounts.map(([c]) => c),
    datasets: [{ label: 'Internship Count', data: companyCounts.map(([, n]) => n), backgroundColor: '#a21caf' }]
  };

  // Export as CSV
  const exportStats = () => {
    let csv = 'Cycle,Accepted,Rejected,Flagged,Total\n';
    cycles.forEach(c => {
      const d = reportsPerCycle[c];
      csv += `${c},${d.accepted},${d.rejected},${d.flagged},${d.total}\n`;
    });
    csv += '\nTop Courses,Count\n';
    topCourses.forEach(([c, n]) => { csv += `${c},${n}\n`; });
    csv += '\nTop Rated Companies,Avg Rating\n';
    companyRatings.forEach(c => { csv += `${c.company},${c.avg.toFixed(2)}\n`; });
    csv += '\nTop Companies by Internship Count,Count\n';
    companyCounts.forEach(([c, n]) => { csv += `${c},${n}\n`; });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'faculty-statistics.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Modal for report details
  const renderReportModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-blue-800">Internship Report Details</h3>
          <button onClick={() => { setShowReportModal(false); setSelectedReport(null); setClarification(''); }} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        {selectedReport && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700">Student</h4>
                <p>{selectedReport.studentName}</p>
                <p className="text-sm text-gray-500">{selectedReport.program} - Year {selectedReport.year}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Company</h4>
                <p>{selectedReport.companyName}</p>
                <p className="text-sm text-gray-500">{selectedReport.internshipTitle}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Report Title</h4>
              <p>{selectedReport.title}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Introduction</h4>
              <p>{selectedReport.introduction}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Body</h4>
              <p>{selectedReport.body}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Relevant Courses</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedReport.courses.map((course, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{course}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Status</h4>
              <span className={
                'px-2 py-1 rounded text-xs ' +
                (selectedReport.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : selectedReport.status === 'flagged'
                  ? 'bg-yellow-100 text-yellow-800'
                  : selectedReport.status === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800')
              }>
                {selectedReport.status}
              </span>
            </div>
            {selectedReport.reviewerComments && (
              <div>
                <h4 className="font-semibold text-gray-700">Reviewer Comments</h4>
                <p>{selectedReport.reviewerComments}</p>
              </div>
            )}
            <div className="flex flex-col gap-2 mt-4">
              <label className="font-semibold text-gray-700 flex items-center gap-2"><FaCommentDots /> Clarification (for flagged/rejected):</label>
              <textarea
                className="border rounded p-2 w-full"
                rows={2}
                value={clarification}
                onChange={e => setClarification(e.target.value)}
                placeholder="Add a clarification comment..."
                disabled={selectedReport.status === 'approved'}
              />
              <div className="flex gap-2 mt-2">
                {selectedReport.status === 'submitted' && (
                  <>
                    <button
                      onClick={() => updateReportStatus(selectedReport.id, 'approved')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      <FaCheck /> Accept
                    </button>
                    <button
                      onClick={() => {
                        updateReportStatus(selectedReport.id, 'rejected', clarification);
                        setClarification('');
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <FaTimes /> Reject
                    </button>
                    <button
                      onClick={() => {
                        updateReportStatus(selectedReport.id, 'flagged', clarification);
                        setClarification('');
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                    >
                      <FaExclamationTriangle /> Flag
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Modal for evaluation details
  const renderEvaluationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-blue-800">Evaluation Report Details</h3>
          <button onClick={() => { setShowEvaluationModal(false); setSelectedEvaluation(null); }} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        {selectedEvaluation && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700">Student</h4>
                <p>{selectedEvaluation.studentName}</p>
                <p className="text-sm text-gray-500">{selectedEvaluation.program} - Year {selectedEvaluation.year}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Company</h4>
                <p>{selectedEvaluation.companyName}</p>
                <p className="text-sm text-gray-500">{selectedEvaluation.internshipTitle}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700">Internship Start</h4>
                <p>{selectedEvaluation.startDate ? new Date(selectedEvaluation.startDate).toLocaleDateString() : '-'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Internship End</h4>
                <p>{selectedEvaluation.endDate ? new Date(selectedEvaluation.endDate).toLocaleDateString() : '-'}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Main Supervisor</h4>
              <p>{selectedEvaluation.supervisor || '-'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Evaluation</h4>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.floor(selectedEvaluation.evaluation.rating) ? 'fill-current' : 'text-gray-300'}
                    />
                  ))}
                </span>
                <span className="text-sm text-gray-500">
                  ({selectedEvaluation.evaluation.rating.toFixed(1)})
                </span>
              </div>
              <p className="mt-1">{selectedEvaluation.evaluation.comments}</p>
              <div className="mt-2 text-sm text-green-700 font-semibold">
                {selectedEvaluation.evaluation.recommend ? 'Recommended' : 'Not Recommended'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Main render
  return (
    <div className="p-6">
            {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <Link to="/" className="hover:underline">
          Login
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Faculty Dashboard</span>
      </nav>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaFileAlt className="text-blue-600" /> Faculty Dashboard
      </h2>
      <div className="mb-8 flex gap-4">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded ${activeTab === 'reports' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Internship Reports
        </button>
        <button
          onClick={() => setActiveTab('evaluations')}
          className={`px-4 py-2 rounded ${activeTab === 'evaluations' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Evaluation Reports
        </button>
        <button
          onClick={() => setActiveTab('statistics')}
          className={`px-4 py-2 rounded ${activeTab === 'statistics' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Statistics
        </button>
      </div>
      {activeTab === 'reports' && (
        <div>
          {/* Summary Bar */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded shadow text-sm">
              <FaFileAlt /> Total: <span className="font-bold">{reportSummary.total}</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded shadow text-sm">
              <FaInfoCircle /> Pending: <span className="font-bold">{reportSummary.pending}</span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow text-sm">
              <FaExclamationTriangle /> Flagged: <span className="font-bold">{reportSummary.flagged}</span>
            </div>
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded shadow text-sm">
              <FaCheck /> Accepted: <span className="font-bold">{reportSummary.accepted}</span>
            </div>
            <div className="flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded shadow text-sm">
              <FaTimes /> Rejected: <span className="font-bold">{reportSummary.rejected}</span>
            </div>
            <button
              onClick={() => { setFilterMajor('all'); setFilterStatus('all'); setSearchTerm(''); }}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded shadow text-sm hover:bg-gray-200"
              title="Clear Filters"
            >
              <FaFilter /> Clear Filters
            </button>
          </div>
          {/* Search and Filter */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[200px] border rounded p-2"
            />
            <select
              value={filterMajor}
              onChange={e => setFilterMajor(e.target.value)}
              className="border rounded p-2"
            >
              <option value="all">All Majors</option>
              {majors.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="border rounded p-2"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Pending</option>
              <option value="flagged">Flagged</option>
              <option value="approved">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          {/* Reports Table */}
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border">Student</th>
                  <th className="p-3 border">Major</th>
                  <th className="p-3 border">Company</th>
                  <th className="p-3 border">Title</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length > 0 ? (
                  filteredReports.map(report => {
                    const student = students.find(s => s.id === report.studentId);
                    return (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="p-3 border">{report.studentName}</td>
                        <td className="p-3 border">{student?.program || '-'}</td>
                        <td className="p-3 border">{report.companyName}</td>
                        <td className="p-3 border">{report.title}</td>
                        <td className="p-3 border">
                          <span className={
                            'px-2 py-1 rounded text-xs ' +
                            (report.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : report.status === 'flagged'
                              ? 'bg-yellow-100 text-yellow-800'
                              : report.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800')
                          }>
                            {report.status}
                          </span>
                        </td>
                        <td className="p-3 border">
                          <button
                            onClick={() => { setSelectedReport(report); setShowReportModal(true); setClarification(''); }}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            <FaSearch />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      No reports found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {showReportModal && renderReportModal()}
        </div>
      )}
      {activeTab === 'evaluations' && (
        <div>
          <div className="mb-6 flex items-center gap-2">
            <FaFileAlt className="text-blue-600" />
            <h3 className="text-xl font-bold">Evaluation Reports</h3>
          </div>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border">Student</th>
                  <th className="p-3 border">Company</th>
                  <th className="p-3 border">Internship</th>
                  <th className="p-3 border">Supervisor</th>
                  <th className="p-3 border">Start</th>
                  <th className="p-3 border">End</th>
                  <th className="p-3 border">Rating</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {evaluationReports.length > 0 ? (
                  evaluationReports.map(report => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="p-3 border">{report.studentName}</td>
                      <td className="p-3 border">{report.companyName}</td>
                      <td className="p-3 border">{report.internshipTitle}</td>
                      <td className="p-3 border">{report.supervisor || '-'}</td>
                      <td className="p-3 border">{report.startDate ? new Date(report.startDate).toLocaleDateString() : '-'}</td>
                      <td className="p-3 border">{report.endDate ? new Date(report.endDate).toLocaleDateString() : '-'}</td>
                      <td className="p-3 border">
                        <span className="text-yellow-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar
                              key={i}
                              className={i < Math.floor(report.evaluation.rating) ? 'fill-current' : 'text-gray-300'}
                            />
                          ))}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">({report.evaluation.rating.toFixed(1)})</span>
                      </td>
                      <td className="p-3 border">
                        <button
                          onClick={() => { setSelectedEvaluation(report); setShowEvaluationModal(true); }}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <FaSearch />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500">
                      No evaluation reports found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {showEvaluationModal && renderEvaluationModal()}
        </div>
      )}
      {activeTab === 'statistics' && (
        <div className="space-y-8">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded shadow text-sm">
              <FaCheck /> Avg. Review Time: <span className="font-bold">{avgReviewTime} days</span>
            </div>
            <button
              onClick={exportStats}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            >
              <FaFileAlt /> Export Report
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded shadow p-6">
              <div className="font-semibold mb-2 flex items-center gap-2"><FaFileAlt /> Reports per Cycle</div>
              <Bar data={reportsPerCycleData} />
            </div>
            <div className="bg-white rounded shadow p-6">
              <div className="font-semibold mb-2 flex items-center gap-2"><FaGraduationCap /> Top Courses Used</div>
              <Bar data={topCoursesData} options={{ plugins: { legend: { display: false } } }} />
            </div>
            <div className="bg-white rounded shadow p-6">
              <div className="font-semibold mb-2 flex items-center gap-2"><FaCheck /> Top Rated Companies</div>
              <Bar data={topCompanyRatingsData} options={{ plugins: { legend: { display: false } } }} />
            </div>
            <div className="bg-white rounded shadow p-6">
              <div className="font-semibold mb-2 flex items-center gap-2"><FaFileAlt /> Top Companies by Internship Count</div>
              <Bar data={topCompanyCountsData} options={{ plugins: { legend: { display: false } } }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
