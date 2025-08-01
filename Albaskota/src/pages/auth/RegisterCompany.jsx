// src/pages/auth/RegisterCompany.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCompanies } from "../../context/CompanyContext";

export default function RegisterCompany() {
  const { addCompany } = useCompanies();
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyEmail, setCompanyEmail] = useState("");
  const [password, setPassword] = useState("");
  const [proofDocs, setProofDocs] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !companyName ||
      !industry ||
      !companySize ||
      !companyLogo ||
      !companyEmail ||
      !password ||
      !proofDocs
    ) {
      alert("Please fill out all required fields, including proof documents.");
      return;
    }

    addCompany({
      companyName,
      industry,
      companySize,
      companyEmail,
      password,
      proofDocs: URL.createObjectURL(proofDocs),
      logoUrl: URL.createObjectURL(companyLogo),
    });

    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      alert("Company registered successfully! You can now log in.");
      navigate("/");
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto p-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
          <Link to="/" className="hover:underline">
            Login
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Register Company</span>
        </nav>

        {/* Registration Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">
            Company Registration
          </h2>

          {showNotification && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              Registration submitted! You’ll get an email once your application is approved.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Company Name *
              </label>
              <input
                required
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full border-gray-300 rounded-md p-2 border focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Industry *
              </label>
              <input
                required
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full border-gray-300 rounded-md p-2 border focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Company Size *
              </label>
              <select
                required
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="w-full border-gray-300 rounded-md p-2 border focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Select size</option>
                <option value="small">Small (≤ 50 employees)</option>
                <option value="medium">Medium (51–100 employees)</option>
                <option value="large">Large (101–500 employees)</option>
                <option value="corporate">Corporate (≥ 500 employees)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Company Logo *
              </label>
              <input
                required
                type="file"
                accept="image/*"
                onChange={(e) => setCompanyLogo(e.target.files[0])}
                className="w-full border-gray-300 rounded-md p-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Proof Documents *
              </label>
              <input
                required
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setProofDocs(e.target.files[0])}
                className="w-full border-gray-300 rounded-md p-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Official Email *
              </label>
              <input
                required
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                className="w-full border-gray-300 rounded-md p-2 border focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Password *
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-gray-300 rounded-md p-2 border focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors"
            >
              Register Company
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
