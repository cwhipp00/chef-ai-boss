import { useState } from 'react';
import { Upload, FileText, Search, Filter, Download, Eye, FolderOpen, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const documents = [
  {
    id: 1,
    name: "Food Safety Manual",
    type: "PDF",
    size: "2.4 MB",
    lastModified: "2024-03-15",
    category: "Safety",
    author: "Head Chef",
    tags: ["haccp", "safety", "procedures", "training"],
    content: "Complete guide to food safety procedures including HACCP protocols, temperature control, cross-contamination prevention, and staff training requirements."
  },
  {
    id: 2,
    name: "Employee Handbook",
    type: "PDF",
    size: "1.8 MB",
    lastModified: "2024-03-12",
    category: "HR",
    author: "HR Manager",
    tags: ["policies", "procedures", "employee", "benefits"],
    content: "Comprehensive employee handbook covering company policies, procedures, benefits, dress code, and workplace conduct guidelines."
  },
  {
    id: 3,
    name: "Supplier Contracts",
    type: "DOCX",
    size: "3.2 MB",
    lastModified: "2024-03-10",
    category: "Legal",
    author: "Operations Manager",
    tags: ["contracts", "suppliers", "agreements", "terms"],
    content: "Collection of supplier contracts and agreements for produce, meat, dairy, and beverage suppliers including terms and conditions."
  },
  {
    id: 4,
    name: "Health Department Certificates",
    type: "PDF",
    size: "1.1 MB",
    lastModified: "2024-03-08",
    category: "Compliance",
    author: "Manager",
    tags: ["certificates", "compliance", "health", "permits"],
    content: "Current health department certificates, permits, and compliance documentation required for restaurant operation."
  },
  {
    id: 5,
    name: "Menu Engineering Analysis",
    type: "XLSX",
    size: "0.8 MB",
    lastModified: "2024-03-14",
    category: "Operations",
    author: "Chef Manager",
    tags: ["menu", "analysis", "profitability", "costs"],
    content: "Detailed menu engineering analysis including item profitability, food costs, pricing strategies, and menu optimization recommendations."
  },
  {
    id: 6,
    name: "Staff Training Protocols",
    type: "PDF",
    size: "1.5 MB",
    lastModified: "2024-03-11",
    category: "Training",
    author: "Training Coordinator",
    tags: ["training", "protocols", "onboarding", "skills"],
    content: "Standard operating procedures for staff training including onboarding process, skill development, and ongoing education programs."
  },
  {
    id: 7,
    name: "Financial Reports Q1 2024",
    type: "PDF",
    size: "2.1 MB",
    lastModified: "2024-03-09",
    category: "Finance",
    author: "Accountant",
    tags: ["financial", "reports", "quarterly", "revenue"],
    content: "Quarterly financial reports including profit and loss statements, cash flow analysis, and budget variance reports for Q1 2024."
  },
  {
    id: 8,
    name: "Emergency Procedures",
    type: "PDF",
    size: "0.9 MB",
    lastModified: "2024-03-07",
    category: "Safety",
    author: "Safety Officer",
    tags: ["emergency", "procedures", "safety", "protocols"],
    content: "Emergency response procedures including fire safety, medical emergencies, evacuation plans, and emergency contact information."
  }
];

export default function Documents() {
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const { toast } = useToast();

  const categories = ['All', 'Safety', 'HR', 'Legal', 'Compliance', 'Operations', 'Training', 'Finance'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchQuery.toLowerCase() === '' || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = async () => {
    setIsUploading(true);
    
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsUploading(false);
    toast({
      title: "Files Uploaded",
      description: "Documents have been successfully uploaded to the library",
    });
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return '📄';
      case 'docx': return '📝';
      case 'xlsx': return '📊';
      default: return '📄';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Document Library</h1>
          <p className="text-muted-foreground">Searchable document management and organization</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleFileUpload} disabled={isUploading}>
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Bulk Upload"}
          </Button>
          <Button size="lg" className="bg-gradient-primary">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      <Tabs defaultValue="library" className="space-y-6">
        <TabsList>
          <TabsTrigger value="library">Document Library</TabsTrigger>
          <TabsTrigger value="search">Advanced Search</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-6">
          {/* Search and Filter Bar */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents, content, tags, or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Results Summary */}
          {searchQuery && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              <span>Found {filteredDocuments.length} documents matching "{searchQuery}"</span>
            </div>
          )}

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDocuments.map((doc) => (
              <Card 
                key={doc.id} 
                className="hover-lift cursor-pointer transition-all"
                onClick={() => setSelectedDocument(doc)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getFileIcon(doc.type)}</span>
                      <div className="text-xs text-muted-foreground">{doc.type}</div>
                    </div>
                    <Badge variant="secondary">{doc.category}</Badge>
                  </div>
                  <CardTitle className="text-base leading-tight">{doc.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Document Meta */}
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{doc.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{doc.lastModified}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FolderOpen className="h-3 w-3" />
                        <span>{doc.size}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                          {tag}
                        </Badge>
                      ))}
                      {doc.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          +{doc.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Content Preview */}
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {doc.content}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No documents found matching your search.' : 'No documents found.'}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Document Search</CardTitle>
              <p className="text-sm text-muted-foreground">
                Use advanced filters to find exactly what you're looking for
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Text Search</label>
                  <Input placeholder="Search within document content..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Author</label>
                  <Input placeholder="Search by author..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <div className="flex gap-2">
                    <Input type="date" className="flex-1" />
                    <Input type="date" className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">File Size</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Under 1MB</SelectItem>
                      <SelectItem value="medium">1MB - 5MB</SelectItem>
                      <SelectItem value="large">Over 5MB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Search Documents
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.slice(1).map((category) => {
              const categoryDocs = documents.filter(doc => doc.category === category);
              return (
                <Card key={category} className="hover-lift cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{category}</span>
                      <Badge variant="secondary">{categoryDocs.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {categoryDocs.slice(0, 3).map((doc) => (
                        <div key={doc.id} className="text-sm text-muted-foreground">
                          • {doc.name}
                        </div>
                      ))}
                      {categoryDocs.length > 3 && (
                        <div className="text-sm text-primary">
                          + {categoryDocs.length - 3} more documents
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}