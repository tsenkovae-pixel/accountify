'use client';

import React, { useState } from 'react';
import { Search, ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';

// РЕАЛЕН НСС СМЕТКОПЛАН според PDF-а
const accounts = [
  // РАЗДЕЛ 1: СМЕТКИ ЗА КАПИТАЛ И ЗАЕМИ
  // Група 10: Капитал
  { code: '101', name: 'Основен капитал, изискващ регистрация', type: 'Капитал', group: 'Капитал и заеми' },
  { code: '102', name: 'Капитал, неизискващ регистрация', type: 'Капитал', group: 'Капитал и заеми' },
  { code: '103', name: 'Ликвидационен капитал', type: 'Капитал', group: 'Капитал и заеми' },
  { code: '104', name: 'Капитал на предприятия с нестопанска дейност', type: 'Капитал', group: 'Капитал и заеми' },
  
  // Група 11: Капиталови резерви
  { code: '111', name: 'Законови резерви', type: 'Капитал', group: 'Капитал и заеми' },
  { code: '112', name: 'Резерви от последваща оценка на ДМА', type: 'Капитал', group: 'Капитал и заеми' },
  { code: '113', name: 'Резерви от последваща оценка на финансови инструменти', type: 'Капитал', group: 'Капитал и заеми' },
  { code: '114', name: 'Резерви от емисия на акции', type: 'Капитал', group: 'Капитал и заеми' },
  { code: '115', name: 'Резерви, свързани с капитал', type: 'Капитал', group: 'Капитал и заеми' },
  { code: '116', name: 'Обратно изкупени собствени акции', type: 'Капитал', group: 'Капитал и заеми' },
  { code: '117', name: 'Резерви, формирани от печалбата', type: 'Капитал', group: 'Капитал и заеми' },
  { code: '119', name: 'Други резерви', type: 'Капитал', group: 'Капитал и заеми' },
  
  // Група 12: Финансови резултати
  { code: '121', name: 'Непокрита загуба от минали години', type: 'Капитал', group: 'Капитал и заеми' },
  { code: '122', name: 'Неразпределена печалба от минали години', type: 'Капитал', group: 'Капитал и заеми' },
  { code: '123', name: 'Печалби и загуби от текущата година', type: 'Капитал', group: 'Капитал и заеми' },
  
  // Група 15: Получени заеми
  { code: '151', name: 'Получени краткосрочни заеми', type: 'Пасив', group: 'Капитал и заеми' },
  { code: '152', name: 'Получени дългосрочни заеми', type: 'Пасив', group: 'Капитал и заеми' },
  { code: '153', name: 'Кредитни карти', type: 'Пасив', group: 'Капитал и заеми' },
  { code: '156', name: 'Овърдрафт', type: 'Пасив', group: 'Капитал и заеми' },
  { code: '159', name: 'Други заеми и дългове', type: 'Пасив', group: 'Капитал и заеми' },
  
  // РАЗДЕЛ 2: ДЪЛГОТРАЙНИ АКТИВИ
  // Група 20: ДМА
  { code: '201', name: 'Земи (терени)', type: 'Актив', group: 'ДМА' },
  { code: '202', name: 'Сгради и конструкции', type: 'Актив', group: 'ДМА' },
  { code: '203', name: 'Компютърна техника', type: 'Актив', group: 'ДМА' },
  { code: '204', name: 'Съоръжения', type: 'Актив', group: 'ДМА' },
  { code: '205', name: 'Машини и оборудване', type: 'Актив', group: 'ДМА' },
  { code: '206', name: 'Транспортни средства', type: 'Актив', group: 'ДМА' },
  { code: '207', name: 'Офис обзавеждане', type: 'Актив', group: 'ДМА' },
  { code: '209', name: 'Други дълготрайни материални активи', type: 'Актив', group: 'ДМА' },
  
  // Група 21: Нематериални активи
  { code: '211', name: 'Продукти от развойна дейност', type: 'Актив', group: 'ДМА' },
  { code: '212', name: 'Програмни продукти', type: 'Актив', group: 'ДМА' },
  { code: '213', name: 'Права върху интелектуална собственост', type: 'Актив', group: 'ДМА' },
  
  // Група 24: Амортизации (корекционни)
  { code: '241', name: 'Натрупана амортизация на ДМА', type: 'Корекционна', group: 'Амортизации' },
  { code: '242', name: 'Натрупана амортизация на нематериални активи', type: 'Корекционна', group: 'Амортизации' },
  
  // РАЗДЕЛ 3: ЗАПАСИ
  // Група 30: Суровини, материали, продукция и стоки
  { code: '301', name: 'Доставки', type: 'Актив', group: 'Запаси' },
  { code: '302', name: 'Суровини/Материали', type: 'Актив', group: 'Запаси' },
  { code: '303', name: 'Продукти', type: 'Актив', group: 'Запаси' },
  { code: '304', name: 'Стоки', type: 'Актив', group: 'Запаси' },
  
  // РАЗДЕЛ 4: РАЗЧЕТИ
  // Група 40: Доставчици
  { code: '401', name: 'Задължения към доставчици', type: 'Пасив', group: 'Доставчици и клиенти' },
  { code: '402', name: 'Вземания от доставчици по аванси', type: 'Актив', group: 'Доставчици и клиенти' },
  { code: '403', name: 'Задължения към доставчици по търговски кредити', type: 'Пасив', group: 'Доставчици и клиенти' },
  { code: '409', name: 'Други задължения към доставчици', type: 'Пасив', group: 'Доставчици и клиенти' },
  
  // Група 41: Клиенти
  { code: '411', name: 'Вземания от клиенти', type: 'Актив', group: 'Доставчици и клиенти' },
  { code: '412', name: 'Задължения към клиенти по аванси', type: 'Пасив', group: 'Доставчици и клиенти' },
  { code: '413', name: 'Вземания от клиенти по търговски кредити', type: 'Актив', group: 'Доставчици и клиенти' },
  { code: '419', name: 'Други вземания от клиенти', type: 'Актив', group: 'Доставчици и клиенти' },
  
  // Група 42: Персонал
  { code: '421', name: 'Задължения към персонал', type: 'Пасив', group: 'Персонал' },
  { code: '422', name: 'Разчети с подотчетни лица', type: 'Актив', group: 'Персонал' },
  { code: '423', name: 'Задължения по неизползвани отпуски', type: 'Пасив', group: 'Персонал' },
  
  // Група 45: Данъци (частично)
  { code: '453', name: 'Данък върху добавената стойност (ДДС)', type: 'Пасив', group: 'Данъци' },
  { code: '454', name: 'Разчети за данъци върху доходи', type: 'Пасив', group: 'Данъци' },
  
  // Група 46: Осигуровки
  { code: '461', name: 'Разчети за задължително социално осигуряване', type: 'Пасив', group: 'Осигуровки' },
  { code: '463', name: 'Разчети за здравно осигуряване', type: 'Пасив', group: 'Осигуровки' },
  
  // РАЗДЕЛ 5: ПАРИЧНИ СРЕДСТВА
  // Група 50: Парични средства
  { code: '501', name: 'Каса в левове', type: 'Актив', group: 'Парични средства' },
  { code: '502', name: 'Каса във валута', type: 'Актив', group: 'Парични средства' },
  { code: '503', name: 'Разплащателна сметка в левове', type: 'Актив', group: 'Парични средства' },
  { code: '504', name: 'Разплащателна сметка във валута', type: 'Актив', group: 'Парични средства' },
  { code: '505', name: 'Акредитиви', type: 'Актив', group: 'Парични средства' },
  
  // РАЗДЕЛ 6: РАЗХОДИ
  // Група 60: Разходи по икономически елементи
  { code: '601', name: 'Разходи за материали', type: 'Разход', group: 'Разходи' },
  { code: '602', name: 'Разходи за външни услуги', type: 'Разход', group: 'Разходи' },
  { code: '603', name: 'Разходи за амортизация', type: 'Разход', group: 'Разходи' },
  { code: '604', name: 'Разходи за заплати', type: 'Разход', group: 'Разходи' },
  { code: '605', name: 'Разходи за осигуровки', type: 'Разход', group: 'Разходи' },
  { code: '606', name: 'Разходи за данъци и такси', type: 'Разход', group: 'Разходи' },
  { code: '609', name: 'Други разходи', type: 'Разход', group: 'Разходи' },
  
  // Група 61: Разходи за дейността
  { code: '611', name: 'Разходи за основна дейност', type: 'Разход', group: 'Разходи' },
  { code: '614', name: 'Административни разходи', type: 'Разход', group: 'Разходи' },
  { code: '615', name: 'Разходи за продажби', type: 'Разход', group: 'Разходи' },
  
  // Група 62: Финансови разходи
  { code: '621', name: 'Разходи за лихви', type: 'Разход', group: 'Разходи' },
  { code: '624', name: 'Разходи от валутни операции', type: 'Разход', group: 'Разходи' },
  
  // РАЗДЕЛ 7: ПРИХОДИ
  // Група 70: Приходи от продажби
  { code: '701', name: 'Приходи от продажби на продукти', type: 'Приход', group: 'Приходи' },
  { code: '702', name: 'Приходи от продажби на стоки', type: 'Приход', group: 'Приходи' },
  { code: '703', name: 'Приходи от продажби на услуги', type: 'Приход', group: 'Приходи' },
  { code: '704', name: 'Приходи от наеми', type: 'Приход', group: 'Приходи' },
  { code: '705', name: 'Приходи от продажби на ДМА', type: 'Приход', group: 'Приходи' },
  { code: '709', name: 'Други приходи от дейността', type: 'Приход', group: 'Приходи' },
  
  // Група 72: Финансови приходи
  { code: '721', name: 'Приходи от лихви', type: 'Приход', group: 'Приходи' },
  { code: '722', name: 'Приходи от съучастия', type: 'Приход', group: 'Приходи' },
  { code: '724', name: 'Приходи от валутни операции', type: 'Приход', group: 'Приходи' },
];

const typeColors: Record<string, string> = {
  'Актив': '#5B3FD6',      // Лилаво
  'Пасив': '#DC2626',      // Червено
  'Капитал': '#F59E0B',    // Златно
  'Приход': '#16A34A',     // Зелено
  'Разход': '#D97706',     // Оранжево
  'Корекционна': '#64748B' // Сиво
};

export default function Smetkoplan() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Всички');

  const filteredAccounts = accounts.filter(acc => {
    const matchesSearch = acc.code.includes(search) || acc.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'Всички' || acc.type === filter;
    return matchesSearch && matchesFilter;
  });

  const groups = [...new Set(filteredAccounts.map(a => a.group))];

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FC' }}>
      <header style={{ 
        background: 'linear-gradient(135deg, #3E2A9C 0%, #5B3FD6 100%)',
        color: 'white',
        padding: '20px 40px',
        boxShadow: '0 4px 20px rgba(62, 42, 156, 0.3)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowLeft size={24} />
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Accountify</span>
            </Link>
          </div>
          <h1 style={{ margin: 0, fontSize: '20px', opacity: 0.9 }}>Сметкоплан (НСС)</h1>
        </div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px' }}>
        <div style={{ 
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(62, 42, 156, 0.1)',
          border: '1px solid rgba(91, 63, 214, 0.1)',
          marginBottom: '24px'
        }}>
          <h2 style={{ color: '#3E2A9C', margin: '0 0 20px 0', fontSize: '24px' }}>Търсене в сметкоплана</h2>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} size={20} />
              <input
                type="text"
                placeholder="Търси по код или име..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  borderRadius: '8px',
                  border: '2px solid #E5E7EB',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: '2px solid #E5E7EB',
                fontSize: '16px',
                cursor: 'pointer',
                background: 'white',
                color: '#1F2937'
              }}
            >
              <option value="Всички">Всички типове</option>
              <option value="Актив">Актив</option>
              <option value="Пасив">Пасив</option>
              <option value="Капитал">Капитал</option>
              <option value="Приход">Приход</option>
              <option value="Разход">Разход</option>
              <option value="Корекционна">Корекционна</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {Object.entries(typeColors).map(([type, color]) => (
              <span key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#1F2937' }}>
                <span style={{ width: '12px', height: '12px', backgroundColor: color, borderRadius: '50%', display: 'inline-block' }}></span>
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Results */}
        {groups.map(group => (
          <div key={group} style={{ marginBottom: '32px' }}>
            <h3 style={{ color: '#3E2A9C', fontSize: '18px', marginBottom: '16px', paddingBottom: '8px', borderBottom: '2px solid rgba(91, 63, 214, 0.2)' }}>
              {group}
            </h3>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              {filteredAccounts.filter(a => a.group === group).map(account => (
                <div key={account.code} style={{
                  background: 'white',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(91, 63, 214, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{
                      background: typeColors[account.type],
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      minWidth: '60px',
                      textAlign: 'center'
                    }}>
                      {account.code}
                    </span>
                    <span style={{ fontSize: '16px', color: '#1F2937', fontWeight: 500 }}>
                      {account.name}
                    </span>
                  </div>
                  
                  <span style={{
                    background: `${typeColors[account.type]}15`,
                    color: typeColors[account.type],
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {account.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredAccounts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
            <BookOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p>Няма намерени сметки за "{search}"</p>
          </div>
        )}

        <div style={{
          background: 'linear-gradient(135deg, #3E2A9C 0%, #5B3FD6 100%)',
          borderRadius: '16px',
          padding: '24px',
          color: 'white',
          textAlign: 'center',
          marginTop: '40px'
        }}>
          <p style={{ margin: 0, fontSize: '16px' }}>
            Общо <strong style={{ color: '#F59E0B' }}>{filteredAccounts.length}</strong> сметки в сметкоплана
          </p>
        </div>
      </main>
    </div>
  );
}