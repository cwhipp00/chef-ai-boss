-- Continue adding more comprehensive Toast POS lessons to reach 30+ pieces of content
INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) VALUES

-- More Toast Platform Fundamentals lessons
((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Platform Fundamentals' LIMIT 1), 
'Toast Loyalty Program Staff Training', 
'Complete staff training on Toast loyalty program management', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=oRqhlbwbNg8",
  "video_title": "Toast Loyalty Staff Training",
  "provider": "Toast Official",
  "description": "Comprehensive staff training on Toast loyalty program setup, management, and customer engagement",
  "key_points": [
    "Loyalty program enrollment procedures",
    "Point redemption and reward processing",
    "Customer account management",
    "Loyalty analytics and reporting",
    "Staff training best practices"
  ],
  "staff_procedures": [
    "Explaining loyalty benefits to customers",
    "Processing loyalty transactions",
    "Handling loyalty account issues",
    "Promoting loyalty program enrollment"
  ]
}', 
4, 30),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Platform Fundamentals' LIMIT 1), 
'Toast Payment Terminal Navigation', 
'Master advanced payment terminal features and check management', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=cvwPqgRK0o8",
  "video_title": "Navigate the Toast POS Payment Terminal",
  "provider": "Toast Official",
  "description": "Learn advanced payment terminal navigation, check filtering, and management techniques",
  "key_features": [
    "Payment terminal interface mastery",
    "Advanced check filtering systems",
    "Open, paid, and closed check management",
    "Check history and search functionality",
    "Terminal customization options"
  ],
  "advanced_techniques": [
    "Quick check retrieval methods",
    "Bulk operations on multiple checks",
    "Custom filter creation and saving",
    "Reporting from payment terminal"
  ]
}', 
5, 20),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Platform Fundamentals' LIMIT 1), 
'Toast Catering and Events Management', 
'Complete guide to Toast Catering and Events module', 
'{
  "type": "video_lesson",
  "video_url": "https://www.youtube.com/watch?v=Xgv3t6N2Y-8",
  "video_title": "Get Started with Toast Catering and Events",
  "provider": "Toast Official",
  "description": "8-minute comprehensive guide covering everything needed for Toast Catering and Events module",
  "key_topics": [
    "Creating event types using BEO forms",
    "Catering order creation and management",
    "Estimate generation and sending",
    "Invoice creation and guest communication",
    "Event scheduling and coordination"
  ],
  "practical_applications": [
    "Wedding catering management",
    "Corporate event planning",
    "Private party coordination",
    "Large group reservations"
  ]
}', 
6, 25),

-- Toast Kitchen Display System lessons
((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Kitchen Display Systems Expert' LIMIT 1), 
'KDS Platform Overview and Implementation', 
'Complete guide to Toast Kitchen Display System implementation', 
'{
  "type": "comprehensive_lesson",
  "official_resource": "https://doc.toasttab.com/doc/platformguide/platformKDSOverview.html",
  "description": "Master Toast Kitchen Display System implementation for optimal kitchen efficiency",
  "key_concepts": [
    "KDS vs. traditional ticket system advantages",
    "Real-time order communication systems",
    "Kitchen workflow optimization strategies",
    "Staff productivity measurement tools",
    "Integration with Toast POS systems"
  ],
  "implementation_steps": [
    "Hardware requirements assessment",
    "Network setup and configuration",
    "Staff training and adoption procedures",
    "Performance monitoring and optimization"
  ],
  "efficiency_metrics": [
    "Order completion time tracking",
    "Kitchen bottleneck identification",
    "Staff productivity measurements",
    "Customer satisfaction improvements"
  ]
}', 
1, 45),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Kitchen Display Systems Expert' LIMIT 1), 
'Advanced Kitchen Workflow Optimization', 
'Optimize kitchen operations using Toast KDS analytics and data', 
'{
  "type": "analytics_lesson",
  "description": "Advanced kitchen workflow optimization using Toast KDS data and analytics",
  "optimization_strategies": [
    "Station load balancing techniques", 
    "Prep time optimization methods",
    "Order priority system implementation",
    "Staff scheduling based on analytics"
  ],
  "key_metrics": [
    "Order completion times by station",
    "Kitchen bottleneck identification",
    "Staff productivity measurements", 
    "Peak hour performance analysis"
  ],
  "case_studies": [
    {"restaurant": "Fast-casual chain", "improvement": "32% faster order completion"},
    {"restaurant": "Fine dining establishment", "improvement": "25% reduction in food waste"}
  ]
}', 
2, 40),

