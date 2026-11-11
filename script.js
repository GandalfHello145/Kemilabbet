import { LABS, mountSubjectLab } from './lab-router.js?v=20261111-water2';
let activeLab = null;
import { renderStudyGalleries, connectStudyGalleries } from './study-galleries.js?v=20261110-labs3';
// Authored Swedish learning content. New explanations are rendered as plain text; existing exact-match LaTeX entries remain available for unchanged text.
const modules = [
  {
    "id": 1,
    "slug": "atomer-och-molekyler",
    "title": "Atomer och molekyler",
    "shortTitle": "Atom & molekyl",
    "pages": "s. 24–26",
    "goal": "Vi kan skilja på atom, molekyl och atomslag.",
    "firstQuestion": "Är en atom och en molekyl samma sak? Skriv vad ni tror.",
    "explanation": [
      "Allt som tar plats och har massa kallas materia. Vattnet i glaset, luften omkring oss och metallen i en sked är materia. För att förklara hur ämnen är uppbyggda använder vi mycket små byggstenar: atomer. De är så små att vi behöver modeller för att visa dem. En kula i en ritning föreställer en atom; den är ingen bild tagen med en vanlig kamera.",
      "Det finns olika sorter av atomer. Vi kallar sorterna atomslag. Väte är ett atomslag och skrivs H. Syre är ett annat och skrivs O. Ett grundämne innehåller bara ett atomslag. Tänk skillnaden mellan antal och sort: fem väteatomer är fem atomer, men bara ett atomslag. Antalet protoner i atomkärnan bestämmer vilket atomslag det är.",
      "Atomer kan sitta ihop med kemiska bindningar. Två eller flera atomer som bildar en avgränsad grupp kallas en molekyl. En syrgasmolekyl består av två syreatomer som sitter ihop. Därför skriver vi O₂. Den lilla tvåan hör till O och betyder två syreatomer i varje molekyl. Två atomer som bara ligger bredvid varandra behöver däremot inte vara bundna till varandra.",
      "I en vattenmolekyl sitter två väteatomer och en syreatom ihop. Formeln är H₂O. Läs den steg för steg: H₂ ger två H-atomer; O utan en liten siffra ger en O-atom. Sammanlagt blir det tre atomer av två atomslag. Vattenmolekylen består alltså varken av två atomer eller av tre atomslag.",
      "En stor siffra framför formeln räknar hela molekyler. 2H₂O betyder två vattenmolekyler. Rita två grupper med H–O–H. Nu finns fyra väteatomer och två syreatomer, alltså sex atomer sammanlagt. Antalet atomslag är fortfarande två. Den stora tvåan ändrar antalet molekyler; den lilla tvåan berättar hur varje vattenmolekyl är byggd.",
      "Vatten är en kemisk förening eftersom olika grundämnen är kemiskt bundna till varandra. Syrgas är ett grundämne, även om atomerna sitter ihop i O₂-molekyler: där finns bara syre. Skilj därför på frågorna: Är atomer bundna i molekyler? Vilka atomslag ingår i ämnet? Alla ämnen består inte av egna små molekyler; i exempelvis koksalt bildar partiklarna ett stort nätverk."
    ],
    "figure": "assets/diagrams/01-atomer.svg",
    "figureAlt": "Modeller av vätemolekylen H₂, syremolekylen O₂ och vattenmolekylen H₂O. Bokstäver visar vilka atomslag som ingår.",
    "task": "Jämför O₂ och H₂O. Hur många atomer och hur många atomslag finns i varje molekyl? Förklara sedan skillnaden mellan en atom och en molekyl med egna ord.",
    "hint": "Räkna först alla atomkulor. Räkna sedan hur många olika bokstäver det finns.",
    "example": "O₂ har två atomer av ett atomslag: syre. H₂O har tre atomer av två atomslag: väte och syre. En atom är en byggsten. En molekyl är flera atomer som sitter ihop med kemiska bindningar. En molekyl behöver alltså inte innehålla olika atomslag.",
    "check": {
      "type": "choice",
      "question": "Vilket påstående om en vattenmolekyl, H₂O, stämmer?",
      "options": [
        "Den har två atomer av tre atomslag.",
        "Den har tre atomer av två atomslag.",
        "Den har tre atomer av tre atomslag."
      ],
      "correct": 1,
      "feedback": "H₂O betyder två H-atomer och en O-atom. Det blir tre atomer, men bara två olika atomslag."
    },
    "stretch": "Varför är vatten en kemisk förening, medan syrgas, O₂, är ett grundämne?"
  },
  {
    "id": 2,
    "slug": "atommodellens-utveckling",
    "title": "Hur atommodellen har förändrats",
    "shortTitle": "Atommodeller",
    "pages": "s. 24",
    "goal": "Vi kan beskriva hur nya upptäckter kan förändra en modell.",
    "firstQuestion": "Vad kan en kulmodell och en kärnmodell hjälpa oss att förstå om samma atom? Skriv er första tanke.",
    "explanation": [
      "En vetenskaplig modell är en förenklad beskrivning som hjälper oss att förstå något. En karta kan hjälpa oss att hitta utan att visa varje grässtrå. På liknande sätt hjälper en atommodell oss att förklara försök. Modellen är ingen vanlig bild av atomens insida. När forskare får resultat som modellen inte kan förklara behöver beskrivningen utvecklas.",
      "Dalton beskrev atomen som en liten hel kula. Senare upptäcktes elektronen, en mycket liten del med negativ laddning. Då räckte en odelad kula inte längre. I Thomsons russinkakemodell från 1904 är elektronerna russinen. Positiv laddning är utspridd som smeten i hela kakan. Modellen innehåller ingen liten positiv kärna i mitten.",
      "Geiger och Marsden undersökte, under Rutherfords ledning, vad som hände när positivt laddade alfapartiklar sköts mot en tunn guldfolie. De flesta passerade nästan rakt fram. Några böjdes av kraftigt, och mycket få vände tillbaka. Det överraskande var att en så tunn folie kunde påverka vissa partiklar så starkt.",
      "Rutherford föreslog 1911 en kärnmodell: nästan hela atomens massa och dess positiva laddning är samlade i en mycket liten kärna. Elektronerna finns i det mycket större området runt kärnan. En positiv alfapartikel som kommer nära den positiva kärnan stöts bort kraftigt. Eftersom kärnan tar upp en mycket liten del av atomens volym passerar de flesta partiklar utan en stor avböjning.",
      "När kärnmodellen ritas som ett litet solsystem får kärnan likna solen och elektronerna planeter omkring den. Liknelsen hjälper oss att se en central kärna och ett stort område runt omkring. Men elektroner är inte små planeter som följer de ritade cirklarna. I en atom verkar elektriska krafter mellan laddningar; i solsystemet håller gravitationen planeterna kvar. Använd liknelsen för placeringen, inte som en exakt beskrivning av elektronernas rörelse.",
      "Bohr utvecklade modellen 1913 genom att beskriva bestämda energinivåer för elektronen i väte. I skolan ritar vi sådana nivåer som elektronskal. Ett skal är ingen hård vägg runt atomen. Det hjälper oss att ordna elektronerna efter deras energi. De bestämda energinivåerna är ett tillägg till Rutherfords kärnmodell; enbart en kärna med elektroner omkring förklarar inte hela atomen.",
      "I dagens modell används elektronmoln för att visa var det är störst chans att hitta elektroner. Tätare moln betyder större sannolikhet att hitta en elektron där. Det är ingen dimma av pyttesmå elektroner och ingen bestämd planetbana. Många prickar kan visa möjliga lägen för samma elektron. Kärnmodell, skalmodell och elektronmoln hjälper oss därmed att svara på olika frågor om samma atom."
    ],
    "figure": "assets/diagrams/02-modeller.svg",
    "figureAlt": "Atommodellens utveckling: Daltons hela kula, Thomsons russinkaka med utspridd positiv laddning, Rutherfords kärna, Bohrs energinivåer och ett elektronmoln.",
    "task": "Jämför Thomsons russinkakemodell med Rutherfords kärnmodell. Var finns den positiva laddningen i varje modell? Förklara varför nya undersökningar kan göra att forskare ändrar en modell.",
    "hint": "I russinkakemodellen finns positiv laddning utspridd i hela den positiva delen. I kärnmodellen är den samlad i en mycket liten kärna.",
    "example": "I Thomsons modell motsvarar russinen negativa elektroner och kakan en utspridd positiv laddning. Där finns ingen liten central kärna. I Rutherfords modell är den positiva laddningen i stället koncentrerad till en mycket liten kärna. Modellen behövde ändras eftersom spridningsförsök visade stora avböjningar som den utspridda positiva laddningen inte kunde förklara.",
    "check": {
      "type": "choice",
      "question": "Varför kan en vetenskaplig modell behöva förändras?",
      "options": [
        "Nya undersökningar ger kunskap som modellen behöver förklara.",
        "En äldre modell måste alltid vara helt oanvändbar.",
        "Atomer ändrar sin uppbyggnad när vi upptäcker något nytt."
      ],
      "correct": 0,
      "feedback": "Det är vår kunskap och beskrivning som utvecklas. Atomerna förändras inte för att vi får ny kunskap om dem."
    },
    "stretch": "Använd russinkakan för att förklara var elektronerna och den positiva laddningen finns i Thomsons modell. Vad förändras i Rutherfords modell?"
  },
  {
    "id": 3,
    "slug": "elektroner-och-reaktioner",
    "title": "Elektroner och kemiska reaktioner",
    "shortTitle": "Elektroner",
    "pages": "Provpunkt 3",
    "goal": "Vi kan förklara varför elektroner är viktiga när atomer binds ihop.",
    "firstQuestion": "Vad tror ni kan förändras när atomer binds ihop: elektronerna, atomkärnorna eller båda?",
    "explanation": [
      "En atom innehåller en kärna och elektroner omkring den. I kärnan finns positivt laddade protoner och, i de flesta atomer, oladdade neutroner. Elektronerna är negativt laddade. Olika laddningar dras till varandra, medan lika laddningar stöter bort varandra. Elektronernas negativa laddning och kärnans positiva laddning är därför viktiga för hur atomer hålls samman och binds till varandra.",
      "En neutral atom har lika många elektroner som protoner. Tänk på en väteatom med en proton och en elektron: ett plus och ett minus tar ut varandra. Neutral betyder att laddningarna tillsammans blir noll, inte att det saknas laddade delar. Protonerna bestämmer atomslaget. Elektronerna är särskilt viktiga när atomer bildar bindningar.",
      "Följ två väteatomer. Tillsammans har de två positiva kärnor och två negativa elektroner. När de bildar en vätemolekyl, H₂, delar de två elektronerna ett gemensamt område mellan kärnorna. Vi beskriver det som ett gemensamt elektronpar. De negativa elektronerna dras till båda kärnorna och bidrar till att hålla ihop molekylen. Bindningen kallas elektronparbindning.",
      "Elektronerna är inte ett snöre mellan atomerna. Kulor, prickar och streck hjälper oss att räkna delar och visa bindningar. I modellen av H₂ ska ni kunna följa samma två kärnor och samma två elektroner före och efter. När bindningen bildas har delarna ordnats på ett nytt sätt; inga väteatomer har försvunnit eller blivit ett annat grundämne.",
      "Atomer kan också lämna ifrån sig eller ta upp elektroner. Då bildas joner, som är laddade partiklar. En natriumatom med elva protoner och elva elektroner är neutral. Om den lämnar ifrån sig en elektron finns elva plus men tio minus: jonen blir positiv och skrivs Na⁺. En kloratom som tar upp en elektron blir en negativ kloridjon, Cl⁻. Motsatta laddningar dras till varandra i koksalt.",
      "Vid vanliga kemiska reaktioner bryts bindningar och nya bindningar bildas. Det är särskilt de yttersta elektronerna som deltar. Atomkärnorna finns kvar, så antalet atomer av varje atomslag bevaras. Det kan bildas ämnen med helt andra egenskaper när atomerna binds på nya sätt. Förklara därför både vad som ändras, bindningarna, och vad som finns kvar, atomslagen."
    ],
    "figure": "assets/diagrams/03-elektroner.svg",
    "figureAlt": "Två väteatomer delar ett elektronpar och bildar H₂. Bilden följer båda kärnorna och båda elektronerna genom bindningens bildning.",
    "task": "Använd bilden av H₂. Förklara vad elektronerna gör när två väteatomer binds ihop. Förklara också vad som händer med de två atomkärnorna.",
    "hint": "Ett gemensamt elektronpar betyder att två elektroner delas. Räkna kärnorna före och efter.",
    "example": "När två väteatomer binds ihop kan de dela ett elektronpar. Elektronerna är då en del av bindningen mellan atomerna. De två kärnorna finns kvar och är fortfarande vätekärnor. Vid vanliga kemiska reaktioner kan bindningar förändras, men atomerna byter inte grundämne.",
    "check": {
      "type": "choice",
      "question": "Vad stämmer vid en vanlig kemisk reaktion?",
      "options": [
        "Protoner flyttar mellan atomkärnorna och skapar nya grundämnen.",
        "Atomerna försvinner och ersätts av helt nya atomer.",
        "Elektroner och bindningar kan ordnas om, medan atomkärnorna finns kvar."
      ],
      "correct": 2,
      "feedback": "Vanliga kemiska reaktioner handlar om elektroner och bindningar. Förändringar av atomkärnor hör till kärnreaktioner."
    },
    "stretch": "H₂ är en molekyl men ingen kemisk förening. Vilket atomslag skulle behöva tillkomma för att ett nytt ämne ska kunna vara en kemisk förening? Ge ett exempel."
  },
  {
    "id": 4,
    "slug": "kemisk-eller-fysikalisk",
    "title": "Kemisk eller fysikalisk förändring?",
    "shortTitle": "Förändringar",
    "pages": "s. 33–34",
    "goal": "Vi kan avgöra om en förändring bildar nya ämnen.",
    "firstQuestion": "Is smälter och järn rostar. Är det samma slags förändring? Skriv er första tanke.",
    "explanation": [
      "En isbit smälter och en cykelkedja rostar. Båda förändras, men förändringarna är av olika slag. Den viktigaste frågan är: bildas nya ämnen? Börja med ämnena före förändringen och jämför med ämnena efter. Att något ändrar färg, form eller temperatur räcker inte ensamt för att avgöra svaret.",
      "När is smälter blir fast vatten till flytande vatten. Molekylerna kan röra sig förbi varandra, men varje molekyl är fortfarande H₂O. Ämnet är vatten både före och efter. Det är en fysikalisk förändring. Samma sak gäller när vatten kokar och övergår till gas: vattenmolekylerna finns kvar som vattenånga.",
      "En fysikalisk förändring kan också ändra formen eller storleken på ett föremål. Ett papper kan rivas i bitar och en metalltråd kan böjas utan att nya ämnen bildas genom just rivningen eller böjningen. En förändring behöver alltså inte vara lätt att göra ogjord för att vara fysikalisk. Avgör genom ämnena, inte genom om det är enkelt att återställa föremålet.",
      "När järn rostar reagerar järnet med sin omgivning. Syre och fukt behövs för vanlig rostbildning. Rost innehåller järnföreningar med andra egenskaper än metallen järn. Nya ämnen har bildats, så förändringen är kemisk. Järnatomerna finns kvar men ingår nu i andra ämnen. En kemisk förändring kallas också en kemisk reaktion.",
      "När ved brinner reagerar ämnen i veden med syre. Det bildas bland annat koldioxid och vatten, och energi överförs till omgivningen som värme och ljus. En del av produkterna är gaser som blandas med luften. Att askan väger mindre än veden betyder därför inte att atomer har försvunnit. För att följa allt behöver vi räkna med både veden, syret och alla produkter.",
      "Bubblor, ny färg och värme kan vara ledtrådar till en kemisk reaktion. Men kokande vatten bubblar också, trots att ämnet är oförändrat. Ett tydligt svar behöver därför en motivering: ”Is som smälter är en fysikalisk förändring eftersom vatten fortfarande är vatten.” Jämför med: ”Järn som rostar förändras kemiskt eftersom nya järnföreningar bildas.”"
    ],
    "figure": "assets/diagrams/04-forandringar.svg",
    "figureAlt": "Jämförelse mellan smältande is, där vatten förblir vatten, och rostande järn, där ett nytt ämne bildas.",
    "task": "Sortera is som smälter, järn som rostar, vatten som kokar och ved som brinner. Välj sedan ett exempel ur varje grupp och förklara med orden nytt ämne.",
    "hint": "Aggregationstillstånd beskriver fast form, vätska och gas. Ett nytt tillstånd behöver inte betyda ett nytt ämne.",
    "example": "Is som smälter och vatten som kokar är fysikaliska förändringar: ämnet är fortfarande vatten. Järn som rostar och ved som brinner är kemiska förändringar: nya ämnen bildas. Den viktigaste skillnaden är alltså inte om förändringen syns tydligt, utan om nya ämnen bildas.",
    "check": {
      "type": "choice",
      "question": "Varför är kokande vatten ett exempel på en fysikalisk förändring?",
      "options": [
        "Vattnet är fortfarande vatten, men en del övergår till gas.",
        "Vattenmolekylerna delas upp i väte och syre.",
        "Alla förändringar som kräver värme är fysikaliska."
      ],
      "correct": 0,
      "feedback": "Vid kokning finns vattenmolekylerna kvar. Vatten övergår från vätska till gas; det bildas inte väte och syre."
    },
    "stretch": "Kan uppvärmning orsaka både en fysikalisk och en kemisk förändring? Ge två olika exempel."
  },
  {
    "id": 5,
    "slug": "amnens-egenskaper",
    "title": "Olika ämnen har olika egenskaper",
    "shortTitle": "Egenskaper",
    "pages": "s. 35–39",
    "goal": "Vi kan använda egenskaper för att jämföra ämnen och välja material.",
    "firstQuestion": "Två ämnen har samma färg. Måste det vara samma ämne? Förklara er tanke.",
    "explanation": [
      "Varför använder vi metall till en kastrulls botten men ofta ett annat material till handtaget? Delarna har olika uppgifter. Botten ska föra värme till maten, medan handtaget ska gå att hålla i. Ett material väljs därför efter sina egenskaper, alltså hur det är och beter sig.",
      "Exempel på egenskaper är hårdhet, löslighet, smältpunkt, densitet och förmågan att leda värme eller elektricitet. Löslighet beskriver hur mycket av ett ämne som kan lösas i till exempel vatten vid en viss temperatur. Smältpunkten är temperaturen där ett fast ämne övergår till vätska. Samma ämne kan ha flera användbara egenskaper samtidigt.",
      "Densitet betyder massa per volym. Jämför två lika stora klossar: om den ena har större massa, har dess material högre densitet. En liten järnbit kan samtidigt väga mindre än en stor träbit. Därför räcker det inte att säga att ”det tyngsta föremålet har högst densitet”. Vi behöver jämföra samma volym eller räkna massa delat med volym.",
      "Egenskaper kan hjälpa oss att skilja ämnen åt. Om ett prov är antingen järn eller koppar kan en vanlig magnet ge svar: järn dras tydligt till magneten, koppar gör det inte. Ett test av elektrisk ledningsförmåga hjälper mindre just här, eftersom båda leder elektricitet. Välj ett test där de möjliga ämnena ger olika resultat.",
      "En bra jämförelse ska vara rättvis. Om ni undersöker löslighet behöver ni till exempel hålla mängden vatten och temperaturen lika och jämföra tydligt bestämda mängder ämne. Annars kan skillnaden bero på hur testet gjordes. Två vita pulver behöver inte vara samma ämne. Undersök kända prov enligt instruktionerna och smaka aldrig på okända ämnen.",
      "Koppla alltid materialvalet till följden. Kastrullens botten behöver leda värme bra så att energi överförs till maten. Handtaget bör överföra värme långsammare till handen och dessutom tåla temperaturen och belastningen. Koppartråd i en elkabel leder ström; plasten runt tråden isolerar. Olika material samarbetar när delarna ska göra olika saker."
    ],
    "figure": "assets/diagrams/05-egenskaper.svg",
    "figureAlt": "Kastrullens botten leder värme till maten, medan handtaget överför värme långsammare till handen. Ritningen jämför värmespridning i koppar och trä.",
    "task": "Ni ska välja material till en kastrulls botten och till dess handtag. Vilken egenskap är viktig för botten och vilken för handtaget? Förklara varför.",
    "hint": "Värmen ska lätt nå maten genom botten. Vad vill ni ska hända med värmen på vägen till handen?",
    "example": "Kastrullens botten behöver leda värme bra så att maten kan värmas effektivt. Handtaget behöver leda värme dåligt så att handen inte lika lätt blir varm. Materialen behöver också tåla temperaturen där de används. Olika delar kan därför behöva material med olika egenskaper.",
    "check": {
      "type": "choice",
      "question": "Ni vet att ett prov är antingen järn eller koppar. Vilken undersökning kan skilja dem åt?",
      "options": [
        "Bara kontrollera om provet leder elektricitet: båda är metaller.",
        "Undersöka om provet dras tydligt till en vanlig magnet: järn gör det, koppar gör det inte.",
        "Smaka på provet för att känna igen metallen."
      ],
      "correct": 1,
      "feedback": "Järn dras tydligt till en vanlig magnet, medan koppar inte gör det. Båda leder elektricitet, så just det testet skiljer inte dessa två åt. Smaka aldrig på okända prov."
    },
    "stretch": "Varför räcker det inte alltid att ett material är bra på att leda värme? Nämn en annan egenskap som kan vara viktig i en kastrull."
  },
  {
    "id": 6,
    "slug": "varme-och-fasforandringar",
    "title": "Värme, rörelse och fasförändringar",
    "shortTitle": "Värme & faser",
    "pages": "s. 36–37",
    "goal": "Vi kan beskriva vatten som is, vätska och gas med en partikelmodell.",
    "firstQuestion": "När vatten blir vattenånga: försvinner vattenmolekylerna, ändras de eller händer något annat?",
    "explanation": [
      "Is, flytande vatten och vattenånga är samma ämne i olika aggregationstillstånd: fast form, vätska och gas. Alla tre består av vattenmolekyler, H₂O. Varje molekyl har två väteatomer och en syreatom. När vattnet byter tillstånd är det framför allt ordningen, avstånden och rörelsen mellan molekylerna som ändras.",
      "I is har molekylerna bestämda platser omkring vilka de vibrerar, alltså rör sig fram och tillbaka. Därför behåller isbiten sin form. Molekylerna ligger i en öppen struktur. När isen smälter kan molekylerna röra sig förbi varandra och vatten kan rinna. De kemiska bindningarna mellan atomerna i varje H₂O-molekyl bryts inte sönder när isen smälter.",
      "Vatten är speciellt: dess öppna struktur i is gör att samma massa tar större plats som is än som flytande vatten. Is har därför lägre densitet och flyter. I många andra ämnen ligger partiklarna tätast i fast form. Använd alltså vattnets modell för att förklara vatten och tänk inte att alla fasta ämnen alltid är glesare än sina vätskor.",
      "När vatten övergår till gas ökar avstånden mellan molekylerna kraftigt. De rör sig fritt mellan kollisionerna och sprids i det tillgängliga utrymmet. Molekylerna själva har inte svällt, blivit luft eller delats upp i väte och syre. Vattenånga är osynlig. Det vita molnet nära en kokande kastrull består av små vattendroppar som bildats när vattenånga har kylts.",
      "Smältning är fast form till vätska och stelning är vätska till fast form. Förångning är vätska till gas; kondensation är gas till vätska. Avdunstning sker vid vätskans yta även under kokpunkten. Därför kan en våt tröja torka i ett rum. Vid kokning bildas gasbubblor inne i vätskan. Rent vatten kokar vid ungefär 100 °C vid normalt lufttryck.",
      "Vid uppvärmning överförs energi till vattnet. När temperaturen stiger rör sig molekylerna mer i genomsnitt. Under smältning eller kokning kan energin i stället ändra hur molekylerna hålls ihop med sina grannar, medan temperaturen är oförändrad för rent vatten vid konstant tryck. När vattenånga kondenserar lämnas energi till omgivningen. Följ alltid både vattnets tillstånd och vart energin tar vägen."
    ],
    "figure": "assets/diagrams/06-faser.svg",
    "figureAlt": "Samma antal vattenmolekyler i isens öppna struktur, tätare i flytande vatten och mycket glest i vattenånga. Pilar visar partiklarnas rörelse.",
    "task": "Jämför modellerna av is, flytande vatten och vattenånga. Vad förändras i molekylernas placering och rörelse? Vad är oförändrat hos själva vattenmolekylerna?",
    "hint": "Titta på avstånden och rörelsepilarna. Varje vattenmolekyl har fortfarande två H och ett O.",
    "example": "I is vibrerar vattenmolekylerna i en öppen, ordnad struktur. I flytande vatten ligger de närmare varandra och kan röra sig förbi varandra. I vattenånga är avstånden mycket större. Själva molekylerna är fortfarande H₂O; de har varken blivit större, försvunnit eller delats upp i andra ämnen.",
    "check": {
      "type": "choice",
      "question": "Vad händer med vattenmolekylerna när flytande vatten förångas?",
      "options": [
        "Varje molekyl sväller och blir större.",
        "De delas upp till väte och syre.",
        "De är fortfarande H₂O, men befinner sig mycket längre ifrån varandra."
      ],
      "correct": 2,
      "feedback": "Avstånden mellan molekylerna ökar kraftigt i gas. Det är fortfarande vattenmolekyler, H₂O."
    },
    "stretch": "Varför kan is flyta på vatten trots att is är vatten i fast form? Använd bilden och ordet densitet."
  },
  {
    "id": 7,
    "slug": "giftfri-miljo",
    "title": "Varför strävar vi efter en giftfri miljö?",
    "shortTitle": "Giftfri miljö",
    "pages": "s. 28–29",
    "goal": "Vi kan beskriva hur skadliga ämnen kan spridas och hur vi kan minska spridningen.",
    "firstQuestion": "Ett gammalt batteri ligger vid en bäck. Spelar det någon roll om ingen människa rör batteriet?",
    "explanation": [
      "En giftfri miljö betyder att vi vill skydda människor, djur och växter från skadlig påverkan av farliga ämnen. Det betyder inte en miljö utan kemi. Vatten, syre, trä och våra kroppar består av kemiska ämnen. För att förstå ett miljöproblem behöver vi veta vilket ämne det gäller, hur det kan spridas och vilka organismer som utsätts.",
      "Tänk er ett skadat batteri som ligger vid en bäck. Om det läcker kan ämnen komma ut i marken. Regn kan lösa upp eller föra med sig en del av dem, och rinnande vatten kan transportera dem till bäcken. Det händer inte på exakt samma sätt med alla batterier eller ämnen. Därför beskriver vi en möjlig spridningsväg: batteri → mark → vatten.",
      "En organism är en levande varelse, till exempel en växt, ett smådjur eller en fisk. Organismer kan komma i kontakt med ämnen genom vatten, luft eller föda. Den kontakten kallas exponering. Ett smådjur i bäcken kan exempelvis utsättas genom vattnet det lever i. Vissa ämnen kan också tas upp i kroppen. Att ett ämne finns på en plats berättar inte ensamt hur mycket en organism får i sig.",
      "Skilj på fara och risk. Fara handlar om att ett ämne kan orsaka skada. Risken beror också på hur mycket en organism utsätts för, på vilket sätt och under hur lång tid. Två organismer kan utsättas olika mycket även i samma miljö. Naturligt betyder inte automatiskt ofarligt, och ett ämnes namn räcker inte för att avgöra hela risken.",
      "Vissa farliga ämnen bryts ned långsamt och kan finnas kvar länge. En del kan samlas i organismer och föras vidare när ett djur äter ett annat. Om organismer skadas kan det också påverka andra delar av ett ekosystem, alltså de levande varelserna och deras omgivning. Men alla ämnen samlas inte i näringskedjor på samma sätt. Följ det aktuella ämnet och förklara vad som kan hända steg för steg.",
      "Den bästa åtgärden kan vara att hindra spridningen redan vid källan. Batterier ska lämnas till batteriinsamling, där de kan tas om hand. De ska inte lämnas i naturen eller kastas i vanliga sopor. Rör inte innehållet i ett läckande batteri; be en vuxen hjälpa till. Insamling gör att ämnen och material kan hanteras och minskar risken att just batteriet läcker i mark och vatten.",
      "Bygg ett utvecklat svar med kedjan källa → spridningsväg → organism → möjlig följd → åtgärd. Till exempel: ”Om ett skadat batteri läcker kan ämnen följa med regnvatten till bäcken. Där kan smådjur utsättas och skadas, beroende på ämnet och mängden. Därför lämnar vi batterier till insamling innan de hamnar i naturen.” Orden om, kan och därför visar både villkor och samband."
    ],
    "figure": "assets/environment/giftfri-miljo-scenarier.webp?v=20261110-labs3",
    "figureAlt": "Fyra scenarier med målarfärg visar hur regn kan föra ett spill till en bäck, hur ett lock och ett tråg fångar spill, hur färgrester lämnas till insamling och hur etikettläsning och rätt mängd kan minska rester.",
    "task": "Beskriv en möjlig väg från ett läckande batteri till en levande organism. Förklara en möjlig konsekvens och vad personen borde göra med batteriet i stället.",
    "hint": "Använd sambandsorden först, sedan och därför. Tänk på vatten, mark och hur organismer får i sig ämnen.",
    "example": "Om ett skadat batteri läcker kan ämnen först komma ut i marken och sedan följa med vatten till bäcken. Organismer kan utsättas för ämnena och vissa kan skadas. Konsekvensen beror på vilka ämnen och mängder det gäller. Batteriet ska därför lämnas till batteriinsamling.",
    "check": {
      "type": "choice",
      "question": "Vilket påstående är bäst?",
      "options": [
        "Ett ämne är alltid ofarligt om det kommer från naturen.",
        "Risken beror bland annat på ämnet, mängden och hur organismer utsätts för det.",
        "Batterier kan lämnas i naturen om ingen människa rör dem."
      ],
      "correct": 1,
      "feedback": "Ämnets egenskaper, mängden och exponeringen spelar roll. Naturligt betyder inte automatiskt ofarligt, och ämnen kan spridas utan att en människa rör vid dem."
    },
    "stretch": "Hur hänger kemi och biologi ihop i ert exempel? Beskriv både ett ämne som sprids och en levande organism som kan påverkas."
  }
];

// Authored Swedish learning content. New explanations are rendered as plain text; existing exact-match LaTeX entries remain available for unchanged text.
const lessons = {
  "1": {
    "opener": "Hur många atomer gömmer sig i en enda vattenmolekyl?",
    "intro": [
      "Vatten i ett glas går att se och hälla. En vattenmolekyl är mycket mindre. Vi använder en ritning för att undersöka vilka atomer som sitter ihop i den. Samma molekyl kan visas både med kulor och med formeln H₂O.",
      "Här behöver ni hålla isär två frågor: hur många atomer finns, och vilka sorter finns? Räkna gärna alla kulor först. Läs sedan bokstäverna. Säg svaret högt och peka på de delar ni menar."
    ],
    "sections": [
      {
        "heading": "En atom är en byggsten; atomslag är sorten",
        "body": "Tänk er fyra H-atomer på ett bord. Ni har fyra byggstenar, men alla är av samma sort: väte. Om ni lägger dit en O-atom har ni fem atomer av två atomslag. Syre och väte är olika grundämnen. Varje grundämne har sitt eget atomslag. Det bestäms av antalet protoner i atomkärnan: väte har en proton och syre har åtta. Därför kan vi följa en väteatom även när den sitter ihop med andra atomer. Ordet atom talar om en byggsten. Ordet atomslag talar om vilken sorts byggsten det är.",
        "question": "Fyra H-atomer och två O-atomer ligger var för sig. Hur många atomer finns, och hur många atomslag?"
      },
      {
        "heading": "Läs en liten siffra i taget",
        "body": "H₂O läser vi som två väteatomer och en syreatom. Den lilla tvåan hör till H precis framför siffran. Vid O saknas en liten siffra; det betyder en O-atom. Sammanlagt blir det tre atomer. De sitter ihop med kemiska bindningar och bildar en vattenmolekyl. Jämför med O₂: där sitter två syreatomer ihop i en syrgasmolekyl. En stor siffra framför en formel har en annan uppgift. 2H₂O betyder två hela vattenmolekyler. Då finns fyra H-atomer och två O-atomer, alltså sex atomer av två atomslag.",
        "question": "Vilken skillnad finns mellan den stora tvåan i 2H₂O och den lilla tvåan i H₂O?"
      },
      {
        "heading": "Molekyl och kemisk förening",
        "body": "O₂ är en molekyl eftersom två atomer sitter ihop. Syrgas är samtidigt ett grundämne eftersom alla atomer är syre. H₂O är också en molekyl, men vatten är en kemisk förening: det innehåller olika grundämnen som är kemiskt bundna till varandra. Orden svarar alltså på olika frågor. Molekyl beskriver en grupp bundna atomer. Kemisk förening beskriver vilka grundämnen ett ämne innehåller. Alla ämnen består inte av avgränsade molekyler. I en metall sitter många atomer samman, och vanligt koksalt har ett stort nätverk av laddade partiklar. På den här sidan börjar vi med molekylerna O₂ och H₂O.",
        "question": "Förklara varför O₂ är en molekyl men inte en kemisk förening."
      },
      {
        "heading": "Atomslag ändras inte när ni räknar fler grupper",
        "body": "Tänk er tre O₂-molekyler. Varje molekyl innehåller två syreatomer. Tre gånger två ger sex atomer sammanlagt. Alla sex är syre, så det finns fortfarande bara ett atomslag. Gör sedan samma sak med tre H₂O-molekyler: sex H och tre O ger nio atomer av två atomslag. Säg alltid vad talet räknar: atomer, molekyler eller atomslag. Då går det att följa förklaringen.",
        "question": "Hur många molekyler, atomer och atomslag finns i 3O₂?"
      }
    ],
    "conceptMap": [
      {
        "term": "Atom",
        "meaning": "En mycket liten byggsten. En H-atom är en väteatom."
      },
      {
        "term": "Molekyl",
        "meaning": "Två eller flera atomer som sitter ihop med kemiska bindningar."
      },
      {
        "term": "Kemisk förening",
        "meaning": "Ett ämne som innehåller olika grundämnen kemiskt bundna till varandra."
      },
      {
        "term": "Atomslag och grundämne",
        "meaning": "Atomslag är sorten av atom, bestämd av antalet protoner. Ett grundämne innehåller bara ett atomslag."
      }
    ],
    "workedExample": {
      "title": "Läs H₂O i tre steg",
      "steps": [
        "Läs bokstäverna: H betyder väte och O betyder syre. Vattenmolekylen innehåller alltså två olika atomslag.",
        "Läs antalet: den lilla tvåan gäller H. Det finns två väteatomer och en syreatom i varje molekyl.",
        "Lägg ihop: två plus en ger tre atomer. Svaret blir en molekyl med tre atomer av två atomslag. Visa samtidigt vilka atomer ni räknar i bilden."
      ]
    },
    "misconception": {
      "claim": "”En molekyl måste innehålla olika atomslag.”",
      "correction": "En molekyl kan bestå av samma atomslag, som O₂, eller olika atomslag, som H₂O. För att ämnet ska vara en kemisk förening krävs olika grundämnen kemiskt bundna till varandra."
    },
    "film": {
      "src": "assets/films/v3/01-atomer.mp4?v=20261110-labs3",
      "poster": "assets/posters/v3/01-atomer.jpg",
      "title": "Atomer och molekyler: följ byggstenarna",
      "before": "Följ en vattenmolekyl. Lägg märke till vilka delar som räknas när filmen visar atomer, atomslag och molekyler.",
      "after": "Pausa vid H₂O och 2H₂O. Räkna högt tillsammans och förklara vad varje tvåa betyder."
    },
    "summary": "Jag kan skilja på atom, atomslag och molekyl. H₂O är en molekyl med tre atomer av två atomslag: väte och syre.",
    "extraExamples": [
      {
        "title": "Två vattenmolekyler: vad betyder 2H₂O?",
        "steps": [
          "Den stora tvåan framför H₂O talar om att vi följer två hela vattenmolekyler. Rita först två likadana grupper.",
          "Varje grupp har två H och en O. Två grupper innehåller därför fyra H-atomer och två O-atomer: sex atomer sammanlagt.",
          "Antalet atomslag är fortfarande två, väte och syre. Fler molekyler ger fler atomer, samtidigt som sorterna är desamma. Jämför den stora tvåans uppgift med den lilla tvåans."
        ]
      },
      {
        "title": "Tre atomer kan bilda olika ämnen",
        "steps": [
          "Skriv H₂O och CO₂ bredvid varandra. I båda formlerna blir summan tre atomer per molekyl.",
          "Vatten har två väteatomer och en syreatom. Koldioxid har en kolatom, C, och två syreatomer. Båda innehåller två atomslag, men kombinationerna skiljer sig åt.",
          "Dra slutsatsen: antalet atomer räcker bara till en del av beskrivningen. För att känna igen uppbyggnaden behöver ni också ange atomslagen och hur många atomer det finns av varje slag."
        ]
      }
    ],
    "reflectionPrompts": [
      "En kamrat säger: ”Två vattenmolekyler innehåller fyra atomslag.” Visa med en ritning hur ni kan hjälpa kamraten att räkna sorterna.",
      "Byt roller. Låt en av er beskriva en molekyl med ord och låt den andra skriva formeln och kontrollera antalet atomer."
    ]
  },
  "2": {
    "opener": "Hur blev en russinkaka till en kärna med elektroner omkring?",
    "intro": [
      "En atommodell ska hjälpa oss att förklara det forskarna mäter. Börja med russinkakans utspridda positiva laddning och följ sedan guldfolieförsöket. Vad visar de nästan raka banorna? Vad kräver en förklaring när några partiklar böjs av kraftigt?",
      "Jämför därefter kärnmodellen, solsystemsliknelsen, Bohrs skal och elektronmolnet. Lägg märke till vilken fråga varje bild besvarar. Ingen av bilderna är en vanlig film av en elektron på väg runt kärnan."
    ],
    "sections": [
      {
        "heading": "Från en hel kula till en russinkaka",
        "body": "Dalton beskrev atomen som en liten hel kula. När elektronen upptäcktes behövde forskarna också beskriva mindre delar inuti atomen. Elektroner har negativ laddning. En neutral atom har lika mycket positiv som negativ laddning, så modellen behövde innehålla båda. I Thomsons modell från 1904 var den positiva laddningen utspridd genom atomen. Det fanns negativa elektroner inuti den positiva delen. Därför liknar modellen en russinkaka: negativa elektroner är russinen och positiv laddning är smeten. Smeten hör till hela kakan. Den är alltså utspridd, medan russinen finns på flera platser i den.",
        "question": "Peka på ett russin och på smeten. Vilken laddning motsvarar varje del?"
      },
      {
        "heading": "Ett försök som överraskade forskarna",
        "body": "Positivt laddade alfapartiklar sköts mot en mycket tunn guldfolie. Alfapartiklar är små partiklar som kan användas för att undersöka materia. De flesta fortsatte nästan rakt fram. Några böjdes av kraftigt, och enstaka vände tillbaka. Positiva laddningar stöter bort varandra. Rutherford föreslog 1911 att atomens positiva laddning var samlad i en liten kärna. En partikel nära kärnan kunde då påverkas starkt. De flesta partiklar passerade genom det mycket större området runt kärnorna. Modellen kunde därmed förklara både de många nästan raka banorna och de få kraftiga avböjningarna.",
        "question": "Hur hjälper en liten positiv kärna oss att förklara de kraftiga avböjningarna?"
      },
      {
        "heading": "Skal och moln hjälper oss med olika frågor",
        "body": "Bohr beskrev 1913 bestämda energinivåer för elektronen i väte. Det kan liknas vid trappsteg: elektronen kan ha vissa energier, inte alla energier däremellan. Vi ritar nivåerna som skal, men skalen är inga väggar och trappan är bara en liknelse för bestämda nivåer. Elektronen kan ta upp energi och övergå till en högre nivå. När den övergår till en lägre nivå kan atomen avge ljus. I dagens modell visar elektronmolnet i vilka områden det är störst chans att hitta en elektron. Många prickar kan beskriva möjliga lägen för samma elektron. Ett tätare moln betyder större chans att hitta den där, inte att den är större eller att fler elektroner måste finnas i atomen.",
        "question": "Vad berättar ett tätare område i elektronmolnet?"
      },
      {
        "heading": "Solsystemsliknelsen: vad hjälper den oss att se?",
        "body": "Rita en liten kärna i mitten och elektroner i området omkring. Det liknar solsystemets sol och planeter, men likheten gäller framför allt att en central del omges av ett mycket större område. Protoner och elektroner har elektrisk laddning; planeterna hålls i sina banor av gravitation. Bohrs bestämda energinivåer är ytterligare en idé, inte något som guldfolieförsöket i sig visade. I dagens beskrivning använder vi elektronmoln i stället för bestämda planetbanor. När ni visar en bild, säg därför också vad den ska hjälpa er att förklara: kärnans placering, elektronernas energi eller möjliga lägen.",
        "question": "Nämn en användbar likhet med solsystemet och en viktig skillnad."
      }
    ],
    "conceptMap": [
      {
        "term": "Modell",
        "meaning": "En beskrivning som hjälper oss att förstå och förklara resultat från undersökningar."
      },
      {
        "term": "Atomkärna",
        "meaning": "Den lilla delen i atomens centrum där positiv laddning och nästan hela massan finns."
      },
      {
        "term": "Elektronmoln",
        "meaning": "En bild av var elektroner kan finnas. Tätare moln betyder större chans att hitta en elektron där."
      },
      {
        "term": "Elektronskal",
        "meaning": "Ett sätt att ordna elektroner efter bestämda energinivåer. Skalet är ingen hård vägg."
      },
      {
        "term": "Sannolikhet",
        "meaning": "Hur stor chans det är att något händer, till exempel att en elektron hittas i ett visst område."
      }
    ],
    "workedExample": {
      "title": "Jämför var den positiva laddningen finns",
      "steps": [
        "Börja med Thomson: markera kakans sammanhängande del. Den motsvarar positiv laddning utspridd genom modellen. Markera russinen som negativa elektroner.",
        "Gå till Rutherford: samla den positiva laddningen i en liten kärna och placera elektroner i området omkring. Beskriv vad som ändrats i laddningens fördelning.",
        "Knyt till försöket: en alfapartikel som kommer nära den koncentrerade positiva laddningen kan böjas av kraftigt. Förklara både modellens förändring och vilket resultat den hjälper oss att förstå."
      ]
    },
    "misconception": {
      "claim": "”I Thomsons russinkaka finns en positiv atomkärna i mitten.”",
      "correction": "I Thomsons modell är den positiva laddningen utspridd genom atomen. En liten central kärna med samlad positiv laddning är den avgörande förändringen i Rutherfords modell."
    },
    "film": {
      "src": "assets/films/v3/02-modeller.mp4?v=20261110-labs3",
      "poster": "assets/posters/v3/02-modeller.jpg",
      "title": "Atommodeller: från guldfolie till elektronmoln",
      "before": "Följ hur försöken förändrar atommodellen. Jämför sedan kärna och elektroner med solen och planeterna.",
      "after": "Pausa vid solsystemsliknelsen. Vad hjälper den oss att förstå? Varför kan elektroner ändå inte beskrivas som små planeter i bestämda banor?"
    },
    "summary": "Jag kan förklara hur försöksresultat ledde från utspridd positiv laddning till en liten positiv kärna. Solsystemet är en liknelse för placeringen. Bohr tillför bestämda energinivåer, medan elektronmolnet visar var det är störst chans att hitta elektroner.",
    "extraExamples": [
      {
        "title": "Två observationer kräver två delar av förklaringen",
        "steps": [
          "Observation ett: de flesta alfapartiklar passerar folien. Använd modellen för att visa det stora området omkring den lilla kärnan.",
          "Observation två: några partiklar ändrar riktning kraftigt. Följ en bana nära kärnan och använd att positiva laddningar stöter bort varandra.",
          "Sätt ihop meningarna: modellen behöver rymma både många nästan raka banor och några kraftigt avböjda banor. Ett bra resonemang kopplar tydligt en observation till en förklaring."
        ]
      },
      {
        "title": "Välj bild efter fråga",
        "steps": [
          "Fråga: var finns atomens positiva laddning? Välj kärnmodellen och peka ut kärnan.",
          "Fråga: vilka elektroner finns ytterst? Välj en skalmodell och följ de elektroner som ligger i det yttersta upptagna skalet.",
          "Fråga: i vilka områden kan elektroner påträffas? Välj ett elektronmoln och använd ordet sannolikhet. Förklara för varandra varför ni valde just den bilden."
        ]
      },
      {
        "title": "Skilj på kärna, skal och moln",
        "steps": [
          "Kärnmodellen: peka ut den lilla positiva kärnan och förklara guldfolieförsökets kraftiga avböjningar.",
          "Skalmodellen: använd bestämda energinivåer för att förklara att elektronen kan ta upp eller avge vissa mängder energi. Rita inte skalen som hårda väggar.",
          "Elektronmolnet: visa möjliga lägen och tala om sannolikhet. Säg varför elektronen inte ska beskrivas som en liten planet på en bestämd ritad bana."
        ]
      }
    ],
    "reflectionPrompts": [
      "Rita Thomson och Rutherford bredvid varandra. Använd samma tecken för positiv och negativ laddning så att skillnaden i fördelning blir lätt att se.",
      "Tänk er att ett nytt mätresultat är svårt att förklara. Vilka frågor kan forskare ställa om försöket och om modellen innan de utvecklar en ny beskrivning?"
    ]
  },
  "3": {
    "opener": "Hur kan två atomer hålla ihop?",
    "intro": [
      "Tänk på två väteatomer. Varje atom har en positiv kärna och en negativ elektron. När atomerna binds ihop får elektronerna en gemensam roll i molekylen.",
      "Följ samma två kärnor och samma två elektroner genom filmen. Då kan ni se vad som händer med bindningen och vilka delar som finns kvar. Det är särskilt de yttersta elektronerna som är viktiga i kemiska reaktioner."
    ],
    "sections": [
      {
        "heading": "Börja med plus och minus",
        "body": "Kärnan har positiv laddning och elektroner har negativ laddning. Olika laddningar dras till varandra; lika laddningar stöter bort varandra. I en neutral atom tar den positiva och negativa laddningen ut varandra. Väte har en proton med laddningen plus ett och en elektron med laddningen minus ett. Summan blir noll. En atom med lika många protoner som elektroner är neutral. Om antalet elektroner ändras blir partikeln laddad. En sådan laddad atom kallas jon. Atomslaget bestäms fortfarande av protonerna i kärnan. Att räkna plus och minus hjälper oss alltså att förstå laddningen.",
        "question": "Varför är en väteatom med en proton och en elektron neutral?"
      },
      {
        "heading": "Ett gemensamt elektronpar håller ihop H₂",
        "body": "Två väteatomer har tillsammans två kärnor och två elektroner. När de bildar H₂ delas de två elektronerna mellan atomerna. Vi kallar dem ett gemensamt elektronpar. De negativa elektronerna dras till båda positiva kärnorna och hjälper till att hålla ihop molekylen. Det kallas elektronparbindning. På ett lagom avstånd kan den bundna molekylen ha lägre energi än de två fria atomerna. Det är därför en bindning kan bildas. Huvudidén här är enkel: atomerna delar elektroner, och samma två kärnor finns kvar. I vattenmolekylen delar syre elektroner med väte i två bindningar.",
        "question": "Hur många kärnor och elektroner följer ni när två väteatomer bildar H₂?"
      },
      {
        "heading": "Bindningar ändras; atomslagen finns kvar",
        "body": "I en vanlig kemisk reaktion kan bindningar brytas och nya bindningar bildas. Elektroner kan delas mellan atomer eller flyttas från en atom till en annan. En natriumatom som lämnar ifrån sig en elektron blir till exempel en positiv natriumjon, Na⁺. En kloratom som tar upp en elektron blir en negativ kloridjon, Cl⁻. De motsatta laddningarna dras till varandra i koksalt. Det är ett annat sätt att binda partiklar än i H₂. Kärnorna bevaras i båda fallen. Väte blir fortfarande väte, och natrium blir fortfarande natrium. Börja därför varje reaktionsförklaring med att följa samma atomslag före och efter.",
        "question": "En partikel har elva protoner och tio elektroner. Vilken laddning har den, och varför?"
      },
      {
        "heading": "Ett plus kan betyda att en elektron har lämnat",
        "body": "När en atom blir positiv är det lätt att tro att den har fått en extra proton. I en vanlig kemisk reaktion sker jonbildning i stället genom att antalet elektroner ändras. En atom med elva protoner är natrium. Med elva elektroner är den neutral; med tio elektroner är den en positiv natriumjon. Kärnan och atomslaget är desamma. Säg ”en elektron har lämnats ifrån sig” och kontrollera genom att räkna plus och minus.",
        "question": "Varför blir en atom positiv när en negativ elektron lämnar den?"
      }
    ],
    "conceptMap": [
      {
        "term": "Elektron",
        "meaning": "En negativt laddad del av atomen. Elektroner är viktiga för hur atomer binds ihop."
      },
      {
        "term": "Elektronpar",
        "meaning": "Två elektroner. Ett gemensamt elektronpar delas av två atomer i en bindning."
      },
      {
        "term": "Jon",
        "meaning": "En laddad atom eller atomgrupp. En atom blir en jon om den tar upp eller lämnar ifrån sig elektroner."
      },
      {
        "term": "Proton",
        "meaning": "En positivt laddad partikel i kärnan. Antalet protoner bestämmer atomslaget."
      },
      {
        "term": "Neutron",
        "meaning": "En oladdad partikel i kärnan. Den vanliga väteatomen saknar neutron."
      },
      {
        "term": "Ytterelektroner",
        "meaning": "Elektronerna i atomens yttersta upptagna skal. De är särskilt viktiga när bindningar bildas."
      }
    ],
    "workedExample": {
      "title": "Följ H₂ från början till slut",
      "steps": [
        "Före: två neutrala väteatomer ger sammanlagt två positiva kärnor och två negativa elektroner. Räkna båda sorternas delar.",
        "När bindningen bildas delar atomerna ett gemensamt elektronpar. De negativa elektronerna dras till båda de positiva kärnorna.",
        "Efter: H₂ består av samma två vätekärnor och samma två elektroner. En bindning har bildats, och de två väteatomerna ingår nu i en molekyl."
      ]
    },
    "misconception": {
      "claim": "”Atomer blir ett nytt grundämne när de bildar en kemisk förening.”",
      "correction": "Vid vanliga kemiska reaktioner finns atomkärnorna kvar. Elektroner och bindningar kan ordnas på nya sätt. Atomslaget bestäms av protonerna i kärnan, så väte är fortfarande väte även när det ingår i ett nytt ämne."
    },
    "film": {
      "src": "assets/films/v3/03-elektroner.mp4?v=music-only-20261109",
      "poster": "assets/posters/v3/03-elektroner.jpg",
      "title": "Elektroner: laddning, överföring och delning",
      "before": "Välj en kärna och en elektron att följa. Räkna hur många av varje som finns före och efter bindningen.",
      "after": "Visa H₂ och säg vad gemensamt elektronpar betyder. Förklara sedan varför väte fortfarande är väte efter reaktionen."
    },
    "summary": "Jag kan följa elektronerna i en bindning. När två väteatomer bildar H₂ delar de ett elektronpar. Samma två vätekärnor finns kvar.",
    "extraExamples": [
      {
        "title": "Räkna laddning när en elektron flyttas",
        "steps": [
          "En natriumatom har elva protoner och elva elektroner. Lika många plus och minus ger laddningen noll.",
          "Om atomen lämnar ifrån sig en elektron finns elva protoner men tio elektroner. Ett plus blir över: natriumjonen skrivs Na⁺.",
          "Kärnan har fortfarande elva protoner. Därför är atomslaget fortfarande natrium. Elektronerna bestämmer här om partikeln är neutral eller laddad."
        ]
      },
      {
        "title": "Fördjupning: räkna vattnets ytterelektroner",
        "steps": [
          "Ytterelektroner är elektroner i atomens yttersta upptagna skal. Syre har sex ytterelektroner och varje väteatom har en.",
          "I en vattenmolekyl blir det sex plus en plus en: åtta ytterelektroner. Två elektronpar delas i de två bindningarna mellan syre och väte.",
          "De återstående fyra ytterelektronerna visas som två par vid syret. Förklara först vilka elektroner som delas. Räkna sedan alla åtta så att ni följer samma elektroner genom bilden."
        ]
      }
    ],
    "reflectionPrompts": [
      "Rita före och efter med lika många kärnor. Låt er partner beskriva vad som ändrats hos elektronerna och kontrollera sedan beskrivningen tillsammans.",
      "Två väteatomer delar ett elektronpar när H₂ bildas. Förklara med en ritning hur de två elektronerna hjälper till att hålla ihop atomerna."
    ]
  },
  "4": {
    "opener": "Vad är skillnaden mellan smältande is och en rostig cykel?",
    "intro": [
      "En förändring kan synas tydligt utan att ett nytt ämne bildas. Vatten kan bli is, flytande vatten eller gas och ändå bestå av H₂O.",
      "Jämför det med järn som rostar. Då reagerar järn med omgivningen och nya ämnen bildas. Följ atomerna och fråga vad ämnet består av före och efter förändringen."
    ],
    "sections": [
      {
        "heading": "Fysikalisk förändring: samma ämne",
        "body": "När is smälter kan vattenmolekylerna röra sig förbi varandra. Ämnet är vatten både före och efter. När vatten kokar går en del från vätska till gas. Varje molekyl är fortfarande H₂O. De här förändringarna kallas fysikaliska. Ett ämne kan också ändra form, som när en metalltråd böjs eller ett papper rivs. Föremålet ser annorlunda ut, men det betyder inte att ett nytt ämne har bildats. Beskriv först vad som ändras: form, rörelse eller tillstånd. Förklara sedan vad som finns kvar. För vatten är det samma vattenmolekyler.",
        "question": "Vad är oförändrat när en isbit smälter?"
      },
      {
        "heading": "Kemisk förändring: nya ämnen",
        "body": "När järn rostar deltar järn, syre och fukt i ett förlopp där nya ämnen bildas. Rost har andra egenskaper än det ursprungliga järnet. Atomerna finns kvar, men ingår i nya ämnen. I ritningen följer vi järnoxiden Fe₂O₃ för att kunna räkna atomer: 4Fe + 3O₂ → 2Fe₂O₃. På vänster sida finns fyra järnatomer och sex syreatomer. Samma antal finns på höger sida. Rost kan innehålla flera järnföreningar, och vatten spelar roll i verklig rostbildning. Använd formeln för att följa atomantalet och huvudidén: en kemisk förändring bildar nya ämnen.",
        "question": "Räkna järn och syre på båda sidor om pilen. Vad har förändrats trots att atomerna finns kvar?"
      },
      {
        "heading": "Ledtrådar behöver en förklaring",
        "body": "Bubblor, en temperaturändring eller en ny färg kan hjälpa oss att upptäcka en förändring. Men en enda sådan observation avgör inte om nya ämnen har bildats. Kokande vatten bubblar när vattenånga bildas, och ämnet är fortfarande vatten. När ett vedträ brinner bildas däremot bland annat koldioxid och vatten, alltså nya ämnen. Uppvärmning kan därför leda till både fysikaliska och kemiska förändringar. Ett bra svar innehåller ett exempel och en motivering. Säg vad som finns före, vad som finns efter och varför ni väljer just den gruppen.",
        "question": "Varför räcker meningen ”det bubblar” inte som bevis för en kemisk förändring?"
      },
      {
        "heading": "Följ även sådant som lämnar föremålet som gas",
        "body": "När ett ljus brinner blir det mindre. Stearinets ämnen reagerar med syre från luften, och bland annat koldioxid och vatten bildas. Gaserna sprids i rummet. Om ni bara väger ljuset före och efter missar ni både det syre som kom in och de produkter som lämnade ljuset. Vid en kemisk reaktion bevaras atomerna, även när en del ämnen är osynliga gaser. För en rättvis jämförelse av total massa behöver allt som deltar och bildas räknas med.",
        "question": "Varför kan ni inte följa hela reaktionen genom att enbart väga ljuset?"
      }
    ],
    "conceptMap": [
      {
        "term": "Fysikalisk förändring",
        "meaning": "En förändring där ämnet finns kvar, till exempel när vatten smälter eller kokar."
      },
      {
        "term": "Kemisk förändring",
        "meaning": "En förändring där nya ämnen bildas."
      },
      {
        "term": "Kemisk reaktion",
        "meaning": "Ett förlopp där ämnen omvandlas till nya ämnen. Atomerna finns kvar och bindningarna ändras."
      }
    ],
    "workedExample": {
      "title": "Förklara kokning i tre steg",
      "steps": [
        "Observation: vatten värms och bubblor stiger genom vätskan. Beskriv det ni ser innan ni bestämmer förändringens typ.",
        "Ämnen: vätskan består av H₂O och vattenångan i bubblorna består också av H₂O. Följ en vattenmolekyl från vätska till gas.",
        "Slutsats: vattnet byter tillstånd men är fortfarande samma ämne. Kokningen är en fysikalisk förändring."
      ]
    },
    "misconception": {
      "claim": "”Om förändringen är svår att göra ogjord måste den vara kemisk.”",
      "correction": "Det avgörande är om nya ämnen bildas. Klippt papper visar hur ett föremål kan vara svårt att återställa efter en fysikalisk förändring. Vid en kemisk förändring behöver förklaringen visa vilka nya ämnen som bildas."
    },
    "film": {
      "src": "assets/films/v3/04-forandringar.mp4?v=music-only-20261109",
      "poster": "assets/posters/v3/04-forandringar.jpg",
      "title": "Kemiska förändringar: följ atomerna",
      "before": "Följ en vattenmolekyl när isen smälter. Jämför sedan med järnatomerna när ett nytt ämne bildas.",
      "after": "Välj en fysikalisk och en kemisk förändring. Beskriv vad som finns före och efter och använd orden nytt ämne."
    },
    "summary": "Jag skiljer förändringarna åt genom att fråga om nya ämnen bildas. Smältning och kokning är fysikaliska förändringar. Rostbildning och förbränning är kemiska förändringar.",
    "extraExamples": [
      {
        "title": "Räkna atomer i en järnoxid",
        "steps": [
          "I räkneexemplet bildas järnoxiden Fe₂O₃. Reaktionen skrivs 4Fe + 3O₂ → 2Fe₂O₃. Vi följer hur järn- och syreatomerna går ihop i oxiden.",
          "Före finns fyra järnatomer och tre gånger två syreatomer: sex syreatomer. Efter finns två gånger två järnatomer och två gånger tre syreatomer.",
          "Båda sidor innehåller fyra Fe och sex O. Atomantalet bevaras, medan bindningarna och ämnena förändras. Rost innehåller järnföreningar; här har vi följt en bestämd järnoxid för att träna räkningen."
        ]
      },
      {
        "title": "Samma utgångsföremål, två olika förändringar",
        "steps": [
          "Tänk först på ved som delas i mindre bitar. Formen och storleken ändras, medan ämnena i träet finns kvar genom själva delningen.",
          "Tänk sedan på ved som brinner. Ämnen i veden reagerar med syre, och bland annat koldioxid och vatten bildas.",
          "Jämför med samma fråga i båda fallen: vilka nya ämnen har bildats? Motivera svaret med ämnena, snarare än hur stor förändringen ser ut."
        ]
      }
    ],
    "reflectionPrompts": [
      "Byt enbart orden ”det bubblar, alltså är det kemiskt” mot ett fullständigt resonemang med observation, ämne och slutsats.",
      "Ge ett exempel på en fysikalisk och ett på en kemisk förändring från vardagen. Låt er partner kontrollera förklaringen med frågan ”bildas nya ämnen?”."
    ]
  },
  "5": {
    "opener": "Varför behöver kastrullens botten och handtag olika material?",
    "intro": [
      "När vi väljer ett material behöver vi veta vad delen ska göra. Värmen ska lätt nå maten genom kastrullens botten. Samma värme ska överföras långsammare till handen genom handtaget.",
      "Den skillnaden hjälper oss att använda ordet egenskap. Börja med delens uppgift, välj en användbar egenskap och förklara hur den hjälper. Då blir svaret tydligare än ett materialnamn utan motivering."
    ],
    "sections": [
      {
        "heading": "Egenskaper beskriver hur ämnen beter sig",
        "body": "Ett ämne kan vara hårt eller mjukt, ha hög eller låg smältpunkt och leda värme eller elektricitet olika bra. Löslighet handlar om hur mycket som kan lösas, till exempel i vatten. Densitet betyder massa per volym: hur mycket massa som ryms i en viss volym. Två lika stora klossar kan därför ha olika massa. När ni jämför egenskaper ska undersökningarna vara rättvisa. Använd till exempel samma mängd vatten och samma temperatur om ni jämför hur mycket av två ämnen som kan lösas. Då blir resultatet lättare att tolka.",
        "question": "Varför kan varmt vatten till det ena provet och kallt till det andra ge en orättvis jämförelse?"
      },
      {
        "heading": "Välj ett test som kan skilja proven åt",
        "body": "Anta att ett prov är antingen järn eller koppar. En vanlig magnet kan skilja dem åt: järn dras tydligt till magneten, medan koppar inte gör det. Ett test av elektrisk ledningsförmåga ger mindre hjälp i just den frågan, eftersom båda metallerna leder elektricitet. Om fler ämnen är möjliga kan fler tester behövas. Färg ensam räcker ofta inte. Salt och socker kan till exempel båda vara vita och lösliga i vatten. Börja med vilka ämnen som är möjliga. Välj sedan ett test som ger olika förväntade resultat. Smaka aldrig på okända prov.",
        "question": "Varför är en magnet ett bättre test än elektrisk ledning när alternativen är järn och koppar?"
      },
      {
        "heading": "Koppla materialets egenskap till delens uppgift",
        "body": "Kastrullens botten ska föra värme från spisen till maten. Där är god värmeledningsförmåga användbar. I handtaget vill vi i stället att värmen ska överföras långsammare till handen. Men ett material som leder värme långsamt måste också tåla temperaturen där handtaget sitter. Det behöver vara hållfast och gå att greppa. Därför behöver vi ofta jämföra flera egenskaper samtidigt. Förklara i tre steg: delens uppgift, materialets egenskap och följden av egenskapen. Säg till exempel att botten ska värma maten, att metallen leder värme bra och att värmen därför kan spridas till maten.",
        "question": "Ett material leder värme långsamt men mjuknar när kastrullen används. Vad behöver ni också kräva av handtaget?"
      },
      {
        "heading": "Samma föremål kan behöva både ledare och isolator",
        "body": "I en elkabel är metalltråden en elektrisk ledare. Laddningar kan förflytta sig genom metallen så att elektrisk ström kan gå. Plasten runt tråden leder ström mycket dåligt och fungerar som isolering. Den hjälper till att hålla strömmen i rätt väg och gör kabeln användbar. På liknande sätt kan en jacka behöva ett material som håller värmen och ett annat som står emot regn. Fråga först vad varje del ska göra och välj sedan egenskaper som passar.",
        "question": "Varför vore en elkabel med enbart oskyddad metall en dålig konstruktion?"
      }
    ],
    "conceptMap": [
      {
        "term": "Egenskap",
        "meaning": "Något som beskriver hur ett ämne eller material är och beter sig."
      },
      {
        "term": "Värmeledningsförmåga",
        "meaning": "Hur bra ett material överför värme genom sig."
      },
      {
        "term": "Densitet",
        "meaning": "Massa per volym: hur mycket massa som ryms i en viss volym."
      },
      {
        "term": "Löslighet",
        "meaning": "Hur mycket av ett ämne som kan lösas i en viss mängd lösningsmedel vid en viss temperatur."
      },
      {
        "term": "Isolator",
        "meaning": "Ett material som leder elektricitet eller värme dåligt. Ange vilken sorts ledning ni menar."
      }
    ],
    "workedExample": {
      "title": "Motivera kastrullens två materialval",
      "steps": [
        "Uppgift: botten ska föra energi från spisen till maten. Välj därför ett material med god värmeledningsförmåga där värmen ska passera.",
        "Följd: värmen kan spridas genom botten. Förklara hur egenskapen hjälper just den delen av kastrullen att göra sitt arbete.",
        "Jämförelse: handtaget behöver överföra värme långsammare till handen. Lägg till att det också måste tåla temperaturen och hålla när kastrullen lyfts."
      ]
    },
    "misconception": {
      "claim": "”Två vita pulver måste vara samma ämne.”",
      "correction": "Färg är en egenskap bland flera. Salt och socker kan båda vara vita och lösliga i vatten. För att skilja prov åt behöver vi välja undersökningar som ger användbar information. Smaka aldrig på okända prov."
    },
    "film": {
      "src": "assets/films/v3/05-egenskaper.mp4?v=20261110-labs3",
      "poster": "assets/posters/v3/05-egenskaper.jpg",
      "title": "Ämnens egenskaper: undersök och välj material",
      "before": "Följ värmen från spisen. Var ska den lätt kunna gå vidare, och var är långsammare värmeöverföring användbar?",
      "after": "Förklara materialvalen med eftersom: ett material till botten och ett till handtaget. Nämn också ett andra krav."
    },
    "summary": "Jag kan välja material genom att koppla uppgift till egenskap. Botten ska leda värme till maten. Handtaget ska överföra värme långsammare till handen och tåla användningen.",
    "extraExamples": [
      {
        "title": "Lika stor volym gör densiteten jämförbar",
        "steps": [
          "Tänk er två kuber med samma volym, en av ämne A och en av ämne B. Väg dem med samma våg och jämför massorna.",
          "Om kuben av A har större massa än kuben av B, har A högre densitet. Förklaringen är att mer massa finns i samma volym.",
          "Om föremålen har olika volym behöver ni jämföra massa per volym: densitet = massa / volym. Ett stort föremål kan ha stor massa även när materialets densitet är låg."
        ]
      },
      {
        "title": "Planera ett test för järn och koppar",
        "steps": [
          "Ange först alternativen: provet är antingen järn eller koppar. Välj sedan en vanlig magnet som verktyg för jämförelsen.",
          "Beskriv vad ni väntar er: järn ska dras tydligt till magneten; koppar ska ge ett annat resultat. Håll magneten på motsvarande avstånd vid jämförelsen.",
          "Tolka resultatet utifrån just dessa alternativ. Förklara sedan varför ett test av elektrisk ledningsförmåga skulle ge mindre hjälp här: båda metallerna leder elektricitet."
        ]
      }
    ],
    "reflectionPrompts": [
      "Välj ett vardagsföremål med två delar som har olika uppgifter. Ge varje del ett materialkrav och förklara följden med eftersom.",
      "En kamrat jämför två ämnens löslighet men använder varmt vatten till det ena. Vad skulle ni ändra för att göra jämförelsen rättvis?"
    ]
  },
  "6": {
    "opener": "Hur kan en isbit, rinnande vatten och osynlig vattenånga vara samma ämne?",
    "intro": [
      "En vattenmolekyl består av två väteatomer och en syreatom. Det gäller i is, i flytande vatten och i vattenånga. Skillnaderna finns mellan molekylerna: hur de ligger och hur de kan röra sig.",
      "Följ samma markerade molekyl när tillståndet ändras. Beskriv först vad som händer med dess grannar och avstånd. Kontrollera sedan att molekylens egen uppbyggnad finns kvar."
    ],
    "sections": [
      {
        "heading": "Is och vatten: från vibration till rinnande vätska",
        "body": "I is vibrerar molekylerna kring bestämda platser. Det betyder att de rör sig fram och tillbaka, samtidigt som isbiten behåller sin form. Vattenmolekylerna ligger i en öppen, ordnad struktur. När isen smälter förändras ordningen så att molekylerna kan röra sig förbi varandra. Då kan vattnet rinna och följa formen hos glaset. Samma mängd vatten tar större plats som is än som flytande vatten. Därför har is lägre densitet och kan flyta. Densitet betyder massa per volym. Varje vattenmolekyl är fortfarande H₂O under hela förändringen.",
        "question": "Hur kan molekylerna röra sig i is samtidigt som isbiten behåller sin form?"
      },
      {
        "heading": "Vattenånga: större avstånd mellan molekylerna",
        "body": "När vatten övergår till gas blir avstånden mellan vattenmolekylerna mycket större. Molekylerna rör sig mellan kollisioner med varandra och omgivningen. Det är fortfarande H₂O. Vattenånga är osynlig. Det vita moln som syns nära en kastrull består av små flytande vattendroppar som bildats när vattenånga kylts och kondenserat. Vatten kan också avdunsta utan att koka. En våt tröja kan därför torka i ett rum. Vattnet lämnar tyget som gas och blandas med luften. Förklara vart vattnet tar vägen genom att följa samma ämne, steg för steg.",
        "question": "Vad består det vita molnet vid kastrullen av, och hur har det bildats?"
      },
      {
        "heading": "Energi kan värma eller ändra tillstånd",
        "body": "När temperaturen stiger rör sig partiklarna mer i genomsnitt. Under smältning eller kokning kan tillförd energi i stället användas till att ändra hur molekylerna hålls ihop med sina grannar. För rent vatten vid konstant tryck kan temperaturen då vara oförändrad medan övergången pågår. På en uppvärmningskurva syns det som en plan del. En stigande del betyder att temperaturen ökar. Smältning är fast form till vätska; stelning är vätska till fast form. Förångning är vätska till gas; kondensation är gas till vätska. Vid kondensation lämnar vattnet energi till omgivningen. Koppla varje ord till tillståndet före och efter.",
        "question": "Hur kan värme tillföras under smältning medan termometern visar samma temperatur?"
      },
      {
        "heading": "Dropparna på glaset kommer från luften",
        "body": "Ställ ett kallt glas i varm, fuktig luft. Vattenånga i luften nära glaset kyls. När ytan är tillräckligt kall bildas flytande droppar på utsidan genom kondensation. Dropparna har alltså inte sipprat genom glasväggen. Vatten från luften har gått från gas till vätska. En liten vattenpöl kan sedan försvinna genom avdunstning. Följ ämnet i båda riktningarna: det är fortfarande H₂O, men tillståndet och placeringen ändras.",
        "question": "Vilket ämne bildar dropparna, varifrån kommer det och vad heter förändringen?"
      }
    ],
    "conceptMap": [
      {
        "term": "Aggregationstillstånd",
        "meaning": "Fast form, vätska eller gas."
      },
      {
        "term": "Fasförändring",
        "meaning": "När ett ämne byter tillstånd, till exempel från vätska till gas."
      },
      {
        "term": "Kondensation",
        "meaning": "När ett ämne övergår från gas till vätska, som droppar som bildas ur vattenånga."
      },
      {
        "term": "Avdunstning",
        "meaning": "När molekyler lämnar en vätskas yta och går över till gas. Det kan ske utan att vätskan kokar."
      },
      {
        "term": "Stelning",
        "meaning": "När en vätska övergår till fast form. För vatten säger vi också att det fryser."
      }
    ],
    "workedExample": {
      "title": "Följ sex vattenmolekyler genom tre tillstånd",
      "steps": [
        "I is: sex H₂O-molekyler vibrerar kring lägen i en öppen, ordnad struktur. Peka ut en av dem och dess grannar.",
        "I vätskan: samma sex molekyler kan röra sig förbi varandra. Vattnets tätare struktur jämfört med is innebär mindre volym för samma mängd.",
        "I gasen: samma sex molekyler finns på stora avstånd från varandra. Varje molekyl har behållit två H och en O genom hela förändringen."
      ]
    },
    "misconception": {
      "claim": "”Vattenmolekyler blir större när vatten blir gas.”",
      "correction": "Gasens stora volym hänger framför allt ihop med stora avstånd mellan molekylerna. Varje H₂O-molekyl behåller sin uppbyggnad med två väteatomer och en syreatom."
    },
    "film": {
      "src": "assets/films/v3/06-faser.mp4?v=music-only-20261109",
      "poster": "assets/posters/v3/06-faser.jpg",
      "title": "Värme och faser: samma molekyler, nya rörelser",
      "before": "Följ den markerade vattenmolekylen genom tre tillstånd. Lägg märke till dess grannar, rörelse och avstånd.",
      "after": "Förklara vad som ändras mellan molekylerna och vad som finns kvar i varje H₂O-molekyl. Använd ett fasord."
    },
    "summary": "Jag kan beskriva is, vatten och vattenånga med samma H₂O-molekyler. Det som förändras är molekylernas ordning, avstånd och rörelse i förhållande till varandra.",
    "extraExamples": [
      {
        "title": "Varifrån kommer dropparna på ett kallt glas?",
        "steps": [
          "Luften omkring glaset innehåller vattenånga. När vattenångan möter en tillräckligt kall yta kyls den så att flytande droppar kan bildas.",
          "Övergången från gas till vätska heter kondensation. Vattenmolekylerna samlas tätare och överför energi till omgivningen under övergången.",
          "Beskriv därför dropparna med både källa och fasförändring: vatten från luften har kondenserat på utsidan. Ämnet är H₂O före och efter."
        ]
      },
      {
        "title": "Läs en uppvärmningskurva",
        "steps": [
          "Följ först en stigande del av kurvan. Temperaturen ökar och molekylerna rör sig mer i genomsnitt.",
          "Följ sedan en plan del under smältning eller kokning. För ett rent ämne vid konstant tryck kan energi tillföras medan tillståndet ändras och temperaturen är oförändrad.",
          "När övergången är klar kan temperaturen stiga igen om uppvärmningen fortsätter. Peka på en kurvdel och säg vad som händer med både temperaturen och vattnet."
        ]
      }
    ],
    "reflectionPrompts": [
      "En kamrat ritar större H₂O-molekyler i gas. Rita om modellen så att de större avstånden mellan molekylerna förklarar gasens volym.",
      "Beskriv smältning och kondensation med samma tre saker: tillstånd före, tillstånd efter och vad som händer mellan molekylerna."
    ]
  },
  "7": {
    "opener": "Hur kan ett batteri vid en bäck påverka djur längre bort?",
    "intro": [
      "Om ett skadat batteri läcker kan ämnen först komma ut i marken. Vatten kan föra dem vidare till en annan plats. Där kan levande organismer komma i kontakt med dem.",
      "Bygg förklaringen som en kedja. Börja vid källan och följ ämnet hela vägen. Använd om när något behöver hända för att förloppet ska fortsätta. Avsluta med en åtgärd och förklara varför den hjälper."
    ],
    "sections": [
      {
        "heading": "Följ ämnet från batteriet till bäcken",
        "body": "Tänk er ett skadat batteri som börjar läcka. Ämnen kan då hamna i marken. När det regnar kan en del ämnen följa med vatten till en bäck. Ett djur som lever där kan komma i kontakt med dem genom vattnet eller födan. Pilarna i en spridningskedja behöver alltså förklaras. En pil kan betyda läcker, en annan förs med vatten och en tredje tas upp. Vad som faktiskt händer beror bland annat på batteritypen, vilka ämnen som frigörs och miljön på platsen. Därför säger vi om batteriet läcker kan ämnen spridas.",
        "question": "Vilka steg måste ske för att ett ämne ska nå ett smådjur längre ned i bäcken?"
      },
      {
        "heading": "Risk beror på ämne, mängd och kontakt",
        "body": "Vissa ämnen kan skada organismer. Organism är ett samlingsord för levande varelser, till exempel människor, fiskar och växter. Exponering betyder att en organism kommer i kontakt med ett ämne, till exempel genom vatten eller föda. Hur stor risken blir beror bland annat på ämnets egenskaper, mängden och exponeringen. Det spelar också roll hur länge kontakten pågår. Vissa ämnen bryts ned långsamt och kan finnas kvar länge i miljön. En del kan samlas i organismer. För att bedöma ett verkligt fall behöver vi därför veta vad som har spridits, hur mycket och hur organismerna utsätts.",
        "question": "Vilka tre saker behöver ni veta för att förklara risken i ett miljöfall?"
      },
      {
        "heading": "Förebygg genom att ta hand om källan",
        "body": "Batterier lämnas till batteriinsamling så att de kan tas om hand på rätt sätt. Då förebygger vi att just det batteriet skadas och läcker ämnen i mark och vatten. Förebygga betyder att hindra ett problem innan det uppstår. När ni föreslår en åtgärd ska ni också visa vilken del av kedjan den påverkar. Insamling tar hand om källan. En annan åtgärd kan hindra ett läckage från att nå en bäck. En giftfri miljö betyder att vi vill minska skadlig spridning och kontakt med farliga ämnen. Allt omkring oss består av kemiska ämnen; vi behöver undersöka deras egenskaper och hur de används.",
        "question": "Hur hjälper batteriinsamling organismer längre ned i spridningskedjan?"
      },
      {
        "heading": "Förklara pilarna i en spridningskedja",
        "body": "En pil behöver betyda något bestämt. Mellan batteri och mark kan den betyda ”läcker ut”. Mellan mark och bäck kan den betyda ”följer med vatten”. Mellan vatten och organism kan den betyda ”tas upp” eller ”kommer i kontakt med”. Säg sedan vad som kan påverkas, till exempel ett djurs tillväxt eller fortplantning. En möjlig följd måste kopplas till ämnets egenskaper och exponeringen. Det är inte säkert att varje steg sker, så använd om och kan där ett villkor behövs.",
        "question": "Vilken pil försvinner från ert exempel om batteriet lämnas till insamling i tid?"
      }
    ],
    "conceptMap": [
      {
        "term": "Spridningsväg",
        "meaning": "Den väg ett ämne tar från en källa till en annan plats, till exempel med rinnande vatten."
      },
      {
        "term": "Exponering",
        "meaning": "När en organism kommer i kontakt med ett ämne, till exempel genom vatten eller föda."
      },
      {
        "term": "Förebygga",
        "meaning": "Att hindra ett problem innan det uppstår."
      },
      {
        "term": "Fara",
        "meaning": "Ett ämnes förmåga att orsaka skada."
      },
      {
        "term": "Risk",
        "meaning": "Risken för skada i en viss situation beror på ämnets farliga egenskaper och hur organismer utsätts för det."
      },
      {
        "term": "Ekosystem",
        "meaning": "Organismerna i ett område och deras omgivning, som samspelar med varandra."
      }
    ],
    "workedExample": {
      "title": "Skriv en sammanhängande miljöförklaring",
      "steps": [
        "Källa och väg: om ett skadat batteri läcker kan ämnen komma ut i marken och följa med vatten till bäcken. Skriv vad som flyttas och hur.",
        "Exponering och möjlig konsekvens: organismer kan komma i kontakt med ämnena genom vatten eller föda. Skadan beror på ämnenas egenskaper, mängden och exponeringen.",
        "Åtgärd och motivering: lämna batteriet till insamling. Då kan det tas om hand, vilket förebygger att denna källa sprider ämnen i mark och vatten."
      ]
    },
    "misconception": {
      "claim": "”En giftfri miljö är en miljö utan kemiska ämnen.”",
      "correction": "All materia består av kemiska ämnen. Målet är att förebygga skadlig exponering och minska spridning av farliga ämnen. Risk bedöms genom ämnets egenskaper tillsammans med mängd och exponering."
    },
    "film": {
      "src": "assets/films/v3/07-miljo.mp4?v=music-only-20261109",
      "poster": "assets/posters/v3/07-miljo.jpg",
      "title": "Giftfri miljö: följ spridningen och bryt kedjan",
      "before": "Följ ett ämne från det skadade batteriet. Vad behöver hända för att det ska nå vattnet och sedan en organism?",
      "after": "Återberätta med om, först, sedan och därför. Visa vilken del av kedjan batteriinsamlingen påverkar."
    },
    "summary": "Jag kan följa ett ämne från källa till organism och förklara en förebyggande åtgärd. Risken beror bland annat på ämnet, mängden och hur organismen utsätts.",
    "extraExamples": [
      {
        "title": "Samma källa kan ge olika exponering",
        "steps": [
          "Tänk er två djur i en bäck. Ett lever nära platsen dit ett läckage når, medan det andra lever längre bort.",
          "Undersök hur ämnet förs med vattnet och hur mycket som når varje djur. Ta också reda på hur djuren kommer i kontakt med vattnet och vad de äter.",
          "Djuren kan utsättas på olika sätt. För att jämföra risken behöver vi veta vilket ämne det är, mängden och hur varje djur exponeras."
        ]
      },
      {
        "title": "Från en kort åsikt till ett utvecklat svar",
        "steps": [
          "Börja med ett påstående: batteriet ska lämnas till insamling.",
          "Förklara varför: om ett skadat batteri läcker kan ämnen följa med vatten till bäcken och nå djur eller växter.",
          "Knyt ihop svaret med därför: insamlingen gör att batteriet kan tas om hand och minskar risken att ämnen sprids från det."
        ]
      }
    ],
    "reflectionPrompts": [
      "Byt roller. En av er pekar på pilarna i spridningskedjan; den andra säger vad som behöver hända i varje steg för att ämnet ska komma vidare.",
      "Välj en förebyggande åtgärd och förklara vilken länk den påverkar. Hur hänger ämnenas spridning ihop med organismernas livsmiljö?"
    ]
  }
};

const photos = [
  {
    "module": 1,
    "file": "assets/photos/01-atomer.jpg",
    "alt": "En vattendroppe studsar upp ur en vattenyta.",
    "caption": "En droppe rymmer ofattbart många vattenmolekyler. Fotot visar droppen; kulmodellen hjälper oss att föreställa oss molekylerna.",
    "credit": "Raghav Jerath",
    "license": "CC BY-SA 4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Water_Droplet.png",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "changes": "Storleken har anpassats och filen har konverterats till JPEG.",
    "width": 958,
    "height": 538,
    "title": "File:Water Droplet.png",
    "downloadUrl": "https://upload.wikimedia.org/wikipedia/commons/4/46/Water_Droplet.png"
  },
  {
    "module": 2,
    "file": "assets/photos/02-modeller.jpg",
    "alt": "Svartvitt fotografi från Ernest Rutherfords laboratorium i Cambridge år 1926.",
    "caption": "Rutherfords laboratorium i Cambridge, fotograferat 1926. Försöksutrustningen visar den praktiska sidan av forskarnas undersökningar av materia.",
    "credit": "Science Museum London / Science and Society Picture Library",
    "license": "CC BY-SA 2.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Sir_Ernest_Rutherfords_laboratory,_early_20th_century._(9660575343).jpg",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "changes": "Storleken har anpassats och filen har konverterats till JPEG.",
    "width": 1250,
    "height": 924,
    "title": "File:Sir Ernest Rutherfords laboratory, early 20th century. (9660575343).jpg",
    "downloadUrl": "https://upload.wikimedia.org/wikipedia/commons/9/97/Sir_Ernest_Rutherfords_laboratory%2C_early_20th_century._%289660575343%29.jpg"
  },
  {
    "module": 3,
    "file": "assets/photos/03-elektroner.jpg",
    "alt": "Lila och blå ljustrådar inne i en plasmaglob.",
    "caption": "Elektrisk energi får gasen i en plasmaglob att lysa. De lysande trådarna visar var elektriska urladdningar går genom gasen.",
    "credit": "Dr. Baris Kececi",
    "license": "CC BY-SA 4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Plasma_Globe.JPG",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "changes": "Storleken har anpassats och filen har konverterats till JPEG.",
    "width": 1280,
    "height": 853,
    "title": "File:Plasma Globe.JPG",
    "downloadUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Plasma_Globe.JPG/1280px-Plasma_Globe.JPG"
  },
  {
    "module": 4,
    "file": "assets/photos/04-forandringar.jpg",
    "alt": "Närbild av rostbruna kedjelänkar med regndroppar.",
    "caption": "Järnet i kedjan har reagerat med sin omgivning. Rost innehåller andra ämnen än det ursprungliga järnet.",
    "credit": "W.carter",
    "license": "CC0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Very_rusty_chain_in_rain_4.jpg",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "changes": "Storleken har anpassats och filen har konverterats till JPEG.",
    "width": 1280,
    "height": 854,
    "title": "File:Very rusty chain in rain 4.jpg",
    "downloadUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Very_rusty_chain_in_rain_4.jpg/1280px-Very_rusty_chain_in_rain_4.jpg"
  },
  {
    "module": 5,
    "file": "assets/photos/05-egenskaper.jpg",
    "alt": "Närbild av många tunna koppartrådar i en ledning.",
    "caption": "Koppar används i ledningar eftersom det leder elektricitet bra. Ett materials egenskaper påverkar vad vi kan använda det till.",
    "credit": "RobertKuhlmann",
    "license": "CC BY-SA 3.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lautsprecherkabel_Makro_nah.jpg",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "changes": "Storleken har anpassats och filen har konverterats till JPEG.",
    "width": 853,
    "height": 1280,
    "title": "File:Lautsprecherkabel Makro nah.jpg",
    "downloadUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/19/Lautsprecherkabel_Makro_nah.jpg/1280px-Lautsprecherkabel_Makro_nah.jpg"
  },
  {
    "module": 6,
    "file": "assets/photos/06-faser.jpg",
    "alt": "Isbitar som flyter i vatten.",
    "caption": "Is och flytande vatten är samma kemiska ämne: H₂O. Isen flyter eftersom dess struktur gör den mindre tät än det flytande vattnet.",
    "credit": "Cleiton Andrade Andrade from Alfenas, Brasil",
    "license": "CC0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ice_cubes_on_water.jpg",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "changes": "Storleken har anpassats och filen har konverterats till JPEG.",
    "width": 853,
    "height": 1280,
    "title": "File:Ice cubes on water.jpg",
    "downloadUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Ice_cubes_on_water.jpg/1280px-Ice_cubes_on_water.jpg"
  },
  {
    "module": 7,
    "file": "assets/photos/07-miljo.jpg",
    "alt": "En bäck rinner mellan stenar och växter i en skog.",
    "caption": "Vatten som rinner genom marken kan föra med sig lösta ämnen till bäckar och sjöar. Där kan växter och djur komma i kontakt med ämnena.",
    "credit": "sandro bisotti",
    "license": "CC0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Forest_stream_at_evening._Better_viewed_large._(50181939747).jpg",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "changes": "Storleken har anpassats och filen har konverterats till JPEG.",
    "width": 1280,
    "height": 853,
    "title": "File:Forest stream at evening. Better viewed large. (50181939747).jpg",
    "downloadUrl": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8f/Forest_stream_at_evening._Better_viewed_large._%2850181939747%29.jpg/1280px-Forest_stream_at_evening._Better_viewed_large._%2850181939747%29.jpg"
  }
];
const films = {
  "1": {
    "module": 1,
    "scene": "AtomMaster",
    "file": "assets/films/v3/01-atomer.mp4",
    "poster": "assets/posters/v3/01-atomer.jpg",
    "captions": "assets/captions/v3/01-atomer.vtt?v=20261110-labs3",
    "duration": 255.621615,
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "narration": false,
    "audio": true,
    "music": {
      "original": true,
      "source": "manim/compose_score.py",
      "credit": "Originalmusik för dessa filmer"
    },
    "animation_calls": 134,
    "chapters": [
      {
        "title": "Vad finns i en vattendroppe?",
        "start": 0.9999999999999999,
        "end": 17.03333333333334,
        "animation_seconds": 14.666666666666622,
        "wait_seconds": 1.3666666666667169,
        "automatic_reading_hold": 1.3333333333333783,
        "text": "Vattnet går att se och hälla. Men en enda droppe innehåller ofattbart många molekyler. Vi följer en markerad byggsten in i en förstorad modell."
      },
      {
        "title": "Bokstaven visar vilken sorts atom",
        "start": 17.70000000000004,
        "end": 33.70000000000065,
        "animation_seconds": 14.166666666667371,
        "wait_seconds": 1.8333333333332398,
        "automatic_reading_hold": 1.8333333333326287,
        "text": "En atom är en byggsten. Atomslag betyder sorten. H står för väte och O för syre. Färgerna är modellens hjälpmedel; bokstaven berättar vilken sort vi menar."
      },
      {
        "title": "Tre atomer binds ihop till en molekyl",
        "start": 34.36666666666728,
        "end": 50.3999999999997,
        "animation_seconds": 14.26666666666586,
        "wait_seconds": 1.7666666666665662,
        "automatic_reading_hold": 1.7333333333341443,
        "text": "Två väteatomer och en syreatom binds ihop till en vattenmolekyl. En molekyl är två eller flera atomer som sitter ihop med kemiska bindningar."
      },
      {
        "title": "Räkna atomer och atomslag var för sig",
        "start": 51.06666666666633,
        "end": 67.09999999999876,
        "animation_seconds": 14.466666666665851,
        "wait_seconds": 1.5666666666665776,
        "automatic_reading_hold": 1.5333333333341486,
        "text": "Vi räknar först alla byggstenar: en, två, tre atomer. Sedan räknar vi sorterna: väte och syre, alltså två atomslag. Tre atomer betyder inte tre atomslag."
      },
      {
        "title": "Den lilla tvåan hör till H",
        "start": 67.76666666666539,
        "end": 81.79999999999792,
        "animation_seconds": 13.066666666665931,
        "wait_seconds": 0.9666666666666117,
        "automatic_reading_hold": 0.9333333333340761,
        "text": "Formeln är en kort beskrivning av bilden. Tvåan efter H betyder två väteatomer i varje molekyl. När O saknar en liten siffra betyder det en syreatom."
      },
      {
        "title": "Siffran framför räknar hela molekyler",
        "start": 82.46666666666455,
        "end": 100.49999999999686,
        "animation_seconds": 16.066666666665753,
        "wait_seconds": 1.9666666666665549,
        "automatic_reading_hold": 1.9333333333342466,
        "text": "En stor siffra framför formeln gäller hela molekylen. Tre H2O betyder tre vattenmolekyler. Varje molekyl har två H och en O: tillsammans sex H och tre O."
      },
      {
        "title": "En molekyl behöver inte vara en förening",
        "start": 101.16666666666349,
        "end": 121.19999999999568,
        "animation_seconds": 18.466666666665617,
        "wait_seconds": 1.5666666666665776,
        "automatic_reading_hold": 1.533333333334383,
        "text": "O2 är en molekyl med två bundna syreatomer. Syrgas är ett grundämne: bara ett atomslag. H2O är också en molekyl, men vatten är en kemisk förening eftersom två grundämnen är bundna."
      },
      {
        "title": "Flera ämnen tillsammans blir en blandning",
        "start": 121.86666666666231,
        "end": 139.89999999999463,
        "animation_seconds": 16.666666666665733,
        "wait_seconds": 1.366666666666589,
        "automatic_reading_hold": 1.3333333333342665,
        "text": "I en blandning finns flera ämnen tillsammans. Vattenmolekyler och syrgasmolekyler kan finnas i samma prov utan att de byter bindningar. Vi följer samma molekyler när vi sorterar bilden."
      },
      {
        "title": "Ett rent ämne kan innehålla två atomslag",
        "start": 140.56666666666126,
        "end": 156.59999999999368,
        "animation_seconds": 14.866666666665822,
        "wait_seconds": 1.1666666666666003,
        "automatic_reading_hold": 1.1333333333341784,
        "text": "Rent vatten är ett ämne, trots att varje molekyl innehåller både väte och syre. Frågan antal ämnen är därför inte samma fråga som antal atomslag."
      },
      {
        "title": "Samma modell kan vridas i tre dimensioner",
        "start": 157.2666666666603,
        "end": 175.29999999999262,
        "animation_seconds": 11.36666666666602,
        "wait_seconds": 6.666666666666288,
        "automatic_reading_hold": 0.6333333333343205,
        "text": "Den platta ritningen och den tredimensionella modellen visar samma vattenmolekyl. Färger och kulor hjälper oss att tänka. De hjälper oss att visa hur atomerna sitter ihop."
      },
      {
        "title": "Vattenmolekylerna byter inte identitet",
        "start": 175.96666666665925,
        "end": 191.99999999999167,
        "animation_seconds": 15.466666666665787,
        "wait_seconds": 0.5666666666666345,
        "automatic_reading_hold": 0.5333333333342125,
        "text": "Is, flytande vatten och vattenånga består av samma sorts vattenmolekyler. När tillståndet ändras förändras bland annat rörelser och avstånd. Molekylerna blir inte större när vattnet värms."
      },
      {
        "title": "Samma atomer kan få nya grannar",
        "start": 192.6666666666583,
        "end": 210.6999999999906,
        "animation_seconds": 15.666666666665776,
        "wait_seconds": 2.366666666666532,
        "automatic_reading_hold": 2.333333333334224,
        "text": "I en vanlig kemisk reaktion omordnas atomer. Här följer vi fyra väteatomer och två syreatomer. Antalet av varje atomslag är lika stort före och efter. Bilden är ingen laborationsinstruktion."
      },
      {
        "title": "Kan man flytta en siffra hur som helst?",
        "start": 211.36666666665724,
        "end": 229.39999999998955,
        "animation_seconds": 15.166666666665805,
        "wait_seconds": 2.8666666666665037,
        "automatic_reading_hold": 2.8333333333341955,
        "text": "Nej. Fyra H2O betyder fyra hela vattenmolekyler: åtta H och fyra O. Skriver vi H4O säger symbolerna något annat. Siffrans plats ändrar betydelsen."
      },
      {
        "title": "Bild, formel och ord berättar samma sak",
        "start": 230.06666666665618,
        "end": 248.09999999998848,
        "animation_seconds": 15.666666666665776,
        "wait_seconds": 2.366666666666532,
        "automatic_reading_hold": 2.333333333334224,
        "text": "Använd tre frågor när ni förklarar: Hur många molekyler? Hur många atomer i varje molekyl? Hur många atomslag? Peka i bilden och läs sedan samma information i formeln."
      }
    ],
    "spoken_seconds": 0,
    "max_voice_speed": 1,
    "version": 8,
    "threeD": true
  },
  "2": {
    "module": 2,
    "scene": "ModelMaster",
    "file": "assets/films/v3/02-modeller.mp4",
    "poster": "assets/posters/v3/02-modeller.jpg",
    "captions": "assets/captions/v3/02-modeller.vtt",
    "duration": 257.622,
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "narration": false,
    "audio": true,
    "music": {
      "original": true,
      "source": "manim/compose_score.py",
      "credit": "Originalmusik för dessa filmer"
    },
    "animation_calls": 129,
    "chapters": [
      {
        "title": "Hur undersöker vi något vi inte ser direkt?",
        "start": 0.9999999999999999,
        "end": 16.03333333333329,
        "animation_seconds": 13.866666666666625,
        "wait_seconds": 1.1666666666666643,
        "automatic_reading_hold": 1.1333333333333755,
        "text": "En vetenskaplig modell är en förklaring som vi kan pröva. Vi börjar med observationer, gör en modell och jämför sedan med nya försök. En modell kan behöva förändras."
      },
      {
        "title": "Dalton: atomer som hela kulor",
        "start": 16.69999999999999,
        "end": 31.700000000000735,
        "animation_seconds": 13.866666666667356,
        "wait_seconds": 1.1333333333333897,
        "automatic_reading_hold": 1.1333333333326436,
        "text": "Daltons kulmodell hjälpte människor att tänka på olika grundämnen som olika atomslag. Men modellen visade inga mindre delar inuti atomen. Det blev en viktig begränsning."
      },
      {
        "title": "Elektronen visar att atomen har mindre delar",
        "start": 32.36666666666739,
        "end": 48.399999999999814,
        "animation_seconds": 14.466666666665844,
        "wait_seconds": 1.5666666666665776,
        "automatic_reading_hold": 1.5333333333341557,
        "text": "Undersökningar av elektriska strålar visade negativt laddade partiklar: elektroner. Då räckte bilden av en odelbar kula inte längre. Modellen behövde visa delar inuti atomen."
      },
      {
        "title": "Thomson: russin i en positiv kaka",
        "start": 49.06666666666644,
        "end": 65.09999999999887,
        "animation_seconds": 14.36666666666585,
        "wait_seconds": 1.666666666666579,
        "automatic_reading_hold": 1.63333333333415,
        "text": "I Thomsons modell är de negativa elektronerna som russin. Positiv laddning är utspridd genom hela atomen som smeten i kakan. Här finns ingen liten positiv kärna i mitten."
      },
      {
        "title": "Ett försök med tunn guldfolie",
        "start": 65.7666666666655,
        "end": 82.79999999999787,
        "animation_seconds": 15.566666666665789,
        "wait_seconds": 1.4666666666665833,
        "automatic_reading_hold": 1.4333333333342182,
        "text": "Rutherfords grupp undersökte vad som hände när positivt laddade alfapartiklar träffade en mycket tunn guldfolie. En detektor visade i vilka riktningar partiklar kom ut. Alfapartiklarna är inte elektroner."
      },
      {
        "title": "De flesta gick rakt, några böjdes kraftigt",
        "start": 83.4666666666645,
        "end": 101.4999999999968,
        "animation_seconds": 16.766666666665714,
        "wait_seconds": 1.2666666666665947,
        "automatic_reading_hold": 1.2333333333342864,
        "text": "De flesta alfapartiklar passerade nästan rakt genom folien. Ett fåtal böjdes av kraftigt och några kunde vända tillbaka. De stora avböjningarna var särskilt viktiga ledtrådar. Vi visar utvalda banor, inte rätt antal."
      },
      {
        "title": "Positivt och positivt stöter bort varandra",
        "start": 102.16666666666343,
        "end": 119.1999999999958,
        "animation_seconds": 15.266666666665799,
        "wait_seconds": 1.7666666666665662,
        "automatic_reading_hold": 1.7333333333342011,
        "text": "En positiv alfapartikel påverkas starkt om den passerar nära en liten positiv kärna. Positiva laddningar stöter bort varandra. En partikel som passerar långt från kärnan påverkas mindre."
      },
      {
        "title": "Slutsatsen: en mycket liten positiv kärna",
        "start": 119.86666666666243,
        "end": 137.89999999999475,
        "animation_seconds": 16.36666666666575,
        "wait_seconds": 1.666666666666572,
        "automatic_reading_hold": 1.6333333333342495,
        "text": "Rutherfords kärnmodell samlar den positiva laddningen och nästan hela atomens massa i en mycket liten kärna. Det mesta av atomens volym är området runt kärnan. Kärnan är förstorad i våra bilder."
      },
      {
        "title": "En solsystemsliknelse – som jämförelse",
        "start": 138.56666666666138,
        "end": 158.59999999999357,
        "animation_seconds": 19.266666666665557,
        "wait_seconds": 0.7666666666666231,
        "automatic_reading_hold": 0.7333333333344285,
        "text": "I en historisk solsystemsliknelse motsvarar kärnan solen och elektronerna planeterna. Den hjälper oss att se en liten mitt och ett stort område omkring. Men den är inte en exakt beskrivning av en atom."
      },
      {
        "title": "Här slutar solsystemsliknelsen",
        "start": 159.2666666666602,
        "end": 175.29999999999262,
        "animation_seconds": 13.466666666665901,
        "wait_seconds": 2.5666666666665208,
        "automatic_reading_hold": 2.533333333334099,
        "text": "Gravitation håller planeter kring solen. I atomen verkar elektrisk attraktion mellan positiv kärna och negativa elektroner. Dagens atommodell beskriver inte elektroner som små planeter i bestämda banor."
      },
      {
        "title": "Bohr: elektronen kan ha bestämda energier",
        "start": 175.96666666665925,
        "end": 193.99999999999156,
        "animation_seconds": 16.066666666665753,
        "wait_seconds": 1.9666666666665549,
        "automatic_reading_hold": 1.9333333333342466,
        "text": "Bohrs modell lade till bestämda energinivåer. En elektron kan ta upp energi och visas på en högre nivå i modellen. När den går till en lägre nivå kan ljus avges. Nivåerna är inte vanliga planetbanor."
      },
      {
        "title": "Elektronmolnet visar sannolikhet",
        "start": 194.6666666666582,
        "end": 213.69999999999044,
        "animation_seconds": 17.16666666666569,
        "wait_seconds": 1.8666666666665606,
        "automatic_reading_hold": 1.8333333333343091,
        "text": "Dagens modell beskriver var en elektron sannolikt kan finnas. Prickarna bygger en sannolikhetsbild. De visar inte många elektroner samtidigt och inte en känd bana för en enda elektron. Molnet är inte rök."
      },
      {
        "title": "En modell måste passa det vi undersöker",
        "start": 214.36666666665707,
        "end": 231.39999999998943,
        "animation_seconds": 15.266666666665799,
        "wait_seconds": 1.7666666666665662,
        "automatic_reading_hold": 1.7333333333342011,
        "text": "Varje modell lyfter fram något och förenklar annat. Kulmodellen visar atomslag. Thomson visar elektroner, Rutherford en liten kärna, Bohr energinivåer och elektronmolnet sannolikhet. Nya resultat kan kräva en ny modell."
      },
      {
        "title": "Kan ni förklara modellens förändring?",
        "start": 232.06666666665606,
        "end": 250.09999999998837,
        "animation_seconds": 17.16666666666569,
        "wait_seconds": 0.8666666666666174,
        "automatic_reading_hold": 0.8333333333343091,
        "text": "Förklara vad guldfolieförsöket lärde oss. Beskriv sedan vad solsystemsliknelsen hjälper oss att se och var den slutar fungera. En bra förklaring kopplar modellen till observationer."
      }
    ],
    "spoken_seconds": 0,
    "max_voice_speed": 1,
    "version": 8,
    "threeD": true
  },
  "3": {
    "module": 3,
    "scene": "ElectronMaster",
    "file": "assets/films/v3/03-elektroner.mp4",
    "poster": "assets/posters/v3/03-elektroner.jpg",
    "captions": "assets/captions/v3/03-elektroner.vtt",
    "duration": 241.618367,
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "narration": false,
    "audio": true,
    "music": {
      "original": true,
      "source": "manim/compose_score.py",
      "credit": "Originalmusik för dessa filmer"
    },
    "animation_calls": 130,
    "chapters": [
      {
        "title": "Hur kan en neutral atom bli laddad?",
        "start": 0.9999999999999999,
        "end": 17.03333333333334,
        "animation_seconds": 14.466666666666622,
        "wait_seconds": 1.5666666666667162,
        "automatic_reading_hold": 1.5333333333333776,
        "text": "En atom kan bli en jon om antalet elektroner ändras. Vi följer samma natriumatom hela vägen och räknar vad som händer."
      },
      {
        "title": "Plus och minus kan ta ut varandra",
        "start": 17.70000000000004,
        "end": 33.70000000000065,
        "animation_seconds": 13.566666666667341,
        "wait_seconds": 2.4333333333332696,
        "automatic_reading_hold": 2.4333333333326586,
        "text": "Protonerna har positiv laddning och elektronerna negativ. I en neutral natriumatom finns elva protoner och elva elektroner. Då är den sammanlagda laddningen noll."
      },
      {
        "title": "Skalen är en förenklad skolmodell",
        "start": 34.36666666666728,
        "end": 50.3999999999997,
        "animation_seconds": 15.166666666665805,
        "wait_seconds": 0.8666666666666174,
        "automatic_reading_hold": 0.8333333333341955,
        "text": "Skalbilden hjälper oss att hålla reda på elektronerna. Den visar inte små planeter som går i bestämda banor. Natrium har fördelningen två, åtta och en."
      },
      {
        "title": "En elektron lämnar – kärnan finns kvar",
        "start": 51.06666666666633,
        "end": 67.09999999999876,
        "animation_seconds": 15.066666666665817,
        "wait_seconds": 0.9666666666666117,
        "automatic_reading_hold": 0.9333333333341827,
        "text": "Om natriumatomen lämnar ifrån sig en elektron finns fortfarande elva protoner kvar. Nu finns bara tio elektroner. Elva minus tio ger laddningen plus ett."
      },
      {
        "title": "En extra elektron ger negativ laddning",
        "start": 67.76666666666539,
        "end": 83.79999999999781,
        "animation_seconds": 15.466666666665787,
        "wait_seconds": 0.5666666666666345,
        "automatic_reading_hold": 0.5333333333342125,
        "text": "En kloratom har sjutton protoner. När den tar upp en elektron får den arton elektroner. Kärnan är oförändrad, men jonen får laddningen minus ett."
      },
      {
        "title": "Följ överföringen mellan två atomer",
        "start": 84.46666666666444,
        "end": 100.49999999999686,
        "animation_seconds": 14.766666666665827,
        "wait_seconds": 1.2666666666665947,
        "automatic_reading_hold": 1.2333333333341727,
        "text": "Här följer vi en elektron från natrium till klor. Pilen är ett sätt att visa överföringen, inte en uppmätt elektronbana. Atomerna blir en positiv och en negativ jon."
      },
      {
        "title": "Olika laddningar attraherar varandra",
        "start": 101.16666666666349,
        "end": 117.19999999999591,
        "animation_seconds": 14.466666666665844,
        "wait_seconds": 1.5666666666665776,
        "automatic_reading_hold": 1.5333333333341557,
        "text": "Den positiva natriumjonen och den negativa kloridjonen dras till varandra. Den elektriska attraktionen är viktig för jonbindning. Två likadant laddade joner stöter i stället bort varandra."
      },
      {
        "title": "I saltkristallen finns ett helt jongitter",
        "start": 117.86666666666254,
        "end": 133.89999999999498,
        "animation_seconds": 15.066666666665824,
        "wait_seconds": 0.9666666666666117,
        "automatic_reading_hold": 0.9333333333341756,
        "text": "Fast natriumklorid består av många positiva och negativa joner i ett regelbundet mönster. En jon påverkas av flera grannar. Det är inte en samling fristående NaCl-molekyler."
      },
      {
        "title": "Saltet är neutralt som helhet",
        "start": 134.5666666666616,
        "end": 150.59999999999403,
        "animation_seconds": 14.666666666665819,
        "wait_seconds": 1.366666666666589,
        "automatic_reading_hold": 1.333333333334167,
        "text": "Varje natriumjon har laddningen plus ett och varje kloridjon minus ett. I vanligt natriumklorid finns lika många av båda. Då tar laddningarna ut varandra i kristallen som helhet."
      },
      {
        "title": "Atomer kan också dela på elektroner",
        "start": 151.26666666666065,
        "end": 167.29999999999308,
        "animation_seconds": 14.966666666665816,
        "wait_seconds": 1.066666666666606,
        "automatic_reading_hold": 1.033333333334184,
        "text": "Jonbindning är inte det enda sättet att binda atomer. Två väteatomer kan i stället dela på ett elektronpar. Elektronerna bidrar då till att hålla de två atomkärnorna ihop."
      },
      {
        "title": "En bindning håller ihop en molekyl",
        "start": 167.9666666666597,
        "end": 183.99999999999213,
        "animation_seconds": 15.76666666666577,
        "wait_seconds": 0.2666666666666515,
        "automatic_reading_hold": 0.23333333333422956,
        "text": "Vätgas består av H₂-molekyler. Kulorna är en modell av atomerna och pinnen visar en bindning. När modellen vrids följer vi fortfarande samma två väteatomer."
      },
      {
        "title": "Lagom avstånd i en stabil bindning",
        "start": 184.66666666665876,
        "end": 200.69999999999118,
        "animation_seconds": 15.266666666665799,
        "wait_seconds": 0.7666666666666231,
        "automatic_reading_hold": 0.7333333333342011,
        "text": "I den här förenklade bilden visar kurvans dal ett stabilt avstånd. Atomerna kan röra sig kring det avståndet. Kurvan är en tankemodell, inte uppmätta värden för en viss molekyl."
      },
      {
        "title": "Överföring och delning är olika modeller",
        "start": 201.3666666666578,
        "end": 217.39999999999023,
        "animation_seconds": 14.566666666665839,
        "wait_seconds": 1.4666666666665833,
        "automatic_reading_hold": 1.4333333333341614,
        "text": "Vid jonbildning kan elektroner överföras och laddade joner bildas. I en elektronparbindning delar atomer på elektroner. I båda fallen deltar elektronerna; atomkärnornas protonantal ändras inte."
      },
      {
        "title": "Pröva resonemanget på en ny jon",
        "start": 218.06666666665686,
        "end": 234.09999999998928,
        "animation_seconds": 15.366666666665793,
        "wait_seconds": 0.6666666666666288,
        "automatic_reading_hold": 0.6333333333342068,
        "text": "En partikel har tolv protoner och tio elektroner. Räkna plus och minus. Vad är laddningen? Förklara också varför elektronerna kan ändra laddningen utan att atomslaget byts."
      }
    ],
    "spoken_seconds": 0,
    "max_voice_speed": 1,
    "version": 8,
    "threeD": true
  },
  "4": {
    "module": 4,
    "scene": "ReactionMaster",
    "file": "assets/films/v3/04-forandringar.mp4",
    "poster": "assets/posters/v3/04-forandringar.jpg",
    "captions": "assets/captions/v3/04-forandringar.vtt",
    "duration": 241.120317,
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "narration": false,
    "audio": true,
    "music": {
      "original": true,
      "source": "manim/compose_score.py",
      "credit": "Originalmusik för dessa filmer"
    },
    "animation_calls": 135,
    "chapters": [
      {
        "title": "Byter ämnet form, eller bildas ett nytt ämne?",
        "start": 0.9999999999999999,
        "end": 17.03333333333334,
        "animation_seconds": 15.266666666666634,
        "wait_seconds": 0.7666666666667048,
        "automatic_reading_hold": 0.7333333333333663,
        "text": "Is smälter, vatten kokar och kol kan reagera med syrgas. Allt förändras, men på olika sätt. Vi går från det vi kan se till en modell av partiklarna."
      },
      {
        "title": "Is och flytande vatten: samma molekyler",
        "start": 17.70000000000004,
        "end": 33.70000000000065,
        "animation_seconds": 15.166666666667329,
        "wait_seconds": 0.833333333333286,
        "automatic_reading_hold": 0.8333333333326749,
        "text": "Vi följer sex vattenmolekyler. I is har de bestämda platser och vibrerar. När isen smälter kan molekylerna röra sig förbi varandra. Vattenmolekylerna finns kvar."
      },
      {
        "title": "I gas finns större avstånd mellan molekylerna",
        "start": 34.36666666666728,
        "end": 50.3999999999997,
        "animation_seconds": 15.76666666666577,
        "wait_seconds": 0.2666666666666515,
        "automatic_reading_hold": 0.23333333333422956,
        "text": "När vattnet blir gas kan molekylerna röra sig fritt och är i genomsnitt längre från varandra. Molekylerna blir inte större och delas inte upp till H- och O-atomer."
      },
      {
        "title": "Bindningarna inuti H₂O finns kvar när is smälter",
        "start": 51.06666666666633,
        "end": 67.13333333333209,
        "animation_seconds": 16.066666666665768,
        "wait_seconds": 0.0,
        "automatic_reading_hold": 0,
        "text": "Pinnarna i kulmodellen visar bindningar inuti vattenmolekylen. När is smälter är det främst ordningen och samspelet mellan molekyler som ändras, inte vilka atomer som bygger varje H₂O."
      },
      {
        "title": "En kemisk reaktion börjar med ämnen",
        "start": 67.79999999999872,
        "end": 83.83333333333114,
        "animation_seconds": 15.266666666665799,
        "wait_seconds": 0.7666666666666231,
        "automatic_reading_hold": 0.7333333333342011,
        "text": "Här finns två vätemolekyler och en syrgasmolekyl. Modellen visar fyra H-atomer och två O-atomer. Nu ska vi hålla reda på varje atom när bindningarna förändras."
      },
      {
        "title": "Atomerna ordnas om till nya molekyler",
        "start": 83.83333333333114,
        "end": 99.86666666666356,
        "animation_seconds": 15.466666666665787,
        "wait_seconds": 0.5666666666666345,
        "automatic_reading_hold": 0.5333333333342125,
        "text": "Bindningar bryts och andra bindningar bildas. Samma sex atomer ordnas här till två vattenmolekyler. Banorna är ritade för att hjälpa oss att följa atomerna; detta är ingen instruktion till ett försök."
      },
      {
        "title": "Reaktionsformeln måste stämma med atomerna",
        "start": 100.53333333333019,
        "end": 116.56666666666261,
        "animation_seconds": 15.566666666665782,
        "wait_seconds": 0.46666666666664014,
        "automatic_reading_hold": 0.4333333333342182,
        "text": "Tvåan framför en formel räknar hela molekyler. Den lilla tvåan i H₂ räknar H-atomer i varje molekyl. På båda sidor måste antalet atomer av varje slag vara lika."
      },
      {
        "title": "Samma princip gäller när kol reagerar med syre",
        "start": 117.23333333332924,
        "end": 133.26666666666168,
        "animation_seconds": 15.666666666665776,
        "wait_seconds": 0.3666666666666458,
        "automatic_reading_hold": 0.33333333333420967,
        "text": "Kol kan reagera med syrgas och bilda koldioxid. En C-atom och två O-atomer blir en CO₂-molekyl. Det nya ämnet har andra egenskaper, men atomslagen och atomantalet finns kvar."
      },
      {
        "title": "En reaktion kan ta upp och ge ifrån sig energi",
        "start": 133.9333333333283,
        "end": 149.96666666666073,
        "animation_seconds": 15.866666666665765,
        "wait_seconds": 0.1666666666666572,
        "automatic_reading_hold": 0.13333333333423525,
        "text": "När bindningar förändras deltar energi. I det här förenklade exemplet behöver reaktionen först komma i gång och ger sedan energi till omgivningen. Alla reaktioner har inte samma energiförändring."
      },
      {
        "title": "I ett slutet system finns all materia kvar",
        "start": 150.63333333332736,
        "end": 166.66666666665978,
        "animation_seconds": 15.666666666665776,
        "wait_seconds": 0.3666666666666458,
        "automatic_reading_hold": 0.3333333333342239,
        "text": "Nu väger vi en stängd behållare tillsammans med allt innehåll. Partiklarna kan röra sig och ämnen kan reagera, men ingen materia passerar genom gränsen. Den totala massan är då densamma."
      },
      {
        "title": "Öppna gränsen – följ gasen som lämnar",
        "start": 167.3333333333264,
        "end": 183.36666666665883,
        "animation_seconds": 14.866666666665822,
        "wait_seconds": 1.1666666666666003,
        "automatic_reading_hold": 1.1333333333341784,
        "text": "Om gas lämnar en öppen behållare kan vågen visa mindre massa. Materian har inte försvunnit; en del finns nu utanför det vi väger. Siffrorna är ett tänkt exempel, inte mätningar."
      },
      {
        "title": "Bubblor är en ledtråd – inte ensamma ett bevis",
        "start": 184.03333333332546,
        "end": 200.06666666665788,
        "animation_seconds": 15.76666666666577,
        "wait_seconds": 0.2666666666666515,
        "automatic_reading_hold": 0.23333333333422956,
        "text": "Bubblor kan vara vattenånga när vatten kokar. Bubblor kan också vara en ny gas som bildas i en kemisk reaktion. För att avgöra vad som hänt måste vi undersöka vilka ämnen som finns."
      },
      {
        "title": "Färg och temperatur behöver också förklaras",
        "start": 200.7333333333245,
        "end": 216.89999999999026,
        "animation_seconds": 16.166666666665748,
        "wait_seconds": 0.0,
        "automatic_reading_hold": 0,
        "text": "En färg kan förändras när färgämnen blandas utan att nya ämnen bildas. Temperatur kan ändras både genom uppvärmning och genom reaktioner. Beskriv först vad ni ser och pröva sedan en förklaring."
      },
      {
        "title": "Bygg en förklaring som håller ihop",
        "start": 217.5666666666569,
        "end": 233.5999999999893,
        "animation_seconds": 15.866666666665765,
        "wait_seconds": 0.1666666666666572,
        "automatic_reading_hold": 0.13333333333423525,
        "text": "Fråga om samma ämne finns kvar eller om nya ämnen har bildats. Följ atomerna och håll reda på systemets gräns. Förklara sedan skillnaden mellan en fysisk förändring och en kemisk reaktion."
      }
    ],
    "spoken_seconds": 0,
    "max_voice_speed": 1,
    "version": 8,
    "threeD": true
  },
  "5": {
    "module": 5,
    "scene": "MaterialMaster",
    "file": "assets/films/v3/05-egenskaper.mp4",
    "poster": "assets/posters/v3/05-egenskaper.jpg",
    "captions": "assets/captions/v3/05-egenskaper.vtt?v=20261110-labs3",
    "duration": 257.920964,
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "narration": false,
    "audio": true,
    "music": {
      "original": true,
      "source": "manim/compose_score.py",
      "credit": "Originalmusik för dessa filmer"
    },
    "animation_calls": 105,
    "chapters": [
      {
        "title": "Varför fungerar olika material på olika sätt?",
        "start": 0.9999999999999999,
        "end": 19.03333333333337,
        "animation_seconds": 13.466666666666626,
        "wait_seconds": 4.566666666666745,
        "automatic_reading_hold": 1.533333333333374,
        "text": "Ett kastrullhandtag och kastrullens botten har olika uppgifter. Vi följer värme, laddning och partiklar för att förstå hur en egenskap kan göra ett material lämpligt. Modellerna är förenklade, inte mätdata."
      },
      {
        "title": "Ett rättvist test håller annat lika",
        "start": 19.70000000000007,
        "end": 37.700000000000514,
        "animation_seconds": 13.366666666667218,
        "wait_seconds": 4.633333333333226,
        "automatic_reading_hold": 1.833333333332785,
        "text": "Vi jämför lika långa stavar vid samma starttemperatur. De värms på samma sätt. Om vi samtidigt ändrar längd, tjocklek och material blir det svårt att veta vilken förändring som förklarar resultatet."
      },
      {
        "title": "Följ värmen genom materialet",
        "start": 38.36666666666714,
        "end": 56.399999999999636,
        "animation_seconds": 14.266666666665852,
        "wait_seconds": 3.7666666666666373,
        "automatic_reading_hold": 0.43333333333414714,
        "text": "I det här schemat sprids energi snabbare genom koppar än genom trä. Punkterna och pilarna visar en idé om värmeledning. Vi mäter inte en viss temperatur eller en exakt hastighet i den här animationen."
      },
      {
        "title": "Zooma in: ordnade delar och rörliga elektroner",
        "start": 57.066666666666265,
        "end": 76.09999999999852,
        "animation_seconds": 18.166666666665634,
        "wait_seconds": 0.8666666666666174,
        "automatic_reading_hold": 0.833333333334366,
        "text": "Metaller har elektroner som kan röra sig genom materialet. Det hjälper oss att förklara både elektrisk ledningsförmåga och en del av värmeledningen. Punkterna hjälper oss att följa hur energi sprids genom metallen."
      },
      {
        "title": "En elektrisk ledare skapar en sluten väg",
        "start": 76.76666666666515,
        "end": 95.79999999999754,
        "animation_seconds": 15.966666666665759,
        "wait_seconds": 3.0666666666666345,
        "automatic_reading_hold": 0.5333333333342409,
        "text": "Ström kan gå när det finns en sammanhängande ledande väg. Metall leder ström, medan många plaster isolerar. Isoleringen runt en sladd skyddar kontakten med den ledande metallen. Modellen visar långsam nettodrift, inte elektronernas verkliga hastighet."
      },
      {
        "title": "Löslighet: följ vad som lämnar kristallen",
        "start": 96.46666666666417,
        "end": 115.49999999999662,
        "animation_seconds": 15.366666666665793,
        "wait_seconds": 3.666666666666657,
        "automatic_reading_hold": 0.13333333333420683,
        "text": "När natriumklorid löser sig i vatten sprids natriumjoner och kloridjoner. Det är inte små saltmolekyler som glider isär. Jonerna finns kvar, men de lämnar kristallens ordnade mönster och omges av vatten."
      },
      {
        "title": "Vattenmolekyler omger jonerna",
        "start": 116.16666666666325,
        "end": 135.1999999999956,
        "animation_seconds": 15.366666666665793,
        "wait_seconds": 3.666666666666572,
        "automatic_reading_hold": 1.6333333333342068,
        "text": "Vattenmolekylen har en ojämn fördelning av laddning. I den här förstorade modellen vänder sig syresidan mot en positiv jon, och vätesidan mot en negativ jon. Vattenmolekylerna byter inte identitet när de omger jonerna."
      },
      {
        "title": "Densitet jämför massa med volym",
        "start": 135.86666666666224,
        "end": 154.8999999999946,
        "animation_seconds": 12.466666666665958,
        "wait_seconds": 6.566666666666407,
        "automatic_reading_hold": 0.5333333333342694,
        "text": "Två lika stora kuber kan ha olika massa. Därför är storlek inte samma sak som densitet. Här håller vi volymen lika och jämför massan. Båda kuberna har volymen hundra kubikcentimeter, men deras massor är hundra respektive tvåhundrasjuttio gram."
      },
      {
        "title": "Räkna samma jämförelse i två steg",
        "start": 155.56666666666123,
        "end": 173.59999999999374,
        "animation_seconds": 14.466666666665844,
        "wait_seconds": 3.5666666666666664,
        "automatic_reading_hold": 0.03333333333415567,
        "text": "Densitet är massa delad med volym. Första kuben ger ett gram per kubikcentimeter. Den andra ger två komma sju gram per kubikcentimeter. Den andra har större massa per samma volym och därför högre densitet."
      },
      {
        "title": "Ett föremåls form kan ändra medeldensiteten",
        "start": 174.26666666666037,
        "end": 193.29999999999285,
        "animation_seconds": 13.766666666665884,
        "wait_seconds": 5.266666666666595,
        "automatic_reading_hold": 1.2333333333341159,
        "text": "För att förstå om ett föremål flyter jämför vi också med vätskan. En kompakt metallbit och en ihålig metallbåt kan bete sig olika. Båten rymmer luft och får en lägre medeldensitet för hela sin yttre volym."
      },
      {
        "title": "Skilj en blandning med rätt egenskap",
        "start": 193.96666666665948,
        "end": 213.99999999999184,
        "animation_seconds": 16.366666666665736,
        "wait_seconds": 3.6666666666666288,
        "automatic_reading_hold": 0.6333333333342637,
        "text": "Vi kan skilja ämnen åt när de skiljer sig i någon användbar egenskap. Filtrering använder partikelstorlek. En magnet kan dra till sig järn. Vid indunstning lämnar vatten lösningen som gas, medan ett löst, icke flyktigt salt kan bli kvar."
      },
      {
        "title": "En bra förklaring kopplar ihop flera led",
        "start": 214.66666666665847,
        "end": 232.699999999991,
        "animation_seconds": 13.266666666665913,
        "wait_seconds": 4.766666666666623,
        "automatic_reading_hold": 0.7333333333340875,
        "text": "Ett material är inte bäst till allt. Förklara uppgiften, välj en viktig egenskap och beskriv följden. Kastrullens botten ska sprida värme till maten. Ett handtag ska samtidigt ge ett säkrare grepp."
      },
      {
        "title": "Pröva själv: förklara ett genomtänkt val",
        "start": 233.36666666665764,
        "end": 250.39999999999023,
        "animation_seconds": 12.466666666665958,
        "wait_seconds": 4.5666666666666345,
        "automatic_reading_hold": 0.533333333334042,
        "text": "Välj en vardagsprodukt. Beskriv minst två material i produkten och hur deras egenskaper hjälper till. Använd orden eftersom och därför. Tänk också på om ett enkelt test skulle kunna stödja din förklaring."
      }
    ],
    "spoken_seconds": 0,
    "max_voice_speed": 1,
    "version": 8,
    "threeD": true
  },
  "6": {
    "module": 6,
    "scene": "PhaseMaster",
    "file": "assets/films/v3/06-faser.mp4",
    "poster": "assets/posters/v3/06-faser.jpg",
    "captions": "assets/captions/v3/06-faser.vtt",
    "duration": 263.321,
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "narration": false,
    "audio": true,
    "music": {
      "original": true,
      "source": "manim/compose_score.py",
      "credit": "Originalmusik för dessa filmer"
    },
    "animation_calls": 110,
    "chapters": [
      {
        "title": "Följ samma tolv vattenmolekyler",
        "start": 0.9999999999999999,
        "end": 19.066666666666674,
        "animation_seconds": 16.066666666666674,
        "wait_seconds": 2.0,
        "automatic_reading_hold": 0,
        "text": "Vi följer samma tolv vattenmolekyler genom fast form, vätska och gas. Varje vattenmolekyl har två väteatomer och en syreatom. Molekylerna byter inte storlek eller atomslag när vattnet värms."
      },
      {
        "title": "Fast form: lägen som håller ihop",
        "start": 19.733333333333373,
        "end": 38.20000000000041,
        "animation_seconds": 16.466666666667034,
        "wait_seconds": 2.0,
        "automatic_reading_hold": 0,
        "text": "I is ligger molekylerna i en ordnad struktur. De är inte helt stilla: de kan vibrera kring sina lägen. Vi visar bara en liten och förenklad del av isens öppna struktur. Det finns mycket utrymme mellan molekylerna."
      },
      {
        "title": "Smältning: strukturen släpper fram rörelse",
        "start": 38.86666666666704,
        "end": 57.33333333333279,
        "animation_seconds": 16.066666666665753,
        "wait_seconds": 2.3999999999999986,
        "automatic_reading_hold": 0,
        "text": "När is smälter försvinner den fasta ordningen. Molekylerna kan nu röra sig förbi varandra. Det är fortfarande vattenmolekyler. Vi bevarar alla tolv och ändrar deras lägen och rörelser, inte deras storlek."
      },
      {
        "title": "Flytande vatten: nära men rörliga",
        "start": 57.99999999999942,
        "end": 77.46666666666509,
        "animation_seconds": 17.46666666666568,
        "wait_seconds": 2.0,
        "automatic_reading_hold": 0,
        "text": "I flytande vatten är molekylerna nära varandra, men grannarna kan ändras. Vatten fyller därför en behållares form. För just vatten är vätskans struktur tätare än isens öppna struktur, vilket bidrar till att is flyter."
      },
      {
        "title": "Gas: stora avstånd och fria vägar",
        "start": 78.13333333333172,
        "end": 97.59999999999728,
        "animation_seconds": 19.46666666666556,
        "wait_seconds": 0.0,
        "automatic_reading_hold": 0,
        "text": "I gasform är vattenmolekylerna i genomsnitt långt ifrån varandra och rör sig fritt mellan kollisionerna. De har inte svällt. När en gas får mer utrymme kan samma antal molekyler spridas över en större volym."
      },
      {
        "title": "Temperatur visar något om rörelsen",
        "start": 98.26666666666391,
        "end": 116.7333333333297,
        "animation_seconds": 15.466666666665787,
        "wait_seconds": 3.0,
        "automatic_reading_hold": 0,
        "text": "Högre temperatur hänger ihop med mer rörelse hos partiklarna. I den här jämförelsen använder vi samma antal och samma storlek. Snabbare rörelser får därför inte misstolkas som att molekylerna blir större eller att nya vattenmolekyler bildas."
      },
      {
        "title": "Energikurvan kopplar ihop två bilder",
        "start": 117.39999999999633,
        "end": 137.4333333333287,
        "animation_seconds": 16.79999999999906,
        "wait_seconds": 3.23333333333332,
        "automatic_reading_hold": 0.20000000000094076,
        "text": "Vi tillför energi till rent vatten vid normalt lufttryck. I vissa delar stiger temperaturen. Under smältning och kokning kan energin i stället ändra hur molekylerna hålls tillsammans. Då kan temperaturen vara ungefär konstant."
      },
      {
        "title": "En platå betyder inte att uppvärmningen har slutat",
        "start": 138.09999999999533,
        "end": 156.56666666666095,
        "animation_seconds": 18.466666666665603,
        "wait_seconds": 0.0,
        "automatic_reading_hold": 0,
        "text": "Vid en fasövergång kan energi fortsätta att tillföras utan att temperaturen stiger. Energin bidrar då till att ändra samspelet mellan molekylerna. Vi skiljer därför på tillförd energi, temperatur och vilket tillstånd ämnet befinner sig i."
      },
      {
        "title": "Avdunstning sker vid ytan",
        "start": 157.23333333332758,
        "end": 175.69999999999325,
        "animation_seconds": 17.36666666666568,
        "wait_seconds": 1.0999999999999943,
        "automatic_reading_hold": 0,
        "text": "Vatten kan avdunsta även när det inte kokar. En del molekyler kan lämna vätskans yta och bli gas. Därför kan en blöt tröja torka i ett rum utan att vattnet i tröjan kokar."
      },
      {
        "title": "Kokning sker i hela vätskan",
        "start": 176.36666666665988,
        "end": 194.83333333332567,
        "animation_seconds": 15.666666666665776,
        "wait_seconds": 2.8000000000000114,
        "automatic_reading_hold": 0,
        "text": "När vatten kokar bildas vattenånga även inne i vätskan. Bubblor med gas kan växa och stiga upp. Det är en viktig skillnad mot avdunstning, som sker från ytan. Kokpunkten beror också på trycket omkring vattnet."
      },
      {
        "title": "Osynlig ånga och synliga små droppar",
        "start": 195.4999999999923,
        "end": 215.53333333332455,
        "animation_seconds": 16.46666666666573,
        "wait_seconds": 3.5666666666665208,
        "automatic_reading_hold": 0.533333333334383,
        "text": "Vattenånga är en osynlig gas. Det vita molnet ovanför en kastrull består av mycket små vätskedroppar som bildats när gas kylts och kondenserat. Det synliga molnet är därför inte samma sak som själva vattenångan."
      },
      {
        "title": "Sex vägar mellan tre tillstånd",
        "start": 216.19999999999118,
        "end": 236.66666666665702,
        "animation_seconds": 14.466666666665844,
        "wait_seconds": 6.0,
        "automatic_reading_hold": 0,
        "text": "Smältning och stelning går mellan fast form och vätska. Förångning och kondensation går mellan vätska och gas. Sublimering och deposition går direkt mellan fast form och gas. Pilarna visar riktning, inte hur snabbt det går."
      },
      {
        "title": "Pröva en förklaring som bevarar byggstenarna",
        "start": 237.33333333332365,
        "end": 255.79999999998947,
        "animation_seconds": 14.966666666665816,
        "wait_seconds": 3.5,
        "automatic_reading_hold": 0,
        "text": "Förklara vad som ändras när is blir vatten och sedan gas. Ta med avstånd, ordning, rörelse och energi. Berätta också vad som är oförändrat: samma vattenmolekyler och samma atomer finns kvar i vår modell."
      }
    ],
    "spoken_seconds": 0,
    "max_voice_speed": 1,
    "version": 8,
    "threeD": true
  },
  "7": {
    "module": 7,
    "scene": "EnvironmentMaster",
    "file": "assets/films/v3/07-miljo.mp4",
    "poster": "assets/posters/v3/07-miljo.jpg",
    "captions": "assets/captions/v3/07-miljo.vtt",
    "duration": 275.154948,
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "narration": false,
    "audio": true,
    "music": {
      "original": true,
      "source": "manim/compose_score.py",
      "credit": "Originalmusik för dessa filmer"
    },
    "animation_calls": 114,
    "chapters": [
      {
        "title": "Giftfri miljö är inte en värld utan kemi",
        "start": 0.9999999999999999,
        "end": 19.466666666666622,
        "animation_seconds": 14.466666666666622,
        "wait_seconds": 4.0,
        "automatic_reading_hold": 0,
        "text": "Vatten, luft, trä och våra kroppar består av kemiska ämnen. En giftfri miljö handlar om att förebygga skadlig påverkan av farliga ämnen. Vi behöver därför undersöka både ämnets egenskaper och hur människor eller andra organismer utsätts."
      },
      {
        "title": "Skilj en fara från en risk",
        "start": 20.133333333333322,
        "end": 39.60000000000054,
        "animation_seconds": 12.46666666666722,
        "wait_seconds": 7.0,
        "automatic_reading_hold": 0,
        "text": "Fara beskriver att ett ämne kan orsaka skada. Risk handlar också om om en organism kan utsättas, hur mycket, på vilket sätt och hur länge. Samma ämne kan därför innebära olika risk i olika situationer."
      },
      {
        "title": "En möjlig källa: ett skadat batteri",
        "start": 40.26666666666717,
        "end": 59.29999999999966,
        "animation_seconds": 14.266666666665856,
        "wait_seconds": 4.766666666666637,
        "automatic_reading_hold": 0.5333333333341415,
        "text": "Vi använder ett skadat batteri som exempel på en möjlig källa. Om det läcker kan ämnen nå marken. Regn kan sedan föra en del vidare. Det är ett tänkt spridningsförlopp, inte något som sker likadant med alla batterier eller ämnen."
      },
      {
        "title": "Följ rörelsen genom ett vattendrag",
        "start": 59.96666666666629,
        "end": 80.4333333333318,
        "animation_seconds": 20.46666666666551,
        "wait_seconds": 0.0,
        "automatic_reading_hold": 0,
        "text": "Ett ämne kan transporteras med vatten och spridas över ett större område. De lila punkterna visar här ett tänkt löst ämne. Flödets form avgör vilken väg punkterna tar. Vi visar principen, inte en prognos för en verklig bäck."
      },
      {
        "title": "Kontakt är inte samma sak som upptag",
        "start": 81.09999999999843,
        "end": 100.5666666666641,
        "animation_seconds": 17.466666666665674,
        "wait_seconds": 2.0,
        "automatic_reading_hold": 0,
        "text": "En organism kan komma i kontakt med ett ämne via vatten, luft eller föda. En del av ämnet kan tas upp, medan annat kan passera eller lämna kroppen. Därför behöver vi veta mer än att ämnet finns någonstans i miljön."
      },
      {
        "title": "Bioackumulering följer samma organism över tid",
        "start": 101.23333333333073,
        "end": 121.69999999999646,
        "animation_seconds": 16.46666666666573,
        "wait_seconds": 4.0,
        "automatic_reading_hold": 0,
        "text": "Om ett ämne tas upp snabbare än det lämnar kroppen kan mängden i organismen öka med tiden. Det kallas bioackumulering. Vi följer nu samma fisk och samma vävnadsmängd, så att jämförelsen blir tydlig."
      },
      {
        "title": "Biomagnifikation jämför olika led i en näringskedja",
        "start": 122.3666666666631,
        "end": 143.83333333332882,
        "animation_seconds": 16.66666666666572,
        "wait_seconds": 4.800000000000011,
        "automatic_reading_hold": 0,
        "text": "Vissa svårnedbrytbara ämnen kan få högre halt längre upp i en näringskedja. Ett rovdjur äter många byten. Vi jämför lika stora mängder kroppsvävnad för att visa halten, inte bara större kroppar. Det här gäller vissa ämnen, inte alla."
      },
      {
        "title": "Två olika jämförelser ger två olika begrepp",
        "start": 144.49999999999545,
        "end": 163.96666666666135,
        "animation_seconds": 13.666666666665876,
        "wait_seconds": 5.800000000000011,
        "automatic_reading_hold": 0,
        "text": "Bioackumulering jämför samma organism vid olika tider. Biomagnifikation jämför halten mellan olika led i en näringskedja. Båda kan vara viktiga, men de beskriver inte samma fråga."
      },
      {
        "title": "Klart vatten kan behöva undersökas",
        "start": 164.63333333332798,
        "end": 184.09999999999374,
        "animation_seconds": 15.966666666665759,
        "wait_seconds": 3.5,
        "automatic_reading_hold": 0,
        "text": "Ett fotografi kan inte avslöja alla ämnen i ett vattenprov. Många lösta ämnen syns inte med ögonen. Därför samlar forskare in prover och analyserar dem. Det behövs information om ämnet och halten för att bedöma problemet."
      },
      {
        "title": "Rening hjälper – men tar inte bort allt",
        "start": 184.76666666666037,
        "end": 205.23333333332613,
        "animation_seconds": 16.166666666665748,
        "wait_seconds": 4.300000000000011,
        "automatic_reading_hold": 0,
        "text": "Avloppsrening kan minska många föroreningar, men olika ämnen kräver olika behandling. Ett vanligt reningsverk är inte byggt för att avlägsna alla mikroföroreningar. Därför behöver vi också minska oönskade ämnens utsläpp redan från början."
      },
      {
        "title": "Bryt spridningsvägen vid källan",
        "start": 205.89999999999276,
        "end": 226.36666666665852,
        "animation_seconds": 15.966666666665759,
        "wait_seconds": 4.5,
        "automatic_reading_hold": 0,
        "text": "Det är ofta lättare att förebygga spridning än att samla in ett ämne när det redan spridits i en sjö. Batterier lämnas till batteriinsamling. Då kan ämnen och material hanteras innan de riskerar att läcka till mark och vatten."
      },
      {
        "title": "Riskbedömning behöver flera frågor",
        "start": 227.03333333332515,
        "end": 247.49999999999082,
        "animation_seconds": 13.466666666665901,
        "wait_seconds": 6.999999999999773,
        "automatic_reading_hold": 0,
        "text": "Ett ämnes namn räcker inte för att förstå hela risken. Fråga vilket ämne det är, om det kan orsaka skada, hur mycket en organism utsätts för och på vilket sätt. Naturligt betyder inte automatiskt ofarligt."
      },
      {
        "title": "Bygg ett svar där varje pil förklaras",
        "start": 248.16666666665745,
        "end": 267.6333333333289,
        "animation_seconds": 14.36666666667142,
        "wait_seconds": 5.100000000000023,
        "automatic_reading_hold": 0,
        "text": "Ett utvecklat svar följer ett ämne från källa till möjlig följd och åtgärd. Beskriv också villkoren: om ämnet kan spridas, om en organism kan utsättas och vad åtgärden förändrar. Använd orden om, kan och därför."
      }
    ],
    "spoken_seconds": 0,
    "max_voice_speed": 1,
    "version": 8,
    "threeD": true
  }
};

// Generated from canonical LaTeX by tools/latex_content.py.
const latexText = [
  {
    "key": "module/1/title",
    "plain": "Atomer och molekyler",
    "tex": "Atomer och molekyler",
    "html": "Atomer och molekyler"
  },
  {
    "key": "module/1/shortTitle",
    "plain": "Atom & molekyl",
    "tex": "Atom \\& molekyl",
    "html": "Atom &amp; molekyl"
  },
  {
    "key": "module/1/pages",
    "plain": "s. 24–26",
    "tex": "s. 24--26",
    "html": "s. 24–26"
  },
  {
    "key": "module/1/goal",
    "plain": "Vi kan skilja på atom, molekyl och atomslag.",
    "tex": "Vi kan skilja på atom, molekyl och atomslag.",
    "html": "Vi kan skilja på atom, molekyl och atomslag."
  },
  {
    "key": "module/1/firstQuestion",
    "plain": "Är en atom och en molekyl samma sak? Skriv vad ni tror.",
    "tex": "Är en atom och en molekyl samma sak? Skriv vad ni tror.",
    "html": "Är en atom och en molekyl samma sak? Skriv vad ni tror."
  },
  {
    "key": "module/1/explanation/0",
    "plain": "En vattendroppe innehåller väldigt många vattenmolekyler. För att förstå hur en enda molekyl är byggd börjar vi med atomerna. En atom är en mycket liten byggsten. Det finns olika atomslag, alltså olika sorter av atomer. H betyder väte och O betyder syre.",
    "tex": "En vattendroppe innehåller väldigt många vattenmolekyler. För att förstå hur en enda molekyl är byggd börjar vi med atomerna. En atom är en mycket liten byggsten. Det finns olika atomslag, alltså olika sorter av atomer. H betyder väte och O betyder syre.",
    "html": "En vattendroppe innehåller väldigt många vattenmolekyler. För att förstå hur en enda molekyl är byggd börjar vi med atomerna. En atom är en mycket liten byggsten. Det finns olika atomslag, alltså olika sorter av atomer. H betyder väte och O betyder syre."
  },
  {
    "key": "module/1/explanation/1",
    "plain": "En molekyl består av två eller flera atomer som sitter ihop med kemiska bindningar. I en vattenmolekyl sitter två väteatomer och en syreatom ihop. Formeln H₂O berättar samma sak: den lilla tvåan hör till H. Vid O står ingen siffra, vilket betyder en syreatom.",
    "tex": "En molekyl består av två eller flera atomer som sitter ihop med kemiska bindningar. I en vattenmolekyl sitter två väteatomer och en syreatom ihop. Formeln \\(\\mathrm{H_2O}\\) berättar samma sak: den lilla tvåan hör till H. Vid O står ingen siffra, vilket betyder en syreatom.",
    "html": "En molekyl består av två eller flera atomer som sitter ihop med kemiska bindningar. I en vattenmolekyl sitter två väteatomer och en syreatom ihop. Formeln <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math> berättar samma sak: den lilla tvåan hör till H. Vid O står ingen siffra, vilket betyder en syreatom."
  },
  {
    "key": "module/1/explanation/2",
    "plain": "Räkna därför på två sätt. H₂O har tre atomer sammanlagt, men bara två atomslag: väte och syre. O₂ har två atomer och ett atomslag. Båda är molekyler. Vatten är också en kemisk förening, eftersom olika grundämnen är kemiskt bundna till varandra. Förklara med bilden: vilka atomer räknar ni, och vilka sorter finns?",
    "tex": "Räkna därför på två sätt. \\(\\mathrm{H_2O}\\) har tre atomer sammanlagt, men bara två atomslag: väte och syre. \\(\\mathrm{O_2}\\) har två atomer och ett atomslag. Båda är molekyler. Vatten är också en kemisk förening, eftersom olika grundämnen är kemiskt bundna till varandra. Förklara med bilden: vilka atomer räknar ni, och vilka sorter finns?",
    "html": "Räkna därför på två sätt. <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math> har tre atomer sammanlagt, men bara två atomslag: väte och syre. <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">O</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{O_2}</annotation></semantics></math> har två atomer och ett atomslag. Båda är molekyler. Vatten är också en kemisk förening, eftersom olika grundämnen är kemiskt bundna till varandra. Förklara med bilden: vilka atomer räknar ni, och vilka sorter finns?"
  },
  {
    "key": "module/1/figureAlt",
    "plain": "Modeller av vätemolekylen H₂, syremolekylen O₂ och vattenmolekylen H₂O. Bokstäver visar vilka atomslag som ingår.",
    "tex": "Modeller av vätemolekylen \\(\\mathrm{H_2}\\), syremolekylen \\(\\mathrm{O_2}\\) och vattenmolekylen \\(\\mathrm{H_2O}\\). Bokstäver visar vilka atomslag som ingår.",
    "html": "Modeller av vätemolekylen <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{H_2}</annotation></semantics></math>, syremolekylen <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">O</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{O_2}</annotation></semantics></math> och vattenmolekylen <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>. Bokstäver visar vilka atomslag som ingår."
  },
  {
    "key": "module/1/task",
    "plain": "Jämför O₂ och H₂O. Hur många atomer och hur många atomslag finns i varje molekyl? Förklara sedan skillnaden mellan en atom och en molekyl med egna ord.",
    "tex": "Jämför \\(\\mathrm{O_2}\\) och \\(\\mathrm{H_2O}\\). Hur många atomer och hur många atomslag finns i varje molekyl? Förklara sedan skillnaden mellan en atom och en molekyl med egna ord.",
    "html": "Jämför <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">O</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{O_2}</annotation></semantics></math> och <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>. Hur många atomer och hur många atomslag finns i varje molekyl? Förklara sedan skillnaden mellan en atom och en molekyl med egna ord."
  },
  {
    "key": "module/1/hint",
    "plain": "Räkna först alla atomkulor. Räkna sedan hur många olika bokstäver det finns.",
    "tex": "Räkna först alla atomkulor. Räkna sedan hur många olika bokstäver det finns.",
    "html": "Räkna först alla atomkulor. Räkna sedan hur många olika bokstäver det finns."
  },
  {
    "key": "module/1/example",
    "plain": "O₂ har två atomer av ett atomslag: syre. H₂O har tre atomer av två atomslag: väte och syre. En atom är en byggsten. En molekyl är flera atomer som sitter ihop med kemiska bindningar. En molekyl behöver alltså inte innehålla olika atomslag.",
    "tex": "\\(\\mathrm{O_2}\\) har två atomer av ett atomslag: syre. \\(\\mathrm{H_2O}\\) har tre atomer av två atomslag: väte och syre. En atom är en byggsten. En molekyl är flera atomer som sitter ihop med kemiska bindningar. En molekyl behöver alltså inte innehålla olika atomslag.",
    "html": "<math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">O</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{O_2}</annotation></semantics></math> har två atomer av ett atomslag: syre. <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math> har tre atomer av två atomslag: väte och syre. En atom är en byggsten. En molekyl är flera atomer som sitter ihop med kemiska bindningar. En molekyl behöver alltså inte innehålla olika atomslag."
  },
  {
    "key": "module/1/check/question",
    "plain": "Vilket påstående om en vattenmolekyl, H₂O, stämmer?",
    "tex": "Vilket påstående om en vattenmolekyl, \\(\\mathrm{H_2O}\\), stämmer?",
    "html": "Vilket påstående om en vattenmolekyl, <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>, stämmer?"
  },
  {
    "key": "module/1/check/options/0",
    "plain": "Den har två atomer av tre atomslag.",
    "tex": "Den har två atomer av tre atomslag.",
    "html": "Den har två atomer av tre atomslag."
  },
  {
    "key": "module/1/check/options/1",
    "plain": "Den har tre atomer av två atomslag.",
    "tex": "Den har tre atomer av två atomslag.",
    "html": "Den har tre atomer av två atomslag."
  },
  {
    "key": "module/1/check/options/2",
    "plain": "Den har tre atomer av tre atomslag.",
    "tex": "Den har tre atomer av tre atomslag.",
    "html": "Den har tre atomer av tre atomslag."
  },
  {
    "key": "module/1/check/feedback",
    "plain": "H₂O betyder två H-atomer och en O-atom. Det blir tre atomer, men bara två olika atomslag.",
    "tex": "\\(\\mathrm{H_2O}\\) betyder två H-atomer och en O-atom. Det blir tre atomer, men bara två olika atomslag.",
    "html": "<math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math> betyder två H-atomer och en O-atom. Det blir tre atomer, men bara två olika atomslag."
  },
  {
    "key": "module/1/stretch",
    "plain": "Varför är vatten en kemisk förening, medan syrgas, O₂, är ett grundämne?",
    "tex": "Varför är vatten en kemisk förening, medan syrgas, \\(\\mathrm{O_2}\\), är ett grundämne?",
    "html": "Varför är vatten en kemisk förening, medan syrgas, <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">O</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{O_2}</annotation></semantics></math>, är ett grundämne?"
  },
  {
    "key": "module/2/title",
    "plain": "Hur atommodellen har förändrats",
    "tex": "Hur atommodellen har förändrats",
    "html": "Hur atommodellen har förändrats"
  },
  {
    "key": "module/2/shortTitle",
    "plain": "Atommodeller",
    "tex": "Atommodeller",
    "html": "Atommodeller"
  },
  {
    "key": "module/2/pages",
    "plain": "s. 24",
    "tex": "s. 24",
    "html": "s. 24"
  },
  {
    "key": "module/2/goal",
    "plain": "Vi kan beskriva hur nya upptäckter kan förändra en modell.",
    "tex": "Vi kan beskriva hur nya upptäckter kan förändra en modell.",
    "html": "Vi kan beskriva hur nya upptäckter kan förändra en modell."
  },
  {
    "key": "module/2/firstQuestion",
    "plain": "Vad kan en kulmodell och en kärnmodell hjälpa oss att förstå om samma atom? Skriv er första tanke.",
    "tex": "Vad kan en kulmodell och en kärnmodell hjälpa oss att förstå om samma atom? Skriv er första tanke.",
    "html": "Vad kan en kulmodell och en kärnmodell hjälpa oss att förstå om samma atom? Skriv er första tanke."
  },
  {
    "key": "module/2/explanation/0",
    "plain": "Hur vet vi vad en atom innehåller? Forskare gör försök och bygger modeller som förklarar resultaten. Dalton beskrev atomen som en hel kula. När elektronen upptäcktes behövdes en modell med mindre delar inuti atomen. En elektron har negativ laddning.",
    "tex": "Hur vet vi vad en atom innehåller? Forskare gör försök och bygger modeller som förklarar resultaten. Dalton beskrev atomen som en hel kula. När elektronen upptäcktes behövdes en modell med mindre delar inuti atomen. En elektron har negativ laddning.",
    "html": "Hur vet vi vad en atom innehåller? Forskare gör försök och bygger modeller som förklarar resultaten. Dalton beskrev atomen som en hel kula. När elektronen upptäcktes behövdes en modell med mindre delar inuti atomen. En elektron har negativ laddning."
  },
  {
    "key": "module/2/explanation/1",
    "plain": "Thomsons modell från 1904 liknar en russinkaka. Russinen föreställer negativa elektroner. Smeten föreställer positiv laddning utspridd genom atomen. I Rutherfords modell från 1911 är den positiva laddningen i stället samlad i en liten kärna. Det förklarade varför några positiva partiklar böjdes av kraftigt när de sköts mot en tunn guldfolie.",
    "tex": "Thomsons modell från 1904 liknar en russinkaka. Russinen föreställer negativa elektroner. Smeten föreställer positiv laddning utspridd genom atomen. I Rutherfords modell från 1911 är den positiva laddningen i stället samlad i en liten kärna. Det förklarade varför några positiva partiklar böjdes av kraftigt när de sköts mot en tunn guldfolie.",
    "html": "Thomsons modell från 1904 liknar en russinkaka. Russinen föreställer negativa elektroner. Smeten föreställer positiv laddning utspridd genom atomen. I Rutherfords modell från 1911 är den positiva laddningen i stället samlad i en liten kärna. Det förklarade varför några positiva partiklar böjdes av kraftigt när de sköts mot en tunn guldfolie."
  },
  {
    "key": "module/2/explanation/2",
    "plain": "Bohrs modell från 1913 ordnar elektronerna på bestämda energinivåer, som vi visar med skal. Dagens elektronmoln visar var elektroner kan finnas. Tätare moln betyder större chans att hitta en elektron där. Jämför nu modellerna: var finns den positiva laddningen, och vilket försöksresultat hjälper modellen oss att förstå?",
    "tex": "Bohrs modell från 1913 ordnar elektronerna på bestämda energinivåer, som vi visar med skal. Dagens elektronmoln visar var elektroner kan finnas. Tätare moln betyder större chans att hitta en elektron där. Jämför nu modellerna: var finns den positiva laddningen, och vilket försöksresultat hjälper modellen oss att förstå?",
    "html": "Bohrs modell från 1913 ordnar elektronerna på bestämda energinivåer, som vi visar med skal. Dagens elektronmoln visar var elektroner kan finnas. Tätare moln betyder större chans att hitta en elektron där. Jämför nu modellerna: var finns den positiva laddningen, och vilket försöksresultat hjälper modellen oss att förstå?"
  },
  {
    "key": "module/2/figureAlt",
    "plain": "Atommodellens utveckling: Daltons hela kula, Thomsons russinkaka med utspridd positiv laddning, Rutherfords kärna, Bohrs energinivåer och ett elektronmoln.",
    "tex": "Atommodellens utveckling: Daltons hela kula, Thomsons russinkaka med utspridd positiv laddning, Rutherfords kärna, Bohrs energinivåer och ett elektronmoln.",
    "html": "Atommodellens utveckling: Daltons hela kula, Thomsons russinkaka med utspridd positiv laddning, Rutherfords kärna, Bohrs energinivåer och ett elektronmoln."
  },
  {
    "key": "module/2/task",
    "plain": "Jämför Thomsons russinkakemodell med Rutherfords kärnmodell. Var finns den positiva laddningen i varje modell? Förklara varför nya undersökningar kan göra att forskare ändrar en modell.",
    "tex": "Jämför Thomsons russinkakemodell med Rutherfords kärnmodell. Var finns den positiva laddningen i varje modell? Förklara varför nya undersökningar kan göra att forskare ändrar en modell.",
    "html": "Jämför Thomsons russinkakemodell med Rutherfords kärnmodell. Var finns den positiva laddningen i varje modell? Förklara varför nya undersökningar kan göra att forskare ändrar en modell."
  },
  {
    "key": "module/2/hint",
    "plain": "I russinkakemodellen finns positiv laddning utspridd i hela den positiva delen. I kärnmodellen är den samlad i en mycket liten kärna.",
    "tex": "I russinkakemodellen finns positiv laddning utspridd i hela den positiva delen. I kärnmodellen är den samlad i en mycket liten kärna.",
    "html": "I russinkakemodellen finns positiv laddning utspridd i hela den positiva delen. I kärnmodellen är den samlad i en mycket liten kärna."
  },
  {
    "key": "module/2/example",
    "plain": "I Thomsons modell motsvarar russinen negativa elektroner och kakan en utspridd positiv laddning. Där finns ingen liten central kärna. I Rutherfords modell är den positiva laddningen i stället koncentrerad till en mycket liten kärna. Modellen behövde ändras eftersom spridningsförsök visade stora avböjningar som den utspridda positiva laddningen inte kunde förklara.",
    "tex": "I Thomsons modell motsvarar russinen negativa elektroner och kakan en utspridd positiv laddning. Där finns ingen liten central kärna. I Rutherfords modell är den positiva laddningen i stället koncentrerad till en mycket liten kärna. Modellen behövde ändras eftersom spridningsförsök visade stora avböjningar som den utspridda positiva laddningen inte kunde förklara.",
    "html": "I Thomsons modell motsvarar russinen negativa elektroner och kakan en utspridd positiv laddning. Där finns ingen liten central kärna. I Rutherfords modell är den positiva laddningen i stället koncentrerad till en mycket liten kärna. Modellen behövde ändras eftersom spridningsförsök visade stora avböjningar som den utspridda positiva laddningen inte kunde förklara."
  },
  {
    "key": "module/2/check/question",
    "plain": "Varför kan en vetenskaplig modell behöva förändras?",
    "tex": "Varför kan en vetenskaplig modell behöva förändras?",
    "html": "Varför kan en vetenskaplig modell behöva förändras?"
  },
  {
    "key": "module/2/check/options/0",
    "plain": "Nya undersökningar ger kunskap som modellen behöver förklara.",
    "tex": "Nya undersökningar ger kunskap som modellen behöver förklara.",
    "html": "Nya undersökningar ger kunskap som modellen behöver förklara."
  },
  {
    "key": "module/2/check/options/1",
    "plain": "En äldre modell måste alltid vara helt oanvändbar.",
    "tex": "En äldre modell måste alltid vara helt oanvändbar.",
    "html": "En äldre modell måste alltid vara helt oanvändbar."
  },
  {
    "key": "module/2/check/options/2",
    "plain": "Atomer ändrar sin uppbyggnad när vi upptäcker något nytt.",
    "tex": "Atomer ändrar sin uppbyggnad när vi upptäcker något nytt.",
    "html": "Atomer ändrar sin uppbyggnad när vi upptäcker något nytt."
  },
  {
    "key": "module/2/check/feedback",
    "plain": "Det är vår kunskap och beskrivning som utvecklas. Atomerna förändras inte för att vi får ny kunskap om dem.",
    "tex": "Det är vår kunskap och beskrivning som utvecklas. Atomerna förändras inte för att vi får ny kunskap om dem.",
    "html": "Det är vår kunskap och beskrivning som utvecklas. Atomerna förändras inte för att vi får ny kunskap om dem."
  },
  {
    "key": "module/2/stretch",
    "plain": "Använd russinkakan för att förklara var elektronerna och den positiva laddningen finns i Thomsons modell. Vad förändras i Rutherfords modell?",
    "tex": "Använd russinkakan för att förklara var elektronerna och den positiva laddningen finns i Thomsons modell. Vad förändras i Rutherfords modell?",
    "html": "Använd russinkakan för att förklara var elektronerna och den positiva laddningen finns i Thomsons modell. Vad förändras i Rutherfords modell?"
  },
  {
    "key": "module/3/title",
    "plain": "Elektroner och kemiska reaktioner",
    "tex": "Elektroner och kemiska reaktioner",
    "html": "Elektroner och kemiska reaktioner"
  },
  {
    "key": "module/3/shortTitle",
    "plain": "Elektroner",
    "tex": "Elektroner",
    "html": "Elektroner"
  },
  {
    "key": "module/3/pages",
    "plain": "Provpunkt 3",
    "tex": "Provpunkt 3",
    "html": "Provpunkt 3"
  },
  {
    "key": "module/3/goal",
    "plain": "Vi kan förklara varför elektroner är viktiga när atomer binds ihop.",
    "tex": "Vi kan förklara varför elektroner är viktiga när atomer binds ihop.",
    "html": "Vi kan förklara varför elektroner är viktiga när atomer binds ihop."
  },
  {
    "key": "module/3/firstQuestion",
    "plain": "Vad tror ni kan förändras när atomer binds ihop: elektronerna, atomkärnorna eller båda?",
    "tex": "Vad tror ni kan förändras när atomer binds ihop: elektronerna, atomkärnorna eller båda?",
    "html": "Vad tror ni kan förändras när atomer binds ihop: elektronerna, atomkärnorna eller båda?"
  },
  {
    "key": "module/3/explanation/0",
    "plain": "Vad håller ihop atomerna i en molekyl? Titta först på laddningarna. Atomkärnan är positiv och elektronerna är negativa. Plus och minus dras till varandra. I en neutral atom tar laddningarna ut varandra. En väteatom har en positiv proton i kärnan och en negativ elektron.",
    "tex": "Vad håller ihop atomerna i en molekyl? Titta först på laddningarna. Atomkärnan är positiv och elektronerna är negativa. Plus och minus dras till varandra. I en neutral atom tar laddningarna ut varandra. En väteatom har en positiv proton i kärnan och en negativ elektron.",
    "html": "Vad håller ihop atomerna i en molekyl? Titta först på laddningarna. Atomkärnan är positiv och elektronerna är negativa. Plus och minus dras till varandra. I en neutral atom tar laddningarna ut varandra. En väteatom har en positiv proton i kärnan och en negativ elektron."
  },
  {
    "key": "module/3/explanation/1",
    "plain": "Två väteatomer kan dela två elektroner: ett gemensamt elektronpar. Elektronerna dras till båda de positiva kärnorna och hjälper till att hålla ihop atomerna. Då bildas vätemolekylen H₂. Följ delarna i bilden. Det finns två kärnor och två elektroner både före och efter att bindningen bildas.",
    "tex": "Två väteatomer kan dela två elektroner: ett gemensamt elektronpar. Elektronerna dras till båda de positiva kärnorna och hjälper till att hålla ihop atomerna. Då bildas vätemolekylen \\(\\mathrm{H_2}\\). Följ delarna i bilden. Det finns två kärnor och två elektroner både före och efter att bindningen bildas.",
    "html": "Två väteatomer kan dela två elektroner: ett gemensamt elektronpar. Elektronerna dras till båda de positiva kärnorna och hjälper till att hålla ihop atomerna. Då bildas vätemolekylen <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{H_2}</annotation></semantics></math>. Följ delarna i bilden. Det finns två kärnor och två elektroner både före och efter att bindningen bildas."
  },
  {
    "key": "module/3/explanation/2",
    "plain": "Vid vanliga kemiska reaktioner kan bindningar brytas och nya bindningar bildas. Elektroner kan delas eller flyttas mellan atomer. Atomkärnorna finns kvar. Därför är väte fortfarande väte och syre fortfarande syre, även när de ingår i ett nytt ämne. Förklara vad som förändras och visa samtidigt vilka delar som finns kvar.",
    "tex": "Vid vanliga kemiska reaktioner kan bindningar brytas och nya bindningar bildas. Elektroner kan delas eller flyttas mellan atomer. Atomkärnorna finns kvar. Därför är väte fortfarande väte och syre fortfarande syre, även när de ingår i ett nytt ämne. Förklara vad som förändras och visa samtidigt vilka delar som finns kvar.",
    "html": "Vid vanliga kemiska reaktioner kan bindningar brytas och nya bindningar bildas. Elektroner kan delas eller flyttas mellan atomer. Atomkärnorna finns kvar. Därför är väte fortfarande väte och syre fortfarande syre, även när de ingår i ett nytt ämne. Förklara vad som förändras och visa samtidigt vilka delar som finns kvar."
  },
  {
    "key": "module/3/figureAlt",
    "plain": "Två väteatomer delar ett elektronpar och bildar H₂. Bilden följer båda kärnorna och båda elektronerna genom bindningens bildning.",
    "tex": "Två väteatomer delar ett elektronpar och bildar \\(\\mathrm{H_2}\\). Bilden följer båda kärnorna och båda elektronerna genom bindningens bildning.",
    "html": "Två väteatomer delar ett elektronpar och bildar <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{H_2}</annotation></semantics></math>. Bilden följer båda kärnorna och båda elektronerna genom bindningens bildning."
  },
  {
    "key": "module/3/task",
    "plain": "Använd bilden av H₂. Förklara vad elektronerna gör när två väteatomer binds ihop. Förklara också vad som händer med de två atomkärnorna.",
    "tex": "Använd bilden av \\(\\mathrm{H_2}\\). Förklara vad elektronerna gör när två väteatomer binds ihop. Förklara också vad som händer med de två atomkärnorna.",
    "html": "Använd bilden av <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{H_2}</annotation></semantics></math>. Förklara vad elektronerna gör när två väteatomer binds ihop. Förklara också vad som händer med de två atomkärnorna."
  },
  {
    "key": "module/3/hint",
    "plain": "Ett gemensamt elektronpar betyder att två elektroner delas. Räkna kärnorna före och efter.",
    "tex": "Ett gemensamt elektronpar betyder att två elektroner delas. Räkna kärnorna före och efter.",
    "html": "Ett gemensamt elektronpar betyder att två elektroner delas. Räkna kärnorna före och efter."
  },
  {
    "key": "module/3/example",
    "plain": "När två väteatomer binds ihop kan de dela ett elektronpar. Elektronerna är då en del av bindningen mellan atomerna. De två kärnorna finns kvar och är fortfarande vätekärnor. Vid vanliga kemiska reaktioner kan bindningar förändras, men atomerna byter inte grundämne.",
    "tex": "När två väteatomer binds ihop kan de dela ett elektronpar. Elektronerna är då en del av bindningen mellan atomerna. De två kärnorna finns kvar och är fortfarande vätekärnor. Vid vanliga kemiska reaktioner kan bindningar förändras, men atomerna byter inte grundämne.",
    "html": "När två väteatomer binds ihop kan de dela ett elektronpar. Elektronerna är då en del av bindningen mellan atomerna. De två kärnorna finns kvar och är fortfarande vätekärnor. Vid vanliga kemiska reaktioner kan bindningar förändras, men atomerna byter inte grundämne."
  },
  {
    "key": "module/3/check/question",
    "plain": "Vad stämmer vid en vanlig kemisk reaktion?",
    "tex": "Vad stämmer vid en vanlig kemisk reaktion?",
    "html": "Vad stämmer vid en vanlig kemisk reaktion?"
  },
  {
    "key": "module/3/check/options/0",
    "plain": "Protoner flyttar mellan atomkärnorna och skapar nya grundämnen.",
    "tex": "Protoner flyttar mellan atomkärnorna och skapar nya grundämnen.",
    "html": "Protoner flyttar mellan atomkärnorna och skapar nya grundämnen."
  },
  {
    "key": "module/3/check/options/1",
    "plain": "Atomerna försvinner och ersätts av helt nya atomer.",
    "tex": "Atomerna försvinner och ersätts av helt nya atomer.",
    "html": "Atomerna försvinner och ersätts av helt nya atomer."
  },
  {
    "key": "module/3/check/options/2",
    "plain": "Elektroner och bindningar kan ordnas om, medan atomkärnorna finns kvar.",
    "tex": "Elektroner och bindningar kan ordnas om, medan atomkärnorna finns kvar.",
    "html": "Elektroner och bindningar kan ordnas om, medan atomkärnorna finns kvar."
  },
  {
    "key": "module/3/check/feedback",
    "plain": "Vanliga kemiska reaktioner handlar om elektroner och bindningar. Förändringar av atomkärnor hör till kärnreaktioner.",
    "tex": "Vanliga kemiska reaktioner handlar om elektroner och bindningar. Förändringar av atomkärnor hör till kärnreaktioner.",
    "html": "Vanliga kemiska reaktioner handlar om elektroner och bindningar. Förändringar av atomkärnor hör till kärnreaktioner."
  },
  {
    "key": "module/3/stretch",
    "plain": "H₂ är en molekyl men ingen kemisk förening. Vilket atomslag skulle behöva tillkomma för att ett nytt ämne ska kunna vara en kemisk förening? Ge ett exempel.",
    "tex": "\\(\\mathrm{H_2}\\) är en molekyl men ingen kemisk förening. Vilket atomslag skulle behöva tillkomma för att ett nytt ämne ska kunna vara en kemisk förening? Ge ett exempel.",
    "html": "<math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{H_2}</annotation></semantics></math> är en molekyl men ingen kemisk förening. Vilket atomslag skulle behöva tillkomma för att ett nytt ämne ska kunna vara en kemisk förening? Ge ett exempel."
  },
  {
    "key": "module/4/title",
    "plain": "Kemisk eller fysikalisk förändring?",
    "tex": "Kemisk eller fysikalisk förändring?",
    "html": "Kemisk eller fysikalisk förändring?"
  },
  {
    "key": "module/4/shortTitle",
    "plain": "Förändringar",
    "tex": "Förändringar",
    "html": "Förändringar"
  },
  {
    "key": "module/4/pages",
    "plain": "s. 33–34",
    "tex": "s. 33--34",
    "html": "s. 33–34"
  },
  {
    "key": "module/4/goal",
    "plain": "Vi kan avgöra om en förändring bildar nya ämnen.",
    "tex": "Vi kan avgöra om en förändring bildar nya ämnen.",
    "html": "Vi kan avgöra om en förändring bildar nya ämnen."
  },
  {
    "key": "module/4/firstQuestion",
    "plain": "Is smälter och järn rostar. Är det samma slags förändring? Skriv er första tanke.",
    "tex": "Is smälter och järn rostar. Är det samma slags förändring? Skriv er första tanke.",
    "html": "Is smälter och järn rostar. Är det samma slags förändring? Skriv er första tanke."
  },
  {
    "key": "module/4/explanation/0",
    "plain": "En isbit smälter på ett fat. Järn på en cykel börjar rosta. Båda förändras, men på olika sätt. Frågan som hjälper oss att skilja dem åt är: bildas nya ämnen? Börja med att säga vilket ämne som finns före förändringen och vilket som finns efter.",
    "tex": "En isbit smälter på ett fat. Järn på en cykel börjar rosta. Båda förändras, men på olika sätt. Frågan som hjälper oss att skilja dem åt är: bildas nya ämnen? Börja med att säga vilket ämne som finns före förändringen och vilket som finns efter.",
    "html": "En isbit smälter på ett fat. Järn på en cykel börjar rosta. Båda förändras, men på olika sätt. Frågan som hjälper oss att skilja dem åt är: bildas nya ämnen? Börja med att säga vilket ämne som finns före förändringen och vilket som finns efter."
  },
  {
    "key": "module/4/explanation/1",
    "plain": "När is smälter är ämnet vatten både före och efter. Vattenmolekylerna kan röra sig på ett nytt sätt, men de är fortfarande H₂O. Det är en fysikalisk förändring. När vatten kokar är det också en fysikalisk förändring: flytande vatten övergår till vattenånga.",
    "tex": "När is smälter är ämnet vatten både före och efter. Vattenmolekylerna kan röra sig på ett nytt sätt, men de är fortfarande \\(\\mathrm{H_2O}\\). Det är en fysikalisk förändring. När vatten kokar är det också en fysikalisk förändring: flytande vatten övergår till vattenånga.",
    "html": "När is smälter är ämnet vatten både före och efter. Vattenmolekylerna kan röra sig på ett nytt sätt, men de är fortfarande <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>. Det är en fysikalisk förändring. När vatten kokar är det också en fysikalisk förändring: flytande vatten övergår till vattenånga."
  },
  {
    "key": "module/4/explanation/2",
    "plain": "När järn rostar reagerar det med sin omgivning. Syre och fukt behövs för vanlig rostbildning. Då bildas nya ämnen med andra egenskaper än järnet. Det är en kemisk förändring. Ved som brinner är ett annat exempel. Förklara med orden nytt ämne. Bubblor eller en ny färg kan vara ledtrådar; jämför alltid ämnena före och efter.",
    "tex": "När järn rostar reagerar det med sin omgivning. Syre och fukt behövs för vanlig rostbildning. Då bildas nya ämnen med andra egenskaper än järnet. Det är en kemisk förändring. Ved som brinner är ett annat exempel. Förklara med orden nytt ämne. Bubblor eller en ny färg kan vara ledtrådar; jämför alltid ämnena före och efter.",
    "html": "När järn rostar reagerar det med sin omgivning. Syre och fukt behövs för vanlig rostbildning. Då bildas nya ämnen med andra egenskaper än järnet. Det är en kemisk förändring. Ved som brinner är ett annat exempel. Förklara med orden nytt ämne. Bubblor eller en ny färg kan vara ledtrådar; jämför alltid ämnena före och efter."
  },
  {
    "key": "module/4/figureAlt",
    "plain": "Jämförelse mellan smältande is, där vatten förblir vatten, och rostande järn, där ett nytt ämne bildas.",
    "tex": "Jämförelse mellan smältande is, där vatten förblir vatten, och rostande järn, där ett nytt ämne bildas.",
    "html": "Jämförelse mellan smältande is, där vatten förblir vatten, och rostande järn, där ett nytt ämne bildas."
  },
  {
    "key": "module/4/task",
    "plain": "Sortera is som smälter, järn som rostar, vatten som kokar och ved som brinner. Välj sedan ett exempel ur varje grupp och förklara med orden nytt ämne.",
    "tex": "Sortera is som smälter, järn som rostar, vatten som kokar och ved som brinner. Välj sedan ett exempel ur varje grupp och förklara med orden nytt ämne.",
    "html": "Sortera is som smälter, järn som rostar, vatten som kokar och ved som brinner. Välj sedan ett exempel ur varje grupp och förklara med orden nytt ämne."
  },
  {
    "key": "module/4/hint",
    "plain": "Aggregationstillstånd beskriver fast form, vätska och gas. Ett nytt tillstånd behöver inte betyda ett nytt ämne.",
    "tex": "Aggregationstillstånd beskriver fast form, vätska och gas. Ett nytt tillstånd behöver inte betyda ett nytt ämne.",
    "html": "Aggregationstillstånd beskriver fast form, vätska och gas. Ett nytt tillstånd behöver inte betyda ett nytt ämne."
  },
  {
    "key": "module/4/example",
    "plain": "Is som smälter och vatten som kokar är fysikaliska förändringar: ämnet är fortfarande vatten. Järn som rostar och ved som brinner är kemiska förändringar: nya ämnen bildas. Den viktigaste skillnaden är alltså inte om förändringen syns tydligt, utan om nya ämnen bildas.",
    "tex": "Is som smälter och vatten som kokar är fysikaliska förändringar: ämnet är fortfarande vatten. Järn som rostar och ved som brinner är kemiska förändringar: nya ämnen bildas. Den viktigaste skillnaden är alltså inte om förändringen syns tydligt, utan om nya ämnen bildas.",
    "html": "Is som smälter och vatten som kokar är fysikaliska förändringar: ämnet är fortfarande vatten. Järn som rostar och ved som brinner är kemiska förändringar: nya ämnen bildas. Den viktigaste skillnaden är alltså inte om förändringen syns tydligt, utan om nya ämnen bildas."
  },
  {
    "key": "module/4/check/question",
    "plain": "Varför är kokande vatten ett exempel på en fysikalisk förändring?",
    "tex": "Varför är kokande vatten ett exempel på en fysikalisk förändring?",
    "html": "Varför är kokande vatten ett exempel på en fysikalisk förändring?"
  },
  {
    "key": "module/4/check/options/0",
    "plain": "Vattnet är fortfarande vatten, men en del övergår till gas.",
    "tex": "Vattnet är fortfarande vatten, men en del övergår till gas.",
    "html": "Vattnet är fortfarande vatten, men en del övergår till gas."
  },
  {
    "key": "module/4/check/options/1",
    "plain": "Vattenmolekylerna delas upp i väte och syre.",
    "tex": "Vattenmolekylerna delas upp i väte och syre.",
    "html": "Vattenmolekylerna delas upp i väte och syre."
  },
  {
    "key": "module/4/check/options/2",
    "plain": "Alla förändringar som kräver värme är fysikaliska.",
    "tex": "Alla förändringar som kräver värme är fysikaliska.",
    "html": "Alla förändringar som kräver värme är fysikaliska."
  },
  {
    "key": "module/4/check/feedback",
    "plain": "Vid kokning finns vattenmolekylerna kvar. Vatten övergår från vätska till gas; det bildas inte väte och syre.",
    "tex": "Vid kokning finns vattenmolekylerna kvar. Vatten övergår från vätska till gas; det bildas inte väte och syre.",
    "html": "Vid kokning finns vattenmolekylerna kvar. Vatten övergår från vätska till gas; det bildas inte väte och syre."
  },
  {
    "key": "module/4/stretch",
    "plain": "Kan uppvärmning orsaka både en fysikalisk och en kemisk förändring? Ge två olika exempel.",
    "tex": "Kan uppvärmning orsaka både en fysikalisk och en kemisk förändring? Ge två olika exempel.",
    "html": "Kan uppvärmning orsaka både en fysikalisk och en kemisk förändring? Ge två olika exempel."
  },
  {
    "key": "module/5/title",
    "plain": "Olika ämnen har olika egenskaper",
    "tex": "Olika ämnen har olika egenskaper",
    "html": "Olika ämnen har olika egenskaper"
  },
  {
    "key": "module/5/shortTitle",
    "plain": "Egenskaper",
    "tex": "Egenskaper",
    "html": "Egenskaper"
  },
  {
    "key": "module/5/pages",
    "plain": "s. 35–39",
    "tex": "s. 35--39",
    "html": "s. 35–39"
  },
  {
    "key": "module/5/goal",
    "plain": "Vi kan använda egenskaper för att jämföra ämnen och välja material.",
    "tex": "Vi kan använda egenskaper för att jämföra ämnen och välja material.",
    "html": "Vi kan använda egenskaper för att jämföra ämnen och välja material."
  },
  {
    "key": "module/5/firstQuestion",
    "plain": "Två ämnen har samma färg. Måste det vara samma ämne? Förklara er tanke.",
    "tex": "Två ämnen har samma färg. Måste det vara samma ämne? Förklara er tanke.",
    "html": "Två ämnen har samma färg. Måste det vara samma ämne? Förklara er tanke."
  },
  {
    "key": "module/5/explanation/0",
    "plain": "En kastrulls botten ska föra värme till maten. Handtaget ska gå att hålla i. Därför behöver delarna olika egenskaper. En egenskap beskriver hur ett ämne eller material är och beter sig, till exempel om det leder värme bra eller dras till en magnet.",
    "tex": "En kastrulls botten ska föra värme till maten. Handtaget ska gå att hålla i. Därför behöver delarna olika egenskaper. En egenskap beskriver hur ett ämne eller material är och beter sig, till exempel om det leder värme bra eller dras till en magnet.",
    "html": "En kastrulls botten ska föra värme till maten. Handtaget ska gå att hålla i. Därför behöver delarna olika egenskaper. En egenskap beskriver hur ett ämne eller material är och beter sig, till exempel om det leder värme bra eller dras till en magnet."
  },
  {
    "key": "module/5/explanation/1",
    "plain": "Till botten väljer vi ett material som leder värme bra, till exempel en lämplig metall. Då kan värmen spridas till maten. Till handtaget behöver vi ett material som överför värme långsammare till handen. Det måste också tåla temperaturen och hålla när kastrullen lyfts. Materialvalet ska passa delens uppgift.",
    "tex": "Till botten väljer vi ett material som leder värme bra, till exempel en lämplig metall. Då kan värmen spridas till maten. Till handtaget behöver vi ett material som överför värme långsammare till handen. Det måste också tåla temperaturen och hålla när kastrullen lyfts. Materialvalet ska passa delens uppgift.",
    "html": "Till botten väljer vi ett material som leder värme bra, till exempel en lämplig metall. Då kan värmen spridas till maten. Till handtaget behöver vi ett material som överför värme långsammare till handen. Det måste också tåla temperaturen och hålla när kastrullen lyfts. Materialvalet ska passa delens uppgift."
  },
  {
    "key": "module/5/explanation/2",
    "plain": "Egenskaper hjälper oss även att jämföra ämnen. Järn dras tydligt till en vanlig magnet, medan koppar inte gör det. Båda leder elektricitet. Välj alltså ett test som visar en skillnad. Två ämnen kan ha samma färg, så flera undersökningar kan behövas. Smaka aldrig på okända prov.",
    "tex": "Egenskaper hjälper oss även att jämföra ämnen. Järn dras tydligt till en vanlig magnet, medan koppar inte gör det. Båda leder elektricitet. Välj alltså ett test som visar en skillnad. Två ämnen kan ha samma färg, så flera undersökningar kan behövas. Smaka aldrig på okända prov.",
    "html": "Egenskaper hjälper oss även att jämföra ämnen. Järn dras tydligt till en vanlig magnet, medan koppar inte gör det. Båda leder elektricitet. Välj alltså ett test som visar en skillnad. Två ämnen kan ha samma färg, så flera undersökningar kan behövas. Smaka aldrig på okända prov."
  },
  {
    "key": "module/5/figureAlt",
    "plain": "Kastrullens botten leder värme till maten, medan handtaget överför värme långsammare till handen. Ritningen jämför värmespridning i koppar och trä.",
    "tex": "Kastrullens botten leder värme till maten, medan handtaget överför värme långsammare till handen. Ritningen jämför värmespridning i koppar och trä.",
    "html": "Kastrullens botten leder värme till maten, medan handtaget överför värme långsammare till handen. Ritningen jämför värmespridning i koppar och trä."
  },
  {
    "key": "module/5/task",
    "plain": "Ni ska välja material till en kastrulls botten och till dess handtag. Vilken egenskap är viktig för botten och vilken för handtaget? Förklara varför.",
    "tex": "Ni ska välja material till en kastrulls botten och till dess handtag. Vilken egenskap är viktig för botten och vilken för handtaget? Förklara varför.",
    "html": "Ni ska välja material till en kastrulls botten och till dess handtag. Vilken egenskap är viktig för botten och vilken för handtaget? Förklara varför."
  },
  {
    "key": "module/5/hint",
    "plain": "Värmen ska lätt nå maten genom botten. Vad vill ni ska hända med värmen på vägen till handen?",
    "tex": "Värmen ska lätt nå maten genom botten. Vad vill ni ska hända med värmen på vägen till handen?",
    "html": "Värmen ska lätt nå maten genom botten. Vad vill ni ska hända med värmen på vägen till handen?"
  },
  {
    "key": "module/5/example",
    "plain": "Kastrullens botten behöver leda värme bra så att maten kan värmas effektivt. Handtaget behöver leda värme dåligt så att handen inte lika lätt blir varm. Materialen behöver också tåla temperaturen där de används. Olika delar kan därför behöva material med olika egenskaper.",
    "tex": "Kastrullens botten behöver leda värme bra så att maten kan värmas effektivt. Handtaget behöver leda värme dåligt så att handen inte lika lätt blir varm. Materialen behöver också tåla temperaturen där de används. Olika delar kan därför behöva material med olika egenskaper.",
    "html": "Kastrullens botten behöver leda värme bra så att maten kan värmas effektivt. Handtaget behöver leda värme dåligt så att handen inte lika lätt blir varm. Materialen behöver också tåla temperaturen där de används. Olika delar kan därför behöva material med olika egenskaper."
  },
  {
    "key": "module/5/check/question",
    "plain": "Ni vet att ett prov är antingen järn eller koppar. Vilken undersökning kan skilja dem åt?",
    "tex": "Ni vet att ett prov är antingen järn eller koppar. Vilken undersökning kan skilja dem åt?",
    "html": "Ni vet att ett prov är antingen järn eller koppar. Vilken undersökning kan skilja dem åt?"
  },
  {
    "key": "module/5/check/options/0",
    "plain": "Bara kontrollera om provet leder elektricitet: båda är metaller.",
    "tex": "Bara kontrollera om provet leder elektricitet: båda är metaller.",
    "html": "Bara kontrollera om provet leder elektricitet: båda är metaller."
  },
  {
    "key": "module/5/check/options/1",
    "plain": "Undersöka om provet dras tydligt till en vanlig magnet: järn gör det, koppar gör det inte.",
    "tex": "Undersöka om provet dras tydligt till en vanlig magnet: järn gör det, koppar gör det inte.",
    "html": "Undersöka om provet dras tydligt till en vanlig magnet: järn gör det, koppar gör det inte."
  },
  {
    "key": "module/5/check/options/2",
    "plain": "Smaka på provet för att känna igen metallen.",
    "tex": "Smaka på provet för att känna igen metallen.",
    "html": "Smaka på provet för att känna igen metallen."
  },
  {
    "key": "module/5/check/feedback",
    "plain": "Järn dras tydligt till en vanlig magnet, medan koppar inte gör det. Båda leder elektricitet, så just det testet skiljer inte dessa två åt. Smaka aldrig på okända prov.",
    "tex": "Järn dras tydligt till en vanlig magnet, medan koppar inte gör det. Båda leder elektricitet, så just det testet skiljer inte dessa två åt. Smaka aldrig på okända prov.",
    "html": "Järn dras tydligt till en vanlig magnet, medan koppar inte gör det. Båda leder elektricitet, så just det testet skiljer inte dessa två åt. Smaka aldrig på okända prov."
  },
  {
    "key": "module/5/stretch",
    "plain": "Varför räcker det inte alltid att ett material är bra på att leda värme? Nämn en annan egenskap som kan vara viktig i en kastrull.",
    "tex": "Varför räcker det inte alltid att ett material är bra på att leda värme? Nämn en annan egenskap som kan vara viktig i en kastrull.",
    "html": "Varför räcker det inte alltid att ett material är bra på att leda värme? Nämn en annan egenskap som kan vara viktig i en kastrull."
  },
  {
    "key": "module/6/title",
    "plain": "Värme, rörelse och fasförändringar",
    "tex": "Värme, rörelse och fasförändringar",
    "html": "Värme, rörelse och fasförändringar"
  },
  {
    "key": "module/6/shortTitle",
    "plain": "Värme & faser",
    "tex": "Värme \\& faser",
    "html": "Värme &amp; faser"
  },
  {
    "key": "module/6/pages",
    "plain": "s. 36–37",
    "tex": "s. 36--37",
    "html": "s. 36–37"
  },
  {
    "key": "module/6/goal",
    "plain": "Vi kan beskriva vatten som is, vätska och gas med en partikelmodell.",
    "tex": "Vi kan beskriva vatten som is, vätska och gas med en partikelmodell.",
    "html": "Vi kan beskriva vatten som is, vätska och gas med en partikelmodell."
  },
  {
    "key": "module/6/firstQuestion",
    "plain": "När vatten blir vattenånga: försvinner vattenmolekylerna, ändras de eller händer något annat?",
    "tex": "När vatten blir vattenånga: försvinner vattenmolekylerna, ändras de eller händer något annat?",
    "html": "När vatten blir vattenånga: försvinner vattenmolekylerna, ändras de eller händer något annat?"
  },
  {
    "key": "module/6/explanation/0",
    "plain": "En isbit, vatten i ett glas och vattenånga består av samma sorts molekyler: H₂O. Varje vattenmolekyl har två väteatomer och en syreatom. Följ en markerad molekyl i filmen. Dess atomer sitter ihop när vattnet byter tillstånd.",
    "tex": "En isbit, vatten i ett glas och vattenånga består av samma sorts molekyler: \\(\\mathrm{H_2O}\\). Varje vattenmolekyl har två väteatomer och en syreatom. Följ en markerad molekyl i filmen. Dess atomer sitter ihop när vattnet byter tillstånd.",
    "html": "En isbit, vatten i ett glas och vattenånga består av samma sorts molekyler: <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>. Varje vattenmolekyl har två väteatomer och en syreatom. Följ en markerad molekyl i filmen. Dess atomer sitter ihop när vattnet byter tillstånd."
  },
  {
    "key": "module/6/explanation/1",
    "plain": "I is vibrerar molekylerna kring bestämda platser i en öppen struktur. När isen smälter kan de röra sig förbi varandra: vattnet kan rinna. I vattenånga är avstånden mellan molekylerna mycket större. Molekylerna rör sig fritt mellan kollisionerna. Uppvärmning kan få dem att röra sig mer eller få vattnet att byta tillstånd.",
    "tex": "I is vibrerar molekylerna kring bestämda platser i en öppen struktur. När isen smälter kan de röra sig förbi varandra: vattnet kan rinna. I vattenånga är avstånden mellan molekylerna mycket större. Molekylerna rör sig fritt mellan kollisionerna. Uppvärmning kan få dem att röra sig mer eller få vattnet att byta tillstånd.",
    "html": "I is vibrerar molekylerna kring bestämda platser i en öppen struktur. När isen smälter kan de röra sig förbi varandra: vattnet kan rinna. I vattenånga är avstånden mellan molekylerna mycket större. Molekylerna rör sig fritt mellan kollisionerna. Uppvärmning kan få dem att röra sig mer eller få vattnet att byta tillstånd."
  },
  {
    "key": "module/6/explanation/2",
    "plain": "Smältning betyder fast form till vätska. Förångning betyder vätska till gas. När gas blir vätska kallas det kondensation, som dropparna på utsidan av ett kallt glas. Vattenånga är osynlig; det vita molnet vid en kastrull består av små vattendroppar. Förklara vad som ändras mellan molekylerna och vad som finns kvar i varje molekyl.",
    "tex": "Smältning betyder fast form till vätska. Förångning betyder vätska till gas. När gas blir vätska kallas det kondensation, som dropparna på utsidan av ett kallt glas. Vattenånga är osynlig; det vita molnet vid en kastrull består av små vattendroppar. Förklara vad som ändras mellan molekylerna och vad som finns kvar i varje molekyl.",
    "html": "Smältning betyder fast form till vätska. Förångning betyder vätska till gas. När gas blir vätska kallas det kondensation, som dropparna på utsidan av ett kallt glas. Vattenånga är osynlig; det vita molnet vid en kastrull består av små vattendroppar. Förklara vad som ändras mellan molekylerna och vad som finns kvar i varje molekyl."
  },
  {
    "key": "module/6/figureAlt",
    "plain": "Samma antal vattenmolekyler i isens öppna struktur, tätare i flytande vatten och mycket glest i vattenånga. Pilar visar partiklarnas rörelse.",
    "tex": "Samma antal vattenmolekyler i isens öppna struktur, tätare i flytande vatten och mycket glest i vattenånga. Pilar visar partiklarnas rörelse.",
    "html": "Samma antal vattenmolekyler i isens öppna struktur, tätare i flytande vatten och mycket glest i vattenånga. Pilar visar partiklarnas rörelse."
  },
  {
    "key": "module/6/task",
    "plain": "Jämför modellerna av is, flytande vatten och vattenånga. Vad förändras i molekylernas placering och rörelse? Vad är oförändrat hos själva vattenmolekylerna?",
    "tex": "Jämför modellerna av is, flytande vatten och vattenånga. Vad förändras i molekylernas placering och rörelse? Vad är oförändrat hos själva vattenmolekylerna?",
    "html": "Jämför modellerna av is, flytande vatten och vattenånga. Vad förändras i molekylernas placering och rörelse? Vad är oförändrat hos själva vattenmolekylerna?"
  },
  {
    "key": "module/6/hint",
    "plain": "Titta på avstånden och rörelsepilarna. Varje vattenmolekyl har fortfarande två H och ett O.",
    "tex": "Titta på avstånden och rörelsepilarna. Varje vattenmolekyl har fortfarande två H och ett O.",
    "html": "Titta på avstånden och rörelsepilarna. Varje vattenmolekyl har fortfarande två H och ett O."
  },
  {
    "key": "module/6/example",
    "plain": "I is vibrerar vattenmolekylerna i en öppen, ordnad struktur. I flytande vatten ligger de närmare varandra och kan röra sig förbi varandra. I vattenånga är avstånden mycket större. Själva molekylerna är fortfarande H₂O; de har varken blivit större, försvunnit eller delats upp i andra ämnen.",
    "tex": "I is vibrerar vattenmolekylerna i en öppen, ordnad struktur. I flytande vatten ligger de närmare varandra och kan röra sig förbi varandra. I vattenånga är avstånden mycket större. Själva molekylerna är fortfarande \\(\\mathrm{H_2O}\\); de har varken blivit större, försvunnit eller delats upp i andra ämnen.",
    "html": "I is vibrerar vattenmolekylerna i en öppen, ordnad struktur. I flytande vatten ligger de närmare varandra och kan röra sig förbi varandra. I vattenånga är avstånden mycket större. Själva molekylerna är fortfarande <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>; de har varken blivit större, försvunnit eller delats upp i andra ämnen."
  },
  {
    "key": "module/6/check/question",
    "plain": "Vad händer med vattenmolekylerna när flytande vatten förångas?",
    "tex": "Vad händer med vattenmolekylerna när flytande vatten förångas?",
    "html": "Vad händer med vattenmolekylerna när flytande vatten förångas?"
  },
  {
    "key": "module/6/check/options/0",
    "plain": "Varje molekyl sväller och blir större.",
    "tex": "Varje molekyl sväller och blir större.",
    "html": "Varje molekyl sväller och blir större."
  },
  {
    "key": "module/6/check/options/1",
    "plain": "De delas upp till väte och syre.",
    "tex": "De delas upp till väte och syre.",
    "html": "De delas upp till väte och syre."
  },
  {
    "key": "module/6/check/options/2",
    "plain": "De är fortfarande H₂O, men befinner sig mycket längre ifrån varandra.",
    "tex": "De är fortfarande \\(\\mathrm{H_2O}\\), men befinner sig mycket längre ifrån varandra.",
    "html": "De är fortfarande <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>, men befinner sig mycket längre ifrån varandra."
  },
  {
    "key": "module/6/check/feedback",
    "plain": "Avstånden mellan molekylerna ökar kraftigt i gas. Det är fortfarande vattenmolekyler, H₂O.",
    "tex": "Avstånden mellan molekylerna ökar kraftigt i gas. Det är fortfarande vattenmolekyler, \\(\\mathrm{H_2O}\\).",
    "html": "Avstånden mellan molekylerna ökar kraftigt i gas. Det är fortfarande vattenmolekyler, <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>."
  },
  {
    "key": "module/6/stretch",
    "plain": "Varför kan is flyta på vatten trots att is är vatten i fast form? Använd bilden och ordet densitet.",
    "tex": "Varför kan is flyta på vatten trots att is är vatten i fast form? Använd bilden och ordet densitet.",
    "html": "Varför kan is flyta på vatten trots att is är vatten i fast form? Använd bilden och ordet densitet."
  },
  {
    "key": "module/7/title",
    "plain": "Varför strävar vi efter en giftfri miljö?",
    "tex": "Varför strävar vi efter en giftfri miljö?",
    "html": "Varför strävar vi efter en giftfri miljö?"
  },
  {
    "key": "module/7/shortTitle",
    "plain": "Giftfri miljö",
    "tex": "Giftfri miljö",
    "html": "Giftfri miljö"
  },
  {
    "key": "module/7/pages",
    "plain": "s. 28–29",
    "tex": "s. 28--29",
    "html": "s. 28–29"
  },
  {
    "key": "module/7/goal",
    "plain": "Vi kan beskriva hur skadliga ämnen kan spridas och hur vi kan minska spridningen.",
    "tex": "Vi kan beskriva hur skadliga ämnen kan spridas och hur vi kan minska spridningen.",
    "html": "Vi kan beskriva hur skadliga ämnen kan spridas och hur vi kan minska spridningen."
  },
  {
    "key": "module/7/firstQuestion",
    "plain": "Ett gammalt batteri ligger vid en bäck. Spelar det någon roll om ingen människa rör batteriet?",
    "tex": "Ett gammalt batteri ligger vid en bäck. Spelar det någon roll om ingen människa rör batteriet?",
    "html": "Ett gammalt batteri ligger vid en bäck. Spelar det någon roll om ingen människa rör batteriet?"
  },
  {
    "key": "module/7/explanation/0",
    "plain": "Ett batteri ligger vid en bäck. Varför ska det lämnas till insamling även om ingen rör det? Om batteriet skadas och börjar läcka kan ämnen komma ut i marken. Regn och rinnande vatten kan sedan föra ämnen vidare till bäcken.",
    "tex": "Ett batteri ligger vid en bäck. Varför ska det lämnas till insamling även om ingen rör det? Om batteriet skadas och börjar läcka kan ämnen komma ut i marken. Regn och rinnande vatten kan sedan föra ämnen vidare till bäcken.",
    "html": "Ett batteri ligger vid en bäck. Varför ska det lämnas till insamling även om ingen rör det? Om batteriet skadas och börjar läcka kan ämnen komma ut i marken. Regn och rinnande vatten kan sedan föra ämnen vidare till bäcken."
  },
  {
    "key": "module/7/explanation/1",
    "plain": "Djur och växter kan komma i kontakt med ämnena genom vattnet eller födan. Den kontakten kallas exponering. Vissa ämnen kan skada organismer, alltså levande varelser. Hur stor risken blir beror bland annat på vilket ämne det är, mängden och hur organismen utsätts. Ett möjligt förlopp behöver därför förklaras steg för steg.",
    "tex": "Djur och växter kan komma i kontakt med ämnena genom vattnet eller födan. Den kontakten kallas exponering. Vissa ämnen kan skada organismer, alltså levande varelser. Hur stor risken blir beror bland annat på vilket ämne det är, mängden och hur organismen utsätts. Ett möjligt förlopp behöver därför förklaras steg för steg.",
    "html": "Djur och växter kan komma i kontakt med ämnena genom vattnet eller födan. Den kontakten kallas exponering. Vissa ämnen kan skada organismer, alltså levande varelser. Hur stor risken blir beror bland annat på vilket ämne det är, mängden och hur organismen utsätts. Ett möjligt förlopp behöver därför förklaras steg för steg."
  },
  {
    "key": "module/7/explanation/2",
    "plain": "Batteriinsamling hjälper oss att ta hand om batteriet innan ämnen sprids från det. Använd kedjan källa → spridningsväg → organism → möjlig följd. Lägg sedan till en åtgärd. Säg till exempel: Om batteriet läcker kan ämnen följa med vatten till bäcken. Därför lämnar vi det till insamling. Förklara både vad som kan hända och varför åtgärden hjälper.",
    "tex": "Batteriinsamling hjälper oss att ta hand om batteriet innan ämnen sprids från det. Använd kedjan källa \\(\\rightarrow\\) spridningsväg \\(\\rightarrow\\) organism \\(\\rightarrow\\) möjlig följd. Lägg sedan till en åtgärd. Säg till exempel: Om batteriet läcker kan ämnen följa med vatten till bäcken. Därför lämnar vi det till insamling. Förklara både vad som kan hända och varför åtgärden hjälper.",
    "html": "Batteriinsamling hjälper oss att ta hand om batteriet innan ämnen sprids från det. Använd kedjan källa <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mo>→</mo><annotation encoding=\"application/x-tex\">\\rightarrow</annotation></semantics></math> spridningsväg <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mo>→</mo><annotation encoding=\"application/x-tex\">\\rightarrow</annotation></semantics></math> organism <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mo>→</mo><annotation encoding=\"application/x-tex\">\\rightarrow</annotation></semantics></math> möjlig följd. Lägg sedan till en åtgärd. Säg till exempel: Om batteriet läcker kan ämnen följa med vatten till bäcken. Därför lämnar vi det till insamling. Förklara både vad som kan hända och varför åtgärden hjälper."
  },
  {
    "key": "module/7/figureAlt",
    "plain": "Ett möjligt spridningsförlopp från ett skadat batteri via mark och vatten till levande organismer, samt alternativet att lämna batteriet till insamling.",
    "tex": "Ett möjligt spridningsförlopp från ett skadat batteri via mark och vatten till levande organismer, samt alternativet att lämna batteriet till insamling.",
    "html": "Ett möjligt spridningsförlopp från ett skadat batteri via mark och vatten till levande organismer, samt alternativet att lämna batteriet till insamling."
  },
  {
    "key": "module/7/task",
    "plain": "Beskriv en möjlig väg från ett läckande batteri till en levande organism. Förklara en möjlig konsekvens och vad personen borde göra med batteriet i stället.",
    "tex": "Beskriv en möjlig väg från ett läckande batteri till en levande organism. Förklara en möjlig konsekvens och vad personen borde göra med batteriet i stället.",
    "html": "Beskriv en möjlig väg från ett läckande batteri till en levande organism. Förklara en möjlig konsekvens och vad personen borde göra med batteriet i stället."
  },
  {
    "key": "module/7/hint",
    "plain": "Använd sambandsorden först, sedan och därför. Tänk på vatten, mark och hur organismer får i sig ämnen.",
    "tex": "Använd sambandsorden först, sedan och därför. Tänk på vatten, mark och hur organismer får i sig ämnen.",
    "html": "Använd sambandsorden först, sedan och därför. Tänk på vatten, mark och hur organismer får i sig ämnen."
  },
  {
    "key": "module/7/example",
    "plain": "Om ett skadat batteri läcker kan ämnen först komma ut i marken och sedan följa med vatten till bäcken. Organismer kan utsättas för ämnena och vissa kan skadas. Konsekvensen beror på vilka ämnen och mängder det gäller. Batteriet ska därför lämnas till batteriinsamling.",
    "tex": "Om ett skadat batteri läcker kan ämnen först komma ut i marken och sedan följa med vatten till bäcken. Organismer kan utsättas för ämnena och vissa kan skadas. Konsekvensen beror på vilka ämnen och mängder det gäller. Batteriet ska därför lämnas till batteriinsamling.",
    "html": "Om ett skadat batteri läcker kan ämnen först komma ut i marken och sedan följa med vatten till bäcken. Organismer kan utsättas för ämnena och vissa kan skadas. Konsekvensen beror på vilka ämnen och mängder det gäller. Batteriet ska därför lämnas till batteriinsamling."
  },
  {
    "key": "module/7/check/question",
    "plain": "Vilket påstående är bäst?",
    "tex": "Vilket påstående är bäst?",
    "html": "Vilket påstående är bäst?"
  },
  {
    "key": "module/7/check/options/0",
    "plain": "Ett ämne är alltid ofarligt om det kommer från naturen.",
    "tex": "Ett ämne är alltid ofarligt om det kommer från naturen.",
    "html": "Ett ämne är alltid ofarligt om det kommer från naturen."
  },
  {
    "key": "module/7/check/options/1",
    "plain": "Risken beror bland annat på ämnet, mängden och hur organismer utsätts för det.",
    "tex": "Risken beror bland annat på ämnet, mängden och hur organismer utsätts för det.",
    "html": "Risken beror bland annat på ämnet, mängden och hur organismer utsätts för det."
  },
  {
    "key": "module/7/check/options/2",
    "plain": "Batterier kan lämnas i naturen om ingen människa rör dem.",
    "tex": "Batterier kan lämnas i naturen om ingen människa rör dem.",
    "html": "Batterier kan lämnas i naturen om ingen människa rör dem."
  },
  {
    "key": "module/7/check/feedback",
    "plain": "Ämnets egenskaper, mängden och exponeringen spelar roll. Naturligt betyder inte automatiskt ofarligt, och ämnen kan spridas utan att en människa rör vid dem.",
    "tex": "Ämnets egenskaper, mängden och exponeringen spelar roll. Naturligt betyder inte automatiskt ofarligt, och ämnen kan spridas utan att en människa rör vid dem.",
    "html": "Ämnets egenskaper, mängden och exponeringen spelar roll. Naturligt betyder inte automatiskt ofarligt, och ämnen kan spridas utan att en människa rör vid dem."
  },
  {
    "key": "module/7/stretch",
    "plain": "Hur hänger kemi och biologi ihop i ert exempel? Beskriv både ett ämne som sprids och en levande organism som kan påverkas.",
    "tex": "Hur hänger kemi och biologi ihop i ert exempel? Beskriv både ett ämne som sprids och en levande organism som kan påverkas.",
    "html": "Hur hänger kemi och biologi ihop i ert exempel? Beskriv både ett ämne som sprids och en levande organism som kan påverkas."
  },
  {
    "key": "lesson/1/opener",
    "plain": "Hur många atomer gömmer sig i en enda vattenmolekyl?",
    "tex": "Hur många atomer gömmer sig i en enda vattenmolekyl?",
    "html": "Hur många atomer gömmer sig i en enda vattenmolekyl?"
  },
  {
    "key": "lesson/1/intro/0",
    "plain": "Vatten i ett glas går att se och hälla. En vattenmolekyl är mycket mindre. Vi använder en ritning för att undersöka vilka atomer som sitter ihop i den. Samma molekyl kan visas både med kulor och med formeln H₂O.",
    "tex": "Vatten i ett glas går att se och hälla. En vattenmolekyl är mycket mindre. Vi använder en ritning för att undersöka vilka atomer som sitter ihop i den. Samma molekyl kan visas både med kulor och med formeln \\(\\mathrm{H_2O}\\).",
    "html": "Vatten i ett glas går att se och hälla. En vattenmolekyl är mycket mindre. Vi använder en ritning för att undersöka vilka atomer som sitter ihop i den. Samma molekyl kan visas både med kulor och med formeln <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>."
  },
  {
    "key": "lesson/1/intro/1",
    "plain": "Här behöver ni hålla isär två frågor: hur många atomer finns, och vilka sorter finns? Räkna gärna alla kulor först. Läs sedan bokstäverna. Säg svaret högt och peka på de delar ni menar.",
    "tex": "Här behöver ni hålla isär två frågor: hur många atomer finns, och vilka sorter finns? Räkna gärna alla kulor först. Läs sedan bokstäverna. Säg svaret högt och peka på de delar ni menar.",
    "html": "Här behöver ni hålla isär två frågor: hur många atomer finns, och vilka sorter finns? Räkna gärna alla kulor först. Läs sedan bokstäverna. Säg svaret högt och peka på de delar ni menar."
  },
  {
    "key": "lesson/1/sections/0/heading",
    "plain": "En atom är en byggsten; atomslag är sorten",
    "tex": "En atom är en byggsten; atomslag är sorten",
    "html": "En atom är en byggsten; atomslag är sorten"
  },
  {
    "key": "lesson/1/sections/0/body",
    "plain": "Tänk er fyra H-atomer på ett bord. Ni har fyra byggstenar, men alla är av samma sort: väte. Om ni lägger dit en O-atom har ni fem atomer av två atomslag. Syre och väte är olika grundämnen. Varje grundämne har sitt eget atomslag. Det bestäms av antalet protoner i atomkärnan: väte har en proton och syre har åtta. Därför kan vi följa en väteatom även när den sitter ihop med andra atomer. Ordet atom talar om en byggsten. Ordet atomslag talar om vilken sorts byggsten det är.",
    "tex": "Tänk er fyra H-atomer på ett bord. Ni har fyra byggstenar, men alla är av samma sort: väte. Om ni lägger dit en O-atom har ni fem atomer av två atomslag. Syre och väte är olika grundämnen. Varje grundämne har sitt eget atomslag. Det bestäms av antalet protoner i atomkärnan: väte har en proton och syre har åtta. Därför kan vi följa en väteatom även när den sitter ihop med andra atomer. Ordet atom talar om en byggsten. Ordet atomslag talar om vilken sorts byggsten det är.",
    "html": "Tänk er fyra H-atomer på ett bord. Ni har fyra byggstenar, men alla är av samma sort: väte. Om ni lägger dit en O-atom har ni fem atomer av två atomslag. Syre och väte är olika grundämnen. Varje grundämne har sitt eget atomslag. Det bestäms av antalet protoner i atomkärnan: väte har en proton och syre har åtta. Därför kan vi följa en väteatom även när den sitter ihop med andra atomer. Ordet atom talar om en byggsten. Ordet atomslag talar om vilken sorts byggsten det är."
  },
  {
    "key": "lesson/1/sections/0/question",
    "plain": "Fyra H-atomer och två O-atomer ligger var för sig. Hur många atomer finns, och hur många atomslag?",
    "tex": "Fyra H-atomer och två O-atomer ligger var för sig. Hur många atomer finns, och hur många atomslag?",
    "html": "Fyra H-atomer och två O-atomer ligger var för sig. Hur många atomer finns, och hur många atomslag?"
  },
  {
    "key": "lesson/1/sections/1/heading",
    "plain": "Läs en liten siffra i taget",
    "tex": "Läs en liten siffra i taget",
    "html": "Läs en liten siffra i taget"
  },
  {
    "key": "lesson/1/sections/1/body",
    "plain": "H₂O läser vi som två väteatomer och en syreatom. Den lilla tvåan hör till H precis framför siffran. Vid O saknas en liten siffra; det betyder en O-atom. Sammanlagt blir det tre atomer. De sitter ihop med kemiska bindningar och bildar en vattenmolekyl. Jämför med O₂: där sitter två syreatomer ihop i en syrgasmolekyl. En stor siffra framför en formel har en annan uppgift. 2H₂O betyder två hela vattenmolekyler. Då finns fyra H-atomer och två O-atomer, alltså sex atomer av två atomslag.",
    "tex": "\\(\\mathrm{H_2O}\\) läser vi som två väteatomer och en syreatom. Den lilla tvåan hör till H precis framför siffran. Vid O saknas en liten siffra; det betyder en O-atom. Sammanlagt blir det tre atomer. De sitter ihop med kemiska bindningar och bildar en vattenmolekyl. Jämför med \\(\\mathrm{O_2}\\): där sitter två syreatomer ihop i en syrgasmolekyl. En stor siffra framför en formel har en annan uppgift. \\(2\\mathrm{H_2O}\\) betyder två hela vattenmolekyler. Då finns fyra H-atomer och två O-atomer, alltså sex atomer av två atomslag.",
    "html": "<math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math> läser vi som två väteatomer och en syreatom. Den lilla tvåan hör till H precis framför siffran. Vid O saknas en liten siffra; det betyder en O-atom. Sammanlagt blir det tre atomer. De sitter ihop med kemiska bindningar och bildar en vattenmolekyl. Jämför med <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">O</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{O_2}</annotation></semantics></math>: där sitter två syreatomer ihop i en syrgasmolekyl. En stor siffra framför en formel har en annan uppgift. <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><mn>2</mn><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow></mrow><annotation encoding=\"application/x-tex\">2\\mathrm{H_2O}</annotation></semantics></math> betyder två hela vattenmolekyler. Då finns fyra H-atomer och två O-atomer, alltså sex atomer av två atomslag."
  },
  {
    "key": "lesson/1/sections/1/question",
    "plain": "Vilken skillnad finns mellan den stora tvåan i 2H₂O och den lilla tvåan i H₂O?",
    "tex": "Vilken skillnad finns mellan den stora tvåan i \\(2\\mathrm{H_2O}\\) och den lilla tvåan i \\(\\mathrm{H_2O}\\)?",
    "html": "Vilken skillnad finns mellan den stora tvåan i <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><mn>2</mn><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow></mrow><annotation encoding=\"application/x-tex\">2\\mathrm{H_2O}</annotation></semantics></math> och den lilla tvåan i <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>?"
  },
  {
    "key": "lesson/1/sections/2/heading",
    "plain": "Molekyl och kemisk förening",
    "tex": "Molekyl och kemisk förening",
    "html": "Molekyl och kemisk förening"
  },
  {
    "key": "lesson/1/sections/2/body",
    "plain": "O₂ är en molekyl eftersom två atomer sitter ihop. Syrgas är samtidigt ett grundämne eftersom alla atomer är syre. H₂O är också en molekyl, men vatten är en kemisk förening: det innehåller olika grundämnen som är kemiskt bundna till varandra. Orden svarar alltså på olika frågor. Molekyl beskriver en grupp bundna atomer. Kemisk förening beskriver vilka grundämnen ett ämne innehåller. Alla ämnen består inte av avgränsade molekyler. I en metall sitter många atomer samman, och vanligt koksalt har ett stort nätverk av laddade partiklar. På den här sidan börjar vi med molekylerna O₂ och H₂O.",
    "tex": "\\(\\mathrm{O_2}\\) är en molekyl eftersom två atomer sitter ihop. Syrgas är samtidigt ett grundämne eftersom alla atomer är syre. \\(\\mathrm{H_2O}\\) är också en molekyl, men vatten är en kemisk förening: det innehåller olika grundämnen som är kemiskt bundna till varandra. Orden svarar alltså på olika frågor. Molekyl beskriver en grupp bundna atomer. Kemisk förening beskriver vilka grundämnen ett ämne innehåller. Alla ämnen består inte av avgränsade molekyler. I en metall sitter många atomer samman, och vanligt koksalt har ett stort nätverk av laddade partiklar. På den här sidan börjar vi med molekylerna \\(\\mathrm{O_2}\\) och \\(\\mathrm{H_2O}\\).",
    "html": "<math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">O</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{O_2}</annotation></semantics></math> är en molekyl eftersom två atomer sitter ihop. Syrgas är samtidigt ett grundämne eftersom alla atomer är syre. <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math> är också en molekyl, men vatten är en kemisk förening: det innehåller olika grundämnen som är kemiskt bundna till varandra. Orden svarar alltså på olika frågor. Molekyl beskriver en grupp bundna atomer. Kemisk förening beskriver vilka grundämnen ett ämne innehåller. Alla ämnen består inte av avgränsade molekyler. I en metall sitter många atomer samman, och vanligt koksalt har ett stort nätverk av laddade partiklar. På den här sidan börjar vi med molekylerna <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">O</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{O_2}</annotation></semantics></math> och <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>."
  },
  {
    "key": "lesson/1/sections/2/question",
    "plain": "Förklara varför O₂ är en molekyl men inte en kemisk förening.",
    "tex": "Förklara varför \\(\\mathrm{O_2}\\) är en molekyl men inte en kemisk förening.",
    "html": "Förklara varför <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">O</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{O_2}</annotation></semantics></math> är en molekyl men inte en kemisk förening."
  },
  {
    "key": "lesson/1/conceptMap/0/term",
    "plain": "Atom",
    "tex": "Atom",
    "html": "Atom"
  },
  {
    "key": "lesson/1/conceptMap/0/meaning",
    "plain": "En mycket liten byggsten. En H-atom är en väteatom.",
    "tex": "En mycket liten byggsten. En H-atom är en väteatom.",
    "html": "En mycket liten byggsten. En H-atom är en väteatom."
  },
  {
    "key": "lesson/1/conceptMap/1/term",
    "plain": "Molekyl",
    "tex": "Molekyl",
    "html": "Molekyl"
  },
  {
    "key": "lesson/1/conceptMap/1/meaning",
    "plain": "Två eller flera atomer som sitter ihop med kemiska bindningar.",
    "tex": "Två eller flera atomer som sitter ihop med kemiska bindningar.",
    "html": "Två eller flera atomer som sitter ihop med kemiska bindningar."
  },
  {
    "key": "lesson/1/conceptMap/2/term",
    "plain": "Kemisk förening",
    "tex": "Kemisk förening",
    "html": "Kemisk förening"
  },
  {
    "key": "lesson/1/conceptMap/2/meaning",
    "plain": "Ett ämne som innehåller olika grundämnen kemiskt bundna till varandra.",
    "tex": "Ett ämne som innehåller olika grundämnen kemiskt bundna till varandra.",
    "html": "Ett ämne som innehåller olika grundämnen kemiskt bundna till varandra."
  },
  {
    "key": "lesson/1/workedExample/title",
    "plain": "Läs H₂O i tre steg",
    "tex": "Läs \\(\\mathrm{H_2O}\\) i tre steg",
    "html": "Läs <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math> i tre steg"
  },
  {
    "key": "lesson/1/workedExample/steps/0",
    "plain": "Läs bokstäverna: H betyder väte och O betyder syre. Vattenmolekylen innehåller alltså två olika atomslag.",
    "tex": "Läs bokstäverna: H betyder väte och O betyder syre. Vattenmolekylen innehåller alltså två olika atomslag.",
    "html": "Läs bokstäverna: H betyder väte och O betyder syre. Vattenmolekylen innehåller alltså två olika atomslag."
  },
  {
    "key": "lesson/1/workedExample/steps/1",
    "plain": "Läs antalet: den lilla tvåan gäller H. Det finns två väteatomer och en syreatom i varje molekyl.",
    "tex": "Läs antalet: den lilla tvåan gäller H. Det finns två väteatomer och en syreatom i varje molekyl.",
    "html": "Läs antalet: den lilla tvåan gäller H. Det finns två väteatomer och en syreatom i varje molekyl."
  },
  {
    "key": "lesson/1/workedExample/steps/2",
    "plain": "Lägg ihop: två plus en ger tre atomer. Svaret blir en molekyl med tre atomer av två atomslag. Visa samtidigt vilka atomer ni räknar i bilden.",
    "tex": "Lägg ihop: två plus en ger tre atomer. Svaret blir en molekyl med tre atomer av två atomslag. Visa samtidigt vilka atomer ni räknar i bilden.",
    "html": "Lägg ihop: två plus en ger tre atomer. Svaret blir en molekyl med tre atomer av två atomslag. Visa samtidigt vilka atomer ni räknar i bilden."
  },
  {
    "key": "lesson/1/misconception/claim",
    "plain": "”En molekyl måste innehålla olika atomslag.”",
    "tex": "”En molekyl måste innehålla olika atomslag.”",
    "html": "”En molekyl måste innehålla olika atomslag.”"
  },
  {
    "key": "lesson/1/misconception/correction",
    "plain": "En molekyl kan bestå av samma atomslag, som O₂, eller olika atomslag, som H₂O. För att ämnet ska vara en kemisk förening krävs olika grundämnen kemiskt bundna till varandra.",
    "tex": "En molekyl kan bestå av samma atomslag, som \\(\\mathrm{O_2}\\), eller olika atomslag, som \\(\\mathrm{H_2O}\\). För att ämnet ska vara en kemisk förening krävs olika grundämnen kemiskt bundna till varandra.",
    "html": "En molekyl kan bestå av samma atomslag, som <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">O</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{O_2}</annotation></semantics></math>, eller olika atomslag, som <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>. För att ämnet ska vara en kemisk förening krävs olika grundämnen kemiskt bundna till varandra."
  },
  {
    "key": "lesson/1/film/title",
    "plain": "Från atom till molekyl: följ varje byggsten",
    "tex": "Från atom till molekyl: följ varje byggsten",
    "html": "Från atom till molekyl: följ varje byggsten"
  },
  {
    "key": "lesson/1/film/before",
    "plain": "Följ en vattenmolekyl. Lägg märke till vilka delar som räknas när filmen visar atomer, atomslag och molekyler.",
    "tex": "Följ en vattenmolekyl. Lägg märke till vilka delar som räknas när filmen visar atomer, atomslag och molekyler.",
    "html": "Följ en vattenmolekyl. Lägg märke till vilka delar som räknas när filmen visar atomer, atomslag och molekyler."
  },
  {
    "key": "lesson/1/film/after",
    "plain": "Pausa vid H₂O och 2H₂O. Räkna högt tillsammans och förklara vad varje tvåa betyder.",
    "tex": "Pausa vid \\(\\mathrm{H_2O}\\) och \\(2\\mathrm{H_2O}\\). Räkna högt tillsammans och förklara vad varje tvåa betyder.",
    "html": "Pausa vid <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math> och <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><mn>2</mn><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow></mrow><annotation encoding=\"application/x-tex\">2\\mathrm{H_2O}</annotation></semantics></math>. Räkna högt tillsammans och förklara vad varje tvåa betyder."
  },
  {
    "key": "lesson/1/summary",
    "plain": "Jag kan skilja på atom, atomslag och molekyl. H₂O är en molekyl med tre atomer av två atomslag: väte och syre.",
    "tex": "Jag kan skilja på atom, atomslag och molekyl. \\(\\mathrm{H_2O}\\) är en molekyl med tre atomer av två atomslag: väte och syre.",
    "html": "Jag kan skilja på atom, atomslag och molekyl. <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math> är en molekyl med tre atomer av två atomslag: väte och syre."
  },
  {
    "key": "lesson/1/extraExamples/0/title",
    "plain": "Två vattenmolekyler: vad betyder 2H₂O?",
    "tex": "Två vattenmolekyler: vad betyder \\(2\\mathrm{H_2O}\\)?",
    "html": "Två vattenmolekyler: vad betyder <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><mn>2</mn><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow></mrow><annotation encoding=\"application/x-tex\">2\\mathrm{H_2O}</annotation></semantics></math>?"
  },
  {
    "key": "lesson/1/extraExamples/0/steps/0",
    "plain": "Den stora tvåan framför H₂O talar om att vi följer två hela vattenmolekyler. Rita först två likadana grupper.",
    "tex": "Den stora tvåan framför \\(\\mathrm{H_2O}\\) talar om att vi följer två hela vattenmolekyler. Rita först två likadana grupper.",
    "html": "Den stora tvåan framför <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math> talar om att vi följer två hela vattenmolekyler. Rita först två likadana grupper."
  },
  {
    "key": "lesson/1/extraExamples/0/steps/1",
    "plain": "Varje grupp har två H och en O. Två grupper innehåller därför fyra H-atomer och två O-atomer: sex atomer sammanlagt.",
    "tex": "Varje grupp har två H och en O. Två grupper innehåller därför fyra H-atomer och två O-atomer: sex atomer sammanlagt.",
    "html": "Varje grupp har två H och en O. Två grupper innehåller därför fyra H-atomer och två O-atomer: sex atomer sammanlagt."
  },
  {
    "key": "lesson/1/extraExamples/0/steps/2",
    "plain": "Antalet atomslag är fortfarande två, väte och syre. Fler molekyler ger fler atomer, samtidigt som sorterna är desamma. Jämför den stora tvåans uppgift med den lilla tvåans.",
    "tex": "Antalet atomslag är fortfarande två, väte och syre. Fler molekyler ger fler atomer, samtidigt som sorterna är desamma. Jämför den stora tvåans uppgift med den lilla tvåans.",
    "html": "Antalet atomslag är fortfarande två, väte och syre. Fler molekyler ger fler atomer, samtidigt som sorterna är desamma. Jämför den stora tvåans uppgift med den lilla tvåans."
  },
  {
    "key": "lesson/1/extraExamples/1/title",
    "plain": "Tre atomer kan bilda olika ämnen",
    "tex": "Tre atomer kan bilda olika ämnen",
    "html": "Tre atomer kan bilda olika ämnen"
  },
  {
    "key": "lesson/1/extraExamples/1/steps/0",
    "plain": "Skriv H₂O och CO₂ bredvid varandra. I båda formlerna blir summan tre atomer per molekyl.",
    "tex": "Skriv \\(\\mathrm{H_2O}\\) och \\(\\mathrm{CO_2}\\) bredvid varandra. I båda formlerna blir summan tre atomer per molekyl.",
    "html": "Skriv <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math> och <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><mi mathvariant=\"normal\">C</mi><msub><mi mathvariant=\"normal\">O</mi><mn mathvariant=\"normal\">2</mn></msub></mrow><annotation encoding=\"application/x-tex\">\\mathrm{CO_2}</annotation></semantics></math> bredvid varandra. I båda formlerna blir summan tre atomer per molekyl."
  },
  {
    "key": "lesson/1/extraExamples/1/steps/1",
    "plain": "Vatten har två väteatomer och en syreatom. Koldioxid har en kolatom, C, och två syreatomer. Båda innehåller två atomslag, men kombinationerna skiljer sig åt.",
    "tex": "Vatten har två väteatomer och en syreatom. Koldioxid har en kolatom, C, och två syreatomer. Båda innehåller två atomslag, men kombinationerna skiljer sig åt.",
    "html": "Vatten har två väteatomer och en syreatom. Koldioxid har en kolatom, C, och två syreatomer. Båda innehåller två atomslag, men kombinationerna skiljer sig åt."
  },
  {
    "key": "lesson/1/extraExamples/1/steps/2",
    "plain": "Dra slutsatsen: antalet atomer räcker bara till en del av beskrivningen. För att känna igen uppbyggnaden behöver ni också ange atomslagen och hur många atomer det finns av varje slag.",
    "tex": "Dra slutsatsen: antalet atomer räcker bara till en del av beskrivningen. För att känna igen uppbyggnaden behöver ni också ange atomslagen och hur många atomer det finns av varje slag.",
    "html": "Dra slutsatsen: antalet atomer räcker bara till en del av beskrivningen. För att känna igen uppbyggnaden behöver ni också ange atomslagen och hur många atomer det finns av varje slag."
  },
  {
    "key": "lesson/1/reflectionPrompts/0",
    "plain": "En kamrat säger: ”Två vattenmolekyler innehåller fyra atomslag.” Visa med en ritning hur ni kan hjälpa kamraten att räkna sorterna.",
    "tex": "En kamrat säger: ”Två vattenmolekyler innehåller fyra atomslag.” Visa med en ritning hur ni kan hjälpa kamraten att räkna sorterna.",
    "html": "En kamrat säger: ”Två vattenmolekyler innehåller fyra atomslag.” Visa med en ritning hur ni kan hjälpa kamraten att räkna sorterna."
  },
  {
    "key": "lesson/1/reflectionPrompts/1",
    "plain": "Byt roller. Låt en av er beskriva en molekyl med ord och låt den andra skriva formeln och kontrollera antalet atomer.",
    "tex": "Byt roller. Låt en av er beskriva en molekyl med ord och låt den andra skriva formeln och kontrollera antalet atomer.",
    "html": "Byt roller. Låt en av er beskriva en molekyl med ord och låt den andra skriva formeln och kontrollera antalet atomer."
  },
  {
    "key": "lesson/2/opener",
    "plain": "Vad har en russinkaka med en atom att göra?",
    "tex": "Vad har en russinkaka med en atom att göra?",
    "html": "Vad har en russinkaka med en atom att göra?"
  },
  {
    "key": "lesson/2/intro/0",
    "plain": "Forskare kan lära sig om atomens insida genom försök. Sedan bygger de en modell som förklarar vad som hände. Om ett nytt resultat är svårt att förklara behöver de tänka vidare.",
    "tex": "Forskare kan lära sig om atomens insida genom försök. Sedan bygger de en modell som förklarar vad som hände. Om ett nytt resultat är svårt att förklara behöver de tänka vidare.",
    "html": "Forskare kan lära sig om atomens insida genom försök. Sedan bygger de en modell som förklarar vad som hände. Om ett nytt resultat är svårt att förklara behöver de tänka vidare."
  },
  {
    "key": "lesson/2/intro/1",
    "plain": "Följ särskilt den positiva laddningen. I Thomsons modell finns den utspridd som smeten i en russinkaka. I Rutherfords modell är den samlad i en liten kärna. Försöket hjälper oss att förstå varför beskrivningen ändrades.",
    "tex": "Följ särskilt den positiva laddningen. I Thomsons modell finns den utspridd som smeten i en russinkaka. I Rutherfords modell är den samlad i en liten kärna. Försöket hjälper oss att förstå varför beskrivningen ändrades.",
    "html": "Följ särskilt den positiva laddningen. I Thomsons modell finns den utspridd som smeten i en russinkaka. I Rutherfords modell är den samlad i en liten kärna. Försöket hjälper oss att förstå varför beskrivningen ändrades."
  },
  {
    "key": "lesson/2/sections/0/heading",
    "plain": "Från en hel kula till en russinkaka",
    "tex": "Från en hel kula till en russinkaka",
    "html": "Från en hel kula till en russinkaka"
  },
  {
    "key": "lesson/2/sections/0/body",
    "plain": "Dalton beskrev atomen som en liten hel kula. När elektronen upptäcktes behövde forskarna också beskriva mindre delar inuti atomen. Elektroner har negativ laddning. En neutral atom har lika mycket positiv som negativ laddning, så modellen behövde innehålla båda. I Thomsons modell från 1904 var den positiva laddningen utspridd genom atomen. Det fanns negativa elektroner inuti den positiva delen. Därför liknar modellen en russinkaka: negativa elektroner är russinen och positiv laddning är smeten. Smeten hör till hela kakan. Den är alltså utspridd, medan russinen finns på flera platser i den.",
    "tex": "Dalton beskrev atomen som en liten hel kula. När elektronen upptäcktes behövde forskarna också beskriva mindre delar inuti atomen. Elektroner har negativ laddning. En neutral atom har lika mycket positiv som negativ laddning, så modellen behövde innehålla båda. I Thomsons modell från 1904 var den positiva laddningen utspridd genom atomen. Det fanns negativa elektroner inuti den positiva delen. Därför liknar modellen en russinkaka: negativa elektroner är russinen och positiv laddning är smeten. Smeten hör till hela kakan. Den är alltså utspridd, medan russinen finns på flera platser i den.",
    "html": "Dalton beskrev atomen som en liten hel kula. När elektronen upptäcktes behövde forskarna också beskriva mindre delar inuti atomen. Elektroner har negativ laddning. En neutral atom har lika mycket positiv som negativ laddning, så modellen behövde innehålla båda. I Thomsons modell från 1904 var den positiva laddningen utspridd genom atomen. Det fanns negativa elektroner inuti den positiva delen. Därför liknar modellen en russinkaka: negativa elektroner är russinen och positiv laddning är smeten. Smeten hör till hela kakan. Den är alltså utspridd, medan russinen finns på flera platser i den."
  },
  {
    "key": "lesson/2/sections/0/question",
    "plain": "Peka på ett russin och på smeten. Vilken laddning motsvarar varje del?",
    "tex": "Peka på ett russin och på smeten. Vilken laddning motsvarar varje del?",
    "html": "Peka på ett russin och på smeten. Vilken laddning motsvarar varje del?"
  },
  {
    "key": "lesson/2/sections/1/heading",
    "plain": "Ett försök som överraskade forskarna",
    "tex": "Ett försök som överraskade forskarna",
    "html": "Ett försök som överraskade forskarna"
  },
  {
    "key": "lesson/2/sections/1/body",
    "plain": "Positivt laddade alfapartiklar sköts mot en mycket tunn guldfolie. Alfapartiklar är små partiklar som kan användas för att undersöka materia. De flesta fortsatte nästan rakt fram. Några böjdes av kraftigt, och enstaka vände tillbaka. Positiva laddningar stöter bort varandra. Rutherford föreslog 1911 att atomens positiva laddning var samlad i en liten kärna. En partikel nära kärnan kunde då påverkas starkt. De flesta partiklar passerade genom det mycket större området runt kärnorna. Modellen kunde därmed förklara både de många nästan raka banorna och de få kraftiga avböjningarna.",
    "tex": "Positivt laddade alfapartiklar sköts mot en mycket tunn guldfolie. Alfapartiklar är små partiklar som kan användas för att undersöka materia. De flesta fortsatte nästan rakt fram. Några böjdes av kraftigt, och enstaka vände tillbaka. Positiva laddningar stöter bort varandra. Rutherford föreslog 1911 att atomens positiva laddning var samlad i en liten kärna. En partikel nära kärnan kunde då påverkas starkt. De flesta partiklar passerade genom det mycket större området runt kärnorna. Modellen kunde därmed förklara både de många nästan raka banorna och de få kraftiga avböjningarna.",
    "html": "Positivt laddade alfapartiklar sköts mot en mycket tunn guldfolie. Alfapartiklar är små partiklar som kan användas för att undersöka materia. De flesta fortsatte nästan rakt fram. Några böjdes av kraftigt, och enstaka vände tillbaka. Positiva laddningar stöter bort varandra. Rutherford föreslog 1911 att atomens positiva laddning var samlad i en liten kärna. En partikel nära kärnan kunde då påverkas starkt. De flesta partiklar passerade genom det mycket större området runt kärnorna. Modellen kunde därmed förklara både de många nästan raka banorna och de få kraftiga avböjningarna."
  },
  {
    "key": "lesson/2/sections/1/question",
    "plain": "Hur hjälper en liten positiv kärna oss att förklara de kraftiga avböjningarna?",
    "tex": "Hur hjälper en liten positiv kärna oss att förklara de kraftiga avböjningarna?",
    "html": "Hur hjälper en liten positiv kärna oss att förklara de kraftiga avböjningarna?"
  },
  {
    "key": "lesson/2/sections/2/heading",
    "plain": "Skal och moln hjälper oss med olika frågor",
    "tex": "Skal och moln hjälper oss med olika frågor",
    "html": "Skal och moln hjälper oss med olika frågor"
  },
  {
    "key": "lesson/2/sections/2/body",
    "plain": "Bohr beskrev 1913 bestämda energinivåer för elektronen i väte. Vi ritar nivåerna som skal. En elektron kan ta upp energi och gå till en högre nivå. När atomen avger energi kan ljus bildas. Skalmodellen hjälper oss att ordna och räkna elektroner, särskilt de yttersta. Ett elektronmoln hjälper oss i stället att beskriva var en elektron kan finnas. Sannolikhet betyder hur stor chans det är att något händer. Ett tätare område i molnet visar större chans att hitta elektronen där. Många prickar i ett moln visar möjliga lägen; de betyder inte att en väteatom har många elektroner.",
    "tex": "Bohr beskrev 1913 bestämda energinivåer för elektronen i väte. Vi ritar nivåerna som skal. En elektron kan ta upp energi och gå till en högre nivå. När atomen avger energi kan ljus bildas. Skalmodellen hjälper oss att ordna och räkna elektroner, särskilt de yttersta. Ett elektronmoln hjälper oss i stället att beskriva var en elektron kan finnas. Sannolikhet betyder hur stor chans det är att något händer. Ett tätare område i molnet visar större chans att hitta elektronen där. Många prickar i ett moln visar möjliga lägen; de betyder inte att en väteatom har många elektroner.",
    "html": "Bohr beskrev 1913 bestämda energinivåer för elektronen i väte. Vi ritar nivåerna som skal. En elektron kan ta upp energi och gå till en högre nivå. När atomen avger energi kan ljus bildas. Skalmodellen hjälper oss att ordna och räkna elektroner, särskilt de yttersta. Ett elektronmoln hjälper oss i stället att beskriva var en elektron kan finnas. Sannolikhet betyder hur stor chans det är att något händer. Ett tätare område i molnet visar större chans att hitta elektronen där. Många prickar i ett moln visar möjliga lägen; de betyder inte att en väteatom har många elektroner."
  },
  {
    "key": "lesson/2/sections/2/question",
    "plain": "Vad berättar ett tätare område i elektronmolnet?",
    "tex": "Vad berättar ett tätare område i elektronmolnet?",
    "html": "Vad berättar ett tätare område i elektronmolnet?"
  },
  {
    "key": "lesson/2/conceptMap/0/term",
    "plain": "Modell",
    "tex": "Modell",
    "html": "Modell"
  },
  {
    "key": "lesson/2/conceptMap/0/meaning",
    "plain": "En beskrivning som hjälper oss att förstå och förklara resultat från undersökningar.",
    "tex": "En beskrivning som hjälper oss att förstå och förklara resultat från undersökningar.",
    "html": "En beskrivning som hjälper oss att förstå och förklara resultat från undersökningar."
  },
  {
    "key": "lesson/2/conceptMap/1/term",
    "plain": "Atomkärna",
    "tex": "Atomkärna",
    "html": "Atomkärna"
  },
  {
    "key": "lesson/2/conceptMap/1/meaning",
    "plain": "Den lilla delen i atomens centrum där positiv laddning och nästan hela massan finns.",
    "tex": "Den lilla delen i atomens centrum där positiv laddning och nästan hela massan finns.",
    "html": "Den lilla delen i atomens centrum där positiv laddning och nästan hela massan finns."
  },
  {
    "key": "lesson/2/conceptMap/2/term",
    "plain": "Elektronmoln",
    "tex": "Elektronmoln",
    "html": "Elektronmoln"
  },
  {
    "key": "lesson/2/conceptMap/2/meaning",
    "plain": "En bild av var elektroner kan finnas. Tätare moln betyder större chans att hitta en elektron där.",
    "tex": "En bild av var elektroner kan finnas. Tätare moln betyder större chans att hitta en elektron där.",
    "html": "En bild av var elektroner kan finnas. Tätare moln betyder större chans att hitta en elektron där."
  },
  {
    "key": "lesson/2/workedExample/title",
    "plain": "Jämför var den positiva laddningen finns",
    "tex": "Jämför var den positiva laddningen finns",
    "html": "Jämför var den positiva laddningen finns"
  },
  {
    "key": "lesson/2/workedExample/steps/0",
    "plain": "Börja med Thomson: markera kakans sammanhängande del. Den motsvarar positiv laddning utspridd genom modellen. Markera russinen som negativa elektroner.",
    "tex": "Börja med Thomson: markera kakans sammanhängande del. Den motsvarar positiv laddning utspridd genom modellen. Markera russinen som negativa elektroner.",
    "html": "Börja med Thomson: markera kakans sammanhängande del. Den motsvarar positiv laddning utspridd genom modellen. Markera russinen som negativa elektroner."
  },
  {
    "key": "lesson/2/workedExample/steps/1",
    "plain": "Gå till Rutherford: samla den positiva laddningen i en liten kärna och placera elektroner i området omkring. Beskriv vad som ändrats i laddningens fördelning.",
    "tex": "Gå till Rutherford: samla den positiva laddningen i en liten kärna och placera elektroner i området omkring. Beskriv vad som ändrats i laddningens fördelning.",
    "html": "Gå till Rutherford: samla den positiva laddningen i en liten kärna och placera elektroner i området omkring. Beskriv vad som ändrats i laddningens fördelning."
  },
  {
    "key": "lesson/2/workedExample/steps/2",
    "plain": "Knyt till försöket: en alfapartikel som kommer nära den koncentrerade positiva laddningen kan böjas av kraftigt. Förklara både modellens förändring och vilket resultat den hjälper oss att förstå.",
    "tex": "Knyt till försöket: en alfapartikel som kommer nära den koncentrerade positiva laddningen kan böjas av kraftigt. Förklara både modellens förändring och vilket resultat den hjälper oss att förstå.",
    "html": "Knyt till försöket: en alfapartikel som kommer nära den koncentrerade positiva laddningen kan böjas av kraftigt. Förklara både modellens förändring och vilket resultat den hjälper oss att förstå."
  },
  {
    "key": "lesson/2/misconception/claim",
    "plain": "”I Thomsons russinkaka finns en positiv atomkärna i mitten.”",
    "tex": "”I Thomsons russinkaka finns en positiv atomkärna i mitten.”",
    "html": "”I Thomsons russinkaka finns en positiv atomkärna i mitten.”"
  },
  {
    "key": "lesson/2/misconception/correction",
    "plain": "I Thomsons modell är den positiva laddningen utspridd genom atomen. En liten central kärna med samlad positiv laddning är den avgörande förändringen i Rutherfords modell.",
    "tex": "I Thomsons modell är den positiva laddningen utspridd genom atomen. En liten central kärna med samlad positiv laddning är den avgörande förändringen i Rutherfords modell.",
    "html": "I Thomsons modell är den positiva laddningen utspridd genom atomen. En liten central kärna med samlad positiv laddning är den avgörande förändringen i Rutherfords modell."
  },
  {
    "key": "lesson/2/film/title",
    "plain": "Från russinkaka till kärna och elektronmoln",
    "tex": "Från russinkaka till kärna och elektronmoln",
    "html": "Från russinkaka till kärna och elektronmoln"
  },
  {
    "key": "lesson/2/film/before",
    "plain": "Titta efter var den positiva laddningen finns. Följ sedan vad som händer när en positiv partikel kommer nära kärnan.",
    "tex": "Titta efter var den positiva laddningen finns. Följ sedan vad som händer när en positiv partikel kommer nära kärnan.",
    "html": "Titta efter var den positiva laddningen finns. Följ sedan vad som händer när en positiv partikel kommer nära kärnan."
  },
  {
    "key": "lesson/2/film/after",
    "plain": "Pausa vid russinkakan och kärnmodellen. Förklara smet, russin och kärna. Koppla kärnan till partiklarnas avböjning.",
    "tex": "Pausa vid russinkakan och kärnmodellen. Förklara smet, russin och kärna. Koppla kärnan till partiklarnas avböjning.",
    "html": "Pausa vid russinkakan och kärnmodellen. Förklara smet, russin och kärna. Koppla kärnan till partiklarnas avböjning."
  },
  {
    "key": "lesson/2/summary",
    "plain": "Jag kan förklara russinkakan: negativa elektroner är russinen och positiv laddning är smeten. I kärnmodellen samlas den positiva laddningen i en liten kärna. Nya försöksresultat kan leda till nya modeller.",
    "tex": "Jag kan förklara russinkakan: negativa elektroner är russinen och positiv laddning är smeten. I kärnmodellen samlas den positiva laddningen i en liten kärna. Nya försöksresultat kan leda till nya modeller.",
    "html": "Jag kan förklara russinkakan: negativa elektroner är russinen och positiv laddning är smeten. I kärnmodellen samlas den positiva laddningen i en liten kärna. Nya försöksresultat kan leda till nya modeller."
  },
  {
    "key": "lesson/2/extraExamples/0/title",
    "plain": "Två observationer kräver två delar av förklaringen",
    "tex": "Två observationer kräver två delar av förklaringen",
    "html": "Två observationer kräver två delar av förklaringen"
  },
  {
    "key": "lesson/2/extraExamples/0/steps/0",
    "plain": "Observation ett: de flesta alfapartiklar passerar folien. Använd modellen för att visa det stora området omkring den lilla kärnan.",
    "tex": "Observation ett: de flesta alfapartiklar passerar folien. Använd modellen för att visa det stora området omkring den lilla kärnan.",
    "html": "Observation ett: de flesta alfapartiklar passerar folien. Använd modellen för att visa det stora området omkring den lilla kärnan."
  },
  {
    "key": "lesson/2/extraExamples/0/steps/1",
    "plain": "Observation två: några partiklar ändrar riktning kraftigt. Följ en bana nära kärnan och använd att positiva laddningar stöter bort varandra.",
    "tex": "Observation två: några partiklar ändrar riktning kraftigt. Följ en bana nära kärnan och använd att positiva laddningar stöter bort varandra.",
    "html": "Observation två: några partiklar ändrar riktning kraftigt. Följ en bana nära kärnan och använd att positiva laddningar stöter bort varandra."
  },
  {
    "key": "lesson/2/extraExamples/0/steps/2",
    "plain": "Sätt ihop meningarna: modellen behöver rymma både många nästan raka banor och några kraftigt avböjda banor. Ett bra resonemang kopplar tydligt en observation till en förklaring.",
    "tex": "Sätt ihop meningarna: modellen behöver rymma både många nästan raka banor och några kraftigt avböjda banor. Ett bra resonemang kopplar tydligt en observation till en förklaring.",
    "html": "Sätt ihop meningarna: modellen behöver rymma både många nästan raka banor och några kraftigt avböjda banor. Ett bra resonemang kopplar tydligt en observation till en förklaring."
  },
  {
    "key": "lesson/2/extraExamples/1/title",
    "plain": "Välj bild efter fråga",
    "tex": "Välj bild efter fråga",
    "html": "Välj bild efter fråga"
  },
  {
    "key": "lesson/2/extraExamples/1/steps/0",
    "plain": "Fråga: var finns atomens positiva laddning? Välj kärnmodellen och peka ut kärnan.",
    "tex": "Fråga: var finns atomens positiva laddning? Välj kärnmodellen och peka ut kärnan.",
    "html": "Fråga: var finns atomens positiva laddning? Välj kärnmodellen och peka ut kärnan."
  },
  {
    "key": "lesson/2/extraExamples/1/steps/1",
    "plain": "Fråga: vilka elektroner finns ytterst? Välj en skalmodell och följ de elektroner som ligger i det yttersta upptagna skalet.",
    "tex": "Fråga: vilka elektroner finns ytterst? Välj en skalmodell och följ de elektroner som ligger i det yttersta upptagna skalet.",
    "html": "Fråga: vilka elektroner finns ytterst? Välj en skalmodell och följ de elektroner som ligger i det yttersta upptagna skalet."
  },
  {
    "key": "lesson/2/extraExamples/1/steps/2",
    "plain": "Fråga: i vilka områden kan elektroner påträffas? Välj ett elektronmoln och använd ordet sannolikhet. Förklara för varandra varför ni valde just den bilden.",
    "tex": "Fråga: i vilka områden kan elektroner påträffas? Välj ett elektronmoln och använd ordet sannolikhet. Förklara för varandra varför ni valde just den bilden.",
    "html": "Fråga: i vilka områden kan elektroner påträffas? Välj ett elektronmoln och använd ordet sannolikhet. Förklara för varandra varför ni valde just den bilden."
  },
  {
    "key": "lesson/2/reflectionPrompts/0",
    "plain": "Rita Thomson och Rutherford bredvid varandra. Använd samma tecken för positiv och negativ laddning så att skillnaden i fördelning blir lätt att se.",
    "tex": "Rita Thomson och Rutherford bredvid varandra. Använd samma tecken för positiv och negativ laddning så att skillnaden i fördelning blir lätt att se.",
    "html": "Rita Thomson och Rutherford bredvid varandra. Använd samma tecken för positiv och negativ laddning så att skillnaden i fördelning blir lätt att se."
  },
  {
    "key": "lesson/2/reflectionPrompts/1",
    "plain": "Tänk er att ett nytt mätresultat är svårt att förklara. Vilka frågor kan forskare ställa om försöket och om modellen innan de utvecklar en ny beskrivning?",
    "tex": "Tänk er att ett nytt mätresultat är svårt att förklara. Vilka frågor kan forskare ställa om försöket och om modellen innan de utvecklar en ny beskrivning?",
    "html": "Tänk er att ett nytt mätresultat är svårt att förklara. Vilka frågor kan forskare ställa om försöket och om modellen innan de utvecklar en ny beskrivning?"
  },
  {
    "key": "lesson/3/opener",
    "plain": "Hur kan två atomer hålla ihop?",
    "tex": "Hur kan två atomer hålla ihop?",
    "html": "Hur kan två atomer hålla ihop?"
  },
  {
    "key": "lesson/3/intro/0",
    "plain": "Tänk på två väteatomer. Varje atom har en positiv kärna och en negativ elektron. När atomerna binds ihop får elektronerna en gemensam roll i molekylen.",
    "tex": "Tänk på två väteatomer. Varje atom har en positiv kärna och en negativ elektron. När atomerna binds ihop får elektronerna en gemensam roll i molekylen.",
    "html": "Tänk på två väteatomer. Varje atom har en positiv kärna och en negativ elektron. När atomerna binds ihop får elektronerna en gemensam roll i molekylen."
  },
  {
    "key": "lesson/3/intro/1",
    "plain": "Följ samma två kärnor och samma två elektroner genom filmen. Då kan ni se vad som händer med bindningen och vilka delar som finns kvar. Det är särskilt de yttersta elektronerna som är viktiga i kemiska reaktioner.",
    "tex": "Följ samma två kärnor och samma två elektroner genom filmen. Då kan ni se vad som händer med bindningen och vilka delar som finns kvar. Det är särskilt de yttersta elektronerna som är viktiga i kemiska reaktioner.",
    "html": "Följ samma två kärnor och samma två elektroner genom filmen. Då kan ni se vad som händer med bindningen och vilka delar som finns kvar. Det är särskilt de yttersta elektronerna som är viktiga i kemiska reaktioner."
  },
  {
    "key": "lesson/3/sections/0/heading",
    "plain": "Börja med plus och minus",
    "tex": "Börja med plus och minus",
    "html": "Börja med plus och minus"
  },
  {
    "key": "lesson/3/sections/0/body",
    "plain": "Kärnan har positiv laddning och elektroner har negativ laddning. Olika laddningar dras till varandra; lika laddningar stöter bort varandra. I en neutral atom tar den positiva och negativa laddningen ut varandra. Väte har en proton med laddningen plus ett och en elektron med laddningen minus ett. Summan blir noll. En atom med lika många protoner som elektroner är neutral. Om antalet elektroner ändras blir partikeln laddad. En sådan laddad atom kallas jon. Atomslaget bestäms fortfarande av protonerna i kärnan. Att räkna plus och minus hjälper oss alltså att förstå laddningen.",
    "tex": "Kärnan har positiv laddning och elektroner har negativ laddning. Olika laddningar dras till varandra; lika laddningar stöter bort varandra. I en neutral atom tar den positiva och negativa laddningen ut varandra. Väte har en proton med laddningen plus ett och en elektron med laddningen minus ett. Summan blir noll. En atom med lika många protoner som elektroner är neutral. Om antalet elektroner ändras blir partikeln laddad. En sådan laddad atom kallas jon. Atomslaget bestäms fortfarande av protonerna i kärnan. Att räkna plus och minus hjälper oss alltså att förstå laddningen.",
    "html": "Kärnan har positiv laddning och elektroner har negativ laddning. Olika laddningar dras till varandra; lika laddningar stöter bort varandra. I en neutral atom tar den positiva och negativa laddningen ut varandra. Väte har en proton med laddningen plus ett och en elektron med laddningen minus ett. Summan blir noll. En atom med lika många protoner som elektroner är neutral. Om antalet elektroner ändras blir partikeln laddad. En sådan laddad atom kallas jon. Atomslaget bestäms fortfarande av protonerna i kärnan. Att räkna plus och minus hjälper oss alltså att förstå laddningen."
  },
  {
    "key": "lesson/3/sections/0/question",
    "plain": "Varför är en väteatom med en proton och en elektron neutral?",
    "tex": "Varför är en väteatom med en proton och en elektron neutral?",
    "html": "Varför är en väteatom med en proton och en elektron neutral?"
  },
  {
    "key": "lesson/3/sections/1/heading",
    "plain": "Ett gemensamt elektronpar håller ihop H₂",
    "tex": "Ett gemensamt elektronpar håller ihop \\(\\mathrm{H_2}\\)",
    "html": "Ett gemensamt elektronpar håller ihop <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{H_2}</annotation></semantics></math>"
  },
  {
    "key": "lesson/3/sections/1/body",
    "plain": "Två väteatomer har tillsammans två kärnor och två elektroner. När de bildar H₂ delas de två elektronerna mellan atomerna. Vi kallar dem ett gemensamt elektronpar. De negativa elektronerna dras till båda positiva kärnorna och hjälper till att hålla ihop molekylen. Det kallas elektronparbindning. På ett lagom avstånd kan den bundna molekylen ha lägre energi än de två fria atomerna. Det är därför en bindning kan bildas. Huvudidén här är enkel: atomerna delar elektroner, och samma två kärnor finns kvar. I vattenmolekylen delar syre elektroner med väte i två bindningar.",
    "tex": "Två väteatomer har tillsammans två kärnor och två elektroner. När de bildar \\(\\mathrm{H_2}\\) delas de två elektronerna mellan atomerna. Vi kallar dem ett gemensamt elektronpar. De negativa elektronerna dras till båda positiva kärnorna och hjälper till att hålla ihop molekylen. Det kallas elektronparbindning. På ett lagom avstånd kan den bundna molekylen ha lägre energi än de två fria atomerna. Det är därför en bindning kan bildas. Huvudidén här är enkel: atomerna delar elektroner, och samma två kärnor finns kvar. I vattenmolekylen delar syre elektroner med väte i två bindningar.",
    "html": "Två väteatomer har tillsammans två kärnor och två elektroner. När de bildar <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{H_2}</annotation></semantics></math> delas de två elektronerna mellan atomerna. Vi kallar dem ett gemensamt elektronpar. De negativa elektronerna dras till båda positiva kärnorna och hjälper till att hålla ihop molekylen. Det kallas elektronparbindning. På ett lagom avstånd kan den bundna molekylen ha lägre energi än de två fria atomerna. Det är därför en bindning kan bildas. Huvudidén här är enkel: atomerna delar elektroner, och samma två kärnor finns kvar. I vattenmolekylen delar syre elektroner med väte i två bindningar."
  },
  {
    "key": "lesson/3/sections/1/question",
    "plain": "Hur många kärnor och elektroner följer ni när två väteatomer bildar H₂?",
    "tex": "Hur många kärnor och elektroner följer ni när två väteatomer bildar \\(\\mathrm{H_2}\\)?",
    "html": "Hur många kärnor och elektroner följer ni när två väteatomer bildar <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{H_2}</annotation></semantics></math>?"
  },
  {
    "key": "lesson/3/sections/2/heading",
    "plain": "Bindningar ändras; atomslagen finns kvar",
    "tex": "Bindningar ändras; atomslagen finns kvar",
    "html": "Bindningar ändras; atomslagen finns kvar"
  },
  {
    "key": "lesson/3/sections/2/body",
    "plain": "I en vanlig kemisk reaktion kan bindningar brytas och nya bindningar bildas. Elektroner kan delas mellan atomer eller flyttas från en atom till en annan. En natriumatom som lämnar ifrån sig en elektron blir till exempel en positiv natriumjon, Na⁺. En kloratom som tar upp en elektron blir en negativ kloridjon, Cl⁻. De motsatta laddningarna dras till varandra i koksalt. Det är ett annat sätt att binda partiklar än i H₂. Kärnorna bevaras i båda fallen. Väte blir fortfarande väte, och natrium blir fortfarande natrium. Börja därför varje reaktionsförklaring med att följa samma atomslag före och efter.",
    "tex": "I en vanlig kemisk reaktion kan bindningar brytas och nya bindningar bildas. Elektroner kan delas mellan atomer eller flyttas från en atom till en annan. En natriumatom som lämnar ifrån sig en elektron blir till exempel en positiv natriumjon, \\(\\mathrm{Na^+}\\). En kloratom som tar upp en elektron blir en negativ kloridjon, \\(\\mathrm{Cl^-}\\). De motsatta laddningarna dras till varandra i koksalt. Det är ett annat sätt att binda partiklar än i \\(\\mathrm{H_2}\\). Kärnorna bevaras i båda fallen. Väte blir fortfarande väte, och natrium blir fortfarande natrium. Börja därför varje reaktionsförklaring med att följa samma atomslag före och efter.",
    "html": "I en vanlig kemisk reaktion kan bindningar brytas och nya bindningar bildas. Elektroner kan delas mellan atomer eller flyttas från en atom till en annan. En natriumatom som lämnar ifrån sig en elektron blir till exempel en positiv natriumjon, <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><mi mathvariant=\"normal\">N</mi><msup><mi mathvariant=\"normal\">a</mi><mo mathvariant=\"normal\">+</mo></msup></mrow><annotation encoding=\"application/x-tex\">\\mathrm{Na^+}</annotation></semantics></math>. En kloratom som tar upp en elektron blir en negativ kloridjon, <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><mi mathvariant=\"normal\">C</mi><msup><mi mathvariant=\"normal\">l</mi><mo mathvariant=\"normal\">−</mo></msup></mrow><annotation encoding=\"application/x-tex\">\\mathrm{Cl^-}</annotation></semantics></math>. De motsatta laddningarna dras till varandra i koksalt. Det är ett annat sätt att binda partiklar än i <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{H_2}</annotation></semantics></math>. Kärnorna bevaras i båda fallen. Väte blir fortfarande väte, och natrium blir fortfarande natrium. Börja därför varje reaktionsförklaring med att följa samma atomslag före och efter."
  },
  {
    "key": "lesson/3/sections/2/question",
    "plain": "En partikel har elva protoner och tio elektroner. Vilken laddning har den, och varför?",
    "tex": "En partikel har elva protoner och tio elektroner. Vilken laddning har den, och varför?",
    "html": "En partikel har elva protoner och tio elektroner. Vilken laddning har den, och varför?"
  },
  {
    "key": "lesson/3/conceptMap/0/term",
    "plain": "Elektron",
    "tex": "Elektron",
    "html": "Elektron"
  },
  {
    "key": "lesson/3/conceptMap/0/meaning",
    "plain": "En negativt laddad del av atomen. Elektroner är viktiga för hur atomer binds ihop.",
    "tex": "En negativt laddad del av atomen. Elektroner är viktiga för hur atomer binds ihop.",
    "html": "En negativt laddad del av atomen. Elektroner är viktiga för hur atomer binds ihop."
  },
  {
    "key": "lesson/3/conceptMap/1/term",
    "plain": "Elektronpar",
    "tex": "Elektronpar",
    "html": "Elektronpar"
  },
  {
    "key": "lesson/3/conceptMap/1/meaning",
    "plain": "Två elektroner. Ett gemensamt elektronpar delas av två atomer i en bindning.",
    "tex": "Två elektroner. Ett gemensamt elektronpar delas av två atomer i en bindning.",
    "html": "Två elektroner. Ett gemensamt elektronpar delas av två atomer i en bindning."
  },
  {
    "key": "lesson/3/conceptMap/2/term",
    "plain": "Jon",
    "tex": "Jon",
    "html": "Jon"
  },
  {
    "key": "lesson/3/conceptMap/2/meaning",
    "plain": "En laddad atom eller atomgrupp. En atom blir en jon om den tar upp eller lämnar ifrån sig elektroner.",
    "tex": "En laddad atom eller atomgrupp. En atom blir en jon om den tar upp eller lämnar ifrån sig elektroner.",
    "html": "En laddad atom eller atomgrupp. En atom blir en jon om den tar upp eller lämnar ifrån sig elektroner."
  },
  {
    "key": "lesson/3/workedExample/title",
    "plain": "Följ H₂ från början till slut",
    "tex": "Följ \\(\\mathrm{H_2}\\) från början till slut",
    "html": "Följ <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{H_2}</annotation></semantics></math> från början till slut"
  },
  {
    "key": "lesson/3/workedExample/steps/0",
    "plain": "Före: två neutrala väteatomer ger sammanlagt två positiva kärnor och två negativa elektroner. Räkna båda sorternas delar.",
    "tex": "Före: två neutrala väteatomer ger sammanlagt två positiva kärnor och två negativa elektroner. Räkna båda sorternas delar.",
    "html": "Före: två neutrala väteatomer ger sammanlagt två positiva kärnor och två negativa elektroner. Räkna båda sorternas delar."
  },
  {
    "key": "lesson/3/workedExample/steps/1",
    "plain": "När bindningen bildas delar atomerna ett gemensamt elektronpar. De negativa elektronerna dras till båda de positiva kärnorna.",
    "tex": "När bindningen bildas delar atomerna ett gemensamt elektronpar. De negativa elektronerna dras till båda de positiva kärnorna.",
    "html": "När bindningen bildas delar atomerna ett gemensamt elektronpar. De negativa elektronerna dras till båda de positiva kärnorna."
  },
  {
    "key": "lesson/3/workedExample/steps/2",
    "plain": "Efter: H₂ består av samma två vätekärnor och samma två elektroner. En bindning har bildats, och de två väteatomerna ingår nu i en molekyl.",
    "tex": "Efter: \\(\\mathrm{H_2}\\) består av samma två vätekärnor och samma två elektroner. En bindning har bildats, och de två väteatomerna ingår nu i en molekyl.",
    "html": "Efter: <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{H_2}</annotation></semantics></math> består av samma två vätekärnor och samma två elektroner. En bindning har bildats, och de två väteatomerna ingår nu i en molekyl."
  },
  {
    "key": "lesson/3/misconception/claim",
    "plain": "”Atomer blir ett nytt grundämne när de bildar en kemisk förening.”",
    "tex": "”Atomer blir ett nytt grundämne när de bildar en kemisk förening.”",
    "html": "”Atomer blir ett nytt grundämne när de bildar en kemisk förening.”"
  },
  {
    "key": "lesson/3/misconception/correction",
    "plain": "Vid vanliga kemiska reaktioner finns atomkärnorna kvar. Elektroner och bindningar kan ordnas på nya sätt. Atomslaget bestäms av protonerna i kärnan, så väte är fortfarande väte även när det ingår i ett nytt ämne.",
    "tex": "Vid vanliga kemiska reaktioner finns atomkärnorna kvar. Elektroner och bindningar kan ordnas på nya sätt. Atomslaget bestäms av protonerna i kärnan, så väte är fortfarande väte även när det ingår i ett nytt ämne.",
    "html": "Vid vanliga kemiska reaktioner finns atomkärnorna kvar. Elektroner och bindningar kan ordnas på nya sätt. Atomslaget bestäms av protonerna i kärnan, så väte är fortfarande väte även när det ingår i ett nytt ämne."
  },
  {
    "key": "lesson/3/film/title",
    "plain": "Laddning, delade elektroner och bevarade kärnor",
    "tex": "Laddning, delade elektroner och bevarade kärnor",
    "html": "Laddning, delade elektroner och bevarade kärnor"
  },
  {
    "key": "lesson/3/film/before",
    "plain": "Välj en kärna och en elektron att följa. Räkna hur många av varje som finns före och efter bindningen.",
    "tex": "Välj en kärna och en elektron att följa. Räkna hur många av varje som finns före och efter bindningen.",
    "html": "Välj en kärna och en elektron att följa. Räkna hur många av varje som finns före och efter bindningen."
  },
  {
    "key": "lesson/3/film/after",
    "plain": "Visa H₂ och säg vad gemensamt elektronpar betyder. Förklara sedan varför väte fortfarande är väte efter reaktionen.",
    "tex": "Visa \\(\\mathrm{H_2}\\) och säg vad gemensamt elektronpar betyder. Förklara sedan varför väte fortfarande är väte efter reaktionen.",
    "html": "Visa <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{H_2}</annotation></semantics></math> och säg vad gemensamt elektronpar betyder. Förklara sedan varför väte fortfarande är väte efter reaktionen."
  },
  {
    "key": "lesson/3/summary",
    "plain": "Jag kan följa elektronerna i en bindning. När två väteatomer bildar H₂ delar de ett elektronpar. Samma två vätekärnor finns kvar.",
    "tex": "Jag kan följa elektronerna i en bindning. När två väteatomer bildar \\(\\mathrm{H_2}\\) delar de ett elektronpar. Samma två vätekärnor finns kvar.",
    "html": "Jag kan följa elektronerna i en bindning. När två väteatomer bildar <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{H_2}</annotation></semantics></math> delar de ett elektronpar. Samma två vätekärnor finns kvar."
  },
  {
    "key": "lesson/3/extraExamples/0/title",
    "plain": "Räkna laddning när en elektron flyttas",
    "tex": "Räkna laddning när en elektron flyttas",
    "html": "Räkna laddning när en elektron flyttas"
  },
  {
    "key": "lesson/3/extraExamples/0/steps/0",
    "plain": "En natriumatom har elva protoner och elva elektroner. Lika många plus och minus ger laddningen noll.",
    "tex": "En natriumatom har elva protoner och elva elektroner. Lika många plus och minus ger laddningen noll.",
    "html": "En natriumatom har elva protoner och elva elektroner. Lika många plus och minus ger laddningen noll."
  },
  {
    "key": "lesson/3/extraExamples/0/steps/1",
    "plain": "Om atomen lämnar ifrån sig en elektron finns elva protoner men tio elektroner. Ett plus blir över: natriumjonen skrivs Na⁺.",
    "tex": "Om atomen lämnar ifrån sig en elektron finns elva protoner men tio elektroner. Ett plus blir över: natriumjonen skrivs \\(\\mathrm{Na^+}\\).",
    "html": "Om atomen lämnar ifrån sig en elektron finns elva protoner men tio elektroner. Ett plus blir över: natriumjonen skrivs <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><mi mathvariant=\"normal\">N</mi><msup><mi mathvariant=\"normal\">a</mi><mo mathvariant=\"normal\">+</mo></msup></mrow><annotation encoding=\"application/x-tex\">\\mathrm{Na^+}</annotation></semantics></math>."
  },
  {
    "key": "lesson/3/extraExamples/0/steps/2",
    "plain": "Kärnan har fortfarande elva protoner. Därför är atomslaget fortfarande natrium. Elektronerna bestämmer här om partikeln är neutral eller laddad.",
    "tex": "Kärnan har fortfarande elva protoner. Därför är atomslaget fortfarande natrium. Elektronerna bestämmer här om partikeln är neutral eller laddad.",
    "html": "Kärnan har fortfarande elva protoner. Därför är atomslaget fortfarande natrium. Elektronerna bestämmer här om partikeln är neutral eller laddad."
  },
  {
    "key": "lesson/3/extraExamples/1/title",
    "plain": "Fördjupning: räkna vattnets ytterelektroner",
    "tex": "Fördjupning: räkna vattnets ytterelektroner",
    "html": "Fördjupning: räkna vattnets ytterelektroner"
  },
  {
    "key": "lesson/3/extraExamples/1/steps/0",
    "plain": "Ytterelektroner är elektroner i atomens yttersta upptagna skal. Syre har sex ytterelektroner och varje väteatom har en.",
    "tex": "Ytterelektroner är elektroner i atomens yttersta upptagna skal. Syre har sex ytterelektroner och varje väteatom har en.",
    "html": "Ytterelektroner är elektroner i atomens yttersta upptagna skal. Syre har sex ytterelektroner och varje väteatom har en."
  },
  {
    "key": "lesson/3/extraExamples/1/steps/1",
    "plain": "I en vattenmolekyl blir det sex plus en plus en: åtta ytterelektroner. Två elektronpar delas i de två bindningarna mellan syre och väte.",
    "tex": "I en vattenmolekyl blir det sex plus en plus en: åtta ytterelektroner. Två elektronpar delas i de två bindningarna mellan syre och väte.",
    "html": "I en vattenmolekyl blir det sex plus en plus en: åtta ytterelektroner. Två elektronpar delas i de två bindningarna mellan syre och väte."
  },
  {
    "key": "lesson/3/extraExamples/1/steps/2",
    "plain": "De återstående fyra ytterelektronerna visas som två par vid syret. Förklara först vilka elektroner som delas. Räkna sedan alla åtta så att ni följer samma elektroner genom bilden.",
    "tex": "De återstående fyra ytterelektronerna visas som två par vid syret. Förklara först vilka elektroner som delas. Räkna sedan alla åtta så att ni följer samma elektroner genom bilden.",
    "html": "De återstående fyra ytterelektronerna visas som två par vid syret. Förklara först vilka elektroner som delas. Räkna sedan alla åtta så att ni följer samma elektroner genom bilden."
  },
  {
    "key": "lesson/3/reflectionPrompts/0",
    "plain": "Rita före och efter med lika många kärnor. Låt er partner beskriva vad som ändrats hos elektronerna och kontrollera sedan beskrivningen tillsammans.",
    "tex": "Rita före och efter med lika många kärnor. Låt er partner beskriva vad som ändrats hos elektronerna och kontrollera sedan beskrivningen tillsammans.",
    "html": "Rita före och efter med lika många kärnor. Låt er partner beskriva vad som ändrats hos elektronerna och kontrollera sedan beskrivningen tillsammans."
  },
  {
    "key": "lesson/3/reflectionPrompts/1",
    "plain": "Två väteatomer delar ett elektronpar när H₂ bildas. Förklara med en ritning hur de två elektronerna hjälper till att hålla ihop atomerna.",
    "tex": "Två väteatomer delar ett elektronpar när \\(\\mathrm{H_2}\\) bildas. Förklara med en ritning hur de två elektronerna hjälper till att hålla ihop atomerna.",
    "html": "Två väteatomer delar ett elektronpar när <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{H_2}</annotation></semantics></math> bildas. Förklara med en ritning hur de två elektronerna hjälper till att hålla ihop atomerna."
  },
  {
    "key": "lesson/4/opener",
    "plain": "Vad är skillnaden mellan smältande is och en rostig cykel?",
    "tex": "Vad är skillnaden mellan smältande is och en rostig cykel?",
    "html": "Vad är skillnaden mellan smältande is och en rostig cykel?"
  },
  {
    "key": "lesson/4/intro/0",
    "plain": "En förändring kan synas tydligt utan att ett nytt ämne bildas. Vatten kan bli is, flytande vatten eller gas och ändå bestå av H₂O.",
    "tex": "En förändring kan synas tydligt utan att ett nytt ämne bildas. Vatten kan bli is, flytande vatten eller gas och ändå bestå av \\(\\mathrm{H_2O}\\).",
    "html": "En förändring kan synas tydligt utan att ett nytt ämne bildas. Vatten kan bli is, flytande vatten eller gas och ändå bestå av <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>."
  },
  {
    "key": "lesson/4/intro/1",
    "plain": "Jämför det med järn som rostar. Då reagerar järn med omgivningen och nya ämnen bildas. Följ atomerna och fråga vad ämnet består av före och efter förändringen.",
    "tex": "Jämför det med järn som rostar. Då reagerar järn med omgivningen och nya ämnen bildas. Följ atomerna och fråga vad ämnet består av före och efter förändringen.",
    "html": "Jämför det med järn som rostar. Då reagerar järn med omgivningen och nya ämnen bildas. Följ atomerna och fråga vad ämnet består av före och efter förändringen."
  },
  {
    "key": "lesson/4/sections/0/heading",
    "plain": "Fysikalisk förändring: samma ämne",
    "tex": "Fysikalisk förändring: samma ämne",
    "html": "Fysikalisk förändring: samma ämne"
  },
  {
    "key": "lesson/4/sections/0/body",
    "plain": "När is smälter kan vattenmolekylerna röra sig förbi varandra. Ämnet är vatten både före och efter. När vatten kokar går en del från vätska till gas. Varje molekyl är fortfarande H₂O. De här förändringarna kallas fysikaliska. Ett ämne kan också ändra form, som när en metalltråd böjs eller ett papper rivs. Föremålet ser annorlunda ut, men det betyder inte att ett nytt ämne har bildats. Beskriv först vad som ändras: form, rörelse eller tillstånd. Förklara sedan vad som finns kvar. För vatten är det samma vattenmolekyler.",
    "tex": "När is smälter kan vattenmolekylerna röra sig förbi varandra. Ämnet är vatten både före och efter. När vatten kokar går en del från vätska till gas. Varje molekyl är fortfarande \\(\\mathrm{H_2O}\\). De här förändringarna kallas fysikaliska. Ett ämne kan också ändra form, som när en metalltråd böjs eller ett papper rivs. Föremålet ser annorlunda ut, men det betyder inte att ett nytt ämne har bildats. Beskriv först vad som ändras: form, rörelse eller tillstånd. Förklara sedan vad som finns kvar. För vatten är det samma vattenmolekyler.",
    "html": "När is smälter kan vattenmolekylerna röra sig förbi varandra. Ämnet är vatten både före och efter. När vatten kokar går en del från vätska till gas. Varje molekyl är fortfarande <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>. De här förändringarna kallas fysikaliska. Ett ämne kan också ändra form, som när en metalltråd böjs eller ett papper rivs. Föremålet ser annorlunda ut, men det betyder inte att ett nytt ämne har bildats. Beskriv först vad som ändras: form, rörelse eller tillstånd. Förklara sedan vad som finns kvar. För vatten är det samma vattenmolekyler."
  },
  {
    "key": "lesson/4/sections/0/question",
    "plain": "Vad är oförändrat när en isbit smälter?",
    "tex": "Vad är oförändrat när en isbit smälter?",
    "html": "Vad är oförändrat när en isbit smälter?"
  },
  {
    "key": "lesson/4/sections/1/heading",
    "plain": "Kemisk förändring: nya ämnen",
    "tex": "Kemisk förändring: nya ämnen",
    "html": "Kemisk förändring: nya ämnen"
  },
  {
    "key": "lesson/4/sections/1/body",
    "plain": "När järn rostar deltar järn, syre och fukt i ett förlopp där nya ämnen bildas. Rost har andra egenskaper än det ursprungliga järnet. Atomerna finns kvar, men ingår i nya ämnen. I ritningen följer vi järnoxiden Fe₂O₃ för att kunna räkna atomer: 4Fe + 3O₂ → 2Fe₂O₃. På vänster sida finns fyra järnatomer och sex syreatomer. Samma antal finns på höger sida. Rost kan innehålla flera järnföreningar, och vatten spelar roll i verklig rostbildning. Använd formeln för att följa atomantalet och huvudidén: en kemisk förändring bildar nya ämnen.",
    "tex": "När järn rostar deltar järn, syre och fukt i ett förlopp där nya ämnen bildas. Rost har andra egenskaper än det ursprungliga järnet. Atomerna finns kvar, men ingår i nya ämnen. I ritningen följer vi järnoxiden \\(\\mathrm{Fe_2O_3}\\) för att kunna räkna atomer: \\(4\\mathrm{Fe}+3\\mathrm{O_2}\\rightarrow 2\\mathrm{Fe_2O_3}\\). På vänster sida finns fyra järnatomer och sex syreatomer. Samma antal finns på höger sida. Rost kan innehålla flera järnföreningar, och vatten spelar roll i verklig rostbildning. Använd formeln för att följa atomantalet och huvudidén: en kemisk förändring bildar nya ämnen.",
    "html": "När järn rostar deltar järn, syre och fukt i ett förlopp där nya ämnen bildas. Rost har andra egenskaper än det ursprungliga järnet. Atomerna finns kvar, men ingår i nya ämnen. I ritningen följer vi järnoxiden <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><mi mathvariant=\"normal\">F</mi><msub><mi mathvariant=\"normal\">e</mi><mn mathvariant=\"normal\">2</mn></msub><msub><mi mathvariant=\"normal\">O</mi><mn mathvariant=\"normal\">3</mn></msub></mrow><annotation encoding=\"application/x-tex\">\\mathrm{Fe_2O_3}</annotation></semantics></math> för att kunna räkna atomer: <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><mn>4</mn><mrow><mi mathvariant=\"normal\">F</mi><mi mathvariant=\"normal\">e</mi></mrow><mo>+</mo><mn>3</mn><msub><mi mathvariant=\"normal\">O</mi><mn mathvariant=\"normal\">2</mn></msub><mo>→</mo><mn>2</mn><mrow><mi mathvariant=\"normal\">F</mi><msub><mi mathvariant=\"normal\">e</mi><mn mathvariant=\"normal\">2</mn></msub><msub><mi mathvariant=\"normal\">O</mi><mn mathvariant=\"normal\">3</mn></msub></mrow></mrow><annotation encoding=\"application/x-tex\">4\\mathrm{Fe}+3\\mathrm{O_2}\\rightarrow 2\\mathrm{Fe_2O_3}</annotation></semantics></math>. På vänster sida finns fyra järnatomer och sex syreatomer. Samma antal finns på höger sida. Rost kan innehålla flera järnföreningar, och vatten spelar roll i verklig rostbildning. Använd formeln för att följa atomantalet och huvudidén: en kemisk förändring bildar nya ämnen."
  },
  {
    "key": "lesson/4/sections/1/question",
    "plain": "Räkna järn och syre på båda sidor om pilen. Vad har förändrats trots att atomerna finns kvar?",
    "tex": "Räkna järn och syre på båda sidor om pilen. Vad har förändrats trots att atomerna finns kvar?",
    "html": "Räkna järn och syre på båda sidor om pilen. Vad har förändrats trots att atomerna finns kvar?"
  },
  {
    "key": "lesson/4/sections/2/heading",
    "plain": "Ledtrådar behöver en förklaring",
    "tex": "Ledtrådar behöver en förklaring",
    "html": "Ledtrådar behöver en förklaring"
  },
  {
    "key": "lesson/4/sections/2/body",
    "plain": "Bubblor, en temperaturändring eller en ny färg kan hjälpa oss att upptäcka en förändring. Men en enda sådan observation avgör inte om nya ämnen har bildats. Kokande vatten bubblar när vattenånga bildas, och ämnet är fortfarande vatten. När ett vedträ brinner bildas däremot bland annat koldioxid och vatten, alltså nya ämnen. Uppvärmning kan därför leda till både fysikaliska och kemiska förändringar. Ett bra svar innehåller ett exempel och en motivering. Säg vad som finns före, vad som finns efter och varför ni väljer just den gruppen.",
    "tex": "Bubblor, en temperaturändring eller en ny färg kan hjälpa oss att upptäcka en förändring. Men en enda sådan observation avgör inte om nya ämnen har bildats. Kokande vatten bubblar när vattenånga bildas, och ämnet är fortfarande vatten. När ett vedträ brinner bildas däremot bland annat koldioxid och vatten, alltså nya ämnen. Uppvärmning kan därför leda till både fysikaliska och kemiska förändringar. Ett bra svar innehåller ett exempel och en motivering. Säg vad som finns före, vad som finns efter och varför ni väljer just den gruppen.",
    "html": "Bubblor, en temperaturändring eller en ny färg kan hjälpa oss att upptäcka en förändring. Men en enda sådan observation avgör inte om nya ämnen har bildats. Kokande vatten bubblar när vattenånga bildas, och ämnet är fortfarande vatten. När ett vedträ brinner bildas däremot bland annat koldioxid och vatten, alltså nya ämnen. Uppvärmning kan därför leda till både fysikaliska och kemiska förändringar. Ett bra svar innehåller ett exempel och en motivering. Säg vad som finns före, vad som finns efter och varför ni väljer just den gruppen."
  },
  {
    "key": "lesson/4/sections/2/question",
    "plain": "Varför räcker meningen ”det bubblar” inte som bevis för en kemisk förändring?",
    "tex": "Varför räcker meningen ”det bubblar” inte som bevis för en kemisk förändring?",
    "html": "Varför räcker meningen ”det bubblar” inte som bevis för en kemisk förändring?"
  },
  {
    "key": "lesson/4/conceptMap/0/term",
    "plain": "Fysikalisk förändring",
    "tex": "Fysikalisk förändring",
    "html": "Fysikalisk förändring"
  },
  {
    "key": "lesson/4/conceptMap/0/meaning",
    "plain": "En förändring där ämnet finns kvar, till exempel när vatten smälter eller kokar.",
    "tex": "En förändring där ämnet finns kvar, till exempel när vatten smälter eller kokar.",
    "html": "En förändring där ämnet finns kvar, till exempel när vatten smälter eller kokar."
  },
  {
    "key": "lesson/4/conceptMap/1/term",
    "plain": "Kemisk förändring",
    "tex": "Kemisk förändring",
    "html": "Kemisk förändring"
  },
  {
    "key": "lesson/4/conceptMap/1/meaning",
    "plain": "En förändring där nya ämnen bildas.",
    "tex": "En förändring där nya ämnen bildas.",
    "html": "En förändring där nya ämnen bildas."
  },
  {
    "key": "lesson/4/conceptMap/2/term",
    "plain": "Kemisk reaktion",
    "tex": "Kemisk reaktion",
    "html": "Kemisk reaktion"
  },
  {
    "key": "lesson/4/conceptMap/2/meaning",
    "plain": "Ett förlopp där ämnen omvandlas till nya ämnen. Atomerna finns kvar och bindningarna ändras.",
    "tex": "Ett förlopp där ämnen omvandlas till nya ämnen. Atomerna finns kvar och bindningarna ändras.",
    "html": "Ett förlopp där ämnen omvandlas till nya ämnen. Atomerna finns kvar och bindningarna ändras."
  },
  {
    "key": "lesson/4/workedExample/title",
    "plain": "Förklara kokning i tre steg",
    "tex": "Förklara kokning i tre steg",
    "html": "Förklara kokning i tre steg"
  },
  {
    "key": "lesson/4/workedExample/steps/0",
    "plain": "Observation: vatten värms och bubblor stiger genom vätskan. Beskriv det ni ser innan ni bestämmer förändringens typ.",
    "tex": "Observation: vatten värms och bubblor stiger genom vätskan. Beskriv det ni ser innan ni bestämmer förändringens typ.",
    "html": "Observation: vatten värms och bubblor stiger genom vätskan. Beskriv det ni ser innan ni bestämmer förändringens typ."
  },
  {
    "key": "lesson/4/workedExample/steps/1",
    "plain": "Ämnen: vätskan består av H₂O och vattenångan i bubblorna består också av H₂O. Följ en vattenmolekyl från vätska till gas.",
    "tex": "Ämnen: vätskan består av \\(\\mathrm{H_2O}\\) och vattenångan i bubblorna består också av \\(\\mathrm{H_2O}\\). Följ en vattenmolekyl från vätska till gas.",
    "html": "Ämnen: vätskan består av <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math> och vattenångan i bubblorna består också av <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>. Följ en vattenmolekyl från vätska till gas."
  },
  {
    "key": "lesson/4/workedExample/steps/2",
    "plain": "Slutsats: vattnet byter tillstånd men är fortfarande samma ämne. Kokningen är en fysikalisk förändring.",
    "tex": "Slutsats: vattnet byter tillstånd men är fortfarande samma ämne. Kokningen är en fysikalisk förändring.",
    "html": "Slutsats: vattnet byter tillstånd men är fortfarande samma ämne. Kokningen är en fysikalisk förändring."
  },
  {
    "key": "lesson/4/misconception/claim",
    "plain": "”Om förändringen är svår att göra ogjord måste den vara kemisk.”",
    "tex": "”Om förändringen är svår att göra ogjord måste den vara kemisk.”",
    "html": "”Om förändringen är svår att göra ogjord måste den vara kemisk.”"
  },
  {
    "key": "lesson/4/misconception/correction",
    "plain": "Det avgörande är om nya ämnen bildas. Klippt papper visar hur ett föremål kan vara svårt att återställa efter en fysikalisk förändring. Vid en kemisk förändring behöver förklaringen visa vilka nya ämnen som bildas.",
    "tex": "Det avgörande är om nya ämnen bildas. Klippt papper visar hur ett föremål kan vara svårt att återställa efter en fysikalisk förändring. Vid en kemisk förändring behöver förklaringen visa vilka nya ämnen som bildas.",
    "html": "Det avgörande är om nya ämnen bildas. Klippt papper visar hur ett föremål kan vara svårt att återställa efter en fysikalisk förändring. Vid en kemisk förändring behöver förklaringen visa vilka nya ämnen som bildas."
  },
  {
    "key": "lesson/4/film/title",
    "plain": "Från isens ordning till järnets nya bindningar",
    "tex": "Från isens ordning till järnets nya bindningar",
    "html": "Från isens ordning till järnets nya bindningar"
  },
  {
    "key": "lesson/4/film/before",
    "plain": "Följ en vattenmolekyl när isen smälter. Jämför sedan med järnatomerna när ett nytt ämne bildas.",
    "tex": "Följ en vattenmolekyl när isen smälter. Jämför sedan med järnatomerna när ett nytt ämne bildas.",
    "html": "Följ en vattenmolekyl när isen smälter. Jämför sedan med järnatomerna när ett nytt ämne bildas."
  },
  {
    "key": "lesson/4/film/after",
    "plain": "Välj en fysikalisk och en kemisk förändring. Beskriv vad som finns före och efter och använd orden nytt ämne.",
    "tex": "Välj en fysikalisk och en kemisk förändring. Beskriv vad som finns före och efter och använd orden nytt ämne.",
    "html": "Välj en fysikalisk och en kemisk förändring. Beskriv vad som finns före och efter och använd orden nytt ämne."
  },
  {
    "key": "lesson/4/summary",
    "plain": "Jag skiljer förändringarna åt genom att fråga om nya ämnen bildas. Smältning och kokning är fysikaliska förändringar. Rostbildning och förbränning är kemiska förändringar.",
    "tex": "Jag skiljer förändringarna åt genom att fråga om nya ämnen bildas. Smältning och kokning är fysikaliska förändringar. Rostbildning och förbränning är kemiska förändringar.",
    "html": "Jag skiljer förändringarna åt genom att fråga om nya ämnen bildas. Smältning och kokning är fysikaliska förändringar. Rostbildning och förbränning är kemiska förändringar."
  },
  {
    "key": "lesson/4/extraExamples/0/title",
    "plain": "Räkna atomer i en järnoxid",
    "tex": "Räkna atomer i en järnoxid",
    "html": "Räkna atomer i en järnoxid"
  },
  {
    "key": "lesson/4/extraExamples/0/steps/0",
    "plain": "I räkneexemplet bildas järnoxiden Fe₂O₃. Reaktionen skrivs 4Fe + 3O₂ → 2Fe₂O₃. Vi följer hur järn- och syreatomerna går ihop i oxiden.",
    "tex": "I räkneexemplet bildas järnoxiden \\(\\mathrm{Fe_2O_3}\\). Reaktionen skrivs \\(4\\mathrm{Fe}+3\\mathrm{O_2}\\rightarrow 2\\mathrm{Fe_2O_3}\\). Vi följer hur järn- och syreatomerna går ihop i oxiden.",
    "html": "I räkneexemplet bildas järnoxiden <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><mi mathvariant=\"normal\">F</mi><msub><mi mathvariant=\"normal\">e</mi><mn mathvariant=\"normal\">2</mn></msub><msub><mi mathvariant=\"normal\">O</mi><mn mathvariant=\"normal\">3</mn></msub></mrow><annotation encoding=\"application/x-tex\">\\mathrm{Fe_2O_3}</annotation></semantics></math>. Reaktionen skrivs <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><mn>4</mn><mrow><mi mathvariant=\"normal\">F</mi><mi mathvariant=\"normal\">e</mi></mrow><mo>+</mo><mn>3</mn><msub><mi mathvariant=\"normal\">O</mi><mn mathvariant=\"normal\">2</mn></msub><mo>→</mo><mn>2</mn><mrow><mi mathvariant=\"normal\">F</mi><msub><mi mathvariant=\"normal\">e</mi><mn mathvariant=\"normal\">2</mn></msub><msub><mi mathvariant=\"normal\">O</mi><mn mathvariant=\"normal\">3</mn></msub></mrow></mrow><annotation encoding=\"application/x-tex\">4\\mathrm{Fe}+3\\mathrm{O_2}\\rightarrow 2\\mathrm{Fe_2O_3}</annotation></semantics></math>. Vi följer hur järn- och syreatomerna går ihop i oxiden."
  },
  {
    "key": "lesson/4/extraExamples/0/steps/1",
    "plain": "Före finns fyra järnatomer och tre gånger två syreatomer: sex syreatomer. Efter finns två gånger två järnatomer och två gånger tre syreatomer.",
    "tex": "Före finns fyra järnatomer och tre gånger två syreatomer: sex syreatomer. Efter finns två gånger två järnatomer och två gånger tre syreatomer.",
    "html": "Före finns fyra järnatomer och tre gånger två syreatomer: sex syreatomer. Efter finns två gånger två järnatomer och två gånger tre syreatomer."
  },
  {
    "key": "lesson/4/extraExamples/0/steps/2",
    "plain": "Båda sidor innehåller fyra Fe och sex O. Atomantalet bevaras, medan bindningarna och ämnena förändras. Rost innehåller järnföreningar; här har vi följt en bestämd järnoxid för att träna räkningen.",
    "tex": "Båda sidor innehåller fyra Fe och sex O. Atomantalet bevaras, medan bindningarna och ämnena förändras. Rost innehåller järnföreningar; här har vi följt en bestämd järnoxid för att träna räkningen.",
    "html": "Båda sidor innehåller fyra Fe och sex O. Atomantalet bevaras, medan bindningarna och ämnena förändras. Rost innehåller järnföreningar; här har vi följt en bestämd järnoxid för att träna räkningen."
  },
  {
    "key": "lesson/4/extraExamples/1/title",
    "plain": "Samma utgångsföremål, två olika förändringar",
    "tex": "Samma utgångsföremål, två olika förändringar",
    "html": "Samma utgångsföremål, två olika förändringar"
  },
  {
    "key": "lesson/4/extraExamples/1/steps/0",
    "plain": "Tänk först på ved som delas i mindre bitar. Formen och storleken ändras, medan ämnena i träet finns kvar genom själva delningen.",
    "tex": "Tänk först på ved som delas i mindre bitar. Formen och storleken ändras, medan ämnena i träet finns kvar genom själva delningen.",
    "html": "Tänk först på ved som delas i mindre bitar. Formen och storleken ändras, medan ämnena i träet finns kvar genom själva delningen."
  },
  {
    "key": "lesson/4/extraExamples/1/steps/1",
    "plain": "Tänk sedan på ved som brinner. Ämnen i veden reagerar med syre, och bland annat koldioxid och vatten bildas.",
    "tex": "Tänk sedan på ved som brinner. Ämnen i veden reagerar med syre, och bland annat koldioxid och vatten bildas.",
    "html": "Tänk sedan på ved som brinner. Ämnen i veden reagerar med syre, och bland annat koldioxid och vatten bildas."
  },
  {
    "key": "lesson/4/extraExamples/1/steps/2",
    "plain": "Jämför med samma fråga i båda fallen: vilka nya ämnen har bildats? Motivera svaret med ämnena, snarare än hur stor förändringen ser ut.",
    "tex": "Jämför med samma fråga i båda fallen: vilka nya ämnen har bildats? Motivera svaret med ämnena, snarare än hur stor förändringen ser ut.",
    "html": "Jämför med samma fråga i båda fallen: vilka nya ämnen har bildats? Motivera svaret med ämnena, snarare än hur stor förändringen ser ut."
  },
  {
    "key": "lesson/4/reflectionPrompts/0",
    "plain": "Byt enbart orden ”det bubblar, alltså är det kemiskt” mot ett fullständigt resonemang med observation, ämne och slutsats.",
    "tex": "Byt enbart orden ”det bubblar, alltså är det kemiskt” mot ett fullständigt resonemang med observation, ämne och slutsats.",
    "html": "Byt enbart orden ”det bubblar, alltså är det kemiskt” mot ett fullständigt resonemang med observation, ämne och slutsats."
  },
  {
    "key": "lesson/4/reflectionPrompts/1",
    "plain": "Ge ett exempel på en fysikalisk och ett på en kemisk förändring från vardagen. Låt er partner kontrollera förklaringen med frågan ”bildas nya ämnen?”.",
    "tex": "Ge ett exempel på en fysikalisk och ett på en kemisk förändring från vardagen. Låt er partner kontrollera förklaringen med frågan ”bildas nya ämnen?”.",
    "html": "Ge ett exempel på en fysikalisk och ett på en kemisk förändring från vardagen. Låt er partner kontrollera förklaringen med frågan ”bildas nya ämnen?”."
  },
  {
    "key": "lesson/5/opener",
    "plain": "Varför behöver kastrullens botten och handtag olika material?",
    "tex": "Varför behöver kastrullens botten och handtag olika material?",
    "html": "Varför behöver kastrullens botten och handtag olika material?"
  },
  {
    "key": "lesson/5/intro/0",
    "plain": "När vi väljer ett material behöver vi veta vad delen ska göra. Värmen ska lätt nå maten genom kastrullens botten. Samma värme ska överföras långsammare till handen genom handtaget.",
    "tex": "När vi väljer ett material behöver vi veta vad delen ska göra. Värmen ska lätt nå maten genom kastrullens botten. Samma värme ska överföras långsammare till handen genom handtaget.",
    "html": "När vi väljer ett material behöver vi veta vad delen ska göra. Värmen ska lätt nå maten genom kastrullens botten. Samma värme ska överföras långsammare till handen genom handtaget."
  },
  {
    "key": "lesson/5/intro/1",
    "plain": "Den skillnaden hjälper oss att använda ordet egenskap. Börja med delens uppgift, välj en användbar egenskap och förklara hur den hjälper. Då blir svaret tydligare än ett materialnamn utan motivering.",
    "tex": "Den skillnaden hjälper oss att använda ordet egenskap. Börja med delens uppgift, välj en användbar egenskap och förklara hur den hjälper. Då blir svaret tydligare än ett materialnamn utan motivering.",
    "html": "Den skillnaden hjälper oss att använda ordet egenskap. Börja med delens uppgift, välj en användbar egenskap och förklara hur den hjälper. Då blir svaret tydligare än ett materialnamn utan motivering."
  },
  {
    "key": "lesson/5/sections/0/heading",
    "plain": "Egenskaper beskriver hur ämnen beter sig",
    "tex": "Egenskaper beskriver hur ämnen beter sig",
    "html": "Egenskaper beskriver hur ämnen beter sig"
  },
  {
    "key": "lesson/5/sections/0/body",
    "plain": "Ett ämne kan vara hårt eller mjukt, ha hög eller låg smältpunkt och leda värme eller elektricitet olika bra. Löslighet handlar om hur mycket som kan lösas, till exempel i vatten. Densitet betyder massa per volym: hur mycket massa som ryms i en viss volym. Två lika stora klossar kan därför ha olika massa. När ni jämför egenskaper ska undersökningarna vara rättvisa. Använd till exempel samma mängd vatten och samma temperatur om ni jämför hur mycket av två ämnen som kan lösas. Då blir resultatet lättare att tolka.",
    "tex": "Ett ämne kan vara hårt eller mjukt, ha hög eller låg smältpunkt och leda värme eller elektricitet olika bra. Löslighet handlar om hur mycket som kan lösas, till exempel i vatten. Densitet betyder massa per volym: hur mycket massa som ryms i en viss volym. Två lika stora klossar kan därför ha olika massa. När ni jämför egenskaper ska undersökningarna vara rättvisa. Använd till exempel samma mängd vatten och samma temperatur om ni jämför hur mycket av två ämnen som kan lösas. Då blir resultatet lättare att tolka.",
    "html": "Ett ämne kan vara hårt eller mjukt, ha hög eller låg smältpunkt och leda värme eller elektricitet olika bra. Löslighet handlar om hur mycket som kan lösas, till exempel i vatten. Densitet betyder massa per volym: hur mycket massa som ryms i en viss volym. Två lika stora klossar kan därför ha olika massa. När ni jämför egenskaper ska undersökningarna vara rättvisa. Använd till exempel samma mängd vatten och samma temperatur om ni jämför hur mycket av två ämnen som kan lösas. Då blir resultatet lättare att tolka."
  },
  {
    "key": "lesson/5/sections/0/question",
    "plain": "Varför kan varmt vatten till det ena provet och kallt till det andra ge en orättvis jämförelse?",
    "tex": "Varför kan varmt vatten till det ena provet och kallt till det andra ge en orättvis jämförelse?",
    "html": "Varför kan varmt vatten till det ena provet och kallt till det andra ge en orättvis jämförelse?"
  },
  {
    "key": "lesson/5/sections/1/heading",
    "plain": "Välj ett test som kan skilja proven åt",
    "tex": "Välj ett test som kan skilja proven åt",
    "html": "Välj ett test som kan skilja proven åt"
  },
  {
    "key": "lesson/5/sections/1/body",
    "plain": "Anta att ett prov är antingen järn eller koppar. En vanlig magnet kan skilja dem åt: järn dras tydligt till magneten, medan koppar inte gör det. Ett test av elektrisk ledningsförmåga ger mindre hjälp i just den frågan, eftersom båda metallerna leder elektricitet. Om fler ämnen är möjliga kan fler tester behövas. Färg ensam räcker ofta inte. Salt och socker kan till exempel båda vara vita och lösliga i vatten. Börja med vilka ämnen som är möjliga. Välj sedan ett test som ger olika förväntade resultat. Smaka aldrig på okända prov.",
    "tex": "Anta att ett prov är antingen järn eller koppar. En vanlig magnet kan skilja dem åt: järn dras tydligt till magneten, medan koppar inte gör det. Ett test av elektrisk ledningsförmåga ger mindre hjälp i just den frågan, eftersom båda metallerna leder elektricitet. Om fler ämnen är möjliga kan fler tester behövas. Färg ensam räcker ofta inte. Salt och socker kan till exempel båda vara vita och lösliga i vatten. Börja med vilka ämnen som är möjliga. Välj sedan ett test som ger olika förväntade resultat. Smaka aldrig på okända prov.",
    "html": "Anta att ett prov är antingen järn eller koppar. En vanlig magnet kan skilja dem åt: järn dras tydligt till magneten, medan koppar inte gör det. Ett test av elektrisk ledningsförmåga ger mindre hjälp i just den frågan, eftersom båda metallerna leder elektricitet. Om fler ämnen är möjliga kan fler tester behövas. Färg ensam räcker ofta inte. Salt och socker kan till exempel båda vara vita och lösliga i vatten. Börja med vilka ämnen som är möjliga. Välj sedan ett test som ger olika förväntade resultat. Smaka aldrig på okända prov."
  },
  {
    "key": "lesson/5/sections/1/question",
    "plain": "Varför är en magnet ett bättre test än elektrisk ledning när alternativen är järn och koppar?",
    "tex": "Varför är en magnet ett bättre test än elektrisk ledning när alternativen är järn och koppar?",
    "html": "Varför är en magnet ett bättre test än elektrisk ledning när alternativen är järn och koppar?"
  },
  {
    "key": "lesson/5/sections/2/heading",
    "plain": "Koppla materialets egenskap till delens uppgift",
    "tex": "Koppla materialets egenskap till delens uppgift",
    "html": "Koppla materialets egenskap till delens uppgift"
  },
  {
    "key": "lesson/5/sections/2/body",
    "plain": "Kastrullens botten ska föra värme från spisen till maten. Där är god värmeledningsförmåga användbar. I handtaget vill vi i stället att värmen ska överföras långsammare till handen. Men ett material som leder värme långsamt måste också tåla temperaturen där handtaget sitter. Det behöver vara hållfast och gå att greppa. Därför behöver vi ofta jämföra flera egenskaper samtidigt. Förklara i tre steg: delens uppgift, materialets egenskap och följden av egenskapen. Säg till exempel att botten ska värma maten, att metallen leder värme bra och att värmen därför kan spridas till maten.",
    "tex": "Kastrullens botten ska föra värme från spisen till maten. Där är god värmeledningsförmåga användbar. I handtaget vill vi i stället att värmen ska överföras långsammare till handen. Men ett material som leder värme långsamt måste också tåla temperaturen där handtaget sitter. Det behöver vara hållfast och gå att greppa. Därför behöver vi ofta jämföra flera egenskaper samtidigt. Förklara i tre steg: delens uppgift, materialets egenskap och följden av egenskapen. Säg till exempel att botten ska värma maten, att metallen leder värme bra och att värmen därför kan spridas till maten.",
    "html": "Kastrullens botten ska föra värme från spisen till maten. Där är god värmeledningsförmåga användbar. I handtaget vill vi i stället att värmen ska överföras långsammare till handen. Men ett material som leder värme långsamt måste också tåla temperaturen där handtaget sitter. Det behöver vara hållfast och gå att greppa. Därför behöver vi ofta jämföra flera egenskaper samtidigt. Förklara i tre steg: delens uppgift, materialets egenskap och följden av egenskapen. Säg till exempel att botten ska värma maten, att metallen leder värme bra och att värmen därför kan spridas till maten."
  },
  {
    "key": "lesson/5/sections/2/question",
    "plain": "Ett material leder värme långsamt men mjuknar när kastrullen används. Vad behöver ni också kräva av handtaget?",
    "tex": "Ett material leder värme långsamt men mjuknar när kastrullen används. Vad behöver ni också kräva av handtaget?",
    "html": "Ett material leder värme långsamt men mjuknar när kastrullen används. Vad behöver ni också kräva av handtaget?"
  },
  {
    "key": "lesson/5/conceptMap/0/term",
    "plain": "Egenskap",
    "tex": "Egenskap",
    "html": "Egenskap"
  },
  {
    "key": "lesson/5/conceptMap/0/meaning",
    "plain": "Något som beskriver hur ett ämne eller material är och beter sig.",
    "tex": "Något som beskriver hur ett ämne eller material är och beter sig.",
    "html": "Något som beskriver hur ett ämne eller material är och beter sig."
  },
  {
    "key": "lesson/5/conceptMap/1/term",
    "plain": "Värmeledningsförmåga",
    "tex": "Värmeledningsförmåga",
    "html": "Värmeledningsförmåga"
  },
  {
    "key": "lesson/5/conceptMap/1/meaning",
    "plain": "Hur bra ett material överför värme genom sig.",
    "tex": "Hur bra ett material överför värme genom sig.",
    "html": "Hur bra ett material överför värme genom sig."
  },
  {
    "key": "lesson/5/conceptMap/2/term",
    "plain": "Densitet",
    "tex": "Densitet",
    "html": "Densitet"
  },
  {
    "key": "lesson/5/conceptMap/2/meaning",
    "plain": "Massa per volym: hur mycket massa som ryms i en viss volym.",
    "tex": "Massa per volym: hur mycket massa som ryms i en viss volym.",
    "html": "Massa per volym: hur mycket massa som ryms i en viss volym."
  },
  {
    "key": "lesson/5/workedExample/title",
    "plain": "Motivera kastrullens två materialval",
    "tex": "Motivera kastrullens två materialval",
    "html": "Motivera kastrullens två materialval"
  },
  {
    "key": "lesson/5/workedExample/steps/0",
    "plain": "Uppgift: botten ska föra energi från spisen till maten. Välj därför ett material med god värmeledningsförmåga där värmen ska passera.",
    "tex": "Uppgift: botten ska föra energi från spisen till maten. Välj därför ett material med god värmeledningsförmåga där värmen ska passera.",
    "html": "Uppgift: botten ska föra energi från spisen till maten. Välj därför ett material med god värmeledningsförmåga där värmen ska passera."
  },
  {
    "key": "lesson/5/workedExample/steps/1",
    "plain": "Följd: värmen kan spridas genom botten. Förklara hur egenskapen hjälper just den delen av kastrullen att göra sitt arbete.",
    "tex": "Följd: värmen kan spridas genom botten. Förklara hur egenskapen hjälper just den delen av kastrullen att göra sitt arbete.",
    "html": "Följd: värmen kan spridas genom botten. Förklara hur egenskapen hjälper just den delen av kastrullen att göra sitt arbete."
  },
  {
    "key": "lesson/5/workedExample/steps/2",
    "plain": "Jämförelse: handtaget behöver överföra värme långsammare till handen. Lägg till att det också måste tåla temperaturen och hålla när kastrullen lyfts.",
    "tex": "Jämförelse: handtaget behöver överföra värme långsammare till handen. Lägg till att det också måste tåla temperaturen och hålla när kastrullen lyfts.",
    "html": "Jämförelse: handtaget behöver överföra värme långsammare till handen. Lägg till att det också måste tåla temperaturen och hålla när kastrullen lyfts."
  },
  {
    "key": "lesson/5/misconception/claim",
    "plain": "”Två vita pulver måste vara samma ämne.”",
    "tex": "”Två vita pulver måste vara samma ämne.”",
    "html": "”Två vita pulver måste vara samma ämne.”"
  },
  {
    "key": "lesson/5/misconception/correction",
    "plain": "Färg är en egenskap bland flera. Salt och socker kan båda vara vita och lösliga i vatten. För att skilja prov åt behöver vi välja undersökningar som ger användbar information. Smaka aldrig på okända prov.",
    "tex": "Färg är en egenskap bland flera. Salt och socker kan båda vara vita och lösliga i vatten. För att skilja prov åt behöver vi välja undersökningar som ger användbar information. Smaka aldrig på okända prov.",
    "html": "Färg är en egenskap bland flera. Salt och socker kan båda vara vita och lösliga i vatten. För att skilja prov åt behöver vi välja undersökningar som ger användbar information. Smaka aldrig på okända prov."
  },
  {
    "key": "lesson/5/film/title",
    "plain": "Värme på väg: egenskap blir funktion",
    "tex": "Värme på väg: egenskap blir funktion",
    "html": "Värme på väg: egenskap blir funktion"
  },
  {
    "key": "lesson/5/film/before",
    "plain": "Följ värmen från spisen. Var ska den lätt kunna gå vidare, och var är långsammare värmeöverföring användbar?",
    "tex": "Följ värmen från spisen. Var ska den lätt kunna gå vidare, och var är långsammare värmeöverföring användbar?",
    "html": "Följ värmen från spisen. Var ska den lätt kunna gå vidare, och var är långsammare värmeöverföring användbar?"
  },
  {
    "key": "lesson/5/film/after",
    "plain": "Förklara materialvalen med eftersom: ett material till botten och ett till handtaget. Nämn också ett andra krav.",
    "tex": "Förklara materialvalen med eftersom: ett material till botten och ett till handtaget. Nämn också ett andra krav.",
    "html": "Förklara materialvalen med eftersom: ett material till botten och ett till handtaget. Nämn också ett andra krav."
  },
  {
    "key": "lesson/5/summary",
    "plain": "Jag kan välja material genom att koppla uppgift till egenskap. Botten ska leda värme till maten. Handtaget ska överföra värme långsammare till handen och tåla användningen.",
    "tex": "Jag kan välja material genom att koppla uppgift till egenskap. Botten ska leda värme till maten. Handtaget ska överföra värme långsammare till handen och tåla användningen.",
    "html": "Jag kan välja material genom att koppla uppgift till egenskap. Botten ska leda värme till maten. Handtaget ska överföra värme långsammare till handen och tåla användningen."
  },
  {
    "key": "lesson/5/extraExamples/0/title",
    "plain": "Lika stor volym gör densiteten jämförbar",
    "tex": "Lika stor volym gör densiteten jämförbar",
    "html": "Lika stor volym gör densiteten jämförbar"
  },
  {
    "key": "lesson/5/extraExamples/0/steps/0",
    "plain": "Tänk er två kuber med samma volym, en av ämne A och en av ämne B. Väg dem med samma våg och jämför massorna.",
    "tex": "Tänk er två kuber med samma volym, en av ämne A och en av ämne B. Väg dem med samma våg och jämför massorna.",
    "html": "Tänk er två kuber med samma volym, en av ämne A och en av ämne B. Väg dem med samma våg och jämför massorna."
  },
  {
    "key": "lesson/5/extraExamples/0/steps/1",
    "plain": "Om kuben av A har större massa än kuben av B, har A högre densitet. Förklaringen är att mer massa finns i samma volym.",
    "tex": "Om kuben av A har större massa än kuben av B, har A högre densitet. Förklaringen är att mer massa finns i samma volym.",
    "html": "Om kuben av A har större massa än kuben av B, har A högre densitet. Förklaringen är att mer massa finns i samma volym."
  },
  {
    "key": "lesson/5/extraExamples/0/steps/2",
    "plain": "Om föremålen har olika volym behöver ni jämföra massa per volym: densitet = massa / volym. Ett stort föremål kan ha stor massa även när materialets densitet är låg.",
    "tex": "Om föremålen har olika volym behöver ni jämföra massa per volym: \\(\\text{densitet}=\\frac{\\text{massa}}{\\text{volym}}\\). Ett stort föremål kan ha stor massa även när materialets densitet är låg.",
    "html": "Om föremålen har olika volym behöver ni jämföra massa per volym: <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><mtext mathvariant=\"normal\">densitet</mtext><mo>=</mo><mfrac><mtext mathvariant=\"normal\">massa</mtext><mtext mathvariant=\"normal\">volym</mtext></mfrac></mrow><annotation encoding=\"application/x-tex\">\\text{densitet}=\\frac{\\text{massa}}{\\text{volym}}</annotation></semantics></math>. Ett stort föremål kan ha stor massa även när materialets densitet är låg."
  },
  {
    "key": "lesson/5/extraExamples/1/title",
    "plain": "Planera ett test för järn och koppar",
    "tex": "Planera ett test för järn och koppar",
    "html": "Planera ett test för järn och koppar"
  },
  {
    "key": "lesson/5/extraExamples/1/steps/0",
    "plain": "Ange först alternativen: provet är antingen järn eller koppar. Välj sedan en vanlig magnet som verktyg för jämförelsen.",
    "tex": "Ange först alternativen: provet är antingen järn eller koppar. Välj sedan en vanlig magnet som verktyg för jämförelsen.",
    "html": "Ange först alternativen: provet är antingen järn eller koppar. Välj sedan en vanlig magnet som verktyg för jämförelsen."
  },
  {
    "key": "lesson/5/extraExamples/1/steps/1",
    "plain": "Beskriv vad ni väntar er: järn ska dras tydligt till magneten; koppar ska ge ett annat resultat. Håll magneten på motsvarande avstånd vid jämförelsen.",
    "tex": "Beskriv vad ni väntar er: järn ska dras tydligt till magneten; koppar ska ge ett annat resultat. Håll magneten på motsvarande avstånd vid jämförelsen.",
    "html": "Beskriv vad ni väntar er: järn ska dras tydligt till magneten; koppar ska ge ett annat resultat. Håll magneten på motsvarande avstånd vid jämförelsen."
  },
  {
    "key": "lesson/5/extraExamples/1/steps/2",
    "plain": "Tolka resultatet utifrån just dessa alternativ. Förklara sedan varför ett test av elektrisk ledningsförmåga skulle ge mindre hjälp här: båda metallerna leder elektricitet.",
    "tex": "Tolka resultatet utifrån just dessa alternativ. Förklara sedan varför ett test av elektrisk ledningsförmåga skulle ge mindre hjälp här: båda metallerna leder elektricitet.",
    "html": "Tolka resultatet utifrån just dessa alternativ. Förklara sedan varför ett test av elektrisk ledningsförmåga skulle ge mindre hjälp här: båda metallerna leder elektricitet."
  },
  {
    "key": "lesson/5/reflectionPrompts/0",
    "plain": "Välj ett vardagsföremål med två delar som har olika uppgifter. Ge varje del ett materialkrav och förklara följden med eftersom.",
    "tex": "Välj ett vardagsföremål med två delar som har olika uppgifter. Ge varje del ett materialkrav och förklara följden med eftersom.",
    "html": "Välj ett vardagsföremål med två delar som har olika uppgifter. Ge varje del ett materialkrav och förklara följden med eftersom."
  },
  {
    "key": "lesson/5/reflectionPrompts/1",
    "plain": "En kamrat jämför två ämnens löslighet men använder varmt vatten till det ena. Vad skulle ni ändra för att göra jämförelsen rättvis?",
    "tex": "En kamrat jämför två ämnens löslighet men använder varmt vatten till det ena. Vad skulle ni ändra för att göra jämförelsen rättvis?",
    "html": "En kamrat jämför två ämnens löslighet men använder varmt vatten till det ena. Vad skulle ni ändra för att göra jämförelsen rättvis?"
  },
  {
    "key": "lesson/6/opener",
    "plain": "Hur kan en isbit, rinnande vatten och osynlig vattenånga vara samma ämne?",
    "tex": "Hur kan en isbit, rinnande vatten och osynlig vattenånga vara samma ämne?",
    "html": "Hur kan en isbit, rinnande vatten och osynlig vattenånga vara samma ämne?"
  },
  {
    "key": "lesson/6/intro/0",
    "plain": "En vattenmolekyl består av två väteatomer och en syreatom. Det gäller i is, i flytande vatten och i vattenånga. Skillnaderna finns mellan molekylerna: hur de ligger och hur de kan röra sig.",
    "tex": "En vattenmolekyl består av två väteatomer och en syreatom. Det gäller i is, i flytande vatten och i vattenånga. Skillnaderna finns mellan molekylerna: hur de ligger och hur de kan röra sig.",
    "html": "En vattenmolekyl består av två väteatomer och en syreatom. Det gäller i is, i flytande vatten och i vattenånga. Skillnaderna finns mellan molekylerna: hur de ligger och hur de kan röra sig."
  },
  {
    "key": "lesson/6/intro/1",
    "plain": "Följ samma markerade molekyl när tillståndet ändras. Beskriv först vad som händer med dess grannar och avstånd. Kontrollera sedan att molekylens egen uppbyggnad finns kvar.",
    "tex": "Följ samma markerade molekyl när tillståndet ändras. Beskriv först vad som händer med dess grannar och avstånd. Kontrollera sedan att molekylens egen uppbyggnad finns kvar.",
    "html": "Följ samma markerade molekyl när tillståndet ändras. Beskriv först vad som händer med dess grannar och avstånd. Kontrollera sedan att molekylens egen uppbyggnad finns kvar."
  },
  {
    "key": "lesson/6/sections/0/heading",
    "plain": "Is och vatten: från vibration till rinnande vätska",
    "tex": "Is och vatten: från vibration till rinnande vätska",
    "html": "Is och vatten: från vibration till rinnande vätska"
  },
  {
    "key": "lesson/6/sections/0/body",
    "plain": "I is vibrerar molekylerna kring bestämda platser. Det betyder att de rör sig fram och tillbaka, samtidigt som isbiten behåller sin form. Vattenmolekylerna ligger i en öppen, ordnad struktur. När isen smälter förändras ordningen så att molekylerna kan röra sig förbi varandra. Då kan vattnet rinna och följa formen hos glaset. Samma mängd vatten tar större plats som is än som flytande vatten. Därför har is lägre densitet och kan flyta. Densitet betyder massa per volym. Varje vattenmolekyl är fortfarande H₂O under hela förändringen.",
    "tex": "I is vibrerar molekylerna kring bestämda platser. Det betyder att de rör sig fram och tillbaka, samtidigt som isbiten behåller sin form. Vattenmolekylerna ligger i en öppen, ordnad struktur. När isen smälter förändras ordningen så att molekylerna kan röra sig förbi varandra. Då kan vattnet rinna och följa formen hos glaset. Samma mängd vatten tar större plats som is än som flytande vatten. Därför har is lägre densitet och kan flyta. Densitet betyder massa per volym. Varje vattenmolekyl är fortfarande \\(\\mathrm{H_2O}\\) under hela förändringen.",
    "html": "I is vibrerar molekylerna kring bestämda platser. Det betyder att de rör sig fram och tillbaka, samtidigt som isbiten behåller sin form. Vattenmolekylerna ligger i en öppen, ordnad struktur. När isen smälter förändras ordningen så att molekylerna kan röra sig förbi varandra. Då kan vattnet rinna och följa formen hos glaset. Samma mängd vatten tar större plats som is än som flytande vatten. Därför har is lägre densitet och kan flyta. Densitet betyder massa per volym. Varje vattenmolekyl är fortfarande <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math> under hela förändringen."
  },
  {
    "key": "lesson/6/sections/0/question",
    "plain": "Hur kan molekylerna röra sig i is samtidigt som isbiten behåller sin form?",
    "tex": "Hur kan molekylerna röra sig i is samtidigt som isbiten behåller sin form?",
    "html": "Hur kan molekylerna röra sig i is samtidigt som isbiten behåller sin form?"
  },
  {
    "key": "lesson/6/sections/1/heading",
    "plain": "Vattenånga: större avstånd mellan molekylerna",
    "tex": "Vattenånga: större avstånd mellan molekylerna",
    "html": "Vattenånga: större avstånd mellan molekylerna"
  },
  {
    "key": "lesson/6/sections/1/body",
    "plain": "När vatten övergår till gas blir avstånden mellan vattenmolekylerna mycket större. Molekylerna rör sig mellan kollisioner med varandra och omgivningen. Det är fortfarande H₂O. Vattenånga är osynlig. Det vita moln som syns nära en kastrull består av små flytande vattendroppar som bildats när vattenånga kylts och kondenserat. Vatten kan också avdunsta utan att koka. En våt tröja kan därför torka i ett rum. Vattnet lämnar tyget som gas och blandas med luften. Förklara vart vattnet tar vägen genom att följa samma ämne, steg för steg.",
    "tex": "När vatten övergår till gas blir avstånden mellan vattenmolekylerna mycket större. Molekylerna rör sig mellan kollisioner med varandra och omgivningen. Det är fortfarande \\(\\mathrm{H_2O}\\). Vattenånga är osynlig. Det vita moln som syns nära en kastrull består av små flytande vattendroppar som bildats när vattenånga kylts och kondenserat. Vatten kan också avdunsta utan att koka. En våt tröja kan därför torka i ett rum. Vattnet lämnar tyget som gas och blandas med luften. Förklara vart vattnet tar vägen genom att följa samma ämne, steg för steg.",
    "html": "När vatten övergår till gas blir avstånden mellan vattenmolekylerna mycket större. Molekylerna rör sig mellan kollisioner med varandra och omgivningen. Det är fortfarande <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>. Vattenånga är osynlig. Det vita moln som syns nära en kastrull består av små flytande vattendroppar som bildats när vattenånga kylts och kondenserat. Vatten kan också avdunsta utan att koka. En våt tröja kan därför torka i ett rum. Vattnet lämnar tyget som gas och blandas med luften. Förklara vart vattnet tar vägen genom att följa samma ämne, steg för steg."
  },
  {
    "key": "lesson/6/sections/1/question",
    "plain": "Vad består det vita molnet vid kastrullen av, och hur har det bildats?",
    "tex": "Vad består det vita molnet vid kastrullen av, och hur har det bildats?",
    "html": "Vad består det vita molnet vid kastrullen av, och hur har det bildats?"
  },
  {
    "key": "lesson/6/sections/2/heading",
    "plain": "Energi kan värma eller ändra tillstånd",
    "tex": "Energi kan värma eller ändra tillstånd",
    "html": "Energi kan värma eller ändra tillstånd"
  },
  {
    "key": "lesson/6/sections/2/body",
    "plain": "När temperaturen stiger rör sig partiklarna mer i genomsnitt. Under smältning eller kokning kan tillförd energi i stället användas till att ändra hur molekylerna hålls ihop med sina grannar. För rent vatten vid konstant tryck kan temperaturen då vara oförändrad medan övergången pågår. På en uppvärmningskurva syns det som en plan del. En stigande del betyder att temperaturen ökar. Smältning är fast form till vätska; stelning är vätska till fast form. Förångning är vätska till gas; kondensation är gas till vätska. Vid kondensation lämnar vattnet energi till omgivningen. Koppla varje ord till tillståndet före och efter.",
    "tex": "När temperaturen stiger rör sig partiklarna mer i genomsnitt. Under smältning eller kokning kan tillförd energi i stället användas till att ändra hur molekylerna hålls ihop med sina grannar. För rent vatten vid konstant tryck kan temperaturen då vara oförändrad medan övergången pågår. På en uppvärmningskurva syns det som en plan del. En stigande del betyder att temperaturen ökar. Smältning är fast form till vätska; stelning är vätska till fast form. Förångning är vätska till gas; kondensation är gas till vätska. Vid kondensation lämnar vattnet energi till omgivningen. Koppla varje ord till tillståndet före och efter.",
    "html": "När temperaturen stiger rör sig partiklarna mer i genomsnitt. Under smältning eller kokning kan tillförd energi i stället användas till att ändra hur molekylerna hålls ihop med sina grannar. För rent vatten vid konstant tryck kan temperaturen då vara oförändrad medan övergången pågår. På en uppvärmningskurva syns det som en plan del. En stigande del betyder att temperaturen ökar. Smältning är fast form till vätska; stelning är vätska till fast form. Förångning är vätska till gas; kondensation är gas till vätska. Vid kondensation lämnar vattnet energi till omgivningen. Koppla varje ord till tillståndet före och efter."
  },
  {
    "key": "lesson/6/sections/2/question",
    "plain": "Hur kan värme tillföras under smältning medan termometern visar samma temperatur?",
    "tex": "Hur kan värme tillföras under smältning medan termometern visar samma temperatur?",
    "html": "Hur kan värme tillföras under smältning medan termometern visar samma temperatur?"
  },
  {
    "key": "lesson/6/conceptMap/0/term",
    "plain": "Aggregationstillstånd",
    "tex": "Aggregationstillstånd",
    "html": "Aggregationstillstånd"
  },
  {
    "key": "lesson/6/conceptMap/0/meaning",
    "plain": "Fast form, vätska eller gas.",
    "tex": "Fast form, vätska eller gas.",
    "html": "Fast form, vätska eller gas."
  },
  {
    "key": "lesson/6/conceptMap/1/term",
    "plain": "Fasförändring",
    "tex": "Fasförändring",
    "html": "Fasförändring"
  },
  {
    "key": "lesson/6/conceptMap/1/meaning",
    "plain": "När ett ämne byter tillstånd, till exempel från vätska till gas.",
    "tex": "När ett ämne byter tillstånd, till exempel från vätska till gas.",
    "html": "När ett ämne byter tillstånd, till exempel från vätska till gas."
  },
  {
    "key": "lesson/6/conceptMap/2/term",
    "plain": "Kondensation",
    "tex": "Kondensation",
    "html": "Kondensation"
  },
  {
    "key": "lesson/6/conceptMap/2/meaning",
    "plain": "När ett ämne övergår från gas till vätska, som droppar som bildas ur vattenånga.",
    "tex": "När ett ämne övergår från gas till vätska, som droppar som bildas ur vattenånga.",
    "html": "När ett ämne övergår från gas till vätska, som droppar som bildas ur vattenånga."
  },
  {
    "key": "lesson/6/workedExample/title",
    "plain": "Följ sex vattenmolekyler genom tre tillstånd",
    "tex": "Följ sex vattenmolekyler genom tre tillstånd",
    "html": "Följ sex vattenmolekyler genom tre tillstånd"
  },
  {
    "key": "lesson/6/workedExample/steps/0",
    "plain": "I is: sex H₂O-molekyler vibrerar kring lägen i en öppen, ordnad struktur. Peka ut en av dem och dess grannar.",
    "tex": "I is: sex \\(\\mathrm{H_2O}\\)-molekyler vibrerar kring lägen i en öppen, ordnad struktur. Peka ut en av dem och dess grannar.",
    "html": "I is: sex <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>-molekyler vibrerar kring lägen i en öppen, ordnad struktur. Peka ut en av dem och dess grannar."
  },
  {
    "key": "lesson/6/workedExample/steps/1",
    "plain": "I vätskan: samma sex molekyler kan röra sig förbi varandra. Vattnets tätare struktur jämfört med is innebär mindre volym för samma mängd.",
    "tex": "I vätskan: samma sex molekyler kan röra sig förbi varandra. Vattnets tätare struktur jämfört med is innebär mindre volym för samma mängd.",
    "html": "I vätskan: samma sex molekyler kan röra sig förbi varandra. Vattnets tätare struktur jämfört med is innebär mindre volym för samma mängd."
  },
  {
    "key": "lesson/6/workedExample/steps/2",
    "plain": "I gasen: samma sex molekyler finns på stora avstånd från varandra. Varje molekyl har behållit två H och en O genom hela förändringen.",
    "tex": "I gasen: samma sex molekyler finns på stora avstånd från varandra. Varje molekyl har behållit två H och en O genom hela förändringen.",
    "html": "I gasen: samma sex molekyler finns på stora avstånd från varandra. Varje molekyl har behållit två H och en O genom hela förändringen."
  },
  {
    "key": "lesson/6/misconception/claim",
    "plain": "”Vattenmolekyler blir större när vatten blir gas.”",
    "tex": "”Vattenmolekyler blir större när vatten blir gas.”",
    "html": "”Vattenmolekyler blir större när vatten blir gas.”"
  },
  {
    "key": "lesson/6/misconception/correction",
    "plain": "Gasens stora volym hänger framför allt ihop med stora avstånd mellan molekylerna. Varje H₂O-molekyl behåller sin uppbyggnad med två väteatomer och en syreatom.",
    "tex": "Gasens stora volym hänger framför allt ihop med stora avstånd mellan molekylerna. Varje \\(\\mathrm{H_2O}\\)-molekyl behåller sin uppbyggnad med två väteatomer och en syreatom.",
    "html": "Gasens stora volym hänger framför allt ihop med stora avstånd mellan molekylerna. Varje <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>-molekyl behåller sin uppbyggnad med två väteatomer och en syreatom."
  },
  {
    "key": "lesson/6/film/title",
    "plain": "Molekyler i rörelse: is, vätska och gas",
    "tex": "Molekyler i rörelse: is, vätska och gas",
    "html": "Molekyler i rörelse: is, vätska och gas"
  },
  {
    "key": "lesson/6/film/before",
    "plain": "Följ den markerade vattenmolekylen genom tre tillstånd. Lägg märke till dess grannar, rörelse och avstånd.",
    "tex": "Följ den markerade vattenmolekylen genom tre tillstånd. Lägg märke till dess grannar, rörelse och avstånd.",
    "html": "Följ den markerade vattenmolekylen genom tre tillstånd. Lägg märke till dess grannar, rörelse och avstånd."
  },
  {
    "key": "lesson/6/film/after",
    "plain": "Förklara vad som ändras mellan molekylerna och vad som finns kvar i varje H₂O-molekyl. Använd ett fasord.",
    "tex": "Förklara vad som ändras mellan molekylerna och vad som finns kvar i varje \\(\\mathrm{H_2O}\\)-molekyl. Använd ett fasord.",
    "html": "Förklara vad som ändras mellan molekylerna och vad som finns kvar i varje <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>-molekyl. Använd ett fasord."
  },
  {
    "key": "lesson/6/summary",
    "plain": "Jag kan beskriva is, vatten och vattenånga med samma H₂O-molekyler. Det som förändras är molekylernas ordning, avstånd och rörelse i förhållande till varandra.",
    "tex": "Jag kan beskriva is, vatten och vattenånga med samma \\(\\mathrm{H_2O}\\)-molekyler. Det som förändras är molekylernas ordning, avstånd och rörelse i förhållande till varandra.",
    "html": "Jag kan beskriva is, vatten och vattenånga med samma <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>-molekyler. Det som förändras är molekylernas ordning, avstånd och rörelse i förhållande till varandra."
  },
  {
    "key": "lesson/6/extraExamples/0/title",
    "plain": "Varifrån kommer dropparna på ett kallt glas?",
    "tex": "Varifrån kommer dropparna på ett kallt glas?",
    "html": "Varifrån kommer dropparna på ett kallt glas?"
  },
  {
    "key": "lesson/6/extraExamples/0/steps/0",
    "plain": "Luften omkring glaset innehåller vattenånga. När vattenångan möter en tillräckligt kall yta kyls den så att flytande droppar kan bildas.",
    "tex": "Luften omkring glaset innehåller vattenånga. När vattenångan möter en tillräckligt kall yta kyls den så att flytande droppar kan bildas.",
    "html": "Luften omkring glaset innehåller vattenånga. När vattenångan möter en tillräckligt kall yta kyls den så att flytande droppar kan bildas."
  },
  {
    "key": "lesson/6/extraExamples/0/steps/1",
    "plain": "Övergången från gas till vätska heter kondensation. Vattenmolekylerna samlas tätare och överför energi till omgivningen under övergången.",
    "tex": "Övergången från gas till vätska heter kondensation. Vattenmolekylerna samlas tätare och överför energi till omgivningen under övergången.",
    "html": "Övergången från gas till vätska heter kondensation. Vattenmolekylerna samlas tätare och överför energi till omgivningen under övergången."
  },
  {
    "key": "lesson/6/extraExamples/0/steps/2",
    "plain": "Beskriv därför dropparna med både källa och fasförändring: vatten från luften har kondenserat på utsidan. Ämnet är H₂O före och efter.",
    "tex": "Beskriv därför dropparna med både källa och fasförändring: vatten från luften har kondenserat på utsidan. Ämnet är \\(\\mathrm{H_2O}\\) före och efter.",
    "html": "Beskriv därför dropparna med både källa och fasförändring: vatten från luften har kondenserat på utsidan. Ämnet är <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math> före och efter."
  },
  {
    "key": "lesson/6/extraExamples/1/title",
    "plain": "Läs en uppvärmningskurva",
    "tex": "Läs en uppvärmningskurva",
    "html": "Läs en uppvärmningskurva"
  },
  {
    "key": "lesson/6/extraExamples/1/steps/0",
    "plain": "Följ först en stigande del av kurvan. Temperaturen ökar och molekylerna rör sig mer i genomsnitt.",
    "tex": "Följ först en stigande del av kurvan. Temperaturen ökar och molekylerna rör sig mer i genomsnitt.",
    "html": "Följ först en stigande del av kurvan. Temperaturen ökar och molekylerna rör sig mer i genomsnitt."
  },
  {
    "key": "lesson/6/extraExamples/1/steps/1",
    "plain": "Följ sedan en plan del under smältning eller kokning. För ett rent ämne vid konstant tryck kan energi tillföras medan tillståndet ändras och temperaturen är oförändrad.",
    "tex": "Följ sedan en plan del under smältning eller kokning. För ett rent ämne vid konstant tryck kan energi tillföras medan tillståndet ändras och temperaturen är oförändrad.",
    "html": "Följ sedan en plan del under smältning eller kokning. För ett rent ämne vid konstant tryck kan energi tillföras medan tillståndet ändras och temperaturen är oförändrad."
  },
  {
    "key": "lesson/6/extraExamples/1/steps/2",
    "plain": "När övergången är klar kan temperaturen stiga igen om uppvärmningen fortsätter. Peka på en kurvdel och säg vad som händer med både temperaturen och vattnet.",
    "tex": "När övergången är klar kan temperaturen stiga igen om uppvärmningen fortsätter. Peka på en kurvdel och säg vad som händer med både temperaturen och vattnet.",
    "html": "När övergången är klar kan temperaturen stiga igen om uppvärmningen fortsätter. Peka på en kurvdel och säg vad som händer med både temperaturen och vattnet."
  },
  {
    "key": "lesson/6/reflectionPrompts/0",
    "plain": "En kamrat ritar större H₂O-molekyler i gas. Rita om modellen så att de större avstånden mellan molekylerna förklarar gasens volym.",
    "tex": "En kamrat ritar större \\(\\mathrm{H_2O}\\)-molekyler i gas. Rita om modellen så att de större avstånden mellan molekylerna förklarar gasens volym.",
    "html": "En kamrat ritar större <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>-molekyler i gas. Rita om modellen så att de större avstånden mellan molekylerna förklarar gasens volym."
  },
  {
    "key": "lesson/6/reflectionPrompts/1",
    "plain": "Beskriv smältning och kondensation med samma tre saker: tillstånd före, tillstånd efter och vad som händer mellan molekylerna.",
    "tex": "Beskriv smältning och kondensation med samma tre saker: tillstånd före, tillstånd efter och vad som händer mellan molekylerna.",
    "html": "Beskriv smältning och kondensation med samma tre saker: tillstånd före, tillstånd efter och vad som händer mellan molekylerna."
  },
  {
    "key": "lesson/7/opener",
    "plain": "Hur kan ett batteri vid en bäck påverka djur längre bort?",
    "tex": "Hur kan ett batteri vid en bäck påverka djur längre bort?",
    "html": "Hur kan ett batteri vid en bäck påverka djur längre bort?"
  },
  {
    "key": "lesson/7/intro/0",
    "plain": "Om ett skadat batteri läcker kan ämnen först komma ut i marken. Vatten kan föra dem vidare till en annan plats. Där kan levande organismer komma i kontakt med dem.",
    "tex": "Om ett skadat batteri läcker kan ämnen först komma ut i marken. Vatten kan föra dem vidare till en annan plats. Där kan levande organismer komma i kontakt med dem.",
    "html": "Om ett skadat batteri läcker kan ämnen först komma ut i marken. Vatten kan föra dem vidare till en annan plats. Där kan levande organismer komma i kontakt med dem."
  },
  {
    "key": "lesson/7/intro/1",
    "plain": "Bygg förklaringen som en kedja. Börja vid källan och följ ämnet hela vägen. Använd om när något behöver hända för att förloppet ska fortsätta. Avsluta med en åtgärd och förklara varför den hjälper.",
    "tex": "Bygg förklaringen som en kedja. Börja vid källan och följ ämnet hela vägen. Använd om när något behöver hända för att förloppet ska fortsätta. Avsluta med en åtgärd och förklara varför den hjälper.",
    "html": "Bygg förklaringen som en kedja. Börja vid källan och följ ämnet hela vägen. Använd om när något behöver hända för att förloppet ska fortsätta. Avsluta med en åtgärd och förklara varför den hjälper."
  },
  {
    "key": "lesson/7/sections/0/heading",
    "plain": "Följ ämnet från batteriet till bäcken",
    "tex": "Följ ämnet från batteriet till bäcken",
    "html": "Följ ämnet från batteriet till bäcken"
  },
  {
    "key": "lesson/7/sections/0/body",
    "plain": "Tänk er ett skadat batteri som börjar läcka. Ämnen kan då hamna i marken. När det regnar kan en del ämnen följa med vatten till en bäck. Ett djur som lever där kan komma i kontakt med dem genom vattnet eller födan. Pilarna i en spridningskedja behöver alltså förklaras. En pil kan betyda läcker, en annan förs med vatten och en tredje tas upp. Vad som faktiskt händer beror bland annat på batteritypen, vilka ämnen som frigörs och miljön på platsen. Därför säger vi om batteriet läcker kan ämnen spridas.",
    "tex": "Tänk er ett skadat batteri som börjar läcka. Ämnen kan då hamna i marken. När det regnar kan en del ämnen följa med vatten till en bäck. Ett djur som lever där kan komma i kontakt med dem genom vattnet eller födan. Pilarna i en spridningskedja behöver alltså förklaras. En pil kan betyda läcker, en annan förs med vatten och en tredje tas upp. Vad som faktiskt händer beror bland annat på batteritypen, vilka ämnen som frigörs och miljön på platsen. Därför säger vi om batteriet läcker kan ämnen spridas.",
    "html": "Tänk er ett skadat batteri som börjar läcka. Ämnen kan då hamna i marken. När det regnar kan en del ämnen följa med vatten till en bäck. Ett djur som lever där kan komma i kontakt med dem genom vattnet eller födan. Pilarna i en spridningskedja behöver alltså förklaras. En pil kan betyda läcker, en annan förs med vatten och en tredje tas upp. Vad som faktiskt händer beror bland annat på batteritypen, vilka ämnen som frigörs och miljön på platsen. Därför säger vi om batteriet läcker kan ämnen spridas."
  },
  {
    "key": "lesson/7/sections/0/question",
    "plain": "Vilka steg måste ske för att ett ämne ska nå ett smådjur längre ned i bäcken?",
    "tex": "Vilka steg måste ske för att ett ämne ska nå ett smådjur längre ned i bäcken?",
    "html": "Vilka steg måste ske för att ett ämne ska nå ett smådjur längre ned i bäcken?"
  },
  {
    "key": "lesson/7/sections/1/heading",
    "plain": "Risk beror på ämne, mängd och kontakt",
    "tex": "Risk beror på ämne, mängd och kontakt",
    "html": "Risk beror på ämne, mängd och kontakt"
  },
  {
    "key": "lesson/7/sections/1/body",
    "plain": "Vissa ämnen kan skada organismer. Organism är ett samlingsord för levande varelser, till exempel människor, fiskar och växter. Exponering betyder att en organism kommer i kontakt med ett ämne, till exempel genom vatten eller föda. Hur stor risken blir beror bland annat på ämnets egenskaper, mängden och exponeringen. Det spelar också roll hur länge kontakten pågår. Vissa ämnen bryts ned långsamt och kan finnas kvar länge i miljön. En del kan samlas i organismer. För att bedöma ett verkligt fall behöver vi därför veta vad som har spridits, hur mycket och hur organismerna utsätts.",
    "tex": "Vissa ämnen kan skada organismer. Organism är ett samlingsord för levande varelser, till exempel människor, fiskar och växter. Exponering betyder att en organism kommer i kontakt med ett ämne, till exempel genom vatten eller föda. Hur stor risken blir beror bland annat på ämnets egenskaper, mängden och exponeringen. Det spelar också roll hur länge kontakten pågår. Vissa ämnen bryts ned långsamt och kan finnas kvar länge i miljön. En del kan samlas i organismer. För att bedöma ett verkligt fall behöver vi därför veta vad som har spridits, hur mycket och hur organismerna utsätts.",
    "html": "Vissa ämnen kan skada organismer. Organism är ett samlingsord för levande varelser, till exempel människor, fiskar och växter. Exponering betyder att en organism kommer i kontakt med ett ämne, till exempel genom vatten eller föda. Hur stor risken blir beror bland annat på ämnets egenskaper, mängden och exponeringen. Det spelar också roll hur länge kontakten pågår. Vissa ämnen bryts ned långsamt och kan finnas kvar länge i miljön. En del kan samlas i organismer. För att bedöma ett verkligt fall behöver vi därför veta vad som har spridits, hur mycket och hur organismerna utsätts."
  },
  {
    "key": "lesson/7/sections/1/question",
    "plain": "Vilka tre saker behöver ni veta för att förklara risken i ett miljöfall?",
    "tex": "Vilka tre saker behöver ni veta för att förklara risken i ett miljöfall?",
    "html": "Vilka tre saker behöver ni veta för att förklara risken i ett miljöfall?"
  },
  {
    "key": "lesson/7/sections/2/heading",
    "plain": "Förebygg genom att ta hand om källan",
    "tex": "Förebygg genom att ta hand om källan",
    "html": "Förebygg genom att ta hand om källan"
  },
  {
    "key": "lesson/7/sections/2/body",
    "plain": "Batterier lämnas till batteriinsamling så att de kan tas om hand på rätt sätt. Då förebygger vi att just det batteriet skadas och läcker ämnen i mark och vatten. Förebygga betyder att hindra ett problem innan det uppstår. När ni föreslår en åtgärd ska ni också visa vilken del av kedjan den påverkar. Insamling tar hand om källan. En annan åtgärd kan hindra ett läckage från att nå en bäck. En giftfri miljö betyder att vi vill minska skadlig spridning och kontakt med farliga ämnen. Allt omkring oss består av kemiska ämnen; vi behöver undersöka deras egenskaper och hur de används.",
    "tex": "Batterier lämnas till batteriinsamling så att de kan tas om hand på rätt sätt. Då förebygger vi att just det batteriet skadas och läcker ämnen i mark och vatten. Förebygga betyder att hindra ett problem innan det uppstår. När ni föreslår en åtgärd ska ni också visa vilken del av kedjan den påverkar. Insamling tar hand om källan. En annan åtgärd kan hindra ett läckage från att nå en bäck. En giftfri miljö betyder att vi vill minska skadlig spridning och kontakt med farliga ämnen. Allt omkring oss består av kemiska ämnen; vi behöver undersöka deras egenskaper och hur de används.",
    "html": "Batterier lämnas till batteriinsamling så att de kan tas om hand på rätt sätt. Då förebygger vi att just det batteriet skadas och läcker ämnen i mark och vatten. Förebygga betyder att hindra ett problem innan det uppstår. När ni föreslår en åtgärd ska ni också visa vilken del av kedjan den påverkar. Insamling tar hand om källan. En annan åtgärd kan hindra ett läckage från att nå en bäck. En giftfri miljö betyder att vi vill minska skadlig spridning och kontakt med farliga ämnen. Allt omkring oss består av kemiska ämnen; vi behöver undersöka deras egenskaper och hur de används."
  },
  {
    "key": "lesson/7/sections/2/question",
    "plain": "Hur hjälper batteriinsamling organismer längre ned i spridningskedjan?",
    "tex": "Hur hjälper batteriinsamling organismer längre ned i spridningskedjan?",
    "html": "Hur hjälper batteriinsamling organismer längre ned i spridningskedjan?"
  },
  {
    "key": "lesson/7/conceptMap/0/term",
    "plain": "Spridningsväg",
    "tex": "Spridningsväg",
    "html": "Spridningsväg"
  },
  {
    "key": "lesson/7/conceptMap/0/meaning",
    "plain": "Den väg ett ämne tar från en källa till en annan plats, till exempel med rinnande vatten.",
    "tex": "Den väg ett ämne tar från en källa till en annan plats, till exempel med rinnande vatten.",
    "html": "Den väg ett ämne tar från en källa till en annan plats, till exempel med rinnande vatten."
  },
  {
    "key": "lesson/7/conceptMap/1/term",
    "plain": "Exponering",
    "tex": "Exponering",
    "html": "Exponering"
  },
  {
    "key": "lesson/7/conceptMap/1/meaning",
    "plain": "När en organism kommer i kontakt med ett ämne, till exempel genom vatten eller föda.",
    "tex": "När en organism kommer i kontakt med ett ämne, till exempel genom vatten eller föda.",
    "html": "När en organism kommer i kontakt med ett ämne, till exempel genom vatten eller föda."
  },
  {
    "key": "lesson/7/conceptMap/2/term",
    "plain": "Förebygga",
    "tex": "Förebygga",
    "html": "Förebygga"
  },
  {
    "key": "lesson/7/conceptMap/2/meaning",
    "plain": "Att hindra ett problem innan det uppstår.",
    "tex": "Att hindra ett problem innan det uppstår.",
    "html": "Att hindra ett problem innan det uppstår."
  },
  {
    "key": "lesson/7/workedExample/title",
    "plain": "Skriv en sammanhängande miljöförklaring",
    "tex": "Skriv en sammanhängande miljöförklaring",
    "html": "Skriv en sammanhängande miljöförklaring"
  },
  {
    "key": "lesson/7/workedExample/steps/0",
    "plain": "Källa och väg: om ett skadat batteri läcker kan ämnen komma ut i marken och följa med vatten till bäcken. Skriv vad som flyttas och hur.",
    "tex": "Källa och väg: om ett skadat batteri läcker kan ämnen komma ut i marken och följa med vatten till bäcken. Skriv vad som flyttas och hur.",
    "html": "Källa och väg: om ett skadat batteri läcker kan ämnen komma ut i marken och följa med vatten till bäcken. Skriv vad som flyttas och hur."
  },
  {
    "key": "lesson/7/workedExample/steps/1",
    "plain": "Exponering och möjlig konsekvens: organismer kan komma i kontakt med ämnena genom vatten eller föda. Skadan beror på ämnenas egenskaper, mängden och exponeringen.",
    "tex": "Exponering och möjlig konsekvens: organismer kan komma i kontakt med ämnena genom vatten eller föda. Skadan beror på ämnenas egenskaper, mängden och exponeringen.",
    "html": "Exponering och möjlig konsekvens: organismer kan komma i kontakt med ämnena genom vatten eller föda. Skadan beror på ämnenas egenskaper, mängden och exponeringen."
  },
  {
    "key": "lesson/7/workedExample/steps/2",
    "plain": "Åtgärd och motivering: lämna batteriet till insamling. Då kan det tas om hand, vilket förebygger att denna källa sprider ämnen i mark och vatten.",
    "tex": "Åtgärd och motivering: lämna batteriet till insamling. Då kan det tas om hand, vilket förebygger att denna källa sprider ämnen i mark och vatten.",
    "html": "Åtgärd och motivering: lämna batteriet till insamling. Då kan det tas om hand, vilket förebygger att denna källa sprider ämnen i mark och vatten."
  },
  {
    "key": "lesson/7/misconception/claim",
    "plain": "”En giftfri miljö är en miljö utan kemiska ämnen.”",
    "tex": "”En giftfri miljö är en miljö utan kemiska ämnen.”",
    "html": "”En giftfri miljö är en miljö utan kemiska ämnen.”"
  },
  {
    "key": "lesson/7/misconception/correction",
    "plain": "All materia består av kemiska ämnen. Målet är att förebygga skadlig exponering och minska spridning av farliga ämnen. Risk bedöms genom ämnets egenskaper tillsammans med mängd och exponering.",
    "tex": "All materia består av kemiska ämnen. Målet är att förebygga skadlig exponering och minska spridning av farliga ämnen. Risk bedöms genom ämnets egenskaper tillsammans med mängd och exponering.",
    "html": "All materia består av kemiska ämnen. Målet är att förebygga skadlig exponering och minska spridning av farliga ämnen. Risk bedöms genom ämnets egenskaper tillsammans med mängd och exponering."
  },
  {
    "key": "lesson/7/film/title",
    "plain": "Följ spridningen och bryt kedjan",
    "tex": "Följ spridningen och bryt kedjan",
    "html": "Följ spridningen och bryt kedjan"
  },
  {
    "key": "lesson/7/film/before",
    "plain": "Följ ett ämne från det skadade batteriet. Vad behöver hända för att det ska nå vattnet och sedan en organism?",
    "tex": "Följ ett ämne från det skadade batteriet. Vad behöver hända för att det ska nå vattnet och sedan en organism?",
    "html": "Följ ett ämne från det skadade batteriet. Vad behöver hända för att det ska nå vattnet och sedan en organism?"
  },
  {
    "key": "lesson/7/film/after",
    "plain": "Återberätta med om, först, sedan och därför. Visa vilken del av kedjan batteriinsamlingen påverkar.",
    "tex": "Återberätta med om, först, sedan och därför. Visa vilken del av kedjan batteriinsamlingen påverkar.",
    "html": "Återberätta med om, först, sedan och därför. Visa vilken del av kedjan batteriinsamlingen påverkar."
  },
  {
    "key": "lesson/7/summary",
    "plain": "Jag kan följa ett ämne från källa till organism och förklara en förebyggande åtgärd. Risken beror bland annat på ämnet, mängden och hur organismen utsätts.",
    "tex": "Jag kan följa ett ämne från källa till organism och förklara en förebyggande åtgärd. Risken beror bland annat på ämnet, mängden och hur organismen utsätts.",
    "html": "Jag kan följa ett ämne från källa till organism och förklara en förebyggande åtgärd. Risken beror bland annat på ämnet, mängden och hur organismen utsätts."
  },
  {
    "key": "lesson/7/extraExamples/0/title",
    "plain": "Samma källa kan ge olika exponering",
    "tex": "Samma källa kan ge olika exponering",
    "html": "Samma källa kan ge olika exponering"
  },
  {
    "key": "lesson/7/extraExamples/0/steps/0",
    "plain": "Tänk er två djur i en bäck. Ett lever nära platsen dit ett läckage når, medan det andra lever längre bort.",
    "tex": "Tänk er två djur i en bäck. Ett lever nära platsen dit ett läckage når, medan det andra lever längre bort.",
    "html": "Tänk er två djur i en bäck. Ett lever nära platsen dit ett läckage når, medan det andra lever längre bort."
  },
  {
    "key": "lesson/7/extraExamples/0/steps/1",
    "plain": "Undersök hur ämnet förs med vattnet och hur mycket som når varje djur. Ta också reda på hur djuren kommer i kontakt med vattnet och vad de äter.",
    "tex": "Undersök hur ämnet förs med vattnet och hur mycket som når varje djur. Ta också reda på hur djuren kommer i kontakt med vattnet och vad de äter.",
    "html": "Undersök hur ämnet förs med vattnet och hur mycket som når varje djur. Ta också reda på hur djuren kommer i kontakt med vattnet och vad de äter."
  },
  {
    "key": "lesson/7/extraExamples/0/steps/2",
    "plain": "Djuren kan utsättas på olika sätt. För att jämföra risken behöver vi veta vilket ämne det är, mängden och hur varje djur exponeras.",
    "tex": "Djuren kan utsättas på olika sätt. För att jämföra risken behöver vi veta vilket ämne det är, mängden och hur varje djur exponeras.",
    "html": "Djuren kan utsättas på olika sätt. För att jämföra risken behöver vi veta vilket ämne det är, mängden och hur varje djur exponeras."
  },
  {
    "key": "lesson/7/extraExamples/1/title",
    "plain": "Från en kort åsikt till ett utvecklat svar",
    "tex": "Från en kort åsikt till ett utvecklat svar",
    "html": "Från en kort åsikt till ett utvecklat svar"
  },
  {
    "key": "lesson/7/extraExamples/1/steps/0",
    "plain": "Börja med ett påstående: batteriet ska lämnas till insamling.",
    "tex": "Börja med ett påstående: batteriet ska lämnas till insamling.",
    "html": "Börja med ett påstående: batteriet ska lämnas till insamling."
  },
  {
    "key": "lesson/7/extraExamples/1/steps/1",
    "plain": "Förklara varför: om ett skadat batteri läcker kan ämnen följa med vatten till bäcken och nå djur eller växter.",
    "tex": "Förklara varför: om ett skadat batteri läcker kan ämnen följa med vatten till bäcken och nå djur eller växter.",
    "html": "Förklara varför: om ett skadat batteri läcker kan ämnen följa med vatten till bäcken och nå djur eller växter."
  },
  {
    "key": "lesson/7/extraExamples/1/steps/2",
    "plain": "Knyt ihop svaret med därför: insamlingen gör att batteriet kan tas om hand och minskar risken att ämnen sprids från det.",
    "tex": "Knyt ihop svaret med därför: insamlingen gör att batteriet kan tas om hand och minskar risken att ämnen sprids från det.",
    "html": "Knyt ihop svaret med därför: insamlingen gör att batteriet kan tas om hand och minskar risken att ämnen sprids från det."
  },
  {
    "key": "lesson/7/reflectionPrompts/0",
    "plain": "Byt roller. En av er pekar på pilarna i spridningskedjan; den andra säger vad som behöver hända i varje steg för att ämnet ska komma vidare.",
    "tex": "Byt roller. En av er pekar på pilarna i spridningskedjan; den andra säger vad som behöver hända i varje steg för att ämnet ska komma vidare.",
    "html": "Byt roller. En av er pekar på pilarna i spridningskedjan; den andra säger vad som behöver hända i varje steg för att ämnet ska komma vidare."
  },
  {
    "key": "lesson/7/reflectionPrompts/1",
    "plain": "Välj en förebyggande åtgärd och förklara vilken länk den påverkar. Hur hänger ämnenas spridning ihop med organismernas livsmiljö?",
    "tex": "Välj en förebyggande åtgärd och förklara vilken länk den påverkar. Hur hänger ämnenas spridning ihop med organismernas livsmiljö?",
    "html": "Välj en förebyggande åtgärd och förklara vilken länk den påverkar. Hur hänger ämnenas spridning ihop med organismernas livsmiljö?"
  },
  {
    "key": "ui/1",
    "plain": "0 av 7",
    "tex": "0 av 7",
    "html": "0 av 7"
  },
  {
    "key": "ui/2",
    "plain": "0 av 7 områden klara",
    "tex": "0 av 7 områden klara",
    "html": "0 av 7 områden klara"
  },
  {
    "key": "ui/3",
    "plain": "1",
    "tex": "1",
    "html": "1"
  },
  {
    "key": "ui/4",
    "plain": "1 av 7 områden klara",
    "tex": "1 av 7 områden klara",
    "html": "1 av 7 områden klara"
  },
  {
    "key": "ui/5",
    "plain": "1. Atomer och molekyler",
    "tex": "1. Atomer och molekyler",
    "html": "1. Atomer och molekyler"
  },
  {
    "key": "ui/6",
    "plain": "2",
    "tex": "2",
    "html": "2"
  },
  {
    "key": "ui/7",
    "plain": "2 av 7 områden klara",
    "tex": "2 av 7 områden klara",
    "html": "2 av 7 områden klara"
  },
  {
    "key": "ui/8",
    "plain": "2 kärnor och 2 elektroner före och efter",
    "tex": "2 kärnor och 2 elektroner före och efter",
    "html": "2 kärnor och 2 elektroner före och efter"
  },
  {
    "key": "ui/9",
    "plain": "2. Hur atommodellen har förändrats",
    "tex": "2. Hur atommodellen har förändrats",
    "html": "2. Hur atommodellen har förändrats"
  },
  {
    "key": "ui/10",
    "plain": "3",
    "tex": "3",
    "html": "3"
  },
  {
    "key": "ui/11",
    "plain": "3 av 7 områden klara",
    "tex": "3 av 7 områden klara",
    "html": "3 av 7 områden klara"
  },
  {
    "key": "ui/12",
    "plain": "3 december",
    "tex": "3 december",
    "html": "3 december"
  },
  {
    "key": "ui/13",
    "plain": "3. Elektroner och kemiska reaktioner",
    "tex": "3. Elektroner och kemiska reaktioner",
    "html": "3. Elektroner och kemiska reaktioner"
  },
  {
    "key": "ui/14",
    "plain": "4 av 7 områden klara",
    "tex": "4 av 7 områden klara",
    "html": "4 av 7 områden klara"
  },
  {
    "key": "ui/15",
    "plain": "4. Kemisk eller fysikalisk förändring?",
    "tex": "4. Kemisk eller fysikalisk förändring?",
    "html": "4. Kemisk eller fysikalisk förändring?"
  },
  {
    "key": "ui/16",
    "plain": "5 av 7 områden klara",
    "tex": "5 av 7 områden klara",
    "html": "5 av 7 områden klara"
  },
  {
    "key": "ui/17",
    "plain": "5. Olika ämnen har olika egenskaper",
    "tex": "5. Olika ämnen har olika egenskaper",
    "html": "5. Olika ämnen har olika egenskaper"
  },
  {
    "key": "ui/18",
    "plain": "6 av 7 områden klara",
    "tex": "6 av 7 områden klara",
    "html": "6 av 7 områden klara"
  },
  {
    "key": "ui/19",
    "plain": "6. Värme, rörelse och fasförändringar",
    "tex": "6. Värme, rörelse och fasförändringar",
    "html": "6. Värme, rörelse och fasförändringar"
  },
  {
    "key": "ui/20",
    "plain": "7 av 7 områden klara",
    "tex": "7 av 7 områden klara",
    "html": "7 av 7 områden klara"
  },
  {
    "key": "ui/21",
    "plain": "7. Varför strävar vi efter en giftfri miljö?",
    "tex": "7. Varför strävar vi efter en giftfri miljö?",
    "html": "7. Varför strävar vi efter en giftfri miljö?"
  },
  {
    "key": "ui/22",
    "plain": "=0&&a.choice",
    "tex": "=0\\&\\&a.choice",
    "html": "=0&amp;&amp;a.choice"
  },
  {
    "key": "ui/23",
    "plain": "Aktivera JavaScript för att använda svarsfält och interaktiva modeller. LaTeX-materialet finns i projektets mapp latex.",
    "tex": "Aktivera JavaScript för att använda svarsfält och interaktiva modeller. LaTeX-materialet finns i projektets mapp latex.",
    "html": "Aktivera JavaScript för att använda svarsfält och interaktiva modeller. LaTeX-materialet finns i projektets mapp latex."
  },
  {
    "key": "ui/24",
    "plain": "Alla svar som kopierbar text",
    "tex": "Alla svar som kopierbar text",
    "html": "Alla svar som kopierbar text"
  },
  {
    "key": "ui/25",
    "plain": "Arbeta två vid samma dator. Svarsfilen är er kopia av arbetet.",
    "tex": "Arbeta två vid samma dator. Svarsfilen är er kopia av arbetet.",
    "html": "Arbeta två vid samma dator. Svarsfilen är er kopia av arbetet."
  },
  {
    "key": "ui/26",
    "plain": "Arbetsytan ändrades i en annan flik. Använd en flik per par.",
    "tex": "Arbetsytan ändrades i en annan flik. Använd en flik per par.",
    "html": "Arbetsytan ändrades i en annan flik. Använd en flik per par."
  },
  {
    "key": "ui/27",
    "plain": "Batteri",
    "tex": "Batteri",
    "html": "Batteri"
  },
  {
    "key": "ui/28",
    "plain": "Berätta först för varandra hur ni tänker. Skriv sedan med egna ord.",
    "tex": "Berätta först för varandra hur ni tänker. Skriv sedan med egna ord.",
    "html": "Berätta först för varandra hur ni tänker. Skriv sedan med egna ord."
  },
  {
    "key": "ui/29",
    "plain": "Bildkälla",
    "tex": "Bildkälla",
    "html": "Bildkälla"
  },
  {
    "key": "ui/30",
    "plain": "Bygg en samling atomer",
    "tex": "Bygg en samling atomer",
    "html": "Bygg en samling atomer"
  },
  {
    "key": "ui/31",
    "plain": "Börja ett nytt arbete",
    "tex": "Börja ett nytt arbete",
    "html": "Börja ett nytt arbete"
  },
  {
    "key": "ui/32",
    "plain": "Börja ett nytt arbete? Spara era nuvarande svar först om ni vill behålla dem.",
    "tex": "Börja ett nytt arbete? Spara era nuvarande svar först om ni vill behålla dem.",
    "html": "Börja ett nytt arbete? Spara era nuvarande svar först om ni vill behålla dem."
  },
  {
    "key": "ui/33",
    "plain": "Det här tränar ni:",
    "tex": "Det här tränar ni:",
    "html": "Det här tränar ni:"
  },
  {
    "key": "ui/34",
    "plain": "Elev A",
    "tex": "Elev A",
    "html": "Elev A"
  },
  {
    "key": "ui/35",
    "plain": "Elev A: förklara · Elev B: skriv och ställ följdfrågor",
    "tex": "Elev A: förklara · Elev B: skriv och ställ följdfrågor",
    "html": "Elev A: förklara · Elev B: skriv och ställ följdfrågor"
  },
  {
    "key": "ui/36",
    "plain": "Elev B",
    "tex": "Elev B",
    "html": "Elev B"
  },
  {
    "key": "ui/37",
    "plain": "Elev B: förklara · Elev A: skriv och ställ följdfrågor",
    "tex": "Elev B: förklara · Elev A: skriv och ställ följdfrågor",
    "html": "Elev B: förklara · Elev A: skriv och ställ följdfrågor"
  },
  {
    "key": "ui/38",
    "plain": "En möjlig förklaring",
    "tex": "En möjlig förklaring",
    "html": "En möjlig förklaring"
  },
  {
    "key": "ui/39",
    "plain": "En sak i taget.",
    "tex": "En sak i taget.",
    "html": "En sak i taget."
  },
  {
    "key": "ui/40",
    "plain": "En vanlig missuppfattning",
    "tex": "En vanlig missuppfattning",
    "html": "En vanlig missuppfattning"
  },
  {
    "key": "ui/41",
    "plain": "Era gemensamma förklaringar",
    "tex": "Era gemensamma förklaringar",
    "html": "Era gemensamma förklaringar"
  },
  {
    "key": "ui/42",
    "plain": "Era sju områden",
    "tex": "Era sju områden",
    "html": "Era sju områden"
  },
  {
    "key": "ui/43",
    "plain": "Era svar",
    "tex": "Era svar",
    "html": "Era svar"
  },
  {
    "key": "ui/44",
    "plain": "Era svar ·",
    "tex": "Era svar ·",
    "html": "Era svar ·"
  },
  {
    "key": "ui/45",
    "plain": "Era svar är kopierade.",
    "tex": "Era svar är kopierade.",
    "html": "Era svar är kopierade."
  },
  {
    "key": "ui/46",
    "plain": "FRÅN BILD TILL FÖRKLARING",
    "tex": "FRÅN BILD TILL FÖRKLARING",
    "html": "FRÅN BILD TILL FÖRKLARING"
  },
  {
    "key": "ui/47",
    "plain": "Filmen kunde inte laddas. Ni kan fortfarande undersöka ritningen och läsa förklaringen på sidan.",
    "tex": "Filmen kunde inte laddas. Ni kan fortfarande undersöka ritningen och läsa förklaringen på sidan.",
    "html": "Filmen kunde inte laddas. Ni kan fortfarande undersöka ritningen och läsa förklaringen på sidan."
  },
  {
    "key": "ui/48",
    "plain": "Fler förklaringar, exempel och viktiga begrepp",
    "tex": "Fler förklaringar, exempel och viktiga begrepp",
    "html": "Fler förklaringar, exempel och viktiga begrepp"
  },
  {
    "key": "ui/49",
    "plain": "Fortsätt med ett sparat arbete",
    "tex": "Fortsätt med ett sparat arbete",
    "html": "Fortsätt med ett sparat arbete"
  },
  {
    "key": "ui/50",
    "plain": "Från början ↻",
    "tex": "Från början \\(\\circlearrowright\\)",
    "html": "Från början <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mi>↻</mi><annotation encoding=\"application/x-tex\">\\circlearrowright</annotation></semantics></math>"
  },
  {
    "key": "ui/51",
    "plain": "Fysikalisk",
    "tex": "Fysikalisk",
    "html": "Fysikalisk"
  },
  {
    "key": "ui/52",
    "plain": "FÖLJ SAMBANDEN",
    "tex": "FÖLJ SAMBANDEN",
    "html": "FÖLJ SAMBANDEN"
  },
  {
    "key": "ui/53",
    "plain": "Följ de två elektronerna",
    "tex": "Följ de två elektronerna",
    "html": "Följ de två elektronerna"
  },
  {
    "key": "ui/54",
    "plain": "Följ ritningens pilar, färger och förklaringar. Berätta för varandra vad som händer.",
    "tex": "Följ ritningens pilar, färger och förklaringar. Berätta för varandra vad som händer.",
    "html": "Följ ritningens pilar, färger och förklaringar. Berätta för varandra vad som händer."
  },
  {
    "key": "ui/55",
    "plain": "Följ sambanden och förklara ritningen tillsammans.",
    "tex": "Följ sambanden och förklara ritningen tillsammans.",
    "html": "Följ sambanden och förklara ritningen tillsammans."
  },
  {
    "key": "ui/56",
    "plain": "Följ samma sex vattenmolekyler genom alla tre tillstånden. Deras uppbyggnad är densamma. Det som ändras är hur de rör sig och hur de ligger i förhållande till varandra.",
    "tex": "Följ samma sex vattenmolekyler genom alla tre tillstånden. Deras uppbyggnad är densamma. Det som ändras är hur de rör sig och hur de ligger i förhållande till varandra.",
    "html": "Följ samma sex vattenmolekyler genom alla tre tillstånden. Deras uppbyggnad är densamma. Det som ändras är hur de rör sig och hur de ligger i förhållande till varandra."
  },
  {
    "key": "ui/57",
    "plain": "Förklara med egna ord.",
    "tex": "Förklara med egna ord.",
    "html": "Förklara med egna ord."
  },
  {
    "key": "ui/58",
    "plain": "Förstå",
    "tex": "Förstå",
    "html": "Förstå"
  },
  {
    "key": "ui/59",
    "plain": "Gå ett steg djupare",
    "tex": "Gå ett steg djupare",
    "html": "Gå ett steg djupare"
  },
  {
    "key": "ui/60",
    "plain": "Hantering",
    "tex": "Hantering",
    "html": "Hantering"
  },
  {
    "key": "ui/61",
    "plain": "Hoppa till innehållet",
    "tex": "Hoppa till innehållet",
    "html": "Hoppa till innehållet"
  },
  {
    "key": "ui/62",
    "plain": "Hur säkra känner ni er?",
    "tex": "Hur säkra känner ni er?",
    "html": "Hur säkra känner ni er?"
  },
  {
    "key": "ui/63",
    "plain": "Insamling",
    "tex": "Insamling",
    "html": "Insamling"
  },
  {
    "key": "ui/64",
    "plain": "Jämför atommodellerna",
    "tex": "Jämför atommodellerna",
    "html": "Jämför atommodellerna"
  },
  {
    "key": "ui/65",
    "plain": "Jämför med ett exempel",
    "tex": "Jämför med ett exempel",
    "html": "Jämför med ett exempel"
  },
  {
    "key": "ui/66",
    "plain": "Jämför sorteringen",
    "tex": "Jämför sorteringen",
    "html": "Jämför sorteringen"
  },
  {
    "key": "ui/67",
    "plain": "Järn",
    "tex": "Järn",
    "html": "Järn"
  },
  {
    "key": "ui/68",
    "plain": "Kemins grunder (i)",
    "tex": "Kemins grunder (i)",
    "html": "Kemins grunder (i)"
  },
  {
    "key": "ui/69",
    "plain": "Kemins grunder (i) · Sju steg mot provet",
    "tex": "Kemins grunder (i) · Sju steg mot provet",
    "html": "Kemins grunder (i) · Sju steg mot provet"
  },
  {
    "key": "ui/70",
    "plain": "Kemins grunder (i)",
    "tex": "Kemins grunder (i)",
    "html": "Kemins grunder (i)"
  },
  {
    "key": "ui/71",
    "plain": "Kemins grunder (i), område 1",
    "tex": "Kemins grunder (i), område 1",
    "html": "Kemins grunder (i), område 1"
  },
  {
    "key": "ui/72",
    "plain": "Kemisk",
    "tex": "Kemisk",
    "html": "Kemisk"
  },
  {
    "key": "ui/73",
    "plain": "Kontrollera snabbkollen",
    "tex": "Kontrollera snabbkollen",
    "html": "Kontrollera snabbkollen"
  },
  {
    "key": "ui/74",
    "plain": "Kopiera svaren",
    "tex": "Kopiera svaren",
    "html": "Kopiera svaren"
  },
  {
    "key": "ui/75",
    "plain": "Koppar",
    "tex": "Koppar",
    "html": "Koppar"
  },
  {
    "key": "ui/76",
    "plain": "Ladda ned som text",
    "tex": "Ladda ned som text",
    "html": "Ladda ned som text"
  },
  {
    "key": "ui/77",
    "plain": "Lägg till eller ta bort H och O. Räkna atomer och atomslag. Atomerna blir inte automatiskt en molekyl bara för att de ligger bredvid varandra.",
    "tex": "Lägg till eller ta bort H och O. Räkna atomer och atomslag. Atomerna blir inte automatiskt en molekyl bara för att de ligger bredvid varandra.",
    "html": "Lägg till eller ta bort H och O. Räkna atomer och atomslag. Atomerna blir inte automatiskt en molekyl bara för att de ligger bredvid varandra."
  },
  {
    "key": "ui/78",
    "plain": "Läs en kort sammanfattning",
    "tex": "Läs en kort sammanfattning",
    "html": "Läs en kort sammanfattning"
  },
  {
    "key": "ui/79",
    "plain": "Läs igenom era svar tillsammans. Vad kan ni förklara nu? Vad vill ni öva på en gång till?",
    "tex": "Läs igenom era svar tillsammans. Vad kan ni förklara nu? Vad vill ni öva på en gång till?",
    "html": "Läs igenom era svar tillsammans. Vad kan ni förklara nu? Vad vill ni öva på en gång till?"
  },
  {
    "key": "ui/80",
    "plain": "Läs tillsammans. Stanna vid det ni undrar över.",
    "tex": "Läs tillsammans. Stanna vid det ni undrar över.",
    "html": "Läs tillsammans. Stanna vid det ni undrar över."
  },
  {
    "key": "ui/81",
    "plain": "M22 13L10 30M22 13L34 30",
    "tex": "M22 13L10 30M22 13L34 30",
    "html": "M22 13L10 30M22 13L34 30"
  },
  {
    "key": "ui/82",
    "plain": "Mark / vatten",
    "tex": "Mark / vatten",
    "html": "Mark / vatten"
  },
  {
    "key": "ui/83",
    "plain": "Markera och kopiera texten som visas.",
    "tex": "Markera och kopiera texten som visas.",
    "html": "Markera och kopiera texten som visas."
  },
  {
    "key": "ui/84",
    "plain": "Musik på",
    "tex": "Musik på",
    "html": "Musik på"
  },
  {
    "key": "ui/85",
    "plain": "NU UNDERSÖKER NI",
    "tex": "NU UNDERSÖKER NI",
    "html": "NU UNDERSÖKER NI"
  },
  {
    "key": "ui/86",
    "plain": "Ni kan också kopiera sammanställningen som vanlig text.",
    "tex": "Ni kan också kopiera sammanställningen som vanlig text.",
    "html": "Ni kan också kopiera sammanställningen som vanlig text."
  },
  {
    "key": "ui/87",
    "plain": "Ni kan titta på filmen direkt. Er första tanke kan hjälpa er att se hur er förklaring utvecklas.",
    "tex": "Ni kan titta på filmen direkt. Er första tanke kan hjälpa er att se hur er förklaring utvecklas.",
    "html": "Ni kan titta på filmen direkt. Er första tanke kan hjälpa er att se hur er förklaring utvecklas."
  },
  {
    "key": "ui/88",
    "plain": "Nästa steg: läs och undersök.",
    "tex": "Nästa steg: läs och undersök.",
    "html": "Nästa steg: läs och undersök."
  },
  {
    "key": "ui/89",
    "plain": "ORD ATT ANVÄNDA I ER FÖRKLARING",
    "tex": "ORD ATT ANVÄNDA I ER FÖRKLARING",
    "html": "ORD ATT ANVÄNDA I ER FÖRKLARING"
  },
  {
    "key": "ui/90",
    "plain": "Om ni hinner: tänk ett steg till",
    "tex": "Om ni hinner: tänk ett steg till",
    "html": "Om ni hinner: tänk ett steg till"
  },
  {
    "key": "ui/91",
    "plain": "Organismer",
    "tex": "Organismer",
    "html": "Organismer"
  },
  {
    "key": "ui/92",
    "plain": "PARETS FÖRKLARING",
    "tex": "PARETS FÖRKLARING",
    "html": "PARETS FÖRKLARING"
  },
  {
    "key": "ui/93",
    "plain": "PAUSA OCH PRATA",
    "tex": "PAUSA OCH PRATA",
    "html": "PAUSA OCH PRATA"
  },
  {
    "key": "ui/94",
    "plain": "PRÖVA ERT RESONEMANG",
    "tex": "PRÖVA ERT RESONEMANG",
    "html": "PRÖVA ERT RESONEMANG"
  },
  {
    "key": "ui/95",
    "plain": "Prata vidare",
    "tex": "Prata vidare",
    "html": "Prata vidare"
  },
  {
    "key": "ui/96",
    "plain": "Prov 3 december",
    "tex": "Prov 3 december",
    "html": "Prov 3 december"
  },
  {
    "key": "ui/97",
    "plain": "Prova en förändring. Förklara vad ni ser.",
    "tex": "Prova en förändring. Förklara vad ni ser.",
    "html": "Prova en förändring. Förklara vad ni ser."
  },
  {
    "key": "ui/98",
    "plain": "Pröva själva · arbeta var för sig",
    "tex": "Pröva själva · arbeta var för sig",
    "html": "Pröva själva · arbeta var för sig"
  },
  {
    "key": "ui/99",
    "plain": "ROLLER I DET HÄR OMRÅDET",
    "tex": "ROLLER I DET HÄR OMRÅDET",
    "html": "ROLLER I DET HÄR OMRÅDET"
  },
  {
    "key": "ui/100",
    "plain": "SIKTE PÅ PROVET",
    "tex": "SIKTE PÅ PROVET",
    "html": "SIKTE PÅ PROVET"
  },
  {
    "key": "ui/101",
    "plain": "SJU PROVOMRÅDEN",
    "tex": "SJU PROVOMRÅDEN",
    "html": "SJU PROVOMRÅDEN"
  },
  {
    "key": "ui/102",
    "plain": "Samma sex vattenmolekyler",
    "tex": "Samma sex vattenmolekyler",
    "html": "Samma sex vattenmolekyler"
  },
  {
    "key": "ui/103",
    "plain": "Sex vattenmolekyler i valt aggregationstillstånd.",
    "tex": "Sex vattenmolekyler i valt aggregationstillstånd.",
    "html": "Sex vattenmolekyler i valt aggregationstillstånd."
  },
  {
    "key": "ui/104",
    "plain": "Sju provområden",
    "tex": "Sju provområden",
    "html": "Sju provområden"
  },
  {
    "key": "ui/105",
    "plain": "Skadat batteri",
    "tex": "Skadat batteri",
    "html": "Skadat batteri"
  },
  {
    "key": "ui/106",
    "plain": "Skriv ert svar →",
    "tex": "Skriv ert svar \\(\\rightarrow\\)",
    "html": "Skriv ert svar <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mo>→</mo><annotation encoding=\"application/x-tex\">\\rightarrow</annotation></semantics></math>"
  },
  {
    "key": "ui/107",
    "plain": "Skriv ut / spara som PDF",
    "tex": "Skriv ut / spara som PDF",
    "html": "Skriv ut / spara som PDF"
  },
  {
    "key": "ui/108",
    "plain": "Snabbkoll: Ni vet att ett prov är antingen järn eller koppar. Vilken undersökning kan skilja dem åt?",
    "tex": "Snabbkoll: Ni vet att ett prov är antingen järn eller koppar. Vilken undersökning kan skilja dem åt?",
    "html": "Snabbkoll: Ni vet att ett prov är antingen järn eller koppar. Vilken undersökning kan skilja dem åt?"
  },
  {
    "key": "ui/109",
    "plain": "Snabbkoll: Vad händer med vattenmolekylerna när flytande vatten förångas?",
    "tex": "Snabbkoll: Vad händer med vattenmolekylerna när flytande vatten förångas?",
    "html": "Snabbkoll: Vad händer med vattenmolekylerna när flytande vatten förångas?"
  },
  {
    "key": "ui/110",
    "plain": "Snabbkoll: Vad stämmer vid en vanlig kemisk reaktion?",
    "tex": "Snabbkoll: Vad stämmer vid en vanlig kemisk reaktion?",
    "html": "Snabbkoll: Vad stämmer vid en vanlig kemisk reaktion?"
  },
  {
    "key": "ui/111",
    "plain": "Snabbkoll: Varför kan en vetenskaplig modell behöva förändras?",
    "tex": "Snabbkoll: Varför kan en vetenskaplig modell behöva förändras?",
    "html": "Snabbkoll: Varför kan en vetenskaplig modell behöva förändras?"
  },
  {
    "key": "ui/112",
    "plain": "Snabbkoll: Varför är kokande vatten ett exempel på en fysikalisk förändring?",
    "tex": "Snabbkoll: Varför är kokande vatten ett exempel på en fysikalisk förändring?",
    "html": "Snabbkoll: Varför är kokande vatten ett exempel på en fysikalisk förändring?"
  },
  {
    "key": "ui/113",
    "plain": "Snabbkoll: Vilket påstående om en vattenmolekyl, H₂O, stämmer?",
    "tex": "Snabbkoll: Vilket påstående om en vattenmolekyl, \\(\\mathrm{H_2O}\\), stämmer?",
    "html": "Snabbkoll: Vilket påstående om en vattenmolekyl, <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>, stämmer?"
  },
  {
    "key": "ui/114",
    "plain": "Snabbkoll: Vilket påstående är bäst?",
    "tex": "Snabbkoll: Vilket påstående är bäst?",
    "html": "Snabbkoll: Vilket påstående är bäst?"
  },
  {
    "key": "ui/115",
    "plain": "Sortera förändringarna",
    "tex": "Sortera förändringarna",
    "html": "Sortera förändringarna"
  },
  {
    "key": "ui/116",
    "plain": "Spara en kopia först om ni vill behålla era svar.",
    "tex": "Spara en kopia först om ni vill behålla era svar.",
    "html": "Spara en kopia först om ni vill behålla era svar."
  },
  {
    "key": "ui/117",
    "plain": "Spara en kopia när ni avslutar. Då kan ni fortsätta där ni slutade.",
    "tex": "Spara en kopia när ni avslutar. Då kan ni fortsätta där ni slutade.",
    "html": "Spara en kopia när ni avslutar. Då kan ni fortsätta där ni slutade."
  },
  {
    "key": "ui/118",
    "plain": "Spara en ny kopia efter att ni skrivit era sista förklaringar.",
    "tex": "Spara en ny kopia efter att ni skrivit era sista förklaringar.",
    "html": "Spara en ny kopia efter att ni skrivit era sista förklaringar."
  },
  {
    "key": "ui/119",
    "plain": "Spara en svarsfil här. Öppna den på nästa dator med knappen nedanför.",
    "tex": "Spara en svarsfil här. Öppna den på nästa dator med knappen nedanför.",
    "html": "Spara en svarsfil här. Öppna den på nästa dator med knappen nedanför."
  },
  {
    "key": "ui/120",
    "plain": "Spara ert arbete",
    "tex": "Spara ert arbete",
    "html": "Spara ert arbete"
  },
  {
    "key": "ui/121",
    "plain": "Spara svarsfil",
    "tex": "Spara svarsfil",
    "html": "Spara svarsfil"
  },
  {
    "key": "ui/122",
    "plain": "Spara vår första tanke",
    "tex": "Spara vår första tanke",
    "html": "Spara vår första tanke"
  },
  {
    "key": "ui/123",
    "plain": "Spela filmen",
    "tex": "Spela filmen",
    "html": "Spela filmen"
  },
  {
    "key": "ui/124",
    "plain": "String(value).replace(/[&",
    "tex": "String(value).replace(/[\\&",
    "html": "String(value).replace(/[&amp;"
  },
  {
    "key": "ui/125",
    "plain": "Studera",
    "tex": "Studera",
    "html": "Studera"
  },
  {
    "key": "ui/126",
    "plain": "Stäng ×",
    "tex": "Stäng \\(\\times\\)",
    "html": "Stäng <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mi>×</mi><annotation encoding=\"application/x-tex\">\\times</annotation></semantics></math>"
  },
  {
    "key": "ui/127",
    "plain": "Svara",
    "tex": "Svara",
    "html": "Svara"
  },
  {
    "key": "ui/128",
    "plain": "Svaren sparas på den här datorn.",
    "tex": "Svaren sparas på den här datorn.",
    "html": "Svaren sparas på den här datorn."
  },
  {
    "key": "ui/129",
    "plain": "TA MED ER DET HÄR",
    "tex": "TA MED ER DET HÄR",
    "html": "TA MED ER DET HÄR"
  },
  {
    "key": "ui/130",
    "plain": "TITTA EFTER",
    "tex": "TITTA EFTER",
    "html": "TITTA EFTER"
  },
  {
    "key": "ui/131",
    "plain": "TITTA TILLSAMMANS · PAUSA NÄR NI VILL",
    "tex": "TITTA TILLSAMMANS · PAUSA NÄR NI VILL",
    "html": "TITTA TILLSAMMANS · PAUSA NÄR NI VILL"
  },
  {
    "key": "ui/132",
    "plain": "TITTA · FÖRSTÅ · SVARA",
    "tex": "TITTA · FÖRSTÅ · SVARA",
    "html": "TITTA · FÖRSTÅ · SVARA"
  },
  {
    "key": "ui/133",
    "plain": "Till förklaringen →",
    "tex": "Till förklaringen \\(\\rightarrow\\)",
    "html": "Till förklaringen <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mo>→</mo><annotation encoding=\"application/x-tex\">\\rightarrow</annotation></semantics></math>"
  },
  {
    "key": "ui/134",
    "plain": "Titta",
    "tex": "Titta",
    "html": "Titta"
  },
  {
    "key": "ui/135",
    "plain": "Två möjliga vägar",
    "tex": "Två möjliga vägar",
    "html": "Två möjliga vägar"
  },
  {
    "key": "ui/136",
    "plain": "Två separata väteatomer, vardera med en elektron",
    "tex": "Två separata väteatomer, vardera med en elektron",
    "html": "Två separata väteatomer, vardera med en elektron"
  },
  {
    "key": "ui/137",
    "plain": "Två vätekärnor delar två elektroner",
    "tex": "Två vätekärnor delar två elektroner",
    "html": "Två vätekärnor delar två elektroner"
  },
  {
    "key": "ui/138",
    "plain": "TÄNK ETT VARV TILL",
    "tex": "TÄNK ETT VARV TILL",
    "html": "TÄNK ETT VARV TILL"
  },
  {
    "key": "ui/139",
    "plain": "Undersök kemins sju provområden tillsammans. Filmer, ritningar och interaktivt pararbete för årskurs 7 inför provet den 3 december 2026.",
    "tex": "Undersök kemins sju provområden tillsammans. Filmer, ritningar och interaktivt pararbete för årskurs 7 inför provet den 3 december 2026.",
    "html": "Undersök kemins sju provområden tillsammans. Filmer, ritningar och interaktivt pararbete för årskurs 7 inför provet den 3 december 2026."
  },
  {
    "key": "ui/140",
    "plain": "Vad har ni",
    "tex": "Vad har ni",
    "html": "Vad har ni"
  },
  {
    "key": "ui/141",
    "plain": "Vad har ni med i ert svar? Lägg till ett samband eller ett exempel som gör förklaringen tydligare.",
    "tex": "Vad har ni med i ert svar? Lägg till ett samband eller ett exempel som gör förklaringen tydligare.",
    "html": "Vad har ni med i ert svar? Lägg till ett samband eller ett exempel som gör förklaringen tydligare."
  },
  {
    "key": "ui/142",
    "plain": "Vad kan du förklara nu?",
    "tex": "Vad kan du förklara nu?",
    "html": "Vad kan du förklara nu?"
  },
  {
    "key": "ui/143",
    "plain": "Vad tror ni? Skriv en första tanke om ni vill.",
    "tex": "Vad tror ni? Skriv en första tanke om ni vill.",
    "html": "Vad tror ni? Skriv en första tanke om ni vill."
  },
  {
    "key": "ui/144",
    "plain": "Vi behöver en ledtråd",
    "tex": "Vi behöver en ledtråd",
    "html": "Vi behöver en ledtråd"
  },
  {
    "key": "ui/145",
    "plain": "Vi har diskuterat och skrivit. Båda har varit delaktiga.",
    "tex": "Vi har diskuterat och skrivit. Båda har varit delaktiga.",
    "html": "Vi har diskuterat och skrivit. Båda har varit delaktiga."
  },
  {
    "key": "ui/146",
    "plain": "Vi jämför tydligt namngivna prov av järn och koppar vid rumstemperatur.",
    "tex": "Vi jämför tydligt namngivna prov av järn och koppar vid rumstemperatur.",
    "html": "Vi jämför tydligt namngivna prov av järn och koppar vid rumstemperatur."
  },
  {
    "key": "ui/147",
    "plain": "Vi vet inte än",
    "tex": "Vi vet inte än",
    "html": "Vi vet inte än"
  },
  {
    "key": "ui/148",
    "plain": "Visa kopierbar text",
    "tex": "Visa kopierbar text",
    "html": "Visa kopierbar text"
  },
  {
    "key": "ui/149",
    "plain": "Välj en grupp för varje händelse. Fråga er: bildas nya ämnen?",
    "tex": "Välj en grupp för varje händelse. Fråga er: bildas nya ämnen?",
    "html": "Välj en grupp för varje händelse. Fråga er: bildas nya ämnen?"
  },
  {
    "key": "ui/150",
    "plain": "Välj en modell. Följ särskilt var den positiva och den negativa laddningen visas.",
    "tex": "Välj en modell. Följ särskilt var den positiva och den negativa laddningen visas.",
    "html": "Välj en modell. Följ särskilt var den positiva och den negativa laddningen visas."
  },
  {
    "key": "ui/151",
    "plain": "Välj en sak du nu kan förklara. Skriv din förklaring utan att läsa parets svar. Avsluta med något du fortfarande undrar över.",
    "tex": "Välj en sak du nu kan förklara. Skriv din förklaring utan att läsa parets svar. Avsluta med något du fortfarande undrar över.",
    "html": "Välj en sak du nu kan förklara. Skriv din förklaring utan att läsa parets svar. Avsluta med något du fortfarande undrar över."
  },
  {
    "key": "ui/152",
    "plain": "Välj en undersökning",
    "tex": "Välj en undersökning",
    "html": "Välj en undersökning"
  },
  {
    "key": "ui/153",
    "plain": "Välj …",
    "tex": "Välj …",
    "html": "Välj …"
  },
  {
    "key": "ui/154",
    "plain": "accept=",
    "tex": "accept=",
    "html": "accept="
  },
  {
    "key": "ui/155",
    "plain": "alt=",
    "tex": "alt=",
    "html": "alt="
  },
  {
    "key": "ui/156",
    "plain": "aria-controls=",
    "tex": "aria-controls=",
    "html": "aria-controls="
  },
  {
    "key": "ui/157",
    "plain": "aria-label=",
    "tex": "aria-label=",
    "html": "aria-label="
  },
  {
    "key": "ui/158",
    "plain": "aria-labelledby=",
    "tex": "aria-labelledby=",
    "html": "aria-labelledby="
  },
  {
    "key": "ui/159",
    "plain": "aria-pressed=",
    "tex": "aria-pressed=",
    "html": "aria-pressed="
  },
  {
    "key": "ui/160",
    "plain": "aria-selected=",
    "tex": "aria-selected=",
    "html": "aria-selected="
  },
  {
    "key": "ui/161",
    "plain": "class=",
    "tex": "class=",
    "html": "class="
  },
  {
    "key": "ui/162",
    "plain": "controls playsinline preload=",
    "tex": "controls playsinline preload=",
    "html": "controls playsinline preload="
  },
  {
    "key": "ui/163",
    "plain": "cy=",
    "tex": "cy=",
    "html": "cy="
  },
  {
    "key": "ui/164",
    "plain": "data-action=",
    "tex": "data-action=",
    "html": "data-action="
  },
  {
    "key": "ui/165",
    "plain": "data-chapter=",
    "tex": "data-chapter=",
    "html": "data-chapter="
  },
  {
    "key": "ui/166",
    "plain": "data-go-stage=",
    "tex": "data-go-stage=",
    "html": "data-go-stage="
  },
  {
    "key": "ui/167",
    "plain": "data-stage=",
    "tex": "data-stage=",
    "html": "data-stage="
  },
  {
    "key": "ui/168",
    "plain": "data-step=",
    "tex": "data-step=",
    "html": "data-step="
  },
  {
    "key": "ui/169",
    "plain": "data-value=",
    "tex": "data-value=",
    "html": "data-value="
  },
  {
    "key": "ui/170",
    "plain": "fill=",
    "tex": "fill=",
    "html": "fill="
  },
  {
    "key": "ui/171",
    "plain": "font-size=",
    "tex": "font-size=",
    "html": "font-size="
  },
  {
    "key": "ui/172",
    "plain": "for=",
    "tex": "for=",
    "html": "for="
  },
  {
    "key": "ui/173",
    "plain": "height=",
    "tex": "height=",
    "html": "height="
  },
  {
    "key": "ui/174",
    "plain": "hidden aria-label=",
    "tex": "hidden aria-label=",
    "html": "hidden aria-label="
  },
  {
    "key": "ui/175",
    "plain": "href=",
    "tex": "href=",
    "html": "href="
  },
  {
    "key": "ui/176",
    "plain": "id=",
    "tex": "id=",
    "html": "id="
  },
  {
    "key": "ui/177",
    "plain": "kommit fram till?",
    "tex": "kommit fram till?",
    "html": "kommit fram till?"
  },
  {
    "key": "ui/178",
    "plain": "label=",
    "tex": "label=",
    "html": "label="
  },
  {
    "key": "ui/179",
    "plain": "loading=",
    "tex": "loading=",
    "html": "loading="
  },
  {
    "key": "ui/180",
    "plain": "maxlength=",
    "tex": "maxlength=",
    "html": "maxlength="
  },
  {
    "key": "ui/181",
    "plain": "name=",
    "tex": "name=",
    "html": "name="
  },
  {
    "key": "ui/182",
    "plain": "placeholder=",
    "tex": "placeholder=",
    "html": "placeholder="
  },
  {
    "key": "ui/183",
    "plain": "poster=",
    "tex": "poster=",
    "html": "poster="
  },
  {
    "key": "ui/184",
    "plain": "rel=",
    "tex": "rel=",
    "html": "rel="
  },
  {
    "key": "ui/185",
    "plain": "role=",
    "tex": "role=",
    "html": "role="
  },
  {
    "key": "ui/186",
    "plain": "rx=",
    "tex": "rx=",
    "html": "rx="
  },
  {
    "key": "ui/187",
    "plain": "ry=",
    "tex": "ry=",
    "html": "ry="
  },
  {
    "key": "ui/188",
    "plain": "src=",
    "tex": "src=",
    "html": "src="
  },
  {
    "key": "ui/189",
    "plain": "srclang=",
    "tex": "srclang=",
    "html": "srclang="
  },
  {
    "key": "ui/190",
    "plain": "stroke-width=",
    "tex": "stroke-width=",
    "html": "stroke-width="
  },
  {
    "key": "ui/191",
    "plain": "stroke=",
    "tex": "stroke=",
    "html": "stroke="
  },
  {
    "key": "ui/192",
    "plain": "style=",
    "tex": "style=",
    "html": "style="
  },
  {
    "key": "ui/193",
    "plain": "tabindex=",
    "tex": "tabindex=",
    "html": "tabindex="
  },
  {
    "key": "ui/194",
    "plain": "target=",
    "tex": "target=",
    "html": "target="
  },
  {
    "key": "ui/195",
    "plain": "text-anchor=",
    "tex": "text-anchor=",
    "html": "text-anchor="
  },
  {
    "key": "ui/196",
    "plain": "title=",
    "tex": "title=",
    "html": "title="
  },
  {
    "key": "ui/197",
    "plain": "type=",
    "tex": "type=",
    "html": "type="
  },
  {
    "key": "ui/198",
    "plain": "value=",
    "tex": "value=",
    "html": "value="
  },
  {
    "key": "ui/199",
    "plain": "viewBox=",
    "tex": "viewBox=",
    "html": "viewBox="
  },
  {
    "key": "ui/200",
    "plain": "width=",
    "tex": "width=",
    "html": "width="
  },
  {
    "key": "ui/201",
    "plain": "width=device-width, initial-scale=1",
    "tex": "width=device-width, initial-scale=1",
    "html": "width=device-width, initial-scale=1"
  },
  {
    "key": "ui/202",
    "plain": "KEMI · SJU OMRÅDEN",
    "tex": "KEMI · SJU OMRÅDEN",
    "html": "KEMI · SJU OMRÅDEN"
  },
  {
    "key": "ui/203",
    "plain": "Kemi · Sju områden",
    "tex": "Kemi · Sju områden",
    "html": "Kemi · Sju områden"
  },
  {
    "key": "ui/204",
    "plain": "Öppna en tom arbetsyta",
    "tex": "Öppna en tom arbetsyta",
    "html": "Öppna en tom arbetsyta"
  },
  {
    "key": "ui/205",
    "plain": "Öppna stor ritning ↗",
    "tex": "Öppna stor ritning \\(\\nearrow\\)",
    "html": "Öppna stor ritning <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mo>↗</mo><annotation encoding=\"application/x-tex\">\\nearrow</annotation></semantics></math>"
  },
  {
    "key": "ui/206",
    "plain": "Öppna svarsfil",
    "tex": "Öppna svarsfil",
    "html": "Öppna svarsfil"
  },
  {
    "key": "ui/207",
    "plain": "← Läs förklaringen",
    "tex": "\\(\\leftarrow\\) Läs förklaringen",
    "html": "<math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mo>←</mo><annotation encoding=\"application/x-tex\">\\leftarrow</annotation></semantics></math> Läs förklaringen"
  },
  {
    "key": "ui/208",
    "plain": "← Till filmen",
    "tex": "\\(\\leftarrow\\) Till filmen",
    "html": "<math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mo>←</mo><annotation encoding=\"application/x-tex\">\\leftarrow</annotation></semantics></math> Till filmen"
  },
  {
    "key": "ui-v5-extra/0",
    "plain": "+ H",
    "tex": "+ H",
    "html": "+ H"
  },
  {
    "key": "ui-v5-extra/1",
    "plain": "+ O",
    "tex": "+ O",
    "html": "+ O"
  },
  {
    "key": "ui-v5-extra/2",
    "plain": "0 atomer · 0 atomslag. Jämför med molekylmodellerna ovan.",
    "tex": "0 atomer · 0 atomslag. Jämför med molekylmodellerna ovan.",
    "html": "0 atomer · 0 atomslag. Jämför med molekylmodellerna ovan."
  },
  {
    "key": "ui-v5-extra/3",
    "plain": "0 av 4 placerade rätt. Utgå från om ämnet fortfarande är samma eller om nya ämnen har bildats. Prova igen.",
    "tex": "0 av 4 placerade rätt. Utgå från om ämnet fortfarande är samma eller om nya ämnen har bildats. Prova igen.",
    "html": "0 av 4 placerade rätt. Utgå från om ämnet fortfarande är samma eller om nya ämnen har bildats. Prova igen."
  },
  {
    "key": "ui-v5-extra/4",
    "plain": "00",
    "tex": "00",
    "html": "00"
  },
  {
    "key": "ui-v5-extra/5",
    "plain": "01",
    "tex": "01",
    "html": "01"
  },
  {
    "key": "ui-v5-extra/6",
    "plain": "02",
    "tex": "02",
    "html": "02"
  },
  {
    "key": "ui-v5-extra/7",
    "plain": "04",
    "tex": "04",
    "html": "04"
  },
  {
    "key": "ui-v5-extra/8",
    "plain": "05",
    "tex": "05",
    "html": "05"
  },
  {
    "key": "ui-v5-extra/9",
    "plain": "1 atomer · 1 atomslag. Jämför med molekylmodellerna ovan.",
    "tex": "1 atomer · 1 atomslag. Jämför med molekylmodellerna ovan.",
    "html": "1 atomer · 1 atomslag. Jämför med molekylmodellerna ovan."
  },
  {
    "key": "ui-v5-extra/10",
    "plain": "1 av 4 placerade rätt. Utgå från om ämnet fortfarande är samma eller om nya ämnen har bildats. Prova igen.",
    "tex": "1 av 4 placerade rätt. Utgå från om ämnet fortfarande är samma eller om nya ämnen har bildats. Prova igen.",
    "html": "1 av 4 placerade rätt. Utgå från om ämnet fortfarande är samma eller om nya ämnen har bildats. Prova igen."
  },
  {
    "key": "ui-v5-extra/11",
    "plain": "10 atomer · 2 atomslag. Jämför med molekylmodellerna ovan.",
    "tex": "10 atomer · 2 atomslag. Jämför med molekylmodellerna ovan.",
    "html": "10 atomer · 2 atomslag. Jämför med molekylmodellerna ovan."
  },
  {
    "key": "ui-v5-extra/12",
    "plain": "11 atomer · 2 atomslag. Jämför med molekylmodellerna ovan.",
    "tex": "11 atomer · 2 atomslag. Jämför med molekylmodellerna ovan.",
    "html": "11 atomer · 2 atomslag. Jämför med molekylmodellerna ovan."
  },
  {
    "key": "ui-v5-extra/13",
    "plain": "12 atomer · 2 atomslag. Jämför med molekylmodellerna ovan.",
    "tex": "12 atomer · 2 atomslag. Jämför med molekylmodellerna ovan.",
    "html": "12 atomer · 2 atomslag. Jämför med molekylmodellerna ovan."
  },
  {
    "key": "ui-v5-extra/14",
    "plain": "2 atomer · 1 atomslag. Två H-atomer kan bindas ihop till H₂.",
    "tex": "2 atomer · 1 atomslag. Två H-atomer kan bindas ihop till \\(\\mathrm{H_2}\\).",
    "html": "2 atomer · 1 atomslag. Två H-atomer kan bindas ihop till <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{H_2}</annotation></semantics></math>."
  },
  {
    "key": "ui-v5-extra/15",
    "plain": "2 atomer · 1 atomslag. Två O-atomer kan bindas ihop till O₂.",
    "tex": "2 atomer · 1 atomslag. Två O-atomer kan bindas ihop till \\(\\mathrm{O_2}\\).",
    "html": "2 atomer · 1 atomslag. Två O-atomer kan bindas ihop till <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><msub><mi mathvariant=\"normal\">O</mi><mn mathvariant=\"normal\">2</mn></msub><annotation encoding=\"application/x-tex\">\\mathrm{O_2}</annotation></semantics></math>."
  },
  {
    "key": "ui-v5-extra/16",
    "plain": "2 atomer · 2 atomslag. Jämför med molekylmodellerna ovan.",
    "tex": "2 atomer · 2 atomslag. Jämför med molekylmodellerna ovan.",
    "html": "2 atomer · 2 atomslag. Jämför med molekylmodellerna ovan."
  },
  {
    "key": "ui-v5-extra/17",
    "plain": "2 av 4 placerade rätt. Utgå från om ämnet fortfarande är samma eller om nya ämnen har bildats. Prova igen.",
    "tex": "2 av 4 placerade rätt. Utgå från om ämnet fortfarande är samma eller om nya ämnen har bildats. Prova igen.",
    "html": "2 av 4 placerade rätt. Utgå från om ämnet fortfarande är samma eller om nya ämnen har bildats. Prova igen."
  },
  {
    "key": "ui-v5-extra/18",
    "plain": "3 atomer · 1 atomslag. Jämför med molekylmodellerna ovan.",
    "tex": "3 atomer · 1 atomslag. Jämför med molekylmodellerna ovan.",
    "html": "3 atomer · 1 atomslag. Jämför med molekylmodellerna ovan."
  },
  {
    "key": "ui-v5-extra/19",
    "plain": "3 atomer · 2 atomslag. Det är rätt antal H och O för en H₂O-molekyl. De behöver också bindas ihop på rätt sätt.",
    "tex": "3 atomer · 2 atomslag. Det är rätt antal H och O för en \\(\\mathrm{H_2O}\\)-molekyl. De behöver också bindas ihop på rätt sätt.",
    "html": "3 atomer · 2 atomslag. Det är rätt antal H och O för en <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>-molekyl. De behöver också bindas ihop på rätt sätt."
  },
  {
    "key": "ui-v5-extra/20",
    "plain": "3 atomer · 2 atomslag. Jämför med molekylmodellerna ovan.",
    "tex": "3 atomer · 2 atomslag. Jämför med molekylmodellerna ovan.",
    "html": "3 atomer · 2 atomslag. Jämför med molekylmodellerna ovan."
  },
  {
    "key": "ui-v5-extra/21",
    "plain": "3 av 4 placerade rätt. Utgå från om ämnet fortfarande är samma eller om nya ämnen har bildats. Prova igen.",
    "tex": "3 av 4 placerade rätt. Utgå från om ämnet fortfarande är samma eller om nya ämnen har bildats. Prova igen.",
    "html": "3 av 4 placerade rätt. Utgå från om ämnet fortfarande är samma eller om nya ämnen har bildats. Prova igen."
  },
  {
    "key": "ui-v5-extra/22",
    "plain": "3 december 2026",
    "tex": "3 december 2026",
    "html": "3 december 2026"
  },
  {
    "key": "ui-v5-extra/23",
    "plain": "4 atomer · 1 atomslag. Jämför med molekylmodellerna ovan.",
    "tex": "4 atomer · 1 atomslag. Jämför med molekylmodellerna ovan.",
    "html": "4 atomer · 1 atomslag. Jämför med molekylmodellerna ovan."
  },
  {
    "key": "ui-v5-extra/24",
    "plain": "4 atomer · 2 atomslag. Jämför med molekylmodellerna ovan.",
    "tex": "4 atomer · 2 atomslag. Jämför med molekylmodellerna ovan.",
    "html": "4 atomer · 2 atomslag. Jämför med molekylmodellerna ovan."
  },
  {
    "key": "ui-v5-extra/25",
    "plain": "4 av 4 placerade rätt. Smältning och kokning ändrar tillstånd. Rost och förbränning bildar nya ämnen.",
    "tex": "4 av 4 placerade rätt. Smältning och kokning ändrar tillstånd. Rost och förbränning bildar nya ämnen.",
    "html": "4 av 4 placerade rätt. Smältning och kokning ändrar tillstånd. Rost och förbränning bildar nya ämnen."
  },
  {
    "key": "ui-v5-extra/26",
    "plain": "5 atomer · 1 atomslag. Jämför med molekylmodellerna ovan.",
    "tex": "5 atomer · 1 atomslag. Jämför med molekylmodellerna ovan.",
    "html": "5 atomer · 1 atomslag. Jämför med molekylmodellerna ovan."
  },
  {
    "key": "ui-v5-extra/27",
    "plain": "5 atomer · 2 atomslag. Jämför med molekylmodellerna ovan.",
    "tex": "5 atomer · 2 atomslag. Jämför med molekylmodellerna ovan.",
    "html": "5 atomer · 2 atomslag. Jämför med molekylmodellerna ovan."
  },
  {
    "key": "ui-v5-extra/28",
    "plain": "6 atomer · 1 atomslag. Jämför med molekylmodellerna ovan.",
    "tex": "6 atomer · 1 atomslag. Jämför med molekylmodellerna ovan.",
    "html": "6 atomer · 1 atomslag. Jämför med molekylmodellerna ovan."
  },
  {
    "key": "ui-v5-extra/29",
    "plain": "6 atomer · 2 atomslag. Jämför med molekylmodellerna ovan.",
    "tex": "6 atomer · 2 atomslag. Jämför med molekylmodellerna ovan.",
    "html": "6 atomer · 2 atomslag. Jämför med molekylmodellerna ovan."
  },
  {
    "key": "ui-v5-extra/30",
    "plain": "7 atomer · 2 atomslag. Jämför med molekylmodellerna ovan.",
    "tex": "7 atomer · 2 atomslag. Jämför med molekylmodellerna ovan.",
    "html": "7 atomer · 2 atomslag. Jämför med molekylmodellerna ovan."
  },
  {
    "key": "ui-v5-extra/31",
    "plain": "8 atomer · 2 atomslag. Jämför med molekylmodellerna ovan.",
    "tex": "8 atomer · 2 atomslag. Jämför med molekylmodellerna ovan.",
    "html": "8 atomer · 2 atomslag. Jämför med molekylmodellerna ovan."
  },
  {
    "key": "ui-v5-extra/32",
    "plain": "9 atomer · 2 atomslag. Jämför med molekylmodellerna ovan.",
    "tex": "9 atomer · 2 atomslag. Jämför med molekylmodellerna ovan.",
    "html": "9 atomer · 2 atomslag. Jämför med molekylmodellerna ovan."
  },
  {
    "key": "ui-v5-extra/33",
    "plain": "Batteriinsamling hjälper oss att hantera batteriets ämnen och material. Då minskar risken att de sprids i naturen.",
    "tex": "Batteriinsamling hjälper oss att hantera batteriets ämnen och material. Då minskar risken att de sprids i naturen.",
    "html": "Batteriinsamling hjälper oss att hantera batteriets ämnen och material. Då minskar risken att de sprids i naturen."
  },
  {
    "key": "ui-v5-extra/34",
    "plain": "Båda leder elektricitet. Detta test räcker därför inte för att skilja dem åt. Jämför egenskaperna och förklara vilket test som skiljer proven åt.",
    "tex": "Båda leder elektricitet. Detta test räcker därför inte för att skilja dem åt. Jämför egenskaperna och förklara vilket test som skiljer proven åt.",
    "html": "Båda leder elektricitet. Detta test räcker därför inte för att skilja dem åt. Jämför egenskaperna och förklara vilket test som skiljer proven åt."
  },
  {
    "key": "ui-v5-extra/35",
    "plain": "Börja om",
    "tex": "Börja om",
    "html": "Börja om"
  },
  {
    "key": "ui-v5-extra/36",
    "plain": "CC BY-SA 2.0",
    "tex": "CC BY-SA 2.0",
    "html": "CC BY-SA 2.0"
  },
  {
    "key": "ui-v5-extra/37",
    "plain": "CC BY-SA 3.0",
    "tex": "CC BY-SA 3.0",
    "html": "CC BY-SA 3.0"
  },
  {
    "key": "ui-v5-extra/38",
    "plain": "CC BY-SA 4.0",
    "tex": "CC BY-SA 4.0",
    "html": "CC BY-SA 4.0"
  },
  {
    "key": "ui-v5-extra/39",
    "plain": "CC0",
    "tex": "CC0",
    "html": "CC0"
  },
  {
    "key": "ui-v5-extra/40",
    "plain": "Cleiton Andrade Andrade from Alfenas, Brasil",
    "tex": "Cleiton Andrade Andrade from Alfenas, Brasil",
    "html": "Cleiton Andrade Andrade from Alfenas, Brasil"
  },
  {
    "key": "ui-v5-extra/41",
    "plain": "Daltons kulmodell visar atomen som en hel kula. Modellen visar inga mindre delar inuti atomen.",
    "tex": "Daltons kulmodell visar atomen som en hel kula. Modellen visar inga mindre delar inuti atomen.",
    "html": "Daltons kulmodell visar atomen som en hel kula. Modellen visar inga mindre delar inuti atomen."
  },
  {
    "key": "ui-v5-extra/42",
    "plain": "De två elektronerna visas som ett gemensamt par mellan kärnorna. De positiva kärnorna finns kvar. Elektronerna hör till molekylen och kan beskrivas som ett gemensamt elektronpar.",
    "tex": "De två elektronerna visas som ett gemensamt par mellan kärnorna. De positiva kärnorna finns kvar. Elektronerna hör till molekylen och kan beskrivas som ett gemensamt elektronpar.",
    "html": "De två elektronerna visas som ett gemensamt par mellan kärnorna. De positiva kärnorna finns kvar. Elektronerna hör till molekylen och kan beskrivas som ett gemensamt elektronpar."
  },
  {
    "key": "ui-v5-extra/43",
    "plain": "Det stämmer. Avstånden mellan molekylerna ökar kraftigt i gas. Det är fortfarande vattenmolekyler, H₂O.",
    "tex": "Det stämmer. Avstånden mellan molekylerna ökar kraftigt i gas. Det är fortfarande vattenmolekyler, \\(\\mathrm{H_2O}\\).",
    "html": "Det stämmer. Avstånden mellan molekylerna ökar kraftigt i gas. Det är fortfarande vattenmolekyler, <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>."
  },
  {
    "key": "ui-v5-extra/44",
    "plain": "Det stämmer. Det är vår kunskap och beskrivning som utvecklas. Atomerna förändras inte för att vi får ny kunskap om dem.",
    "tex": "Det stämmer. Det är vår kunskap och beskrivning som utvecklas. Atomerna förändras inte för att vi får ny kunskap om dem.",
    "html": "Det stämmer. Det är vår kunskap och beskrivning som utvecklas. Atomerna förändras inte för att vi får ny kunskap om dem."
  },
  {
    "key": "ui-v5-extra/45",
    "plain": "Det stämmer. H₂O betyder två H-atomer och en O-atom. Det blir tre atomer, men bara två olika atomslag.",
    "tex": "Det stämmer. \\(\\mathrm{H_2O}\\) betyder två H-atomer och en O-atom. Det blir tre atomer, men bara två olika atomslag.",
    "html": "Det stämmer. <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math> betyder två H-atomer och en O-atom. Det blir tre atomer, men bara två olika atomslag."
  },
  {
    "key": "ui-v5-extra/46",
    "plain": "Det stämmer. Järn dras tydligt till en vanlig magnet, medan koppar inte gör det. Båda leder elektricitet, så just det testet skiljer inte dessa två åt. Smaka aldrig på okända prov.",
    "tex": "Det stämmer. Järn dras tydligt till en vanlig magnet, medan koppar inte gör det. Båda leder elektricitet, så just det testet skiljer inte dessa två åt. Smaka aldrig på okända prov.",
    "html": "Det stämmer. Järn dras tydligt till en vanlig magnet, medan koppar inte gör det. Båda leder elektricitet, så just det testet skiljer inte dessa två åt. Smaka aldrig på okända prov."
  },
  {
    "key": "ui-v5-extra/47",
    "plain": "Det stämmer. Vanliga kemiska reaktioner handlar om elektroner och bindningar. Förändringar av atomkärnor hör till kärnreaktioner.",
    "tex": "Det stämmer. Vanliga kemiska reaktioner handlar om elektroner och bindningar. Förändringar av atomkärnor hör till kärnreaktioner.",
    "html": "Det stämmer. Vanliga kemiska reaktioner handlar om elektroner och bindningar. Förändringar av atomkärnor hör till kärnreaktioner."
  },
  {
    "key": "ui-v5-extra/48",
    "plain": "Det stämmer. Vid kokning finns vattenmolekylerna kvar. Vatten övergår från vätska till gas; det bildas inte väte och syre.",
    "tex": "Det stämmer. Vid kokning finns vattenmolekylerna kvar. Vatten övergår från vätska till gas; det bildas inte väte och syre.",
    "html": "Det stämmer. Vid kokning finns vattenmolekylerna kvar. Vatten övergår från vätska till gas; det bildas inte väte och syre."
  },
  {
    "key": "ui-v5-extra/49",
    "plain": "Det stämmer. Ämnets egenskaper, mängden och exponeringen spelar roll. Naturligt betyder inte automatiskt ofarligt, och ämnen kan spridas utan att en människa rör vid dem.",
    "tex": "Det stämmer. Ämnets egenskaper, mängden och exponeringen spelar roll. Naturligt betyder inte automatiskt ofarligt, och ämnen kan spridas utan att en människa rör vid dem.",
    "html": "Det stämmer. Ämnets egenskaper, mängden och exponeringen spelar roll. Naturligt betyder inte automatiskt ofarligt, och ämnen kan spridas utan att en människa rör vid dem."
  },
  {
    "key": "ui-v5-extra/50",
    "plain": "Din webbläsare kan inte spela filmen. Läs förklaringen nedanför.",
    "tex": "Din webbläsare kan inte spela filmen. Läs förklaringen nedanför.",
    "html": "Din webbläsare kan inte spela filmen. Läs förklaringen nedanför."
  },
  {
    "key": "ui-v5-extra/51",
    "plain": "Dr. Baris Kececi",
    "tex": "Dr. Baris Kececi",
    "html": "Dr. Baris Kececi"
  },
  {
    "key": "ui-v5-extra/52",
    "plain": "Dras inte tydligt till magneten.",
    "tex": "Dras inte tydligt till magneten.",
    "html": "Dras inte tydligt till magneten."
  },
  {
    "key": "ui-v5-extra/53",
    "plain": "Dras tydligt till magneten.",
    "tex": "Dras tydligt till magneten.",
    "html": "Dras tydligt till magneten."
  },
  {
    "key": "ui-v5-extra/54",
    "plain": "ETT EXEMPEL ATT FÖLJA",
    "tex": "ETT EXEMPEL ATT FÖLJA",
    "html": "ETT EXEMPEL ATT FÖLJA"
  },
  {
    "key": "ui-v5-extra/55",
    "plain": "Elektrisk energi får gasen i en plasmaglob att lysa. De lysande trådarna visar var elektriska urladdningar går genom gasen.",
    "tex": "Elektrisk energi får gasen i en plasmaglob att lysa. De lysande trådarna visar var elektriska urladdningar går genom gasen.",
    "html": "Elektrisk energi får gasen i en plasmaglob att lysa. De lysande trådarna visar var elektriska urladdningar går genom gasen."
  },
  {
    "key": "ui-v5-extra/56",
    "plain": "Elev A:",
    "tex": "Elev A:",
    "html": "Elev A:"
  },
  {
    "key": "ui-v5-extra/57",
    "plain": "Elev B:",
    "tex": "Elev B:",
    "html": "Elev B:"
  },
  {
    "key": "ui-v5-extra/58",
    "plain": "En bäck rinner mellan stenar och växter i en skog.",
    "tex": "En bäck rinner mellan stenar och växter i en skog.",
    "html": "En bäck rinner mellan stenar och växter i en skog."
  },
  {
    "key": "ui-v5-extra/59",
    "plain": "En droppe rymmer ofattbart många vattenmolekyler. Fotot visar droppen; kulmodellen hjälper oss att föreställa oss molekylerna.",
    "tex": "En droppe rymmer ofattbart många vattenmolekyler. Fotot visar droppen; kulmodellen hjälper oss att föreställa oss molekylerna.",
    "html": "En droppe rymmer ofattbart många vattenmolekyler. Fotot visar droppen; kulmodellen hjälper oss att föreställa oss molekylerna."
  },
  {
    "key": "ui-v5-extra/60",
    "plain": "En vattendroppe studsar upp ur en vattenyta.",
    "tex": "En vattendroppe studsar upp ur en vattenyta.",
    "html": "En vattendroppe studsar upp ur en vattenyta."
  },
  {
    "key": "ui-v5-extra/61",
    "plain": "Flytande vatten",
    "tex": "Flytande vatten",
    "html": "Flytande vatten"
  },
  {
    "key": "ui-v5-extra/62",
    "plain": "Flytande vatten: molekylerna är tätare och kan röra sig förbi varandra. Antal: 6 H₂O-molekyler.",
    "tex": "Flytande vatten: molekylerna är tätare och kan röra sig förbi varandra. Antal: 6 \\(\\mathrm{H_2O}\\)-molekyler.",
    "html": "Flytande vatten: molekylerna är tätare och kan röra sig förbi varandra. Antal: 6 <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>-molekyler."
  },
  {
    "key": "ui-v5-extra/63",
    "plain": "FÖRKLARING",
    "tex": "FÖRKLARING",
    "html": "FÖRKLARING"
  },
  {
    "key": "ui-v5-extra/64",
    "plain": "Gemensamt elektronpar",
    "tex": "Gemensamt elektronpar",
    "html": "Gemensamt elektronpar"
  },
  {
    "key": "ui-v5-extra/65",
    "plain": "I ett kort test med vanligt vatten löses inget av metallproven märkbart upp. Testet skiljer dem inte åt. Jämför egenskaperna och förklara vilket test som skiljer proven åt.",
    "tex": "I ett kort test med vanligt vatten löses inget av metallproven märkbart upp. Testet skiljer dem inte åt. Jämför egenskaperna och förklara vilket test som skiljer proven åt.",
    "html": "I ett kort test med vanligt vatten löses inget av metallproven märkbart upp. Testet skiljer dem inte åt. Jämför egenskaperna och förklara vilket test som skiljer proven åt."
  },
  {
    "key": "ui-v5-extra/66",
    "plain": "Is och flytande vatten är samma kemiska ämne: H₂O. Isen flyter eftersom dess struktur gör den mindre tät än det flytande vattnet.",
    "tex": "Is och flytande vatten är samma kemiska ämne: \\(\\mathrm{H_2O}\\). Isen flyter eftersom dess struktur gör den mindre tät än det flytande vattnet.",
    "html": "Is och flytande vatten är samma kemiska ämne: <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>. Isen flyter eftersom dess struktur gör den mindre tät än det flytande vattnet."
  },
  {
    "key": "ui-v5-extra/67",
    "plain": "Is smälter",
    "tex": "Is smälter",
    "html": "Is smälter"
  },
  {
    "key": "ui-v5-extra/68",
    "plain": "Is: molekylerna vibrerar kring bestämda lägen i en öppen struktur. Antal: 6 H₂O-molekyler.",
    "tex": "Is: molekylerna vibrerar kring bestämda lägen i en öppen struktur. Antal: 6 \\(\\mathrm{H_2O}\\)-molekyler.",
    "html": "Is: molekylerna vibrerar kring bestämda lägen i en öppen struktur. Antal: 6 <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>-molekyler."
  },
  {
    "key": "ui-v5-extra/69",
    "plain": "Isbitar som flyter i vatten.",
    "tex": "Isbitar som flyter i vatten.",
    "html": "Isbitar som flyter i vatten."
  },
  {
    "key": "ui-v5-extra/70",
    "plain": "Järn rostar",
    "tex": "Järn rostar",
    "html": "Järn rostar"
  },
  {
    "key": "ui-v5-extra/71",
    "plain": "Järnet i kedjan har reagerat med sin omgivning. Rost innehåller andra ämnen än det ursprungliga järnet.",
    "tex": "Järnet i kedjan har reagerat med sin omgivning. Rost innehåller andra ämnen än det ursprungliga järnet.",
    "html": "Järnet i kedjan har reagerat med sin omgivning. Rost innehåller andra ämnen än det ursprungliga järnet."
  },
  {
    "key": "ui-v5-extra/72",
    "plain": "Kemi Direkt · Provpunkt 3",
    "tex": "Kemi Direkt · Provpunkt 3",
    "html": "Kemi Direkt · Provpunkt 3"
  },
  {
    "key": "ui-v5-extra/73",
    "plain": "Kemi Direkt · s. 24",
    "tex": "Kemi Direkt · s. 24",
    "html": "Kemi Direkt · s. 24"
  },
  {
    "key": "ui-v5-extra/74",
    "plain": "Kemi Direkt · s. 24–26",
    "tex": "Kemi Direkt · s. 24--26",
    "html": "Kemi Direkt · s. 24–26"
  },
  {
    "key": "ui-v5-extra/75",
    "plain": "Kemi Direkt · s. 28–29",
    "tex": "Kemi Direkt · s. 28--29",
    "html": "Kemi Direkt · s. 28–29"
  },
  {
    "key": "ui-v5-extra/76",
    "plain": "Kemi Direkt · s. 33–34",
    "tex": "Kemi Direkt · s. 33--34",
    "html": "Kemi Direkt · s. 33–34"
  },
  {
    "key": "ui-v5-extra/77",
    "plain": "Kemi Direkt · s. 35–39",
    "tex": "Kemi Direkt · s. 35--39",
    "html": "Kemi Direkt · s. 35–39"
  },
  {
    "key": "ui-v5-extra/78",
    "plain": "Kemi Direkt · s. 36–37",
    "tex": "Kemi Direkt · s. 36--37",
    "html": "Kemi Direkt · s. 36–37"
  },
  {
    "key": "ui-v5-extra/79",
    "plain": "Koppar används i ledningar eftersom det leder elektricitet bra. Ett materials egenskaper påverkar vad vi kan använda det till.",
    "tex": "Koppar används i ledningar eftersom det leder elektricitet bra. Ett materials egenskaper påverkar vad vi kan använda det till.",
    "html": "Koppar används i ledningar eftersom det leder elektricitet bra. Ett materials egenskaper påverkar vad vi kan använda det till."
  },
  {
    "key": "ui-v5-extra/80",
    "plain": "Kulmodell",
    "tex": "Kulmodell",
    "html": "Kulmodell"
  },
  {
    "key": "ui-v5-extra/81",
    "plain": "Kärnmodell",
    "tex": "Kärnmodell",
    "html": "Kärnmodell"
  },
  {
    "key": "ui-v5-extra/82",
    "plain": "Leda elektricitet",
    "tex": "Leda elektricitet",
    "html": "Leda elektricitet"
  },
  {
    "key": "ui-v5-extra/83",
    "plain": "Leder elektricitet.",
    "tex": "Leder elektricitet.",
    "html": "Leder elektricitet."
  },
  {
    "key": "ui-v5-extra/84",
    "plain": "Lila och blå ljustrådar inne i en plasmaglob.",
    "tex": "Lila och blå ljustrådar inne i en plasmaglob.",
    "html": "Lila och blå ljustrådar inne i en plasmaglob."
  },
  {
    "key": "ui-v5-extra/85",
    "plain": "Lämnas till insamling",
    "tex": "Lämnas till insamling",
    "html": "Lämnas till insamling"
  },
  {
    "key": "ui-v5-extra/86",
    "plain": "Lämnas vid bäcken",
    "tex": "Lämnas vid bäcken",
    "html": "Lämnas vid bäcken"
  },
  {
    "key": "ui-v5-extra/87",
    "plain": "Lösa sig i vatten",
    "tex": "Lösa sig i vatten",
    "html": "Lösa sig i vatten"
  },
  {
    "key": "ui-v5-extra/88",
    "plain": "Löser sig inte märkbart.",
    "tex": "Löser sig inte märkbart.",
    "html": "Löser sig inte märkbart."
  },
  {
    "key": "ui-v5-extra/89",
    "plain": "Magneten skiljer dessa två prov åt. Jämför egenskaperna och förklara vilket test som skiljer proven åt.",
    "tex": "Magneten skiljer dessa två prov åt. Jämför egenskaperna och förklara vilket test som skiljer proven åt.",
    "html": "Magneten skiljer dessa två prov åt. Jämför egenskaperna och förklara vilket test som skiljer proven åt."
  },
  {
    "key": "ui-v5-extra/90",
    "plain": "Musik av",
    "tex": "Musik av",
    "html": "Musik av"
  },
  {
    "key": "ui-v5-extra/91",
    "plain": "Närbild av många tunna koppartrådar i en ledning.",
    "tex": "Närbild av många tunna koppartrådar i en ledning.",
    "html": "Närbild av många tunna koppartrådar i en ledning."
  },
  {
    "key": "ui-v5-extra/92",
    "plain": "Närbild av rostbruna kedjelänkar med regndroppar.",
    "tex": "Närbild av rostbruna kedjelänkar med regndroppar.",
    "html": "Närbild av rostbruna kedjelänkar med regndroppar."
  },
  {
    "key": "ui-v5-extra/93",
    "plain": "Nästa område →",
    "tex": "Nästa område \\(\\rightarrow\\)",
    "html": "Nästa område <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mo>→</mo><annotation encoding=\"application/x-tex\">\\rightarrow</annotation></semantics></math>"
  },
  {
    "key": "ui-v5-extra/94",
    "plain": "OMRÅDE 1 · RITNING",
    "tex": "OMRÅDE 1 · RITNING",
    "html": "OMRÅDE 1 · RITNING"
  },
  {
    "key": "ui-v5-extra/95",
    "plain": "OMRÅDE 2 · RITNING",
    "tex": "OMRÅDE 2 · RITNING",
    "html": "OMRÅDE 2 · RITNING"
  },
  {
    "key": "ui-v5-extra/96",
    "plain": "OMRÅDE 3 · RITNING",
    "tex": "OMRÅDE 3 · RITNING",
    "html": "OMRÅDE 3 · RITNING"
  },
  {
    "key": "ui-v5-extra/97",
    "plain": "OMRÅDE 4 · RITNING",
    "tex": "OMRÅDE 4 · RITNING",
    "html": "OMRÅDE 4 · RITNING"
  },
  {
    "key": "ui-v5-extra/98",
    "plain": "OMRÅDE 5 · RITNING",
    "tex": "OMRÅDE 5 · RITNING",
    "html": "OMRÅDE 5 · RITNING"
  },
  {
    "key": "ui-v5-extra/99",
    "plain": "OMRÅDE 6 · RITNING",
    "tex": "OMRÅDE 6 · RITNING",
    "html": "OMRÅDE 6 · RITNING"
  },
  {
    "key": "ui-v5-extra/100",
    "plain": "OMRÅDE 7 · RITNING",
    "tex": "OMRÅDE 7 · RITNING",
    "html": "OMRÅDE 7 · RITNING"
  },
  {
    "key": "ui-v5-extra/101",
    "plain": "Om batteriet skadas och läcker kan ämnen spridas med vatten. Vilken skada som kan uppstå beror på ämnen, mängd och exponering.",
    "tex": "Om batteriet skadas och läcker kan ämnen spridas med vatten. Vilken skada som kan uppstå beror på ämnen, mängd och exponering.",
    "html": "Om batteriet skadas och läcker kan ämnen spridas med vatten. Vilken skada som kan uppstå beror på ämnen, mängd och exponering."
  },
  {
    "key": "ui-v5-extra/102",
    "plain": "Område",
    "tex": "Område",
    "html": "Område"
  },
  {
    "key": "ui-v5-extra/103",
    "plain": "Område 1 av 7",
    "tex": "Område 1 av 7",
    "html": "Område 1 av 7"
  },
  {
    "key": "ui-v5-extra/104",
    "plain": "Område 2 av 7",
    "tex": "Område 2 av 7",
    "html": "Område 2 av 7"
  },
  {
    "key": "ui-v5-extra/105",
    "plain": "Område 3 av 7",
    "tex": "Område 3 av 7",
    "html": "Område 3 av 7"
  },
  {
    "key": "ui-v5-extra/106",
    "plain": "Område 4 av 7",
    "tex": "Område 4 av 7",
    "html": "Område 4 av 7"
  },
  {
    "key": "ui-v5-extra/107",
    "plain": "Område 5 av 7",
    "tex": "Område 5 av 7",
    "html": "Område 5 av 7"
  },
  {
    "key": "ui-v5-extra/108",
    "plain": "Område 6 av 7",
    "tex": "Område 6 av 7",
    "html": "Område 6 av 7"
  },
  {
    "key": "ui-v5-extra/109",
    "plain": "Område 7 av 7",
    "tex": "Område 7 av 7",
    "html": "Område 7 av 7"
  },
  {
    "key": "ui-v5-extra/110",
    "plain": "PROVA RESONEMANGET",
    "tex": "PROVA RESONEMANGET",
    "html": "PROVA RESONEMANGET"
  },
  {
    "key": "ui-v5-extra/111",
    "plain": "Pausa filmen",
    "tex": "Pausa filmen",
    "html": "Pausa filmen"
  },
  {
    "key": "ui-v5-extra/112",
    "plain": "Pausa rörelsen",
    "tex": "Pausa rörelsen",
    "html": "Pausa rörelsen"
  },
  {
    "key": "ui-v5-extra/113",
    "plain": "Raghav Jerath",
    "tex": "Raghav Jerath",
    "html": "Raghav Jerath"
  },
  {
    "key": "ui-v5-extra/114",
    "plain": "RobertKuhlmann",
    "tex": "RobertKuhlmann",
    "html": "RobertKuhlmann"
  },
  {
    "key": "ui-v5-extra/115",
    "plain": "Russinkaka",
    "tex": "Russinkaka",
    "html": "Russinkaka"
  },
  {
    "key": "ui-v5-extra/116",
    "plain": "Rutherfords kärnmodell: den positiva laddningen är samlad i en mycket liten kärna. Det mesta av atomens volym är utrymme runt kärnan.",
    "tex": "Rutherfords kärnmodell: den positiva laddningen är samlad i en mycket liten kärna. Det mesta av atomens volym är utrymme runt kärnan.",
    "html": "Rutherfords kärnmodell: den positiva laddningen är samlad i en mycket liten kärna. Det mesta av atomens volym är utrymme runt kärnan."
  },
  {
    "key": "ui-v5-extra/117",
    "plain": "Rutherfords laboratorium i Cambridge, fotograferat 1926. Försöksutrustningen visar den praktiska sidan av forskarnas undersökningar av materia.",
    "tex": "Rutherfords laboratorium i Cambridge, fotograferat 1926. Försöksutrustningen visar den praktiska sidan av forskarnas undersökningar av materia.",
    "html": "Rutherfords laboratorium i Cambridge, fotograferat 1926. Försöksutrustningen visar den praktiska sidan av forskarnas undersökningar av materia."
  },
  {
    "key": "ui-v5-extra/118",
    "plain": "Science Museum London / Science and Society Picture Library",
    "tex": "Science Museum London / Science and Society Picture Library",
    "html": "Science Museum London / Science and Society Picture Library"
  },
  {
    "key": "ui-v5-extra/119",
    "plain": "Se era svar →",
    "tex": "Se era svar \\(\\rightarrow\\)",
    "html": "Se era svar <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mo>→</mo><annotation encoding=\"application/x-tex\">\\rightarrow</annotation></semantics></math>"
  },
  {
    "key": "ui-v5-extra/120",
    "plain": "Skalmodell",
    "tex": "Skalmodell",
    "html": "Skalmodell"
  },
  {
    "key": "ui-v5-extra/121",
    "plain": "Storleken har anpassats och filen har konverterats till JPEG.",
    "tex": "Storleken har anpassats och filen har konverterats till JPEG.",
    "html": "Storleken har anpassats och filen har konverterats till JPEG."
  },
  {
    "key": "ui-v5-extra/122",
    "plain": "Svartvitt fotografi från Ernest Rutherfords laboratorium i Cambridge år 1926.",
    "tex": "Svartvitt fotografi från Ernest Rutherfords laboratorium i Cambridge år 1926.",
    "html": "Svartvitt fotografi från Ernest Rutherfords laboratorium i Cambridge år 1926."
  },
  {
    "key": "ui-v5-extra/123",
    "plain": "Thomsons russinkaka: negativa elektroner motsvarar russinen. Positiv laddning är utspridd som smet. Här finns ingen liten kärna i mitten.",
    "tex": "Thomsons russinkaka: negativa elektroner motsvarar russinen. Positiv laddning är utspridd som smet. Här finns ingen liten kärna i mitten.",
    "html": "Thomsons russinkaka: negativa elektroner motsvarar russinen. Positiv laddning är utspridd som smet. Här finns ingen liten kärna i mitten."
  },
  {
    "key": "ui-v5-extra/124",
    "plain": "Titta en gång till. Avstånden mellan molekylerna ökar kraftigt i gas. Det är fortfarande vattenmolekyler, H₂O.",
    "tex": "Titta en gång till. Avstånden mellan molekylerna ökar kraftigt i gas. Det är fortfarande vattenmolekyler, \\(\\mathrm{H_2O}\\).",
    "html": "Titta en gång till. Avstånden mellan molekylerna ökar kraftigt i gas. Det är fortfarande vattenmolekyler, <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>."
  },
  {
    "key": "ui-v5-extra/125",
    "plain": "Titta en gång till. Det är vår kunskap och beskrivning som utvecklas. Atomerna förändras inte för att vi får ny kunskap om dem.",
    "tex": "Titta en gång till. Det är vår kunskap och beskrivning som utvecklas. Atomerna förändras inte för att vi får ny kunskap om dem.",
    "html": "Titta en gång till. Det är vår kunskap och beskrivning som utvecklas. Atomerna förändras inte för att vi får ny kunskap om dem."
  },
  {
    "key": "ui-v5-extra/126",
    "plain": "Titta en gång till. H₂O betyder två H-atomer och en O-atom. Det blir tre atomer, men bara två olika atomslag.",
    "tex": "Titta en gång till. \\(\\mathrm{H_2O}\\) betyder två H-atomer och en O-atom. Det blir tre atomer, men bara två olika atomslag.",
    "html": "Titta en gång till. <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math> betyder två H-atomer och en O-atom. Det blir tre atomer, men bara två olika atomslag."
  },
  {
    "key": "ui-v5-extra/127",
    "plain": "Titta en gång till. Järn dras tydligt till en vanlig magnet, medan koppar inte gör det. Båda leder elektricitet, så just det testet skiljer inte dessa två åt. Smaka aldrig på okända prov.",
    "tex": "Titta en gång till. Järn dras tydligt till en vanlig magnet, medan koppar inte gör det. Båda leder elektricitet, så just det testet skiljer inte dessa två åt. Smaka aldrig på okända prov.",
    "html": "Titta en gång till. Järn dras tydligt till en vanlig magnet, medan koppar inte gör det. Båda leder elektricitet, så just det testet skiljer inte dessa två åt. Smaka aldrig på okända prov."
  },
  {
    "key": "ui-v5-extra/128",
    "plain": "Titta en gång till. Vanliga kemiska reaktioner handlar om elektroner och bindningar. Förändringar av atomkärnor hör till kärnreaktioner.",
    "tex": "Titta en gång till. Vanliga kemiska reaktioner handlar om elektroner och bindningar. Förändringar av atomkärnor hör till kärnreaktioner.",
    "html": "Titta en gång till. Vanliga kemiska reaktioner handlar om elektroner och bindningar. Förändringar av atomkärnor hör till kärnreaktioner."
  },
  {
    "key": "ui-v5-extra/129",
    "plain": "Titta en gång till. Vid kokning finns vattenmolekylerna kvar. Vatten övergår från vätska till gas; det bildas inte väte och syre.",
    "tex": "Titta en gång till. Vid kokning finns vattenmolekylerna kvar. Vatten övergår från vätska till gas; det bildas inte väte och syre.",
    "html": "Titta en gång till. Vid kokning finns vattenmolekylerna kvar. Vatten övergår från vätska till gas; det bildas inte väte och syre."
  },
  {
    "key": "ui-v5-extra/130",
    "plain": "Titta en gång till. Ämnets egenskaper, mängden och exponeringen spelar roll. Naturligt betyder inte automatiskt ofarligt, och ämnen kan spridas utan att en människa rör vid dem.",
    "tex": "Titta en gång till. Ämnets egenskaper, mängden och exponeringen spelar roll. Naturligt betyder inte automatiskt ofarligt, och ämnen kan spridas utan att en människa rör vid dem.",
    "html": "Titta en gång till. Ämnets egenskaper, mängden och exponeringen spelar roll. Naturligt betyder inte automatiskt ofarligt, och ämnen kan spridas utan att en människa rör vid dem."
  },
  {
    "key": "ui-v5-extra/131",
    "plain": "Två väteatomer",
    "tex": "Två väteatomer",
    "html": "Två väteatomer"
  },
  {
    "key": "ui-v5-extra/132",
    "plain": "Vanlig magnet",
    "tex": "Vanlig magnet",
    "html": "Vanlig magnet"
  },
  {
    "key": "ui-v5-extra/133",
    "plain": "Varje väteatom har en kärna och en elektron. Aktivera det gemensamma elektronparet och jämför.",
    "tex": "Varje väteatom har en kärna och en elektron. Aktivera det gemensamma elektronparet och jämför.",
    "html": "Varje väteatom har en kärna och en elektron. Aktivera det gemensamma elektronparet och jämför."
  },
  {
    "key": "ui-v5-extra/134",
    "plain": "Vatten kokar",
    "tex": "Vatten kokar",
    "html": "Vatten kokar"
  },
  {
    "key": "ui-v5-extra/135",
    "plain": "Vatten som rinner genom marken kan föra med sig lösta ämnen till bäckar och sjöar. Där kan växter och djur komma i kontakt med ämnena.",
    "tex": "Vatten som rinner genom marken kan föra med sig lösta ämnen till bäckar och sjöar. Där kan växter och djur komma i kontakt med ämnena.",
    "html": "Vatten som rinner genom marken kan föra med sig lösta ämnen till bäckar och sjöar. Där kan växter och djur komma i kontakt med ämnena."
  },
  {
    "key": "ui-v5-extra/136",
    "plain": "Vattenånga",
    "tex": "Vattenånga",
    "html": "Vattenånga"
  },
  {
    "key": "ui-v5-extra/137",
    "plain": "Vattenånga: molekylerna är långt ifrån varandra och rör sig fritt mellan kollisioner. Antal: 6 H₂O-molekyler.",
    "tex": "Vattenånga: molekylerna är långt ifrån varandra och rör sig fritt mellan kollisioner. Antal: 6 \\(\\mathrm{H_2O}\\)-molekyler.",
    "html": "Vattenånga: molekylerna är långt ifrån varandra och rör sig fritt mellan kollisioner. Antal: 6 <math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mrow><msub><mi mathvariant=\"normal\">H</mi><mn mathvariant=\"normal\">2</mn></msub><mi mathvariant=\"normal\">O</mi></mrow><annotation encoding=\"application/x-tex\">\\mathrm{H_2O}</annotation></semantics></math>-molekyler."
  },
  {
    "key": "ui-v5-extra/138",
    "plain": "Ved brinner",
    "tex": "Ved brinner",
    "html": "Ved brinner"
  },
  {
    "key": "ui-v5-extra/139",
    "plain": "Vi behöver öva mer",
    "tex": "Vi behöver öva mer",
    "html": "Vi behöver öva mer"
  },
  {
    "key": "ui-v5-extra/140",
    "plain": "Vi kan förklara med stöd",
    "tex": "Vi kan förklara med stöd",
    "html": "Vi kan förklara med stöd"
  },
  {
    "key": "ui-v5-extra/141",
    "plain": "Vi kan förklara själva",
    "tex": "Vi kan förklara själva",
    "html": "Vi kan förklara själva"
  },
  {
    "key": "ui-v5-extra/142",
    "plain": "W.carter",
    "tex": "W.carter",
    "html": "W.carter"
  },
  {
    "key": "ui-v5-extra/143",
    "plain": "aria-hidden=",
    "tex": "aria-hidden=",
    "html": "aria-hidden="
  },
  {
    "key": "ui-v5-extra/144",
    "plain": "behöver övas",
    "tex": "behöver övas",
    "html": "behöver övas"
  },
  {
    "key": "ui-v5-extra/145",
    "plain": "cx=",
    "tex": "cx=",
    "html": "cx="
  },
  {
    "key": "ui-v5-extra/146",
    "plain": "rätt",
    "tex": "rätt",
    "html": "rätt"
  },
  {
    "key": "ui-v5-extra/147",
    "plain": "sandro bisotti",
    "tex": "sandro bisotti",
    "html": "sandro bisotti"
  },
  {
    "key": "ui-v5-extra/148",
    "plain": "− H",
    "tex": "\\(-\\) H",
    "html": "<math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mi>−</mi><annotation encoding=\"application/x-tex\">-</annotation></semantics></math> H"
  },
  {
    "key": "ui-v5-extra/149",
    "plain": "− O",
    "tex": "\\(-\\) O",
    "html": "<math display=\"inline\" xmlns=\"http://www.w3.org/1998/Math/MathML\"><semantics><mi>−</mi><annotation encoding=\"application/x-tex\">-</annotation></semantics></math> O"
  },
  {
    "key": "ui-v5-audit/0",
    "plain": "Era svar sparas på den här datorn.",
    "tex": "Era svar sparas på den här datorn.",
    "html": "Era svar sparas på den här datorn."
  },
  {
    "key": "ui-v5-film-meta/126",
    "plain": "2:06 · svensk text · med musik",
    "tex": "2:06 · svensk text · med musik",
    "html": "2:06 · svensk text · med musik"
  },
  {
    "key": "ui-v5-film-meta/129",
    "plain": "2:09 · svensk text · med musik",
    "tex": "2:09 · svensk text · med musik",
    "html": "2:09 · svensk text · med musik"
  },
  {
    "key": "ui-v5-film-meta/130",
    "plain": "2:10 · svensk text · med musik",
    "tex": "2:10 · svensk text · med musik",
    "html": "2:10 · svensk text · med musik"
  },
  {
    "key": "ui-v5-film-meta/133",
    "plain": "2:13 · svensk text · med musik",
    "tex": "2:13 · svensk text · med musik",
    "html": "2:13 · svensk text · med musik"
  },
  {
    "key": "ui-v5-film-meta/140",
    "plain": "2:20 · svensk text · med musik",
    "tex": "2:20 · svensk text · med musik",
    "html": "2:20 · svensk text · med musik"
  },
  {
    "key": "ui-v5-single-atom",
    "plain": "1 atom · 1 atomslag. Jämför med molekylmodellerna ovan.",
    "tex": "1 atom · 1 atomslag. Jämför med molekylmodellerna ovan.",
    "html": "1 atom · 1 atomslag. Jämför med molekylmodellerna ovan."
  }
];


const texLookup = new Map(latexText.map(entry => [entry.plain.trim(), entry]));
const normalizedLookup = new Map(latexText.map(entry => [entry.plain.replace(/\s+/g, ' ').trim(), entry]));
const skipTags = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'OPTION', 'SVG', 'MATH', 'NOSCRIPT']);

/** Replace authored prose with semantic HTML produced from the LaTeX sources.
 * Student input is never changed. Formulas remain accessible native MathML.
 */
function renderTexText(root = document.body) {
 if (!root || !root.isConnected) return;
 const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
  acceptNode(node) {
   const parent = node.parentElement;
   if (!parent || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
   if (parent.closest('[data-tex-rendered], .answer-text, #report-text, [contenteditable="true"]')) return NodeFilter.FILTER_REJECT;
   let ancestor = parent;
   while (ancestor && ancestor !== root.parentElement) {
    if (skipTags.has(ancestor.tagName.toUpperCase())) return NodeFilter.FILTER_REJECT;
    ancestor = ancestor.parentElement;
   }
   return NodeFilter.FILTER_ACCEPT;
  }
 });
 const targets = [];
 while (walker.nextNode()) targets.push(walker.currentNode);
 let count = 0;
 for (const node of targets) {
  const raw = node.nodeValue, trimmed = raw.trim();
  const entry = texLookup.get(trimmed) || normalizedLookup.get(trimmed.replace(/\s+/g, ' '));
  if (!entry?.html) continue;
  const span = document.createElement('tex-prose');
  span.className = 'latex-prose'; span.dataset.texRendered = entry.key;
  // Content is generated locally from our authored .tex files, never from an answer.
  span.innerHTML = entry.html.trim().replace(/^<p>([\s\S]*)<\/p>$/, '$1');
  const fragment = document.createDocumentFragment();
  const leading = raw.match(/^\s*/)[0], trailing = raw.match(/\s*$/)[0];
  if (leading) fragment.append(document.createTextNode(leading));
  fragment.append(span);
  if (trailing) fragment.append(document.createTextNode(trailing));
  node.replaceWith(fragment); count++;
 }
 root.dataset.texCount = String(count);
}

window.renderTexText = renderTexText;



const esc = (value = '') => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const exampleMarkup = (example, label='ETT EXEMPEL ATT FÖLJA') => `<section class="worked-example"><p class="margin-label">${label}</p><h3>${esc(example.title)}</h3><ol>${example.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol></section>`;

function chapterHero(m) {
 const photo=photos.find(p=>p.module===m.id);
 return `<div class="chapter-breadcrumb"><a href="#omrade-1">Kemins grunder (i)</a><span aria-hidden="true">/</span><span>Område ${m.id} av 7</span></div><section class="chapter-hero student-header" data-chapter="${m.id}"><div class="chapter-heading"><h1>${esc(m.title)}</h1><p class="chapter-focus"><strong>Det här tränar ni:</strong> ${esc(m.goal)}</p><span class="page-reference">Kemi Direkt · ${esc(m.pages)}</span></div>${photo ? `<details class="chapter-source"><summary>Bildkälla</summary><figure class="chapter-photo"><img src="${photo.file}" alt="${esc(photo.alt)}" loading="lazy"><figcaption><p>${esc(photo.caption)}</p><p><a href="${esc(photo.sourceUrl)}" target="_blank" rel="noopener">${esc(photo.credit)}</a> · <a href="${esc(photo.licenseUrl)}" target="_blank" rel="noopener">${esc(photo.license)}</a></p>${photo.changes?`<p>${esc(photo.changes)}</p>`:''}</figcaption></figure></details>`:''}</section>`;
}

function filmChapters(info) {
 if(!info.chapters?.length)return '';
 const clock=value=>`${Math.floor(value/60)}:${String(Math.floor(value%60)).padStart(2,'0')}`;
 return `<details class="film-chapters"><summary>Filmens avsnitt och förklaringar</summary><ol>${info.chapters.map((part,index)=>`<li><button type="button" data-film-seek="${Number(part.start)}" aria-label="Spela avsnitt ${index+1}: ${esc(part.title)}"><span class="chapter-time">${clock(part.start)}</span><span>${esc(part.title)}</span><span aria-hidden="true">▶</span></button>${part.text?`<p>${esc(part.text)}</p>`:''}</li>`).join('')}</ol></details>`;
}

function filmSection(m) {
 const f=lessons[m.id].film, info=films[m.id]||{};
 const seconds=Math.round(info.duration||0), duration=seconds?`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`:'Film';
 return `<section class="film-section" aria-labelledby="film-title"><div class="film-heading"><div><p class="eyebrow">TITTA TILLSAMMANS · PAUSA NÄR NI VILL</p><h2 id="film-title">${esc(f.title)}</h2></div><span class="film-meta">${duration} · ${info.narration?'svensk berättarröst och text':'svensk text'} · musik</span></div><div class="film-layout"><div class="film-controlbar"><div class="film-buttons"><button class="film-control primary-control" id="pause-film">Spela filmen</button><button class="film-control" id="replay-film">Från början ↻</button></div><button class="film-control sound-control" id="sound-toggle" aria-pressed="true" aria-label="Stäng av ljudet">Ljud på</button></div><div class="film-screen"><video id="lesson-film" controls playsinline preload="none" poster="${f.poster}" aria-label="${esc(f.title)}, animerad förklaring med svensk text och musik"><source src="${f.src}" type="video/mp4">${info.captions?`<track kind="captions" src="${info.captions}" srclang="sv" label="Svenska">`:''}Din webbläsare kan inte spela filmen. Läs förklaringen nedanför.</video><div id="video-error" class="video-error" hidden>Filmen kunde inte laddas. Ni kan fortfarande undersöka ritningen och läsa förklaringen på sidan.</div></div><aside class="film-aside"><div class="before-film"><p class="margin-label">TITTA EFTER</p><p>${esc(f.before)}</p></div><div class="after-film"><p class="margin-label">PAUSA OCH PRATA</p><p>${esc(f.after)}</p></div></aside></div><details class="film-transcript"><summary>Läs en kort sammanfattning</summary><p>${esc(lessons[m.id].summary)}</p><ol>${lessons[m.id].workedExample.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol></details>${filmChapters(info)}</section>`;
}

function readingSection(m) {
 const l=lessons[m.id];
 const labStart=LABS[m.id]?'<div id="widget" class="interactive"></div>':'';
 const widget='';
 const article=`<div class="explanation chapter-explanation">${m.explanation.map(p=>`<p>${esc(p)}</p>`).join('')}</div>`;
 const illustration=`<figure class="tikz-figure${m.id===7?' environment-scenario-figure':''}"><div class="diagram-heading"><span class="margin-label">${m.id===7?"FÖLJ SCENARIERNA":"FÖLJ SAMBANDEN"}</span><button class="text-button" id="diagram-zoom">Öppna stor ${m.id===7?"bild":"ritning"} ↗</button></div><img class="diagram" src="${m.figure}" alt="${esc(m.figureAlt)}"><figcaption>${m.id===7?"Illustrationen visar exempel på spridning och förebyggande åtgärder. Följ pilarna och koppla varje handling till dess följd.":"Följ ritningens pilar, färger och förklaringar. Berätta för varandra vad som händer."}</figcaption></figure>`;
 const readingBody=m.id===7?illustration+renderStudyGalleries(m.id,{scenariosOnly:true})+article+renderStudyGalleries(m.id,{includeScenarios:false}):article+illustration+renderStudyGalleries(m.id);
 return `${labStart}<div class="reading-heading"><span class="margin-label">FRÅN BILD TILL FÖRKLARING</span><span class="reading-note">Läs tillsammans. Stanna vid det ni undrar över.</span></div>${readingBody}${widget}
 <details class="deep-reading"><summary><span>Gå ett steg djupare</span><small>Fler förklaringar, exempel och viktiga begrepp</small></summary><div class="deep-intro">${l.intro.map(p=>`<p>${esc(p)}</p>`).join('')}</div><div class="reading-sequence">${l.sections.map((section,i)=>`<section class="reading-section"><span class="section-number">${String(i+1).padStart(2,'0')}</span><div><h3>${esc(section.heading)}</h3><p>${esc(section.body)}</p><p class="think-question">${esc(section.question)}</p></div></section>`).join('')}</div>${exampleMarkup(l.workedExample)}${(l.extraExamples||[]).map(example=>exampleMarkup(example,'PROVA RESONEMANGET')).join('')}<section class="concept-section"><p class="margin-label">ORD ATT ANVÄNDA I ER FÖRKLARING</p><dl class="concept-list">${l.conceptMap.map(c=>`<div><dt>${esc(c.term)}</dt><dd>${esc(c.meaning)}</dd></div>`).join('')}</dl></section>${l.reflectionPrompts?.length?`<section class="reflection-section"><h3>Prata vidare</h3><ol>${l.reflectionPrompts.map(p=>`<li>${esc(p)}</li>`).join('')}</ol></section>`:''}</details>
 <aside class="misconception"><p class="margin-label">TÄNK ETT VARV TILL</p><h3>En vanlig missuppfattning</h3><p class="misconception-claim">${esc(l.misconception.claim)}</p><p>${esc(l.misconception.correction)}</p></aside><div class="takeaway-wrap"><span class="margin-label">TA MED ER DET HÄR</span><p class="chapter-takeaway">${esc(l.summary)}</p></div>`;
}

function connectChapter(m) {
 const player=document.querySelector('#lesson-film');
 connectStudyGalleries(player);
 if(player){
  const errorNode=document.querySelector('#video-error');
  const showError=()=>{if(errorNode?.isConnected)errorNode.hidden=false;};
  player.addEventListener('error',showError);player.querySelector('source').addEventListener('error',showError);
  const pauseButton=document.querySelector('#pause-film'), soundButton=document.querySelector('#sound-toggle');
  const updatePlayback=()=>{pauseButton.textContent=player.paused?'Spela filmen':'Pausa filmen';window.renderTexText?.(pauseButton);};
  const updateSound=()=>{const audible=!player.muted&&player.volume>0;soundButton.textContent=audible?'Ljud på':'Ljud av';soundButton.setAttribute('aria-pressed',String(audible));soundButton.setAttribute('aria-label',audible?'Stäng av ljudet':'Sätt på ljudet');window.renderTexText?.(soundButton);};
  player.volume=.6;
  player.addEventListener('play',updatePlayback);player.addEventListener('pause',updatePlayback);player.addEventListener('ended',updatePlayback);player.addEventListener('volumechange',updateSound);
  const startPlayback=()=>{const bounds=player.getBoundingClientRect();if(bounds.top<80||bounds.bottom>window.innerHeight-20){const reducedMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;player.scrollIntoView({block:'center',behavior:reducedMotion?'auto':'smooth'});}player.play().catch(()=>player.focus());};
  pauseButton.onclick=()=>{if(player.paused)startPlayback();else player.pause();};
  document.querySelector('#replay-film').onclick=()=>{player.currentTime=0;startPlayback();};
  document.querySelectorAll('[data-film-seek]').forEach(button=>button.onclick=()=>{const time=Number(button.dataset.filmSeek);if(player.readyState>=1)player.currentTime=time;else player.addEventListener('loadedmetadata',()=>{player.currentTime=time;},{once:true});startPlayback();});
  soundButton.onclick=()=>{const audible=!player.muted&&player.volume>0;if(audible)player.muted=true;else{if(player.volume===0)player.volume=.6;player.muted=false;}updateSound();};
  updateSound();
 }
 document.querySelector('#diagram-zoom').onclick=()=>{
  player?.pause();
  const dialog=document.createElement('dialog');dialog.className='diagram-dialog';dialog.setAttribute('aria-label','Förstorad bild: '+m.title);
  dialog.innerHTML=`<div class="diagram-dialog-heading"><div><p class="margin-label">OMRÅDE ${m.id} · RITNING</p><h2>${esc(m.title)}</h2></div><button class="button small secondary" aria-label="Stäng bilden">Stäng ×</button></div><img src="${m.figure}" alt="${esc(m.figureAlt)}"><p>Följ sambanden och förklara bilden tillsammans.</p>`;
  document.body.append(dialog);const cleanup=()=>{dialog.close();dialog.remove();};dialog.querySelector('button').onclick=cleanup;dialog.addEventListener('cancel',()=>dialog.remove());dialog.showModal();window.renderTexText?.(dialog);
 };
}




const KEY = 'kemilabbet-ak7-2026-v1';
const main = document.querySelector('#main');
const escape = (value = '') => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const fresh = () => ({schema:'kemilabbet-v1',pairCode:'',updatedAt:'',modules:{},exitA:'',exitB:''});
let data = fresh(), storageOK = true, animation = 0, toastTimer;
try { const raw = localStorage.getItem(KEY); if(raw) data = validate(JSON.parse(raw)); } catch { storageOK = false; }
function validate(raw) {
 if (!raw || raw.schema !== 'kemilabbet-v1' || typeof raw.modules !== 'object' || !raw.modules || Array.isArray(raw.modules)) throw new Error('Det här är inte en svarsfil från Kemins grunder (i).');
 const d = fresh(); d.pairCode = String(raw.pairCode || '').slice(0,40); d.updatedAt = String(raw.updatedAt || '').slice(0,60);
 for(const m of modules) { const a = raw.modules[m.id]; if(!a || typeof a !== 'object') continue;
  d.modules[m.id] = {first:String(a.first||'').slice(0,10000),answer:String(a.answer||'').slice(0,20000),revealed:!!a.revealed,exampleSeen:!!a.exampleSeen,rating:['själv','med stöd','öva'].includes(a.rating)?a.rating:'',done:!!a.done,choice:Number.isInteger(a.choice)&&a.choice>=0&&a.choice<m.check.options.length?a.choice:null,checked:!!a.checked,widget:a.widget && typeof a.widget==='object'&&!Array.isArray(a.widget)?a.widget:{}};
 }
 d.exitA = String(raw.exitA||'').slice(0,10000); d.exitB = String(raw.exitB||'').slice(0,10000); return d;
}
function state(id) { return data.modules[id] ||= {first:'',answer:'',revealed:false,exampleSeen:false,rating:'',done:false,choice:null,checked:false,widget:{}}; }
function save() { data.updatedAt = new Date().toISOString(); try {localStorage.setItem(KEY,JSON.stringify(data));storageOK=true;}catch{storageOK=false;} updateProgress(); }
function applyTextRendering(root=main) { if(typeof window.renderTexText==='function') window.renderTexText(root); }
function notify(message) { const el=document.querySelector('#toast');el.textContent=message;el.hidden=false;applyTextRendering(el);clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,4500); }
function updateProgress() {
 const count=modules.filter(m=>state(m.id).done).length;
 document.querySelector('#progress').value=count;document.querySelector('#progress-label').textContent=`${count} av 7 områden klara`;
 document.querySelector('#save-state').textContent=storageOK?'Era svar sparas på den här datorn.':'Kan inte spara i webbläsaren. Ladda ned era svar innan ni stänger.';
 document.querySelectorAll('.step-link').forEach(a=>{const done=state(Number(a.dataset.step)).done;a.classList.toggle('done',done);a.querySelector('.step-num').textContent=done?'✓':String(a.dataset.step).padStart(2,'0');});
 applyTextRendering(document.querySelector('.sidebar'));
}
document.querySelector('#module-nav').innerHTML=modules.map(m=>`<a class="step-link" data-step="${m.id}" href="#omrade-${m.id}" title="${escape(m.title)}" aria-label="Område ${m.id}: ${escape(m.title)}"><span class="step-num">${String(m.id).padStart(2,'0')}</span><span class="nav-label">${escape(m.shortTitle)}</span></a>`).join('');
function moduleView(m) {
 activeLab?.destroy(); activeLab=null;
 const s=state(m.id),role=m.id%2?'A':'B';
 main.innerHTML=`<div class="lesson-page">${chapterHero(m)}${LABS[m.id]?`<aside class="cl-launch"><p><strong>Prova ${esc(LABS[m.id].title)}.</strong><br>${esc(LABS[m.id].description)}</p><button class="button" data-go-stage="2" data-open-lab>Öppna ${esc(LABS[m.id].title)} ↗</button></aside>`:""}
 <nav class="lesson-steps" role="tablist" aria-label="Tre steg i området"><button id="step-tab-1" class="lesson-step active" role="tab" aria-controls="step-panel-1" aria-selected="true" tabindex="0" data-stage="1"><span>1</span>Titta</button><button id="step-tab-2" class="lesson-step" role="tab" aria-controls="step-panel-2" aria-selected="false" tabindex="-1" data-stage="2"><span>2</span>Förstå</button><button id="step-tab-3" class="lesson-step" role="tab" aria-controls="step-panel-3" aria-selected="false" tabindex="-1" data-stage="3"><span>3</span>Svara</button></nav>
 <p class="pair-role"><span>ROLLER I DET HÄR OMRÅDET</span>Elev ${role}: förklara · Elev ${role==='A'?'B':'A'}: skriv och ställ följdfrågor</p>
 <section id="step-panel-1" class="lesson-stage" role="tabpanel" aria-labelledby="step-tab-1" tabindex="-1">${filmSection(m)}<details class="first-thought optional-thought" id="first-thought"><summary>Vad tror ni? Skriv en första tanke om ni vill.</summary><label for="first-answer">${escape(m.firstQuestion)}</label><textarea id="first-answer" placeholder="Vi tror att …" maxlength="10000">${escape(s.first)}</textarea><div class="actions"><button class="button small" id="reveal">Spara vår första tanke</button><button class="button small secondary" id="first-unknown">Vi vet inte än</button></div><p class="tiny">Ni kan titta på filmen direkt. Er första tanke kan hjälpa er att se hur er förklaring utvecklas.</p></details>
 <div class="stage-navigation"><span class="tiny">Nästa steg: läs och undersök.</span><button class="button" data-go-stage="2">Till förklaringen →</button></div></section>
 <section id="step-panel-2" class="lesson-stage" role="tabpanel" aria-labelledby="step-tab-2" tabindex="-1" hidden><article class="lesson-article">${readingSection(m)}</article><div class="stage-navigation"><button class="button secondary" data-go-stage="1">← Till filmen</button><button class="button" data-go-stage="3">Skriv ert svar →</button></div></section>
 <section id="step-panel-3" class="lesson-stage" role="tabpanel" aria-labelledby="step-tab-3" tabindex="-1" hidden><div class="answer-desk"><p class="eyebrow">PARETS FÖRKLARING</p><h2>Förklara med egna ord.</h2><p class="answer-instruction">Berätta först för varandra hur ni tänker. Skriv sedan med egna ord.</p><label class="task" for="final-answer">${escape(m.task)}</label><textarea id="final-answer" maxlength="20000" placeholder="Vår förklaring …">${escape(s.answer)}</textarea><details class="hint"><summary>Vi behöver en ledtråd</summary><p>${escape(m.hint)}</p></details><div class="actions"><button id="show-example" class="button small secondary">Jämför med ett exempel</button></div><div class="example" id="example" ${s.exampleSeen?'':'hidden'}><h3>En möjlig förklaring</h3><p>${escape(m.example)}</p><p class="tiny">Vad har ni med i ert svar? Lägg till ett samband eller ett exempel som gör förklaringen tydligare.</p></div>
 <section class="check"><p class="margin-label">PRÖVA ERT RESONEMANG</p><fieldset><legend>Snabbkoll: ${escape(m.check.question)}</legend>${m.check.options.map((o,i)=>`<label class="radio-line"><input type="radio" name="check" value="${i}" ${s.choice===i?'checked':''}>${escape(o)}</label>`).join('')}</fieldset><button class="button small secondary" id="check-answer">Kontrollera snabbkollen</button><div id="check-feedback" role="status" ${s.checked?'':'hidden'}></div></section>
 <section class="rating"><fieldset><legend>Hur säkra känner ni er?</legend><div class="rating-options">${[['själv','Vi kan förklara själva'],['med stöd','Vi kan förklara med stöd'],['öva','Vi behöver öva mer']].map(([v,label])=>`<label><input type="radio" name="rating" value="${v}" ${s.rating===v?'checked':''}>${label}</label>`).join('')}</div></fieldset></section><div class="complete-line"><label><input type="checkbox" id="mark-done" ${s.done?'checked':''}>Vi har diskuterat och skrivit. Båda har varit delaktiga.</label></div><details class="hint"><summary>Om ni hinner: tänk ett steg till</summary><p>${escape(m.stretch)}</p></details></div>
 <div class="stage-navigation"><button class="button secondary" data-go-stage="2">← Läs förklaringen</button><a class="button" href="${m.id===7?'#svar':'#omrade-'+(m.id+1)}">${m.id===7?'Se era svar':'Nästa område'} →</a></div></section></div>`;
 const first=document.querySelector('#first-answer'),answer=document.querySelector('#final-answer');
 first.oninput=()=>{s.first=first.value;save();};answer.oninput=()=>{s.answer=answer.value;save();};
 const saveFirst=unknown=>{if(unknown&&!s.first.trim()){s.first='Vi vet inte än.';first.value=s.first;}if(!s.first.trim()){first.focus();notify('Skriv er första tanke eller välj ”Vi vet inte än”.');return;}s.revealed=true;save();document.querySelector('#first-thought').open=false;document.querySelector('#replay-film')?.focus();notify('Er tanke är sparad. Fortsätt när ni vill.');};
 document.querySelector('#reveal').onclick=()=>saveFirst(false);document.querySelector('#first-unknown').onclick=()=>saveFirst(true);
 document.querySelector('#show-example').onclick=()=>{if(!s.answer.trim()){answer.focus();notify('Skriv ert eget svar innan ni jämför.');return;}s.exampleSeen=true;save();document.querySelector('#example').hidden=false;applyTextRendering(document.querySelector('#example'));};
 document.querySelectorAll('[name=check]').forEach(el=>el.onchange=()=>{s.choice=Number(el.value);s.checked=false;document.querySelector('#check-feedback').hidden=true;save();});
 document.querySelector('#check-answer').onclick=()=>{if(s.choice===null){notify('Välj ett påstående först.');return;}s.checked=true;save();showCheck(m,s);};if(s.checked)showCheck(m,s);
 document.querySelectorAll('[name=rating]').forEach(el=>el.onchange=()=>{s.rating=el.value;save();});
 document.querySelector('#mark-done').onchange=e=>{if(e.target.checked&&(!s.answer.trim()||!s.rating)){e.target.checked=false;notify('Skriv ert svar och välj hur säkra ni känner er först.');return;}s.done=e.target.checked;save();};
 connectChapter(m);
 let currentStage=1;
 const setStage=(number,focus=true)=>{const target=Math.max(1,Math.min(3,Number(number)));if(target!==1)document.querySelector('#lesson-film')?.pause();if(target!==2)cancelAnimationFrame(animation);activeLab?.setActive(target===2);const launch=document.querySelector('.cl-launch');if(launch)launch.hidden=target===2;currentStage=target;document.querySelectorAll('[data-stage]').forEach(tab=>{const active=Number(tab.dataset.stage)===target;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});document.querySelectorAll('.lesson-stage').forEach((panel,i)=>panel.hidden=i+1!==target);if(target===2){s.revealed=true;save();setupWidget(m,s);}applyTextRendering(main);if(focus){document.querySelector('#step-panel-'+target).focus({preventScroll:true});document.querySelector('.lesson-steps').scrollIntoView({block:'start',behavior:'auto'});}};
 document.querySelectorAll('[data-stage]').forEach(tab=>{tab.onclick=()=>setStage(tab.dataset.stage);tab.onkeydown=e=>{let next;if(e.key==='ArrowRight')next=currentStage===3?1:currentStage+1;else if(e.key==='ArrowLeft')next=currentStage===1?3:currentStage-1;else if(e.key==='Home')next=1;else if(e.key==='End')next=3;else return;e.preventDefault();setStage(next);document.querySelector('#step-tab-'+next).focus({preventScroll:true});};});
 document.querySelectorAll('[data-go-stage]').forEach(button=>button.onclick=()=>setStage(button.dataset.goStage));
 setStage(['alla',LABS[m.id]?.slug,String(m.id),m.id===4?'reaktioner':m.id===5?'material':m.id===7?'miljo':''].includes(new URLSearchParams(location.search).get('lab'))?2:1,false);
}
function showCheck(m,s){const e=document.querySelector('#check-feedback'),ok=s.choice===m.check.correct;e.hidden=false;e.className='feedback'+(ok?'':' wrong');e.textContent=(ok?'Det stämmer. ':'Titta en gång till. ')+m.check.feedback;applyTextRendering(e);}
function tools(labels,action,current){return `<div class="tools">${labels.map(([v,label])=>`<button type="button" data-action="${action}" data-value="${v}" ${current!==undefined?`aria-pressed="${String(current)===String(v)}"`:''}>${label}</button>`).join('')}</div>`;}
function setupWidget(m,s){
 const el=document.querySelector('#widget');if(!el||!LABS[m.id])return;
 cancelAnimationFrame(animation);
 if(!activeLab)activeLab=mountSubjectLab(el,m.id);
 activeLab.setActive(true);
}

function plainReport(d=data){const lines=['KEMINS GRUNDER (i) – ERA SVAR','Prov: 3 december 2026',`Sparat: ${d.updatedAt||'ännu inte sparat'}`,''];for(const m of modules){const s=d.modules[m.id]||{};lines.push(`${m.id}. ${m.title} (${m.pages})`,`Mål: ${m.goal}`,`Första tanke: ${s.first||'[inte besvarat]'}`,`Uppgift: ${m.task}`,`Vår förklaring: ${s.answer||'[inte besvarat]'}`,`Självskattning: ${s.rating||'inte vald'}`,`Snabbkoll: ${s.checked?(s.choice===m.check.correct?'rätt efter kontroll':'behöver övas'):'inte kontrollerad'}`,`Exempelförklaring öppnad: ${s.exampleSeen?'ja':'nej'}`,`Markerat klart: ${s.done?'ja':'nej'}`,'');}lines.push('PRÖVA SJÄLV',`Elev A: ${d.exitA||'[inte besvarat]'}`,`Elev B: ${d.exitB||'[inte besvarat]'}`);return lines.join('\n');}
function download(content,extension,type){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`Kemins_grunder_i_svar_${new Date().toLocaleDateString('sv-SE')}.${extension}`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function downloadJSON(){save();download(JSON.stringify(data,null,2),'json','application/json');notify('Svarsfilen laddas ned. Ni kan öppna den här nästa gång.');}
async function restore(e){const file=e.target.files?.[0];if(!file)return;try{if(file.size>2e6)throw new Error('Filen är för stor. Välj en svarsfil under 2 MB.');const parsed=validate(JSON.parse(await file.text()));if(Object.values(data.modules).some(s=>s.first||s.answer)&&!confirm('Öppna filen och ersätta svaren i den här arbetsytan? Ladda ned nuvarande svar först om ni vill behålla dem.'))return;data=parsed;save();notify('Svarsfilen är öppnad.');render();}catch(error){notify(error instanceof SyntaxError?'Filen går inte att läsa som JSON. Välj en svarsfil från Kemins grunder (i).':error.message);}e.target.value='';}
function reportView(){main.innerHTML=`<div class="intro-meta"><span>Era gemensamma förklaringar</span><span>Kemi · Sju områden</span></div><h1>Vad har ni<br><em>kommit fram till?</em></h1><p class="lead">Läs igenom era svar tillsammans. Vad kan ni förklara nu? Vad vill ni öva på en gång till?</p><div class="export-grid"><section class="panel"><h2>Era sju områden</h2>${modules.map(m=>{const s=state(m.id);return `<article class="summary-module"><h3>${m.id}. ${escape(m.title)} <a href="#omrade-${m.id}" aria-label="Ändra svaret för ${escape(m.title)}">↗</a></h3><p class="tiny">Första tanke: ${escape(s.first||'Inte besvarat')}</p><p class="answer-text">${escape(s.answer||'Ni har inte skrivit en förklaring än.')}</p><p class="tiny">Självskattning: ${escape(s.rating||'inte vald')} · ${s.done?'Markerat klart':'Inte markerat klart'}</p></article>`;}).join('')}</section><div><section class="panel teal"><h2>Spara ert arbete</h2><p class="tiny">Spara en kopia när ni avslutar. Då kan ni fortsätta där ni slutade.</p><div class="actions"><button class="button" id="download-json">Spara svarsfil</button><button class="button secondary" id="copy-report">Kopiera svaren</button><button class="button secondary" id="download-text">Ladda ned som text</button><button class="button secondary" id="print-report">Skriv ut / spara som PDF</button></div><p class="tiny">Ni kan också kopiera sammanställningen som vanlig text.</p><p class="important-note">Arbeta två vid samma dator. Svarsfilen är er kopia av arbetet.</p><details class="hint"><summary>Visa kopierbar text</summary><label class="sr-only" for="report-text">Alla svar som kopierbar text</label><textarea id="report-text" class="export-preview" readonly>${escape(plainReport())}</textarea></details></section><section class="panel" style="margin-top:20px"><h3>Fortsätt med ett sparat arbete</h3><p class="tiny">Spara en svarsfil här. Öppna den på nästa dator med knappen nedanför.</p><div class="actions"><button id="restore-trigger" class="button small secondary">Öppna svarsfil</button></div><input id="restore-file" type="file" accept=".json,application/json" hidden aria-label="Öppna svarsfil"><details class="hint"><summary>Börja ett nytt arbete</summary><p>Spara en kopia först om ni vill behålla era svar.</p><button class="button small secondary" id="new-work">Öppna en tom arbetsyta</button></details></section></div></div>
 <section class="panel" style="margin-top:24px"><div class="field-heading">Pröva själva · arbeta var för sig</div><h2>Vad kan du förklara nu?</h2><p class="tiny">Välj en sak du nu kan förklara. Skriv din förklaring utan att läsa parets svar. Avsluta med något du fortfarande undrar över.</p><div class="exit-grid"><div><label for="exit-a">Elev A</label><textarea id="exit-a" maxlength="10000" placeholder="Nu kan jag förklara … Jag undrar fortfarande …">${escape(data.exitA)}</textarea></div><div><label for="exit-b">Elev B</label><textarea id="exit-b" maxlength="10000" placeholder="Nu kan jag förklara … Jag undrar fortfarande …">${escape(data.exitB)}</textarea></div></div><p class="tiny">Spara en ny kopia efter att ni skrivit era sista förklaringar.</p></section>`;
 for(const [id,key] of [['exit-a','exitA'],['exit-b','exitB']])document.querySelector('#'+id).oninput=e=>{data[key]=e.target.value;save();document.querySelector('#report-text').value=plainReport();};
 document.querySelector('#download-json').onclick=downloadJSON;document.querySelector('#download-text').onclick=()=>{save();download(plainReport(),'txt','text/plain;charset=utf-8');};document.querySelector('#print-report').onclick=()=>window.print();
 document.querySelector('#copy-report').onclick=async()=>{save();try{await navigator.clipboard.writeText(plainReport());notify('Era svar är kopierade.');}catch{const area=document.querySelector('#report-text');area.closest('details').open=true;area.value=plainReport();area.focus();area.select();notify('Markera och kopiera texten som visas.');}};
 document.querySelector('#restore-trigger').onclick=()=>document.querySelector('#restore-file').click();document.querySelector('#restore-file').onchange=restore;
 document.querySelector('#new-work').onclick=()=>{if(!confirm('Börja ett nytt arbete? Spara era nuvarande svar först om ni vill behålla dem.'))return;data=fresh();save();location.hash='#omrade-1';};
}
function resolveRoute(hash){return /^#omrade-[1-7]$/.test(hash)||hash==='#svar'?hash:'#omrade-1';}
function render(){activeLab?.destroy();activeLab=null;document.querySelectorAll('video').forEach(video=>video.pause());cancelAnimationFrame(animation);const route=resolveRoute(location.hash);document.querySelectorAll('.step-link').forEach(a=>{const active=a.hash===route;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});document.querySelector('#student-link').classList.toggle('active',route!=='#svar');document.querySelector('#answers-link').classList.toggle('active',route==='#svar');const match=route.match(/^#omrade-([1-7])$/);if(match)moduleView(modules[Number(match[1])-1]);else reportView();updateProgress();document.title=(match?modules[Number(match[1])-1].title+' · ':'Era svar · ')+'Kemins grunder (i)';window.scrollTo({top:0,behavior:'instant'});main.classList.remove('chapter-enter');requestAnimationFrame(()=>main.classList.add('chapter-enter'));applyTextRendering(document.body);}
document.querySelector('#module-nav').addEventListener('click',e=>{const link=e.target.closest('a[data-step]');if(link&&link.hash===location.hash){e.preventDefault();moduleView(modules[Number(link.dataset.step)-1]);applyTextRendering(main);window.scrollTo({top:0,behavior:'instant'});}});
main.addEventListener('click',()=>queueMicrotask(()=>applyTextRendering(main)));
main.addEventListener('change',()=>queueMicrotask(()=>applyTextRendering(main)));
document.querySelector('.skip').addEventListener('click',e=>{e.preventDefault();main.focus();main.scrollIntoView();});
window.addEventListener('hashchange',()=>{render();main.focus({preventScroll:true});});
window.addEventListener('storage',e=>{if(e.key===KEY&&e.newValue)notify('Arbetsytan ändrades i en annan flik. Använd en flik per par.');});
render();
