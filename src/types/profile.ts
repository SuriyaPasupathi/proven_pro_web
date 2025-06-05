export interface ProfileData {
  id?: string;
  subscription_type: 'free' | 'standard' | 'premium';
  // Profile Fields
  first_name?: string;
  last_name?: string;
  bio?: string;
  rating?: number;
  profile_url?: string;
  profile_mail?: string;
  mobile?: string;

  // Profile Image
  profile_pic?: string;
  profile_pic_url?: string;

  // Services
  categories?: {
    id?: number;
    services_categories: string;
    services_description: string;
    rate_range: string;
    availability: string;
  }[];
  services_categories?: string[];
  services_description?: string;
  rate_range?: string;
  availability?: string;

  // Work Experience
  experiences?: {
    company_name: string;
    position: string;
    key_responsibilities: string;
    experience_start_date: string;
    experience_end_date: string;
  }[];

  // Tools & Skills
  primary_tools?: string[];
  technical_skills?: string[];
  soft_skills?: string[];
  skills_description?: string;

  // Portfolio
  projects?: {
    id?: number;
    project_title: string;
    project_description: string;
    project_url: string;
    project_image?: string;
    project_image_url?: string;
  }[];
  portfolio?: {
    project_title: string;
    project_description: string;
    project_url: string;
    project_image: string;
    project_image_url: string;
  }[];

  // Certifications
  certifications?: {
    certifications_name: string;
    certifications_issuer: string;
    certifications_issued_date: string;
    certifications_expiration_date: string;
    certifications_id: string;
    certifications_image: string;
    certifications_image_url: string;
  }[];

  // Video
  video_intro?: string;
  video_intro_url?: string;
  video_description?: string;

  // Reviews
  reviews?: any[];

  // Verification
  verification_status?: string;
  gov_id_verified?: boolean;
  address_verified?: boolean;
  mobile_verified?: boolean;
  has_gov_id_document?: boolean;
  has_address_document?: boolean;
  verification_details?: {
    government_id: {
      uploaded: boolean;
      verified: boolean;
      percentage: number;
    };
    address_proof: {
      uploaded: boolean;
      verified: boolean;
      percentage: number;
    };
    mobile: {
      provided: boolean;
      verified: boolean;
      percentage: number;
    };
  };
} 