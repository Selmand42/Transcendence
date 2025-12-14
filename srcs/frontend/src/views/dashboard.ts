import { clearSession, loadSession, persistSession } from '../utils/storage';
import { escapeHtml } from '../utils/sanitize';
import { Chart, registerables } from 'chart.js';

// Chart.js'i kaydet
Chart.register(...registerables);

type ProfilePayload = {
  id: number;
  email: string;
  nickname: string;
  provider: 'local' | 'google';
  createdAt: string;
};

type UserStatsPayload = {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  totalScore: number;
  avgScore: number;
  longestWinStreak: number;
  recentGames: Array<{
    id: number;
    opponent: string;
    won: boolean;
    score: string;
    gameType: string;
    endedAt: string;
  }>;
  dailyStats: {
    games: number;
    wins: number;
    losses: number;
  };
  weeklyStats: {
    games: number;
    wins: number;
    losses: number;
  };
};

type GameSessionPayload = {
  id: number;
  player1: string;
  player2: string;
  winner: string;
  score: string;
  gameType: string;
  tournamentId: number | null;
  startedAt: string;
  endedAt: string;
  duration: number;
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
};

const renderHeader = (nickname: string) => `
  <header class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg border-b border-slate-700/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div class="flex-1">
          <p class="uppercase text-xs tracking-wider text-slate-400 mb-3 font-bold">Profil</p>
          <h1 class="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-tight pb-2 leading-tight" data-profile-field="nickname">${escapeHtml(nickname)}</h1>
        </div>
        <div class="flex gap-3 flex-wrap justify-end w-full sm:w-auto">
          <button class="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 text-white transition-all duration-300 hover:from-sky-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-sky-500/50 hover:scale-105 transform" type="button" data-action="play">Play Now</button>
          <button class="px-6 py-3 rounded-xl font-bold text-sm bg-white/10 backdrop-blur-sm text-sky-400 border-2 border-sky-500/30 transition-all duration-300 hover:bg-sky-500/20 hover:border-sky-500/50 hover:text-sky-300 hover:scale-105 transform" type="button" data-action="tournaments">Turnuvalar</button>
          <button class="px-6 py-3 rounded-xl font-bold text-sm bg-white/10 backdrop-blur-sm text-red-400 border-2 border-red-500/30 transition-all duration-300 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 hover:scale-105 transform" type="button" data-action="logout">Çıkış</button>
        </div>
      </div>
    </div>
  </header>
`;

const renderAccountSummary = (session: { id: number; nickname: string; provider: 'local' | 'google' }) => `
  <section class="rounded-3xl bg-white/95 backdrop-blur-xl p-10 shadow-2xl border border-white/20 ring-1 ring-white/10 mb-8">
    <h2 class="text-3xl font-extrabold text-slate-900 mb-6 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-20 after:h-1 after:bg-gradient-to-r after:from-sky-500 after:to-indigo-600 after:rounded-full">Hesap Özeti</h2>
    <dl class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-start gap-2 pb-6 border-b border-slate-200 last:border-b-0">
        <dt class="text-sm font-bold text-slate-600 uppercase tracking-wider min-w-[140px]">Kullanıcı ID</dt>
        <dd class="text-slate-900 font-semibold text-lg" data-profile-field="id">#${session.id}</dd>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-start gap-2 pb-6 border-b border-slate-200 last:border-b-0">
        <dt class="text-sm font-bold text-slate-600 uppercase tracking-wider min-w-[140px]">Takma Ad</dt>
        <dd class="flex-1">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-slate-900 font-semibold text-lg" data-profile-field="nicknameInline">${escapeHtml(session.nickname)}</span>
            <button class="p-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 transition-colors duration-200" type="button" data-action="edit-nickname" aria-label="Takma adı düzenle">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
          </div>
          <form class="hidden flex flex-col gap-3" data-nickname-form>
            <input type="text" name="nickname" data-nickname-input value="${escapeHtml(session.nickname)}" minlength="3" maxlength="48" required class="rounded-xl border-2 border-slate-300 bg-white/50 backdrop-blur-sm px-5 py-4 focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all duration-200"/>
            <div class="flex gap-3">
              <button class="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:from-sky-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform" type="submit">Kaydet</button>
              <button class="px-6 py-2.5 rounded-xl font-bold text-sm bg-white/10 backdrop-blur-sm text-slate-600 border-2 border-slate-300 hover:bg-slate-100 transition-all duration-300 hover:scale-105 transform" type="button" data-action="cancel-nickname">Vazgeç</button>
            </div>
            <p class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium mt-2 min-h-[48px] hidden" data-status="nickname"></p>
          </form>
        </dd>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-start gap-2 pb-6 border-b border-slate-200 last:border-b-0">
        <dt class="text-sm font-bold text-slate-600 uppercase tracking-wider min-w-[140px]">Giriş Provider</dt>
        <dd class="text-slate-900 font-semibold text-lg" data-profile-field="providerLabel">${session.provider === 'google' ? 'Google OAuth' : 'Local (manuel)'}</dd>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-start gap-2 pb-6 border-b border-slate-200 last:border-b-0">
        <dt class="text-sm font-bold text-slate-600 uppercase tracking-wider min-w-[140px]">Katılım Tarihi</dt>
        <dd class="text-slate-900 font-semibold text-lg" data-profile-field="createdAt">-</dd>
      </div>
    </dl>
  </section>
`;

