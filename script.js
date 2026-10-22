/**
 * Damaris Costumbre - Lógica de Interfaz y Enlace Directo a WhatsApp
 * Economista & Asesora Financiera
 */

// 1. Configuración: Ingresa tu número con código de país (ej. México: 521 + 10 dígitos)
const WHATSAPP_PHONE = "529512513470";

document.addEventListener('DOMContentLoaded', () => {

  // 2. Asignación automática del año en el pie de página
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 3. Menú de Navegación Móvil (Hamburguesa)
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      });
    });
  }

  // 4. Filtrado de Tarjetas de Servicios por Categoría
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

  // 5. Preseleccionar Servicio al pulsar "Quiero cotizar..." en cualquier tarjeta
  const serviceActionButtons = document.querySelectorAll('.service-action');
  const selectElement = document.getElementById('serviceInterest');

  serviceActionButtons.forEach(button => {
    button.addEventListener('click', () => {
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

  // 6. Validación del Formulario y Envío de Datos por WhatsApp
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
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

      // Validación de Teléfono (mínimo 10 dígitos)
      const phoneDigits = phoneInput.value.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        showError('phone', 'Ingresa un número telefónico válido a 10 dígitos.');
        isValid = false;
      }

      // Validación de Correo Electrónico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        showError('email', 'Ingresa un correo electrónico válido.');
        isValid = false;
      }

      // Validación de Servicio seleccionado
      if (!serviceInput.value) {
        showError('serviceInterest', 'Por favor selecciona el área de tu interés.');
        isValid = false;
      }

      // Validación de Casilla de Privacidad
      if (!consentInput.checked) {
        showError('privacyConsent', 'Debes aceptar el aviso de privacidad.');
        isValid = false;
      }

      if (!isValid) return;

      // Extracción de datos del cliente
      const nombre = nameInput.value.trim();
      const telefono = phoneInput.value.trim();
      const correo = emailInput.value.trim();
      const servicio = serviceInput.value;
      const dudas = notesInput.value.trim();

      // Construcción del mensaje formateado para WhatsApp
      let mensajeWA = `¡Hola Damaris! Vengo desde tu sitio web y solicito una asesoría:\n\n`;
      mensajeWA += `• *Nombre:* ${nombre}\n`;
      mensajeWA += `• *Servicio de interés:* ${servicio}\n`;
      mensajeWA += `• *Teléfono:* ${telefono}\n`;
      mensajeWA += `• *Correo:* ${correo}\n`;
      if (dudas) {
        mensajeWA += `• *Objetivo / Duda:* ${dudas}\n`;
      }

      // Generación del enlace con codificación segura
      const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(mensajeWA)}`;

      // Abrir WhatsApp en una pestaña nueva
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      // Limpiar el formulario
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

  // 7. Modal de Aviso de Privacidad
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

  // Cerrar al hacer clic en el fondo oscuro
  window.addEventListener('click', (e) => {
    if (e.target === privacyModal) closeModal();
  });

  // Cerrar con tecla Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && privacyModal && privacyModal.classList.contains('is-active')) {
      closeModal();
    }
  });

});