/* =============================================================================
   WhoGaveTheOrder.in — the record store
   -----------------------------------------------------------------------------
   THE SEED RULE
   This file ships EMPTY OF FACTUAL ASSERTIONS. The three investigations exist
   as shells: the questions are populated, the offices that hold authority are
   mapped by statutory role, and every factual field is UNKNOWN until an editor
   attaches a source.

   That is not a placeholder problem to be tidied up later. It is the product:
   a claim without a source ID does not render as a fact anywhere on this site.

   ADDING REAL CONTENT
   1. Add a Source record first. Nothing else can cite what does not exist.
   2. Add the Evidence record, pointing at that source.
   3. Only then set a claim, timeline event, or authority link to a state other
      than UNKNOWN, listing the evidence IDs that carry it.
   Records whose `sourceIds` / `evidenceIds` are empty are drawn by the UI with
   a NO SOURCE ON RECORD marker. Do not remove that marker; fill the array.

   ID CONVENTIONS
     INC-  incident        EVT-  timeline event    PER-  person
     OFC-  office          ORD-  order             WGO-  evidence
     SRC-  source          CLM-  claim             QST-  question
     GOV-  government response                     EXT-  external investigation
   ========================================================================== */

window.WGO = window.WGO || {};

/* --- Sources -------------------------------------------------------------- *
   A Source is where a piece of evidence came from: a publication, a court
   registry, a public information officer, a named witness. Evidence cites
   sources; claims cite evidence. Nothing skips a link in that chain. */
WGO.sources = [];

/* --- People --------------------------------------------------------------- *
   DELIBERATELY EMPTY, AND THIS IS A RULE, NOT A GAP.

   A named individual is added here only when a sourced document places that
   person in the relevant office at the relevant time. Holding an office is not
   evidence of having issued an order. The chain-of-command interface is built
   to work with offices alone precisely so that the archive never has to name a
   person in order to be useful. */
WGO.persons = [];

/* --- Offices -------------------------------------------------------------- *
   Structural map of who is empowered to decide what. `statutoryBasis` entries
   carry their own sourceIds; where that array is empty the interface prints
   NO SOURCE ON RECORD, because an uncited assertion about the law is still an
   uncited assertion. */
WGO.offices = [
  {
    id: 'OFC-0001',
    title: 'Union Ministry of Home Affairs',
    shortTitle: 'Union Home Ministry',
    level: 'UNION',
    jurisdiction: 'Union of India',
    appliesTo: ['INC-0001', 'INC-0002', 'INC-0003', 'INC-0006', 'INC-0008'],
    statutoryBasis: [
      { text: 'Union ministry responsible for internal security and, for Union Territories including Delhi, for the police force itself.', sourceIds: [] }
    ],
    whatWeKnow: [],
    whatWeDontKnow: [
      'Whether any communication passed between this ministry and the forces deployed at any of the three locations.',
      'Whether any situation report was called for, or received, before or after the events.'
    ],
    evidenceIds: [],
    authorisationEvidence: []
  },
  {
    id: 'OFC-0002',
    title: 'State Home Department',
    shortTitle: 'State Home Department',
    level: 'STATE',
    jurisdiction: 'Bihar / Maharashtra',
    appliesTo: ['INC-0002', 'INC-0003', 'INC-0007'],
    statutoryBasis: [
      { text: 'Police is a State subject. The State Home Department is the administrative department for the state police force.', sourceIds: [] }
    ],
    whatWeKnow: [],
    whatWeDontKnow: [
      'Whether any advisory, circular or instruction was issued to the districts ahead of the protests.',
      'Whether any post-incident report was called for.'
    ],
    evidenceIds: [],
    authorisationEvidence: []
  },
  {
    id: 'OFC-0003',
    title: 'Director General of Police (State)',
    shortTitle: 'DGP',
    level: 'SENIOR',
    jurisdiction: 'Bihar / Maharashtra',
    appliesTo: ['INC-0002', 'INC-0003', 'INC-0007'],
    statutoryBasis: [
      { text: 'Head of the state police force; issues force-wide standing orders and directions.', sourceIds: [] }
    ],
    whatWeKnow: [],
    whatWeDontKnow: [
      'Whether any force-wide instruction on handling the protests was issued.',
      'Which officer was in overall charge of the deployment.'
    ],
    evidenceIds: [],
    authorisationEvidence: []
  },
  {
    id: 'OFC-0004',
    title: 'Commissioner of Police',
    shortTitle: 'Commissioner of Police',
    level: 'SENIOR',
    jurisdiction: 'Commissionerate cities, including Delhi',
    appliesTo: ['INC-0001', 'INC-0003', 'INC-0006', 'INC-0007', 'INC-0008'],
    statutoryBasis: [
      { text: 'Head of a city police force under the commissionerate system; in Delhi, the Commissioner of Police heads a force under the Union Home Ministry rather than a state government.', sourceIds: [] },
      { text: 'Exercises certain magisterial powers, including powers relating to public order and assemblies, that are held elsewhere by the District Magistrate.', sourceIds: [] }
    ],
    whatWeKnow: [],
    whatWeDontKnow: [
      'Whether any prohibitory order was in force at the site on the day.',
      'Who approved the deployment plan, and in what form.'
    ],
    evidenceIds: [],
    authorisationEvidence: []
  },
  {
    id: 'OFC-0005',
    title: 'District Magistrate',
    shortTitle: 'District Magistrate',
    level: 'SENIOR',
    jurisdiction: 'District (non-commissionerate)',
    appliesTo: ['INC-0002', 'INC-0003'],
    statutoryBasis: [
      { text: 'Executive magistrate with statutory powers relating to unlawful assembly and the dispersal of assemblies, and with responsibility for requisitioning and directing force in aid of civil power.', sourceIds: [] }
    ],
    whatWeKnow: [],
    whatWeDontKnow: [
      'Whether an executive magistrate was present at the site, as certain dispersal powers contemplate.',
      'Whether any written requisition or direction exists.'
    ],
    evidenceIds: [],
    authorisationEvidence: []
  },
  {
    id: 'OFC-0006',
    title: 'Superintendent of Police / Deputy Commissioner of Police (District)',
    shortTitle: 'SP / DCP',
    level: 'OPERATIONAL',
    jurisdiction: 'District or police district',
    appliesTo: ['INC-0001', 'INC-0002', 'INC-0003', 'INC-0006', 'INC-0007', 'INC-0008'],
    statutoryBasis: [
      { text: 'Officer in operational command of the district police; ordinarily approves deployment strength, the composition of the force and its equipment.', sourceIds: [] }
    ],
    whatWeKnow: [],
    whatWeDontKnow: [
      'Who signed the deployment order, if one exists in writing.',
      'What equipment the deployed units were authorised to carry.'
    ],
    evidenceIds: [],
    authorisationEvidence: []
  },
  {
    id: 'OFC-0007',
    title: 'Officer commanding the deployment on site',
    shortTitle: 'On-site commanding officer',
    level: 'OPERATIONAL',
    jurisdiction: 'The site of the incident',
    appliesTo: ['INC-0001', 'INC-0002', 'INC-0003', 'INC-0006', 'INC-0007', 'INC-0008'],
    statutoryBasis: [
      { text: 'The senior police officer present is ordinarily responsible for decisions on the escalation of force at the scene, within standing orders and any specific direction received.', sourceIds: [] }
    ],
    whatWeKnow: [],
    whatWeDontKnow: [
      'Who the senior officer present was at the time force was used.',
      'What instruction, oral or written, that officer received or gave.',
      'What was recorded in the station diary or equivalent record.'
    ],
    evidenceIds: [],
    authorisationEvidence: []
  },
  {
    id: 'OFC-0008',
    title: 'Field personnel and units deployed',
    shortTitle: 'Field personnel',
    level: 'FIELD',
    jurisdiction: 'The site of the incident',
    appliesTo: ['INC-0001', 'INC-0002', 'INC-0003', 'INC-0006', 'INC-0007', 'INC-0008'],
    statutoryBasis: [
      { text: 'Constabulary, armed reserve and any central armed police units present act under the direction of the officer commanding them.', sourceIds: [] }
    ],
    whatWeKnow: [],
    whatWeDontKnow: [
      'Which units were deployed, in what strength, and drawn from where.',
      'Whether personnel wore identifying numbers, and whether they are legible in any available footage.',
      'What crowd-control equipment was issued, and against what record.'
    ],
    evidenceIds: [],
    authorisationEvidence: []
  }
];

