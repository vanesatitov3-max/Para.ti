// Script limpio y coherente para 'mi-carta'
// Selección de elementos
const envelope = document.getElementById('envelope');
const card = document.getElementById('card');
const secondCard = document.getElementById('secondCard');
const sad = document.getElementById('sad');
const extra = document.getElementById('extra');
const buttonsContainer = document.getElementById('buttons');
const question = document.getElementById('question');
const music = document.getElementById('music');
const showSecretBtn = document.getElementById('showSecretBtn');

// Estado
let step = 0; // 0 = inicio, 1 = confirmar abrir, 2 = confirmar no abrir

// Accesibilidad: elemento aria-live
const live = document.createElement('div');
live.setAttribute('aria-live', 'polite');
live.className = 'visually-hidden';
envelope.appendChild(live);

// Utilidad: crear botón con listener
function createButton(text, handler){
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn';
  btn.textContent = text;
  btn.addEventListener('click', handler);
  return btn;
}

// Reproducir música (intentar manejar promesas de autoplay)
function playMusic(){
  if (!music) return;
  music.volume = 0.6;
  music.loop = true;
  music.currentTime = 0;
  const p = music.play();
  if (p && typeof p.then === 'function') p.catch(()=>{});
}

function stopMusic(){ if (!music) return; try{ music.pause(); music.currentTime = 0; }catch(e){} }

// Mostrar la primera carta y reproducir música al mostrarla (requisito)
function openFirstCard(){
  envelope.classList.remove('active');
  sad.classList.remove('active');
  card.classList.add('active');
  // animación de apertura
  card.classList.remove('animate-open');
  void card.offsetWidth; // force reflow
  card.classList.add('animate-open');
  live.textContent = 'Carta abierta.';
  // Reproducir música justo cuando se muestra la carta
  playMusic();
  // Añadir botón continuar si no existe
  ensureContinueButton();
}

function ensureContinueButton(){
  if (card.querySelector('#continueBtn')) return;
  const continueBtn = createButton('Continuar 💙', () => {
    card.classList.remove('active');
    if (secondCard) secondCard.classList.add('active');
    if (secondCard){
      secondCard.classList.add('active');
      // animación para segunda carta
      secondCard.classList.remove('animate-slide-right');
      void secondCard.offsetWidth;
      secondCard.classList.add('animate-slide-right');
    }
  });
  continueBtn.id = 'continueBtn';
  // animar botón al insertarlo
  card.appendChild(continueBtn);
  animateButton(continueBtn);
}

function showSad(){
  envelope.classList.remove('active');
  card.classList.remove('active');
  sad.classList.add('active');
  // animación pop en imagen triste
  sad.classList.remove('animate-pop');
  void sad.offsetWidth;
  sad.classList.add('animate-pop');
  live.textContent = 'Imagen triste mostrada.';
  // Reproducir música suave también si quieres
  playMusic();
}

function resetToStart(){
  question.textContent = '¿Quieres abrir la carta? 💌';
  live.textContent = 'Inicio';
  step = 0;
  buttonsContainer.innerHTML = '';
  setupInitialButtons();
  envelope.classList.add('active');
  card.classList.remove('active');
  sad.classList.remove('active');
  if (secondCard) secondCard.classList.remove('active');
  if (extra) extra.classList.remove('active');
  stopMusic();
}

// Botones iniciales y sus transiciones
function setupInitialButtons(){
  buttonsContainer.innerHTML = '';
  const yesBtn = createButton('Sí 💌', () => {
    if (step === 0){
      // pedir confirmación antes de abrir
      question.textContent = '¿Estás seguro de querer abrirla? 💜';
      live.textContent = 'Confirma abrir la carta';
      step = 1;
      yesBtn.textContent = 'Abrir';
      noBtn.textContent = 'Cancelar';
      yesBtn.focus();
    } else if (step === 1){
      openFirstCard();
    }
  });

  const noBtn = createButton('No 💔', () => {
    if (step === 0){
      question.textContent = '¿De verdad no quieres abrirla? 😢';
      live.textContent = 'Confirma no abrir la carta';
      step = 2;
      noBtn.textContent = 'Sí, no abrir';
      yesBtn.textContent = 'Pensar';
      noBtn.focus();
    } else if (step === 2){
      showSad();
    } else {
      // cancelar y volver
      resetToStart();
    }
  });

  // referencias para closures
  buttonsContainer.appendChild(yesBtn);
  buttonsContainer.appendChild(noBtn);
  // animar botones entrantes
  animateButton(yesBtn, 40);
  animateButton(noBtn, 120);
}

