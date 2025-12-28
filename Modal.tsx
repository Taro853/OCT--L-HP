import React, { useEffect } from 'react';
import { Header, Footer } from './Layout';
import { ModalType } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (type: ModalType) => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose,
  onNavigate,
  children
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-slide-up flex flex-col min-h-screen">
      
      {/* Embedded Header for context */}
      <Header onOpenModal={(type) => type === 'NONE' ? onClose() : onNavigate(type)} isModal={true} />
      
      {/* Modal Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
        {children}
      </main>

      {/* Embedded Footer */}
      <Footer />
    </div>
  );
};