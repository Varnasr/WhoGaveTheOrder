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

    /* The three-column fact frame — the defining device of the brand.
       Each column reports a real count. Before launch, two of them read zero,
       and that is the honest state of the archive. */
    ui.mount('[data-region="frame"]',
      '<div class="frame__col">' +
        '<p class="kicker">What we know</p>' +
        '<span class="frame__count">' + counts.known + '</span>' +
        '<h3>Established facts</h3>' +
        '<p>Statements supported by primary evidence held in this archive, each one click from its source.</p>' +
        (counts.known === 0
          ? '<p class="small" style="margin-top:0.75rem">Nothing has been established yet. Nothing will appear here until a document does.</p>'
          : '<a class="small" href="evidence.html">Read the evidence &rarr;</a>') +
      '</div>' +
      '<div class="frame__col">' +
        '<p class="kicker">What we don\'t know</p>' +
        '<span class="frame__count">' + counts.open + '</span>' +
        '<h3>Open questions</h3>' +
        '<p>Questions the documentary record does not currently answer. Each one is a specific document somebody could find.</p>' +
        '<a class="small" href="investigations.html">See the open questions &rarr;</a>' +
      '</div>' +
      '<div class="frame__col">' +
        '<p class="kicker">What the government says</p>' +
        '<span class="frame__count">' + counts.responses + '</span>' +
        '<h3>Official responses</h3>' +
        '<p>Statements, explanations and denials on the record — reproduced in full, including the ones that are inconvenient for us.</p>' +
        (counts.responses === 0
          ? '<p class="small" style="margin-top:0.75rem">No official statement has been recorded yet. We will publish them as they are made.</p>'
          : '<a class="small" href="response.html">Compare the accounts &rarr;</a>') +
      '</div>');

    ui.mount('[data-region="incident-cards"]',
      model.incidents.map(ui.incidentCard).join(''));

    ui.mount('[data-region="counts"]',
      '<div><b>' + counts.incidents + '</b><span>Incidents open</span></div>' +
      '<div><b>' + counts.questions + '</b><span>Questions asked</span></div>' +
      '<div><b>' + counts.answered + '</b><span>Answered</span></div>' +
      '<div><b>' + counts.evidence + '</b><span>Evidence items</span></div>' +
      '<div><b>' + counts.orders + '</b><span>Orders located</span></div>');

    /* Evidence-state legend, generated from the taxonomy so the definitions on
       the page can never fall out of step with the labels in the data. */
    ui.mount('[data-region="legend"]',
      Object.keys(WGO.EVIDENCE_STATES).map(function (key) {
        return '<div>' + ui.chip(key) + '<p>' + ui.esc(WGO.EVIDENCE_STATES[key].definition) + '</p></div>';
      }).join(''));

    ui.mount('[data-region="wanted"]',
      WGO.WANTED.map(function (w) { return '<li>' + ui.plainChip(w) + '</li>'; }).join(''));
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
            ? '<em>Precise location not yet established — pin shows the state, not the site.</em><br>'
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
            'A timeline on this site is a chronology of established fact, not a reconstruction. Until dated primary evidence exists — a stamped document, an original recording with intact metadata, a court record — this section stays empty.',
            '<a class="btn btn--small btn--ghost" href="submit.html">Send us dated evidence</a>') + '</div>'));

    /* 02 — WHAT EVIDENCE EXISTS */
    var evidence = model.evidenceFor(incident.id);
    var published = evidence.filter(function (e) { return !e.demo; });
    ui.mount('[data-region="evidence"]',
      (evidence.length
        ? '<div class="grid grid--3">' + evidence.map(ui.evidenceCard).join('') + '</div>'
        : ui.empty('No evidence filed', 'Nothing has been entered into the archive for this incident yet.')) +
      (published.length === 0
        ? '<p class="small" style="margin-top:0.9rem">Published evidence items for this incident: <strong>0</strong>.</p>'
        : ''));

    /* 03 — WHO HAD AUTHORITY */
    ui.mount('[data-region="authority"]', chainHtml(incident.id));

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
            'No written or oral order authorising the use of force at this location has been located. We are not going to guess at what it said, or who signed it. The absence of a located order is itself a finding — and it is the reason this project exists.',
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
            'We have not recorded an official statement on this incident. When one is made — in a press conference, a press note, a court affidavit or a reply in the legislature — it will be reproduced here in full, whether or not it helps our case.'));

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
          : ui.empty('Nothing indexed yet', 'Journalists, lawyers and researchers are working on this too. When we index their work it will appear here, credited to them.');
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
        (office.statutoryBasis && office.statutoryBasis.length
          ? '<ul>' + office.statutoryBasis.map(function (basis) {
              return '<li>' + ui.esc(basis.text) + ' ' + ui.sourceLine(basis.sourceIds) + '</li>';
            }).join('') + '</ul>'
          : '<p class="small">Not mapped.</p>') +

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
      (item.demo ? '<p class="chip chip--sample" style="margin-bottom:0.75rem">Sample record — layout only. This documents nothing.</p>' : '') +
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
                    return (r.demo ? '<p style="margin-bottom:0.5rem">' + ui.plainChip('Sample — documents nothing', 'chip--sample') + '</p>' : '') +
                      '<blockquote class="official">' + ui.esc(r.quote) +
                      '<cite>' + ui.esc(r.respondingOffice) + ' · ' + ui.esc(r.date || 'undated') + '</cite></blockquote>';
                  }).join('')
                : '<p>' + ui.chip('UNKNOWN') + '</p><p style="margin-top:0.5rem">No official response to this claim has been recorded. If one is made, it will appear here in full.</p>') +
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
            'Nothing has been said on the record that we have been able to source. We are watching press notes, court filings and replies in the legislature, and will publish what we find — including anything that contradicts us.'));
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
            'We have not yet indexed anyone else\'s work on these incidents. If you have published something — a report, a legal analysis, footage, a thread of documents — send us the link and we will index it under your name.'));
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
      '<div class="table-scroll"><table class="meta-table"><thead><tr>' +
        '<th scope="col">Document we are looking for</th>' +
        '<th scope="col">Question it would answer</th>' +
        '<th scope="col">Incident</th>' +
      '</tr></thead><tbody>' +
      missing.map(function (m) {
        return '<tr>' +
          '<td>' + ui.esc((m.q.wants && m.q.wants.join(', ')) || '—') + '</td>' +
          '<td><a href="investigation.html?id=' + ui.esc(m.inc ? m.inc.slug : '') + '#' + ui.esc(m.q.id) + '">' +
            ui.esc(m.q.text) + '</a></td>' +
          '<td>' + ui.esc(m.inc ? m.inc.state : '—') + '</td>' +
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
      'Received. Your submission is logged as RECEIVED and is not public. A reviewer will check it ' +
      'against its original source before anything is published. If you gave us permission to ' +
      'contact you, we may write to ask how you obtained it.');

    bindAsyncForm(
      document.getElementById('demand-form'),
      document.getElementById('demand-status'),
      'Recorded. You are asking for one specific document. We will tell you if it is produced, ' +
      'refused, or answered by an office on the record.');

    bindShare();
  };

  function bindShare() {
    var btn = document.getElementById('share-btn');
    if (!btn) { return; }
    btn.addEventListener('click', function () {
      var payload = {
        title: 'Who gave the order?',
        text: 'Police used force against students. Who authorised it? An evidence archive, not a campaign.',
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
            'That did not send. The form posts to Netlify Forms, which only accepts submissions on the deployed site — ' +
            'if you are viewing this locally, that is the reason. Otherwise, email ' + WGO.config.contact.evidence + '.';
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
            'No record matches that. The archive is small — that is the honest reason most searches come back empty today.');
    }

    input.addEventListener('input', draw);

    var initial = ui.param('q');
    if (initial) { input.value = initial; }
    draw();
    input.focus();
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
        : '<div class="callout"><p><strong>No dangling references.</strong> Every claim in the store points at a record that exists, and no published evidence item is missing a source.</p></div>');

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
        warnings.push('VERIFIED with no source attached — the integrity check will flag this.');
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
