/* ==========================================================================
   ANALYTICS + REDES SOCIAIS + WHATSAPP - Marido de Aluguel Guarulhos
   --------------------------------------------------------------------------
   Arquivo UNICO de rastreamento. Ele e carregado automaticamente pelo
   script.js (injecao unica, com guarda anti-duplicidade) em todas as paginas,
   portanto NAO e preciso adicionar <script> em cada pagina.

   ============================ COMO CONFIGURAR ============================
   Preencha SOMENTE as 3 linhas abaixo com seus dados reais.
   Se ficarem vazias, o arquivo permanece inativo (no-op): nada e enviado,
   nenhum erro aparece e os links de WhatsApp continuam funcionando.

     GA4_ID        -> ID do Google Analytics 4  (ex.: 'G-ABC123XYZ9')
     INSTAGRAM_URL -> URL do perfil no Instagram (ex.: 'https://instagram.com/seuperfil')
     FACEBOOK_URL  -> URL da pagina no Facebook (ex.: 'https://facebook.com/suapagina')
   ========================================================================= */
(function () {
  'use strict';

  if (window.__mdaAnalyticsInit) { return; }
  window.__mdaAnalyticsInit = true;

  var CONFIG = {
    GA4_ID: '',
    INSTAGRAM_URL: '',
    FACEBOOK_URL: '',
    TRACK_PAGE: 'track.html',
    WHATSAPP_NUMBER: '5511980604534'
  };

  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var UTM_ALIASES = {
    origem: 'utm_source',
    midia: 'utm_medium',
    campanha: 'utm_campaign',
    conteudo: 'utm_content',
    termo: 'utm_term'
  };
  var UTM_STORAGE = 'mda_utm';
  var EVENT_MAP = {
    whatsapp: 'clique_whatsapp',
    phone: 'clique_telefone',
    instagram: 'clique_instagram',
    facebook: 'clique_facebook'
  };

  function storageAvailable() {
    try {
      var k = '__mda_test__';
      window.sessionStorage.setItem(k, '1');
      window.sessionStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  }

  function getStored(key) {
    if (!storageAvailable()) { return null; }
    try { return window.sessionStorage.getItem(key); } catch (e) { return null; }
  }

  function setStored(key, value) {
    if (!storageAvailable()) { return; }
    try { window.sessionStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }

  function readUTMsFromSearch(search) {
    var out = {};
    var params;
    try {
      params = new URLSearchParams(search || window.location.search || '');
    } catch (e) {
      return out;
    }
    UTM_KEYS.forEach(function (key) {
      var value = params.get(key);
      if (value) { out[key] = value; }
    });
    Object.keys(UTM_ALIASES).forEach(function (alias) {
      var canonical = UTM_ALIASES[alias];
      var value = params.get(alias);
      if (value && !out[canonical]) { out[canonical] = value; }
    });
    return out;
  }

  function getUTMs() {
    var stored = {};
    var raw = getStored(UTM_STORAGE);
    if (raw) {
      try { stored = JSON.parse(raw) || {}; } catch (e) { stored = {}; }
    }
    var fromUrl = readUTMsFromSearch();
    var merged = {};
    UTM_KEYS.forEach(function (key) {
      merged[key] = fromUrl[key] || stored[key] || '';
    });
    if (Object.keys(fromUrl).length) {
      setStored(UTM_STORAGE, JSON.stringify(merged));
    }
    return merged;
  }

  function hasGA4() {
    return !!CONFIG.GA4_ID && /^G-[A-Z0-9]+$/i.test(CONFIG.GA4_ID);
  }

  function ga4AlreadyLoaded() {
    if (window.gtag && window.dataLayer) { return true; }
    if (document.querySelector && document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
      return true;
    }
    return false;
  }

  function loadGA4() {
    if (!hasGA4() || ga4AlreadyLoaded()) { return false; }

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', CONFIG.GA4_ID, { send_page_view: true });

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(CONFIG.GA4_ID);
    (document.head || document.documentElement).appendChild(script);
    return true;
  }

  function track(name, params) {
    if (!name) { return; }
    var payload = params || {};
    try {
      if (window.gtag) {
        window.gtag('event', name, payload);
      } else if (window.dataLayer) {
        var entry = { event: name };
        Object.keys(payload).forEach(function (key) { entry[key] = payload[key]; });
        window.dataLayer.push(entry);
      }
    } catch (e) { /* nunca quebra a pagina */ }
  }

  function withUTMs(base) {
    var utms = getUTMs();
    var out = {};
    Object.keys(base || {}).forEach(function (key) { out[key] = base[key]; });
    UTM_KEYS.forEach(function (key) {
      if (utms[key]) { out[key] = utms[key]; }
    });
    return out;
  }

  function appendParams(url, params) {
    var qs = new URLSearchParams();
    Object.keys(params || {}).forEach(function (key) {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        qs.set(key, params[key]);
      }
    });
    var query = qs.toString();
    if (!query) { return url; }
    return url + (url.indexOf('?') === -1 ? '?' : '&') + query;
  }

  function buildLandingURL(page, utms) {
    var target = page || 'index.html';
    var data = utms || {};
    var params = {};
    if (data.source) { params.utm_source = data.source; }
    if (data.medium) { params.utm_medium = data.medium; }
    if (data.campaign) { params.utm_campaign = data.campaign; }
    if (data.content) { params.utm_content = data.content; }
    if (data.term) { params.utm_term = data.term; }
    return appendParams(target, params);
  }

  function buildTrackURL(utms) {
    var data = utms || {};
    var params = { origem: data.source || 'direto' };
    if (data.medium) { params.midia = data.medium; }
    if (data.campaign) { params.campanha = data.campaign; }
    if (data.content) { params.conteudo = data.content; }
    if (data.term) { params.termo = data.term; }
    return appendParams(CONFIG.TRACK_PAGE, params);
  }

  function buildWhatsAppURL(message, utms) {
    var text = message || '';
    var data = utms || getUTMs();
    var tags = [];
    if (data.utm_source) { tags.push('origem: ' + data.utm_source); }
    if (data.utm_medium) { tags.push('midia: ' + data.utm_medium); }
    if (data.utm_campaign) { tags.push('campanha: ' + data.utm_campaign); }
    if (data.utm_content) { tags.push('conteudo: ' + data.utm_content); }
    if (data.utm_term) { tags.push('termo: ' + data.utm_term); }
    if (tags.length) { text += (text ? '\n\n' : '') + '[' + tags.join(' | ') + ']'; }
    var url = 'https://wa.me/' + CONFIG.WHATSAPP_NUMBER;
    if (text) { url += '?text=' + encodeURIComponent(text); }
    return url;
  }

  function closestMatch(target, selector) {
    if (!target || !target.closest) { return null; }
    try { return target.closest(selector); } catch (e) { return null; }
  }

  function classifyClick(target) {
    if (closestMatch(target, '[data-share], .share-page-btn')) { return 'share'; }
    if (closestMatch(target, 'a[href*="wa.me"], a[href*="api.whatsapp.com"], .direct-whatsapp-link, .btn-whatsapp')) {
      return 'whatsapp';
    }
    if (closestMatch(target, 'a[href^="tel:"]')) { return 'phone'; }
    if (closestMatch(target, 'a[href*="instagram.com"], [data-social="instagram"], .social-instagram')) {
      return 'instagram';
    }
    if (closestMatch(target, 'a[href*="facebook.com"], [data-social="facebook"], .social-facebook')) {
      return 'facebook';
    }
    return null;
  }

  function baseParams(anchor) {
    var params = withUTMs({
      page_location: window.location.href,
      page_title: document.title
    });
    if (anchor && anchor.href) { params.link_url = anchor.href; }
    return params;
  }

  function handleShare(event, anchor) {
    if (event && event.preventDefault) { event.preventDefault(); }
    var params = baseParams(anchor);
    var url = window.location.href;
    var done = function (method, success) {
      params.method = method;
      params.shared_url = url;
      params.success = !!success;
      track('compartilhamento_pagina', params);
    };

    if (navigator.share) {
      navigator.share({ title: document.title, url: url })
        .then(function () { done('native', true); })
        .catch(function (err) {
          if (!err || err.name !== 'AbortError') { done('native', false); }
        });
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(function () { done('clipboard', true); })
        .catch(function () { done('clipboard', false); });
      return;
    }
    done('unsupported', false);
  }

  function onDocumentClick(event) {
    var kind = classifyClick(event.target);
    if (!kind) { return; }
    var anchor = closestMatch(event.target, 'a, button');
    if (kind === 'share') {
      handleShare(event, anchor);
      return;
    }
    track(EVENT_MAP[kind], baseParams(anchor));
  }

  function applySocialLinks() {
    if (CONFIG.INSTAGRAM_URL) {
      document.querySelectorAll('[data-social="instagram"], .social-instagram').forEach(function (el) {
        if (el.tagName === 'A') {
          el.setAttribute('href', CONFIG.INSTAGRAM_URL);
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener noreferrer');
        }
      });
    }
    if (CONFIG.FACEBOOK_URL) {
      document.querySelectorAll('[data-social="facebook"], .social-facebook').forEach(function (el) {
        if (el.tagName === 'A') {
          el.setAttribute('href', CONFIG.FACEBOOK_URL);
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener noreferrer');
        }
      });
    }
  }

  function init() {
    loadGA4();
    getUTMs();
    applySocialLinks();
    if (document.addEventListener) {
      document.addEventListener('click', onDocumentClick, true);
    }
  }

  window.MDA_TRACKING_CONFIG = CONFIG;
  window.MDA_TRACKING = {
    config: CONFIG,
    init: init,
    track: track,
    getUTMs: getUTMs,
    buildLandingURL: buildLandingURL,
    buildTrackURL: buildTrackURL,
    buildWhatsAppURL: buildWhatsAppURL,
    readUTMsFromSearch: readUTMsFromSearch,
    classifyClick: classifyClick,
    _internals: { hasGA4: hasGA4, loadGA4: loadGA4, EVENT_MAP: EVENT_MAP }
  };

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
})();