const renderStatsCards = (stats: UserStatsPayload) => `
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div class="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-xl text-white">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-blue-100 text-sm font-medium mb-1">Toplam Oyun</p>
          <p class="text-3xl font-bold">${stats.totalGames}</p>
        </div>
        <div class="bg-white/20 rounded-full p-3">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </div>
      </div>
    </div>
    
    <div class="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 shadow-xl text-white">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-green-100 text-sm font-medium mb-1">Kazanma</p>
          <p class="text-3xl font-bold">${stats.wins}</p>
        </div>
        <div class="bg-white/20 rounded-full p-3">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      </div>
    </div>
    
    <div class="rounded-2xl bg-gradient-to-br from-red-500 to-red-600 p-6 shadow-xl text-white">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-red-100 text-sm font-medium mb-1">Kaybetme</p>
          <p class="text-3xl font-bold">${stats.losses}</p>
        </div>
        <div class="bg-white/20 rounded-full p-3">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
`;

const renderRecentGames = (recentGames: UserStatsPayload['recentGames']) => `
  <section class="rounded-3xl bg-white/95 backdrop-blur-xl p-10 shadow-2xl border border-white/20 ring-1 ring-white/10 mb-8">
    <h2 class="text-3xl font-extrabold text-slate-900 mb-6 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-20 after:h-1 after:bg-gradient-to-r after:from-sky-500 after:to-indigo-600 after:rounded-full">Son Oyunlar</h2>
    <div class="space-y-4">
      ${recentGames.length === 0 
        ? '<p class="text-slate-600 text-lg">Henüz oyun oynamadınız.</p>'
        : recentGames.map(game => `
          <div class="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 hover:shadow-lg transition-shadow cursor-pointer" data-session-id="${game.id}" style="cursor: pointer;">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span class="font-bold text-slate-900">vs ${escapeHtml(game.opponent)}</span>
                ${game.gameType === 'tournament' ? `
                <span class="px-2 py-1 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700">
                  Turnuva
                </span>
                ` : ''}
              </div>
              <div class="flex items-center gap-4 text-sm text-slate-600">
                <span class="font-semibold ${game.won ? 'text-green-600' : 'text-red-600'}">
                  ${game.won ? '✓ Kazandın' : '✗ Kaybettin'}
                </span>
                <span>Skor: <strong>${game.score}</strong></span>
                <span>${formatDate(game.endedAt)}</span>
              </div>
            </div>
          </div>
        `).join('')
      }
    </div>
  </section>
`;

const renderDailyStatsChart = () => `
  <section class="rounded-3xl bg-white/95 backdrop-blur-xl p-10 shadow-2xl border border-white/20 ring-1 ring-white/10 mb-8">
    <h2 class="text-3xl font-extrabold text-slate-900 mb-6 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-20 after:h-1 after:bg-gradient-to-r after:from-sky-500 after:to-indigo-600 after:rounded-full">Bugünün Aktivitesi</h2>
    <div class="relative h-64">
      <canvas id="dailyStatsChart"></canvas>
    </div>
  </section>
`;

const renderWeeklyStatsChart = () => `
  <section class="rounded-3xl bg-white/95 backdrop-blur-xl p-10 shadow-2xl border border-white/20 ring-1 ring-white/10 mb-8">
    <h2 class="text-3xl font-extrabold text-slate-900 mb-6 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-20 after:h-1 after:bg-gradient-to-r after:from-sky-500 after:to-indigo-600 after:rounded-full">Haftalık Aktivite (Son 1 Hafta)</h2>
    <div class="relative h-64">
      <canvas id="weeklyStatsChart"></canvas>
    </div>
  </section>
`;

