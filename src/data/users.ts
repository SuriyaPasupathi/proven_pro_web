import { User } from '@/lib/types';

export const users: User[] = [
  {
    id: '1',
    name: 'Zara B.',
    email: 'zara@example.com',
    profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Senior Product Designer',
    company: 'Designify',
    verified: true,
    rating: 4.9,
    reviewCount: 28,
    skills: ['UI/UX', 'Product Design', 'Wireframing', 'Figma'],
    bio: 'Award-winning product designer with 8+ years of experience creating user-centered digital products for enterprise clients.'
  },
  {
    id: '2',
    name: 'John D.',
    email: 'john@example.com',
    profilePicture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Software Architect',
    company: 'TechSolutions',
    verified: true,
    rating: 5.0,
    reviewCount: 42,
    skills: ['React', 'Node.js', 'Cloud Architecture', 'System Design'],
    bio: 'Experienced software architect specializing in scalable web applications and distributed systems.'
  },
  {
    id: '3',
    name: 'Sarah P.',
    email: 'sarah@example.com',
    profilePicture: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Marketing Consultant',
    company: 'GrowthLab',
    verified: true,
    rating: 4.8,
    reviewCount: 35,
    skills: ['Digital Marketing', 'Content Strategy', 'SEO', 'Social Media'],
    bio: 'Results-driven marketing consultant with a track record of increasing conversions and brand visibility.'
  },
  {
    id: '4',
    name: 'Michael T.',
    email: 'michael@example.com',
    profilePicture: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Data Scientist',
    company: 'DataMetrics',
    verified: true,
    rating: 4.7,
    reviewCount: 19,
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'Visualization'],
    bio: 'Data scientist with expertise in predictive modeling and turning complex data into actionable insights.'
  },
  {
    id: '5',
    name: 'Emma L.',
    email: 'emma@example.com',
    profilePicture: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Project Manager',
    company: 'AgileWorks',
    verified: true,
    rating: 4.9,
    reviewCount: 31,
    skills: ['Agile', 'Scrum', 'Stakeholder Management', 'Risk Management'],
    bio: 'Certified project manager with a passion for delivering complex projects on time and under budget.'
  },
  {
    id: '6',
    name: 'David R.',
    email: 'david@example.com',
    profilePicture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    title: 'Financial Advisor',
    company: 'WealthWise',
    verified: false,
    rating: 4.5,
    reviewCount: 12,
    skills: ['Investment Planning', 'Tax Strategy', 'Retirement Planning', 'Estate Planning'],
    bio: 'Financial advisor helping professionals make strategic decisions for their long-term financial well-being.'
  }
];