-- Toast Online Ordering lessons
((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Online Ordering & Delivery' LIMIT 1), 
'Online Ordering Platform Setup', 
'Complete setup and optimization of Toast online ordering system', 
'{
  "type": "comprehensive_lesson",
  "description": "Master Toast online ordering platform setup and optimization for maximum revenue",
  "setup_components": [
    "Branded website creation and customization",
    "Mobile app ordering configuration", 
    "Menu synchronization across all platforms",
    "Delivery zone setup and management",
    "Pickup scheduling and optimization"
  ],
  "marketing_integration": [
    "SEO optimization for online visibility",
    "Social media platform integration",
    "Email marketing campaign setup",
    "Customer retention program implementation"
  ],
  "revenue_optimization": [
    "Dynamic pricing strategies",
    "Upselling and cross-selling automation",
    "Customer behavior analysis",
    "Conversion rate optimization"
  ]
}', 
1, 50),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Online Ordering & Delivery' LIMIT 1), 
'Third-Party Delivery Integration Management', 
'Master integration with DoorDash, Uber Eats, and other delivery platforms', 
'{
  "type": "integration_lesson",
  "description": "Complete guide to managing third-party delivery platform integrations",
  "supported_platforms": [
    "DoorDash integration and management",
    "Uber Eats setup and optimization",
    "Grubhub menu synchronization",
    "Postmates order handling"
  ],
  "management_strategies": [
    "Menu synchronization across platforms",
    "Commission optimization techniques",
    "Order flow management procedures",
    "Performance analytics and reporting"
  ],
  "best_practices": [
    "Platform-specific menu optimization",
    "Delivery time estimation accuracy",
    "Customer service across platforms",
    "Profitability analysis by platform"
  ]
}', 
2, 35);

-- Add more comprehensive Toast course content
INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) VALUES

-- Toast Staff & Labor Management lessons
((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Staff & Labor Management' LIMIT 1), 
'Employee Scheduling Optimization', 
'Create efficient schedules and manage labor costs with Toast', 
'{
  "type": "management_lesson",
  "description": "Master Toast labor management tools for optimal employee scheduling and cost control",
  "scheduling_features": [
    "Demand forecasting and scheduling",
    "Shift optimization algorithms",
    "Labor cost tracking and budgeting",
    "Employee availability management",
    "Compliance monitoring and alerts"
  ],
  "cost_control_strategies": [
    "Data-driven scheduling decisions",
    "Cross-training for flexibility",
    "Performance-based incentive systems",
    "Labor cost optimization techniques"
  ],
  "compliance_management": [
    "Wage and hour law compliance",
    "Break time requirement tracking",
    "Overtime regulation adherence",
    "Documentation and record keeping"
  ]
}', 
1, 45),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Staff & Labor Management' LIMIT 1), 
'Performance Management and Analytics', 
'Track and improve staff performance using Toast analytics', 
'{
  "type": "analytics_lesson",
  "description": "Implement comprehensive staff performance management using Toast data and analytics",
  "performance_metrics": [
    "Sales performance by employee",
    "Customer satisfaction ratings",
    "Efficiency and productivity measurements",
    "Training completion and certification tracking"
  ],
  "improvement_strategies": [
    "Goal setting and achievement tracking",
    "Regular performance review processes",
    "Recognition and incentive programs",
    "Skills development and training plans"
  ],
  "analytics_tools": [
    "Individual performance dashboards", 
    "Team performance comparisons",
    "Trend analysis and forecasting", 
    "Custom performance reporting"
  ]
}', 
2, 35);

-- Add more Toast lessons to reach 30+ total
INSERT INTO lessons (course_id, title, description, content, order_index, duration_minutes) VALUES

