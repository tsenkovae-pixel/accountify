'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check, TrendingUp, Calculator, Lightbulb, BookOpen, DollarSign, Target } from 'lucide-react';

const quotes = [
  // ИНВЕСТИЦИИ И МЪДРОСТ (Бъфет и др.)
  {
    text: "Активите ви правят богати, но пасивите ви правят мъдри.",
    author: "Бенджамин Франклин",
    category: "Мъдрост",
    icon: <Lightbulb size={16} />
  },
  {
    text: "Правило №1: Никога не губи пари. Правило №2: Никога не забравяй правило №1.",
    author: "Уорън Бъфет",
    category: "Инвестиции",
    icon: <TrendingUp size={16} />
  },
  {
    text: "Цената е това, което плащаш. Стойността е това, което получаваш.",
    author: "Уорън Бъфет",
    category: "Инвестиции",
    icon: <TrendingUp size={16} />
  },
  {
    text: "Не спестявай това, което остава след харченето, а харчи това, което остава след спестяването.",
    author: "Уорън Бъфет",
    category: "Лични финанси",
    icon: <DollarSign size={16} />
  },
  {
    text: "Фондовият пазар е инструмент за прехвърляне на пари от нетърпеливите към търпеливите.",
    author: "Уорън Бъфет",
    category: "Инвестиции",
    icon: <TrendingUp size={16} />
  },
  {
    text: "Инвестирай в себе си. Твоята кариера е двигателят на твоето богатство.",
    author: "Пол Клитероу",
    category: "Кариерно развитие",
    icon: <Target size={16} />
  },
  {
    text: "Рискът идва от незнанието какво правиш.",
    author: "Уорън Бъфет",
    category: "Инвестиции",
    icon: <TrendingUp size={16} />
  },
  {
    text: "Не е нужно да си умен, за да трупаш богатство — трябва ти дисциплина.",
    author: "Уорън Бъфет",
    category: "Дисциплина",
    icon: <Target size={16} />
  },
  {
    text: "Ако не намериш начин да печелиш докато спиш, ще работиш до смъртта си.",
    author: "Уорън Бъфет",
    category: "Пасивен доход",
    icon: <DollarSign size={16} />
  },
  
  // ЛИЧНИ ФИНАНСИ
  {
    text: "Не е важно колко правиш, а колко запазваш.",
    author: "Робърт Кийосаки",
    category: "Лични финанси",
    icon: <DollarSign size={16} />
  },
  {
    text: "Богатите инвестират парите си и харчат остатъка. Бедните харчат парите си и инвестират остатъка.",
    author: "Джим Рон",
    category: "Лични финанси",
    icon: <DollarSign size={16} />
  },
  {
    text: "Парите са добър слуга, но лош господар.",
    author: "Франсис Бейкън",
    category: "Философия",
    icon: <Lightbulb size={16} />
  },
  {
    text: "Годишният доход двадесет лири, годишен разход деветнадесет — щастие. Годишен доход двадесет лири, годишен разход двадесет и един — нещастие.",
    author: "Чарлз Дикенс",
    category: "Бюджет",
    icon: <Calculator size={16} />
  },
  {
    text: "Времето е по-ценно от парите. Можеш да спечелиш повече пари, но не и повече време.",
    author: "Джим Рон",
    category: "Продуктивност",
    icon: <Lightbulb size={16} />
  },
  {
    text: "Парите не носят щастие, но успокояват нервите.",
    author: "Марк Твен",
    category: "Философия",
    icon: <Lightbulb size={16} />
  },
  {
    text: "Финансовата свобода е достъпна за тези, които се учат за нея и работят за нея.",
    author: "Робърт Кийосаки",
    category: "Образование",
    icon: <BookOpen size={16} />
  },
  
  // СЧЕТОВОДСТВО И БИЗНЕС
  {
    text: "Счетоводството е езикът на бизнеса.",
    author: "Уорън Бъфет",
    category: "Счетоводство",
    icon: <Calculator size={16} />
  },
  {
    text: "Ако не можеш да го измериш, не можеш да го управляваш.",
    author: "Питър Дракър",
    category: "Мениджмънт",
    icon: <Calculator size={16} />
  },
  {
    text: "Числата никога не лъжат; хората, които ги интерпретират — понякога.",
    author: "Неизвестен",
    category: "Счетоводство",
    icon: <Calculator size={16} />
  },
  {
    text: "Приходите са суета, печалбата е здравомислие, паричният поток е реалност.",
    author: "Алън Милц",
    category: "Финанси",
    icon: <Calculator size={16} />
  },
  {
    text: "Балансът е моментна снимка на бизнеса — отчетът за приходите е неговата история.",
    author: "Счетоводна мъдрост",
    category: "Счетоводство",
    icon: <Calculator size={16} />
  },
  {
    text: "Разходите са факти. Приходите са мнения.",
    author: "Бизнес мъдрост",
    category: "Счетоводство",
    icon: <Calculator size={16} />
  },
  {
    text: "Доброто счетоводство е основата на добрия бизнес.",
    author: "Джон Д. Рокфелер",
    category: "Бизнес",
    icon: <Calculator size={16} />
  },
  
  // ИКОНОМИКА И ПАЗАРИ
  {
    text: "В краткосрочен план пазарът е машина за гласуване, в дългосрочен — везна за претегляне.",
    author: "Бенджамин Греъм",
    category: "Пазари",
    icon: <TrendingUp size={16} />
  },
  {
    text: "Пазарите могат да останат ирационални по-дълго, отколкото вие можете да останете платежоспособни.",
    author: "Джон Мейнард Кейнс",
    category: "Пазари",
    icon: <TrendingUp size={16} />
  },
  {
    text: "Инфлацията е данък, без да е необходимо законодателство.",
    author: "Милтън Фридман",
    category: "Икономика",
    icon: <TrendingUp size={16} />
  },
  {
    text: "Икономиката никога не е в равновесие — тя е в постоянно движение.",
    author: "Джордж Сорос",
    category: "Икономика",
    icon: <TrendingUp size={16} />
  },
  {
    text: "Четирите най-опасни думи в инвестирането са: 'Този път е различно.'",
    author: "Джон Темпълтън",
    category: "Инвестиции",
    icon: <TrendingUp size={16} />
  },
  {
    text: "Купувай, когато всички продават, и продавай, когато всички купуват.",
    author: "Джон Темпълтън",
    category: "Инвестиции",
    icon: <TrendingUp size={16} />
  },
  
  // ПРЕДПРИЕМАЧЕСТВО
  {
    text: "Не е нужно да бъдеш страхотен, за да започнеш, но трябва да започнеш, за да бъдеш страхотен.",
    author: "Зиг Зиглар",
    category: "Предприемачество",
    icon: <Target size={16} />
  },
  {
    text: "Единственото място, където успехът идва преди работата, е в речника.",
    author: "Видал Сасун",
    category: "Мотивация",
    icon: <Target size={16} />
  }
];

