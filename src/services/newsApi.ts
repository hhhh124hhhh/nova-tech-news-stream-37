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
  '国际': '国际', 
  '科技': '科技',
  '财经': '财经',
  '体育': '体育',
  '娱乐': '娱乐',
  '健康': '健康',
  '教育': '教育',
  '政治': '政治',
  '社会': '社会',
  
  // 英文分类映射
  'All': '全部',
  'International': '国际',
  'Technology': '科技',
  'Business': '财经',
  'Sports': '体育',
  'Entertainment': '娱乐',
  'Health': '健康',
  'Education': '教育',
  'Politics': '政治',
  'Society': '社会',
  
  // 日文分类映射
  'すべて': '全部',
  '国際': '国际',
  'テクノロジー': '科技',
  'ビジネス': '财经',
  'スポーツ': '体育',
  'エンターテイメント': '娱乐',
  '健康': '健康',
  '教育': '教育',
  '政治': '政治',
  '社会': '社会',
  
  // 韩文分类映射
  '전체': '全部',
  '국제': '国际',
  '기술': '科技',
  '비즈니스': '财经',
  '스포츠': '体育',
  '엔터테인먼트': '娱乐',
  '건강': '健康',
  '교육': '教育',
  '정치': '政治',
  '사회': '社会'
};

// 新闻关键词映射到分类 - 更新为通用新闻关键词
const categoryKeywords = {
  '国际': [
    'international', 'global', 'world', 'foreign', 'overseas', 'diplomatic', 'embassy', 'summit', 'treaty',
    '国际', '全球', '世界', '外交', '峰会', '条约', '大使馆', '联合国', 'UN', 'NATO', 'G7', 'G20'
  ],
  '科技': [
    'technology', 'tech', 'innovation', 'digital', 'internet', 'software', 'hardware', 'startup', 'app',
    '科技', '技术', '创新', '数字', '互联网', '软件', '硬件', '应用', '创业公司', 'iPhone', 'Android'
  ],
  '财经': [
    'business', 'finance', 'economy', 'market', 'stock', 'investment', 'banking', 'trading', 'economic',
    '财经', '经济', '金融', '市场', '股票', '投资', '银行', '贸易', '货币', 'GDP', '通胀', '利率'
  ],
  '体育': [
    'sports', 'football', 'basketball', 'soccer', 'olympic', 'athlete', 'championship', 'tournament', 'game',
    '体育', '足球', '篮球', '奥运', '运动员', '比赛', '锦标赛', '世界杯', 'NBA', 'FIFA', '马拉松'
  ],
  '娱乐': [
    'entertainment', 'celebrity', 'movie', 'music', 'film', 'actor', 'actress', 'concert', 'album',
    '娱乐', '明星', '电影', '音乐', '演员', '演唱会', '专辑', '导演', '票房', 'Hollywood', '好莱坞'
  ],
  '健康': [
    'health', 'medical', 'medicine', 'doctor', 'hospital', 'disease', 'treatment', 'vaccine', 'wellness',
    '健康', '医疗', '医学', '医生', '医院', '疾病', '治疗', '疫苗', '养生', '药物', '临床', '手术'
  ],
  '教育': [
    'education', 'school', 'university', 'student', 'teacher', 'learning', 'academic', 'scholarship', 'degree',
    '教育', '学校', '大学', '学生', '教师', '学习', '学术', '奖学金', '学位', '考试', '招生'
  ],
  '政治': [
    'politics', 'government', 'election', 'president', 'minister', 'parliament', 'congress', 'policy', 'law',
    '政治', '政府', '选举', '总统', '部长', '议会', '国会', '政策', '法律', '立法', '投票'
  ],
  '社会': [
    'society', 'social', 'community', 'culture', 'lifestyle', 'environment', 'climate', 'population', 'crime',
    '社会', '社区', '文化', '生活', '环境', '气候', '人口', '犯罪', '慈善', '公益', '民生'
  ]
};

// 智能分类函数 - 更新为通用新闻分类逻辑
const categorizeNews = (title: string, content: string): string => {
  const text = (title + ' ' + content).toLowerCase();
  
  // 检查每个分类的关键词，使用权重系统
  let bestCategory = '社会';
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
