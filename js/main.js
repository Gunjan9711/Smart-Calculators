// ============================================
// MAIN APPLICATION – scrollable single page
// ============================================

(function() {
  'use strict';

  // -------- Global registry for tools --------
  window.Tools = window.Tools || [];

  // -------- DOM refs --------
  const toolsGrid = document.getElementById('toolsGrid');
  const toolContainer = document.getElementById('toolContainer');
  const themeToggle = document.getElementById('themeToggle');
  const backTop = document.getElementById('backTop');
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('.section');

  let currentToolId = null;

  // -------- Theme --------
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
      icon.className = 'fas fa-sun';
    } else {
      icon.className = 'fas fa-moon';
    }
    localStorage.setItem('theme', theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  themeToggle.addEventListener('click', toggleTheme);

  // -------- Navbar active link on scroll --------
  function updateActiveNav() {
    let currentSection = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100) {
        currentSection = section.id;
      }
    });
    navAnchors.forEach(anchor => {
      anchor.classList.remove('active');
      if (anchor.getAttribute('href') === '#' + currentSection) {
        anchor.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  // initial check
  setTimeout(updateActiveNav, 100);

  // -------- Mobile menu --------
  navToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('open');
  });

  // Close mobile menu on link click
  navAnchors.forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('open');
    });
  });

  // -------- Back to top --------
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backTop.classList.add('show');
    } else {
      backTop.classList.remove('show');
    }
  });

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // -------- Tools rendering --------
  function renderToolGrid() {
    if (!toolsGrid) return;
    if (window.Tools.length === 0) {
      toolsGrid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--text-muted);">No tools registered.</p>';
      return;
    }
    let html = '';
    window.Tools.forEach(tool => {
      html += `
        <div class="tool-card" data-tool-id="${tool.id}">
          <i class="${tool.icon}"></i>
          <h3>${tool.name}</h3>
          <p>${tool.description || ''}</p>
        </div>
      `;
    });
    toolsGrid.innerHTML = html;

    // attach click events
    toolsGrid.querySelectorAll('.tool-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.toolId;
        if (id) loadTool(id);
        // highlight active card
        toolsGrid.querySelectorAll('.tool-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });

    // Auto-load the first tool if available
    if (window.Tools.length > 0) {
      const firstToolId = window.Tools[0].id;
      // Highlight the first card
      const firstCard = toolsGrid.querySelector(`.tool-card[data-tool-id="${firstToolId}"]`);
      if (firstCard) {
        firstCard.classList.add('active');
      }
      loadTool(firstToolId);
    }
  }

  function loadTool(toolId) {
    const tool = window.Tools.find(t => t.id === toolId);
    if (!tool) return;
    currentToolId = toolId;

    // render tool HTML
    toolContainer.innerHTML = tool.render();

    // if tool has setup function, call it
    if (typeof tool.setup === 'function') {
      tool.setup(toolContainer);
    }
  }

  // -------- Initialisation --------
  // Tools are loaded from tools.js (which runs before main.js)
  // but we need to wait for them to be registered.
  // We'll render once after a short delay to ensure tools are pushed.
  setTimeout(() => {
    renderToolGrid();
  }, 50);

  // Also expose refresh function for dynamic additions
  window.refreshTools = renderToolGrid;

  console.log('DevKit ready. Tools registered:', window.Tools.length);
})();