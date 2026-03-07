"use client";

import Link from "next/link";

export default function Simulator() {
  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-yellow-400">← Назад</Link>
        <h1 className="text-3xl font-bold mt-4 mb-6">Симулатор</h1>
        
        <div className="bg-slate-800 rounded-xl p-6">
          <p className="text-gray-300 mb-4">Тук ще можеш да практикуваш с реални счетоводни сценарии.</p>
          <div className="bg-slate-700 p-4 rounded-lg">
            <p className="text-amber-400 font-bold">Скоро ще бъде добавена пълна функционалност...</p>
          </div>
        </div>
      </div>
    </main>
  );
}
