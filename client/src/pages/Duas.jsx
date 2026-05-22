import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, BookOpen, Sunrise, Sunset, Star, Plane, UtensilsCrossed, Search } from 'lucide-react';
import { cn } from '../lib/utils';

const categories = [
  { id: 'all', label: 'All', icon: Star },
  { id: 'morning', label: 'Morning', icon: Sunrise },
  { id: 'evening', label: 'Evening', icon: Sunset },
  { id: 'prayer', label: 'Prayer', icon: BookOpen },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'food', label: 'Food', icon: UtensilsCrossed },
];

const duas = [
  {
    id: 1, category: 'morning',
    title: 'Morning Remembrance',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ',
    transliteration: "Asbahna wa asbahal mulku lillah, wal hamdu lillah",
    translation: "We have reached the morning and at this very time the dominion belongs to Allah, and all praise is for Allah.",
  },
  {
    id: 2, category: 'evening',
    title: 'Evening Protection',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'udhu bikalimatillahit-tammaati min sharri ma khalaq",
    translation: "I seek refuge in the perfect words of Allah from the evil of that which He has created.",
  },
  {
    id: 3, category: 'prayer',
    title: 'Before Prayer',
    arabic: 'اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ',
    transliteration: "Allahumma ba'id bayni wa bayna khatayaya",
    translation: "O Allah, distance me from my sins.",
  },
  {
    id: 4, category: 'food',
    title: 'Before Eating',
    arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
    transliteration: "Bismillahi wa 'ala barakatillah",
    translation: "In the name of Allah and with the blessing of Allah.",
  },
  {
    id: 5, category: 'travel',
    title: 'Travel Dua',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ',
    transliteration: "Subhanal-ladhi sakh-khara lana hadha wama kunna lahu muqrinin",
    translation: "Glory be to Him who has subjected this to us, and we could never have it.",
  },
  {
    id: 6, category: 'morning',
    title: 'Seeking Forgiveness',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: "Astaghfirullaha wa atubu ilayh",
    translation: "I seek the forgiveness of Allah and repent to Him.",
  },
];

export default function Duas() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState(new Set());

  const filtered = duas.filter(d => {
    const matchCat = activeCategory === 'all' || d.category === activeCategory;
    const matchSearch = !search || d.title.toLowerCase().includes(search.toLowerCase()) || d.translation.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleFav = (id) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Duas & Adhkar</h1>
        <p className="font-amiri text-lg text-primary/80 mt-1">الأدعية والأذكار</p>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search duas..."
          className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              activeCategory === cat.id
                ? "bg-primary/15 text-primary border border-primary/20"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <cat.icon className="w-3.5 h-3.5" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Duas grid */}
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((dua) => (
            <motion.div
              key={dua.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-2xl border border-border p-6 hover:border-primary/20 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{dua.title}</h3>
                  <span className="text-xs text-muted-foreground capitalize">{dua.category}</span>
                </div>
                <button 
                  onClick={() => toggleFav(dua.id)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <Heart className={cn(
                    "w-4 h-4 transition-colors",
                    favorites.has(dua.id) ? "text-red-400 fill-red-400" : "text-muted-foreground"
                  )} />
                </button>
              </div>

              <p className="font-amiri text-xl text-primary leading-loose text-right mb-3" dir="rtl">
                {dua.arabic}
              </p>

              <p className="text-xs text-primary/60 italic mb-2">{dua.transliteration}</p>
              <p className="text-sm text-foreground/70 leading-relaxed">{dua.translation}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}