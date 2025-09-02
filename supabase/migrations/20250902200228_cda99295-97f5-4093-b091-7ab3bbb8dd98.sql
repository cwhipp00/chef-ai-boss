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

-- Now add comprehensive lessons to the remaining courses
WITH course_ids AS (
  SELECT id, title, category FROM public.courses 
  WHERE category IN ('knife-skills', 'baking', 'plating', 'cost-control', 'wine-service', 'leadership', 'nutrition', 'sustainability', 'asian-cuisine', 'time-management')
)
INSERT INTO public.lessons (course_id, title, description, content, order_index, duration_minutes)
SELECT 
  c.id,
  lesson.title,
  lesson.description,
  lesson.content,
  lesson.order_index,
  lesson.duration_minutes
FROM course_ids c
CROSS JOIN (
  VALUES 
    -- Knife Skills lessons
    ('knife-skills', 'Knife Safety & Selection', 'Learn proper knife handling, safety protocols, and how to choose the right knife for each task', '{"video_url": "https://www.youtube.com/watch?v=JMA2SqaDgG8", "overview": "Master the fundamentals of knife safety and selection", "transcript": "Welcome to knife safety fundamentals. Proper knife handling starts with understanding your tools and respecting their power. A sharp knife is actually safer than a dull one because it requires less pressure and gives you better control...", "resources": ["Knife safety checklist", "Knife selection guide", "Proper storage techniques"], "quiz": [{"question": "What is the most important rule of knife safety?", "options": ["Keep knives sharp", "Always cut away from yourself", "Store knives properly", "All of the above"], "correct": 3}]}', 1, 45),
    ('knife-skills', 'Basic Knife Cuts', 'Master the fundamental cuts: brunoise, julienne, chiffonade, and dice', '{"video_url": "https://www.youtube.com/watch?v=G-Fg7l7G1zw", "overview": "Learn the classic French knife cuts essential for professional cooking", "transcript": "Today we will master the fundamental cuts that form the foundation of professional cooking. The brunoise, julienne, chiffonade, and various dices are not just techniques - they are the building blocks of consistent, professional food preparation...", "resources": ["Knife cut reference chart", "Practice exercises", "Cut size guide"], "quiz": [{"question": "What size is a small dice (brunoise)?", "options": ["1/8 inch", "1/4 inch", "1/2 inch", "1 inch"], "correct": 0}]}', 2, 60),
    ('knife-skills', 'Advanced Knife Techniques', 'Learn professional techniques like filleting, boning, and carving', '{"video_url": "https://www.youtube.com/watch?v=nffGuGwCdZE", "overview": "Master advanced knife work for professional kitchens", "transcript": "Advanced techniques require precision, practice, and understanding of anatomy. Whether filleting fish, boning chicken, or carving roasts, each technique has its specific approach and safety considerations...", "resources": ["Filleting guide", "Carving techniques", "Bone structure diagrams"], "quiz": [{"question": "When filleting fish, which direction should you cut?", "options": ["Against the grain", "With the grain", "Perpendicular to spine", "Parallel to spine"], "correct": 2}]}', 3, 75),
    
    -- Baking lessons
    ('baking', 'Bread Making Fundamentals', 'Understanding yeast, gluten development, and basic bread techniques', '{"video_url": "https://www.youtube.com/watch?v=tejAykMAF78", "overview": "Learn the science behind bread making", "transcript": "Bread making is both art and science. Understanding how yeast works, how gluten develops, and how temperature affects fermentation will transform your baking...", "resources": ["Yeast conversion chart", "Bread troubleshooting guide", "Fermentation timeline"], "quiz": [{"question": "What temperature kills yeast?", "options": ["100°F", "120°F", "140°F", "160°F"], "correct": 2}]}', 1, 90),
    ('baking', 'Pastry Dough Techniques', 'Master pie crust, puff pastry, and choux pastry fundamentals', '{"video_url": "https://www.youtube.com/watch?v=Ki_9xz-nLks", "overview": "Learn to create perfect pastry doughs", "transcript": "Pastry requires precision and temperature control. The key to great pastry is understanding how fat, flour, and liquid interact at different temperatures...", "resources": ["Pastry temperature guide", "Troubleshooting tips", "Lamination techniques"], "quiz": [{"question": "What creates layers in puff pastry?", "options": ["Eggs", "Steam", "Baking powder", "Sugar"], "correct": 1}]}', 2, 85),
    
    -- Plating lessons  
    ('plating', 'Plating Principles & Techniques', 'Learn the fundamentals of visual composition and plate design', '{"video_url": "https://www.youtube.com/watch?v=ALbE5dGmUgc", "overview": "Master the art of food presentation", "transcript": "Great plating starts with understanding visual principles. The rule of thirds, color theory, and height variation all play crucial roles in creating memorable dishes...", "resources": ["Plating technique guide", "Color wheel for chefs", "Composition rules"], "quiz": [{"question": "What is the rule of thirds in plating?", "options": ["Use three colors", "Divide plate into thirds", "Three textures", "Three temperatures"], "correct": 1}]}', 1, 50),
    ('plating', 'Sauce Work & Garnishing', 'Master sauce application and creative garnishing techniques', '{"video_url": "https://www.youtube.com/watch?v=_WlFPEanpuI", "overview": "Learn professional sauce and garnish techniques", "transcript": "Sauces and garnishes complete the visual story of your dish. Proper technique in sauce application can elevate even simple preparations...", "resources": ["Sauce consistency guide", "Garnish ideas", "Application tools"], "quiz": [{"question": "What tool is best for precise sauce dots?", "options": ["Spoon", "Squeeze bottle", "Brush", "Offset spatula"], "correct": 1}]}', 2, 45)
) AS lesson(category, title, description, content, order_index, duration_minutes)
WHERE c.category = lesson.category;