const renderGameHistory = (sessions: GameSessionPayload[], pagination: { page: number; totalPages: number; total: number }, currentNickname: string) => `
  <section class="rounded-3xl bg-white/95 backdrop-blur-xl p-10 shadow-2xl border border-white/20 ring-1 ring-white/10">
    <h2 class="text-3xl font-extrabold text-slate-900 mb-6 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-20 after:h-1 after:bg-gradient-to-r after:from-sky-500 after:to-indigo-600 after:rounded-full">Tüm Oyun Geçmişi</h2>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b-2 border-slate-200">
            <th class="text-left py-3 px-4 font-bold text-slate-700">Rakip</th>
            <th class="text-left py-3 px-4 font-bold text-slate-700">Skor</th>
            <th class="text-left py-3 px-4 font-bold text-slate-700">Sonuç</th>
            <th class="text-left py-3 px-4 font-bold text-slate-700">Tip</th>
            <th class="text-left py-3 px-4 font-bold text-slate-700">Tarih</th>
          </tr>
        </thead>
        <tbody>
          ${sessions.length === 0 
            ? '<tr><td colspan="5" class="text-center py-8 text-slate-600">Henüz oyun oynamadınız.</td></tr>'
            : sessions.map(session => `
              <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer" data-session-id="${session.id}" style="cursor: pointer;">
                <td class="py-3 px-4 font-semibold text-slate-900">
                  ${escapeHtml(session.player1)} vs ${escapeHtml(session.player2)}
                </td>
                <td class="py-3 px-4 text-slate-700">${session.score}</td>
                <td class="py-3 px-4">
                  <span class="px-3 py-1 rounded-lg text-sm font-semibold ${
                    session.winner === currentNickname 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }">
                    ${session.winner === currentNickname ? 'Kazandın' : 'Kaybettin'}
                  </span>
                </td>
                <td class="py-3 px-4">
                  ${session.gameType === 'tournament' ? `
                  <span class="px-2 py-1 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700">
                    Turnuva
                  </span>
                  ` : ''}
                </td>
                <td class="py-3 px-4 text-slate-600 text-sm">${formatDate(session.endedAt)}</td>
              </tr>
            `).join('')
          }
        </tbody>
      </table>
    </div>
    ${pagination.totalPages > 1 ? `
      <div class="flex items-center justify-between mt-6">
        <p class="text-slate-600">Toplam ${pagination.total} oyun</p>
        <div class="flex gap-2">
          <button 
            class="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            data-pagination="prev"
            ${pagination.page === 1 ? 'disabled' : ''}
          >
            Önceki
          </button>
          <span class="px-4 py-2 text-slate-700 font-semibold">
            Sayfa ${pagination.page} / ${pagination.totalPages}
          </span>
          <button 
            class="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            data-pagination="next"
            ${pagination.page === pagination.totalPages ? 'disabled' : ''}
          >
            Sonraki
          </button>
        </div>
      </div>
    ` : ''}
  </section>
`;

const renderTournamentSection = () => `
  <section class="rounded-3xl bg-white/95 backdrop-blur-xl p-10 shadow-2xl border border-white/20 ring-1 ring-white/10">
    <h2 class="text-3xl font-extrabold text-slate-900 mb-6 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-20 after:h-1 after:bg-gradient-to-r after:from-sky-500 after:to-indigo-600 after:rounded-full">Turnuva / Oyun Durumu</h2>
    <p class="text-slate-600 text-lg leading-relaxed">Turnuva sistemi bu alanda listelenecek. Şimdilik Play Now ile Pong'a geçebilirsin.</p>
  </section>
`;

