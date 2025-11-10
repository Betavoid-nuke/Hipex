import React, { useEffect, useState } from 'react';
import { AppUser, Comment } from '@/twinx/types/TwinxTypes';
import { useUser } from '@clerk/nextjs';
import { getUserById } from '@/twinx/utils/twinxDBUtils.action';
import { BiLike } from "react-icons/bi";
import Image from 'next/image'; // ✅ import Image for safe avatar handling
import { useRouter } from "next/navigation";

interface CommentSectionProps {
  productId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ productId }) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const { user } = useUser();
  const [fetchedUser, setfetchedUser] = useState<AppUser>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // --- Fetch User Data ---
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const fetchedUser = await getUserById(user.id);
        setfetchedUser(fetchedUser);
      } catch (err) {
        console.error('❌ Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);
  // --- End Fetch User Data ---

  // --- Fetch Comments ---
  useEffect(() => {
    const fetchComments = async () => {
      if (!productId) return;
      try {
        const res = await fetch(`/api/mongo?id=${productId}&model=MarketplaceProduct`);
        const data = await res.json();

        if (data.success && Array.isArray(data.data?.comments)) {
          setComments([...data.data.comments].reverse());
        } else if (data.success && data.data?.comments) {
          setComments([data.data.comments]);
        } else {
          console.warn('⚠️ No comments found or invalid response:', data);
        }
      } catch (err) {
        console.error('❌ Error fetching comments:', err);
      }
    };

    fetchComments();
  }, [productId]);
  // --- End Fetch Comments ---

  if (!fetchedUser) return null;

  const formatCommentTime = (date: Date): string => {
    const diffInMinutes = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60));
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommentText.trim() === '') return;

    const newComment: Comment = {
      _id: Date.now().toString(),
      owner: fetchedUser.name,
      content: newCommentText.trim(),
      date: new Date(),
      likes: 0,
      LikedBy: []
    };

    setComments((prev) => [newComment, ...prev]);
    setNewCommentText('');

    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          comment: {
            content: newComment.content,
            owner: newComment.owner,
            date: newComment.date,
            likes: newComment.likes,
          },
        }),
      });
    } catch (err) {
      console.error('❌ Failed to submit comment:', err);
    }
  };

  return (
    <div
      className="p-6 rounded-xl w-full"
      style={{ background: 'transparent', border: '1px solid #4b4b52ff', borderColor:'transparent'}}
    >
      <h2 className="text-xl font-bold text-white mb-4">
        Community Comments ({comments.length})
      </h2>
      {loading ? (
        <p className="text-gray-500 text-sm text-center py-10">Loading comments...</p>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
            <textarea
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Share your thoughts on this asset..."
              rows={2}
              className="flex-1 resize-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white 
                         placeholder:text-gray-500 outline-none focus:border-indigo-500 transition-all"
              style={{backgroundColor:'#262629', height:'50px'}}
            />
            <button
              type="submit"
              disabled={newCommentText.trim().length === 0}
              className="h-auto self-stretch bg-indigo-600 font-bold py-3 px-6 rounded-lg 
                         hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 
                         disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Send
            </button>
          </form>
          {/* ✅ Comment List with safe avatar rendering */}
          <div className="space-y-4">
            {comments.map((comment: any) => (
              <div key={comment._id || comment.date} className="pb-4" style={{borderColor:'transparent', backgroundColor:'#262629', borderRadius:'15px', padding:'10px'}}>
                <div className="flex items-center mb-2 gap-3">
                  {/* ✅ Avatar with safe fallback */}
                  {comment.avatar ? (
                    <Image
                      src={comment.avatar}
                      alt={comment.owner || 'User'}
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                      onError={(e) => ((e.currentTarget.src = '/default-avatar.png'))}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-500 flex items-center justify-center text-white font-semibold">
                      {comment.owner?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-white mr-3">{comment.owner}</span>
                    <span className="text-xs text-gray-500">{formatCommentTime(comment.date)}</span>
                  </div>
                </div>
                <p className="text-gray-300 mb-2">{comment.content}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );

};

export default CommentSection;
