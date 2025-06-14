export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  imageUrl?: string;
  readTime: string;
  source: string;
  originalUrl?: string;
}

// 多个新闻API配置 - 支持从localStorage读取用户配置的密钥
const getApiKey = (key: string) => {
  return localStorage.getItem(`${key}_key`) || import.meta.env[`VITE_${key.toUpperCase()}_API_KEY`];
};

const NEWS_APIS = {
  // NewsAPI - 国际新闻 (免费层：每月1000次请求)
  newsapi: {
    get key() { return getApiKey('newsapi'); },
    baseUrl: 'https://newsapi.org/v2',
  },
  // 聚合数据API - 中国新闻 (免费层：每天100次)
  juhe: {
    get key() { return getApiKey('juhe'); },
    baseUrl: 'http://v.juhe.cn/toutiao',
  },
  // 天行数据API - 综合新闻 (免费层：每天100次)
  tianapi: {
    get key() { return getApiKey('tianapi'); },
    baseUrl: 'http://api.tianapi.com',
  },
  // Currents API - 国际新闻替代方案 (免费层：每月600次)
  currents: {
    get key() { return getApiKey('currents'); },
    baseUrl: 'https://api.currentsapi.services/v1',
  }
};

// 分类映射 - 支持多语言分类映射到统一的中文分类
const categoryMapping = {
  // 中文分类（基准）
  '全部': '全部',
  '大语言模型': '大语言模型', 
  'AI绘画': 'AI绘画',
  'AI视频': 'AI视频',
  'AI编程': 'AI编程',
  'AI智能体': 'AI智能体',
  '多模态AI': '多模态AI',
  'AI训练技术': 'AI训练技术',
  'AI应用产品': 'AI应用产品',
  'AI行业动态': 'AI行业动态',
  
  // 英文分类映射
  'All': '全部',
  'Large Language Models': '大语言模型',
  'AI Art Generation': 'AI绘画',
  'AI Video': 'AI视频', 
  'AI Programming': 'AI编程',
  'AI Agents': 'AI智能体',
  'Multimodal AI': '多模态AI',
  'AI Training Technology': 'AI训练技术',
  'AI Applications & Products': 'AI应用产品',
  'AI Industry News': 'AI行业动态',
  
  // 日文分类映射
  'すべて': '全部',
  '大規模言語モデル': '大语言模型',
  'AI画像生成': 'AI绘画',
  'AI動画': 'AI视频',
  'AIプログラミング': 'AI编程', 
  'AIエージェント': 'AI智能体',
  'マルチモーダルAI': '多模态AI',
  'AI訓練技術': 'AI训练技术',
  'AIアプリケーション・製品': 'AI应用产品',
  'AI業界ニュース': 'AI行业动态',
  
  // 韩文分类映射
  '전체': '全部',
  '대규모 언어 모델': '大语言模型',
  'AI 그림 생성': 'AI绘画',
  'AI 비디오': 'AI视频',
  'AI 프로그래밍': 'AI编程',
  'AI 에이전트': 'AI智能体',
  '멀티모달 AI': '多模态AI',
  'AI 훈련 기술': 'AI训练技术',
  'AI 애플리케이션 및 제품': 'AI应用产品',
  'AI 업계 뉴스': 'AI行业动态'
};

