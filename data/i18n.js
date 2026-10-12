/* =============================================================================
   WhoGaveTheOrder.in: Hindi interface
   -----------------------------------------------------------------------------
   What is translated, and what deliberately is not.

   TRANSLATED: the archive's grammar. The six evidence states and their
   definitions, the question states, the two authority claims, the navigation,
   the status line, the footer, the inline explainers. These are the words a
   reader has to understand before any record on this site means anything, and
   they are the same words on every page.

   NOT TRANSLATED: the records. An evidence item says what its source says, in
   the language the source said it. Translating a record would put a sentence in
   the archive that no document supports: which is the one thing this site does
   not do. Where a source is in Hindi and the record is in English, that is a
   gap in the record, not something to paper over here.

   The translation has not yet been reviewed by a native speaker; see the
   outstanding list in README.md. It is published rather than held back because
   a reader who cannot use the interface at all is worse served than one reading
   a translation that may want polishing.
   ========================================================================== */

window.WGO = window.WGO || {};

WGO.LANGUAGES = [
  { code: 'en', label: 'English',  htmlLang: 'en' },
  { code: 'hi', label: 'हिन्दी',    htmlLang: 'hi' }
];

WGO.I18N = {
  hi: {
    /* --- chrome --------------------------------------------------------- */
    nav: {
      'investigations.html': 'घटनाएँ',
      'evidence.html':       'दस्तावेज़',
      'letters.html':        'रिकॉर्ड माँगें',
      'submit.html':         'दस्तावेज़ भेजें',
      'about.html':          'परिचय',
      'rti.html':            'हमने क्या पूछा',
      'changes.html':        'क्या बदला'
    },

    chrome: {
      addDocument: 'दस्तावेज़ भेजें',
      menu: 'सूची',
      skip: 'सामग्री पर जाएँ',
      documents: 'दस्तावेज़',
      sources: 'स्रोतों से',
      onRecord: 'अभिलेख में दर्ज हैं।',
      questionsOpen: 'प्रश्न अब भी अनुत्तरित हैं।',
      ordersFound: 'आदेश मिले हैं।',
      empty: 'इस अभिलेख में अभी कोई दस्तावेज़ प्रकाशित नहीं हुआ है।',
      lastReviewed: 'अभिलेख की अंतिम समीक्षा',
      noTracking: 'कोई कुकी नहीं। कोई ट्रैकर नहीं। आपकी निगरानी करने वाली कोई स्क्रिप्ट नहीं। ' +
                  'पाठकों की गिनती सर्वर लॉग से होती है, आपके ब्राउज़र से कभी नहीं।',
      footerNote: 'जहाँ अभिलेख किसी प्रश्न का उत्तर नहीं देता, यह साइट ऐसा कहती है।',
      languageLabel: 'भाषा',
      readInHindi: 'हिन्दी में पढ़ें',
      readInEnglish: 'Read in English',
      hindiEntry: 'यह अभिलेख क्या है'
    },

    footer: {
      investigation: 'अभिलेख',
      archive: 'अभिलेख',
      takePart: 'भाग लें',
      howWeWork: 'हम कैसे काम करते हैं'
    },

    /* Keyed by the English label, so the footer markup stays one list and a
       missing translation falls back to the English rather than vanishing. */
    footerLinks: {
      'Investigations':            'जाँचें',
      'Others are investigating':  'अन्य लोग क्या जाँच रहे हैं',
      'Evidence library':          'दस्तावेज़ संग्रह',
      'RTI log':              'सूचना अधिकार रजिस्टर',
      'Search':                    'खोज',
      'What changed':              'क्या बदला',
      'Download the data':         'आँकड़े डाउनलोड करें',
      'Submit evidence':           'दस्तावेज़ भेजें',
      'Send a preservation letter': 'रिकॉर्ड सुरक्षित रखने का पत्र भेजें',
      'File an RTI yourself':      'स्वयं सूचना अधिकार आवेदन करें',
      'What we are missing':       'हमारे पास क्या नहीं है',
      'Report an error':           'त्रुटि बताएँ',
      'Methodology':               'कार्यप्रणाली',
      'Verification standards':    'सत्यापन के मानक',
      'Privacy and takedown':      'निजता और हटाने की प्रक्रिया',
      'Who runs this':             'इसे कौन चलाता है',
      'Privacy':                   'निजता',
      'Takedown & grievances':     'हटाने की माँग और शिकायतें',
      'Corrections':               'सुधार',
      'Reuse & licence':           'पुनःप्रयोग और अनुमति'
    },

    /* --- the evidence grammar ------------------------------------------- */
    EVIDENCE_STATES: {
      VERIFIED: {
        label: 'सत्यापित',
        definition: 'दावे के समर्थन में प्राथमिक साक्ष्य हमारे पास है, और हमने उसे उसके मूल स्रोत से मिलाकर देखा है।'
      },
      CORROBORATED: {
        label: 'पुष्ट',
        definition: 'कई विश्वसनीय और स्वतंत्र स्रोत इस दावे का समर्थन करते हैं, यद्यपि इसे सिद्ध करने वाला कोई एक प्राथमिक दस्तावेज़ हमारे पास नहीं है।'
      },
      REPORTED: {
        label: 'रिपोर्ट किया गया',
        definition: 'किसी विश्वसनीय बाहरी स्रोत ने यह बताया है। हमने इसकी स्वतंत्र रूप से पुष्टि नहीं की है।'
      },
      DISPUTED: {
        label: 'विवादित',
        definition: 'विश्वसनीय विवरण आपस में टकराते हैं। दोनों दिखाए जाते हैं और किसी को तय मानकर प्रस्तुत नहीं किया जाता।'
      },
      UNVERIFIED: {
        label: 'असत्यापित',
        definition: 'सामग्री हमें भेजी गई है पर सिद्ध नहीं हुई है। हम उसे दर्ज करते हैं और उस पर निर्भर नहीं होते।'
      },
      UNKNOWN: {
        label: 'अज्ञात',
        definition: 'उपलब्ध साक्ष्य इस प्रश्न का उत्तर नहीं देते।'
      }
    },

    QUESTION_STATES: {
      ANSWERED: {
        label: 'उत्तरित',
        definition: 'कोई स्रोत-सहित दस्तावेज़ या अभिलेख पर दर्ज कथन इस प्रश्न का उत्तर देता है।'
      },
      PARTIALLY_ANSWERED: {
        label: 'आंशिक रूप से उत्तरित',
        definition: 'प्रश्न का एक हिस्सा अभिलेख पर उत्तरित है; एक महत्वपूर्ण हिस्सा नहीं है।'
      },
      UNANSWERED: {
        label: 'अनुत्तरित',
        definition: 'सार्वजनिक अभिलेख में कुछ भी इस प्रश्न का उत्तर नहीं देता।'
      },
      DISPUTED: {
        label: 'विवादित',
        definition: 'उत्तर मौजूद हैं और वे एक-दूसरे का खंडन करते हैं।'
      }
    },

    AUTHORITY_CLAIMS: {
      HAS_AUTHORITY: {
        label: 'अधिकार प्राप्त है',
        definition: 'यह कार्यालय, कानून के अनुसार या प्रशासनिक ढाँचे के अनुसार, इस प्रकार के निर्णय लेने या उन्हें स्वीकृति देने के लिए सक्षम है। इससे यह नहीं कहा जा रहा कि उसने क्या किया।'
      },
      EVIDENCED_TO_HAVE_AUTHORISED: {
        label: 'अनुमति देने का साक्ष्य',
        definition: 'अभिलेख में मौजूद कोई दस्तावेज़ या दर्ज कथन इस कार्यालय या व्यक्ति को इस विशेष कार्रवाई के पीछे रखता है। ऐसे दस्तावेज़ के बिना यह "स्थापित नहीं" पढ़ा जाएगा।'
      }
    },

    /* --- the inline explainers ------------------------------------------ */
    explain: {
      statesSummary: 'इन लेबल का क्या अर्थ है?',
      statesBody: 'इस साइट पर हर कथन छह में से एक स्थिति के साथ आता है। कोई दावा इसके बिना प्रकट नहीं हो सकता, और किसी दावे को एक स्थिति से दूसरी में ले जाने के लिए दस्तावेज़ चाहिए।',
      authoritySummary: 'हर कार्यालय पर "अनुमति स्थापित नहीं" क्यों लिखा है?',
      authorityBody: 'क्योंकि दो अलग दावों को अलग रखा जा रहा है, और उनमें से केवल एक स्थापित है।',
      authorityNote: 'श्रृंखला में किसी व्यक्ति का नाम नहीं है। किसी व्यक्ति को किसी कार्यालय से तभी जोड़ा जाता है जब कोई स्रोत-सहित दस्तावेज़ उसे उस समय उस कार्यालय में रखता हो।',
      unknownSummary: 'इस पृष्ठ पर इतना कुछ अज्ञात क्यों है?',
      unknownBody: 'क्योंकि अभी तक कुछ स्थापित नहीं हुआ है, और साइट यह कहकर उस जगह को खाली छोड़ती है। बिना स्रोत का दावा यहाँ तथ्य की तरह प्रकट नहीं होता: हमारे अपने आरंभिक आँकड़ों में भी नहीं।',
      clockSummary: 'जवाब की घड़ी कैसे काम करती है?',
      clockBody: 'सूचना का अधिकार आवेदन दाखिल करना किसी सार्वजनिक कार्यालय पर समय-सीमा लगा देता है। रजिस्टर हर बार पृष्ठ खुलने पर दाखिल करने की तारीख से जवाब की नियत तारीख निकालता है, ताकि वह कभी पुरानी न पड़े।',
      clockBody2: 'कार्यालय के जवाब देते ही घड़ी रुक जाती है, चाहे जवाब देर से आया हो। वैधानिक अवधि के बाद की चुप्पी को इनकार माना जाता है और उससे अपील का रास्ता खुलता है, इसीलिए अनुत्तरित आवेदन प्रकाशित किया जाता है।'
    }
  }
};
