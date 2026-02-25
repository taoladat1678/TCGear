// view-comment.tsx (updated to use dangerouslySetInnerHTML for content)
import React, { useEffect } from 'react';
import feather from 'feather-icons';
// import './comments.css';

interface ViewCommentProps {
  comment: {
    userName: string;
    userImg: string;
    postTitle: string;
    product: string;
    time: string;
    content: string;
  };
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}

const ViewComment: React.FC<ViewCommentProps> = ({ comment, onClose, onApprove, onReject, onDelete }) => {
  useEffect(() => {
    // Initialize Feather icons
    if (typeof window !== 'undefined') {
      feather.replace();
    }
  }, []);

  const formattedContent = comment.content.replace(/\n/g, '<br>');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-secondary/90" onClick={onClose} />
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-secondary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full relative">
          <div className="px-6 py-4 border-b border-primary/20 flex justify-between items-center">
            <div className="flex items-center">
              <img id="modal-user-img" className="h-14 w-14 rounded-full object-cover" src={comment.userImg} alt="Người gửi" />
              <div className="ml-4">
                <h3 id="modal-user-name" className="text-lg font-semibold text-accent font-open-sans">{comment.userName}</h3>
                <p id="modal-post-title" className="text-sm text-accent/70 font-open-sans">{comment.postTitle}</p>
                <p id="modal-product" className="text-sm text-accent/70 font-open-sans">{comment.product}</p>
              </div>
            </div>
            <button id="close-modal" className="modal-close" onClick={onClose}>
              <i data-feather="x" />
            </button>
          </div>
          <div className="px-6 py-4">
            <div className="bg-primary/10 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-accent font-open-sans">Nội dung bình luận</span>
                <span id="modal-message-time" className="text-xs text-accent/70 font-open-sans">{comment.time}</span>
              </div>
              <p 
                id="modal-message-content" 
                className="text-accent font-open-sans"
                dangerouslySetInnerHTML={{ __html: formattedContent }}
              />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-primary/20 flex justify-end space-x-3">
            <button id="modal-reject-comment" className="bg-accent/20 hover:bg-accent/30 text-accent/70 font-semibold py-2 px-4 rounded font-open-sans transition-all duration-200 hover:scale-105" onClick={onReject}>
              Từ Chối
            </button>
            <button id="modal-approve-comment" className="bg-primary hover:bg-primary/90 text-accent font-semibold py-2 px-4 rounded font-open-sans transition-all duration-200 hover:scale-105" onClick={onApprove}>
              Phê Duyệt
            </button>
            <button id="modal-delete-comment" className="bg-red-600 hover:bg-red-700 text-accent font-semibold py-2 px-4 rounded font-open-sans transition-all duration-200 hover:scale-105 ml-2" onClick={onDelete}>
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewComment;