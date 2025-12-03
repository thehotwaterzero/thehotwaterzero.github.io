// Theme Toggle
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  
  if (themeToggle) {
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', function() {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
});

// Sidebar Navigation
document.addEventListener('DOMContentLoaded', function() {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarClose = document.getElementById('sidebarClose');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.add('active');
      sidebarOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    
    const closeSidebar = function() {
      sidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };
    
    if (sidebarClose) {
      sidebarClose.addEventListener('click', closeSidebar);
    }
    
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', closeSidebar);
    }
  }
});

// Background Carousel
document.addEventListener('DOMContentLoaded', function() {
  const carouselItems = document.querySelectorAll('.carousel-item');
  const indicators = document.querySelectorAll('.indicator');
  
  if (carouselItems.length > 0) {
    let currentSlide = 0;
    const totalSlides = carouselItems.length;
    
    function showSlide(index) {
      carouselItems.forEach(item => item.classList.remove('active'));
      indicators.forEach(ind => ind.classList.remove('active'));
      
      carouselItems[index].classList.add('active');
      indicators[index].classList.add('active');
    }
    
    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    }
    
    // Auto advance every 5 seconds
    setInterval(nextSlide, 5000);
    
    // Manual navigation
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', function() {
        currentSlide = index;
        showSlide(currentSlide);
      });
    });
  }
});

