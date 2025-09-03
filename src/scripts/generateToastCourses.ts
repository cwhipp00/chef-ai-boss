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
    id: 'c9122f58-30c4-48dd-8c56-0725da9ccba4',
    title: 'Toast Kitchen Display Systems Expert',
    instructor: 'James Chen',
    description: 'Optimize kitchen operations with Toast KDS. Learn order flow management, prep time tracking, and kitchen efficiency metrics.',
    duration: 5,
    difficulty: 'intermediate',
    prompt: 'Create a comprehensive 5-hour intermediate course on Toast Kitchen Display Systems Expert training. Cover KDS setup and configuration, order flow management, prep time tracking and optimization, kitchen efficiency metrics, staff workflow optimization, order prioritization, communication between front and back of house, troubleshooting common KDS issues, advanced KDS features, and integration with other Toast systems. Include hands-on exercises for configuring KDS layouts, setting up prep times, and analyzing kitchen performance metrics.'
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
    id: 'a11d3d65-fba2-441b-a3b0-a90bb762210d',
    title: 'Toast Platform Fundamentals',
    instructor: 'Chef Marcus Williams',
    description: 'Complete introduction to Toast\'s restaurant-focused ecosystem. Learn basic POS operations, menu setup, and hardware configuration.',
    duration: 3,
    difficulty: 'beginner',
    prompt: 'Create a comprehensive 3-hour beginner course on Toast Platform Fundamentals. Cover Toast ecosystem overview, basic POS operations and navigation, menu setup and configuration, hardware setup and configuration, user management and permissions, basic reporting features, order processing workflows, payment handling, table management, and getting started with Toast features. Include step-by-step tutorials for setting up a new restaurant, creating menu items, and processing orders.'
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