import  { useState } from 'react';
import Select from 'react-select';

interface Option {
  value: string;
  label: string;
}

export const positionOptions: Option[] = [
  { value: 'frontend-developer', label: 'Frontend Developer' },
  { value: 'backend-developer', label: 'Backend Developer' },
  { value: 'fullstack-developer', label: 'Full Stack Developer' },
  { value: 'uiux-designer', label: 'UI/UX Designer' },
  { value: 'graphic-designer', label: 'Graphic Designer' },
  { value: 'product-designer', label: 'Product Designer' },
  { value: 'digital-marketer', label: 'Digital Marketer' },
  { value: 'seo-specialist', label: 'SEO Specialist' },
  { value: 'content-writer', label: 'Content Writer' },
  { value: 'copywriter', label: 'Copywriter' },
  { value: 'technical-writer', label: 'Technical Writer' },
  { value: 'mobile-developer', label: 'Mobile App Developer' },
  { value: 'ios-developer', label: 'iOS Developer' },
  { value: 'android-developer', label: 'Android Developer' },
  { value: 'motion-designer', label: 'Motion Graphics Designer' },
  { value: 'video-editor', label: 'Video Editor' },
  { value: 'data-analyst', label: 'Data Analyst' },
  { value: 'data-scientist', label: 'Data Scientist' },
  { value: 'ml-engineer', label: 'Machine Learning Engineer' },
  { value: 'devops-engineer', label: 'DevOps Engineer' },
  { value: 'cloud-architect', label: 'Cloud Architect' },
  { value: 'it-support', label: 'IT Support Specialist' },
  { value: 'project-manager', label: 'Project Manager' },
  { value: 'business-analyst', label: 'Business Analyst' },
  { value: 'qa-engineer', label: 'QA Engineer' },
  { value: 'cybersecurity-specialist', label: 'Cybersecurity Specialist' }
];

export const toolOptions: Option[] = [
  { value: 'adobe-suite', label: 'Adobe Creative Suite' },
  { value: 'figma', label: 'Figma' },
  { value: 'sketch', label: 'Sketch' },
  { value: 'vscode', label: 'VS Code' },
  { value: 'webstorm', label: 'WebStorm' },
  { value: 'android-studio', label: 'Android Studio' },
  { value: 'xcode', label: 'Xcode' },
  { value: 'git-github', label: 'Git & GitHub' },
  { value: 'postman', label: 'Postman' },
  { value: 'jira', label: 'Jira' },
  { value: 'trello', label: 'Trello' },
  { value: 'slack', label: 'Slack' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'blender', label: 'Blender' },
  { value: 'canva', label: 'Canva' }
];

