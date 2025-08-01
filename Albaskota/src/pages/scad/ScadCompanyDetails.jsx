// src/pages/scad/ScadCompanyDetails.jsx
import { useNavigate, useParams } from 'react-router-dom';
import { useCompanies } from '../../context/CompanyContext';
import { useNotify } from '../../context/NotificationContext';
import { sendEmail } from '../../utils/email';

export default function ScadCompanyDetails() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { companies, updateCompanyStatus } = useCompanies();
  const { notify } = useNotify();

  // Find the company by ID
  const company = companies.find(c => c.id === Number(companyId));
  if (!company) {
    return (
      <div className="p-6">
        <p className="text-red-600">Company not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-200 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleAccept = () => {
    updateCompanyStatus(company.id, 'Accepted');
    notify('success', `Company "${company.companyName}" was accepted.`);
    sendEmail(
      company.companyEmail,
      'Your registration was accepted',
      `Hello ${company.companyName}, your registration has been accepted.`
    );
    navigate(-1);
  };

  const handleReject = () => {
    updateCompanyStatus(company.id, 'Rejected');
    notify('success', `Company "${company.companyName}" was rejected.`);
    sendEmail(
      company.companyEmail,
      'Your registration was rejected',
      `Hello ${company.companyName}, your registration has been rejected.`
    );
    navigate(-1);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumbs / Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to Registrations
      </button>

      <h2 className="text-2xl font-bold">
        Registration Details: {company.companyName}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Industry:</strong> {company.industry}</p>
          <p><strong>Size:</strong> {company.companySize}</p>
          <p><strong>Email:</strong> {company.companyEmail}</p>
          <p>
            <strong>Status:</strong>
            <span
              className={
                'ml-2 px-2 py-1 rounded ' +
                (company.status === 'Pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : company.status === 'Accepted'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800')
              }
            >
              {company.status}
            </span>
          </p>
        </div>
        <div>
          <p><strong>Proof Documents:</strong></p>
          {company.proofDocs instanceof Blob ? (
            <a
              href={URL.createObjectURL(company.proofDocs)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Uploaded Doc
            </a>
          ) : (
            <p className="text-gray-500">No document provided.</p>
          )}
        </div>
      </div>

      {company.status === 'Pending' && (
        <div className="space-x-4">
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Accept
          </button>
          <button
            onClick={handleReject}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
