'use client';

import { useState, useEffect } from 'react';

interface ExamGateProps {
  level: "intern" | "junior";
  isUnlocked: boolean;
  onExamComplete: (score: number, passed: boolean) => void;
}

const ACCOUNT_EXPLANATIONS: Record<string, string> = {
  "101": "Сметка 101 - Основен капитал: Пасивна сметка, увеличава се при внасяне на капитал",
  "401": "Сметка 401 - Доставчици: Пасивна сметка, задължения към доставчици",
  "411": "Сметка 411 - Клиенти: Активна сметка, наши вземания от клиенти",
  "501": "Сметка 501 - Каса: Активна сметка, налични пари в касата",
  "503": "Сметка 503 - Банка: Активна сметка, парични средства по банка",
  "601": "Сметка 601 - Материали: Разходна сметка за закупени материали",
  "702": "Сметка 702 - Приходи от продажби: Приходна сметка при реализация на продажби",
  "203": "Сметка 203 - ДМА: Дълготрайни материални активи (оборудване)",
  "207": "Сметка 207 - ДМА: Дълготрайни материални активи (обзавеждане)",
  "604": "Сметка 604 - Разходи за заплати: Разходна сметка за възнаграждения",
  "421": "Сметка 421 - Задължения за заплати: Пасивна сметка за неизплатени заплати"
};

