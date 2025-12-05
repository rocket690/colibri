// Общая логика: год в футере, бургер-меню, слайдер отзывов
document.getElementById('year')?.textContent = new Date().getFullYear();

// Бургер меню (копия для всех страниц — безопасно)
document.querySelectorAll('#burger').forEach(btn => {
  btn.addEventListener('click', () => {
    const nav = document.getElementById('nav');
    if(!nav) return;
    if(nav.style.display === 'flex' || nav.style.display === '') {
      nav.style.display = 'none';
    } else {
      nav.style.display = 'flex';
      nav.style.flexDirection = 'column';
    }
  });
});

// Простой слайдер для отзывов
(function(){
  const track = document.getElementById('testimonialTrack');
  if(!track) return;
  let idx = 0;
  const items = Array.from(track.children);
  function show(i){
    idx = (i + items.length) % items.length;
    const w = items[0].getBoundingClientRect().width + 12;
    track.style.transform = `translateX(${-idx * w}px)`;
  }
  setInterval(()=> show(idx+1), 4000);
})();
