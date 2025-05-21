export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  title?: string;
  company?: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  skills: string[];
  bio?: string;
}

export interface Review {
  id: string;
  userId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerPicture?: string;
  reviewerTitle?: string;
  reviewerCompany?: string;
  rating: number;
  content: string;
  date: string;
  verified: boolean;
}

export interface TestimonialProps {
  id: string;
  name: string;
  title: string;
  company: string;
  image: string;
  content: string;
  rating: number;
  verified: boolean;
}

export interface ProfessionalCardProps {
  user: User;
  onClick?: (id: string) => void;
}