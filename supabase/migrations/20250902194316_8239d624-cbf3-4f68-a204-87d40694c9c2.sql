-- Add comprehensive lessons for Toast POS courses (30+ pieces of content)
INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) 
SELECT c.id, 'Toast Platform Overview and Setup', 'Complete introduction to Toast''s restaurant ecosystem and initial setup process', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=11LmLyMRNVs",
  "video_title": "Toast POS Introduction 1/4",
  "description": "Official Toast introduction covering platform overview, key features, and initial setup procedures",
  "transcript": "This lesson covers the complete Toast platform introduction including hardware setup, account configuration, and basic navigation principles.",
  "key_points": [
    "Understanding Toast''s restaurant-specific design philosophy", 
    "Hardware requirements and setup procedures",
    "Account creation and initial configuration",
    "Basic navigation and interface overview",
    "Integration with restaurant workflows"
  ],
  "quiz": {
    "questions": [
      {
        "question": "What makes Toast specifically designed for restaurants?",
        "options": ["Generic POS features", "Restaurant-specific workflows", "Basic payment processing", "Simple inventory"],
        "correct": 1
      }
    ]
  }
}', 1, 25
FROM courses c WHERE c.category = 'pos-toast' AND c.title = 'Toast Platform Fundamentals';

INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) 
SELECT c.id, 'Restaurant Hardware Setup and Configuration', 'Complete guide to setting up Toast hardware including terminals, KDS, and printers', 
'{
  "type": "practical_lesson",
  "video_url": "https://www.youtube.com/watch?v=inWv_m3Rjkw",
  "video_title": "Toast Training Video - Complete Operations",
  "description": "Comprehensive training covering all Toast operations from opening tabs to shift management",
  "key_topics": ["Opening tabs", "Closing tabs", "Void transactions", "Adjust tabs", "Re-open checks", "Split checks", "Combine checks", "Transfer tabs", "Shift review", "Drawer reports"],
  "practical_exercises": [
    "Set up a Toast terminal from scratch",
    "Configure printer settings for kitchen tickets",
    "Test payment processing with different card types",
    "Practice opening and closing procedures"
  ],
  "resources": [
    {"name": "Toast Hardware Setup Guide", "url": "https://support.toasttab.com/"},
    {"name": "Network Configuration Best Practices", "type": "documentation"}
  ]
}', 2, 35
FROM courses c WHERE c.category = 'pos-toast' AND c.title = 'Toast Platform Fundamentals';

INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) 
SELECT c.id, 'Menu Creation and Item Management', 'Master menu setup, item creation, and modifier management in Toast', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=STuk1Bcn0-k",
  "video_title": "Building your Menu with Toast''s Menu Template",
  "description": "Learn how to use Toast''s menu template system for efficient menu creation and management",
  "key_points": [
    "Using Toast menu templates effectively",
    "Creating menu categories and subcategories", 
    "Setting up modifiers and option groups",
    "Pricing strategies and cost management",
    "Menu synchronization across all channels"
  ],
  "practical_exercises": [
    "Create a complete restaurant menu from scratch",
    "Set up complex modifiers for customizable items",
    "Configure pricing for different locations",
    "Test menu changes across all ordering channels"
  ]
}', 3, 30
FROM courses c WHERE c.category = 'pos-toast' AND c.title = 'Toast Platform Fundamentals';

INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) 
SELECT c.id, 'Payment Processing and Transaction Management', 'Complete guide to handling payments, tips, and transaction management', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=IITglkIjtII",
  "video_title": "Manage Payments with Toast POS",
  "description": "Learn payment screen functionality, check filtering, and payment terminal operations",
  "key_points": [
    "Payment screen navigation and functionality",
    "Enhanced check filtering systems",
    "Payment terminal operations and troubleshooting",
    "Tip management and distribution",
    "Split payment handling and group billing"
  ],
  "quiz": {
    "questions": [
      {
        "question": "What is the correct way to split a check in Toast?",
        "options": ["Use the split button", "Create separate orders", "Manual calculation", "Transfer items"],
        "correct": 0
      }
    ]
  }
}', 4, 25
FROM courses c WHERE c.category = 'pos-toast' AND c.title = 'Toast Platform Fundamentals';

