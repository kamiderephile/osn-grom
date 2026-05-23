document.addEventListener('DOMContentLoaded', () => {

  const preloader = document.getElementById('preloader');
  const customCursor = document.getElementById('customCursor');
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-item');
  const revealElements = document.querySelectorAll('.reveal');
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');
  const parallaxBg = document.getElementById('parallaxBg');
  const terminalLog = document.getElementById('terminalLog');
  const glitchOverlay = document.getElementById('glitchOverlay');
  const dataStream = document.getElementById('dataStream');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  const infoCards = document.querySelectorAll('.info-card[data-modal]');
  const manualLink = document.getElementById('manualLink');

  const terminalMessages = [
    '> ЗАГРУЗКА МОДУЛЯ ШИФРОВАНИЯ... OK',
    '> ПРОВЕРКА ЦЕЛОСТНОСТИ ДАННЫХ... 100%',
    '> УСТАНОВКА ЗАЩИЩЁННОГО КАНАЛА... УСПЕШНО',
    '> ИНИЦИАЛИЗАЦИЯ ПРОТОКОЛА MVD-SEC...',
    '> ЗАГРУЗКА БАЗЫ СОТРУДНИКОВ... OK',
    '> ИНФОРМАЦИОННЫЙ ПОРТАЛ ГОТОВ.'
  ];

  let msgIndex = 0;
  const logInterval = setInterval(() => {
    if (msgIndex < terminalMessages.length) {
      terminalLog.innerHTML += terminalMessages[msgIndex] + '<br>';
      msgIndex++;
    } else {
      clearInterval(logInterval);
    }
  }, 350);

  const dataChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  function generateDataStream() {
    let html = '';
    for (let i = 0; i < 200; i++) {
      let line = '';
      for (let j = 0; j < 40; j++) {
        line += dataChars[Math.floor(Math.random() * dataChars.length)];
      }
      html += `<span>${line}</span>`;
    }
    dataStream.innerHTML = html;
  }
  generateDataStream();
  setInterval(generateDataStream, 3000);

  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 2800);
  });

  document.addEventListener('mousemove', (e) => {
    customCursor.style.left = e.clientX + 'px';
    customCursor.style.top = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .nav-item, .accordion-trigger, .resource-link, .commander-card, .unit-card, .info-card, .legal-link-item').forEach(el => {
    el.addEventListener('mouseenter', () => customCursor.classList.add('active'));
    el.addEventListener('mouseleave', () => customCursor.classList.remove('active'));
  });

  document.addEventListener('mouseleave', () => customCursor.style.opacity = '0');
  document.addEventListener('mouseenter', () => customCursor.style.opacity = '1');

  setInterval(() => {
    if (Math.random() > 0.9) {
      glitchOverlay.style.opacity = '0.07';
      setTimeout(() => glitchOverlay.style.opacity = '0', 60);
    }
  }, 350);

  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const spans = mobileToggle.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  navItems.forEach(item => item.addEventListener('click', () => {
    navLinks.classList.remove('active');
    const spans = mobileToggle.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  }));

  window.addEventListener('scroll', () => {
    navbar.style.background = window.scrollY > 80 ? 'rgba(6,8,10,0.98)' : 'rgba(6,8,10,0.92)';
    navbar.style.boxShadow = window.scrollY > 80 ? '0 4px 20px rgba(0,0,0,0.5)' : 'none';
  });

  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) current = section.getAttribute('id');
    });
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) item.classList.add('active');
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  if (parallaxBg) {
    window.addEventListener('scroll', () => {
      const hero = document.querySelector('.hero-section');
      if (hero && window.scrollY <= hero.offsetHeight) {
        parallaxBg.style.transform = `translateY(${window.scrollY * 0.2}px)`;
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.getElementById('infoBtn')?.addEventListener('click', () => document.getElementById('info')?.scrollIntoView({ behavior: 'smooth' }));
  document.getElementById('docsBtn')?.addEventListener('click', () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }));

  if (manualLink) {
    manualLink.addEventListener('click', (e) => {
    });
  }

  const modalData = {
    'modal-pdp': {
      title: 'Оказание ПДП — Правовая и доврачебная помощь',
      content: `<h4>1. Правовая помощь</h4>
      <p><strong>Виды правовой помощи:</strong> разъяснение гражданам их прав и обязанностей в зоне проведения специальной операции; обеспечение сохранности личного имущества; документирование фактов нарушения прав граждан; содействие в восстановлении утраченных документов.</p>
      <p><strong>Порядок действий:</strong> при обращении гражданина сотрудник обязан представиться, выслушать обращение, зафиксировать суть в служебном блокноте. При необходимости — оказать содействие в вызове адвоката или представителя правозащитных организаций.</p>
      <h4>2. Доврачебная помощь</h4>
      <p><strong>Виды помощи:</strong> остановка кровотечений (жгут, гемостатические средства); иммобилизация переломов; сердечно-лёгочная реанимация; обработка ран и ожогов; противошоковая терапия.</p>
      <p><strong>Алгоритм действий при ранении:</strong> обеспечение безопасности → оценка состояния → остановка массивного кровотечения → проверка дыхательных путей → вызов квалифицированной медицинской помощи → эвакуация.</p>
      <p><strong>Состав тактической аптечки IFAK:</strong> жгут CAT, гемостатический бинт, окклюзионный пластырь, декомпрессионная игла, назофарингеальная трубка, перчатки, ножницы.</p>`
    },
    'modal-svu': {
      title: 'Разминирование СВУ — Самодельные взрывные устройства',
      content: `<h4>1. Виды СВУ</h4>
      <p><strong>По способу подрыва:</strong> контактные (нажимные, натяжные, обрывные), неконтактные (радиоуправляемые, инфракрасные, акустические), таймерные.</p>
      <p><strong>По типу заряда:</strong> безоболочные, осколочные, кумулятивные, зажигательные, химические.</p>
      <h4>2. Алгоритм действий при обнаружении</h4>
      <p><strong>Первичные действия:</strong> немедленно прекратить движение → предупредить личный состав → обозначить опасную зону → отойти на безопасное расстояние (не менее 100 метров) → доложить командиру.</p>
      <p><strong>Запрещено:</strong> приближаться к предмету, трогать, перемещать, заливать водой, использовать радиостанции вблизи (дистанция не менее 50 метров).</p>
      <h4>3. Идентификация</h4>
      <p>Визуальный осмотр через оптику, тепловизор. Определение типа взрывателя, наличия проводов, антенн, таймеров. Фотофиксация с разных ракурсов.</p>
      <h4>4. Обезвреживание</h4>
      <p>Применение гидродинамических разрушителей, робототехнических комплексов. Контролируемый подрыв на месте или эвакуация в безопасное место. Взаимодействие с инженерными подразделениями ФСБ.</p>`
    },
    'modal-coord': {
      title: 'Координация нарядов',
      content: `<h4>1. Система управления</h4>
      <p>Централизованное управление всеми наружными службами через автоматизированную систему управления (АСУ). Отслеживание местоположения патрулей в реальном времени через GPS-трекеры.</p>
      <h4>2. Виды нарядов</h4>
      <p>Патрульные группы, оперативные группы, группы быстрого реагирования, снайперские пары, скрытые посты наблюдения.</p>
      <h4>3. Порядок координации</h4>
      <p>Постановка задачи → распределение секторов ответственности → установление радиоканалов → контроль исполнения → доклад о выполнении. Все переговоры ведутся через защищённые радиоканалы с шифрованием.</p>
      <h4>4. Действия при ЧС</h4>
      <p>При возникновении нештатной ситуации командир оперативного штаба немедленно перенаправляет ближайшие наряды к месту происшествия, блокирует район, организует оцепление.</p>`
    },
    'modal-stroy': {
      title: 'Строевая подготовка',
      content: `<h4>1. Цели и задачи</h4>
      <p>Отработка слаженности подразделений, формирование дисциплины, обучение быстрому и правильному выполнению команд в условиях ограниченного времени.</p>
      <h4>2. Виды строевых приёмов</h4>
      <p><strong>Строевые приёмы без оружия:</strong> строевая стойка, повороты на месте, движение строевым шагом, выход из строя, подход к начальнику.</p>
      <p><strong>Строевые приёмы с оружием:</strong> положение «на ремень», «на грудь», «за спину», перевод оружия в боевое положение.</p>
      <h4>3. Боевые порядки</h4>
      <p>Колонна, линия, клин, ромб, круг. Перестроения выполняются по сигналам командира голосом, жестами или по радио.</p>
      <h4>4. Тактические передвижения</h4>
      <p>Движение в составе группы при штурме: перебежки, прикрытие, зачистка помещений. Эвакуация раненого в строю: способы переноски, прикрытие огнём.</p>`
    },
    'modal-ognev': {
      title: 'Огневая подготовка',
      content: `<h4>1. Табельное оружие</h4>
      <p><strong>Пистолет Макарова (ПМ):</strong> скоростная стрельба на дистанции до 25 метров, стрельба из неудобных положений.</p>
      <p><strong>Автомат Калашникова АК-105:</strong> стрельба одиночными и очередями, смена магазина, устранение задержек.</p>
      <h4>2. Виды упражнений</h4>
      <p>Скоростная стрельба, штурмовая стрельба в условиях ограниченной видимости, стрельба после физической нагрузки, стрельба из-за укрытий.</p>
      <h4>3. Нормативы</h4>
      <p>Поражение мишени на дистанции 100 метров из АК — не менее 80% попаданий. Смена магазина — не более 3 секунд. Изготовка к стрельбе — не более 5 секунд.</p>`
    },
    'modal-med': {
      title: 'Тактическая медицина',
      content: `<h4>1. Стандарты TCCC</h4>
      <p>Тактическая медицинская помощь в боевых условиях разделяется на три этапа: помощь под огнём, помощь в укрытии, помощь при эвакуации.</p>
      <h4>2. Помощь под огнём</h4>
      <p>Первоочередная задача — подавление противника. Боец оказывает самопомощь: накладывает жгут, использует гемостатический бинт. Эвакуация раненого только после обеспечения огневого превосходства.</p>
      <h4>3. Помощь в укрытии</h4>
      <p>Полный осмотр раненого, остановка кровотечений, обеспечение проходимости дыхательных путей, лечение напряжённого пневмоторакса, обезболивание, подготовка к эвакуации.</p>`
    }
  };

  infoCards.forEach(card => {
    card.addEventListener('click', () => {
      const modalId = card.getAttribute('data-modal');
      if (modalData[modalId]) {
        modalBody.innerHTML = `<h3>${modalData[modalId].title}</h3>${modalData[modalId].content}`;
        modalOverlay.classList.add('active');
      }
    });
  });

  modalClose.addEventListener('click', () => modalOverlay.classList.remove('active'));
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('active');
  });

});