/* --- Orders --------------------------------------------------------------- *
   Empty until an order is located. The investigation page prints
   ORDER NOT YET LOCATED rather than speculating about what an order said. */
/* --- Updates: what the people running this archive have done ------------- *
   A dated notice board, and it has one rule that keeps it inside the site's
   grammar: AN UPDATE MAY ONLY REPORT WHAT THIS ARCHIVE DID, OR WHAT A CLOCK
   DID. It may not say what happened at an incident.

   "We filed an application on this date" is a fact about us. "The reply fell
   due and nothing came" is a fact about a deadline. Both are ours to state.
   "Police used tear gas" is a claim about an incident, and it belongs in an
   evidence record with a source behind it, never here. Without that line an
   updates feed becomes the running commentary this archive exists not to
   write — and the fastest way to launder an unsourced claim into a fact is to
   put it in a news item nobody thinks to check.

   Fields: date (ISO), title, body, and optionally recordId — the record the
   update concerns, which is rendered as a link so a reader can go and check
   the thing itself rather than take the note's word for it.

   Also optionally `correction: true`, which means the entry reports an error
   of THIS ARCHIVE'S, not a finding. Those render in the corrections log on
   about.html and on changes.html, and never in the Latest stream on the
   homepage. That is a placement decision and not a quiet one: the log is
   linked from the corrections policy, which has promised since launch that
   every change is recorded with its date and its reason. Until 23 September
   2026 the promise was kept only in the repository, and the entries that did
   appear were at the top of the front page, so a reader arriving at the site
   met the archive correcting itself before meeting anything it had found.
   A correction has to be findable by someone checking a figure. It does not
   have to be the first thing on the page, and no newspaper prints its
   corrections column on the front. tools/check.js pins both halves: that a
   flagged entry stays out of the Latest stream, and that the log it moves to
   actually exists. */
