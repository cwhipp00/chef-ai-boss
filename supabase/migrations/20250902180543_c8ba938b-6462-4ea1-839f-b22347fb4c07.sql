-- Add comprehensive lessons with YouTube video integration
INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) 
SELECT 
  c.id,
  lesson_data.title,
  lesson_data.description,
  lesson_data.content,
  lesson_data.order_index,
  lesson_data.duration_minutes
FROM courses c
CROSS JOIN (
  -- Square POS Fundamentals lessons
  SELECT 'Square POS Fundamentals' as course_title, 'Getting Started with Square' as title, 'Learn the basics of setting up your Square POS system' as description, 
  '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "type": "video", "transcript": "Welcome to Square POS training. In this lesson, we will cover the basic setup process...", "key_points": ["Hardware setup", "Account creation", "Initial configuration"], "resources": [{"name": "Square Setup Guide", "url": "https://squareup.com/help"}]}' as content,
  1 as order_index, 15 as duration_minutes
  
  UNION SELECT 'Square POS Fundamentals', 'Processing Your First Sale', 'Step-by-step guide to processing transactions',
  '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "type": "video", "transcript": "Now lets process your first sale using Square POS...", "key_points": ["Adding items", "Payment processing", "Receipt options"], "quiz": [{"question": "What are the payment methods Square accepts?", "options": ["Cash only", "Cards only", "Cash, cards, and mobile payments", "Mobile payments only"], "correct": 2}]}',
  2, 12
  
  UNION SELECT 'Square POS Fundamentals', 'Inventory Management Basics', 'Learn to manage your inventory in Square',
  '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "type": "video", "transcript": "Inventory management is crucial for your business success...", "key_points": ["Adding products", "Stock tracking", "Low stock alerts"]}',
  3, 18
  
  UNION SELECT 'Square POS Fundamentals', 'Customer Management', 'Build and manage your customer database',
  '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "type": "video", "transcript": "Building strong customer relationships starts with good data management...", "key_points": ["Customer profiles", "Purchase history", "Loyalty programs"]}',
  4, 20
  
  -- Toast POS Mastery lessons
  UNION SELECT 'Toast POS Mastery', 'Toast System Overview', 'Complete introduction to Toast POS platform',
  '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "type": "video", "transcript": "Toast is designed specifically for restaurants and hospitality businesses...", "key_points": ["Platform overview", "Key features", "Integration capabilities"]}',
  1, 25
  
  UNION SELECT 'Toast POS Mastery', 'Menu Setup and Management', 'Create and manage your digital menu',
  '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "type": "video", "transcript": "Your menu is the heart of your restaurant operations...", "key_points": ["Menu creation", "Modifiers", "Pricing strategies", "Seasonal updates"]}',
  2, 30
  
  UNION SELECT 'Toast POS Mastery', 'Order Management Workflow', 'Master the order lifecycle in Toast',
  '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "type": "video", "transcript": "Understanding order flow is essential for efficient operations...", "key_points": ["Order taking", "Kitchen communication", "Order fulfillment", "Customer notifications"]}',
  3, 28
  
  -- ServSafe Certification Prep lessons
  UNION SELECT 'ServSafe Certification Prep', 'Food Safety Fundamentals', 'Essential food safety principles every manager should know',
  '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "type": "video", "transcript": "Food safety is not just a legal requirement, its a moral obligation...", "key_points": ["Foodborne illness prevention", "Personal hygiene", "Cross-contamination prevention"], "quiz": [{"question": "What is the danger zone temperature range?", "options": ["32°F - 40°F", "41°F - 135°F", "140°F - 165°F", "165°F - 212°F"], "correct": 1}]}',
  1, 45
  
  UNION SELECT 'ServSafe Certification Prep', 'HACCP Principles', 'Hazard Analysis and Critical Control Points system',
  '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "type": "video", "transcript": "HACCP is a systematic approach to food safety management...", "key_points": ["Hazard analysis", "Critical control points", "Monitoring procedures", "Corrective actions"]}',
  2, 50
  
  UNION SELECT 'ServSafe Certification Prep', 'Cleaning and Sanitizing', 'Proper cleaning and sanitizing procedures',
  '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "type": "video", "transcript": "Effective cleaning and sanitizing prevents contamination...", "key_points": ["Cleaning vs sanitizing", "Chemical sanitizers", "Heat sanitizing", "Manual warewashing"]}',
  3, 40
  
  -- TouchBistro Restaurant Operations lessons
  UNION SELECT 'TouchBistro Restaurant Operations', 'TouchBistro Setup and Configuration', 'Get your TouchBistro system ready for service',
  '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "type": "video", "transcript": "TouchBistro is designed specifically for restaurants of all sizes...", "key_points": ["Initial setup", "Menu configuration", "Staff permissions", "Payment setup"]}',
  1, 35
  
  UNION SELECT 'TouchBistro Restaurant Operations', 'Table Service Management', 'Optimize your table service workflow',
  '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "type": "video", "transcript": "Efficient table service is key to customer satisfaction...", "key_points": ["Table assignment", "Order taking", "Course timing", "Bill splitting"]}',
  2, 30
  
  -- Culinary Fundamentals lessons
  UNION SELECT 'Culinary Fundamentals', 'Knife Skills Mastery', 'Essential knife techniques for professional cooking',
  '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "type": "video", "transcript": "Proper knife skills are the foundation of professional cooking...", "key_points": ["Knife selection", "Grip techniques", "Basic cuts", "Safety procedures"], "practical_exercise": "Practice julienne cuts with carrots and celery"}',
  1, 40
  
  UNION SELECT 'Culinary Fundamentals', 'Cooking Methods and Techniques', 'Master the fundamental cooking methods',
  '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "type": "video", "transcript": "Understanding cooking methods allows you to control texture, flavor, and nutrition...", "key_points": ["Dry heat cooking", "Moist heat cooking", "Combination methods", "Temperature control"]}',
  2, 45
  
  UNION SELECT 'Culinary Fundamentals', 'Sauce Making Fundamentals', 'Learn the five mother sauces and their derivatives',
  '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "type": "video", "transcript": "The five mother sauces form the foundation of classical cuisine...", "key_points": ["Béchamel", "Velouté", "Espagnole", "Hollandaise", "Tomato"], "recipes": [{"name": "Basic Béchamel", "ingredients": ["Butter", "Flour", "Milk", "Seasoning"]}]}',
  3, 50
  
  -- Food Safety & Hygiene lessons
  UNION SELECT 'Food Safety & Hygiene', 'Personal Hygiene Standards', 'Maintain the highest standards of personal cleanliness',
  '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "type": "video", "transcript": "Personal hygiene is the first line of defense against foodborne illness...", "key_points": ["Hand washing procedures", "Proper attire", "Health policies", "Wound care"]}',
  1, 25
  
  UNION SELECT 'Food Safety & Hygiene', 'Temperature Control', 'Master food temperature safety requirements',
  '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "type": "video", "transcript": "Temperature control is critical for food safety...", "key_points": ["Safe cooking temperatures", "Cold storage", "Hot holding", "Cooling procedures"]}',
  2, 30
) lesson_data
WHERE c.title = lesson_data.course_title;