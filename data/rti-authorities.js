/* =============================================================================
   rti-authorities.js — who an RTI application goes to, and how
   -----------------------------------------------------------------------------
   Hand-written. Every field here was read from the authority's own page on the
   date in `checked`, or it is absent. A missing field means "not verified", never
   "none": the sandbox these were gathered from was refused by most .gov.in sites,
   so the gaps are large and are shown on the page as gaps.

   No officer is named. Designations only: a post outlasts a posting, and since the
   Digital Personal Data Protection Act amended section 8(1)(j) of the RTI Act the
   names of individual officers invite a refusal.

   `route`:
     central  filed on rtionline.gov.in, Rs 10, authority must be on that portal
     state    the state's own portal or post, fee under the state rules
     post     no online route was found; file by post or in person
   `emailRti` is null everywhere: no page read says email alone is a valid filing,
   and Rule 3 of the 2012 Rules ties the application to a Rs 10 fee.
   ========================================================================== */

window.WGO = window.WGO || {};

WGO.rtiAuthorities = {
  'delhi-police': {
    name: 'Delhi Police',
    route: 'central',
    portal: { label: 'rtionline.gov.in', url: 'https://rtionline.gov.in/' },
    fee: 'Rs 10 on the portal (central RTI Rules 2012; Delhi Police pages do not restate it).',
    pio: 'Public Information Officer of the police district that covers the place. Each of the 15 districts has an Additional DCP-I as PIO and the DCP as first appellate authority. Headquarters: DCP/HQ-II, Delhi Police Headquarters, Jai Singh Road, New Delhi 110001.',
    note: 'The list names no police-station PIO, so a request about a station appears to go to its district PIO. That routing is an inference from the list, not a stated rule. Pick the district on the portal, or use the list below.',
    list: { label: 'Delhi Police PIO and appellate list (Manual 16)', url: 'https://delhipolice.gov.in/RTImanualFiles/92021_Manual%20-16%20New.pdf' },
    checked: '10 October 2026',
    caveat: 'The list is dated 3 April 2025. Check the current designation before you file.'
  },
  'up-police': {
    name: 'Uttar Pradesh Police',
    route: 'state',
    portal: { label: 'rtionline.up.gov.in', url: 'https://rtionline.up.gov.in/' },
    fee: 'Rs 10 under the UP RTI Rules 2015, rule 5. Online payment by net banking, card or UPI. Offline: cash, demand draft, banker\'s cheque or Indian postal order.',
    pio: 'Police Headquarters: Additional Superintendent of Police (Public Grievance), with the Deputy Inspector General in charge (Public Grievance) as first appellate authority. Lucknow Commissionerate: first appeal to the Police Commissioner. Aligarh: Additional SP as PIO, SSP as first appellate authority.',
    address: 'Police Headquarters, 9th Floor, Tower 2, Gomtinagar Extension, Shahid Path, Lucknow.',
    note: 'The state portal says not to use it for central bodies or the Allahabad High Court. Lucknow\'s PIO is ambiguous between two posts in the manual, so confirm it. The DGP email on the headquarters site is a control-room address, not an RTI address.',
    checked: '10 October 2026'
  },
  'mumbai-police': {
    name: 'Mumbai Police',
    route: 'state',
    portal: { label: 'rtionline.maharashtra.gov.in', url: 'https://rtionline.maharashtra.gov.in/' },
    fee: 'Rs 10 application and Rs 20 first appeal under the Maharashtra RTI Rules 2026 (gazette of 7 July 2026, read in Marathi). One subject per application, normally within 150 words.',
    pio: 'Head office: Senior Administrative Officer of the relevant cell. First appeal: DCP (Headquarters-1). Shivaji Park police station: Police Inspector (Administration), with DCP Zone 5 as first appellate authority.',
    address: 'Commissioner of Police office, New Building, D.N. Road, Mumbai 400001. Shivaji Park police station: Ram Niwas, Ram Maruti Road, Dadar (W), Mumbai 400028.',
    note: 'The 150-word guide means a Maharashtra application is better split into one subject per filing than sent as one long list.',
    checked: '10 October 2026',
    caveat: 'Addresses were read from scanned pages. Check them against the PDFs.'
  },
  'pune-police': {
    name: 'Pune City Police',
    route: 'state',
    portal: { label: 'rtionline.maharashtra.gov.in', url: 'https://rtionline.maharashtra.gov.in/' },
    fee: 'As for Mumbai: Rs 10 under the Maharashtra RTI Rules 2026.',
    pio: 'Assistant Commissioner of Police (Administration), Commissioner\'s office. First appeal: DCP (Headquarters).',
    address: 'Commissioner of Police office, Sadhu Vaswani Chowk, Camp, Pune 411001.',
    note: 'Deccan Gymkhana police station is not on Pune Police\'s RTI disclosure list, so use the Commissioner\'s office row.',
    checked: '10 October 2026'
  },
  'chandigarh-police': {
    name: 'Chandigarh Police',
    route: 'central',
    portal: { label: 'rtionline.gov.in', url: 'https://rtionline.gov.in/' },
    fee: 'Rs 10 on the portal. The portal lists "UT Chandigarh - Police" among its authorities.',
    pio: 'Deputy Superintendent of Police by unit. First appeal: SSP UT Chandigarh for divisions and headquarters, SP Headquarters for other branches.',
    address: 'Police Headquarters, Sector 9-D, Chandigarh 160009.',
    note: 'The Chandigarh Administration\'s own RTI pages could not be reached, so the portal route rests on the portal\'s authority list alone.',
    checked: '10 October 2026'
  },
  'patna-police': {
    name: 'Patna Police',
    route: 'state',
    portal: { label: 'jaankari.bihar.gov.in', url: 'https://jaankari.bihar.gov.in/' },
    fee: 'Not verified. A search excerpt said Rs 10, but the page was not read.',
    pio: 'DIG-cum-Senior Superintendent of Police, Patna. First appeal: Inspector General, Central Range, Patna. Separate PIOs exist for city and rural SPs, traffic and each station house officer.',
    address: 'Opposite Gate No. 5, Gandhi Maidan, Patna 800001 (read from a scanned Hindi letter of 29 July 2024; confirm against the PDF).',
    email: 'ssp-patna-bih@nic.in',
    note: 'The portal takes applications, first appeals and second appeals, with phone help on 155311 and 155310. The email is the published PIO address. Nothing read says an email alone is a valid filing.',
    checked: '10 October 2026',
    caveat: 'Katihar, Munger and Siwan police offices were not verified.'
  },
  'nhrc': {
    name: 'National Human Rights Commission',
    route: 'central',
    portal: { label: 'rtionline.gov.in', url: 'https://rtionline.gov.in/' },
    fee: 'Rs 10 on the portal, or IPO, demand draft or cash drawn in favour of the NHRC, New Delhi.',
    pio: 'Section-wise PIOs under a Nodal Officer (Assistant Registrar, Law). First appeal: Joint Registrar (Law) for the Full Commission and reporting branches, Deputy Registrar (Law) for scrutiny branches.',
    address: 'Manav Adhikar Bhavan, C-Block, GPO Complex, INA, New Delhi 110023.',
    note: 'Quote the case number. It lets the Nodal Officer route the filing to the right branch.',
    checked: '10 October 2026'
  },
  'jmi': {
    name: 'Jamia Millia Islamia',
    route: 'central',
    portal: { label: 'rtionline.gov.in', url: 'https://rtionline.gov.in/' },
    fee: 'Rs 10 on the portal.',
    pio: 'CPIO (University Sector), who is also the nodal officer. First appeal: the Registrar.',
    address: 'RTI Section, Administration Block, Mir Taqi Mir Building, Gate No. 15, Jamia Nagar, New Delhi 110025.',
    email: 'cpio@jmi.ac.in',
    note: 'The email is printed on the university\'s own page. The Chief Proctor\'s office has no separate CPIO row, so the nodal CPIO is the default.',
    checked: '10 October 2026'
  },
  'jnu': {
    name: 'Jawaharlal Nehru University',
    route: 'central',
    portal: { label: 'rtionline.gov.in', url: 'https://rtionline.gov.in/' },
    fee: 'Rs 10 on the portal.',
    pio: 'Nodal CPIO: Deputy Registrar (Nodal Office, RTI). For the Chief Proctor\'s office the CPIO is the Private Secretary there, and the first appellate authority is the Chief Proctor.',
    address: 'Room 134, Administrative Block, JNU, New Delhi 110067.',
    email: 'cpio@mail.jnu.ac.in',
    note: 'The email comes from a list tied to a 2019 notification, so postings may have changed.',
    checked: '10 October 2026'
  },
  'panjab-university': {
    name: 'Panjab University',
    route: 'post',
    fee: 'Rs 10. Demand draft, banker\'s cheque or IPO, cash at the SBI extension counter, or online at payonline.puchd.ac.in.',
    pio: 'Deputy Registrar (RTI Cell). The Dean of Student Welfare is also a listed PIO. First appeal: the Registrar.',
    address: 'Room 93, Administrative Block, Sector 14, Chandigarh 160014.',
    email: 'drrti@pu.ac.in',
    note: 'No online RTI portal was found. The fee rules come from an older instruction PDF and the PIO list is undated.',
    checked: '10 October 2026'
  },
  'ftii': {
    name: 'Film and Television Institute of India',
    route: 'central',
    pio: 'Five subject-wise PIOs: Dean (Films), Dean (Television), Chief Accounts Officer, Controller of Examinations and Administrative Officer (CPIO). First appeal: the Registrar.',
    address: 'Law College Road, Pune 411004.',
    note: 'The page gives no fee, portal or email policy. Confirm that FTII is on rtionline.gov.in before you rely on that route.',
    checked: '10 October 2026'
  },
  'unverified': {
    name: 'Not verified',
    route: 'unknown',
    note: 'We could not reach this state\'s RTI portal, rules or police pages from the network these were gathered on, and we do not guess. Find the state\'s own RTI portal or the police department\'s published Public Information Officer, check the fee under the state\'s rules, then use the text below. Do not file it on rtionline.gov.in: that portal returns state applications without refund.'
  }
};

