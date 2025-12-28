
import React, { useState, useEffect } from 'react';
import { Book, ModalState, NewsItem, Notice, ClosedDate, MonthlyFeature, SurveyQuestion } from './types';
import { INITIAL_BOOKS, INITIAL_NEWS, INITIAL_NOTICES, INITIAL_CLOSED_DATES, INITIAL_FEATURE, INITIAL_LIBRARIANS, INITIAL_SURVEY } from './constants';
import { Modal } from './Modal';
import { Header, Footer } from './Layout';
import { CalendarView } from './CalendarView';
import { db } from './firebase'; // Import Firestore
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc, query, orderBy } from 'firebase/firestore';

// Modals
import { AdminModal } from './AdminModal';
import { FeatureModal } from './FeatureModal';
import { NewsDetailModal } from './NewsDetailModal';
import { AccessModal } from './AccessModal';
import { BookDetailModal } from './BookDetailModal';
import { LibrarianModal } from './LibrarianModal';
import { SurveyModal } from './SurveyModal';
import { NoticeDetailModal } from './NoticeDetailModal';

import { MapPin, FileText, ArrowRight, MessageCircle, Calendar as CalendarIcon, BookOpen, Bell } from 'lucide-react';

const App: React.FC = () => {
  // --- Data State (Synced with Firestore) ---
  const [books, setBooks] = useState<Book[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [closedDates, setClosedDates] = useState<ClosedDate[]>([]);
  const [currentFeature, setCurrentFeature] = useState<MonthlyFeature>(INITIAL_FEATURE);
  const [survey, setSurvey] = useState<SurveyQuestion[]>([]);
  
  // Feature ID for singleton document
  const FEATURE_DOC_ID = 'current_feature';

  // --- Initial Data Seeding (Run once if DB is empty) ---
  useEffect(() => {
    if (!db) return; // Wait for config

    const seedData = async () => {
      // Simple check: if books empty, seed initial data. 
      // In real app, you might want a better check or manual seed button.
      // This logic is simplified for the demo.
    };
    seedData();
  }, []);

  // --- Real-time Subscriptions ---
  useEffect(() => {
    if (!db) {
      // Fallback to initial constants if no DB (Preview mode)
      setBooks(INITIAL_BOOKS);
      setNews(INITIAL_NEWS);
      setNotices(INITIAL_NOTICES);
      setClosedDates(INITIAL_CLOSED_DATES);
      setSurvey(INITIAL_SURVEY);
      return;
    }

    // Books
    const unsubBooks = onSnapshot(query(collection(db, 'books')), (snap) => {
      const data = snap.docs.map(d => ({ ...d.data(), id: d.id } as Book));
      if (data.length === 0 && !localStorage.getItem('seeded_books')) {
         // Seed initial data locally for first view if empty
         INITIAL_BOOKS.forEach(b => addDoc(collection(db, 'books'), { ...b, id: undefined })); // Let ID be auto
         localStorage.setItem('seeded_books', 'true');
      } else {
        setBooks(data);
      }
    });

    // News
    const unsubNews = onSnapshot(query(collection(db, 'news'), orderBy('date', 'desc')), (snap) => {
       const data = snap.docs.map(d => ({ ...d.data(), id: d.id } as NewsItem));
       if (data.length === 0 && !localStorage.getItem('seeded_news')) {
         INITIAL_NEWS.forEach(n => addDoc(collection(db, 'news'), { ...n, id: undefined }));
         localStorage.setItem('seeded_news', 'true');
       } else {
         setNews(data);
       }
    });

    // Notices
    const unsubNotices = onSnapshot(query(collection(db, 'notices'), orderBy('date', 'desc')), (snap) => {
      const data = snap.docs.map(d => ({ ...d.data(), id: d.id } as Notice));
      if (data.length === 0 && !localStorage.getItem('seeded_notices')) {
        INITIAL_NOTICES.forEach(n => addDoc(collection(db, 'notices'), { ...n, id: undefined }));
        localStorage.setItem('seeded_notices', 'true');
      } else {
        setNotices(data);
      }
    });

    // Closed Dates
    const unsubDates = onSnapshot(query(collection(db, 'closed_dates')), (snap) => {
      const data = snap.docs.map(d => ({ ...d.data(), id: d.id } as ClosedDate));
      if (data.length === 0 && !localStorage.getItem('seeded_dates')) {
        INITIAL_CLOSED_DATES.forEach(d => addDoc(collection(db, 'closed_dates'), { ...d, id: undefined }));
        localStorage.setItem('seeded_dates', 'true');
      } else {
        setClosedDates(data);
      }
    });

    // Feature (Singleton)
    const unsubFeature = onSnapshot(doc(db, 'features', FEATURE_DOC_ID), (docSnap) => {
      if (docSnap.exists()) {
        setCurrentFeature(docSnap.data() as MonthlyFeature);
      } else {
        setDoc(doc(db, 'features', FEATURE_DOC_ID), INITIAL_FEATURE);
      }
    });

    // Survey Questions
    const unsubSurvey = onSnapshot(query(collection(db, 'survey')), (snap) => {
      const data = snap.docs.map(d => ({ ...d.data(), id: d.id } as SurveyQuestion));
      if (data.length === 0 && !localStorage.getItem('seeded_survey')) {
         INITIAL_SURVEY.forEach(s => addDoc(collection(db, 'survey'), { ...s, id: undefined }));
         localStorage.setItem('seeded_survey', 'true');
      } else {
        setSurvey(data);
      }
    });

    return () => {
      unsubBooks();
      unsubNews();
      unsubNotices();
      unsubDates();
      unsubFeature();
      unsubSurvey();
    };
  }, []);

  // --- DB Operations Helpers (Passed to Admin) ---
  // Note: We use 'any' for data partials to simplify types for partial updates
  const handleAdd = async (coll: string, data: any) => {
    if (!db) return alert("DB未接続: 設定ファイルを確認してください");
    await addDoc(collection(db, coll), data);
  };

  const handleUpdate = async (coll: string, id: string, data: any) => {
    if (!db) return;
    await updateDoc(doc(db, coll, id), data);
  };

  const handleDelete = async (coll: string, id: string) => {
    if (!db) return;
    if(!window.confirm("本当に削除しますか？")) return;
    await deleteDoc(doc(db, coll, id));
  };

  const handleUpdateFeature = async (data: MonthlyFeature) => {
    if (!db) return;
    await setDoc(doc(db, 'features', FEATURE_DOC_ID), data);
  };

  // --- Local State for User Actions (No Auth required for these) ---
  const [modalState, setModalState] = useState<ModalState>({ type: 'NONE' });
  
  // LocalStorage Helper for User Preferences (Reservations are personal!)
  const usePersistentState = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [state, setState] = useState<T>(() => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) { return initialValue; }
    });
    useEffect(() => { localStorage.setItem(key, JSON.stringify(state)); }, [key, state]);
    return [state, setState];
  };

  const [reservedBookIds, setReservedBookIds] = usePersistentState<string[]>('oct_reserved', []);
  const [wantToReadIds, setWantToReadIds] = usePersistentState<string[]>('oct_bookmark', []);

  const openModal = (type: ModalState['type'], data?: any) => setModalState({ type, data });
  const closeModal = () => setModalState({ type: 'NONE' });
  const handleModalNavigate = (type: ModalState['type']) => setModalState({ type, data: undefined });

  const toggleReserve = (bookId: string) => {
    setReservedBookIds(prev => prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]);
  };
  const toggleWantToRead = (bookId: string) => {
    setWantToReadIds(prev => prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]);
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] font-serif text-oct-950">
      <Header onOpenModal={openModal} />

      {/* HERO SECTION */}
      <section className="relative h-[80vh] overflow-hidden group cursor-pointer" onClick={() => openModal('FEATURE')}>
        <div className="absolute inset-0 bg-oct-900">
          <img src={currentFeature.imageUrl} alt="Feature" className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-[30s]" />
          <div className="absolute inset-0 bg-gradient-to-t from-oct-950 via-oct-900/20 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex flex-col justify-end pb-24 text-white">
          <span className="text-xs tracking-[0.5em] mb-4 text-oct-200">SPECIAL FEATURE</span>
          <h2 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight drop-shadow-2xl">{currentFeature.title}</h2>
          <p className="text-xl md:text-2xl text-oct-100 max-w-2xl font-light italic border-l-4 border-oct-400 pl-6 py-2">
            {currentFeature.subtitle}
          </p>
          <div className="mt-12">
            <button className="bg-white/10 backdrop-blur-md border border-white/40 text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-oct-900 transition-all shadow-xl flex items-center gap-3">
              特集記事を読む <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-24">
            
            {/* NOTICES */}
            <section>
              <div className="flex justify-between items-end mb-10 border-b border-oct-100 pb-4">
                <h2 className="text-3xl font-bold flex items-center gap-3"><Bell className="text-oct-500" /> お知らせ</h2>
              </div>
              <div className="space-y-4">
                {notices.length === 0 && <p className="text-gray-400 text-sm">お知らせはありません</p>}
                {notices.map(item => (
                   <div key={item.id} onClick={() => openModal('NOTICE_DETAIL', item)} className="flex gap-6 items-start bg-white p-6 rounded-2xl border border-oct-50 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                      <div className={`shrink-0 px-3 py-1 rounded text-[10px] font-bold tracking-widest ${item.category === 'IMPORTANT' ? 'bg-red-100 text-red-600' : item.category === 'EVENT' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {item.category === 'IMPORTANT' ? '重要' : item.category === 'EVENT' ? 'イベント' : 'INFO'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <time className="text-[10px] text-gray-400 font-bold">{item.date}</time>
                        </div>
                        <h3 className="font-bold text-lg group-hover:text-oct-600 transition-colors line-clamp-2">{item.title}</h3>
                      </div>
                      <div className="shrink-0 self-center">
                        <div className="w-8 h-8 rounded-full bg-oct-50 flex items-center justify-center text-oct-300 group-hover:bg-oct-900 group-hover:text-white transition-all">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                   </div>
                ))}
              </div>
            </section>

            {/* LIBRARY NEWS */}
            <section>
              <div className="flex justify-between items-end mb-10 border-b border-oct-100 pb-4">
                <h2 className="text-3xl font-bold flex items-center gap-3"><FileText className="text-oct-500" /> 図書館通信</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {news.length === 0 && <p className="text-gray-400 text-sm">記事がありません</p>}
                {news.map(item => (
                  <div key={item.id} onClick={() => openModal('NEWS_DETAIL', item)} className="group bg-white rounded-2xl overflow-hidden border border-oct-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col h-full">
                    {item.previewImageUrl ? (
                       <div className="aspect-video w-full overflow-hidden bg-oct-100">
                         <img src={item.previewImageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       </div>
                    ) : (
                      <div className="aspect-video w-full bg-oct-50 flex items-center justify-center text-oct-200">
                        <FileText size={40} />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <time className="text-[10px] font-bold text-oct-400 tracking-widest uppercase">{item.date}</time>
                        <span className="bg-red-50 text-red-500 text-[10px] px-2 py-1 rounded font-bold border border-red-100">PDF</span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-oct-600 leading-snug">{item.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-1">{item.content.replace(/<[^>]+>/g, '')}</p>
                      <div className="flex items-center gap-2 text-oct-900 text-[10px] font-bold">紙面を見る <ArrowRight size={12}/></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* BOOKS */}
            <section>
              <h2 className="text-3xl font-bold mb-10 flex items-center gap-3"><BookOpen className="text-oct-500" /> 今月のおすすめ図書</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                {books.filter(b => b.isRecommended).map(book => (
                  <div key={book.id} onClick={() => openModal('BOOK_DETAIL', book)} className="group cursor-pointer">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md mb-4 group-hover:shadow-2xl transition-all">
                       <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                         {reservedBookIds.includes(book.id) && <span className="text-white text-[9px] font-bold bg-oct-500 px-2 py-0.5 rounded-full">予約済</span>}
                         {wantToReadIds.includes(book.id) && <span className="text-white text-[9px] font-bold bg-red-500 px-2 py-0.5 rounded-full">読みたい</span>}
                         <span className="text-white text-[10px] font-bold border px-3 py-1 rounded-full backdrop-blur-sm">DETAIL</span>
                       </div>
                    </div>
                    <h4 className="font-bold text-sm leading-tight text-oct-900 text-center">{book.title}</h4>
                    <p className="text-oct-600 text-[10px] text-center">{book.isNew && "★ NEW"}</p>
                    <p className="text-[10px] text-gray-400 text-center mt-1">{book.author}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-12">
            <section>
               <h3 className="font-bold text-sm text-oct-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                 <CalendarIcon size={14} /> Library Calendar
               </h3>
               <CalendarView closedDates={closedDates} />
            </section>
            {/* Side Buttons */}
            <div className="space-y-4">
              <button onClick={() => openModal('ACCESS')} className="w-full bg-oct-900 text-white p-6 rounded-2xl flex items-center justify-between hover:bg-oct-800 transition-colors shadow-lg group">
                <div className="text-left">
                  <p className="text-[10px] font-bold text-oct-300 tracking-widest mb-1">STATION DIRECT</p>
                  <p className="text-lg font-bold">アクセス・地図</p>
                </div>
                <MapPin className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => openModal('SURVEY')} className="w-full bg-white border border-oct-100 p-6 rounded-2xl flex items-center justify-between hover:bg-oct-50 transition-colors shadow-sm group">
                <div className="text-left">
                  <p className="text-[10px] font-bold text-oct-400 tracking-widest mb-1">USER VOICE</p>
                  <p className="text-lg font-bold text-oct-900">アンケート</p>
                </div>
                <MessageCircle className="text-oct-500" />
              </button>
            </div>
          </aside>
        </div>
      </main>

      <Footer onOpenSurvey={() => openModal('SURVEY')} />

      <Modal isOpen={modalState.type !== 'NONE'} onClose={closeModal} onNavigate={handleModalNavigate}>
        {modalState.type === 'ADMIN' && (
          <AdminModal 
            books={books} 
            news={news} 
            notices={notices} 
            closedDates={closedDates} 
            feature={currentFeature} 
            survey={survey} 
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onUpdateFeature={handleUpdateFeature}
          />
        )}
        {modalState.type === 'FEATURE' && (
          <FeatureModal feature={currentFeature} allBooks={books} onBookClick={(book) => openModal('BOOK_DETAIL', book)} />
        )}
        {modalState.type === 'NEWS_DETAIL' && (
          <NewsDetailModal news={modalState.data as NewsItem} />
        )}
        {modalState.type === 'NOTICE_DETAIL' && (
          <NoticeDetailModal notice={modalState.data as Notice} />
        )}
        {modalState.type === 'ACCESS' && (
          <AccessModal />
        )}
        {modalState.type === 'BOOK_DETAIL' && (
          <BookDetailModal 
            book={modalState.data as Book} 
            isReserved={reservedBookIds.includes((modalState.data as Book)?.id)}
            isBookmarked={wantToReadIds.includes((modalState.data as Book)?.id)}
            onToggleReserve={() => toggleReserve((modalState.data as Book).id)}
            onToggleBookmark={() => toggleWantToRead((modalState.data as Book).id)}
          />
        )}
        {modalState.type === 'LIBRARIAN' && (
          <LibrarianModal librarians={INITIAL_LIBRARIANS} />
        )}
        {modalState.type === 'SURVEY' && (
          <SurveyModal questions={survey} onSubmit={closeModal} />
        )}
      </Modal>
    </div>
  );
};

export default App;