-- Additional Toast courses content
((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Advanced Analytics & Growth' LIMIT 1), 
'Financial Reporting and Business Intelligence', 
'Master Toast financial reporting and business intelligence capabilities', 
'{
  "type": "business_intelligence_lesson",  
  "description": "Complete guide to Toast financial reporting and advanced business intelligence features",
  "reporting_capabilities": [
    "Daily sales summary generation",
    "Item performance and profitability analysis", 
    "Labor cost reporting and optimization",
    "Tax reporting and compliance",
    "Custom dashboard creation and management"
  ],
  "business_insights": [
    "Sales trend identification and analysis",
    "Seasonal pattern recognition",
    "Profit margin optimization strategies",
    "Growth opportunity identification"
  ],
  "advanced_analytics": [
    "Customer lifetime value calculation",
    "Menu item profitability analysis",
    "Staff productivity benchmarking", 
    "Market trend analysis and forecasting"
  ]
}', 
1, 50),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Advanced Analytics & Growth' LIMIT 1), 
'Customer Behavior Analytics and Insights', 
'Analyze customer data to drive business growth and retention', 
'{
  "type": "customer_analytics_lesson",
  "description": "Deep dive into customer behavior analysis using Toast data for business growth",
  "analytics_tools": [
    "Customer segmentation and profiling",
    "Purchase pattern analysis and trends",
    "Customer lifetime value calculation",
    "Churn prediction and prevention"
  ],
  "growth_strategies": [
    "Personalized marketing campaign development",
    "Menu optimization based on customer preferences",
    "Service improvement based on feedback data",
    "Expansion planning using customer insights"
  ],
  "retention_techniques": [
    "Loyalty program optimization",
    "Customer experience enhancement",
    "Targeted promotional campaigns",
    "Feedback loop implementation"
  ]
}', 
2, 45),

-- More advanced Toast content
((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Multi-Location & Franchise Management' LIMIT 1), 
'Centralized Multi-Location Management', 
'Master centralized management of multiple Toast locations', 
'{
  "type": "enterprise_lesson",
  "description": "Complete guide to managing multiple Toast locations with centralized oversight",
  "management_features": [
    "Centralized reporting and analytics dashboard",
    "Location comparison and benchmarking",
    "Standardized procedure implementation",
    "Brand consistency maintenance tools"
  ],
  "operational_strategies": [
    "Performance benchmarking across locations",
    "Best practice sharing and implementation",
    "Inventory coordination and optimization",
    "Staff training standardization programs"
  ],
  "scalability_solutions": [
    "Franchise management tools and resources",
    "Corporate oversight and control systems",
    "Multi-location promotional campaigns",
    "Consolidated financial reporting"
  ]
}', 
1, 40),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Integration & Third-Party Apps' LIMIT 1), 
'API Integration and Custom Solutions', 
'Learn Toast API integration for custom business solutions', 
'{
  "type": "technical_lesson",
  "description": "Master Toast API integration for connecting external systems and creating custom solutions", 
  "api_capabilities": [
    "Order management API endpoints",
    "Menu synchronization and updates",
    "Customer data integration",
    "Reporting and analytics data access"
  ],
  "integration_examples": [
    "Accounting software synchronization (QuickBooks, Xero)",
    "Inventory management system connections",
    "Marketing platform data sharing",
    "Custom analytics and business intelligence tools"
  ],
  "development_resources": [
    "API documentation and guides",
    "SDK and development tools",
    "Testing and sandbox environments",
    "Support and developer community"
  ]
}', 
1, 60),

-- Final comprehensive Toast lessons
((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Marketing & Customer Engagement' LIMIT 1), 
'Email Marketing Automation with Toast', 
'Create automated marketing campaigns using Toast customer data', 
'{
  "type": "marketing_lesson",
  "description": "Build effective automated email marketing campaigns integrated with Toast customer data",
  "campaign_types": [
    "Welcome series for new customers",
    "Order confirmation and follow-up emails",
    "Loyalty reward and milestone campaigns",
    "Re-engagement campaigns for inactive customers"
  ],
  "automation_features": [
    "Trigger-based campaign setup",
    "Customer segmentation strategies",
    "Performance tracking and optimization",
    "A/B testing and campaign refinement"
  ],
  "personalization_techniques": [
    "Order history-based recommendations",
    "Location-specific promotions",
    "Preference-based content delivery",
    "Behavioral trigger campaigns"
  ]
}', 
1, 35),

((SELECT id FROM courses WHERE category = 'pos-toast' AND title = 'Toast Capital & Financial Services' LIMIT 1), 
'Restaurant Financing and Growth Capital', 
'Understand Toast Capital and financing options for restaurant growth', 
'{
  "type": "financial_lesson",
  "description": "Comprehensive guide to Toast Capital financing options and restaurant growth funding",
  "financing_options": [
    "Working capital loans for operational needs",
    "Equipment financing for hardware upgrades",
    "Revenue-based funding for expansion",
    "Cash advances for immediate capital needs"
  ],
  "application_process": [
    "Eligibility requirements and qualifications",
    "Required documentation and financial records",
    "Application timeline and approval process", 
    "Repayment structure and terms"
  ],
  "growth_strategies": [
    "Capital deployment for maximum ROI",
    "Expansion planning and execution",
    "Equipment upgrade optimization",
    "Cash flow management during growth"
  ]
}', 
1, 30);