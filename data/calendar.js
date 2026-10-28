/* =============================================================================
   Calendar: dated proceedings and sittings, coming up and past
   -----------------------------------------------------------------------------
   Rendered on events.html. This is a different pool from WGO.events in
   records.js, which is the incident timeline: a chronology of what happened at
   an incident, empty until a document fixes a time. Nothing here says what
   happened at an incident. It lists when a court or a committee sits or ruled.

   Hand-edited, like records.js. Each entry points at the evidence record that
   holds its source, and the page takes the state, the source and the retrieval
   date from that record. An event cannot carry a state of its own, so it cannot
   claim more than the evidence behind it. An event with no evidence record does
   not render, and tools/check.js fails on one.

   Fields
     id            CAL-NNNN, never reused
     date          ISO date of the first day
     endDate       ISO date of the last day, only when the source gives one
     time          the hours as the source states them, or omitted
     kind          a key of WGO.CALENDAR_KINDS
     title         what the event is, in plain words
     place         where, as the source states it
     what          one or two sentences, taken from the evidence record's claim
     incidentIds   the incidents the event concerns
     evidenceIds   the evidence records behind it; the first one sets the state
     dateNote      only where the date is the order's reported date or was
                   worked out from a relative day, and says which
     quotes        optional: [{ outlet, text }], the source's own words, copied
                   exactly. Leave it out rather than write a paraphrase here.

   Whether an event is coming up or past is worked out in the browser from the
   date in India on the day it is read. Nothing here records "upcoming".
   ========================================================================== */

window.WGO = window.WGO || {};

WGO.CALENDAR_KINDS = {
  'committee-sitting': 'Committee sitting',
  'court-hearing':     'Court hearing',
  'court-order':       'Court order'
};

