/* =============================================================================
   letters.html — the preservation representations, ready to send
   -----------------------------------------------------------------------------
   FQ-001 is the archive's most urgent open item and its method has read "speed
   post to each office" since it was written, with four unsent drafts sitting in
   correspondence/. Post is still the better evidence of despatch where an
   address is known, and this archive holds one address out of four. For the
   other three, email is the route, and a letter nobody has to retype is a
   letter that gets sent.

   The text is not written here. It is parsed out of correspondence/*.md by
   tools/build-letters.js into WGO.letters, and CI fails if the two drift, so
   this page cannot mail a letter the repository does not hold.
   ========================================================================== */

(function () {
  'use strict';

  var ui = WGO.ui;
  var STORE = 'wgo-sender';

  /* The Director General of Police (Crime), Bihar, appears in the same official
     directory as the four addressees (contacts.md, retrieved 18 September 2026).
     Each draft carries an optional "copy to DGP" line, and contacts.md asks for
     the decision to be made once and applied to all four rather than copying
     some and not others — so this is one switch on the page, not four. */
  var DGP = { name: 'The Director General of Police (Crime), Bihar', email: 'dgpcr.pat-bih@gov.in' };

  var FIELDS = [
    { key: 'name',      label: 'Your name',           type: 'text',  hint: 'As you want it to appear at the foot of the letter.' },
    { key: 'address',   label: 'Your postal address', type: 'text',  hint: 'A reply has to go somewhere. One line is enough.' },
    { key: 'email',     label: 'Your email',          type: 'email', hint: '' },
    { key: 'telephone', label: 'Your telephone',      type: 'tel',   hint: '' },
    { key: 'date',      label: 'Date of the letter',  type: 'text',  hint: 'Defaults to today.' }
  ];

  function today() {
    var d = new Date();
    var months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  /* Kept in this browser and nowhere else. The archive has no account system and
     wants none: a name typed here is the sender's own, it is going into their
     own outgoing mail, and it has no business reaching a server of ours. */
  function load() {
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORE) || '{}') || {}; } catch (e) { saved = {}; }
    if (!saved.date) { saved.date = today(); }
    return saved;
  }

  function save(state) {
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* private mode */ }
  }

  function fill(text, state) {
    return text
      .replace(/\[sender name\]/g, state.name || '[sender name]')
      .replace(/\[sender address\]/g, state.address || '[sender address]')
      .replace(/\[email\]/g, state.email || '[email]')
      .replace(/\[telephone\]/g, state.telephone || '[telephone]')
      .replace(/\[date\]/g, state.date || '[date]');
  }

  function message(letter, state, copyDgp) {
    var body = fill(letter.text, state);
    if (copyDgp) { body += '\nCopy to: ' + DGP.name + ' — ' + DGP.email + '\n'; }
    return {
      to: letter.email,
      cc: copyDgp ? DGP.email : '',
      subject: letter.subject,
      body: body
    };
  }

  /* README.md step 5: record the despatch date in correspondence/sent.md
     afterwards. A line nobody has to compose is a line that gets written. */
  function sentLine(letter, state, copyDgp) {
    return '- ' + (state.date || today()) + ' — Preservation representation to ' + letter.addressee +
      ', sent by email to ' + letter.email + (copyDgp ? ', copied to ' + DGP.email : '') +
      '. Sent by ' + (state.name || '[sender name]') + '.';
  }

  function form(state) {
    return '<div class="grid grid--2">' + FIELDS.map(function (f) {
      return '<label class="field">' +
        '<span>' + ui.esc(f.label) + '</span>' +
        '<input type="' + f.type + '" data-field="' + f.key + '" ' +
          'value="' + ui.esc(state[f.key] || '') + '" autocomplete="off">' +
        /* Not a span: `.field > span` is the uppercase label style, and a hint
           set in it reads as a second label. */
        (f.hint ? '<small class="field__hint">' + ui.esc(f.hint) + '</small>' : '') +
      '</label>';
    }).join('') + '</div>' +
    '<label class="row" style="gap:0.5rem;margin-top:1rem;align-items:flex-start">' +
      '<input type="checkbox" data-field="copyDgp"' + (state.copyDgp ? ' checked' : '') + '>' +
      '<span class="small">Copy ' + ui.esc(DGP.name) + ' (<span class="mono">' + ui.esc(DGP.email) +
      '</span>) on all four. Each draft carries this as an optional line; decide once and apply it ' +
      'to every letter rather than copying some and not others.</span>' +
    '</label>';
  }

  function card(letter, state) {
    var msg = message(letter, state, state.copyDgp);
    var id = 'letter-' + letter.id;
    var postal = letter.postal
      ? '<p class="small">Postal address held: <span class="mono">' + ui.esc(letter.postal) +
        '</span>. Post is stronger evidence of despatch than a sent-items entry, so send this one ' +
        'by speed post if you can, and keep the receipt.</p>'
      : '<p class="small">No postal address is held for this office. The Bihar Police directory ' +
        'carries phone, fax and email but no street address, and this district’s own site was ' +
        'returning HTTP 503 when the contacts were gathered. Email, or get the address from the ' +
        'district site when it is back up. Do not invent one.</p>';

    return '<article class="question" id="' + ui.esc(letter.id) + '">' +
      '<p class="kicker">' + ui.esc(letter.district) + '</p>' +
      '<h3 style="margin:0.25rem 0 0.4rem">' + ui.esc(letter.addressee) + '</h3>' +
      '<p class="small mono">' + ui.esc(letter.email) +
        (letter.tel ? ' · Tel ' + ui.esc(letter.tel) : '') +
        (letter.fax ? ' · Fax ' + ui.esc(letter.fax) : '') + '</p>' +
      '<p style="margin-top:0.6rem">' + ui.esc(letter.subject) + '</p>' +
      postal +
      ui.composeRow(msg, { id: id, blockUnfilled: true }) +
      '<details class="explainer" style="margin-top:0.8rem">' +
        '<summary>After you send it</summary>' +
        '<div class="explainer__body">' +
          '<p class="small">Keep the sent item and ask for a delivery receipt. Then add this line ' +
          'to <span class="mono">correspondence/sent.md</span>, or send it to us, so the archive ' +
          'can say what it asked for and when.</p>' +
          '<pre class="appeal__draft cite__text" id="sent-' + ui.esc(letter.id) + '">' +
            ui.esc(sentLine(letter, state, state.copyDgp)) + '</pre>' +
          '<div class="row" style="margin-top:0.5rem">' +
            '<button class="btn btn--small btn--ghost" type="button" data-copy="sent-' +
              ui.esc(letter.id) + '">Copy the line</button>' +
          '</div>' +
        '</div>' +
      '</details>' +
      '<p class="small" style="margin-top:0.6rem">Source: <span class="mono">' +
        ui.esc(letter.source) + '</span></p>' +
    '</article>';
  }

  function render(state) {
    var list = document.querySelector('[data-region="letters-list"]');
    if (!list) { return; }
    var letters = (WGO.letters || []).slice();
    /* Siwan first. It is the best-evidenced of the four (INC-SIW-001,
       CORROBORATED, on the State of Bihar's own affidavit to the Supreme
       Court), it involves the discharge of firearms and injuries, and its own
       draft says to send it first if only one is sent. */
    letters.sort(function (a, b) {
      if (a.district === 'Siwan') { return -1; }
      if (b.district === 'Siwan') { return 1; }
      return a.district.localeCompare(b.district);
    });
    list.innerHTML = letters.map(function (l) { return card(l, state); }).join('');
  }

  function boot() {
    var state = load();
    var formRegion = document.querySelector('[data-region="letters-form"]');
    if (formRegion) { formRegion.innerHTML = form(state); }

    document.addEventListener('input', function (e) {
      var el = e.target.closest('[data-field]');
      if (!el) { return; }
      state[el.getAttribute('data-field')] = el.type === 'checkbox' ? el.checked : el.value;
      save(state);
      render(state);
    });
    document.addEventListener('change', function (e) {
      var el = e.target.closest('[data-field]');
      if (!el || el.type !== 'checkbox') { return; }
      state.copyDgp = el.checked;
      save(state);
      render(state);
    });

    render(state);
    ui.bindCopy(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
