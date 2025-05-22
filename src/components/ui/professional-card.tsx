import { useState } from 'react';
import { Card,  CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ProfessionalCardProps } from '@/lib/types';
import { cn } from '@/lib/utils';

export function ProfessionalCard({ user, onClick }: ProfessionalCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 h-full flex flex-col",
        isHovered ? "shadow-md translate-y-[-4px]" : "shadow border"
      )} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(user.id)}
    >
      <div className="relative pt-6 px-6">
        <div className="flex justify-between items-start mb-4">
          <Avatar className="h-16 w-16 border-2 border-background">
            <AvatarImage src={user.profilePicture} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 mb-1">
              <span className="font-medium">{user.rating.toFixed(1)}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm text-muted-foreground">{user.reviewCount} reviews</span>
          </div>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">{user.name}</h3>
            {user.verified && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500">
                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <p className="text-muted-foreground text-sm mb-3">{user.title}{user.company && ` • ${user.company}`}</p>
          
          <p className="text-sm line-clamp-3 mb-4">{user.bio}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {user.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="font-normal">
                {skill}
              </Badge>
            ))}
            {user.skills.length > 3 && (
              <Badge variant="outline" className="font-normal">
                +{user.skills.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <CardFooter className="mt-auto p-6 pt-4 border-t">
        <Button className="w-full">View Profile</Button>
      </CardFooter>
    </Card>
  );
}