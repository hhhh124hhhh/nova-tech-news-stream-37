
import { NewsItem } from "./newsApi";

// 额外的免费API配置
const ADDITIONAL_FREE_APIS = {
  // Reddit API - 获取AI相关subreddit内容
  reddit: 'https://www.reddit.com/r/artificial+MachineLearning+OpenAI+ChatGPT.json?limit=15',
  
  // Dev.to API - 技术博客
  devto: 'https://dev.to/api/articles?tag=ai&top=7&per_page=15',
  
  // GitHub Trending API (通过GitHub搜索API)
  github: 'https://api.github.com/search/repositories?q=artificial+intelligence+OR+machine+learning+OR+AI&sort=updated&order=desc&per_page=10',
  
  // Product Hunt API (公开数据)
  producthunt: 'https://api.producthunt.com/v2/api/graphql'
};

// 智能分类函数（与其他API保持一致）
const categorizeContent = (title: string, content: string): string => {
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

// 获取Reddit AI内容
export const fetchRedditAIContent = async (): Promise<NewsItem[]> => {
  try {
    console.log('正在获取Reddit AI内容...');
    const response = await fetch(ADDITIONAL_FREE_APIS.reddit);
    
    if (!response.ok) {
      throw new Error(`Reddit API请求失败: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.data?.children) {
      return data.data.children
        .filter((item: any) => item.data.title && item.data.url)
        .map((item: any) => ({
          id: `reddit-${item.data.id}`,
          title: item.data.title,
          summary: item.data.selftext ? item.data.selftext.substring(0, 200) + '...' : item.data.title,
          content: item.data.selftext || item.data.title,
          author: `u/${item.data.author}`,
          publishDate: new Date(item.data.created_utc * 1000).toLocaleDateString('zh-CN'),
          category: categorizeContent(item.data.title, item.data.selftext || ''),
          imageUrl: item.data.thumbnail && item.data.thumbnail.startsWith('http') 
            ? item.data.thumbnail 
            : 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
          readTime: '2分钟',
          source: 'Reddit',
          originalUrl: `https://reddit.com${item.data.permalink}`
        }));
    }

    return [];
  } catch (error) {
    console.error('获取Reddit内容时出错:', error);
    return [];
  }
};

// 获取Dev.to技术博客
export const fetchDevToContent = async (): Promise<NewsItem[]> => {
  try {
    console.log('正在获取Dev.to AI博客...');
    const response = await fetch(ADDITIONAL_FREE_APIS.devto);
    
    if (!response.ok) {
      throw new Error(`Dev.to API请求失败: ${response.status}`);
    }

    const data = await response.json();
    
    if (Array.isArray(data)) {
      return data.map((article: any) => ({
        id: `devto-${article.id}`,
        title: article.title,
        summary: article.description || article.title,
        content: article.description || article.title,
        author: article.user.name,
        publishDate: new Date(article.published_at).toLocaleDateString('zh-CN'),
        category: categorizeContent(article.title, article.description || ''),
        imageUrl: article.cover_image || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
        readTime: `${article.reading_time_minutes || 3}分钟`,
        source: 'Dev.to',
        originalUrl: article.url
      }));
    }

    return [];
  } catch (error) {
    console.error('获取Dev.to内容时出错:', error);
    return [];
  }
};

// 获取GitHub热门AI项目
export const fetchGitHubTrending = async (): Promise<NewsItem[]> => {
  try {
    console.log('正在获取GitHub热门AI项目...');
    const response = await fetch(ADDITIONAL_FREE_APIS.github);
    
    if (!response.ok) {
      throw new Error(`GitHub API请求失败: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.items) {
      return data.items
        .slice(0, 8) // 限制数量
        .map((repo: any) => ({
          id: `github-${repo.id}`,
          title: `🚀 ${repo.name} - ${repo.description?.substring(0, 50)}...`,
          summary: repo.description || repo.name,
          content: `${repo.description}\n\n⭐ Stars: ${repo.stargazers_count}\n🍴 Forks: ${repo.forks_count}\n📝 Language: ${repo.language}`,
          author: repo.owner.login,
          publishDate: new Date(repo.updated_at).toLocaleDateString('zh-CN'),
          category: categorizeContent(repo.name, repo.description || ''),
          imageUrl: 'https://images.unsplash.com/photo-1618477462146-6904e48f99fb?auto=format&fit=crop&w=800&q=80',
          readTime: '2分钟',
          source: 'GitHub',
          originalUrl: repo.html_url
        }));
    }

    return [];
  } catch (error) {
    console.error('获取GitHub内容时出错:', error);
    return [];
  }
};

// 主要的额外免费内容获取函数
export const fetchAdditionalFreeContent = async (): Promise<NewsItem[]> => {
  try {
    console.log('开始从额外免费API获取AI内容...');
    
    // 并行请求多个免费API
    const [redditData, devtoData, githubData] = await Promise.all([
      fetchRedditAIContent(),
      fetchDevToContent(),
      fetchGitHubTrending()
    ]);

    const allContent = [...redditData, ...devtoData, ...githubData];
    
    // 去重和排序
    const uniqueContent = allContent.filter((item, index, self) => 
      index === self.findIndex(n => n.title === item.title)
    );

    const sortedContent = uniqueContent
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, 20); // 限制总数量

    console.log(`成功获取到 ${sortedContent.length} 条额外免费AI内容`);
    console.log('额外内容来源分布:', {
      Reddit: redditData.length,
      DevTo: devtoData.length,
      GitHub: githubData.length
    });

    return sortedContent;

  } catch (error) {
    console.error('获取额外免费AI内容时出错:', error);
    return [];
  }
};
