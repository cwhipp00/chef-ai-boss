-- Add comprehensive lessons for the new training courses
-- Get the course IDs first, then add lessons

-- Knife Skills lessons
INSERT INTO public.lessons (course_id, title, description, content, order_index, duration_minutes) 
SELECT 
  c.id,
  'Basic Knife Safety and Handling',
  'Learn proper knife safety, handling techniques, and workspace organization for injury prevention.',
  jsonb_build_object(
    'overview', 'Master the fundamental safety principles and proper handling techniques that form the foundation of all knife work in professional kitchens.',
    'video_url', 'https://www.youtube.com/watch?v=JMA2SqaDgG8',
    'transcript', 'In this lesson, we cover the essential safety principles every chef must know. First, always keep your knives sharp - a dull knife is more dangerous than a sharp one. Second, never reach for a falling knife. Third, always cut away from your body. We''ll practice proper grip techniques and learn how to create a safe cutting environment.',
    'resources', jsonb_build_array(
      jsonb_build_object('title', 'Knife Safety Checklist', 'type', 'pdf', 'url', 'https://example.com/knife-safety.pdf'),
      jsonb_build_object('title', 'Proper Knife Storage Guide', 'type', 'document', 'url', 'https://example.com/storage.pdf')
    ),
    'quiz', jsonb_build_object(
      'questions', jsonb_build_array(
        jsonb_build_object(
          'question', 'What is the most important rule when a knife falls?',
          'options', jsonb_build_array('Catch it quickly', 'Let it drop', 'Jump back', 'Close your eyes'),
          'correct', 1,
          'explanation', 'Never try to catch a falling knife - let it drop and step away.'
        )
      )
    )
  ),
  1,
  25
FROM courses c WHERE c.title = 'Essential Knife Skills Mastery';

INSERT INTO public.lessons (course_id, title, description, content, order_index, duration_minutes) 
SELECT 
  c.id,
  'The Classic Cuts: Julienne, Dice, and Chiffonade',
  'Master the fundamental knife cuts used in professional kitchens worldwide.',
  jsonb_build_object(
    'overview', 'Learn the precise techniques for creating uniform cuts that cook evenly and present beautifully.',
    'video_url', 'https://www.youtube.com/watch?v=nffGuGwCdZE',
    'transcript', 'Today we''re learning the classic cuts that every professional chef must master. Julienne creates matchstick-sized pieces, perfect for garnishes and quick cooking. The brunoise is a precise small dice. Chiffonade is used for leafy herbs and greens.',
    'resources', jsonb_build_array(
      jsonb_build_object('title', 'Cut Size Reference Chart', 'type', 'pdf', 'url', 'https://example.com/cuts.pdf')
    ),
    'quiz', jsonb_build_object(
      'questions', jsonb_build_array(
        jsonb_build_object(
          'question', 'What size should a julienne cut be?',
          'options', jsonb_build_array('1/8 inch x 1/8 inch x 2 inches', '1/4 inch x 1/4 inch x 2 inches', '1/16 inch x 1/16 inch x 1 inch', '1/2 inch x 1/2 inch x 1 inch'),
          'correct', 0,
          'explanation', 'A julienne cut should be 1/8 inch x 1/8 inch x 2 inches for standard julienne.'
        )
      )
    )
  ),
  2,
  35
FROM courses c WHERE c.title = 'Essential Knife Skills Mastery';

-- Food Prep lessons
INSERT INTO public.lessons (course_id, title, description, content, order_index, duration_minutes) 
SELECT 
  c.id,
  'Mise en Place: The Foundation of Kitchen Success',
  'Learn the professional approach to preparation and organization that makes kitchens run smoothly.',
  jsonb_build_object(
    'overview', 'Mise en place (everything in its place) is the cornerstone of professional cooking. Master this system for maximum efficiency.',
    'video_url', 'https://www.youtube.com/watch?v=Nte_gn-ODk8',
    'transcript', 'Mise en place is more than just prep work - it''s a mindset. We start by reading through all recipes, then organize our ingredients and tools. Every container should be labeled, every ingredient measured and ready.',
    'resources', jsonb_build_array(
      jsonb_build_object('title', 'Mise en Place Checklist', 'type', 'pdf', 'url', 'https://example.com/mise-checklist.pdf'),
      jsonb_build_object('title', 'Kitchen Organization Guide', 'type', 'document', 'url', 'https://example.com/organization.pdf')
    )
  ),
  1,
  30
