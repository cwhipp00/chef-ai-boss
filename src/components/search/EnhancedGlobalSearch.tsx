import { useState, useEffect } from "react";
import { Search, Clock, File, User, Calendar, ChefHat, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'recipe' | 'staff' | 'document' | 'event' | 'task';
  route: string;
  lastAccessed?: string;
  priority?: 'high' | 'medium' | 'low';
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'Chicken Parmesan Recipe',
    description: 'Classic Italian-American dish with crispy breading',
    type: 'recipe',
    route: '/recipes',
    lastAccessed: '2 hours ago',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Maria Rodriguez - Shift Schedule',
    description: 'Head chef schedule for this week',
    type: 'staff',
    route: '/staff-schedule',
    lastAccessed: '1 day ago'
  },
  {
    id: '3',
    title: 'HACCP Temperature Logs',
    description: 'Daily temperature monitoring documentation',
    type: 'document',
    route: '/documents',
    lastAccessed: '3 hours ago',
    priority: 'high'
  },
  {
    id: '4',
    title: 'Inventory Meeting',
    description: 'Weekly inventory review and planning',
    type: 'event',
    route: '/calendar',
    lastAccessed: 'Tomorrow 10:00 AM'
  },
  {
    id: '5',
    title: 'Deep Clean Fryer',
    description: 'Weekly maintenance task for kitchen equipment',
    type: 'task',
    route: '/checklists',
    lastAccessed: '5 hours ago',
    priority: 'medium'
  }
];

const typeIcons = {
  recipe: ChefHat,
  staff: User,
  document: File,
  event: Calendar,
  task: Clock
};

const typeColors = {
  recipe: 'text-primary bg-primary/10',
  staff: 'text-success bg-success/10',
  document: 'text-info bg-info/10',
  event: 'text-warning bg-warning/10',
  task: 'text-destructive bg-destructive/10'
};

export function EnhancedGlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(['temperature logs', 'chicken recipe', 'maria schedule']);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 2) {
      const filtered = mockSearchResults.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    setQuery('');
    setIsOpen(false);
    navigate(result.route);
    
    // Add to recent searches
    setRecentSearches(prev => [
      result.title,
      ...prev.filter(item => item !== result.title).slice(0, 4)
    ]);
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="w-full justify-start text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-4 w-4 mr-2" />
        Search everything...
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
          <Card className="w-full max-w-2xl mx-4 glass-card border-primary/20 shadow-elegant">
            <CardContent className="p-0">
              <div className="flex items-center border-b border-border/50 p-4">
                <Search className="h-5 w-5 text-muted-foreground mr-3" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search recipes, staff, documents, and more..."
                  className="border-0 focus-visible:ring-0 text-lg"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {results.length > 0 ? (
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Search Results</h3>
                    {results.map((result) => {
                      const IconComponent = typeIcons[result.type];
                      return (
                        <div
                          key={result.id}
                          className="p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-all hover-lift"
                          onClick={() => handleResultClick(result)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${typeColors[result.type]}`}>
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-foreground truncate">{result.title}</h4>
                                {result.priority && (
                                  <Badge variant={result.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                                    {result.priority}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">{result.description}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge variant="outline" className="capitalize">{result.type}</Badge>
                                {result.lastAccessed && (
                                  <span>• Last accessed {result.lastAccessed}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : query.length > 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No results found for "{query}"</p>
                    <p className="text-xs mt-1">Try different keywords or check your spelling</p>
                  </div>
                ) : (
                  <div className="p-4">
                    {recentSearches.length > 0 && (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-medium text-muted-foreground">Recent Searches</h3>
                          <Button variant="ghost" size="sm" onClick={clearRecentSearches} className="text-xs">
                            Clear
                          </Button>
                        </div>
                        <div className="space-y-1">
                          {recentSearches.map((search, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                              onClick={() => handleRecentSearchClick(search)}
                            >
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{search}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    
                    <div className="mt-6 pt-4 border-t border-border/50">
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate('/recipes')}>
                          <ChefHat className="h-4 w-4 mr-2" />
                          Browse Recipes
                        </Button>
                        <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate('/staff-schedule')}>
                          <User className="h-4 w-4 mr-2" />
                          View Schedule
                        </Button>
                        <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate('/documents')}>
                          <File className="h-4 w-4 mr-2" />
                          Documents
                        </Button>
                        <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate('/calendar')}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Calendar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}