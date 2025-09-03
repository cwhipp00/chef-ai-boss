import { supabase } from '@/integrations/supabase/client';

// Script to generate comprehensive course materials for Toast training courses

const toastCourses = [
  {
    id: '3e259156-4dde-443e-886d-5386100f7af8',
    title: 'Toast Advanced Analytics & Growth',
    instructor: 'Rachel Park',
    description: 'Leverage Toast\'s restaurant analytics for financial reporting, customer insights, marketing automation, and growth strategies.',
    duration: 5,
    difficulty: 'advanced',
    prompt: 'Create a comprehensive 5-hour advanced course on Toast Analytics & Growth. Cover restaurant analytics dashboard, financial reporting, customer insights and segmentation, marketing automation workflows, growth tracking metrics, ROI analysis, advanced reporting features, data visualization, customer lifetime value analysis, and growth strategy implementation. Include practical exercises for setting up analytics dashboards, creating customer segments, and building automated marketing campaigns.'
  },
  {
    id: '7b11ac79-cda5-4c15-86c4-fdda9a0619c5',
    title: 'Toast Capital & Financial Services',
    instructor: 'Christopher Lee',
    description: 'Understand Toast\'s financing options, cash advances, equipment financing, and financial planning tools for restaurant growth.',
    duration: 2,
    difficulty: 'intermediate',
    prompt: 'Create a comprehensive 2-hour intermediate course on Toast Capital & Financial Services. Cover Toast financing options, cash advance programs, equipment financing, loan application processes, financial planning tools, cash flow management, growth funding strategies, repayment options, eligibility requirements, and integration with Toast reporting for financial decisions. Include practical exercises for evaluating financing options and creating financial growth plans.'
  },
  {
    id: 'c132cca1-9346-4a31-b701-6d0f1abc653e',
    title: 'Toast Integration & Third-Party Apps',
    instructor: 'Amanda Foster',
    description: 'Maximize Toast\'s potential with integrations including delivery platforms, accounting software, loyalty programs, and custom solutions.',
    duration: 3,
    difficulty: 'advanced',
    prompt: 'Create a comprehensive 3-hour advanced course on Toast Integration & Third-Party Apps. Cover Toast app marketplace, popular integrations (delivery platforms, accounting software, loyalty programs), API basics and custom integrations, data synchronization, integration setup and configuration, troubleshooting integration issues, custom solution development, third-party app management, and maximizing integration benefits. Include hands-on exercises for setting up key integrations and troubleshooting common issues.'
  },
  {
    id: '288efdbc-5a17-40ab-a3bf-ee453d091055',
    title: 'Toast Kitchen Display Systems',
    instructor: 'Lisa Wang',
    description: 'Optimize kitchen operations with Toast KDS and order management',
    duration: 4,
    difficulty: 'intermediate',
    prompt: 'Create a comprehensive 4-hour intermediate course on Toast Kitchen Display Systems. Cover KDS setup and configuration, order flow management, kitchen workflow optimization, prep time tracking, order prioritization, staff communication, troubleshooting KDS issues, and integration with POS systems. Include hands-on exercises for configuring KDS layouts, setting up order flows, and optimizing kitchen operations.'
  },
  {
    id: 'c9122f58-30c4-48dd-8c56-0725da9ccba4',
    title: 'Toast Kitchen Display Systems Expert',
    instructor: 'James Chen',
    description: 'Optimize kitchen operations with Toast KDS. Learn order flow management, prep time tracking, and kitchen efficiency metrics.',
    duration: 5,
    difficulty: 'intermediate',
    prompt: 'Create a comprehensive 5-hour intermediate course on Toast Kitchen Display Systems Expert training. Cover advanced KDS setup and configuration, complex order flow management, prep time tracking and optimization, kitchen efficiency metrics, staff workflow optimization, order prioritization, communication between front and back of house, troubleshooting common KDS issues, advanced KDS features, and integration with other Toast systems. Include hands-on exercises for configuring KDS layouts, setting up prep times, and analyzing kitchen performance metrics.'
  },
  {
    id: '4f3262c4-b87f-4ad0-8496-d08a27b0246c',
    title: 'Toast Marketing & Customer Engagement',
    instructor: 'Nicole Davis',
    description: 'Build customer loyalty with Toast\'s marketing suite including email campaigns, loyalty programs, and customer data utilization.',
    duration: 3,
    difficulty: 'intermediate',
    prompt: 'Create a comprehensive 3-hour intermediate course on Toast Marketing & Customer Engagement. Cover Toast marketing suite overview, email campaign creation and management, loyalty program setup and optimization, customer data analysis and segmentation, automated marketing workflows, customer engagement strategies, retention tactics, and performance tracking. Include practical exercises for creating email campaigns, setting up loyalty programs, and analyzing customer data.'
  },
  {
    id: '6b10e8e7-43c1-457a-8a3b-2f7aa6391b95',
    title: 'Toast Menu Engineering & Optimization',
    instructor: 'Isabella Rodriguez',
    description: 'Master menu design principles, item profitability analysis, modifier management, and dynamic pricing strategies for maximum revenue.',
    duration: 4,
    difficulty: 'intermediate',
    prompt: 'Create a comprehensive 4-hour intermediate course on Toast Menu Engineering & Optimization. Cover menu design principles, item profitability analysis, cost calculation and management, modifier setup and pricing, dynamic pricing strategies, menu psychology and layout, seasonal menu planning, A/B testing menu items, menu performance analytics, and revenue optimization techniques. Include practical exercises for analyzing menu profitability, setting up modifiers, and creating profitable menu layouts.'
  },
  {
    id: '2600778a-876c-4e1b-8a15-bc72a68fa885',
    title: 'Toast Multi-Location & Franchise Management',
    instructor: 'Kevin O\'Brien',
    description: 'Scale restaurant operations across multiple locations with centralized reporting, brand consistency, and franchise-specific tools.',
    duration: 4,
    difficulty: 'advanced',
    prompt: 'Create a comprehensive 4-hour advanced course on Toast Multi-Location & Franchise Management. Cover multi-location setup and configuration, centralized reporting and analytics, brand consistency management, franchise-specific tools and features, location performance comparison, centralized menu management, staff management across locations, financial consolidation, and scaling strategies. Include practical exercises for setting up multi-location systems, creating consolidated reports, and managing franchise operations.'
  },
  {
    id: '4dd52bad-ce54-44e1-813b-29e24bb0fe98',
    title: 'Toast Online Ordering & Delivery',
    instructor: 'Sofia Martinez',
    description: 'Build your digital presence with Toast\'s online ordering platform, delivery management, and third-party integration strategies.',
    duration: 4,
    difficulty: 'intermediate',
    prompt: 'Create a comprehensive 4-hour intermediate course on Toast Online Ordering & Delivery. Cover online ordering platform setup, menu optimization for digital orders, delivery management and logistics, third-party delivery platform integrations, order fulfillment workflows, customer communication, delivery tracking, and performance optimization. Include practical exercises for setting up online ordering, integrating delivery platforms, and optimizing digital operations.'
  },
  {
    id: '538e8876-ae9f-42a4-8ee8-40702df29b5e',
    title: 'Toast Payment Processing',
    instructor: 'Carlos Santos',
    description: 'Master Toast\'s payment processing, tips, and financial reporting',
    duration: 3,
    difficulty: 'intermediate',
    prompt: 'Create a comprehensive 3-hour intermediate course on Toast Payment Processing. Cover payment processing fundamentals, tip management and distribution, payment method setup and configuration, transaction reporting, chargeback management, payment security and compliance, financial reconciliation, and troubleshooting payment issues. Include practical exercises for setting up payment methods, configuring tip pools, and managing payment reports.'
  },
  {
    id: 'a11d3d65-fba2-441b-a3b0-a90bb762210d',
    title: 'Toast Platform Fundamentals',
    instructor: 'Chef Marcus Williams',
    description: 'Complete introduction to Toast\'s restaurant-focused ecosystem. Learn basic POS operations, menu setup, and hardware configuration.',
    duration: 3,
    difficulty: 'beginner',
    prompt: 'Create a comprehensive 3-hour beginner course on Toast Platform Fundamentals. Cover Toast ecosystem overview, basic POS operations and navigation, menu setup and configuration, hardware setup and configuration, user management and permissions, basic reporting features, order processing workflows, payment handling, table management, and getting started with Toast features. Include step-by-step tutorials for setting up a new restaurant, creating menu items, and processing orders.'
  },
  {
    id: 'a9b3c4d5-e6f7-4a5b-9c8d-1234567890ab',
    title: 'Toast Staff Management & Scheduling',
    instructor: 'Jennifer Thompson',
    description: 'Streamline staff operations with Toast\'s workforce management tools including scheduling, time tracking, and performance analytics.',
    duration: 3,
    difficulty: 'intermediate',
    prompt: 'Create a comprehensive 3-hour intermediate course on Toast Staff Management & Scheduling. Cover employee management setup, scheduling tools and features, time clock functionality, shift management, labor cost tracking, performance analytics, payroll integration, staff communication tools, and compliance management. Include practical exercises for creating schedules, tracking labor costs, and managing staff performance.'
  },
  {
    id: '2f8e9d0c-3b4a-4c5d-8e7f-9876543210ba',
    title: 'Toast Table Management & Reservations',
    instructor: 'Robert Kim',
    description: 'Optimize dining room operations with Toast\'s table management system, reservation handling, and waitlist features.',
    duration: 2,
    difficulty: 'intermediate',
    prompt: 'Create a comprehensive 2-hour intermediate course on Toast Table Management & Reservations. Cover table layout configuration, reservation system setup, waitlist management, table turn optimization, host station operations, guest communication, special event management, and dining room analytics. Include practical exercises for setting up table layouts, managing reservations, and optimizing table turns.'
  }
];

