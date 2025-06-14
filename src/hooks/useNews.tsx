
import { useState, useEffect } from "react";
import { fetchInternationalAINews, fetchDomesticAINews, fetchCategoryNews, NewsItem } from "@/services/newsApi";

// 保留一些模拟数据作为备用
const mockNews: NewsItem[] = [
  {
    id: "mock-1",
    title: "ChatGPT推出GPT-4o：实时语音对话功能震撼发布",
    summary: "OpenAI最新发布的GPT-4o模型支持实时语音对话，能够理解语调和情感，响应速度大幅提升。",
    content: "OpenAI在今天的发布会上正式推出了GPT-4o模型，这是该公司迄今为止最先进的AI模型。GPT-4o不仅在文本处理能力上有显著提升，更重要的是首次实现了真正的实时语音对话功能。\n\n新模型能够理解用户的语调、情感和语境，并以自然流畅的方式进行回应。在演示中，GPT-4o展现了惊人的对话能力，能够实时调整语速、语调，甚至在对话中展现幽默感。",
    author: "AI前沿",
    publishDate: new Date().toLocaleDateString('zh-CN'),
    category: "AI智能体",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    readTime: "3分钟",
    source: "AI前沿"
  }
];

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  useEffect(() => {
    const fetchAllNews = async () => {
      setLoading(true);
      try {
        // 并行获取所有类型的新闻
        const [internationalNews, domesticNews, agentNews, videoNews, artNews, llmNews] = await Promise.all([
          fetchInternationalAINews(),
          fetchDomesticAINews(),
          fetchCategoryNews('AI智能体'),
          fetchCategoryNews('AI视频'),
          fetchCategoryNews('AI绘画'),
          fetchCategoryNews('大语言模型')
        ]);

        const allNews = [
          ...internationalNews,
          ...domesticNews,
          ...agentNews,
          ...videoNews,
          ...artNews,
          ...llmNews
        ];

        if (allNews.length === 0) {
          // 如果API调用失败，使用模拟数据
          console.log('Using mock data as fallback');
          setNews(mockNews);
          setApiKeyMissing(true);
        } else {
          setNews(allNews);
          setApiKeyMissing(false);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews(mockNews);
        setApiKeyMissing(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNews();

    // 每30分钟更新一次新闻
    const interval = setInterval(() => {
      console.log("正在更新最新AI新闻数据...");
      fetchAllNews();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getNewsByCategory = (category: string) => {
    if (category === "全部") {
      return news;
    }
    return news.filter(item => item.category === category);
  };

  const getNewsById = (id: string) => {
    return news.find(item => item.id === id);
  };

  return { news, loading, getNewsByCategory, getNewsById, apiKeyMissing };
};
