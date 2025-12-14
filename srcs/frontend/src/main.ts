
import './styles.css';
import { Router } from './router';
import { renderAuthView } from './views/auth';
import { renderDashboardView } from './views/dashboard';
import { renderGameView } from './views/game';
import { renderTournamentView } from './views/tournament';
import { renderGameSessionView } from './views/game-session';
import { loadSession } from './utils/storage';

const root = document.getElementById('app');

if (!root) {
  throw new Error('Uygulama için kök element bulunamadı.');
}

const router = new Router(root);
router.register({ path: '/auth', render: renderAuthView });
router.register({ path: '/dashboard', render: renderDashboardView });
router.register({ path: '/game', render: renderGameView });
router.register({ path: '/tournament', render: renderTournamentView });
router.register({ path: '/game-session', render: renderGameSessionView });

// Sayfa yenilemelerinde oyuna/tur nuvaya doğrudan geri düşmeyi engelle
const session = loadSession();
const currentPath = (location.hash.replace(/^#/, '').split('?')[0]) || '';
const protectedOnRefresh = ['/game', '/tournament'];
if (protectedOnRefresh.includes(currentPath)) {
  router.navigate(session ? '/dashboard' : '/auth', { replace: true });
} else if (!currentPath && session) {
  // Oturum varsa ve rota yoksa doğrudan dashboard'a yönlendir
  router.navigate('/dashboard', { replace: true });
}

router.init();
