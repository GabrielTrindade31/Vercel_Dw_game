const translations = {
  en: {
    skip:'Skip to game',brandTag:'Data laboratory',language:'Language',eyebrow:'EXPLORE · QUERY · DISCOVER',title:'Learn with every discovery.',lead:'An educational game connecting exploration, SQL and data analysis. Enter the world of DWGames and turn questions into discoveries.',gameTitle:'Your space to explore',session:'Interactive experience',loading:'Preparing your adventure…',sound:'Click inside the game to interact and enable audio.',fullscreen:'⛶ Full screen',guideEyebrow:'GETTING STARTED',guideTitle:'Learn by doing, at your own pace.',guideIntro:'Explore the environment, notice the details and use data to understand what you find.',step1Title:'Explore and observe',step1:'Follow the instructions inside the game. Observe the animals and the elements of each scene before moving on.',step2Title:'Experiment with SQL',step2:'Read the challenge, run your query and compare the result with what you expected. Adjusting and trying again is part of learning.',step3Title:'Connect the data',step3:'Open the BI available in the game and explore the indicators. What patterns emerge? What question would you ask about them?',aboutTitle:'What is the project about?',about:'DWGames introduces students to the world of data through an interactive experience. It aims to encourage curiosity, reasoning and the connection between SQL queries and interpreting information with BI (Business Intelligence). Discuss your discoveries with your classmates and explain how you reached your answers.',tipsTitle:'Tips for a good session',tip1:'Prefer a computer with an up-to-date browser. Use full screen for a better view of the game.',tip2:'The first load may take a little while. Wait for the progress bar.',tip3:'Write down your queries and discoveries before leaving: reloading the page may reset your progress.',tip4:'This selector translates the page tips. The game language depends on the options available inside it.',footer:'Curiosity is the starting point. Data helps you find the way.',error:'The game could not load. Check your connection and try reloading the page.',fullscreenError:'Full screen is unavailable in this browser.',ready:'DWGames · Learn by playing'
  },
  es: {
    skip:'Ir al juego',brandTag:'Laboratorio de datos',language:'Idioma',eyebrow:'EXPLORAR · CONSULTAR · DESCUBRIR',title:'Aprende con cada descubrimiento.',lead:'Un juego educativo que conecta exploración, SQL y análisis de datos. Entra al mundo de DWGames y transforma preguntas en descubrimientos.',gameTitle:'Tu espacio para explorar',session:'Experiencia interactiva',loading:'Preparando tu aventura…',sound:'Haz clic en el juego para interactuar y habilitar el audio.',fullscreen:'⛶ Pantalla completa',guideEyebrow:'PARA EMPEZAR',guideTitle:'Aprende haciendo, a tu ritmo.',guideIntro:'Explora el entorno, observa los detalles y usa los datos para entender lo que encuentras.',step1Title:'Explora y observa',step1:'Sigue las instrucciones dentro del juego. Observa los animales y los elementos de cada escena antes de avanzar.',step2Title:'Experimenta con SQL',step2:'Lee el desafío, ejecuta tu consulta y compara el resultado con lo que esperabas. Ajustar y volver a intentar es parte del aprendizaje.',step3Title:'Conecta los datos',step3:'Abre el BI disponible en el juego y observa los indicadores. ¿Qué patrones aparecen? ¿Qué pregunta harías a partir de ellos?',aboutTitle:'¿Cuál es la idea del proyecto?',about:'DWGames acerca a los estudiantes al mundo de los datos mediante una experiencia interactiva. La propuesta busca estimular la curiosidad, el razonamiento y la conexión entre consultas SQL e interpretación de información con BI (Business Intelligence). Comparte tus descubrimientos con la clase y explica cómo llegaste a tus respuestas.',tipsTitle:'Consejos para una buena sesión',tip1:'Prefiere una computadora con un navegador actualizado. Usa pantalla completa para ver mejor el juego.',tip2:'La primera carga puede tardar un poco. Espera a que termine la barra de progreso.',tip3:'Anota tus consultas y descubrimientos antes de salir: recargar la página puede reiniciar tu progreso.',tip4:'Este selector traduce los consejos de la página. El idioma del juego depende de las opciones disponibles dentro de él.',footer:'La curiosidad es el punto de partida. Los datos ayudan a encontrar el camino.',error:'No se pudo cargar el juego. Comprueba tu conexión e intenta recargar la página.',fullscreenError:'La pantalla completa no está disponible en este navegador.',ready:'DWGames · Aprender jugando'
  }
};
translations.pt = Object.fromEntries([...document.querySelectorAll('[data-i18n]')].map(element => [element.dataset.i18n, element.textContent]));
Object.assign(translations.pt, {error:'Não foi possível carregar o jogo. Confira sua conexão e tente recarregar a página.',fullscreenError:'Tela cheia indisponível neste navegador.',ready:'DWGames · Aprender jogando'});
const languageSelect = document.querySelector('#language');
let language = 'pt';
let errorKey = null;
function setLanguage(value) {
  language = translations[value] ? value : 'pt';
  document.documentElement.lang = {pt:'pt-BR',en:'en',es:'es'}[language];
  languageSelect.value = language;
  languageSelect.setAttribute('aria-label', translations[language].language);
  for (const element of document.querySelectorAll('[data-i18n]')) element.textContent = translations[language][element.dataset.i18n];
  document.title = translations[language].ready;
  if (errorKey) document.querySelector('#unity-warning').textContent = translations[language][errorKey];
  try { localStorage.setItem('dwgames-language',language); } catch {}
}
let saved;
try { saved = localStorage.getItem('dwgames-language'); } catch {}
setLanguage(saved || navigator.language.split('-')[0]);
languageSelect.addEventListener('change', () => setLanguage(languageSelect.value));
const canvas = document.querySelector('#unity-canvas');
const loading = document.querySelector('#unity-loading-bar');
const warning = document.querySelector('#unity-warning');
function showError(key='error') {
  errorKey = key;
  warning.textContent = translations[language][key];
  warning.hidden = false;
  if (key === 'error') loading.style.display = 'none';
}
const loader = document.createElement('script');
loader.src = 'Build/buildaqui.loader.js';
loader.onerror = () => showError();
loader.onload = async () => {
  try {
    const instance = await createUnityInstance(canvas, {
      arguments:[],dataUrl:'Build/buildaqui.data.br',frameworkUrl:'Build/buildaqui.framework.js.br',codeUrl:'Build/buildaqui.wasm.br',streamingAssetsUrl:'StreamingAssets',companyName:'DefaultCompany',productName:'DWGames',productVersion:'1.0',
      showBanner(message,type) { console[type === 'error' ? 'error' : 'warn'](message); if (type === 'error') showError(); }
    }, progress => {
      const percent = Math.round(progress * 100);
      document.querySelector('#unity-progress-bar-full').style.width = `${percent}%`;
      document.querySelector('#loading-percent').textContent = `${percent}%`;
    });
    loading.style.display = 'none';
    const fullscreen = document.querySelector('#unity-fullscreen-button');
    fullscreen.disabled = false;
    fullscreen.addEventListener('click', () => {
      try { instance.SetFullscreen(1); } catch (error) { console.error(error); showError('fullscreenError'); }
    });
  } catch (error) { console.error(error); showError(); }
};
document.body.appendChild(loader);