export function ExamGate({ level, isUnlocked, onExamComplete }: ExamGateProps) {
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState<any>(null);
  const [currentTask, setCurrentTask] = useState(0);
  const [answers, setAnswers] = useState<Record<string, {debit: string, credit: string}>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<any[]>([]);
  const [showRemedial, setShowRemedial] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Зареждаме от localStorage при стартиране (само на клиент)
  useEffect(() => {
    setIsClient(true);
    if (typeof window === 'undefined') return;
    
    try {
      const savedExam = localStorage.getItem('currentExam');
      const savedProgress = localStorage.getItem('examProgress');
      
      if (savedExam && savedProgress) {
        const exam = JSON.parse(savedExam);
        const progress = JSON.parse(savedProgress);
        setExamData(exam);
        setCurrentTask(progress.currentTask || 0);
        setAnswers(progress.answers || {});
        setAttempts(progress.attempts || {});
      }
    } catch (e) {
      console.error("Грешка при зареждане на изпит");
    }
  }, []);

  // Запазваме при всяка промяна (само на клиент)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isClient && examData) {
      localStorage.setItem('currentExam', JSON.stringify(examData));
      localStorage.setItem('examProgress', JSON.stringify({
        currentTask,
        answers,
        attempts
      }));
    }
  }, [examData, currentTask, answers, attempts, isClient]);

  const startExam = async () => {
    // Изчистваме стар изпит (само на клиент)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentExam');
      localStorage.removeItem('examProgress');
    }
    
    setLoading(true);
    setAttempts({});
    setMistakes([]);
    setCurrentTask(0);
    setAnswers({});
    
    try {
      const res = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level })
      });
      
      const data = await res.json();
      setExamData(data);
      setShowResults(false);
    } catch (error) {
      alert('Грешка при зареждане на изпита');
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = () => {
    const task = examData.tasks[currentTask];
    const answer = answers[task.id];
    const currentAttempts = attempts[task.id] || 0;
    
    if (!answer?.debit || !answer?.credit) {
      alert('Моля избери дебит и кредит сметка!');
      return;
    }

    const correctDebit = task.correctEntry.debit[0].account;
    const correctCredit = task.correctEntry.credit[0].account;
    
    const isCorrect = answer.debit === correctDebit && answer.credit === correctCredit;
    const newAttempts = currentAttempts + 1;
    setAttempts({...attempts, [task.id]: newAttempts});

    if (isCorrect) {
      setFeedback({
        isCorrect: true,
        message: '✅ Правилно! Много добре!',
        explanation: `${ACCOUNT_EXPLANATIONS[correctDebit]}\n${ACCOUNT_EXPLANATIONS[correctCredit]}`
      });
    } else {
      const remainingAttempts = 2 - newAttempts;
      
      if (remainingAttempts > 0) {
        setFeedback({
          isCorrect: false,
          message: `❌ Грешно! Имаш още ${remainingAttempts} опит.`,
          explanation: `Подсказка: Помисли коя сметка нараства (дебит) и коя намалява (кредит).`
        });
      } else {
        setFeedback({
          isCorrect: false,
          message: `❌ Няма повече опити!`,
          explanation: `Правилният отговор е: Дебит ${correctDebit} / Кредит ${correctCredit}.\n\n${ACCOUNT_EXPLANATIONS[correctDebit]}\n${ACCOUNT_EXPLANATIONS[correctCredit]}`,
          showCorrect: true
        });
        
        setMistakes([...mistakes, {
          task: task,
          yourAnswer: answer,
          correctAnswer: {debit: correctDebit, credit: correctCredit}
        }]);
      }
    }
  };

  const nextTask = () => {
    setFeedback(null);
    if (currentTask < examData.tasks.length - 1) {
      setCurrentTask(currentTask + 1);
    } else {
      calculateFinalScore();
    }
  };

  const calculateFinalScore = () => {
    let correct = 0;
    const mistakesList: any[] = [];
    
    examData.tasks.forEach((task: any) => {
      const ans = answers[task.id];
      const correctDebit = task.correctEntry.debit[0].account;
      const correctCredit = task.correctEntry.credit[0].account;
      
      if (ans?.debit === correctDebit && ans?.credit === correctCredit) {
        correct++;
      } else {
        mistakesList.push({
          task: task,
          yourAnswer: ans || {debit: 'неизбрана', credit: 'неизбрана'},
          correctAnswer: {debit: correctDebit, credit: correctCredit}
        });
      }
    });
    
    const percentage = Math.round((correct / examData.tasks.length) * 100);
    setScore(percentage);
    setMistakes(mistakesList);
    setShowResults(true);
    
    // Запазваме резултата в историята (само на клиент)
    if (typeof window !== 'undefined') {
      const history = JSON.parse(localStorage.getItem('examHistory') || '[]');
      history.push({
        date: new Date().toISOString(),
        score: percentage,
        level: level,
        passed: percentage >= 70
      });
      localStorage.setItem('examHistory', JSON.stringify(history));
      
      // Изчистваме текущия изпит
      localStorage.removeItem('currentExam');
      localStorage.removeItem('examProgress');
    }
  };

  const analyzeWeakAreas = () => {
    const weakAccounts: Record<string, number> = {};
    mistakes.forEach(mistake => {
      const correctDebit = mistake.correctAnswer.debit;
      const correctCredit = mistake.correctAnswer.credit;
      weakAccounts[correctDebit] = (weakAccounts[correctDebit] || 0) + 1;
      weakAccounts[correctCredit] = (weakAccounts[correctCredit] || 0) + 1;
    });
    return Object.entries(weakAccounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  };

  if (loading) return <div className="p-8 text-center">🔄 Зареждане...</div>;
  
  if (showResults) {
    const passed = score >= 70;
    const weakAreas = analyzeWeakAreas();
    
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 my-8">
        <div className={`text-center mb-8 p-6 rounded-xl ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className="text-5xl mb-3">{passed ? '🎉' : '❌'}</div>
          <h2 className="text-3xl font-bold mb-2">{passed ? 'Изпитът е преминат!' : 'Неуспешен опит'}</h2>
          <div className="text-4xl font-bold mb-2">{score}%</div>
          <p className="text-gray-600">{passed ? 'Браво!' : 'Нужни са минимум 70%'}</p>
        </div>

        {mistakes.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-red-700">📊 Анализ на грешките ({mistakes.length})</h3>
            <div className="bg-yellow-50 p-4 rounded-xl mb-6">
              <h4 className="font-bold mb-2">⚠️ Слаби области:</h4>
              <ul className="list-disc pl-5 space-y-2">
                {weakAreas.map(([account, count]) => (
                  <li key={account}><strong>{account}</strong> - {count} грешки<br/><span className="text-sm text-gray-500">{ACCOUNT_EXPLANATIONS[account]}</span></li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-gray-600 text-white rounded-lg">Нов изпит</button>
          <button onClick={() => onExamComplete(score, passed)} className="px-6 py-3 bg-purple-600 text-white rounded-lg">
            {passed ? 'Продължи →' : 'Опитай пак'}
          </button>
        </div>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="p-8 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl text-white text-center my-8">
        <h3 className="text-2xl font-bold mb-4">🎓 Финален Изпит</h3>
        <p className="mb-6">5 задачи | 2 опита | AI генерация</p>
        <button onClick={startExam} disabled={!isUnlocked} className={`px-8 py-4 rounded-lg font-bold ${isUnlocked ? 'bg-yellow-400 text-purple-900' : 'bg-gray-600'}`}>
          {isUnlocked ? 'Започни Изпита' : '🔒 Заключено'}
        </button>
      </div>
    );
  }

  const task = examData.tasks[currentTask];
  const currentAttempt = attempts[task.id] || 0;
  const remainingAttempts = 2 - currentAttempt;
  
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 my-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Задача {currentTask + 1} от {examData.tasks.length}</span>
          <span className={`text-sm font-bold ${remainingAttempts === 1 ? 'text-orange-500' : 'text-green-600'}`}>Опит {currentAttempt + 1} от 2</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${((currentTask + 1) / examData.tasks.length) * 100}%` }}></div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">{task.scenario}</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Документ:</span> <strong>{task.document.number}</strong></div>
          <div><span className="text-gray-500">Сума:</span> <strong>{task.document.amount.toLocaleString()} лв.</strong></div>
        </div>
      </div>

      {feedback && (
        <div className={`mb-6 p-4 rounded-xl border-2 ${feedback.isCorrect ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'}`}>
          <div className="font-bold text-lg mb-2">{feedback.message}</div>
          <div className="text-sm whitespace-pre-line mb-4">{feedback.explanation}</div>
          {(feedback.isCorrect || feedback.showCorrect) && (
            <button onClick={nextTask} className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold">
              {currentTask < examData.tasks.length - 1 ? 'Продължи →' : 'Завърши изпита'}
            </button>
          )}
        </div>
      )}

      {!feedback?.isCorrect && !feedback?.showCorrect && (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Дебит:</label>
              <select value={answers[task.id]?.debit || ''} onChange={(e) => setAnswers({...answers, [task.id]: {...(answers[task.id] || {}), debit: e.target.value}})} className="w-full p-3 border rounded-lg">
                <option value="">Избери...</option>
                <optgroup label="Активи">
                  <option value="501">501 - Каса</option>
                  <option value="503">503 - Банка</option>
                  <option value="411">411 - Клиенти</option>
                </optgroup>
                <optgroup label="Пасиви">
                  <option value="101">101 - Капитал</option>
                  <option value="401">401 - Доставчици</option>
                </optgroup>
                <optgroup label="Разходи/Приходи">
                  <option value="601">601 - Материали</option>
                  <option value="702">702 - Приходи</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Кредит:</label>
              <select value={answers[task.id]?.credit || ''} onChange={(e) => setAnswers({...answers, [task.id]: {...(answers[task.id] || {}), credit: e.target.value}})} className="w-full p-3 border rounded-lg">
                <option value="">Избери...</option>
                <optgroup label="Активи">
                  <option value="501">501 - Каса</option>
                  <option value="503">503 - Банка</option>
                </optgroup>
                <optgroup label="Пасиви">
                  <option value="101">101 - Капитал</option>
                  <option value="401">401 - Доставчици</option>
                </optgroup>
                <optgroup label="Разходи/Приходи">
                  <option value="601">601 - Материали</option>
                  <option value="702">702 - Приходи</option>
                </optgroup>
              </select>
            </div>
          </div>

          <button onClick={checkAnswer} className="w-full py-4 bg-purple-600 text-white rounded-lg font-bold">
            {feedback && !feedback.isCorrect ? 'Опитай пак' : 'Провери отговора'}
          </button>
        </>
      )}
    </div>
  );
}