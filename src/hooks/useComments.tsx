
import { useState } from 'react';

export interface Comment {
  id: string;
  newsId: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
}

export const useComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  const addComment = (newsId: string, author: string, content: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random()}`,
      newsId,
      author: author || '匿名用户',
      content,
      timestamp: new Date(),
      likes: 0
    };
    
    setComments(prev => [newComment, ...prev]);
    return newComment;
  };

  const getCommentsByNewsId = (newsId: string) => {
    return comments.filter(comment => comment.newsId === newsId);
  };

  const likeComment = (commentId: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  return {
    comments,
    addComment,
    getCommentsByNewsId,
    likeComment,
    deleteComment
  };
};
