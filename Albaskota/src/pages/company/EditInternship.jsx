import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useInternships } from '../../context/InternshipContext';

export default function EditInternship() {
  const { internships, setInternships } = useInternships();
  const { internshipId } = useParams();
  const navigate = useNavigate();

  const internship = internships.find(i => i.id === Number(internshipId));
  if (!internship) {
    navigate('/company/dashboard');
    return null;
  }
  const crumbs = [
   { label: "Home", to: "/" },
   { label: "Company Dashboard", to: "/company/dashboard" },
   { label: "Edit Internship" }
  ];

  const [title, setTitle] = useState(internship.title);
  const [description, setDescription] = useState(internship.description || '');
  const [duration, setDuration] = useState(internship.duration);
  const [paid, setPaid] = useState(internship.paid);
  const [salary, setSalary] = useState(internship.salary);
  const [skills, setSkills] = useState(internship.skills);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = { ...internship, title, description, duration, paid, salary, skills };
    setInternships(prev =>
      prev.map(i => (i.id === updated.id ? updated : i))
    );
    alert('Internship Updated!');
    navigate('/company/dashboard');
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
            <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
              <Link to="/" className="hover:underline">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link to="/company/dashboard" className="hover:underline">
                Company Dashboard
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700">Edit Internship</span>
            </nav>
      <h2 className="text-xl font-bold text-blue-800 mb-4">Edit Internship</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-semibold mb-1">Title *</label>
          <input
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1">Job Description *</label>
          <textarea
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            className="w-full border rounded p-2"
            placeholder="Describe the role, responsibilities, etc."
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block font-semibold mb-1">Duration (months) *</label>
          <input
            required
            type="number"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Paid toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={paid}
            onChange={e => setPaid(e.target.checked)}
            id="paid"
          />
          <label htmlFor="paid">Paid Internship</label>
        </div>

        {/* Salary */}
        {paid && (
          <div>
            <label className="block font-semibold mb-1">Salary *</label>
            <input
              required
              type="text"
              value={salary}
              onChange={e => setSalary(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
        )}

        {/* Skills */}
        <div>
          <label className="block font-semibold mb-1">Skills Required *</label>
          <input
            required
            value={skills}
            onChange={e => setSkills(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
        >
          Update Internship
        </button>
      </form>
    </div>
  );
}
