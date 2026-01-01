export interface Grant {
  id: string;
  title: string;
  category: string;
  amount: string;
  deadline: string;
  description: string;
  eligibility: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: 'PDF' | 'DOCX' | 'XLSX';
  size: string;
  url: string;
}