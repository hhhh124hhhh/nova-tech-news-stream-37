
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
}

// 多个新闻API配置
const NEWS_APIS = {
  // NewsAPI - 国际新闻 (免费层：每月1000次请求)
  newsapi: {
    key: import.meta.env.VITE_NEWS_API_KEY,
    baseUrl: 'https://newsapi.org/v2',
  },
  // 聚合数据API - 中国新闻 (免费层：每天100次)
  juhe: {
    key: import.meta.env.VITE_JUHE_API_KEY,
    baseUrl: 'http://v.juhe.cn/toutiao',
  },
  // 天行数据API - 综合新闻 (免费层：每天100次)
  tianapi: {
    key: import.meta.env.VITE_TIANAPI_KEY,
    baseUrl: 'http://api.tianapi.com',
  },
  // Currents API - 国际新闻替代方案 (免费层：每月600次)
  currents: {
    key: import.meta.env.VITE_CURRENTS_API_KEY,
    baseUrl: 'https://api.currentsapi.services/v1',
  }
};

// AI大模型相关关键词映射到分类
const categoryKeywords = {
  '大语言模型': ['gpt', 'chatgpt', 'claude', 'gemini', 'llm', 'language model', 'transformer', 'bert', 'openai', 'anthropic', 'palm', 'llama', '大语言模型', '语言模型'],
  'AI智能体': ['agent', 'assistant', 'chatbot', 'ai agent', 'virtual assistant', 'conversational ai', 'autogpt', 'langchain', '智能体', '助手'],
  '多模态AI': ['multimodal', 'vision', 'dall-e', 'midjourney', 'stable diffusion', 'clip', 'text-to-image', 'image generation', 'computer vision', '多模态', '视觉'],
  'AI训练技术': ['training', 'fine-tuning', 'reinforcement learning', 'rlhf', 'dataset', 'model training', 'neural network', 'deep learning', '训练', '微调', '神经网络'],
  'AI应用产品': ['copilot', 'ai tool', 'productivity', 'automation', 'ai application', 'ai software', 'ai service', 'AI应用', '应用产品'],
  'AI行业动态': ['funding', 'investment', 'startup', 'company', 'acquisition', 'partnership', 'regulation', 'policy', 'market', '投资', '公司', '政策', '市场'],
  'AI绘画': ['dall-e', 'midjourney', 'stable diffusion', 'ai art', 'image generation', 'art generation', 'creative ai', 'digital art', 'ai painting', 'AI绘画', '图像生成', 'AI画画'],
  'AI视频': ['sora', 'runway', 'video generation', 'ai video', 'video synthesis', 'deepfake', 'video ai', 'motion graphics', 'AI视频', '视频生成', 'Sora'],
  'AI编程': ['copilot', 'code generation', 'programming assistant', 'ai coding', 'github copilot', 'cursor', 'replit', 'ai developer tools', 'code ai', 'AI编程', '代码生成', '编程助手']
};

// 智能分类函数
const categorizeNews = (title: string, content: string): string => {
  const text = (title + ' ' + content).toLowerCase();
  
  // 检查每个分类的关键词
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
      return category;
    }
  }
  
  // 默认分类
  if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('machine learning') || 
      text.includes('人工智能') || text.includes('机器学习') || text.includes('智能')) {
    return 'AI行业动态';
  }
  
  return 'AI行业动态';
};

// NewsAPI - 国际AI新闻
const fetchNewsAPIData = async (): Promise<NewsItem[]> => {
  if (!NEWS_APIS.newsapi.key) {
    console.log('NewsAPI密钥未设置');
    return [];
  }

  try {
    // AI相关搜索关键词，包含中英文
    const aiKeywords = [
      'ChatGPT OR OpenAI OR GPT-4 OR Claude OR Anthropic',
      'Gemini OR Bard OR "Google AI" OR "AI agent"',
      'DALL-E OR Midjourney OR "AI art" OR Sora',
      'LLM OR "large language model" OR "multimodal AI"',
      '"artificial intelligence" OR "machine learning"'
    ];

    const allNews: NewsItem[] = [];

    for (const keyword of aiKeywords.slice(0, 2)) { // 限制请求数量避免超额
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
            id: article.url || `news-${Date.now()}-${Math.random()}`,
            title: article.title,
            summary: article.description,
            content: article.content || article.description,
            author: article.author || article.source?.name || '未知作者',
            publishDate: new Date(article.publishedAt).toLocaleDateString('zh-CN'),
            category: categorizeNews(article.title, article.description),
            imageUrl: article.urlToImage || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
            readTime: '3分钟',
            source: article.source?.name || 'NewsAPI'
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
    // 科技类新闻，包含AI相关内容
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
                 text.includes('大模型') || text.includes('算法');
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
          source: '聚合数据'
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
        source: article.source || '天行数据'
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
        source: 'Currents API'
      }));
    }

    return [];
  } catch (error) {
    console.error('获取Currents新闻时出错:', error);
    return [];
  }
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

    return sortedNews;

  } catch (error) {
    console.error('获取AI大模型新闻时出错:', error);
    return [];
  }
};
