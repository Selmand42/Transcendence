import { loadSession } from '../utils/storage';

type TournamentDTO = {
  id: number;
  name: string;
  ownerId: number | null;
  ownerNickname: string | null;
  status: 'pending' | 'active' | 'completed';
  maxPlayers: number;
  currentPlayers: number;
  createdAt: string;
  startedAt?: string;
  bracket?: {
    rounds: Array<{
      roundNumber: number;
      matches: Array<{
        matchId: string;
        match: number;
        playerA: { alias: string; isAi: boolean };
        playerB: { alias: string; isAi: boolean };
        winner: string | null;
        scoreA: number | null;
        scoreB: number | null;
        status: 'pending' | 'completed';
      }>;
    }>;
    completed: boolean;
  } | null;
};

const powerOfTwoOptions = [2, 4, 8, 16, 32];

const renderBracket = (tournament: TournamentDTO, currentUserId: number) => {
  if (!tournament.bracket || tournament.bracket.rounds.length === 0) {
    return '<p class="text-slate-400 text-lg text-center py-8">Bracket oluşturulduğunda burada görünecek.</p>';
  }

  const session = loadSession();
  const currentUserAlias = session?.nickname || '';

  return `
    <div class="space-y-8">
      <h3 class="text-2xl font-bold text-slate-900 mb-6">Turnuva Bracket</h3>
      ${tournament.bracket.rounds
        .map(
          (round) => `
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-slate-700 border-b border-slate-300 pb-2">
              ${round.roundNumber === tournament.bracket!.rounds.length && tournament.bracket!.completed
                ? '🏆 Final'
                : round.roundNumber === tournament.bracket!.rounds.length
                  ? 'Final'
                  : `Round ${round.roundNumber}`}
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${round.matches
                .map(
                  (match) => {
                    const isCompleted = match.status === 'completed';
                    const isPlayerInMatch =
                      (match.playerA.alias === currentUserAlias && !match.playerA.isAi) ||
                      (match.playerB.alias === currentUserAlias && !match.playerB.isAi);
                    const canSubmitResult = isPlayerInMatch && !isCompleted && tournament.status === 'active';

                    return `
                    <div class="rounded-xl bg-slate-50/50 backdrop-blur-sm p-6 border-2 ${
                      isCompleted ? 'border-green-300 bg-green-50/30' : 'border-slate-200'
                    } shadow-md hover:shadow-lg transition-all duration-200">
                      <div class="flex items-center justify-between mb-4">
                        <span class="px-3 py-1 rounded-full ${
                          isCompleted ? 'bg-green-100 text-green-800' : 'bg-sky-100 text-sky-800'
                        } text-xs font-bold">Match #${match.match}</span>
                        ${isCompleted ? '<span class="text-xs text-green-600 font-semibold">✓ Tamamlandı</span>' : ''}
                      </div>
                      <div class="space-y-3">
                        <div class="flex items-center justify-between gap-4">
                          <span class="flex-1 px-4 py-2 rounded-lg ${
                            match.winner === 'A' && isCompleted
                              ? 'bg-green-200 text-green-900 font-bold'
                              : 'bg-white/80 text-slate-900 font-semibold'
                          } shadow-sm text-center">
                            ${match.playerA.alias}${match.playerA.isAi ? ' (AI)' : ''}
                          </span>
                          <span class="text-slate-500 font-bold">vs</span>
                          <span class="flex-1 px-4 py-2 rounded-lg ${
                            match.winner === 'B' && isCompleted
                              ? 'bg-green-200 text-green-900 font-bold'
                              : 'bg-white/80 text-slate-900 font-semibold'
                          } shadow-sm text-center">
                            ${match.playerB.alias}${match.playerB.isAi ? ' (AI)' : ''}
                          </span>
                        </div>
                        ${
                          isCompleted
                            ? `
                          <div class="text-center text-sm text-slate-600 font-semibold">
                            Skor: ${match.scoreA} - ${match.scoreB}
                          </div>
                        `
                            : canSubmitResult
                              ? `
                          <div class="flex gap-2 mt-4">
                            <button
                              class="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold text-sm hover:from-sky-600 hover:to-indigo-700 transition-all duration-200"
                              data-action="play-match"
                              data-tournament-id="${tournament.id}"
                              data-match-id="${match.matchId}"
                            >
                              Maçı Oyna
                            </button>
                          </div>
                        `
                              : match.playerA.isAi && match.playerB.isAi
                                ? `
                          <div class="text-center text-xs text-slate-500 italic mt-2">
                            AI maçı otomatik oynanacak
                          </div>
                        `
                                : `
                          <div class="text-center text-xs text-slate-500 italic mt-2">
                            Bekleniyor...
                          </div>
                        `
                        }
                      </div>
                    </div>
                  `;
                  }
                )
                .join('')}
            </div>
          </div>
        `
        )
        .join('')}
      ${tournament.bracket.completed ? `
        <div class="rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 text-center shadow-lg">
          <p class="text-2xl font-bold text-white mb-2">🏆 Turnuva Tamamlandı! 🏆</p>
          <p class="text-white/90 text-lg">
            Kazanan: ${tournament.bracket.rounds[tournament.bracket.rounds.length - 1].matches[0].winner === 'A'
              ? tournament.bracket.rounds[tournament.bracket.rounds.length - 1].matches[0].playerA.alias
              : tournament.bracket.rounds[tournament.bracket.rounds.length - 1].matches[0].playerB.alias}
          </p>
        </div>
      ` : ''}
    </div>
  `;
};

