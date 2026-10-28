/**
 * Alvi Solar Energy - Interactive Website Controller
 * Founder: Wasim Sabir Alvi | Karachi, Pakistan
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initSmoothScroll();
  initActiveNavObserver();
  initBillPresets();
  initQuoteForm();
  initServiceButtons();
});

/* -------------------------------------------------------------
   1. Sticky Header Scroll Effect
------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* -------------------------------------------------------------
   2. Mobile Navigation Drawer
------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const closeBtn = document.getElementById('drawerClose');
  const navLinks = drawer ? drawer.querySelectorAll('a') : [];

  if (!toggleBtn || !drawer || !backdrop) return;

  function openMenu() {
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* -------------------------------------------------------------
   3. Smooth Scroll Navigation
------------------------------------------------------------- */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const header = document.getElementById('siteHeader');
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - (headerHeight + 12);

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });

        // Update URL hash without jumping
        history.pushState(null, null, targetId);
      }
    });
  });
}

/* -------------------------------------------------------------
   4. Active Navigation State Tracking (IntersectionObserver)
------------------------------------------------------------- */
function initActiveNavObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  if (!('IntersectionObserver' in window) || sections.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -60% 0px'
  });

  sections.forEach(sec => observer.observe(sec));
}

/* -------------------------------------------------------------
   5. Service Inquire Buttons Preselection
------------------------------------------------------------- */
function initServiceButtons() {
  const homeBtn = document.getElementById('inquireHomeBtn');
  const businessBtn = document.getElementById('inquireBusinessBtn');
  const supportBtn = document.getElementById('inquireSupportBtn');

  const setTypeAndScroll = (type, messagePreset) => {
    const radio = document.querySelector(`input[name="propertyType"][value="${type}"]`);
    if (radio) {
      radio.checked = true;
    }
    const messageInput = document.getElementById('userMessage');
    if (messageInput && messagePreset) {
      messageInput.value = messagePreset;
    }
    const quoteSec = document.getElementById('quote');
    if (quoteSec) {
      const header = document.getElementById('siteHeader');
      const offset = header ? header.offsetHeight + 16 : 90;
      const targetPos = quoteSec.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  };

  if (homeBtn) {
    homeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setTypeAndScroll('Home', 'Interested in a residential rooftop solar system for our house.');
    });
  }

  if (businessBtn) {
    businessBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setTypeAndScroll('Business', 'Interested in commercial solar power installation for our business/facility.');
    });
  }

  if (supportBtn) {
    supportBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setTypeAndScroll('Home', 'Requesting service/maintenance assistance for an existing solar setup.');
    });
  }
}

/* -------------------------------------------------------------
   6. Quick Bill Preset Chips
------------------------------------------------------------- */
function initBillPresets() {
  const chips = document.querySelectorAll('.preset-chip');
  const billInput = document.getElementById('monthlyBill');

  if (!chips.length || !billInput) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const value = chip.getAttribute('data-value');
      billInput.value = value;
      billInput.classList.remove('error');
    });
  });

  billInput.addEventListener('input', () => {
    chips.forEach(c => c.classList.remove('active'));
  });
}

