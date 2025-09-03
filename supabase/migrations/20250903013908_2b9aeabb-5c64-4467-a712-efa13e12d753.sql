-- Add comprehensive Toast training courses with full lesson content

INSERT INTO courses (
  id, title, description, instructor_name, difficulty_level, duration_hours, 
  category, tags, is_featured, created_at, updated_at
) VALUES 
-- Inventory & Operations
(
  'toast-inventory-mgmt', 'Toast Inventory Management', 
  'Master inventory tracking, cost control, vendor management, and waste reduction with Toast''s comprehensive inventory system.',
  'Michael Chen', 'intermediate', 4, 'pos-toast',
  ARRAY['inventory', 'cost-control', 'vendors', 'waste-tracking'], false, now(), now()
),

-- Hardware & Technical
(
  'toast-hardware-terminals', 'Toast Hardware & Terminal Management',
  'Complete guide to Toast hardware setup, terminal configuration, network troubleshooting, and device maintenance.',
  'Sarah Johnson', 'intermediate', 3, 'pos-toast',
  ARRAY['hardware', 'terminals', 'troubleshooting', 'maintenance'], false, now(), now()
),

-- Security & Compliance  
(
  'toast-security-compliance', 'Toast Security & Compliance',
  'Ensure PCI compliance, data security, proper user permissions, and audit trail management for your Toast system.',
  'David Rodriguez', 'advanced', 2, 'pos-toast', 
  ARRAY['security', 'compliance', 'PCI', 'permissions'], true, now(), now()
),

-- Mobile Solutions
(
  'toast-mobile-solutions', 'Toast Mobile Solutions',
  'Leverage Toast Go mobile POS, staff mobile apps, mobile ordering, and remote management capabilities.',
  'Lisa Park', 'intermediate', 3, 'pos-toast',
  ARRAY['mobile', 'toast-go', 'remote', 'apps'], false, now(), now()
),

-- Advanced Analytics
(
  'toast-advanced-reporting', 'Toast Advanced Reporting & Business Intelligence',
  'Create custom reports, analyze business data, track trends, and make data-driven decisions with Toast analytics.',
  'Rachel Kim', 'advanced', 4, 'pos-toast',
  ARRAY['reporting', 'analytics', 'business-intelligence', 'forecasting'], true, now(), now()
),

-- Gift Cards & Promotions
(
  'toast-gift-promotions', 'Toast Gift Cards & Promotions',
  'Set up gift card programs, create promotional campaigns, manage discounts, and integrate with loyalty systems.',
  'Amanda Foster', 'intermediate', 2, 'pos-toast',
  ARRAY['gift-cards', 'promotions', 'discounts', 'loyalty'], false, now(), now()
),

-- Customer Management
(
  'toast-customer-crm', 'Toast Customer Data & CRM',
  'Build detailed customer profiles, analyze dining patterns, create retention strategies, and personalize experiences.',
  'Jennifer Martinez', 'intermediate', 3, 'pos-toast',
  ARRAY['crm', 'customer-data', 'retention', 'personalization'], false, now(), now()
),

-- Quick Service Focus
(
  'toast-qsr-optimization', 'Toast for Quick Service Restaurants',
  'Optimize QSR operations with speed-focused workflows, drive-thru management, and efficiency maximization.',
  'Carlos Santos', 'intermediate', 3, 'pos-toast',
  ARRAY['qsr', 'speed', 'drive-thru', 'efficiency'], false, now(), now()
),

-- Bar & Nightlife
(
  'toast-bars-nightlife', 'Toast for Bars & Nightlife',
  'Master bar-specific features including age verification, complex cocktail modifiers, tab management, and nightlife operations.',
  'Nicole Davis', 'intermediate', 3, 'pos-toast',
  ARRAY['bars', 'nightlife', 'cocktails', 'tabs'], false, now(), now()
),

-- System Maintenance
(
  'toast-troubleshooting', 'Toast Troubleshooting & System Maintenance',
  'Diagnose common issues, optimize system performance, use diagnostic tools, and handle support escalation effectively.',
  'Kevin O''Brien', 'advanced', 2, 'pos-toast',
  ARRAY['troubleshooting', 'maintenance', 'diagnostics', 'support'], false, now(), now()
);

-- Update existing courses to ensure consistency
UPDATE courses SET 
  is_featured = true,
  updated_at = now()
WHERE id IN (
  'toast-security-compliance',
  'toast-advanced-reporting'
) AND category = 'pos-toast';