WGO.updates = [
  {
    date: '2026-10-10',
    title: 'Opposition MPs were detained on 6 and 7 October, and the Delhi High Court will hear the Youth Congress plea on Monday',
    body: 'About 300 opposition MPs marched from Parliament towards the Election Commission on 6 October and were stopped near NITI Aayog, the Tribune reports. On 7 October Delhi Police detained Rahul Gandhi, Priyanka Gandhi Vadra and other leaders near Jantar Mantar, and released them within hours. The Tribune and Siasat agree on where each was taken. The leaders say they were manhandled and Priyanka Gandhi Vadra says she was thrown to the ground, and the report carries no police account. Siasat mentions an FIR against Rahul Gandhi and gives no station or sections. On 9 October the Delhi High Court declined an urgent hearing of the Youth Congress challenge to the refusal of permission and listed it for Monday 12 October.',
    recordId: 'INC-DEL-024'
  },
  {
    date: '2026-10-05',
    title: 'The Jantar Mantar protests ran for three days, and two courts have now been asked about the right to protest there',
    body: 'Nearly 200 more people were detained on Saturday 3 October as AISA and others returned, and around 110 on the Sunday when the Indian Youth Congress marched, with police sources putting injuries to police at around 15. Counts for the first day now run from over 500 to about 1,000, and the archive holds none of them from an official statement. Three FIRs were registered on 3 October with no accused named. The Indian Youth Congress has asked the Delhi High Court to set aside the Delhi Police order of 1 October refusing it permission, and on 5 October the Supreme Court agreed to list a separate plea asking that peaceful protests be permitted. The order of 1 October is a written refusal with a date, and a copy sits in a court file, which makes it the cheapest document in this record to ask for.',
    recordId: 'INC-DEL-020'
  },
  {
    date: '2026-10-05',
    title: 'Delhi Police went to the October protests without name tags, and the stated reason is harassment of officers',
    body: 'IBTimes India reports that junior Delhi Police personnel at Jantar Mantar did not wear name tags while most IPS officers kept theirs. Officials are reported to have said the aim was to stop officers being identified and targeted on social media after 20 July, and that junior personnel were told no action would follow if they acted within the law. That is a real harm to officers and their families and is recorded as the police\'s stated reason. It also means a person on the ground cannot be asked who gave an order. One outlet so far.',
    recordId: 'INC-DEL-021'
  },
  {
    date: '2026-10-05',
    title: 'Hundreds were detained at Jantar Mantar on 2 October under a section 163 order, and the sources disagree on who issued it',
    body: 'A new wave of protests began on 2 October, this time over the Chief Election Commissioner and the revision of the electoral rolls. Al Jazeera reports over 500 people detained by about 3 pm; The Week and Outlook report over 700, Outlook attributing the figure to police officials. A section 163 order was in force across New Delhi district. Al Jazeera, citing The Times of India, says Delhi Police imposed it; Outlook says the Delhi government did. The order is a written instrument with a date and a signatory, and it is the first thing worth asking for. Protesters allege being beaten with batons, reported by one outlet; Reuters describes shoving and buses. The archive holds no footage, medical record or police account and does not call this a use of force. It is recorded as its own incident, apart from the July records, because the Supreme Court order of 1 September is reported to cover only the protests of 20 to 25 July.',
    recordId: 'INC-DEL-013'
  },
  {
    date: '2026-10-05',
    title: 'Mumbai Police registered an FIR over the Shivaji Park gathering, and three outlets give three lists of names',
    body: 'On 3 October Mumbai Police registered an FIR at Shivaji Park police station against the organisers of the 2 October gathering and 400 to 500 unidentified supporters, under BNS sections 189 and 223 and Maharashtra Police Act sections 37(1)(3) and 135. Three outlets report that permission had been refused, and ANI gives a Bombay High Court judgment and a government order as the stated ground. No arrests are reported and no force is alleged. The outlets differ on who is named (one organiser, two, or four) and on whether the case rests on a private complaint or was registered by the police. The FIR settles both, and a request for it is queued at FQ-022 with the request for the written refusal of permission.',
    recordId: 'INC-MAH-004'
  },

  {
    date: '2026-09-23',
    title: 'The one criminal file left standing in the whole country is built on a facial recognition list',
    body: 'On 1 September the Supreme Court, under Article 142, directed that every FIR registered anywhere in India over the protests of 20 to 25 July be treated as closed and that no state register a fresh one. It left a single exception: Delhi Police may pursue one FIR concerning 2,873 people said to have serious criminal antecedents. Those 2,873 come from the force\'s own affidavit of 17 August, which says its Facial Recognition System spotted them at the protest site, 2,402 of them matched against Crime Kundli. The Indian Express then took the 205 names on that list facing the gravest charges and checked them against police, prison and court records. At least 25 of them, one in eight, were in Tihar, Mandoli or Rohini jail on the day the software placed them at Jantar Mantar. Delhi Police says verification of all 2,873 is pending and that no action will rest on a match alone, which is the part worth reading twice: the list reached the Supreme Court before the checking did.',
    recordId: 'INC-DEL-009'
  },
  {
    date: '2026-09-23',
    title: 'A court has already ordered the preservation this site has been asking offices for',
    body: 'On 28 July the Supreme Court is reported to have directed police to preserve CCTV footage, drone recordings and call logs, to have barred coercive action against the protesters save those with criminal antecedents, to have ordered detained minors released, and to have restrained publication of protesters\' personal data. The archive held nothing on this order until today, and it changes what a preservation letter is. A letter asking an office to keep footage is one thing; a letter reminding an office that a court has directed it to keep that footage is another. The four letters on this site still cover records the order does not reach: the deployment order, the wireless log, the armoury issue register. Those remain the ask.',
    recordId: 'PROC-SC-012'
  },
  {
    date: '2026-09-23',
    title: 'The Maharashtra record is filled, and the answer is not the one we went looking for',
    body: 'This archive opened a Maharashtra shell on 15 August on the strength of a Supreme Court petition saying disturbances had spread there, and held every field at UNKNOWN because nothing said what had happened. It said so for five weeks. What is on the record is Mumbai: thirteen FIRs between 18 and 22 July against more than four hundred people for protesting without permission, at Shivaji Park, Chaityabhoomi, Chembur and Shiv Sena Bhavan. No use of force in Maharashtra is established and none is alleged. Kochi is now open on the same footing, where 101 people were booked over a solidarity gathering and the FIR says a notice refusing permission had been served. Kolkata and Assam are recorded as evidence without shells, because seven files and five files are not a located incident.',
    recordId: 'INC-MAH-002'
  },
  {
    date: '2026-09-23',
    title: 'What the states did outside Delhi was paperwork, and paperwork has an author',
    body: 'Across five states the response to these protests was the registration of cases rather than the use of force: 694 detained and 355 booked in Bihar, more than 400 booked in Mumbai, 101 in Kochi, about 70 named in seven files in Kolkata, 13 arrested in Assam. Bihar and Assam then withdrew theirs by written notification, Maharashtra by a direction to its home department, and the Supreme Court closed the rest on 1 September. That is the opposite of this archive\'s usual problem. A lathi charge leaves no order and no author; a refusal of permission, an FIR and a withdrawal notification are each written by somebody, carry a date and sit in a file. Note also that Bihar and West Bengal are both reported to have drawn their line at 6 pm on 26 July, which is an odd thing for two states to arrive at separately, and the file noting is where that would be answered.',
    recordId: 'INC-BIH-007'
  },
  {
    date: '2026-09-23',
    title: 'An order suspending the internet at Jantar Mantar names the office that gave it',
    body: 'The Union Home Secretary ordered mobile internet suspended within 1.5 km of Jantar Mantar from 16:00 to 24:00 on 23 July, addressed to the Commissioner of Delhi Police, under section 20(2)(b) of the Telecommunications Act 2023. The ground is quoted: \'in the interest of public order and for preventing incitement to the commission of any offence\'. This is the first record here of an identified authority giving an identified written order during one of these incidents. The contrast is the finding: the state\'s internet order can be traced to a desk and its lathi charge cannot. We do not hold the order. The Internet Freedom Foundation reported on 20 July that no suspension order had been published by the MHA, the DoT, the Delhi government or the Delhi Police, and Anuradha Bhasin requires that they be. An RTI for it is queued.',
    recordId: 'INC-DEL-007'
  },
  {
    date: '2026-09-23',
    title: 'The Supreme Court kept the committee and opened a confidential route for witnesses',
    body: 'On 10 September the Chief Justice\'s bench refused to reconstitute the High Powered Enquiry Committee, directed that an online portal be created for vulnerable witnesses to submit statements and documents confidentially, and appointed two amici curiae as intermediaries. That closes a thread this archive left open twice: the 10 September listing and the plea against the committee\'s composition. Whether the portal now exists, and where, is not established, and this archive will not send anyone to a portal it has not found.',
    recordId: 'PROC-SC-011'
  },
  {
    date: '2026-09-23',
    title: 'Two accounts of the PUCL hearing disagree, and the disagreement is now on the record',
    body: 'Our record says nineteen people deposed at Patna on 22 August and names one panel member Arshad Ajman. A report published on BiharWatch the next day says sixteen oral testimonies plus one video, and calls him Ajmal Ashraf. Neither has been changed to match the other. Little turns on the count; what turns on it is that this archive holds no copy of the panel\'s own report, only outlets\' accounts of it, and two of them cannot both have the panel right. The thirteen categories the panel enumerated are now recorded in full.',
    recordId: 'INC-BIH-006'
  },
  {
    date: '2026-08-26',
    title: 'Video puts more rounds fired at Siwan, in more places, than the State admits',
    body: 'The State of Bihar told the Supreme Court, on affidavit, that four rounds were fired from an AK-47 near JP Chowk. An open-source investigation published on 4 August geolocates video showing at least nine rounds, at two other locations. Both accounts are now on the record and the conflict is marked as disputed; the discharge of firearms itself was never in doubt.',
    recordId: 'INC-SIW-003'
  },
  {
    date: '2026-08-26',
    correction: true,
    title: 'The Siwan record presented the State\'s figures as the fact',
    body: 'Until 26 August this archive\'s Siwan record carried four rounds near JP Chowk as what happened, rather than as what the State of Bihar had told the Supreme Court happened. The sourcing was right and the framing was not. Corrected on 26 August: both accounts are on the record and the conflict is marked disputed.',
    recordId: 'INC-SIW-003'
  },
  {
    date: '2026-08-26',
    title: 'Bihar has an account that is not the government\'s',
    body: 'A public hearing convened by PUCL in Patna on 22 August heard nineteen people who said police assaulted them between 21 and 27 July, before a named four-member panel. Until now almost everything this archive held about Bihar was the State describing its own conduct, which is a bad position for a record to be in. It adds a place we did not have — Sitamarhi — a figure of 64 FIRs, and the reported detention of two lawyers who were assisting detained protesters. What is established is that the hearing happened and what the panel found, not that the findings are true. Sitamarhi is not opened as its own incident on one account, because Siwan was not.',
    recordId: 'INC-BIH-005'
  },
  {
    date: '2026-08-26',
    title: 'The committee has been told to take the assault allegations first',
    body: 'The Chief Justice is reported to have said on 24 August that the order constituting the committee already requires it to treat allegations of sexual assault and violence against women protesters as a priority, and to report on them first. The Court declined to open a separate proceeding of its own. This archive holds no account of what happened to any woman at Jantar Mantar and records none: that allegations exist and a court has directed an inquiry is the whole of what is sourced.',
    recordId: 'PROC-SC-010'
  },
  {
    date: '2026-08-21',
    title: 'Hospital records obtained under RTI put at least ten people in hospital with pellet injuries',
    body: 'Saket Gokhale asked four Delhi hospitals how many people they treated for pellet, shot or projectile injuries on 20 July. Lady Hardinge Medical College answered nine, recorded as pellet or projectile injuries. Safdarjung answered one. AIIMS refused under section 8(1)(j), saying a number could identify a patient. Ram Manohar Lohia had not answered. This is the best-sourced thing on the pellet question and it is not our work, so it is credited to him. Hospital records are independent of both the police and the petitioners \u2014 but a clinical category is not a finding about a weapon, and what was fired is still recorded as disputed.',
    recordId: 'INC-DEL-006'
  },
  {
    date: '2026-08-21',
    title: 'An FIR has been registered about the police action itself',
    body: 'A student who says he was hit by pellets at Jantar Mantar on 20 July complained in writing on 14 August. An FIR was registered at Parliament Street police station on 21 August, against unidentified persons. Everything else in this archive is a writ petition, a commission proceeding or an affidavit; this is the first criminal case about what the police did. It comes with a file, a case diary and either a chargesheet or a closure report at the end, and those are documents that can be asked for. We are not naming the complainant, and the record says why.',
    recordId: 'PROC-DEL-003'
  },
  {
    date: '2026-08-21',
    title: 'The committee exists now, and our earlier record was overtaken',
    correction: true,
    body: 'This archive recorded on 19 August that a high-powered committee had been decided on but was not shown to have been constituted. It has been, by an order reported dated 18 August: five members, chaired by a former Supreme Court judge, with the deployment of pellet guns inside its mandate by name and a first interim report due at the earliest. The record has been corrected and says what it used to say. We hold reporting of the order, not the order.',
    recordId: 'PROC-SC-006'
  },
  {
    date: '2026-08-21',
    title: 'A police diary entry is reported to record whose orders the munitions were used under',
    body: 'Two outlets say they have read a Delhi Police General Diary entry of 22 July which records what was used at Jantar Mantar on 20 July — tear smoke, shells, an anti-riot gun and two rounds of plastic pellets — and records that it was used under the orders of a Deputy Commissioner of Police. That is the first time anything on this record connects the force used to an officer who ordered it. It is still not an order, and this archive does not hold the entry: it holds two reports of it. The count of orders found stays at zero, because that number counts orders we hold.',
    recordId: 'INC-DEL-004'
  },
  {
    date: '2026-08-21',
    title: 'The Supreme Court has asked for the pellet gun procedure, and for a log to be kept',
    body: 'In a petition brought by a former IPS officer and two injured protesters, the Court is reported to have directed Delhi Police to place its standard operating procedure on pellet-firing weapons on record, to have ordered the Rapid Action Force ammunition log for 20 July preserved, and to have said it will lay down a protocol. Counsel told the Court that from 1967 to now there is not a single standing order or regulation mentioning pellet guns. That is a submission, not a finding, and the archive records it as one. Both documents the Court asked for are now open questions here.',
    recordId: 'PROC-SC-008'
  },
  {
    date: '2026-08-21',
    title: 'A petition on the facial recognition is before the Supreme Court',
    body: 'A public interest petition asks the Court to hold the deployment of facial recognition against a peaceful assembly unconstitutional, and to order disclosure of the systems, procedures and vendor agreements used at Jantar Mantar. That disclosure is the same document this archive has been unable to obtain by any other route. The Court is reported to have agreed on 13 August to hear it. What the petition alleges was deployed is a party\'s case, not a finding, and the record says so.',
    recordId: 'PROC-SC-007'
  },
  {
    date: '2026-08-21',
    title: 'Two officers who policed Jantar Mantar have been moved',
    body: 'A Delhi Government order of 18 August transferred 43 officers, two of them holding posts that covered the policing of the protest. Reporting says the order does not call either move disciplinary or mention the protest. The useful part for this archive is the smaller one: it names two officers and the posts they held on 20 July, which nothing else on the record did. Neither has been added to the chain of command, and no finding against either is recorded, because none exists.',
    recordId: 'OVR-DEL-001'
  },
  {
    date: '2026-08-19',
    title: 'A fourth incident is open: Siwan',
    body: 'The daily sweep found the State of Bihar telling the Supreme Court that police discharged firearms at a student protest at Siwan on 25 July — four rounds from an AK-47 and two from a pistol, with three protesters injured. Siwan was not on this archive before today and has been opened as its own record rather than added to the Bihar one: a different town, a different date and a different weapon is a different incident. These are the first firearms in the archive.',
    recordId: 'INC-SIW-001'
  },
  {
    date: '2026-08-19',
    title: 'An earlier finding of ours has been overtaken',
    correction: true,
    body: 'This archive recorded on 16 August that no court proceeding concerning the Bihar incidents could be found. That was true when written and is now wrong: Bihar is a respondent before the Supreme Court and has filed there. The record has been corrected and says what it used to say. Whether any court is seized of Patna, Katihar or Munger specifically is still not established.',
    recordId: 'PROC-BIH-001'
  },
  {
    date: '2026-08-19',
    title: 'Delhi Police has admitted using facial recognition at Jantar Mantar',
    body: 'On affidavit before the Supreme Court, the force said facial recognition technology was deployed at the protest. That it was used is now the police\'s own statement and is recorded as corroborated. Whether it was confined to people with criminal records, as the police say, or ran on the crowd, as the petitioners say, is recorded as disputed — the court has not decided it and neither has this archive.',
    recordId: 'PROC-SC-002'
  },
  {
    date: '2026-08-18',
    title: 'The court\'s own record of the Delhi hearing is now held',
    body: 'The Delhi High Court cause list for 22 July 2026 has been retrieved and filed. It establishes the cause title, the case number and the bench, and it corrects a date two news reports had disagreed about. It does not establish what was ordered: that still rests on reporting until the order itself is obtained.',
    recordId: 'PROC-DEL-002'
  },
  {
    date: '2026-08-18',
    title: 'Nothing on these incidents has been answered in Parliament yet',
    body: 'The parliamentary record was searched for a question on the police action. Nothing on any of these incidents is indexed as answered. The search is dated and recorded rather than repeated silently, and it will be run again when the next session opens.'
  },
  {
    date: '2026-08-18',
    title: 'The NHRC\'s two-week deadline has passed',
    body: 'The Commission is reported to have sought a report from the Commissioner of Police, Delhi, within two weeks of 25 July. That period expired on or about 8 August. Whether anything was filed is not established, and the Commission has not announced the proceeding on its own press-release page.',
    recordId: 'OVR-NHRC-001'
  }
];

