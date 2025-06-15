
import { NewsItem, unifyCategory } from "./newsApi";
import { fetchAdditionalFreeContent } from "./additionalFreeApi";

// 使用免费的公开新闻API作为演示
const DEMO_API_CONFIG = {
  // 使用NewsAPI的免费演示端点（不需要密钥的公开新闻）
  publicNews: 'https://newsapi.org/v2/everything?q=technology&language=en&sortBy=publishedAt&pageSize=10&apiKey=demo',
  // 使用Guardian API（免费，无需注册）
  guardian: 'https://content.guardianapis.com/search?q=technology&show-fields=thumbnail,trailText&page-size=10&api-key=test',
  // 使用HackerNews API（完全免费）
  hackerNews: 'https://hn.algolia.com/api/v1/search?query=technology%20OR%20business%20OR%20science&tags=story&hitsPerPage=10'
};

// 智能分类函数
const categorizeNews = (title: string, content: string): string => {
  const text = (title + ' ' + content).toLowerCase();
  
  const categoryKeywords = {
    '国际': ['international', 'global', 'world', 'foreign', 'overseas', 'diplomatic', 'embassy', 'summit', 'treaty', '国际', '全球', '世界', '外交', '峰会', '条约', '大使馆', '联合国'],
    '科技': ['technology', 'tech', 'innovation', 'digital', 'internet', 'software', 'hardware', 'startup', 'app', '科技', '技术', '创新', '数字', '互联网', '软件', '硬件', '应用', '创业公司'],
    '财经': ['business', 'finance', 'economy', 'market', 'stock', 'investment', 'banking', 'trading', 'economic', '财经', '经济', '金融', '市场', '股票', '投资', '银行', '贸易', '货币'],
    '体育': ['sports', 'football', 'basketball', 'soccer', 'olympic', 'athlete', 'championship', 'tournament', 'game', '体育', '足球', '篮球', '奥运', '运动员', '比赛', '锦标赛', '世界杯'],
    '娱乐': ['entertainment', 'celebrity', 'movie', 'music', 'film', 'actor', 'actress', 'concert', 'album', '娱乐', '明星', '电影', '音乐', '演员', '演唱会', '专辑', '导演', '票房'],
    '健康': ['health', 'medical', 'medicine', 'doctor', 'hospital', 'disease', 'treatment', 'vaccine', 'wellness', '健康', '医疗', '医学', '医生', '医院', '疾病', '治疗', '疫苗', '养生'],
    '教育': ['education', 'school', 'university', 'student', 'teacher', 'learning', 'academic', 'scholarship', 'degree', '教育', '学校', '大学', '学生', '教师', '学习', '学术', '奖学金'],
    '政治': ['politics', 'government', 'election', 'president', 'minister', 'parliament', 'congress', 'policy', 'law', '政治', '政府', '选举', '总统', '部长', '议会', '国会', '政策'],
    '社会': ['society', 'social', 'community', 'culture', 'lifestyle', 'environment', 'climate', 'population', 'crime', '社会', '社区', '文化', '生活', '环境', '气候', '人口', '犯罪']
  };

  let bestCategory = '社会';
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

// 获取HackerNews的新闻
const fetchHackerNews = async (): Promise<NewsItem[]> => {
  try {
    console.log('正在获取HackerNews新闻...');
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
          imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
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

// 获取Guardian API的新闻
const fetchGuardianNews = async (): Promise<NewsItem[]> => {
  try {
    console.log('正在获取Guardian新闻...');
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
        imageUrl: item.fields?.thumbnail || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
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
    console.log('开始从所有免费API获取新闻演示数据...');
    
    // 并行请求多个免费API
    const [hackerNewsData, guardianData, additionalContent] = await Promise.all([
      fetchHackerNews(),
      fetchGuardianNews(),
      fetchAdditionalFreeContent()
    ]);

    const allNews = [...hackerNewsData, ...guardianData, ...additionalContent];
    
    // 去重和排序
    const uniqueNews = allNews.filter((news, index, self) => 
      index === self.findIndex(n => n.title === news.title)
    );

    // 按发布时间排序
    const sortedNews = uniqueNews
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, 30);

    console.log(`成功获取到 ${sortedNews.length} 条免费新闻`);
    console.log('免费新闻来源分布:', {
      HackerNews: hackerNewsData.length,
      Guardian: guardianData.length,
      Reddit: additionalContent.filter(item => item.source === 'Reddit').length,
      DevTo: additionalContent.filter(item => item.source === 'Dev.to').length,
      GitHub: additionalContent.filter(item => item.source === 'GitHub').length
    });
    console.log('免费新闻分类分布:', sortedNews.reduce((acc, news) => {
      acc[news.category] = (acc[news.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>));

    return sortedNews;

  } catch (error) {
    console.error('获取免费新闻时出错:', error);
    return [];
  }
};
