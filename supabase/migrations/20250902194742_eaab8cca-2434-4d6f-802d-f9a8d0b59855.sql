-- Add more comprehensive Square POS lessons and other provider content
INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) VALUES

-- More Square lessons
((SELECT id FROM courses WHERE category = 'pos-square' AND title = 'Square Payment Processing Mastery' LIMIT 1), 
'Creating Items for Square POS', 
'Master item creation and management in Square Point of Sale', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=g9_2WqN9mJU",
  "video_title": "Creating Items for Square Point of Sale",
  "provider": "Square Canada Official",
  "description": "Learn to create and manage items in Square POS for faster checkout and itemized receipts",
  "key_points": [
    "Item creation workflow and best practices",
    "Category organization and management",
    "Inventory tracking setup and configuration",
    "Pricing strategies and modifier setup",
    "Barcode scanning and integration"
  ],
  "practical_benefits": [
    "Faster checkout processing",
    "Detailed itemized receipts for customers",
    "Inventory tracking and low stock alerts",
    "Sales analytics by item and category"
  ],
  "official_resource": "http://square.com/pos"
}', 
2, 25),

((SELECT id FROM courses WHERE category = 'pos-square' AND title = 'Square Inventory Management Pro' LIMIT 1), 
'Advanced Item Creation and Management', 
'Advanced techniques for Square item creation and inventory management', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=il2CPaPrUK4",
  "video_title": "Creating Items with Square Point of Sale",
  "provider": "Square Official",
  "description": "Speed up checkout and send itemized receipts by creating items in Square Point of Sale",
  "workflow_steps": [
    "Access item list via navigation bar",
    "Use edit mode for item management",
    "Create new items with detailed information",
    "Set up categories and organization",
    "Configure inventory tracking options"
  ],
  "efficiency_features": [
    "Quick item lookup during checkout",
    "Automated inventory deduction",
    "Low stock notifications and alerts",
    "Sales reporting by item performance"
  ]
}', 
1, 20),

((SELECT id FROM courses WHERE category = 'pos-square' AND title = 'Square E-commerce Integration' LIMIT 1), 
'Square Online Store Setup', 
'Complete guide to setting up and running Square Online store', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=7gjrqpk4_Qo",
  "video_title": "Square Webinars: Get Started with Square Online",
  "provider": "Square Official Webinar",
  "description": "Comprehensive webinar covering Square Online store setup and management basics",
  "setup_components": [
    "Website building and customization (0:41)",
    "Item selection for online sales (1:51)",
    "Menu creation and management (2:08)",
    "Fulfillment type configuration (2:34)",
    "Pickup and delivery setup (2:50)"
  ],
  "configuration_details": [
    "Location setup and management (3:26)",
    "Store hours configuration (3:44)",
    "Restricted dates setup (4:02)", 
    "Prep time management (4:34)",
    "Order limit configuration (5:03)"
  ],
  "official_resource": "https://squareup.com/help/article/6852"
}', 
1, 35);

-- Add additional provider content
INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) VALUES

-- Additional Clover content
((SELECT id FROM courses WHERE category = 'pos-clover' AND title LIKE '%Clover%' LIMIT 1), 
'Clover Device Maintenance and Care', 
'Proper cleaning and maintenance procedures for Clover devices', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=Q9bAb1ESmvo",
  "video_title": "Cleaning your Clover device",
  "provider": "Clover Official",
  "description": "Keep your Clover device clean for better performance, longevity, and safety",
  "maintenance_benefits": [
    "Improved device performance and reliability",
    "Extended hardware lifespan",
    "Enhanced safety for employees and customers",
    "Professional appearance and hygiene"
  ],
  "cleaning_procedures": [
    "Daily cleaning routine and schedule",
    "Proper cleaning solution selection",
    "Screen and hardware cleaning techniques",
    "Sanitization best practices"
  ],
  "official_resource": "https://www.clover.com/help/"
}', 
3, 15),

((SELECT id FROM courses WHERE category = 'pos-clover' AND title LIKE '%Clover%' LIMIT 1), 
'Clover Station Display Configuration', 
'Configure and customize Clover Station display settings', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=DmXIl3-GkXk",
  "video_title": "Clover POS - How To Change The Register Display on 2019 Clover Station",
  "provider": "UpNexa",
  "description": "Learn to change and customize register display settings on 2019 Clover Station",
  "customization_options": [
    "Display orientation and layout settings",
    "Color scheme and theme selection",
    "Font size and visibility adjustments",
    "Screen timeout and power management"
  ],
  "contact_information": {
    "website": "UpNexa.com",
    "instagram": "@UpNexa or @TheProcessingPlug",
    "text": "631-305-5009",
    "phone": "888-346-9532"
  ]
}', 
4, 20);

