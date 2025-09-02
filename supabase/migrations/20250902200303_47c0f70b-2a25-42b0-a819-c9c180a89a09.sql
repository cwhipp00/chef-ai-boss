-- Remove duplicate courses (keep only one of each)
DELETE FROM public.courses 
WHERE id IN (
  SELECT id FROM (
    SELECT id, 
           ROW_NUMBER() OVER (PARTITION BY title, category ORDER BY created_at DESC) as rn
    FROM public.courses
  ) t 
  WHERE t.rn > 1
);

-- Add comprehensive lessons to the remaining courses with proper JSON casting
INSERT INTO public.lessons (course_id, title, description, content, order_index, duration_minutes) VALUES

-- Essential Knife Skills Mastery lessons
((SELECT id FROM courses WHERE title = 'Essential Knife Skills Mastery' AND category = 'knife-skills' LIMIT 1), 
 'Knife Safety & Selection', 
 'Learn proper knife handling, safety protocols, and how to choose the right knife for each task', 
 '{"video_url": "https://www.youtube.com/watch?v=JMA2SqaDgG8", "overview": "Master the fundamentals of knife safety and selection", "transcript": "Welcome to knife safety fundamentals. Proper knife handling starts with understanding your tools and respecting their power. A sharp knife is actually safer than a dull one because it requires less pressure and gives you better control. Always keep your knives sharp, clean, and properly stored.", "resources": ["Knife safety checklist", "Knife selection guide", "Proper storage techniques"], "quiz": [{"question": "What is the most important rule of knife safety?", "options": ["Keep knives sharp", "Always cut away from yourself", "Store knives properly", "All of the above"], "correct": 3}]}'::jsonb, 
 1, 45),

((SELECT id FROM courses WHERE title = 'Essential Knife Skills Mastery' AND category = 'knife-skills' LIMIT 1), 
 'Basic Knife Cuts', 
 'Master the fundamental cuts: brunoise, julienne, chiffonade, and dice', 
 '{"video_url": "https://www.youtube.com/watch?v=G-Fg7l7G1zw", "overview": "Learn the classic French knife cuts essential for professional cooking", "transcript": "Today we will master the fundamental cuts that form the foundation of professional cooking. The brunoise, julienne, chiffonade, and various dices are not just techniques - they are the building blocks of consistent, professional food preparation.", "resources": ["Knife cut reference chart", "Practice exercises", "Cut size guide"], "quiz": [{"question": "What size is a small dice (brunoise)?", "options": ["1/8 inch", "1/4 inch", "1/2 inch", "1 inch"], "correct": 0}]}'::jsonb, 
 2, 60),

((SELECT id FROM courses WHERE title = 'Essential Knife Skills Mastery' AND category = 'knife-skills' LIMIT 1), 
 'Advanced Knife Techniques', 
 'Learn professional techniques like filleting, boning, and carving', 
 '{"video_url": "https://www.youtube.com/watch?v=nffGuGwCdZE", "overview": "Master advanced knife work for professional kitchens", "transcript": "Advanced techniques require precision, practice, and understanding of anatomy. Whether filleting fish, boning chicken, or carving roasts, each technique has its specific approach and safety considerations.", "resources": ["Filleting guide", "Carving techniques", "Bone structure diagrams"], "quiz": [{"question": "When filleting fish, which direction should you cut?", "options": ["Against the grain", "With the grain", "Perpendicular to spine", "Parallel to spine"], "correct": 2}]}'::jsonb, 
 3, 75),

-- Professional Baking Techniques lessons
((SELECT id FROM courses WHERE title = 'Professional Baking Techniques' AND category = 'baking' LIMIT 1), 
 'Bread Making Fundamentals', 
 'Understanding yeast, gluten development, and basic bread techniques', 
 '{"video_url": "https://www.youtube.com/watch?v=tejAykMAF78", "overview": "Learn the science behind bread making", "transcript": "Bread making is both art and science. Understanding how yeast works, how gluten develops, and how temperature affects fermentation will transform your baking.", "resources": ["Yeast conversion chart", "Bread troubleshooting guide", "Fermentation timeline"], "quiz": [{"question": "What temperature kills yeast?", "options": ["100°F", "120°F", "140°F", "160°F"], "correct": 2}]}'::jsonb, 
 1, 90),

((SELECT id FROM courses WHERE title = 'Professional Baking Techniques' AND category = 'baking' LIMIT 1), 
 'Pastry Dough Techniques', 
 'Master pie crust, puff pastry, and choux pastry fundamentals', 
 '{"video_url": "https://www.youtube.com/watch?v=Ki_9xz-nLks", "overview": "Learn to create perfect pastry doughs", "transcript": "Pastry requires precision and temperature control. The key to great pastry is understanding how fat, flour, and liquid interact at different temperatures.", "resources": ["Pastry temperature guide", "Troubleshooting tips", "Lamination techniques"], "quiz": [{"question": "What creates layers in puff pastry?", "options": ["Eggs", "Steam", "Baking powder", "Sugar"], "correct": 1}]}'::jsonb, 
 2, 85);