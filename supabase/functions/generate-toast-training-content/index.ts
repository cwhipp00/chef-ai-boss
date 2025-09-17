import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ToastTrainingModule {
  title: string;
  description: string;
  content: any;
  duration: number;
  order: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { courseId, courseName } = await req.json();
    
    console.log(`Generating training content for course: ${courseName}`);

    // Determine training modules based on course name/type
    const trainingModules = await generateTrainingModules(courseName);
    
    // Insert lessons into the database
    const lessons = [];
    for (let i = 0; i < trainingModules.length; i++) {
      const module = trainingModules[i];
      
      const { data: lesson, error } = await supabase
        .from('lessons')
        .insert({
          course_id: courseId,
          title: module.title,
          description: module.description,
          content: module.content,
          order_index: module.order,
          duration_minutes: module.duration
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting lesson:', error);
        continue;
      }

      lessons.push(lesson);
    }

    console.log(`Generated ${lessons.length} lessons for ${courseName}`);

    return new Response(JSON.stringify({ 
      success: true, 
      lessonsGenerated: lessons.length,
      lessons: lessons 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating training content:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate training content',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateTrainingModules(courseName: string): Promise<ToastTrainingModule[]> {
  const courseType = courseName.toLowerCase();
  
  if (courseType.includes('toast') && courseType.includes('fundamental')) {
    return generateToastFundamentals();
  } else if (courseType.includes('toast') && courseType.includes('analytics')) {
    return generateToastAnalytics();
  } else if (courseType.includes('toast') && courseType.includes('menu')) {
    return generateToastMenuEngineering();
  } else if (courseType.includes('toast') && courseType.includes('kitchen')) {
    return generateToastKitchenDisplay();
  } else if (courseType.includes('toast') && courseType.includes('security')) {
    return generateToastSecurity();
  } else {
    return generateGenericToastTraining();
  }
}

function generateToastFundamentals(): ToastTrainingModule[] {
  return [
    {
      title: "Toast POS System Overview",
      description: "Introduction to Toast's restaurant-focused POS ecosystem and core features",
      duration: 15,
      order: 1,
      content: {
        type: "interactive_lesson",
        sections: [
          {
            title: "What is Toast POS?",
            content: `Toast is a comprehensive restaurant management platform that combines point-of-sale, kitchen display systems, online ordering, and business intelligence tools specifically designed for restaurants.

Key Features:
• Cloud-based POS system
• Kitchen Display System (KDS)
• Online ordering and delivery integration
• Inventory management
• Staff scheduling and payroll
• Real-time analytics and reporting
• Customer relationship management`,
            media: [],
            quiz: [
              {
                question: "What type of businesses is Toast POS primarily designed for?",
                options: ["Retail stores", "Restaurants", "Medical offices", "All businesses"],
                correct: 1
              }
            ]
          },
          {
            title: "Toast Hardware Components",
            content: `Toast POS uses specialized hardware designed for restaurant environments:

Terminal Options:
• Toast Flex - Portable handheld device
• Toast Go - Mobile POS for tableside service
• Toast Terminal - Fixed countertop unit
• Kitchen Display Screens
• Receipt printers
• Cash drawers
• Payment processing devices

All hardware is purpose-built for durability in restaurant environments with spill-resistant designs and easy cleaning.`,
            media: [],
            quiz: [
              {
                question: "Which Toast device is designed for tableside service?",
                options: ["Toast Flex", "Toast Go", "Toast Terminal", "Kitchen Display"],
                correct: 1
              }
            ]
          },
          {
            title: "Getting Started with Toast",
            content: `Initial Setup Process:

1. Account Setup
   • Create restaurant profile
   • Configure basic settings
   • Set up payment processing

2. Menu Configuration
   • Add menu categories
   • Input menu items with prices
   • Configure modifiers and options
   • Set up tax rates

3. Staff Setup
   • Create employee accounts
   • Set permissions and roles
   • Configure access levels

4. Hardware Installation
   • Connect terminals and printers
   • Test all devices
   • Configure network settings

Best Practices:
• Start with a simple menu structure
• Train staff before going live
• Have backup plans for connectivity issues
• Keep software updated`,
            media: [],
            quiz: [
              {
                question: "What should you configure first when setting up Toast?",
                options: ["Hardware", "Menu items", "Restaurant profile", "Staff accounts"],
                correct: 2
              }
            ]
          }
        ]
      }
    },
    {
      title: "Menu Setup and Management",
      description: "Learn to create, organize, and optimize your digital menu in Toast",
      duration: 20,
      order: 2,
      content: {
        type: "interactive_lesson",
        sections: [
          {
            title: "Menu Structure in Toast",
            content: `Toast organizes menus in a hierarchical structure:

Menu Hierarchy:
1. Categories (e.g., Appetizers, Main Courses, Desserts)
2. Items (individual dishes/products)
3. Modifiers (customizations like size, cooking preference)
4. Option Groups (collections of modifiers)

Strategic Menu Organization:
• Group similar items together
• Order categories by sales priority
• Use descriptive category names
• Consider workflow efficiency for kitchen staff

Menu Display Options:
• Visual menu with photos
• List-based menu
• Grid layout
• Category-based navigation`,
            media: [],
            quiz: [
              {
                question: "What is the top level of Toast's menu hierarchy?",
                options: ["Items", "Categories", "Modifiers", "Options"],
                correct: 1
              }
            ]
          },
          {
            title: "Adding Menu Items",
            content: `Creating effective menu items in Toast:

Required Information:
• Item name and description
• Price (including tax settings)
• Category assignment
• Availability settings

Optional Enhancements:
• High-quality photos
• Dietary icons (vegetarian, gluten-free, etc.)
• Preparation time estimates
• Ingredient cost tracking
• Nutritional information

Pricing Strategies:
• Use psychological pricing ($9.99 vs $10.00)
• Consider portion costs and desired margins
• Test different price points
• Monitor competitor pricing

Item Configuration Tips:
• Write compelling descriptions
• Use consistent naming conventions
• Set accurate prep times
• Configure proper tax categories`,
            media: [],
            quiz: [
              {
                question: "What pricing strategy uses prices like $9.99 instead of $10.00?",
                options: ["Cost-plus pricing", "Psychological pricing", "Premium pricing", "Competitive pricing"],
                correct: 1
              }
            ]
          },
          {
            title: "Modifiers and Customization",
            content: `Toast modifiers allow customers to customize orders:

Modifier Types:
• Required modifiers (must choose one)
• Optional modifiers (can choose multiple)
• Quantity-based modifiers
• Price-adjusting modifiers

Common Modifier Examples:
• Size options (Small, Medium, Large)
• Cooking preferences (Rare, Medium, Well-done)
• Add-ons (Extra cheese, Bacon, Avocado)
• Substitutions (Gluten-free bun, Side salad)
• Dietary restrictions (No onions, Extra spicy)

Modifier Group Setup:
1. Create modifier groups
2. Add individual modifiers
3. Set pricing for each option
4. Configure selection rules
5. Assign to menu items

Best Practices:
• Keep modifier lists manageable
• Price modifiers appropriately
• Use clear, descriptive names
• Test modifier combinations
• Train staff on popular modifications`,
            media: [],
            quiz: [
              {
                question: "What type of modifier requires the customer to make a selection?",
                options: ["Optional modifier", "Required modifier", "Price modifier", "Quantity modifier"],
                correct: 1
              }
            ]
          }
        ]
      }
    },
    {
      title: "Taking Orders and Processing Payments",
      description: "Master order entry, payment processing, and customer service workflows",
      duration: 25,
      order: 3,
      content: {
        type: "interactive_lesson",
        sections: [
          {
            title: "Order Entry Workflow",
            content: `Efficient order taking in Toast:

Standard Order Process:
1. Select dining option (Dine-in, Takeout, Delivery)
2. Add items to order
3. Apply modifiers and customizations
4. Review order details
5. Add customer information if needed
6. Process payment
7. Send order to kitchen

Quick Order Tips:
• Use item search function
• Learn keyboard shortcuts
• Utilize favorites and quick-access items
• Group similar items together
• Double-check special requests

Table Management:
• Assign orders to specific tables
• Transfer orders between tables
• Merge or split checks
• Handle party size changes
• Manage table status updates

Special Order Handling:
• Rush orders
• Allergy notifications
• Special preparation instructions
• Timing requests (all together, staggered)
• VIP customer notes`,
            media: [],
            quiz: [
              {
                question: "What should you do first when taking an order in Toast?",
                options: ["Add items", "Select dining option", "Get payment", "Add customer info"],
                correct: 1
              }
            ]
          },
          {
            title: "Payment Processing",
            content: `Toast supports multiple payment methods:

Accepted Payment Types:
• Credit and debit cards
• Contactless payments (Apple Pay, Google Pay)
• Gift cards
• Cash
• Split payments
• Tips processing

Payment Processing Steps:
1. Review order total
2. Select payment method
3. Process payment (swipe, insert, tap)
4. Handle tip entry
5. Print or send receipt
6. Update order status

Split Payment Options:
• Split evenly between multiple cards
• Split by specific amounts
• Split by individual items
• Mix payment methods (part cash, part card)

Tip Handling:
• Default tip percentages (15%, 18%, 20%)
• Custom tip amounts
• No tip option
• Tip pooling for staff
• Credit card tip processing

Security Best Practices:
• Never store customer payment information
• Follow PCI compliance guidelines
• Secure card reader placement
• Regular software updates
• Staff training on fraud prevention`,
            media: [],
            quiz: [
              {
                question: "What payment security standard should restaurants follow?",
                options: ["PCI compliance", "SSL certification", "GDPR compliance", "HIPAA compliance"],
                correct: 0
              }
            ]
          },
          {
            title: "Order Management and Kitchen Communication",
            content: `Efficient order flow from POS to kitchen:

Order Status Workflow:
1. New - Order just placed
2. Sent to Kitchen - Order transmitted to KDS
3. In Progress - Kitchen has started preparation
4. Ready - Order completed and ready for service
5. Served - Order delivered to customer
6. Paid - Payment processed and order closed

Kitchen Display System (KDS) Integration:
• Orders automatically appear on kitchen screens
• Color-coded by urgency and type
• Preparation time tracking
• Special instructions highlighted
• Order modification alerts

Order Modifications:
• Add items to existing orders
• Remove items (with proper authorization)
• Modify cooking instructions
• Update quantities
• Apply discounts or comps

Communication Features:
• Kitchen notes and special requests
• Allergy alerts and warnings
• Timing coordination between courses
• Rush order notifications
• Customer preference tracking

Fire Orders and Timing:
• Control when orders go to kitchen
• Coordinate multiple course timing
• Manage large party orders
• Handle special timing requests
• Communicate delays to customers`,
            media: [],
            quiz: [
              {
                question: "What does KDS stand for in restaurant operations?",
                options: ["Kitchen Data System", "Kitchen Display System", "Kitchen Delivery Service", "Kitchen Digital Solution"],
                correct: 1
              }
            ]
          }
        ]
      }
    }
  ];
}

function generateToastAnalytics(): ToastTrainingModule[] {
  return [
    {
      title: "Toast Analytics Dashboard Overview",
      description: "Navigate and understand Toast's comprehensive reporting suite",
      duration: 20,
      order: 1,
      content: {
        type: "interactive_lesson",
        sections: [
          {
            title: "Analytics Dashboard Navigation",
            content: `Toast Analytics provides real-time insights into your restaurant's performance:

Main Dashboard Sections:
• Sales Overview - Today's revenue, transaction count, average check
• Labor Performance - Staff efficiency, labor cost percentage
• Menu Performance - Top-selling items, item profitability
• Customer Insights - Guest count, frequency, spending patterns
• Financial Summary - Daily, weekly, monthly performance

Key Performance Indicators (KPIs):
• Revenue Growth - Compare periods and track trends
• Average Check Size - Monitor customer spending
• Table Turnover - Optimize seating efficiency
• Labor Cost % - Control operational expenses
• Food Cost % - Manage ingredient expenses
• Customer Satisfaction - Track review scores

Real-Time vs Historical Data:
• Live dashboard updates throughout service
• Historical reporting for trend analysis
• Customizable date ranges
• Export capabilities for external analysis
• Scheduled report delivery

Dashboard Customization:
• Pin favorite reports
• Set up alerts for key metrics
• Create custom views
• Configure user permissions
• Mobile access for managers`,
            media: [],
            quiz: [
              {
                question: "What metric helps optimize seating efficiency?",
                options: ["Average check size", "Table turnover", "Labor cost %", "Food cost %"],
                correct: 1
              }
            ]
          }
        ]
      }
    },
    {
      title: "Sales and Revenue Analysis",
      description: "Deep dive into sales performance metrics and revenue optimization",
      duration: 25,
      order: 2,
      content: {
        type: "interactive_lesson",
        sections: [
          {
            title: "Sales Performance Metrics",
            content: `Understanding and analyzing your sales data:

Core Sales Metrics:
• Gross Sales - Total revenue before taxes and fees
• Net Sales - Revenue after discounts and voids
• Transaction Count - Number of completed orders
• Average Transaction Value - Revenue per order
• Sales per Hour - Revenue generation rate
• Sales per Square Foot - Space efficiency metric

Revenue Breakdown Analysis:
• Food vs Beverage sales mix
• Dine-in vs Takeout vs Delivery
• Peak vs Off-peak performance
• Day-of-week patterns
• Seasonal trends and variations

Comparative Analysis:
• Year-over-year growth
• Month-over-month trends
• Day-over-day comparisons
• Same-store sales growth
• Industry benchmark comparisons

Revenue Optimization Strategies:
• Identify peak hours for staffing
• Promote high-margin items
• Optimize menu pricing
• Develop upselling programs
• Create targeted promotions`,
            media: [],
            quiz: [
              {
                question: "What is the difference between gross sales and net sales?",
                options: ["Taxes", "Discounts and voids", "Tips", "Payment processing fees"],
                correct: 1
              }
            ]
          }
        ]
      }
    }
  ];
}

function generateToastMenuEngineering(): ToastTrainingModule[] {
  return [
    {
      title: "Menu Engineering Fundamentals",
      description: "Learn to analyze and optimize your menu for maximum profitability",
      duration: 30,
      order: 1,
      content: {
        type: "interactive_lesson",
        sections: [
          {
            title: "Menu Engineering Basics",
            content: `Menu engineering combines sales data with profitability analysis:

The Four Categories:
• Stars - High profit, high popularity (promote heavily)
• Plow Horses - Low profit, high popularity (reduce costs or increase price)
• Puzzles - High profit, low popularity (increase marketing)
• Dogs - Low profit, low popularity (consider removing)

Key Metrics for Analysis:
• Item profitability (gross profit per item)
• Popularity index (% of total sales)
• Contribution margin (profit ÷ selling price)
• Sales velocity (items sold per period)
• Customer preference scores

Data Collection in Toast:
• Sales mix reports
• Item performance analytics
• Cost analysis tools
• Profit margin calculations
• Customer ordering patterns

Strategic Menu Placement:
• Prime real estate for Stars
• De-emphasize Dogs
• Reposition Puzzles
• Cost-engineer Plow Horses
• Test and measure changes`,
            media: [],
            quiz: [
              {
                question: "What menu engineering category has high profit but low popularity?",
                options: ["Stars", "Plow Horses", "Puzzles", "Dogs"],
                correct: 2
              }
            ]
          }
        ]
      }
    }
  ];
}

function generateToastKitchenDisplay(): ToastTrainingModule[] {
  return [
    {
      title: "Kitchen Display System Setup",
      description: "Configure and optimize Toast KDS for efficient kitchen operations",
      duration: 25,
      order: 1,
      content: {
        type: "interactive_lesson",
        sections: [
          {
            title: "KDS Configuration",
            content: `Setting up your Kitchen Display System for maximum efficiency:

Screen Layout Options:
• Single station setup
• Multi-station configuration  
• Expo station coordination
• Preparation vs finishing screens
• Mobile kitchen displays

Order Display Features:
• Color-coding by order type
• Timer displays for order age
• Special instruction highlighting
• Allergy and dietary alerts
• Order priority indicators

Workflow Optimization:
• Logical order arrangement
• Kitchen station assignments
• Preparation time tracking
• Queue management
• Staff communication tools

Performance Monitoring:
• Average ticket times
• Kitchen efficiency metrics
• Order accuracy tracking
• Peak time management
• Staff productivity analysis`,
            media: [],
            quiz: [
              {
                question: "What feature helps manage order urgency in KDS?",
                options: ["Color-coding", "Timer displays", "Priority indicators", "All of the above"],
                correct: 3
              }
            ]
          }
        ]
      }
    }
  ];
}

function generateToastSecurity(): ToastTrainingModule[] {
  return [
    {
      title: "PCI Compliance and Security",
      description: "Ensure your Toast system meets security standards and protects customer data",
      duration: 20,
      order: 1,
      content: {
        type: "interactive_lesson",
        sections: [
          {
            title: "PCI Compliance Requirements",
            content: `Understanding Payment Card Industry (PCI) standards:

PCI DSS Requirements:
• Secure network and systems
• Protect cardholder data
• Maintain vulnerability management
• Implement strong access controls
• Monitor and test networks regularly
• Information security policy

Toast Security Features:
• End-to-end encryption
• Tokenization of payment data
• Secure data transmission
• Regular security updates
• Compliance monitoring
• Audit trail maintenance

Best Practices:
• Regular staff training
• Strong password policies
• Limited access permissions
• Secure device placement
• Regular system updates
• Incident response procedures`,
            media: [],
            quiz: [
              {
                question: "What does PCI DSS stand for?",
                options: ["Payment Card Industry Data Security Standard", "Personal Card Information Data Security System", "Protected Card Industry Data Security Standard", "Payment Card Information Data Security System"],
                correct: 0
              }
            ]
          }
        ]
      }
    }
  ];
}

function generateGenericToastTraining(): ToastTrainingModule[] {
  return [
    {
      title: "Toast Platform Overview",
      description: "Introduction to Toast's comprehensive restaurant management platform",
      duration: 15,
      order: 1,
      content: {
        type: "interactive_lesson",
        sections: [
          {
            title: "Toast Platform Features",
            content: `Toast offers an all-in-one restaurant management solution:

Core Features:
• Point of Sale (POS) system
• Kitchen Display System (KDS)  
• Online ordering platform
• Inventory management
• Staff scheduling and payroll
• Customer relationship management
• Business intelligence and analytics
• Payment processing

Integration Capabilities:
• Third-party delivery services
• Accounting software integration
• Marketing automation tools
• Loyalty program platforms
• Reservation systems
• Music and entertainment systems

Benefits for Restaurants:
• Streamlined operations
• Improved order accuracy
• Enhanced customer experience
• Better financial visibility
• Reduced training time
• Scalable solution for growth`,
            media: [],
            quiz: [
              {
                question: "What does KDS stand for in Toast?",
                options: ["Kitchen Data System", "Kitchen Display System", "Kitchen Delivery Service", "Kitchen Digital Solution"],
                correct: 1
              }
            ]
          }
        ]
      }
    }
  ];
}