export const renderTournamentView = (container: HTMLElement) => {
  const session = loadSession();
  if (!session) {
    location.hash = '/auth';
    return;
  }

  // URL parametrelerini kontrol et (belirli bir turnuvayı göstermek için)
  const hash = location.hash.replace(/^#/, '');
  const urlParams = new URLSearchParams(hash.split('?')[1] || '');
  const targetTournamentId = urlParams.get('tournament');

  // Container'ın stillerini temizle
  container.className = '';
  container.style.cssText = '';

  const root = document.createElement('main');
  root.className = 'min-h-screen bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900';
  root.innerHTML = `
    <header class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg border-b border-slate-700/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div class="flex-1">
            <p class="uppercase text-xs tracking-wider text-slate-400 mb-3 font-bold">Turnuvalar</p>
            <h1 class="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-tight pb-2 leading-tight">Turnuvalar</h1>
            <p class="text-slate-400 mt-4 text-lg">Yeni turnuva oluştur veya mevcut turnuvalara katıl.</p>
          </div>
          <div class="flex gap-3 flex-wrap justify-end w-full sm:w-auto">
            <button class="px-6 py-3 rounded-xl font-bold text-sm bg-white/10 backdrop-blur-sm text-slate-300 border-2 border-slate-500/30 transition-all duration-300 hover:bg-slate-500/20 hover:border-slate-500/50 hover:text-white hover:scale-105 transform" type="button" data-action="dashboard">Dashboard'a Dön</button>
          </div>
        </div>
      </div>
    </header>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex gap-2 mb-8 border-b border-slate-700/50">
        <button class="px-6 py-3 font-bold text-sm rounded-t-xl transition-all duration-300 bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg" data-tab="create">Turnuva Oluştur</button>
        <button class="px-6 py-3 font-bold text-sm rounded-t-xl transition-all duration-300 bg-white/10 backdrop-blur-sm text-slate-400 border-b-2 border-transparent hover:text-slate-300 hover:bg-white/20" data-tab="list">Aktif Turnuvalar</button>
      </div>
      <section data-tab-panel="create">
        <div class="rounded-3xl bg-white/95 backdrop-blur-xl p-10 shadow-2xl border border-white/20 ring-1 ring-white/10">
          <h2 class="text-3xl font-extrabold text-slate-900 mb-6 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-20 after:h-1 after:bg-gradient-to-r after:from-sky-500 after:to-indigo-600 after:rounded-full">Yeni Turnuva Oluştur</h2>
          <form class="flex flex-col gap-6" data-form="create">
            <label class="flex flex-col gap-3">
              <span class="text-sm font-bold text-slate-800 tracking-wide">Turnuva adı</span>
              <input
                type="text"
                name="name"
                placeholder="Örn. Akşam Ligi"
                required
                minlength="3"
                maxlength="64"
                class="w-full px-5 py-4 rounded-xl border-2 border-slate-300 bg-white/50 backdrop-blur-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-200 hover:shadow-md hover:border-slate-400"
              />
            </label>
            <label class="flex flex-col gap-3">
              <span class="text-sm font-bold text-slate-800 tracking-wide">Maksimum oyuncu (2^x)</span>
              <select
                name="maxPlayers"
                class="w-full px-5 py-4 rounded-xl border-2 border-slate-300 bg-white/50 backdrop-blur-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-200 hover:shadow-md hover:border-slate-400"
              >
                ${powerOfTwoOptions
                  .map((size) => `<option value="${size}">${size} oyuncu</option>`)
                  .join('')}
              </select>
            </label>
            <button
              class="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 text-white transition-all duration-300 hover:from-sky-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-sky-500/50 hover:scale-105 transform self-start"
              type="submit"
            >
              Turnuvayı Oluştur
            </button>
            <p class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium min-h-[48px] hidden" data-status="create"></p>
          </form>
        </div>
      </section>
      <section class="hidden" data-tab-panel="list">
        <div data-list class="space-y-6"></div>
        <p class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium min-h-[48px] hidden mt-6" data-status="list"></p>
      </section>
    </div>
  `;

  container.appendChild(root);

  const switchTab = (target: 'create' | 'list') => {
    root
      .querySelectorAll<HTMLButtonElement>('[data-tab]')
      .forEach((button) => {
        const isActive = button.dataset.tab === target;
        if (isActive) {
          button.classList.remove('bg-white/10', 'text-slate-400', 'border-transparent', 'hover:text-slate-300', 'hover:bg-white/20');
          button.classList.add('bg-gradient-to-r', 'from-sky-500', 'to-indigo-600', 'text-white', 'shadow-lg');
        } else {
          button.classList.remove('bg-gradient-to-r', 'from-sky-500', 'to-indigo-600', 'text-white', 'shadow-lg');
          button.classList.add('bg-white/10', 'backdrop-blur-sm', 'text-slate-400', 'border-b-2', 'border-transparent', 'hover:text-slate-300', 'hover:bg-white/20');
        }
      });
    root
      .querySelectorAll<HTMLElement>('[data-tab-panel]')
      .forEach((panel) => {
        if (panel.dataset.tabPanel === target) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });
  };

  // Polling için interval ID
  let pollingInterval: number | null = null;
  const POLLING_INTERVAL_MS = 3000; // 3 saniye

  const startPolling = () => {
    // Eğer zaten polling varsa durdur
    stopPolling();

    // Sadece liste sekmesi aktifken polling yap
    const isListTabActive = !root.querySelector<HTMLElement>('[data-tab-panel="list"]')?.classList.contains('hidden');
    if (isListTabActive) {
      pollingInterval = window.setInterval(() => {
        void fetchTournaments();
      }, POLLING_INTERVAL_MS);
    }
  };

  const stopPolling = () => {
    if (pollingInterval !== null) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  };

  root.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      const targetTab = button.dataset.tab === 'list' ? 'list' : 'create';
      switchTab(targetTab);
      if (targetTab === 'list') {
        void fetchTournaments();
        startPolling();
      } else {
        stopPolling();
      }
    });
  });

  const dashboardButton = root.querySelector<HTMLButtonElement>('[data-action="dashboard"]');
  dashboardButton?.addEventListener('click', () => {
    location.hash = '/dashboard';
  });

  const createStatus = root.querySelector<HTMLElement>('[data-status="create"]');
  const listStatus = root.querySelector<HTMLElement>('[data-status="list"]');
  const listContainer = root.querySelector<HTMLElement>('[data-list]');

  const updateStatus = (statusElement: HTMLElement | null, type: 'loading' | 'success' | 'error', message = '') => {
    if (!statusElement) return;

    // Tailwind sınıflarını temizle
    statusElement.classList.remove(
      'bg-green-100', 'text-green-900', 'border-green-400',
      'bg-red-100', 'text-red-900', 'border-red-400',
      'bg-blue-100', 'text-blue-900', 'border-blue-400',
      'hidden', 'shadow-lg', 'border-2'
    );
    statusElement.innerHTML = '';

    // Görünürlüğü garanti et
    statusElement.style.display = 'flex';
    statusElement.classList.remove('hidden');

    if (type === 'loading') {
      statusElement.innerHTML = `
        <svg class="animate-spin h-5 w-5 text-blue-600 flex-shrink-0" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="font-semibold">${message || 'Yükleniyor...'}</span>
      `;
      statusElement.classList.add('bg-blue-100', 'text-blue-900', 'border-blue-400', 'border-2');
    } else if (!message) {
      // Mesaj yoksa status'u gizle
      statusElement.textContent = '';
      statusElement.classList.add('hidden');
      statusElement.style.display = 'none';
      return;
    } else if (type === 'success') {
      statusElement.innerHTML = `
        <svg class="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="font-bold">${message}</span>
      `;
      statusElement.classList.add('bg-green-100', 'text-green-900', 'border-green-400', 'border-2', 'shadow-lg');
      // Başarı mesajını 5 saniye sonra gizle
      setTimeout(() => {
        statusElement.classList.add('hidden');
        statusElement.style.display = 'none';
        statusElement.textContent = '';
      }, 5000);
    } else if (type === 'error') {
      statusElement.innerHTML = `
        <svg class="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="font-bold">${message}</span>
      `;
      statusElement.classList.add('bg-red-100', 'text-red-900', 'border-red-400', 'border-2', 'shadow-lg');
    }
  };

  const fetchTournaments = async () => {
    updateStatus(listStatus, 'loading', 'Turnuvalar yükleniyor...');
    try {
      const response = await fetch('/api/tournaments', { credentials: 'include' });
      if (!response.ok) {
        if (response.status === 401) {
          location.hash = '/auth';
        }
        updateStatus(listStatus, 'error', 'Turnuvalar alınamadı.');
        return;
      }
      const tournaments = (await response.json()) as TournamentDTO[];
      updateStatus(listStatus, 'error', '');
      if (!tournaments.length) {
        listContainer!.innerHTML = '<p class="text-slate-400 text-lg text-center py-12">Aktif turnuva yok.</p>';
        return;
      }
      listContainer!.innerHTML = tournaments
        .map(
          (tournament) => {
            const isTargetTournament = targetTournamentId && Number(targetTournamentId) === tournament.id;
            return `
            <article id="tournament-${tournament.id}" class="rounded-3xl bg-white/95 backdrop-blur-xl p-8 shadow-2xl border border-white/20 ring-1 ring-white/10 ${tournament.status === 'active' ? 'ring-2 ring-green-500/50' : ''} ${isTargetTournament ? 'ring-4 ring-yellow-500/70 bg-yellow-50/30' : ''}">
              <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-200">
                <div class="flex-1">
                  <span class="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                    tournament.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }">
                    ${tournament.status === 'active' ? 'Başladı' : 'Beklemede'}
                  </span>
                  <h3 class="text-2xl font-extrabold text-slate-900 mb-2">${tournament.name}</h3>
                  <p class="text-slate-600 text-sm">Sahip: ${
                    tournament.ownerNickname ?? 'Bilinmiyor'
                  }</p>
                </div>
                <div class="flex items-center gap-3">
                  <div class="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-lg shadow-lg">
                    ${tournament.currentPlayers}/${tournament.maxPlayers}
                  </div>
                  ${
                    tournament.ownerId === session.id
                      ? `<button class="px-4 py-2 rounded-xl font-bold text-sm bg-red-500/90 text-white border-2 border-red-400 shadow-lg hover:bg-red-600 hover:shadow-xl hover:scale-105 transition-all duration-200" data-action="delete" data-id="${tournament.id}" title="Turnuvayı Sil">
                          <svg class="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>`
                      : ''
                  }
                </div>
              </header>
              <div>
                ${
                  tournament.status === 'pending'
                    ? `
                      <div class="flex flex-col sm:flex-row gap-3">
                        <form data-join="${tournament.id}" class="flex-1">
                          <button class="w-full px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 text-white transition-all duration-300 hover:from-sky-600 hover:to-indigo-700 hover:shadow-lg hover:shadow-sky-500/50" type="submit">Turnuvaya Katıl</button>
                        </form>
                        ${
                          tournament.ownerId === session.id
                            ? `<button class="px-6 py-3 rounded-xl font-bold text-sm bg-white/10 backdrop-blur-sm text-sky-600 border-2 border-sky-500/30 transition-all duration-300 hover:bg-sky-500/20 hover:border-sky-500/50 hover:scale-105 transform" data-action="start" data-id="${tournament.id}">Turnuvayı Başlat</button>`
                            : ''
                        }
                      </div>
                    `
                    : renderBracket(tournament, session.id)
                }
              </div>
            </article>
          `;
          }
        )
        .join('');

      // Eğer belirli bir turnuva hedeflenmişse, o turnuvaya scroll et
      if (targetTournamentId) {
        const targetElement = listContainer!.querySelector(`#tournament-${targetTournamentId}`);
        if (targetElement) {
          setTimeout(() => {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Vurgulama efekti için geçici border rengi değişimi (pulse yerine)
            const originalClasses = targetElement.className;
            targetElement.classList.add('ring-4', 'ring-yellow-500/70', 'shadow-2xl');
            setTimeout(() => {
              targetElement.className = originalClasses;
            }, 3000);
          }, 100);
        }
      }

      listContainer!.querySelectorAll<HTMLFormElement>('[data-join]').forEach((form) => {
        form.addEventListener('submit', (event) => {
          event.preventDefault();
          const id = Number(form.dataset.join);
          void joinTournament(id);
        });
      });

      listContainer!.querySelectorAll<HTMLButtonElement>('[data-action="start"]').forEach((button) => {
        button.addEventListener('click', () => {
          const id = Number(button.dataset.id);
          void startTournament(id);
        });
      });

      listContainer!.querySelectorAll<HTMLButtonElement>('[data-action="play-match"]').forEach((button) => {
        button.addEventListener('click', () => {
          const tournamentId = Number(button.dataset.tournamentId);
          const matchId = button.dataset.matchId;
          if (matchId) {
            // Turnuva maçını oynamak için oyun sayfasına yönlendir
            // Maç bilgilerini URL parametresi olarak gönder
            location.hash = `/game?tournament=${tournamentId}&match=${encodeURIComponent(matchId)}`;
          }
        });
      });

      listContainer!.querySelectorAll<HTMLButtonElement>('[data-action="delete"]').forEach((button) => {
        button.addEventListener('click', () => {
          const id = Number(button.dataset.id);
          const tournament = tournaments.find((t) => t.id === id);
          if (tournament && confirm(`"${tournament.name}" turnuvasını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
            void deleteTournament(id);
          }
        });
      });
    } catch (error) {
      console.warn('Turnuvalar alınamadı:', error);
      updateStatus(listStatus, 'error', 'Turnuvalar alınamadı.');
    }
  };

  const joinTournament = async (id: number) => {
    updateStatus(listStatus, 'loading', 'Katılım gönderiliyor...');
    try {
      const response = await fetch(`/api/tournaments/${id}/join`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        updateStatus(listStatus, 'error', payload?.message ?? 'Katılım başarısız oldu.');
        return;
      }
      updateStatus(listStatus, 'success', 'Turnuvaya katıldın!');
      await fetchTournaments();
    } catch (error) {
      console.warn('Katılım hatası:', error);
      updateStatus(listStatus, 'error', 'Katılım sırasında hata oluştu.');
    }
  };

  const startTournament = async (id: number) => {
    updateStatus(listStatus, 'loading', 'Turnuva başlatılıyor...');
    try {
      const response = await fetch(`/api/tournaments/${id}/start`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        updateStatus(listStatus, 'error', payload?.message ?? 'Turnuva başlatılamadı.');
        return;
      }
      updateStatus(listStatus, 'success', 'Turnuva başlatıldı!');
      await fetchTournaments();
    } catch (error) {
      console.warn('Başlatma hatası:', error);
      updateStatus(listStatus, 'error', 'Turnuva başlatılırken hata oluştu.');
    }
  };

  const deleteTournament = async (id: number) => {
    updateStatus(listStatus, 'loading', 'Turnuva siliniyor...');
    try {
      const response = await fetch(`/api/tournaments/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        updateStatus(listStatus, 'error', payload?.message ?? 'Turnuva silinemedi.');
        return;
      }
      updateStatus(listStatus, 'success', 'Turnuva silindi!');
      await fetchTournaments();
    } catch (error) {
      console.warn('Silme hatası:', error);
      updateStatus(listStatus, 'error', 'Turnuva silinirken hata oluştu.');
    }
  };

  const createForm = root.querySelector<HTMLFormElement>('[data-form="create"]');
  createForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!createForm.checkValidity()) {
      createForm.reportValidity();
      return;
    }
    updateStatus(createStatus, 'loading', 'Turnuva oluşturuluyor...');
    const formData = new FormData(createForm);
    try {
      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.get('name'),
          maxPlayers: Number(formData.get('maxPlayers'))
        })
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        updateStatus(createStatus, 'error', payload?.message ?? 'Turnuva oluşturulamadı.');
        return;
      }
      updateStatus(createStatus, 'success', 'Turnuva oluşturuldu!');
      createForm.reset();
      switchTab('list');
      await fetchTournaments();
    } catch (error) {
      console.warn('Turnuva oluşturma hatası:', error);
      updateStatus(createStatus, 'error', 'Turnuva oluşturulamadı.');
    }
  });

  // Hash değiştiğinde (turnuva sayfasına dönüldüğünde) bracket'i hemen yenile
  const handleHashChange = () => {
    const hash = location.hash.replace(/^#/, '');
    const [path] = hash.split('?');
    if (path === '/tournament') {
      // Turnuva sayfasına dönüldüğünde hemen bracket'i yenile
      const isListTabActive = !root.querySelector<HTMLElement>('[data-tab-panel="list"]')?.classList.contains('hidden');
      if (isListTabActive) {
        void fetchTournaments();
      }
    }
  };
  window.addEventListener('hashchange', handleHashChange);

  // Eğer belirli bir turnuva hedeflenmişse, liste sekmesini aç
  if (targetTournamentId) {
    switchTab('list');
  }

  // Varsayılan olarak liste sekmesini yükle ve polling başlat
  void fetchTournaments().then(() => {
    startPolling();
  });

  // Sayfa görünürlüğü değiştiğinde polling'i kontrol et (performans için)
  const handleVisibilityChange = () => {
    if (document.hidden) {
      stopPolling();
    } else {
      const isListTabActive = !root.querySelector<HTMLElement>('[data-tab-panel="list"]')?.classList.contains('hidden');
      if (isListTabActive) {
        void fetchTournaments();
        startPolling();
      }
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Cleanup fonksiyonu döndür (router için)
  return () => {
    stopPolling();
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('hashchange', handleHashChange);
  };
};
