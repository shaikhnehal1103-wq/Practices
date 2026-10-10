const slide = document.querySelector('.slide');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
const counter = document.querySelector('.counter');

const AUTO_DELAY = 6000;
let timer = null;

// the 2nd item in the list is always the one on screen
function updateCounter() {
  const items = slide.querySelectorAll('.item');
  const current = items[1].dataset.index.padStart(2, '0');
  const total = String(items.length).padStart(2, '0');
  counter.textContent = current + ' / ' + total;
}

function goNext() {
  const items = slide.querySelectorAll('.item');
  slide.appendChild(items[0]);
  updateCounter();
}

function goPrev() {
  const items = slide.querySelectorAll('.item');
  slide.prepend(items[items.length - 1]);
  updateCounter();
}

const bar = document.querySelector('.bar');

// restart the little progress bar from zero
function restartBar() {
  bar.classList.remove('run');
  void bar.offsetWidth;
  bar.classList.add('run');
}

function startAuto() {
  stopAuto();
  restartBar();
  timer = setInterval(() => {
    goNext();
    restartBar();
  }, AUTO_DELAY);
}

function stopAuto() {
  clearInterval(timer);
  bar.classList.remove('run');
}

nextBtn.addEventListener('click', () => {
  goNext();
  startAuto();
});

prevBtn.addEventListener('click', () => {
  goPrev();
  startAuto();
});

// clicking one of the small cards brings it to the front
slide.addEventListener('click', (e) => {
  const clicked = e.target.closest('.item');
  if (!clicked) return;

  const items = Array.from(slide.children);
  if (items.indexOf(clicked) < 2) return;

  while (slide.children[1] !== clicked) {
    slide.appendChild(slide.children[0]);
  }
  updateCounter();
  startAuto();
});

// arrow keys
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    goNext();
    startAuto();
  }
  if (e.key === 'ArrowLeft') {
    goPrev();
    startAuto();
  }
});

// swipe on phones
let touchX = 0;

slide.addEventListener('touchstart', (e) => {
  touchX = e.changedTouches[0].clientX;
});

slide.addEventListener('touchend', (e) => {
  const diff = e.changedTouches[0].clientX - touchX;
  if (Math.abs(diff) < 50) return;

  diff < 0 ? goNext() : goPrev();
  startAuto();
});

// pause autoplay while the mouse is on the slider
slide.addEventListener('mouseenter', stopAuto);
slide.addEventListener('mouseleave', startAuto);

updateCounter();
startAuto();
