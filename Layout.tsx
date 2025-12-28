
import React, { useState } from 'react';
import { Lock, Menu, X, BookOpen, MessageCircle } from 'lucide-react';
import { ModalType } from '../types';

interface HeaderProps {
  onOpenModal: (type: ModalType) => void;
  isModal?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenModal, isModal = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    if (isModal) {
      onOpenModal('NONE');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (type: ModalType) => {
    setMobileMenuOpen(false);
    onOpenModal(type);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-oct-100 shadow-sm transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogoClick}>
          <div className="w-10 h-10 bg-oct-900 text-white rounded-sm flex items-center justify-center shadow-lg group-hover:bg-oct-700 transition-colors">
            <BookOpen size={24} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-oct-900 tracking-tight leading-none group-hover:text-oct-700 transition-colors">
              OCT
            </h1>
            <span className="text-[10px] font-medium text-oct-600 tracking-widest uppercase">Takahira Okuzashiki Library</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-oct-800">
          <button onClick={handleLogoClick} className="hover:text-oct-500 transition-colors hover:scale-105 transform duration-200">ホーム</button>
          <button onClick={() => onOpenModal('ACCESS')} className="hover:text-oct-500 transition-colors hover:scale-105 transform duration-200">アクセス・地図</button>
          <button onClick={() => onOpenModal('LIBRARIAN')} className="hover:text-oct-500 transition-colors hover:scale-105 transform duration-200">司書紹介</button>
          <button 
            onClick={() => onOpenModal('ADMIN')}
            className="flex items-center gap-1 bg-oct-50 text-oct-800 px-4 py-2 rounded-full hover:bg-oct-100 transition-all border border-oct-200 hover:border-oct-300 shadow-sm"
          >
            <Lock size={14} /> <span className="text-xs">管理者</span>
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-oct-800 hover:bg-oct-50 rounded"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      
      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-oct-100 absolute w-full left-0 animate-fade-in shadow-xl">
          <div className="flex flex-col p-6 gap-6 text-center font-medium text-oct-800">
             <button onClick={handleLogoClick} className="py-2 border-b border-oct-50 hover:text-oct-500">ホーム</button>
             <button onClick={() => handleNav('ACCESS')} className="py-2 border-b border-oct-50 hover:text-oct-500">アクセス・地図</button>
             <button onClick={() => handleNav('LIBRARIAN')} className="py-2 border-b border-oct-50 hover:text-oct-500">司書紹介</button>
             <button onClick={() => handleNav('SURVEY')} className="py-2 border-b border-oct-50 hover:text-oct-500">アンケート</button>
             <button onClick={() => handleNav('ADMIN')} className="py-2 text-oct-600 flex justify-center items-center gap-2">
               <Lock size={14} /> 管理者設定
             </button>
             {isModal && (
               <button onClick={() => onOpenModal('NONE')} className="py-2 bg-oct-900 text-white rounded mt-2">
                 閉じる
               </button>
             )}
          </div>
        </div>
      )}
    </header>
  );
};

interface FooterProps {
  onOpenSurvey?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSurvey }) => {
  return (
    <footer className="bg-oct-950 text-white py-16 border-t-4 border-oct-600">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
            <div className="w-8 h-8 bg-white text-oct-900 rounded-sm flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <h2 className="text-xl font-bold">OCT Library</h2>
          </div>
          <p className="text-oct-200 text-sm leading-relaxed mb-6">
            高平区立おくざしき図書館。<br/>
            ここは本と出会い、人と思索を深める<br/>
            街の静かな「奥座敷」です。
          </p>
        </div>
        
        <div>
           <h3 className="font-bold text-lg mb-6 text-oct-100 border-b border-oct-800 pb-2 inline-block">開館時間</h3>
           <ul className="space-y-3 text-oct-200 text-sm">
             <li className="flex justify-between md:justify-start gap-8">
               <span>平日</span>
               <span className="font-bold text-white">9:30 - 20:00</span>
             </li>
             <li className="flex justify-between md:justify-start gap-8">
               <span>土日祝</span>
               <span className="font-bold text-white">9:30 - 18:00</span>
             </li>
           </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-6 text-oct-100 border-b border-oct-800 pb-2 inline-block">お問い合わせ</h3>
          <p className="text-oct-200 text-sm mb-4">KUR熊田 / WITRE高平 6階</p>
          
          {onOpenSurvey && (
            <button 
              onClick={onOpenSurvey}
              className="flex items-center gap-2 bg-oct-800 hover:bg-oct-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors mx-auto md:mx-0 shadow-lg active:scale-95"
            >
              <MessageCircle size={16} /> アンケートに協力する
            </button>
          )}
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-oct-900 text-center text-xs text-oct-500">
        &copy; {new Date().getFullYear()} Takahira Ward Okuzashiki Library. All rights reserved.
      </div>
    </footer>
  );
};
