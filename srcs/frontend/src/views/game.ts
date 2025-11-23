<<<<<<< HEAD
import { initializePongGame } from '../game/pong';
=======
import { initializePongGame } from '../game/script';
>>>>>>> bf8cea7 (frontend tailwind css renewed)
import { loadSession } from '../utils/storage';

export const renderGameView = (container: HTMLElement) => {
  if (!loadSession()) {
    location.hash = '/auth';
    return;
  }
<<<<<<< HEAD
  const root = document.createElement('main');
  root.className = 'app game';
  root.innerHTML = `
    <header class="app__header">
      <div>
        <h1>Pong Prototipi</h1>
        <p>W/S ve ↑/↓ tuşlarıyla raketleri kontrol edebilirsin.</p>
      </div>
      <div class="game__controls">
        <div class="game__keys">
          <p><strong>Oyuncu A:</strong> W / S</p>
          <p><strong>Oyuncu B:</strong> ↑ / ↓</p>
        </div>
        <button class="button button--secondary" type="button" data-action="leave">Oyundan Çık</button>
      </div>
    </header>
    <section class="game__canvas-wrapper">
      <canvas></canvas>
      <div class="game__score">
        <span data-score="a">A: 0</span>
        <span data-score="b">B: 0</span>
      </div>
    </section>
    <section class="game__status" data-status>
      <p>Paddle'ları (W/S ve ↑/↓) hareket ettirerek oyunu başlat. İlk 10 puan alan kazanır.</p>
    </section>
=======

  // Container'ın stillerini temizle
  container.className = '';
  container.style.cssText = '';

  const root = document.createElement('main');
  root.className = 'min-h-screen bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900';
  root.innerHTML = `
    <header class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg border-b border-slate-700/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div class="flex-1">
            <p class="uppercase text-xs tracking-wider text-slate-400 mb-3 font-bold">Pong Oyunu</p>
            <h1 class="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-tight pb-2 leading-tight">Ping Pong</h1>
            <p class="text-slate-400 mt-4 text-lg">W/S ve ↑/↓ tuşlarıyla raketleri kontrol edebilirsin.</p>
          </div>
          <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div class="rounded-xl bg-white/10 backdrop-blur-sm p-4 border border-white/20">
              <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kontroller</p>
              <div class="space-y-1 text-sm text-slate-300">
                <p><span class="font-semibold text-sky-400">Oyuncu A:</span> W / S</p>
                <p><span class="font-semibold text-sky-400">Oyuncu B:</span> ↑ / ↓</p>
              </div>
            </div>
            <button class="px-6 py-3 rounded-xl font-bold text-sm bg-white/10 backdrop-blur-sm text-red-400 border-2 border-red-500/30 transition-all duration-300 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 hover:scale-105 transform self-start lg:self-auto" type="button" data-action="leave">Oyundan Çık</button>
          </div>
        </div>
      </div>
    </header>
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="relative flex flex-col items-center">
        <div class="relative w-full max-w-4xl">
          <canvas class="w-full h-auto rounded-2xl shadow-2xl border-2 border-white/20 bg-slate-800/50"></canvas>
          <div class="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
            <div class="px-6 py-3 rounded-xl bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 ring-1 ring-white/10">
              <span class="text-sm font-bold text-slate-600 uppercase tracking-wider">Oyuncu A</span>
              <span class="ml-3 text-2xl font-extrabold text-sky-600" data-score="a">A: 0</span>
            </div>
            <div class="px-6 py-3 rounded-xl bg-white/95 backdrop-blur-xl shadow-lg border border-white/20 ring-1 ring-white/10">
              <span class="text-sm font-bold text-slate-600 uppercase tracking-wider">Oyuncu B</span>
              <span class="ml-3 text-2xl font-extrabold text-indigo-600" data-score="b">B: 0</span>
            </div>
          </div>
        </div>
      </div>
    </section>
>>>>>>> bf8cea7 (frontend tailwind css renewed)
  `;

  container.appendChild(root);

  const canvas = root.querySelector('canvas');
  const scoreAEl = root.querySelector<HTMLElement>('[data-score="a"]');
  const scoreBEl = root.querySelector<HTMLElement>('[data-score="b"]');
<<<<<<< HEAD
  const statusEl = root.querySelector<HTMLElement>('[data-status]');

  if (!canvas || !scoreAEl || !scoreBEl || !statusEl) {
    throw new Error('Oyun bileşenleri oluşturulamadı.');
  }

=======

  if (!canvas || !scoreAEl || !scoreBEl) {
    throw new Error('Oyun bileşenleri oluşturulamadı.');
  }

  // Status element'i kaldırıldı, null gönderiyoruz
  const statusEl = null;
>>>>>>> bf8cea7 (frontend tailwind css renewed)
  const cleanup = initializePongGame(canvas, scoreAEl, scoreBEl, statusEl);

  const leaveButton = root.querySelector<HTMLButtonElement>('[data-action="leave"]');
  leaveButton?.addEventListener('click', () => {
    location.hash = '/dashboard';
  });

  return () => {
    cleanup();
  };
};
