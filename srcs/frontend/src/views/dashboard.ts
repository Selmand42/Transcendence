import { clearSession, loadSession, persistSession } from '../utils/storage';
import { escapeHtml } from '../utils/sanitize';

type ProfilePayload = {
  id: number;
  email: string;
  nickname: string;
  provider: 'local' | 'google';
  createdAt: string;
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
