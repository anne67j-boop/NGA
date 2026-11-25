export type Grant = {
  id: string;
  title: string;
  category: string;
  amount: string;
  deadline: string;
  description: string;
  eligibility: string[];
};

export const GRANTS: Grant[] = [
  {
    id: "sba-biz-2026",
    title: "Small Business Assistance",
    category: "Business Support",
    amount: "$10,000–$150,000",
    deadline: "Open enrollment",
    description: "A tutorial grant record used to demonstrate searching, eligibility review and application intake.",
    eligibility: ["U.S.-based business", "Valid business/tax information", "Program-specific eligibility"],
  },
  {
    id: "home-repair-2026",
    title: "Home Repair & Improvement Assistance",
    category: "Home Support",
    amount: "$5,000–$50,000",
    deadline: "Program dependent",
    description: "A tutorial grant record for demonstrating a homeowner assistance workflow.",
    eligibility: ["Primary residence", "Documented repair need", "Program-specific eligibility"],
  },
  {
    id: "hardship-2026",
    title: "Personal Hardship Assistance",
    category: "Personal Support",
    amount: "$2,000–$15,000",
    deadline: "Rolling",
    description: "A tutorial grant record for demonstrating a personal assistance application.",
    eligibility: ["Documented need", "Identity information", "Program-specific eligibility"],
  },
  {
    id: "health-2026",
    title: "Medical Assistance",
    category: "Health Support",
    amount: "$5,000–$25,000",
    deadline: "Program dependent",
    description: "A tutorial grant record for demonstrating a medical-assistance intake workflow.",
    eligibility: ["Documented medical need", "Income/household information", "Program-specific eligibility"],
  },
];

export const CATEGORIES = ["All", ...Array.from(new Set(GRANTS.map((g) => g.category)))];
