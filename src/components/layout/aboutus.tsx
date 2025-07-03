import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AboutUs: React.FC = () => {
  const stats = [
    { label: 'Active Users', value: '10,000+' },
    { label: 'Success Stories', value: '5,000+' },
    { label: 'Countries', value: '50+' },
    { label: 'Industries', value: '25+' },
  ];

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Former tech executive with 15+ years building successful platforms.',
      image: '/assets/team/sarah.jpg'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Full-stack engineer passionate about scalable solutions.',
      image: '/assets/team/michael.jpg'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      bio: 'Product strategist focused on user experience and growth.',
      image: '/assets/team/emily.jpg'
    }
  ];

  const values = [
    {
      title: 'Authenticity',
      description: 'We believe in genuine connections and real professional stories.',
      icon: '🎯'
    },
    {
      title: 'Innovation',
      description: 'Continuously evolving to meet the changing needs of professionals.',
      icon: '💡'
    },
    {
      title: 'Community',
      description: 'Building a supportive network of professionals worldwide.',
      icon: '🤝'
    },
    {
      title: 'Excellence',
      description: 'Striving for the highest quality in everything we do.',
      icon: '⭐'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-[#5A8DB8]/10">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              About Proven Pro
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Empowering Professionals
              <span className="text-[#5A8DB8] block">Worldwide</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Proven Pro is the premier platform for professionals to showcase their expertise, 
              connect with opportunities, and build meaningful careers. We're revolutionizing 
              how professionals present themselves in the digital age.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#5A8DB8] mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#5A8DB8] mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We're on a mission to democratize professional success by providing 
                everyone with the tools they need to showcase their expertise, 
                connect with opportunities, and build thriving careers.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                In today's competitive landscape, your digital presence matters more 
                than ever. Proven Pro helps you stand out with professional profiles 
                that tell your unique story and highlight your achievements.
              </p>
              <Button size="lg" className="bg-[#5A8DB8] hover:bg-[#5A8DB8]/80">
                Join Our Community
              </Button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#5A8DB8] to-[#5A8DB8]/80 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Why Choose Proven Pro?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    Professional profile templates
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    AI-powered optimization
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    Global networking opportunities
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">✓</span>
                    24/7 support and guidance
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#5A8DB8] mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do and every decision we make.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#5A8DB8] mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind Proven Pro who are dedicated to your success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#5A8DB8] to-[#5A8DB8]/80 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <Badge variant="outline" className="mb-3">
                    {member.role}
                  </Badge>
                  <p className="text-gray-600">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#5A8DB8] mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Proven Pro was born from a simple observation: talented professionals 
                everywhere were struggling to showcase their expertise effectively 
                in the digital world.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Founded in 2023, we set out to create a platform that would not only 
                help professionals present themselves better but also connect them 
                with opportunities that match their skills and aspirations.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Today, we're proud to serve thousands of professionals across the globe, 
                helping them build meaningful careers and achieve their professional goals.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#5A8DB8] to-[#5A8DB8]/80 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Our Impact</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Career Growth</span>
                  <span className="font-bold">85%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Network Expansion</span>
                  <span className="font-bold">92%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Opportunity Discovery</span>
                  <span className="font-bold">78%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#5A8DB8]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Professional Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of professionals who have already discovered new opportunities 
            and accelerated their careers with Proven Pro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-[#5A8DB8] hover:bg-gray-100">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="border-white text-[#5A8DB8] hover:text-[#5A8DB8]">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
