import { NewsItem, unifyCategory } from "./newsApi";

// 使用免费的公开新闻API作为演示
const DEMO_API_CONFIG = {
  // 使用NewsAPI的免费演示端点（不需要密钥的公开新闻）
  publicNews: 'https://newsapi.org/v2/everything?q=artificial+intelligence&language=en&sortBy=publishedAt&pageSize=10&apiKey=demo',
  // 使用Guardian API（免费，无需注册）
  guardian: 'https://content.guardianapis.com/search?q=artificial%20intelligence&show-fields=thumbnail,trailText&page-size=10&api-key=test',
  // 使用HackerNews API（完全免费）
  hackerNews: 'https://hn.algolia.com/api/v1/search?query=AI%20OR%20artificial%20intelligence&tags=story&hitsPerPage=10'
};

// 智能分类函数（与newsApi.ts保持一致）
const categorizeNews = (title: string, content: string): string => {
  const text = (title + ' ' + content).toLowerCase();
  
  const categoryKeywords = {
    '大语言模型': ['gpt', 'chatgpt', 'claude', 'gemini', 'llm', 'language model', 'transformer', 'bert', 'openai', 'anthropic', 'palm', 'llama', 'bard'],
    'AI智能体': ['agent', 'assistant', 'chatbot', 'ai agent', 'virtual assistant', 'conversational ai', 'autogpt', 'langchain', 'autonomous'],
    '多模态AI': ['multimodal', 'vision', 'dall-e', 'midjourney', 'stable diffusion', 'clip', 'text-to-image', 'image generation', 'computer vision'],
    'AI训练技术': ['training', 'fine-tuning', 'reinforcement learning', 'rlhf', 'dataset', 'model training', 'neural network', 'deep learning', 'machine learning'],
    'AI应用产品': ['copilot', 'ai tool', 'productivity', 'automation', 'ai application', 'ai software', 'ai service', 'platform'],
    'AI绘画': ['dall-e', 'midjourney', 'stable diffusion', 'ai art', 'image generation', 'art generation', 'creative ai', 'digital art', 'ai painting'],
    'AI视频': ['sora', 'runway', 'video generation', 'ai video', 'video synthesis', 'deepfake', 'video ai', 'motion graphics', 'animation'],
    'AI编程': ['copilot', 'code generation', 'programming assistant', 'ai coding', 'github copilot', 'cursor', 'replit', 'ai developer tools', 'code ai', 'coding', 'programming']
  };

  let bestCategory = 'AI行业动态';
  let maxScore = 0;
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
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

// 获取HackerNews的AI相关新闻
const fetchHackerNews = async (): Promise<NewsItem[]> => {
  try {
    console.log('正在获取HackerNews AI新闻...');
    const response = await fetch(DEMO_API_CONFIG.hackerNews);
    
    if (!response.ok) {
      throw new Error(`HackerNews API请求失败: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.hits) {
      return data.hits
        .filter((item: any) => item.title && item.url)
        .map((item: any) => ({
          id: `hn-${item.objectID}`,
          title: item.title,
          summary: item.story_text || item.title,
          content: item.story_text || item.title,
          author: item.author || 'HackerNews',
          publishDate: new Date(item.created_at).toLocaleDateString('zh-CN'),
          category: categorizeNews(item.title, item.story_text || ''),
          imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
          readTime: '3分钟',
          source: 'HackerNews',
          originalUrl: item.url
        }));
    }

    return [];
  } catch (error) {
    console.error('获取HackerNews新闻时出错:', error);
    return [];
  }
};

// 获取Guardian API的AI新闻
const fetchGuardianNews = async (): Promise<NewsItem[]> => {
  try {
    console.log('正在获取Guardian AI新闻...');
    const response = await fetch(DEMO_API_CONFIG.guardian);
    
    if (!response.ok) {
      throw new Error(`Guardian API请求失败: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.response?.results) {
      return data.response.results.map((item: any) => ({
        id: `guardian-${item.id}`,
        title: item.webTitle,
        summary: item.fields?.trailText || item.webTitle,
        content: item.fields?.trailText || item.webTitle,
        author: 'The Guardian',
        publishDate: new Date(item.webPublicationDate).toLocaleDateString('zh-CN'),
        category: categorizeNews(item.webTitle, item.fields?.trailText || ''),
        imageUrl: item.fields?.thumbnail || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
        readTime: '4分钟',
        source: 'The Guardian',
        originalUrl: item.webUrl
      }));
    }

    return [];
  } catch (error) {
    console.error('获取Guardian新闻时出错:', error);
    return [];
  }
};

// 主要的免费新闻获取函数
export const fetchFreeAINews = async (): Promise<NewsItem[]> => {
  try {
    console.log('开始从免费API获取AI新闻演示数据...');
    
    // 并行请求多个免费API
    const [hackerNewsData, guardianData] = await Promise.all([
      fetchHackerNews(),
      fetchGuardianNews()
    ]);

    const allNews = [...hackerNewsData, ...guardianData];
    
    // 去重和排序
    const uniqueNews = allNews.filter((news, index, self) => 
      index === self.findIndex(n => n.title === news.title)
    );

    // 按发布时间排序
    const sortedNews = uniqueNews
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, 15); // 限制数量

    console.log(`成功获取到 ${sortedNews.length} 条免费AI新闻`);
    console.log('免费新闻来源分布:', {
      HackerNews: hackerNewsData.length,
      Guardian: guardianData.length
    });
    console.log('免费新闻分类分布:', sortedNews.reduce((acc, news) => {
      acc[news.category] = (acc[news.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>));

    return sortedNews;

  } catch (error) {
    console.error('获取免费AI新闻时出错:', error);
    return [];
  }
};
