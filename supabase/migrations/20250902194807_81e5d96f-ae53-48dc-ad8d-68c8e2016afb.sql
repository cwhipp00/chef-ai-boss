-- Fix JSON syntax and add final comprehensive lessons
INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) VALUES

-- More Square lessons with fixed JSON
((SELECT id FROM courses WHERE category = 'pos-square' AND title = 'Square Payment Processing Mastery' LIMIT 1), 
'Creating Items for Square POS', 
'Master item creation and management in Square Point of Sale', 
'{"type": "video_lesson", "video_url": "https://www.youtube.com/watch?v=g9_2WqN9mJU", "video_title": "Creating Items for Square Point of Sale", "provider": "Square Canada Official", "description": "Learn to create and manage items in Square POS for faster checkout and itemized receipts", "key_points": ["Item creation workflow and best practices", "Category organization and management", "Inventory tracking setup and configuration", "Pricing strategies and modifier setup", "Barcode scanning and integration"], "official_resource": "http://square.com/pos"}', 
2, 25),

((SELECT id FROM courses WHERE category = 'pos-square' AND title = 'Square E-commerce Integration' LIMIT 1), 
'Square Online Store Setup', 
'Complete guide to setting up and running Square Online store', 
'{"type": "video_lesson", "video_url": "https://www.youtube.com/watch?v=7gjrqpk4_Qo", "video_title": "Square Webinars: Get Started with Square Online", "provider": "Square Official Webinar", "description": "Comprehensive webinar covering Square Online store setup and management basics", "key_topics": ["Website building and customization", "Item selection for online sales", "Menu creation and management", "Fulfillment type configuration", "Pickup and delivery setup"], "official_resource": "https://squareup.com/help/article/6852"}', 
1, 35),

-- Additional Toast content to reach 30+ lessons
((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Platform Fundamentals' LIMIT 1), 
'Toast Mobile App Management', 
'Complete guide to Toast mobile applications and management', 
'{"type": "mobile_lesson", "description": "Master Toast mobile applications including Toast Go handheld terminals and mobile ordering", "mobile_features": ["Toast Go handheld terminal operations", "Mobile ordering app configuration and management", "Staff mobile access and permissions", "Customer mobile experience optimization"], "optimization_strategies": ["Mobile menu design and user experience", "Order flow efficiency and speed optimization", "Mobile payment processing best practices", "Customer app engagement and retention"]}', 
7, 25),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Kitchen Display Systems Expert' LIMIT 1), 
'KDS Troubleshooting and Maintenance', 
'Maintain optimal KDS performance and resolve common issues', 
'{"type": "technical_lesson", "description": "Complete guide to KDS maintenance, troubleshooting, and performance optimization", "maintenance_procedures": ["Regular system updates and patch management", "Hardware cleaning and care procedures", "Performance monitoring and optimization", "Backup and recovery procedures"], "troubleshooting_guide": ["Common error identification and resolution", "Network connectivity issue diagnosis", "Hardware replacement and setup procedures", "Software conflict resolution and compatibility"]}', 
3, 35),

-- Additional Clover content
((SELECT id FROM courses WHERE category = 'pos-clover' AND title LIKE '%Clover%' LIMIT 1), 
'Clover Device Maintenance and Care', 
'Proper cleaning and maintenance procedures for Clover devices', 
'{"type": "video_lesson", "video_url": "https://www.youtube.com/watch?v=Q9bAb1ESmvo", "video_title": "Cleaning your Clover device", "provider": "Clover Official", "description": "Keep your Clover device clean for better performance, longevity, and safety", "maintenance_benefits": ["Improved device performance and reliability", "Extended hardware lifespan", "Enhanced safety for employees and customers", "Professional appearance and hygiene"], "official_resource": "https://www.clover.com/help/"}', 
3, 15),

-- Final comprehensive Toast lessons
((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Menu Engineering & Optimization' LIMIT 1), 
'Seasonal Menu Planning and Execution', 
'Plan and execute seasonal menu changes for maximum profitability', 
'{"type": "strategic_lesson", "description": "Master seasonal menu planning and execution strategies for year-round profitability", "planning_elements": ["Seasonal ingredient sourcing and cost management", "Menu rotation strategies and timing", "Customer preference analysis and trend forecasting", "Profitability forecasting and margin optimization"], "execution_tactics": ["Launch timing and market coordination", "Staff training and preparation procedures", "Marketing campaign coordination and promotion", "Performance monitoring and adjustment strategies"]}', 
3, 40);

-- Count total lessons to verify we have 30+ for Toast
SELECT 
  c.title as course_title,
  c.category,
  COUNT(l.id) as lesson_count,
  SUM(l.duration_minutes) as total_duration_minutes
FROM courses c 
LEFT JOIN lessons l ON c.id = l.course_id 
WHERE c.category LIKE 'pos-%'
GROUP BY c.id, c.title, c.category
ORDER BY c.category, lesson_count DESC;