WGO.calendar = [
  {
    id: 'CAL-0009',
    date: '2026-10-29',
    time: 'Proceedings from 11 am. Walk-in hours for the public, 11.30 am to 3 pm.',
    kind: 'committee-sitting',
    title: 'High Powered Enquiry Committee sits to hear affected persons and record evidence',
    place: 'The Committee\'s office, Shiksha Sadan, 17 Rouse Avenue Institutional Area, New Delhi',
    what: 'The Supreme Court\'s High Powered Enquiry Committee will hear affected persons and record evidence on the alleged use of pellet guns and the harassment of female protesters during the July Jantar Mantar protests. Members of the public and anyone affected by the violence can walk in with valid identity documentation to submit complaints or representations or to present evidence. The reports say the Committee will also examine targeted violence, excessive force, and property damage on both sides.',
    incidentIds: ['INC-0001'],
    evidenceIds: ['PROC-SC-025', 'PROC-SC-017', 'PROC-SC-016'],
    dateNote: 'PTI reported the sitting on Saturday 24 October 2026. The first version gave two days, 29 and 30 October. The officials then clarified that it is a day-long sitting on 29 October, and that is the version recorded here. Several outlets, among them Business Standard, The New Indian Express and Economic Times Legal, still carried the two-day version on 28 October 2026. The Committee\'s own notice has not been read (OQ-067), so anyone planning to attend should check it.',
    quotes: [
      {
        outlet: 'Rediff, carrying PTI',
        text: 'will hold a sitting here on October 29 to hear the affected persons and record evidence on the alleged use of pellet guns and harassment of female protesters, officials said on Saturday.'
      },
      {
        outlet: 'Rediff, carrying PTI',
        text: 'Earlier, the officials had said that the hearing would be held over a period of two days -- October 29 and 30 -- but later they clarified that it would a day-long sitting on October 29.'
      }
    ]
  },
  {
    id: 'CAL-0008',
    date: '2026-09-10',
    kind: 'court-order',
    title: 'Supreme Court declines to reconstitute the Committee',
    place: 'Supreme Court of India',
    what: 'A bench of the Chief Justice, Justice Joymalya Bagchi and Justice V. Mohana declined to reconstitute the Committee, recorded that a separate online portal may be created for vulnerable witnesses, and requested the Committee to protect their identities.',
    incidentIds: ['INC-0001'],
    evidenceIds: ['PROC-SC-019', 'PROC-SC-011']
  },
  {
    id: 'CAL-0007',
    date: '2026-09-01',
    kind: 'court-order',
    title: 'Supreme Court order under Article 142 on the FIRs over the 20 to 25 July protests',
    place: 'Supreme Court of India',
    what: 'The order is reported to direct that FIRs registered anywhere in India over the protests of 20 to 25 July be treated as closed and that no fresh FIR be registered, except one that Delhi Police may pursue concerning 2,873 persons said to have serious criminal antecedents.',
    incidentIds: ['INC-0001'],
    evidenceIds: ['PROC-SC-014'],
    dateNote: 'The date is the order\'s date as reported.'
  },
  {
    id: 'CAL-0006',
    date: '2026-08-24',
    kind: 'court-hearing',
    title: 'Chief Justice says the Committee must treat the allegations by women protesters as a priority',
    place: 'Supreme Court of India',
    what: 'The Chief Justice is reported to have said that the order of 18 August already requires the Committee to examine allegations of sexual assault, harassment and violence against women protesters as a priority, and to have directed an interim report on them at the earliest. The Court is reported to have declined to take suo motu cognisance.',
    incidentIds: ['INC-0001'],
    evidenceIds: ['PROC-SC-010']
  },
  {
    id: 'CAL-0005',
    date: '2026-08-18',
    kind: 'court-order',
    title: 'Supreme Court constitutes the High Powered Enquiry Committee',
    place: 'Supreme Court of India',
    what: 'In W.P.(Crl.) No. 280/2026 and connected matters the Court constituted a five-member Committee chaired by Justice (Retd.) R. Subhash Reddy to inquire into the incidents of violence at Jantar Mantar and outside Delhi in July 2026, and directed police and other agencies to preserve footage and records and hand the record to the Committee.',
    incidentIds: ['INC-0001'],
    evidenceIds: ['PROC-SC-018', 'PROC-SC-006']
  },
  {
    id: 'CAL-0004',
    date: '2026-08-13',
    kind: 'court-hearing',
    title: 'Supreme Court agrees to hear the petition on facial recognition at Jantar Mantar',
    place: 'Supreme Court of India',
    what: 'The Court is reported to have agreed to hear the petition titled Adv A.A. Rahim MP v. Union of India and Ors. and to have tagged it with a pending matter.',
    incidentIds: ['INC-0001'],
    evidenceIds: ['PROC-SC-007']
  },
  {
    id: 'CAL-0003',
    date: '2026-08-03',
    kind: 'court-order',
    title: 'Supreme Court clarifies "criminal antecedents" and asks the Union to disclose standing orders on pellet guns',
    place: 'Supreme Court of India',
    what: 'The Court is reported to have clarified that "criminal antecedents" in its order of 28 July refers only to persons accused of grave and heinous offences, and to have held that the NCT of Delhi and the State governments are at liberty to close or withdraw the cases in accordance with law. In the pellet-gun petition it is reported to have said it would lay down a protocol and to have directed the Union to file an affidavit disclosing any standing orders.',
    incidentIds: ['INC-0001'],
    evidenceIds: ['PROC-SC-013', 'PROC-SC-008'],
    dateNote: 'The date is the order\'s date as reported.'
  },
  {
    id: 'CAL-0002',
    date: '2026-07-30',
    kind: 'court-hearing',
    title: 'Supreme Court hearing on the use of pellet guns at Jantar Mantar',
    place: 'Supreme Court of India',
    what: 'In Yashovardhan Azad and Others v. Union of India and Others the Court is reported to have directed Delhi Police to place on record its standard operating procedure on pellet guns, to have directed that the ammunition log of the Rapid Action Force deployed at Jantar Mantar on 20 July be preserved, and to have sought the Union\'s response on the rules governing such weapons.',
    incidentIds: ['INC-0001'],
    evidenceIds: ['PROC-SC-008']
  },
  {
    id: 'CAL-0001',
    date: '2026-07-28',
    kind: 'court-order',
    title: 'Supreme Court interim order on the student protesters',
    place: 'Supreme Court of India',
    what: 'The interim order is reported to direct that no coercive action be taken against the student protesters except those with criminal antecedents, that detained minors be released, and that police preserve CCTV footage, drone recordings and call logs. It is also reported to restrain publication of protesters\' personal data and to record a prima facie case for an independent inquiry.',
    incidentIds: ['INC-0001'],
    evidenceIds: ['PROC-SC-012'],
    dateNote: 'The date is the order\'s date as reported.'
  }
];
