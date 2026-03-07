"use client";

import Link from "next/link";
import { useState } from "react";

export default function MissionPage() {
  const [step, setStep] = useState(1);
  
  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-yellow-400">← Назад</Link>
        <h1 className="text-2xl font-bold mt-4">Отвори банкова сметка</h1>
        <p>Стъпка {step} от 2</p>
        
        <div className="mt-6 bg-slate-800 p-6 rounded-xl">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Избери банка</h2>
              <button onClick={() => setStep(2)} className="bg-amber-500 text-slate-900 px-4 py-2 rounded-lg mr-2">УниКредит</button>
              <button onClick={() => setStep(2)} className="bg-amber-500 text-slate-900 px-4 py-2 rounded-lg mr-2">ОББ</button>
              <button onClick={() => setStep(2)} className="bg-amber-500 text-slate-900 px-4 py-2 rounded-lg">ДСК</button>
            </div>
          )}
          
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Въведи данни</h2>
              <input placeholder="IBAN" className="w-full p-2 rounded bg-slate-700 mb-2" />
              <input placeholder="Вид сметка" className="w-full p-2 rounded bg-slate-700 mb-2" />
              <button onClick={() => alert("Мисията завършена! +50 XP")} className="bg-green-500 text-white px-4 py-2 rounded-lg w-full mt-4">Завърши</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
