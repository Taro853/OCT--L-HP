
import React, { useState } from 'react';
import { Book } from '../../types';
import { BookOpen, Calendar, User, Tag, Share2, Heart, CheckCircle, Info } from 'lucide-react';

interface BookDetailModalProps {
  book: Book;
  isReserved: boolean;
  isBookmarked: boolean;
  onToggleReserve: () => void;
  onToggleBookmark: () => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({ 
  book, 
  isReserved, 
  isBookmarked, 
  onToggleReserve, 
  onToggleBookmark 
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReserveClick = () => {
    if (!isReserved) {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
    }
    onToggleReserve();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-oct-100 animate-fade-in relative">
      {/* Reservation Notification */}
      {showConfirm && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up bg-oct-900 text-white px-8 py-3 rounded-full flex items-center gap-3 shadow-2xl">
          <CheckCircle size={18} className="text-oct-300" />
          <span className="text-sm font-bold">予約を受け付けました</span>
        </div>
      )}

      <div className="grid md:grid-cols-2">
        {/* Visual */}
        <div className="bg-oct-50 p-8 md:p-16 flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 flex flex-col gap-2 items-end">
            {book.isNew && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">NEW ARRIVAL</span>
            )}
            {isReserved && (
              <span className="bg-oct-900 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-oct-700 uppercase tracking-widest">Reserved</span>
            )}
          </div>
          <div className="w-56 aspect-[2/3] shadow-2xl rounded-sm overflow-hidden border-[10px] border-white relative z-10 group cursor-zoom-in">
            <img src={book.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={book.title} />
          </div>
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
             <BookOpen size={300} strokeWidth={0.5} className="text-oct-900" />
          </div>
        </div>

        {/* Metadata */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-[10px] font-bold text-oct-500 tracking-widest mb-4 uppercase">
            <Tag size={12} />
            <span>{book.category}</span>
          </div>
          
          <h2 className="text-4xl font-bold mb-4 text-oct-950 leading-tight">{book.title}</h2>
          
          <div className="flex items-center gap-2 text-lg text-oct-400 mb-8 italic">
            <User size={18} />
            <span>{book.author} 著</span>
          </div>

          {/* Status Badge */}
          <div className="mb-6 flex items-center gap-2">
            <div className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-md ${isReserved ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
              <Info size={14} />
              {isReserved ? '貸出中（予約済）' : '貸出可（現在庫あり）'}
            </div>
          </div>

          <div className="bg-oct-50/50 p-6 rounded-2xl mb-10 border border-oct-50 shadow-inner">
            <h4 className="text-[10px] font-bold text-oct-300 uppercase mb-3 tracking-widest">Description</h4>
            <p className="text-gray-600 leading-relaxed text-sm">{book.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleReserveClick}
              className={`flex-1 py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 ${
                isReserved 
                ? 'bg-white border-2 border-oct-900 text-oct-900 hover:bg-oct-50' 
                : 'bg-oct-900 text-white hover:bg-oct-800'
              }`}
            >
              <BookOpen size={20} /> 
              {isReserved ? '予約を取り消す' : 'この本を予約する'}
            </button>
            <button 
              onClick={onToggleBookmark}
              className={`p-5 rounded-2xl transition-all active:scale-95 border ${
                isBookmarked 
                ? 'bg-red-50 text-red-500 border-red-100 shadow-inner' 
                : 'bg-white border-oct-200 text-oct-300 hover:bg-oct-50'
              }`}
              title="読みたいリストに追加"
            >
              <Heart size={20} fill={isBookmarked ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <div className="flex items-center gap-1"><Calendar size={12}/> 返却期限：14日間</div>
            <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
            <div>館内閲覧可</div>
          </div>
        </div>
      </div>
    </div>
  );
};
