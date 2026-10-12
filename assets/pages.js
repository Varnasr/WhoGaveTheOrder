/* =============================================================================
   WhoGaveTheOrder.in: page controllers
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

    /* Three numbers, at the top, in the order a stranger cares about them.
       The third one is the point of the project and it is zero. */
    /* The fourth number is the answer to a fair objection: with an admission of
       firearms, an admission of surveillance and a diary entry pointing at a
       DCP, a lone zero reads as though nothing has been established. Offices
       with authority is also a real number, and it is not zero. The two sit
       side by side precisely because they must never be added together. */
    ui.mount('[data-region="hero-stats"]',
      '<div class="stat"><b>' + counts.evidence + '</b><span>documents on file</span></div>' +
      '<div class="stat"><b>' + counts.open + '</b><span>questions unanswered</span></div>' +
      '<div class="stat"><b>' + counts.offices + '</b><span>offices with the authority</span></div>' +
      '<div class="stat stat--zero"><b>' + counts.orders + '</b><span>shown to have used it</span></div>');

    /* What is established, read off the records rather than written by hand, so
       the front page cannot drift from the data. */
    /* The verb follows what the record establishes about the incident, taken
       from its `kind`. This line used to say "Police used force against
       students" for every incident, which put a sentence about a lathi charge
       over Mumbai and Kochi, where the record holds cases registered and no
       force alleged. The chip beside it states the confidence in the date and
       not in the sentence, so the sentence has to be the right one. A record
       with no kind falls back to the neutral wording rather than to force. */
    var HERO_VERB = {
      FORCE:       'Police used force against students at',
      CASES:       'Cases were registered against protesters at',
      DETENTIONS:  'Protesters were detained at'
    };
    /* The five most recent only. The archive runs from 2016 and a hero that
       listed every incident would be a page of its own. */
    var recent = model.incidents.slice().sort(function (a, b) {
      return String(b.isoDate || '').localeCompare(String(a.isoDate || ''));
    });
    var earlierCount = Math.max(0, recent.length - 5);
    var lines = recent.slice(0, 5).map(function (inc) {
      if (inc.dateState === 'UNKNOWN' || !inc.date) { return null; }
      return '<li>' +
        '<span class="hero__fact">' + (HERO_VERB[inc.kind] || 'An incident is on the record at') +
        ' <strong>' + ui.esc(inc.place) + '</strong> on <strong>' + ui.esc(inc.date) + '</strong>.</span> ' +
        ui.chip(inc.dateState) +
      '</li>';
    }).filter(Boolean);

    var held = model.incidents.filter(function (inc) {
      return inc.dateState === 'UNKNOWN' || !inc.date;
    });

    ui.mount('[data-region="hero-facts"]',
      '<ul class="hero__list">' + lines.join('') +
        (earlierCount ? '<li><span class="hero__fact">' + earlierCount +
          ' earlier incidents are on the record, back to 2014.</span></li>' : '') +
        '<li><span class="hero__fact"><strong>No order authorising it has been found.</strong></span> ' +
          ui.chip('UNKNOWN') + '</li>' +
      '</ul>' +
      (held.length
        ? '<p class="small" style="margin-top:0.85rem">' + held.length +
          ' further incident' + (held.length === 1 ? ' is' : 's are') +
          ' held open with no date established: ' +
          held.map(function (i) { return ui.esc(i.state); }).join(', ') + '.</p>'
        : ''));

    /* The notice board, newest first. Three on the front page; the rest are on
       the change log, which is the full record. */
    ui.mount('[data-region="updates"]', ui.updateList(3));

    ui.mount('[data-region="wanted"]',
      WGO.WANTED.map(function (w) { return '<li>' + ui.plainChip(w) + '</li>'; }).join(''));

    /* A plainly-named FAQ. These are the five things a stranger actually asks,
       answered in one short paragraph each. */
    ui.mount('[data-region="faq"]', [
      ['Why does so much of this say UNKNOWN?',
       'Because it has not been established, and the alternative is guessing. A claim without a ' +
       'source is not shown as a fact. The blank spaces are the work still to do.'],
      ['Is this a campaign?',
       'No. There is no petition and no ask beyond documents. Official statements are published ' +
       'in full, including the ones that cut against the project.'],
      ['Are you accusing anyone?',
       'No. The chain of command shows which offices are empowered to authorise force. That is a ' +
       'statement about the law. Whether a particular office did authorise it needs a document, ' +
       'and until one exists every node reads <em>not established</em>. Nobody is named in the ' +
       'chain. People are named in records only where a public document names them.'],
      ['What happens to something I send?',
       'It is logged privately and checked against its original source before anything is published. ' +
       'Nothing goes live automatically. Your name is never published unless you tick the box asking ' +
       'for it, and your contact details never are.'],
      ['Can I ask for a document myself?',
       'Yes, and it helps more than anything else. Any citizen can request a record from a public ' +
       'office. Pick a question off the gap list, file it, and send us the reference number. The ' +
       'clock then runs in public.'],
      ['Who runs this?',
       'Three people, unfunded, on their own time: Dr Varna Sri Raman, Syed Khalid Saifullah and ' +
       'Pallavi Nayak. Their descriptions are on the about page.']
    ].map(function (row) {
      return ui.explainer(row[0], '<p>' + row[1] + '</p>');
    }).join(''));
  };

  /* ======================================================================= *
     INVESTIGATIONS INDEX (+ map)
     ======================================================================= */

  pages.investigations = function () {
    /* Newest first. The list now runs from 2016 to 2026 and the order of the
       records file is the order they were opened, which says nothing about
       when they happened. */
    ui.mount('[data-region="incident-cards"]',
      model.incidents.slice().sort(function (a, b) {
        return String(b.isoDate || '').localeCompare(String(a.isoDate || ''));
      }).map(ui.incidentCard).join(''));

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
            ? '<em>Precise location not established. The pin shows the state only.</em><br>'
            : '') +
          '<a href="investigation.html?id=' + ui.esc(incident.slug) + '">Open the investigation</a>');
      });
    } catch (err) {
      fallback();
    }
  }

  /* ======================================================================= *
     INVESTIGATION PAGE: the heart of the product
     ======================================================================= */

  pages.investigation = function () {
    var incident = model.incident(ui.param('id') || 'jantar-mantar');

    if (!incident) {
      ui.mount('[data-region="investigation"]',
        ui.empty('Not found', 'No investigation matches that reference. Open the investigations index to see what is on the record.'));
      return;
    }

    document.title = incident.title + ' | WhoGaveTheOrder.in';
    ui.mount('[data-region="incident-title"]', ui.esc(incident.title));
    ui.mount('[data-region="incident-meta"]',
      ui.idChip(incident.id) + ' ' + ui.chip(incident.incidentState) + ' ' +
      ui.plainChip(incident.place));

    /* 01: WHAT HAPPENED */
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

    /* 02: WHAT EVIDENCE EXISTS */
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

    /* 03: HAS ANYONE SAID WHO AUTHORISED THIS?
       One section where there used to be two, plus a chain-of-command map on
       its own page. The map listed the eight offices empowered to authorise
       force anywhere in India and reported "authorisation not established" on
       every node of every incident, which is a true sentence dressed as a
       finding. What a reader needs here is shorter and harder: no order has
       been found, this is the office that would hold the record, and here is
       the letter asking that office to keep it. */
    ui.mount('[data-region="authorisation"]', authorisationHtml(incident));

    /* 04: WHAT REMAINS UNKNOWN */
    var questions = model.questionsFor(incident.id);
    var open = questions.filter(function (q) { return q.state === 'UNANSWERED'; });
    ui.mount('[data-region="questions"]',
      '<p class="lede" style="margin-bottom:1.1rem"><strong>' + open.length + ' of ' + questions.length +
        '</strong> questions on this incident are unanswered. Each one names the document that would answer it.</p>' +
      questions.map(ui.questionCard).join(''));

    /* 05: HELP FIND THE MISSING EVIDENCE */
    // The container in investigation.html is already the <ul>, as it is for
    // [data-region="wanted"]. Wrapping the items in a second <ul> put a list
    // inside a list, which is invalid and which a screen reader announces as
    // a list of one item containing a list.
    ui.mount('[data-region="missing"]',
      open.slice(0, 8).map(function (q) {
        return '<li>' + ui.plainChip((q.wants && q.wants[0]) || q.text) + '</li>';
      }).join(''));

    /* Cross-links */
    ui.mount('[data-region="external"]',
      (function () {
        var items = model.externalFor(incident.id);
        return items.length
          ? '<div class="grid grid--2">' + items.map(externalCard).join('') + '</div>'
          : ui.empty('Nothing indexed yet', 'When we index other people\'s work on this incident it will appear here, credited to them.');
      })() +
      '<div style="margin-top:1.5rem">' + ui.citeBlock({
        id: incident.id, title: incident.title, state: incident.incidentState,
        path: 'investigation.html?id=' + incident.slug
      }) + '</div>');

    ui.bindCopy(document);
  };

  function row(label, valueHtml) {
    return '<tr><th scope="row">' + ui.esc(label) + '</th><td>' + valueHtml + '</td></tr>';
  }

  /* ======================================================================= *
     WHO AUTHORISED IT: the orders we hold, and the letter where we hold none
     ----------------------------------------------------------------------- *
     This replaced chain.html and its expandable eight-office map on
     2026-09-23. The map was not wrong. It was a diagram of the statutory
     structure: Union Home, State Home, DGP, Commissioner, District
     Magistrate, SP, the officer commanding on site, the units deployed:
     rendered identically for every incident because nothing in this archive
     distinguishes them. Every node reported "authorisation not established",
     which was honest and, repeated eight times on a page in the primary
     navigation, read as an investigation rather than as its absence.

     What is kept is the part that is specific: the office whose records would
     answer the question for *this* incident, whether any order has been
     found, and the preservation request to that office, which is the only
     thing a reader can do about it today.
     ======================================================================= */

  function lettersFor(incident) {
    var ids = (WGO.LETTERS_FOR_INCIDENT || {})[incident.id] || [];
    return ids.map(function (id) {
      return (WGO.letters || []).filter(function (l) { return l.id === id; })[0];
    }).filter(Boolean);
  }

  var COUNT_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six'];

  function joinList(items) {
    if (items.length <= 1) { return items[0] || ''; }
    return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
  }

  function authorisationHtml(incident) {
    var orders = model.ordersFor(incident.id);
    var letters = lettersFor(incident);
    var out = '';

    if (orders.length) {
      out += orders.map(function (o) {
        return '<div class="card"><div class="row">' + ui.idChip(o.id) + ui.chip(o.state) + '</div>' +
          '<h3>' + ui.esc(o.title) + '</h3>' +
          '<p>' + ui.esc(o.summary) + '</p>' +
          '<div class="card__meta row">' + ui.sourceLine(o.sourceIds) + '</div></div>';
      }).join('');
    } else {
      out += ui.unknownBlock(
        'No order found',
        'No order authorising the use of force at this location is held by this archive. We have ' +
        'not described one, because we have not seen one. Holding the office that could have ' +
        'given it is not evidence of having given it, and this site does not treat it as any.',
        '<a class="btn btn--small" href="' + ui.esc(ui.withLang('submit.html')) + '">Help find the order</a>');
    }

    /* An office is named here only where a drafted letter names one, because
       the letters carry an addressee that was checked against the district's
       own contact page. Reading the office out of the taxonomy instead put
       "Superintendent of Police / Deputy Commissioner of Police (District)" on
       the Delhi incident: a correct taxonomy entry and a sentence nobody
       writes. Where there is no letter the paragraph says what the records are
       and what happens to them, and stops. */
    out += '<div class="prose" style="margin-top:1.5rem"><p>' +
      'The records that would answer this question are the station diary, the control room and ' +
      'wireless logs, any deployment or dispersal order, and any body-worn or CCTV footage. ' +
      (letters.length
        ? 'They sit with <strong>' + joinList(letters.map(function (l) {
            /* The addressee is stored as a letter opens it, "To, The
               Superintendent of Police, Siwan". Mid-sentence that capital
               reads as a typo. */
            return ui.esc(l.addressee.replace(/^The /, 'the '));
          })) + '</strong>. '
        : 'They sit with the police office that held the ground that day. ') +
      'Each is kept on a retention schedule, which means it is erased on a timetable whether or ' +
      'not anyone is looking for it.</p></div>';

    /* The action. A preservation request does one thing: after it is received,
       destroying the records it identifies becomes a documentable fact with a
       date on it. Its whole value is that it arrives before the schedule does,
       which is why the button belongs here rather than three clicks away. */
    if (letters.length) {
      out += '<div class="gap-block" style="margin-top:1.5rem">' +
        '<p class="kicker">Two minutes</p>' +
        '<h3>Ask ' + (letters.length > 1 ? 'these offices' : 'this office') + ' to keep the records.</h3>' +
        '<p>Your name, address and contact go in once. The letter then opens in your mail ' +
        'window, addressed and written, and you press send. ' +
        (letters.length > 1
          ? 'There are ' + (COUNT_WORDS[letters.length] || letters.length) + ', one per district.'
          : '') + '</p>' +
        '<p style="margin-top:0.9rem">' + letters.map(function (l) {
          return '<a class="btn btn--small" style="margin:0 0.5rem 0.5rem 0" href="' +
            ui.esc(ui.withLang('letters.html')) + '#' + ui.esc(l.id) + '">' +
            'Write to ' + ui.esc(l.district) + ' &rarr;</a>';
        }).join(' ') + '</p>' +
        '<p class="small">A representation is not a statutory instrument and compels nothing. ' +
        'What it does is put a date on the notice.</p>' +
        '</div>';
    } else {
      out += '<div class="prose" style="margin-top:1.5rem"><p class="small">' +
        'No preservation request has been drafted for this incident. The four that exist cover ' +
        'Patna, Katihar, Munger and Siwan, because those are the locations this archive can date ' +
        'and place from a source. Writing one on a thinner record would be asking an office to ' +
        'preserve we-are-not-sure-what. <a href="' + ui.esc(ui.withLang('letters.html')) +
        '">See the four that exist &rarr;</a></p></div>';
    }

    return out;
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

    document.title = item.id + ': evidence | WhoGaveTheOrder.in';

    ui.mount(region,
      (item.demo ? '<p class="chip chip--sample" style="margin-bottom:0.75rem">Sample record. Layout only.</p>' : '') +
      '<div class="row">' + ui.idChip(item.id) + ui.chip(item.verification) + ui.plainChip(model.typeLabel(item.type)) + '</div>' +
      '<h1 class="record__title">' + ui.esc(item.title) + '</h1>' +
      '<table class="meta-table"><tbody>' +
        row('Evidence ID', '<span class="mono">' + ui.esc(item.id) + '</span>') +
        row('Date of the item', ui.esc(item.dateOfItem || 'Unknown')) +
        row('Added to the archive', ui.esc(item.dateAdded || 'Unknown')) +
        row('Evidence type', ui.esc(model.typeLabel(item.type))) +
        row('Incident', (function () {
          var inc = model.incident(item.incidentId);
          return inc ? '<a href="investigation.html?id=' + ui.esc(inc.slug) + '">' + ui.esc(inc.place) + '</a>' : 'Unassigned';
        })()) +
        row('Source', ui.sourceDetail(item.sourceIds)) +
        row('How we obtained it', ui.esc(item.origin || 'Not recorded')) +
        row('Verification status', ui.chip(item.verification) + ' <span class="small">' +
            ui.esc((WGO.EVIDENCE_STATES[item.verification] || {}).definition || '') + '</span>') +
      '</tbody></table>' +

      /* The two lines that are the whole point of an evidence record. They were
         two identical grey cards among several, so the page's most important
         claim carried no more weight than its metadata. They are now a matched
         pair, marked and set apart: what it proves, and: the harder half:
         what it does not. */
      '<div class="finding" style="margin-top:1.75rem">' +
        '<div class="finding__half finding__half--does">' +
          '<p class="kicker">What this establishes</p>' +
          '<p class="finding__text">' + ui.esc(item.establishes || 'Not recorded.') + '</p>' +
        '</div>' +
        '<div class="finding__half finding__half--not">' +
          '<p class="kicker">What this does not establish</p>' +
          '<p class="finding__text">' + ui.esc(item.doesNotEstablish || 'Not recorded.') + '</p>' +
        '</div>' +
      '</div>' +

      '<h2 class="record__section">Related evidence</h2>' +
      '<div style="margin-top:0.6rem">' + ui.evidenceLinks(item.relatedIds, 'Nothing else in the archive is linked to this record.') + '</div>' +

      '<div class="callout" style="margin-top:2rem">' +
        '<p><strong>Access.</strong> ' + ui.esc(item.accessNote || 'Original made available where it is lawful and safe to do so.') + '</p>' +
        '<p>Spotted a mistake in this record? <a href="about.html#corrections">Report an error</a>. ' +
        'Corrections are logged publicly with the date and what changed.</p>' +
      '</div>' +

      '<div style="margin-top:1.5rem">' + ui.citeBlock({
        id: item.id, title: item.title, state: item.verification,
        path: 'evidence.html?id=' + item.id
      }) + '</div>');

    ui.bindCopy(document);
  }

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
          '<td>' + ui.esc((m.q.wants && m.q.wants.join(', ')) || 'none') + '</td>' +
          '<td><a href="investigation.html?id=' + ui.esc(m.inc ? m.inc.slug : '') + '#' + ui.esc(m.q.id) + '">' +
            ui.esc(m.q.text) + '</a></td>' +
          '<td>' + ui.esc(m.inc ? m.inc.state : 'none') + '</td>' +
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
        opt.value = m.q.id + ': ' + m.q.text + ' (' + (m.inc ? m.inc.place : 'unassigned') + ')';
        opt.textContent = m.q.text + ': ' + (m.inc ? m.inc.state : '');
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
                  (doc.subtitle ? ' <span class="small">(' + ui.esc(doc.subtitle) + ')</span>' : '') +
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
        : '<li class="small">' + ui.esc(qid) + ': missing question record</li>';
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
      /* Where an appeal is available, the card carries it. An overdue
         application that does not tell the reader what to do next is only a
         record of being ignored. */
      ui.appealBlock(r) +
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
        ' in the log' +
        (counts.rtisShown > counts.rtis
          ? ' · <strong>' + (counts.rtisShown - counts.rtis) + '</strong> layout samples shown'
          : '') +
        ' · showing <strong>' + rows.length + '</strong>');

      ui.mount('[data-region="rti-list"]',
        rows.length
          ? rows.map(rtiCard).join('')
          : ui.empty('No applications match',
              'Nothing in the log matches this filter. The log fills up as applications are filed.'));
    }

    draw();
    ui.bindCopy(document);
  };

  /* ======================================================================= *
     HINDI ENTRY PAGE
     The record states, rendered from the taxonomy in whichever language the
     reader is in, so this page cannot drift from the chips on every other page.
     ======================================================================= */

  pages.hindi = function () {
    document.documentElement.setAttribute('lang', 'hi');

    ui.mount('[data-region="hi-states"]',
      '<p class="kicker">छह स्थितियाँ</p>' +
      '<h3 style="margin:0.35rem 0 0.75rem;font-size:1.25rem">हर कथन के साथ एक स्थिति जुड़ी होती है</h3>' +
      '<div class="chip-legend">' +
        Object.keys(WGO.EVIDENCE_STATES).map(function (key) {
          var def = ui.stateDef(key) || {};
          return '<div>' + ui.chip(key) + '<p>' + ui.esc(def.definition || '') + '</p></div>';
        }).join('') +
      '</div>');
  };

  /* ======================================================================= *
     WHAT CHANGED
     Derived from the git history by tools/build.js. The page renders it and
     adds nothing: if this disagreed with the repository, the repository would
     be right, so there is no second source of truth to keep honest.
     ======================================================================= */

  function changeLine(rec, verb) {
    var link = rec.url
      ? '<a href="' + ui.esc(rec.url) + '">' + ui.esc(rec.title || rec.id) + '</a>'
      : ui.esc(rec.title || rec.id);
    return '<li>' +
      '<span class="change__verb">' + ui.esc(verb) + '</span> ' +
      ui.plainChip(rec.kind) + ' ' +
      '<span class="mono">' + ui.esc(rec.id) + '</span>: ' + link +
    '</li>';
  }

  /* `state`, but also `dateState` and anything else the model names that way:
     an incident's date moving from UNKNOWN to CORROBORATED is a state moving,
     and the page should not call it an edit because of where it is stored. */
  function isStateField(name) {
    return /(^|[a-z])state$/i.test(String(name));
  }

  function fieldLine(field) {
    /* A state moving is shown as chips, because that is how it is shown
       everywhere else on the site. Anything else is shown as text, trimmed. */
    if (isStateField(field.field)) {
      return '<li>' + (field.from ? ui.chip(field.from) : ui.plainChip('nothing')) +
        ' <span aria-hidden="true">&rarr;</span> ' +
        (field.to ? ui.chip(field.to) : ui.plainChip('nothing')) + '</li>';
    }
    return '<li class="small"><strong>' + ui.esc(field.field) + '</strong>: ' +
      (field.from ? ui.esc(field.from) : '<em>nothing</em>') +
      ' <span aria-hidden="true">&rarr;</span> ' +
      (field.to ? ui.esc(field.to) : '<em>nothing</em>') + '</li>';
  }

  /* One import can move a hundred and forty records. Listing them all leaves a
     page ten thousand pixels tall, which is not a change log, it is a dump:
     so each group shows its first few and folds the rest away. */
  var CHANGE_PREVIEW = 6;

  function changeGroup(list, verb, render) {
    if (!list || !list.length) { return ''; }
    var head = list.slice(0, CHANGE_PREVIEW).map(render).join('');
    if (list.length <= CHANGE_PREVIEW) {
      return '<ul class="change__list">' + head + '</ul>';
    }
    var rest = list.slice(CHANGE_PREVIEW).map(render).join('');
    return '<ul class="change__list">' + head + '</ul>' +
      '<details class="change__more">' +
        '<summary>' + verb.toLowerCase() + ': show the other ' + (list.length - CHANGE_PREVIEW) + '</summary>' +
        '<ul class="change__list">' + rest + '</ul>' +
      '</details>';
  }

  function changedRecord(rec) {
    var link = rec.url
      ? '<a href="' + ui.esc(rec.url) + '">' + ui.esc(rec.title || rec.id) + '</a>'
      : ui.esc(rec.title || rec.id);
    return '<li>' +
      '<span class="change__verb">Changed</span> ' + ui.plainChip(rec.kind) + ' ' +
      '<span class="mono">' + ui.esc(rec.id) + '</span>: ' + link +
      '<ul class="change__fields">' + rec.fields.map(fieldLine).join('') + '</ul>' +
    '</li>';
  }

  function changeEntry(entry) {
    /* A state change is the entry that matters, so it is listed before an edit
       to a description no matter which order the diff produced them in. */
    var changed = (entry.changed || []).slice().sort(function (a, b) {
      var sa = a.fields.some(function (f) { return isStateField(f.field); }) ? 0 : 1;
      var sb = b.fields.some(function (f) { return isStateField(f.field); }) ? 0 : 1;
      return sa - sb;
    });

    return '<article class="card" id="' + ui.esc(entry.commit) + '">' +
      '<div class="row">' +
        '<span class="chip chip--plain mono">' + ui.esc(entry.commit) + '</span>' +
        '<span class="small">' + ui.esc(String(entry.date).slice(0, 10)) + '</span>' +
      '</div>' +
      '<h3>' + ui.esc(entry.summary) + '</h3>' +
      '<p class="small">' + ui.esc(entry.subject) + '</p>' +
      changeGroup(changed, 'Changed', changedRecord) +
      changeGroup(entry.added, 'Added', function (r) { return changeLine(r, 'Added'); }) +
      changeGroup(entry.removed, 'Removed', function (r) { return changeLine(r, 'Removed'); }) +
    '</article>';
  }

  /* ======================================================================= *
     PRESS
     ======================================================================= */

  /* The press page states figures a journalist may quote, so it reads them off
     the records at load rather than carrying numbers written into the markup.
     A press page that has drifted from the archive is worse than none. */
  pages.press = function () {
    var counts = model.counts();
    var archived = model.publishedSources.filter(function (s) { return s.archiveUrl; }).length;

    ui.mount('[data-region="press-counts"]',
      '<div><b>' + counts.incidents + '</b><span>Incidents</span></div>' +
      '<div><b>' + counts.evidence + '</b><span>Evidence records</span></div>' +
      '<div><b>' + counts.sources + '</b><span>Sources</span></div>' +
      '<div><b>' + counts.open + '</b><span>Questions unanswered</span></div>' +
      '<div><b>' + counts.orders + '</b><span>Orders found</span></div>');

    /* Incidents in the archive's own words, each carrying its state, so the
       page cannot describe an incident more firmly than the record does. */
    var incidents = model.incidents.map(function (inc) {
      var dated = inc.date && inc.dateState !== 'UNKNOWN';
      /* The title, not the place: an incident held open already says so in its
         place field, and appending a second qualifier read as a stutter. */
      return '<li>' +
        '<span class="hero__fact"><strong>' + ui.esc(inc.title) + '</strong>' +
          (dated ? ', ' + ui.esc(inc.date) : ', no date established') +
        '.</span> ' + ui.chip(inc.incidentState) +
      '</li>';
    }).join('');

    ui.mount('[data-region="press-holdings"]',
      '<ul class="hero__list">' + incidents +
        '<li><span class="hero__fact"><strong>No order authorising force has been found, ' +
          'for any of them.</strong></span> ' + ui.chip('UNKNOWN') + '</li>' +
      '</ul>' +
      '<p class="small" style="margin-top:0.9rem">' +
        counts.evidence + ' evidence records drawn from ' + counts.sources + ' sources, ' +
        archived + ' of which have an archived copy taken so the citation survives if the ' +
        'original page changes. ' + counts.offices + ' offices are mapped as having had the ' +
        'authority to order police action. ' + counts.open + ' questions have no answer, each ' +
        'tied to the office that would hold it.</p>');
  };

  /* about.html had no handler at all until 23 September 2026, which is why the
     corrections policy could promise a log for as long as it did without one
     appearing: nothing on that page was rendered from data. */
  pages.about = function () {
    ui.mount('[data-region="corrections"]', ui.correctionList());
  };

  pages.changes = function () {
    var history = WGO.changes || [];

    /* Two different things on one page, in the right order: what we did, then
       what moved in the data. The first is written by a person and the second
       is derived from the repository, and the page says which is which. */
    ui.mount('[data-region="updates-full"]', ui.updateList());
    ui.mount('[data-region="corrections"]', ui.correctionList());

    var added = 0, states = 0;
    history.forEach(function (entry) {
      added += (entry.added || []).length;
      (entry.changed || []).forEach(function (rec) {
        if (rec.fields.some(function (f) { return isStateField(f.field); })) { states += 1; }
      });
    });

    ui.mount('[data-region="changes-counts"]',
      '<div><b>' + history.length + '</b><span>Changes recorded</span></div>' +
      '<div><b>' + added + '</b><span>Records added</span></div>' +
      '<div><b>' + states + '</b><span>States moved</span></div>');

    ui.mount('[data-region="changes-help"]', ui.explainer('What counts as a change here?',
      '<p>Anything that alters a record the site renders: a new document, a claim moving between ' +
      'states, an edit to what a document establishes. Changes to the site\'s wording or design ' +
      'are in the repository but are not listed here, because they do not change what the archive ' +
      'says.</p>' +
      '<p style="margin-top:0.5rem">Each entry names the commit it came from. The commit is the ' +
      'authoritative version; this page is derived from it.</p>'));

    ui.mount('[data-region="changes-list"]',
      history.length
        ? history.map(changeEntry).join('')
        : ui.empty('No changes recorded yet',
            'The change log is derived from the history of the record store. It fills up as records are added and states move.'));
  };

  /* ======================================================================= *
     BOOT
     ======================================================================= */

  document.addEventListener('DOMContentLoaded', function () {
    model.build();
    ui.renderChrome();

    var page = document.body.getAttribute('data-page');
    if (pages[page]) { pages[page](); }

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