const categoryColors: Record<string, string> = {
  'Инвестиции': '#5B3FD6',
  'Счетоводство': '#059669',
  'Бизнес': '#3E2A9C',
  'Лични финанси': '#D97706',
  'Пазари': '#DC2626',
  'Икономика': '#7C3AED',
  'Предприемачество': '#F59E0B',
  'Мотивация': '#16A34A',
  'Дисциплина': '#0891B2',
  'Образование': '#BE185D',
  'Философия': '#6B7280',
  'Бюджет': '#B45309',
  'Продуктивност': '#0891B2',
  'Кариерно развитие': '#7C3AED',
  'Пасивен доход': '#059669',
  'Мъдрост': '#D4AF37',
  'Мениджмънт': '#3E2A9C',
  'Финанси': '#5B3FD6'
};

export default function DailyQuote() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentIndex(randomIndex);
  }, []);

  const nextQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
      setIsAnimating(false);
    }, 300);
  };

  const copyQuote = () => {
    const quote = quotes[currentIndex];
    navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentQuote = quotes[currentIndex];
  const categoryColor = categoryColors[currentQuote.category] || '#5B3FD6';

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 4px 20px rgba(62, 42, 156, 0.1)',
      border: '1px solid rgba(91, 63, 214, 0.15)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Декорация */}
      <div style={{
        position: 'absolute',
        top: '-10px',
        right: '10px',
        fontSize: '100px',
        opacity: 0.05,
        color: '#5B3FD6',
        fontFamily: 'Georgia, serif',
        fontWeight: 'bold',
        lineHeight: 1
      }}>
        "
      </div>

      {/* Хедър с категория */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          background: `${categoryColor}15`,
          padding: '6px 12px',
          borderRadius: '20px',
          color: categoryColor,
          fontSize: '13px',
          fontWeight: '600'
        }}>
          {currentQuote.icon}
          {currentQuote.category}
        </div>
        
        <span style={{ 
          color: '#9CA3AF', 
          fontSize: '12px',
          fontStyle: 'italic'
        }}>
          Мисъл #{currentIndex + 1}/{quotes.length}
        </span>
      </div>

      {/* Текст */}
      <div style={{
        opacity: isAnimating ? 0 : 1,
        transform: isAnimating ? 'translateY(-10px)' : 'translateY(0)',
        transition: 'all 0.3s ease'
      }}>
        <p style={{ 
          color: '#1F2937', 
          fontSize: '18px', 
          lineHeight: 1.6,
          margin: '0 0 20px 0',
          fontWeight: '500',
          fontStyle: 'italic'
        }}>
          {currentQuote.text}
        </p>

        <div style={{ 
          borderLeft: '3px solid #F59E0B',
          paddingLeft: '16px',
          marginBottom: '20px'
        }}>
          <p style={{ 
            color: '#3E2A9C', 
            fontSize: '15px', 
            fontWeight: '600',
            margin: '0 0 4px 0'
          }}>
            {currentQuote.author}
          </p>
        </div>
      </div>

      {/* Бутони */}
      <div style={{ 
        display: 'flex', 
        gap: '12px',
        borderTop: '1px solid #E5E7EB',
        paddingTop: '16px'
      }}>
        <button
          onClick={copyQuote}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            background: copied ? '#DCFCE7' : 'white',
            color: copied ? '#166534' : '#6B7280',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Копирано!' : 'Копирай'}
        </button>

        <button
          onClick={nextQuote}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #3E2A9C 0%, #5B3FD6 100%)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(62, 42, 156, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <RefreshCw size={16} />
          Следваща
        </button>
      </div>
    </div>
  );
}