-- Add more comprehensive Toast lessons
INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) 
SELECT c.id, 'Advanced Menu Engineering Principles', 'Learn psychology-based menu design and profitability optimization strategies', 
'{
  "type": "comprehensive_lesson",
  "video_url": "https://pos.toasttab.com/resources/restaurant-menu-engineering",
  "description": "Master menu engineering techniques to maximize profitability through strategic menu design",
  "key_concepts": [
    "Menu psychology and visual design principles",
    "Cost analysis and profit margin calculation",
    "Item placement and description optimization",
    "Seasonal menu planning and rotation strategies",
    "A/B testing menu changes for maximum impact"
  ],
  "case_studies": [
    {"title": "Restaurant X increased profits by 23% with menu engineering", "outcome": "Strategic item placement and description changes"},
    {"title": "Fine dining establishment optimized wine pairings", "outcome": "35% increase in beverage sales"}
  ],
  "tools": ["Menu profitability calculator", "Item performance analytics", "Cost tracking spreadsheet"]
}', 1, 45
FROM courses c WHERE c.category = 'pos-toast' AND c.title = 'Toast Menu Engineering & Optimization';

INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) 
SELECT c.id, 'Kitchen Display System Setup and Optimization', 'Complete KDS implementation for maximum kitchen efficiency', 
'{
  "type": "video_lesson",
  "video_url": "https://doc.toasttab.com/doc/platformguide/platformKDSOverview.html",
  "description": "Comprehensive guide to implementing and optimizing Toast Kitchen Display Systems",
  "key_points": [
    "KDS hardware requirements and placement strategies",
    "Order routing and station assignment",
    "Prep time management and tracking systems",
    "Real-time communication between FOH and BOH",
    "Performance metrics and efficiency optimization"
  ],
  "practical_exercises": [
    "Design optimal KDS layout for your kitchen",
    "Configure order routing for multiple stations",
    "Set up prep time tracking and alerts",
    "Practice order modification workflows"
  ],
  "efficiency_metrics": ["Order completion times", "Kitchen bottleneck identification", "Staff productivity tracking"]
}', 1, 50
FROM courses c WHERE c.category = 'pos-toast' AND c.title = 'Toast Kitchen Display Systems Expert';

INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) 
SELECT c.id, 'Online Ordering Platform Setup', 'Build and optimize your digital ordering presence with Toast', 
'{
  "type": "comprehensive_lesson",
  "description": "Complete setup and optimization of Toast''s online ordering platform",
  "key_components": [
    "Branded website creation and customization",
    "Mobile app ordering configuration",
    "Menu synchronization across all platforms",
    "Delivery zone setup and management",
    "Pickup scheduling and optimization"
  ],
  "marketing_strategies": [
    "SEO optimization for online visibility",
    "Social media integration techniques",
    "Email marketing campaign setup",
    "Customer retention programs"
  ],
  "practical_projects": [
    "Launch complete online ordering system",
    "Integrate with delivery platforms",
    "Set up automated marketing campaigns",
    "Monitor and optimize conversion rates"
  ]
}', 1, 40
FROM courses c WHERE c.category = 'pos-toast' AND c.title = 'Toast Online Ordering & Delivery';

-- Add Square POS comprehensive lessons
INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) 
SELECT c.id, 'Square Terminal Complete Setup Guide', 'Master Square Terminal setup and advanced features', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=8jz1de0IbjQ",
  "video_title": "Get Started with Square Terminal",
  "description": "Detailed walkthrough of Square Terminal features and setup procedures",
  "key_points": [
    "Hardware unboxing and initial setup",
    "WiFi and network configuration",
    "Payment processing setup and testing",
    "Receipt customization and branding",
    "Advanced terminal features and shortcuts"
  ],
  "troubleshooting": [
    "Connection issues and solutions",
    "Payment processing errors",
    "Hardware maintenance procedures",
    "Software update management"
  ]
}', 1, 30
FROM courses c WHERE c.category = 'pos-square' AND c.title = 'Square Fundamentals: Complete Setup Guide';

INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) 
SELECT c.id, 'Square Point of Sale Mode Selection', 'Choose and configure the optimal Square POS mode for your business', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=X3CIxJXM60M",
  "video_title": "Select Your Mode with Square Point of Sale",
  "description": "Learn how to select the right mode for your business and start selling with Square",
  "business_types": [
    {"type": "Retail", "recommended_mode": "Item Library", "features": ["Inventory tracking", "Barcode scanning", "Category management"]},
    {"type": "Food & Beverage", "recommended_mode": "Restaurant", "features": ["Menu management", "Kitchen tickets", "Table service"]},
    {"type": "Services", "recommended_mode": "Simple", "features": ["Quick checkout", "Appointment booking", "Service categories"]}
  ],
  "configuration_steps": [
    "Business type selection",
    "Mode customization options",
    "Feature activation procedures",
    "Testing and validation"
  ]
}', 2, 25
FROM courses c WHERE c.category = 'pos-square' AND c.title = 'Square Fundamentals: Complete Setup Guide';

-- Continue adding more lessons for each course to reach 30+ pieces of content for Toast
INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) VALUES
((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Platform Fundamentals'), 'Loyalty Program Setup and Management', 'Create and manage customer loyalty programs to increase retention', '{"type": "video_lesson", "video_url": "https://www.youtube.com/watch?v=oRqhlbwbNg8", "video_title": "Toast Loyalty Staff Training", "description": "Comprehensive training on Toast loyalty program setup and management", "key_points": ["Loyalty program design principles", "Point systems and reward structures", "Customer enrollment processes", "Redemption procedures", "Analytics and performance tracking"]}', 5, 30),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Platform Fundamentals'), 'Payment Terminal Navigation', 'Master the Toast payment terminal interface and advanced features', '{"type": "video_lesson", "video_url": "https://www.youtube.com/watch?v=cvwPqgRK0o8", "video_title": "Navigate the Toast POS Payment Terminal", "description": "Learn to use the Payment Terminal for comprehensive check management", "key_points": ["Payment terminal interface overview", "Open check management", "Advanced filtering techniques", "Check history and tracking", "Terminal customization options"]}', 6, 20),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Platform Fundamentals'), 'Catering and Events Management', 'Handle large orders and special events with Toast Catering module', '{"type": "video_lesson", "video_url": "https://www.youtube.com/watch?v=Xgv3t6N2Y-8", "video_title": "Get Started with Toast Catering and Events", "description": "8-minute comprehensive guide to Toast Catering and Events module", "key_points": ["Event type creation using BEO forms", "Catering order management", "Estimate and invoice generation", "Guest communication systems", "Event scheduling and coordination"]}', 7, 25),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Menu Engineering & Optimization'), 'Menu Building Crash Course', 'Quick but comprehensive guide to building effective menus in Toast', '{"type": "video_lesson", "video_url": "https://www.youtube.com/watch?v=ydhQJMkSvLw", "video_title": "10 Mins Crash Course on Building Menus on Toast POS", "description": "Essential knowledge for building effective menus on Toast POS", "key_points": ["Menu structure best practices", "Item categorization strategies", "Modifier setup and management", "Pricing optimization techniques", "Menu testing and validation"]}', 2, 15),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Kitchen Display Systems Expert'), 'Kitchen Workflow Optimization', 'Optimize kitchen operations using KDS data and analytics', '{"type": "practical_lesson", "description": "Advanced kitchen workflow optimization using Toast KDS analytics", "key_metrics": ["Order completion times by station", "Kitchen bottleneck identification", "Staff productivity measurements", "Peak hour performance analysis"], "optimization_strategies": ["Station load balancing", "Prep time adjustments", "Order priority systems", "Staff scheduling optimization"]}', 2, 40),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Online Ordering & Delivery'), 'Third-Party Integration Management', 'Manage DoorDash, Uber Eats, and other delivery platform integrations', '{"type": "comprehensive_lesson", "description": "Complete guide to managing third-party delivery integrations", "platforms": ["DoorDash", "Uber Eats", "Grubhub", "Postmates"], "key_points": ["Integration setup procedures", "Menu synchronization", "Order management workflows", "Commission optimization", "Performance analytics"]}', 2, 35),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Staff & Labor Management'), 'Employee Scheduling Optimization', 'Create efficient schedules and manage labor costs effectively', '{"type": "practical_lesson", "description": "Master Toast labor management tools for optimal scheduling", "key_features": ["Demand forecasting", "Shift optimization", "Labor cost tracking", "Employee availability management", "Compliance monitoring"], "best_practices": ["Data-driven scheduling", "Cross-training strategies", "Performance incentives", "Cost control measures"]}', 1, 45),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Advanced Analytics & Growth'), 'Financial Reporting Mastery', 'Generate comprehensive financial reports and business insights', '{"type": "comprehensive_lesson", "description": "Master Toast financial reporting and analytics capabilities", "report_types": ["Daily sales summaries", "Item performance analysis", "Labor cost reports", "Tax reporting", "Custom dashboard creation"], "business_intelligence": ["Trend identification", "Seasonal pattern analysis", "Profit margin optimization", "Growth opportunity identification"]}', 1, 50);

