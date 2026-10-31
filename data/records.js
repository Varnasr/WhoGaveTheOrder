/* =============================================================================
   WhoGaveTheOrder.in: the record store
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
      { text: 'Head of a city police force under the commissionerate system; in Delhi, the Commissioner of Police heads a force under the Union Home Ministry, and the Delhi state government does not control it.', sourceIds: [] },
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
   write: and the fastest way to launder an unsourced claim into a fact is to
   put it in a news item nobody thinks to check.

   Fields: date (ISO), title, body, and optionally recordId: the record the
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
    body: 'Across five states the response to these protests was the registration of cases: 694 detained and 355 booked in Bihar, more than 400 booked in Mumbai, 101 in Kochi, about 70 named in seven files in Kolkata, 13 arrested in Assam. Bihar and Assam then withdrew theirs by written notification, Maharashtra by a direction to its home department, and the Supreme Court closed the rest on 1 September. That is the opposite of this archive\'s usual problem. A lathi charge leaves no order and no author; a refusal of permission, an FIR and a withdrawal notification are each written by somebody, carry a date and sit in a file. Note also that Bihar and West Bengal are both reported to have drawn their line at 6 pm on 26 July, which is an odd thing for two states to arrive at separately, and the file noting is where that would be answered.',
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
    title: 'The Supreme Court kept the committee and said a confidential portal may be created for witnesses',
    body: 'On 10 September the Chief Justice\'s bench declined to reconstitute the High Powered Enquiry Committee. The order says that "a separate online portal may be created" for vulnerable witnesses to submit documents and evidence, requests the Committee to keep their identities confidential, and appoints two amici curiae to assist the Court. That closes a thread this archive left open twice: the 10 September listing and the plea against the committee\'s composition. Corrected 14 October 2026, when the order was read: this entry first said the bench "directed" that a portal be created and called the amici intermediaries. The order uses the words "may be created" and "request", and describes the amici as a representative of the Committee and an arbiter between the parties. The Committee\'s own website now lists a confidential route, and we have not tested it.',
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
    body: 'Until 26 August this archive\'s Siwan record carried four rounds near JP Chowk as what happened. It was in fact what the State of Bihar had told the Supreme Court happened. The sourcing was right and the framing was not. Corrected on 26 August: both accounts are on the record and the conflict is marked disputed.',
    recordId: 'INC-SIW-003'
  },
  {
    date: '2026-08-26',
    title: 'Bihar now has an account from outside the government',
    body: 'A public hearing convened by PUCL in Patna on 22 August heard nineteen people who said police assaulted them between 21 and 27 July, before a named four-member panel. Until now almost everything this archive held about Bihar was the State describing its own conduct, which is a bad position for a record to be in. It adds three things we did not have: a place (Sitamarhi), a figure of 64 FIRs, and the reported detention of two lawyers who were assisting detained protesters. What is established is that the hearing happened and what the panel found. That does not make the findings true. Sitamarhi is not opened as its own incident on one account, because Siwan was not.',
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
    body: 'Saket Gokhale asked four Delhi hospitals how many people they treated for pellet, shot or projectile injuries on 20 July. Lady Hardinge Medical College answered nine, recorded as pellet or projectile injuries. Safdarjung answered one. AIIMS refused under section 8(1)(j), saying a number could identify a patient. Ram Manohar Lohia had not answered. This is the best-sourced thing on the pellet question and it is not our work, so it is credited to him. Hospital records are independent of both the police and the petitioners. A clinical category is not a finding about a weapon, and what was fired is still recorded as disputed.',
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
    body: 'This archive recorded on 19 August that a high-powered committee had been decided on but was not shown to have been constituted. It has been, by an order reported dated 18 August: five members, chaired by a former Supreme Court judge, with the deployment of pellet guns inside its mandate by name and a first interim report due at the earliest. The record has been corrected and says what it used to say. We hold reporting of the order and do not hold the order.',
    recordId: 'PROC-SC-006'
  },
  {
    date: '2026-08-21',
    title: 'A police diary entry is reported to record whose orders the munitions were used under',
    body: 'Two outlets say they have read a Delhi Police General Diary entry of 22 July which records what was used at Jantar Mantar on 20 July (tear smoke, shells, an anti-riot gun and two rounds of plastic pellets) and records that it was used under the orders of a Deputy Commissioner of Police. That is the first time anything on this record connects the force used to an officer who ordered it. It is still not an order, and this archive does not hold the entry: it holds two reports of it. The count of orders found stays at zero, because that number counts orders we hold.',
    recordId: 'INC-DEL-004'
  },
  {
    date: '2026-08-21',
    title: 'The Supreme Court has asked for the pellet gun procedure, and for a log to be kept',
    body: 'In a petition brought by a former IPS officer and two injured protesters, the Court is reported to have directed Delhi Police to place its standard operating procedure on pellet-firing weapons on record, to have ordered the Rapid Action Force ammunition log for 20 July preserved, and to have said it will lay down a protocol. Counsel told the Court that from 1967 to now there is not a single standing order or regulation mentioning pellet guns. That is a submission, and the archive records it as one. Both documents the Court asked for are now open questions here.',
    recordId: 'PROC-SC-008'
  },
  {
    date: '2026-08-21',
    title: 'A petition on the facial recognition is before the Supreme Court',
    body: 'A public interest petition asks the Court to hold the deployment of facial recognition against a peaceful assembly unconstitutional, and to order disclosure of the systems, procedures and vendor agreements used at Jantar Mantar. That disclosure is the same document this archive has been unable to obtain by any other route. The Court is reported to have agreed on 13 August to hear it. What the petition alleges was deployed is a party\'s case, and the record says so.',
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
    body: 'The State of Bihar has told the Supreme Court that police discharged firearms at a student protest at Siwan on 25 July: four rounds from an AK-47 and two from a pistol, with three protesters injured. Siwan was not on this archive before today and has been opened as its own record, separate from the Bihar one: a different town, a different date and a different weapon is a different incident. These are the first firearms in the archive.',
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
    body: 'On affidavit before the Supreme Court, the force said facial recognition technology was deployed at the protest. That it was used is now the police\'s own statement and is recorded as corroborated. Whether it was confined to people with criminal records, as the police say, or ran on the crowd, as the petitioners say, is recorded as disputed: the court has not decided it and neither has this archive.',
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
    body: 'The parliamentary record was searched for a question on the police action. Nothing on any of these incidents is indexed as answered. The search is dated and recorded, and it will be run again when the next session opens.'
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
    isoDate: '2026-07-20',   /* first day; used only to order the lists */
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
    isoDate: '2026-07-22',   /* first day; used only to order the lists */
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
    isoDate: '2026-07-18',   /* first day; used only to order the lists */
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
    isoDate: '2026-07-25',   /* first day; used only to order the lists */
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
    isoDate: '2026-07-22',   /* first day; used only to order the lists */
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
    isoDate: '2026-10-02',   /* first day; used only to order the lists */
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
    isoDate: '2026-10-02',   /* first day; used only to order the lists */
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
    isoDate: '2026-10-06',   /* first day; used only to order the lists */
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
  },
  /* Opened 10 October 2026. The seven earlier cases (2016 to 2024) are entered
     as shells on purpose. Their facts live in the evidence library, each at the
     confidence its sources earn; the fields below stay UNKNOWN until a record
     can be pointed at. No order has been found for any of them, and the
     orderTrail is therefore empty. officeIds is empty because the offices in
     WGO.offices are mapped to the July 2026 Delhi, Bihar and Maharashtra
     incidents, and attaching them here would assert a chain of command nobody
     has documented. */
  {
    id: 'INC-0009',
    isoDate: '2016-02-12',   /* first day; used only to order the lists */
    slug: 'jnu-patiala-house-2016',
    title: 'Police entry at JNU and the assault at Patiala House Court',
    place: 'Jawaharlal Nehru University and Patiala House Court, New Delhi',
    state: 'Delhi',
    coords: [28.5402, 77.1662],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: '12 to 17 February 2016',
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'UNKNOWN', items: [] },
    crowdControl:   { state: 'UNKNOWN', items: [] },
    injuries: { state: 'UNKNOWN', note: "No injury figure for the assault at Patiala House Court on 15 February 2016 is established by any document read (HIST-JNU16-012)." },
    detentions: { state: 'CORROBORATED', note: "Kanhaiya Kumar, president of the JNU Students' Union, was arrested on 12 February 2016 in the sedition case and was granted interim bail by the Delhi High Court on 2 March 2016 (HIST-JNU16-004, HIST-JNU16-009)." },
    firs: { state: 'CORROBORATED', note: "FIR No. 110/2016 at Vasant Kunj North over the 9 February event (HIST-JNU16-001). Four FIRs over the violence at Patiala House Courts on 15 and 17 February (HIST-JNU16-022)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0010',
    isoDate: '2016-03-22',   /* first day; used only to order the lists */
    slug: 'university-of-hyderabad-2016',
    title: 'Police on the University of Hyderabad campus; students and faculty detained',
    place: 'University of Hyderabad, Gachibowli, Hyderabad',
    state: 'Telangana',
    coords: [17.46, 78.334],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: '22 and 23 March 2016',
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'REPORTED', items: [{"text": "Police, deployed on 22 March 2016", "state": "CORROBORATED"}, {"text": "Rapid Action Force and CRPF, as alleged by students and a joint action committee (HIST-HCU-019, HIST-HCU-020)", "state": "REPORTED"}] },
    crowdControl:   { state: 'UNKNOWN', items: [] },
    injuries: { state: 'DISPUTED', note: "PUDR says over fifty students were injured; a police officer is reported to say four officers were hurt. No official or hospital count was found (HIST-HCU-007)." },
    detentions: { state: 'DISPUTED', note: "Between 27 and 40 people were arrested depending on the source, and whether they were produced before a magistrate within 24 hours is contested (HIST-HCU-004, HIST-HCU-005, HIST-HCU-028)." },
    firs: { state: 'REPORTED', note: "Two cases at Gachibowli police station against students and two faculty members, charges as reported; no FIR text was found (HIST-HCU-011)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0011',
    isoDate: '2017-09-21',   /* first day; used only to order the lists */
    slug: 'bhu-2017',
    title: 'Lathicharge on women students at Banaras Hindu University',
    place: 'Banaras Hindu University, Varanasi',
    state: 'Uttar Pradesh',
    coords: [25.2677, 82.9913],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: '21 to 24 September 2017',
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Police, including a lathicharge, on the night of 23 September 2017 (HIST-BHU-001); the Vice-Chancellor denied a lathicharge on campus (HIST-BHU-012)", "state": "CORROBORATED"}] },
    crowdControl:   { state: 'UNKNOWN', items: [] },
    injuries: { state: 'UNKNOWN', note: "Reports say only that students, including women, and two journalists were injured. No count is established (HIST-BHU-010)." },
    detentions: { state: 'REPORTED', note: "16 detained students were released on 24 September 2017, per the Lanka station officer as quoted by PTI (HIST-BHU-011)." },
    firs: { state: 'DISPUTED', note: "An FIR against unidentified policemen and a case against students, reported as over 1,000 or as 1,200 (HIST-BHU-008, HIST-BHU-009)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0012',
    isoDate: '2019-12-15',   /* first day; used only to order the lists */
    slug: 'jamia-2019',
    kind: 'FORCE',
    title: 'Police and RAF on the Jamia Millia Islamia campus, including the library',
    place: 'Jamia Millia Islamia, New Delhi',
    state: 'Delhi',
    coords: [28.5614, 77.283],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: '15 December 2019',
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'VERIFIED', items: [{"text": "Delhi Police and Rapid Action Force personnel entered the campus on the evening of 15 December 2019 and used force and tear gas, including in the library (HIST-JMI-001)", "state": "VERIFIED"}] },
    crowdControl:   { state: 'UNKNOWN', items: [] },
    injuries: { state: 'DISPUTED', note: "A Lok Sabha reply gives 62 police personnel and 127 others, including 36 students; press estimates run higher (HIST-JMI-010)." },
    detentions: { state: 'DISPUTED', note: "Counts range from 15 arrested to 52 apprehended to 'several 100' depending on the source (HIST-JMI-009)." },
    firs: { state: 'VERIFIED', note: "FIR 242/2019 (New Friends Colony) and FIR 298/2019 (Jamia Nagar) against protesters. No FIR against any police officer; the university's application was dismissed on 3 February 2021 (HIST-JMI-011, HIST-JMI-012)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0013',
    isoDate: '2019-12-15',   /* first day; used only to order the lists */
    slug: 'amu-2019',
    title: 'Police action at Aligarh Muslim University and the Aligarh internet suspension',
    place: 'Aligarh Muslim University, Aligarh',
    state: 'Uttar Pradesh',
    coords: [27.9161, 78.0804],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: '15 and 16 December 2019',
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Police and Rapid Action Force on the campus on the evening and night of 15 December 2019 (HIST-AMU-001)", "state": "CORROBORATED"}, {"text": "Water cannon and tear gas, per the State affidavit as reported (HIST-AMU-004)", "state": "REPORTED"}] },
    crowdControl:   { state: 'CORROBORATED', items: [{"text": "Internet suspended in Aligarh from 10 pm on 15 December to 10 pm on 16 December 2019 on the District Magistrate's order (HIST-AMU-003)", "state": "CORROBORATED"}, {"text": "Section 144 order, per the State affidavit as reported; issuer and text not found (HIST-AMU-008)", "state": "REPORTED"}] },
    injuries: { state: 'DISPUTED', note: "Estimates of about 70, 40 to 50 and about 100 injured, from different sources (HIST-AMU-006)." },
    detentions: { state: 'DISPUTED', note: "26 detained, of whom 6 were AMU students per the Deputy Proctor; 21 arrested per the SSP (HIST-AMU-006)." },
    firs: { state: 'DISPUTED', note: "56 persons named per the SSP; about 700 unnamed and 12 to 13 named per a fact-finding report; and a figure of 1,200 that may be a different FIR (HIST-AMU-007)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0014',
    isoDate: '2020-01-05',   /* first day; used only to order the lists */
    slug: 'jnu-2020',
    title: 'Masked attack at JNU and the question of police inaction',
    place: 'Jawaharlal Nehru University, New Delhi',
    state: 'Delhi',
    coords: [28.5402, 77.1662],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: '5 January 2020',
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'UNKNOWN', items: [] },
    crowdControl:   { state: 'UNKNOWN', items: [] },
    injuries: { state: 'DISPUTED', note: "At least 32 to 51 injured depending on the source (HIST-JNU20-002)." },
    detentions: { state: 'UNKNOWN', note: null },
    firs: { state: 'CORROBORATED', note: "A case registered on 6 January 2020 at Vasant Kunj (North) and moved to the Crime Branch; on 3 August 2021 the Minister of State for Home said no arrest had been made (HIST-JNU20-009, HIST-JNU20-010)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0015',
    isoDate: '2024-08-27',   /* first day; used only to order the lists */
    slug: 'nabanna-2024',
    kind: 'FORCE',
    title: 'Lathicharge, tear gas and water cannon at the Nabanna march',
    place: 'Howrah and central Kolkata',
    state: 'West Bengal',
    coords: [22.5726, 88.3639],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: '27 August 2024',
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Police (Kolkata Police and West Bengal Police) at Howrah Bridge, Santragachi, Howrah Maidan, MG Road and Hastings Road (HIST-NAB-002, HIST-NAB-010)", "state": "CORROBORATED"}] },
    crowdControl:   { state: 'CORROBORATED', items: [{"text": "Lathicharge, water cannon and tear gas (HIST-NAB-002)", "state": "CORROBORATED"}, {"text": "Section 163 BNSS prohibitory order, per an ADG; issuer not established (HIST-NAB-004, HIST-NAB-005)", "state": "REPORTED"}] },
    injuries: { state: 'REPORTED', note: "Police say 15 Kolkata Police and 14 state police personnel were injured; protesters were also injured and no official count was found (HIST-NAB-010)." },
    detentions: { state: 'DISPUTED', note: "220 arrests plus 25 preventive arrests, about 245, or 'more than 200' depending on the source (HIST-NAB-011)." },
    firs: { state: 'UNKNOWN', note: null },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0016',
    isoDate: '2014-09-16',   /* first day; used only to order the lists */
    slug: 'jadavpur-2014',
    title: "Police entry at Jadavpur University after a gherao",
    place: "Jadavpur University, Kolkata",
    state: "West Bengal",
    coords: [22.499, 88.371],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "16 and 17 September 2014",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'REPORTED', items: [{"text": "Kolkata Police, who entered in the early hours of 17 September 2014 (HIST-JU14-001)", "state": "CORROBORATED"}, {"text": "A contingent led by an Additional Commissioner of Police, per one report (HIST-JU14-006)", "state": "REPORTED"}] },
    crowdControl  : { state: 'UNKNOWN', items: [] },
    injuries      : { state: 'REPORTED', note: "DNA reports that a couple of students were in critical condition; a petition says over thirty were injured. No official count was found (HIST-JU14-009)." },
    detentions    : { state: 'DISPUTED', note: "Arrests are counted as 35, 36 and 37, including within the same sources (HIST-JU14-008)." },
    firs          : { state: 'UNKNOWN', note: null },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0017',
    isoDate: '2015-07-03',   /* first day; used only to order the lists */
    slug: 'ftii-2015',
    title: "Police action during the FTII strike",
    place: "FTII, Pune, and Shastri Bhavan, New Delhi",
    state: "Maharashtra",
    coords: [18.529, 73.841],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "3 July 2015 to 7 January 2016",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Pune Police entered the campus after midnight on 18 to 19 August 2015 and arrested five students (HIST-FTII-002)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'UNKNOWN', items: [] },
    injuries      : { state: 'UNKNOWN', note: null },
    detentions    : { state: 'DISPUTED', note: "Delhi, 3 July 2015: more than 100 or over 200 detained at Shastri Bhavan (HIST-FTII-013). Pune, 18 to 19 August 2015: five arrested and bailed the next day (HIST-FTII-002, HIST-FTII-008). Pune, 7 January 2016: about 20 to 40 detained (HIST-FTII-017)." },
    firs          : { state: 'DISPUTED', note: "An FIR on the director's complaint names 15 students, or 40 in total with 15 named; sections 143, 147, 149, 323, 353 and 506 as reported; 35 named by March 2016 (HIST-FTII-006, HIST-FTII-007, HIST-FTII-009)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0018',
    isoDate: '2015-10-21',   /* first day; used only to order the lists */
    slug: 'occupy-ugc-2015',
    title: "Occupy UGC: detentions and lathi charges",
    place: "UGC office near ITO, New Delhi",
    state: "Delhi",
    coords: [28.6317, 77.2397],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "21 October to 9 December 2015",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'REPORTED', items: [{"text": "Delhi Police, with heavy presence from the first days (HIST-UGC-006)", "state": "REPORTED"}] },
    crowdControl  : { state: 'CORROBORATED', items: [{"text": "Lathis outside UGC gate number two on 23 October 2015, per Amar Ujala (HIST-UGC-003)", "state": "REPORTED"}, {"text": "Lathis, water cannon and tear gas on 9 December 2015 on the march toward Parliament (HIST-UGC-008)", "state": "CORROBORATED"}] },
    injuries      : { state: 'DISPUTED', note: "About 15 injured on 27 October 2015 per the protest side; police deny any lathicharge that day (HIST-UGC-004, HIST-UGC-005)." },
    detentions    : { state: 'DISPUTED', note: "About 97 to 100 students taken to Bhalswa police station on a disputed date (HIST-UGC-002); 33 to 50 detained on 27 October (HIST-UGC-004)." },
    firs          : { state: 'UNKNOWN', note: null },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0019',
    isoDate: '2017-01-23',   /* first day; used only to order the lists */
    slug: 'marina-beach-2017',
    kind: 'FORCE',
    title: "Police clearance of the Marina Beach Jallikattu protest",
    place: "Marina Beach, Chennai",
    state: "Tamil Nadu",
    coords: [13.05, 80.2824],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "23 January 2017",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Police cleared the protest camp on the morning of 23 January 2017 using force (HIST-C17A-001)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'CORROBORATED', items: [{"text": "Batons (HIST-C17A-001)", "state": "CORROBORATED"}, {"text": "A section 144 order issued by the Commissioner of Police, Greater Chennai, on 28 January 2017 per the State's account to the Madras High Court; five days after the clearance (HIST-C17A-006)", "state": "VERIFIED"}] },
    injuries      : { state: 'DISPUTED', note: "At least 20 injured per PTI; about 60 including 33 police per another source (HIST-C17A-003)." },
    detentions    : { state: 'UNKNOWN', note: "The number removed or detained is not established (HIST-C17A-004)." },
    firs          : { state: 'REPORTED', note: "A 2021 order withdrew 308 cases against 26,460 people (HIST-C17A-013)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0020',
    isoDate: '2017-02-21',   /* first day; used only to order the lists */
    slug: 'ramjas-2017',
    title: "Police action after the Ramjas College clash",
    place: "Ramjas College and Maurice Nagar police station, New Delhi",
    state: "Delhi",
    coords: [28.686, 77.209],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "21 and 22 February 2017",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Delhi Police, who detained students on 22 February 2017 near Maurice Nagar police station (HIST-RAM-004)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'UNKNOWN', items: [] },
    injuries      : { state: 'DISPUTED', note: "AISA said more than 20 teachers and students were badly injured; counts differ by source (HIST-RAM-006)." },
    detentions    : { state: 'DISPUTED', note: "About 100 students per Newslaundry; an unread PTI figure of 40 to 50 (HIST-RAM-005)." },
    firs          : { state: 'CORROBORATED', note: "One FIR at Maurice Nagar under IPC 147, 183, 353, 332, 323 and 149; no FIR against any police officer is reported (HIST-RAM-013)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0021',
    isoDate: '2017-04-06',   /* first day; used only to order the lists */
    slug: 'panjab-university-2017',
    kind: 'FORCE',
    title: "Police force on Panjab University students",
    place: "Panjab University, Chandigarh",
    state: "Chandigarh",
    coords: [30.76, 76.768],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "6 to 11 April 2017",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Police used force against students on 11 April 2017 (HIST-C17B-001)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'REPORTED', items: [{"text": "Cane charge and water cannon on 6 April 2017 (HIST-C17B-002)", "state": "REPORTED"}] },
    injuries      : { state: 'DISPUTED', note: "About 50 injured; one serious injury reported as an eye hit by a tear gas shell in one outlet and a broken jaw in another (HIST-C17B-004)." },
    detentions    : { state: 'DISPUTED', note: "35, 50, 52 or 66 detained or arrested, depending on the source (HIST-C17B-003)." },
    firs          : { state: 'DISPUTED', note: "66 students booked, first for rioting and later with sedition added; whether the sedition charge stayed is disputed (HIST-C17B-005, HIST-C17B-006)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0022',
    isoDate: '2020-01-30',   /* first day; used only to order the lists */
    slug: 'jamia-firing-2020',
    title: "Shooting near Jamia during an anti-CAA march",
    place: "Jamia Nagar, New Delhi",
    state: "Delhi",
    coords: [28.5614, 77.283],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "30 January 2020",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'UNKNOWN', items: [] },
    crowdControl  : { state: 'UNKNOWN', items: [] },
    injuries      : { state: 'DISPUTED', note: "One Jamia student was wounded; reports differ on the wound and the hospital (HIST-JMF-002)." },
    detentions    : { state: 'REPORTED', note: "The man who fired, reported to be 17, was charged with attempted murder; a weapon supplier was arrested on 3 February 2020 (HIST-JMF-009, HIST-JMF-010)." },
    firs          : { state: 'UNKNOWN', note: null },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0023',
    isoDate: '2022-01-24',   /* first day; used only to order the lists */
    slug: 'rrb-ntpc-2022',
    kind: 'FORCE',
    title: "Police action against railway recruitment exam aspirants",
    place: "Rajendra Nagar Terminal, Patna, and Prayagraj",
    state: "Bihar and Uttar Pradesh",
    coords: [25.5941, 85.1376],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "24 to 26 January 2022",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Police at Rajendra Nagar Terminal, Patna, on 24 January 2022 (HIST-RRB-002)", "state": "CORROBORATED"}, {"text": "Police dispersing aspirants and entering lodges in Prayagraj on 25 January 2022 (HIST-RRB-017)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'DISPUTED', items: [{"text": "Tear gas, water cannon and lathis reported in Patna; the administration called the force \"mild\" (HIST-RRB-002, HIST-RRB-003)", "state": "DISPUTED"}] },
    injuries      : { state: 'REPORTED', note: "'Several students' on the tracks injured, some seriously, per one outlet; no official count (HIST-RRB-018)." },
    detentions    : { state: 'CORROBORATED', note: "At least four arrested after the Patna protest; eight students per another report (HIST-RRB-005, HIST-RRB-006)." },
    firs          : { state: 'DISPUTED', note: "Patna FIR at Patrakar Nagar on 27 January 2022 (HIST-RRB-007); a Prayagraj case against about 1,000 or 1,500 unidentified people (HIST-RRB-022)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0024',
    isoDate: '2022-06-17',   /* first day; used only to order the lists */
    slug: 'agnipath-2022',
    title: "Firing at Secunderabad station during the Agnipath protest",
    place: "Secunderabad railway station",
    state: "Telangana",
    coords: [17.4344, 78.5013],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "17 June 2022",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'DISPUTED', items: [{"text": "Which force fired is disputed: Railway Protection Force, state police, or aerial firing by Telangana Police (HIST-AGN-002)", "state": "DISPUTED"}] },
    crowdControl  : { state: 'UNKNOWN', items: [] },
    injuries      : { state: 'DISPUTED', note: "One army aspirant died. Between 12 and 14 protesters were reported injured (HIST-AGN-001, HIST-AGN-005)." },
    detentions    : { state: 'REPORTED', note: "26 detained per Deccan Chronicle; 55 arrested and 8 sought per Hans India (HIST-AGN-008)." },
    firs          : { state: 'UNKNOWN', note: null },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0025',
    isoDate: '2024-06-20',   /* first day; used only to order the lists */
    slug: 'neet-2024',
    kind: 'DETENTIONS',
    title: "Detentions and force at the NEET-UG 2024 protests",
    place: "Delhi",
    state: "Delhi",
    coords: [28.627, 77.2166],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "20 June to 2 July 2024",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Delhi Police (HIST-NEET-005)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'DISPUTED', items: [{"text": "Lathi charge or \"mild force\" on 27 June 2024 at Jantar Mantar (HIST-NEET-005, HIST-NEET-006)", "state": "DISPUTED"}] },
    injuries      : { state: 'UNKNOWN', note: "No injury figure appears in any source read (HIST-NEET-018)." },
    detentions    : { state: 'DISPUTED', note: "Detentions on 20, 24, 26 and 27 June and 2 July, from over a dozen to around 60; the 27 June count is disputed (HIST-NEET-001, HIST-NEET-003, HIST-NEET-004, HIST-NEET-007, HIST-NEET-010)." },
    firs          : { state: 'REPORTED', note: "A case against the NSUI president over the NTA office incident, from one outlet; no FIR copy found (HIST-NEET-009)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0026',
    isoDate: '2024-12-29',   /* first day; used only to order the lists */
    slug: 'bpsc-2024',
    kind: 'FORCE',
    title: "Water cannon and lathicharge on BPSC aspirants in Patna",
    place: "Gandhi Maidan to JP Golambar, Patna",
    state: "Bihar",
    coords: [25.62, 85.14],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "29 December 2024",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Patna police (HIST-BPSC-001)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'CORROBORATED', items: [{"text": "Water cannon and lathicharge, per four outlets (HIST-BPSC-001)", "state": "CORROBORATED"}] },
    injuries      : { state: 'REPORTED', note: "'Several' students injured; no official count (HIST-BPSC-006)." },
    detentions    : { state: 'REPORTED', note: "'Some' detained; no official count (HIST-BPSC-006)." },
    firs          : { state: 'CORROBORATED', note: "An FIR at Gandhi Maidan police station against 21 named persons and several hundred unidentified persons (HIST-BPSC-007)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0027',
    isoDate: '2026-05-07',   /* first day; used only to order the lists */
    slug: 'bpsc-tre4-2026',
    title: "Lathicharge on teacher-recruitment aspirants in Patna",
    place: "Patna",
    state: "Bihar",
    coords: [25.5941, 85.1376],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'DISPUTED',
    date: "May 2026 (7 or 8 May)",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'REPORTED', items: [{"text": "Patna police (HIST-BPSCB-003)", "state": "REPORTED"}] },
    crowdControl  : { state: 'REPORTED', items: [{"text": "\"Pushing and mild lathicharge,\" per the City SP (Central) (HIST-BPSCB-003)", "state": "REPORTED"}] },
    injuries      : { state: 'UNKNOWN', note: null },
    detentions    : { state: 'REPORTED', note: "Four arrested, per National Herald (HIST-BPSCB-004)." },
    firs          : { state: 'REPORTED', note: "An FIR on a magistrate's complaint against about 5,000 unidentified aspirants (HIST-BPSCB-004)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0028',
    isoDate: '2018-09-20',   /* first day; used only to order the lists */
    slug: 'darivit-2018',
    kind: 'FORCE',
    title: "Police action at Darivit High School, Islampur",
    place: "Darivit High School, Islampur, Uttar Dinajpur",
    state: "West Bengal",
    coords: [26.2697, 88.1992],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "20 September 2018",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'VERIFIED', items: [{"text": "West Bengal Police from Islampur police station (HIST-DAR-002)", "state": "VERIFIED"}] },
    crowdControl  : { state: 'VERIFIED', items: [{"text": "Tear gas and rubber bullets, as the police themselves state (HIST-DAR-002)", "state": "VERIFIED"}] },
    injuries      : { state: 'DISPUTED', note: "Injury counts conflict: 12 police and 3 civilians per the CID, down to 2 per PTI. Two men died after shooting; who fired is disputed, with police denying live firing (HIST-DAR-004, HIST-DAR-010)." },
    detentions    : { state: 'UNKNOWN', note: null },
    firs          : { state: 'VERIFIED', note: "FIR No. 611 of 2018 at Islampur police station, registered by the police themselves (HIST-DAR-008). The court held the CID investigation inadequate, transferred the case to the NIA and ordered compensation (HIST-DAR-012)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0029',
    isoDate: '2018-05-02',   /* first day; used only to order the lists */
    slug: 'amu-2018',
    kind: 'FORCE',
    title: "Police action on students at Aligarh Muslim University",
    place: "Aligarh Muslim University, Aligarh",
    state: "Uttar Pradesh",
    coords: [27.9161, 78.0804],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "2 May 2018",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Police and the Rapid Action Force used force on students (HIST-AMU18-003)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'CORROBORATED', items: [{"text": "Lathi charge and tear gas; outlets differ on which was used (HIST-AMU18-003)", "state": "CORROBORATED"}] },
    injuries      : { state: 'DISPUTED', note: "From at least 3 students (Deccan Chronicle) to 28 students plus 13 police and up to 41 people (HIST-AMU18-005)." },
    detentions    : { state: 'REPORTED', note: "No detention of students is reported; two people were later arrested (HIST-AMU18-006)." },
    firs          : { state: 'REPORTED', note: "A magisterial inquiry was ordered on 4 May 2018; its outcome is reported only by one outlet in January 2019 (HIST-AMU18-008)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0030',
    isoDate: '2018-03-23',   /* first day; used only to order the lists */
    slug: 'jnu-2018',
    kind: 'FORCE',
    title: "Police stop a JNU march to Parliament",
    place: "INA Market, New Delhi",
    state: "Delhi",
    coords: [28.5775, 77.2105],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "23 March 2018",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Delhi Police (HIST-JNU18-001)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'DISPUTED', items: [{"text": "Water cannon, which police confirm; lathis or batons disputed, with the DCP denying batons (HIST-JNU18-005)", "state": "DISPUTED"}] },
    injuries      : { state: 'REPORTED', note: "Police say 41 police personnel were injured; students allege women students were manhandled (HIST-JNU18-007, HIST-JNU18-009)." },
    detentions    : { state: 'DISPUTED', note: "20 to 23 detained, depending on the report (HIST-JNU18-008)." },
    firs          : { state: 'CORROBORATED', note: "An FIR against 22 to 25 students at Sarojini Nagar police station; an FIR against an SHO on a journalist's complaint; a student union complaint against police (HIST-JNU18-012, HIST-JNU18-013, HIST-JNU18-014)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0031',
    isoDate: '2019-11-18',   /* first day; used only to order the lists */
    slug: 'jnu-fee-2019',
    title: "Police stop JNU fee-hike marches to Parliament and Rashtrapati Bhavan",
    place: "Parliament Street and Rashtrapati Bhavan approach, New Delhi",
    state: "Delhi",
    coords: [28.6172, 77.209],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "18 November and 9 December 2019",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Delhi Police, with Central Armed Police Forces (HIST-JNUF-001, HIST-JNUF-014)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'DISPUTED', items: [{"text": "Lathicharge on 18 November: denied by police, reported by many outlets (HIST-JNUF-003)", "state": "DISPUTED"}, {"text": "Section 144 or general orders around Parliament on 18 November; issuer not found (HIST-JNUF-005)", "state": "CORROBORATED"}] },
    injuries      : { state: 'DISPUTED', note: "18 November: police say nearly 30 personnel and 15 students; 9 December: over 30 students per a protester (HIST-JNUF-004, HIST-JNUF-016)." },
    detentions    : { state: 'DISPUTED', note: "18 November: about 50 or about 100; 9 December: several students including women (HIST-JNUF-002, HIST-JNUF-015)." },
    firs          : { state: 'CORROBORATED', note: "Two FIRs on 19 November 2019 at Kishangarh and Lodhi Colony (HIST-JNUF-011)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0032',
    isoDate: '2019-12-11',   /* first day; used only to order the lists */
    slug: 'cotton-university-2019',
    kind: 'FORCE',
    title: "Police on the Cotton University students march to Dispur",
    place: "Panbazar to Dispur, Guwahati",
    state: "Assam",
    coords: [26.1445, 91.7362],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "11 December 2019",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Assam Police (HIST-COT-001)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'CORROBORATED', items: [{"text": "Lathis and tear gas (HIST-COT-001)", "state": "CORROBORATED"}, {"text": "A curfew from 6:15 pm; issuer not established (HIST-COT-005)", "state": "CORROBORATED"}] },
    injuries      : { state: 'REPORTED', note: "At least two TV journalists hurt; students' forum alleges limb fractures among students; no count (HIST-COT-002)." },
    detentions    : { state: 'REPORTED', note: "'A number of student union leaders were arrested,' single source, no count (HIST-COT-003)." },
    firs          : { state: 'UNKNOWN', note: "No FIR specific to the march was found; statewide, 406 cases were reported in the Assembly (HIST-COT-009)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0033',
    isoDate: '2019-12-19',   /* first day; used only to order the lists */
    slug: 'varanasi-bhu-2019',
    kind: 'DETENTIONS',
    title: "Arrests of protesters including BHU students in Varanasi",
    place: "Chetganj, Varanasi",
    state: "Uttar Pradesh",
    coords: [25.314, 83.008],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "19 December 2019",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Police arrested the group on 19 December 2019 (HIST-VNS-001)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'CORROBORATED', items: [{"text": "A statewide Section 144 order announced by the Director General of Police for 19 December (HIST-VNS-008)", "state": "CORROBORATED"}] },
    injuries      : { state: 'UNKNOWN', note: "No injuries are reported for the arrestees (HIST-VNS-004)." },
    detentions    : { state: 'DISPUTED', note: "59, 68, 69 or 73 arrested; 12 to 25 BHU students among them; bail for 57 of 59 or all 56 on 2 January 2020 (HIST-VNS-002, HIST-VNS-003)." },
    firs          : { state: 'CORROBORATED', note: "56 charged under IPC 147, 148, 149, 188, 332, 353 and 341 and the Criminal Law Amendment Act 1932; a separate pamphlet case against three (HIST-VNS-010, HIST-VNS-011)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0034',
    isoDate: '2019-12-17',   /* first day; used only to order the lists */
    slug: 'madras-university-2019',
    kind: 'DETENTIONS',
    title: "Police on the University of Madras campus",
    place: "University of Madras, Chepauk, Chennai",
    state: "Tamil Nadu",
    coords: [13.0627, 80.2812],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "17 and 18 December 2019",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Police entered the campus on 17 December and removed protesters on the night of 18 December (HIST-MAD-002, HIST-MAD-008)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'UNKNOWN', items: [] },
    injuries      : { state: 'REPORTED', note: "A witness and a bystander allege lathi blows and dragging; police say the students roughed up police (HIST-MAD-004)." },
    detentions    : { state: 'DISPUTED', note: "Two, four or about 80 on 17 December; about 17 or no count on 18 December (HIST-MAD-003, HIST-MAD-011)." },
    firs          : { state: 'REPORTED', note: "No case or FIR was registered after the 18 December removal, per The Hindu and The News Minute (HIST-MAD-012)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0035',
    isoDate: '2020-02-10',   /* first day; used only to order the lists */
    slug: 'jamia-march-2020',
    title: "Police stop a Jamia march to Parliament",
    place: "Holy Family Hospital, Okhla, New Delhi",
    state: "Delhi",
    coords: [28.5614, 77.283],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "10 February 2020",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Delhi Police at barricades near Holy Family Hospital (HIST-JMA-003)", "state": "REPORTED"}] },
    crowdControl  : { state: 'DISPUTED', items: [{"text": "Force at the barricades: denied by police, alleged by students (HIST-JMA-008)", "state": "DISPUTED"}, {"text": "Prohibitory orders per PTI only; no order found (HIST-JMA-003)", "state": "REPORTED"}] },
    injuries      : { state: 'DISPUTED', note: "23, 29 or 32 reached a hospital; 55 went to the university health centre; students claim over 100 (HIST-JMA-010)." },
    detentions    : { state: 'CORROBORATED', note: "Nine detained and later released; detainees allege beatings, which police deny (HIST-JMA-011, HIST-JMA-012)." },
    firs          : { state: 'CORROBORATED', note: "A case against the 'violent crowd' was being registered; no FIR was read (HIST-JMA-014)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0036',
    isoDate: '2021-09-14',   /* first day; used only to order the lists */
    slug: 'bengaluru-nep-2021',
    kind: 'FORCE',
    title: "Baton charge on students marching to the Vidhana Soudha",
    place: "Mysore Bank Circle to Vidhana Soudha, Bengaluru",
    state: "Karnataka",
    coords: [12.9797, 77.5907],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "14 September 2021",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Bengaluru City Police (HIST-BLR-001)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'CORROBORATED', items: [{"text": "Baton charge, which the DCP (Central) defends (HIST-BLR-001, HIST-BLR-006)", "state": "CORROBORATED"}, {"text": "A prohibitory order cited by the DCP, issuer and date not found (HIST-BLR-006, HIST-BLR-010)", "state": "REPORTED"}] },
    injuries      : { state: 'DISPUTED', note: "Head wounds and fractures per one outlet's standfirst; police told another only two were hurt (HIST-BLR-004)." },
    detentions    : { state: 'DISPUTED', note: "More than 50 detained and released, or all taken into preventive custody from a crowd of about 300 (HIST-BLR-005)." },
    firs          : { state: 'REPORTED', note: "No FIR had been registered by late that night; police promised to register one (HIST-BLR-011)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0037',
    isoDate: '2021-08-06',   /* first day; used only to order the lists */
    slug: 'dhanbad-2021',
    kind: 'FORCE',
    title: "Lathi charge on girl students at the Dhanbad collectorate",
    place: "District Collectorate, Dhanbad",
    state: "Jharkhand",
    coords: [23.7957, 86.4304],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "6 August 2021 (the preceding blockade was on 5 August)",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Police and district administration personnel (HIST-DHN-001)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'CORROBORATED', items: [{"text": "Lathis (HIST-DHN-001)", "state": "CORROBORATED"}] },
    injuries      : { state: 'REPORTED', note: "Six injured, two fainted, per the Times of India only (HIST-DHN-005)." },
    detentions    : { state: 'CORROBORATED', note: "Students were taken into custody; eight 'arrested' per the Times of India only (HIST-DHN-006)." },
    firs          : { state: 'UNKNOWN', note: "No FIR found. A Deputy Commissioner's enquiry was set up; its findings were not found (HIST-DHN-008)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0038',
    isoDate: '2021-12-04',   /* first day; used only to order the lists */
    slug: 'lucknow-2021',
    kind: 'FORCE',
    title: "Lathi charge on a candlelight march of recruitment aspirants",
    place: "Lucknow",
    state: "Uttar Pradesh",
    coords: [26.8467, 80.9462],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'DISPUTED',
    date: "4 December 2021 (some outlets say 5 December)",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Police (HIST-LKO-001)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'CORROBORATED', items: [{"text": "Lathis (HIST-LKO-001)", "state": "CORROBORATED"}] },
    injuries      : { state: 'DISPUTED', note: "About a dozen (NewsClick), hundreds (a politician), or 'many' (HIST-LKO-005)." },
    detentions    : { state: 'UNKNOWN', note: "No detention is reported for 4 December (HIST-LKO-006)." },
    firs          : { state: 'UNKNOWN', note: null },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0039',
    isoDate: '2021-09-07',   /* first day; used only to order the lists */
    slug: 'agartala-2021',
    title: "Lathi charge on teacher-trainees outside Siksha Bhawan",
    place: "Siksha Bhawan, Agartala",
    state: "Tripura",
    coords: [23.8315, 91.2868],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'REPORTED',
    date: "About 7 September 2021",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'REPORTED', items: [{"text": "Police and CRPF, per one outlet (HIST-AGT-001)", "state": "REPORTED"}] },
    crowdControl  : { state: 'REPORTED', items: [{"text": "Lathi charge, per one outlet (HIST-AGT-001)", "state": "REPORTED"}] },
    injuries      : { state: 'REPORTED', note: "Over 20 injured per ETV Bharat; 'more than 23' per an ABVP office-holder. One source (HIST-AGT-004)." },
    detentions    : { state: 'UNKNOWN', note: null },
    firs          : { state: 'UNKNOWN', note: null },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0040',
    isoDate: '2023-01-24',   /* first day; used only to order the lists */
    slug: 'bbc-screenings-2023',
    kind: 'DETENTIONS',
    title: "Detentions at screenings of the BBC documentary",
    place: "Jamia Millia Islamia, Delhi University and the University of Hyderabad",
    state: "Delhi",
    coords: [28.5614, 77.283],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "24 to 27 January 2023",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Delhi Police at Jamia and Delhi University (HIST-BBC-009, HIST-BBC-025)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'CORROBORATED', items: [{"text": "Section 144 at Delhi University, with the dates disputed (HIST-BBC-030)", "state": "DISPUTED"}, {"text": "The Ministry of Information and Broadcasting ordered links blocked (HIST-BBC-001)", "state": "CORROBORATED"}] },
    injuries      : { state: 'REPORTED', note: "No injury count; allegations of manhandling at Jamia and of dragging at Delhi University, attributed (HIST-BBC-019, HIST-BBC-031)." },
    detentions    : { state: 'DISPUTED', note: "Jamia: 13 per the DCP, 4, or over 70 per the SFI. Delhi University: 24 detained and released by evening (HIST-BBC-010, HIST-BBC-025)." },
    firs          : { state: 'REPORTED', note: "An FIR over the Delhi University screening attempt, per the Indian Express; no number or sections found (HIST-BBC-032)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0041',
    isoDate: '2023-03-14',   /* first day; used only to order the lists */
    slug: 'tspsc-2023',
    kind: 'DETENTIONS',
    title: "Detentions at the TSPSC paper-leak protests",
    place: "TSPSC office and Osmania University, Hyderabad",
    state: "Telangana",
    coords: [17.385, 78.4867],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "14 to 24 March 2023",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Hyderabad city police (HIST-TSP-001, HIST-TSP-007)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'REPORTED', items: [{"text": "Section 144 around the TSPSC office, per PTI; order not found (HIST-TSP-005)", "state": "REPORTED"}] },
    injuries      : { state: 'UNKNOWN', note: "No injuries are reported in the pages read." },
    detentions    : { state: 'DISPUTED', note: "About 25 or about 80 on 14 and 15 March; student leaders picked up from hostels at Osmania University on 24 March; Congress leaders under house arrest (HIST-TSP-002, HIST-TSP-007, HIST-TSP-008, HIST-TSP-009)." },
    firs          : { state: 'CORROBORATED', note: "Seven BJYM activists arrested and sent to judicial remand; sections disputed (HIST-TSP-003, HIST-TSP-004)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0042',
    isoDate: '2023-07-01',   /* first day; used only to order the lists */
    slug: 'patna-domicile-2023',
    kind: 'FORCE',
    title: "Lathi charge on teacher-eligibility aspirants at Dak Bungalow Chowk",
    place: "Dak Bungalow Chowk, Patna",
    state: "Bihar",
    coords: [25.6093, 85.1376],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "1 July 2023",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Patna Police (HIST-PDM-001)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'CORROBORATED', items: [{"text": "Lathis (HIST-PDM-001)", "state": "CORROBORATED"}] },
    injuries      : { state: 'DISPUTED', note: "Six (IANS), seven hospitalised (Indian Express) or 'a few' (Times of India) (HIST-PDM-004)." },
    detentions    : { state: 'DISPUTED', note: "Over 36 (IANS), about 20 (the SSP via the Times of India) or no figure (HIST-PDM-005)." },
    firs          : { state: 'REPORTED', note: "Two FIRs, at Kotwali and Gandhi Maidan stations, from the SSP via the Times of India (HIST-PDM-006)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0043',
    isoDate: '2023-10-23',   /* first day; used only to order the lists */
    slug: 'israeli-embassy-2023',
    kind: 'DETENTIONS',
    title: "Detentions at a march to the Israeli embassy",
    place: "Near the Israeli embassy, New Delhi",
    state: "Delhi",
    coords: [28.6, 77.186],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "23 October 2023",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Delhi Police (HIST-ISR-001)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'REPORTED', items: [{"text": "Section 144, per one outlet; police cited lack of permission (HIST-ISR-003)", "state": "REPORTED"}] },
    injuries      : { state: 'DISPUTED', note: "Students allege being manhandled; police deny it; no injury count (HIST-ISR-004)." },
    detentions    : { state: 'DISPUTED', note: "About 200 per a police officer via PTI; the JNU union president says at least 30 students were present (HIST-ISR-002)." },
    firs          : { state: 'UNKNOWN', note: null },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0044',
    isoDate: '2023-03-28',   /* first day; used only to order the lists */
    slug: 'du-indraprastha-2023',
    title: "Removal of protesters at Indraprastha College",
    place: "Indraprastha College for Women, Civil Lines, Delhi",
    state: "Delhi",
    coords: [28.685, 77.223],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "28 March to 3 April 2023",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Delhi Police on 29 March, 31 March and 3 April (HIST-IPC-002, HIST-IPC-006, HIST-IPC-010)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'REPORTED', items: [{"text": "Protest declared unlawful and no permission granted, per police (HIST-IPC-003)", "state": "DISPUTED"}] },
    injuries      : { state: 'REPORTED', note: "One injury, to an SFI member's arm, is the SFI's own statement. No count (HIST-IPC-004)." },
    detentions    : { state: 'DISPUTED', note: "29 March: about 30 removed, 26 released or 15 detained. 3 April: 10 to 15 or 27 removed (HIST-IPC-003, HIST-IPC-004, HIST-IPC-010)." },
    firs          : { state: 'DISPUTED', note: "An FIR in the fest case on 28 March; no case against protesters was found (HIST-IPC-013, HIST-IPC-014)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0045',
    isoDate: '2025-03-30',   /* first day; used only to order the lists */
    slug: 'hcu-2025',
    title: "Police and students at Kancha Gachibowli",
    place: "University of Hyderabad, Gachibowli, Hyderabad",
    state: "Telangana",
    coords: [17.46, 78.334],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "30 March to 3 April 2025",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Cyberabad police took students into custody on 30 March (HIST-HCU25-001)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'DISPUTED', items: [{"text": "A lathi charge on 2 April: reported by four outlets, denied by the Madhapur DCP (HIST-HCU25-011)", "state": "DISPUTED"}, {"text": "Entry restricted from 4 to 16 April under BNSS section 163 (HIST-HCU25-028)", "state": "REPORTED"}] },
    injuries      : { state: 'DISPUTED', note: "At least 20 students injured on 2 April per The Hindu; police say an Assistant Commissioner was seriously injured on 30 March (HIST-HCU25-010, HIST-HCU25-012)." },
    detentions    : { state: 'DISPUTED', note: "52 or 53 per police, close to 50 per the Commissioner, about 100 per students on 30 March; over 80 on 3 April (HIST-HCU25-002, HIST-HCU25-013)." },
    firs          : { state: 'CORROBORATED', note: "Crime No. 608/2025 at Gachibowli; two arrested and remanded; a custody FIR naming 54 students (HIST-HCU25-004, HIST-HCU25-005, HIST-HCU25-006)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0046',
    isoDate: '2025-01-06',   /* first day; used only to order the lists */
    slug: 'bpsc-gandhi-maidan-2025',
    title: "Removal of BPSC protesters from Gandhi Maidan",
    place: "Gandhi Maidan, Patna",
    state: "Bihar",
    coords: [25.62, 85.14],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "6 January 2025",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Patna Police from about 10 stations (HIST-BPSC25-001)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'UNKNOWN', items: [] },
    injuries      : { state: 'DISPUTED', note: "A constable's hand broken (one outlet); the slap on Kishor and force at AIIMS are disputed; no official count (HIST-BPSC25-029)." },
    detentions    : { state: 'DISPUTED', note: "43, 43 plus one, or 45; the District Magistrate said 30 were not students (HIST-BPSC25-006, HIST-BPSC25-007, HIST-BPSC25-009)." },
    firs          : { state: 'CORROBORATED', note: "An FIR at Gandhi Maidan police station; Kishor granted bail on 6 January (HIST-BPSC25-019, HIST-BPSC25-024)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0047',
    isoDate: '2025-08-24',   /* first day; used only to order the lists */
    slug: 'ssc-ramlila-2025',
    title: "Dispersal of the SSC protest at Ramlila Maidan",
    place: "Ramlila Maidan, New Delhi",
    state: "Delhi",
    coords: [28.643, 77.238],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "24 August 2025",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Delhi Police (HIST-SSC-001)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'DISPUTED', items: [{"text": "Lathi charge: denied by police, alleged by protesters and politicians (HIST-SSC-003)", "state": "DISPUTED"}, {"text": "BNSS 163 said to be in force; issuer not found (HIST-SSC-009)", "state": "REPORTED"}] },
    injuries      : { state: 'REPORTED', note: "Police say five of their personnel were injured, three of them women constables; no protester count (HIST-SSC-005)." },
    detentions    : { state: 'DISPUTED', note: "40 per the DCP Central; 44 per an unnamed senior officer to PTI (HIST-SSC-002)." },
    firs          : { state: 'REPORTED', note: "An FIR that night; two organisers, 18 teachers and 40 people booked per the Times of India (HIST-SSC-012, HIST-SSC-013)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0048',
    isoDate: '2025-11-10',   /* first day; used only to order the lists */
    slug: 'panjab-university-2025',
    title: "Lathicharge and detentions at Panjab University",
    place: "Panjab University, Chandigarh",
    state: "Chandigarh",
    coords: [30.76, 76.768],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'CORROBORATED',
    date: "10 November 2025",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: { state: 'CORROBORATED', items: [{"text": "Chandigarh Police and Punjab Police (HIST-PU25-001)", "state": "CORROBORATED"}] },
    crowdControl  : { state: 'REPORTED', items: [{"text": "'Mild lathicharge,' in PTI's wording (HIST-PU25-001)", "state": "REPORTED"}] },
    injuries      : { state: 'DISPUTED', note: "Four police personnel injured; the SSP says no one was injured or harmed; no protester injury reported (HIST-PU25-006)." },
    detentions    : { state: 'DISPUTED', note: "About 80 per the Indian Express; 'several' per the Tribune, which quotes the SSP saying those held were not detained (HIST-PU25-005)." },
    firs          : { state: 'CORROBORATED', note: "An FIR against unidentified students and outsiders under seven BNS sections (HIST-PU25-013)." },
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0049',
    isoDate: '2014-06-21',   /* first day; used only to order the lists */
    slug: 'du-vc-office-june-2014',
    kind: 'FORCE',
    title: "Police water cannon on ABVP and NSUI students at Delhi University",
    place: "Vice-Chancellor's office, North Campus, Delhi University, New Delhi",
    state: "Delhi",
    coords: [28.6881, 77.209],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "21 and 26 June 2014",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Delhi Police (HIST-FYUP14-001)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Barricades, water cannon, and a lathicharge in Deccan Herald (HIST-FYUP14-001, HIST-FYUP14-005)", "state": "CORROBORATED"}]},
    injuries      : {"state": "CORROBORATED", "note": "Two ABVP and four NSUI members injured on 21 June, per Deccan Herald (HIST-FYUP14-002)."},
    detentions    : {"state": "CORROBORATED", "note": "Five ABVP members detained on 21 June (HIST-FYUP14-003). About 25 to 30 AISA students were detained on 26 June near Central Secretariat, a separate march (HIST-FYUP14-006)."},
    firs          : {"state": "UNKNOWN", "note": "No FIR found in the sources read (HIST-FYUP14-008)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0050',
    isoDate: '2014-07-24',   /* first day; used only to order the lists */
    slug: 'upsc-csat-july-2014',
    kind: 'FORCE',
    title: "Police action against UPSC CSAT protesters in Delhi",
    place: "Gandhi Vihar and Mukherjee Nagar; the approach to Parliament; the UPSC office on Shahjahan Road, New Delhi",
    state: "Delhi",
    coords: [28.705, 77.21],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "24 to 28 July 2014",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Delhi Police, North and New Delhi districts (HIST-CSAT14-001, HIST-CSAT14-006)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "REPORTED", "items": [{"text": "Tear gas, per the police (HIST-CSAT14-002)", "state": "REPORTED"}, {"text": "Lathicharge, alleged by aspirants and two Rajya Sabha members; no police source uses the word (HIST-CSAT14-003)", "state": "CORROBORATED"}, {"text": "Water cannon on 28 July, from one wire (HIST-CSAT14-012)", "state": "DISPUTED"}, {"text": "Section 144 cited on 25 July, issuer not named (HIST-CSAT14-009)", "state": "REPORTED"}]},
    injuries      : {"state": "REPORTED", "note": "Injuries alleged by aspirants; the Aam Aadmi Party released photographs on 26 July (HIST-CSAT14-004)."},
    detentions    : {"state": "DISPUTED", "note": "235 held at Parliament Street police station per Additional CP S B S Tyagi; other counts differ (HIST-CSAT14-007)."},
    firs          : {"state": "CORROBORATED", "note": "A case was registered at Timarpur police station (HIST-CSAT14-005)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0051',
    isoDate: '2015-03-18',   /* first day; used only to order the lists */
    slug: 'sfi-shimla-march-2015',
    kind: 'FORCE',
    title: "Lathicharge and water cannon on the SFI march to the Vidhan Sabha",
    place: "Vidhan Sabha, Shimla",
    state: "Himachal Pradesh",
    coords: [31.1048, 77.1734],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "18 March 2015",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Himachal Pradesh Police, Shimla (HIST-SHM15-001)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Lathicharge and water cannon (HIST-SHM15-001)", "state": "CORROBORATED"}]},
    injuries      : {"state": "DISPUTED", "note": "24 hurt including six police, per the Tribune; other counts differ (HIST-SHM15-002)."},
    detentions    : {"state": "REPORTED", "note": "Six SFI activists were arrested and jailed (HIST-SHM15-004). The CPI(M) alleges custodial beating and an entry into its office, which is its allegation only (HIST-SHM15-005, HIST-SHM15-006)."},
    firs          : {"state": "REPORTED", "note": "A rioting case under several IPC sections and the Public Property Act, per the Tribune (HIST-SHM15-003)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0052',
    isoDate: '2015-06-25',   /* first day; used only to order the lists */
    slug: 'kashmir-university-june-2015',
    kind: 'FORCE',
    title: "Police action on University of Kashmir students protesting a classmate's arrest",
    place: "University of Kashmir, Hazratbal, Srinagar",
    state: "Jammu and Kashmir",
    coords: [34.1285, 74.838],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "25 June 2015",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "DISPUTED", "items": [{"text": "J&K Police and university security staff; which of them fired is disputed (HIST-KU15-001, HIST-KU15-006)", "state": "DISPUTED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Aerial firing, a baton charge, flash bangs, and tear gas in one report (HIST-KU15-001)", "state": "CORROBORATED"}, {"text": "Class work suspended and hostels vacated (HIST-KU15-008)", "state": "CORROBORATED"}]},
    injuries      : {"state": "REPORTED", "note": "At least five injured, per Scroll only (HIST-KU15-001)."},
    detentions    : {"state": "DISPUTED", "note": "One student was arrested on 22 June; police and students give different reasons (HIST-KU15-002)."},
    firs          : {"state": "REPORTED", "note": "Police cite FIR 90 of Raj Bagh police station for the arrested student; its text was not seen (HIST-KU15-002)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0053',
    isoDate: '2015-10-12',   /* first day; used only to order the lists */
    slug: 'presidency-college-october-2015',
    kind: 'FORCE',
    title: "Lathicharge on Presidency College students demanding union elections",
    place: "Kamarajar Salai, Chennai",
    state: "Tamil Nadu",
    coords: [13.0636, 80.283],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "12 October 2015",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Chennai city police, Triplicane division (HIST-PCC15-001, HIST-PCC15-004)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Lathicharge (HIST-PCC15-001)", "state": "CORROBORATED"}]},
    injuries      : {"state": "DISPUTED", "note": "Students said 20 were injured and a second outlet says eight (HIST-PCC15-002)."},
    detentions    : {"state": "REPORTED", "note": "Two postgraduate students arrested, per an unnamed senior officer (HIST-PCC15-005)."},
    firs          : {"state": "REPORTED", "note": "A case under IPC 353 and the Tamil Nadu Public Property Act, from one outlet (HIST-PCC15-005)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0054',
    isoDate: '2022-01-31',   /* first day; used only to order the lists */
    slug: 'board-exam-protests-january-2022',
    kind: 'FORCE',
    title: "Baton charge on students protesting offline board exams",
    place: "Ashok Mill Naka, Dharavi, Mumbai, and Medical Square, Nagpur",
    state: "Maharashtra",
    coords: [19.043, 72.854],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "31 January 2022",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Mumbai Police, Dharavi area (HIST-BRD22-001)", "state": "CORROBORATED"}, {"text": "Nagpur Police (HIST-BRD22-007)", "state": "REPORTED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Baton charge in Mumbai (HIST-BRD22-001)", "state": "CORROBORATED"}, {"text": "Dispersal attempts, per DCP Zone V (HIST-BRD22-004)", "state": "REPORTED"}]},
    injuries      : {"state": "REPORTED", "note": "Police say no student was injured (HIST-BRD22-003). No independent account was found."},
    detentions    : {"state": "CORROBORATED", "note": "Some students were detained and released (HIST-BRD22-003)."},
    firs          : {"state": "CORROBORATED", "note": "An FIR at Dharavi police station against a YouTuber and others (HIST-BRD22-005)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0055',
    isoDate: '2022-01-31',   /* first day; used only to order the lists */
    slug: 'bangalore-university-january-2022',
    kind: 'FORCE',
    title: "Lathi charge on protesting students at Bangalore University",
    place: "Jnanabharathi campus, Bangalore University, Bengaluru",
    state: "Karnataka",
    coords: [12.939, 77.503],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "31 January 2022",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Bengaluru city police (HIST-BU22-001)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Lathi charge (HIST-BU22-001)", "state": "CORROBORATED"}]},
    injuries      : {"state": "DISPUTED", "note": "Students reported injuries including a woman bleeding from the head, which police denied; police said policemen were hurt (HIST-BU22-004)."},
    detentions    : {"state": "UNKNOWN", "note": "No detention count found (HIST-BU22-009)."},
    firs          : {"state": "UNKNOWN", "note": "No FIR found (HIST-BU22-009)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0056',
    isoDate: '2022-02-08',   /* first day; used only to order the lists */
    slug: 'karnataka-hijab-protests-february-2022',
    kind: 'FORCE',
    title: "Lathicharge and tear gas at hijab-dispute protests in Karnataka",
    place: "Shivamogga, Harihar, Bagalkot and Raichur",
    state: "Karnataka",
    coords: [13.9299, 75.5681],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "8 February 2022",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Karnataka Police, Shivamogga, Davanagere and Bagalkot districts (HIST-HJB22-001, HIST-HJB22-005)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Lathicharge at Shivamogga (HIST-HJB22-001)", "state": "CORROBORATED"}, {"text": "Tear gas and baton charge at Harihar (HIST-HJB22-005)", "state": "CORROBORATED"}, {"text": "Section 144 orders at Shivamogga, Harihar and Bengaluru (HIST-HJB22-004, HIST-HJB22-009)", "state": "CORROBORATED"}]},
    injuries      : {"state": "UNKNOWN", "note": "No injury count found in the sources read."},
    detentions    : {"state": "REPORTED", "note": "Eight detained at Shivamogga and 18 at Raichur, from one outlet (HIST-HJB22-003, HIST-HJB22-008)."},
    firs          : {"state": "REPORTED", "note": "The Shivamogga SP said three FIRs were registered (HIST-HJB22-002)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0057',
    isoDate: '2022-02-19',   /* first day; used only to order the lists */
    slug: 'aliah-university-february-2022',
    kind: 'FORCE',
    title: "Police stop Aliah University students marching after a student leader's death",
    place: "College Street and Park Circus, Kolkata",
    state: "West Bengal",
    coords: [22.5744, 88.3629],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "19 and 22 February 2022",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Kolkata Police (HIST-ALU22-002)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Barricades and a lathicharge on 22 February (HIST-ALU22-002)", "state": "CORROBORATED"}, {"text": "A scuffle at a barricade on 19 February (HIST-ALU22-001)", "state": "REPORTED"}]},
    injuries      : {"state": "UNKNOWN", "note": "No injury count found."},
    detentions    : {"state": "DISPUTED", "note": "Reports say \"some\" were detained, arrested, or released at night; no count (HIST-ALU22-003)."},
    firs          : {"state": "UNKNOWN", "note": "No FIR for the police action found (HIST-ALU22-007)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0058',
    isoDate: '2022-04-04',   /* first day; used only to order the lists */
    slug: 'du-sol-april-2022',
    kind: 'DETENTIONS',
    title: "Police detain students protesting offline exams at Delhi University",
    place: "Arts Faculty, North Campus, University of Delhi, New Delhi",
    state: "Delhi",
    coords: [28.689, 77.21],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "4 April 2022",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Delhi Police, local police (HIST-SOL22-002)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "REPORTED", "items": [{"text": "Dispersal warnings, per a senior police officer (HIST-SOL22-007)", "state": "REPORTED"}]},
    injuries      : {"state": "UNKNOWN", "note": "Force is disputed: KYS alleges assault and police say none was used (HIST-SOL22-006). No injury record found."},
    detentions    : {"state": "CORROBORATED", "note": "Some protesters were taken to the police station; no total is given (HIST-SOL22-002, HIST-SOL22-003)."},
    firs          : {"state": "CORROBORATED", "note": "A case was lodged; The Quint reports it as IPC 188 against five students (HIST-SOL22-004, HIST-SOL22-005)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0059',
    isoDate: '2022-04-11',   /* first day; used only to order the lists */
    slug: 'jnu-detentions-april-2022',
    kind: 'DETENTIONS',
    title: "Students detained outside Delhi Police headquarters after the JNU Kaveri Hostel clash",
    place: "Jai Singh Road and Delhi Police headquarters, New Delhi",
    state: "Delhi",
    coords: [28.629, 77.219],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "11 April 2022",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Delhi Police (HIST-JNU22-001)", "state": "CORROBORATED"}, {"text": "CRPF, from one source (HIST-JNU22-005)", "state": "REPORTED"}]},
    crowdControl  : {"state": "REPORTED", "items": [{"text": "Section 144 cited by police; the issuer is not named (HIST-JNU22-003)", "state": "REPORTED"}]},
    injuries      : {"state": "REPORTED", "note": "AISA alleges women protesters were manhandled; force is not corroborated (HIST-JNU22-006)."},
    detentions    : {"state": "DISPUTED", "note": "Counts of 20, 70 and \"hundreds\" (HIST-JNU22-002)."},
    firs          : {"state": "REPORTED", "note": "A case under IPC 188 and 323, per The Quint (HIST-JNU22-004). A separate FIR against unidentified ABVP students concerns the hostel clash (HIST-JNU22-008)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0060',
    isoDate: '2022-06-09',   /* first day; used only to order the lists */
    slug: 'panjab-university-june-2022',
    kind: 'FORCE',
    title: "Police stop Panjab University students marching to Punjab Raj Bhavan",
    place: "YPS roundabout, Mohali, on the Chandigarh border",
    state: "Punjab and Chandigarh",
    coords: [30.696, 76.722],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "9 June 2022",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "DISPUTED", "items": [{"text": "Punjab Police or Chandigarh Police; sources disagree (HIST-PU22-005)", "state": "DISPUTED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Barricades; a lathicharge alleged by students and denied by a DSP (HIST-PU22-002, HIST-PU22-004)", "state": "CORROBORATED"}]},
    injuries      : {"state": "DISPUTED", "note": "Student leaders say one female student fainted and others were hospitalised; no hospital record (HIST-PU22-003)."},
    detentions    : {"state": "UNKNOWN", "note": "No detention count found."},
    firs          : {"state": "UNKNOWN", "note": "No FIR found (HIST-PU22-009)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0061',
    isoDate: '2022-06-15',   /* first day; used only to order the lists */
    slug: 'agnipath-bihar-up-june-2022',
    kind: 'FORCE',
    title: "Police action against Agnipath protesters in Bihar and Uttar Pradesh",
    place: "Arrah and other districts of Bihar; Ballia, Bhadohi and other districts of Uttar Pradesh",
    state: "Bihar and Uttar Pradesh",
    coords: [25.556, 84.663],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "15 to 20 June 2022",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Bihar Police (HIST-AGP22-001)", "state": "REPORTED"}, {"text": "Uttar Pradesh Police (HIST-AGP22-003)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Tear gas and batons in Bihar (HIST-AGP22-001)", "state": "REPORTED"}, {"text": "Lathicharge at Ballia (HIST-AGP22-003) and Bhadohi (HIST-AGP22-004)", "state": "CORROBORATED"}, {"text": "Preventive arrests under Section 151 in UP (HIST-AGP22-010)", "state": "CORROBORATED"}, {"text": "Internet suspended in 12 Bihar districts, later 20 (HIST-AGP22-008)", "state": "CORROBORATED"}]},
    injuries      : {"state": "UNKNOWN", "note": "No injury count found in the sources read."},
    detentions    : {"state": "CORROBORATED", "note": "Bihar reached 805 arrests (HIST-AGP22-005). UP reported 387 arrested on 19 June and 475 on 20 June (HIST-AGP22-010, HIST-AGP22-011)."},
    firs          : {"state": "CORROBORATED", "note": "148 FIRs in Bihar (HIST-AGP22-005); 34 FIRs in UP on 19 June and 39 on 20 June (HIST-AGP22-010, HIST-AGP22-011)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0062',
    isoDate: '2016-01-18',   /* first day; used only to order the lists */
    slug: 'hrd-ministry-january-2016',
    kind: 'FORCE',
    title: "Water cannon and detentions at the HRD Ministry after Rohith Vemula's death",
    place: "Shastri Bhawan, New Delhi",
    state: "Delhi",
    coords: [28.617, 77.216],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "18, 22 and 27 January 2016",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Delhi Police (HIST-HRDM16-001)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Water cannon on 18 January (HIST-HRDM16-001)", "state": "CORROBORATED"}, {"text": "Section 144 said by students to be in force; issuer not named (HIST-HRDM16-004)", "state": "REPORTED"}]},
    injuries      : {"state": "REPORTED", "note": "Police say an Additional DCP and the SHO of Connaught Place police station were injured (HIST-HRDM16-002). Students say they were beaten (HIST-HRDM16-004)."},
    detentions    : {"state": "CORROBORATED", "note": "About 70 detained on 18 January, per police (HIST-HRDM16-003). Later detentions on 22 and 27 January, with counts that differ (HIST-HRDM16-006, HIST-HRDM16-007)."},
    firs          : {"state": "UNKNOWN", "note": "No FIR found (HIST-HRDM16-009)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0063',
    isoDate: '2016-01-30',   /* first day; used only to order the lists */
    slug: 'jhandewalan-march-january-2016',
    kind: 'FORCE',
    title: "Lathicharge on students marching to the RSS office at Jhandewalan",
    place: "Jhandewalan, New Delhi",
    state: "Delhi",
    coords: [28.644, 77.2],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "30 January 2016",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Delhi Police (HIST-JHAN16-001)", "state": "CORROBORATED"}, {"text": "Men in plain clothes seen beating protesters in video; police and the RSS deny they were theirs (HIST-JHAN16-006)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Lathis and fists (HIST-JHAN16-001)", "state": "CORROBORATED"}]},
    injuries      : {"state": "REPORTED", "note": "A journalist describes being beaten and his camera destroyed (HIST-JHAN16-002)."},
    detentions    : {"state": "UNKNOWN", "note": "No detention count found."},
    firs          : {"state": "UNKNOWN", "note": "No FIR found; the inquiry outcome is not known (HIST-JHAN16-016)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0064',
    isoDate: '2016-02-23',   /* first day; used only to order the lists */
    slug: 'burdwan-university-february-2016',
    kind: 'FORCE',
    title: "Police baton charge on SFI protesters at Burdwan University",
    place: "Burdwan University, Rajbati, West Bengal",
    state: "West Bengal",
    coords: [23.254, 87.851],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "23 February 2016",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "West Bengal Police, Burdwan (HIST-BURD16-001), called in by the university (HIST-BURD16-004)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "DISPUTED", "items": [{"text": "A baton charge per IANS and IBNS; a police official says police only chased and dispersed the agitators (HIST-BURD16-002)", "state": "DISPUTED"}]},
    injuries      : {"state": "DISPUTED", "note": "SFI claims 20 and 12 injured (HIST-BURD16-003)."},
    detentions    : {"state": "UNVERIFIED", "note": "The arrest of two Left members, from one outlet (HIST-BURD16-008)."},
    firs          : {"state": "UNKNOWN", "note": "No FIR found (HIST-BURD16-012)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0065',
    isoDate: '2016-04-05',   /* first day; used only to order the lists */
    slug: 'nit-srinagar-april-2016',
    kind: 'FORCE',
    title: "Lathicharge on outstation students at NIT Srinagar",
    place: "NIT Srinagar campus, Hazratbal, Srinagar",
    state: "Jammu and Kashmir",
    coords: [34.126, 74.837],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "5 April 2016",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "J&K Police (HIST-NITS16-001); CRPF deployed afterwards (HIST-NITS16-006)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Lathicharge (HIST-NITS16-001); police and student accounts conflict (HIST-NITS16-004)", "state": "DISPUTED"}]},
    injuries      : {"state": "REPORTED", "note": "Reported only as \"some\" injured (HIST-NITS16-001)."},
    detentions    : {"state": "UNKNOWN", "note": "No detention count found."},
    firs          : {"state": "REPORTED", "note": "Two FIRs registered by J&K Police, from reports (HIST-NITS16-007). A state inquiry reported on 24 April, known only second-hand (HIST-NITS16-012)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0066',
    isoDate: '2016-10-21',   /* first day; used only to order the lists */
    slug: 'jnu-home-ministry-march-october-2016',
    kind: 'DETENTIONS',
    title: "JNU students detained over the missing student Najeeb Ahmed",
    place: "Near the Home Ministry and Parliament Street, New Delhi",
    state: "Delhi",
    coords: [28.619, 77.212],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "21 October 2016, with related detentions on 28 October and 6 November",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Delhi Police (HIST-JNUH16-001)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "REPORTED", "items": [{"text": "A precautionary step, per police officials (HIST-JNUH16-005)", "state": "REPORTED"}]},
    injuries      : {"state": "UNKNOWN", "note": "No fetched source reports force or injury (HIST-JNUH16-006)."},
    detentions    : {"state": "DISPUTED", "note": "Over 200 per IANS, 80 to 100 per police officials; the place also differs (HIST-JNUH16-002, HIST-JNUH16-003). Detentions on 6 November at India Gate (HIST-JNUH16-011)."},
    firs          : {"state": "UNKNOWN", "note": "No FIR against the detained students found (HIST-JNUH16-008)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0067',
    isoDate: '2024-07-28',   /* first day; used only to order the lists */
    slug: 'rajinder-nagar-protest-july-2024',
    kind: 'DETENTIONS',
    title: "Police detain civil services aspirants protesting the coaching-centre deaths",
    place: "Old Rajinder Nagar and Karol Bagh Metro, New Delhi",
    state: "Delhi",
    coords: [28.642, 77.183],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "28 to 31 July 2024",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Delhi Police, with RAF and paramilitary forces (HIST-COAC24-003)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Body cameras and drones (HIST-COAC24-003)", "state": "CORROBORATED"}]},
    injuries      : {"state": "UNKNOWN", "note": "No injury count found; The Tribune alone says police pushed the students (HIST-COAC24-002)."},
    detentions    : {"state": "CORROBORATED", "note": "\"A few\" detained on 28 July, no count (HIST-COAC24-001). Over a dozen \"outsiders\" removed on 31 July, per an unnamed officer (HIST-COAC24-005)."},
    firs          : {"state": "REPORTED", "note": "An FIR over the deaths, not the protest (HIST-COAC24-008)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0068',
    isoDate: '2024-09-10',   /* first day; used only to order the lists */
    slug: 'manipur-students-march-september-2024',
    kind: 'FORCE',
    title: "Tear gas on students marching to Raj Bhavan, Imphal",
    place: "BT Road near Congress Bhavan, Imphal",
    state: "Manipur",
    coords: [24.817, 93.936],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "10 September 2024",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Security forces and police; RAF and batons from \"sources\" only (HIST-MANI24-002)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Tear gas (HIST-MANI24-002)", "state": "CORROBORATED"}, {"text": "Curfew by the district magistrates of Imphal East and West (HIST-MANI24-004)", "state": "CORROBORATED"}, {"text": "Section 163(2) BNSS in Thoubal; issuer not named (HIST-MANI24-005)", "state": "REPORTED"}, {"text": "Internet suspension by the Home Department (HIST-MANI24-006)", "state": "CORROBORATED"}]},
    injuries      : {"state": "DISPUTED", "note": "40+ per police, 50+ per The Quint and Deccan Herald, 55+ per a students' body (HIST-MANI24-003)."},
    detentions    : {"state": "UNVERIFIED", "note": "A Deccan Herald headline says 40 protesters were nabbed; only the headline was read (HIST-MANI24-010)."},
    firs          : {"state": "UNKNOWN", "note": "No FIR found (HIST-MANI24-012)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0069',
    isoDate: '2024-10-18',   /* first day; used only to order the lists */
    slug: 'tgpsc-group-1-aspirants-october-2024',
    kind: 'FORCE',
    title: "Lathicharge and detentions of Group-1 aspirants at Ashok Nagar",
    place: "Ashok Nagar, Hyderabad",
    state: "Telangana",
    coords: [17.404, 78.493],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "18 to 20 October 2024",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Hyderabad Police (HIST-TGPS24-001)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Lathi charge on 18 October (HIST-TGPS24-001)", "state": "CORROBORATED"}, {"text": "Section 163 BNSS orders by the Cyberabad Commissioner (HIST-TGPS24-012) and the Hyderabad Commissioner (HIST-TGPS24-015)", "state": "REPORTED"}]},
    injuries      : {"state": "REPORTED", "note": "Women aspirants said they were thrashed and held for over 12 hours, from one outlet (HIST-TGPS24-004)."},
    detentions    : {"state": "CORROBORATED", "note": "30 in preventive custody on 18 October (HIST-TGPS24-002). A Union minister was among those detained on 19 October (HIST-TGPS24-006). A count of 700 appears in one outlet only (HIST-TGPS24-005)."},
    firs          : {"state": "UNKNOWN", "note": "FIRs and custody records not obtained (HIST-TGPS24-017)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0070',
    isoDate: '2024-11-11',   /* first day; used only to order the lists */
    slug: 'uppsc-aspirants-november-2024',
    kind: 'FORCE',
    title: "Police action on UPPSC aspirants in Prayagraj",
    place: "UPPSC office, Prayagraj",
    state: "Uttar Pradesh",
    coords: [25.443, 81.834],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "11 to 14 November 2024",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Prayagraj Police (HIST-UPPS24-001); plain-clothes police on 14 November, from one outlet (HIST-UPPS24-003)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Aspirants chased and a lathi charge reported on 11 November (HIST-UPPS24-001)", "state": "CORROBORATED"}]},
    injuries      : {"state": "REPORTED", "note": "Minor injuries to a protest leader, from one outlet (HIST-UPPS24-003)."},
    detentions    : {"state": "DISPUTED", "note": "The DCP, PTI Hindi, ANI, The Wire and Sabrang give different counts and accounts (HIST-UPPS24-004)."},
    firs          : {"state": "UNKNOWN", "note": "A reported FIR against 12 people comes only from a search summary (HIST-UPPS24-013)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0071',
    isoDate: '2024-12-16',   /* first day; used only to order the lists */
    slug: 'ranchi-jssc-protest-december-2024',
    kind: 'FORCE',
    title: "Lathicharge on JSSC CGL candidates in Ranchi",
    place: "Namkum, Ranchi, near the JSSC office",
    state: "Jharkhand",
    coords: [23.31, 85.36],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "16 December 2024",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Ranchi Police (HIST-JSSC24-001)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Lathi charge; the Deputy Commissioner called it \"light use of force\" (HIST-JSSC24-001, HIST-JSSC24-005)", "state": "CORROBORATED"}, {"text": "Section 163 BNS order within 500 metres; one outlet says the Sub-Divisional Officer (Sadar) issued it (HIST-JSSC24-003, HIST-JSSC24-004)", "state": "CORROBORATED"}]},
    injuries      : {"state": "UNKNOWN", "note": "No injury figures found."},
    detentions    : {"state": "DISPUTED", "note": "One, two or three detained, depending on the source (HIST-JSSC24-002)."},
    firs          : {"state": "UNKNOWN", "note": "No FIR found (HIST-JSSC24-010)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0072',
    isoDate: '2026-02-26',   /* first day; used only to order the lists */
    slug: 'jnu-long-march-february-2026',
    kind: 'DETENTIONS',
    title: "Students detained and arrested after the JNU long march to the Education Ministry",
    place: "JNU North Gate and Vasant Kunj, New Delhi",
    state: "Delhi",
    coords: [28.54, 77.17],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "26 February 2026",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Delhi Police and paramilitary forces (HIST-JNUM26-001)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "REPORTED", "items": [{"text": "Gate locked and barricaded, per students (HIST-JNUM26-002); police say barricades were broken (HIST-JNUM26-003)", "state": "REPORTED"}]},
    injuries      : {"state": "REPORTED", "note": "Police say about 25 personnel were hurt; students say many were injured (HIST-JNUM26-003, HIST-JNUM26-006)."},
    detentions    : {"state": "CORROBORATED", "note": "51 detained and 14 arrested (HIST-JNUM26-005). Bail on 27 February; the release is disputed (HIST-JNUM26-008, HIST-JNUM26-009)."},
    firs          : {"state": "CORROBORATED", "note": "An FIR at Vasant Kunj North police station under BNS 221, 121(1), 132 and 3(5) (HIST-JNUM26-007)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0073',
    isoDate: '2026-04-13',   /* first day; used only to order the lists */
    slug: 'ambedkar-college-april-2026',
    kind: 'DETENTIONS',
    title: "Students detained while protesting an RSS event at Ambedkar College",
    place: "Dr. B R Ambedkar College, University of Delhi, Delhi",
    state: "Delhi",
    coords: [28.693, 77.257],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "13 April 2026",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Delhi Police (HIST-AMBC26-002)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "UNKNOWN", "items": []},
    injuries      : {"state": "REPORTED", "note": "Students allege assault by security guards and organisers, not by police (HIST-AMBC26-003)."},
    detentions    : {"state": "CORROBORATED", "note": "Four students taken to Jyotinagar police station; both reports rest on the student groups' accounts (HIST-AMBC26-002)."},
    firs          : {"state": "UNKNOWN", "note": "No FIR or detention memo found (HIST-AMBC26-007)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0074',
    isoDate: '2026-08-10',   /* first day; used only to order the lists */
    slug: 'ranchi-aspirants-august-2026',
    kind: 'FORCE',
    title: "Water cannon, lathicharge and tear gas on aspirants marching to the Jharkhand Assembly",
    place: "Near the Jharkhand Assembly, Ranchi",
    state: "Jharkhand",
    coords: [23.31, 85.28],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "10 August 2026",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Ranchi Police (HIST-RNCH26-001)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Water cannon, baton charge and tear gas (HIST-RNCH26-001)", "state": "CORROBORATED"}, {"text": "Section 163 BNSS order by the Ranchi administration (HIST-RNCH26-005)", "state": "CORROBORATED"}]},
    injuries      : {"state": "REPORTED", "note": "Protesters allege many injured; police say 14 personnel were hurt and stones thrown (HIST-RNCH26-002, HIST-RNCH26-003)."},
    detentions    : {"state": "REPORTED", "note": "More than 500 detained, from one outlet (HIST-RNCH26-004)."},
    firs          : {"state": "DISPUTED", "note": "An FIR at the Assembly police station; the count of accused differs by outlet (HIST-RNCH26-006)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0075',
    isoDate: '2026-09-01',   /* first day; used only to order the lists */
    slug: 'sfi-kerala-september-2026',
    kind: 'FORCE',
    title: "Water cannon and lathicharge on SFI marches in Thiruvananthapuram and Palakkad",
    place: "Kerala University, Palayam, the Secretariat in Thiruvananthapuram, and Palakkad",
    state: "Kerala",
    coords: [8.497, 76.948],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "1 and 2 September 2026",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Kerala Police (HIST-KERL26-001)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Water cannon on 1 September, confirmed by the Home Minister (HIST-KERL26-002)", "state": "CORROBORATED"}, {"text": "Water cannon and lathicharge on 2 September (HIST-KERL26-001)", "state": "CORROBORATED"}, {"text": "Water cannon at Palakkad (HIST-KERL26-009)", "state": "CORROBORATED"}]},
    injuries      : {"state": "REPORTED", "note": "The SFI state secretary was hospitalised; other injuries are SFI's account (HIST-KERL26-001, HIST-KERL26-003)."},
    detentions    : {"state": "REPORTED", "note": "A second SFI leader was arrested on 11 September, from one source (HIST-KERL26-010)."},
    firs          : {"state": "CORROBORATED", "note": "Three cases against about 350 activists, and an attempt-to-murder case naming 31 (HIST-KERL26-005, HIST-KERL26-006)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0076',
    isoDate: '2026-09-27',   /* first day; used only to order the lists */
    slug: 'lpu-phagwara-september-2026',
    kind: 'FORCE',
    title: "Lathicharge after a highway blockade by Lovely Professional University students",
    place: "Lovely Professional University and NH-44, Phagwara",
    state: "Punjab",
    coords: [31.256, 75.705],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "27 September 2026",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Punjab Police (HIST-LPU26-001, HIST-LPU26-006)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "A \"mild\" lathi charge after thrown water bottles, per police; Jagran gives a different sequence and tear gas (HIST-LPU26-003, HIST-LPU26-004)", "state": "CORROBORATED"}]},
    injuries      : {"state": "REPORTED", "note": "Police personnel and students injured, no counts (HIST-LPU26-005)."},
    detentions    : {"state": "UNKNOWN", "note": "No detentions found in the sources read (HIST-LPU26-012)."},
    firs          : {"state": "CORROBORATED", "note": "A rape FIR against an unknown person and an SIT, on the students' allegation; the university denies it (HIST-LPU26-007, HIST-LPU26-009)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-10'
  },
  {
    id: 'INC-0077',
    isoDate: '2016-11-06',   /* first day; used only to order the lists */
    slug: 'india-gate-march-november-2016',
    kind: 'DETENTIONS',
    title: "Delhi Police stop a JNU march to India Gate over the missing student Najeeb Ahmed",
    place: "India Gate, New Delhi",
    state: "Delhi",
    coords: [28.6129, 77.2295],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "6 November 2016",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Delhi Police (HIST-INDG16-001)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "DISPUTED", "items": [{"text": "Section 144 and the reason for refusing permission are given differently by PTI, Scroll and Asian Age; the issuer is not named (HIST-INDG16-005)", "state": "DISPUTED"}]},
    injuries      : {"state": "DISPUTED", "note": "Reporters describe the mother being lifted and dragged; beating is an allegation only, and the Joint Commissioner said \"none have been manhandled\" (HIST-INDG16-003, HIST-INDG16-006)."},
    detentions    : {"state": "DISPUTED", "note": "About 200, about 300 (IANS) or \"dozens\" (Scroll) (HIST-INDG16-002)."},
    firs          : {"state": "UNKNOWN", "note": "No FIR, court, NHRC or Parliament record found (HIST-INDG16-009)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-12'
  },
  {
    id: 'INC-0078',
    isoDate: '2016-01-18',   /* first day; used only to order the lists */
    slug: 'university-of-hyderabad-january-2016',
    kind: 'FORCE',
    title: "Police on the University of Hyderabad campus after Rohith Vemula's death",
    place: "University of Hyderabad, Gachibowli, and Ram Nagar, Hyderabad",
    state: "Telangana",
    coords: [17.46, 78.334],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "18 January to 6 April 2016",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Hyderabad police at the campus on 18 January (HIST-HCU16-001)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "\"Mild force\" and batons by police in riot gear on 18 January (HIST-HCU16-001, HIST-HCU16-002)", "state": "CORROBORATED"}, {"text": "Seven hunger strikers removed from the campus camp on 23 January (HIST-HCU16-011)", "state": "CORROBORATED"}]},
    injuries      : {"state": "UNKNOWN", "note": "No injury count found."},
    detentions    : {"state": "CORROBORATED", "note": "Eight arrested on 18 January per IANS (HIST-HCU16-002); 37 taken into preventive custody on 19 January, described as Telangana Jagruti Youth Front activists (HIST-HCU16-007); 83 held at the campus gate on 6 April (HIST-HCU16-014)."},
    firs          : {"state": "CORROBORATED", "note": "An FIR under IPC 306 over the death (HIST-HCU16-006). No FIR found for the police action."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-12'
  },
  {
    id: 'INC-0079',
    isoDate: '2017-03-09',   /* first day; used only to order the lists */
    slug: 'kolkata-raj-bhavan-march-march-2017',
    kind: 'FORCE',
    title: "Lathicharge on SFI and DYFI activists marching to Raj Bhavan over teacher recruitment",
    place: "Esplanade crossing, Kolkata",
    state: "West Bengal",
    coords: [22.565, 88.351],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "9 March 2017",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Kolkata Police (HIST-KOLK17-002)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Lathi charge at the Esplanade crossing, per PTI (HIST-KOLK17-002)", "state": "CORROBORATED"}]},
    injuries      : {"state": "REPORTED", "note": "The NHRC records allegations of beating and hospitalisation (HIST-KOLK17-003)."},
    detentions    : {"state": "REPORTED", "note": "123 detained, per one later report; eight held until bail on 14 March (HIST-KOLK17-004, HIST-KOLK17-005). Four girl students arrested and remanded (HIST-KOLK17-006)."},
    firs          : {"state": "UNKNOWN", "note": "No FIR text seen; the NHRC ordered an on-spot enquiry on 21 March 2017 (HIST-KOLK17-007)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-12'
  },
  {
    id: 'INC-0080',
    isoDate: '2024-12-10',   /* first day; used only to order the lists */
    slug: 'hazaribagh-jssc-december-2024',
    kind: 'FORCE',
    title: "Lathicharge and tear gas on students blocking NH-33 at Hazaribagh over the JSSC CGL result",
    place: "NH-33, Hazaribagh",
    state: "Jharkhand",
    coords: [23.9925, 85.3637],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "10 December 2024",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Hazaribagh police and the district administration (HIST-HAZA24-002)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Lathicharge and tear gas to clear a 3.5 to 4 hour blockade; the SP denies a lathicharge on the blockaders (HIST-HAZA24-002, HIST-HAZA24-006)", "state": "CORROBORATED"}]},
    injuries      : {"state": "REPORTED", "note": "More than six students injured, per Prabhat Khabar (HIST-HAZA24-003)."},
    detentions    : {"state": "UNKNOWN", "note": "No detention count found (HIST-HAZA24-012)."},
    firs          : {"state": "UNKNOWN", "note": "No FIR found (HIST-HAZA24-012)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-12'
  },
  {
    id: 'INC-0081',
    isoDate: '2026-10-10',   /* first day; used only to order the lists */
    slug: 'cjp-rally-detentions-october-2026',
    kind: 'DETENTIONS',
    title: "Mass detentions to stop the Cockroach Janta Party rally at Jantar Mantar",
    place: "Jantar Mantar, the approach roads and central Delhi",
    state: "Delhi",
    coords: [28.627, 77.2166],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "10 and 11 October 2026",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Delhi Police and paramilitary forces (HIST-DEL26-002)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Permission refused and a Section 163 BNSS order in force; the issuer is not named (HIST-DEL26-008)", "state": "CORROBORATED"}, {"text": "Metro stations closed at the police's request (HIST-DEL26-010)", "state": "CORROBORATED"}, {"text": "Protesters forced into police vehicles (HIST-DEL26-005)", "state": "CORROBORATED"}]},
    injuries      : {"state": "REPORTED", "note": "Bruising and bleeding reported; beating alleged, no baton use reported (HIST-DEL26-006)."},
    detentions    : {"state": "DISPUTED", "note": "From more than 2,000 (Reuters, AP) to about 7,000 (Outlook, Pioneer, PTI, CIVICUS) (HIST-DEL26-003). Student activists named by two independent publishers (HIST-DEL26-004)."},
    firs          : {"state": "UNKNOWN", "note": "The Supreme Court issued contempt notice on 11 October to the MHA Secretary, the Delhi Police Commissioner and the Delhi Metro Rail Corporation chair (HIST-DEL26-011). No FIR text seen."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-12'
  },
  {
    id: 'INC-0082',
    isoDate: '2026-10-08',   /* first day; used only to order the lists */
    slug: 'students-removed-from-train-itarsi-october-2026',
    kind: 'DETENTIONS',
    title: "Students from Pune removed from a train at Itarsi on the way to the Delhi rally",
    place: "Itarsi railway station, Madhya Pradesh, and other places",
    state: "Madhya Pradesh and other states",
    coords: [22.612, 77.76],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "8 and 9 October 2026",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Railway police at Itarsi (HIST-OCT12-009)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "UNKNOWN", "items": []},
    injuries      : {"state": "UNKNOWN", "note": "No injury reported."},
    detentions    : {"state": "CORROBORATED", "note": "12 to 22 students disembarked and later released; counts conflict. Further detentions at Kolkata, Saharanpur and Alwar are single-source allegations (HIST-OCT12-009, HIST-OCT12-011, HIST-OCT12-012, HIST-OCT12-013)."},
    firs          : {"state": "UNKNOWN", "note": "No FIR found."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-12'
  },
  {
    id: 'INC-0083',
    isoDate: '2026-07-23',   /* first day; used only to order the lists */
    slug: 'darbhanga-neet-march-july-2026',
    kind: 'FORCE',
    title: "Lathicharge on students marching against the NEET paper leak at Darbhanga",
    place: "Darbhanga, Bihar",
    state: "Bihar",
    coords: [26.1542, 85.8918],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "23 July 2026",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Bihar Police, with the District Magistrate and SSP on the spot (HIST-BIHJ26-001, HIST-BIHJ26-004)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Lathicharge (HIST-BIHJ26-001)", "state": "CORROBORATED"}]},
    injuries      : {"state": "REPORTED", "note": "Police injuries and arrests reported by IANS (HIST-BIHJ26-003)."},
    detentions    : {"state": "REPORTED", "note": "Arrests reported (HIST-BIHJ26-003)."},
    firs          : {"state": "UNKNOWN", "note": "FIR copies not obtained (HIST-BIHJ26-036)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-12'
  },
  {
    id: 'INC-0084',
    isoDate: '2026-07-23',   /* first day; used only to order the lists */
    slug: 'begusarai-march-july-2026',
    kind: 'FORCE',
    title: "Lathicharge on a students' march at Begusarai",
    place: "Begusarai, Bihar",
    state: "Bihar",
    coords: [25.4182, 86.1272],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "23 July 2026",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Bihar Police (HIST-BIHJ26-005)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Lathicharge (HIST-BIHJ26-005)", "state": "CORROBORATED"}]},
    injuries      : {"state": "UNKNOWN", "note": "No injury count found."},
    detentions    : {"state": "DISPUTED", "note": "Arrests and releases are reported differently (HIST-BIHJ26-006)."},
    firs          : {"state": "UNKNOWN", "note": "FIR copies not obtained (HIST-BIHJ26-036)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-12'
  },
  {
    id: 'INC-0085',
    isoDate: '2026-07-23',   /* first day; used only to order the lists */
    slug: 'jehanabad-firing-july-2026',
    kind: 'FORCE',
    title: "Police fire shots at a student protest at Jehanabad",
    place: "Jehanabad, Bihar",
    state: "Bihar",
    coords: [25.208, 84.99],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "23 July 2026",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Bihar Police (HIST-BIHJ26-009)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "DISPUTED", "items": [{"text": "Firing in the air; 10 rounds per the District Magistrate, 30 to 35 per a party member (HIST-BIHJ26-009, HIST-BIHJ26-010)", "state": "DISPUTED"}]},
    injuries      : {"state": "UNKNOWN", "note": "No injury count found."},
    detentions    : {"state": "UNKNOWN", "note": "No detention count found."},
    firs          : {"state": "UNKNOWN", "note": "The Supreme Court affidavit, as reported, dates an attack on the DM's residence differently (HIST-BIHJ26-012). Armoury records not obtained (HIST-BIHJ26-039)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-12'
  },
  {
    id: 'INC-0086',
    isoDate: '2026-08-04',   /* first day; used only to order the lists */
    slug: 'patna-chief-minister-march-august-2026',
    kind: 'FORCE',
    title: "Water cannon on a second students' march to the Chief Minister's residence in Patna",
    place: "Near the Chief Minister's residence, Patna",
    state: "Bihar",
    coords: [25.611, 85.144],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "4 August 2026",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Patna police (HIST-BIHJ26-029)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Water cannon on hundreds of students and youth (HIST-BIHJ26-029)", "state": "CORROBORATED"}]},
    injuries      : {"state": "UNKNOWN", "note": "No injury count found."},
    detentions    : {"state": "DISPUTED", "note": "Detentions on 4 August are disputed (HIST-BIHJ26-030)."},
    firs          : {"state": "UNKNOWN", "note": "No FIR found."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-12'
  },
  {
    id: 'INC-0087',
    isoDate: '2025-02-13',   /* first day; used only to order the lists */
    slug: 'jamia-detentions-february-2025',
    kind: 'DETENTIONS',
    title: "Delhi Police detain Jamia students protesting disciplinary notices",
    place: "Jamia Millia Islamia, New Delhi",
    state: "Delhi",
    coords: [28.562, 77.282],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "13 February 2025",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Delhi Police, at the university administration's request (HIST-JMI25-001)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "UNKNOWN", "note": "No use of force recorded beyond removal and detention; students allege manhandling (HIST-JMI25-002)."},
    injuries      : {"state": "UNKNOWN", "note": "No injury count found."},
    detentions    : {"state": "DISPUTED", "note": "Over 10, 14 and over 20 are all reported (HIST-JMI25-002)."},
    firs          : {"state": "UNKNOWN", "note": "No FIR found."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-14'
  },
  {
    id: 'INC-0088',
    isoDate: '2014-09-19',   /* first day; used only to order the lists */
    slug: 'himachal-pradesh-university-september-2014',
    kind: 'DETENTIONS',
    title: "Police clear students at Himachal Pradesh University, Shimla",
    place: "Himachal Pradesh University, Shimla",
    state: "Himachal Pradesh",
    coords: [31.093, 77.131],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'REPORTED',
    date: "19 September 2014",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "REPORTED", "items": [{"text": "Himachal Pradesh Police (HIST-HPU14-001)", "state": "REPORTED"}]},
    crowdControl  : {"state": "DISPUTED", "items": [{"text": "A lathi charge is alleged by the SFI and denied by the police (HIST-HPU14-001)", "state": "DISPUTED"}]},
    injuries      : {"state": "REPORTED", "note": "The SFI says 17 students were injured, six of them girls; the police figure is not given (HIST-HPU14-001)."},
    detentions    : {"state": "DISPUTED", "note": "Police say 220 were arrested; the SFI says over 400. A further 70 were arrested on 10 October (HIST-HPU14-001, HIST-HPU14-002)."},
    firs          : {"state": "REPORTED", "note": "Sections 149, 151, 188 and 341 IPC were reported for the October arrests (HIST-HPU14-002)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-14'
  },
  {
    id: 'INC-0089',
    isoDate: '2026-07-25',   /* first day; used only to order the lists */
    slug: 'bhagalpur-bandh-july-2026',
    kind: 'FORCE',
    title: "Police baton-charge a bandh march at Bhagalpur",
    place: "Tilkamanjhi crossing, Bhagalpur",
    state: "Bihar",
    coords: [25.244, 86.972],
    coordsState: 'REPORTED',
    incidentState: 'CORROBORATED',
    dateState: 'CORROBORATED',
    date: "25 July 2026",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "CORROBORATED", "items": [{"text": "Bhagalpur police (HIST-BIHJ26-044)", "state": "CORROBORATED"}]},
    crowdControl  : {"state": "CORROBORATED", "items": [{"text": "Baton charge on a march near the Tilkamanjhi crossing (HIST-BIHJ26-044)", "state": "CORROBORATED"}]},
    injuries      : {"state": "REPORTED", "note": "The SSP is reported to have said no one was injured (HIST-BIHJ26-044). No other injury figure found."},
    detentions    : {"state": "REPORTED", "note": "The DM and SSP are reported to have said several people were detained, with no number given (HIST-BIHJ26-044)."},
    firs          : {"state": "UNKNOWN", "note": "No FIR found."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-14'
  },
  {
    id: 'INC-0090',
    isoDate: '2026-10-13',   /* first day; used only to order the lists */
    slug: 'jantar-mantar-entry-preventive-arrests-october-2026',
    kind: 'CASES',
    title: "Two CJP leaders held after entering Jantar Mantar and sent to judicial custody by a Special Executive Magistrate",
    place: "Jantar Mantar, New Delhi",
    state: "Delhi",
    coords: [28.627, 77.2166],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'REPORTED',
    date: "13 to 18 October 2026",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "REPORTED", "items": [{"text": "Delhi Police; a Special Executive Magistrate described in reporting as an ACP (HIST-DEL26-018, HIST-DEL26-019)", "state": "REPORTED"}]},
    crowdControl  : {"state": "REPORTED", "items": [{"text": "Preventive arrest on 13 October; notice under BNSS s.130 and remand to five days of judicial custody on 14 October (PROC-DEL-009)", "state": "REPORTED"}]},
    injuries      : {"state": "UNKNOWN", "note": "None reported in the sources read."},
    detentions    : {"state": "REPORTED", "note": "Saurav Das and Ashutosh Ranka held from 13 October; judicial custody to 18 or 19 October; a hearing on 18 October passed no release order (HIST-DEL26-019). Ajinkya Shinde released on a personal bond on 14 October (PROC-DEL-009). Custody extended by two days on 19 October; next production Wednesday 21 October; no release reported (HIST-DEL26-024, OQ-066)."},
    firs          : {"state": "REPORTED", "note": "FIR 128/26 (Parliament Street) and FIR 289/26 (Connaught Place) are cited in the 14 October order as reported (PROC-DEL-009). No FIR text seen."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-19'
  },
  {
    id: 'INC-0091',
    isoDate: '2026-10-16',   /* first day; used only to order the lists */
    slug: 'connaught-place-flag-march-detentions-october-2026',
    kind: 'DETENTIONS',
    title: "About 150 detained as a CJP flag march at Connaught Place and a protest at Mandi House are stopped",
    place: "Central Park, Connaught Place and Mandi House, New Delhi",
    state: "Delhi",
    coords: [28.6315, 77.2167],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'REPORTED',
    date: "16 October 2026",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "REPORTED", "items": [{"text": "Delhi Police and Central Armed Police Forces, more than 6,000 deployed (HIST-DEL26-020)", "state": "REPORTED"}]},
    crowdControl  : {"state": "REPORTED", "items": [{"text": "Section 163 restrictions at Connaught Place cited as the basis for preventive detention; Central Park closed on 16 and 17 October (HIST-DEL26-020)", "state": "REPORTED"}]},
    injuries      : {"state": "UNKNOWN", "note": "None reported by Outlook, which describes removals and jostling (HIST-DEL26-020)."},
    detentions    : {"state": "REPORTED", "note": "About 150 on the evening of 16 October (Outlook) and more than 100 (The Morning Voice), both police-attributed, including Abhijeet Dipke and Neha Bora (HIST-DEL26-020, HIST-DEL26-021). Bora was released early on 17 October. Dipke was released that day on a one-year peace bond before a Special Executive Magistrate."},
    firs          : {"state": "REPORTED", "note": "Delhi Police said on 17 October that more than seven FIRs would be registered over the march (HIST-DEL26-021). None seen. A separate notice tied to Dipke's earlier peace undertaking is reported (HIST-DEL26-020)."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-19'
  },
  {
    id: 'INC-0092',
    isoDate: '2026-10-17',   /* first day; used only to order the lists */
    slug: 'bengaluru-town-hall-aisa-detentions-october-2026',
    kind: 'DETENTIONS',
    title: "About 50 AISA members and activists detained at Town Hall in Bengaluru",
    place: "Town Hall, Bengaluru",
    state: "Karnataka",
    coords: [12.9627, 77.5846],
    coordsState: 'REPORTED',
    incidentState: 'REPORTED',
    dateState: 'REPORTED',
    date: "17 October 2026",
    summaryState: 'UNKNOWN',
    summary: null,
    forcesInvolved: {"state": "REPORTED", "items": [{"text": "Bengaluru city police, SJ Park station area (HIST-KAR26-001)", "state": "REPORTED"}]},
    crowdControl  : {"state": "REPORTED", "items": [{"text": "Barricades and extra platoons; a police notice of 17 October citing the Karnataka High Court's Freedom Park guidelines; detainees bussed to the City Armed Reserve grounds (HIST-KAR26-001)", "state": "REPORTED"}]},
    injuries      : {"state": "UNKNOWN", "note": "None reported (HIST-KAR26-001)."},
    detentions    : {"state": "REPORTED", "note": "About 50, held for some time and released (HIST-KAR26-001)."},
    firs          : {"state": "UNKNOWN", "note": "No FIR reported."},
    officeIds: [],
    orderTrail: { reached: null, rungs: {}, next: null },
    openedOn: '2026-10-19'
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
