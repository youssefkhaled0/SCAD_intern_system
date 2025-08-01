// src/pages/auth/LoginPage.jsx
import { useState } from "react";
import { FaRocket } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCompanies } from "../../context/CompanyContext";
import { useStudent } from "../../context/StudentContext";

export default function LoginPage() {
  const { companies, login: loginCompany } = useCompanies();
  const { login: loginStudent } = useStudent();
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [error, setError] = useState("");

const handleLogin = () => {
  setError("");

  if (role === "company") {
    const companyId = selectedCompanyId
      ? parseInt(selectedCompanyId, 10)
      : companies[0]?.id;

    if (!companyId) {
      setError("No companies available to log in.");
      return;
    }

    // Only require email/password if no specific company is selected
    if (!selectedCompanyId && (!identifier || !password)) {
      setError("Please fill in both email and password.");
      return;
    }

    loginCompany(companyId);
    navigate("/company/dashboard");
    return;
  }

  if (!identifier || !password) {
    setError("Please fill in both email and password.");
    return;
  }

  const base = {
    id: 1,
    name: "John Doe",
    email: identifier,
    major: "Computer Science",
    semester: 6,
    gpa: "3.8",
    graduationYear: "2024",
    skills: ["JavaScript", "React", "Node.js"],
    jobInterests: "Software Development, Web Development",
    previousExperience: "Summer Internship at Tech Corp",
    collegeActivities: "Computer Science Club, Hackathon Organizer",
  };

  if (role === "student") {
    loginStudent(base);
    navigate("/student/dashboard");
  } else if (role === "pro_student") {
    loginStudent({ ...base, isProStudent: true });
    navigate("/student/pro-student/dashboard");
  } else if (role === "scad") {
    navigate("/scad/dashboard");
  } else if (role === "faculty") {
    navigate("/faculty/dashboard");
  }
};



  const handleRegisterCompany = () => {
    navigate("/register/company");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 transition transform hover:scale-105">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-6">
          🚀 SCAD Internship Portal
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-200 text-red-800 border border-red-300 rounded animate-bounce">
            ⚠️ {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-lg font-semibold text-gray-700 mb-1">
            ✨ Select Your Role
          </label>
          <select
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-4 focus:ring-blue-300 transition"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setIdentifier("");
              setPassword("");
              setSelectedCompanyId("");
              setError("");
            }}
          >
            <option value="student">🎓 Student</option>
            <option value="pro_student">💼 PRO Student</option>
            <option value="company">🏢 Company</option>
            <option value="scad">🏛️ SCAD Office</option>
            <option value="faculty">👩‍🏫 Faculty Member</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold text-gray-700 mb-1">
            📧 Email
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-4 focus:ring-blue-300 transition"
            placeholder="Enter your email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-1">
            🔑 Password
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-4 focus:ring-blue-300 transition"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {role === "company" && (
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-1">
              🏢 Choose Your Company
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-4 focus:ring-blue-300 transition"
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
            >
              <option value="">-- use default --</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transform transition hover:scale-105 flex items-center justify-center gap-2"
        >
          <FaRocket /> Login
        </button>

        {role === "company" && (
          <button
            onClick={handleRegisterCompany}
            className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transform transition hover:scale-105"
          >
            ✨ Register New Company
          </button>
        )}
      </div>
    </div>
  );
}