export const generateToastCourseMaterials = async () => {
  console.log('Starting Toast course material generation...');
  
  for (const course of toastCourses) {
    try {
      console.log(`Generating content for: ${course.title}`);
      
      const { data, error } = await supabase.functions.invoke('ai-course-creator', {
        body: {
          prompt: course.prompt,
          contentType: 'course',
          difficulty: course.difficulty,
          duration: course.duration,
          category: 'pos-toast',
          existingContent: {
            title: course.title,
            instructor: course.instructor,
            description: course.description
          }
        }
      });

      if (error) {
        console.error(`Error generating content for ${course.title}:`, error);
        continue;
      }

      if (data?.content?.lessons) {
        // Save lessons to database
        const lessonsWithCourseId = data.content.lessons.map((lesson: any) => ({
          ...lesson,
          course_id: course.id
        }));

        const { error: lessonsError } = await supabase
          .from('lessons')
          .insert(lessonsWithCourseId);

        if (lessonsError) {
          console.error(`Error saving lessons for ${course.title}:`, lessonsError);
        } else {
          console.log(`✅ Successfully created ${data.content.lessons.length} lessons for ${course.title}`);
        }
      }

    } catch (error) {
      console.error(`Error processing ${course.title}:`, error);
    }
  }
  
  console.log('Toast course material generation completed!');
};

// Export for use in components
export { toastCourses };