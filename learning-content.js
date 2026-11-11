/**
 * Elevtexter för en första genomgång av kemi i årskurs 7.
 * Muterar de befintliga modul- och lektionsobjekten. Media, id och sparschema
 * behålls. Lärarens källor, avgränsningar och motiveringar finns i PEDAGOGIK.md.
 * Studenttexterna är vanlig, åtkomlig svenska med kemiska Unicode-formler.
 */
const CONTENT = {
  "1": {
    "module": {
      "title": "Atomer och molekyler",
      "shortTitle": "Atomer och molekyler",
      "goal": "Vi kan förklara skillnaden mellan en atom, en molekyl och ett atomslag.",
      "firstQuestion": "Är en atom och en molekyl samma sak? Skriv vad ni tror.",
      "task": "Jämför O₂ och H₂O. Räkna atomerna i varje molekyl. Räkna sedan atomslagen. Förklara till sist skillnaden mellan en atom och en molekyl.",
      "hint": "En kula står för en atom. Olika bokstäver visar olika atomslag. Räkna kulorna först och sorterna sedan.",
      "example": "O₂ har två atomer. Båda är syre, så där finns ett atomslag. H₂O har tre atomer: två väte och ett syre. Där finns två atomslag. En atom är en liten byggsten. En molekyl är en grupp atomer som sitter ihop.",
      "figureAlt": "En syrgasmolekyl, O₂, med två syreatomer. En vattenmolekyl, H₂O, med två väteatomer och en syreatom.",
      "check": {
        "type": "choice",
        "question": "Vad stämmer om en vattenmolekyl, H₂O?",
        "options": [
          "Två atomer av tre atomslag.",
          "Tre atomer av två atomslag.",
          "Tre atomer av tre atomslag."
        ],
        "correct": 1,
        "feedback": "H₂O har två väteatomer och en syreatom. Det blir tre atomer. Väte och syre är två atomslag."
      },
      "stretch": "Vatten är en kemisk förening. Syrgas är ett grundämne. Förklara skillnaden med atomslagen."
    },
    "learning": {
      "start": "Vattnet i ett glas består av små vattenmolekyler. Varje vattenmolekyl är byggd av atomer.",
      "keyWords": [
        {
          "word": "Atom",
          "meaning": "En mycket liten byggsten i ett ämne."
        },
        {
          "word": "Molekyl",
          "meaning": "En grupp av atomer som sitter ihop med kemiska bindningar."
        },
        {
          "word": "Atomslag",
          "meaning": "En sort av atomer. Väte och syre är två atomslag."
        },
        {
          "word": "Kemisk bindning",
          "meaning": "Det som håller ihop atomer i till exempel en molekyl."
        }
      ],
      "steps": [
        {
          "heading": "Räkna alla atomer",
          "text": "I en vattenmolekyl sitter två väteatomer ihop med en syreatom. Räkna varje atom en gång.",
          "example": "Två väte och ett syre blir tre atomer."
        },
        {
          "heading": "Räkna atomslagen",
          "text": "Nu räknar ni sorterna. Alla väteatomer är samma atomslag. Alla syreatomer är ett annat.",
          "example": "Tre atomer i H₂O, men två atomslag: väte och syre."
        },
        {
          "heading": "Läs formeln",
          "text": "H betyder väte och O betyder syre. Den lilla tvåan hör till H. En stor siffra framför formeln räknar hela molekyler.",
          "example": "H₂O är en vattenmolekyl. 2H₂O är två vattenmolekyler."
        }
      ],
      "takeaway": "H₂O har tre atomer av två atomslag. En molekyl är en hel grupp av bundna atomer.",
      "diagramText": "Bokstäverna i atomkulorna visar atomslagen. H betyder väte och O betyder syre. I O₂ sitter två O-atomer ihop. Det är två atomer av ett atomslag. I H₂O sitter två H-atomer ihop med en O-atom. Det är tre atomer av två atomslag. Strecken visar bindningar. En ram runt en grupp visar en hel molekyl. Två likadana H₂O-grupper är två molekyler. Då finns sex atomer, men fortfarande bara väte och syre.",
      "answerStarters": [
        "I O₂ finns … atomer av … atomslag.",
        "I H₂O finns … atomer av … atomslag.",
        "En atom är … En molekyl är …"
      ],
      "quickCheck": {
        "question": "Hur många atomer finns i en vattenmolekyl?",
        "options": [
          "Tre.",
          "Två.",
          "En."
        ],
        "answer": 0,
        "explanation": "Två väteatomer och en syreatom blir tre atomer."
      },
      "investigation": {
        "question": "Vad ändras när ni bygger en andra vattenmolekyl?",
        "predict": "Säg vad ni tror händer med antalet molekyler, atomer och atomslag.",
        "change": "Bygg först en H₂O-molekyl och sedan en till i labbet.",
        "keepSame": "Bygg båda molekylerna av två H och en O.",
        "observe": "Räkna molekyler, atomer och atomslag efter varje bygge.",
        "conclusionStart": "När vi byggde en molekyl till ändrades … men …",
        "limit": "Kulorna är en modell. Räkningen visar hur grupperna är byggda."
      }
    },
    "lesson": {
      "opener": "Vad finns i en vattenmolekyl?",
      "sections": [
        {
          "heading": "Antal och sort är olika saker",
          "body": "Fyra väteatomer är fyra byggstenar av samma sort. Lägg till en syreatom. Nu finns fem atomer av två atomslag. Ett atomslag är alltså en sort, inte en enskild atom.",
          "question": "Fyra H-atomer och två O-atomer ligger var för sig. Hur många atomer och atomslag finns?"
        },
        {
          "heading": "En liten och en stor tvåa",
          "body": "Den lilla tvåan i H₂O berättar hur varje vattenmolekyl är byggd. Den innehåller två H-atomer. I 2H₂O står också en stor tvåa framför formeln. Den betyder två hela molekyler. Tillsammans innehåller de fyra H och två O.",
          "question": "Vad räknar den lilla tvåan i H₂O? Vad räknar den stora tvåan i 2H₂O?"
        },
        {
          "heading": "Grundämne eller förening",
          "body": "Ett grundämne innehåller ett atomslag. Syrgas, O₂, innehåller bara syre. En kemisk förening innehåller olika atomslag som är kemiskt bundna till varandra. Vatten innehåller väte och syre. Alla ämnen består inte av egna små molekyler. Salt består till exempel av ett stort nätverk av joner. Joner är laddade delar som ni möter i område 3.",
          "question": "Varför är O₂ en molekyl men ingen kemisk förening?"
        },
        {
          "heading": "Fler grupper ger fler atomer",
          "body": "Tre O₂-molekyler innehåller två syreatomer var. Tre gånger två blir sex atomer. Alla är fortfarande syre. Antalet molekyler och atomer ökar, men antalet atomslag är ett.",
          "question": "Vad betyder 3O₂? Ange antalet molekyler, atomer och atomslag."
        }
      ],
      "workedExample": {
        "title": "Läs H₂O steg för steg",
        "steps": [
          "Läs bokstäverna. H är väte och O är syre. Det finns två atomslag.",
          "Läs den lilla siffran. Tvåan hör till H. Vid O saknas siffra, vilket betyder en O-atom.",
          "Räkna ihop. Två H och en O blir tre atomer i en vattenmolekyl."
        ]
      },
      "extraExamples": [
        {
          "title": "Två hela vattenmolekyler",
          "steps": [
            "Rita två H₂O-grupper. Håll ihop varje grupp.",
            "Räkna fyra H och två O. Det är sex atomer.",
            "Räkna sorterna. Det är fortfarande två atomslag: väte och syre."
          ]
        },
        {
          "title": "Samma antal atomer kan ge olika ämnen",
          "steps": [
            "H₂O och CO₂ har tre atomer i varje molekyl. C betyder kol.",
            "H₂O har två H och en O. CO₂ har en C och två O.",
            "Antalet atomer räcker därför inte för att känna igen ämnet. Atomslagen och hur de sitter ihop spelar också roll."
          ]
        }
      ],
      "misconception": {
        "claim": "En molekyl måste ha olika atomslag.",
        "correction": "En molekyl kan ha ett atomslag, som O₂, eller flera, som H₂O. För att ämnet ska vara en kemisk förening behövs olika atomslag som är bundna till varandra."
      },
      "film": {
        "title": "Atomer och molekyler",
        "before": "Följ en vattenmolekyl. Räkna först alla atomer. Räkna sedan sorterna.",
        "after": "Pausa vid vattenmolekylen. Räkna alla atomer och sedan atomslagen."
      },
      "reflectionPrompts": [
        "En kamrat säger att två vattenmolekyler har fyra atomslag. Visa hur ni kan räkna sorterna i stället.",
        "Låt en av er beskriva en molekyl. Den andra skriver formeln. Kontrollera tillsammans."
      ]
    }
  },
  "2": {
    "module": {
      "title": "Så har bilden av atomen ändrats",
      "shortTitle": "Bilder av atomen",
      "goal": "Vi kan jämföra två atommodeller och förklara varför modeller ändras.",
      "firstQuestion": "En atom kan visas som en kula eller med en kärna i mitten. Vad kan bilderna hjälpa oss att förstå?",
      "task": "Jämför Thomsons modell med Rutherfords modell. Var finns den positiva laddningen i varje bild? Förklara varför nya undersökningar kan få forskare att ändra en modell.",
      "hint": "Hos Thomson är den positiva laddningen utspridd. Hos Rutherford finns den i en liten kärna. Knyt skillnaden till vad forskarna såg i försöket.",
      "example": "Thomson ritade positiv laddning utspridd i atomen. Rutherford samlade den i en liten kärna. De flesta positiva partiklar gick genom guldfolien. Några böjde av mycket. En liten positiv kärna kan förklara detta. Därför ändrade forskarna bilden av atomen.",
      "figureAlt": "Thomsons modell med utspridd positiv laddning jämförs med Rutherfords modell med en liten positiv kärna.",
      "check": {
        "type": "choice",
        "question": "Varför kan forskare behöva ändra en modell?",
        "options": [
          "Nya undersökningar ger resultat som modellen behöver förklara.",
          "En gammal modell är alltid helt oanvändbar.",
          "Atomer ändrar sin uppbyggnad när vi lär oss något nytt."
        ],
        "correct": 0,
        "feedback": "Det är vår beskrivning som ändras när vi får nya resultat. Atomerna ändras inte för att vi lär oss något nytt."
      },
      "stretch": "I Thomsons liknelse är elektronerna russin och den positiva laddningen finns i kakan. Vad ändras när ni går till Rutherfords bild?"
    },
    "learning": {
      "start": "En karta visar vägar med streck. En atommodell är också en förenklad bild. Den hjälper oss att förklara sådant vi inte kan se direkt.",
      "keyWords": [
        {
          "word": "Modell",
          "meaning": "En förenklad bild eller beskrivning som hjälper oss att förstå något."
        },
        {
          "word": "Elektron",
          "meaning": "En liten del av atomen med negativ laddning."
        },
        {
          "word": "Atomkärna",
          "meaning": "Den lilla delen i atomens mitt. Där finns atomens positiva laddning."
        },
        {
          "word": "Observation",
          "meaning": "Något vi ser eller mäter i en undersökning."
        }
      ],
      "steps": [
        {
          "heading": "Börja med Thomsons bild",
          "text": "Thomson visste att atomen innehåller negativa elektroner. Han tänkte sig att den positiva laddningen var utspridd. Elektronerna fanns inne i den.",
          "example": "Russin i en kaka är en liknelse: russinen står för elektroner."
        },
        {
          "heading": "Följ ett överraskande resultat",
          "text": "Forskarna skickade små positiva partiklar mot tunn guldfolie. De flesta gick igenom. Några ändrade riktning mycket.",
          "example": "Ett resultat som är svårt att förklara kan visa att modellen behöver ändras."
        },
        {
          "heading": "Jämför med Rutherfords bild",
          "text": "Rutherford placerade den positiva laddningen i en liten kärna. Positiva laddningar stöter bort varandra. En partikel nära kärnan kan därför böja av mycket.",
          "example": "Stor del av atomen är utrymme runt kärnan. Där kan många partiklar passera."
        }
      ],
      "takeaway": "Nya resultat kan ändra våra modeller. Hos Rutherford finns den positiva laddningen i en liten kärna.",
      "diagramText": "Läs först Thomsons bild. Plustecknen är utspridda genom atomen. Minustecknen visar elektroner inne i den positiva delen. Läs sedan Rutherfords bild. Där finns plustecknen samlade i en liten kärna. Elektronerna finns runt kärnan. Partikelbanorna visar vad modellen ska förklara. Många banor går nästan rakt. Några böjer av nära kärnan. Plus stöter bort plus. Bilderna visar två olika förklaringar av atomens uppbyggnad.",
      "answerStarters": [
        "I Thomsons modell finns den positiva laddningen …",
        "I Rutherfords modell finns den …",
        "När forskarna såg … behövde de …"
      ],
      "quickCheck": {
        "question": "Var finns den positiva laddningen i Rutherfords modell?",
        "options": [
          "I en liten kärna.",
          "Jämnt utspridd i hela atomen.",
          "I elektronerna."
        ],
        "answer": 0,
        "explanation": "Rutherfords kärna samlar den positiva laddningen i en liten del av atomen."
      },
      "investigation": {
        "question": "Kan samma start ge olika banor i två atommodeller?",
        "predict": "Säg i vilken modell ni tror att partikeln böjer av mest nära mitten.",
        "change": "Följ labbets steg till jämförelsen mellan Thomson och Rutherford.",
        "keepSame": "I jämförelsen har partiklarna samma start och samma laddning.",
        "observe": "Jämför spåren. Beskriv vilken bana som ändrar riktning mest.",
        "conclusionStart": "Med samma start blev banorna … eftersom …",
        "limit": "Två modellberäkningar jämförs. Det är inte två partiklar i en gemensam atom."
      }
    },
    "lesson": {
      "opener": "Varför ritar forskare olika bilder av samma atom?",
      "sections": [
        {
          "heading": "Thomson: positiv laddning utspridd",
          "body": "Thomson placerade negativa elektroner i en utspridd positiv laddning. Russinkakan är en liknelse. Russinen föreställer elektroner och kakan föreställer den positiva delen. Ingen liten kärna finns i den här modellen.",
          "question": "Vad står russinen för? Vad står kakan för?"
        },
        {
          "heading": "Rutherford: en liten positiv kärna",
          "body": "Rutherfords grupp undersökte hur positiva alfapartiklar passerade guldfolie. Alfapartiklar är små positiva partiklar. De flesta passerade nästan rakt. Några böjde av mycket. En liten positiv kärna kan förklara den starka påverkan på en partikel som kommer nära.",
          "question": "Varför kan en positiv partikel böja av nära en positiv kärna?"
        },
        {
          "heading": "Olika bilder svarar på olika frågor",
          "body": "En skalmodell hjälper oss att ordna elektronerna i grupper runt kärnan. Skalen är inte hårda väggar. En bild av ett elektronmoln visar var elektroner kan finnas. Ett tätare område betyder större chans att hitta en elektron där. Ingen av bilderna visar en känd väg som elektronen följer.",
          "question": "Vad betyder ett tätare område i en bild av ett elektronmoln?"
        },
        {
          "heading": "Solsystemet är en liknelse",
          "body": "Solen i mitten kan hjälpa oss att tänka på kärnans plats. Planeterna runt solen kan påminna om elektroner runt kärnan. Men planeter och elektroner fungerar olika. I atomen verkar elektriska krafter. Elektroner följer inte kända planetbanor.",
          "question": "Vad kan liknelsen med solsystemet hjälpa oss att se? Vad stämmer inte?"
        }
      ],
      "workedExample": {
        "title": "Knyt resultatet till modellen",
        "steps": [
          "Thomson: den positiva laddningen är utspridd. Peka ut den i bilden.",
          "Rutherford: den positiva laddningen är samlad i en liten kärna.",
          "Knyt till resultatet. En positiv partikel nära en positiv kärna stöts bort och kan böja av mycket."
        ]
      },
      "extraExamples": [
        {
          "title": "Förklara både raka och böjda banor",
          "steps": [
            "De flesta partiklar passerar långt från den lilla kärnan. De påverkas mindre.",
            "En del passerar nära kärnan. Där kan riktningen ändras mycket.",
            "En användbar modell behöver hjälpa oss att förklara båda resultaten."
          ]
        },
        {
          "title": "Välj en bild som hjälper",
          "steps": [
            "För att visa den positiva laddningens plats kan ni använda en kärnmodell.",
            "För att räkna elektroner i det yttersta skalet kan ni använda en skalmodell.",
            "För att visa var elektroner kan finnas kan ni använda en molnbild. Säg vad er bild hjälper er att förklara."
          ]
        }
      ],
      "misconception": {
        "claim": "Thomson hade också en liten positiv kärna i mitten.",
        "correction": "I Thomsons modell är den positiva laddningen utspridd. Hos Rutherford är den samlad i en liten kärna. Det är en viktig skillnad."
      },
      "film": {
        "title": "Atommodeller förändras",
        "before": "Se vad forskarna upptäcker. Följ hur resultatet ändrar deras bild av atomen.",
        "after": "Jämför raka och böjda banor. Använd en liten positiv kärna för att förklara skillnaden."
      },
      "reflectionPrompts": [
        "Rita Thomson och Rutherford bredvid varandra. Använd plus för positiv laddning och minus för elektroner.",
        "Ett nytt resultat passar inte modellen. Vad kan forskarna behöva kontrollera i försöket eller ändra i modellen?"
      ]
    }
  },
  "3": {
    "module": {
      "title": "Elektroner hjälper atomer att binda",
      "shortTitle": "Elektroner och bindningar",
      "goal": "Vi kan förklara hur två väteatomer delar elektroner och hålls ihop.",
      "firstQuestion": "När två atomer binds ihop: vad tror ni ändras hos elektronerna och kärnorna?",
      "task": "Använd bilden av H₂. Förklara vad de två elektronerna gör när väteatomerna binds ihop. Beskriv också vad som händer med de två atomkärnorna.",
      "hint": "Två elektroner bildar ett elektronpar. I H₂ delar atomerna paret. Räkna kärnorna före och efter.",
      "example": "Två väteatomer delar två elektroner. Paret hjälper till att hålla ihop atomerna i H₂. Samma två vätekärnor finns kvar. Kärnorna slås inte ihop och väte blir inte ett annat atomslag.",
      "figureAlt": "Två väteatomer med varsin kärna och elektron. När de bildar H₂ delar de ett elektronpar. De två kärnorna finns kvar.",
      "check": {
        "type": "choice",
        "question": "Vad stämmer vid en vanlig kemisk reaktion?",
        "options": [
          "Protoner byter kärna och bildar nya grundämnen.",
          "Atomerna försvinner och ersätts av nya atomer.",
          "Elektroner och bindningar kan ändras. Atomkärnorna finns kvar."
        ],
        "correct": 2,
        "feedback": "Det är bindningarna som kan ändras. Kärnorna finns kvar, så atomslagen är desamma."
      },
      "stretch": "H₂ innehåller bara väte. Ge ett exempel på ett ämne med väte och ett annat atomslag som sitter ihop. Varför är det en kemisk förening?"
    },
    "learning": {
      "start": "I en vattenmolekyl sitter atomer ihop. Nu ska vi se hur elektroner kan hjälpa atomer att hålla ihop.",
      "keyWords": [
        {
          "word": "Elektron",
          "meaning": "En liten del av atomen med negativ laddning."
        },
        {
          "word": "Proton",
          "meaning": "En liten del i kärnan med positiv laddning."
        },
        {
          "word": "Elektronpar",
          "meaning": "Två elektroner. Två atomer kan dela ett par i en bindning."
        },
        {
          "word": "Jon",
          "meaning": "En atom eller atomgrupp som har elektrisk laddning."
        }
      ],
      "steps": [
        {
          "heading": "Börja med laddningarna",
          "text": "En proton är positiv och en elektron är negativ. Plus och minus dras till varandra. En atom med lika många protoner och elektroner är neutral. Det betyder att laddningarna tar ut varandra.",
          "example": "En proton och en elektron ger tillsammans laddningen noll."
        },
        {
          "heading": "Se hur två väteatomer delar",
          "text": "Varje väteatom har en proton i kärnan och en elektron. När två väteatomer binds ihop delar de sina två elektroner. Paret hjälper till att hålla ihop atomerna.",
          "example": "Två väteatomer bildar en vätemolekyl: H₂."
        },
        {
          "heading": "Följ det som finns kvar",
          "text": "De två kärnorna finns kvar när H₂ bildas. Det finns också två elektroner totalt. Det nya är att atomerna är bundna i samma molekyl.",
          "example": "Väte är fortfarande väte. Kärnorna blir inte en ny gemensam kärna."
        }
      ],
      "takeaway": "I H₂ delar två väteatomer ett elektronpar. Samma två kärnor finns kvar.",
      "diagramText": "Bilden före bindningen visar två väteatomer. Varje atom har en positiv kärna och en negativ elektron. Bilden efter visar H₂. De två elektronerna visas som ett par mellan kärnorna. Paret delas av atomerna. Räkna fortfarande två kärnor och två elektroner. Området mellan kärnorna hjälper oss att visa paret. Det är ingen hård vägg eller en känd bana för elektronerna. Väte är fortfarande väte när atomerna har bundits ihop.",
      "answerStarters": [
        "Före bindningen finns …",
        "När H₂ bildas delar atomerna …",
        "De två kärnorna …"
      ],
      "quickCheck": {
        "question": "Vad stämmer när två väteatomer bildar H₂?",
        "options": [
          "Atomerna delar ett elektronpar.",
          "Kärnorna slås ihop till en kärna.",
          "Väteatomerna blir syreatomer."
        ],
        "answer": 0,
        "explanation": "Två elektroner delas. Samma två vätekärnor finns kvar."
      },
      "investigation": {
        "question": "Vad finns kvar när två väteatomer delar ett elektronpar?",
        "predict": "Säg vad ni tror händer med de två kärnorna och de två elektronerna.",
        "change": "För väteatomerna närmare i labbet. Dela sedan elektronparet.",
        "keepSame": "Följ samma två vätekärnor och samma två elektroner.",
        "observe": "Räkna kärnor och elektroner före och efter. Se var det delade paret visas.",
        "conclusionStart": "Atomerna hålls ihop när … Samma … finns kvar.",
        "limit": "Bilden visar hur bindningen kan förklaras. Den visar ingen känd bana som elektronerna följer."
      }
    },
    "lesson": {
      "opener": "Vad hjälper två atomer att hålla ihop?",
      "sections": [
        {
          "heading": "Plus, minus och noll",
          "body": "Protoner har positiv laddning. Elektroner har negativ laddning. Neutroner saknar laddning. Protoner och neutroner finns i kärnan. Elektroner finns runt den. En atom är neutral när antalet protoner och elektroner är lika stort.",
          "question": "En väteatom har en proton och en elektron. Varför är den neutral?"
        },
        {
          "heading": "Två atomer delar ett par",
          "body": "Två väteatomer kan dela sina två elektroner. Elektronerna dras till båda positiva kärnorna. Det hjälper till att hålla ihop atomerna. Vi kallar de två delade elektronerna ett gemensamt elektronpar. Molekylen skrivs H₂.",
          "question": "Hur många kärnor och elektroner finns före och efter att H₂ bildas?"
        },
        {
          "heading": "En elektron kan lämna en atom",
          "body": "En väteatom har en proton och en elektron. Plus och minus tar ut varandra. Om elektronen lämnar finns en positiv kärna kvar. Då är vätejonen positiv. En jon är en laddad atom eller atomgrupp.",
          "question": "En partikel har en proton och ingen elektron. Vilken laddning har den? Förklara."
        },
        {
          "heading": "Kärnan avgör atomslaget",
          "body": "Om en elektron lämnar en atom ändras laddningen. Antalet protoner ändras inte. Därför är atomslaget samma. Väte är fortfarande väte när det blir en vätejon. Vid vanliga kemiska reaktioner finns kärnorna kvar medan bindningar kan ändras.",
          "question": "Varför blir en atom positiv när en negativ elektron lämnar den?"
        }
      ],
      "workedExample": {
        "title": "Följ delarna i H₂",
        "steps": [
          "Före finns två väteatomer. Räkna två kärnor och två elektroner totalt.",
          "Atomerna delar de två elektronerna. Paret hjälper till att hålla ihop dem.",
          "Efter finns samma två kärnor och samma två elektroner i en vätemolekyl."
        ]
      },
      "extraExamples": [
        {
          "title": "Räkna laddningen",
          "steps": [
            "En väteatom har ett plus från protonen och ett minus från elektronen. Laddningen är noll.",
            "Elektronen lämnar. Då finns ett plus kvar och inget minus.",
            "Vätejonen är positiv och skrivs H⁺. Den har fortfarande en proton. Atomslaget är väte."
          ]
        },
        {
          "title": "Plus och minus hjälper oss att förklara",
          "steps": [
            "De två positiva vätekärnorna stöter bort varandra.",
            "De negativa elektronerna dras till båda positiva kärnorna.",
            "När atomerna är bundna delas elektronerna. Det gemensamma paret hjälper till att hålla ihop molekylen."
          ]
        }
      ],
      "misconception": {
        "claim": "Atomerna blir nya grundämnen när de binds ihop.",
        "correction": "Kärnorna finns kvar vid vanliga kemiska reaktioner. Därför är atomslagen desamma. Det är hur atomerna binds ihop som kan ändras."
      },
      "film": {
        "title": "Elektroner, laddningar och bindningar",
        "before": "Följ elektronen och laddningen. Se sedan hur två väteatomer delar ett elektronpar.",
        "after": "Förklara varför en väteatom blir positiv när en elektron lämnar den. Beskriv sedan hur två väteatomer delar ett elektronpar i H₂."
      },
      "reflectionPrompts": [
        "Rita före och efter att H₂ bildas. Kontrollera att antalet kärnor är samma.",
        "Peka ut det delade elektronparet. Förklara hur det hjälper väteatomerna att hålla ihop."
      ]
    }
  },
  "4": {
    "module": {
      "title": "Förändringar: samma ämne eller nya ämnen?",
      "shortTitle": "Samma eller nya ämnen?",
      "goal": "Vi kan skilja ett fasbyte från en förändring där nya ämnen bildas.",
      "firstQuestion": "En isbit smälter. En cykel rostar. Är det samma slags förändring? Skriv vad ni tror.",
      "task": "Sortera fyra exempel: is smälter, järn rostar, vatten kokar och ved brinner. I vilka exempel bildas nya ämnen? Välj ett exempel ur varje grupp och förklara.",
      "hint": "Fråga om ämnet är samma efter förändringen. Vatten kan vara is, vätska eller gas och ändå vara vatten.",
      "example": "Is som smälter och vatten som kokar är fysikaliska förändringar. Vattnet är fortfarande H₂O. När järn rostar och ved brinner bildas nya ämnen. Det är kemiska reaktioner.",
      "figureAlt": "Is och flytande vatten har samma vattenmolekyler. Vid en reaktion ordnas samma väte- och syreatomer i nya grupper och bildar vatten.",
      "check": {
        "type": "choice",
        "question": "Varför är kokning en fysikalisk förändring?",
        "options": [
          "Ämnet är fortfarande vatten. En del blir gas.",
          "Vattenmolekylerna delas till väte och syre.",
          "Alla förändringar som behöver värme är fysikaliska."
        ],
        "correct": 0,
        "feedback": "Både vätskan och gasen består av vattenmolekyler. Vid kokning bildas inte väte och syre."
      },
      "stretch": "Värme kan få is att smälta. Den kan också få ved att börja brinna. Förklara varför det är två olika slags förändringar."
    },
    "learning": {
      "start": "En isbit kan bli en vattenpöl. En rostig cykel får nya ämnen på ytan. Båda förändras, men på olika sätt.",
      "keyWords": [
        {
          "word": "Fysikalisk förändring",
          "meaning": "Ämnet finns kvar. Till exempel smälter is till vatten."
        },
        {
          "word": "Kemisk reaktion",
          "meaning": "Ämnen reagerar och nya ämnen bildas. Atomerna finns kvar."
        },
        {
          "word": "Fasbyte",
          "meaning": "Ett ämne byter mellan fast form, vätska och gas."
        }
      ],
      "steps": [
        {
          "heading": "Följ samma vatten",
          "text": "När is smälter kan vattenmolekylerna röra sig förbi varandra. Det är fortfarande vatten. Formen och rörelsen ändras.",
          "example": "Is → flytande vatten är ett fasbyte och en fysikalisk förändring."
        },
        {
          "heading": "Leta efter nya ämnen",
          "text": "När järn rostar reagerar järnet med ämnen i omgivningen. Det bildas rost. Rost har andra egenskaper än järn.",
          "example": "Rostbildning är en kemisk reaktion. Nya ämnen bildas. När ved brinner bildas bland annat koldioxid och vatten."
        },
        {
          "heading": "Följ atomerna",
          "text": "Vid en kemisk reaktion binds atomerna på nya sätt. Atomerna försvinner inte. Det är hur de sitter ihop som ändras.",
          "example": "Väte och syre kan reagera och bilda vatten. Samma väte- och syreatomer finns efter reaktionen."
        }
      ],
      "takeaway": "Fråga om nya ämnen bildas. Vid ett fasbyte finns ämnet kvar. Vid en kemisk reaktion bildas nya ämnen.",
      "diagramText": "Till vänster finns vattenmolekyler i is och i flytande vatten. Varje molekyl har två H och en O i båda bilderna. Molekylernas placering ändras. Till höger visas en kemisk reaktion. Före finns två H₂-molekyler och en O₂-molekyl. Det är fyra väteatomer och två syreatomer. Efter finns två H₂O-molekyler. Räkna fyra H och två O igen. Numret vid en atom hjälper er att följa samma atom. Det är inte en del av den kemiska formeln.",
      "answerStarters": [
        "När … händer är ämnet fortfarande …",
        "När … händer bildas …",
        "Det är en … förändring eftersom …"
      ],
      "quickCheck": {
        "question": "Vilket exempel bildar nya ämnen?",
        "options": [
          "Järn som rostar.",
          "Is som smälter.",
          "Flytande vatten som blir gas."
        ],
        "answer": 0,
        "explanation": "När järn rostar bildas ämnen med andra egenskaper än järn. Is och vattenånga är fortfarande vatten."
      }
    },
    "lesson": {
      "opener": "Vad har ändrats när is smälter eller järn rostar?",
      "sections": [
        {
          "heading": "Samma ämne i en ny form",
          "body": "Is, flytande vatten och vattenånga är samma ämne: vatten. Vid ett fasbyte finns vattenmolekylerna kvar. Molekylerna kan däremot röra sig och ligga på andra sätt. Därför är fasbytet en fysikalisk förändring.",
          "question": "Vad finns kvar när en isbit smälter?"
        },
        {
          "heading": "Atomerna binds på nya sätt",
          "body": "Två H₂-molekyler och en O₂-molekyl kan reagera och bilda två H₂O-molekyler. Före finns fyra H-atomer och två O-atomer. Efter finns lika många av varje slag. Ett nytt ämne har bildats genom att atomerna binds på nya sätt.",
          "question": "Räkna väte och syre före och efter reaktionen. Vad har ändrats?"
        },
        {
          "heading": "En ledtråd är inte ett säkert bevis",
          "body": "Bubblor kan visa att en gas bildas. Men när vatten kokar är gasen fortfarande vatten. En färgändring kan bero på nya ämnen eller på att färger blandas. Beskriv därför först vad ni ser. Förklara sedan om det finns stöd för att nya ämnen har bildats.",
          "question": "Varför räcker det inte att säga att det bubblar för att visa en kemisk reaktion?"
        },
        {
          "heading": "Följ också gaserna",
          "body": "När ett ljus brinner reagerar ämnen i ljuset med syre från luften. Bland annat vatten och koldioxid bildas. En del lämnar platsen som gas. För att följa all materia behöver vi räkna med luften och gaserna, inte bara ljuset som finns kvar.",
          "question": "Varför räcker det inte att bara väga ljuset för att följa hela reaktionen?"
        }
      ],
      "workedExample": {
        "title": "Förklara kokande vatten",
        "steps": [
          "Beskriv det som syns: vatten värms och bubblor stiger.",
          "Följ ämnet: vätskan och vattenångan består av H₂O.",
          "Dra slutsatsen: vattnet byter tillstånd. Det bildas inget nytt ämne. Kokning är en fysikalisk förändring."
        ]
      },
      "extraExamples": [
        {
          "title": "Räkna atomer före och efter",
          "steps": [
            "Före: två H₂ och en O₂. Räkna fyra H och två O.",
            "Efter: två H₂O. Räkna fyra H och två O igen.",
            "Atomerna är lika många. De har nya grannar och bildar ett nytt ämne."
          ]
        },
        {
          "title": "Ved kan ändras på två sätt",
          "steps": [
            "Om ved delas i mindre bitar ändras formen. Ämnena i veden finns kvar.",
            "Om ved brinner reagerar ämnen med syre. Nya ämnen bildas.",
            "Förklara skillnaden med vilka ämnen som finns före och efter."
          ]
        }
      ],
      "misconception": {
        "claim": "En förändring är kemisk om den är svår att göra ogjord.",
        "correction": "Fråga i stället om nya ämnen har bildats. Klippt papper är svårt att få helt igen. Ändå är ämnena i papperet kvar."
      },
      "film": {
        "title": "Samma molekyler eller nya ämnen?",
        "before": "Följ samma vattenmolekyler vid ett fasbyte. Följ sedan samma atomer i en kemisk reaktion.",
        "after": "Peka ut vad som finns kvar. Förklara vad som ändras när nya ämnen bildas."
      },
      "reflectionPrompts": [
        "Förbättra förklaringen: Det bubblar, alltså är det en kemisk reaktion. Vad behöver ni veta mer?",
        "Ge ett exempel på varje slags förändring. Låt er partner fråga om nya ämnen har bildats."
      ]
    }
  },
  "5": {
    "module": {
      "title": "Välj material som passar",
      "shortTitle": "Material och egenskaper",
      "goal": "Vi kan jämföra egenskaper och förklara varför ett material passar en uppgift.",
      "firstQuestion": "Två ämnen har samma färg. Betyder det att de är samma ämne? Skriv hur ni tänker.",
      "task": "Välj material till en kastrulls botten och till dess handtag. Vilken egenskap behövs i varje del? Förklara hur egenskapen hjälper delen att fungera.",
      "hint": "Botten ska föra värme till maten. Handtaget ska föra värme långsamt till handen.",
      "example": "Metall leder värme bra och passar i botten. Då kan värmen nå maten. Handtaget ska leda värme sämre. Trä kan passa, men materialet måste också tåla värme och hålla när kastrullen lyfts.",
      "figureAlt": "Koppar och trä jämförs. En kastrulls botten ska leda värme till maten och handtaget ska föra värme långsammare till handen.",
      "check": {
        "type": "choice",
        "question": "Ett prov är antingen järn eller koppar. Vilket test kan skilja dem åt?",
        "options": [
          "Testa bara om provet leder ström. Båda gör det.",
          "Se om provet dras tydligt till en vanlig magnet. Järn gör det, koppar gör det inte.",
          "Att smaka på ett okänt prov. Det ska aldrig göras."
        ],
        "correct": 1,
        "feedback": "En vanlig magnet drar tydligt i järn, men inte i koppar. Båda leder ström. Därför hjälper magnettestet mer i just den jämförelsen."
      },
      "stretch": "Ett handtag ska leda värme dåligt. Vilken annan egenskap behöver det? Förklara varför."
    },
    "learning": {
      "start": "En kastrull behöver bli varm i botten. Handtaget ska hjälpa oss att hålla den. Därför kan delarna behöva olika material.",
      "keyWords": [
        {
          "word": "Egenskap",
          "meaning": "Något som beskriver ett material, till exempel hur hårt det är eller hur det leder värme."
        },
        {
          "word": "Värmeledning",
          "meaning": "Hur värme förs vidare genom ett material."
        },
        {
          "word": "Löslighet",
          "meaning": "Hur mycket av ett ämne som kan lösas i till exempel vatten."
        },
        {
          "word": "Densitet",
          "meaning": "Jämför lika stora bitar. Högre densitet betyder mer massa. Massa mäts i gram eller kilogram."
        }
      ],
      "steps": [
        {
          "heading": "Börja med delens uppgift",
          "text": "Botten ska föra värme från spisen till maten. Handtaget ska gå att hålla i. Säg först vad delen behöver göra.",
          "example": "Botten behöver leda värme bra. Handtaget behöver leda värme sämre."
        },
        {
          "heading": "Jämför en egenskap",
          "text": "Gör jämförelsen rättvis. När ni jämför hur två stavar leder värme ska deras längd och tjocklek vara lika. Uppvärmningen ska också vara lika.",
          "example": "Ändra materialet. Behåll de andra villkoren lika."
        },
        {
          "heading": "Förklara materialvalet",
          "text": "Knyt egenskapen till uppgiften. Säg vad materialet gör och varför det hjälper. Fler egenskaper kan behöva passa samtidigt.",
          "example": "Trä leder värme sämre än metall. Ett trähandtag kan därför föra värme långsammare till handen."
        }
      ],
      "takeaway": "Ett material passar när dess egenskaper hjälper delen att göra sitt arbete.",
      "diagramText": "Två lika långa och tjocka stavar jämförs. Den ena är koppar och den andra är trä. De värms på samma sätt i ena änden. Bilden visar att värme sprids snabbare genom koppar. I bilden av kastrullen går värmen genom metallbottnen till maten. Handtaget är av ett material som leder värme sämre. Följ kedjan: delens uppgift, materialets egenskap och hur egenskapen hjälper delen.",
      "answerStarters": [
        "Botten behöver … Därför passar …",
        "Handtaget behöver … eftersom …",
        "Materialet måste också …"
      ],
      "quickCheck": {
        "question": "Varför passar ett värmeledande material i kastrullens botten?",
        "options": [
          "Värmen kan nå maten genom botten.",
          "Det gör att maten alltid blir kall.",
          "Alla delar av kastrullen ska ha samma egenskaper."
        ],
        "answer": 0,
        "explanation": "Bottnens uppgift är att föra värme från spisen till maten."
      }
    },
    "lesson": {
      "opener": "Varför har inte hela kastrullen samma material?",
      "sections": [
        {
          "heading": "Färg är bara en egenskap",
          "body": "Salt och socker kan båda vara vita. Järn och koppar leder båda ström. En egenskap räcker därför inte alltid för att känna igen ett ämne. Välj en jämförelse som kan ge olika resultat för de möjliga ämnena.",
          "question": "Varför kan två ämnen med samma färg ändå vara olika ämnen?"
        },
        {
          "heading": "Gör jämförelsen rättvis",
          "body": "Om ni jämför löslighet behöver ni samma mängd vatten och samma temperatur. Löslighet handlar om hur mycket som kan lösas. Om det ena provet får varmt vatten och det andra kallt kan ni inte veta vad skillnaden beror på.",
          "question": "Varför blir jämförelsen svår att tolka om vattnet har olika temperatur?"
        },
        {
          "heading": "Välj ett användbart test",
          "body": "I ett tänkt exempel är ett prov antingen järn eller koppar. Järn dras tydligt till en vanlig magnet. Koppar gör det inte. Det testet skiljer alternativen åt. Ett strömtest hjälper mindre här eftersom båda metallerna leder ström.",
          "question": "Varför hjälper magnettestet mer än ett strömtest när alternativen är järn och koppar?"
        },
        {
          "heading": "Flera egenskaper kan behövas",
          "body": "Handtaget ska leda värme långsamt, tåla värme och hålla när kastrullen lyfts. I en elkabel behövs andra egenskaper. Metallen leder ström. Plasten leder ström mycket dåligt och hjälper till att hålla strömmen i rätt väg.",
          "question": "Vad behöver ni också kräva om ett material leder värme dåligt men mjuknar när kastrullen används?"
        }
      ],
      "workedExample": {
        "title": "Motivera två materialval",
        "steps": [
          "Botten ska föra värme till maten. Där behövs god värmeledning.",
          "Metall leder värme bra. Det hjälper botten att värma maten.",
          "Handtaget ska föra värme långsammare till handen. Välj ett material som också tål värmen och belastningen."
        ]
      },
      "extraExamples": [
        {
          "title": "Jämför densitet med lika stora bitar",
          "steps": [
            "Tänk er två lika stora klossar av olika material.",
            "Den kloss som har störst massa har högst densitet. Mer massa finns i samma volym.",
            "En större kloss kan väga mer bara för att den är större. Därför behöver volymen vara med i jämförelsen."
          ]
        },
        {
          "title": "Ledare och isolator",
          "steps": [
            "En elektrisk ledare släpper fram ström. Metalltråden i en kabel är en ledare.",
            "En elektrisk isolator leder ström mycket dåligt. Plasten runt tråden isolerar.",
            "Delarna behöver olika egenskaper. Förklara hur båda hjälper kabeln att fungera."
          ]
        }
      ],
      "misconception": {
        "claim": "Samma färg betyder samma ämne.",
        "correction": "Färg är bara en egenskap. Flera ämnen kan ha samma färg. Därför behöver vi fler uppgifter för att skilja dem åt."
      },
      "film": {
        "title": "Egenskaper hjälper oss att välja",
        "before": "Jämför de två stavarna. Se vad som hålls lika och vad som ändras.",
        "after": "Förklara ett materialval med orden egenskap och eftersom."
      },
      "reflectionPrompts": [
        "Ett material har en bra egenskap för uppgiften. Vilka andra egenskaper kan också behövas?",
        "Beskriv varför en kabel behöver både en ledare och ett material som isolerar."
      ]
    }
  },
  "6": {
    "module": {
      "title": "Vatten som is, vätska och gas",
      "shortTitle": "Vatten byter form",
      "goal": "Vi kan förklara vad som ändras och vad som finns kvar när vatten byter tillstånd.",
      "firstQuestion": "När vatten blir vattenånga: vad tror ni händer med vattenmolekylerna?",
      "task": "Jämför is, flytande vatten och vattenånga. Hur ändras molekylernas platser, rörelser och avstånd? Beskriv också vad som är samma i varje vattenmolekyl.",
      "hint": "Följ en H₂O-molekyl genom bilderna. Räkna samma två H och en O. Se sedan hur molekylen rör sig bland de andra.",
      "example": "I is rör sig molekylerna fram och tillbaka kring bestämda platser. I flytande vatten kan de glida förbi varandra. I gas är avstånden mycket större. Varje vattenmolekyl är fortfarande H₂O, med två H och en O.",
      "figureAlt": "Samma vattenmolekyler i is, flytande vatten och gas. Molekylernas avstånd och rörelser ändras. En kurva visar temperaturen under uppvärmning.",
      "check": {
        "type": "choice",
        "question": "Vad händer med molekylerna när flytande vatten blir gas?",
        "options": [
          "Varje molekyl blir större.",
          "Vattenmolekylerna delas i väte och syre.",
          "Molekylerna är fortfarande H₂O. Avstånden mellan dem blir mycket större."
        ],
        "correct": 2,
        "feedback": "Själva molekylerna har samma byggstenar. Gas tar mer plats främst för att avstånden mellan molekylerna är större."
      },
      "stretch": "Is flyter på flytande vatten. Förklara med molekylernas avstånd och ordet densitet. Densitet beskriver hur mycket massa som finns i en viss volym."
    },
    "learning": {
      "start": "En blöt tröja kan torka utan att vattnet kokar. Vatten lämnar tyget som gas och blandas med luften.",
      "keyWords": [
        {
          "word": "Tillstånd",
          "meaning": "Fast form, vätska eller gas är olika tillstånd."
        },
        {
          "word": "Fasbyte",
          "meaning": "När ett ämne byter tillstånd, till exempel från is till vätska."
        },
        {
          "word": "Vattenånga",
          "meaning": "Vatten i gasform. Vattenånga är osynlig."
        },
        {
          "word": "Kondensera",
          "meaning": "Att gå från gas till vätska. Vattenånga kan bilda vattendroppar."
        }
      ],
      "steps": [
        {
          "heading": "Följ samma H₂O",
          "text": "Varje vattenmolekyl har två väteatomer och en syreatom. De finns kvar när is blir vatten och sedan gas. Molekylerna blir inte större.",
          "example": "Is, flytande vatten och vattenånga är samma ämne."
        },
        {
          "heading": "Jämför rörelse och avstånd",
          "text": "I is rör sig molekylerna kring bestämda platser. I vätskan kan de röra sig förbi varandra. I gas är det mycket längre mellan dem.",
          "example": "Gas tar stor plats för att avstånden är större, inte för att molekylerna har vuxit."
        },
        {
          "heading": "Läs temperaturkurvan",
          "text": "När ni värmer vattnet för ni energi till det. Temperaturen kan då stiga. Under smältning eller kokning kan energin i stället ändra tillståndet, medan temperaturen är samma.",
          "example": "Is av rent vatten smälter vid 0 °C vid vanligt lufttryck. Mer is blir vatten medan temperaturen är samma."
        }
      ],
      "takeaway": "Vid ett fasbyte finns samma H₂O-molekyler kvar. Deras rörelser och avstånd ändras.",
      "diagramText": "Följ samma grupp vattenmolekyler genom tre bilder. I is rör sig molekylerna kring bestämda platser. I vätskan ligger de nära och kan röra sig förbi varandra. I gas ligger de mycket längre ifrån varandra. Varje molekyl består fortfarande av två H och en O. På temperaturkurvan betyder en stigande del att temperaturen ökar. En plan del vid 0 °C visar smältning. En plan del vid 100 °C visar kokning. Det gäller rent vatten vid vanligt lufttryck. Under den plana delen ändras tillståndet medan temperaturen är samma.",
      "answerStarters": [
        "I is …",
        "I flytande vatten … I gas …",
        "Varje vattenmolekyl har fortfarande …"
      ],
      "quickCheck": {
        "question": "Vad finns kvar när is smälter?",
        "options": [
          "Samma vattenmolekyler.",
          "Molekyler som har vuxit.",
          "Bara fria väte- och syreatomer."
        ],
        "answer": 0,
        "explanation": "Is blir flytande vatten. H₂O-molekylerna finns kvar men kan röra sig på nya sätt."
      },
      "investigation": {
        "question": "Kan ni värma is som smälter utan att temperaturen stiger?",
        "predict": "Säg vad ni tror att termometern visar medan isen smälter.",
        "change": "Fortsätt tillföra energi i Vattenlabbet under smältningen.",
        "keepSame": "Följ samma 50 g rent vatten vid samma lufttryck.",
        "observe": "Läs temperaturen vid två tillfällen. Jämför samtidigt andelen is och flytande vatten.",
        "conclusionStart": "Trots att vi värmde var temperaturen … medan …",
        "limit": "Labbet visar en modell utan värmeförluster. Den hjälper oss att följa sambandet mellan energi och fasbyte."
      }
    },
    "lesson": {
      "opener": "Vart tar vattnet vägen när en tröja torkar?",
      "sections": [
        {
          "heading": "Molekylerna rör sig också i is",
          "body": "I is rör sig molekylerna fram och tillbaka kring bestämda platser. Därför kan isbiten behålla sin form trots att molekylerna rör sig. När isen smälter kan molekylerna glida förbi varandra. Samma H₂O-molekyler finns kvar.",
          "question": "Hur kan molekylerna röra sig samtidigt som isbiten behåller sin form?"
        },
        {
          "heading": "Osynlig gas och synliga droppar",
          "body": "Vattenånga är vatten i gasform. Den är osynlig. Det vita molnet vid en kastrull består av små droppar. De bildas när vattenånga kyls och blir vätska. Det kallas kondensation. Vatten kan också lämna en vätskas yta som gas utan att koka. Det kallas avdunstning.",
          "question": "Vad består det vita molnet av? Hur har det bildats?"
        },
        {
          "heading": "Värme kan ändra temperaturen eller tillståndet",
          "body": "När vattnets temperatur stiger rör sig molekylerna mer i genomsnitt. Under smältning och kokning går tillförd energi till att ändra tillståndet. Temperaturen kan då stå stilla. För rent vatten vid vanligt lufttryck sker smältning vid 0 °C och kokning vid 100 °C.",
          "question": "Varför kan termometern visa samma temperatur när ni fortsätter värma is som smälter?"
        },
        {
          "heading": "Vatten på utsidan av glaset",
          "body": "Luften innehåller vattenånga. Nära ett kallt glas kan den kylas så att droppar bildas på utsidan. Gas har blivit vätska. Dropparna har inte kommit genom glasväggen. När vatten fryser blir strukturen också öppnare än i vätskan. Samma vattenmängd tar då större plats och får lägre densitet. Därför kan is flyta.",
          "question": "Varifrån kommer dropparna på utsidan av ett kallt glas? Vad heter förändringen?"
        }
      ],
      "workedExample": {
        "title": "Följ en vattenmolekyl",
        "steps": [
          "I is rör sig molekylen kring sin plats. Den har två H och en O.",
          "När isen smälter kan samma molekyl röra sig förbi andra molekyler.",
          "I gas rör den sig bland molekyler som ligger längre bort. Den är fortfarande H₂O."
        ]
      },
      "extraExamples": [
        {
          "title": "Förklara dropparna",
          "steps": [
            "Vattenånga finns i luften runt ett kallt glas.",
            "En del kyls och bildar flytande droppar på glasets utsida.",
            "Det är kondensation: vatten går från gas till vätska."
          ]
        },
        {
          "title": "Läs två delar av kurvan",
          "steps": [
            "I en stigande del ökar temperaturen. Molekylernas rörelse ökar i genomsnitt.",
            "Under en plan del kan tillståndet ändras medan temperaturen är samma.",
            "När fasbytet är klart kan temperaturen stiga igen om uppvärmningen fortsätter."
          ]
        }
      ],
      "misconception": {
        "claim": "Vattenmolekyler blir större när vattnet blir gas.",
        "correction": "Det blir framför allt längre mellan molekylerna. Varje molekyl har fortfarande två väteatomer och en syreatom."
      },
      "film": {
        "title": "Samma vatten i tre tillstånd",
        "before": "Följ samma vattenmolekyler. Se hur deras rörelser och avstånd ändras.",
        "after": "Pausa vid en plan del av kurvan. Beskriv vad som händer med temperaturen och med vattnets tillstånd."
      },
      "reflectionPrompts": [
        "Följ en vattenmolekyl genom alla tre tillstånd. Säg vad som ändras och vad som finns kvar.",
        "Koppla en plan kurvdel till is som smälter eller vatten som kokar. Förklara med ord och bild."
      ]
    }
  },
  "7": {
    "module": {
      "title": "Ämnen i miljön",
      "shortTitle": "Ämnen i miljön",
      "goal": "Vi kan följa hur ett ämne kan spridas och förklara en åtgärd som minskar spridningen.",
      "firstQuestion": "Ett gammalt batteri ligger vid en bäck. Kan det spela roll för djuren i vattnet även om ingen människa rör batteriet?",
      "task": "Beskriv hur ämnen från ett läckande batteri kan nå en levande varelse. Förklara vad som kan hända och varför batteriet ska lämnas till insamling.",
      "hint": "Följ en väg i taget: batteri → mark → vatten → djur eller växt. Förklara vad varje pil betyder. Använd om, kan och därför.",
      "example": "Om batteriet läcker kan ämnen komma ut i marken. Regn kan föra dem till bäcken. Djur och växter kan då komma i kontakt med ämnena. De kan påverkas, men det beror på ämnet och mängden. Därför ska batteriet lämnas till insamling innan det hamnar i naturen.",
      "figureAlt": "Fyra exempel med målarfärg: spill kan följa vatten, ett tråg fångar spill, färgrester lämnas till rätt insamling och en person läser etiketten före användning.",
      "check": {
        "type": "choice",
        "question": "Vilket påstående om risk stämmer?",
        "options": [
          "Ett ämne är alltid ofarligt om det finns i naturen.",
          "Risken beror bland annat på ämnet, mängden och hur en levande varelse utsätts.",
          "Batterier kan ligga i naturen om ingen människa rör dem."
        ],
        "correct": 1,
        "feedback": "Ämnet kan spridas även om ingen rör batteriet. Risken beror på ämnet, mängden och kontakten med människor, djur eller växter."
      },
      "stretch": "Koppla ihop kemi och biologi. Beskriv ett ämne som kan spridas och en levande varelse som kan påverkas."
    },
    "learning": {
      "start": "Ett skadat batteri vid en bäck kan börja läcka. Följ vad som kan hända om ämnen från batteriet når vattnet.",
      "keyWords": [
        {
          "word": "Källa",
          "meaning": "Platsen eller föremålet som ett ämne kommer från."
        },
        {
          "word": "Spridningsväg",
          "meaning": "Den väg ett ämne tar till en annan plats, till exempel med regnvatten."
        },
        {
          "word": "Organism",
          "meaning": "En levande varelse, till exempel en fisk, växt eller människa."
        },
        {
          "word": "Risk",
          "meaning": "Risken för skada beror på ämnets egenskaper och hur mycket och hur länge en organism utsätts."
        }
      ],
      "steps": [
        {
          "heading": "Hitta källan och vägen",
          "text": "Om batteriet läcker kan ämnen hamna i marken. Regn kan sedan föra en del ämnen till bäcken. Följ ett steg i taget.",
          "example": "Batteri → mark → bäck. Pilarna kan betyda läcker ut och följer med vatten."
        },
        {
          "heading": "Förklara en möjlig följd",
          "text": "En fisk kan komma i kontakt med ämnen genom vattnet eller maten. Vissa ämnen kan skada den. Vad som händer beror på ämnet, mängden och hur länge kontakten pågår.",
          "example": "En bild av en fisk i vatten räcker inte för att avgöra hur stor risken är."
        },
        {
          "heading": "Bryt spridningsvägen",
          "text": "Batterier ska lämnas till batteriinsamling. Då kan materialen tas om hand. Vi minskar risken att just det batteriet sprider ämnen i mark och vatten.",
          "example": "Rätt insamling tar hand om källan innan den börjar läcka i naturen."
        }
      ],
      "takeaway": "Följ kedjan källa → spridningsväg → organism. Förklara sedan hur en åtgärd kan bryta kedjan.",
      "diagramText": "Scen 1 visar målarfärg som har spillts. Regn kan föra ämnen från marken till en brunn och vidare till vatten med en fisk. Scen 2 visar en stängd burk i ett tråg. Tråget kan fånga ett spill. Scen 3 visar att färgrester lämnas till personal vid rätt insamling. Ett överkryssat avlopp visar vart färgrester inte ska hällas. Scen 4 visar en person som läser etiketten och planerar mängden färg. Pilarna visar hur en handling kan påverka spridningen. Bilderna visar tänkta exempel, inte uppmätta halter eller en bestämd skada på fisken.",
      "answerStarters": [
        "Om batteriet läcker kan …",
        "Ämnena kan nå … genom …",
        "Därför hjälper insamling eftersom …"
      ],
      "quickCheck": {
        "question": "Vilken handling kan stoppa spridningen från ett batteri i naturen?",
        "options": [
          "Lämna batteriet till rätt insamling.",
          "Flytta det närmare bäcken.",
          "Låta det ligga om ingen rör det."
        ],
        "answer": 0,
        "explanation": "Insamling gör att batteriet kan tas om hand innan det läcker på platsen."
      },
      "sourceExercise": {
        "title": "Kontrollera ett råd om färgrester",
        "claim": "Överbliven målarfärg ska lämnas till rätt insamling, även om färgen är vattenbaserad.",
        "sources": [
          {
            "title": "NSVA: Häll inte ut färg i avloppet",
            "url": "https://nsva.se/mitt-vatten/avlopp/rad-och-tips/hall-inte-ut-farg-i-avloppet/",
            "why": "NSVA arbetar med vatten och avlopp. Leta efter vad rådet säger om olika sorters färg."
          },
          {
            "title": "Kemikalieinspektionen: Din rätt att få information",
            "url": "https://www.kemi.se/rad-till-privatpersoner/rad-om-kemikalier-i-vardagen/din-ratt-att-fa-information",
            "why": "Myndigheten ger råd om kemikalier. Kontrollera vilken fråga texten faktiskt svarar på."
          }
        ],
        "steps": [
          "Öppna de två källorna. Vem har skrivit varje text och vad vill texten hjälpa läsaren med?",
          "Leta efter stöd för rådet om färgrester. Säg vilken text som svarar mest direkt på frågan.",
          "Återge stödet med egna ord. Förklara varför källan passar för just den här frågan. En källa kan vara pålitlig men ändå handla om något annat."
        ],
        "answerStarter": "Jag använder … eftersom … I texten står med mina ord att …"
      }
    },
    "lesson": {
      "opener": "Hur kan ett ämne nå en fisk utan att någon rör fisken?",
      "sections": [
        {
          "heading": "Förklara varje pil",
          "body": "Ett batteri är en möjlig källa. Om det läcker kan ämnen komma ut i marken. Vatten kan föra dem vidare. Säg vad pilen betyder: läcker, följer med vatten eller når ett djur. Olika batterier och ämnen kan bete sig olika.",
          "question": "Vilka steg behöver ske för att ett ämne ska nå ett smådjur längre ned i bäcken?"
        },
        {
          "heading": "Fara och risk",
          "body": "Fara handlar om att ett ämne kan orsaka skada. Risk handlar också om hur mycket en organism kommer i kontakt med och hur länge. Organism betyder levande varelse. Kontakten med ämnet kallas exponering. Samma ämne kan därför ge olika risk i olika situationer.",
          "question": "Vad behöver ni veta om ämnet och kontakten för att diskutera risken?"
        },
        {
          "heading": "Vissa ämnen stannar länge",
          "body": "En del ämnen bryts ned långsamt. Vissa kan samlas i organismer. När ett djur äter andra djur kan ämnen föras vidare. För vissa ämnen kan halten bli högre längre upp i näringskedjan. Det gäller inte alla ämnen. Ett fotografi kan inte visa vilken halt som finns.",
          "question": "Varför behöver vi mer information än ett foto för att bedöma ett miljöproblem?"
        },
        {
          "heading": "En åtgärd ska påverka kedjan",
          "body": "Insamling tar hand om batteriet innan det läcker i naturen. Att förebygga betyder att hindra ett problem innan det uppstår. En giftfri miljö betyder inte en miljö utan kemiska ämnen. Målet är att människor och miljö inte ska skadas. Ett läckande batteri behöver hanteras med hjälp av en vuxen.",
          "question": "Vilken del av spridningskedjan påverkas om batteriet lämnas till insamling i tid?"
        }
      ],
      "workedExample": {
        "title": "Knyt ihop miljöförklaringen",
        "steps": [
          "Om batteriet läcker kan ämnen följa regnvatten till bäcken.",
          "Organismer kan komma i kontakt med ämnena. En möjlig skada beror på ämnet, mängden och kontakten.",
          "Därför hjälper insamling: batteriet kan tas om hand innan det sprider ämnen på platsen."
        ]
      },
      "extraExamples": [
        {
          "title": "Samma ämne, olika kontakt",
          "steps": [
            "Ett djur lever nära ett utsläpp och ett annat längre bort.",
            "Ta reda på hur mycket som når varje djur och hur de kommer i kontakt med ämnet.",
            "Avståndet ensamt räcker inte för att avgöra risken. Ämnet, vattnets väg och djurens liv spelar också roll."
          ]
        },
        {
          "title": "Gå från åsikt till förklaring",
          "steps": [
            "Börja med en handling: batteriet ska lämnas till insamling.",
            "Förklara varför: om det läcker kan ämnen följa med vatten till bäcken.",
            "Knyt ihop: insamling minskar risken att ämnen sprids från just det batteriet."
          ]
        }
      ],
      "misconception": {
        "claim": "En giftfri miljö är en miljö utan kemiska ämnen.",
        "correction": "Allt omkring oss består av kemiska ämnen. Vi behöver förebygga skador från ämnen som kan vara farliga och minska skadlig kontakt med dem."
      },
      "film": {
        "title": "Följ ämnet och minska spridningen",
        "before": "Följ ämnet från färgrester till vatten. Se var spridningsvägen kan brytas.",
        "after": "Förklara en möjlig väg från källa till organism. Motivera sedan en åtgärd som minskar spridningen."
      },
      "reflectionPrompts": [
        "Förklara varje pil i ert exempel med ett verb, till exempel läcker eller följer med vatten.",
        "Vilken information behöver ni för att avgöra risken? Skilj på vad bilden visar och vad ni behöver ta reda på."
      ]
    }
  }
};

const copy = value => JSON.parse(JSON.stringify(value));

/**
 * Apply the year-seven wording without replacing the existing lesson/media
 * objects. Choice order and correct indices retain their previous meaning.
 */
export function applyYear7Content(modules, lessons) {
  for (const module of modules) {
    const authored = CONTENT[module.id];
    if (!authored) continue;
    const learning = copy(authored.learning);
    Object.assign(module, copy(authored.module));
    module.learning = learning;
    module.explanation = [
      learning.start,
      ...learning.steps.map(step => step.text + ' Exempel: ' + step.example),
    ];

    const lesson = lessons[module.id] || (lessons[module.id] = {});
    const {film, ...prose} = copy(authored.lesson);
    Object.assign(lesson, prose);
    lesson.intro = [
      learning.start,
      'Ta ett steg i taget. Förklara med orden, bilden och ett eget exempel.',
    ];
    lesson.conceptMap = learning.keyWords.map(({word, meaning}) => ({
      term: word,
      meaning,
    }));
    lesson.summary = learning.takeaway;
    Object.assign(lesson.film || (lesson.film = {}), film);
  }
  return {modules, lessons};
}