WGO.orders = [];

/* --- Timeline events ------------------------------------------------------ *
   Empty. A timeline is a chronology of established fact; an empty chronology is
   an honest one. Add EVT- records with `state: 'VERIFIED'` and evidenceIds only
   once a document or dated original recording fixes the time. */
WGO.events = [];

/* --- Incidents ------------------------------------------------------------ */
WGO.incidents = [
  {
    id: 'INC-0001',
    kind: 'FORCE',
    slug: 'jantar-mantar',
    title: 'Police action against students at Jantar Mantar',
    place: 'Jantar Mantar, New Delhi',
    state: 'Delhi',
    coords: [28.6270, 77.2166],           // Jantar Mantar, the protest site itself
    incidentState: 'UNDER_INVESTIGATION',
    /* Dates and place established by the round-1 source map. Everything below
       them remains UNKNOWN: that an incident occurred is corroborated, and
       nothing about conduct, cause or proportionality follows from that. */
    dateState: 'CORROBORATED',
    date: '20 and 22 July 2026',
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'UNKNOWN', items: [] },
    crowdControl:   { state: 'UNKNOWN', items: [] },
    injuries:       { state: 'UNKNOWN', note: null },
    detentions:     { state: 'UNKNOWN', note: null },
    firs:           { state: 'UNKNOWN', note: null },
    officeIds: ['OFC-0001', 'OFC-0004', 'OFC-0006', 'OFC-0007', 'OFC-0008'],
    /* How far this archive has got towards the order itself. Rungs are defined
       in WGO.ORDER_LADDER and each one must name the record that establishes
       it: progress here is sourced exactly like every other claim on the site.
       Two rungs cite the same record because one document does both jobs. */
    orderTrail: {
      reached: 'REFERRED',
      rungs: {
        ALLEGED: {
          evidenceId: 'INC-DEL-004',
          note: 'A police record is reported to state that the munitions were used under a Deputy Commissioner of Police\'s orders. That is the first assertion anywhere on this record that an order existed at all.'
        },
        REFERRED: {
          evidenceId: 'INC-DEL-004',
          note: 'The same General Diary entry is the referring document. We have not read it: two newspapers say they have.'
        }
      },
      next: 'OQ-040'
    },
    openedOn: '2026-08-15'
  },
  {
    id: 'INC-0002',
    kind: 'FORCE',
    slug: 'bihar',
    title: 'Police action against students in Bihar',
    place: 'JP Golambar and Dakbungalow Square, Patna; Katihar; Munger',
    state: 'Bihar',
    coords: [25.5941, 85.1376],           // Patna; Katihar and Munger not yet plotted
    coordsState: 'REPORTED',
    incidentState: 'UNDER_INVESTIGATION',
    dateState: 'REPORTED',
    date: '22, 23 and 25 July 2026',
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'UNKNOWN', items: [] },
    crowdControl:   { state: 'UNKNOWN', items: [] },
    injuries:       { state: 'UNKNOWN', note: null },
    detentions:     { state: 'UNKNOWN', note: null },
    firs:           { state: 'UNKNOWN', note: null },
    officeIds: ['OFC-0002', 'OFC-0003', 'OFC-0005', 'OFC-0006', 'OFC-0007', 'OFC-0008'],
    /* No rung reached. Nothing on this record yet asserts that anyone ordered
       the force used in Bihar, which is a different and worse position than
       Delhi rather than the same one. */
    orderTrail: { reached: null, rungs: {}, next: 'OQ-035' },
    openedOn: '2026-08-15'
  },
  {
    id: 'INC-0003',
    kind: 'CASES',
    slug: 'maharashtra',
    /* Retitled 23 September 2026. This shell was opened on a Supreme Court
       petition saying disturbances had spread to Maharashtra, and it sat at
       'no incident located' for five weeks while the archive looked for a
       lathi charge. What is on the record is thirteen FIRs against more than
       four hundred people for assembling without permission, and no use of
       force at all. The title now says that rather than promising an action
       nobody has evidenced. See INC-MAH-002. */
    title: 'Cases registered against protesters in Mumbai',
    place: 'Shivaji Park, Chaityabhoomi, Chembur and Shiv Sena Bhavan, Mumbai',
    state: 'Maharashtra',
    coords: [19.0760, 72.8777],           // Mumbai; the four sites not separately plotted
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'REPORTED',
    date: '18 to 22 July 2026',
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'UNKNOWN', items: [] },
    /* Deliberately UNKNOWN rather than empty. Nothing in the sources says
       force was used in Mumbai, and nothing says it was not. An archive that
       renders 'none' here would be stating a negative it has not established. */
    crowdControl:   { state: 'UNKNOWN', items: [] },
    injuries:       { state: 'UNKNOWN', note: null },
    detentions:     { state: 'UNKNOWN', note: null },
    firs:           { state: 'REPORTED', note: '13 FIRs against more than 400 people, reported 23 July 2026. Treated as closed by the Supreme Court\'s order of 1 September 2026; Maharashtra is separately reported to have directed withdrawal. See INC-MAH-002 and PROC-SC-014.' },
    officeIds: ['OFC-0002', 'OFC-0003', 'OFC-0004', 'OFC-0005', 'OFC-0006', 'OFC-0007', 'OFC-0008'],
    /* No rung reached. */
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-08-15'
  },
  /* Opened 19 August 2026, on the strength of the State of Bihar's own affidavit
     to the Supreme Court. Siwan is a separate shell rather than another line in
     the Bihar record because 25 July at Siwan is a different event from 22 July
     at Patna, with different personnel, a different weapon and a different
     district administration. Folding it into INC-0002 would produce a record
     that reads as one incident across four towns, which is the collapsing this
     archive refuses between states and has no better reason to do within one.

     It is also the first incident here that did not come from the round-1
     research: the daily sweep found it. */
  {
    id: 'INC-0004',
    kind: 'FORCE',
    slug: 'siwan',
    title: 'Police firing during the student protest at Siwan',
    place: 'JP Chowk, Siwan',   // the sources say 'near JP Chowk'; the qualifier belongs in the record, not in the place name
    state: 'Bihar',
    coords: [26.2196, 84.3597],           // Siwan town
    coordsState: 'UNKNOWN',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: '25 July 2026',
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'UNKNOWN', items: [] },
    crowdControl:   { state: 'UNKNOWN', items: [] },
    injuries:       { state: 'UNKNOWN', note: null },
    detentions:     { state: 'UNKNOWN', note: null },
    firs:           { state: 'UNKNOWN', note: null },
    officeIds: ['OFC-0002', 'OFC-0003', 'OFC-0004', 'OFC-0005', 'OFC-0006', 'OFC-0007', 'OFC-0008'],
    /* No rung reached. */
    orderTrail: { reached: null, rungs: {}, next: 'OQ-035' },
    openedOn: '2026-08-19'
  },
  /* Opened 23 September 2026. Kerala is here for a reason that inverts the
     archive's usual problem. Everywhere else the question 'who gave the order'
     runs into the fact that a baton leaves no paper: there is an action, no
     document, and no author. At Kochi the FIR itself says a notice refusing
     permission was served before the gathering went ahead. That notice is a
     written order. It has a date, an office and a signatory, and it cannot
     have existed without leaving a file. No force is established here and none
     is alleged, so this is not a police brutality record. It is the one record
     on the site where the archive's question has a cheap answer. */
  {
    id: 'INC-0005',
    kind: 'CASES',
    slug: 'kochi',
    title: 'Cases registered over a solidarity gathering at Kochi',
    place: 'Near Central Park, Panampilly Nagar, Kochi',
    state: 'Kerala',
    coords: [9.9581, 76.2968],            // Panampilly Nagar, Kochi
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'REPORTED',
    date: '22 July 2026',
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'UNKNOWN', items: [] },
    crowdControl:   { state: 'UNKNOWN', items: [] },
    injuries:       { state: 'UNKNOWN', note: null },
    detentions:     { state: 'UNKNOWN', note: null },
    firs:           { state: 'REPORTED', note: 'One case registered on the police\'s own motion against 101 people at Ernakulam Town South, under sections 190, 223 and 285 of the Bharatiya Nyaya Sanhita. Treated as closed by the Supreme Court\'s order of 1 September 2026. See INC-KER-001 and PROC-SC-014.' },
    officeIds: ['OFC-0006', 'OFC-0007', 'OFC-0008'],
    /* No rung reached on an order to use force, because no force is alleged.
       The document to get is the refusal of permission: FQ-019. */
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-09-23'
  },
  /* Opened 5 October 2026. A second wave, three months after the first, over a
     different grievance: the Cockroach Janta Party's demand for the Chief
     Election Commissioner's resignation over the electoral-roll revision. It is
     recorded apart from INC-0001 and INC-0003 on purpose. The July incidents
     were closed by the Supreme Court's order of 1 September, which is reported
     to cover protests of 20 to 25 July; folding 2 October into them would make
     a record that reads as one continuing incident and would put new events
     under an order that does not mention them.

     The two records are also different in kind and say so. Delhi is mass
     detention under a prohibitory order, with force alleged by protesters and
     not established. Mumbai is a case registered for assembling without
     permission, with no force alleged. */
  {
    id: 'INC-0006',
    slug: 'jantar-mantar-2-october',
    kind: 'DETENTIONS',
    title: 'Mass detentions at Jantar Mantar under a prohibitory order',
    place: 'Jantar Mantar and the approach roads, New Delhi',
    state: 'Delhi',
    coords: [28.6270, 77.2166],           // Jantar Mantar, the protest site itself
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: '2 to 4 October 2026',
    summaryState: 'UNKNOWN',
    summary: null,
    /* Reported, not established: Outlook names all three. The sources do not
       say which unit did what. */
    forcesInvolved: { state: 'REPORTED', items: [
      { text: 'Delhi Police', state: 'REPORTED' },
      { text: 'Rapid Action Force', state: 'REPORTED' },
      { text: 'Central Reserve Police Force', state: 'REPORTED' }
    ] },
    /* Metro closures, barricades and an internet suspension are measures taken
       around the protest, not force used on a person, and only the barricades
       and the closures are reported by more than one source. Left UNKNOWN so
       the record does not assert a list it has not got. */
    crowdControl:   { state: 'UNKNOWN', items: [] },
    injuries:       { state: 'REPORTED', note: 'Protesters allege being dragged and beaten with batons, and a history student is reported to have said she was bruised (one outlet, allegations only; INC-DEL-014). Police sources, via The News Mill, put injuries to police personnel at around 15 on the Sunday, some by bites (INC-DEL-019). No figure for injured protesters is established.' },
    detentions:     { state: 'CORROBORATED', note: 'On 2 October the counts range from over 500 to about 1,000, depending on the outlet and the time of day, and no official statement of any of them is held (INC-DEL-011). Nearly 200 more were detained on 3 October (INC-DEL-018) and around 110 on the Sunday (INC-DEL-019).' },
    firs:           { state: 'CORROBORATED', note: 'Three FIRs registered on 3 October at Parliament Street and Connaught Place police stations, with no accused named (INC-DEL-017). Complaints by three women journalists were transferred to the Crime Branch, and no FIR had been registered on them as of 4 October (INC-DEL-022).' },
    officeIds: ['OFC-0001', 'OFC-0004', 'OFC-0006', 'OFC-0007', 'OFC-0008'],
    /* No rung reached on an order to use force, because force is alleged by
       protesters and not established. The order that is documented in the
       reporting is the section 163 order, which has an author the sources
       cannot agree on: OQ-055, FQ-020. */
    orderTrail: { reached: null, rungs: {}, next: 'OQ-055' },
    openedOn: '2026-10-05'
  },
  {
    id: 'INC-0007',
    slug: 'shivaji-park-2-october',
    kind: 'CASES',
    title: 'Case registered over the Cockroach Janta Party gathering at Shivaji Park',
    place: 'Shivaji Park, Dadar, Mumbai',
    state: 'Maharashtra',
    coords: [19.0270, 72.8378],           // Shivaji Park, Dadar
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: '2 October 2026',
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'UNKNOWN', items: [] },
    /* Deliberately UNKNOWN rather than empty, as at INC-0003. Nothing here says
       force was used, and nothing says it was not. */
    crowdControl:   { state: 'UNKNOWN', items: [] },
    injuries:       { state: 'UNKNOWN', note: null },
    detentions:     { state: 'REPORTED', note: 'No arrests reported (Free Press Journal; The Tribune, citing PTI; Asianet News, citing ANI).' },
    firs:           { state: 'CORROBORATED', note: 'One FIR at Shivaji Park police station on 3 October 2026 against the organisers and 400 to 500 unidentified supporters, under BNS sections 189 and 223 and Maharashtra Police Act sections 37(1)(3) and 135. Who is named and who complained is DISPUTED between the sources. See INC-MAH-003 and INC-MAH-004.' },
    officeIds: ['OFC-0002', 'OFC-0003', 'OFC-0004', 'OFC-0006', 'OFC-0007', 'OFC-0008'],
    /* No rung reached, because no force is alleged. The documents to get are
       the FIR and the refusal of permission: FQ-022. The District Magistrate
       (OFC-0005) is left off: Mumbai is a commissionerate. */
    orderTrail: { reached: null, rungs: {}, next: 'OQ-059' },
    openedOn: '2026-10-05'
  },
  /* Opened 10 October 2026. The INDIA bloc's march on the Election Commission
     is its own incident, not more of INC-0006: a different organiser, a
     different route (Parliament towards Nirvachan Sadan, then the approach to
     Jantar Mantar) and detainees who are sitting members of Parliament. It is
     the same kind of record as INC-0006, detention with force alleged by the
     people detained and no police account in the sources read. */
  {
    id: 'INC-0008',
    slug: 'opposition-march-6-7-october',
    kind: 'DETENTIONS',
    title: 'Opposition MPs detained during the INDIA bloc march to the Election Commission',
    place: 'From Parliament towards the Election Commission, and near Jantar Mantar, New Delhi',
    state: 'Delhi',
    coords: [28.6270, 77.2166],           // Jantar Mantar, the approach on the second day
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'REPORTED',
    date: '6 and 7 October 2026',
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'REPORTED', items: [
      { text: 'Delhi Police, including women police personnel', state: 'REPORTED' }
    ] },
    crowdControl:   { state: 'UNKNOWN', items: [] },
    injuries:       { state: 'REPORTED', note: 'Priyanka Gandhi Vadra said she was scratched and thrown to the ground; other MPs allege manhandling. Allegations by named politicians, with no police account in the source. See INC-DEL-025.' },
    detentions:     { state: 'CORROBORATED', note: 'Rahul Gandhi, Priyanka Gandhi Vadra and other opposition leaders were detained on 7 October and released within hours, and several leaders on 6 October. No count is reported. See INC-DEL-023 and INC-DEL-024.' },
    firs:           { state: 'REPORTED', note: 'An FIR against Rahul Gandhi is mentioned by Siasat without station, sections or complainant. See INC-DEL-026.' },
    officeIds: ['OFC-0001', 'OFC-0004', 'OFC-0006', 'OFC-0007', 'OFC-0008'],
    orderTrail: { reached: null, rungs: {}, next: 'OQ-055' },
    openedOn: '2026-10-10'
  }
];

