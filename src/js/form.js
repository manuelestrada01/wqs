/**
 * form.js — Quote form validation and FormSubmit.co submission
 *
 * NOTE: Replace FORM_ENDPOINT with your FormSubmit.co URL before launch.
 * First submission triggers a confirmation email to the address used.
 * Format: https://formsubmit.co/ajax/your@email.com
 */

const FORM_ENDPOINT = 'https://formsubmit.co/ajax/REPLACE_WITH_YOUR_EMAIL';

export function initForm() {
  const form       = document.getElementById('quote-form');
  const submitBtn  = document.getElementById('form-submit');
  const statusEl   = document.getElementById('form-status');

  if (!form) return;

  // ── Live validation: clear error on input ─────────────────
  form.querySelectorAll('.form-field__input').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => clearError(field));
  });

  // ── Submit handler ─────────────────────────────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all required fields
    let isValid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) {
      // Focus first invalid field (WCAG: focus-management after error)
      const firstError = form.querySelector('.has-error');
      if (firstError) firstError.focus();
      return;
    }

    // Loading state
    setLoading(true);
    clearStatus();

    try {
      const formData = new FormData(form);
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });

      if (response.ok) {
        setStatus('success', '✓ Solicitud enviada. Te contactamos en 24 hs hábiles.');
        form.reset();
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (err) {
      // Fallback: mailto link
      setStatus(
        'error',
        'Error al enviar. Por favor escribinos directamente a contacto@wqs.com.ar'
      );
      console.error('[WQS form]', err);
    } finally {
      setLoading(false);
    }
  });

  // ── Helpers ────────────────────────────────────────────────
  function validateField(field) {
    const errorEl = field.parentElement.querySelector('.form-field__error');
    let message = '';

    if (field.required && !field.value.trim()) {
      message = 'Este campo es requerido.';
    } else if (field.type === 'email' && field.value.trim()) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(field.value)) {
        message = 'Ingresá un email válido.';
      }
    }

    if (message) {
      field.classList.add('has-error');
      if (errorEl) errorEl.textContent = message;
      return false;
    } else {
      field.classList.remove('has-error');
      if (errorEl) errorEl.textContent = '';
      return true;
    }
  }

  function clearError(field) {
    field.classList.remove('has-error');
    const errorEl = field.parentElement.querySelector('.form-field__error');
    if (errorEl) errorEl.textContent = '';
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    submitBtn.classList.toggle('is-loading', loading);
    submitBtn.querySelector('.form__submit-text').textContent =
      loading ? 'Enviando...' : 'Solicitar Cotización';
  }

  function setStatus(type, message) {
    statusEl.textContent = message;
    statusEl.className = `form__status is-${type}`;
  }

  function clearStatus() {
    statusEl.textContent = '';
    statusEl.className = 'form__status';
  }
}
