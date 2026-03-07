'use client';

import { useState, useEffect } from 'react';
import { ExamGate } from '@/components/exam/ExamGate';

// Тестови задачи (при теб са от Supabase, но за примера са тук)
const exercises = [
  {
    id: 1,
    week_number: 1,
    difficulty: 'Лесно',
    xp_points: 100,
    title: "Внасяне на капитал",
    scenario: "Собственикът внася 10 000 лв. в брой като основен капитал.",
    question: "Каква е счетоводната статия?",
    hints: ["Касата се увеличава", "Капиталът се увеличава"]
  },
  {
    id: 2,
    week_number: 1,
    difficulty: 'Лесно',
    xp_points: 100,
    title: "Покупка на материали",
    scenario: "Закупени са материали за 500 лв., платени в брой.",
    question: "Каква е счетоводната статия?",
    hints: ["Разходите се увеличават", "Касата намалява"]
  },
  {
    id: 3,
    week_number: 2,
    difficulty: 'Средно',
    xp_points: 150,
    title: "Продажба с отложено плащане",
    scenario: "Издадена е фактура за продажба на стоки за 2 000 лв. с отложено плащане.",
    question: "Каква е счетоводната статия?",
    hints: ["Клиентът ни дължи пари", "Приходите се увеличават"]
  }
];

export default function Exercises() {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Зареждаме от localStorage при първоначално зареждане
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('completedTasks');
    if (saved) {
      try {
        setCompletedTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Грешка при зареждане от localStorage");
      }
    }
  }, []);

  // Запазваме в localStorage при всяка промяна
  useEffect(() => {
    if (isClient && completedTasks.length > 0) {
      localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }
  }, [completedTasks, isClient]);

  const markAsComplete = (id: number) => {
    if (!completedTasks.includes(id)) {
      const newCompleted = [...completedTasks, id];
      setCompletedTasks(newCompleted);
    }
  };

  const resetProgress = () => {
    if (confirm('Сигурна ли си, че искаш да нулираш прогреса?')) {
      setCompletedTasks([]);
      localStorage.removeItem('completedTasks');
    }
  };

  const allTasksCompleted = completedTasks.length === exercises.length;

  if (!isClient) {
    return <div className="p-8 text-center">Зареждане...</div>;
  }

  return (
    <main className="min-h-screen bg-green-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green-900">✏️ Упражнения</h1>
          {completedTasks.length > 0 && (
            <button 
              onClick={resetProgress}
              className="text-sm text-red-500 hover:text-red-700 underline"
            >
              Нулирай прогреса
            </button>
          )}
        </div>
        
        <div className="grid gap-6 mb-12">
          {exercises.map((ex) => (
            <div key={ex.id} className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${completedTasks.includes(ex.id) ? 'border-blue-500' : 'border-green-500'}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                  Седмица {ex.week_number}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  ex.difficulty === 'Лесно' ? 'bg-green-100 text-green-800' :
                  ex.difficulty === 'Средно' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>{ex.difficulty}</span>
                <span className="text-purple-600 font-bold">+{ex.xp_points} XP</span>
                
                {completedTasks.includes(ex.id) && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold ml-auto">
                    ✓ Решено
                  </span>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-gray-800 mb-2">{ex.title}</h2>
              <p className="text-gray-600 mb-4">{ex.scenario}</p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="font-semibold text-gray-700 mb-2">Въпрос:</p>
                <p className="text-gray-600">{ex.question}</p>
              </div>
              
              <div className="flex gap-2 mb-4">
                {ex.hints?.map((hint: string, idx: number) => (
                  <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    💡 {hint}
                  </span>
                ))}
              </div>

              {!completedTasks.includes(ex.id) ? (
                <button
                  onClick={() => markAsComplete(ex.id)}
                  className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  ✓ Маркирай като решено
                </button>
              ) : (
                <div className="w-full py-2 bg-gray-200 text-gray-600 rounded-lg text-center font-medium">
                  ✓ Завършено
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ИЗПИТЪТ */}
        {allTasksCompleted ? (
          <div className="mt-8">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6 mb-6 text-center">
              <h2 className="text-2xl font-bold text-purple-800 mb-2">
                🎉 Браво! Завърши всички упражнения!
              </h2>
              <p className="text-purple-700">
                Сега можеш да се изправиш пред финалния изпит. 
                Той се генерира от AI и е различен всеки път.
              </p>
            </div>

            <ExamGate 
              level="intern" 
              isUnlocked={true}
              onExamComplete={(score, passed) => {
                if (passed) {
                  alert(`🎉 Поздравления! Премина с ${score}%!\n\nМожеш да продължиш към следващото ниво!`);
                  // Тук можеш да добавиш: localStorage.setItem('examPassed', 'true');
                } else {
                  alert(`❌ Събрани ${score}% от верни отговори.\n\nНужни са минимум 70% за преминаване.\nОпитай отново - задачите ще са различни!`);
                }
              }}
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 text-center sticky bottom-4">
            <p className="font-semibold text-gray-700 mb-2">
              Прогрес: {completedTasks.length} / {exercises.length} задачи
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all" 
                style={{ width: `${(completedTasks.length / exercises.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              Реши още {exercises.length - completedTasks.length} задачи, за да отключиш изпита.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}