import { Grant, TeamMember, FAQItem, ResourceItem } from './types';

export const GRANTS: Grant[] = [
  {
    id: 'sba-biz-2026',
    title: 'SBA Small Business Assistance',
    category: 'Business Support',
    amount: '$10,000 - $150,000',
    deadline: 'Open Enrollment',
    description: 'Federal assistance program for US small businesses. Provides capital for operational expansion, payroll support, and equipment purchase. Administered according to Small Business Administration guidelines.',
    eligibility: ['US-Based Business', 'Under 500 Employees', 'Valid Tax ID'],
  },
  {
    id: 'home-equity-24',
    title: 'Homeowner Repair & Equity Grant',
    category: 'Home Relief',
    amount: '$5,000 - $50,000',
    deadline: 'April 15, 2026',
    description: 'Funding for primary residence homeowners to perform critical repairs, safety upgrades, and energy efficiency improvements. Helps stabilize property value and ensure safe housing.',
    eligibility: ['US Homeowner', 'Primary Residence', 'Property Tax Current'],
  },
  {
    id: 'personal-hardship',
    title: 'Personal Financial Hardship Relief',
    category: 'Personal Support',
    amount: '$2,000 - $15,000',
    deadline: 'Rolling Basis',
    description: 'Direct financial aid for individuals and families experiencing economic hardship. Funds can be used for rent, utilities, food, and essential debt management.',
    eligibility: ['US Citizen/Resident', 'Proof of Hardship', '18+ Years Old'],
  },
  {
    id: 'health-care-assist',
    title: 'Medical Assistance Program',
    category: 'Health',
    amount: '$5,000 - $25,000',
    deadline: 'May 30, 2026',
    description: 'Supplementary funding to assist with high out-of-pocket medical expenses, prescription costs, and necessary medical procedures not fully covered by insurance.',
    eligibility: ['Income Qualified', 'Documented Medical Need'],
  },
];

export const TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Jennings',
    role: 'Program Director',
    bio: 'Sarah oversees the equitable distribution of funds and ensures compliance with federal grant standards.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: '2',
    name: 'David Ross',
    role: 'SBA Specialist',
    bio: 'David assists business owners in navigating the Small Business Administration application requirements.',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    role: 'Case Manager',
    bio: 'Elena works with individual applicants to verify eligibility and expedite personal hardship claims.',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400',
  },
];

export const FAQS: FAQItem[] = [
  {
    id: 'q1',
    question: 'How do I know if I qualify?',
    answer: 'Eligibility varies by program. Generally, you must be a US resident or citizen. Business grants require a registered business entity. Check specific grant details for more info.',
  },
  {
    id: 'q2',
    question: 'Is there a cost to apply?',
    answer: 'No. The National Grant Assistance Portal never charges an application fee. All programs listed are publicly funded or subsidized.',
  },
  {
    id: 'q3',
    question: 'How long does the review process take?',
    answer: 'Most applications are reviewed within 5-7 business days. You will be notified via email regarding your status.',
  },
];

export const RESOURCES: ResourceItem[] = [
  {
    id: 'r1',
    title: 'Required Documents Checklist',
    description: 'A list of identification and financial documents needed for your application.',
    type: 'PDF',
    size: '150 KB',
    url: '#',
  },
  {
    id: 'r2',
    title: 'SBA Eligibility Guide',
    description: 'Official criteria for Small Business Administration assistance.',
    type: 'PDF',
    size: '1.2 MB',
    url: '#',
  },
  {
    id: 'r3',
    title: 'Income Verification Worksheet',
    description: 'Form to help you calculate and report household income accurately.',
    type: 'DOCX',
    size: '45 KB',
    url: '#',
  },
];