// ==========================================
// MMTC Media - News Page JavaScript
// ==========================================

let allNews = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 6;

// Load news data from data.js
function loadNews() {
  try {
    allNews = typeof ALL_NEWS !== 'undefined' ? ALL_NEWS : [];
    renderTrending();
    renderNewsList();
    renderSidebar();
  } catch (err) {
    console.error('Failed to load news:', err);
  }
}

// Render trending section
function renderTrending() {
  const container = document.getElementById('trending-container');
  if (!container) return;

  const trending = allNews.filter(n => n.isTrending);
  if (!trending.length) return;

  const featured = trending[0];
  const secondary = trending.slice(1, 3);

  container.innerHTML = `
    <div class="news-featured">
      <a href="news-detail.html?id=${featured.id}" class="card">
        <img src="${featured.image}" alt="${featured.title}" class="card-image" loading="lazy">
        <div class="card-body">
          <span class="card-category"><i data-lucide="trending-up" class="icon"></i> TRENDING</span>
          <h2 class="card-title">${featured.title}</h2>
          <p class="card-text">${featured.excerpt}</p>
          <div class="card-meta">
            <span><i data-lucide="calendar" class="icon"></i> ${featured.date}</span>
            <span><i data-lucide="user" class="icon"></i> ${featured.author}</span>
          </div>
        </div>
      </a>
    </div>
    <div class="news-secondary">
      ${secondary.map(n => `
        <a href="news-detail.html?id=${n.id}" class="card news-card">
          <img src="${n.thumbnail}" alt="${n.title}" class="card-image" loading="lazy">
          <div class="card-body">
            <h3 class="card-title">${n.title}</h3>
            <p class="card-text">${n.excerpt}</p>
          </div>
        </a>
      `).join('')}
    </div>
  `;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Render news grid with pagination
function renderNewsList() {
  const container = document.getElementById('news-grid');
  const paginationEl = document.getElementById('news-pagination');
  if (!container) return;

  const nonTrending = allNews.filter(n => !n.isTrending);
  const totalPages = Math.ceil(nonTrending.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = nonTrending.slice(start, start + ITEMS_PER_PAGE);

  container.innerHTML = pageItems.map(n => `
    <a href="news-detail.html?id=${n.id}" class="card news-card">
      <img src="${n.thumbnail}" alt="${n.title}" class="card-image" loading="lazy">
      <div class="card-body">
        <span class="card-category">${n.category}</span>
        <h3 class="card-title">${n.title}</h3>
        <div class="card-meta">
          <span><i data-lucide="calendar" class="icon"></i> ${n.date}</span>
          <span><i data-lucide="user" class="icon"></i> ${n.author}</span>
        </div>
      </div>
    </a>
  `).join('');

  if (paginationEl && totalPages > 1) {
    paginationEl.innerHTML = Array.from({length: totalPages}, (_, i) => `
      <button class="page-btn ${i + 1 === currentPage ? 'active' : ''}" onclick="goToPage(${i + 1})">${i + 1}</button>
    `).join('');
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Render sidebar
function renderSidebar() {
  const container = document.getElementById('news-sidebar');
  if (!container) return;

  const latest = allNews.slice(0, 5);
  container.innerHTML = latest.map(n => `
    <a href="news-detail.html?id=${n.id}" class="sidebar-item">
      <img src="${n.thumbnail}" alt="${n.title}" class="sidebar-item-image" loading="lazy">
      <div>
        <p class="sidebar-item-title">${n.title}</p>
        <span class="sidebar-item-meta"><i data-lucide="calendar" class="icon"></i> ${n.date}</span>
      </div>
    </a>
  `).join('');
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Pagination
function goToPage(page) {
  currentPage = page;
  renderNewsList();
  document.getElementById('news-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Search
function initSearch() {
  const input = document.querySelector('.search-input');
  if (!input) return;

  input.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const container = document.getElementById('news-grid');
    if (!container) return;

    if (!query) {
      renderNewsList();
      return;
    }

    const results = allNews.filter(n =>
      n.title.toLowerCase().includes(query) ||
      n.excerpt.toLowerCase().includes(query) ||
      n.category.toLowerCase().includes(query)
    );

    container.innerHTML = results.length
      ? results.map(n => `
          <a href="news-detail.html?id=${n.id}" class="card news-card">
            <img src="${n.thumbnail}" alt="${n.title}" class="card-image" loading="lazy">
            <div class="card-body">
              <span class="card-category">${n.category}</span>
              <h3 class="card-title">${n.title}</h3>
              <div class="card-meta">
                <span><i data-lucide="calendar" class="icon"></i> ${n.date}</span>
              </div>
            </div>
          </a>
        `).join('')
      : '<p class="text-muted" style="grid-column: 1/-1; text-align:center; padding:40px;">Tidak ada berita yang ditemukan.</p>';

    // Hide pagination during search
    const paginationEl = document.getElementById('news-pagination');
    if (paginationEl) paginationEl.innerHTML = '';
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
  });
}

// News Detail page
async function loadNewsDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  if (!id) return;

  try {
    const news = typeof ALL_NEWS !== 'undefined' ? ALL_NEWS : [];
    const article = news.find(n => n.id === id);
    if (!article) {
      document.getElementById('article-content').innerHTML = '<p>Artikel tidak ditemukan.</p>';
      return;
    }

    // Set page title
    document.title = `${article.title} - MMTC Media`;

    // Breadcrumb
    const breadcrumb = document.getElementById('article-breadcrumb');
    if (breadcrumb) {
      breadcrumb.innerHTML = `
        <a href="index.html">Home</a>
        <span class="separator">›</span>
        <a href="news.html">News</a>
        <span class="separator">›</span>
        <span class="current">${article.title}</span>
      `;
    }

    // Main content
    const content = document.getElementById('article-content');
    if (content) {
      content.innerHTML = `
        <img src="${article.image}" alt="${article.title}" class="article-cover" loading="lazy">
        <h1 class="article-title">${article.title}</h1>
        <div class="article-meta">
          <span><i data-lucide="calendar" class="icon"></i> ${article.date}</span>
          <span><i data-lucide="user" class="icon"></i> ${article.author}</span>
          <span><i data-lucide="tag" class="icon"></i> ${article.category}</span>
        </div>
        <div class="article-body">${article.content}</div>
        <div class="share-buttons">
          <button class="share-btn" onclick="navigator.clipboard.writeText(window.location.href).then(()=>alert('Link disalin!'))"><i data-lucide="copy" class="icon"></i> Salin Link</button>
        </div>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Related articles sidebar
    const sidebar = document.getElementById('detail-sidebar');
    if (sidebar) {
      const related = news.filter(n => n.id !== id).slice(0, 4);
      sidebar.innerHTML = `
        <div class="sidebar-section">
          <h3 class="sidebar-title">Berita Terkait</h3>
          ${related.map(n => `
            <a href="news-detail.html?id=${n.id}" class="sidebar-item">
              <img src="${n.thumbnail}" alt="${n.title}" class="sidebar-item-image" loading="lazy">
              <div>
                <p class="sidebar-item-title">${n.title}</p>
                <span class="sidebar-item-meta"><i data-lucide="calendar" class="icon"></i> ${n.date}</span>
              </div>
            </a>
          `).join('')}
        </div>
        <div class="sidebar-section">
          <h3 class="sidebar-title">Kategori</h3>
          <div class="sidebar-categories">
            ${[...new Set(news.map(n => n.category))].map(cat => `
              <a href="news.html" class="filter-tab">${cat}</a>
            `).join('')}
          </div>
        </div>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  } catch (err) {
    console.error('Failed to load article:', err);
  }
}

// Init based on page
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('trending-container')) {
    loadNews();
    initSearch();
  }
  if (document.getElementById('article-content')) {
    loadNewsDetail();
  }
});