// AI大模型相关关键词映射到分类 - 扩展关键词库
const categoryKeywords = {
  '大语言模型': [
    'gpt', 'chatgpt', 'claude', 'gemini', 'llm', 'language model', 'transformer', 'bert', 'openai', 'anthropic', 
    'palm', 'llama', 'bard', 'copilot', '大语言模型', '语言模型', '生成式ai', 'generative ai', 'large language',
    'gpt-4', 'gpt-3', 'davinci', 'text-davinci', 'chat completion', 'completion api', '文本生成', 'text generation'
  ],
  'AI智能体': [
    'agent', 'assistant', 'chatbot', 'ai agent', 'virtual assistant', 'conversational ai', 'autogpt', 'langchain', 
    '智能体', '助手', 'autonomous', 'multi-agent', 'agent framework', 'ai bot', 'intelligent agent', 
    'personal assistant', 'voice assistant', '语音助手', '智能助理', 'workflow automation'
  ],
  '多模态AI': [
    'multimodal', 'vision', 'dall-e', 'midjourney', 'stable diffusion', 'clip', 'text-to-image', 'image generation', 
    'computer vision', '多模态', '视觉', 'vision transformer', 'vit', 'image understanding', 'visual ai',
    'text to image', 'image to text', 'vision language', 'vlm', '视觉语言模型'
  ],
  'AI训练技术': [
    'training', 'fine-tuning', 'reinforcement learning', 'rlhf', 'dataset', 'model training', 'neural network', 
    'deep learning', '训练', '微调', '神经网络', 'machine learning', 'ml', 'gradient descent', 'backpropagation',
    'optimization', 'hyperparameter', 'overfitting', 'regularization', '深度学习', '机器学习', 'transfer learning'
  ],
  'AI应用产品': [
    'copilot', 'ai tool', 'productivity', 'automation', 'ai application', 'ai software', 'ai service', 
    'AI应用', '应用产品', 'saas', 'platform', 'api', 'integration', '生产力工具', 'workflow', 'enterprise ai',
    'business ai', 'ai platform', 'ai solution', '解决方案', 'no-code', 'low-code'
  ],
  'AI行业动态': [
    'funding', 'investment', 'startup', 'company', 'acquisition', 'partnership', 'regulation', 'policy', 'market', 
    '投资', '公司', '政策', '市场', 'ipo', 'venture capital', 'valuation', 'merger', '并购', '监管', '法规',
    'industry', 'business', 'economy', 'stock', 'revenue', 'growth', '增长', '收益', '估值'
  ],
  'AI绘画': [
    'dall-e', 'midjourney', 'stable diffusion', 'ai art', 'image generation', 'art generation', 'creative ai', 
    'digital art', 'ai painting', 'AI绘画', '图像生成', 'AI画画', 'text-to-image', 'img2img', 'inpainting',
    'style transfer', 'artistic', 'creative', '创作', '艺术', 'illustration', 'design', '设计'
  ],
  'AI视频': [
    'sora', 'runway', 'video generation', 'ai video', 'video synthesis', 'deepfake', 'video ai', 'motion graphics', 
    'AI视频', '视频生成', 'text-to-video', 'video editing', 'animation', '动画', 'motion', '运动',
    'video creation', 'film', 'movie', 'cinematography', '电影', '影视'
  ],
  'AI编程': [
    'copilot', 'code generation', 'programming assistant', 'ai coding', 'github copilot', 'cursor', 'replit', 
    'ai developer tools', 'code ai', 'AI编程', '代码生成', '编程助手', 'coding', 'programming', 'developer',
    'software', 'code completion', 'code review', '代码审查', 'debugging', '调试', 'refactoring', '重构'
  ]
};

// 智能分类函数 - 改进的分类逻辑
const categorizeNews = (title: string, content: string): string => {
  const text = (title + ' ' + content).toLowerCase();
  
  // 检查每个分类的关键词，使用权重系统
  let bestCategory = 'AI行业动态';
  let maxScore = 0;
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        // 标题中的关键词权重更高
        if (title.toLowerCase().includes(keyword.toLowerCase())) {
          score += 2;
        } else {
          score += 1;
        }
      }
    }
    
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }
  
  return bestCategory;
};

// 统一分类函数 - 将任何语言的分类映射到中文基准分类
export const unifyCategory = (category: string): string => {
  return categoryMapping[category as keyof typeof categoryMapping] || category;
};