FROM courses c WHERE c.title = 'Advanced Food Preparation Techniques';

-- Baking lessons  
INSERT INTO public.lessons (course_id, title, description, content, order_index, duration_minutes) 
SELECT 
  c.id,
  'Understanding Gluten Development and Bread Science',
  'Learn the science behind bread making and how gluten development affects texture and structure.',
  jsonb_build_object(
    'overview', 'Understand the molecular science that makes bread possible and learn to control gluten for perfect results.',
    'video_url', 'https://www.youtube.com/watch?v=tejFI8C7LkY',
    'transcript', 'Gluten is the protein network that gives bread its structure. When we knead dough, we''re developing this network. Under-kneaded bread will be dense, over-kneaded will be tough. We''ll learn to recognize the perfect gluten development.',
    'resources', jsonb_build_array(
      jsonb_build_object('title', 'Bread Science Guide', 'type', 'pdf', 'url', 'https://example.com/bread-science.pdf')
    ),
    'quiz', jsonb_build_object(
      'questions', jsonb_build_array(
        jsonb_build_object(
          'question', 'What happens when bread dough is over-kneaded?',
          'options', jsonb_build_array('It becomes too dense', 'It becomes tough and chewy', 'It won''t rise', 'It tears easily'),
          'correct', 1,
          'explanation', 'Over-kneaded dough becomes tough and chewy because the gluten network is overworked.'
        )
      )
    )
  ),
  1,
  45
FROM courses c WHERE c.title = 'Professional Baking Techniques';

-- Cost Control lessons
INSERT INTO public.lessons (course_id, title, description, content, order_index, duration_minutes) 
SELECT 
  c.id,
  'Calculating Food Costs and Menu Pricing',
  'Master the mathematics of profitable menu pricing using food cost percentages and competitive analysis.',
  jsonb_build_object(
    'overview', 'Learn to calculate accurate food costs, determine optimal pricing, and maintain profitability while staying competitive.',
    'video_url', 'https://www.youtube.com/watch?v=pricing-tutorial',
    'transcript', 'Food cost percentage is calculated by dividing food cost by selling price. Most restaurants aim for 25-35% food cost. We must account for all ingredients, including garnishes and accompaniments, to get accurate costs.',
    'resources', jsonb_build_array(
      jsonb_build_object('title', 'Food Cost Calculator Template', 'type', 'spreadsheet', 'url', 'https://example.com/cost-calc.xlsx'),
      jsonb_build_object('title', 'Menu Pricing Strategies', 'type', 'pdf', 'url', 'https://example.com/pricing.pdf')
    ),
    'quiz', jsonb_build_object(
      'questions', jsonb_build_array(
        jsonb_build_object(
          'question', 'If a dish costs $6 to make and you want a 30% food cost, what should the menu price be?',
          'options', jsonb_build_array('$18.00', '$20.00', '$22.00', '$25.00'),
          'correct', 1,
          'explanation', 'Menu Price = Food Cost ÷ Food Cost Percentage. $6 ÷ 0.30 = $20.00'
        )
      )
    )
  ),
  1,
  40
FROM courses c WHERE c.title = 'Restaurant Cost Control & Food Costing';

-- Wine Service lessons
INSERT INTO public.lessons (course_id, title, description, content, order_index, duration_minutes) 
SELECT 
  c.id,
  'Professional Wine Service Techniques',
  'Master the proper techniques for wine presentation, opening, and service in fine dining establishments.',
  jsonb_build_object(
    'overview', 'Learn the ritualized service techniques that enhance the dining experience and demonstrate professionalism.',
    'video_url', 'https://www.youtube.com/watch?v=wine-service',
    'transcript', 'Proper wine service begins with presentation. Show the bottle label to the host for approval. Open the bottle tableside using smooth, confident movements. Offer a small taste to the host before serving guests.',
    'resources', jsonb_build_array(
      jsonb_build_object('title', 'Wine Service Steps Checklist', 'type', 'pdf', 'url', 'https://example.com/wine-service.pdf')
    )
  ),
  1,
  35
