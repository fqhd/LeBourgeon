/* ============================================================
   LA FEUILLE VERTE — SCRIPT PRINCIPAL
   ============================================================
   1. Détection des images manquantes
   2. Année automatique dans le pied de page
   3. Menu mobile (ouverture / fermeture)
   4. Formulaire de devis (validation + message)
   5. Apparition douce des cartes au défilement
   6. Retour en haut de page (logo + liens #top)
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. Détection des images manquantes ---------- */
  window.addEventListener('error', function (e) {
    if (e.target && e.target.tagName === 'IMG') {
      e.target.classList.add('image-manquante');
    }
  }, true);

  /* ---------- 2. Année automatique ---------- */
  var annee = document.getElementById('annee');
  if (annee) annee.textContent = new Date().getFullYear();

  /* ---------- 3. Menu mobile ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('menu-principal');

  function fermerMenu() {
    if (!nav || !toggle) return;
    nav.classList.remove('ouvert');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Ouvrir le menu de navigation');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var ouvert = nav.classList.toggle('ouvert');
      toggle.setAttribute('aria-expanded', String(ouvert));
      toggle.setAttribute(
        'aria-label',
        ouvert ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'
      );
    });

    nav.querySelectorAll('a').forEach(function (lien) {
      lien.addEventListener('click', fermerMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('ouvert')) {
        fermerMenu();
        toggle.focus();
      }
    });
  }

  /* ---------- 4. Formulaire de devis ---------- */
  var form = document.querySelector('.devis-form');
  var message = document.querySelector('.form-message');

  if (form && message) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nom = form.querySelector('#nom');
      var email = form.querySelector('#email-devis');
      var description = form.querySelector('#message');

      var nomOk = nom.value.trim().length >= 2;
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
      var messageOk = description.value.trim().length >= 10;

      if (!nomOk) {
        message.textContent = 'Merci d\u2019indiquer votre nom.';
        message.style.color = '#ffd9d0';
        nom.focus();
        return;
      }

      if (!emailOk) {
        message.textContent = 'Merci de saisir une adresse e-mail valide.';
        message.style.color = '#ffd9d0';
        email.focus();
        return;
      }

      if (!messageOk) {
        message.textContent = 'Décrivez votre projet en quelques mots (au moins 10 caractères).';
        message.style.color = '#ffd9d0';
        description.focus();
        return;
      }

      // 👉 Ici, branchez votre outil d'envoi (Formspree, Netlify Forms, PHP, etc.)
      message.textContent = 'Merci ' + nom.value.trim() + ' ! Nous vous rappelons sous 48 h. 🌿';
      message.style.color = '#ffffff';
      form.reset();
    });
  }

  /* ---------- 5. Apparition douce au défilement ---------- */
  if (
    'IntersectionObserver' in window &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    var cibles = document.querySelectorAll(
      '.card, .avis, .step, .gallery .media'
    );

    cibles.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
    });

    var obs = new IntersectionObserver(
      function (entrees) {
        entrees.forEach(function (entree) {
          if (entree.isIntersecting) {
            entree.target.style.opacity = '1';
            entree.target.style.transform = 'translateY(0)';
            obs.unobserve(entree.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    cibles.forEach(function (el) {
      obs.observe(el);
    });
  }

  /* ---------- 6. Retour en haut de page ---------- */
  /*
     Le logo et les liens de pied de page pointent vers "#top".
     On force un vrai retour à zéro, car "scroll-padding-top"
     et la position "sticky" de l'en-tête empêchent le
     comportement natif de fonctionner correctement.
  */
  var liensHaut = document.querySelectorAll('a[href="#top"]');

  liensHaut.forEach(function (lien) {
    lien.addEventListener('click', function (e) {
      e.preventDefault();

      var mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({ top: 0, left: 0, behavior: mouvementReduit ? 'auto' : 'smooth' });
      } else {
        window.scrollTo(0, 0); // navigateurs anciens
      }

      fermerMenu(); // referme le menu mobile si besoin

      // Nettoie l'URL (retire le #top) sans provoquer de saut
      if (history.replaceState) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    });
  });

})();
