import { Outlet } from 'react-router-dom';
export default function StudentLayout() {
  return (
    <div className="min-h-screen bg-white">
      <header className="p-4 bg-blue-600 text-white font-bold">Student Panel</header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