-- Add 20 more Toast lessons to reach 30+ total
INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) VALUES
((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Multi-Location & Franchise Management'), 'Centralized Management Dashboard', 'Master multi-location management and reporting', '{"type": "comprehensive_lesson", "description": "Complete guide to managing multiple Toast locations", "key_features": ["Centralized reporting", "Location comparison analytics", "Standardized procedures", "Brand consistency tools"], "management_strategies": ["Performance benchmarking", "Best practice sharing", "Inventory coordination", "Staff training standardization"]}', 1, 40),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Integration & Third-Party Apps'), 'API Integration Fundamentals', 'Connect Toast with external systems and custom applications', '{"type": "technical_lesson", "description": "Learn Toast API integration for custom solutions", "api_features": ["Order management", "Menu synchronization", "Customer data", "Reporting endpoints"], "integration_examples": ["Accounting software", "Inventory systems", "Marketing platforms", "Custom analytics"]}', 1, 60),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Capital & Financial Services'), 'Restaurant Financing Options', 'Understand and utilize Toast Capital for business growth', '{"type": "educational_lesson", "description": "Comprehensive guide to Toast Capital and financing options", "financing_types": ["Working capital loans", "Equipment financing", "Revenue-based funding", "Cash advances"], "application_process": ["Eligibility requirements", "Documentation needed", "Approval timeline", "Repayment structures"]}', 1, 30),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Marketing & Customer Engagement'), 'Email Marketing Automation', 'Create automated marketing campaigns using Toast data', '{"type": "marketing_lesson", "description": "Build effective email marketing campaigns with Toast integration", "campaign_types": ["Welcome series", "Order confirmations", "Loyalty rewards", "Re-engagement campaigns"], "automation_tools": ["Trigger setup", "Segmentation strategies", "Performance tracking", "A/B testing"]}', 1, 35);