/* --- Claims --------------------------------------------------------------- *
   A Claim is a single checkable proposition. It is the unit the government
   response page argues with, and the unit evidence attaches to.

   Every claim below is UNVERIFIED with no evidence attached. That is the
   correct starting state for this archive: the premise that brought the
   project into being is itself something to be established, not assumed. */
WGO.claims = [
  {
    id: 'CLM-0001',
    incidentId: 'INC-0001',
    text: 'Police used force against students at Jantar Mantar.',
    state: 'UNVERIFIED',
    evidenceIds: [],
    note: 'Recorded as the claim under investigation. It is not presented as established until primary evidence is attached.'
  },
  {
    id: 'CLM-0002',
    incidentId: 'INC-0002',
    text: 'Police used force against students in Bihar.',
    state: 'UNVERIFIED',
    evidenceIds: [],
    note: 'Recorded as the claim under investigation. It is not presented as established until primary evidence is attached.'
  },
  {
    id: 'CLM-0003',
    incidentId: 'INC-0003',
    text: 'Police used force against students in Maharashtra.',
    state: 'UNVERIFIED',
    evidenceIds: [],
    note: 'Recorded as the claim under investigation. It is not presented as established until primary evidence is attached.'
  },
  {
    id: 'CLM-0004',
    incidentId: 'INC-0006',
    text: 'Police used force on protesters near Jantar Mantar on 2 October 2026, beyond moving them onto buses.',
    state: 'UNVERIFIED',
    evidenceIds: [],
    note: 'Protesters allege being beaten with batons, reported by one outlet (INC-DEL-014). Recorded as the claim under investigation, not as established. No footage, medical record or police account is held.'
  }
];