export const techSkillOptions: Option[] = [
  { value: 'html-css-js', label: 'HTML, CSS, JavaScript' },
  { value: 'react', label: 'React.js' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'node', label: 'Node.js' },
  { value: 'express', label: 'Express.js' },
  { value: 'python', label: 'Python' },
  { value: 'django', label: 'Django' },
  { value: 'flask', label: 'Flask' },
  { value: 'php', label: 'PHP' },
  { value: 'laravel', label: 'Laravel' },
  { value: 'java', label: 'Java' },
  { value: 'springboot', label: 'Spring Boot' },
  { value: 'csharp', label: 'C#, .NET' },
  { value: 'sql', label: 'SQL' },
  { value: 'postgres', label: 'PostgreSQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'rest', label: 'REST APIs' },
  { value: 'graphql', label: 'GraphQL' },
  { value: 'docker', label: 'Docker' },
  { value: 'kubernetes', label: 'Kubernetes' },
  { value: 'aws', label: 'AWS' },
  { value: 'azure', label: 'Azure' },
  { value: 'gcp', label: 'Google Cloud' },
  { value: 'ci-cd', label: 'CI/CD Pipelines' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'nuxtjs', label: 'Nuxt.js' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'tailwind', label: 'Tailwind CSS' },
  { value: 'bootstrap', label: 'Bootstrap' }
];

export const softSkillOptions: Option[] = [
  { value: 'communication', label: 'Communication' },
  { value: 'collaboration', label: 'Team Collaboration' },
  { value: 'problem-solving', label: 'Problem-Solving' },
  { value: 'time-management', label: 'Time Management' },
  { value: 'adaptability', label: 'Adaptability' },
  { value: 'critical-thinking', label: 'Critical Thinking' },
  { value: 'creativity', label: 'Creativity' },
  { value: 'attention-to-detail', label: 'Attention to Detail' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'client-management', label: 'Client Management' },
  { value: 'conflict-resolution', label: 'Conflict Resolution' },
  { value: 'empathy', label: 'Empathy' },
  { value: 'accountability', label: 'Accountability' }
];

export const serviceCategoryOptions: Option[] = [
  { value: 'web-dev', label: 'Web Development (Frontend, Backend, Full Stack, Web Applications)' },
  { value: 'design', label: 'Design (UI/UX, Graphic Design, Branding, Product Design)' },
  { value: 'marketing', label: 'Marketing (Digital Marketing, Social Media, Email Campaigns)' },
  { value: 'seo', label: 'SEO (Search Engine Optimization, Keyword Research, On-page & Off-page SEO)' },
  { value: 'content-writing', label: 'Content Writing (Blog Writing, Copywriting, Technical Writing, Script Writing)' },
  { value: 'mobile-app', label: 'Mobile App Development (iOS, Android, Cross-platform)' },
  { value: 'video-animation', label: 'Video & Animation (Explainers, Motion Graphics, Editing)' },
  { value: 'data-analytics', label: 'Data & Analytics (Data Science, BI, Data Visualization, Machine Learning)' },
  { value: 'devops-it', label: 'DevOps & IT (Cloud Services, CI/CD, Infrastructure Management)' }
];

export const rateRangeOptions: Option[] = [
  { value: '25-50', label: '$25 - $50/hour (Entry-level freelancers or small tasks)' },
  { value: '50-100', label: '$50 - $100/hour (Mid-level professionals)' },
  { value: '100-150', label: '$100 - $150/hour (Senior professionals)' },
  { value: '150+', label: '$150+/hour (Top-tier experts)' }
];

export const availabilityOptions: Option[] = [
  { value: 'full-time', label: 'Full-time (40+ hours/week)' },
  { value: 'part-time', label: 'Part-time (10–30 hours/week)' },
  { value: 'freelance', label: 'Freelance (Project-based)' },
  { value: 'not-available', label: 'Not Available' }
];

export default function FreelancerForm() {
  const [formData, setFormData] = useState({
    position: null,
    tools: [],
    techSkills: [],
    softSkills: [],
    serviceCategory: null,
    rateRange: null,
    availability: null
  });

  const handleChange = (field: string) => (selected: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: selected
    }));
  };

  const handleSubmit = () => {
    console.log('Form Submitted:', formData);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Freelancer Profile</h1>

      <Select
        options={positionOptions}
        placeholder="Select IT Position"
        onChange={handleChange('position')}
        isClearable
      />

      <Select
        options={toolOptions}
        placeholder="Select Primary Tools"
        onChange={handleChange('tools')}
        isMulti
      />

      <Select
        options={techSkillOptions}
        placeholder="Select Technical Skills"
        onChange={handleChange('techSkills')}
        isMulti
      />

      <Select
        options={softSkillOptions}
        placeholder="Select Soft Skills"
        onChange={handleChange('softSkills')}
        isMulti
      />

      <Select
        options={serviceCategoryOptions}
        placeholder="Select Main Service Category"
        onChange={handleChange('serviceCategory')}
        isClearable
      />

      <Select
        options={rateRangeOptions}
        placeholder="Select Rate Range"
        onChange={handleChange('rateRange')}
        isClearable
      />

      <Select
        options={availabilityOptions}
        placeholder="Select Availability"
        onChange={handleChange('availability')}
        isClearable
      />

      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </div>
  );
}
