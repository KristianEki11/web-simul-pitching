// ==========================================
// MMTC Media - Stream Page JavaScript
// ==========================================

// YouTube IFrame API
let player;
const LIVE_VIDEO_ID = 'jfKfPfyJRdk'; // lofi hip hop radio (placeholder live stream)

function onYouTubeIframeAPIReady() {
  player = new YT.Player('yt-player', {
    height: '100%',
    width: '100%',
    videoId: LIVE_VIDEO_ID,
    playerVars: {
      autoplay: 1,
      mute: 1,
      controls: 1,
      modestbranding: 1,
      rel: 0,
      fs: 1,
      playsinline: 1
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  console.log('Player ready');
  updateLiveStatus(true);
}

function onPlayerStateChange(event) {
  // YT.PlayerState: PLAYING=1, PAUSED=2, ENDED=0
  if (event.data === YT.PlayerState.PLAYING) {
    updateLiveStatus(true);
  } else if (event.data === YT.PlayerState.ENDED) {
    updateLiveStatus(false);
  }
}

function updateLiveStatus(isLive) {
  const badge = document.querySelector('.live-badge');
  const statusText = document.querySelector('.stream-status');
  if (badge) {
    badge.style.display = isLive ? 'inline-flex' : 'none';
  }
  if (statusText) {
    statusText.textContent = isLive ? 'Sedang Tayang' : 'Tidak Ada Siaran';
  }
}

// Load schedule from data
function loadSchedule() {
  const scheduleData = [
    { time: '08:00', program: 'JNews', status: 'live' },
    { time: '10:00', program: 'EXPLORITA', status: 'next' },
    { time: '13:00', program: 'Pentas Udara', status: '' },
    { time: '15:00', program: 'Dengar Dulu', status: '' },
    { time: '19:00', program: 'OSPEK', status: '' }
  ];

  const tbody = document.querySelector('.schedule-table tbody');
  if (!tbody) return;

  tbody.innerHTML = scheduleData.map(item => `
    <tr>
      <td>${item.time} WIB</td>
      <td>${item.program}</td>
      <td>
        ${item.status === 'live' ? '<span class="live-badge"><span class="live-dot"></span> LIVE</span>' : ''}
        ${item.status === 'next' ? '<span class="next-badge">Selanjutnya</span>' : ''}
      </td>
    </tr>
  `).join('');
  
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
  loadSchedule();
});
