document.addEventListener('DOMContentLoaded', () => {

  const GOOGLE_SHEETS_API_KEY = 'AIzaSyCvyswdAfUU_QRqObbX6849PclID91gh-M';
  const SPREADSHEET_ID = '1qUoWEk_Cr_IMi8HjIoaO3OJXcImf9pJ45hbRfdiOxlU';
  const SHEET_NAME = 'Список сотрудников';

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

  const lkLogin = document.getElementById('lkLogin');
  const lkProfile = document.getElementById('lkProfile');
  const lkInput = document.getElementById('lkInput');
  const lkSubmit = document.getElementById('lkSubmit');
  const lkBack = document.getElementById('lkBack');
  const lkError = document.getElementById('lkError');
  const lkLoading = document.getElementById('lkLoading');
  const lkDataGrid = document.getElementById('lkDataGrid');
  const lkDiscipline = document.getElementById('lkDiscipline');

  let allEmployees = [];

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
    fetchEmployeeData();
  });

  async function fetchEmployeeData() {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${GOOGLE_SHEETS_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.values && data.values.length > 1) {
        const rows = data.values.slice(1);
        allEmployees = rows.map(row => ({
          nickname: row[1] || '',
          accountNumber: row[2] || '',
          callsign: row[3] || '',
          rank: row[4] || '',
          rankImg: row[5] || '',
          position: row[6] || '',
          discipline: row[7] || '',
          vk: row[8] || ''
        }));
        console.log('Загружено сотрудников:', allEmployees.length);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  }

  document.addEventListener('mousemove', (e) => {
    customCursor.style.left = e.clientX + 'px';
    customCursor.style.top = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .nav-item, .accordion-trigger, .resource-link, .commander-card, .unit-card, .info-card, .legal-link-item, .lk-input').forEach(el => {
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
  document.getElementById('lkBtn')?.addEventListener('click', () => document.getElementById('lk')?.scrollIntoView({ behavior: 'smooth' }));

  if (manualLink) {
    manualLink.addEventListener('click', (e) => {
    });
  }

  lkSubmit.addEventListener('click', () => {
    const query = lkInput.value.trim().toLowerCase();
    if (!query) {
      lkError.textContent = 'ВВЕДИТЕ НОМЕР АККАУНТА, НИКНЕЙМ ИЛИ ПОЗЫВНОЙ';
      return;
    }
    if (allEmployees.length === 0) {
      lkError.textContent = 'БАЗА ДАННЫХ НЕ ЗАГРУЖЕНА. ПОВТОРИТЕ ПОЗЖЕ';
      return;
    }
    lkError.textContent = '';
    lkLoading.style.display = 'block';
    setTimeout(() => {
      lkLoading.style.display = 'none';
      const employee = allEmployees.find(emp =>
        emp.accountNumber.toLowerCase() === query ||
        emp.nickname.toLowerCase() === query ||
        emp.callsign.toLowerCase() === query
      );
      if (employee) {
        displayProfile(employee);
      } else {
        lkError.textContent = 'СОТРУДНИК НЕ НАЙДЕН. ПРОВЕРЬТЕ ДАННЫЕ';
      }
    }, 600);
  });

  lkInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') lkSubmit.click();
  });

  lkBack.addEventListener('click', () => {
    lkProfile.style.display = 'none';
    lkLogin.style.display = 'block';
    lkInput.value = '';
  });

  function displayProfile(employee) {
    lkLogin.style.display = 'none';
    lkProfile.style.display = 'block';

    let html = '';

    html += `<div class="lk-field"><span class="lk-label">НИКНЕЙМ:</span><span class="lk-value">${employee.nickname || '—'}</span></div>`;
    html += `<div class="lk-field"><span class="lk-label">НОМЕР АККАУНТА:</span><span class="lk-value">${employee.accountNumber || '—'}</span></div>`;
    html += `<div class="lk-field"><span class="lk-label">ПОЗЫВНОЙ:</span><span class="lk-value">${employee.callsign || '—'}</span></div>`;

    html += `<div class="lk-field"><span class="lk-label">ЗВАНИЕ:</span><span class="lk-value">${employee.rank || '—'}</span></div>`;

    if (employee.rankImg && employee.rankImg.trim() !== '') {
      html += `<div class="lk-field"><span class="lk-label">ПОГОНЫ:</span><div class="lk-rank-container"><img src="${employee.rankImg}" alt="Погоны" class="lk-rank-img" onerror="this.style.display='none';"></div></div>`;
    }

    html += `<div class="lk-field"><span class="lk-label">ДОЛЖНОСТЬ:</span><span class="lk-value">${employee.position || '—'}</span></div>`;

    if (employee.vk && employee.vk.trim() !== '') {
      html += `<div class="lk-field"><span class="lk-label">VK:</span><a href="${employee.vk}" target="_blank" rel="noopener" class="lk-vk-link">ПЕРЕЙТИ</a></div>`;
    } else {
      html += `<div class="lk-field"><span class="lk-label">VK:</span><span class="lk-value">—</span></div>`;
    }

    lkDataGrid.innerHTML = html;

    if (employee.discipline && employee.discipline.trim() !== '') {
      lkDiscipline.innerHTML = `<h4>ДИСЦИПЛИНАРНЫЕ ВЗЫСКАНИЯ</h4><p>${employee.discipline}</p>`;
      lkDiscipline.style.display = 'block';
    } else {
      lkDiscipline.innerHTML = '<h4>ДИСЦИПЛИНАРНЫЕ ВЗЫСКАНИЯ</h4><p>Взысканий нет</p>';
      lkDiscipline.style.display = 'block';
    }
  }

  const modalData = {
    'modal-pdp': {
      title: 'Оказание ПДП — Правовая и доврачебная помощь',
      content: `<h4>1. Правовая помощь</h4>
      <p><strong>Виды правовой помощи:</strong> разъяснение гражданам их прав и обязанностей в зоне проведения специальной операции; обеспечение сохранности личного имущества; документирование фактов нарушения прав граждан.</p>
      <h4>2. Доврачебная помощь</h4>
      <p><strong>Алгоритм действий при ранении:</strong> обеспечение безопасности → оценка состояния → остановка массивного кровотечения → проверка дыхательных путей → вызов квалифицированной медицинской помощи → эвакуация.</p>`
    },
    'modal-svu': {
      title: 'Разминирование СВУ — Самодельные взрывные устройства',
      content: `<h4>1. Виды СВУ</h4>
      <p><strong>По способу подрыва:</strong> контактные (нажимные, натяжные, обрывные), неконтактные (радиоуправляемые, инфракрасные, акустические), таймерные.</p>
      <h4>2. Алгоритм действий при обнаружении</h4>
      <p><strong>Первичные действия:</strong> немедленно прекратить движение → предупредить личный состав → обозначить опасную зону → отойти на безопасное расстояние (не менее 100 метров) → доложить командиру.</p>`
    },
    'modal-coord': {
      title: 'Координация нарядов',
      content: `<h4>1. Система управления</h4>
      <p>Централизованное управление всеми наружными службами через автоматизированную систему управления (АСУ). Отслеживание местоположения патрулей в реальном времени через GPS-трекеры.</p>`
    },
    'modal-stroy': {
      title: 'Строевая подготовка',
      content: `<h4>1. Цели и задачи</h4>
      <p>Отработка слаженности подразделений, формирование дисциплины, обучение быстрому и правильному выполнению команд в условиях ограниченного времени.</p>`
    },
    'modal-ognev': {
      title: 'Огневая подготовка',
      content: `<h4>1. Табельное оружие</h4>
      <p><strong>Пистолет Макарова (ПМ):</strong> скоростная стрельба на дистанции до 25 метров, стрельба из неудобных положений.</p><p><strong>Автомат Калашникова АК-105:</strong> стрельба одиночными и очередями, смена магазина.</p>`
    },
    'modal-med': {
      title: 'Тактическая медицина',
      content: `<h4>1. Стандарты TCCC</h4>
      <p>Тактическая медицинская помощь в боевых условиях разделяется на три этапа: помощь под огнём, помощь в укрытии, помощь при эвакуации.</p>`
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
