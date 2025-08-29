import { useState } from 'react';
import { Upload, FileText, Download, Search, Filter, Folder, Plus, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const documents = [
  {
    id: 1,
    name: "Food Safety Manual 2024",
    type: "PDF",
    category: "Safety",
    size: "2.4 MB",
    uploadDate: "2024-01-10",
    description: "Complete food safety guidelines and procedures",
    tags: ["safety", "manual", "compliance"]
  },
  {
    id: 2,
    name: "Equipment Maintenance Schedule",
    type: "Excel",
    category: "Maintenance",
    size: "856 KB",
    uploadDate: "2024-01-08",
    description: "Detailed maintenance schedule for all kitchen equipment",
    tags: ["maintenance", "schedule", "equipment"]
  },
  {
    id: 3,
    name: "Staff Training Handbook",
    type: "PDF",
    category: "Training",
    size: "4.1 MB",
    uploadDate: "2024-01-05",
    description: "Comprehensive training materials for new employees",
    tags: ["training", "staff", "handbook"]
  },
  {
    id: 4,
    name: "Menu Pricing Analysis Q1",
    type: "PDF",
    category: "Finance",
    size: "1.8 MB",
    uploadDate: "2024-01-03",
    description: "Quarterly analysis of menu pricing and profitability",
    tags: ["pricing", "analysis", "finance"]
  },
  {
    id: 5,
    name: "Supplier Contracts 2024",
    type: "Word",
    category: "Legal",
    size: "3.2 MB",
    uploadDate: "2023-12-28",
    description: "Active supplier contracts and agreements",
    tags: ["contracts", "suppliers", "legal"]
  },
  {
    id: 6,
    name: "Health Inspection Report",
    type: "PDF",
    category: "Compliance",
    size: "1.1 MB",
    uploadDate: "2023-12-20",
    description: "Latest health department inspection results",
    tags: ["health", "inspection", "compliance"]
  }
];

const categories = [
  { name: "Safety", count: 8, color: "bg-destructive" },
  { name: "Training", count: 12, color: "bg-primary" },
  { name: "Maintenance", count: 6, color: "bg-warning" },
  { name: "Finance", count: 15, color: "bg-success" },
  { name: "Legal", count: 4, color: "bg-info" },
  { name: "Compliance", count: 7, color: "bg-secondary" }
];

const recentActivity = [
  {
    id: 1,
    action: "uploaded",
    document: "Food Safety Manual 2024",
    user: "Sarah Johnson",
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    action: "downloaded",
    document: "Staff Training Handbook",
    user: "Mike Rodriguez",
    timestamp: "4 hours ago"
  },
  {
    id: 3,
    action: "viewed",
    document: "Equipment Maintenance Schedule",
    user: "Emily Chen",
    timestamp: "6 hours ago"
  }
];

export default function Documents() {
  const [selectedTab, setSelectedTab] = useState('library');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const getFileTypeIcon = (type: string) => {
    return <FileText className="h-4 w-4" />;
  };

  const getFileTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return 'text-destructive';
      case 'excel': return 'text-success';
      case 'word': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getCategoryBadge = (category: string) => {
    const categoryData = categories.find(c => c.name === category);
    return (
      <Badge className={`${categoryData?.color} text-white`}>
        {category}
      </Badge>
    );
  };

  const handleBulkUpload = () => {
    setUploadingFiles(true);
    // Simulate bulk file upload
    setTimeout(() => {
      setUploadingFiles(false);
    }, 3000);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Document Library</h1>
          <p className="text-muted-foreground">Manage company documents and files</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleBulkUpload}
            disabled={uploadingFiles}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploadingFiles ? 'Uploading...' : 'Bulk Upload'}
          </Button>
          <Button size="lg" className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Document
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="library">Document Library</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => (
              <Card key={document.id} className="hover:shadow-medium transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded ${getFileTypeColor(document.type)}`}>
                        {getFileTypeIcon(document.type)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base line-clamp-2">
                          {document.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {document.type} • {document.size}
                        </p>
                      </div>
                    </div>
                    {getCategoryBadge(document.category)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {document.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {document.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Uploaded: {new Date(document.uploadDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.name} className="hover:shadow-medium transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}>
                      <Folder className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>{category.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {category.count} documents
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Last updated:</span>
                      <span>2 days ago</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total size:</span>
                      <span>{(Math.random() * 50 + 10).toFixed(1)} MB</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Document Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        {' '}{activity.action}{' '}
                        <span className="font-medium">"{activity.document}"</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Storage Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47.3 GB</div>
                <p className="text-xs text-muted-foreground">of 100 GB used</p>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '47%' }} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Total Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{documents.length}</div>
                <p className="text-xs text-success">+3 this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142</div>
                <p className="text-xs text-muted-foreground">this month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}