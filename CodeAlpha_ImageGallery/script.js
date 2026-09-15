const allGallery = document.getElementById('gallery-all');
const categoryItems = Array.from(document.querySelectorAll('.category-block[data-category] .gallery-item'));

categoryItems.forEach((item) => {
  allGallery.appendChild(item.cloneNode(true));
});

const galleryItems = document.querySelectorAll('.gallery-item');
const categoryBlocks = document.querySelectorAll('.category-block');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxCounter = document.getElementById('lightbox-counter');
const closeBtn = document.getElementById('close-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const filterOpts = document.querySelectorAll('.filter-opt');

let currentIndex = 0;
let visibleItems = Array.from(document.querySelectorAll('#gallery-all .gallery-item'));

// ---------- OPEN LIGHTBOX ----------
function openLightbox(index) {
  currentIndex = index;
  showImage(currentIndex);
  lightbox.classList.add('active');
}

document.getElementById('gallery-wrapper').addEventListener('click', (e) => {
  const item = e.target.closest('.gallery-item');
  if (!item || item.classList.contains('hidden')) return;

  visibleItems = Array.from(document.querySelectorAll('.category-block:not(.hidden) .gallery-item:not(.hidden)'));
  openLightbox(visibleItems.indexOf(item));
});

// ---------- CLOSE LIGHTBOX ----------
closeBtn.addEventListener('click', () => {
  lightbox.classList.remove('active');
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove('active');
  }
});

// ---------- NEXT / PREV ----------
function showImage(index) {
  const item = visibleItems[index];
  const img = item.querySelector('img');
  lightboxImg.src = img.src;
  lightboxTitle.innerText = img.alt;
  lightboxCounter.innerText = `${index + 1} / ${visibleItems.length}`;

  // reset image filter to Normal every time a new image opens
  lightboxImg.classList.remove('f-bw', 'f-vivid', 'f-sepia', 'f-cool');
  filterOpts.forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-opt[data-filter="none"]').classList.add('active');
}

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % visibleItems.length;
  showImage(currentIndex);
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
  showImage(currentIndex);
});

// ---------- KEYBOARD NAVIGATION ----------
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'ArrowRight') nextBtn.click();
  if (e.key === 'ArrowLeft') prevBtn.click();
  if (e.key === 'Escape') lightbox.classList.remove('active');
});

// ---------- CATEGORY FILTERS (hides whole blocks) ----------
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    categoryBlocks.forEach(block => {
      if (filter === 'all' ? block.id === 'section-all' : block.dataset.category === filter) {
        block.classList.remove('hidden');
      } else {
        block.classList.add('hidden');
      }
    });

    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ---------- CATEGORY COUNTS ----------
function updateCounts() {
  const categories = ['all', 'cars', 'nature', 'animals', 'mountains', 'ocean'];
  categories.forEach(cat => {
    const el = document.getElementById(`count-${cat}`);
    if (!el) return;
    const count = cat === 'all'
      ? categoryItems.length
      : categoryItems.filter(i => i.dataset.category === cat).length;
    el.innerText = `(${count})`;
  });
}

updateCounts();

// ---------- LIGHTBOX IMAGE FILTERS (photo edit options) ----------
filterOpts.forEach(btn => {
  btn.addEventListener('click', () => {
    filterOpts.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    lightboxImg.classList.remove('f-bw', 'f-vivid', 'f-sepia', 'f-cool');

    const filter = btn.dataset.filter;
    if (filter !== 'none') {
      lightboxImg.classList.add(`f-${filter}`);
    }
  });
});