/* --- Questions ------------------------------------------------------------ *
   Section 7 of the brief. The standard set is expanded onto every incident so
   that the same twelve questions are asked of every use of force, in the same
   order, everywhere in the archive. Incident-specific questions are added to
   `WGO.questionsExtra`. */
WGO.STANDARD_QUESTIONS = [
  { key: 'deployment',      text: 'Who authorised the deployment?',                                     level: 'SENIOR',      wants: ['Deployment order', 'Force requisition', 'Duty roster'] },
  { key: 'tear-gas',        text: 'Who authorised the use of tear gas, if its use is established?',      level: 'OPERATIONAL', wants: ['Equipment issue register', 'Wireless log', 'Station diary entry'] },
  { key: 'pellets',         text: 'Who authorised the use of pellet-firing weapons, if their use is established?', level: 'OPERATIONAL', wants: ['Armoury issue record', 'Medico-legal records', 'Original footage'] },
  { key: 'written-req',     text: 'Was written authorisation required for the force used?',              level: 'STATE',       wants: ['Standing orders', 'Police manual provisions', 'Standard operating procedure'] },
  { key: 'written-issued',  text: 'Was a written order issued?',                                         level: 'SENIOR',      wants: ['The order itself', 'RTI response confirming existence or absence'] },
  { key: 'oral-order',      text: 'If not, was an oral order given?',                                    level: 'OPERATIONAL', wants: ['Wireless log', 'Control-room recording', 'Officer statement on record'] },
  { key: 'who-issued',      text: 'Who issued it?',                                                      level: 'OPERATIONAL', wants: ['Signed order', 'Contemporaneous log naming the officer'] },
  { key: 'instructions',    text: 'What instructions were given to field personnel?',                    level: 'OPERATIONAL', wants: ['Briefing record', 'Wireless log', 'Written instructions to units'] },
  { key: 'reports',         text: 'What reports were submitted after the incident?',                     level: 'SENIOR',      wants: ['Situation report', 'Daily diary', 'Report to the home department'] },
  { key: 'who-received',    text: 'Who received those reports?',                                         level: 'STATE',       wants: ['Routing slip', 'File noting', 'RTI response'] },
  { key: 'inquiry',         text: 'Was an inquiry ordered?',                                             level: 'STATE',       wants: ['Inquiry order', 'Magisterial inquiry notification', 'Court direction'] },
  { key: 'action',          text: 'What action followed?',                                               level: 'STATE',       wants: ['Departmental proceedings record', 'FIR against personnel', 'Inquiry findings'] }
];

