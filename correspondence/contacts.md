# Where to send the Bihar preservation representations

Retrieved 18 September 2026 from the **official Bihar Police website**,
`https://police.bihar.gov.in/`. The site is a single-page application and the
district officer directory is not a page you can link to: it ships inside the
application bundle at `https://police.bihar.gov.in/js/index.uxDv338t.js`, as a
`districts` array of 45 districts, each with an `officers` list carrying
designation, STD code, office and residence numbers, fax, mobile and email. The
bundle filename is content-hashed and will change when the site is rebuilt, so
cite the site and the retrieval date, not that URL.

**Munger is independently cross-confirmed.** The district site
`https://munger.nic.in/superintendent-of-police/` gives the same email, the same
office number and the same mobile, and adds the officer's name and a postal
address. Two official sources agreeing on one district is the reason to trust the
directory for the other three; it is not proof of them.

At the time of retrieval `patna.nic.in`, `katihar.nic.in` and `siwan.nic.in` were
all returning **HTTP 503** from their own nginx, so none of those three could be
cross-checked. Try again before sending.

## The four offices

| Office | Email | Office phone | Fax | Mobile |
|---|---|---|---|---|
| **SSP, Patna** | `ssp-patna-bih@nic.in` | 0612-2214318 / 2219745 | 0612-2217744 | 9031825812 |
| **SP, Katihar** | `sp-katihar-bih@nic.in` | 06452-230601 | 06452-245065 | 9031827894 |
| **SP, Munger** | `sp-munger-bih@nic.in` | 06344-222406 | 06344-222444 | 9031828101 |
| **SP, Siwan** | `sp-siwan-bih@nic.in` | 06154-242060 | 06154-242977 | 9031827200 |

`FQ-001` named the Patna addressee as the **SSP**, and the directory confirms
Patna has a Senior Superintendent of Police rather than a Commissioner of Police.
The archive's rule that a commissionerate and a district are structurally
different does not bite here.

## Postal addresses: only one is held

For **Munger** only, from `munger.nic.in`:

> Syed Imran Masood, I.P.S., Superintendent of Police,
> Fort Area, S.P. Office, Munger

**No postal address is held for Patna, Katihar or Siwan.** The Bihar Police
directory carries phone, fax and email but no street address, and the three
district sites were down. Do not invent one. Either send those three by email, or
get the address from the district site when it is back up.

## Copies, if you want them

- **City SP (Central), Patna** `spcity-patna-bih@nic.in`, 0612-2219423: the two
  Patna incidents (JP Golambar, Dakbungalow Square) are both in central Patna, so
  this is the officer closest to the records. A copy here is reasonable; the SSP
  stays the addressee.
- **DGP (Crime), Bihar** `dgpcr.pat-bih@gov.in` appears in the same directory. The
  drafts each carry an optional "copy to DGP" line. Decide once and apply it to
  all four rather than copying some and not others.

## A note on sending by email

Every one of these is `@nic.in` or `@gov.in`, so they are government mail systems
and they are the systems most likely to check SPF independently of DMARC. That is
exactly the failure the domain's SPF record would have caused before it was
corrected. Checked 18 September 2026, the record now reads
`v=spf1 include:secureserver.net include:spf.protection.outlook.com -all`, which
authorises the Microsoft 365 servers the domain actually sends from.

Ask for a delivery or read receipt, and keep the sent item. It is weaker evidence
of despatch than a speed post receipt, which is why post is still preferable
wherever an address is known.
