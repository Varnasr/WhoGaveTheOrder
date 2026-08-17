/* =============================================================================
   WhoGaveTheOrder.in — shared interface pieces
   -----------------------------------------------------------------------------
   Chrome, evidence chips, source lines and empty states. Anything that carries
   the site's evidence grammar is built here once, so that a status label cannot
   drift page to page.
   ========================================================================== */

(function (WGO) {
  'use strict';

  var ui = {};

  /* --- primitives -------------------------------------------------------- */

  ui.esc = function (value) {
    if (value === null || value === undefined) { return ''; }
    return String(value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  ui.param = function (name) {
    return new URLSearchParams(window.location.search).get(name);
  };

  /* --- language ----------------------------------------------------------- *
     The interface language lives in the URL, not in storage. The privacy note
     says nothing is written to your device, and a language preference in
     localStorage would make that sentence false for the sake of saving a query
     parameter. It also makes a Hindi page shareable as a Hindi page.

     The cost is that only links this file generates carry the language through.
     A link inside a page's editorial copy drops back to English, which is worth
     saying plainly rather than hiding. */

  ui.lang = function () {
    /* The URL wins, so a link can put a reader in a language. Failing that, a
       page written in a language declares it in its own <html lang>, which is
       how hi.html serves Hindi without needing a parameter on every link. */
    var want = ui.param('lang') ||
      (document.documentElement.getAttribute('lang') || '').slice(0, 2);
    var known = (WGO.LANGUAGES || []).filter(function (l) { return l.code === want; })[0];
    return known ? known.code : 'en';
  };

  ui.strings = function () {
    var code = ui.lang();
    return (code !== 'en' && WGO.I18N && WGO.I18N[code]) || null;
  };

  /* Dotted lookup with an English fallback. A missing translation renders the
     English rather than an empty space or a key. */
  ui.t = function (path, fallback) {
    var strings = ui.strings();
    if (!strings) { return fallback; }
    var value = path.split('.').reduce(function (node, key) {
      return (node && node[key] !== undefined) ? node[key] : undefined;
    }, strings);
    return value === undefined || value === null || value === '' ? fallback : value;
  };

  /* A same-site href with the current language carried through. */
  ui.withLang = function (href) {
    var code = ui.lang();
    if (code === 'en' || /^(https?:|mailto:|#)/.test(href)) { return href; }
    var hash = '';
    var target = href;
    var hashAt = target.indexOf('#');
    if (hashAt !== -1) { hash = target.slice(hashAt); target = target.slice(0, hashAt); }
    return target + (target.indexOf('?') === -1 ? '?' : '&') + 'lang=' + code + hash;
  };

  /* The state definitions a reader sees, in whichever language they are
     reading. The keys never translate: UNKNOWN is the same record state in both
     languages, and the data must not fork. */
  ui.stateDef = function (key) {
    var strings = ui.strings();
    var translated = strings && (
      (strings.EVIDENCE_STATES || {})[key] ||
      (strings.QUESTION_STATES || {})[key] ||
      (strings.AUTHORITY_CLAIMS || {})[key]);
    if (translated) { return translated; }
    return WGO.EVIDENCE_STATES[key] || WGO.QUESTION_STATES[key] ||
      WGO.INCIDENT_STATES[key] || WGO.AUTHORITY_CLAIMS[key] || null;
  };

  ui.mount = function (selector, html) {
    var node = document.querySelector(selector);
    if (node) { node.innerHTML = html; }
    return node;
  };

  /* --- evidence chips ---------------------------------------------------- *
     The chip is the smallest unit of the site's discipline. Every one of them
     carries the definition of its own state in a tooltip, so a reader never has
     to take a label on trust. */

  ui.chip = function (state, options) {
    var opts = options || {};
    var key = String(state || 'UNKNOWN').toUpperCase();
    var def = ui.stateDef(key) || { label: key.replace(/_/g, ' '), definition: '' };
    var cls = 'chip chip--' + key.toLowerCase();
    return '<span class="' + cls + '"' +
      (def.definition ? ' title="' + ui.esc(def.definition) + '"' : '') + '>' +
      ui.esc(opts.prefix ? opts.prefix + ' ' + def.label : def.label) + '</span>';
  };

  ui.plainChip = function (text, extraClass) {
    return '<span class="chip ' + (extraClass || 'chip--plain') + '">' + ui.esc(text) + '</span>';
  };

  ui.idChip = function (id) {
    return '<span class="chip chip--plain mono" style="letter-spacing:0.06em">' + ui.esc(id) + '</span>';
  };

  ui.sampleRibbon = function () {
    return '<span class="sample-ribbon">Sample record. Layout only.</span>';
  };

  /* --- source lines ------------------------------------------------------ *
     The single most important line on any record. If nothing sourced it, the
     interface says so plainly rather than leaving an empty space that reads
     like completeness. */

  ui.sourceLine = function (sourceIds) {
    var ids = sourceIds || [];
    if (!ids.length) {
      return '<span class="chip chip--unknown">No source on record</span>';
    }
    return ids.map(function (id) {
      var source = WGO.model.index.source[id];
      if (!source) { return ui.plainChip(id + ' — missing source record'); }
      var label = ui.esc(source.name);
      /* The retrieval date rides along in the tooltip. It is the difference
         between "this page says" and "this page said, on this date". */
      var title = source.retrievedOn
        ? ' title="' + ui.esc(source.id + ' — retrieved ' + source.retrievedOn) + '"'
        : ' title="' + ui.esc(source.id + ' — retrieval date not recorded') + '"';
      return source.url
        ? '<a class="chip chip--plain" href="' + ui.esc(source.url) + '" rel="noopener nofollow" target="_blank"' + title + '>' + label + '</a>'
        : '<span class="chip chip--plain"' + title + '>' + label + '</span>';
    }).join(' ');
  };

  /* The full provenance of a source, for the record page where a reader is
     deciding whether to believe it. What the archive does not hold, it says it
     does not hold: a missing archived copy is a fact about our practice and
     belongs on the page rather than in a backlog. */
  ui.sourceDetail = function (sourceIds) {
    var ids = sourceIds || [];
    if (!ids.length) {
      return '<p class="small">' + ui.chip('UNKNOWN') +
        ' Nothing sourced this record. It renders as an absence, not as a fact.</p>';
    }
    return '<ul class="source-detail">' + ids.map(function (id) {
      var s = WGO.model.index.source[id];
      if (!s) {
        return '<li><span class="mono">' + ui.esc(id) + '</span> — ' +
          ui.plainChip('missing source record') + '</li>';
      }
      var bits = [];
      bits.push(s.url
        ? '<a href="' + ui.esc(s.url) + '" rel="noopener nofollow" target="_blank">' + ui.esc(s.name) + '</a>'
        : ui.esc(s.name));
      if (s.kind) { bits.push('<span class="small">' + ui.esc(String(s.kind).toLowerCase()) + '</span>'); }

      var fixity = [];
      fixity.push(s.retrievedOn
        ? 'Retrieved ' + ui.esc(s.retrievedOn)
        : '<strong>Retrieval date not recorded</strong>');
      fixity.push(s.archiveUrl
        ? '<a href="' + ui.esc(s.archiveUrl) + '" rel="noopener nofollow" target="_blank">archived copy</a>'
        : 'no archived copy');
      if (s.sha256) {
        fixity.push('<span class="mono" title="SHA-256 of the captured file">' +
          ui.esc(String(s.sha256).slice(0, 16)) + '…</span>');
      }

      return '<li>' +
        '<span class="mono">' + ui.esc(s.id) + '</span> ' + bits.join(' ') +
        '<div class="small source-detail__fixity">' + fixity.join(' · ') + '</div>' +
      '</li>';
    }).join('') + '</ul>';
  };

  ui.evidenceLinks = function (evidenceIds, emptyText) {
    var ids = evidenceIds || [];
    if (!ids.length) {
      return '<p class="small">' + ui.esc(emptyText || 'No evidence attached.') + '</p>';
    }
    return '<ul class="pill-list">' + ids.map(function (id) {
      var item = WGO.model.evidenceItem(id);
      return '<li><a class="chip chip--plain" href="evidence.html?id=' + ui.esc(id) + '">' +
        ui.esc(id) + (item ? ' — ' + ui.esc(item.title) : ' — missing record') + '</a></li>';
    }).join('') + '</ul>';
  };

  /* --- states ------------------------------------------------------------ */

  ui.unknownBlock = function (heading, body, actionHtml) {
    return '<div class="gap-block">' +
      '<p class="kicker">Unknown</p>' +
      '<h3>' + ui.esc(heading) + '</h3>' +
      '<p>' + ui.esc(body) + '</p>' +
      (actionHtml ? '<p style="margin-top:0.85rem">' + actionHtml + '</p>' : '') +
      '</div>';
  };

  ui.empty = function (heading, body) {
    return '<div class="empty"><h4>' + ui.esc(heading) + '</h4><p>' + ui.esc(body) + '</p></div>';
  };

  /* A field that has no established value yet. Used everywhere an incident
     record is still a shell, which — before launch — is everywhere. */
  ui.field = function (value, state, fallback) {
    if (value === null || value === undefined || value === '') {
      return ui.chip(state || 'UNKNOWN') + ' <span class="small">' +
        ui.esc(fallback || 'Not established on the record.') + '</span>';
    }
    return ui.esc(value) + (state ? ' ' + ui.chip(state) : '');
  };

  ui.list = function (block, fallback) {
    var data = block || {};
    if (!data.items || !data.items.length) {
      return ui.chip(data.state || 'UNKNOWN') + ' <span class="small">' +
        ui.esc(fallback || 'Nothing established on the record.') + '</span>';
    }
    return '<ul class="stack-sm">' + data.items.map(function (item) {
      return '<li>' + ui.esc(item.text || item) +
        (item.state ? ' ' + ui.chip(item.state) : '') + '</li>';
    }).join('') + '</ul>';
  };

  /* --- inline explainers ------------------------------------------------- *
     Progressive disclosure. The page stays terse for a reader who already knows
     how to read it, and answers the obvious question for one who does not.
     Uses <details> so it works without JavaScript and is keyboard-accessible
     and findable by in-page search. */

  ui.explainer = function (summary, bodyHtml) {
    return '<details class="explainer">' +
      '<summary>' + ui.esc(summary) + '</summary>' +
      '<div class="explainer__body">' + bodyHtml + '</div>' +
      '</details>';
  };

  /* The three explainers used in more than one place, defined once. */
  ui.EXPLAIN = {
    states: function () {
      return ui.explainer(ui.t('explain.statesSummary', 'What do these labels mean?'),
        '<p>' + ui.esc(ui.t('explain.statesBody',
          'Every statement on this site carries one of six states. A claim cannot appear without ' +
          'one, and moving a claim between them requires a document.')) + '</p>' +
        '<div class="chip-legend" style="margin-top:0.75rem">' +
        Object.keys(WGO.EVIDENCE_STATES).map(function (k) {
          return '<div>' + ui.chip(k) + '<p>' +
            ui.esc((ui.stateDef(k) || {}).definition || '') + '</p></div>';
        }).join('') +
        '</div>' +
        '<p style="margin-top:0.75rem"><a href="walkthrough.html#step-3">More on how to read this archive &rarr;</a></p>');
    },

    authority: function () {
      var has = ui.stateDef('HAS_AUTHORITY') || WGO.AUTHORITY_CLAIMS.HAS_AUTHORITY;
      var evidenced = ui.stateDef('EVIDENCED_TO_HAVE_AUTHORISED') || WGO.AUTHORITY_CLAIMS.EVIDENCED_TO_HAVE_AUTHORISED;
      return ui.explainer(
        ui.t('explain.authoritySummary', 'Why does every office say "authorisation not established"?'),
        '<p>' + ui.esc(ui.t('explain.authorityBody',
          'Because two different claims are being kept apart, and only one of them is established.')) + '</p>' +
        '<div class="authority-split" style="margin-top:0.75rem">' +
          '<div><h5>' + ui.esc(has.label) + '</h5><p>' + ui.esc(has.definition) + '</p></div>' +
          '<div><h5>' + ui.esc(evidenced.label) + '</h5><p>' + ui.esc(evidenced.definition) + '</p></div>' +
        '</div>' +
        '<p style="margin-top:0.75rem">' + ui.esc(ui.t('explain.authorityNote',
          'No individual is named in the chain. A person is added to an office only when a sourced ' +
          'document places them in it at the relevant time.')) + ' ' +
        '<a href="' + ui.esc(ui.withLang('walkthrough.html#step-4')) + '">More &rarr;</a></p>');
    },

    unknown: function () {
      return ui.explainer(ui.t('explain.unknownSummary', 'Why is so much of this page UNKNOWN?'),
        '<p>' + ui.esc(ui.t('explain.unknownBody',
          'Because nothing has been established yet, and the site says so rather than filling the ' +
          'space with a plausible reconstruction. A claim without a source does not render as a fact ' +
          'here, including in our own starting data.')) + '</p>' +
        '<p style="margin-top:0.5rem">These fields fill in when a document arrives, not before. ' +
        'If you hold one, <a href="submit.html">send it</a>. ' +
        '<a href="walkthrough.html#step-2">More &rarr;</a></p>');
    },

    clock: function () {
      return ui.explainer(ui.t('explain.clockSummary', 'How does the reply clock work?'),
        '<p>' + ui.esc(ui.t('explain.clockBody',
          'Filing a statutory information request puts a public office on a deadline. The register ' +
          'computes the reply-due date from the filing date every time the page loads, so it cannot ' +
          'go stale.')) + '</p>' +
        '<p style="margin-top:0.5rem">' + ui.esc(ui.t('explain.clockBody2',
          'The clock stops when an office replies, even if the reply came late. Silence past the ' +
          'statutory period counts as a refusal and opens an appeal, which is why an unanswered ' +
          'request is published rather than hidden.')) + ' ' +
        '<a href="' + ui.esc(ui.withLang('walkthrough.html#step-7')) + '">More &rarr;</a></p>');
    }
  };

  /* --- chrome ------------------------------------------------------------ */

  function navHtml(current) {
    /* Looked up directly, not through ui.t: the keys are filenames and contain
       dots, which a dotted-path lookup would split into nested objects. */
    var strings = ui.strings();
    var labels = (strings && strings.nav) || {};

    return '<ul>' + WGO.NAV.map(function (item) {
      var active = item.href === current;
      return '<li><a href="' + ui.esc(ui.withLang(item.href)) + '"' + (active ? ' aria-current="page"' : '') + '>' +
        ui.esc(labels[item.href] || item.label) + '</a></li>';
    }).join('') + '</ul>';
  }

  /* The switch is a link, not a control: it points at this same page in the
     other language, so it works without JavaScript and can be bookmarked. */
  function languageHtml() {
    var here = window.location.pathname.split('/').pop() || 'index.html';
    var query = new URLSearchParams(window.location.search);
    var current = ui.lang();

    return '<span class="lang-switch">' + (WGO.LANGUAGES || []).map(function (l) {
      if (l.code === current) {
        return '<span class="lang-switch__on" aria-current="true">' + ui.esc(l.label) + '</span>';
      }
      var params = new URLSearchParams(query.toString());
      if (l.code === 'en') { params.delete('lang'); } else { params.set('lang', l.code); }
      var qs = params.toString();
      return '<a href="' + ui.esc(here + (qs ? '?' + qs : '')) + '" lang="' + ui.esc(l.htmlLang) + '">' +
        ui.esc(l.label) + '</a>';
    }).join('<span aria-hidden="true"> · </span>') + '</span>';
  }

  ui.renderChrome = function () {
    var current = window.location.pathname.split('/').pop() || 'index.html';
    var cfg = WGO.config;

    /* The notice reports the archive's actual state rather than a fixed string.
       An archive that told visitors it was empty after evidence had been
       published would be making exactly the kind of unchecked claim the rest of
       the site refuses to make. */
    /* A live status line rather than a launch banner. It reports the archive's
       actual counts, so it stays true as the archive fills up instead of going
       stale the way a fixed "pre-launch" label does. */
    var counts = WGO.model.counts();
    var hindi = ui.lang() === 'hi';

    /* The page's own language attribute, so a screen reader pronounces the
       chrome correctly rather than reading Devanagari as English. */
    document.documentElement.setAttribute('lang', hindi ? 'hi' : 'en');

    var status = counts.evidence
      ? (hindi
          ? '<strong>' + counts.evidence + '</strong> ' + ui.t('chrome.documents', 'documents') + ' ' +
            '<strong>' + counts.sources + '</strong> ' + ui.t('chrome.sources', 'sources') + ' ' +
            ui.t('chrome.onRecord', 'on the record.') + ' ' +
            '<strong>' + counts.open + '</strong> ' + ui.t('chrome.questionsOpen', 'questions still open.') + ' ' +
            '<strong>' + counts.orders + '</strong> ' + ui.t('chrome.ordersFound', 'orders found.')
          : '<strong>' + counts.evidence + '</strong> document' + (counts.evidence === 1 ? '' : 's') +
            ' from <strong>' + counts.sources + '</strong> sources on the record. ' +
            '<strong>' + counts.open + '</strong> questions still open. ' +
            '<strong>' + counts.orders + '</strong> orders found.')
      : ui.t('chrome.empty', 'No documents have been published to this archive yet.');

    var notice =
      '<div class="notice-bar"><div class="shell notice-bar__inner">' +
        '<span>' +
          (cfg.archiveStage ? '<strong>' + ui.esc(cfg.archiveStage) + '</strong> — ' : '') +
          status +
          (cfg.demoMode ? ' Records marked <em>sample</em> show the layout only.' : '') +
        '</span>' +
        languageHtml() +
      '</div></div>';

    var header = document.querySelector('[data-chrome="masthead"]');
    if (header) {
      header.innerHTML = notice +
        '<header class="masthead"><div class="shell">' +
          '<div class="masthead__bar">' +
            '<a class="wordmark" href="' + ui.esc(ui.withLang('index.html')) + '">Who Gave The Order<span class="dot">.in</span></a>' +
            '<div class="masthead__tools">' +
              '<a class="cta-persistent" href="' + ui.esc(ui.withLang('submit.html')) + '">' +
                ui.esc(ui.t('chrome.addDocument', 'Add a document')) + '</a>' +
              '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">' +
                ui.esc(ui.t('chrome.menu', 'Menu')) + '</button>' +
            '</div>' +
          '</div>' +
          '<nav class="nav" id="primary-nav" aria-label="Primary">' + navHtml(current) + '</nav>' +
        '</div></header>';

      var toggle = header.querySelector('.nav-toggle');
      var nav = header.querySelector('#primary-nav');
      if (toggle && nav) {
        toggle.addEventListener('click', function () {
          var open = nav.getAttribute('data-open') === 'true';
          nav.setAttribute('data-open', open ? 'false' : 'true');
          toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
        });
      }
    }

    /* Footer link labels, looked up by their English text so the markup below
       stays a single list. A missing translation falls back to the English. */
    var linkLabels = ((ui.strings() || {}).footerLinks) || {};
    function fl(href, label) {
      return '<a href="' + ui.esc(ui.withLang(href)) + '">' +
        ui.esc(linkLabels[label] || label) + '</a>';
    }

    var footer = document.querySelector('[data-chrome="footer"]');
    if (footer) {
      footer.innerHTML =
        '<footer class="site-footer"><div class="shell">' +
          '<div class="grid grid--4">' +
            '<div><h4>' + ui.esc(ui.t('footer.investigation', 'The investigation')) + '</h4><ul>' +
              '<li>' + fl('investigations.html', 'Investigations') + '</li>' +
              '<li>' + fl('chain.html', 'Chain of command') + '</li>' +
              '<li>' + fl('response.html', 'Government response') + '</li>' +
              '<li>' + fl('others.html', 'Others are investigating') + '</li>' +
            '</ul></div>' +
            '<div><h4>' + ui.esc(ui.t('footer.archive', 'The archive')) + '</h4><ul>' +
              '<li>' + fl('evidence.html', 'Evidence library') + '</li>' +
              '<li>' + fl('rti.html', 'RTI register') + '</li>' +
              '<li>' + fl('search.html', 'Search') + '</li>' +
              '<li>' + fl('changes.html', 'What changed') + '</li>' +
              '<li>' + fl('data/export/archive.json', 'Download the data') + '</li>' +
              '<li>' + fl('admin.html', 'Editorial console') + '</li>' +
            '</ul></div>' +
            '<div><h4>' + ui.esc(ui.t('footer.takePart', 'Take part')) + '</h4><ul>' +
              '<li>' + fl('submit.html', 'Submit evidence') + '</li>' +
              '<li>' + fl('submit.html#missing', 'What we are missing') + '</li>' +
              '<li>' + fl('about.html#corrections', 'Report an error') + '</li>' +
            '</ul></div>' +
            '<div><h4>' + ui.esc(ui.t('footer.howWeWork', 'How we work')) + '</h4><ul>' +
              '<li>' + fl('walkthrough.html', 'How to read this archive') + '</li>' +
              '<li>' + fl('about.html#method', 'Methodology') + '</li>' +
              '<li>' + fl('about.html#standards', 'Verification standards') + '</li>' +
              '<li>' + fl('about.html#privacy', 'Privacy and takedown') + '</li>' +
              '<li>' + fl('about.html#who', 'Who runs this') + '</li>' +
            '</ul></div>' +
          '</div>' +
          '<div class="site-footer__legal">' +
            '<p>' + ui.esc(ui.t('chrome.footerNote', 'Where the record does not answer a question, this site says so.')) + '</p>' +
            '<ul class="footer-legal-links">' +
              '<li>' + fl('about.html#who', 'Who runs this') + '</li>' +
              '<li>' + fl('about.html#privacy', 'Privacy') + '</li>' +
              '<li>' + fl('about.html#privacy', 'Takedown & grievances') + '</li>' +
              '<li>' + fl('about.html#corrections', 'Corrections') + '</li>' +
              '<li>' + fl('about.html#licence', 'Reuse & licence') + '</li>' +
              '<li>' + fl('about.html#standards', 'Verification standards') + '</li>' +
            '</ul>' +
            /* Stated because it is true and checkable, not as a compliance
               gesture. A cookie banner here would imply tracking that does
               not exist. */
            '<p class="footer-privacy">' +
              ui.esc(ui.t('chrome.noTracking',
                'No cookies. No trackers. No scripts that watch you. ' +
                'Visit counts come from server logs, never from your browser.')) + ' ' +
              '<a href="' + ui.esc(ui.withLang('about.html#privacy')) + '">Full privacy note &rarr;</a></p>' +
            '<p style="margin-top:0.5rem">' + ui.esc(ui.t('chrome.lastReviewed', 'Record last reviewed')) + ' ' +
              ui.esc(WGO.config.lastReviewed) + '.</p>' +
          '</div>' +
        '</div></footer>';
    }
  };

  /* --- citation ----------------------------------------------------------- *
     Every record here has a permanent ID and a state that can change. Both facts
     make a citation harder than a URL: whoever cites this needs to say which
     version they read, and on what day it said what it said.

     The retrieval date is the reader's own — taken from their clock, not from
     the record — because that is what a citation is recording. */

  ui.citeBlock = function (record) {
    var cfg = WGO.config || {};
    var base = String(cfg.siteUrl || '').replace(/\/$/, '');
    var url = base + '/' + record.path;
    var today = new Date().toISOString().slice(0, 10);
    var id = 'cite-' + String(record.id).replace(/[^A-Za-z0-9_-]/g, '');

    var citation = [
      cfg.siteName || 'WhoGaveTheOrder.in',
      ', ',
      record.id,
      record.title ? ', "' + record.title + '"' : '',
      record.state ? ' [' + record.state + ']' : '',
      '. ',
      url,
      '. Retrieved ',
      today,
      '.'
    ].join('');

    return '<details class="explainer cite">' +
      '<summary>Cite this record</summary>' +
      '<div class="explainer__body">' +
        '<pre class="cite__text" id="' + id + '">' + ui.esc(citation) + '</pre>' +
        '<div class="row" style="margin-top:0.6rem">' +
          '<button class="btn btn--small btn--ghost" type="button" data-copy="' + id + '">Copy the citation</button>' +
        '</div>' +
        '<p class="small" style="margin-top:0.6rem">' +
          'Records change state when a document arrives, so the retrieval date is part of the ' +
          'citation rather than a courtesy. What this record said on any earlier date is in ' +
          '<a href="changes.html">the change log</a>. ' +
          ui.esc(((cfg.licence || {}).note) || '') +
        '</p>' +
      '</div>' +
    '</details>';
  };

  /* --- workflow strip ---------------------------------------------------- */

  ui.workflow = function (steps) {
    return '<div class="workflow">' + steps.map(function (step, i) {
      return (i ? '<span class="workflow__arrow" aria-hidden="true">&rarr;</span>' : '') +
        '<span class="workflow__step" title="' + ui.esc(step.note || '') + '">' + ui.esc(step.label) + '</span>';
    }).join('') + '</div>';
  };

  /* --- record cards ------------------------------------------------------ */

  ui.evidenceCard = function (item) {
    return '<a class="card' + (item.demo ? ' card--sample' : '') + '" href="evidence.html?id=' + ui.esc(item.id) + '">' +
      (item.demo ? ui.sampleRibbon() : '') +
      '<div class="row">' + ui.idChip(item.id) + ui.chip(item.verification) + '</div>' +
      '<h3>' + ui.esc(item.title) + '</h3>' +
      '<p>' + ui.esc(item.establishes || '') + '</p>' +
      '<div class="card__meta row small">' +
        '<span>' + ui.esc(WGO.model.typeLabel(item.type)) + '</span>' +
        '<span aria-hidden="true">·</span>' +
        '<span>' + ui.esc(item.dateOfItem || 'Date unknown') + '</span>' +
      '</div>' +
    '</a>';
  };

  ui.incidentCard = function (incident) {
    var questions = WGO.model.questionsFor(incident.id);
    var open = questions.filter(function (q) { return q.state === 'UNANSWERED'; }).length;
    var evidence = WGO.model.evidenceFor(incident.id).filter(function (e) { return !e.demo; }).length;

    return '<a class="card" href="investigation.html?id=' + ui.esc(incident.slug) + '">' +
      '<div class="row">' + ui.idChip(incident.id) + ui.chip(incident.incidentState) + '</div>' +
      '<h3>' + ui.esc(incident.title) + '</h3>' +
      '<p>' + ui.esc(incident.place) + '</p>' +
      '<div class="card__meta row small">' +
        '<span><strong>' + open + '</strong> open questions</span>' +
        '<span aria-hidden="true">·</span>' +
        '<span><strong>' + evidence + '</strong> evidence items</span>' +
        '<span aria-hidden="true">·</span>' +
        '<span>Date ' + (incident.date ? ui.esc(incident.date) : 'unknown') + '</span>' +
      '</div>' +
    '</a>';
  };

  /* --- RTI clock --------------------------------------------------------- *
     The line that does the work on this site: not "we asked", but "we asked on
     this date, the reply was due on that date, and it is N days late." */

  ui.rtiClockLine = function (rti) {
    var clock = WGO.model.rtiClock(rti);
    if (!clock.known) {
      return '<span class="chip chip--unknown">Filing date not recorded</span>';
    }
    if (clock.settled) {
      return '<span class="small">Filed ' + ui.esc(rti.filedOn) +
        (rti.repliedOn ? ', replied ' + ui.esc(rti.repliedOn) : '') + '.</span>';
    }
    if (clock.overdue) {
      return '<span class="chip chip--unknown">Overdue by ' + clock.overdueDays +
        ' day' + (clock.overdueDays === 1 ? '' : 's') + '</span> ' +
        '<span class="small">Filed ' + ui.esc(rti.filedOn) + ', reply was due ' + ui.esc(clock.dueOn) + '.</span>';
    }
    return '<span class="chip chip--reported">' + clock.daysRemaining + ' day' +
      (clock.daysRemaining === 1 ? '' : 's') + ' left</span> ' +
      '<span class="small">Filed ' + ui.esc(rti.filedOn) + ', reply due ' + ui.esc(clock.dueOn) + '.</span>';
  };

  /* --- the appeal ---------------------------------------------------------- *
     A register that only records silence is a complaint. A register that hands
     the reader the appeal, addressed and dated, is a tool. The draft is
     assembled from the record itself, so the dates in it cannot disagree with
     the dates on the card above it.

     Anything the archive does not know renders as a bracketed placeholder. A
     blank is something a reader fills in; a plausible guess is something they
     send to a public authority without noticing. */

  function placeholder(value, label) {
    return value ? String(value) : '[' + label + ']';
  }

  ui.appealDraft = function (rti) {
    var appeal = WGO.model.rtiAppeal(rti);
    if (!appeal.available) { return null; }

    var clock = WGO.model.rtiClock(rti);
    var applicant = (WGO.config && WGO.config.applicant) || {};
    var first = appeal.stage === 'FIRST';
    var body;

    if (first) {
      body = [
        'To,',
        'The First Appellate Authority',
        placeholder(rti.office, 'NAME AND ADDRESS OF THE PUBLIC AUTHORITY'),
        '',
        'Subject: First appeal under section 19(1) of the Right to Information Act, 2005',
        '',
        'Sir/Madam,',
        '',
        '1. I filed an application under the Right to Information Act, 2005 on ' +
          placeholder(rti.filedOn, 'DATE OF APPLICATION') + ', bearing reference ' +
          placeholder(rti.referenceNo, 'REFERENCE NUMBER') + ', with ' +
          placeholder(rti.office, 'THE PUBLIC AUTHORITY') + '.',
        '',
        '2. The application sought: ' + placeholder(rti.subject, 'SUBJECT OF THE APPLICATION') + '.',
        '',
        rti.repliedOn
          ? '3. A reply was received on ' + rti.repliedOn + '. It is appealed against because: ' +
            '[STATE WHY THE REPLY IS INCOMPLETE, EVASIVE OR WRONGLY REFUSED].'
          : '3. The period prescribed by section 7(1) expired on ' + clock.dueOn +
            '. No reply has been received. Under section 7(2) the failure to reply within the ' +
            'prescribed period is deemed a refusal, and this appeal is filed against that deemed refusal.',
        '',
        '4. I request that the information sought be directed to be furnished, and that the ' +
          'reasons for the delay be recorded.',
        '',
        'This appeal is filed within the period prescribed by section 19(1), which in this case ' +
          'runs to ' + placeholder(appeal.deadlineOn, 'APPEAL DEADLINE') + '.',
        '',
        'Yours faithfully,',
        placeholder(applicant.name, 'YOUR NAME'),
        placeholder(applicant.address, 'YOUR ADDRESS'),
        placeholder(applicant.email, 'YOUR EMAIL'),
        'Date: [DATE OF THIS APPEAL]',
        '',
        'Enclosures: copy of the application dated ' + placeholder(rti.filedOn, 'DATE') +
          (rti.repliedOn ? '; copy of the reply dated ' + rti.repliedOn : '; proof of despatch')
      ];
    } else {
      body = [
        'To,',
        'The Registrar',
        '[CENTRAL / STATE INFORMATION COMMISSION]',
        '',
        'Subject: Second appeal under section 19(3) of the Right to Information Act, 2005',
        '',
        'Sir/Madam,',
        '',
        '1. Application under the Right to Information Act, 2005 filed on ' +
          placeholder(rti.filedOn, 'DATE OF APPLICATION') + ' with ' +
          placeholder(rti.office, 'THE PUBLIC AUTHORITY') + ', reference ' +
          placeholder(rti.referenceNo, 'REFERENCE NUMBER') + '.',
        '',
        '2. First appeal under section 19(1) filed on ' +
          placeholder(appeal.appealFiledOn, 'DATE OF FIRST APPEAL') + '.',
        '',
        appeal.faaDecisionDueOn
          ? '3. The First Appellate Authority was to dispose of the appeal by ' +
            appeal.faaDecisionDueOn + ' under section 19(6). ' +
            '[STATE WHETHER A DECISION WAS RECEIVED, AND WHAT IT SAID].'
          : '3. [STATE WHETHER THE FIRST APPELLATE AUTHORITY HAS DECIDED, AND WHAT IT SAID].',
        '',
        '4. The information sought was: ' + placeholder(rti.subject, 'SUBJECT OF THE APPLICATION') + '.',
        '',
        '5. I request that the public authority be directed to furnish the information, and that ' +
          'such further orders be passed as the Commission thinks fit.',
        '',
        'Yours faithfully,',
        placeholder(applicant.name, 'YOUR NAME'),
        placeholder(applicant.address, 'YOUR ADDRESS'),
        placeholder(applicant.email, 'YOUR EMAIL'),
        'Date: [DATE OF THIS APPEAL]',
        '',
        'Enclosures: copies of the application, the first appeal, and any reply or order received.'
      ];
    }

    return body.join('\n');
  };

  /* The appeal block on a register card: the deadline, the draft, and a copy
     button. Collapsed, because most readers are here to read the record. */
  ui.appealBlock = function (rti) {
    var appeal = WGO.model.rtiAppeal(rti);
    if (!appeal.available) { return ''; }
    var draft = ui.appealDraft(rti);
    if (!draft) { return ''; }

    var stageLabel = appeal.stage === 'FIRST' ? 'first appeal' : 'second appeal';
    var deadline = appeal.deadlineOn
      ? (appeal.expired
          ? '<span class="chip chip--disputed">Window closed ' + appeal.daysExpired + ' day' +
            (appeal.daysExpired === 1 ? '' : 's') + ' ago</span> ' +
            '<span class="small">The ' + stageLabel + ' was due by ' + ui.esc(appeal.deadlineOn) +
            '. A late appeal may still be admitted for sufficient cause.</span>'
          : '<span class="chip chip--reported">' + appeal.daysLeft + ' day' +
            (appeal.daysLeft === 1 ? '' : 's') + ' to appeal</span> ' +
            '<span class="small">The ' + stageLabel + ' is due by ' + ui.esc(appeal.deadlineOn) + '.</span>')
      : '<span class="small">The ' + stageLabel + ' deadline cannot be computed from this record.</span>';

    var id = 'appeal-' + rti.id;
    return '<div class="appeal">' +
      '<div class="row" style="gap:0.4rem">' + deadline + '</div>' +
      '<details class="explainer" style="margin-top:0.6rem">' +
        '<summary>Draft the ' + stageLabel + '</summary>' +
        '<div class="explainer__body">' +
          '<p class="small">Assembled from this record. Anything in [brackets] is for you to fill ' +
          'in — the archive does not know it and will not guess. ' +
          ui.esc(appeal.note || '') + '</p>' +
          '<pre class="appeal__draft" id="' + id + '">' + ui.esc(draft) + '</pre>' +
          '<div class="row" style="margin-top:0.6rem">' +
            '<button class="btn btn--small btn--ghost" type="button" data-copy="' + id + '">Copy the draft</button>' +
            '<span class="small">Under ' + ui.esc(appeal.provision || 'the Act') + '. ' +
            'Check the current text before you file.</span>' +
          '</div>' +
        '</div>' +
      '</details>' +
    '</div>';
  };

  /* Copy buttons, bound once for the whole page. */
  ui.bindCopy = function (root) {
    (root || document).addEventListener('click', function (event) {
      var btn = event.target.closest('[data-copy]');
      if (!btn) { return; }
      var node = document.getElementById(btn.getAttribute('data-copy'));
      if (!node) { return; }
      var text = node.textContent;
      var done = function () {
        var was = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = was; }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { select(node); });
      } else {
        select(node);
      }
    });

    function select(node) {
      var range = document.createRange();
      range.selectNodeContents(node);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  ui.rtiStatusChip = function (status) {
    var def = (WGO.RTI_STATES || {})[status];
    if (!def) { return ui.plainChip(status || 'Unknown'); }
    var tone = {
      FILED: 'chip--reported', REPLY_RECEIVED: 'chip--verified',
      NO_RECORD_HELD: 'chip--corroborated', REFUSED: 'chip--disputed',
      TRANSFERRED: 'chip--unverified', LAPSED: 'chip--unknown',
      FIRST_APPEAL: 'chip--reported', SECOND_APPEAL: 'chip--reported',
      WITHDRAWN: 'chip--unverified'
    }[status] || 'chip--plain';
    return '<span class="chip ' + tone + '" title="' + ui.esc(def.definition) + '">' +
      ui.esc(def.label) + '</span>';
  };

  /* Compact RTI summary shown under a question. */
  ui.rtiForQuestion = function (questionId) {
    var rtis = WGO.model.rtisFor(questionId);
    if (!rtis.length) { return ''; }
    return '<div style="margin-top:0.6rem;padding-top:0.55rem;border-top:1px dotted var(--rule)">' +
      rtis.map(function (r) {
        return '<div class="row" style="gap:0.4rem;margin-bottom:0.3rem">' +
          '<a class="chip chip--plain mono" href="rti.html#' + ui.esc(r.id) + '">' + ui.esc(r.id) + '</a>' +
          ui.rtiStatusChip(r.status) + ui.rtiClockLine(r) +
        '</div>';
      }).join('') + '</div>';
  };

  ui.questionCard = function (q) {
    var inc = WGO.model.incident(q.incidentId);
    return '<div class="question" data-state="' + ui.esc(q.state) + '" id="' + ui.esc(q.id) + '">' +
      '<p class="question__q">' + ui.esc(q.text) + '</p>' +
      '<div class="question__meta">' +
        ui.chip(q.state) +
        ui.plainChip(WGO.model.levelLabel(q.level)) +
        (inc ? ui.plainChip(inc.state) : '') +
        ui.idChip(q.id) +
      '</div>' +
      (q.wants && q.wants.length
        ? '<p class="question__note"><strong>What would answer it:</strong> ' + ui.esc(q.wants.join('; ')) + '.</p>'
        : '') +
      ui.evidenceLinks(q.evidenceIds, '') +
      ui.rtiForQuestion(q.id) +
    '</div>';
  };

  WGO.ui = ui;
})(window.WGO = window.WGO || {});
