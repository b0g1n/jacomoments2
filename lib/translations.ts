// Translation system for Romanian (default) and English

export const translations = {
  ro: {
    // Navigation
    nav: {
      home: 'Acasă',
      portfolio: 'Portofoliu',
      about: 'Despre',
      packages: 'Pachete',
      contact: 'Contact',
      requestQuote: 'CERE OFERTĂ',
      reserve: 'REZERVĂ',
      brandName: 'Jaco Moments',
      brandTagline: 'FOTOGRAF DE NUNTĂ',
    },

    // Hero Section
    hero: {
      badge: 'FOTOGRAF DE NUNTĂ DIN TIMIȘOARA',
      romanticTitle: 'Momente Autentice',
      title1: 'Captez Emoții',
      title2: 'Reale',
      subtitle: 'Fotograf de evenimente dedicat surprinderii momentelor unice și speciale din viața ta.',
      subtitleHighlight: 'Abordare caldă și empatică. Stil documentar. Amintiri pentru o viață.',
      statsWeddings: 'EVENIMENTE',
      statsYears: 'ANI EXPERIENȚĂ',
      statsHappy: 'CLIENȚI',
      ctaPortfolio: 'VEZI LUCRĂRILE',
      ctaContact: 'CONTACTEAZĂ-MĂ',
      scrollDown: 'DESCOPERĂ MAI MULT',
    },

    // Gallery Section
    gallery: {
      title: 'Portofoliu',
      subtitle: 'Galerie Foto',
      description: 'Fiecare eveniment are o poveste unică. Iată câteva dintre momentele pe care le-am capturat.',
      categories: {
        all: 'Toate',
        nunta: 'Nunta',
        botez: 'Botez',
        majorat: 'Majorat',
      },
      viewAll: 'VEZI TOATE POZELE',
      showLess: 'ARATĂ MAI PUŢINE',
      showingCount: (shown: number, total: number) => `Se afișează ${shown} din ${total} poze`,
      showingAll: (total: number) => `Se afișează ${total} poze`,
    },

    // Services Section
    services: {
      title: 'Ce oferim',
      subtitle: 'Servicii Noastre',
      description: 'Pachete complete de fotografie și video pentru nunți. Calitate premium, rezultate spectaculoase.',
      customOffer: 'Servicii personalizate disponibile la cerere',
      requestCustom: 'CERE OFERTĂ PERSONALIZATĂ',

      service1: {
        title: 'Fotografie Nuntă Completă',
        description: 'Acoperire completă a zilei, de la pregătiri până la petrecere. Stil documentar și artistic.',
        features: ['Pregătiri mireasă și mire', 'Ceremonie civilă/religioasă', 'Petrecere până la final', 'Număr nelimitat de fotografii'],
      },

      service2: {
        title: 'Videografie Cinematică',
        description: 'Filme artistice cu montaj profesional. Capturăm emoțiile și atmosfera zilei.',
        features: ['Filmări 4K', 'Filmări cu dronă', 'Clipuri social media', 'Montaj cinematic'],
      },

      service3: {
        title: 'Ședință Logodnă',
        description: 'Sesiune foto romantică înainte de nuntă. Perfectă pentru invitații și save the date.',
        features: ['2 ore de shooting', '2 locații', '50+ fotografii editate', 'Galerie online'],
      },

      service4: {
        title: 'Albume Premium',
        description: 'Albume foto de lux din Italia, cu design personalizat și tipărire de calitate muzeală.',
        features: ['Copertă piele', 'Hârtie premium', 'Design personalizat', 'Multiple formate'],
      },
    },

    // About Section
    about: {
      title: 'Despre Mine',
      subtitle: 'Povestea Mea',
      description1: 'Povestea mea în fotografie începe din pasiunea pentru oameni, emoții și momente reale. Pentru mine, fotografia nu înseamnă doar imagini frumoase, ci amintiri care transmit atmosferă, energie și autenticitate.',
      description2: 'Sunt o persoană atentă la detalii, creativă și perfecționistă, iar aceste lucruri se reflectă în fiecare cadru pe care îl realizez. Îmi place să surprind emoțiile naturale, conexiunile dintre oameni și acele momente spontane care fac diferența într-o poveste.',
      description3: 'Prin JacoMoments, îmi doresc să ofer mai mult decât simple fotografii — experiențe și amintiri care rămân vii peste ani. Fie că este vorba despre un botez, o aniversare, o ședință foto sau un eveniment special, abordarea mea este mereu una relaxată, profesională și orientată către oameni. Cred că cele mai frumoase fotografii sunt cele sincere. De aceea, încerc mereu să creez un mediu în care oamenii să se simtă confortabil și să fie exact așa cum sunt.',
      stats: {
        experience: '2 ANI EXPERIENȚĂ',
        weddings: '12 EVENIMENTE',
        clients: '5 RECENZII',
        awards: '100% RECOMANDĂ',
      },
    },

    // Pricing Section
    pricing: {
      title: 'Investiție',
      subtitle: 'Pachete și Prețuri',
      description: 'Alege pachetul perfect pentru evenimentul tău. Toate pachetele includ editare profesională și galerie online.',
      popular: 'POPULAR',
      select: 'SELECTEAZĂ',
      additionalInfo: 'Toate prețurile sunt în EUR și nu includ transport. Pentru evenimente în afara orașului, se adaugă costuri de transport și cazare după caz.',
      requestCustom: 'CERE OFERTĂ PERSONALIZATĂ',

      // Ședințe Foto
      sedinteFoto: {
        title: 'ȘEDINȚE FOTO',
        mini: {
          name: 'MINI SESSION',
          price: '50',
          duration: '30–45 minute',
          features: ['10–15 fotografii editate', 'Livrare online', 'Portrete / cuplu / familie'],
        },
        premium: {
          name: 'PREMIUM SESSION',
          price: '100',
          duration: '1–2 ore',
          features: ['25–40 fotografii editate profesional', 'Locație la alegere', 'Livrare online + selecție extinsă'],
        },
      },

      // Botezuri
      botezuri: {
        title: 'BOTEZURI',
        basic: {
          name: 'BASIC BAPTISM',
          price: '250',
          duration: 'Ceremonie',
          features: ['Fotografiere ceremonie biserică', 'Fotografii cu familia și invitații', '100+ fotografii editate', 'Livrare online prin link privat'],
        },
        premium: {
          name: 'PREMIUM BAPTISM',
          price: '350',
          duration: 'Acoperire completă',
          features: ['Pregătiri, biserică, restaurant', '200+ fotografii editate', 'Cadre artistice & detalii', 'Preview rapid pentru social media'],
        },
      },

      // Nunți
      nunti: {
        title: 'NUNȚI',
        basic: {
          name: 'WEDDING DAY',
          price: '500',
          duration: 'Acoperire eveniment',
          features: ['Pregătiri + ceremonie + petrecere', '300+ fotografii editate profesional', 'Livrare online HD', 'Momente spontane și cadre artistice'],
        },
        premium: {
          name: 'PREMIUM WEDDING',
          price: '700',
          duration: 'Acoperire extinsă',
          features: ['Ședință foto mire & mireasă', '500+ fotografii editate', 'Preview rapid în 24–48h', 'Galerie online premium'],
        },
      },

      // Evenimente Private
      evenimente: {
        title: 'EVENIMENTE PRIVATE',
        basic: {
          name: 'EVENT BASIC',
          price: '100',
          duration: '1–2 ore',
          features: ['Majorate / aniversări / petreceri private', '50+ fotografii editate'],
        },
        premium: {
          name: 'EVENT PREMIUM',
          price: '200',
          duration: 'Acoperire extinsă',
          features: ['Cadre atmosferice & invitați', '100+ fotografii editate', 'Livrare online'],
        },
      },

      // Extra Opționale
      extras: {
        title: 'EXTRA OPȚIONALE',
        items: [
          'Album foto premium',
          'Fotografii printate',
          'Reel cinematic pentru social media',
          'Livrare rapidă',
          'Photo corner setup',
        ],
      },
    },

    // Testimonials Section
    testimonials: {
      title: 'Recenzii',
      subtitle: 'Ce Spun Clienții',
      stats: {
        average: 'RATING MEDIU',
        reviews: 'RECENZII',
        recommend: 'RECOMANDĂ',
      },
    },

    // Contact Section
    contact: {
      title: 'Contact',
      subtitle: 'Hai să Vorbim',
      description: 'Suntem aici să răspundem la orice întrebare și să te ajutăm să planificăm nunta perfectă.',
      form: {
        name: 'Nume Complet',
        namePlaceholder: 'Numele tău și partenerului',
        email: 'Email',
        emailPlaceholder: 'email@exemplu.ro',
        phone: 'Telefon',
        phonePlaceholder: '+40 7XX XXX XXX',
        weddingDate: 'Data Nunții',
        location: 'Locație Nuntă',
        locationPlaceholder: 'Oraș / Locație',
        message: 'Mesaj',
        messagePlaceholder: 'Spune-ne mai multe despre nunta ta...',
        submit: 'TRIMITE MESAJUL',
        success: 'Mulțumim pentru mesaj! Vă vom contacta în curând.',
        error: 'Eroare la trimiterea mesajului',
      },
      info: {
        title: 'Informații Contact',
        phone: 'Telefon',
        email: 'Email',
        schedule: 'Program',
        scheduleValue: 'Luni - Sâmbătă: 9:00 - 18:00',
      },
      social: {
        title: 'Urmărește-ne',
        directContact: 'Preferi să ne vorbim direct? Sună-ne sau trimite un WhatsApp pentru un răspuns rapid.',
        whatsapp: 'WHATSAPP',
      },
    },

    // Footer
    footer: {
      brandName: 'Jaco Moments',
      tagline: 'Fotograf de nuntă în Timișoara, România',
      navigation: 'Navigare',
      contact: 'Contact',
      legal: 'Legal',
      rights: 'Toate drepturile rezervate.',
    },


  },

}

export type TranslationKey = keyof typeof translations.ro

// Get all translations (Romanian only)
export function getTranslations() {
  return translations.ro
}
