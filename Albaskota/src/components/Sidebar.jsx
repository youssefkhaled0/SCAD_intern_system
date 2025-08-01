import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <ul>
        <li>
          <Link to="/student/dashboard" className="block py-2 px-4 hover:bg-blue-700 rounded">Dashboard</Link>
        </li>
        <li>
          <Link to="/student/internships" className="block py-2 px-4 hover:bg-blue-700 rounded">Internships</Link>
        </li>
        <li>
          <Link to="/student/applications" className="block py-2 px-4 hover:bg-blue-700 rounded">Applications</Link>
        </li>
        <li>
          <Link to="/student/profile" className="block py-2 px-4 hover:bg-blue-700 rounded">Profile</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
