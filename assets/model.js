/* =============================================================================
   WhoGaveTheOrder.in — model layer
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
    model.questions = expandQuestions();

    /* Published pools — the real archive. */
    model.publishedEvidence  = (WGO.evidence || []).slice();
    model.publishedSources   = (WGO.sources || []).slice();
    model.publishedResponses = (WGO.responses || []).slice();
    model.publishedExternal  = (WGO.external || []).slice();

    /* Display pools — published records, plus layout samples while demoMode is
       on. Counts always come from the published pools above. */
    var demo = isDemo();
    model.evidence  = model.publishedEvidence.concat(demo ? (WGO.sampleEvidence  || []) : []);
    model.sources   = model.publishedSources.concat(demo ? (WGO.sampleSources   || []) : []);
    model.responses = model.publishedResponses.concat(demo ? (WGO.sampleResponses || []) : []);
    model.external  = model.publishedExternal.concat(demo ? (WGO.sampleExternal  || []) : []);

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
      external: byId(model.external)
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
     behind this specific action? Absent that, the answer is NOT ESTABLISHED —
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

  /* --- counts ------------------------------------------------------------ *
     Published records only. The homepage numbers must never be inflated by
     layout samples, so they are computed from the published pools. */

  model.counts = function () {
    var questions = model.questions;
    var answered = questions.filter(function (q) { return q.state === 'ANSWERED'; });
    var partly   = questions.filter(function (q) { return q.state === 'PARTIALLY_ANSWERED'; });
    var open     = questions.filter(function (q) { return q.state === 'UNANSWERED'; });
    var disputed = questions.filter(function (q) { return q.state === 'DISPUTED'; });

    var known = model.claims.filter(function (c) {
      return c.state === 'VERIFIED' || c.state === 'CORROBORATED';
    });

    return {
      incidents:   model.incidents.length,
      evidence:    model.publishedEvidence.length,
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
        url: 'investigation.html?id=' + i.slug,
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

    model.offices.forEach(function (o) {
      docs.push({
        id: o.id, kind: 'Office', title: o.title,
        subtitle: o.jurisdiction,
        url: 'chain.html#' + o.id,
        text: docText(o.id, o.title, o.shortTitle, o.jurisdiction, o.level,
          (o.statutoryBasis || []).map(function (s) { return s.text; }).join(' '),
          (o.whatWeDontKnow || []).join(' '))
      });
    });

    model.persons.forEach(function (p) {
      docs.push({
        id: p.id, kind: 'Person', title: p.name, subtitle: p.officeTitle,
        url: 'chain.html#' + p.id,
        text: docText(p.id, p.name, p.officeTitle)
      });
    });

    model.questions.forEach(function (q) {
      var inc = model.incident(q.incidentId);
      docs.push({
        id: q.id, kind: 'Question', title: q.text,
        subtitle: inc ? inc.place : '', state: q.state,
        url: 'investigation.html?id=' + (inc ? inc.slug : '') + '#questions',
        text: docText(q.id, q.text, (q.wants || []).join(' '), inc && inc.place)
      });
    });

    model.claims.forEach(function (c) {
      var inc = model.incident(c.incidentId);
      docs.push({
        id: c.id, kind: 'Claim', title: c.text,
        subtitle: inc ? inc.place : '', state: c.state,
        url: 'response.html#' + c.id,
        text: docText(c.id, c.text, c.note)
      });
    });

    model.responses.forEach(function (r) {
      docs.push({
        id: r.id, kind: 'Government response', title: r.respondingOffice,
        subtitle: r.channel, demo: r.demo,
        url: 'response.html#' + r.id,
        text: docText(r.id, r.respondingOffice, r.channel, r.quote, r.stillUnanswered)
      });
    });

    model.orders.forEach(function (o) {
      docs.push({
        id: o.id, kind: 'Order', title: o.title, subtitle: o.issuedBy, state: o.state,
        url: 'investigation.html?id=' + (model.incident(o.incidentId) || {}).slug + '#orders',
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

    function checkRefs(records, field, pool, label) {
      (records || []).forEach(function (rec) {
        (rec[field] || []).forEach(function (ref) {
          if (!pool[ref]) {
            problems.push({ record: rec.id, field: field, ref: ref, message: label });
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
      if (!e.demo && !(e.sourceIds || []).length) {
        problems.push({ record: e.id, field: 'sourceIds', ref: '—', message: 'Published evidence with no source on record' });
      }
    });

    model.claims.forEach(function (c) {
      var strong = c.state === 'VERIFIED' || c.state === 'CORROBORATED';
      if (strong && !(c.evidenceIds || []).length) {
        problems.push({ record: c.id, field: 'state', ref: c.state, message: 'Claim asserts a strong state with no evidence attached' });
      }
    });

    model.questions.forEach(function (q) {
      if (q.state === 'ANSWERED' && !(q.evidenceIds || []).length) {
        problems.push({ record: q.id, field: 'state', ref: q.state, message: 'Question marked answered with no evidence attached' });
      }
    });

    return problems;
  };

  WGO.model = model;
})(window.WGO = window.WGO || {});