/* Questions specific to a single incident, added to the standard set. */
WGO.questionsExtra = [
  {
    id: 'QST-X001',
    incidentId: 'INC-0001',
    text: 'Was any prohibitory order in force at the site at the time, and when was it promulgated?',
    level: 'SENIOR',
    state: 'UNANSWERED',
    wants: ['The order and its date of promulgation', 'Proof of publication'],
    evidenceIds: []
  },
  {
    id: 'QST-X002',
    incidentId: 'INC-0001',
    text: 'Were any central armed police units deployed alongside the city police, and under whose direction?',
    level: 'UNION',
    state: 'UNANSWERED',
    wants: ['Requisition for central forces', 'Deployment order naming the units'],
    evidenceIds: []
  },
  {
    id: 'QST-X003',
    incidentId: 'INC-0006',
    text: 'Which office issued the section 163 order in force across New Delhi district on 2 October, and on what date and ground?',
    level: 'SENIOR',
    state: 'UNANSWERED',
    wants: ['The order, with its date, signatory, area and hours', 'The ground stated in it'],
    evidenceIds: ['INC-DEL-012', 'INC-DEL-013']
  },
  {
    id: 'QST-X004',
    incidentId: 'INC-0006',
    text: 'The Rapid Action Force and the CRPF are reported at the site. Under whose direction did they act alongside Delhi Police?',
    level: 'UNION',
    state: 'UNANSWERED',
    wants: ['Requisition for central forces', 'Deployment order naming the units'],
    evidenceIds: ['INC-DEL-011']
  },
  {
    id: 'QST-X005',
    incidentId: 'INC-0007',
    text: 'Was permission for the gathering refused in writing, by which office, on what date and on what ground?',
    level: 'SENIOR',
    state: 'UNANSWERED',
    wants: ['The written refusal, with its date and signatory', 'The order it relies on'],
    evidenceIds: ['INC-MAH-003']
  },
  {
    id: 'QST-X006',
    incidentId: 'INC-0008',
    text: 'Which office ordered the detention of opposition MPs on 6 and 7 October, and under what power?',
    level: 'SENIOR',
    state: 'UNANSWERED',
    wants: ['Detention memos or the order to detain', 'The section 163 order covering the area on those days'],
    evidenceIds: ['INC-DEL-024']
  }
];

