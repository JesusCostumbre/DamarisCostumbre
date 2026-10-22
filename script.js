/**
 * Damaris Costumbre - Lógica de Interfaz y Conversión
 * Licenciada en Economía & Asesora Financiera
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Asignación automática del año fiscal en footer
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Menú de Navegación Móvil (Hamburger)
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-open');
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      });
    });
  }

  // 3. Filtrado Interactivo de Servicios
  const filterTabs = document.querySelectorAll('.filter-tab');
  const serviceBoxes = document.querySelectorAll('.service-box');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filterValue = tab.getAttribute('data-filter');

      serviceBoxes.forEach(box => {
        const category = box.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          box.style.display = 'flex';
        } else {
          box.style.display = 'none';
        }
      });
    });
  });

  // 4. Preselección de Servicio en Formulario al pulsar CTA de una tarjeta
  const serviceActionButtons = document.querySelectorAll('.service-action');
  const selectElement = document.getElementById('serviceInterest');

  serviceActionButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const targetService = button.getAttribute('data-service');
      if (selectElement && targetService) {
        for (let i = 0; i < selectElement.options.length; i++) {
          if (selectElement.options[i].value.includes(targetService) || selectElement.options[i].text.includes(targetService)) {
            selectElement.selectedIndex = i;
            break;
          }
        }
      }
    });
  });

  // 5. Validación y Envío del Formulario
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Limpiar errores previos
      clearErrors();

      const nameInput = document.getElementById('fullName');
      const phoneInput = document.getElementById('phone');
      const emailInput = document.getElementById('email');
      const serviceInput = document.getElementById('serviceInterest');
      const notesInput = document.getElementById('userNotes');
      const consentInput = document.getElementById('privacyConsent');

      let isValid = true;

      // Validación de Nombre
      if (!nameInput.value.trim()) {
        showError('fullName', 'Por favor ingresa tu nombre completo.');
        isValid = false;
      }

      // Validación de Teléfono (al menos 10 dígitos)
      const phoneClean = phoneInput.value.replace(/\D/g, '');
      if (phoneClean.length < 10) {
        showError('phone', 'Ingresa un teléfono válido a 10 dígitos.');
        isValid = false;
      }

      // Validación de Email con Regex estándar
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        showError('email', 'Ingresa un correo electrónico válido.');
        isValid = false;
      }

      // Validación de Selección de Servicio
      if (!serviceInput.value) {
        showError('serviceInterest', 'Por favor elige un área de tu interés.');
        isValid = false;
      }

      // Validación de Consentimiento
      if (!consentInput.checked) {
        showError('privacyConsent', 'Debes autorizar el aviso de privacidad.');
        isValid = false;
      }

      if (!isValid) return;

      // Construcción del mensaje preconfigurado para WhatsApp
      const clientName = encodeURIComponent(nameInput.value.trim());
      const clientService = encodeURIComponent(serviceInput.value);
      const clientNotes = encodeURIComponent(notesInput.value.trim() || 'Sin comentarios adicionales');

      const whatsappText = `¡Hola Damaris! Mi nombre es ${clientName}. Solicito una asesoría sobre: *${clientService}*.%0A%0A*Notas adicionales:* ${clientNotes}`;
      
      // Enlace oficial de WhatsApp
      const whatsappURL = `https://wa.link/damariscostumbre?text=${whatsappText}`;

      // Feedback al usuario y redirección
      alert(`¡Gracias ${nameInput.value.trim()}! Se abrirá WhatsApp para acordar el horario de tu sesión.`);
      window.open(whatsappURL, '_blank', 'noopener,noreferrer');
      
      contactForm.reset();
    });
  }

  function showError(fieldId, message) {
    const errorSpan = document.getElementById(`error-${fieldId}`);
    if (errorSpan) {
      errorSpan.textContent = message;
    }
  }

  function clearErrors() {
    const errorSpans = document.querySelectorAll('.field-error');
    errorSpans.forEach(span => span.textContent = '');
  }

  // 6. Manejo del Modal de Aviso de Privacidad (Accesible con ESC)
  const privacyModal = document.getElementById('privacyModal');
  const privacyTriggers = [
    document.getElementById('privacyTrigger'),
    document.getElementById('footerPrivacyTrigger')
  ];
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  function openModal() {
    if (privacyModal) {
      privacyModal.classList.add('is-active');
      privacyModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (privacyModal) {
      privacyModal.classList.remove('is-active');
      privacyModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  privacyTriggers.forEach(btn => {
    if (btn) btn.addEventListener('click', openModal);
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  // Cerrar al hacer clic fuera del contenido o pulsar Escape
  window.addEventListener('click', (e) => {
    if (e.target === privacyModal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && privacyModal && privacyModal.classList.contains('is-active')) {
      closeModal();
    }
  });
});