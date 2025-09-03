import { useState, useEffect } from 'react';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  FileText, 
  ChefHat, 
  Calendar, 
  Users, 
  Package, 
  Settings,
  BookOpen,
  ClipboardCheck,
  MessageSquare,
  Bell,
  BarChart3,
  CreditCard,
  ShoppingCart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: string;
  route: string;
  icon: React.ReactNode;
  keywords: string[];
}

// Mock searchable content from across the app
const searchableItems: SearchItem[] = [
  // Recipes
  {
    id: 'recipe-carbonara',
    title: 'Signature Pasta Carbonara',
    description: 'Classic Italian pasta with pancetta and parmesan',
    category: 'Recipes',
    route: '/recipes',
    icon: <ChefHat className="h-4 w-4" />,
    keywords: ['pasta', 'carbonara', 'italian', 'pancetta', 'parmesan', 'recipe']
  },
  {
    id: 'recipe-salmon',
    title: 'Grilled Salmon Teriyaki',
    description: 'Fresh salmon with homemade teriyaki glaze',
    category: 'Recipes',
    route: '/recipes',
    icon: <ChefHat className="h-4 w-4" />,
    keywords: ['salmon', 'teriyaki', 'grilled', 'fish', 'japanese', 'recipe']
  },
  
  // Calendar Events
  {
    id: 'event-staff-meeting',
    title: 'Staff Meeting',
    description: 'Weekly team coordination meeting',
    category: 'Calendar',
    route: '/calendar',
    icon: <Calendar className="h-4 w-4" />,
    keywords: ['meeting', 'staff', 'team', 'weekly', 'coordination']
  },
  {
    id: 'event-training',
    title: 'Food Safety Training',
    description: 'Mandatory food safety certification training',
    category: 'Calendar',
    route: '/calendar',
    icon: <Calendar className="h-4 w-4" />,
    keywords: ['training', 'food safety', 'certification', 'mandatory', 'staff']
  },

  // Staff
  {
    id: 'staff-schedule',
    title: 'Staff Schedule',
    description: 'Manage employee schedules and shifts',
    category: 'Staff',
    route: '/staff-schedule',
    icon: <Users className="h-4 w-4" />,
    keywords: ['staff', 'schedule', 'shifts', 'employees', 'roster']
  },

  // Documents
  {
    id: 'doc-food-safety',
    title: 'Food Safety Manual',
    description: 'Complete guide to food safety procedures',
    category: 'Documents',
    route: '/documents',
    icon: <FileText className="h-4 w-4" />,
    keywords: ['food safety', 'manual', 'procedures', 'guidelines', 'haccp']
  },
  {
    id: 'doc-employee-handbook',
    title: 'Employee Handbook',
    description: 'Policies and procedures for all staff',
    category: 'Documents',
    route: '/documents',
    icon: <FileText className="h-4 w-4" />,
    keywords: ['employee', 'handbook', 'policies', 'procedures', 'hr']
  },

  // Orders
  {
    id: 'orders-pending',
    title: 'Pending Orders',
    description: 'View and manage pending customer orders',
    category: 'Orders',
    route: '/orders',
    icon: <ShoppingCart className="h-4 w-4" />,
    keywords: ['orders', 'pending', 'customers', 'queue', 'kitchen']
  },

  // Checklists
  {
    id: 'checklist-opening',
    title: 'Opening Checklist',
    description: 'Daily opening procedures checklist',
    category: 'Checklists',
    route: '/checklists',
    icon: <ClipboardCheck className="h-4 w-4" />,
    keywords: ['checklist', 'opening', 'daily', 'procedures', 'setup']
  },

  // Communications
  {
    id: 'comm-announcements',
    title: 'Staff Announcements',
    description: 'Important announcements for all staff',
    category: 'Communications',
    route: '/communications',
    icon: <MessageSquare className="h-4 w-4" />,
    keywords: ['announcements', 'staff', 'communication', 'updates', 'news']
  },

  // Settings
  {
    id: 'settings-theme',
    title: 'Theme Settings',
    description: 'Switch between light and dark mode',
    category: 'Settings',
    route: '/settings',
    icon: <Settings className="h-4 w-4" />,
    keywords: ['theme', 'dark mode', 'light mode', 'appearance', 'settings']
  }
];

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(['recipes', 'staff schedule', 'food safety']);
  const navigate = useNavigate();

  const filteredItems = searchableItems.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.keywords.some(keyword => keyword.toLowerCase().includes(query))
    );
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SearchItem[]>);

  const handleSelect = (item: SearchItem) => {
    navigate(item.route);
    onOpenChange(false);
    
    // Add to recent searches
    const newRecent = [searchQuery || item.title, ...recentSearches.filter(s => s !== (searchQuery || item.title))].slice(0, 3);
    setRecentSearches(newRecent);
    
    setSearchQuery('');
  };

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search Chef Central... (recipes, staff, orders, documents)" 
        value={searchQuery}
        onValueChange={setSearchQuery}
        className="text-base"
      />
      <CommandList className="max-h-96">
        {!searchQuery && recentSearches.length > 0 && (
          <CommandGroup heading="Recent Searches">
            {recentSearches.map((query, index) => (
              <CommandItem
                key={`recent-${index}`}
                value={query}
                onSelect={() => handleRecentSearch(query)}
                className="flex items-center gap-3 px-3 py-2 cursor-pointer"
              >
                <Search className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 font-medium">{query}</div>
                <Badge variant="outline" className="text-xs">Recent</Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        
        <CommandEmpty>
          <div className="py-8 text-center space-y-2">
            <Search className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">No results found</p>
            <p className="text-xs text-muted-foreground">Try searching for recipes, staff, documents, or settings</p>
          </div>
        </CommandEmpty>
        
        {Object.entries(groupedItems).map(([category, items]) => (
          <CommandGroup key={category} heading={category}>
            {items.map((item) => (
              <CommandItem
                key={item.id}
                value={item.title}
                onSelect={() => handleSelect(item)}
                className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/50"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-1 rounded bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{item.description}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

export function SearchTrigger({ onOpenSearch }: { onOpenSearch: () => void }) {
  return (
    <Button
      variant="outline"
      className="relative w-full max-w-sm justify-start text-sm text-muted-foreground"
      onClick={onOpenSearch}
    >
      <Search className="h-4 w-4 mr-2" />
      Search Chef Central...
      <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
}