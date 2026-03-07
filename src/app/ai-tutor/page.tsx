'use client';

import { useState } from 'react';

export default function AITutor() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<string[]>([]);

  const askQuestion = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    setAnswer('');
    setSources([]);
    
    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        setAnswer('Грешка: ' + data.error);
      } else {
        setAnswer(data.answer);
        setSources(data.sources?.map((s: any) => s.code) || []);
      }
    } catch (error) {
      setAnswer('Грешка при свързване със сървъра.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">🤖 AI Счетоводен Асистент</h1>
        <p className="text-gray-600 mb-8">
          Попитай ме за сметки, операции или конкретни случаи. Ще отговоря само базирайки се на сметкоплана.
        </p>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Пример: Как се отчита купуването на стока на кредит?"
            className="w-full p-4 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={askQuestion}
            disabled={loading || !question.trim()}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Мисля...' : 'Попитай'}
          </button>
        </div>
        
        {answer && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Отговор:</h2>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {answer}
            </div>
            
            {sources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">Използвани сметки: </span>
                <span className="text-sm font-medium text-blue-600">
                  {sources.join(', ')}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}