-- Add more comprehensive training for existing courses
INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) VALUES

-- Additional Toast content to reach 30+ lessons
((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Platform Fundamentals' LIMIT 1), 
'Toast Mobile App Management', 
'Complete guide to Toast mobile applications and management', 
'{
  "type": "mobile_lesson",
  "description": "Master Toast mobile applications including Toast Go handheld terminals and mobile ordering",
  "mobile_features": [
    "Toast Go handheld terminal operations",
    "Mobile ordering app configuration and management",
    "Staff mobile access and permissions",
    "Customer mobile experience optimization"
  ],
  "optimization_strategies": [
    "Mobile menu design and user experience",
    "Order flow efficiency and speed optimization",
    "Mobile payment processing best practices",
    "Customer app engagement and retention"
  ]
}', 
7, 25),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Kitchen Display Systems Expert' LIMIT 1), 
'KDS Troubleshooting and Maintenance', 
'Maintain optimal KDS performance and resolve common issues', 
'{
  "type": "technical_lesson",
  "description": "Complete guide to KDS maintenance, troubleshooting, and performance optimization",
  "maintenance_procedures": [
    "Regular system updates and patch management",
    "Hardware cleaning and care procedures",
    "Performance monitoring and optimization",
    "Backup and recovery procedures"
  ],
  "troubleshooting_guide": [
    "Common error identification and resolution",
    "Network connectivity issue diagnosis",
    "Hardware replacement and setup procedures",
    "Software conflict resolution and compatibility"
  ]
}', 
3, 35),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Online Ordering & Delivery' LIMIT 1), 
'Customer Experience Optimization', 
'Enhance online ordering customer experience and satisfaction', 
'{
  "type": "ux_lesson",
  "description": "Optimize customer experience across all online ordering channels for maximum satisfaction",
  "ux_elements": [
    "Website navigation and user journey optimization",
    "Mobile app usability and interface design",
    "Order customization and personalization options",
    "Checkout process streamlining and efficiency"
  ],
  "satisfaction_metrics": [
    "Order accuracy tracking and improvement",
    "Delivery time optimization and reliability",
    "Customer feedback collection and analysis",
    "Repeat order rate enhancement strategies"
  ]
}', 
3, 30),

-- Final additional lessons to ensure comprehensive coverage
((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Menu Engineering & Optimization' LIMIT 1), 
'Seasonal Menu Planning and Execution', 
'Plan and execute seasonal menu changes for maximum profitability', 
'{
  "type": "strategic_lesson",
  "description": "Master seasonal menu planning and execution strategies for year-round profitability",
  "planning_elements": [
    "Seasonal ingredient sourcing and cost management",
    "Menu rotation strategies and timing",
    "Customer preference analysis and trend forecasting",
    "Profitability forecasting and margin optimization"
  ],
  "execution_tactics": [
    "Launch timing and market coordination",
    "Staff training and preparation procedures",
    "Marketing campaign coordination and promotion",
    "Performance monitoring and adjustment strategies"
  ]
}', 
3, 40),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Staff & Labor Management' LIMIT 1), 
'Compliance and Legal Requirements', 
'Ensure labor compliance and adherence to legal requirements', 
'{
  "type": "compliance_lesson",
  "description": "Master labor compliance and legal requirements management using Toast systems",
  "compliance_areas": [
    "Wage and hour law compliance and tracking",
    "Break requirement monitoring and enforcement",
    "Overtime regulation adherence and management",
    "Documentation standards and record keeping"
  ],
  "management_tools": [
    "Automated compliance tracking and alerts",
    "Legal requirement monitoring systems",
    "Documentation and audit trail systems",
    "Audit preparation and compliance reporting"
  ]
}', 
3, 40),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Advanced Analytics & Growth' LIMIT 1), 
'Competitive Analysis and Market Positioning', 
'Use Toast data to analyze competition and position your business', 
'{
  "type": "strategic_lesson",
  "description": "Leverage Toast analytics for competitive advantage and strategic market positioning",
  "analysis_methods": [
    "Market trend identification and analysis",
    "Competitor benchmarking and comparison",
    "Pricing strategy optimization and testing",
    "Service differentiation and positioning"
  ],
  "positioning_strategies": [
    "Unique value proposition development",
    "Market segment targeting and focus",
    "Brand positioning and messaging",
    "Growth opportunity identification and planning"
  ]
}', 
3, 50);