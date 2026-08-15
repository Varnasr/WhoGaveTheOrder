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
    return '<span class="sample-ribbon">Sample record — layout only. This documents nothing.</span>';
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

    var notice = '';
    if (cfg.archiveStage === 'PRE-LAUNCH' || cfg.demoMode) {
      notice =
        '<div class="notice-bar"><div class="shell">' +
          '<strong>' + ui.esc(cfg.archiveStage) + '</strong> — ' +
          'no evidence has been published to this archive yet. ' +
          (cfg.demoMode ? 'Records marked <em>sample</em> exist to show the layout and document nothing. ' : '') +
          'Every figure below is a real count of a real archive: at present, most of them are zero.' +
        '</div></div>';
    }

    var header = document.querySelector('[data-chrome="masthead"]');
    if (header) {
      header.innerHTML = notice +
        '<header class="masthead"><div class="shell">' +
          '<div class="masthead__bar">' +
            '<a class="wordmark" href="index.html">Who Gave The Order<span class="dot">.in</span></a>' +
            '<div class="masthead__tools">' +
              '<a class="cta-persistent" href="submit.html">Help find the order</a>' +
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
              '<li><a href="search.html">Search</a></li>' +
              '<li><a href="admin.html">Editorial console</a></li>' +
            '</ul></div>' +
            '<div><h4>Take part</h4><ul>' +
              '<li><a href="submit.html">Submit evidence</a></li>' +
              '<li><a href="submit.html#missing">What we are missing</a></li>' +
              '<li><a href="about.html#corrections">Report an error</a></li>' +
            '</ul></div>' +
            '<div><h4>How we work</h4><ul>' +
              '<li><a href="about.html#method">Methodology</a></li>' +
              '<li><a href="about.html#standards">Verification standards</a></li>' +
              '<li><a href="about.html#privacy">Privacy and takedown</a></li>' +
              '<li><a href="about.html#who">Who runs this</a></li>' +
            '</ul></div>' +
          '</div>' +
          '<div class="site-footer__legal">' +
            '<p>Evidence before assertion. Where the record does not answer a question, this site says so.</p>' +
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
    '</div>';
  };

  WGO.ui = ui;
})(window.WGO = window.WGO || {});
