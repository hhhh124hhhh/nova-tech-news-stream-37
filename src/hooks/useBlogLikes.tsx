
import { useState } from 'react';

interface BlogLike {
  blogId: string;
  likes: number;
  userLiked: boolean;
}

export const useBlogLikes = () => {
  const [blogLikes, setBlogLikes] = useState<BlogLike[]>([]);

  const getBlogLikes = (blogId: string) => {
    const like = blogLikes.find(l => l.blogId === blogId);
    return like || { blogId, likes: Math.floor(Math.random() * 50) + 10, userLiked: false };
  };

  const toggleLike = (blogId: string) => {
    setBlogLikes(prev => {
      const existingIndex = prev.findIndex(l => l.blogId === blogId);
      
      if (existingIndex >= 0) {
        return prev.map((like, index) => 
          index === existingIndex 
            ? { 
                ...like, 
                likes: like.userLiked ? like.likes - 1 : like.likes + 1,
                userLiked: !like.userLiked 
              }
            : like
        );
      } else {
        const initialLikes = Math.floor(Math.random() * 50) + 10;
        return [...prev, { 
          blogId, 
          likes: initialLikes + 1, 
          userLiked: true 
        }];
      }
    });
  };

  return {
    getBlogLikes,
    toggleLike
  };
};
