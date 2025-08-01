import { createContext, useContext, useState } from "react";
import { sendEmail } from "../utils/email";
import { useCompanies } from "./CompanyContext";
import { useInternships } from "./InternshipContext";
import { useNotify } from "./NotificationContext";

const ApplicationContext = createContext();

export function useApplications() {
  return useContext(ApplicationContext);
}

export function ApplicationProvider({ children }) {
  // Seed a few applications
  const [applications, setApplications] = useState([
    { id: 1, internshipId: 1, applicant: "John Doe", status: "Pending" },
    { id: 2, internshipId: 1, applicant: "Jane Smith", status: "Accepted" },
    { id: 3, internshipId: 2, applicant: "Bob Lee", status: "Rejected" }
  ]);

  const { notify } = useNotify();
  const { internships } = useInternships();
  const { companies } = useCompanies();

  // Add a new application (student applies)
  const addApplication = (application) => {
    const newApp = { id: Date.now(), status: "Pending", ...application };
    setApplications((prev) => [...prev, newApp]);

    const internship = internships.find((i) => i.id === application.internshipId);
    const company = companies.find((c) => c.id === internship.companyId);
    if (company) {
      // in-system notification
      notify(
        "info",
        `New application by ${application.applicant} for "${internship.title}".`
      );
      // simulated email
      sendEmail(
        company.companyEmail,
        `New Application: ${internship.title}`,
        `Hello ${company.companyName},\n\n` +
        `Student ${application.applicant} has applied for your internship "${internship.title}".`
      );
    }
  };

  // Update status (Accepted, Rejected, Complete)
  const updateApplicationStatus = (id, status) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  return (
    <ApplicationContext.Provider
      value={{ applications, addApplication, updateApplicationStatus }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}