// Music Player
document.addEventListener('DOMContentLoaded', function() {
  const musicPlayer = document.getElementById('musicPlayer');
  const playerToggle = document.getElementById('playerToggle');
  const playerClose = document.getElementById('playerClose');
  const audioPlayer = document.getElementById('audioPlayer');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const volumeBtn = document.getElementById('volumeBtn');
  const progressFill = document.getElementById('progressFill');
  const progressBar = document.querySelector('.progress-bar');
  const currentTimeEl = document.getElementById('currentTime');
  const durationEl = document.getElementById('duration');
  const songTitleEl = document.getElementById('songTitle');
  const songArtistEl = document.getElementById('songArtist');
  const albumCoverEl = document.getElementById('albumCover');
  const playerStatusEl = document.getElementById('playerStatus');
  const playIcon = playPauseBtn ? playPauseBtn.querySelector('.play-icon') : null;
  const pauseIcon = playPauseBtn ? playPauseBtn.querySelector('.pause-icon') : null;
  
  // Update player status text
  function updatePlayerStatus(isPlaying) {
    if (playerStatusEl) {
      playerStatusEl.textContent = isPlaying ? '正在播放' : '暂停中';
    }
  }
  
  // Load playlist data
  let playlist = [];
  let currentTrackIndex = 0;
  const playlistData = document.getElementById('playlistData');
  if (playlistData) {
    try {
      playlist = JSON.parse(playlistData.textContent);
    } catch (e) {
      console.error('Failed to parse playlist data:', e);
    }
  }
  
  // Function to load track
  function loadTrack(index) {
    if (!playlist || playlist.length === 0) return;
    
    const track = playlist[index];
    if (!track) return;
    
    // Update audio source
    audioPlayer.src = track.url;
    audioPlayer.load();
    
    // Update UI
    if (songTitleEl) songTitleEl.textContent = track.title || 'Unknown Title';
    if (songArtistEl) songArtistEl.textContent = track.artist || 'Unknown Artist';
    if (albumCoverEl) albumCoverEl.src = track.cover || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400';
    if (durationEl && track.duration) durationEl.textContent = track.duration;
    
    currentTrackIndex = index;
  }
  
  // Function to play next track
  function playNext() {
    if (playlist.length === 0) return;
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    audioPlayer.play();
    if (playIcon) playIcon.style.display = 'none';
    if (pauseIcon) pauseIcon.style.display = 'block';
  }
  
  // Function to play previous track
  function playPrev() {
    if (playlist.length === 0) return;
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    audioPlayer.play();
    if (playIcon) playIcon.style.display = 'none';
    if (pauseIcon) pauseIcon.style.display = 'block';
  }
  
  if (musicPlayer && playerToggle) {
    let isPlayerVisible = false;
    
    // Set initial volume to 50%
    if (audioPlayer) {
      audioPlayer.volume = 0.5;
    }
    
    // Auto-play when user clicks player toggle button
    let hasAttemptedAutoplay = false;
    
    playerToggle.addEventListener('click', function() {
      isPlayerVisible = !isPlayerVisible;
      musicPlayer.classList.toggle('active', isPlayerVisible);
      
      // Try autoplay on first interaction
      if (!hasAttemptedAutoplay && audioPlayer && isPlayerVisible) {
        hasAttemptedAutoplay = true;
        audioPlayer.play().then(function() {
          console.log('Playback started');
          if (playIcon) playIcon.style.display = 'none';
          if (pauseIcon) pauseIcon.style.display = 'block';
          updatePlayerStatus(true);
        }).catch(function(error) {
          console.log('Autoplay prevented:', error);
        });
      }
    });
    
    // Close button
    if (playerClose) {
      playerClose.addEventListener('click', function() {
        isPlayerVisible = false;
        musicPlayer.classList.remove('active');
      });
    }
    
    if (audioPlayer && playPauseBtn) {
      // Play/Pause
      playPauseBtn.addEventListener('click', function() {
        if (audioPlayer.paused) {
          audioPlayer.play();
          if (playIcon) playIcon.style.display = 'none';
          if (pauseIcon) pauseIcon.style.display = 'block';
          updatePlayerStatus(true);
        } else {
          audioPlayer.pause();
          if (playIcon) playIcon.style.display = 'block';
          if (pauseIcon) pauseIcon.style.display = 'none';
          updatePlayerStatus(false);
        }
      });
      
      // Previous track
      if (prevBtn) {
        prevBtn.addEventListener('click', playPrev);
      }
      
      // Next track
      if (nextBtn) {
        nextBtn.addEventListener('click', playNext);
      }
      
      // Auto play next when current track ends
      audioPlayer.addEventListener('ended', playNext);
      
      // Update progress
      audioPlayer.addEventListener('timeupdate', function() {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFill.style.width = progress + '%';
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
      });
      
      // Load metadata
      audioPlayer.addEventListener('loadedmetadata', function() {
        durationEl.textContent = formatTime(audioPlayer.duration);
      });
      
      // Volume control
      const volumeSlider = document.getElementById('volumeSlider');
      const volumeHighIcon = volumeBtn ? volumeBtn.querySelector('.volume-high-icon') : null;
      const volumeMutedIcon = volumeBtn ? volumeBtn.querySelector('.volume-muted-icon') : null;
      let lastVolume = 1.0; // 记录静音前的音量
      
      if (volumeSlider) {
        // Update volume from slider
        volumeSlider.addEventListener('input', function() {
          const volume = this.value / 100;
          audioPlayer.volume = volume;
          audioPlayer.muted = false;
          if (volume > 0) {
            lastVolume = volume; // 保存非零音量
          }
          updateVolumeIcon(volume);
        });
        
        // Mute/unmute toggle
        if (volumeBtn) {
          volumeBtn.addEventListener('click', function() {
            if (audioPlayer.muted || audioPlayer.volume === 0) {
              // 取消静音，恢复到之前的音量
              audioPlayer.muted = false;
              audioPlayer.volume = lastVolume;
              volumeSlider.value = lastVolume * 100;
              updateVolumeIcon(lastVolume);
            } else {
              // 静音
              lastVolume = audioPlayer.volume; // 保存当前音量
              audioPlayer.muted = true;
              updateVolumeIcon(0);
            }
          });
        }
        
        function updateVolumeIcon(volume) {
          if (volumeHighIcon && volumeMutedIcon) {
            if (volume === 0 || audioPlayer.muted) {
              volumeHighIcon.style.display = 'none';
              volumeMutedIcon.style.display = 'block';
            } else {
              volumeHighIcon.style.display = 'block';
              volumeMutedIcon.style.display = 'none';
            }
          }
        }
      }
    }
    
    function formatTime(seconds) {
      if (isNaN(seconds)) return '00:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  }
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navList = document.querySelector('.nav-list');
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      navList.classList.toggle('active');
      this.classList.toggle('active');
    });
  }
});

