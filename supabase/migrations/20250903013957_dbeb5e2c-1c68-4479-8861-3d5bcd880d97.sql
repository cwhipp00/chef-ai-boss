-- Add comprehensive Toast training courses with proper UUIDs

INSERT INTO courses (
  id, title, description, instructor_name, difficulty_level, duration_hours, 
  category, tags, is_featured, created_at, updated_at
) VALUES 
-- Inventory & Operations
(
  'e1f2a3b4-c5d6-7e8f-9a0b-123456789abc', 'Toast Inventory Management', 
  'Master inventory tracking, cost control, vendor management, and waste reduction with Toast''s comprehensive inventory system.',
  'Michael Chen', 'intermediate', 4, 'pos-toast',
  ARRAY['inventory', 'cost-control', 'vendors', 'waste-tracking'], false, now(), now()
),

-- Hardware & Technical
(
  'f2g3h4i5-j6k7-8l9m-0n1o-234567890def', 'Toast Hardware & Terminal Management',
  'Complete guide to Toast hardware setup, terminal configuration, network troubleshooting, and device maintenance.',
  'Sarah Johnson', 'intermediate', 3, 'pos-toast',
  ARRAY['hardware', 'terminals', 'troubleshooting', 'maintenance'], false, now(), now()
),

-- Security & Compliance  
(
  'g3h4i5j6-k7l8-9m0n-1o2p-345678901ghi', 'Toast Security & Compliance',
  'Ensure PCI compliance, data security, proper user permissions, and audit trail management for your Toast system.',
  'David Rodriguez', 'advanced', 2, 'pos-toast', 
  ARRAY['security', 'compliance', 'PCI', 'permissions'], true, now(), now()
),

-- Mobile Solutions
(
  'h4i5j6k7-l8m9-0n1o-2p3q-456789012jkl', 'Toast Mobile Solutions',
  'Leverage Toast Go mobile POS, staff mobile apps, mobile ordering, and remote management capabilities.',
  'Lisa Park', 'intermediate', 3, 'pos-toast',
  ARRAY['mobile', 'toast-go', 'remote', 'apps'], false, now(), now()
),

-- Advanced Analytics
(
  'i5j6k7l8-m9n0-1o2p-3q4r-567890123mno', 'Toast Advanced Reporting & Business Intelligence',
  'Create custom reports, analyze business data, track trends, and make data-driven decisions with Toast analytics.',
  'Rachel Kim', 'advanced', 4, 'pos-toast',
  ARRAY['reporting', 'analytics', 'business-intelligence', 'forecasting'], true, now(), now()
),

-- Gift Cards & Promotions
(
  'j6k7l8m9-n0o1-2p3q-4r5s-678901234pqr', 'Toast Gift Cards & Promotions',
  'Set up gift card programs, create promotional campaigns, manage discounts, and integrate with loyalty systems.',
  'Amanda Foster', 'intermediate', 2, 'pos-toast',
  ARRAY['gift-cards', 'promotions', 'discounts', 'loyalty'], false, now(), now()
),

-- Customer Management
(
  'k7l8m9n0-o1p2-3q4r-5s6t-789012345stu', 'Toast Customer Data & CRM',
  'Build detailed customer profiles, analyze dining patterns, create retention strategies, and personalize experiences.',
  'Jennifer Martinez', 'intermediate', 3, 'pos-toast',
  ARRAY['crm', 'customer-data', 'retention', 'personalization'], false, now(), now()
),

-- Quick Service Focus
(
  'l8m9n0o1-p2q3-4r5s-6t7u-890123456vwx', 'Toast for Quick Service Restaurants',
  'Optimize QSR operations with speed-focused workflows, drive-thru management, and efficiency maximization.',
  'Carlos Santos', 'intermediate', 3, 'pos-toast',
  ARRAY['qsr', 'speed', 'drive-thru', 'efficiency'], false, now(), now()
),

-- Bar & Nightlife
(
  'm9n0o1p2-q3r4-5s6t-7u8v-901234567yz0', 'Toast for Bars & Nightlife',
  'Master bar-specific features including age verification, complex cocktail modifiers, tab management, and nightlife operations.',
  'Nicole Davis', 'intermediate', 3, 'pos-toast',
  ARRAY['bars', 'nightlife', 'cocktails', 'tabs'], false, now(), now()
),

-- System Maintenance
(
  'n0o1p2q3-r4s5-6t7u-8v9w-012345678901', 'Toast Troubleshooting & System Maintenance',
  'Diagnose common issues, optimize system performance, use diagnostic tools, and handle support escalation effectively.',
  'Kevin O''Brien', 'advanced', 2, 'pos-toast',
  ARRAY['troubleshooting', 'maintenance', 'diagnostics', 'support'], false, now(), now()
);