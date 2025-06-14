
import { useState, useEffect } from "react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  author: string;
  publishDate: string;
  category: string;
  imageUrl?: string;
  readTime: string;
}

const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "OpenAI发布GPT-5：多模态AI的新突破",
    summary: "OpenAI最新发布的GPT-5模型在多模态理解和推理能力上取得了显著突破，能够同时处理文本、图像、音频和视频内容，为AI应用开辟了全新的可能性。",
    author: "李明",
    publishDate: "2024-01-15",
    category: "自然语言处理",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    readTime: "5分钟"
  },
  {
    id: "2",
    title: "谷歌DeepMind在蛋白质折叠预测领域再创新高",
    summary: "DeepMind团队最新研究成果显示，AlphaFold3在蛋白质结构预测准确性上又有新的提升，这一突破将加速药物发现和生物医学研究的进展。",
    author: "王芳",
    publishDate: "2024-01-14",
    category: "机器学习",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80",
    readTime: "7分钟"
  },
  {
    id: "3",
    title: "特斯拉机器人Optimus最新进展：人形机器人的工业化应用",
    summary: "特斯拉展示了Optimus机器人的最新功能，包括更精准的物体操控和复杂任务执行能力，标志着人形机器人向工业化应用又迈进了一步。",
    author: "张伟",
    publishDate: "2024-01-13",
    category: "机器人技术",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    readTime: "6分钟"
  },
  {
    id: "4",
    title: "Meta发布全新AR眼镜：增强现实技术的重大突破",
    summary: "Meta推出的新一代AR眼镜在视觉效果、续航能力和用户交互方面都有显著改进，为增强现实技术的普及奠定了基础。",
    author: "陈丽",
    publishDate: "2024-01-12",
    category: "计算机视觉",
    imageUrl: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?auto=format&fit=crop&w=800&q=80",
    readTime: "4分钟"
  },
  {
    id: "5",
    title: "百度Apollo自动驾驶技术在北京开启商业化运营",
    summary: "百度Apollo无人驾驶出租车服务在北京正式启动商业化运营，这标志着自动驾驶技术从测试阶段向实际应用的重要转变。",
    author: "刘强",
    publishDate: "2024-01-11",
    category: "深度学习",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    readTime: "8分钟"
  },
  {
    id: "6",
    title: "微软Azure AI推出新的企业级AI解决方案",
    summary: "微软Azure AI平台发布了一系列企业级AI工具和服务，帮助企业更轻松地集成和部署人工智能应用，推动AI技术在商业领域的广泛应用。",
    author: "赵敏",
    publishDate: "2024-01-10",
    category: "机器学习",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    readTime: "6分钟"
  }
];

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = () => {
      setLoading(true);
      setTimeout(() => {
        setNews(mockNews);
        setLoading(false);
      }, 1000);
    };

    fetchNews();

    // 模拟实时更新
    const interval = setInterval(() => {
      console.log("正在更新新闻数据...");
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return { news, loading };
};
