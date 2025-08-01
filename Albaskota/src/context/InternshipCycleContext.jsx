import { createContext, useContext, useState } from 'react';
import { useNotify } from './NotificationContext';

const InternshipCycleContext = createContext();

export function useInternshipCycles() {
  return useContext(InternshipCycleContext);
}

export function InternshipCycleProvider({ children }) {
  const { notify } = useNotify();
  const [cycles, setCycles] = useState([
    {
      id: 1,
      title: 'Summer 2024',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      description: 'Summer internship cycle for all programs',
      status: 'active',
      isGlobal: true,
      programs: [],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      title: 'Winter 2024 CS',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      description: 'Winter internship cycle for Computer Science students',
      status: 'closed',
      isGlobal: false,
      programs: ['Computer Science'],
      createdAt: '2023-10-01T10:00:00Z',
      updatedAt: '2024-03-31T18:00:00Z'
    }
  ]);

  const addCycle = (cycle) => {
    const newCycle = {
      ...cycle,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCycles(prev => [...prev, newCycle]);
    notify('success', `Internship cycle "${cycle.title}" created successfully.`);
  };

  const updateCycle = (id, updates) => {
    setCycles(prev => prev.map(cycle => 
      cycle.id === id 
        ? { ...cycle, ...updates, updatedAt: new Date().toISOString() }
        : cycle
    ));
    notify('success', 'Internship cycle updated successfully.');
  };

  const closeCycle = (id) => {
    setCycles(prev => prev.map(cycle => 
      cycle.id === id 
        ? { ...cycle, status: 'closed', updatedAt: new Date().toISOString() }
        : cycle
    ));
    notify('success', 'Internship cycle closed successfully.');
  };

  const activateCycle = (id) => {
    setCycles(prev => prev.map(cycle => 
      cycle.id === id 
        ? { ...cycle, status: 'active', updatedAt: new Date().toISOString() }
        : cycle
    ));
    notify('success', 'Internship cycle activated successfully.');
  };

  const deleteCycle = (id) => {
    setCycles(prev => prev.filter(cycle => cycle.id !== id));
    notify('success', 'Internship cycle deleted successfully.');
  };

  return (
    <InternshipCycleContext.Provider value={{
      cycles,
      addCycle,
      updateCycle,
      closeCycle,
      activateCycle,
      deleteCycle
    }}>
      {children}
    </InternshipCycleContext.Provider>
  );
} 