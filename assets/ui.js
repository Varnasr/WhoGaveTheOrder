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
    if (code === 'en') { return null; }
    var base = (WGO.I18N && WGO.I18N[code]) || null;
    var machine = (WGO.I18N_MACHINE && WGO.I18N_MACHINE[code]) || null;
    if (!base && !machine) { return null; }
    /* The machine translation wins where it exists: it comes from a model built
       for Indian languages, and it is regenerated from the English rather than
       maintained by hand. Anything it has not covered falls back, so the page is
       never half-translated. */
    if (!ui._merged) { ui._merged = deepMerge(base || {}, machine || {}); }
    return ui._merged;
  };

  function deepMerge(base, overlay) {
    var out = {};
    Object.keys(base).forEach(function (k) { out[k] = base[k]; });
    Object.keys(overlay).forEach(function (k) {
      var value = overlay[k];
      out[k] = (value && typeof value === 'object' && !Array.isArray(value))
        ? deepMerge(base[k] || {}, value)
        : value;
    });
    return out;
  }

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
      if (!source) { return ui.plainChip(id + ': missing source record'); }
      var label = ui.esc(source.name);
      /* The retrieval date rides along in the tooltip. It is the difference
         between "this page says" and "this page said, on this date". */
      var title = source.retrievedOn
        ? ' title="' + ui.esc(source.id + ': retrieved ' + source.retrievedOn) + '"'
        : ' title="' + ui.esc(source.id + ': retrieval date not recorded') + '"';
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
        ' Nothing sourced this record. It renders as an absence.</p>';
    }
    return '<ul class="source-detail">' + ids.map(function (id) {
      var s = WGO.model.index.source[id];
      if (!s) {
        return '<li><span class="mono">' + ui.esc(id) + '</span>: ' +
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
        ? '<a href="' + ui.esc(s.archiveUrl) + '" rel="noopener nofollow" target="_blank">archived copy</a>' +
          (s.archivedOn ? ' <span class="small">(' + ui.esc(s.archivedOn) + ')</span>' : '')
        : 'no archived copy');
      if (s.sha256) {
        fixity.push('<span class="mono" title="SHA-256 of the captured file">' +
          ui.esc(String(s.sha256).slice(0, 16)) + '…</span>');
      }

      /* Where this source got it. Shown because a reader counting sources needs
         to know when several of them are reading the same document. */
      var origin = s.originatesFrom
        ? '<div class="small source-detail__origin">Reporting: ' + ui.esc(s.originatesFrom) + '</div>'
        : '';

      return '<li>' +
        '<span class="mono">' + ui.esc(s.id) + '</span> ' + bits.join(' ') +
        origin +
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
        ui.esc(id) + (item ? ': ' + ui.esc(item.title) : ': missing record') + '</a></li>';
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
        '<p style="margin-top:0.75rem"><a href="' + ui.esc(ui.withLang('about.html#standards')) +
          '">What each label requires &rarr;</a></p>');
    },

    unknown: function () {
      return ui.explainer(ui.t('explain.unknownSummary', 'Why is so much of this page UNKNOWN?'),
        '<p>' + ui.esc(ui.t('explain.unknownBody',
          'Because nothing has been established yet, and the site says so and leaves the ' + 'space empty. A claim without a source does not render as a fact ' +
          'here, including in our own starting data.')) + '</p>' +
        '<p style="margin-top:0.5rem">These fields fill in when a document arrives. ' +
        'If you hold one, <a href="submit.html">send it</a>.</p>');
    },

    clock: function () {
      return ui.explainer(ui.t('explain.clockSummary', 'How does the reply clock work?'),
        '<p>' + ui.esc(ui.t('explain.clockBody',
          'Filing a statutory information request puts a public office on a deadline. The log ' +
          'computes the reply-due date from the filing date every time the page loads, so it cannot ' +
          'go stale.')) + '</p>' +
        '<p style="margin-top:0.5rem">' + ui.esc(ui.t('explain.clockBody2',
          'The clock stops when an office replies, even if the reply came late. Silence past the ' +
          'statutory period counts as a refusal and opens an appeal, which is why an unanswered ' + 'request is published.')) + '</p>');
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
          (cfg.archiveStage ? '<strong>' + ui.esc(cfg.archiveStage) + '</strong>: ' : '') +
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
            '<div class="masthead__tools" data-dyslexia-slot>' +
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
            /* Take part comes first, and the two things a reader can do
               without our involvement come first inside it. The footer used
               to open on four investigation links, two of which led to empty
               pages. */
            '<div><h4>' + ui.esc(ui.t('footer.takePart', 'Take part')) + '</h4><ul>' +
              '<li>' + fl('letters.html', 'Send a preservation letter') + '</li>' +
              '<li>' + fl('rti.html', 'File an RTI yourself') + '</li>' +
              '<li>' + fl('submit.html', 'Submit evidence') + '</li>' +
              '<li>' + fl('submit.html#missing', 'What we are missing') + '</li>' +
              '<li>' + fl('about.html#corrections', 'Report an error') + '</li>' +
            '</ul></div>' +
            '<div><h4>' + ui.esc(ui.t('footer.investigation', 'The record')) + '</h4><ul>' +
              '<li>' + fl('investigations.html', 'Investigations') + '</li>' +
              '<li>' + fl('evidence.html', 'Evidence library') + '</li>' +
              '<li>' + fl('others.html', 'Others are investigating') + '</li>' +
            '</ul></div>' +
            '<div><h4>' + ui.esc(ui.t('footer.archive', 'The archive')) + '</h4><ul>' +
              '<li>' + fl('search.html', 'Search') + '</li>' +
              '<li>' + fl('changes.html', 'What changed') + '</li>' +
              '<li>' + fl('rti.html', 'RTI log') + '</li>' +
              '<li>' + fl('data/export/archive.json', 'Download the data') + '</li>' +
            '</ul></div>' +
            '<div><h4>' + ui.esc(ui.t('footer.howWeWork', 'How we work')) + '</h4><ul>' +
              '<li>' + fl('press.html', 'Press') + '</li>' +
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

  /* --- updates ------------------------------------------------------------ *
     The notice board. Rendered from WGO.updates, newest first, with the rule
     that governs what may go in it stated in data/records.js rather than here:
     an update reports what this archive did or what a clock did, never what
     happened at an incident. */

  /* The five-rung "distance to the order" ladder was removed on 2026-09-23
     along with chain.html. It reported that one of four incidents had reached
     rung two and the other three rung zero, which is a progress bar on an
     investigation nobody is conducting. The fact it carried — that a police
     diary entry is reported to refer to an order nobody here has read — is
     stated in plain words on the incident page and on the front page, where
     it does not need a diagram. WGO.model.orderLadder() is kept: the export
     and the record model still use the rung a record has reached. */

  /* An update carrying `correction: true` is this archive reporting an error of
     its own. Those are kept and published, and they are kept OUT of the Latest
     stream, which is a different decision from hiding them.

     The Latest block on the homepage shows three entries. For most of
     September the first of the three was the archive explaining that it had
     framed the State of Bihar's round count as fact, so the first thing a
     reader met was the record apologising to itself. A correction has to be
     findable by someone checking a figure they read here; it does not have to
     be the loudest thing on the front page, and a corrections column is where
     every publication that keeps one puts it. about.html#corrections now
     renders them, under the policy paragraph that has promised since launch
     that changes are logged with a date and a reason. It promised a log and
     there was none.

     `ui.updateList()` therefore excludes them and `ui.correctionList()` is the
     log. changes.html renders both, so the full chronology is still in one
     place for anyone reading the archive rather than the news. */
  function sortedUpdates(wantCorrections) {
    return (WGO.updates || []).filter(function (u) {
      return !!u.correction === !!wantCorrections;
    }).sort(function (a, b) {
      return String(b.date).localeCompare(String(a.date));
    });
  }

  function renderUpdates(updates) {
    return '<ol class="updates">' + updates.map(function (u) {
      var record = u.recordId ? WGO.model.evidenceItem(u.recordId) : null;
      return '<li class="update">' +
        '<p class="update__date mono">' + ui.esc(u.date) + '</p>' +
        '<h3 class="update__title">' + ui.esc(u.title) + '</h3>' +
        '<p class="update__body">' + ui.esc(u.body) + '</p>' +
        (u.recordId
          ? '<p class="update__record">' +
              '<a href="' + ui.esc(ui.withLang('evidence.html?id=' + u.recordId)) + '">' +
              ui.esc(u.recordId) +
              /* Record titles are full claims and run to a couple of hundred
                 characters. The link is a pointer, not the record. */
              (record ? ': ' + ui.esc(record.title.length > 64
                ? record.title.slice(0, 61).replace(/[\s,;:]+$/, '') + '…'
                : record.title) : '') +
              ' &rarr;</a></p>'
          : '') +
      '</li>';
    }).join('') + '</ol>';
  }

  ui.updateList = function (limit) {
    var updates = sortedUpdates(false);
    if (limit) { updates = updates.slice(0, limit); }
    if (!updates.length) {
      return ui.empty('No updates yet',
        'This is where work on the archive is recorded: an application filed, a deadline passed, a document obtained.');
    }
    return renderUpdates(updates);
  };

  ui.correctionList = function () {
    var updates = sortedUpdates(true);
    if (!updates.length) {
      return ui.empty('No corrections logged',
        'Nothing in this archive has yet been found wrong and changed. When something is, it is listed here with its date, its reason and the record it concerns.');
    }
    return renderUpdates(updates);
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
        '<pre class="cite__text" id="' + id + '" tabindex="0" role="region" aria-label="Citation, scrolls horizontally">' + ui.esc(citation) + '</pre>' +
        '<div class="row" style="margin-top:0.6rem">' +
          '<button class="btn btn--small btn--ghost" type="button" data-copy="' + id + '">Copy the citation</button>' +
        '</div>' +
        '<p class="small" style="margin-top:0.6rem">' +
          'Records change state when a document arrives, so the retrieval date is part of the ' + 'citation. What this record said on any earlier date is in ' +
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
          'in: the archive does not know it and will not guess. ' +
          ui.esc(appeal.note || '') + '</p>' +
          '<pre class="appeal__draft" id="' + id + '" tabindex="0" role="region" aria-label="Draft letter, scrolls horizontally">' + ui.esc(draft) + '</pre>' +
          '<div class="row" style="margin-top:0.6rem">' +
            '<button class="btn btn--small btn--ghost" type="button" data-copy="' + id + '">Copy the draft</button>' +
            '<span class="small">Under ' + ui.esc(appeal.provision || 'the Act') + '. ' +
            'Check the current text before you file.</span>' +
          '</div>' +
        '</div>' +
      '</details>' +
    '</div>';
  };

  /* --- Opening a draft in a mail window ------------------------------------
     A draft you can only copy is a draft most people do not send. The archive
     holds the addresses already, so the letter can arrive in a compose window
     with the addressee, the subject and the text filled in, and the person
     sending it only has to read it and press send.

     Two limits decide what each route can actually carry, and both fail
     silently when exceeded, which is the reason for the arithmetic below
     rather than one hopeful link.

     mailto: is handed to the operating system, and on Windows that path runs
     through the shell, which has historically truncated the command at about
     2,048 characters. A letter cut off mid-sentence in somebody's outbox is a
     worse outcome than no button, so the cap here is 1,900 for the whole URL.

     Gmail's web compose takes the body as a query string on a GET, so it is
     bounded by the request line the server will accept, conventionally 8,192
     bytes. The cap here is 7,800, leaving room for the addressee and subject.

     Measured on the four preservation representations (2026-09-23): encoded
     bodies run 3,776 to 4,958 characters before the placeholders are filled,
     so Gmail carries all four whole and no desktop mail client can carry any
     of them. That asymmetry is not hidden: where a route cannot take the
     letter, its link opens the addressee and subject only, the full text goes
     to the clipboard on the same click, and the page says so in words.

     The Gmail half was verified rather than assumed. The longest of the four,
     Siwan, builds a 7,107-character URL; requested on 2026-09-23 it returned
     200 and redirected to the sign-in page with the whole letter intact in the
     `continue` parameter, so the endpoint takes a URL of that length. 7,800 is
     the cap because the next letter added could be longer, and the 8,192-byte
     request line is the convention on the other side of that. */

  var MAILTO_MAX = 1900;
  var GMAIL_MAX = 7800;
  var GMAIL_BASE = 'https://mail.google.com/mail/?view=cm&fs=1';

  function q(value) { return encodeURIComponent(value == null ? '' : String(value)); }

  ui.mailtoUrl = function (msg) {
    var parts = ['subject=' + q(msg.subject), 'body=' + q(msg.body)];
    if (msg.cc) { parts.unshift('cc=' + q(msg.cc)); }
    return 'mailto:' + q(msg.to) + '?' + parts.join('&');
  };

  ui.gmailUrl = function (msg) {
    var url = GMAIL_BASE + '&to=' + q(msg.to) + '&su=' + q(msg.subject);
    if (msg.cc) { url += '&cc=' + q(msg.cc); }
    return url + '&body=' + q(msg.body);
  };

  /* The note that goes in the body when a route cannot carry the letter. The
     person has the full text on their clipboard at that point; this tells them
     so inside the window they are looking at, rather than on the page behind
     it. */
  var PASTE_NOTE = 'The letter is on your clipboard. Paste it here (Ctrl+V, or Cmd+V on a Mac), ' +
    'read it through, and send.';

  /* Returns, for one message, what each route can do with it. */
  ui.composeRoutes = function (msg) {
    var full = ui.gmailUrl(msg);
    var gmailFits = full.length <= GMAIL_MAX;
    var stub = { to: msg.to, cc: msg.cc, subject: msg.subject, body: PASTE_NOTE };
    var mailto = ui.mailtoUrl(msg);
    var mailtoFits = mailto.length <= MAILTO_MAX;
    return {
      gmail:  { href: gmailFits ? full : ui.gmailUrl(stub),   whole: gmailFits,  length: full.length },
      mailto: { href: mailtoFits ? mailto : ui.mailtoUrl(stub), whole: mailtoFits, length: mailto.length }
    };
  };

  /* The row of actions under a draft.

     The links carry their href before anyone clicks, so opening one is an
     ordinary navigation: no window.open after an awaited promise, which a
     popup blocker treats as unsolicited and which is how this kind of button
     comes to do nothing on one browser and work on every other. The clipboard
     write rides along on the same click and is never waited for.

     `blanks` is the count of unfilled [placeholders] left in the body. The
     preservation letters pass blockUnfilled, because their blanks are the
     sender's own name and address and a letter posted with "[sender name]" in
     it is worse than no letter. The RTI appeal drafts do not, because their
     blanks are sentences only the appellant can write, and finishing them in
     the compose window is the point. */
  ui.composeRow = function (msg, opts) {
    opts = opts || {};
    var id = opts.id || ('compose-' + Math.random().toString(36).slice(2));
    var blanks = (String(msg.body).match(/\[[^\]\n]+\]/g) || []).length;
    var routes = ui.composeRoutes(msg);
    var blocked = opts.blockUnfilled && blanks > 0;

    var note;
    if (blocked) {
      note = blanks + ' blank' + (blanks === 1 ? '' : 's') + ' still to fill in. ' +
        'Complete the form above and these buttons turn on.';
    } else {
      note = routes.gmail.whole
        ? 'Gmail opens with the whole letter in it. '
        : 'The letter is too long for a link, so Gmail opens addressed and the text is copied for you to paste. ';
      note += routes.mailto.whole
        ? 'So does your own mail app.'
        : 'A desktop mail app cannot take a letter this long in a link at all, so that button opens ' +
          'addressed and empty, with the text copied.';
      if (blanks > 0) {
        note = blanks + ' blank' + (blanks === 1 ? '' : 's') + ' are left for you to write in the ' +
          'compose window. ' + note;
      }
    }

    var dis = blocked ? ' aria-disabled="true" data-disabled="1"' : '';
    var copyOnClick = routes.gmail.whole ? '' : ' data-copy="' + ui.esc(id) + '"';

    return '<pre class="appeal__draft" id="' + ui.esc(id) + '" tabindex="0" role="region" aria-label="Draft letter, scrolls horizontally">' + ui.esc(msg.body) + '</pre>' +
      '<div class="row" style="margin-top:0.6rem;gap:0.4rem;flex-wrap:wrap">' +
        '<a class="btn btn--small" href="' + ui.esc(routes.gmail.href) + '" target="_blank" ' +
          'rel="noopener"' + dis + copyOnClick + '>Open in Gmail</a>' +
        '<a class="btn btn--small btn--ghost" href="' + ui.esc(routes.mailto.href) + '"' + dis +
          (routes.mailto.whole ? '' : ' data-copy="' + ui.esc(id) + '"') + '>Open in your mail app</a>' +
        '<button class="btn btn--small btn--ghost" type="button" data-copy="' + ui.esc(id) + '">Copy the letter</button>' +
      '</div>' +
      '<p class="small" style="margin-top:0.5rem">' + ui.esc(note) + '</p>';
  };

  /* Copy buttons, bound once for the whole page. */
  ui.bindCopy = function (root) {
    (root || document).addEventListener('click', function (event) {
      var btn = event.target.closest('[data-copy],[data-disabled]');
      if (!btn) { return; }
      /* A compose link with blanks left in it opens nothing. The note under the
         row says why; silently navigating would send an unfinished letter. */
      if (btn.hasAttribute('data-disabled')) { event.preventDefault(); return; }
      if (!btn.hasAttribute('data-copy')) { return; }
      var node = document.getElementById(btn.getAttribute('data-copy'));
      if (!node) { return; }
      var text = node.textContent;
      var done = function () {
        if (btn.tagName === 'A') { return; }
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
