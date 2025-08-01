// src/pages/company/CompanyDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import {
  FaCheck,
  FaEdit,
  FaEye,
  FaFileAlt,
  FaFileDownload,
  FaPlus,
  FaTimes,
  FaTrash,
  FaUsers
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useApplications } from "../../context/ApplicationContext";
import { useCompanies } from "../../context/CompanyContext";
import { useInternships } from "../../context/InternshipContext";
import { useNotify } from "../../context/NotificationContext";

export default function CompanyDashboard() {
  // 1. Contexts (always first)
  const { internships = [], setInternships } = useInternships();
  const { companies, currentCompanyId } = useCompanies();
  const { applications, updateApplicationStatus } = useApplications();
  const { notify } = useNotify();

  // 2. Local state (before any return)
  const [currentCompany, setCurrentCompany] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");

  // Common filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPaid, setFilterPaid] = useState("all");

  // Applications tab filters
  const [filterAppPost, setFilterAppPost] = useState("all");
  const [searchApp, setSearchApp] = useState("");

  // Interns tab filters
  const [filterInternStatus, setFilterInternStatus] = useState("current");
  const [searchIntern, setSearchIntern] = useState("");

  // Detail‐modal state
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedIntern, setSelectedIntern] = useState(null);

  // 3. Effects
  // Load current company
  useEffect(() => {
    const comp = companies.find((c) => c.id === currentCompanyId);
    setCurrentCompany(comp || null);
  }, [companies, currentCompanyId]);

  // 4. Memoized data
  // Internships belonging to this company
  const myInternships = useMemo(
    () => internships.filter((i) => i.companyId === currentCompanyId),
    [internships, currentCompanyId]
  );

  // Application counts per internship
  const appCounts = useMemo(() => {
    const counts = {};
    applications.forEach((a) => {
      counts[a.internshipId] = (counts[a.internshipId] || 0) + 1;
    });
    return counts;
  }, [applications]);

  // Posts tab: filtered internships
  const filteredInternships = useMemo(
    () =>
      myInternships
        .filter((i) =>
          i.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((i) =>
          filterPaid === "all"
            ? true
            : filterPaid === "paid"
            ? i.paid
            : !i.paid
        ),
    [myInternships, searchTerm, filterPaid]
  );
  const activeList = useMemo(
    () => filteredInternships.filter((i) => i.status === "Active"),
    [filteredInternships]
  );
  const closedList = useMemo(
    () => filteredInternships.filter((i) => i.status === "Closed"),
    [filteredInternships]
  );

  // Applications tab: apps for my internships
  const companyApplications = useMemo(
    () =>
      applications.filter((a) =>
        myInternships.some((i) => i.id === a.internshipId)
      ),
    [applications, myInternships]
  );
  const filteredApplications = useMemo(
    () =>
      companyApplications
        .filter((a) =>
          filterAppPost === "all"
            ? true
            : a.internshipId === Number(filterAppPost)
        )
        .filter((a) =>
          a.applicant.toLowerCase().includes(searchApp.toLowerCase())
        ),
    [companyApplications, filterAppPost, searchApp]
  );

  // Interns tab: split by status
  const currentInterns = useMemo(
    () => companyApplications.filter((a) => a.status === "Accepted"),
    [companyApplications]
  );
  const completedInterns = useMemo(
    () => companyApplications.filter((a) => a.status === "Complete"),
    [companyApplications]
  );
  const filteredInterns = useMemo(() => {
    const list =
      filterInternStatus === "completed"
        ? completedInterns
        : currentInterns;
    return list.filter((a) =>
      a.applicant.toLowerCase().includes(searchIntern.toLowerCase())
    );
  }, [filterInternStatus, currentInterns, completedInterns, searchIntern]);

  // 5. Early return if no company
  if (!currentCompany) {
    return (
      <div className="p-6">
        <p className="text-red-600">
          No company found or not accepted yet.
        </p>
      </div>
    );
  }

  // 6. Helpers
  const downloadProofDoc = (doc) => {
    if (doc instanceof Blob) {
      const url = URL.createObjectURL(doc);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.name || "proof-document";
      a.click();
      URL.revokeObjectURL(url);
    }
  };
  const deleteInternship = (id) =>
    setInternships((prev) => prev.filter((i) => i.id !== id));
  const toggleInternshipStatus = (id) =>
    setInternships((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: i.status === "Active" ? "Closed" : "Active" }
          : i
      )
    );

  // 7. Render
  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav
        className="text-sm text-gray-500 mb-4"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">Company Dashboard</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
          <FaUsers className="text-blue-500" /> Company Dashboard
        </h2>
        <Link
          to="/company/create-internship"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          <FaPlus /> Create Internship
        </Link>
      </div>

      {/* Company Info */}
      <section className="flex flex-col md:flex-row gap-8 items-start bg-white rounded-lg shadow p-6">
        <div className="flex-shrink-0">
          {currentCompany.companyLogo instanceof Blob ? (
            <img
              src={URL.createObjectURL(
                currentCompany.companyLogo
              )}
              alt="Logo"
              className="w-24 h-24 object-contain rounded border mb-2"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded border mb-2 text-gray-400">
              <FaFileAlt size={40} />
            </div>
          )}
          {currentCompany.proofDocs instanceof Blob && (
            <button
              onClick={() =>
                downloadProofDoc(currentCompany.proofDocs)
              }
              className="flex items-center gap-1 text-blue-600 hover:underline text-xs mt-1"
            >
              <FaFileDownload /> Download Proof
            </button>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <p>
            <strong>Industry:</strong> {currentCompany.industry}
          </p>
          <p>
            <strong>Size:</strong> {currentCompany.companySize}
          </p>
          <p>
            <strong>Email:</strong> {currentCompany.companyEmail}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={
                "ml-2 px-2 py-1 rounded text-xs " +
                (currentCompany.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : currentCompany.status === "Accepted"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800")
              }
            >
              {currentCompany.status}
            </span>
          </p>
        </div>
      </section>

      {/* Tab Bar */}
      <div className="border-b flex space-x-4 mb-6">
        {["posts", "applications", "interns"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 -mb-px ${
              activeTab === tab
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab === "posts"
              ? "My Posts"
              : tab === "applications"
              ? "Applications"
              : "Interns"}
          </button>
        ))}
      </div>

      {/* Posts Tab */}
      {activeTab === "posts" && (
        <section className="space-y-6">
          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search internships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded p-2 flex-1 min-w-[200px]"
            />
            <select
              value={filterPaid}
              onChange={(e) => setFilterPaid(e.target.value)}
              className="border rounded p-2"
            >
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          {/* Active Internships */}
          <div>
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FaEye className="text-blue-500" /> Active Internships
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {activeList.map((i) => (
                <li
                  key={i.id}
                  className="border rounded-lg p-4 bg-white shadow space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-700">
                      {i.title}
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      {i.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Applications:{" "}
                    <strong>{appCounts[i.id] || 0}</strong> | Duration: {i.duration}{" "}
                    mo | {i.paid ? "Paid" : "Unpaid"}
                  </p>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/company/edit-internship/${i.id}`}
                      className="px-2 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded text-xs"
                    >
                      <FaEdit /> Edit
                    </Link>
                    <button
                      onClick={() => deleteInternship(i.id)}
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                    >
                      <FaTrash /> Delete
                    </button>
                    <button
                      onClick={() => toggleInternshipStatus(i.id)}
                      className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs"
                    >
                      <FaTimes /> {i.status === "Active" ? "Close" : "Reopen"}
                    </button>
                  </div>
                </li>
              ))}
              {activeList.length === 0 && (
                <li className="text-gray-500">No active internships.</li>
              )}
            </ul>
          </div>

          {/* Closed Internships */}
          <div>
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FaFileAlt className="text-gray-500" /> Closed Internships
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {closedList.map((i) => (
                <li
                  key={i.id}
                  className="border rounded-lg p-4 bg-white shadow space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">
                      {i.title}
                    </span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                      {i.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Applications:{" "}
                    <strong>{appCounts[i.id] || 0}</strong> | Duration: {i.duration}{" "}
                    mo | {i.paid ? "Paid" : "Unpaid"}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteInternship(i.id)}
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                    >
                      <FaTrash /> Delete
                    </button>
                    <button
                      onClick={() => toggleInternshipStatus(i.id)}
                      className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs"
                    >
                      <FaCheck /> Reopen
                    </button>
                  </div>
                </li>
              ))}
              {closedList.length === 0 && (
                <li className="text-gray-500">No closed internships.</li>
              )}
            </ul>
          </div>
        </section>
      )}

      {/* Applications Tab */}
      {activeTab === "applications" && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <select
              value={filterAppPost}
              onChange={(e) => setFilterAppPost(e.target.value)}
              className="border rounded p-2"
            >
              <option value="all">All Posts</option>
              {myInternships.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.title}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchApp}
              onChange={(e) => setSearchApp(e.target.value)}
              className="border rounded p-2 flex-1 min-w-[200px]"
            />
          </div>
          <ul className="space-y-2">
            {filteredApplications.map((app) => {
              const intern = internships.find((i) => i.id === app.internshipId);
              return (
                <li
                  key={app.id}
                  className="flex justify-between items-center border rounded p-3 bg-white"
                >
                  <div>
                      <button
                          className="font-semibold text-blue-600 hover:underline text-left"
                          onClick={() => setSelectedApp(app)}>
                          {app.applicant}
                      </button>
                    <p className="text-xs text-gray-600">{intern?.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        app.status === "Accepted"
                          ? "bg-green-100 text-green-800"
                          : app.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {app.status}
                    </span>
                    <button
                      onClick={() => updateApplicationStatus(app.id, "Accepted")}
                      className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(app.id, "Rejected")}
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                    >
                      <FaTimes />
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(app.id, "Complete")}
                      className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
                    >
                      ✓ Complete
                    </button>
                  </div>
                </li>
              );
            })}
            {filteredApplications.length === 0 && (
              <p className="text-gray-500">No applications found.</p>
            )}
          </ul>
          {selectedApp && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow p-6 w-96 relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        onClick={() => setSelectedApp(null)}
      >
        <FaTimes />
      </button>
      <h3 className="text-xl font-bold mb-2">Application Details</h3>
      <p><strong>Applicant:</strong> {selectedApp.applicant}</p>
      <p><strong>Status:</strong>    {selectedApp.status}</p>
      <p>
        <strong>Internship:</strong>{" "}
        {internships.find(i => i.id === selectedApp.internshipId)?.title}
      </p>
      {/* add more fields (resume link, cover letter) as desired */}
    </div>
  </div>
)}

        </section>
      )}

      {/* Interns Tab */}
      {activeTab === "interns" && (
        <section className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <select
              value={filterInternStatus}
              onChange={(e) => setFilterInternStatus(e.target.value)}
              className="border rounded p-2"
            >
              <option value="current">Current Interns</option>
              <option value="completed">Completed Interns</option>
            </select>
            <input
              type="text"
              placeholder="Search interns..."
              value={searchIntern}
              onChange={(e) => setSearchIntern(e.target.value)}
              className="border rounded p-2 flex-1 min-w-[200px]"
            />
          </div>
          <ul className="space-y-2">
            {filteredInterns.map((app) => {
              const intern = internships.find((i) => i.id === app.internshipId);
              return (
                <li
                  key={app.id}
                  className="flex justify-between items-center border rounded p-3 bg-white"
                >
                  <div>
                       <button
                          className="font-semibold text-blue-600 hover:underline text-left"
                          onClick={() => setSelectedIntern(app)}>
                          {app.applicant}
                      </button>
                    <p className="text-xs text-gray-600">{intern?.title}</p>
                  </div>
                  <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                    {app.status}
                  </span>
                </li>
              );
            })}
            {filteredInterns.length === 0 && (
              <p className="text-gray-500">No interns found.</p>
            )}
          </ul>
          {selectedIntern && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow p-6 w-96 relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        onClick={() => setSelectedIntern(null)}
      >
        <FaTimes />
      </button>
      <h3 className="text-xl font-bold mb-2">Intern Details</h3>
      <p><strong>Name:</strong>   {selectedIntern.applicant}</p>
      <p><strong>Status:</strong> {selectedIntern.status}</p>
      <p>
        <strong>Role:</strong>{" "}
        {internships.find(i => i.id === selectedIntern.internshipId)?.title}
      </p>
      {/* any extra post-intern info */}
    </div>
  </div>
)}

        </section>
      )}
    </div>
  );
}