/* --- Government responses ------------------------------------------------- *
   Section 13. Official accounts are reproduced fairly and in full, and are
   never removed because they are inconvenient. Empty until one is recorded. */
WGO.responses = [];

/* --- External investigations (section 9) ---------------------------------- *
   An index of other people's work, always attributed to whoever made it. We do
   not reproduce it and we do not claim it. */
WGO.external = [];

/* --- Evidence ------------------------------------------------------------- *
   Empty. Layout samples live in data/samples.js behind WGO.config.demoMode and
   are never mixed into these arrays. */
WGO.evidence = [];

/* --- RTI register --------------------------------------------------------- *
   Add an RTI record on the day you file it, not on the day a reply arrives.
   The register is what turns the gap list from a wish into a clock, and an
   application that is weeks overdue is itself worth publishing.

   Shape:
     {
       id:            'RTI-0001',
       incidentId:    'INC-0001',
       questionIds:   ['QST-0001-01'],      // what this application would answer
       office:        'Public Information Officer, ...',
       subject:       'Short description of what was asked for',
       filedOn:       '2026-08-20',          // YYYY-MM-DD
       period:        'STANDARD',            // key from WGO.RTI_PERIODS
       referenceNo:   'registration number, where the portal gives one',
       status:        'FILED',               // key from WGO.RTI_STATES
       repliedOn:     null,
       exemptionCited: null,                 // where status is REFUSED
       outcome:       null,                  // one line, plain language
       evidenceIds:   []                     // the reply, once filed as evidence
     }

   The reply-due date and any overdue count are computed by the model from
   filedOn and period. Do not store them: a stored deadline goes stale, and a
   stale deadline in an accountability archive is worse than none. */
WGO.rtis = [];