export const renderDashboardView = (container: HTMLElement) => {
  let session = loadSession();
  if (!session) {
    location.hash = '/auth';
    return;
  }
  // Container'ın stillerini temizle
  container.className = '';
  container.style.cssText = '';

  const root = document.createElement('main');
  root.className = 'min-h-screen bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900';
  root.innerHTML = `
    ${renderHeader(session.nickname)}
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      ${renderAccountSummary(session)}
      <div id="stats-section" class="mb-8">
        <div class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
          <p class="mt-4 text-slate-400">İstatistikler yükleniyor...</p>
        </div>
      </div>
      ${renderTournamentSection()}
    </div>
  `;

  container.appendChild(root);

  const applyProfile = (profile: ProfilePayload) => {
    if (!session) return;
    session = { 
      id: profile.id,
      email: profile.email,
      nickname: profile.nickname,
      provider: profile.provider
    };
    persistSession(session);
    const setText = (selector: string, value: string) => {
      const node = root.querySelector<HTMLElement>(selector);
      if (node) node.textContent = value;
    };

    setText('[data-profile-field="nickname"]', profile.nickname);
    setText('[data-profile-field="id"]', `#${profile.id}`);
    setText('[data-profile-field="nicknameInline"]', profile.nickname);
    setText(
      '[data-profile-field="providerLabel"]',
      profile.provider === 'google' ? 'Google OAuth' : 'Local (manuel)'
    );
    setText('[data-profile-field="createdAt"]', formatDate(profile.createdAt));
  };

  // İstatistikleri yükle ve göster
  const loadStats = async () => {
    if (!session) return;
    const statsSection = root.querySelector('#stats-section');
    if (!statsSection) return;

    try {
      const [statsResponse, sessionsResponse] = await Promise.all([
        fetch('/api/users/stats', { credentials: 'include' }),
        fetch('/api/game-sessions?page=1&limit=10', { credentials: 'include' })
      ]);

      if (!statsResponse.ok || !sessionsResponse.ok) {
        throw new Error('İstatistikler yüklenemedi');
      }

      const stats = (await statsResponse.json()) as UserStatsPayload;
      const sessionsData = (await sessionsResponse.json()) as { sessions: GameSessionPayload[]; pagination: any };

      // İstatistik bölümünü render et
      statsSection.innerHTML = `
        ${renderStatsCards(stats)}
        ${renderRecentGames(stats.recentGames)}
        ${renderDailyStatsChart()}
        ${renderWeeklyStatsChart()}
        ${renderGameHistory(sessionsData.sessions, sessionsData.pagination, session.nickname)}
      `;

      // Bugünün aktivite grafiği oluştur (kazanma/kaybetme pie chart)
      const dailyChartCanvas = root.querySelector<HTMLCanvasElement>('#dailyStatsChart');
      if (dailyChartCanvas) {
        const ctx = dailyChartCanvas.getContext('2d');
        if (ctx) {
          const hasGames = stats.dailyStats.games > 0;
          new Chart(ctx, {
            type: 'pie',
            data: {
              labels: ['Kazanma', 'Kaybetme'],
              datasets: [
                {
                  data: hasGames 
                    ? [stats.dailyStats.wins, stats.dailyStats.losses]
                    : [0, 0],
                  backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                  ],
                  borderColor: [
                    'rgb(34, 197, 94)',
                    'rgb(239, 68, 68)'
                  ],
                  borderWidth: 2
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    padding: 15,
                    font: {
                      size: 14,
                      weight: 'bold'
                    }
                  }
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.parsed || 0;
                      const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                      const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                      return `${label}: ${value} (${percentage}%)`;
                    }
                  }
                }
              }
            }
          });
        }
      }

      // Haftalık aktivite grafiği oluştur (kazanma/kaybetme pie chart - son 1 hafta)
      const weeklyChartCanvas = root.querySelector<HTMLCanvasElement>('#weeklyStatsChart');
      if (weeklyChartCanvas) {
        const ctx = weeklyChartCanvas.getContext('2d');
        if (ctx) {
          const hasGames = stats.weeklyStats.games > 0;
          new Chart(ctx, {
            type: 'pie',
            data: {
              labels: ['Kazanma', 'Kaybetme'],
              datasets: [
                {
                  data: hasGames 
                    ? [stats.weeklyStats.wins, stats.weeklyStats.losses]
                    : [0, 0],
                  backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                  ],
                  borderColor: [
                    'rgb(34, 197, 94)',
                    'rgb(239, 68, 68)'
                  ],
                  borderWidth: 2
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    padding: 15,
                    font: {
                      size: 14,
                      weight: 'bold'
                    }
                  }
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.parsed || 0;
                      const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                      const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                      return `${label}: ${value} (${percentage}%)`;
                    }
                  }
                }
              }
            }
          });
        }
      }

      // Sayfalama butonları için event listener'lar
      let currentPage = 1;
      
      const loadGameSessions = async (page: number) => {
        if (!session) return;
        try {
          const response = await fetch(`/api/game-sessions?page=${page}&limit=10`, { credentials: 'include' });
          if (!response.ok) throw new Error('Oyun geçmişi yüklenemedi');
          const data = (await response.json()) as { sessions: GameSessionPayload[]; pagination: any };
          
          const historySection = root.querySelector('section:last-child');
          if (historySection) {
            historySection.innerHTML = renderGameHistory(data.sessions, data.pagination, session.nickname);
            currentPage = page;
            
            // Yeni butonlar için event listener'ları tekrar ekle
            const newPrevButton = root.querySelector('[data-pagination="prev"]');
            const newNextButton = root.querySelector('[data-pagination="next"]');
            
            newPrevButton?.addEventListener('click', () => {
              if (currentPage > 1) loadGameSessions(currentPage - 1);
            });
            
            newNextButton?.addEventListener('click', () => {
              if (currentPage < data.pagination.totalPages) loadGameSessions(currentPage + 1);
            });

            // Yeni yüklenen satırlara tıklanabilirlik ekle
            root.querySelectorAll('[data-session-id]').forEach(element => {
              element.addEventListener('click', (e) => {
                const sessionId = (e.currentTarget as HTMLElement).getAttribute('data-session-id');
                if (sessionId) {
                  location.hash = `/game-session?id=${sessionId}`;
                }
              });
            });
          }
        } catch (error) {
          console.error('Oyun geçmişi yüklenemedi:', error);
        }
      };

      const prevButton = root.querySelector('[data-pagination="prev"]');
      const nextButton = root.querySelector('[data-pagination="next"]');

      prevButton?.addEventListener('click', () => {
        if (currentPage > 1) loadGameSessions(currentPage - 1);
      });

      nextButton?.addEventListener('click', () => {
        if (currentPage < sessionsData.pagination.totalPages) loadGameSessions(currentPage + 1);
      });

      // Son oyunlar listesine tıklanabilirlik ekle
      root.querySelectorAll('[data-session-id]').forEach(element => {
        element.addEventListener('click', (e) => {
          const sessionId = (e.currentTarget as HTMLElement).getAttribute('data-session-id');
          if (sessionId) {
            location.hash = `/game-session?id=${sessionId}`;
          }
        });
      });

      // Oyun geçmişi tablosuna tıklanabilirlik ekle
      const setupSessionClickHandlers = () => {
        root.querySelectorAll('[data-session-id]').forEach(element => {
          element.addEventListener('click', (e) => {
            const sessionId = (e.currentTarget as HTMLElement).getAttribute('data-session-id');
            if (sessionId) {
              location.hash = `/game-session?id=${sessionId}`;
            }
          });
        });
      };

      setupSessionClickHandlers();

    } catch (error) {
      console.error('İstatistikler yüklenemedi:', error);
      if (statsSection) {
        statsSection.innerHTML = `
          <div class="rounded-3xl bg-red-50 border-2 border-red-200 p-8 text-center">
            <p class="text-red-700 font-semibold">İstatistikler yüklenirken bir hata oluştu.</p>
          </div>
        `;
      }
    }
  };

  void fetch('/api/users/profile', { credentials: 'include' })
    .then(async (response) => {
      if (!response.ok) {
        if (response.status === 401) {
          clearSession();
          location.hash = '/auth';
        }
        return;
      }
      const profile = (await response.json()) as ProfilePayload;
      applyProfile(profile);
    })
    .catch((error) => {
      console.warn('Profil bilgisi alınamadı:', error);
    });

  // İstatistikleri yükle
  void loadStats();

  const playButton = root.querySelector<HTMLButtonElement>('[data-action="play"]');
  playButton?.addEventListener('click', () => {
    location.hash = '/game';
  });

  const tournamentsButton = root.querySelector<HTMLButtonElement>('[data-action="tournaments"]');
  tournamentsButton?.addEventListener('click', () => {
    location.hash = '/tournament';
  });

  const logoutButton = root.querySelector<HTMLButtonElement>('[data-action="logout"]');
  logoutButton?.addEventListener('click', async () => {
    const gotoAuth = () => {
      if (location.hash !== '#/auth') {
        location.replace(`${location.origin}/#/auth`);
      }
    };

    gotoAuth();
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.warn('Logout isteği başarısız oldu:', error);
    } finally {
      clearSession();
      gotoAuth();
    }
  });

  const nicknameForm = root.querySelector<HTMLFormElement>('[data-nickname-form]');
  const nicknameInput = root.querySelector<HTMLInputElement>('[data-nickname-input]');
  const nicknameStatus = root.querySelector<HTMLElement>('[data-status="nickname"]');
  const editNicknameButton = root.querySelector<HTMLButtonElement>('[data-action="edit-nickname"]');
  const cancelNicknameButton = root.querySelector<HTMLButtonElement>('[data-action="cancel-nickname"]');

  const updateNicknameStatus = (type: 'loading' | 'success' | 'error', message = '') => {
    if (!nicknameStatus) return;

    // Tailwind sınıflarını temizle
    nicknameStatus.classList.remove(
      'bg-green-100', 'text-green-900', 'border-green-400',
      'bg-red-100', 'text-red-900', 'border-red-400',
      'bg-blue-100', 'text-blue-900', 'border-blue-400',
      'hidden', 'shadow-lg', 'border-2'
    );
    nicknameStatus.innerHTML = '';

    // Görünürlüğü garanti et
    nicknameStatus.style.display = 'flex';
    nicknameStatus.classList.remove('hidden');

    if (type === 'loading') {
      nicknameStatus.innerHTML = `
        <svg class="animate-spin h-5 w-5 text-blue-600 flex-shrink-0" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="font-semibold">${message || 'Kaydediliyor...'}</span>
      `;
      nicknameStatus.classList.add('bg-blue-100', 'text-blue-900', 'border-blue-400', 'border-2');
    } else if (!message) {
      // Mesaj yoksa status'u gizle
      nicknameStatus.textContent = '';
      nicknameStatus.classList.add('hidden');
      nicknameStatus.style.display = 'none';
      return;
    } else if (type === 'success') {
      nicknameStatus.innerHTML = `
        <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="font-bold">${message}</span>
      `;
      nicknameStatus.classList.add('bg-green-100', 'text-green-900', 'border-green-400', 'border-2', 'shadow-lg');
      // Başarı mesajını 5 saniye sonra gizle
      setTimeout(() => {
        nicknameStatus.classList.add('hidden');
        nicknameStatus.style.display = 'none';
        nicknameStatus.textContent = '';
      }, 5000);
    } else if (type === 'error') {
      nicknameStatus.innerHTML = `
        <svg class="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="font-bold">${message}</span>
      `;
      nicknameStatus.classList.add('bg-red-100', 'text-red-900', 'border-red-400', 'border-2', 'shadow-lg');
    }
  };

  const setNicknameEditing = (isEditing: boolean) => {
    if (nicknameForm) {
      if (isEditing) {
        nicknameForm.classList.remove('hidden');
        nicknameForm.classList.add('flex');
      } else {
        nicknameForm.classList.add('hidden');
        nicknameForm.classList.remove('flex');
      }
    }
    if (editNicknameButton) {
      if (isEditing) {
        editNicknameButton.classList.add('hidden');
      } else {
        editNicknameButton.classList.remove('hidden');
      }
    }
    if (isEditing) {
      nicknameInput?.focus();
      nicknameInput?.select();
    } else if (nicknameStatus) {
      updateNicknameStatus('error', ''); // Status'u temizle
    }
  };

  editNicknameButton?.addEventListener('click', () => {
    if (nicknameInput && session) {
      nicknameInput.value = session.nickname;
    }
    setNicknameEditing(true);
  });

  cancelNicknameButton?.addEventListener('click', () => {
    setNicknameEditing(false);
  });

  nicknameForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!nicknameInput) return;
    const nextNickname = nicknameInput.value.trim();
    if (nextNickname.length < 3 || nextNickname.length > 48) {
      updateNicknameStatus('error', 'Takma ad 3-48 karakter arası olmalı.');
      return;
    }

    updateNicknameStatus('loading', 'Kaydediliyor...');
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nickname: nextNickname })
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        updateNicknameStatus('error', payload?.message ?? 'Güncelleme başarısız oldu.');
        return;
      }

      const profile = (await response.json()) as ProfilePayload;
      applyProfile(profile);
      updateNicknameStatus('success', 'Güncellendi.');
      setNicknameEditing(false);
    } catch (error) {
      console.warn('Takma ad güncellenemedi:', error);
      updateNicknameStatus('error', 'Beklenmeyen bir hata oluştu.');
    }
  });
};
