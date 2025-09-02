import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Store, 
  Smartphone, 
  ShoppingCart, 
  Monitor,
  Tablet,
  Building2,
  Coffee,
  Utensils
} from 'lucide-react';

interface POSSystem {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  bestFor: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  coursesCount: number;
}

interface POSSystemSelectorProps {
  onSelectSystem: (systemId: string) => void;
  courseCounts: { [key: string]: number };
}

const posSystemsData: POSSystem[] = [
  {
    id: 'pos-square',
    name: 'Square',
    category: 'All-in-One',
    description: 'Popular payment processing and POS solution for small to medium businesses',
    icon: CreditCard,
    features: ['Payment Processing', 'Inventory Management', 'Analytics', 'Online Store Integration'],
    bestFor: ['Retail', 'Restaurants', 'Service Businesses', 'Pop-up Shops'],
    difficulty: 'beginner',
    coursesCount: 0
  },
  {
    id: 'pos-toast',
    name: 'Toast',
    category: 'Restaurant Focused',
    description: 'Restaurant-specific POS system with kitchen management and ordering features',
    icon: Utensils,
    features: ['Kitchen Display', 'Online Ordering', 'Delivery Integration', 'Staff Management'],
    bestFor: ['Full-Service Restaurants', 'Quick Service', 'Bars', 'Food Trucks'],
    difficulty: 'intermediate',
    coursesCount: 0
  },
  {
    id: 'pos-touchbistro',
    name: 'TouchBistro',
    category: 'Restaurant Management',
    description: 'iPad-based restaurant POS with table management and reservation systems',
    icon: Tablet,
    features: ['Table Management', 'Reservation System', 'Menu Engineering', 'Staff Scheduling'],
    bestFor: ['Fine Dining', 'Casual Dining', 'Cafes', 'Bars'],
    difficulty: 'intermediate',
    coursesCount: 0
  },
  {
    id: 'pos-clover',
    name: 'Clover',
    category: 'Retail & Restaurant',
    description: 'Versatile POS system with extensive app marketplace for customization',
    icon: Store,
    features: ['App Marketplace', 'Inventory Tracking', 'Employee Management', 'Customer Engagement'],
    bestFor: ['Retail Stores', 'Restaurants', 'Service Businesses', 'Multi-location'],
    difficulty: 'beginner',
    coursesCount: 0
  },
  {
    id: 'pos-lightspeed',
    name: 'Lightspeed',
    category: 'Enterprise',
    description: 'Comprehensive POS solution for retail and hospitality with advanced features',
    icon: Monitor,
    features: ['Multi-location Support', 'Advanced Analytics', 'E-commerce Integration', 'Loyalty Programs'],
    bestFor: ['Chain Restaurants', 'Large Retail', 'Hotels', 'Enterprise'],
    difficulty: 'advanced',
    coursesCount: 0
  },
  {
    id: 'pos-resy',
    name: 'Resy',
    category: 'Hospitality',
    description: 'Restaurant reservation and table management system with POS integration',
    icon: Coffee,
    features: ['Reservation Management', 'Table Optimization', 'Guest Profiles', 'Waitlist Management'],
    bestFor: ['Fine Dining', 'Upscale Casual', 'Bars', 'Events'],
    difficulty: 'intermediate',
    coursesCount: 0
  },
  {
    id: 'pos-shopify',
    name: 'Shopify POS',
    category: 'E-commerce Hybrid',
    description: 'Unified POS and e-commerce platform for omnichannel retail',
    icon: ShoppingCart,
    features: ['E-commerce Integration', 'Inventory Sync', 'Customer Profiles', 'Multi-channel Selling'],
    bestFor: ['Retail Stores', 'Online Stores', 'Pop-ups', 'Omnichannel'],
    difficulty: 'beginner',
    coursesCount: 0
  },
  {
    id: 'pos-aloha',
    name: 'NCR Aloha',
    category: 'Enterprise Restaurant',
    description: 'Enterprise-level restaurant POS system for large chains and franchises',
    icon: Building2,
    features: ['Enterprise Reporting', 'Multi-site Management', 'Kitchen Video', 'Labor Management'],
    bestFor: ['Restaurant Chains', 'Franchises', 'Large Operations', 'Multi-location'],
    difficulty: 'advanced',
    coursesCount: 0
  },
  {
    id: 'pos-micros',
    name: 'Oracle Micros',
    category: 'Enterprise',
    description: 'Comprehensive hospitality management system for hotels and large restaurants',
    icon: Building2,
    features: ['Property Management', 'Revenue Management', 'Guest Services', 'Enterprise Analytics'],
    bestFor: ['Hotels', 'Resorts', 'Large Restaurants', 'Entertainment Venues'],
    difficulty: 'advanced',
    coursesCount: 0
  }
];

export const POSSystemSelector: React.FC<POSSystemSelectorProps> = ({ onSelectSystem, courseCounts }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'advanced': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'All-in-One': return 'bg-blue-500/10 text-blue-500';
      case 'Restaurant Focused': return 'bg-orange-500/10 text-orange-500';
      case 'Restaurant Management': return 'bg-purple-500/10 text-purple-500';
      case 'Retail & Restaurant': return 'bg-cyan-500/10 text-cyan-500';
      case 'Enterprise': return 'bg-gray-500/10 text-gray-500';
      case 'Hospitality': return 'bg-pink-500/10 text-pink-500';
      case 'E-commerce Hybrid': return 'bg-green-500/10 text-green-500';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  // Update course counts
  const systemsWithCounts = posSystemsData.map(system => ({
    ...system,
    coursesCount: courseCounts[system.id] || 0
  }));

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Choose Your POS System</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select a point-of-sale system to access specialized training courses, tutorials, and certification programs
        </p>
      </div>

      {/* Filter by Category */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[...new Set(systemsWithCounts.map(s => s.category))].map(category => (
          <Badge key={category} variant="outline" className={getCategoryColor(category)}>
            {category}
          </Badge>
        ))}
      </div>

      {/* POS Systems Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {systemsWithCounts.map((system) => {
          const IconComponent = system.icon;
          return (
            <Card 
              key={system.id} 
              className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-primary/10"
            >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{system.name}</CardTitle>
                      <Badge variant="outline" className={getCategoryColor(system.category)}>
                        {system.category}
                      </Badge>
                    </div>
                  </div>
                  <Badge className={`${getDifficultyColor(system.difficulty)} border`}>
                    {system.difficulty}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">{system.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Key Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {system.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {system.features.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{system.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Best For */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Best For</h4>
                  <div className="text-xs text-muted-foreground">
                    {system.bestFor.slice(0, 2).join(', ')}
                    {system.bestFor.length > 2 && ` +${system.bestFor.length - 2} more`}
                  </div>
                </div>

                {/* Course Count and Action */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm text-muted-foreground">
                    {system.coursesCount} courses available
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => onSelectSystem(system.id)}
                    className="group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    Start Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="text-center pt-8">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold mb-4">Complete Learning Paths</h3>
          <p className="text-muted-foreground">
            Each POS system includes comprehensive training from basic setup to advanced features, 
            with hands-on exercises, real-world scenarios, and certification opportunities.
          </p>
          <div className="flex justify-center gap-8 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Beginner Friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Intermediate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Advanced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};