FROM courses c WHERE c.title = 'Professional Wine Service & Pairing';

-- Leadership lessons
INSERT INTO public.lessons (course_id, title, description, content, order_index, duration_minutes) 
SELECT 
  c.id,
  'Building Effective Kitchen Teams',
  'Learn to create cohesive, motivated teams that work efficiently under pressure.',
  jsonb_build_object(
    'overview', 'Develop the leadership skills needed to build strong teams, manage conflicts, and maintain high performance in high-stress environments.',
    'video_url', 'https://www.youtube.com/watch?v=team-building',
    'transcript', 'Great kitchen leaders understand that every team member has unique strengths. Your job is to identify these strengths and position people for success. Clear communication and consistent expectations are essential.',
    'resources', jsonb_build_array(
      jsonb_build_object('title', 'Team Building Exercises', 'type', 'pdf', 'url', 'https://example.com/team-building.pdf')
    )
  ),
  1,
  50
FROM courses c WHERE c.title = 'Kitchen Leadership & Team Management';

-- Plating lessons
INSERT INTO public.lessons (course_id, title, description, content, order_index, duration_minutes) 
SELECT 
  c.id,
  'The Art of Plate Composition',
  'Learn the principles of visual composition, balance, and color theory as applied to food presentation.',
  jsonb_build_object(
    'overview', 'Master the visual elements that make dishes stunning: composition, color, texture, and height.',
    'video_url', 'https://www.youtube.com/watch?v=plating-techniques',
    'transcript', 'Great plating follows artistic principles. Use the rule of thirds, create height and texture contrast, and consider color harmony. Every element on the plate should have a purpose.',
    'resources', jsonb_build_array(
      jsonb_build_object('title', 'Plating Techniques Guide', 'type', 'pdf', 'url', 'https://example.com/plating.pdf')
    )
  ),
  1,
  30
FROM courses c WHERE c.title = 'Food Plating & Presentation Mastery';

-- Add content to training_content table for enhanced learning materials
INSERT INTO public.training_content (course_id, content_type, title, description, file_url, order_index, is_required, metadata)
SELECT 
  c.id,
  'resource',
  'Professional Knife Skills Reference Card',
  'Quick reference guide for all essential knife cuts with measurements and techniques',
  'https://example.com/knife-reference.pdf',
  1,
  true,
  jsonb_build_object('downloadable', true, 'printable', true)
FROM courses c WHERE c.title = 'Essential Knife Skills Mastery';

INSERT INTO public.training_content (course_id, content_type, title, description, file_url, order_index, is_required, metadata)
SELECT 
  c.id,
  'assignment',
  'Cost Analysis Project',
  'Complete a full cost analysis for a 3-course menu including labor and overhead',
  null,
  1,
  true,
  jsonb_build_object(
    'instructions', 'Create a detailed cost breakdown for a 3-course menu. Include ingredient costs, labor allocation, and overhead expenses. Calculate menu prices for 28% and 32% food cost targets.',
    'submission_format', 'spreadsheet',
    'points', 100
  )
FROM courses c WHERE c.title = 'Restaurant Cost Control & Food Costing';

INSERT INTO public.training_content (course_id, content_type, title, description, file_url, order_index, is_required, metadata)
SELECT 
  c.id,
  'document',
  'Wine Regions and Varietals Study Guide',
  'Comprehensive guide to major wine regions and grape varietals for sommelier certification',
  'https://example.com/wine-regions.pdf',
  1,
  false,
  jsonb_build_object('pages', 45, 'study_time_hours', 3)
FROM courses c WHERE c.title = 'Professional Wine Service & Pairing';