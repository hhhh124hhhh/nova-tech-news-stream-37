import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit, Plus, Calendar, User, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  author: string;
  publishDate: string;
  category: string;
  tags: string[];
  readTime: string;
}

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    author: "",
    category: "技术分享",
    tags: ""
  });
  const { toast } = useToast();

  // Blog categories
  const blogCategories = ["全部", "技术分享", "AI资讯", "产品更新", "行业观察", "教程指南"];

  // Load posts from localStorage on component mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
  }, [posts]);

  const handleCreatePost = () => {
    if (!formData.title || !formData.content || !formData.author) {
      toast({
        title: "错误",
        description: "请填写所有必填字段",
        variant: "destructive",
      });
      return;
    }

    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      summary: formData.summary || formData.content.substring(0, 100) + "...",
      author: formData.author,
      publishDate: new Date().toLocaleDateString('zh-CN'),
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      readTime: Math.ceil(formData.content.length / 500) + "分钟"
    };

    setPosts([newPost, ...posts]);
    setIsCreateModalOpen(false);
    resetForm();
    
    toast({
      title: "成功",
      description: "博客文章已创建",
    });
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      summary: post.summary,
      author: post.author,
      category: post.category,
      tags: post.tags.join(', ')
    });
  };

  const handleUpdatePost = () => {
    if (!editingPost) return;

    const updatedPost: BlogPost = {
      ...editingPost,
      title: formData.title,
      content: formData.content,
      summary: formData.summary || formData.content.substring(0, 100) + "...",
      author: formData.author,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      readTime: Math.ceil(formData.content.length / 500) + "分钟"
    };

    setPosts(posts.map(post => post.id === editingPost.id ? updatedPost : post));
    setEditingPost(null);
    resetForm();
    
    toast({
      title: "成功",
      description: "博客文章已更新",
    });
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter(post => post.id !== id));
    toast({
      title: "成功",
      description: "博客文章已删除",
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      summary: "",
      author: "",
      category: "技术分享",
      tags: ""
    });
  };

  const filteredPosts = selectedCategory === "全部" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header 
        onCategoryChange={setSelectedCategory}
        selectedCategory={selectedCategory}
        onLanguageChange={() => {}}
        selectedLanguage="zh"
        onApiKeyChange={() => {}}
        categories={blogCategories}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">博客管理</h1>
            <p className="text-slate-400">创建和管理您的博客文章</p>
          </div>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                创建文章
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">创建新文章</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-slate-300">标题 *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="输入文章标题"
                  />
                </div>
                
                <div>
                  <Label htmlFor="author" className="text-slate-300">作者 *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="输入作者姓名"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category" className="text-slate-300">分类</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {blogCategories.slice(1).map((category) => (
                        <SelectItem key={category} value={category} className="text-white">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tags" className="text-slate-300">标签</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="输入标签，用逗号分隔"
                  />
                </div>
                
                <div>
                  <Label htmlFor="summary" className="text-slate-300">摘要</Label>
                  <Textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => setFormData({...formData, summary: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="输入文章摘要（可选，将自动生成）"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="content" className="text-slate-300">内容 *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="输入文章内容"
                    rows={10}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleCreatePost} className="bg-blue-600 hover:bg-blue-700">
                    创建文章
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 编辑文章对话框 */}
        <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">编辑文章</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title" className="text-slate-300">标题 *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="输入文章标题"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-author" className="text-slate-300">作者 *</Label>
                <Input
                  id="edit-author"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="输入作者姓名"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-category" className="text-slate-300">分类</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {blogCategories.slice(1).map((category) => (
                      <SelectItem key={category} value={category} className="text-white">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-tags" className="text-slate-300">标签</Label>
                <Input
                  id="edit-tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="输入标签，用逗号分隔"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-summary" className="text-slate-300">摘要</Label>
                <Textarea
                  id="edit-summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({...formData, summary: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="输入文章摘要（可选，将自动生成）"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-content" className="text-slate-300">内容 *</Label>
                <Textarea
                  id="edit-content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="输入文章内容"
                  rows={10}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingPost(null)}>
                  取消
                </Button>
                <Button onClick={handleUpdatePost} className="bg-blue-600 hover:bg-blue-700">
                  更新文章
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 文章列表 */}
        <div className="grid gap-6">
          {filteredPosts.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-slate-400 text-lg mb-4">
                  {selectedCategory === "全部" ? "还没有任何文章" : `在"${selectedCategory}"分类下没有文章`}
                </p>
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  创建第一篇文章
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map((post) => (
              <Card key={post.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-white text-xl mb-2">{post.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-slate-400 text-sm mb-3">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{post.publishDate}</span>
                        </div>
                        <span>{post.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                          {post.category}
                        </Badge>
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="border-slate-600 text-slate-400">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPost(post)}
                        className="border-slate-600 hover:bg-slate-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 leading-relaxed">
                    {post.summary}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Blog;