// NewsAPI - 国际AI新闻 - 扩展搜索关键词
const fetchNewsAPIData = async (): Promise<NewsItem[]> => {
  if (!NEWS_APIS.newsapi.key) {
    console.log('NewsAPI密钥未设置');
    return [];
  }

  try {
    // 更全面的AI相关搜索关键词
    const aiKeywords = [
      'OpenAI OR ChatGPT OR "GPT-4" OR "large language model" OR LLM',
      '"AI art" OR "AI painting" OR Midjourney OR DALL-E OR "Stable Diffusion" OR "image generation"',
      '"AI video" OR Sora OR "video generation" OR "AI animation" OR Runway',
      '"AI coding" OR "AI programming" OR Copilot OR "code generation" OR "GitHub Copilot"',
      '"AI agent" OR "AI assistant" OR "autonomous AI" OR AutoGPT OR "AI automation"',
      '"artificial intelligence" OR "machine learning" OR "deep learning" OR "neural network"'
    ];

    const allNews: NewsItem[] = [];

    for (const keyword of aiKeywords.slice(0, 4)) { // 限制请求数量
      const response = await fetch(
        `${NEWS_APIS.newsapi.baseUrl}/everything?q=${encodeURIComponent(keyword)}&language=en&sortBy=publishedAt&pageSize=15&apiKey=${NEWS_APIS.newsapi.key}`
      );

      if (!response.ok) {
        console.error(`NewsAPI请求失败: ${response.status}`);
        continue;
      }

      const data = await response.json();
      
      if (data.articles) {
        const newsItems: NewsItem[] = data.articles
          .filter((article: any) => 
            article.title && 
            article.description && 
            !article.title.includes('[Removed]') &&
            !article.description.includes('[Removed]')
          )
          .map((article: any) => ({
            id: `newsapi-${article.url?.split('/').pop() || Date.now()}-${Math.random()}`,
            title: article.title,
            summary: article.description,
            content: article.content || article.description,
            author: article.author || article.source?.name || '未知作者',
            publishDate: new Date(article.publishedAt).toLocaleDateString('zh-CN'),
            category: categorizeNews(article.title, article.description),
            imageUrl: article.urlToImage || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
            readTime: '3分钟',
            source: article.source?.name || 'NewsAPI',
            originalUrl: article.url
          }));

        allNews.push(...newsItems);
      }
    }

    return allNews;
  } catch (error) {
    console.error('获取NewsAPI数据时出错:', error);
    return [];
  }
};

