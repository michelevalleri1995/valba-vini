/**
 * Valba Vini – Vanilla JS (no jQuery)
 */

(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var header = document.getElementById('site-header');
    var hamburger = header && header.querySelector('.hamburger');
    var mainNav = header && header.querySelector('.main-nav');
    var scrollThreshold = 80;

    /* Header trasparente in cima, solido dopo 80px */
    function updateHeaderScroll() {
      if (!header) return;
      if (window.scrollY >= scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', function () {
      window.requestAnimationFrame(updateHeaderScroll);
    }, { passive: true });
    updateHeaderScroll();

    /* Hamburger: toggle .nav-open su header */
    if (hamburger) {
      hamburger.addEventListener('click', function () {
        if (!header) return;
        var isOpen = header.classList.toggle('nav-open');
        hamburger.setAttribute('aria-expanded', isOpen);
        hamburger.setAttribute('aria-label', isOpen ? 'Chiudi menu' : 'Apri menu');
      });
    }

    /* Chiudi menu mobile cliccando fuori */
    document.addEventListener('click', function (e) {
      if (!header || !mainNav) return;
      if (!header.classList.contains('nav-open')) return;
      if (hamburger && hamburger.contains(e.target)) return;
      if (mainNav.contains(e.target)) {
        /* Chiudi anche cliccando su un link (navigazione) */
        if (e.target.closest('.nav-list a')) {
          header.classList.remove('nav-open');
          if (hamburger) {
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Apri menu');
          }
        }
        return;
      }
      header.classList.remove('nav-open');
      if (hamburger) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Apri menu');
      }
    });

    /* Reveal al scroll – IntersectionObserver */
    var revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && 'IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
      revealEls.forEach(function (el) {
        revealObserver.observe(el);
      });
    }

    /* Form Contatti – submit visivo (messaggio successo + reset) */
    var contattiForm = document.getElementById('contattiForm');
    var formSuccess = document.getElementById('formSuccess');
    if (contattiForm && formSuccess) {
      contattiForm.addEventListener('submit', function (e) {
        e.preventDefault();
        formSuccess.style.display = 'flex';
        contattiForm.reset();
      });
    }
  });
})();

/* VISITE — apri form prenotazione (globale per onclick) */
function apriForm(pacchetto) {
  var nomi = {
    'classico': 'Classico',
    'exclusive': 'Exclusive',
    'horeca': 'Ho.Re.Ca.'
  };
  var formSection = document.getElementById('form-prenotazione');
  var nomeSpan = document.getElementById('form-pacchetto-nome');
  if (nomeSpan) {
    nomeSpan.textContent = nomi[pacchetto] || '';
  }
  if (formSection) {
    formSection.style.display = 'block';
    setTimeout(function () {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

function chiudiForm() {
  var formSection = document.getElementById('form-prenotazione');
  if (formSection) {
    formSection.style.display = 'none';
    var pacchetti = document.getElementById('pacchetti');
    if (pacchetti) {
      pacchetti.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

function inviaPrenotazione() {
  var privacy = document.getElementById('f-privacy');
  if (!privacy || !privacy.checked) {
    alert('Accetta la privacy policy per continuare.');
    return;
  }
  var success = document.getElementById('visite-success');
  if (success) {
    success.style.display = 'flex';
  }
  ['f-nome', 'f-tel', 'f-email', 'f-persone', 'f-data', 'f-ora', 'f-note'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
  });
  if (privacy) privacy.checked = false;
}