-- Add additional practical lessons across different Toast courses
INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) VALUES
((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Platform Fundamentals'), 'Mobile App Management', 'Manage Toast Go and mobile ordering applications', '{"type": "mobile_lesson", "description": "Complete guide to Toast mobile applications and management", "mobile_features": ["Toast Go handheld terminals", "Mobile ordering apps", "Staff mobile access", "Customer mobile experience"], "optimization_tips": ["Mobile menu design", "Order flow efficiency", "Mobile payment processing", "Customer app engagement"]}', 8, 25),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Kitchen Display Systems Expert'), 'Advanced KDS Configuration', 'Configure complex kitchen workflows and station management', '{"type": "advanced_lesson", "description": "Advanced KDS setup for complex kitchen operations", "advanced_features": ["Multi-station routing", "Cook time optimization", "Priority order handling", "Waste tracking integration"], "configuration_examples": ["Multi-level kitchens", "Franchise standardization", "High-volume operations", "Specialty dietary requirements"]}', 3, 45),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Online Ordering & Delivery'), 'Delivery Logistics Optimization', 'Optimize delivery operations and customer experience', '{"type": "logistics_lesson", "description": "Master delivery logistics and customer satisfaction", "logistics_features": ["Delivery zone management", "Driver coordination", "Order tracking systems", "Customer communication"], "optimization_strategies": ["Route optimization", "Delivery time estimation", "Customer feedback integration", "Performance analytics"]}', 3, 40),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Staff & Labor Management'), 'Performance Management Systems', 'Track and improve staff performance using Toast analytics', '{"type": "management_lesson", "description": "Implement effective performance management systems", "tracking_metrics": ["Sales performance", "Customer satisfaction", "Efficiency ratings", "Training completion"], "improvement_strategies": ["Goal setting", "Performance reviews", "Incentive programs", "Skills development"]}', 2, 35),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Advanced Analytics & Growth'), 'Customer Behavior Analytics', 'Analyze customer data to drive business growth', '{"type": "analytics_lesson", "description": "Deep dive into customer behavior analysis and insights", "analytics_tools": ["Customer segmentation", "Purchase pattern analysis", "Lifetime value calculation", "Churn prediction"], "growth_strategies": ["Personalized marketing", "Menu optimization", "Service improvements", "Expansion planning"]}', 2, 45);

-- Add final set of Toast lessons to reach 30+ total
INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) VALUES
((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Platform Fundamentals'), 'Inventory Integration Setup', 'Connect inventory management with Toast POS operations', '{"type": "integration_lesson", "description": "Seamlessly integrate inventory management with Toast operations", "integration_features": ["Real-time inventory tracking", "Low stock alerts", "Automatic reordering", "Waste tracking"], "setup_procedures": ["Initial inventory setup", "Category configuration", "Supplier integration", "Reporting automation"]}', 9, 30),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Menu Engineering & Optimization'), 'Seasonal Menu Planning', 'Plan and execute seasonal menu changes for maximum profitability', '{"type": "strategic_lesson", "description": "Master seasonal menu planning and execution strategies", "planning_elements": ["Seasonal ingredient sourcing", "Menu rotation strategies", "Customer preference analysis", "Profitability forecasting"], "execution_tactics": ["Launch timing", "Staff training", "Marketing coordination", "Performance monitoring"]}', 3, 40),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Kitchen Display Systems Expert'), 'KDS Troubleshooting and Maintenance', 'Maintain optimal KDS performance and resolve issues', '{"type": "technical_lesson", "description": "Complete guide to KDS maintenance and troubleshooting", "maintenance_procedures": ["Regular system updates", "Hardware cleaning", "Performance monitoring", "Backup procedures"], "troubleshooting_guide": ["Common error resolution", "Network connectivity issues", "Hardware replacement", "Software conflicts"]}', 4, 35),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Online Ordering & Delivery'), 'Customer Experience Optimization', 'Enhance online ordering customer experience and satisfaction', '{"type": "ux_lesson", "description": "Optimize customer experience across all online ordering channels", "ux_elements": ["Website navigation", "Mobile app usability", "Order customization", "Checkout process"], "satisfaction_metrics": ["Order accuracy", "Delivery times", "Customer feedback", "Repeat order rates"]}', 4, 30),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Staff & Labor Management'), 'Compliance and Legal Requirements', 'Ensure labor compliance and legal requirement adherence', '{"type": "compliance_lesson", "description": "Master labor compliance and legal requirements management", "compliance_areas": ["Wage and hour laws", "Break requirements", "Overtime regulations", "Documentation standards"], "management_tools": ["Automated compliance tracking", "Legal requirement alerts", "Documentation systems", "Audit preparation"]}', 3, 40),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Advanced Analytics & Growth'), 'Competitive Analysis and Market Positioning', 'Use Toast data to analyze competition and position your business', '{"type": "strategic_lesson", "description": "Leverage analytics for competitive advantage and market positioning", "analysis_methods": ["Market trend identification", "Competitor benchmarking", "Pricing strategy optimization", "Service differentiation"], "positioning_strategies": ["Unique value propositions", "Market segment targeting", "Brand positioning", "Growth opportunity identification"]}', 3, 50);