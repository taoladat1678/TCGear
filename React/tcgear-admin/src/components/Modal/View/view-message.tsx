// view-messages.tsx
import React, { useEffect } from 'react';

interface MessageData {
  name: string;
  email: string;
  phone: string;
  time: string;
  content: string;
  imgSrc: string;
}

interface ViewMessagesProps {
  isOpen: boolean;
  onClose: () => void;
  messageData: MessageData;
  onSendReply: (reply: string) => void;
}

const ViewMessages: React.FC<ViewMessagesProps> = ({ isOpen, onClose, messageData, onSendReply }) => {
  const [replyText, setReplyText] = React.useState('');

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && (window as any).feather) {
      (window as any).feather.replace();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendReply(replyText);
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-secondary/90" onClick={onClose}></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-secondary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full relative">
          <div className="px-6 py-4 border-b border-primary/20 flex justify-between items-center">
            <div className="flex items-center">
              <img className="h-14 w-14 rounded-full object-cover" src={messageData.imgSrc} alt="Người gửi" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-accent font-open-sans">{messageData.name}</h3>
                <p className="text-sm text-accent/70 font-open-sans">{messageData.email} • {messageData.phone}</p>
              </div>
            </div>
            <button className="modal-close" onClick={onClose}>
              <i data-feather="x"></i>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4">
              <div className="bg-primary/10 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-accent font-open-sans">Tin nhắn gốc</span>
                  <span className="text-xs text-accent/70 font-open-sans">{messageData.time}</span>
                </div>
                <p className="text-accent font-open-sans" dangerouslySetInnerHTML={{ __html: messageData.content.replace(/\n/g, '<br>') }}></p>
              </div>

              <div className="bg-secondary/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-accent font-open-sans mb-2">Phản hồi của bạn</h4>
                <textarea
                  className="w-full bg-secondary border border-primary/20 text-accent rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary font-open-sans"
                  rows={4}
                  placeholder="Nhập phản hồi của bạn..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-primary/20 flex justify-end space-x-3">
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-accent font-semibold py-2 px-4 rounded font-open-sans transition-all duration-200 hover:scale-105 flex items-center"
              >
                <i data-feather="send" className="w-4 h-4 mr-2"></i>
                Gửi Phản Hồi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewMessages;