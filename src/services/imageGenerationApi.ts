
// 免费图片生成API服务
const FREE_IMAGE_APIS = {
  // Picsum Photos - 随机高质量图片
  picsum: 'https://picsum.photos',
  // Lorem Picsum - 基于种子的稳定图片
  loremPicsum: 'https://picsum.photos/seed',
  // Unsplash Source - 基于关键词的图片
  unsplashSource: 'https://source.unsplash.com',
  // PlaceIMG - 分类图片
  placeimg: 'http://placeimg.com'
};

// 根据博客内容生成相关的图片URL
export const generateBlogImage = (blogId: string, title: string, category: string): string => {
  // 根据分类选择不同的图片主题
  const categoryKeywords = {
    '大语言模型': 'artificial-intelligence,technology,computer',
    'AI智能体': 'robot,automation,artificial-intelligence',
    '多模态AI': 'multimedia,technology,innovation',
    'AI训练技术': 'machine-learning,data,neural-network',
    'AI应用产品': 'software,application,technology',
    'AI绘画': 'digital-art,creativity,artificial-intelligence',
    'AI视频': 'video,technology,multimedia',
    'AI编程': 'coding,programming,software-development',
    'AI行业动态': 'business,industry,technology'
  };

  const keywords = categoryKeywords[category] || 'technology,artificial-intelligence';
  
  // 使用博客ID作为种子确保图片稳定
  const seed = Math.abs(blogId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0)) % 1000;

  // 优先使用Unsplash Source API，如果失败则回退到Picsum
  const imageUrl = `${FREE_IMAGE_APIS.unsplashSource}/800x600/?${keywords}`;
  
  return imageUrl;
};

// 生成稳定的随机图片（基于ID）
export const generateStableImage = (id: string, width: number = 800, height: number = 600): string => {
  const seed = Math.abs(id.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0)) % 1000;
  
  return `${FREE_IMAGE_APIS.loremPicsum}/${id}/${width}/${height}`;
};

// 图片加载失败时的回退选项
export const getImageFallbacks = (id: string): string[] => {
  const seed = Math.abs(id.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0)) % 1000;

  return [
    `${FREE_IMAGE_APIS.picsum}/800/600?random=${seed}`,
    `${FREE_IMAGE_APIS.loremPicsum}/${id}/800/600`,
    `${FREE_IMAGE_APIS.unsplashSource}/800x600/?technology`,
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80'
  ];
};
