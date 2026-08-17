/* =============================================================================
   WhoGaveTheOrder.in — page controllers
   -----------------------------------------------------------------------------
   Each page declares itself with <body data-page="..."> and the matching
   controller below fills in the data-driven regions. Static editorial copy
   stays in the HTML where an editor can find and change it.
   ========================================================================== */

(function (WGO) {
  'use strict';

  var ui = WGO.ui;
  var model = WGO.model;
  var pages = {};

  /* ======================================================================= *
     HOME
     ======================================================================= */

  pages.home = function () {
    var counts = model.counts();

    /* The hero states, in plain language, what this site is about — using the
       archive's own records rather than a hand-written summary, so the front
       page cannot drift from what the data actually says. Each line carries the
       state of the record behind it. */
    var lines = model.incidents.map(function (inc) {
      if (inc.dateState === 'UNKNOWN' || !inc.date) { return null; }
      return '<li>' +
        '<span class="hero__fact">Police used force against students at <strong>' +
        ui.esc(inc.place) + '</strong> on <strong>' + ui.esc(inc.date) + '</strong>.</span> ' +
        ui.chip(inc.dateState) +
      '</li>';
    }).filter(Boolean);

    var orders = model.orders.length;

    ui.mount('[data-region="hero-facts"]',
      '<ul class="hero__list">' +
        lines.join('') +
        '<li><span class="hero__fact"><strong>' +
          (orders ? orders + ' order' + (orders === 1 ? '' : 's') + ' located.' : 'No order authorising it has been located.') +
        '</strong></span> ' + ui.chip(orders ? 'VERIFIED' : 'UNKNOWN') + '</li>' +
      '</ul>' +
      (lines.length === 0
        ? '<p class="small" style="margin-top:0.75rem">No incident date has been established yet.</p>'
        : ''));

    ui.mount('[data-region="incident-cards"]',
      model.incidents.map(ui.incidentCard).join(''));

    ui.mount('[data-region="counts"]',
      '<div><b>' + counts.evidence + '</b><span>Evidence items</span></div>' +
      '<div><b>' + counts.sources + '</b><span>Sources</span></div>' +
      '<div><b>' + counts.open + '</b><span>Open questions</span></div>' +
      '<div><b>' + counts.orders + '</b><span>Orders located</span></div>' +
      '<div><b>' + counts.responses + '</b><span>Official responses</span></div>');

    ui.mount('[data-region="wanted"]',
      WGO.WANTED.map(function (w) { return '<li>' + ui.plainChip(w) + '</li>'; }).join(''));

    /* These regions only exist on pages that still carry them; ui.mount is a
       no-op where the node is absent. */
    ui.mount('[data-region="frame"]',
      '<div class="frame__col">' +
        '<p class="kicker">What we know</p>' +
        '<span class="frame__count">' + counts.known + '</span>' +
        '<h3>Established facts</h3>' +
        '<p>Statements supported by primary evidence held in this archive.</p>' +
      '</div>' +
      '<div class="frame__col">' +
        '<p class="kicker">What we don\'t know</p>' +
        '<span class="frame__count">' + counts.open + '</span>' +
        '<h3>Open questions</h3>' +
        '<p>Questions the documentary record does not answer.</p>' +
      '</div>' +
      '<div class="frame__col">' +
        '<p class="kicker">What the government says</p>' +
        '<span class="frame__count">' + counts.responses + '</span>' +
        '<h3>Official responses</h3>' +
        '<p>Statements, explanations and denials on the record, reproduced in full.</p>' +
      '</div>');

    ui.mount('[data-region="legend"]',
      Object.keys(WGO.EVIDENCE_STATES).map(function (key) {
        return '<div>' + ui.chip(key) + '<p>' + ui.esc(WGO.EVIDENCE_STATES[key].definition) + '</p></div>';
      }).join(''));
  };

  /* ======================================================================= *
     WALKTHROUGH — how to read the archive
     ----------------------------------------------------------------------- *
     Explains how to read the record. It does not explain what happened, and
     must not start to: the archive holds documents and claim states, and a
     walkthrough that drifted into narrative would break the site's one rule.
     ======================================================================= */

  var WALKTHROUGH_STEPS = [
    { n: '01', id: 'step-1', title: 'This archive asks one question',
      blurb: 'Who authorised the use of force. Not whether it happened, and not whether it was justified.' },
    { n: '02', id: 'step-2', title: 'Most of it says UNKNOWN, and that is the finding',
      blurb: 'Empty fields are a statement about the archive, not a page that failed to load.' },
    { n: '03', id: 'step-3', title: 'Every statement carries one of six labels',
      blurb: 'The six words that carry the site’s credibility, and what each one requires.' },
    { n: '04', id: 'step-4', title: 'Holding an office is not evidence of giving an order',
      blurb: 'Two claims the chain of command keeps apart, and why nobody is named.' },
    { n: '05', id: 'step-5', title: 'Where every claim comes from',
      blurb: 'Incident to claim to evidence to source. No page may skip a link.' },
    { n: '06', id: 'step-6', title: 'What it does not establish matters as much',
      blurb: 'Every record writes down its own limit. That is how an archive avoids overreaching.' },
    { n: '07', id: 'step-7', title: 'Open questions, and the clock on each one',
      blurb: 'The gap list, and what happens when a public office does not reply.' },
    { n: '08', id: 'step-8', title: 'How to check our work',
      blurb: 'Public integrity checks, a public edit history, and a correction route.' },
    { n: '09', id: 'step-9', title: 'What you can do',
      blurb: 'Send a document, file a request, or add your own published work.' }
  ];

  /* The three audiences, layered over the same nine steps rather than
     duplicated into three explainers that would drift apart. */
  var WALKTHROUGH_LANES = [
    { key: 'visitor',  label: 'Just looking',        steps: ['step-1', 'step-2', 'step-3', 'step-4'] },
    { key: 'holder',   label: 'I might have something', steps: ['step-2', 'step-6', 'step-7', 'step-9'] },
    { key: 'reporter', label: 'Journalist or lawyer', steps: ['step-3', 'step-5', 'step-6', 'step-8'] }
  ];

  pages.walkthrough = function () {
    ui.mount('[data-region="contents"]',
      '<div class="grid grid--3">' + WALKTHROUGH_STEPS.map(function (s) {
        return '<a class="card" href="#' + s.id + '" data-step="' + s.id + '">' +
          '<p class="section-number">' + s.n + '</p>' +
          '<h3 style="font-size:1rem;margin:0.3rem 0 0.3rem">' + ui.esc(s.title) + '</h3>' +
          '<p class="small">' + ui.esc(s.blurb) + '</p>' +
        '</a>';
      }).join('') + '</div>');

    ui.mount('[data-region="states"]',
      Object.keys(WGO.EVIDENCE_STATES).map(function (key) {
        return '<div>' + ui.chip(key) + '<p>' + ui.esc(WGO.EVIDENCE_STATES[key].definition) + '</p></div>';
      }).join(''));

    var lanes = document.querySelector('[data-region="lanes"]');
    if (!lanes) { return; }
    lanes.innerHTML = WALKTHROUGH_LANES.map(function (l) {
      return '<button class="filter-chip" type="button" aria-pressed="false" data-lane="' + l.key + '">' +
        ui.esc(l.label) + '</button>';
    }).join('') +
      '<button class="filter-chip" type="button" aria-pressed="true" data-lane="all">Everything</button>';

    lanes.addEventListener('click', function (event) {
      var btn = event.target.closest('.filter-chip');
      if (!btn) { return; }
      var lane = btn.getAttribute('data-lane');

      Array.prototype.forEach.call(lanes.querySelectorAll('.filter-chip'), function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });

      var picked = lane === 'all'
        ? null
        : (WALKTHROUGH_LANES.filter(function (l) { return l.key === lane; })[0] || {}).steps;

      /* Dim rather than hide: a reader following one lane can still see that
         the other steps exist, and nothing becomes unreachable. */
      Array.prototype.forEach.call(document.querySelectorAll('[data-step]'), function (card) {
        var on = !picked || picked.indexOf(card.getAttribute('data-step')) !== -1;
        card.style.opacity = on ? '' : '0.35';
      });
      WALKTHROUGH_STEPS.forEach(function (s) {
        var el = document.getElementById(s.id);
        if (el) { el.style.opacity = (!picked || picked.indexOf(s.id) !== -1) ? '' : '0.35'; }
      });
    });
  };

  /* ======================================================================= *
     WALKTHROUGH — how to read the archive
     ----------------------------------------------------------------------- *
     Explains how to read the record. It does not explain what happened, and
     must not start to: the archive holds documents and claim states, and a
     walkthrough that drifted into narrative would break the site's one rule.
     ======================================================================= */

  var WALKTHROUGH_STEPS = [
    { n: '01', id: 'step-1', title: 'This archive asks one question',
      blurb: 'Who authorised the use of force. Not whether it happened, and not whether it was justified.' },
    { n: '02', id: 'step-2', title: 'Most of it says UNKNOWN, and that is the finding',
      blurb: 'Empty fields are a statement about the archive, not a page that failed to load.' },
    { n: '03', id: 'step-3', title: 'Every statement carries one of six labels',
      blurb: 'The six words that carry the site’s credibility, and what each one requires.' },
    { n: '04', id: 'step-4', title: 'Holding an office is not evidence of giving an order',
      blurb: 'Two claims the chain of command keeps apart, and why nobody is named.' },
    { n: '05', id: 'step-5', title: 'Where every claim comes from',
      blurb: 'Incident to claim to evidence to source. No page may skip a link.' },
    { n: '06', id: 'step-6', title: 'What it does not establish matters as much',
      blurb: 'Every record writes down its own limit. That is how an archive avoids overreaching.' },
    { n: '07', id: 'step-7', title: 'Open questions, and the clock on each one',
      blurb: 'The gap list, and what happens when a public office does not reply.' },
    { n: '08', id: 'step-8', title: 'How to check our work',
      blurb: 'Public integrity checks, a public edit history, and a correction route.' },
    { n: '09', id: 'step-9', title: 'What you can do',
      blurb: 'Send a document, file a request, or add your own published work.' }
  ];

  /* The three audiences, layered over the same nine steps rather than
     duplicated into three explainers that would drift apart. */
  var WALKTHROUGH_LANES = [
    { key: 'visitor',  label: 'Just looking',        steps: ['step-1', 'step-2', 'step-3', 'step-4'] },
    { key: 'holder',   label: 'I might have something', steps: ['step-2', 'step-6', 'step-7', 'step-9'] },
    { key: 'reporter', label: 'Journalist or lawyer', steps: ['step-3', 'step-5', 'step-6', 'step-8'] }
  ];

  pages.walkthrough = function () {
    ui.mount('[data-region="contents"]',
      '<div class="grid grid--3">' + WALKTHROUGH_STEPS.map(function (s) {
        return '<a class="card" href="#' + s.id + '" data-step="' + s.id + '">' +
          '<p class="section-number">' + s.n + '</p>' +
          '<h3 style="font-size:1rem;margin:0.3rem 0 0.3rem">' + ui.esc(s.title) + '</h3>' +
          '<p class="small">' + ui.esc(s.blurb) + '</p>' +
        '</a>';
      }).join('') + '</div>');

    ui.mount('[data-region="states"]',
      Object.keys(WGO.EVIDENCE_STATES).map(function (key) {
        return '<div>' + ui.chip(key) + '<p>' + ui.esc(WGO.EVIDENCE_STATES[key].definition) + '</p></div>';
      }).join(''));

    var lanes = document.querySelector('[data-region="lanes"]');
    if (!lanes) { return; }
    lanes.innerHTML = WALKTHROUGH_LANES.map(function (l) {
      return '<button class="filter-chip" type="button" aria-pressed="false" data-lane="' + l.key + '">' +
        ui.esc(l.label) + '</button>';
    }).join('') +
      '<button class="filter-chip" type="button" aria-pressed="true" data-lane="all">Everything</button>';

    lanes.addEventListener('click', function (event) {
      var btn = event.target.closest('.filter-chip');
      if (!btn) { return; }
      var lane = btn.getAttribute('data-lane');

      Array.prototype.forEach.call(lanes.querySelectorAll('.filter-chip'), function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });

      var picked = lane === 'all'
        ? null
        : (WALKTHROUGH_LANES.filter(function (l) { return l.key === lane; })[0] || {}).steps;

      /* Dim rather than hide: a reader following one lane can still see that
         the other steps exist, and nothing becomes unreachable. */
      Array.prototype.forEach.call(document.querySelectorAll('[data-step]'), function (card) {
        var on = !picked || picked.indexOf(card.getAttribute('data-step')) !== -1;
        card.style.opacity = on ? '' : '0.35';
      });
      WALKTHROUGH_STEPS.forEach(function (s) {
        var el = document.getElementById(s.id);
        if (el) { el.style.opacity = (!picked || picked.indexOf(s.id) !== -1) ? '' : '0.35'; }
      });
    });
  };

  /* ======================================================================= *
     INVESTIGATIONS INDEX (+ map)
     ======================================================================= */

  pages.investigations = function () {
    ui.mount('[data-region="incident-cards"]',
      model.incidents.map(ui.incidentCard).join(''));

    ui.mount('[data-region="map-legend"]',
      Object.keys(WGO.INCIDENT_STATES).map(function (k) { return ui.chip(k); }).join(' '));

    initMap();
  };

  /* The map plots documented incidents, never allegations. An incident whose
     location has not been established is drawn from a state-level placeholder
     and labelled as such, so the pin is never mistaken for a finding. */
  function initMap() {
    var el = document.getElementById('incident-map');
    if (!el) { return; }

    function fallback() {
      el.classList.add('map-fallback');
      el.style.height = 'auto';
      el.innerHTML = '<h4 class="kicker">Locations</h4><ul class="stack-sm" style="margin-top:0.6rem">' +
        model.incidents.map(function (i) {
          return '<li><a href="investigation.html?id=' + ui.esc(i.slug) + '">' + ui.esc(i.place) + '</a> ' +
            ui.chip(i.incidentState) +
            (i.coordsState === 'UNKNOWN' ? ' ' + ui.chip('UNKNOWN', { prefix: 'Location' }) : '') + '</li>';
        }).join('') + '</ul>';
    }

    if (typeof window.L === 'undefined') { fallback(); return; }

    try {
      var map = window.L.map(el, { scrollWheelZoom: false }).setView([22.5, 79.0], 4);
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 18
      }).addTo(map);

      model.incidents.forEach(function (incident) {
        if (!incident.coords) { return; }
        var marker = window.L.marker(incident.coords, {
          icon: window.L.divIcon({
            className: '',
            html: '<span class="map-pin" data-state="' + ui.esc(incident.incidentState) + '">' +
                  ui.esc(incident.id.slice(-2)) + '</span>',
            iconSize: [26, 26], iconAnchor: [13, 13]
          })
        }).addTo(map);

        marker.bindPopup(
          '<strong>' + ui.esc(incident.title) + '</strong><br>' +
          ui.esc(incident.place) + '<br>' +
          (incident.coordsState === 'UNKNOWN'
            ? '<em>Precise location not established. The pin shows the state, not the site.</em><br>'
            : '') +
          '<a href="investigation.html?id=' + ui.esc(incident.slug) + '">Open the investigation</a>');
      });
    } catch (err) {
      fallback();
    }
  }

  /* ======================================================================= *
     INVESTIGATION PAGE — the heart of the product
     ======================================================================= */

  pages.investigation = function () {
    var incident = model.incident(ui.param('id') || 'jantar-mantar');

    if (!incident) {
      ui.mount('[data-region="investigation"]',
        ui.empty('Not found', 'No investigation matches that reference. Open the investigations index to see what is on the record.'));
      return;
    }

    document.title = incident.title + ' — WhoGaveTheOrder.in';
    ui.mount('[data-region="incident-title"]', ui.esc(incident.title));
    ui.mount('[data-region="incident-meta"]',
      ui.idChip(incident.id) + ' ' + ui.chip(incident.incidentState) + ' ' +
      ui.plainChip(incident.place));

    /* 01 — WHAT HAPPENED */
    var events = model.eventsFor(incident.id);
    ui.mount('[data-region="what-happened"]',
      ui.EXPLAIN.unknown() +
      '<table class="meta-table"><tbody>' +
        row('Date', ui.field(incident.date, incident.dateState, 'The date has not been fixed on the documentary record.')) +
        row('Location', ui.esc(incident.place)) +
        row('What happened', ui.field(incident.summary, incident.summaryState,
              'No chronology has been established. A summary appears here only once dated primary evidence supports it.')) +
        row('Forces involved', ui.list(incident.forcesInvolved, 'Which forces were deployed has not been established.')) +
        row('Crowd-control measures', ui.list(incident.crowdControl, 'What measures were used has not been established.')) +
        row('Reported injuries', ui.field(incident.injuries.note, incident.injuries.state,
              'No injury figure is established. We will not repeat a number we cannot source.')) +
        row('Detentions', ui.field(incident.detentions.note, incident.detentions.state, 'Not established on the record.')) +
        row('Cases registered', ui.field(incident.firs.note, incident.firs.state, 'Not established on the record.')) +
      '</tbody></table>' +
      (events.length
        ? '<ul class="timeline" style="margin-top:1.5rem">' + events.map(function (e) {
            return '<li data-state="' + ui.esc(e.state) + '">' +
              '<span class="timeline__time">' + ui.esc(e.at) + '</span>' +
              '<p class="timeline__title">' + ui.esc(e.title) + '</p>' +
              '<p>' + ui.esc(e.detail) + '</p>' +
              '<div class="row" style="margin-top:0.4rem">' + ui.chip(e.state) + ui.sourceLine(e.sourceIds) + '</div>' +
            '</li>';
          }).join('') + '</ul>'
        : '<div style="margin-top:1.5rem">' + ui.unknownBlock(
            'No verified timeline yet',
            'Nothing dated has been established yet. This section fills in when we hold a stamped document, an original recording with intact metadata, or a court record that fixes a time.',
            '<a class="btn btn--small btn--ghost" href="submit.html">Send us dated evidence</a>') + '</div>'));

    /* 02 — WHAT EVIDENCE EXISTS */
    var evidence = model.evidenceFor(incident.id);
    var published = evidence.filter(function (e) { return !e.demo; });
    ui.mount('[data-region="evidence"]',
      ui.EXPLAIN.states() +
      (evidence.length
        ? '<div class="grid grid--3">' + evidence.map(ui.evidenceCard).join('') + '</div>'
        : ui.empty('No evidence filed', 'Nothing has been entered into the archive for this incident yet.')) +
      (published.length === 0
        ? '<p class="small" style="margin-top:0.9rem">Published evidence items for this incident: <strong>0</strong>.</p>'
        : ''));

    /* 03 — WHO HAD AUTHORITY */
    ui.mount('[data-region="authority"]', ui.EXPLAIN.authority() + chainHtml(incident.id));

    /* 04 — WHAT ORDERS WERE ISSUED */
    var orders = model.ordersFor(incident.id);
    ui.mount('[data-region="orders"]',
      orders.length
        ? orders.map(function (o) {
            return '<div class="card"><div class="row">' + ui.idChip(o.id) + ui.chip(o.state) + '</div>' +
              '<h3>' + ui.esc(o.title) + '</h3>' +
              '<p>' + ui.esc(o.summary) + '</p>' +
              '<div class="card__meta row">' + ui.sourceLine(o.sourceIds) + '</div></div>';
          }).join('')
        : ui.unknownBlock(
            'Order not yet located',
            'No order authorising the use of force at this location has been located. We have not described one, because we have not seen one. If you know where it sits, tell us.',
            '<a class="btn btn--small" href="submit.html">Help find the order</a>'));

    /* 05 — WHAT REMAINS UNKNOWN */
    var questions = model.questionsFor(incident.id);
    var open = questions.filter(function (q) { return q.state === 'UNANSWERED'; });
    ui.mount('[data-region="questions"]',
      '<p class="lede" style="margin-bottom:1.1rem"><strong>' + open.length + ' of ' + questions.length +
        '</strong> questions on this incident are unanswered. Each one names the document that would answer it.</p>' +
      questions.map(ui.questionCard).join(''));

    /* 06 — WHAT THE GOVERNMENT SAYS */
    var responses = model.responsesFor(incident.id);
    ui.mount('[data-region="government"]',
      responses.length
        ? responses.map(responseHtml).join('')
        : ui.empty('No official statement recorded',
            'We have not recorded an official statement on this incident. When one is made, in a press conference, a press note, a court affidavit or a reply in the legislature, we will reproduce it here in full.'));

    /* 07 — HELP FIND THE MISSING EVIDENCE */
    ui.mount('[data-region="missing"]',
      '<ul class="pill-list">' + open.slice(0, 8).map(function (q) {
        return '<li>' + ui.plainChip((q.wants && q.wants[0]) || q.text) + '</li>';
      }).join('') + '</ul>');

    /* Cross-links */
    ui.mount('[data-region="external"]',
      (function () {
        var items = model.externalFor(incident.id);
        return items.length
          ? '<div class="grid grid--2">' + items.map(externalCard).join('') + '</div>'
          : ui.empty('Nothing indexed yet', 'When we index other people\'s work on this incident it will appear here, credited to them.');
      })());
  };

  function row(label, valueHtml) {
    return '<tr><th scope="row">' + ui.esc(label) + '</th><td>' + valueHtml + '</td></tr>';
  }

  /* ======================================================================= *
     CHAIN OF COMMAND — the signature feature
     ======================================================================= */

  function chainHtml(incidentId) {
    var rungs = model.chainFor(incidentId);
    if (!rungs.length) {
      return ui.empty('No chain mapped', 'No offices have been mapped for this incident yet.');
    }

    return rungs.map(function (rung, index) {
      return '<div class="chain__level">' +
        '<p class="chain__rung">' + ui.esc(rung.level.label) + '</p>' +
        rung.offices.map(function (office) { return nodeHtml(office, incidentId); }).join('') +
        (index < rungs.length - 1 ? '<p class="chain__arrow" aria-hidden="true">&darr;</p>' : '') +
      '</div>';
    }).join('');
  }

  function nodeHtml(office, incidentId) {
    var auth = model.authorisationStatus(office, incidentId);
    var bodyId = 'node-' + office.id + (incidentId ? '-' + incidentId : '');

    return '<article class="node" id="' + ui.esc(office.id) + '">' +
      '<button class="node__head" type="button" aria-expanded="false" aria-controls="' + bodyId + '">' +
        '<span>' +
          '<span class="node__title">' + ui.esc(office.title) + '</span>' +
          '<span class="node__sub">' + ui.esc(office.jurisdiction) + '</span>' +
          '<span class="node__chips">' +
            ui.plainChip('Has authority') +
            (auth.established
              ? ui.chip('VERIFIED', { prefix: 'Evidenced to have authorised —' })
              : '<span class="chip chip--unknown" title="' + ui.esc(WGO.AUTHORITY_CLAIMS.EVIDENCED_TO_HAVE_AUTHORISED.definition) + '">Authorisation not established</span>') +
          '</span>' +
        '</span>' +
        '<span class="node__toggle" aria-hidden="true">+</span>' +
      '</button>' +
      '<div class="node__body" id="' + bodyId + '" hidden>' +
        '<div class="authority-split">' +
          '<div>' +
            '<h5>Has authority</h5>' +
            '<p>' + ui.esc(WGO.AUTHORITY_CLAIMS.HAS_AUTHORITY.definition) + '</p>' +
          '</div>' +
          '<div>' +
            '<h5>Evidenced to have authorised this action</h5>' +
            '<p>' + (auth.established
              ? 'Evidence in the archive places this office behind this specific action.'
              : '<strong>Not established.</strong> ' + ui.esc(WGO.AUTHORITY_CLAIMS.EVIDENCED_TO_HAVE_AUTHORISED.definition)) + '</p>' +
          '</div>' +
        '</div>' +

        '<h4>Statutory or administrative responsibility</h4>' +
        (function () {
          /* Imported provisions first, each with the reason it was assigned to
             this office. Assignment is a reading of the provision, not a
             lookup, so the reasoning is shown rather than hidden. */
          var imported = (WGO.importedOfficeBasis || {})[office.id] || [];
          var hand = office.statutoryBasis || [];
          if (!imported.length && !hand.length) {
            return '<p class="small">Not mapped.</p>';
          }
          return '<ul>' +
            imported.map(function (b) {
              return '<li>' + ui.esc(b.text) +
                '<div class="row" style="margin-top:0.35rem">' +
                  ui.chip(b.confidence) + ui.idChip(b.frameworkId) + ui.sourceLine(b.sourceIds) +
                '</div>' +
                '<p class="small" style="margin-top:0.3rem"><em>Why this office:</em> ' +
                  ui.esc(b.why) + '</p>' +
              '</li>';
            }).join('') +
            hand.map(function (basis) {
              return '<li>' + ui.esc(basis.text) + ' ' + ui.sourceLine(basis.sourceIds) + '</li>';
            }).join('') +
          '</ul>';
        })() +

        '<h4>What we know</h4>' +
        (office.whatWeKnow && office.whatWeKnow.length
          ? '<ul>' + office.whatWeKnow.map(function (k) { return '<li>' + ui.esc(k) + '</li>'; }).join('') + '</ul>'
          : '<p>' + ui.chip('UNKNOWN') + ' <span class="small">Nothing about this office\'s conduct in this incident is established on the record.</span></p>') +

        '<h4>What we don\'t know</h4>' +
        (office.whatWeDontKnow && office.whatWeDontKnow.length
          ? '<ul>' + office.whatWeDontKnow.map(function (k) { return '<li>' + ui.esc(k) + '</li>'; }).join('') + '</ul>'
          : '<p class="small">Not yet framed as questions.</p>') +

        '<h4>Supporting evidence</h4>' +
        ui.evidenceLinks(office.evidenceIds, 'No evidence in the archive refers to this office.') +

        '<h4>People</h4>' +
        (function () {
          var people = model.persons.filter(function (p) { return p.officeId === office.id; });
          return people.length
            ? '<ul>' + people.map(function (p) { return '<li>' + ui.esc(p.name) + ' ' + ui.sourceLine(p.sourceIds) + '</li>'; }).join('') + '</ul>'
            : '<p class="small">No individual is named here. A person is added to this office only when a sourced document places them in it at the relevant time. Holding an office is not evidence of having issued an order.</p>';
        })() +
      '</div>' +
    '</article>';
  }

  pages.chain = function () {
    var select = document.getElementById('chain-incident');
    var target = '[data-region="chain"]';

    function draw() {
      var value = select ? select.value : '';
      ui.mount(target, chainHtml(value || null));
      bindNodes();
      var hash = window.location.hash.slice(1);
      if (hash) {
        var node = document.getElementById(hash);
        if (node) {
          var head = node.querySelector('.node__head');
          if (head) { toggleNode(head, true); }
          node.scrollIntoView({ block: 'center' });
        }
      }
    }

    if (select) {
      model.incidents.forEach(function (i) {
        var opt = document.createElement('option');
        opt.value = i.id;
        opt.textContent = i.title;
        select.appendChild(opt);
      });
      select.addEventListener('change', draw);
    }

    ui.mount('[data-region="chain-help"]', ui.EXPLAIN.authority());

    ui.mount('[data-region="claim-distinction"]',
      '<div class="authority-split">' +
        '<div><h5>' + ui.esc(WGO.AUTHORITY_CLAIMS.HAS_AUTHORITY.label) + '</h5><p>' +
          ui.esc(WGO.AUTHORITY_CLAIMS.HAS_AUTHORITY.definition) + '</p></div>' +
        '<div><h5>' + ui.esc(WGO.AUTHORITY_CLAIMS.EVIDENCED_TO_HAVE_AUTHORISED.label) + '</h5><p>' +
          ui.esc(WGO.AUTHORITY_CLAIMS.EVIDENCED_TO_HAVE_AUTHORISED.definition) + '</p></div>' +
      '</div>');

    draw();
  };

  function toggleNode(head, forceOpen) {
    var body = document.getElementById(head.getAttribute('aria-controls'));
    if (!body) { return; }
    var open = forceOpen !== undefined ? forceOpen : body.hasAttribute('hidden');
    if (open) { body.removeAttribute('hidden'); } else { body.setAttribute('hidden', ''); }
    head.setAttribute('aria-expanded', open ? 'true' : 'false');
    var toggle = head.querySelector('.node__toggle');
    if (toggle) { toggle.textContent = open ? '−' : '+'; }
  }

  function bindNodes() {
    Array.prototype.forEach.call(document.querySelectorAll('.node__head'), function (head) {
      head.addEventListener('click', function () { toggleNode(head); });
    });
  }

  /* ======================================================================= *
     EVIDENCE LIBRARY + EVIDENCE RECORD
     ======================================================================= */

  pages.evidence = function () {
    var id = ui.param('id');
    if (id) { return evidenceDetail(id); }

    var listRegion = document.querySelector('[data-region="evidence-list"]');
    var searchInput = document.getElementById('evidence-search');
    var typeSelect = document.getElementById('evidence-type');
    var incidentSelect = document.getElementById('evidence-incident');
    var stateRow = document.querySelector('[data-region="state-filters"]');
    var activeStates = [];

    WGO.EVIDENCE_TYPES.forEach(function (t) {
      var opt = document.createElement('option');
      opt.value = t.key; opt.textContent = t.label;
      typeSelect.appendChild(opt);
    });
    model.incidents.forEach(function (i) {
      var opt = document.createElement('option');
      opt.value = i.id; opt.textContent = i.place;
      incidentSelect.appendChild(opt);
    });

    var stateHelp = document.querySelector('[data-region="state-help"]');
    if (stateHelp) { stateHelp.innerHTML = ui.EXPLAIN.states(); }

    stateRow.innerHTML = Object.keys(WGO.EVIDENCE_STATES).map(function (key) {
      return '<button class="filter-chip" type="button" aria-pressed="false" data-state="' + key + '">' +
        ui.esc(WGO.EVIDENCE_STATES[key].label) + '</button>';
    }).join('');

    stateRow.addEventListener('click', function (event) {
      var btn = event.target.closest('.filter-chip');
      if (!btn) { return; }
      var state = btn.getAttribute('data-state');
      var on = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', on ? 'false' : 'true');
      if (on) { activeStates = activeStates.filter(function (s) { return s !== state; }); }
      else { activeStates.push(state); }
      draw();
    });

    [searchInput, typeSelect, incidentSelect].forEach(function (el) {
      el.addEventListener('input', draw);
    });

    function draw() {
      var q = searchInput.value.trim().toLowerCase();
      var results = model.evidence.filter(function (item) {
        if (typeSelect.value && item.type !== typeSelect.value) { return false; }
        if (incidentSelect.value && item.incidentId !== incidentSelect.value) { return false; }
        if (activeStates.length && activeStates.indexOf(item.verification) === -1) { return false; }
        if (q) {
          var hay = [item.id, item.title, item.origin, item.establishes, model.typeLabel(item.type)]
            .join(' ').toLowerCase();
          if (hay.indexOf(q) === -1) { return false; }
        }
        return true;
      });

      var counts = model.counts();
      ui.mount('[data-region="evidence-count"]',
        '<strong>' + counts.evidence + '</strong> published evidence items in the archive' +
        (counts.sampleCount ? ' · <strong>' + counts.sampleCount + '</strong> layout samples shown' : '') +
        ' · showing <strong>' + results.length + '</strong>');

      listRegion.innerHTML = results.length
        ? results.map(ui.evidenceCard).join('')
        : ui.empty('Nothing matches',
            'No record in the archive matches this filter. If you hold something that would, send it to us.');
    }

    draw();
  };

  function evidenceDetail(id) {
    var item = model.evidenceItem(id);
    var region = '[data-region="evidence-detail"]';
    document.querySelector('[data-region="library"]').hidden = true;
    document.querySelector('[data-region="record"]').hidden = false;

    if (!item) {
      ui.mount(region, ui.empty('No such record',
        'No evidence item carries the reference ' + id + '. Evidence IDs on this site look like WGO-0001.'));
      return;
    }

    document.title = item.id + ' — evidence — WhoGaveTheOrder.in';

    ui.mount(region,
      (item.demo ? '<p class="chip chip--sample" style="margin-bottom:0.75rem">Sample record. Layout only.</p>' : '') +
      '<div class="row">' + ui.idChip(item.id) + ui.chip(item.verification) + ui.plainChip(model.typeLabel(item.type)) + '</div>' +
      '<h1 style="font-size:clamp(1.5rem,5vw,2.25rem);margin:0.7rem 0 1.1rem">' + ui.esc(item.title) + '</h1>' +
      '<table class="meta-table"><tbody>' +
        row('Evidence ID', '<span class="mono">' + ui.esc(item.id) + '</span>') +
        row('Date of the item', ui.esc(item.dateOfItem || 'Unknown')) +
        row('Added to the archive', ui.esc(item.dateAdded || 'Unknown')) +
        row('Evidence type', ui.esc(model.typeLabel(item.type))) +
        row('Incident', (function () {
          var inc = model.incident(item.incidentId);
          return inc ? '<a href="investigation.html?id=' + ui.esc(inc.slug) + '">' + ui.esc(inc.place) + '</a>' : 'Unassigned';
        })()) +
        row('Source', ui.sourceLine(item.sourceIds)) +
        row('How we obtained it', ui.esc(item.origin || 'Not recorded')) +
        row('Verification status', ui.chip(item.verification) + ' <span class="small">' +
            ui.esc((WGO.EVIDENCE_STATES[item.verification] || {}).definition || '') + '</span>') +
      '</tbody></table>' +

      '<div class="grid grid--2" style="margin-top:1.5rem">' +
        '<div class="card"><p class="kicker">What this establishes</p><p style="margin-top:0.4rem">' +
          ui.esc(item.establishes || 'Not recorded.') + '</p></div>' +
        '<div class="card"><p class="kicker">What this does not establish</p><p style="margin-top:0.4rem">' +
          ui.esc(item.doesNotEstablish || 'Not recorded.') + '</p></div>' +
      '</div>' +

      '<h2 style="margin-top:2rem;font-size:1.25rem">Related evidence</h2>' +
      '<div style="margin-top:0.6rem">' + ui.evidenceLinks(item.relatedIds, 'Nothing else in the archive is linked to this record.') + '</div>' +

      '<div class="callout" style="margin-top:2rem">' +
        '<p><strong>Access.</strong> ' + ui.esc(item.accessNote || 'Original made available where it is lawful and safe to do so.') + '</p>' +
        '<p>Spotted a mistake in this record? <a href="about.html#corrections">Report an error</a>. ' +
        'Corrections are logged publicly with the date and what changed.</p>' +
      '</div>');
  }

  /* ======================================================================= *
     GOVERNMENT RESPONSE
     ======================================================================= */

  function responseHtml(r) {
    return '<article class="card' + (r.demo ? ' card--sample' : '') + '" id="' + ui.esc(r.id) + '">' +
      (r.demo ? ui.sampleRibbon() : '') +
      '<div class="row">' + ui.idChip(r.id) + ui.plainChip(r.channel || 'Channel not recorded') + '</div>' +
      '<h3>' + ui.esc(r.respondingOffice) + '</h3>' +
      '<blockquote class="official" style="margin-top:0.7rem">' + ui.esc(r.quote) +
        '<cite>' + ui.esc(r.respondingOffice) + ' · ' + ui.esc(r.date || 'date not recorded') + '</cite></blockquote>' +
      '<div class="card__meta row">' + ui.sourceLine(r.sourceIds) + '</div>' +
    '</article>';
  }

  pages.response = function () {
    ui.mount('[data-region="compare"]',
      model.claims.map(function (claim) {
        var incident = model.incident(claim.incidentId);
        var responses = model.responses.filter(function (r) { return r.claimId === claim.id; });
        var open = model.questionsFor(claim.incidentId)
          .filter(function (q) { return q.state === 'UNANSWERED'; });

        return '<article id="' + ui.esc(claim.id) + '" style="margin-bottom:2rem">' +
          '<div class="row" style="margin-bottom:0.6rem">' + ui.idChip(claim.id) + ui.chip(claim.state) +
            (incident ? '<a class="chip chip--plain" href="investigation.html?id=' + ui.esc(incident.slug) + '">' + ui.esc(incident.place) + '</a>' : '') +
          '</div>' +
          '<h3 style="font-size:1.25rem;margin-bottom:0.8rem">' + ui.esc(claim.text) + '</h3>' +
          '<div class="compare">' +
            '<div class="compare__col"><h4>Our evidence</h4>' +
              ((claim.evidenceIds || []).length
                ? ui.evidenceLinks(claim.evidenceIds)
                : '<p>' + ui.chip('UNVERIFIED') + '</p><p style="margin-top:0.5rem">' + ui.esc(claim.note || '') + '</p>') +
            '</div>' +
            '<div class="compare__col"><h4>Government response</h4>' +
              (responses.length
                ? responses.map(function (r) {
                    return (r.demo ? '<p style="margin-bottom:0.5rem">' + ui.plainChip('Sample record', 'chip--sample') + '</p>' : '') +
                      '<blockquote class="official">' + ui.esc(r.quote) +
                      '<cite>' + ui.esc(r.respondingOffice) + ' · ' + ui.esc(r.date || 'undated') + '</cite></blockquote>';
                  }).join('')
                : '<p>' + ui.chip('UNKNOWN') + '</p><p style="margin-top:0.5rem">No official response to this claim recorded. If one is made, it will appear here in full.</p>') +
            '</div>' +
            '<div class="compare__col"><h4>What remains unanswered</h4>' +
              '<ul class="stack-sm">' + open.slice(0, 5).map(function (q) {
                return '<li><a href="investigation.html?id=' + ui.esc(incident ? incident.slug : '') + '#' + ui.esc(q.id) + '">' +
                  ui.esc(q.text) + '</a></li>';
              }).join('') + '</ul>' +
              (open.length > 5 ? '<p class="small" style="margin-top:0.5rem">and ' + (open.length - 5) + ' more.</p>' : '') +
            '</div>' +
          '</div>' +
        '</article>';
      }).join(''));

    ui.mount('[data-region="responses"]',
      model.responses.length
        ? model.responses.map(responseHtml).join('')
        : ui.empty('No official statement recorded yet',
            'Nothing on the record that we have been able to source. We are watching press notes, court filings and replies in the legislature, and will publish what we find, including anything that contradicts us.'));
  };

  /* ======================================================================= *
     OTHERS ARE INVESTIGATING
     ======================================================================= */

  function externalCard(x) {
    return '<article class="card' + (x.demo ? ' card--sample' : '') + '" id="' + ui.esc(x.id) + '">' +
      (x.demo ? ui.sampleRibbon() : '') +
      '<div class="row">' + ui.plainChip(x.kind) + ui.plainChip(x.date || 'undated') + '</div>' +
      '<h3>' + ui.esc(x.title) + '</h3>' +
      '<p><strong>By ' + ui.esc(x.creator) + '</strong></p>' +
      '<p style="margin-top:0.4rem">' + ui.esc(x.note || '') + '</p>' +
      (x.url ? '<div class="card__meta"><a href="' + ui.esc(x.url) + '" rel="noopener nofollow" target="_blank">Read it at the source &rarr;</a></div>' : '') +
    '</article>';
  }

  pages.others = function () {
    ui.mount('[data-region="external-list"]',
      model.external.length
        ? model.external.map(externalCard).join('')
        : ui.empty('Nothing indexed yet',
            'We have not yet indexed anyone else\'s work on these incidents. If you have published a report, a legal analysis, footage or a set of documents, send us the link and we will index it under your name.'));
  };

  /* ======================================================================= *
     SUBMIT EVIDENCE
     ======================================================================= */

  pages.submit = function () {
    ui.mount('[data-region="wanted"]',
      WGO.WANTED.map(function (w) { return '<li>' + ui.plainChip(w) + '</li>'; }).join(''));

    ui.mount('[data-region="workflow"]', ui.workflow(WGO.SUBMISSION_WORKFLOW));

    ui.mount('[data-region="workflow-detail"]',
      '<table class="meta-table"><tbody>' + WGO.SUBMISSION_WORKFLOW.map(function (s) {
        return row(s.label, ui.esc(s.note));
      }).join('') + '</tbody></table>');

    var typeSelect = document.getElementById('submission-type');
    if (typeSelect) {
      WGO.EVIDENCE_TYPES.forEach(function (t) {
        var opt = document.createElement('option');
        opt.value = t.label; opt.textContent = t.label;
        typeSelect.appendChild(opt);
      });
    }

    var incidentSelect = document.getElementById('submission-incident');
    if (incidentSelect) {
      model.incidents.forEach(function (i) {
        var opt = document.createElement('option');
        opt.value = i.place; opt.textContent = i.place;
        incidentSelect.appendChild(opt);
      });
      var other = document.createElement('option');
      other.value = 'Another incident not listed';
      other.textContent = 'Another incident not listed';
      incidentSelect.appendChild(other);
    }

    /* The open questions, listed as the concrete documents we are missing.
       This is what turns a visitor into an investigator. */
    var missing = model.questions
      .filter(function (q) { return q.state === 'UNANSWERED'; })
      .map(function (q) {
        var inc = model.incident(q.incidentId);
        return { q: q, inc: inc };
      });

    ui.mount('[data-region="missing-list"]',
      ui.EXPLAIN.clock() +
      '<div class="table-scroll"><table class="meta-table"><thead><tr>' +
        '<th scope="col">Document we are looking for</th>' +
        '<th scope="col">Question it would answer</th>' +
        '<th scope="col">Incident</th>' +
        '<th scope="col">Asked for yet?</th>' +
      '</tr></thead><tbody>' +
      missing.map(function (m) {
        var rtis = model.rtisFor(m.q.id);
        return '<tr>' +
          '<td>' + ui.esc((m.q.wants && m.q.wants.join(', ')) || '—') + '</td>' +
          '<td><a href="investigation.html?id=' + ui.esc(m.inc ? m.inc.slug : '') + '#' + ui.esc(m.q.id) + '">' +
            ui.esc(m.q.text) + '</a></td>' +
          '<td>' + ui.esc(m.inc ? m.inc.state : '—') + '</td>' +
          '<td>' + (rtis.length
            ? rtis.map(function (r) {
                return '<a class="chip chip--plain mono" href="rti.html#' + ui.esc(r.id) + '">' +
                  ui.esc(r.id) + '</a> ' + ui.rtiClockLine(r);
              }).join('<br>')
            : '<span class="chip chip--unknown">Not yet requested</span>') + '</td>' +
        '</tr>';
      }).join('') + '</tbody></table></div>');

    /* The public demand is attached to a named open question, never to a mood. */
    var demandSelect = document.getElementById('demand-question');
    if (demandSelect) {
      missing.forEach(function (m) {
        var opt = document.createElement('option');
        opt.value = m.q.id + ' — ' + m.q.text + ' (' + (m.inc ? m.inc.place : 'unassigned') + ')';
        opt.textContent = m.q.text + ' — ' + (m.inc ? m.inc.state : '');
        demandSelect.appendChild(opt);
      });
    }

    bindAsyncForm(
      document.getElementById('evidence-form'),
      document.getElementById('form-status'),
      'Received. Your submission is logged and is not public. A reviewer will check it against its ' +
      'original source before anything is published. If you gave us permission to contact you, we ' +
      'may write to ask how you obtained it.');

    bindAsyncForm(
      document.getElementById('demand-form'),
      document.getElementById('demand-status'),
      'Recorded. We will tell you if that document is produced, refused, or answered by an office ' +
      'on the record.');

    bindShare();
  };

  function bindShare() {
    var btn = document.getElementById('share-btn');
    if (!btn) { return; }
    btn.addEventListener('click', function () {
      var payload = {
        title: 'Who gave the order?',
        text: 'Police used force against students. Who authorised it?',
        url: window.location.origin + window.location.pathname.replace(/submit\.html$/, '')
      };
      if (navigator.share) {
        navigator.share(payload).catch(function () { /* dismissed */ });
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(payload.url).then(function () {
          btn.textContent = 'Link copied';
          setTimeout(function () { btn.textContent = 'Share the investigation'; }, 2000);
        });
      }
    });
  }

  function bindAsyncForm(form, status, okMessage) {
    if (!form || !status) { return; }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var button = form.querySelector('button[type="submit"]');
      var original = button.textContent;
      button.disabled = true;
      button.textContent = 'Sending…';
      status.textContent = '';
      status.removeAttribute('data-tone');

      /* Netlify Forms accepts a multipart body on the page path when the form
         carries file inputs, which this one does. */
      fetch(window.location.pathname, { method: 'POST', body: new FormData(form) })
        .then(function (response) {
          if (!response.ok) { throw new Error('Submission failed: ' + response.status); }
          form.reset();
          status.setAttribute('data-tone', 'ok');
          status.textContent = okMessage;
        })
        .catch(function () {
          status.setAttribute('data-tone', 'error');
          status.textContent =
            'That did not send. The form only accepts submissions on the deployed site, so a local copy will ' +
            'always fail here. Otherwise, email ' + WGO.config.contact.evidence + '.';
        })
        .then(function () {
          button.disabled = false;
          button.textContent = original;
        });
    });
  }

  /* ======================================================================= *
     SEARCH
     ======================================================================= */

  pages.search = function () {
    var input = document.getElementById('site-search');
    var region = document.querySelector('[data-region="search-results"]');
    var summary = document.querySelector('[data-region="search-summary"]');

    function draw() {
      var q = input.value;
      if (q.trim().length < 2) {
        summary.innerHTML = '<span class="small">Search across people, offices, locations, dates, incidents, evidence IDs, documents and keywords. Two characters minimum.</span>';
        region.innerHTML = '';
        return;
      }

      var results = model.search(q);
      var grouped = {};
      results.forEach(function (doc) {
        (grouped[doc.kind] = grouped[doc.kind] || []).push(doc);
      });

      summary.innerHTML = '<strong>' + results.length + '</strong> result' +
        (results.length === 1 ? '' : 's') + ' for <em>' + ui.esc(q) + '</em>';

      region.innerHTML = results.length
        ? Object.keys(grouped).map(function (kind) {
            return '<section style="padding:1.25rem 0;border-top:1px solid var(--rule)">' +
              '<p class="kicker">' + ui.esc(kind) + ' · ' + grouped[kind].length + '</p>' +
              '<div class="stack-sm" style="margin-top:0.7rem">' +
              grouped[kind].map(function (doc) {
                return '<div><a href="' + ui.esc(doc.url) + '">' + ui.esc(doc.title) + '</a> ' +
                  (doc.state ? ui.chip(doc.state) : '') +
                  (doc.demo ? ui.plainChip('sample', 'chip--sample') : '') +
                  '<br><span class="small mono">' + ui.esc(doc.id) + '</span>' +
                  (doc.subtitle ? ' <span class="small">— ' + ui.esc(doc.subtitle) + '</span>' : '') +
                '</div>';
              }).join('') + '</div></section>';
          }).join('')
        : ui.empty('Nothing found',
            'No record matches that. The archive is small, so most searches come back empty today.');
    }

    input.addEventListener('input', draw);

    var initial = ui.param('q');
    if (initial) { input.value = initial; }
    draw();
    input.focus();
  };

  /* ======================================================================= *
     RTI REGISTER
     ======================================================================= */

  function rtiCard(r) {
    var clock = model.rtiClock(r);
    var questions = (r.questionIds || []).map(function (qid) {
      var q = model.index.question[qid];
      var inc = q ? model.incident(q.incidentId) : null;
      return q
        ? '<li><a href="investigation.html?id=' + ui.esc(inc ? inc.slug : '') + '#' + ui.esc(q.id) + '">' +
            ui.esc(q.text) + '</a></li>'
        : '<li class="small">' + ui.esc(qid) + ' — missing question record</li>';
    }).join('');

    return '<article class="card' + (r.demo ? ' card--sample' : '') + '" id="' + ui.esc(r.id) + '">' +
      (r.demo ? ui.sampleRibbon() : '') +
      '<div class="row">' + ui.idChip(r.id) + ui.rtiStatusChip(r.status) + '</div>' +
      '<h3>' + ui.esc(r.subject) + '</h3>' +
      '<p class="small">' + ui.esc(r.office) + '</p>' +
      '<div style="margin-top:0.7rem">' + ui.rtiClockLine(r) + '</div>' +
      (questions ? '<h4 class="kicker" style="margin-top:0.9rem">Questions this would answer</h4>' +
                   '<ul class="stack-sm" style="margin-top:0.35rem;font-size:0.875rem">' + questions + '</ul>' : '') +
      (r.exemptionCited
        ? '<p class="small" style="margin-top:0.6rem"><strong>Exemption cited:</strong> ' + ui.esc(r.exemptionCited) + '</p>'
        : '') +
      (r.outcome ? '<p style="margin-top:0.6rem;font-size:0.875rem">' + ui.esc(r.outcome) + '</p>' : '') +
      '<div class="card__meta row small">' +
        '<span>Ref ' + ui.esc(r.referenceNo || 'not recorded') + '</span>' +
        (clock.known ? '<span aria-hidden="true">·</span><span>' + clock.statutoryDays + '-day period</span>' : '') +
      '</div>' +
      ((r.evidenceIds || []).length
        ? '<div style="margin-top:0.6rem">' + ui.evidenceLinks(r.evidenceIds) + '</div>'
        : '') +
    '</article>';
  }

  pages.rti = function () {
    var counts = model.counts();
    var active = [];

    ui.mount('[data-region="rti-counts"]',
      '<div><b>' + counts.rtis + '</b><span>Applications filed</span></div>' +
      '<div><b>' + counts.rtiOverdue + '</b><span>Replies overdue</span></div>' +
      '<div><b>' + counts.rtiOverdueDaysTotal + '</b><span>Days overdue in total</span></div>' +
      '<div><b>' + counts.open + '</b><span>Questions still open</span></div>');

    ui.mount('[data-region="rti-help"]', ui.EXPLAIN.clock());

    var filters = document.querySelector('[data-region="rti-filters"]');
    filters.innerHTML = Object.keys(WGO.RTI_STATES).map(function (key) {
      return '<button class="filter-chip" type="button" aria-pressed="false" data-state="' + key + '">' +
        ui.esc(WGO.RTI_STATES[key].label) + '</button>';
    }).join('');

    filters.addEventListener('click', function (event) {
      var btn = event.target.closest('.filter-chip');
      if (!btn) { return; }
      var key = btn.getAttribute('data-state');
      var on = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', on ? 'false' : 'true');
      active = on ? active.filter(function (s) { return s !== key; }) : active.concat(key);
      draw();
    });

    function draw() {
      var rows = model.rtis.filter(function (r) {
        return !active.length || active.indexOf(r.status) !== -1;
      }).sort(function (a, b) {
        /* Overdue first, longest overdue at the top: the register should lead
           with whoever has kept us waiting longest. */
        var ca = model.rtiClock(a), cb = model.rtiClock(b);
        return (cb.overdueDays || 0) - (ca.overdueDays || 0) ||
               String(b.filedOn).localeCompare(String(a.filedOn));
      });

      ui.mount('[data-region="rti-count"]',
        '<strong>' + counts.rtis + '</strong> application' + (counts.rtis === 1 ? '' : 's') +
        ' in the register' +
        (counts.rtisShown > counts.rtis
          ? ' · <strong>' + (counts.rtisShown - counts.rtis) + '</strong> layout samples shown'
          : '') +
        ' · showing <strong>' + rows.length + '</strong>');

      ui.mount('[data-region="rti-list"]',
        rows.length
          ? rows.map(rtiCard).join('')
          : ui.empty('No applications match',
              'Nothing in the register matches this filter. The register fills up as applications are filed.'));
    }

    draw();
  };

  /* ======================================================================= *
     EDITORIAL CONSOLE
     ======================================================================= */

  pages.admin = function () {
    var counts = model.counts();

    ui.mount('[data-region="admin-counts"]',
      '<div><b>' + counts.incidents + '</b><span>Incidents</span></div>' +
      '<div><b>' + counts.evidence + '</b><span>Evidence</span></div>' +
      '<div><b>' + counts.sources + '</b><span>Sources</span></div>' +
      '<div><b>' + counts.questions + '</b><span>Questions</span></div>' +
      '<div><b>' + counts.open + '</b><span>Unanswered</span></div>' +
      '<div><b>' + counts.orders + '</b><span>Orders</span></div>' +
      '<div><b>' + counts.responses + '</b><span>Govt responses</span></div>' +
      '<div><b>' + counts.rtis + '</b><span>RTIs filed</span></div>' +
      '<div><b>' + counts.rtiOverdue + '</b><span>RTIs overdue</span></div>' +
      '<div><b>' + counts.persons + '</b><span>Named persons</span></div>');

    var problems = model.integrity();
    ui.mount('[data-region="integrity"]',
      problems.length
        ? '<div class="table-scroll"><table class="meta-table"><thead><tr>' +
            '<th scope="col">Record</th><th scope="col">Problem</th><th scope="col">Reference</th></tr></thead><tbody>' +
          problems.map(function (p) {
            return '<tr><td class="mono">' + ui.esc(p.record) + '</td><td>' + ui.esc(p.message) +
              '</td><td class="mono">' + ui.esc(p.ref) + '</td></tr>';
          }).join('') + '</tbody></table></div>'
        : '<div class="callout"><p><strong>No dangling references.</strong> Every claim in the store points at a record that exists, and every published evidence item has a source.</p></div>');

    ui.mount('[data-region="reviewer-actions"]',
      WGO.REVIEWER_ACTIONS.map(function (a) { return '<li>' + ui.plainChip(a) + '</li>'; }).join(''));

    ui.mount('[data-region="admin-workflow"]', ui.workflow(WGO.SUBMISSION_WORKFLOW));

    bindComposer();
  };

  /* A local record composer. No server, no database: an editor fills the form,
     the console emits a record in the exact shape data/records.js expects, and
     the change lands in the repository through a normal reviewed commit. That
     keeps the audit trail in version control, where it cannot be quietly
     rewritten. */
  function bindComposer() {
    var form = document.getElementById('composer');
    if (!form) { return; }

    var kindSelect = document.getElementById('composer-kind');
    var output = document.getElementById('composer-output');

    var shapes = {
      source: function (d) {
        return { id: d.id || 'SRC-XXXX', name: d.title, kind: d.type || 'PUBLICATION', url: d.url || null };
      },
      /* An RTI is composed on the day it is filed. Status starts at FILED and
         the reply-due date is computed from filedOn, never stored. */
      rti: function (d) {
        return {
          id: d.id || 'RTI-XXXX', incidentId: d.incidentId || null, questionIds: [],
          office: d.origin || '', subject: d.title, filedOn: d.date || null,
          period: 'STANDARD', referenceNo: d.url || '', status: 'FILED',
          repliedOn: null, exemptionCited: null, outcome: null, evidenceIds: []
        };
      },
      evidence: function (d) {
        return {
          id: d.id || 'WGO-XXXX', title: d.title, type: d.type || 'OTHER_DOCUMENT',
          verification: d.state || 'UNVERIFIED', incidentId: d.incidentId || null,
          dateOfItem: d.date || null, dateAdded: d.today, sourceIds: d.sourceIds,
          origin: d.origin || '', establishes: d.establishes || '',
          doesNotEstablish: d.doesNotEstablish || '', relatedIds: [], accessNote: ''
        };
      },
      event: function (d) {
        return {
          id: d.id || 'EVT-XXXX', incidentId: d.incidentId || null, at: d.date || null,
          title: d.title, detail: d.origin || '', state: d.state || 'UNKNOWN', sourceIds: d.sourceIds
        };
      },
      order: function (d) {
        return {
          id: d.id || 'ORD-XXXX', incidentId: d.incidentId || null, title: d.title,
          issuedBy: d.origin || '', summary: d.establishes || '',
          state: d.state || 'UNVERIFIED', sourceIds: d.sourceIds
        };
      },
      response: function (d) {
        return {
          id: d.id || 'GOV-XXXX', incidentId: d.incidentId || null, claimId: null,
          respondingOffice: d.origin || '', date: d.date || null, channel: d.type || '',
          quote: d.title, sourceIds: d.sourceIds, ourEvidence: d.establishes || '',
          stillUnanswered: d.doesNotEstablish || ''
        };
      }
    };

    var incidentSelect = document.getElementById('composer-incident');
    model.incidents.forEach(function (i) {
      var opt = document.createElement('option');
      opt.value = i.id; opt.textContent = i.id + ' — ' + i.place;
      incidentSelect.appendChild(opt);
    });

    var stateSelect = document.getElementById('composer-state');
    Object.keys(WGO.EVIDENCE_STATES).forEach(function (key) {
      var opt = document.createElement('option');
      opt.value = key; opt.textContent = WGO.EVIDENCE_STATES[key].label;
      stateSelect.appendChild(opt);
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var data = {
        id: form.elements['rec-id'].value.trim(),
        title: form.elements['rec-title'].value.trim(),
        type: form.elements['rec-type'].value.trim(),
        state: stateSelect.value,
        incidentId: incidentSelect.value,
        date: form.elements['rec-date'].value.trim(),
        url: form.elements['rec-url'].value.trim(),
        origin: form.elements['rec-origin'].value.trim(),
        establishes: form.elements['rec-establishes'].value.trim(),
        doesNotEstablish: form.elements['rec-not'].value.trim(),
        sourceIds: form.elements['rec-sources'].value.split(',')
          .map(function (s) { return s.trim(); }).filter(Boolean),
        today: new Date().toISOString().slice(0, 10)
      };

      var record = shapes[kindSelect.value](data);
      var warnings = [];
      if (!record.sourceIds || !record.sourceIds.length) {
        warnings.push('No source ID given. This record will render with NO SOURCE ON RECORD until one is attached.');
      }
      if (data.state === 'VERIFIED' && (!record.sourceIds || !record.sourceIds.length)) {
        warnings.push('VERIFIED with no source attached. The integrity check will flag this.');
      }

      output.value =
        (warnings.length ? '/* ' + warnings.join('\n   ') + ' */\n' : '') +
        '/* audit: added ' + data.today + ' by [your name] — commit this change for the trail */\n' +
        JSON.stringify(record, null, 2) + ',';
      output.hidden = false;
      document.getElementById('composer-warnings').innerHTML = warnings.length
        ? warnings.map(function (w) { return '<p class="small">' + ui.esc(w) + '</p>'; }).join('')
        : '<p class="small">Record shape is valid. Paste it into the matching array in <code>data/records.js</code>.</p>';
    });

    var copyBtn = document.getElementById('composer-copy');
    copyBtn.addEventListener('click', function () {
      output.select();
      try { document.execCommand('copy'); copyBtn.textContent = 'Copied'; }
      catch (err) { copyBtn.textContent = 'Select and copy manually'; }
      setTimeout(function () { copyBtn.textContent = 'Copy record'; }, 2000);
    });
  }

  /* ======================================================================= *
     BOOT
     ======================================================================= */

  document.addEventListener('DOMContentLoaded', function () {
    model.build();
    ui.renderChrome();

    var page = document.body.getAttribute('data-page');
    if (pages[page]) { pages[page](); }

    /* Any page may carry chain nodes (the investigation page does). */
    if (page !== 'chain') { bindNodes(); }

    /* Definitions used by the About page, generated from the taxonomy. */
    var glossary = document.querySelector('[data-region="glossary"]');
    if (glossary) {
      glossary.innerHTML = Object.keys(WGO.EVIDENCE_STATES).map(function (key) {
        return '<div>' + ui.chip(key) + '<p>' + ui.esc(WGO.EVIDENCE_STATES[key].definition) + '</p></div>';
      }).join('') + Object.keys(WGO.QUESTION_STATES).map(function (key) {
        return '<div>' + ui.chip(key) + '<p>' + ui.esc(WGO.QUESTION_STATES[key].definition) + '</p></div>';
      }).join('');
    }
  });

})(window.WGO = window.WGO || {});
