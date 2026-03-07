'use client';

import React, { useState } from 'react';
import { Lightbulb, CheckCircle, ArrowRight, BookOpen, X } from 'lucide-react';

interface AITutorProps {
  task: {
    id: number;
    title: string;
    document: any;
    expectedEntry: any[];
  };
  studentEntry: any[];
  attemptNumber: number;
  onSolutionUnlock?: () => void;
}

export default function AITutor({ task, studentEntry, attemptNumber, onSolutionUnlock }: AITutorProps) {
  const [hint, setHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Намираме правилните сметки от expectedEntry
  const getExpectedAccounts = () => {
    const debitEntry = task.expectedEntry.find(e => e.side === 'debit') || task.expectedEntry[0];
    const creditEntry = task.expectedEntry.find(e => e.side === 'credit') || task.expectedEntry[1];
    return {
      debit: debitEntry?.accountCode,
      credit: creditEntry?.accountCode,
      debitName: debitEntry?.accountName,
      creditName: creditEntry?.accountName
    };
  };

  // 1. БУТОН "ПОДСКАЗКА"
  const handleHint = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'normal',
          attemptNumber: attemptNumber,
          evaluation: { correct: false },
          task: task,
          userEntry: studentEntry
        })
      });

      const data = await response.json();
      if (data.hint) setHint(data.hint);
      else setHint('💡 Помисли: Коя сметка се увеличава при тази операция? (Това е дебитът)');
    } catch (error) {
      setHint('❌ Грешка при свързване с AI Tutor');
    }
    setLoading(false);
  };

  // 2. БУТОН "ПРОВЕРИ"
  const handleCheck = async () => {
    const userDebit = studentEntry.find(e => e.side === 'debit')?.accountCode;
    const userCredit = studentEntry.find(e => e.side === 'credit')?.accountCode;
    
    if (!userDebit || !userCredit) {
      setHint('⚠️ Избери дебит и кредит сметка първо!');
      return;
    }

    setLoading(true);
    const expected = getExpectedAccounts();
    const isCorrect = userDebit === expected.debit && userCredit === expected.credit;

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: isCorrect ? 'success' : 'strict',
          attemptNumber: attemptNumber,
          evaluation: { correct: isCorrect },
          task: task,
          userEntry: studentEntry
        })
      });

      const data = await response.json();
      setHint(data.hint || (isCorrect ? '✅ Правилно!' : '❌ Грешка, опитай пак'));
    } catch (error) {
      setHint(isCorrect ? '✅ Правилно!' : `❌ Грешка! Трябва: Дебит ${expected.debit}, Кредит ${expected.credit}`);
    }
    setLoading(false);
  };

  // 3. БУТОН "РЕШЕНИЕ"
  const handleSolution = async () => {
    setLoading(true);
    const expected = getExpectedAccounts();
    
    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'revealing',
          attemptNumber: 3,
          evaluation: { correct: false },
          task: task,
          userEntry: studentEntry
        })
      });

      const data = await response.json();
      setHint(data.hint || `📚 **Решение:**\n\nДебит: ${expected.debit} ${expected.debitName}\nКредит: ${expected.credit} ${expected.creditName}`);
      if (onSolutionUnlock) onSolutionUnlock();
    } catch (error) {
      setHint(`📚 **Решение:**\n\nДебит: ${expected.debit} ${expected.debitName}\nКредит: ${expected.credit} ${expected.creditName}`);
    }
    setLoading(false);
  };

  // 4. БУТОН "СЛЕДВАЩА СТЪПКА"
  const handleNextStep = async () => {
    setLoading(true);
    const expected = getExpectedAccounts();
    
    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'guiding',
          attemptNumber: attemptNumber + 1,
          evaluation: { correct: false },
          task: task,
          userEntry: studentEntry
        })
      });

      const data = await response.json();
      setHint(data.hint || `💡 Разгледай документа: Ако получаваш пари в банка, дебитът е ${expected.debit}, а кредитът е ${expected.credit}`);
    } catch (error) {
      setHint(`💡 Помисли: Дебитът е ${expected.debit} (${expected.debitName}), защото се увеличава актив`);
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-800/90 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <h3 className="text-lg font-bold text-white">AI Tutor</h3>
        </div>
        <span className="text-sm text-gray-400">Опит {attemptNumber}</span>
      </div>

      {/* БУТОНИТЕ */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button onClick={handleHint} disabled={loading} className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 rounded-xl text-sm font-medium text-yellow-200">
          <Lightbulb className="w-4 h-4" /> Подсказка
        </button>

        <button onClick={handleCheck} disabled={loading} className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-xl text-sm font-medium text-green-200">
          <CheckCircle className="w-4 h-4" /> Провери
        </button>

        <button onClick={handleNextStep} disabled={loading} className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-xl text-sm font-medium text-indigo-200">
          <ArrowRight className="w-4 h-4" /> Следваща стъпка
        </button>

        <button onClick={handleSolution} disabled={loading} className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl text-sm font-medium text-purple-200">
          <BookOpen className="w-4 h-4" /> Решение
        </button>
      </div>

      {/* ПОКАЗВАНЕ НА ОТГОВОР */}
      {hint && (
        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">{hint}</p>
            </div>
            <button onClick={() => setHint(null)} className="p-1 hover:bg-white/10 rounded-full text-gray-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {loading && <div className="text-center py-2 text-gray-400 text-sm">Зареждане...</div>}
    </div>
  );
}