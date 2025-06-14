
import { useState, useEffect } from "react";
import { fetchAINews, NewsItem } from "@/services/newsApi";
import { translateNewsItem } from "@/services/translationApi";

// 更新为AI大模型相关的模拟数据
const mockNews: NewsItem[] = [
  {
    id: "mock-1",
    title: "OpenAI发布GPT-4.5：突破性的多模态推理能力",
    summary: "OpenAI最新发布的GPT-4.5模型在多模态理解和推理方面实现重大突破，支持图像、音频、视频的综合分析。",
    content: "OpenAI在最新的技术发布会上展示了GPT-4.5模型的强大能力。新模型不仅在文本生成方面保持领先，更在多模态推理上实现了质的飞跃。GPT-4.5能够同时处理文本、图像、音频和视频输入，并进行深度的跨模态推理分析。在复杂场景理解、科学问题解答和创意内容生成方面都展现出了前所未有的能力。",
    author: "OpenAI团队",
    publishDate: new Date().toLocaleDateString('zh-CN'),
    category: "大语言模型",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    readTime: "4分钟",
    source: "OpenAI"
  },
  {
    id: "mock-2", 
    title: "Claude 3.5升级：Anthropic推出Constitutional AI 2.0",
    summary: "Anthropic发布Claude 3.5的重大更新，引入Constitutional AI 2.0技术，大幅提升模型的安全性和可控性。",
    content: "Anthropic公司发布了Claude 3.5的重要升级版本，核心亮点是全新的Constitutional AI 2.0技术。这项技术通过更精细的价值对齐训练，使Claude 3.5在保持强大能力的同时，展现出更高的安全性和可控性。新版本在处理敏感话题、避免有害输出和遵循用户意图方面都有显著改进。",
    author: "Anthropic团队",
    publishDate: new Date(Date.now() - 86400000).toLocaleDateString('zh-CN'),
    category: "大语言模型",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    readTime: "3分钟",
    source: "Anthropic"
  },
  {
    id: "mock-3",
    title: "Google Gemini Ultra发布：多模态AI的新标杆",
    summary: "Google发布Gemini Ultra模型，在多模态AI能力评测中全面超越GPT-4，标志着AI大模型进入新时代。",
    content: "Google发布了备受期待的Gemini Ultra模型，这是该公司迄今为止最强大的多模态AI系统。Gemini Ultra在32项学术基准测试中有30项超越了GPT-4，特别是在数学推理、代码生成和多模态理解方面表现卓越。该模型原生支持文本、图像、音频和视频的处理，为多模态AI应用开辟了新的可能性。",
    author: "Google DeepMind",
    publishDate: new Date(Date.now() - 172800000).toLocaleDateString('zh-CN'),
    category: "多模态AI",
    imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=800&q=80",
    readTime: "5分钟",
    source: "Google"
  },
  {
    id: "mock-4",
    title: "AutoGPT 2.0：下一代AI智能体架构发布",
    summary: "AutoGPT团队发布2.0版本，引入全新的智能体架构，支持长期记忆和复杂任务规划。",
    content: "AutoGPT 2.0正式发布，这是AI智能体领域的一个重要里程碑。新版本采用了革命性的架构设计，包括持久化记忆系统、高级任务规划器和自适应学习机制。AutoGPT 2.0能够处理跨越数天甚至数周的复杂项目，自主学习新技能，并与多种工具和服务集成，真正实现了智能体的自主性和实用性。",
    author: "AutoGPT团队",
    publishDate: new Date(Date.now() - 259200000).toLocaleDateString('zh-CN'),
    category: "AI智能体",
    imageUrl: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=800&q=80",
    readTime: "4分钟",
    source: "AutoGPT"
  },
  {
    id: "mock-5",
    title: "百度文心大模型4.0：中文理解新突破",
    summary: "百度发布文心大模型4.0，在中文语言理解和生成方面实现重大突破，性能全面超越国外同类产品。",
    content: "百度正式发布文心大模型4.0，这是专门针对中文优化的大语言模型。新版本在中文语言理解、古诗词创作、文学分析和中国文化相关问题解答方面表现卓越。文心4.0还特别加强了对中国法律、历史、文化的理解，能够处理复杂的中文语境和文化背景，为中文AI应用提供了强有力的技术支撑。",
    author: "百度AI",
    publishDate: new Date(Date.now() - 345600000).toLocaleDateString('zh-CN'),
    category: "大语言模型",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    readTime: "3分钟",
    source: "百度"
  },
  {
    id: "mock-6",
    title: "Transformer架构重大突破：新型注意力机制发布",
    summary: "斯坦福大学研究团队发布新型注意力机制，将Transformer模型的效率提升10倍，引发AI训练技术革命。",
    content: "斯坦福大学的研究团队在Nature上发表了关于新型注意力机制的论文，这项技术被称为'线性注意力'。新机制将传统Transformer的计算复杂度从O(n²)降低到O(n)，在保持模型性能的同时大幅提升训练和推理效率。这一突破有望让更大规模的模型训练成为可能，同时降低AI应用的计算成本。",
    author: "斯坦福大学",
    publishDate: new Date(Date.now() - 432000000).toLocaleDateString('zh-CN'),
    category: "AI训练技术",
    imageUrl: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80",
    readTime: "6分钟",
    source: "Nature"
  }
];

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [translatedNews, setTranslatedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('zh');

  useEffect(() => {
    const fetchAllNews = async () => {
      setLoading(true);
      try {
        console.log('开始获取AI大模型新闻数据...');
        
        const allNews = await fetchAINews();

        console.log(`获取到 ${allNews.length} 条AI大模型新闻`);

        if (allNews.length === 0) {
          console.log('API调用失败，使用AI大模型模拟数据');
          setNews(mockNews);
          setApiKeyMissing(true);
        } else {
          const sortedNews = allNews.sort((a, b) => 
            new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
          );
          setNews(sortedNews);
          setApiKeyMissing(false);
        }
      } catch (error) {
        console.error('获取AI大模型新闻时出错:', error);
        setNews(mockNews);
        setApiKeyMissing(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNews();

    const interval = setInterval(() => {
      console.log("正在更新最新AI大模型新闻数据...");
      fetchAllNews();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // 语言切换效果
  useEffect(() => {
    const translateNews = async () => {
      if (currentLanguage === 'zh') {
        setTranslatedNews(news);
        return;
      }

      setLoading(true);
      try {
        const translated = await Promise.all(
          news.map(item => translateNewsItem(item, currentLanguage))
        );
        setTranslatedNews(translated);
      } catch (error) {
        console.error('翻译新闻时出错:', error);
        setTranslatedNews(news);
      } finally {
        setLoading(false);
      }
    };

    translateNews();
  }, [news, currentLanguage]);

  const getNewsByCategory = (category: string) => {
    const newsToFilter = translatedNews.length > 0 ? translatedNews : news;
    if (category === "全部" || category === "All" || category === "すべて" || category === "전체") {
      return newsToFilter;
    }
    return newsToFilter.filter(item => item.category === category);
  };

  const getNewsById = (id: string) => {
    const newsToSearch = translatedNews.length > 0 ? translatedNews : news;
    return newsToSearch.find(item => item.id === id);
  };

  const changeLanguage = (language: string) => {
    setCurrentLanguage(language);
  };

  return { 
    news: translatedNews.length > 0 ? translatedNews : news, 
    loading, 
    getNewsByCategory, 
    getNewsById, 
    apiKeyMissing,
    changeLanguage,
    currentLanguage
  };
};

