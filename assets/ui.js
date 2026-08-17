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
    var def = (WGO.EVIDENCE_STATES[key] || WGO.QUESTION_STATES[key] ||
               WGO.INCIDENT_STATES[key] || { label: key.replace(/_/g, ' '), definition: '' });
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
      return source.url
        ? '<a class="chip chip--plain" href="' + ui.esc(source.url) + '" rel="noopener nofollow" target="_blank">' + label + '</a>'
        : ui.plainChip(source.name);
    }).join(' ');
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
      return ui.explainer('What do these labels mean?',
        '<p>Every statement on this site carries one of six states. A claim cannot appear without ' +
        'one, and moving a claim between them requires a document.</p>' +
        '<div class="chip-legend" style="margin-top:0.75rem">' +
        Object.keys(WGO.EVIDENCE_STATES).map(function (k) {
          return '<div>' + ui.chip(k) + '<p>' + ui.esc(WGO.EVIDENCE_STATES[k].definition) + '</p></div>';
        }).join('') +
        '</div>' +
        '<p style="margin-top:0.75rem"><a href="walkthrough.html#step-3">More on how to read this archive &rarr;</a></p>');
    },

    authority: function () {
      return ui.explainer('Why does every office say "authorisation not established"?',
        '<p>Because two different claims are being kept apart, and only one of them is established.</p>' +
        '<div class="authority-split" style="margin-top:0.75rem">' +
          '<div><h5>' + ui.esc(WGO.AUTHORITY_CLAIMS.HAS_AUTHORITY.label) + '</h5><p>' +
            ui.esc(WGO.AUTHORITY_CLAIMS.HAS_AUTHORITY.definition) + '</p></div>' +
          '<div><h5>' + ui.esc(WGO.AUTHORITY_CLAIMS.EVIDENCED_TO_HAVE_AUTHORISED.label) + '</h5><p>' +
            ui.esc(WGO.AUTHORITY_CLAIMS.EVIDENCED_TO_HAVE_AUTHORISED.definition) + '</p></div>' +
        '</div>' +
        '<p style="margin-top:0.75rem">No individual is named in the chain. A person is added to an ' +
        'office only when a sourced document places them in it at the relevant time. ' +
        '<a href="walkthrough.html#step-4">More &rarr;</a></p>');
    },

    unknown: function () {
      return ui.explainer('Why is so much of this page UNKNOWN?',
        '<p>Because nothing has been established yet, and the site says so rather than filling the ' +
        'space with a plausible reconstruction. A claim without a source does not render as a fact ' +
        'here, including in our own starting data.</p>' +
        '<p style="margin-top:0.5rem">These fields fill in when a document arrives, not before. ' +
        'If you hold one, <a href="submit.html">send it</a>. ' +
        '<a href="walkthrough.html#step-2">More &rarr;</a></p>');
    },

    clock: function () {
      return ui.explainer('How does the reply clock work?',
        '<p>Filing a statutory information request puts a public office on a deadline. The register ' +
        'computes the reply-due date from the filing date every time the page loads, so it cannot go ' +
        'stale.</p>' +
        '<p style="margin-top:0.5rem">The clock stops when an office replies, even if the reply came ' +
        'late. Silence past the statutory period counts as a refusal and opens an appeal, which is ' +
        'why an unanswered request is published rather than hidden. ' +
        '<a href="walkthrough.html#step-7">More &rarr;</a></p>');
    }
  };

  /* --- chrome ------------------------------------------------------------ */

  function navHtml(current) {
    return '<ul>' + WGO.NAV.map(function (item) {
      var active = item.href === current;
      return '<li><a href="' + item.href + '"' + (active ? ' aria-current="page"' : '') + '>' +
        ui.esc(item.label) + '</a></li>';
    }).join('') + '</ul>';
  }

  ui.renderChrome = function () {
    var current = window.location.pathname.split('/').pop() || 'index.html';
    var cfg = WGO.config;

    /* The notice reports the archive's actual state rather than a fixed string.
       An archive that told visitors it was empty after evidence had been
       published would be making exactly the kind of unchecked claim the rest of
       the site refuses to make. */
    var notice = '';
    var counts = WGO.model.counts();
    if (cfg.archiveStage === 'PRE-LAUNCH' || cfg.demoMode) {
      notice =
        '<div class="notice-bar"><div class="shell">' +
          '<strong>' + ui.esc(cfg.archiveStage) + '</strong> — ' +
          (counts.evidence
            ? counts.evidence + ' evidence item' + (counts.evidence === 1 ? '' : 's') +
              ' from ' + counts.sources + ' sources are on the record. ' +
              counts.open + ' questions remain open. '
            : 'no evidence has been published to this archive yet. ') +
          (cfg.demoMode ? 'Records marked <em>sample</em> show the layout only. ' : '') +
          'Every count on this site is a count of actual records.' +
        '</div></div>';
    }

    var header = document.querySelector('[data-chrome="masthead"]');
    if (header) {
      header.innerHTML = notice +
        '<header class="masthead"><div class="shell">' +
          '<div class="masthead__bar">' +
            '<a class="wordmark" href="index.html">Who Gave The Order<span class="dot">.in</span></a>' +
            '<div class="masthead__tools">' +
              '<a class="cta-persistent" href="submit.html">Add a document</a>' +
              '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">Menu</button>' +
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

    var footer = document.querySelector('[data-chrome="footer"]');
    if (footer) {
      footer.innerHTML =
        '<footer class="site-footer"><div class="shell">' +
          '<div class="grid grid--4">' +
            '<div><h4>The investigation</h4><ul>' +
              '<li><a href="investigations.html">Investigations</a></li>' +
              '<li><a href="chain.html">Chain of command</a></li>' +
              '<li><a href="response.html">Government response</a></li>' +
              '<li><a href="others.html">Others are investigating</a></li>' +
            '</ul></div>' +
            '<div><h4>The archive</h4><ul>' +
              '<li><a href="evidence.html">Evidence library</a></li>' +
              '<li><a href="rti.html">RTI register</a></li>' +
              '<li><a href="search.html">Search</a></li>' +
              '<li><a href="admin.html">Editorial console</a></li>' +
            '</ul></div>' +
            '<div><h4>Take part</h4><ul>' +
              '<li><a href="submit.html">Submit evidence</a></li>' +
              '<li><a href="submit.html#missing">What we are missing</a></li>' +
              '<li><a href="about.html#corrections">Report an error</a></li>' +
            '</ul></div>' +
            '<div><h4>How we work</h4><ul>' +
              '<li><a href="walkthrough.html">How to read this archive</a></li>' +
              '<li><a href="about.html#method">Methodology</a></li>' +
              '<li><a href="about.html#standards">Verification standards</a></li>' +
              '<li><a href="about.html#privacy">Privacy and takedown</a></li>' +
              '<li><a href="about.html#who">Who runs this</a></li>' +
            '</ul></div>' +
          '</div>' +
          '<div class="site-footer__legal">' +
            '<p>Where the record does not answer a question, this site says so.</p>' +
            '<p style="margin-top:0.5rem">Record last reviewed ' + ui.esc(WGO.config.lastReviewed) + '. ' +
            'Prototype built in the <a href="../">Experiments</a> sandbox.</p>' +
          '</div>' +
        '</div></footer>';
    }
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
