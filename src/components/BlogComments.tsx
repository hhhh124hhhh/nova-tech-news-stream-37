
import { useState } from 'react';
import { MessageCircle, Heart, Trash2, Send, User } from 'lucide-react';
import { useComments } from '@/hooks/useComments';

interface BlogCommentsProps {
  blogId: string;
  title: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const BlogComments = ({ blogId, title, isOpen = true, onClose }: BlogCommentsProps) => {
  const { getCommentsByNewsId, addComment, likeComment, deleteComment } = useComments();
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');
  
  const comments = getCommentsByNewsId(blogId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(blogId, author, newComment);
      setNewComment('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl border border-slate-600/50 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-600">
        <div className="flex items-center space-x-3">
          <MessageCircle className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">
            评论 ({comments.length})
          </h3>
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-blue-400" />
                <span className="font-medium text-blue-400">{comment.author}</span>
              </div>
              <span className="text-xs text-slate-400">{formatTime(comment.timestamp)}</span>
            </div>
            <p className="text-slate-200 mb-3">{comment.content}</p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => likeComment(comment.id)}
                className="flex items-center space-x-1 text-slate-400 hover:text-red-400 transition-colors"
              >
                <Heart className="h-4 w-4" />
                <span className="text-sm">{comment.likes}</span>
              </button>
              <button
                onClick={() => deleteComment(comment.id)}
                className="text-slate-400 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        
        {comments.length === 0 && (
          <div className="text-center text-slate-400 py-6">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>还没有评论，来发表第一条评论吧！</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-600 space-y-3">
        <input
          type="text"
          placeholder="你的昵称（可选）"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none text-sm"
        />
        <div className="flex space-x-2">
          <textarea
            placeholder="分享你的想法..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none resize-none text-sm"
            rows={2}
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogComments;
