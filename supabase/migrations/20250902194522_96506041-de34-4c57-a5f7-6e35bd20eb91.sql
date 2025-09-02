-- First, let's check what courses exist and add lessons with specific course IDs
-- Add comprehensive Toast lessons with real video content
INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) VALUES

-- Toast Platform Fundamentals lessons
((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Platform Fundamentals' LIMIT 1), 
'Toast POS Introduction and Setup', 
'Complete introduction to Toast POS system with official training video', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=11LmLyMRNVs",
  "video_title": "Toast POS Introduction 1/4",
  "provider": "Toast Official",
  "description": "Official Toast introduction covering platform overview, key features, and initial setup procedures",
  "key_points": [
    "Understanding Toast restaurant-specific design philosophy", 
    "Hardware requirements and setup procedures",
    "Account creation and initial configuration",
    "Basic navigation and interface overview",
    "Integration with restaurant workflows"
  ],
  "practical_exercises": [
    "Create your Toast account",
    "Connect your first device", 
    "Navigate the admin dashboard",
    "Set up basic restaurant information"
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
}', 
1, 25),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Platform Fundamentals' LIMIT 1), 
'Complete Toast Operations Training', 
'Comprehensive operations training covering all Toast POS functions', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=inWv_m3Rjkw",
  "video_title": "Toast Training Video - Complete Operations",
  "provider": "Toast Community",
  "description": "Complete training covering opening tabs, closing tabs, voids, adjustments, check management, and drawer operations",
  "key_topics": [
    "Opening a tab (0:28)",
    "Closing a tab (1:16)", 
    "Void tab (2:30)",
    "Adjust tab (3:30)",
    "Re-open check (4:36)",
    "Split checks (5:41)",
    "Combine checks (6:53)",
    "Transfer tab (7:36)",
    "Shift review (8:45)",
    "Drawer reports (10:00)"
  ],
  "practical_exercises": [
    "Practice opening and closing tabs",
    "Handle void and adjustment scenarios",
    "Master check splitting techniques",
    "Complete end-of-shift procedures"
  ]
}', 
2, 35),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Platform Fundamentals' LIMIT 1), 
'Payment Processing with Toast', 
'Master Toast payment processing and terminal operations', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=IITglkIjtII",
  "video_title": "Manage Payments with Toast POS",
  "provider": "Toast Official",
  "description": "Learn payment screen functionality, check filtering, and payment terminal operations for front-of-house staff",
  "key_points": [
    "Payment screen navigation and functionality",
    "Enhanced check filtering systems", 
    "Payment terminal operations and troubleshooting",
    "Tip management and distribution",
    "Split payment handling and group billing"
  ],
  "official_resource": "https://central.toasttab.com/s/front-of-house-skills-101"
}', 
3, 25),

-- Toast Menu Engineering lessons
((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Menu Engineering & Optimization' LIMIT 1), 
'Menu Building Crash Course', 
'Essential 10-minute guide to building effective menus in Toast POS', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=ydhQJMkSvLw",
  "video_title": "10 Mins Crash Course on Building Menus on Toast POS",
  "provider": "Toast Expert Community",
  "description": "Quick but comprehensive guide covering menu building basics and best practices",
  "key_points": [
    "Menu structure and organization principles",
    "Item categorization strategies",
    "Modifier setup and management",
    "Pricing optimization techniques", 
    "Menu testing and validation procedures"
  ]
}', 
1, 15),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Menu Engineering & Optimization' LIMIT 1), 
'Advanced Menu Template System', 
'Master Toast menu template system for efficient menu creation', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=STuk1Bcn0-k",
  "video_title": "Building your Menu with Toast Menu Template",
  "provider": "Toast Official",
  "description": "Learn to use Toast menu template system used by onboarding teams for menu foundation building",
  "key_points": [
    "Understanding Toast menu template structure",
    "Creating menu categories and subcategories",
    "Setting up modifiers and option groups", 
    "Advanced pricing strategies",
    "Menu synchronization across all channels"
  ],
  "practical_exercises": [
    "Create a complete restaurant menu using templates",
    "Set up complex modifiers for customizable items",
    "Configure location-specific pricing",
    "Test menu changes across ordering channels"
  ]
}', 
2, 30);

-- Add Square POS lessons
INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) VALUES

-- Square Fundamentals lessons
((SELECT id FROM courses WHERE category = 'pos-square' AND title = 'Square Fundamentals: Complete Setup Guide' LIMIT 1), 
'Square Terminal Complete Setup', 
'Official Square Terminal setup guide and feature walkthrough', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=8jz1de0IbjQ",
  "video_title": "Get Started with Square Terminal",
  "provider": "Square Official",
  "description": "Step-by-step walkthrough of Square Terminal features and functions for complete setup mastery",
  "key_points": [
    "Hardware unboxing and initial setup procedures",
    "WiFi and network configuration steps",
    "Payment processing setup and testing protocols",
    "Receipt customization and branding options",
    "Advanced terminal features and keyboard shortcuts"
  ],
  "troubleshooting": [
    "Network connection issues and solutions",
    "Payment processing error resolution",
    "Hardware maintenance and care procedures", 
    "Software update management"
  ],
  "official_resource": "https://squareup.com/help/article/6535"
}', 
1, 30),