// Smooth Scroll for Anchor Links
document.addEventListener('DOMContentLoaded', function() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// Add Reading Progress Bar
document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.post-detail')) {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    const progressFill = document.querySelector('.reading-progress-fill');
    
    window.addEventListener('scroll', function() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      progressFill.style.width = scrollPercentage + '%';
    });
    
    // Add CSS for progress bar
    const style = document.createElement('style');
    style.textContent = `
      .reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: var(--bg-tertiary);
        z-index: 9999;
      }
      
      .reading-progress-fill {
        height: 100%;
        background: var(--brand-gradient);
        width: 0%;
        transition: width 0.2s ease;
      }
    `;
    document.head.appendChild(style);
  }
});

// Copy Code Block
document.addEventListener('DOMContentLoaded', function() {
  const codeBlocks = document.querySelectorAll('pre');
  
  codeBlocks.forEach(block => {
    const button = document.createElement('button');
    button.className = 'copy-code-button';
    button.textContent = '复制';
    button.onclick = function() {
      const code = block.querySelector('code');
      const text = code ? code.textContent : block.textContent;
      
      navigator.clipboard.writeText(text).then(() => {
        button.textContent = '已复制!';
        setTimeout(() => {
          button.textContent = '复制';
        }, 2000);
      });
    };
    
    block.style.position = 'relative';
    block.appendChild(button);
  });
  
  // Add CSS for copy button
  const style = document.createElement('style');
  style.textContent = `
    .copy-code-button {
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 4px 12px;
      background: var(--brand-primary);
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 0.875rem;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    
    pre:hover .copy-code-button {
      opacity: 1;
    }
    
    .copy-code-button:hover {
      background: var(--brand-secondary);
    }
  `;
  document.head.appendChild(style);
});

// Image Lazy Loading
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
});

// Back to Top Button
document.addEventListener('DOMContentLoaded', function() {
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.innerHTML = '↑';
  backToTop.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(backToTop);
  
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  
  backToTop.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Add CSS for back to top button
  const style = document.createElement('style');
  style.textContent = `
    .back-to-top {
      position: fixed;
      bottom: 80px;
      right: 24px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: var(--text-primary);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 999;
    }
    
    .back-to-top.visible {
      opacity: 1;
      visibility: visible;
    }
    
    .back-to-top:hover {
      background: var(--brand-primary);
      color: white;
      transform: translateY(-4px);
    }
  `;
  document.head.appendChild(style);
});

// Category Tree View Toggle
document.addEventListener('DOMContentLoaded', function() {
  // View toggle buttons
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  const treeView = document.querySelector('.categories-tree-view');
  const gridView = document.querySelector('.categories-grid-view');
  
  if (toggleBtns.length > 0) {
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const view = this.dataset.view;
        
        // Update button states
        toggleBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Toggle views
        if (view === 'tree') {
          if (treeView) treeView.classList.add('active');
          if (gridView) gridView.classList.remove('active');
          localStorage.setItem('categoryView', 'tree');
        } else {
          if (treeView) treeView.classList.remove('active');
          if (gridView) gridView.classList.add('active');
          localStorage.setItem('categoryView', 'grid');
        }
      });
    });
    
    // Restore saved view preference
    const savedView = localStorage.getItem('categoryView');
    if (savedView === 'grid') {
      const gridBtn = document.querySelector('.toggle-btn[data-view="grid"]');
      if (gridBtn) gridBtn.click();
    }
  }
  
  // Tree item toggle
  const treeToggles = document.querySelectorAll('.tree-toggle');
  treeToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const treeItem = this.closest('.tree-item');
      if (treeItem) {
        treeItem.classList.toggle('expanded');
      }
    });
  });
  
  // Auto-expand root level categories by default
  const rootTreeItems = document.querySelectorAll('.tree-item[data-level="0"]');
  rootTreeItems.forEach(item => {
    if (item.querySelector('.tree-children')) {
      item.classList.add('expanded');
    }
  });
});

