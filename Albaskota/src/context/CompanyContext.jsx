import { createContext, useContext, useState } from "react";
import { sendEmail } from "../utils/email";

const CompanyContext = createContext();

export function useCompanies() {
  return useContext(CompanyContext);
}

export function CompanyProvider({ children }) {
  // 1) Seed companies
  const [companies, setCompanies] = useState([
    {
      id: 1,
      companyName: "Acme Corp",
      industry: "Manufacturing",
      companySize: "Large",
      companyEmail: "hr@acmecorp.com",
      proofDocs: null,
      status: "Pending"
    },
    {
      id: 2,
      companyName: "BrightTech",
      industry: "Software",
      companySize: "Medium",
      companyEmail: "contact@brighttech.io",
      proofDocs: null,
      status: "Accepted"
    },
    {
      id: 3,
      companyName: "Green Foods",
      industry: "Food & Beverage",
      companySize: "Small",
      companyEmail: "info@greenfoods.com",
      proofDocs: null,
      status: "Rejected"
    }
  ]);

  // 2) Default to id=1 so dashboard isn’t empty
  const [currentCompanyId, setCurrentCompanyId] = useState(1);

  const login = (companyId) => setCurrentCompanyId(companyId);
  const logout = () => setCurrentCompanyId(null);

  const addCompany = (company) => {
    setCompanies(prev => [
      ...prev,
      {
        id: Date.now(),
        status: "Pending",
        proofDocs: company.proofDocs,
        logoUrl: company.logoUrl,
        companyName: company.companyName,
        industry: company.industry,
        companySize: company.companySize,
        companyEmail: company.companyEmail
      }
    ]);
  };

  const updateCompanyStatus = (id, status) => {
    setCompanies(prev =>
      prev.map(c => {
        if (c.id === id) {
          const updated = { ...c, status };
          sendEmail(
            updated.companyEmail,
            `Your registration was ${status}`,
            `Hello ${updated.companyName}, your registration has been ${status.toLowerCase()}.`
          );
          return updated;
        }
        return c;
      })
    );
  };

  return (
    <CompanyContext.Provider
      value={{
        companies,
        currentCompanyId,
        login,
        logout,
        addCompany,
        updateCompanyStatus
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}
