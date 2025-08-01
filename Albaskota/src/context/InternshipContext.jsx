import { createContext, useContext, useState } from "react";
import { useCompanies } from "./CompanyContext";

const InternshipContext = createContext();

export function useInternships() {
  return useContext(InternshipContext);
}

export function InternshipProvider({ children }) {
  // Seed internships with companyId=1
  const [internships, setInternships] = useState([
    {
      id: 1,
      companyId: 1,
      title: "Frontend Developer Intern",
      description: "Build & style React components for our main product.",
      duration: 3,
      paid: true,
      salary: "2500 EGP",
      skills: "React, JavaScript, HTML, CSS",
      status: "Active"
    },
    {
      id: 2,
      companyId: 1,
      title: "Backend Developer Intern",
      description: "Design & implement RESTful APIs using Node.js.",
      duration: 4,
      paid: true,
      salary: "3000 EGP",
      skills: "Node.js, Express, MongoDB",
      status: "Active"
    },
    {
      id: 3,
      companyId: 1,
      title: "UI/UX Design Intern",
      description: "Create wireframes & mockups, improve user flows.",
      duration: 2,
      paid: false,
      salary: "Unpaid",
      skills: "Figma, Sketch, User Research",
      status: "Closed"
    },
    {
      id: 4,
      companyId: 1,
      title: "Mobile App Intern",
      description: "Maintain & extend our React Native app.",
      duration: 3,
      paid: true,
      salary: "2800 EGP",
      skills: "React Native, Redux, TypeScript",
      status: "Active"
    },
    {
      id: 5,
      companyId: 1,
      title: "Data Science Intern",
      description: "Support data analysis & predictive models.",
      duration: 5,
      paid: false,
      salary: "Unpaid",
      skills: "Python, Pandas, scikit-learn",
      status: "Closed"
    }
  ]);

  // get the logged-in company’s id
  const { currentCompanyId } = useCompanies();

  // addInternship helper automatically stamps companyId
  const addInternship = (data) => {
    const newIntern = {
      id: Date.now(),
      companyId: currentCompanyId,
      status: "Active",
      ...data
    };
    setInternships((prev) => [...prev, newIntern]);
  };

  return (
    <InternshipContext.Provider
      value={{ internships, setInternships, addInternship }}
    >
      {children}
    </InternshipContext.Provider>
  );
}
