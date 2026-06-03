document.addEventListener('DOMContentLoaded', function() {

  const GOOGLE_SHEETS_API_KEY = 'AIzaSyCvyswdAfUU_QRqObbX6849PclID91gh-M';
  const SPREADSHEET_ID = '1qUoWEk_Cr_IMi8HjIoaO3OJXcImf9pJ45hbRfdiOxlU';
  const SHEET_NAME = 'Список сотрудников';
  const LOCK_CODE = '0306';
  const LOCK_TIMEOUT = 30;
  const IDLE_TIMEOUT = 300;

  const preloader = document.getElementById('preloader');
  const bootScreen = document.getElementById('bootScreen');
  const bootConsole = document.getElementById('bootConsole');
  const lockScreen = document.getElementById('lockScreen');
  const lockInput = document.getElementById('lockInput');
  const lockSubmitBtn = document.getElementById('lockSubmitBtn');
  const lockError = document.getElementById('lockError');
  const lockAttempts = document.getElementById('lockAttempts');
  const lockTimer = document.getElementById('lockTimer');
  const customCursor = document.getElementById('customCursor');
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-item');
  const revealElements = document.querySelectorAll('.reveal');
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');
  const parallaxBg = document.getElementById('parallaxBg');
  const terminalLog = document.getElementById('terminalLog');
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
  const lkDisciplineCard = document.getElementById('lkDisciplineCard');
  const lkProfileName = document.getElementById('lkProfileName');
  const lkProfileRank = document.getElementById('lkProfileRank');
  const lkAvatar = document.getElementById('lkAvatar');
  const lkProfileStats = document.getElementById('lkProfileStats');

  let allEmployees = [];
  let lockAttemptsLeft = 3;
  let lockTimeoutId = null;
  let idleTimeoutId = null;

  const terminalMessages = [
    '> ЗАГРУЗКА МОДУЛЯ ШИФРОВАНИЯ... OK',
    '> ПРОВЕРКА ЦЕЛОСТНОСТИ ДАННЫХ... 100%',
    '> УСТАНОВКА ЗАЩИЩЁННОГО КАНАЛА... УСПЕШНО',
    '> ИНИЦИАЛИЗАЦИЯ ПРОТОКОЛА MVD-SEC... OK',
    '> ЗАГРУЗКА БАЗЫ СОТРУДНИКОВ... 100%',
    '> ИНФОРМАЦИОННЫЙ ПОРТАЛ ГОТОВ.'
  ];

  const bootMessages = [
    '> BIOS MVD v3.2.1... OK',
    '> ПРОВЕРКА ПАМЯТИ... 16384K OK',
    '> ИНИЦИАЛИЗАЦИЯ ЯДРА... 100%',
    '> ЗАГРУЗКА MVD-OS... УСПЕШНО',
    '> ПРОВЕРКА ПОДСИСТЕМ... OK',
    '> ДОСТУП РАЗРЕШЁН'
  ];

  let msgIndex = 0;
  const logInterval = setInterval(function() {
    if (msgIndex < terminalMessages.length) {
      terminalLog.innerHTML += terminalMessages[msgIndex] + '<br>';
      msgIndex++;
    } else {
      clearInterval(logInterval);
    }
  }, 380);

  let bootMsgIndex = 0;
  const bootInterval = setInterval(function() {
    if (bootMsgIndex < bootMessages.length) {
      const span = document.createElement('span');
      span.textContent = bootMessages[bootMsgIndex];
      bootConsole.appendChild(span);
      requestAnimationFrame(function() {
        span.style.opacity = '1';
      });
      bootMsgIndex++;
    } else {
      clearInterval(bootInterval);
    }
  }, 450);

  window.addEventListener('load', function() {
    setTimeout(function() {
      preloader.classList.add('hidden');
      setTimeout(function() {
        bootScreen.classList.add('hidden');
        setTimeout(function() {
          lockScreen.classList.add('active');
        }, 300);
      }, 2600);
    }, 2800);
    fetchEmployeeData();
    resetIdleTimer();
    updateDate();
  });

  function updateDate() {
    const dateEl = document.getElementById('currentDate');
    if (dateEl) {
      const now = new Date();
      dateEl.textContent = now.toISOString().split('T')[0];
    }
  }

  function handlePinInput(val) {
    if (lockInput.disabled) return;

    if (val === 'C') {
      lockInput.value = '';
    } else {
      if (lockInput.value.length < 4) {
        lockInput.value += val;
      }
    }
    updatePinDisplay();
  }

  function updatePinDisplay() {
    const dots = document.querySelectorAll('.pin-dot');
    const val = lockInput.value;
    dots.forEach(function(dot, index) {
      if (index < val.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    });
  }

  function checkLockCode() {
    if (lockInput.disabled) return;

    const code = lockInput.value.trim();
    if (code === LOCK_CODE) {
      lockScreen.classList.remove('active');
      lockError.textContent = '';
      lockInput.value = '';
      lockAttemptsLeft = 3;
      lockAttempts.textContent = 'ПОПЫТОК: 3';
      resetIdleTimer();
      updatePinDisplay();
    } else {
      lockAttemptsLeft--;
      lockAttempts.textContent = 'ПОПЫТОК: ' + lockAttemptsLeft;
      lockError.textContent = 'НЕВЕРНЫЙ ПИН-КОД';
      lockInput.value = '';
      updatePinDisplay();

      const container = document.querySelector('.lock-container');
      if (container) {
        container.style.animation = 'none';
        container.offsetHeight;
        container.style.animation = 'shake 0.3s cubic-bezier(.36,.07,.19,.97) both';
      }

      if (lockAttemptsLeft <= 0) {
        lockInput.disabled = true;
        if (lockSubmitBtn) lockSubmitBtn.disabled = true;
        document.querySelectorAll('.num-btn').forEach(function(b) {
          b.style.pointerEvents = 'none';
          b.style.opacity = '0.4';
        });
        lockError.textContent = 'ДОСТУП ЗАБЛОКИРОВАН';
        lockTimer.style.display = 'block';
        let secondsLeft = LOCK_TIMEOUT;
        lockTimer.textContent = 'БЛОКИРОВКА ' + secondsLeft + ' СЕК';
        lockTimeoutId = setInterval(function() {
          secondsLeft--;
          lockTimer.textContent = 'БЛОКИРОВКА ' + secondsLeft + ' СЕК';
          if (secondsLeft <= 0) {
            clearInterval(lockTimeoutId);
            lockAttemptsLeft = 3;
            lockInput.disabled = false;
            if (lockSubmitBtn) lockSubmitBtn.disabled = false;
            document.querySelectorAll('.num-btn').forEach(function(b) {
              b.style.pointerEvents = 'auto';
              b.style.opacity = '1';
            });
            lockAttempts.textContent = 'ПОПЫТОК: 3';
            lockError.textContent = '';
            lockTimer.style.display = 'none';
          }
        }, 1000);
      }
    }
  }

  document.querySelectorAll('.num-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const val = btn.getAttribute('data-val');
      if (val === 'ENT') {
        checkLockCode();
      } else {
        handlePinInput(val);
      }
    });
  });

  if (lockSubmitBtn) {
    lockSubmitBtn.addEventListener('click', function(e) {
      e.preventDefault();
      checkLockCode();
    });
  }

  lockInput.addEventListener('input', updatePinDisplay);

  document.addEventListener('mousemove', resetIdleTimer);
  document.addEventListener('keydown', function(e) {
    resetIdleTimer();
    if (lockScreen.classList.contains('active')) {
      if (e.key >= '0' && e.key <= '9') {
        handlePinInput(e.key);
      } else if (e.key === 'Enter') {
        checkLockCode();
      } else if (e.key === 'Backspace') {
        lockInput.value = lockInput.value.slice(0, -1);
        updatePinDisplay();
      }
    }
  });
  document.addEventListener('click', resetIdleTimer);
  document.addEventListener('scroll', resetIdleTimer);
  document.addEventListener('touchstart', resetIdleTimer);

  function resetIdleTimer() {
    if (lockScreen.classList.contains('active')) return;
    clearTimeout(idleTimeoutId);
    idleTimeoutId = setTimeout(function() {
      lockScreen.classList.add('active');
      lockInput.value = '';
      updatePinDisplay();
    }, IDLE_TIMEOUT * 1000);
  }

  async function fetchEmployeeData() {
    try {
      const url = 'https://sheets.googleapis.com/v4/spreadsheets/' + SPREADSHEET_ID + '/values/' + SHEET_NAME + '?key=' + GOOGLE_SHEETS_API_KEY;
      const response = await fetch(url);
      const data = await response.json();
      if (data.values && data.values.length > 1) {
        const rows = data.values.slice(1);
        allEmployees = rows.map(function(row) {
          return {
            nickname: row[1] || '',
            accountNumber: row[2] || '',
            callsign: row[3] || '',
            rank: row[4] || '',
            rankImg: row[5] || '',
            position: row[6] || '',
            discipline: row[7] || '',
            vk: row[8] || ''
          };
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  }

  if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener('mousemove', function(e) {
      customCursor.style.left = e.clientX + 'px';
      customCursor.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, .nav-item, .accordion-trigger, .resource-link, .commander-card, .unit-card, .info-card, .legal-link-item, .lk-input, .num-btn').forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        customCursor.classList.add('active');
      });
      el.addEventListener('mouseleave', function() {
        customCursor.classList.remove('active');
      });
    });
  } else {
    customCursor.style.display = 'none';
  }

  mobileToggle.addEventListener('click', function() {
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

  navItems.forEach(function(item) {
    item.addEventListener('click', function() {
      navLinks.classList.remove('active');
      const spans = mobileToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });

  window.addEventListener('scroll', function() {
    navbar.style.background = window.scrollY > 50 ? 'rgba(5, 5, 5, 0.98)' : 'rgba(5, 5, 5, 0.9)';
    navbar.style.boxShadow = window.scrollY > 50 ? '0 4px 20px rgba(0,0,0,0.5)' : 'none';
  });

  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', function() {
    let current = '';
    sections.forEach(function(section) {
      if (window.scrollY >= section.offsetTop - 150) {
        current = section.getAttribute('id');
      }
    });
    navItems.forEach(function(item) {
      item.classList.remove('active');
      if (item.getAttribute('href') === '#' + current) {
        item.classList.add('active');
      }
    });
  });

  const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(function(el) {
    revealObserver.observe(el);
  });

  accordionTriggers.forEach(function(trigger) {
    trigger.addEventListener('click', function() {
      const item = trigger.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.accordion-item').forEach(function(i) {
        i.classList.remove('active');
      });
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  if (parallaxBg) {
    window.addEventListener('scroll', function() {
      const hero = document.querySelector('.hero-section');
      if (hero && window.scrollY <= hero.offsetHeight) {
        parallaxBg.style.transform = 'translateY(' + (window.scrollY * 0.3) + 'px)';
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  if (document.getElementById('infoBtn')) {
    document.getElementById('infoBtn').addEventListener('click', function() {
      document.getElementById('info').scrollIntoView({ behavior: 'smooth' });
    });
  }
  if (document.getElementById('docsBtn')) {
    document.getElementById('docsBtn').addEventListener('click', function() {
      document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    });
  }
  if (document.getElementById('lkBtn')) {
    document.getElementById('lkBtn').addEventListener('click', function() {
      document.getElementById('lk').scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (lkSubmit) {
    lkSubmit.addEventListener('click', function() {
      const query = lkInput.value.trim().toLowerCase();
      if (!query) {
        lkError.textContent = 'ВВЕДИТЕ ДАННЫЕ';
        return;
      }
      if (!allEmployees.length) {
        lkError.textContent = 'БАЗА НЕ ЗАГРУЖЕНА';
        return;
      }
      lkError.textContent = '';
      lkLoading.style.display = 'flex';
      setTimeout(function() {
        lkLoading.style.display = 'none';
        const employee = allEmployees.find(function(emp) {
          return emp.accountNumber.toLowerCase() === query ||
                 emp.nickname.toLowerCase() === query ||
                 emp.callsign.toLowerCase() === query;
        });
        if (employee) {
          displayProfile(employee);
        } else {
          lkError.textContent = 'СОТРУДНИК НЕ НАЙДЕН';
        }
      }, 600);
    });
  }

  if (lkInput) {
    lkInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        lkSubmit.click();
      }
    });
  }

  if (lkBack) {
    lkBack.addEventListener('click', function() {
      lkProfile.style.display = 'none';
      lkLogin.style.display = 'block';
      lkInput.value = '';
    });
  }

  function displayProfile(emp) {
    lkLogin.style.display = 'none';
    lkProfile.style.display = 'block';
    lkProfileName.textContent = emp.callsign || emp.nickname || 'СОТРУДНИК';
    lkProfileRank.textContent = emp.rank || '';

    if (emp.rankImg && emp.rankImg.trim()) {
      lkAvatar.innerHTML = '<img src="' + emp.rankImg + '" alt="Погоны" style="width:100%;height:100%;object-fit:contain;">';
    } else {
      lkAvatar.innerHTML = '<svg viewBox="0 0 100 100" class="avatar-svg"><defs><pattern id="specnaz-pattern" patternUnits="userSpaceOnUse" width="100" height="100"><rect width="100" height="100" fill="#121418"/><path d="M50 15 L70 25 L70 50 C70 65 55 80 50 85 C45 80 30 65 30 50 L30 25 Z" fill="none" stroke="var(--accent-gold)" stroke-width="2.5"/><circle cx="50" cy="40" r="14" fill="none" stroke="var(--accent-gold)" stroke-width="2"/><line x1="50" y1="26" x2="50" y2="34" stroke="var(--accent-gold)" stroke-width="1.5"/><path d="M38 50 L38 60 M62 50 L62 60" stroke="var(--accent-gold)" stroke-width="1.5"/><path d="M42 28 L50 18 L58 28" fill="none" stroke="var(--accent-gold)" stroke-width="1.5"/><line x1="30" y1="65" x2="70" y2="65" stroke="var(--accent-gold)" stroke-width="1"/><line x1="32" y1="70" x2="68" y2="70" stroke="var(--accent-gold)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(#specnaz-pattern)"/></svg>';
    }

    lkProfileStats.innerHTML = '<div class="lk-stat-item"><div class="lk-stat-value">' + (emp.accountNumber || '—') + '</div><div class="lk-stat-label">АККАУНТ</div></div><div class="lk-stat-item"><div class="lk-stat-value">' + (emp.position || '—') + '</div><div class="lk-stat-label">ДОЛЖНОСТЬ</div></div><div class="lk-stat-item"><div class="lk-stat-value">' + (emp.discipline && emp.discipline.trim() ? emp.discipline.split('\n').length : 0) + '</div><div class="lk-stat-label">ВЗЫСКАНИЙ</div></div>';

    let html = '<div class="lk-field"><span class="lk-label">НИКНЕЙМ:</span><span class="lk-value">' + (emp.nickname || '—') + '</span></div><div class="lk-field"><span class="lk-label">НОМЕР АККАУНТА:</span><span class="lk-value">' + (emp.accountNumber || '—') + '</span></div><div class="lk-field"><span class="lk-label">ПОЗЫВНОЙ:</span><span class="lk-value">' + (emp.callsign || '—') + '</span></div><div class="lk-field"><span class="lk-label">ЗВАНИЕ:</span><span class="lk-value">' + (emp.rank || '—') + '</span></div><div class="lk-field"><span class="lk-label">ДОЛЖНОСТЬ:</span><span class="lk-value">' + (emp.position || '—') + '</span></div>';

    if (emp.vk && emp.vk.trim()) {
      html += '<div class="lk-field"><span class="lk-label">VK:</span><a href="' + emp.vk + '" target="_blank" rel="noopener" class="lk-vk-link">ПЕРЕЙТИ</a></div>';
    } else {
      html += '<div class="lk-field"><span class="lk-label">VK:</span><span class="lk-value">—</span></div>';
    }

    lkDataGrid.innerHTML = html;

    if (emp.discipline && emp.discipline.trim()) {
      lkDiscipline.innerHTML = '<p>' + emp.discipline.replace(/\n/g, '<br>') + '</p>';
      lkDisciplineCard.style.display = 'block';
    } else {
      lkDiscipline.innerHTML = '<p>Взысканий нет</p>';
      lkDisciplineCard.style.display = 'block';
    }
  }

  const modalData = {
    'modal-pdp': {
      title: 'Оказание ПДП — Правовая и доврачебная помощь',
      content: '<h4>1. ПРАВОВАЯ ПОМОЩЬ</h4><p><strong>Определение:</strong> Комплекс мер, направленных на защиту прав и законных интересов граждан, оказавшихся в зоне проведения специальной операции.</p><p><strong>Виды правовой помощи:</strong></p><ul><li>Разъяснение гражданам их прав и обязанностей в соответствии с законодательством РФ</li><li>Обеспечение сохранности личного имущества и документов</li><li>Документирование фактов нарушения прав граждан со стороны третьих лиц</li><li>Содействие в восстановлении утраченных документов (паспорт, водительское удостоверение)</li><li>Организация вызова адвоката или представителя правозащитных организаций</li></ul><p><strong>Порядок действий сотрудника:</strong></p><ol><li>Представиться гражданину (звание, должность, фамилия)</li><li>Выслушать обращение и зафиксировать суть в служебном блокноте</li><li>Оценить ситуацию на предмет угрозы жизни и здоровью</li><li>Принять меры по устранению нарушения прав (в пределах компетенции)</li><li>При необходимости — передать информацию в дежурную часть или следственно-оперативную группу</li></ol><h4>2. ДОВРАЧЕБНАЯ ПОМОЩЬ</h4><p><strong>Определение:</strong> Комплекс экстренных медицинских мероприятий, проводимых на месте происшествия до прибытия квалифицированных медицинских работников.</p><p><strong>Виды доврачебной помощи:</strong></p><ul><li>Остановка наружного кровотечения (жгут Эсмарха, жгут CAT, гемостатические средства)</li><li>Иммобилизация переломов с использованием подручных средств и шин</li><li>Сердечно-лёгочная реанимация (непрямой массаж сердца, искусственная вентиляция лёгких)</li><li>Обработка ран и ожоговых поверхностей</li><li>Противошоковая терапия (придание правильного положения тела, согревание)</li></ul><p><strong>Алгоритм действий при ранении (протокол MARCH):</strong></p><ol><li><strong>M (Massive Hemorrhage)</strong> — остановка массивного кровотечения (жгут, гемостатик)</li><li><strong>A (Airway)</strong> — обеспечение проходимости дыхательных путей</li><li><strong>R (Respiration)</strong> — проверка дыхания, окклюзионная повязка при пневмотораксе</li><li><strong>C (Circulation)</strong> — оценка кровообращения, внутривенный доступ</li><li><strong>H (Hypothermia)</strong> — предотвращение переохлаждения</li></ol><p><strong>Состав тактической аптечки IFAK:</strong></p><ul><li>Жгут кровоостанавливающий CAT (2 шт.)</li><li>Гемостатический бинт с гемостатиком (QuikClot, Celox)</li><li>Окклюзионный пластырь (Halo, Hyfin)</li><li>Декомпрессионная игла для грудной клетки</li><li>Назофарингеальная трубка (NPA)</li><li>Тактические ножницы</li><li>Перчатки медицинские нестерильные</li></ul>'
    },
    'modal-svu': {
      title: 'Разминирование СВУ — Самодельные взрывные устройства',
      content: '<h4>1. КЛАССИФИКАЦИЯ СВУ</h4><p><strong>По способу приведения в действие:</strong></p><ul><li><strong>Контактные:</strong> нажимного действия, натяжного действия, обрывного действия, разгрузочного действия</li><li><strong>Неконтактные:</strong> радиоуправляемые (по радиоканалу, Wi-Fi, Bluetooth), инфракрасные (по лучу), акустические (по звуку), магнитные, сейсмические</li><li><strong>Таймерные:</strong> с часовым механизмом, электронные с задержкой</li><li><strong>Комбинированные:</strong> сочетают несколько способов подрыва</li></ul><p><strong>По типу заряда:</strong></p><ul><li>Безоболочные (тротиловая шашка)</li><li>Осколочные (с поражающими элементами — гвозди, шарики, болты)</li><li>Кумулятивные (направленного действия)</li><li>Зажигательные (термитные смеси)</li><li>Химические (с отравляющими веществами)</li></ul><h4>2. АЛГОРИТМ ДЕЙСТВИЙ ПРИ ОБНАРУЖЕНИИ ПОДОЗРИТЕЛЬНОГО ПРЕДМЕТА</h4><p class="modal-warning">КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО:</p><ul><li>Приближаться к предмету ближе чем на 100 метров</li><li>Трогать, перемещать, вскрывать предмет</li><li>Заливать предмет водой или другими жидкостями</li><li>Использовать радиостанции, мобильные телефоны в радиусе 50 метров</li><li>Курить, использовать открытый огонь вблизи предмета</li></ul><p><strong>Порядок действий:</strong></p><ol><li>Немедленно прекратить движение личного состава</li><li>Голосом или по проводной связи предупредить: «ВНИМАНИЕ! ОБНАРУЖЕН ПОДОЗРИТЕЛЬНЫЙ ПРЕДМЕТ!»</li><li>Обозначить опасную зону подручными средствами (лента, флажки)</li><li>Отойти на безопасное расстояние (не менее 100 метров)</li><li>Доложить командиру: «Докладываю: обнаружен подозрительный предмет. Местоположение: [квадрат/адрес]. Описание: [размер, цвет, признаки СВУ]. Нахожусь на безопасном расстоянии.»</li><li>Организовать оцепление и не допускать гражданских лиц в опасную зону</li><li>Ожидать прибытия инженерно-технического подразделения ОМОН/ФСБ</li></ol><h4>3. ИДЕНТИФИКАЦИЯ СВУ</h4><p>Визуальный осмотр с безопасного расстояния с использованием оптических приборов:</p><ul><li>Наличие проводов, антенн, таймеров</li><li>Наличие элементов питания</li><li>Необычное расположение предмета (под углом, прикреплён к неподвижному объекту)</li><li>Следы свежей земли, нарушение поверхности</li></ul><h4>4. ОБЕЗВРЕЖИВАНИЕ</h4><p>Проводится только специалистами-взрывотехниками с применением:</p><ul><li>Гидродинамических разрушителей</li><li>Робототехнических комплексов</li><li>Контролируемый подрыв на месте</li><li>Эвакуация в безопасное место для подрыва</li></ul>'
    },
    'modal-coord': {
      title: 'Координация нарядов — Система централизованного управления',
      content: '<h4>1. АВТОМАТИЗИРОВАННАЯ СИСТЕМА УПРАВЛЕНИЯ (АСУ)</h4><p><strong>Назначение:</strong> Централизованное управление всеми наружными службами, патрульными группами, группами быстрого реагирования и специальными нарядами в режиме реального времени.</p><p><strong>Компоненты системы:</strong></p><ul><li>GPS-трекеры на каждом патрульном автомобиле и у старших групп</li><li>Защищённые радиоканалы с шифрованием AES-256</li><li>Планшеты с отображением оперативной обстановки</li><li>Резервный канал связи через спутник</li></ul><h4>2. ВИДЫ НАРЯДОВ</h4><ul><li>Патрульные группы (ППС)</li><li>Оперативные группы (ОУР)</li><li>Группы быстрого реагирования (ОСН)</li><li>Снайперские пары</li><li>Скрытые посты наблюдения</li></ul><h4>3. ПОРЯДОК КООРДИНАЦИИ</h4><ol><li><strong>Постановка задачи:</strong> командир оперативного штаба определяет цели, зоны ответственности, временные рамки</li><li><strong>Распределение секторов:</strong> каждый наряд получает сектор патрулирования или позицию</li><li><strong>Установление радиоканалов:</strong> назначение основных и резервных частот</li><li><strong>Контроль исполнения:</strong> отслеживание местоположения, получение докладов</li><li><strong>Доклад о выполнении:</strong> по завершении задачи — письменный рапорт</li></ol><h4>4. ДЕЙСТВИЯ ПРИ ЧРЕЗВЫЧАЙНЫХ СИТУАЦИЯХ</h4><p>При возникновении нештатной ситуации (нападение на наряд, обнаружение преступников, ЧС) командир оперативного штаба:</p><ol><li>Немедленно перенаправляет ближайшие наряды к месту происшествия</li><li>Блокирует район — выставляет посты на всех выездах</li><li>Организует оцепление периметра</li><li>Вызывает резерв и специальные подразделения</li></ol>'
    },
    'modal-stroy': {
      title: 'Строевая подготовка',
      content: '<h4>1. ЦЕЛИ И ЗАДАЧИ</h4><p>Отработка слаженности подразделений, формирование дисциплины, обучение быстрому и правильному выполнению команд в условиях ограниченного времени.</p><h4>2. ВИДЫ СТРОЕВЫХ ПРИЁМОВ</h4><p><strong>Без оружия:</strong> строевая стойка, повороты на месте, движение строевым шагом, выход из строя, подход к начальнику, отход от начальника.</p><p><strong>С оружием:</strong> положение «на ремень», «на грудь», «за спину», перевод оружия в боевое положение, изготовка к стрельбе из различных положений.</p><h4>3. БОЕВЫЕ ПОРЯДКИ</h4><ul><li><strong>Колонна:</strong> для передвижения на марше</li><li><strong>Линия:</strong> для фронтального штурма</li><li><strong>Клин:</strong> для прорыва обороны</li><li><strong>Ромб:</strong> для круговой обороны</li><li><strong>Круг:</strong> для обороны при окружении</li></ul><h4>4. ТАКТИЧЕСКИЕ ПЕРЕДВИЖЕНИЯ</h4><p>Движение в составе группы при штурме: перебежки по одному, по два, прикрытие огнём, зачистка помещений «по-военному». Эвакуация раненого: способы переноски (на плечах, на плащ-палатке, на руках), прикрытие огнём при эвакуации.</p>'
    },
    'modal-ognev': {
      title: 'Огневая подготовка',
      content: '<h4>1. ТАБЕЛЬНОЕ ОРУЖИЕ</h4><p><strong>Пистолет ТТ (Тульский Токарева):</strong> калибр 7,62×25 мм, магазин 8 патронов, прицельная дальность 50 м. Упражнения: скоростная стрельба на 25 м, стрельба из неудобных положений, стрельба после физической нагрузки.</p><p><strong>Автомат специальный ВАЛ:</strong> калибр 9×39 мм (СП-5, СП-6), магазин 20 патронов, прицельная дальность 400 м, с глушителем. Упражнения: стрельба одиночными и очередями, смена магазина (норматив 3 сек), устранение задержек при стрельбе.</p><h4>2. ВИДЫ УПРАЖНЕНИЙ</h4><ul><li>Скоростная стрельба из ТТ — поражение 3 мишеней за 8 секунд</li><li>Штурмовая стрельба из ВАЛ в условиях ограниченной видимости</li><li>Стрельба после физической нагрузки (кросс 1 км)</li><li>Стрельба из-за укрытий с переносом огня по фронту</li></ul><h4>3. НОРМАТИВЫ</h4><p>Поражение мишени на 100 м из ВАЛ — не менее 80% попаданий. Смена магазина — не более 3 сек. Изготовка к стрельбе — не более 5 сек.</p>'
    },
    'modal-med': {
      title: 'Тактическая медицина — Стандарт TCCC',
      content: '<h4>1. ТРИ ЭТАПА ТАКТИЧЕСКОЙ ПОМОЩИ</h4><p><strong>Этап 1 — Помощь под огнём (Care Under Fire):</strong> первоочередная задача — подавление противника ответным огнём. Боец оказывает самопомощь: накладывает жгут, использует гемостатический бинт. Эвакуация раненого только после обеспечения огневого превосходства.</p><p><strong>Этап 2 — Помощь в укрытии (Tactical Field Care):</strong> полный осмотр раненого, остановка всех кровотечений, обеспечение проходимости дыхательных путей, лечение напряжённого пневмоторакса, обезболивание, подготовка к эвакуации.</p><p><strong>Этап 3 — Помощь при эвакуации (Tactical Evacuation Care):</strong> продолжение медицинской помощи во время транспортировки, мониторинг состояния, передача раненого квалифицированным медикам.</p><h4>2. ПРОТОКОЛ MARCH</h4><ol><li><strong>M</strong> — Massive Hemorrhage (массивное кровотечение)</li><li><strong>A</strong> — Airway (дыхательные пути)</li><li><strong>R</strong> — Respiration (дыхание)</li><li><strong>C</strong> — Circulation (кровообращение)</li><li><strong>H</strong> — Hypothermia (переохлаждение)</li></ol>'
    }
  };

  infoCards.forEach(function(card) {
    card.addEventListener('click', function() {
      const id = card.getAttribute('data-modal');
      if (modalData[id]) {
        modalBody.innerHTML = '<h3>' + modalData[id].title + '</h3>' + modalData[id].content;
        modalOverlay.classList.add('active');
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', function() {
      modalOverlay.classList.remove('active');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

});
