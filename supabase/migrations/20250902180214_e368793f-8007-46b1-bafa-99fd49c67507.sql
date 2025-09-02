-- Add POS-specific courses for major providers
INSERT INTO courses (title, description, instructor_name, difficulty_level, duration_hours, category, tags, is_featured) VALUES
-- Square POS Courses
('Square POS Fundamentals', 'Master the basics of Square Point of Sale system, from setup to daily operations', 'Sarah Mitchell', 'beginner', 4, 'pos-square', ARRAY['square', 'pos', 'setup', 'basics'], true),
('Advanced Square Analytics', 'Learn to leverage Square''s reporting and analytics tools for business insights', 'Mike Rodriguez', 'intermediate', 6, 'pos-square', ARRAY['square', 'analytics', 'reporting', 'insights'], false),
('Square Inventory Management', 'Efficiently manage inventory using Square''s built-in tools and integrations', 'Jennifer Lee', 'intermediate', 5, 'pos-square', ARRAY['square', 'inventory', 'management', 'integration'], false),

-- Toast POS Courses  
('Toast POS Mastery', 'Complete guide to Toast POS system for restaurants and bars', 'David Chen', 'beginner', 5, 'pos-toast', ARRAY['toast', 'pos', 'restaurant', 'bar'], true),
('Toast Kitchen Display Systems', 'Optimize kitchen operations with Toast KDS and order management', 'Lisa Wang', 'intermediate', 4, 'pos-toast', ARRAY['toast', 'kds', 'kitchen', 'orders'], false),
('Toast Payment Processing', 'Master Toast''s payment processing, tips, and financial reporting', 'Carlos Santos', 'intermediate', 3, 'pos-toast', ARRAY['toast', 'payments', 'tips', 'finance'], false),

-- TouchBistro Courses
('TouchBistro Restaurant Operations', 'Full-service restaurant management with TouchBistro POS', 'Maria Gonzalez', 'beginner', 4, 'pos-touchbistro', ARRAY['touchbistro', 'pos', 'restaurant', 'operations'], true),
('TouchBistro Table Management', 'Advanced table management and reservation systems', 'James Thompson', 'intermediate', 3, 'pos-touchbistro', ARRAY['touchbistro', 'tables', 'reservations', 'management'], false),

-- Resy POS Courses
('Resy POS Complete Guide', 'Comprehensive training for Resy point of sale system', 'Amanda Foster', 'beginner', 4, 'pos-resy', ARRAY['resy', 'pos', 'reservations', 'dining'], true),

-- Clover POS Courses
('Clover POS Setup & Operations', 'Get started with Clover POS for retail and restaurant use', 'Robert Kim', 'beginner', 4, 'pos-clover', ARRAY['clover', 'pos', 'retail', 'restaurant'], true),
('Clover App Marketplace', 'Extend Clover functionality with third-party applications', 'Nicole Brown', 'intermediate', 3, 'pos-clover', ARRAY['clover', 'apps', 'integrations', 'marketplace'], false),

-- Lightspeed Courses
('Lightspeed Restaurant POS', 'Master Lightspeed for restaurant and hospitality operations', 'Kevin Park', 'beginner', 5, 'pos-lightspeed', ARRAY['lightspeed', 'pos', 'restaurant', 'hospitality'], true),

-- Shopify POS Courses
('Shopify POS for Restaurants', 'Use Shopify POS for food service and retail hybrid businesses', 'Rachel Davis', 'beginner', 3, 'pos-shopify', ARRAY['shopify', 'pos', 'retail', 'hybrid'], false),

-- Aloha POS Courses
('Aloha POS Enterprise Training', 'Advanced training for NCR Aloha POS enterprise systems', 'Steven Martinez', 'advanced', 8, 'pos-aloha', ARRAY['aloha', 'ncr', 'enterprise', 'advanced'], false),

-- Micros POS Courses
('Oracle Micros POS Training', 'Complete guide to Oracle Micros point of sale system', 'Linda Johnson', 'intermediate', 6, 'pos-micros', ARRAY['micros', 'oracle', 'pos', 'enterprise'], false),

-- General Safety & Compliance (enhanced)
('ServSafe Certification Prep', 'Prepare for ServSafe food safety manager certification exam', 'Dr. Patricia Wilson', 'beginner', 8, 'safety-compliance', ARRAY['servsafe', 'certification', 'food-safety', 'manager'], true),
('OSHA Restaurant Safety', 'Workplace safety compliance for restaurant and food service', 'Mark Anderson', 'beginner', 4, 'safety-compliance', ARRAY['osha', 'workplace-safety', 'compliance', 'restaurant'], true),
('Alcohol Service Training', 'Responsible alcohol service and compliance training', 'Jessica Torres', 'beginner', 3, 'safety-compliance', ARRAY['alcohol', 'responsible-service', 'compliance', 'bartending'], false),
('Allergen Management', 'Managing food allergies and dietary restrictions in food service', 'Dr. Michael Chang', 'intermediate', 3, 'safety-compliance', ARRAY['allergies', 'dietary', 'safety', 'compliance'], false),
('Health Department Compliance', 'Navigate health department inspections and maintain compliance', 'Susan Phillips', 'intermediate', 4, 'safety-compliance', ARRAY['health-department', 'inspections', 'compliance', 'standards'], false),

-- POS Integration & Advanced Topics
('Multi-POS Integration Strategies', 'Managing multiple POS systems and data synchronization', 'Alex Chen', 'advanced', 6, 'pos-advanced', ARRAY['integration', 'multi-pos', 'data-sync', 'advanced'], false),
('POS Security & Compliance', 'Payment security, PCI compliance, and data protection across POS systems', 'Daniel Rodriguez', 'advanced', 5, 'pos-advanced', ARRAY['security', 'pci-compliance', 'data-protection', 'payments'], true),
('POS Analytics & Business Intelligence', 'Advanced analytics across different POS platforms for business growth', 'Michelle Lee', 'advanced', 7, 'pos-advanced', ARRAY['analytics', 'business-intelligence', 'growth', 'data'], false);