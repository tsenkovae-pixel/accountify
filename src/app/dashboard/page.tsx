"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const startMission = (missionId: string) => {
    router.push(`/missions/${missionId}`);
  };

  const goToChat = () => {
    router.push("/chat");
  };

  const goToSmetkoplan = () => {
    router.push("/smetkoplan");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-400">Accountify</h1>
          <div className="flex gap-4">
            <Link href="/" className="text-white hover:text-yellow-400">Начало</Link>
            <Link href="/smetkoplan" className="text-white hover:text-yellow-400">Сметкоплан</Link>
            <button onClick={goToChat} className="bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-400">
              AI Асистент
            </button>
          </div>
        </div>

        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Здравей, Счетоводителю! 👋</h2>
          <p className="text-gray-300">Седмица 1 от 8 - Време е да започнеш своята фирма</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Твоят прогрес</h3>
                <span className="text-yellow-400 font-bold">0%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-yellow-400 to-amber-500 h-3 rounded-full" style={{width: "0%"}}></div>
              </div>
              <p className="text-sm text-gray-400 mt-2">Завърши мисиите по-долу, за да продължиш</p>
            </div>

            {/* Active Missions */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Активни мисии
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-slate-700/50 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-500"></div>
                    <div>
                      <div className="font-bold">Регистрирай фирма в ТР</div>
                      <div className="text-sm text-gray-400">Награда: 100 XP</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => startMission("register-company")}
                    className="bg-amber-500 text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-amber-400"
                  >
                    Старт
                  </button>
                </div>

                <div className="flex items-center justify-between bg-slate-700/50 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-500"></div>
                    <div>
                      <div className="font-bold">Отвори банкова сметка</div>
                      <div className="text-sm text-gray-400">Награда: 50 XP</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => startMission("open-bank")}
                    className="bg-amber-500 text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-amber-400"
                  >
                    Старт
                  </button>
                </div>

                <div className="flex items-center justify-between bg-slate-700/50 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-500"></div>
                    <div>
                      <div className="font-bold">Направи първата операция</div>
                      <div className="text-sm text-gray-400">Награда: 150 XP</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => startMission("first-operation")}
                    className="bg-amber-500 text-slate-900 px-4 py-2 rounded-lg font-bold hover:bg-amber-400"
                  >
                    Старт
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Access */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h3 className="font-bold text-lg mb-4">Бърз достъп</h3>
              
              <div className="space-y-3">
                <button 
                  onClick={goToSmetkoplan}
                  className="w-full flex items-center gap-3 bg-slate-700 p-4 rounded-xl hover:bg-slate-600 transition text-left"
                >
                  <span className="text-2xl">📊</span>
                  <div>
                    <div className="font-bold">Сметкоплан</div>
                    <div className="text-sm text-gray-400">Всички сметки с обяснения</div>
                  </div>
                </button>

                <button 
                  onClick={() => startMission("simulator")}
                  className="w-full flex items-center gap-3 bg-slate-700 p-4 rounded-xl hover:bg-slate-600 transition text-left"
                >
                  <span className="text-2xl">🎮</span>
                  <div>
                    <div className="font-bold">Симулатор</div>
                    <div className="text-sm text-gray-400">Практика с реални сценарии</div>
                  </div>
                </button>

                <button 
                  onClick={goToChat}
                  className="w-full flex items-center gap-3 bg-slate-700 p-4 rounded-xl hover:bg-slate-600 transition text-left"
                >
                  <span className="text-2xl">🤖</span>
                  <div>
                    <div className="font-bold">AI Асистент</div>
                    <div className="text-sm text-gray-400">Помощ от изкуствен интелект</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Daily Tip */}
            <div className="bg-gradient-to-br from-amber-500 to-yellow-400 rounded-2xl p-6 text-slate-900">
              <h3 className="font-bold text-lg mb-2">💡 Съвет за деня</h3>
              <p className="text-sm mb-4">
                Всяка фирма започва с основен капитал. Той се отразява в сметка 101 и винаги е пасивна сметка (увеличава се в кредит).
              </p>
              <Link href="/accounts/101">
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800">
                  Научи повече →
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
                <div className="text-2xl font-bold text-yellow-400">0</div>
                <div className="text-xs text-gray-400">Обработени фактури</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
                <div className="text-2xl font-bold text-yellow-400">0%</div>
                <div className="text-xs text-gray-400">Точни отговори</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700">
                <div className="text-2xl font-bold text-yellow-400">0 лв.</div>
                <div className="text-xs text-gray-400">Печалба</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}