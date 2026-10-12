/* =============================================================================
   rti-kit.html: a drafted RTI application for every incident
   -----------------------------------------------------------------------------
   The archive's method ends where the records start, and the records are held by
   offices that answer only when asked in the statute's form. This page writes the
   request, so that asking is a matter of filling in a name and pressing copy.

   What the text asks for is decided by the research note on the Act (see
   SOURCING.md), and the decisions are worth stating where they will be edited:

   - It asks for documents, never for reasons. The Supreme Court held in CBSE v
     Aditya Bandopadhyay (2011) 8 SCC 497, para 35, that the Act gives access to
     information that exists and does not oblige an office to explain or infer, and
     in Khanapuram Gandaiah (2010) 2 SCC 1, para 6, that an applicant cannot ask why
     an order was passed. So "who gave the order" is asked as a request for the
     order, the log entry and the record showing the post of the officer who
     recorded it.
   - It asks for posts, never for names. Section 8(1)(j) now reads "information
     which relates to personal information" (Digital Personal Data Protection Act
     2023, s 44(3)), with no public-interest override inside the clause.
   - It never claims the 48-hour proviso of section 7(1). Nothing read supports
     using it for a past event, and a wrong claim costs credibility with the office.
   - It keeps to characters the rtionline.gov.in text box accepts (letters, digits
     and , . - _ ( ) / @ : & ? \ %), because a rejected character is a failed
     filing. No quotation marks, apostrophes or semicolons.
   - It never invites email as a filing. Rule 3 of the 2012 Rules ties the
     application to a Rs 10 fee and no page read says email alone is valid.
   ========================================================================== */