((SELECT id FROM courses WHERE category = 'pos-square' AND title = 'Square Fundamentals: Complete Setup Guide' LIMIT 1), 
'Square POS Mode Selection', 
'Choose and configure optimal Square POS mode for your business type', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=X3CIxJXM60M",
  "video_title": "Select Your Mode with Square Point of Sale",
  "provider": "Square Official",
  "description": "Learn to select the right Square POS mode and start selling effectively",
  "business_types": [
    {"type": "Retail", "mode": "Item Library", "features": ["Inventory tracking", "Barcode scanning", "Category management"]},
    {"type": "Food & Beverage", "mode": "Restaurant", "features": ["Menu management", "Kitchen tickets", "Table service"]},
    {"type": "Services", "mode": "Simple", "features": ["Quick checkout", "Appointment booking", "Service categories"]}
  ],
  "configuration_steps": [
    "Business type assessment and selection",
    "Mode customization and feature activation",
    "Testing and validation procedures",
    "Optimization for specific business needs"
  ]
}', 
2, 25),

((SELECT id FROM courses WHERE category = 'pos-square' AND title = 'Square Payment Processing Mastery' LIMIT 1), 
'Square Checkout Workflow Mastery', 
'Master the complete Square POS checkout process from start to finish', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=3st5x0S9HpA",
  "video_title": "Check Out with Square Point of Sale",
  "provider": "Square Official",
  "description": "Complete guide to Square POS checkout workflow for quick and efficient sales processing",
  "key_points": [
    "Checkout workflow optimization techniques",
    "Payment processing speed improvement",
    "Customer experience enhancement strategies",
    "Error handling and resolution procedures",
    "Receipt and record management"
  ],
  "efficiency_tips": [
    "Keyboard shortcuts for faster processing",
    "Common transaction scenarios",
    "Customer service best practices",
    "Troubleshooting payment issues"
  ]
}', 
1, 25);

-- Add more comprehensive content for additional providers
INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) VALUES

-- TouchBistro lessons
((SELECT id FROM courses WHERE category = 'pos-touchbistro' AND title LIKE '%TouchBistro%' LIMIT 1), 
'TouchBistro Complete Beginner Guide', 
'Comprehensive TouchBistro tutorial for restaurant beginners', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=VGZ0KReUsww",
  "video_title": "TouchBistro POS Tutorial for Beginners | In-Depth Guide 2025",
  "provider": "How to Simple",
  "description": "Complete beginner-friendly guide to TouchBistro POS system operation and management",
  "key_points": [
    "TouchBistro interface navigation basics",
    "Table management and reservation systems",
    "Menu creation and item management",
    "Order processing and kitchen communication",
    "Payment processing and checkout procedures"
  ]
}', 
1, 35),

((SELECT id FROM courses WHERE category = 'pos-touchbistro' AND title LIKE '%TouchBistro%' LIMIT 1), 
'TouchBistro Online Ordering Complete Guide', 
'Master TouchBistro online ordering, scheduling, and loyalty features', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=MJ0b0EK0_CU",
  "video_title": "TouchBistro Online Ordering Guide: Scheduling, Loyalty & More",
  "provider": "Business Solution",
  "description": "Comprehensive walkthrough of TouchBistro online ordering system for both customer and staff experiences",
  "key_features": [
    "Customer online ordering experience",
    "Staff order management workflows",
    "Pickup and delivery scheduling systems",
    "Loyalty rewards program integration",
    "Payment processing for online orders"
  ],
  "practical_scenarios": [
    "Setting up online ordering system",
    "Managing incoming online orders",
    "Handling pickup and delivery logistics",
    "Customer loyalty program implementation"
  ]
}', 
2, 40),

-- Clover POS lessons  
((SELECT id FROM courses WHERE category = 'pos-clover' AND title LIKE '%Clover%' LIMIT 1), 
'Clover POS Complete Training', 
'Comprehensive Clover POS system training for restaurants', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=yNujWT2afmI",
  "video_title": "Clover POS Training",
  "provider": "Restaurant Training Expert",
  "description": "Complete Clover POS training covering register operations, order management, and system features",
  "key_points": [
    "Clover system navigation and interface",
    "Order entry and modification procedures",
    "Payment processing and tender options",
    "Report generation and management",
    "System maintenance and troubleshooting"
  ],
  "restaurant_focus": [
    "Restaurant-specific workflows",
    "Kitchen integration procedures", 
    "Staff management features",
    "Inventory tracking capabilities"
  ]
}', 
1, 30),

((SELECT id FROM courses WHERE category = 'pos-clover' AND title LIKE '%Clover%' LIMIT 1), 
'Clover Station Advanced Operations', 
'Master Clover Station closing procedures and tip management', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=hZgC0uXpFW8",
  "video_title": "Clover POS Station - Closing Out and Adding Tips",
  "provider": "Best Card Payments",
  "description": "Learn proper register closing procedures and tip management on Clover POS Station",
  "key_procedures": [
    "End-of-day register closing procedures",
    "Tip entry and distribution processes",
    "Daily reporting and reconciliation",
    "Cash drawer management",
    "Shift handover protocols"
  ],
  "contact_info": {
    "provider": "Best Card Payments",
    "phone": ["(402) 206-2233", "(866) 249-1237"],
    "email": "info@bestcardpayments.com"
  }
}', 
2, 25);