/* Incident -> where its application goes.
   `police` is the key above. `nhrc` is the case number where the NHRC has registered one
   (each is in the evidence library). `also` lists a second public authority worth asking.
   An incident missing from this table gets the unverified route. */
WGO.rtiRoutes = {
  'INC-0001': { police: 'delhi-police' },
  'INC-0006': { police: 'delhi-police' },
  'INC-0008': { police: 'delhi-police' },
  'INC-0009': { police: 'delhi-police', also: ['jnu'] },
  'INC-0012': { police: 'delhi-police', also: ['jmi'], nhrc: '5630/30/0/2019' },
  'INC-0014': { police: 'delhi-police', also: ['jnu'] },
  'INC-0018': { police: 'delhi-police' },
  'INC-0020': { police: 'delhi-police' },
  'INC-0022': { police: 'delhi-police', also: ['jmi'] },
  'INC-0025': { police: 'delhi-police' },
  'INC-0030': { police: 'delhi-police', also: ['jnu'] },
  'INC-0031': { police: 'delhi-police', also: ['jnu'] },
  'INC-0035': { police: 'delhi-police', also: ['jmi'] },
  'INC-0040': { police: 'delhi-police', also: ['jmi'] },
  'INC-0043': { police: 'delhi-police' },
  'INC-0044': { police: 'delhi-police' },
  'INC-0047': { police: 'delhi-police' },
  'INC-0011': { police: 'up-police', nhrc: '29136/24/72/2017-WC' },
  'INC-0013': { police: 'up-police', nhrc: '1018/24/3/2020' },
  'INC-0029': { police: 'up-police' },
  'INC-0033': { police: 'up-police' },
  'INC-0038': { police: 'up-police' },
  'INC-0003': { police: 'mumbai-police' },
  'INC-0007': { police: 'mumbai-police' },
  'INC-0017': { police: 'pune-police', also: ['ftii'] },
  'INC-0021': { police: 'chandigarh-police', also: ['panjab-university'] },
  'INC-0048': { police: 'chandigarh-police', also: ['panjab-university'] },
  'INC-0002': { police: 'patna-police' },
  'INC-0026': { police: 'patna-police' },
  'INC-0027': { police: 'patna-police' },
  'INC-0042': { police: 'patna-police' },
  'INC-0046': { police: 'patna-police' },
  'INC-0049': { police: 'delhi-police' },
  'INC-0050': { police: 'delhi-police' },
  'INC-0054': { police: 'mumbai-police' },
  'INC-0058': { police: 'delhi-police' },
  'INC-0059': { police: 'delhi-police' },
  'INC-0060': { police: 'chandigarh-police', also: ['panjab-university'] },
  'INC-0062': { police: 'delhi-police' },
  'INC-0063': { police: 'delhi-police' },
  'INC-0066': { police: 'delhi-police', also: ['jnu'] },
  'INC-0067': { police: 'delhi-police' },
  'INC-0069': { police: 'unverified' },
  'INC-0072': { police: 'delhi-police', also: ['jnu'] },
  'INC-0073': { police: 'delhi-police' },
  'INC-0077': { police: 'delhi-police', also: ['jnu'] },
  'INC-0081': { police: 'delhi-police' },
  'INC-0083': { police: 'unverified' },
  'INC-0086': { police: 'patna-police' },
  'INC-0015': { police: 'unverified', nhrc: '2363/25/5/2024' },
  'INC-0028': { police: 'unverified', nhrc: '1511/25/16/2018' }
};
