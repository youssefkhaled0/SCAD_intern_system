// src/context/NotificationContext.jsx
import { createContext, useCallback, useContext, useState } from 'react';

const NotificationContext = createContext();
export function useNotify() { return useContext(NotificationContext); }

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((type, message) => {
    const id = Date.now();
    setToasts(ts => [...ts, { id, type, message }]);
    // auto‐remove after 4s
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 4000);
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map(t => (
          <div
            key={t.id}
            className={
              'px-4 py-2 rounded shadow ' +
              (t.type === 'success'
                ? 'bg-green-100 text-green-800'
                : t.type === 'error'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800')
            }
          >
            {t.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
