import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        GUC Internship System
      </Link>
      <div>
        <Link to="/login" className="mx-4 hover:underline">Login</Link>
        <Link to="/register/company" className="mx-4 hover:underline">Register Company</Link>
      </div>
    </nav>
  );
}

export default Navbar;
