/* =============================================================================
   WhoGaveTheOrder.in: model layer
   -----------------------------------------------------------------------------
   Turns the flat record store into the relational graph the brief asks for:

       Incident -> Claim    -> Evidence -> Source
       Incident -> Question -> Authority -> Evidence -> Answer state

   Two rules are enforced here rather than in the pages, so that no page can
   quietly break them:

   1. Sample records never enter a published count.
   2. A record with no evidence and no source resolves to UNKNOWN. The model
      never upgrades a state on its own.
   ========================================================================== */

(function (WGO) {
  'use strict';

  var model = {};

  /* --- small helpers ----------------------------------------------------- */

  function byId(list) {
    var map = Object.create(null);
    (list || []).forEach(function (item) { map[item.id] = item; });
    return map;
  }

  function isDemo() { return !!(WGO.config && WGO.config.demoMode); }

  function pad(n, width) {
    var s = String(n);
    while (s.length < width) { s = '0' + s; }
    return s;
  }

  /* --- question expansion ------------------------------------------------ *
     The twelve standard questions are asked of every incident, in the same
     order, with stable IDs so that they can be cited and linked. */

  function expandQuestions() {
    var out = [];
    (WGO.incidents || []).forEach(function (incident) {
      (WGO.STANDARD_QUESTIONS || []).forEach(function (q, i) {
        out.push({
          id: 'QST-' + incident.id.slice(4) + '-' + pad(i + 1, 2),
          key: q.key,
          incidentId: incident.id,
          text: q.text,
          level: q.level,
          wants: q.wants || [],
          state: 'UNANSWERED',    // upgraded only by an editor attaching evidence
          evidenceIds: [],
          standard: true
        });
      });
    });
    (WGO.questionsExtra || []).forEach(function (q) {
      out.push(Object.assign({ standard: false, evidenceIds: [], state: 'UNANSWERED' }, q));
    });
    return out;
  }

  /* --- build ------------------------------------------------------------- */

  model.build = function build() {
    model.incidents = (WGO.incidents || []).slice();
    model.offices   = (WGO.offices || []).slice();
    model.persons   = (WGO.persons || []).slice();
    model.orders    = (WGO.orders || []).slice();
    model.events    = (WGO.events || []).slice();
    model.claims    = (WGO.claims || []).slice();
    /* The source map's 30 prioritised questions replace the twelve-per-incident
       standard set once imported: they are the same work, researched. */
    model.questions = (WGO.importedQuestions || []).length
      ? (WGO.importedQuestions || []).slice()
      : expandQuestions();

    /* Published pools: the real archive.
       Hand-entered records first, then anything imported from the source map.
       The import never upgrades a state: a claim arrives at whatever confidence
       the source map gave it. */
    model.publishedEvidence  = (WGO.evidence || []).concat(WGO.importedEvidence || []);
    model.publishedSources   = (WGO.sources || []).concat(WGO.importedSources || []);
    model.publishedResponses = (WGO.responses || []).slice();
    model.publishedExternal  = (WGO.external || []).concat(WGO.importedExternal || []);
    model.framework          = (WGO.importedFramework || []).slice();
    model.filings            = (WGO.importedFilings || []).slice();

    /* Display pools: published records, plus layout samples while demoMode is
       on. Counts always come from the published pools above. */
    var demo = isDemo();
    model.publishedRtis = (WGO.rtis || []).slice();

    model.evidence  = model.publishedEvidence.concat(demo ? (WGO.sampleEvidence  || []) : []);
    model.sources   = model.publishedSources.concat(demo ? (WGO.sampleSources   || []) : []);
    model.responses = model.publishedResponses.concat(demo ? (WGO.sampleResponses || []) : []);
    model.external  = model.publishedExternal.concat(demo ? (WGO.sampleExternal  || []) : []);
    model.rtis      = model.publishedRtis.concat(demo ? (WGO.sampleRtis || []) : []);

    model.index = {
      incident: byId(model.incidents),
      office:   byId(model.offices),
      person:   byId(model.persons),
      order:    byId(model.orders),
      event:    byId(model.events),
      claim:    byId(model.claims),
      question: byId(model.questions),
      evidence: byId(model.evidence),
      source:   byId(model.sources),
      response: byId(model.responses),
      external: byId(model.external),
      rti:      byId(model.rtis)
    };

    model.searchDocs = buildSearchDocs();
    return model;
  };

  /* --- lookups ----------------------------------------------------------- */

  model.incident = function (id) {
    if (!id) { return null; }
    return model.index.incident[id] ||
      model.incidents.filter(function (i) { return i.slug === id; })[0] || null;
  };

  model.evidenceItem  = function (id) { return model.index.evidence[id] || null; };
  model.office        = function (id) { return model.index.office[id] || null; };

  model.questionsFor = function (incidentId) {
    return model.questions.filter(function (q) { return q.incidentId === incidentId; });
  };

  model.claimsFor = function (incidentId) {
    return model.claims.filter(function (c) { return c.incidentId === incidentId; });
  };

  model.eventsFor = function (incidentId) {
    return model.events.filter(function (e) { return e.incidentId === incidentId; })
      .sort(function (a, b) { return String(a.at).localeCompare(String(b.at)); });
  };

  model.evidenceFor = function (incidentId) {
    return model.evidence.filter(function (e) { return e.incidentId === incidentId; });
  };

  model.ordersFor = function (incidentId) {
    return model.orders.filter(function (o) { return o.incidentId === incidentId; });
  };

  model.responsesFor = function (incidentId) {
    return model.responses.filter(function (r) { return r.incidentId === incidentId; });
  };

  model.externalFor = function (incidentId) {
    return model.external.filter(function (x) {
      return (x.incidentIds || []).indexOf(incidentId) !== -1;
    });
  };

  /* Offices relevant to an incident, grouped into the five rungs of the chain
     and returned in chain order. An incident with no office list falls back to
     the whole structural map. */
  model.chainFor = function (incidentId) {
    var relevant = model.offices.filter(function (o) {
      if (!incidentId) { return true; }
      var inc = model.incident(incidentId);
      if (inc && inc.officeIds && inc.officeIds.length) {
        return inc.officeIds.indexOf(o.id) !== -1;
      }
      return (o.appliesTo || []).indexOf(incidentId) !== -1;
    });

    return (WGO.AUTHORITY_LEVELS || []).map(function (level) {
      return {
        level: level,
        offices: relevant.filter(function (o) { return o.level === level.key; })
      };
    }).filter(function (rung) { return rung.offices.length > 0; });
  };

  /* Has any evidence in the archive been recorded as placing this office
     behind this specific action? Absent that, the answer is NOT ESTABLISHED:
     and it is the model, not the page, that decides. */
  model.authorisationStatus = function (office, incidentId) {
    var links = (office.authorisationEvidence || []).filter(function (link) {
      return !incidentId || link.incidentId === incidentId;
    });
    var supported = links.filter(function (link) {
      return (link.evidenceIds || []).length > 0;
    });
    if (!supported.length) {
      return { established: false, state: 'UNKNOWN', links: [] };
    }
    return { established: true, state: 'VERIFIED', links: supported };
  };

  /* --- RTI register ------------------------------------------------------ *
     The clock is computed from filedOn every time it is read, never stored.
     A stored deadline goes stale, and a stale deadline in an accountability
     archive is worse than no deadline at all. */

  var DAY_MS = 86400000;

  function periodDays(key) {
    var found = (WGO.RTI_PERIODS || []).filter(function (p) { return p.key === key; })[0];
    return found ? found.days : 30;
  }

  function midnightUTC(date) {
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  }

  model.rtiClock = function (rti) {
    if (!rti || !rti.filedOn) { return { known: false }; }

    var filed = new Date(rti.filedOn + 'T00:00:00Z');
    if (isNaN(filed.getTime())) { return { known: false }; }

    var days = periodDays(rti.period);
    var dueMs = filed.getTime() + days * DAY_MS;
    var todayMs = midnightUTC(new Date());

    var settled = ['REPLY_RECEIVED', 'NO_RECORD_HELD', 'REFUSED', 'TRANSFERRED', 'WITHDRAWN']
      .indexOf(rti.status) !== -1;

    var overdueDays = Math.floor((todayMs - dueMs) / DAY_MS);

    return {
      known: true,
      dueOn: new Date(dueMs).toISOString().slice(0, 10),
      statutoryDays: days,
      settled: settled,
      /* Only an unsettled application can be overdue. Once an office has
         replied, the clock stops even if the reply came late. */
      overdue: !settled && overdueDays > 0,
      overdueDays: overdueDays > 0 ? overdueDays : 0,
      daysRemaining: overdueDays < 0 ? -overdueDays : 0,
      elapsedDays: Math.floor((todayMs - filed.getTime()) / DAY_MS)
    };
  };

  /* --- the appeal clock --------------------------------------------------- *
     A deemed refusal is not a dead end, it is a date. This computes the windows
     that open when an office stays silent, so the register can say what has to
     be done next and by when, rather than only recording that nothing came. */

  function addDays(isoDate, days) {
    var t = new Date(isoDate + 'T00:00:00Z').getTime();
    if (isNaN(t)) { return null; }
    return new Date(t + days * DAY_MS).toISOString().slice(0, 10);
  }

  function daysUntil(isoDate) {
    var t = new Date(isoDate + 'T00:00:00Z').getTime();
    if (isNaN(t)) { return null; }
    return Math.round((t - midnightUTC(new Date())) / DAY_MS);
  }

  model.rtiAppeal = function (rti) {
    var clock = model.rtiClock(rti);
    if (!clock.known) { return { available: false, reason: 'No filing date on record.' }; }

    var windows = WGO.RTI_APPEALS || {};
    var first = windows.FIRST || { days: 30 };
    var faa = windows.FAA_DECISION || { days: 30, extendedDays: 45 };
    var second = windows.SECOND || { days: 90 };

    /* The first appeal runs from the day a decision was received, or: where
       nothing came: from the day the reply fell due. Section 7(2) treats that
       silence as a refusal, which is what makes the appeal available at all. */
    var runsFrom = rti.repliedOn || clock.dueOn;
    var stage = null;

    if (rti.status === 'FIRST_APPEAL') {
      /* Waiting on the appellate authority. The second-appeal clock starts when
         it decides, or when its own time to decide runs out. */
      var appealFiled = rti.appealFiledOn || null;
      var faaDueOn = appealFiled ? addDays(appealFiled, faa.extendedDays || faa.days) : null;
      var secondFrom = rti.appealDecidedOn || faaDueOn;
      stage = {
        available: true,
        stage: 'SECOND',
        deemedRefusalOn: clock.overdue ? clock.dueOn : null,
        appealFiledOn: appealFiled,
        faaDecisionDueOn: faaDueOn,
        deadlineOn: secondFrom ? addDays(secondFrom, second.days) : null,
        provision: second.provision,
        note: second.note
      };
    } else if (rti.status === 'SECOND_APPEAL' || rti.status === 'WITHDRAWN') {
      return { available: false, reason: 'The appeal route has already been taken as far as this log tracks it.' };
    } else if (clock.overdue || rti.status === 'LAPSED' ||
               ['REFUSED', 'NO_RECORD_HELD', 'REPLY_RECEIVED'].indexOf(rti.status) !== -1) {
      /* A reply on the merits can be appealed too: an incomplete answer, or a
         refusal under a claimed exemption, is exactly what section 19(1) is
         for. Only an application still inside its statutory period has nothing
         to appeal yet. */
      stage = {
        available: true,
        stage: 'FIRST',
        deemedRefusalOn: (!rti.repliedOn && clock.overdue) ? clock.dueOn : null,
        runsFrom: runsFrom,
        deadlineOn: addDays(runsFrom, first.days),
        provision: first.provision,
        note: first.note
      };
    } else {
      return {
        available: false,
        reason: 'Still within the statutory period. The reply is due on ' + clock.dueOn + '.'
      };
    }

    if (stage.deadlineOn) {
      var left = daysUntil(stage.deadlineOn);
      stage.daysLeft = left;
      stage.expired = left < 0;
      stage.daysExpired = left < 0 ? -left : 0;
    }
    return stage;
  };

  model.rtisFor = function (questionId) {
    return model.rtis.filter(function (r) {
      return (r.questionIds || []).indexOf(questionId) !== -1;
    });
  };

  model.rtisForIncident = function (incidentId) {
    return model.rtis.filter(function (r) { return r.incidentId === incidentId; });
  };

  /* --- counts ------------------------------------------------------------ *
     Published records only. The homepage numbers must never be inflated by
     layout samples, so they are computed from the published pools. */

  /* --- Distance to the order --------------------------------------------- *
     The ladder for one incident, rung by rung, with the record behind each
     reached rung resolved. Derived rather than stored, so a rung cannot claim
     a record that has been withdrawn or that never existed.

     Returns the rungs in order plus reachedCount and total, which are counts
     of rungs and not a measure of how much work is left. Nobody knows how much
     work is left; that is why there is no percentage here. */
  model.orderLadder = function (incident) {
    var trail = (incident && incident.orderTrail) || { reached: null, rungs: {} };
    var ladder = WGO.ORDER_LADDER || [];
    var reachedIndex = -1;
    ladder.forEach(function (rung, i) {
      if (rung.key === trail.reached) { reachedIndex = i; }
    });

    var rungs = ladder.map(function (rung, i) {
      var claim = (trail.rungs || {})[rung.key] || null;
      var evidence = claim && claim.evidenceId ? model.index.evidence[claim.evidenceId] : null;
      return {
        key: rung.key,
        label: rung.label,
        definition: rung.definition,
        /* Reached only if it is at or below the declared rung AND a published
           record backs it. A rung with no record is not reached, whatever the
           data says, because that is the site's rule everywhere else. */
        reached: i <= reachedIndex && !!evidence,
        claimed: i <= reachedIndex,
        evidence: evidence,
        note: claim ? claim.note : null
      };
    });

    return {
      rungs: rungs,
      total: ladder.length,
      reachedCount: rungs.filter(function (r) { return r.reached; }).length,
      reachedKey: reachedIndex === -1 ? null : ladder[reachedIndex].key,
      next: trail.next ? (model.index.question ? model.index.question[trail.next] : null) || trail.next : null
    };
  };

  model.counts = function () {
    var questions = model.questions;
    var answered = questions.filter(function (q) { return q.state === 'ANSWERED'; });
    var partly   = questions.filter(function (q) { return q.state === 'PARTIALLY_ANSWERED'; });
    var open     = questions.filter(function (q) { return q.state === 'UNANSWERED'; });
    var disputed = questions.filter(function (q) { return q.state === 'DISPUTED'; });

    var known = model.claims.filter(function (c) {
      return c.state === 'VERIFIED' || c.state === 'CORROBORATED';
    });

    /* Published applications only. A sample must never make the register look
       like it is chasing an office it is not. */
    var rtiOverdue = model.publishedRtis.filter(function (r) {
      var clock = model.rtiClock(r);
      return clock.known && clock.overdue;
    });

    return {
      incidents:   model.incidents.length,
      evidence:    model.publishedEvidence.length,
      rtis:        model.publishedRtis.length,
      filings:     (model.filings || []).length,
      filingsUrgent: (model.filings || []).filter(function (f) { return f.deadlineDriven; }).length,
      framework:   (model.framework || []).length,
      rtisShown:   model.rtis.length,
      rtiOverdue:  rtiOverdue.length,
      rtiOverdueDaysTotal: rtiOverdue.reduce(function (sum, r) {
        return sum + model.rtiClock(r).overdueDays;
      }, 0),
      sources:     model.publishedSources.length,
      responses:   model.publishedResponses.length,
      external:    model.publishedExternal.length,
      orders:      model.orders.length,
      offices:     model.offices.length,
      persons:     model.persons.length,
      questions:   questions.length,
      answered:    answered.length,
      partly:      partly.length,
      open:        open.length,
      disputed:    disputed.length,
      known:       known.length,
      sampleCount: isDemo() ? (WGO.sampleEvidence || []).length : 0
    };
  };

  /* --- search (section 19) ----------------------------------------------- *
     One flat index across people, offices, locations, dates, incidents,
     evidence IDs, documents and keywords. Small enough to keep in memory;
     honest enough to show what type each hit is. */

  function docText() {
    return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
  }

  function buildSearchDocs() {
    var docs = [];

    model.incidents.forEach(function (i) {
      docs.push({
        id: i.id, kind: 'Incident', title: i.title,
        subtitle: i.place, state: i.incidentState,
        url: 'incident/' + i.slug + '.html',
        text: docText(i.id, i.title, i.place, i.state, i.summary, i.slug)
      });
    });

    model.evidence.forEach(function (e) {
      docs.push({
        id: e.id, kind: 'Evidence', title: e.title,
        subtitle: model.typeLabel(e.type), state: e.verification, demo: e.demo,
        url: 'evidence.html?id=' + e.id,
        text: docText(e.id, e.title, e.type, e.origin, e.establishes, e.doesNotEstablish, e.dateOfItem)
      });
    });

    /* Offices and persons are not in the search index and have no page of
       their own. The eight offices are the generic structure of who may
       authorise force in India: a textbook diagram, identical for every
       incident, and true whether or not anything happened. Indexing it put
       "Superintendent of Police" in the results for a reader searching an
       incident, as though the archive held something about that office. It
       does not: `persons` is empty and no order in this archive names anyone.
       Where an office matters it is named on the incident page, in a sentence,
       against that incident.

*/
    model.questions.forEach(function (q) {
      var inc = model.incident(q.incidentId);
      docs.push({
        id: q.id, kind: 'Question', title: q.text,
        subtitle: inc ? inc.place : '', state: q.state,
        url: 'incident/' + (inc ? inc.slug : '') + '.html#questions',
        text: docText(q.id, q.text, (q.wants || []).join(' '), inc && inc.place)
      });
    });

    model.claims.forEach(function (c) {
      var inc = model.incident(c.incidentId);
      docs.push({
        id: c.id, kind: 'Claim', title: c.text,
        subtitle: inc ? inc.place : '', state: c.state,
        url: 'incident/' + (inc ? inc.slug : '') + '.html#what-happened',
        text: docText(c.id, c.text, c.note)
      });
    });

    /* Government responses are indexed onto the incident they answer. There
       are none today; when one arrives it is filed as evidence like anything
       else rather than on a page of its own. */
    model.responses.forEach(function (r) {
      var inc = model.incident(r.incidentId);
      docs.push({
        id: r.id, kind: 'Government response', title: r.respondingOffice,
        subtitle: r.channel, demo: r.demo,
        url: 'incident/' + (inc ? inc.slug : '') + '.html#evidence',
        text: docText(r.id, r.respondingOffice, r.channel, r.quote, r.stillUnanswered)
      });
    });

    model.orders.forEach(function (o) {
      docs.push({
        id: o.id, kind: 'Order', title: o.title, subtitle: o.issuedBy, state: o.state,
        url: 'incident/' + (model.incident(o.incidentId) || {}).slug + '.html#orders',
        text: docText(o.id, o.title, o.issuedBy, o.summary)
      });
    });

    model.external.forEach(function (x) {
      docs.push({
        id: x.id, kind: 'External work', title: x.title, subtitle: x.creator, demo: x.demo,
        url: 'others.html#' + x.id,
        text: docText(x.id, x.title, x.creator, x.kind, x.note)
      });
    });

    model.rtis.forEach(function (r) {
      docs.push({
        id: r.id, kind: 'RTI application', title: r.subject,
        subtitle: r.office, demo: r.demo,
        url: 'rti.html#' + r.id,
        text: docText(r.id, r.subject, r.office, r.referenceNo, r.outcome, r.status, r.filedOn)
      });
    });

    docs.forEach(function (d) { d.haystack = d.text.toLowerCase(); });
    return docs;
  }

  model.search = function (query) {
    var q = String(query || '').trim().toLowerCase();
    if (q.length < 2) { return []; }
    var terms = q.split(/\s+/);

    return model.searchDocs.map(function (doc) {
      var score = 0;
      var matchedAll = terms.every(function (term) {
        var hit = doc.haystack.indexOf(term) !== -1;
        if (!hit) { return false; }
        score += 1;
        if (doc.id.toLowerCase().indexOf(term) !== -1) { score += 6; }
        if (doc.title.toLowerCase().indexOf(term) !== -1) { score += 3; }
        return true;
      });
      return matchedAll ? { doc: doc, score: score } : null;
    }).filter(Boolean)
      .sort(function (a, b) { return b.score - a.score; })
      .map(function (r) { return r.doc; });
  };

  /* --- labels ------------------------------------------------------------ */

  model.typeLabel = function (key) {
    var found = (WGO.EVIDENCE_TYPES || []).filter(function (t) { return t.key === key; })[0];
    return found ? found.label : (key || 'Other Documents');
  };

  model.levelLabel = function (key) {
    var found = (WGO.AUTHORITY_LEVELS || []).filter(function (l) { return l.key === key; })[0];
    return found ? found.label : key;
  };

  /* --- integrity --------------------------------------------------------- *
     Used by the editorial console. A dangling reference in an accountability
     archive is not a cosmetic bug: it is a claim pointing at nothing. */

  model.integrity = function () {
    var problems = [];

    /* Severity, because the tooling gates on it and a gate that cannot tell a
       broken reference from a record still being worked on is a gate that gets
       switched off. `error` is a rule the archive breaks; `warning` is a record
       that renders honestly but is not finished. */
    function problem(severity, rec, field, ref, message) {
      problems.push({ severity: severity, record: rec, field: field, ref: ref, message: message });
    }

    /* The order ladder is a claim of progress, so it is checked like a claim.
       A rung that names no published record is not reached, a rung naming a
       record that does not exist is a broken reference, and a ladder with a
       hole in it is a mistake rather than a shortcut. */
    model.incidents.forEach(function (inc) {
      var trail = inc.orderTrail;
      if (!trail) { return; }
      var ladder = WGO.ORDER_LADDER || [];
      var keys = ladder.map(function (r) { return r.key; });

      if (trail.reached && keys.indexOf(trail.reached) === -1) {
        problem('error', inc.id, 'orderTrail.reached', trail.reached,
          'Not a rung on WGO.ORDER_LADDER.');
      }
      Object.keys(trail.rungs || {}).forEach(function (key) {
        if (keys.indexOf(key) === -1) {
          problem('error', inc.id, 'orderTrail.rungs', key, 'Not a rung on WGO.ORDER_LADDER.');
          return;
        }
        var id = trail.rungs[key].evidenceId;
        if (!id || !model.index.evidence[id]) {
          problem('error', inc.id, 'orderTrail.rungs.' + key, id || '(none)',
            'A rung must name a published evidence record. Progress towards the order is sourced like everything else.');
        }
      });
      var reachedIndex = keys.indexOf(trail.reached);
      for (var i = 0; i <= reachedIndex; i++) {
        if (!(trail.rungs || {})[keys[i]]) {
          problem('error', inc.id, 'orderTrail.rungs', keys[i],
            'Rung claimed as passed but nothing records it. The ladder is cumulative and cannot have a hole in it.');
        }
      }
      if (trail.next && !model.index.question[trail.next]) {
        problem('warning', inc.id, 'orderTrail.next', trail.next,
          'The question that would move this on does not exist.');
      }
    });

    function checkRefs(records, field, pool, label) {
      (records || []).forEach(function (rec) {
        (rec[field] || []).forEach(function (ref) {
          if (!pool[ref]) {
            problem('error', rec.id, field, ref, label);
          }
        });
      });
    }

    checkRefs(model.evidence, 'sourceIds', model.index.source, 'Evidence cites a source that does not exist');
    checkRefs(model.evidence, 'relatedIds', model.index.evidence, 'Evidence links to an evidence item that does not exist');
    checkRefs(model.claims, 'evidenceIds', model.index.evidence, 'Claim cites evidence that does not exist');
    checkRefs(model.questions, 'evidenceIds', model.index.evidence, 'Question cites evidence that does not exist');
    checkRefs(model.offices, 'evidenceIds', model.index.evidence, 'Office cites evidence that does not exist');

    model.evidence.forEach(function (e) {
      if (e.demo || (e.sourceIds || []).length) { return; }
      /* An UNKNOWN item with no source is usually a *negative* record: we went
         looking, found nothing, and filed the absence. There is no document to
         cite for a thing that does not exist, and the card already prints NO
         SOURCE ON RECORD. Anything claiming more than UNKNOWN and citing
         nothing is the real breach. */
      if (e.verification === 'UNKNOWN') {
        problem('warning', e.id, 'sourceIds', 'UNKNOWN',
          'Evidence record with no source: reads as a recorded absence. Confirm that is what it is.');
      } else {
        problem('error', e.id, 'sourceIds', e.verification || 'none',
          'Published evidence with no source on record');
      }
    });

    /* Fixity. A link is not a citation: pages are edited, paywalled and taken
       down, and a source that cannot be shown to be the one we read is a
       source the archive cannot defend. */
    model.publishedSources.forEach(function (s) {
      if (!s.retrievedOn) {
        /* retrievedOn records the day a URL was fetched. A source with no URL
           was not fetched from anywhere: a printed manual, a case citation:
           so the missing date is a gap in the note, not a broken rule. */
        problem(s.url ? 'error' : 'warning', s.id, 'retrievedOn', 'none',
          s.url
            ? 'Online source with no retrieval date: nothing records when this page was read'
            : 'Source with neither a URL nor a retrieval date: nothing records where or when it was consulted');
      }
      if (s.url && !s.archiveUrl) {
        problem('warning', s.id, 'archiveUrl', 'none',
          'Online source with no archived copy: it can be edited or removed without trace');
      }
      /* A checksum only means something for a file that should be byte-identical
         every time it is fetched. A PDF of an order is such a file. A news page
         carries ads, timestamps and a different layout on every request, so
         asking for its hash would be asking for a number that can never match,
         and a check nobody can satisfy is a check that gets ignored. */
      if (s.url && /\.pdf($|\?)/i.test(s.url) && !s.sha256) {
        problem('warning', s.id, 'sha256', 'none',
          'Document source with no checksum: a fetched file should be hashed so a later copy can be compared');
      }
    });

    /* CORROBORATED means two or more INDEPENDENT sources. Independence has been
       judged in prose until now, and it is easy to get wrong: four outlets
       reporting one affidavit look like four sources, and a wire story carried
       by three papers looks like three. Where a source records where it came
       from, that can be checked.

       This is raised as a warning with the decision attached rather than as an
       error, because the answer depends on what the claim says. If the claim is
       that a document says something, several people reading that document do
       corroborate it. If the claim is about what happened, they do not. */
    model.publishedEvidence.forEach(function (e) {
      if (e.verification !== 'CORROBORATED') { return; }
      var sources = (e.sourceIds || []).map(function (id) { return model.index.source[id]; }).filter(Boolean);
      if (sources.length < 2) { return; }
      var origins = {};
      sources.forEach(function (s) { origins[s.originatesFrom || ('source:' + s.id)] = true; });
      var named = sources.filter(function (s) { return s.originatesFrom; });
      if (named.length === sources.length && Object.keys(origins).length < 2) {
        problem('warning', e.id, 'verification', 'CORROBORATED',
          'CORROBORATED, but every source traces to one origin: ' + Object.keys(origins)[0] +
          '. Fine if the claim is what that source says; one source if the claim is what happened.');
      }
    });

    model.claims.forEach(function (c) {
      var strong = c.state === 'VERIFIED' || c.state === 'CORROBORATED';
      if (strong && !(c.evidenceIds || []).length) {
        problem('error', c.id, 'state', c.state, 'Claim asserts a strong state with no evidence attached');
      }
    });

    model.questions.forEach(function (q) {
      if (q.state === 'ANSWERED' && !(q.evidenceIds || []).length) {
        problem('error', q.id, 'state', q.state, 'Question marked answered with no evidence attached');
      }
    });

    checkRefs(model.rtis, 'evidenceIds', model.index.evidence, 'RTI record cites evidence that does not exist');
    checkRefs(model.rtis, 'questionIds', model.index.question, 'RTI record cites a question that does not exist');

    model.rtis.forEach(function (r) {
      var settledWithReply = ['REPLY_RECEIVED', 'NO_RECORD_HELD', 'REFUSED'].indexOf(r.status) !== -1;
      if (settledWithReply && !(r.evidenceIds || []).length) {
        problem('error', r.id, 'evidenceIds', r.status, 'RTI reply received but not filed as evidence');
      }
      if (!r.filedOn) {
        problem('error', r.id, 'filedOn', 'none',
          'RTI record with no filing date: the clock cannot be computed');
      }
      /* The register's own claim about itself. An application whose statutory
         period has run out but still reads FILED is telling the reader it is
         waiting when the Act says it has been refused. */
      var clock = model.rtiClock(r);
      if (r.status === 'FILED' && clock.known && clock.overdue) {
        problem('error', r.id, 'status', 'FILED',
          'Statutory period expired ' + clock.overdueDays + ' day' + (clock.overdueDays === 1 ? '' : 's') +
          ' ago: this is a deemed refusal and should read LAPSED');
      }
    });

    /* The calendar lists when a court or a committee sits or ruled, and takes
       its state from the evidence record behind each entry. An entry with no
       such record would be a date asserted with nothing under it. */
    var calendarIds = {};
    var isoDate = /^\d{4}-\d{2}-\d{2}$/;
    (WGO.calendar || []).forEach(function (c) {
      if (!/^CAL-\d{4}$/.test(c.id || '')) {
        problem('error', c.id || '(no id)', 'id', c.id, 'Calendar ids are CAL-NNNN.');
      }
      if (calendarIds[c.id]) {
        problem('error', c.id, 'id', c.id, 'Duplicate calendar id.');
      }
      calendarIds[c.id] = true;

      if (!isoDate.test(c.date || '') || isNaN(new Date(c.date + 'T00:00:00Z').getTime())) {
        problem('error', c.id, 'date', c.date, 'Not an ISO date.');
      }
      if (c.endDate && (!isoDate.test(c.endDate) || c.endDate < c.date)) {
        problem('error', c.id, 'endDate', c.endDate, 'Not an ISO date on or after the first day.');
      }
      if (!(WGO.CALENDAR_KINDS || {})[c.kind]) {
        problem('error', c.id, 'kind', c.kind, 'Not a key of WGO.CALENDAR_KINDS.');
      }
      ['title', 'place', 'what'].forEach(function (field) {
        if (!c[field] || !String(c[field]).trim()) {
          problem('error', c.id, field, null, 'Calendar entries need a ' + field + '.');
        }
      });
      if (!(c.evidenceIds || []).length) {
        problem('error', c.id, 'evidenceIds', null,
          'A calendar entry with no evidence record behind it is a date with no source.');
      }
      (c.evidenceIds || []).forEach(function (id) {
        if (!model.index.evidence[id]) {
          problem('error', c.id, 'evidenceIds', id, 'Names an evidence record that does not exist.');
        }
      });
      (c.incidentIds || []).forEach(function (id) {
        if (!model.index.incident[id]) {
          problem('error', c.id, 'incidentIds', id, 'Names an incident that does not exist.');
        }
      });
      (c.quotes || []).forEach(function (q) {
        if (!q || !q.outlet || !q.text) {
          problem('error', c.id, 'quotes', null, 'A quote needs the outlet and the exact words.');
        }
      });
    });

    return problems;
  };

  /* Errors only, for anything that has to decide whether to stop. */
  model.integrityErrors = function () {
    return model.integrity().filter(function (p) { return p.severity === 'error'; });
  };

  WGO.model = model;
})(window.WGO = window.WGO || {});
