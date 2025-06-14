
import { useState } from 'react';
import { MessageCircle, Heart, Trash2, Send } from 'lucide-react';
import { useComments, Comment } from '@/hooks/useComments';

interface PodcastCommentsProps {
  newsId: string;
  isOpen: boolean;
  onClose: () => void;
}

const PodcastComments = ({ newsId, isOpen, onClose }: PodcastCommentsProps) => {
  const { getCommentsByNewsId, addComment, likeComment, deleteComment } = useComments();
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');
  
  const comments = getCommentsByNewsId(newsId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(newsId, author, newComment);
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>播客评论</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-400">{comment.author}</span>
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
            <div className="text-center text-slate-400 py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>还没有评论，来发表第一条评论吧！</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 border-t border-slate-700 space-y-4">
          <input
            type="text"
            placeholder="你的昵称（可选）"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />
          <div className="flex space-x-2">
            <textarea
              placeholder="分享你对这个播客的看法..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none resize-none"
              rows={3}
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PodcastComments;
