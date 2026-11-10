// Pedagogiskt bild- och textunderlag för Giftfri miljö. Källor avser faktainnehållet.
export const environmentScenarios = {
  "image": "assets/environment/giftfri-miljo-scenarier.png",
  "webImage": "assets/environment/giftfri-miljo-scenarier.webp",
  "imageCredit": "AI-illustration, skapad med OpenAI image_gen. Faktainnehållet har kontrollerats mot källorna nedan.",
  "prompt": "assets/environment/giftfri-miljo-scenarier-prompt.txt",
  "width": 1536,
  "height": 1024,
  "alt": "Fyra händelser med målarfärg: regn för med sig ett spill via mark och dagvattenbrunn till en bäck med en fisk; en stängd burk står i ett uppsamlingstråg; färgrester lämnas till personal vid insamling; en person läser etiketten och planerar hur mycket färg som behövs.",
  "caption": "Följ pilarna: ämnen kan spridas med vatten. Flera handlingar kan stoppa spridningen redan vid källan.",
  "note": "Det här är en tänkt händelsekedja, inga uppmätta halter. Den orange vägen hjälper dig att följa spridningen. Om en fisk påverkas beror på vilka ämnen som når vattnet, hur mycket och hur länge fisken utsätts för dem.",
  "scenarios": [
    {
      "number": 1,
      "title": "Spill kan spridas",
      "text": "Regn kan föra med sig ämnen från marken till en dagvattenbrunn och vidare till en bäck. Dagvatten är regn- och smältvatten som rinner av från till exempel gator. Fiskar kan då utsättas för ämnen i vattnet.",
      "question": "Var i bildens kedja skulle du kunna stoppa spridningen?",
      "sourceIds": [
        "dagvatten",
        "risk"
      ]
    },
    {
      "number": 2,
      "title": "Stoppa vid källan",
      "text": "Ett ordentligt stängt lock minskar risken för spill. Ett uppsamlingstråg kan fånga läckage innan det når golv, mark eller vatten. Att förebygga utsläpp är ett sätt att minska hur mycket andra organismer utsätts för.",
      "question": "Vad gör locket och tråget på olika sätt?",
      "sourceIds": [
        "forpackning",
        "prevention"
      ]
    },
    {
      "number": 3,
      "title": "Lämna färgrester rätt",
      "text": "Färgrester ska lämnas till kommunens insamling för farligt avfall, till exempel på en återvinningscentral. Häll dem inte i avloppet. Det gäller även vattenbaserad färg. Följ kommunens anvisningar och fråga personalen om du är osäker.",
      "question": "Varför betyder vattenbaserad färg inte att resterna ska spolas ner?",
      "sourceIds": [
        "fargrester"
      ]
    },
    {
      "number": 4,
      "title": "Välj och använd klokt",
      "text": "Läs etiketten före användning och följ instruktionerna för produkten. Planera hur mycket som behövs och ta bara fram den mängd som ska användas. Då blir det mindre över att hantera och mindre som kan spillas.",
      "question": "Vilka beslut kan minska onödiga rester redan innan målningen börjar?",
      "sourceIds": [
        "etikett",
        "prevention"
      ]
    }
  ],
  "sources": [
    {
      "id": "dagvatten",
      "title": "NSVA: Så tar vi hand om dagvatten",
      "url": "https://nsva.se/sa-funkar-det/dagvatten-och-ledningsnat/sa-tar-vi-hand-om-dagvatten/"
    },
    {
      "id": "risk",
      "title": "Kemikalieinspektionen: Analysera kemikalieriskerna",
      "url": "https://www.kemi.se/prioguiden/start/analysera-kemikalieriskerna-i-din-verksamhet"
    },
    {
      "id": "forpackning",
      "title": "Kemikalieinspektionen: Förpackning av kemiska produkter",
      "url": "https://www.kemi.se/lagar-och-regler/lagstiftningar-inom-kemikalieomradet/eu-gemensam-lagstiftning/clp-forordningen/forpackning-av-kemiska-produkter"
    },
    {
      "id": "prevention",
      "title": "US EPA: Learn About Pollution Prevention",
      "url": "https://www.epa.gov/p2/learn-about-pollution-prevention"
    },
    {
      "id": "fargrester",
      "title": "NSVA: Häll inte ut färg i avloppet",
      "url": "https://nsva.se/mitt-vatten/avlopp/rad-och-tips/hall-inte-ut-farg-i-avloppet/"
    },
    {
      "id": "etikett",
      "title": "Kemikalieinspektionen: Din rätt att få information",
      "url": "https://www.kemi.se/rad-till-privatpersoner/rad-om-kemikalier-i-vardagen/din-ratt-att-fa-information"
    }
  ],
  "generation": {
    "method": "OpenAI built-in image_gen",
    "date": "2026-11-10",
    "useCase": "scientific-educational"
  }
};