// animar botones añadidos: les añade clase .animate-btn después de delay ms
function animateButton(el, delay = 0){
  el.classList.remove('animate-btn');
  el.style.opacity = '0';
  el.style.transform = 'translateY(6px)';
  setTimeout(() => {
    el.classList.add('animate-btn');
    el.style.opacity = '';
    el.style.transform = '';
  }, delay);
}

// Manejo de botones de la segunda carta y vista completa
const viewCartaBtn = document.getElementById('viewCartaBtn');
const backFromCartaBtn = document.getElementById('backFromCartaBtn');
const fullCarta = document.getElementById('fullCarta');

if (viewCartaBtn){
  viewCartaBtn.addEventListener('click', () => {
    if (secondCard) secondCard.classList.remove('active');
    if (fullCarta){
      fullCarta.classList.add('active');
      // animación ligera (ahora como card en flujo)
      fullCarta.classList.remove('animate-open'); void fullCarta.offsetWidth; fullCarta.classList.add('animate-open');
    }
  });
}

if (backFromCartaBtn){
  backFromCartaBtn.addEventListener('click', () => {
    if (fullCarta) fullCarta.classList.remove('active');
    if (secondCard) secondCard.classList.add('active');
  });
}

// Ahora el botón showSecretBtn (en la vista fullCarta) mostrará el extra
if (showSecretBtn){
  showSecretBtn.addEventListener('click', () => {
    if (confirm('¿Estás seguro que quieres ver el mensaje oculto? 💭')){
      if (confirm('¿De verdad estás completamente seguro? 💙')){
        // ocultar vistas previas
        if (fullCarta) fullCarta.classList.remove('active');
        if (secondCard) secondCard.classList.remove('active');
        // mostrar extra con animación
        if (extra){
          extra.classList.add('active');
          extra.classList.remove('animate-slide-up'); void extra.offsetWidth; extra.classList.add('animate-slide-up');
        }
        // restaurar scroll si estaba bloqueado
        document.body.style.overflow = '';
      }
    }
  });
}

  // Zoom y cierre del modal de carta grande
  const zoomCartaBtn = document.getElementById('zoomCartaBtn');
  const closeFullCartaBtn = document.getElementById('closeFullCarta');
  const fullCartaImg = document.getElementById('fullCartaImg');

  if (zoomCartaBtn && fullCartaImg){
    zoomCartaBtn.addEventListener('click', toggleZoom);
    // permitir doble-click (escritorio) para alternar zoom
    fullCartaImg.addEventListener('dblclick', (e) => {
      if (e.target && e.target.id === 'fullCartaImg') toggleZoom();
    });
    // detectar doble-tap en móviles: dos toques rápidos en la imagen alternan zoom
    let lastTouch = 0;
    fullCartaImg.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouch <= 300){
        // doble-tap detectado
        e.preventDefault();
        toggleZoom();
        lastTouch = 0;
      } else {
        lastTouch = now;
      }
    }, { passive: false });
  }

  if (closeFullCartaBtn){
    closeFullCartaBtn.addEventListener('click', () => {
      if (fullCarta) fullCarta.classList.remove('active');
      // asegurarse que la imagen no quede zoomed
      if (fullCartaImg) fullCartaImg.classList.remove('zoomed');
      // restaurar el icono de zoom
      if (zoomCartaBtn) zoomCartaBtn.textContent = '🔍';
    });
  }


  function toggleZoom(){
    const isZoomed = fullCartaImg.classList.toggle('zoomed');
    if (zoomCartaBtn) zoomCartaBtn.textContent = isZoomed ? '✖' : '🔍';
    if (isZoomed){
      setTimeout(() => { fullCartaImg.scrollIntoView({behavior:'smooth', block:'center'}); }, 80);
    }
  }

// Inicializar
setupInitialButtons();

// Atajos de teclado: Enter = aceptar; Escape = volver/reset
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter'){
    // elegir el primer botón disponible dentro de buttonsContainer
    const firstBtn = buttonsContainer.querySelector('button');
    if (firstBtn) firstBtn.click();
  }
  if (e.key === 'Escape'){
    resetToStart();
  }
});

// Exponer utilidades mínimas
window._miCarta = { reset: resetToStart, playMusic, stopMusic };