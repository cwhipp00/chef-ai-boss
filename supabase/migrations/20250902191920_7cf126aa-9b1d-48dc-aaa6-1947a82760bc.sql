-- Add comprehensive lessons with YouTube video integration (fixed jsonb casting)
INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) 
SELECT 
  c.id,
  lesson_data.title,
  lesson_data.description,
  lesson_data.content::jsonb,
  lesson_data.order_index,
  lesson_data.duration_minutes
FROM courses c
CROSS JOIN (
  -- Square POS Fundamentals lessons
  SELECT 'Square POS Fundamentals' as course_title, 'Getting Started with Square' as title, 'Learn the basics of setting up your Square POS system' as description, 
  '{"video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ", "type": "video", "transcript": "Welcome to Square POS training. In this lesson, we will cover the basic setup process including hardware configuration, account creation, and initial system settings.", "key_points": ["Hardware setup and connection", "Account creation and verification", "Initial configuration settings", "Testing your first transaction"], "resources": [{"name": "Square Setup Guide", "url": "https://squareup.com/help"}]}' as content,
  1 as order_index, 15 as duration_minutes
  
  UNION SELECT 'Square POS Fundamentals', 'Processing Your First Sale', 'Step-by-step guide to processing transactions',
  '{"video_url": "https://www.youtube.com/embed/jNQXAC9IVRw", "type": "video", "transcript": "Now lets process your first sale using Square POS. We will walk through adding items, applying discounts, processing payments, and generating receipts.", "key_points": ["Adding items to cart", "Applying discounts and taxes", "Payment processing options", "Receipt generation and customer options"], "quiz": [{"question": "What payment methods does Square accept?", "options": ["Cash only", "Cards only", "Cash, cards, and mobile payments", "Mobile payments only"], "correct": 2}]}',
  2, 12
  
  UNION SELECT 'Square POS Fundamentals', 'Inventory Management Basics', 'Learn to manage your inventory in Square',
  '{"video_url": "https://www.youtube.com/embed/me2H7Xes19I", "type": "video", "transcript": "Inventory management is crucial for your business success. Learn how to add products, track stock levels, set up automated alerts, and manage variants.", "key_points": ["Adding and organizing products", "Stock level tracking", "Low stock alerts and reordering", "Product variants and modifiers"], "practical_tips": ["Use clear product names", "Set up categories for easy navigation", "Regular stock audits"]}',
  3, 18
  
  UNION SELECT 'Square POS Fundamentals', 'Customer Management', 'Build and manage your customer database',
  '{"video_url": "https://www.youtube.com/embed/L_jWHffIx5E", "type": "video", "transcript": "Building strong customer relationships starts with good data management. Learn to create customer profiles, track purchase history, and implement loyalty programs.", "key_points": ["Creating customer profiles", "Tracking purchase history", "Setting up loyalty programs", "Customer communication tools"]}',
  4, 20
  
  -- Toast POS Mastery lessons
  UNION SELECT 'Toast POS Mastery', 'Toast System Overview', 'Complete introduction to Toast POS platform',
  '{"video_url": "https://www.youtube.com/embed/kJQP7kiw5Fk", "type": "video", "transcript": "Toast is designed specifically for restaurants and hospitality businesses. This comprehensive overview covers all major features and capabilities.", "key_points": ["Platform architecture", "Key restaurant features", "Integration capabilities", "Scalability options"], "industry_focus": "Restaurant and hospitality specific features"}',
  1, 25
  
  UNION SELECT 'Toast POS Mastery', 'Menu Setup and Management', 'Create and manage your digital menu',
  '{"video_url": "https://www.youtube.com/embed/d_m7kcGYkOc", "type": "video", "transcript": "Your menu is the heart of your restaurant operations. Learn to create compelling menus, manage modifiers, implement dynamic pricing, and handle seasonal updates.", "key_points": ["Menu structure and organization", "Adding modifiers and options", "Pricing strategies and updates", "Seasonal menu management"], "best_practices": ["Clear item descriptions", "High-quality images", "Logical categorization"]}',
  2, 30
  
  UNION SELECT 'Toast POS Mastery', 'Order Management Workflow', 'Master the order lifecycle in Toast',
  '{"video_url": "https://www.youtube.com/embed/YbJOTdZBX1g", "type": "video", "transcript": "Understanding order flow is essential for efficient restaurant operations. From order taking to fulfillment, master every step of the process.", "key_points": ["Order taking best practices", "Kitchen communication systems", "Order fulfillment tracking", "Customer notification systems"]}',
  3, 28
  
  -- ServSafe Certification Prep lessons
  UNION SELECT 'ServSafe Certification Prep', 'Food Safety Fundamentals', 'Essential food safety principles every manager should know',
  '{"video_url": "https://www.youtube.com/embed/9yyb_GNi5SY", "type": "video", "transcript": "Food safety is not just a legal requirement, its a moral obligation to protect your customers. Learn the fundamental principles that prevent foodborne illness.", "key_points": ["Foodborne illness prevention", "Personal hygiene standards", "Cross-contamination prevention", "Time and temperature control"], "quiz": [{"question": "What is the danger zone temperature range?", "options": ["32°F - 40°F", "41°F - 135°F", "140°F - 165°F", "165°F - 212°F"], "correct": 1}], "certification_prep": true}',
  1, 45
  
  UNION SELECT 'ServSafe Certification Prep', 'HACCP Principles', 'Hazard Analysis and Critical Control Points system',
  '{"video_url": "https://www.youtube.com/embed/3zNjQecyjE8", "type": "video", "transcript": "HACCP is a systematic approach to food safety management that identifies physical, chemical, and biological hazards in food production.", "key_points": ["Hazard analysis methodology", "Critical control points identification", "Monitoring procedures", "Corrective actions and verification"], "seven_principles": ["Conduct hazard analysis", "Determine CCPs", "Establish critical limits", "Monitor CCPs", "Corrective actions", "Verification", "Record keeping"]}',
  2, 50
  
  UNION SELECT 'ServSafe Certification Prep', 'Cleaning and Sanitizing', 'Proper cleaning and sanitizing procedures',
  '{"video_url": "https://www.youtube.com/embed/W5OGODFGz6E", "type": "video", "transcript": "Effective cleaning and sanitizing prevents contamination and ensures food safety. Learn the difference between cleaning and sanitizing, and master proper procedures.", "key_points": ["Cleaning vs sanitizing differences", "Chemical sanitizer selection", "Heat sanitizing methods", "Manual warewashing procedures"], "chemical_concentrations": {"Chlorine": "50-100 ppm", "Iodine": "12.5-25 ppm", "Quaternary ammonium": "150-400 ppm"}}',
  3, 40
  
  -- TouchBistro Restaurant Operations lessons
  UNION SELECT 'TouchBistro Restaurant Operations', 'TouchBistro Setup and Configuration', 'Get your TouchBistro system ready for service',
  '{"video_url": "https://www.youtube.com/embed/a6hnOpnkpJs", "type": "video", "transcript": "TouchBistro is designed specifically for restaurants of all sizes. Learn the complete setup process from initial configuration to going live.", "key_points": ["Initial system setup", "Menu configuration and pricing", "Staff permissions and roles", "Payment processing setup"], "setup_checklist": ["Hardware installation", "Network configuration", "Menu import", "Staff training"]}',
  1, 35
  
  UNION SELECT 'TouchBistro Restaurant Operations', 'Table Service Management', 'Optimize your table service workflow',
  '{"video_url": "https://www.youtube.com/embed/LsoAcRIJB3w", "type": "video", "transcript": "Efficient table service is key to customer satisfaction and restaurant profitability. Master the complete table service workflow from seating to payment.", "key_points": ["Table assignment strategies", "Order taking efficiency", "Course timing coordination", "Bill splitting and payment"], "service_standards": ["Greeting within 2 minutes", "Drink orders taken promptly", "Regular table checks"]}',
  2, 30
  
  -- Culinary Fundamentals lessons
  UNION SELECT 'Culinary Fundamentals', 'Knife Skills Mastery', 'Essential knife techniques for professional cooking',
  '{"video_url": "https://www.youtube.com/embed/JMA2SqaDgG8", "type": "video", "transcript": "Proper knife skills are the foundation of professional cooking. Master the basic cuts, maintain your knives, and work safely and efficiently.", "key_points": ["Knife selection and care", "Proper grip techniques", "Basic cuts and precision", "Kitchen safety procedures"], "basic_cuts": ["Julienne", "Brunoise", "Chiffonade", "Batonnet"], "practical_exercise": "Practice julienne cuts with carrots and celery for 30 minutes daily"}',
  1, 40
  
  UNION SELECT 'Culinary Fundamentals', 'Cooking Methods and Techniques', 'Master the fundamental cooking methods',
  '{"video_url": "https://www.youtube.com/embed/d_m7GCGqGYw", "type": "video", "transcript": "Understanding cooking methods allows you to control texture, flavor, and nutrition in your dishes. Learn when and how to apply each technique effectively.", "key_points": ["Dry heat cooking methods", "Moist heat cooking applications", "Combination cooking techniques", "Temperature control mastery"], "cooking_methods": {"Dry Heat": ["Grilling", "Roasting", "Sautéing"], "Moist Heat": ["Boiling", "Steaming", "Poaching"], "Combination": ["Braising", "Stewing"]}}',
  2, 45
  
  UNION SELECT 'Culinary Fundamentals', 'Sauce Making Fundamentals', 'Learn the five mother sauces and their derivatives',
  '{"video_url": "https://www.youtube.com/embed/Upqp21BiNz0", "type": "video", "transcript": "The five mother sauces form the foundation of classical cuisine. Master these basics to create hundreds of derivative sauces.", "key_points": ["Béchamel preparation", "Velouté techniques", "Espagnole (brown sauce)", "Hollandaise mastery", "Tomato sauce basics"], "mother_sauces": {"Béchamel": "White sauce with milk", "Velouté": "Blonde roux with stock", "Espagnole": "Brown roux with brown stock", "Hollandaise": "Egg yolk and butter emulsion", "Tomato": "Tomato-based sauce"}, "recipes": [{"name": "Basic Béchamel", "ingredients": ["2 tbsp butter", "2 tbsp flour", "1 cup milk", "Salt, pepper, nutmeg"]}]}',
  3, 50
  
  -- Food Safety & Hygiene lessons
  UNION SELECT 'Food Safety & Hygiene', 'Personal Hygiene Standards', 'Maintain the highest standards of personal cleanliness',
  '{"video_url": "https://www.youtube.com/embed/seJ-OhJOPLI", "type": "video", "transcript": "Personal hygiene is the first line of defense against foodborne illness. Learn and implement the highest standards of personal cleanliness in food service.", "key_points": ["Proper handwashing procedures", "Appropriate work attire", "Health and illness policies", "Wound care and coverage"], "handwashing_steps": ["Wet hands with warm water", "Apply soap and scrub 20 seconds", "Rinse thoroughly", "Dry with single-use towel"]}',
  1, 25
  
  UNION SELECT 'Food Safety & Hygiene', 'Temperature Control', 'Master food temperature safety requirements',
  '{"video_url": "https://www.youtube.com/embed/yg6013-lJI4", "type": "video", "transcript": "Temperature control is critical for food safety. Learn the safe temperatures for cooking, holding, and storing different types of food.", "key_points": ["Safe cooking temperatures by food type", "Cold storage requirements", "Hot holding procedures", "Proper cooling methods"], "safe_temperatures": {"Poultry": "165°F", "Ground beef": "160°F", "Beef steaks": "145°F", "Fish": "145°F", "Cold storage": "41°F or below"}}',
  2, 30
) lesson_data
WHERE c.title = lesson_data.course_title;