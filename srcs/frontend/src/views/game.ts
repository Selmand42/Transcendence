
import { initializeOnlineGame } from '../game/online';
import { initializePongGame } from '../game/script';
import { loadSession } from '../utils/storage';
import { apiFetch } from '../utils/api';

export const renderGameView = (container: HTMLElement) => {
  const user = loadSession();
  if (!user) {
    location.hash = '/auth';
    return;
  }

  // URL parametrelerini kontrol et (turnuva maçı için)
  const hash = location.hash.replace(/^#/, '');
  const urlParams = new URLSearchParams(hash.split('?')[1] || '');
  const tournamentId = urlParams.get('tournament');
  const matchId = urlParams.get('match');

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
            ${tournamentId && matchId ? '<p class="text-yellow-400 mt-2 text-sm">🏆 Turnuva Maçı Modu</p>' : ''}
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
      <div class="relative flex flex-col items-center gap-6">
        <!-- Mode Selection -->
        <div class="relative inline-flex items-center rounded-2xl bg-slate-800/90 p-1.5 shadow-lg border border-slate-700/50" data-mode-toggle>
          <div class="absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 shadow-md transition-transform duration-300 ease-in-out" data-mode-indicator></div>
          <button class="relative z-10 px-8 py-3 rounded-xl font-bold text-sm transition-colors duration-300 text-white" type="button" data-mode="offline">Offline</button>
          <button class="relative z-10 px-8 py-3 rounded-xl font-bold text-sm transition-colors duration-300 text-slate-400" type="button" data-mode="online">Online</button>
        </div>

        <!-- Scoreboard Section -->
        <div class="w-full max-w-2xl space-y-4">
          <div class="rounded-2xl bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl shadow-2xl border-2 border-white/30 ring-1 ring-white/20 p-6">
            <p class="text-xs font-bold text-slate-500 uppercase tracking-wider text-center mb-4">Skor</p>
            <div class="flex gap-6 justify-center items-center">
              <div class="flex-1 text-center px-6 py-4 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100/50 border-2 border-sky-200/50 shadow-inner">
                <p class="text-xs font-semibold text-sky-600 uppercase tracking-wide mb-1">Oyuncu A</p>
                <span class="text-4xl font-extrabold text-sky-600" data-score="a">A: 0</span>
              </div>
              <div class="text-2xl font-bold text-slate-400">-</div>
              <div class="flex-1 text-center px-6 py-4 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-2 border-indigo-200/50 shadow-inner">
                <p class="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">Oyuncu B</p>
                <span class="text-4xl font-extrabold text-indigo-600" data-score="b">B: 0</span>
              </div>
            </div>
          </div>
          <!-- Game Status (for offline mode) -->
          <div class="px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-center hidden" data-game-status>
            <p class="text-sm font-medium text-slate-300">Offline mod (AI).</p>
          </div>
        </div>

        <!-- Online Lobby Section -->
        <div class="w-full max-w-2xl" data-section="lobby">
          <div class="rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl shadow-2xl border-2 border-slate-700/50 p-6">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-4">Online Oyun</p>
            <div class="flex flex-col sm:flex-row gap-3 items-center justify-center mb-4">
              <button class="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-sky-600 text-white border-2 border-sky-400 shadow-lg hover:from-sky-600 hover:to-sky-700 hover:shadow-xl hover:scale-105 transition-all duration-200" type="button" data-action="create-room">
                <span class="flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Oda Oluştur
                </span>
              </button>
              <div class="flex-1 w-full sm:w-auto flex gap-2">
                <input class="flex-1 px-4 py-3 rounded-xl border-2 border-slate-600 bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200" type="text" maxlength="8" placeholder="Oda Kodu" data-field="room-code" />
                <button class="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-2 border-emerald-400 shadow-lg hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl hover:scale-105 transition-all duration-200" type="button" data-action="join-room">
                  <span class="flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                    Katıl
                  </span>
                </button>
              </div>
            </div>
            <div class="px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-center">
              <p class="text-sm font-medium text-slate-300" data-status="connection">Oda oluştur veya katıl.</p>
            </div>
          </div>
        </div>

        <!-- Canvas -->
        <div class="w-full max-w-4xl">
          <canvas class="w-full h-auto rounded-2xl shadow-2xl border-2 border-white/20 bg-slate-800/50"></canvas>
        </div>
      </div>
    </section>
  `;

  container.appendChild(root);

  const canvas = root.querySelector('canvas');
  const scoreAEl = root.querySelector<HTMLElement>('[data-score="a"]');
  const scoreBEl = root.querySelector<HTMLElement>('[data-score="b"]');

  if (!canvas || !scoreAEl || !scoreBEl) {
    throw new Error('Oyun bileşenleri oluşturulamadı.');
  }

  // Status element'i kaldırıldı, null gönderiyoruz
  const createBtn = root.querySelector<HTMLButtonElement>('[data-action="create-room"]');
  const joinBtn = root.querySelector<HTMLButtonElement>('[data-action="join-room"]');
  const roomInput = root.querySelector<HTMLInputElement>('[data-field="room-code"]');
  const statusEl = root.querySelector<HTMLElement>('[data-status="connection"]');
  const gameStatusEl = root.querySelector<HTMLElement>('[data-game-status]');
  const offlineBtn = root.querySelector<HTMLButtonElement>('[data-mode="offline"]');
  const onlineBtn = root.querySelector<HTMLButtonElement>('[data-mode="online"]');
  const lobbySection = root.querySelector<HTMLElement>('[data-section="lobby"]');
  const modeToggle = root.querySelector<HTMLElement>('[data-mode-toggle]');
  const modeIndicator = root.querySelector<HTMLElement>('[data-mode-indicator]');

  if (!createBtn || !joinBtn || !roomInput || !statusEl || !gameStatusEl || !offlineBtn || !onlineBtn || !lobbySection || !modeToggle || !modeIndicator) {
    throw new Error('Oyun lobisi oluşturulamadı.');
  }

  let cleanup: () => void = () => {};
  let tournamentMatchData: { tournamentId: string; matchId: string; opponentIsAI: boolean; playerPosition: 'A' | 'B'; tournamentName?: string; roundNumber?: number } | null = null;

  // Toggle mode UI helper
  const updateModeToggle = (mode: 'offline' | 'online') => {
    if (mode === 'offline') {
      modeIndicator.style.transform = 'translateX(0%)';
      offlineBtn.className = 'relative z-10 px-8 py-3 rounded-xl font-bold text-sm transition-colors duration-300 text-white';
      onlineBtn.className = 'relative z-10 px-8 py-3 rounded-xl font-bold text-sm transition-colors duration-300 text-slate-400';
    } else {
      modeIndicator.style.transform = 'translateX(100%)';
      offlineBtn.className = 'relative z-10 px-8 py-3 rounded-xl font-bold text-sm transition-colors duration-300 text-slate-400';
      onlineBtn.className = 'relative z-10 px-8 py-3 rounded-xl font-bold text-sm transition-colors duration-300 text-white';
    }
  };

  // Turnuva maçı bilgilerini al ve rakibin AI olup olmadığını kontrol et
  const loadTournamentMatchInfo = async () => {
    if (!tournamentId || !matchId) return;

    try {
      const response = await apiFetch(`/api/tournaments`);
      if (!response.ok) return;

      const tournaments = (await response.json()) as Array<{
        id: number;
        name: string;
        bracket?: {
          rounds: Array<{
            roundNumber: number;
            matches: Array<{
              matchId: string;
              playerA: { alias: string; isAi: boolean };
              playerB: { alias: string; isAi: boolean };
              status: 'pending' | 'completed';
            }>;
          }>;
          completed: boolean;
        } | null;
      }>;

      const tournament = tournaments.find((t) => t.id === Number(tournamentId));
      if (!tournament?.bracket) return;

      // Maçı bul
      for (const round of tournament.bracket.rounds) {
        const match = round.matches.find((m) => m.matchId === matchId);
        if (match) {
          // Maç zaten tamamlanmışsa, tournamentMatchData'yı null bırak (oyun başlatılmasın)
          if (match.status === 'completed') {
            return;
          }

          const currentUserAlias = user.nickname;
          const isPlayerA = match.playerA.alias === currentUserAlias && !match.playerA.isAi;
          const isPlayerB = match.playerB.alias === currentUserAlias && !match.playerB.isAi;

          const roundLabel = round.roundNumber === tournament.bracket.rounds.length && tournament.bracket.completed
            ? 'Final'
            : round.roundNumber === tournament.bracket.rounds.length
              ? 'Final'
              : `Round ${round.roundNumber}`;

          if (isPlayerA) {
            tournamentMatchData = {
              tournamentId,
              matchId,
              opponentIsAI: match.playerB.isAi,
              playerPosition: 'A',
              tournamentName: tournament.name,
              roundNumber: round.roundNumber
            };
          } else if (isPlayerB) {
            tournamentMatchData = {
              tournamentId,
              matchId,
              opponentIsAI: match.playerA.isAi,
              playerPosition: 'B',
              tournamentName: tournament.name,
              roundNumber: round.roundNumber
            };
          }
          break;
        }
      }
    } catch (error) {
      console.error('Turnuva maç bilgisi alınamadı:', error);
    }
  };

  const setMode = (mode: 'offline' | 'online') => {
    cleanup();
    updateModeToggle(mode);
    if (mode === 'offline') {
      // Turnuva maçı varsa turnuva ismi ve round bilgisi yaz, yoksa "Offline mod (AI)" yaz
      if (tournamentMatchData) {
        const roundLabel = tournamentMatchData.roundNumber === undefined
          ? 'Turnuva Maçı'
          : tournamentMatchData.roundNumber === 1
            ? 'Round 1'
            : `Round ${tournamentMatchData.roundNumber}`;
        const tournamentName = tournamentMatchData.tournamentName || 'Turnuva';
        gameStatusEl.textContent = `🏆 ${tournamentName} - ${roundLabel}`;
        gameStatusEl.className = 'px-4 py-3 rounded-xl bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 text-center';
      } else {
        gameStatusEl.textContent = 'Offline mod (AI).';
        gameStatusEl.className = 'px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-center';
      }
      gameStatusEl.classList.remove('hidden');
      createBtn.disabled = true;
      joinBtn.disabled = true;
      roomInput.disabled = true;
      createBtn.className = 'w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-slate-600/50 text-slate-400 border-2 border-slate-600/50 cursor-not-allowed opacity-50';
      joinBtn.className = 'px-6 py-3 rounded-xl font-bold text-sm bg-slate-600/50 text-slate-400 border-2 border-slate-600/50 cursor-not-allowed opacity-50';
      roomInput.className = 'flex-1 w-full sm:w-auto px-4 py-3 rounded-xl border-2 border-slate-600/50 bg-slate-700/30 text-slate-500 placeholder-slate-500 cursor-not-allowed opacity-50';
      lobbySection.style.display = 'none';

      // Turnuva maçı için callback ekle
      const handleTournamentMatchEndOffline = async (winner: 'A' | 'B', scoreA: number, scoreB: number) => {
        if (!tournamentMatchData) return;

        // Offline modda oyun içinde kullanıcı her zaman Player A (index 0), AI Player B (index 1)
        // Turnuva bracket'inde kullanıcının pozisyonuna göre winner ve skorları ayarla
        let tournamentWinner: 'A' | 'B';
        let tournamentScoreA: number;
        let tournamentScoreB: number;

        if (tournamentMatchData.playerPosition === 'A') {
          // Turnuva bracket'inde kullanıcı Player A
          // Oyun içinde: Player A (kullanıcı) = scoreA, Player B (AI) = scoreB
          // Turnuva bracket'inde: Player A (kullanıcı) = scoreA, Player B (AI) = scoreB
          tournamentWinner = winner;
          tournamentScoreA = scoreA;
          tournamentScoreB = scoreB;
        } else {
          // Turnuva bracket'inde kullanıcı Player B
          // Oyun içinde: Player A (kullanıcı) = scoreA, Player B (AI) = scoreB
          // Turnuva bracket'inde: Player A (AI) = scoreB, Player B (kullanıcı) = scoreA
          // winner 'A' ise oyun içinde A (kullanıcı) kazandı -> turnuva bracket'inde B kazandı
          // winner 'B' ise oyun içinde B (AI) kazandı -> turnuva bracket'inde A kazandı
          tournamentWinner = winner === 'A' ? 'B' : 'A';
          tournamentScoreA = scoreB; // Oyun içinde B (AI) skoru -> Turnuva bracket'inde A (AI) skoru
          tournamentScoreB = scoreA; // Oyun içinde A (kullanıcı) skoru -> Turnuva bracket'inde B (kullanıcı) skoru
        }

        try {
          const response = await apiFetch(`/api/tournaments/${tournamentMatchData.tournamentId}/matches/${encodeURIComponent(tournamentMatchData.matchId)}/result`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ winner: tournamentWinner, scoreA: tournamentScoreA, scoreB: tournamentScoreB })
          });

          if (response.ok) {
            gameStatusEl.innerHTML = `
              <div class="text-center">
                <div class="text-green-400 font-bold mb-2">✓ Maç sonucu kaydedildi!</div>
                <div class="text-sm text-slate-300 mb-4">Maç tamamlandı ve kaydedildi. Turnuvaya dönmek için butona tıklayın.</div>
                <button class="px-6 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold hover:from-sky-600 hover:to-indigo-700 transition-all duration-200" onclick="location.hash='/tournament?tournament=${tournamentMatchData.tournamentId}'">
                  Turnuvaya Dön
                </button>
              </div>
            `;
          } else {
            const error = await response.json().catch(() => ({ message: 'Maç sonucu kaydedilemedi.' }));
            gameStatusEl.innerHTML = `
              <div class="text-center">
                <div class="text-red-400 font-bold mb-2">Hata: ${error.message || 'Maç sonucu kaydedilemedi.'}</div>
                <button class="px-6 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold hover:from-sky-600 hover:to-indigo-700 transition-all duration-200 mt-4" onclick="location.hash='/tournament'">
                  Turnuvaya Dön
                </button>
              </div>
            `;
          }
        } catch (error) {
          console.error('Maç sonucu gönderme hatası:', error);
          gameStatusEl.innerHTML = `
            <div class="text-center">
              <div class="text-red-400 font-bold mb-2">Maç sonucu gönderilirken hata oluştu.</div>
              <button class="px-6 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold hover:from-sky-600 hover:to-indigo-700 transition-all duration-200 mt-4" onclick="location.hash='/tournament'">
                Turnuvaya Dön
              </button>
            </div>
          `;
        }
      };

      cleanup = initializePongGame(
        canvas,
        scoreAEl,
        scoreBEl,
        gameStatusEl,
        tournamentMatchData ? handleTournamentMatchEndOffline : undefined,
        tournamentMatchData ? tournamentMatchData.tournamentId : undefined,
        user.nickname,
        'AI'
      );
    } else {
      gameStatusEl.classList.add('hidden');
      statusEl.textContent = 'Oda oluştur veya katıl.';
      statusEl.className = 'text-sm font-medium px-4 py-3 rounded-xl text-center bg-slate-700/50 text-slate-300 border border-slate-600/50 transition-all duration-200';
      createBtn.disabled = false;
      joinBtn.disabled = false;
      roomInput.disabled = false;
      createBtn.className = 'w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-sky-600 text-white border-2 border-sky-400 shadow-lg hover:from-sky-600 hover:to-sky-700 hover:shadow-xl hover:scale-105 transition-all duration-200';
      joinBtn.className = 'px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-2 border-emerald-400 shadow-lg hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl hover:scale-105 transition-all duration-200';
      roomInput.className = 'flex-1 w-full sm:w-auto px-4 py-3 rounded-xl border-2 border-slate-600 bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 uppercase';
      lobbySection.style.display = 'block';
      const handleTournamentMatchEnd = async (winner: 'A' | 'B', scoreA: number, scoreB: number) => {
        if (!tournamentMatchData) return;

        try {
          const response = await apiFetch(`/api/tournaments/${tournamentMatchData.tournamentId}/matches/${encodeURIComponent(tournamentMatchData.matchId)}/result`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ winner, scoreA, scoreB })
          });

          if (response.ok) {
            statusEl.innerHTML = `
              <div class="text-center">
                <div class="text-green-400 font-bold mb-2">✓ Maç sonucu kaydedildi!</div>
                <div class="text-sm text-slate-300 mb-4">Maç tamamlandı ve kaydedildi. Turnuvaya dönmek için butona tıklayın.</div>
                <button class="px-6 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold hover:from-sky-600 hover:to-indigo-700 transition-all duration-200" onclick="location.hash='/tournament?tournament=${tournamentMatchData.tournamentId}'">
                  Turnuvaya Dön
                </button>
              </div>
            `;
          } else {
            const error = await response.json().catch(() => ({ message: 'Maç sonucu kaydedilemedi.' }));
            statusEl.innerHTML = `
              <div class="text-center">
                <div class="text-red-400 font-bold mb-2">Hata: ${error.message || 'Maç sonucu kaydedilemedi.'}</div>
              </div>
            `;
          }
        } catch (error) {
          console.error('Maç sonucu gönderme hatası:', error);
          statusEl.innerHTML = `
            <div class="text-center">
              <div class="text-red-400 font-bold mb-2">Maç sonucu gönderilirken hata oluştu.</div>
            </div>
          `;
        }
      };

      cleanup = initializeOnlineGame(
        canvas,
        scoreAEl,
        scoreBEl,
        {
          createButton: createBtn,
          joinButton: joinBtn,
          roomInput,
          statusEl
        },
        user,
        tournamentMatchData ? {
          tournamentId: tournamentMatchData.tournamentId,
          matchId: tournamentMatchData.matchId,
          tournamentName: tournamentMatchData.tournamentName,
          roundNumber: tournamentMatchData.roundNumber
        } : undefined,
        handleTournamentMatchEnd
      );
    }
  };

  offlineBtn.addEventListener('click', () => setMode('offline'));
  onlineBtn.addEventListener('click', () => setMode('online'));

  // Turnuva maçı bilgilerini yükle ve modu belirle
  if (tournamentId && matchId) {
    void loadTournamentMatchInfo().then(async () => {
      if (tournamentMatchData) {
        // Rakip AI ise offline moda geç, değilse online moda geç
        if (tournamentMatchData.opponentIsAI) {
          setMode('offline');
        } else {
          setMode('online');
        }
      } else {
        // Maç bilgisi alınamadı veya maç tamamlanmış, kontrol et
        try {
          const response = await fetch(`/api/tournaments`, { credentials: 'include' });
          if (response.ok) {
            const tournaments = (await response.json()) as Array<{
              id: number;
              bracket?: {
                rounds: Array<{
                  matches: Array<{
                    matchId: string;
                    status: 'pending' | 'completed';
                  }>;
                }>;
              } | null;
            }>;

            const tournament = tournaments.find((t) => t.id === Number(tournamentId));
            if (tournament?.bracket) {
              for (const round of tournament.bracket.rounds) {
                const match = round.matches.find((m) => m.matchId === matchId);
                if (match && match.status === 'completed') {
                  // Maç zaten tamamlanmış, uyarı göster ve turnuva sayfasına yönlendir
                  gameStatusEl.innerHTML = `
                    <div class="text-center">
                      <div class="text-yellow-400 font-bold mb-2">⚠️ Bu maç zaten tamamlanmış</div>
                      <div class="text-sm text-slate-300 mb-4">Maç sonucu kaydedilmiş. Turnuva sayfasına yönlendiriliyorsunuz...</div>
                    </div>
                  `;
                  gameStatusEl.className = 'px-4 py-3 rounded-xl bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 text-center';
                  gameStatusEl.classList.remove('hidden');
                  setTimeout(() => {
                    location.hash = '/tournament';
                  }, 2000);
                  return;
                }
              }
            }
          }
        } catch (error) {
          console.error('Maç durumu kontrol edilemedi:', error);
        }

        // Bilgi alınamadıysa varsayılan olarak offline moda geç
        setMode('offline');
      }
    });
  } else {
    setMode('offline');
  }

  const leaveButton = root.querySelector<HTMLButtonElement>('[data-action="leave"]');
  leaveButton?.addEventListener('click', () => {
    location.hash = '/dashboard';
  });

  return () => {
    cleanup();
  };
};
