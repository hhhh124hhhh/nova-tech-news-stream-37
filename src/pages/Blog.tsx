
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Calendar, User, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";

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
  isExternal?: boolean;
  externalUrl?: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    category: 'AI行业动态',
    tags: ''
  });

  // 从localStorage加载博客文章
  useEffect(() => {
    const savedPosts = localStorage.getItem('blog_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // 初始化一些示例博客文章
      const samplePosts: BlogPost[] = [
        {
          id: '1',
          title: 'AI大模型发展趋势分析',
          content: '随着ChatGPT、Claude等大语言模型的快速发展，AI技术正在深刻改变我们的工作和生活方式...',
          summary: '深入分析当前AI大模型的发展趋势和未来展望',
          author: '博主',
          publishDate: new Date().toLocaleDateString('zh-CN'),
          category: '大语言模型',
          tags: ['GPT', 'Claude', '大模型', '趋势分析'],
          readTime: '5分钟'
        },
        {
          id: '2',
          title: 'AI绘画工具使用指南',
          content: 'Midjourney、DALL-E、Stable Diffusion等AI绘画工具的详细使用教程...',
          summary: '全面介绍主流AI绘画工具的使用方法和技巧',
          author: '博主',
          publishDate: new Date(Date.now() - 86400000).toLocaleDateString('zh-CN'),
          category: 'AI绘画',
          tags: ['Midjourney', 'DALL-E', '绘画技巧'],
          readTime: '8分钟'
        }
      ];
      setPosts(samplePosts);
      localStorage.setItem('blog_posts', JSON.stringify(samplePosts));
    }
  }, []);

  // 保存文章到localStorage
  const savePosts = (newPosts: BlogPost[]) => {
    setPosts(newPosts);
    localStorage.setItem('blog_posts', JSON.stringify(newPosts));
  };

  // 创建新文章
  const handleCreatePost = () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "错误",
        description: "请填写标题和内容",
        variant: "destructive"
      });
      return;
    }

    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      summary: formData.summary || formData.content.substring(0, 100) + '...',
      author: '博主',
      publishDate: new Date().toLocaleDateString('zh-CN'),
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      readTime: `${Math.ceil(formData.content.length / 200)}分钟`
    };

    savePosts([newPost, ...posts]);
    setFormData({ title: '', content: '', summary: '', category: 'AI行业动态', tags: '' });
    setIsCreateModalOpen(false);
    
    toast({
      title: "成功",
      description: "博客文章创建成功！"
    });
  };

  // 编辑文章
  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      summary: post.summary,
      category: post.category,
      tags: post.tags.join(', ')
    });
    setIsCreateModalOpen(true);
  };

  // 更新文章
  const handleUpdatePost = () => {
    if (!editingPost || !formData.title || !formData.content) return;

    const updatedPost: BlogPost = {
      ...editingPost,
      title: formData.title,
      content: formData.content,
      summary: formData.summary || formData.content.substring(0, 100) + '...',
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      readTime: `${Math.ceil(formData.content.length / 200)}分钟`
    };

    const updatedPosts = posts.map(post => 
      post.id === editingPost.id ? updatedPost : post
    );
    
    savePosts(updatedPosts);
    setFormData({ title: '', content: '', summary: '', category: 'AI行业动态', tags: '' });
    setEditingPost(null);
    setIsCreateModalOpen(false);
    
    toast({
      title: "成功",
      description: "博客文章更新成功！"
    });
  };

  // 删除文章
  const handleDeletePost = (id: string) => {
    const updatedPosts = posts.filter(post => post.id !== id);
    savePosts(updatedPosts);
    
    toast({
      title: "成功",
      description: "博客文章删除成功！"
    });
  };

  // 筛选文章
  const filteredPosts = selectedCategory === "全部" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const categories = ["全部", "大语言模型", "AI绘画", "AI视频", "AI编程", "AI智能体", "多模态AI", "AI训练技术", "AI应用产品", "AI行业动态"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header 
        onCategoryChange={setSelectedCategory}
        selectedCategory={selectedCategory}
        onLanguageChange={() => {}}
        selectedLanguage="zh"
        onApiKeyChange={() => {}}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">AI技术博客</h1>
            <p className="text-slate-300">分享AI技术见解与实践经验</p>
          </div>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setEditingPost(null);
                  setFormData({ title: '', content: '', summary: '', category: 'AI行业动态', tags: '' });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                写博客
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPost ? '编辑文章' : '创建新文章'}</DialogTitle>
                <DialogDescription>
                  分享你的AI技术见解和经验
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <Input
                  placeholder="文章标题"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                
                <Input
                  placeholder="文章摘要（可选）"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                />
                
                <select
                  className="w-full p-2 border rounded-md"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.slice(1).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
                <Input
                  placeholder="标签（用逗号分隔）"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
                
                <Textarea
                  placeholder="文章内容..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="min-h-[200px]"
                />
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    取消
                  </Button>
                  <Button 
                    onClick={editingPost ? handleUpdatePost : handleCreatePost}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {editingPost ? '更新' : '发布'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 分类导航 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* 博客文章列表 */}
        <div className="grid gap-6">
          {filteredPosts.map(post => (
            <Card key={post.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-white mb-2 flex items-center gap-2">
                      {post.title}
                      {post.isExternal && (
                        <ExternalLink className="h-4 w-4 text-blue-400" />
                      )}
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      {post.summary}
                    </CardDescription>
                  </div>
                  
                  {!post.isExternal && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditPost(post)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                    {post.category}
                  </Badge>
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-slate-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.publishDate}
                  </span>
                  <span>{post.readTime}</span>
                </div>
                
                <p className="text-slate-300 mb-4">
                  {post.content.length > 200 
                    ? post.content.substring(0, 200) + '...' 
                    : post.content
                  }
                </p>
                
                {post.isExternal && post.externalUrl ? (
                  <Button asChild variant="outline" size="sm">
                    <a href={post.externalUrl} target="_blank" rel="noopener noreferrer">
                      查看原文
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm">
                    阅读全文
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg mb-4">该分类下暂无博客文章</p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              写第一篇文章
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Blog;