/* -------------------------------------------------------------
   7. Quote / Lead Generation Form Handler
------------------------------------------------------------- */
function initQuoteForm() {
  const form = document.getElementById('solarQuoteForm');
  const submitBtn = document.getElementById('submitQuoteBtn');
  const responseBox = document.getElementById('formResponseBox');

  if (!form || !submitBtn || !responseBox) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous error states
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => input.classList.remove('error'));
    responseBox.className = 'form-response-card';
    responseBox.innerHTML = '';
    responseBox.style.display = 'none';

    // Collect values
    const fullName = form.fullName.value.trim();
    const phone = form.phoneNumber.value.trim();
    const email = form.emailAddress.value.trim();
    const propertyType = form.propertyType.value;
    const cityArea = form.cityArea.value.trim();
    const monthlyBill = form.monthlyBill.value.trim();
    const message = form.userMessage.value.trim();

    // Validation
    let hasError = false;

    if (!fullName) {
      form.fullName.classList.add('error');
      hasError = true;
    }

    if (!phone || phone.length < 10) {
      form.phoneNumber.classList.add('error');
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      form.emailAddress.classList.add('error');
      hasError = true;
    }

    if (!cityArea) {
      form.cityArea.classList.add('error');
      hasError = true;
    }

    if (!monthlyBill) {
      form.monthlyBill.classList.add('error');
      hasError = true;
    }

    if (hasError) {
      showResponse(false, 'Please complete all required fields highlighted in red.', {
        fullName, phone, email, propertyType, cityArea, monthlyBill, message
      });
      return;
    }

    // Prepare Payload
    const payload = {
      "Full Name": fullName,
      "Phone Number": phone,
      "Email Address": email,
      "Property Type": propertyType,
      "City / Area in Karachi": cityArea,
      "Monthly Electricity Bill": monthlyBill,
      "Requirements / Notes": message || "Not specified",
      "_subject": `[Solar Quote Inquiry] ${fullName} - ${propertyType} (${cityArea})`,
      "_template": "table"
    };

    // UI Loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      // Send directly to Wasim Sabir Alvi's business inbox
      const endpoint = 'https://formsubmit.co/ajax/alvisolarenergy@gmail.com';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success !== 'false') {
        showSuccessState(payload);
        form.reset();
        document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
      } else {
        throw new Error(data.message || 'Server returned an error');
      }
    } catch (err) {
      console.warn('FormSubmit AJAX dispatch notice:', err);
      // Even if adblocker or network blocked AJAX, provide seamless 1-click fallback
      showFallbackState(payload);
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  function showSuccessState(data) {
    const waText = encodeURIComponent(
      `Hello Alvi Solar Energy,\nI have submitted a solar quote request:\nName: ${data["Full Name"]}\nPhone: ${data["Phone Number"]}\nProperty: ${data["Property Type"]}\nArea: ${data["City / Area in Karachi"]}\nMonthly Bill: ${data["Monthly Electricity Bill"]}`
    );

    responseBox.className = 'form-response-card success';
    responseBox.style.display = 'block';
    responseBox.innerHTML = `
      <div class="response-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <h4 class="response-title">Quote Request Received!</h4>
      <p class="response-text">
        Thank you, <strong>${escapeHtml(data["Full Name"])}</strong>. Your solar inquiry has been sent to <strong>alvisolarenergy@gmail.com</strong>. Wasim Sabir Alvi and our team will review your power requirements for <strong>${escapeHtml(data["City / Area in Karachi"])}</strong> and reach out to you shortly at <strong>${escapeHtml(data["Phone Number"])}</strong>.
      </p>
      <div class="alternate-dispatch-row">
        <a href="https://wa.me/923132507800?text=${waText}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-whatsapp">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.414z"/></svg>
          WhatsApp (0313 2507800)
        </a>
        <a href="https://wa.me/923352507800?text=${waText}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-whatsapp">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.414z"/></svg>
          WhatsApp (0335 2507800)
        </a>
        <a href="tel:+923132507800" class="btn btn-sm btn-secondary">
          Call 0313 2507800 / 0335 2507800
        </a>
      </div>
    `;
    responseBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function showFallbackState(data) {
    const subject = encodeURIComponent(`Solar Quote Request - ${data["Full Name"]} (${data["Property Type"]})`);
    const body = encodeURIComponent(
      `Name: ${data["Full Name"]}\nPhone: ${data["Phone Number"]}\nEmail: ${data["Email Address"]}\nProperty Type: ${data["Property Type"]}\nArea in Karachi: ${data["City / Area in Karachi"]}\nMonthly Electricity Bill: ${data["Monthly Electricity Bill"]}\nRequirements: ${data["Requirements / Notes"]}`
    );
    const mailtoUrl = `mailto:alvisolarenergy@gmail.com?subject=${subject}&body=${body}`;
    const waUrl1 = `https://wa.me/923132507800?text=${body}`;
    const waUrl2 = `https://wa.me/923352507800?text=${body}`;

    responseBox.className = 'form-response-card success';
    responseBox.style.display = 'block';
    responseBox.innerHTML = `
      <div class="response-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <h4 class="response-title">Ready to Send Your Solar Quote</h4>
      <p class="response-text">
        Your inquiry details have been formatted for <strong>alvisolarenergy@gmail.com</strong>. You can send it directly through your preferred channel:
      </p>
      <div class="alternate-dispatch-row">
        <a href="${mailtoUrl}" class="btn btn-sm btn-primary">
          Send via Email App
        </a>
        <a href="${waUrl1}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-whatsapp">
          WhatsApp (0313 2507800)
        </a>
        <a href="${waUrl2}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-whatsapp">
          WhatsApp (0335 2507800)
        </a>
        <a href="tel:+923132507800" class="btn btn-sm btn-secondary">
          Call 0313 2507800 / 0335 2507800
        </a>
      </div>
    `;
    responseBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function showResponse(isSuccess, message) {
    responseBox.className = `form-response-card ${isSuccess ? 'success' : 'error'}`;
    responseBox.style.display = 'block';
    responseBox.innerHTML = `
      <h4 class="response-title">${isSuccess ? 'Success' : 'Attention Required'}</h4>
      <p class="response-text">${escapeHtml(message)}</p>
    `;
    responseBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