(function () {
  'use strict';

  var ui = WGO.ui;
  var STORE = 'wgo-rti-sender';

  function load() {
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORE) || '{}') || {}; } catch (e) { saved = {}; }
    return saved;
  }
  function save(state) {
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* private mode */ }
  }

  function who(state) {
    return {
      name: (state.name || '').trim() || '[your name]',
      address: (state.address || '').trim() || '[your postal address]'
    };
  }

  /* Plain text for the portal's character set. */
  function clean(text) {
    return String(text)
      .replace(/[‘’]/g, '')
      .replace(/[“”"]/g, '')
      .replace(/'/g, '')
      .replace(/;/g, ',')
      .replace(/[–—]/g, '-');
  }

  function policeText(inc, auth, state) {
    var me = who(state);
    var lines = [
      'To',
      'The Public Information Officer',
      auth.route === 'unknown' ? '[the police office concerned]' : auth.name,
      '',
      'Subject: Request under section 6(1) of the Right to Information Act 2005 for records relating to police deployment at ' + inc.place + ' on ' + inc.date,
      '',
      'I am a citizen of India. I request certified copies of the following records held by your office, relating to the events at ' + inc.place + ' on ' + inc.date + ':',
      '',
      '(a) Any order, written instruction, message, or wireless or telephone log entry by which the deployment of police personnel at this place was directed, with the file noting on which it was based.',
      '(b) The document or documents showing the designation, rank and unit of the officer who issued that direction and of the officer who recorded it.',
      '(c) Any written permission for the gathering or march, or refusal of permission, and any order under the prohibitory provisions of the criminal procedure law that applied to the place on those dates, with its date and issuing authority.',
      '(d) The general diary entries of the police station concerned for those dates, and the control room or PCR call log entries.',
      '(e) Any written record of a decision to use lathi, water cannon, tear gas or other force, or to detain persons, and any use of force report.',
      '(f) The register or list of persons detained, with the time of detention and release and the police station where they were held.',
      '(g) Any inquiry order, report or terms of reference relating to these events.',
      '(h) The FIR registered in respect of these events, if any, or the written decision not to upload it under the Supreme Court direction in Youth Bar Association of India v Union of India (2016).',
      '',
      'If no written record is held for item (a), please state that no such record is held and identify the record in which the deployment was noted.',
      '',
      'I am not asking for the names of individual personnel. Where a record contains personal particulars, I request that they be severed under section 10 and the rest supplied. If any part is claimed to be exempt, please supply the remainder, and state the exemption relied on and the post of the officer who decided it.',
      '',
      'I request copies in electronic form where available. The fee of Rs 10 is paid with this application.',
      '',
      'Name: ' + me.name,
      'Address for reply: ' + me.address
    ];
    return clean(lines.join('\n'));
  }

  function institutionText(inc, auth, state) {
    var me = who(state);
    var lines = [
      'To',
      'The Public Information Officer',
      auth.name,
      '',
      'Subject: Request under section 6(1) of the Right to Information Act 2005 for records relating to events at ' + inc.place + ' on ' + inc.date,
      '',
      'I am a citizen of India. I request certified copies of the following records held by your institution, relating to the events at ' + inc.place + ' on ' + inc.date + ':',
      '',
      '(a) Any written request, letter, message or call log by which police or security forces were asked to enter or act on the premises, with the file noting on which it was based.',
      '(b) The document showing the designation of the officer who made or approved that request.',
      '(c) Any written permission for the gathering or march, or refusal of permission, and any notice issued to students about it.',
      '(d) Any communication received from police or security forces about their presence on the premises on those dates.',
      '(e) Any inquiry order, committee report or terms of reference relating to these events.',
      '(f) The CCTV recording from the cameras covering the place, for the period of the events, or the written record of how long recordings are kept and whether these were preserved.',
      '',
      'If no written record is held for item (a), please state that no such record is held. I am not asking for names of individuals. Where a record contains personal particulars, I request that they be severed under section 10 and the rest supplied.',
      '',
      'I request copies in electronic form where available. The fee of Rs 10 is paid with this application.',
      '',
      'Name: ' + me.name,
      'Address for reply: ' + me.address
    ];
    return clean(lines.join('\n'));
  }

  function nhrcText(inc, caseNo, state) {
    var me = who(state);
    var lines = [
      'To',
      'The Public Information Officer',
      'National Human Rights Commission, Manav Adhikar Bhavan, C-Block, GPO Complex, INA, New Delhi 110023',
      '',
      'Subject: Request under section 6(1) of the Right to Information Act 2005 for the file in NHRC case number ' + caseNo,
      '',
      'I am a citizen of India. The Commission registered case number ' + caseNo + ' concerning the events at ' + inc.place + ' on ' + inc.date + '. I request certified copies of the following:',
      '',
      '(a) The complaint or the record of cognizance by which the case was registered.',
      '(b) Every report, action taken report and reply received from the police, the district administration or any other authority in this case, with covering letters.',
      '(c) The report of any spot inquiry or investigation team, with its terms of reference.',
      '(d) The directions or recommendations of the Commission in this case, and any compliance report received on them.',
      '(e) The order closing the case, if it is closed.',
      '',
      'If part of the file is claimed to be exempt, please supply the remainder under section 10, and state the exemption relied on and the post of the officer who decided it. I am not asking for the names of complainants or witnesses.',
      '',
      'I request copies in electronic form where available. The fee of Rs 10 is paid with this application.',
      '',
      'Name: ' + me.name,
      'Address for reply: ' + me.address
    ];
    return clean(lines.join('\n'));
  }

  /* One block per application: who it goes to, how to file, the text. */
  function authorityBlock(auth, text, idBase, opts) {
    opts = opts || {};
    var rows = [];
    if (auth.pio) { rows.push(['Goes to', auth.pio]); }
    if (auth.address) { rows.push(['Address', auth.address]); }
    if (auth.fee) { rows.push(['Fee', auth.fee]); }
    var how;
    if (auth.route === 'central') {
      how = 'File online on <a href="' + ui.esc(auth.portal ? auth.portal.url : 'https://rtionline.gov.in/') + '" rel="noopener">' +
        ui.esc(auth.portal ? auth.portal.label : 'rtionline.gov.in') + '</a>. Paste the text into the request box (the box takes 3,000 characters; this text fits) and pay the fee there.';
    } else if (auth.route === 'state' && auth.portal) {
      how = 'File on the state portal, <a href="' + ui.esc(auth.portal.url) + '" rel="noopener">' + ui.esc(auth.portal.label) + '</a>, or by post with the fee. Do not use rtionline.gov.in for this one.';
    } else if (auth.route === 'post') {
      how = 'File by post or in person with the fee. No online route was found.';
    } else {
      how = 'We could not verify this route. Find the state RTI portal or the office\'s published PIO, check the fee under the state rules, and file there.';
    }
    var html = '<div class="gap-block" style="margin-top:1rem">' +
      '<p class="kicker">' + ui.esc(opts.kicker || 'Application') + '</p>' +
      '<h4 style="margin:0.2rem 0 0.4rem">' + ui.esc(auth.route === 'unknown' ? 'Police office concerned (route not verified)' : auth.name) + '</h4>' +
      '<dl class="small" style="margin:0 0 0.6rem">' + rows.map(function (r) {
        return '<dt style="font-weight:600;margin-top:0.3rem">' + ui.esc(r[0]) + '</dt><dd style="margin:0">' + ui.esc(r[1]) + '</dd>';
      }).join('') + '</dl>' +
      '<p class="small">' + how + '</p>';
    if (auth.list) {
      html += '<p class="small"><a href="' + ui.esc(auth.list.url) + '" rel="noopener">' + ui.esc(auth.list.label) + '</a></p>';
    }
    if (auth.note) { html += '<p class="small">' + ui.esc(auth.note) + '</p>'; }
    if (auth.caveat) { html += '<p class="small"><strong>Check before filing:</strong> ' + ui.esc(auth.caveat) + '</p>'; }
    if (auth.checked) { html += '<p class="small">Details read from the authority\'s own pages on ' + ui.esc(auth.checked) + '.</p>'; }

    var id = 'rti-' + idBase;
    html += '<pre class="appeal__draft" id="' + ui.esc(id) + '" tabindex="0" role="region" aria-label="Draft application">' + ui.esc(text) + '</pre>' +
      '<div class="row" style="margin-top:0.6rem;gap:0.4rem;flex-wrap:wrap">' +
        '<button class="btn btn--small" type="button" data-copy="' + ui.esc(id) + '">Copy the application</button>';
    if (auth.email) {
      /* A courtesy copy only. The application itself needs its fee and a route that
         records receipt, so the mail link is worded as a copy and never as the filing. */
      var msg = {
        to: auth.email,
        cc: '',
        subject: 'Copy of RTI application filed for records on ' + opts.subject,
        body: 'This is a copy of an application under the Right to Information Act 2005, filed with the fee through the prescribed route. It is sent so that your office has early notice of the records requested.\n\n' + text
      };
      html += '<a class="btn btn--small btn--ghost" href="' + ui.esc(ui.mailtoUrl(msg)) + '">Email a copy to the PIO</a>';
    }
    html += '</div>';
    if (auth.email) {
      html += '<p class="small" style="margin-top:0.5rem">The email is a courtesy copy to ' + ui.esc(auth.email) +
        '. It does not file the application: the Act and Rule 3 of the 2012 Rules require the fee with it, and nothing we read says an unpaid email is valid.</p>';
    }
    html += '</div>';
    return html;
  }

  function card(inc, state, route) {
    var keys = WGO.rtiAuthorities;
    var primary = keys[route.police] || keys.unverified;
    var parts = [];
    parts.push(authorityBlock(primary, policeText(inc, primary, state), inc.id + '-police', { kicker: 'Police records', subject: inc.place + ', ' + inc.date }));
    (route.also || []).forEach(function (k) {
      var a = keys[k];
      if (a) { parts.push(authorityBlock(a, institutionText(inc, a, state), inc.id + '-' + k, { kicker: 'Institution records', subject: inc.place + ', ' + inc.date })); }
    });
    if (route.nhrc) {
      parts.push(authorityBlock(keys.nhrc, nhrcText(inc, route.nhrc, state), inc.id + '-nhrc', { kicker: 'NHRC case file', subject: 'NHRC case ' + route.nhrc }));
    }
    return '<details class="explainer" id="' + ui.esc(inc.id) + '" style="margin-top:0.8rem">' +
      '<summary>' + ui.esc(inc.date + ' · ' + inc.title) + '</summary>' +
      '<div class="explainer__body">' +
        '<p class="small">' + ui.esc(inc.place + ', ' + inc.state) + ' · <a href="investigation.html?id=' + ui.esc(inc.slug) + '">Incident record</a></p>' +
        parts.join('') +
      '</div></details>';
  }

  function render(state) {
    var list = document.querySelector('[data-region="kit-list"]');
    if (!list) { return; }
    var open = {};
    Array.prototype.forEach.call(list.querySelectorAll('details[open]'), function (d) { open[d.id] = true; });
    var incs = (WGO.incidents || []).slice().sort(function (a, b) { return a.isoDate < b.isoDate ? 1 : -1; });
    list.innerHTML = incs.map(function (inc) {
      return card(inc, state, WGO.rtiRoutes[inc.id] || { police: 'unverified' });
    }).join('');
    Object.keys(open).forEach(function (id) {
      var d = document.getElementById(id);
      if (d) { d.open = true; }
    });
    var h = (location.hash || '').replace('#', '');
    if (h) {
      var t = document.getElementById(h);
      if (t && t.tagName === 'DETAILS') { t.open = true; }
    }
    var count = document.querySelector('[data-region="kit-count"]');
    if (count) {
      var verified = incs.filter(function (i) {
        var r = WGO.rtiRoutes[i.id];
        return r && r.police !== 'unverified';
      }).length;
      count.textContent = incs.length + ' incidents. ' + verified + ' have a police route read from the authority\'s own pages; ' +
        (incs.length - verified) + ' are marked as not verified and say so.';
    }
  }

  function boot() {
    var state = load();
    var form = document.querySelector('[data-region="kit-form"]');
    if (form) {
      form.innerHTML = '<div class="grid grid--2">' +
        '<label class="field"><span>Your name</span><input type="text" data-field="name" value="' + ui.esc(state.name || '') + '" autocomplete="off"></label>' +
        '<label class="field"><span>Your postal address</span><input type="text" data-field="address" value="' + ui.esc(state.address || '') + '" autocomplete="off">' +
        '<small class="field__hint">A reply has to go somewhere. One line is enough.</small></label></div>';
    }
    document.addEventListener('input', function (e) {
      var el = e.target.closest('[data-field]');
      if (!el) { return; }
      state[el.getAttribute('data-field')] = el.value;
      save(state);
      render(state);
    });
    render(state);
    ui.bindCopy(document);
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', boot); } else { boot(); }
}());
