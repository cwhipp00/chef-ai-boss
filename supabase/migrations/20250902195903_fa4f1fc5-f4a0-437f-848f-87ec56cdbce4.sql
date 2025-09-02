-- Add comprehensive culinary training courses for missing categories
INSERT INTO public.courses (title, description, instructor_name, difficulty_level, duration_hours, category, tags, is_featured, thumbnail_url) VALUES

-- Knife Skills & Food Prep
('Essential Knife Skills Mastery', 'Master the fundamental knife techniques every chef needs to know, from basic cuts to advanced knife work', 'Chef Marcus Rodriguez', 'beginner', 4, 'knife-skills', ARRAY['knife-skills', 'fundamentals', 'safety', 'technique'], true, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400'),

('Advanced Food Preparation Techniques', 'Learn professional food preparation methods, mise en place organization, and kitchen efficiency', 'Chef Sarah Kim', 'intermediate', 6, 'food-prep', ARRAY['food-prep', 'organization', 'efficiency', 'techniques'], true, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'),

-- Cooking Methods
('Grilling & BBQ Fundamentals', 'Master the art of grilling, smoking, and barbecue techniques for professional kitchens', 'Chef Tony Williams', 'beginner', 5, 'grilling', ARRAY['grilling', 'bbq', 'outdoor-cooking', 'techniques'], false, 'https://images.unsplash.com/photo-1558030006-450675393462?w=400'),

('Professional Baking Techniques', 'Learn essential baking skills, bread making, and pastry fundamentals for restaurant operations', 'Chef Marie Dubois', 'intermediate', 8, 'baking', ARRAY['baking', 'pastry', 'bread', 'desserts'], true, 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400'),

('Sautéing & Pan Techniques', 'Master sautéing, pan-frying, and stovetop cooking methods for consistent results', 'Chef David Chen', 'beginner', 3, 'saute', ARRAY['saute', 'pan-cooking', 'techniques', 'fundamentals'], false, 'https://images.unsplash.com/photo-1556909114-4f5e6bb8bde3?w=400'),

-- Plating & Presentation
('Food Plating & Presentation Mastery', 'Create visually stunning dishes with professional plating techniques and presentation skills', 'Chef Isabella Garcia', 'intermediate', 4, 'plating', ARRAY['plating', 'presentation', 'visual', 'artistry'], true, 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?w=400'),

('Color Theory in Culinary Arts', 'Understand how to use color, texture, and composition to create beautiful dishes', 'Chef Michael Thompson', 'advanced', 3, 'plating', ARRAY['color-theory', 'visual-arts', 'presentation', 'creativity'], false, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'),

-- Nutrition & Health
('Culinary Nutrition Fundamentals', 'Learn nutritional principles, dietary restrictions, and healthy cooking techniques', 'Dr. Amanda Foster', 'beginner', 5, 'nutrition', ARRAY['nutrition', 'health', 'dietary-restrictions', 'wellness'], false, 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400'),

('Allergen Management in Professional Kitchens', 'Comprehensive training on food allergies, cross-contamination prevention, and safe practices', 'Chef Robert Martinez', 'intermediate', 3, 'nutrition', ARRAY['allergens', 'safety', 'health', 'compliance'], true, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),

-- Cost Control & Management
('Restaurant Cost Control & Food Costing', 'Master food costing, portion control, and profit margin optimization techniques', 'Chef Lisa Wong', 'intermediate', 6, 'cost-control', ARRAY['cost-control', 'profit', 'management', 'business'], true, 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400'),

('Inventory Management for Kitchens', 'Learn efficient inventory systems, waste reduction, and supply chain management', 'Chef James Wilson', 'beginner', 4, 'inventory-management', ARRAY['inventory', 'waste-reduction', 'efficiency', 'systems'], false, 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400'),

('Menu Engineering & Profitability', 'Design profitable menus using psychology, cost analysis, and strategic positioning', 'Chef Patricia Brown', 'advanced', 5, 'cost-control', ARRAY['menu-engineering', 'profitability', 'psychology', 'strategy'], true, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'),

-- Service & Customer Relations
('Excellence in Customer Service', 'Master front-of-house service, communication skills, and customer satisfaction techniques', 'Sarah Johnson', 'beginner', 4, 'customer-service', ARRAY['service', 'communication', 'hospitality', 'satisfaction'], false, 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400'),

('Professional Wine Service & Pairing', 'Learn wine service techniques, food pairing principles, and sommelier basics', 'Master Sommelier John Davis', 'intermediate', 6, 'wine-service', ARRAY['wine', 'pairing', 'service', 'beverages'], true, 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400'),

('Cocktail Crafting & Bar Management', 'Master cocktail techniques, bar setup, and beverage program management', 'Head Bartender Mike O''Connor', 'intermediate', 5, 'cocktails', ARRAY['cocktails', 'bartending', 'beverages', 'techniques'], false, 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400'),

-- Leadership & Communication  
('Kitchen Leadership & Team Management', 'Develop leadership skills, team communication, and effective kitchen management strategies', 'Executive Chef Carlos Rivera', 'advanced', 7, 'leadership', ARRAY['leadership', 'management', 'team-building', 'communication'], true, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'),

('Effective Communication in Professional Kitchens', 'Master clear communication, conflict resolution, and team coordination skills', 'Chef Manager Anna Lee', 'intermediate', 3, 'communication', ARRAY['communication', 'teamwork', 'conflict-resolution', 'coordination'], false, 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400'),

('Time Management & Kitchen Efficiency', 'Optimize workflow, manage multiple tasks, and improve kitchen productivity', 'Chef Operations Director Tom Clark', 'intermediate', 4, 'time-management', ARRAY['time-management', 'efficiency', 'productivity', 'workflow'], false, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),

-- Specialized Techniques
('Molecular Gastronomy Fundamentals', 'Introduction to modern culinary techniques, spherification, and molecular cooking', 'Chef Innovation Lab', 'advanced', 6, 'molecular', ARRAY['molecular-gastronomy', 'innovation', 'techniques', 'modern-cooking'], false, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400'),

('Fermentation & Preservation Techniques', 'Learn traditional and modern fermentation, curing, and food preservation methods', 'Chef Heritage Specialist', 'intermediate', 5, 'fermentation', ARRAY['fermentation', 'preservation', 'traditional-techniques', 'sustainability'], false, 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400'),

-- International Cuisines (expanding)
('Asian Culinary Techniques', 'Master wok cooking, steaming, and fundamental Asian cooking methods and flavors', 'Chef Liu Zhang', 'intermediate', 6, 'asian-cuisine', ARRAY['asian-cuisine', 'wok-cooking', 'techniques', 'international'], false, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400'),

('Mediterranean Cooking Mastery', 'Learn Mediterranean ingredients, techniques, and flavor profiles from various regions', 'Chef Giuseppe Romano', 'intermediate', 5, 'mediterranean', ARRAY['mediterranean', 'international', 'healthy-cooking', 'techniques'], false, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400'),

('Latin American Flavors & Techniques', 'Explore Latin American cooking methods, spices, and traditional preparation techniques', 'Chef Rosa Martinez', 'intermediate', 5, 'latin-american', ARRAY['latin-american', 'international', 'spices', 'traditional'], false, 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400'),

-- Additional POS Training
('Restaurant Technology Integration', 'Learn how to integrate various restaurant technologies for optimal efficiency', 'Tech Specialist Jordan Kim', 'intermediate', 4, 'pos-integration', ARRAY['technology', 'integration', 'efficiency', 'systems'], false, 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'),

('Advanced POS Analytics & Reporting', 'Master data analysis, sales reporting, and business intelligence from POS systems', 'Business Analyst Rachel Green', 'advanced', 3, 'pos-analytics', ARRAY['analytics', 'reporting', 'data-analysis', 'business-intelligence'], false, 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400'),

-- Sustainability & Ethics
('Sustainable Cooking & Waste Reduction', 'Learn sustainable practices, waste reduction, and environmentally conscious cooking', 'Sustainability Chef Emma Taylor', 'intermediate', 4, 'sustainability', ARRAY['sustainability', 'waste-reduction', 'environment', 'ethics'], true, 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'),

('Farm-to-Table & Local Sourcing', 'Master local sourcing, seasonal cooking, and building relationships with suppliers', 'Chef Farm Specialist', 'intermediate', 3, 'farm-to-table', ARRAY['local-sourcing', 'seasonal', 'suppliers', 'sustainability'], false, 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400');