// 聚合数据API - 中国科技新闻
const fetchJuheNews = async (): Promise<NewsItem[]> => {
  if (!NEWS_APIS.juhe.key) {
    console.log('聚合数据API密钥未设置');
    return [];
  }

  try {
    const response = await fetch(
      `${NEWS_APIS.juhe.baseUrl}/index?type=keji&key=${NEWS_APIS.juhe.key}`
    );

    if (!response.ok) {
      console.error(`聚合数据API请求失败: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    if (data.error_code === 0 && data.result?.data) {
      return data.result.data
        .filter((article: any) => {
          const text = (article.title + ' ' + (article.content || '')).toLowerCase();
          return text.includes('ai') || text.includes('人工智能') || text.includes('智能') || 
                 text.includes('机器学习') || text.includes('深度学习') || text.includes('chatgpt') ||
                 text.includes('大模型') || text.includes('算法') || text.includes('绘画') ||
                 text.includes('视频') || text.includes('编程');
        })
        .map((article: any) => ({
          id: article.uniquekey || `juhe-${Date.now()}-${Math.random()}`,
          title: article.title,
          summary: article.content ? article.content.substring(0, 200) + '...' : article.title,
          content: article.content || article.title,
          author: article.author_name || '聚合数据',
          publishDate: article.date,
          category: categorizeNews(article.title, article.content || ''),
          imageUrl: article.thumbnail_pic_s || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
          readTime: '3分钟',
          source: '聚合数据',
          originalUrl: article.url
        }));
    }

    return [];
  } catch (error) {
    console.error('获取聚合数据新闻时出错:', error);
    return [];
  }
};

// 天行数据API - AI科技新闻
const fetchTianAPINews = async (): Promise<NewsItem[]> => {
  if (!NEWS_APIS.tianapi.key) {
    console.log('天行数据API密钥未设置');
    return [];
  }

  try {
    const response = await fetch(
      `${NEWS_APIS.tianapi.baseUrl}/generalnews/index?key=${NEWS_APIS.tianapi.key}&num=20&word=人工智能`
    );

    if (!response.ok) {
      console.error(`天行数据API请求失败: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    if (data.code === 200 && data.newslist) {
      return data.newslist.map((article: any) => ({
        id: article.id || `tianapi-${Date.now()}-${Math.random()}`,
        title: article.title,
        summary: article.description || article.title,
        content: article.content || article.description || article.title,
        author: article.source || '天行数据',
        publishDate: article.ctime,
        category: categorizeNews(article.title, article.description || ''),
        imageUrl: article.picUrl || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
        readTime: '4分钟',
        source: article.source || '天行数据',
        originalUrl: article.url
      }));
    }

    return [];
  } catch (error) {
    console.error('获取天行数据新闻时出错:', error);
    return [];
  }
};

// Currents API - 国际AI新闻
const fetchCurrentsNews = async (): Promise<NewsItem[]> => {
  if (!NEWS_APIS.currents.key) {
    console.log('Currents API密钥未设置');
    return [];
  }

  try {
    const response = await fetch(
      `${NEWS_APIS.currents.baseUrl}/search?keywords=artificial intelligence OR machine learning OR ChatGPT OR OpenAI&language=en&apiKey=${NEWS_APIS.currents.key}`
    );

    if (!response.ok) {
      console.error(`Currents API请求失败: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    if (data.news) {
      return data.news.map((article: any) => ({
        id: article.id || `currents-${Date.now()}-${Math.random()}`,
        title: article.title,
        summary: article.description,
        content: article.description,
        author: article.author || 'Currents API',
        publishDate: new Date(article.published).toLocaleDateString('zh-CN'),
        category: categorizeNews(article.title, article.description),
        imageUrl: article.image || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
        readTime: '3分钟',
        source: 'Currents API',
        originalUrl: article.url
      }));
    }

    return [];
  } catch (error) {
    console.error('获取Currents新闻时出错:', error);
    return [];
  }
};

// 检查是否有任何API密钥可用
export const hasAnyApiKey = (): boolean => {
  return !!(NEWS_APIS.newsapi.key || NEWS_APIS.juhe.key || NEWS_APIS.tianapi.key || NEWS_APIS.currents.key);
};

// 获取API状态
export const getApiStatus = () => {
  return {
    newsapi: !!NEWS_APIS.newsapi.key,
    juhe: !!NEWS_APIS.juhe.key,
    tianapi: !!NEWS_APIS.tianapi.key,
    currents: !!NEWS_APIS.currents.key
  };
};

// 主要的新闻获取函数 - 同时从多个API获取
export const fetchAINews = async (): Promise<NewsItem[]> => {
  try {
    console.log('开始从多个API获取AI大模型新闻数据...');
    
    // 并行请求多个API
    const [newsAPIData, juheData, tianAPIData, currentsData] = await Promise.all([
      fetchNewsAPIData(),
      fetchJuheNews(),
      fetchTianAPINews(),
      fetchCurrentsNews()
    ]);

    const allNews = [...newsAPIData, ...juheData, ...tianAPIData, ...currentsData];
    
    // 去重和排序
    const uniqueNews = allNews.filter((news, index, self) => 
      index === self.findIndex(n => n.title === news.title)
    );

    // 按发布时间排序
    const sortedNews = uniqueNews.sort((a, b) => 
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

    console.log(`成功获取到 ${sortedNews.length} 条AI大模型新闻`);
    console.log('新闻来源分布:', {
      NewsAPI: newsAPIData.length,
      聚合数据: juheData.length,
      天行数据: tianAPIData.length,
      CurrentsAPI: currentsData.length
    });
    console.log('分类分布:', sortedNews.reduce((acc, news) => {
      acc[news.category] = (acc[news.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>));

    return sortedNews;

  } catch (error) {
    console.error('获取AI大模型新闻时出错:', error);
    return [];
  }
};
