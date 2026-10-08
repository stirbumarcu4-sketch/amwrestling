import type { IntrebareFaq } from "@/types";

export const categoriiFaq = [
  "Comenzi și livrare",
  "Produse și echipament",
  "Retur și garanție",
  "Plată și facturare",
] as const;

export const faq: IntrebareFaq[] = [
  // ── Comenzi și livrare ──
  {
    categorie: "Comenzi și livrare",
    intrebare: "În cât timp ajunge comanda?",
    raspuns:
      "Produsele aflate în stoc pleacă din depozit în aceeași zi lucrătoare dacă am primit comanda până la ora 14:00, altfel în ziua următoare. Curierul livrează în 24–48 de ore în majoritatea localităților. Produsele marcate „la comandă” se execută în atelier și au termen de 10–15 zile lucrătoare.",
  },
  {
    categorie: "Comenzi și livrare",
    intrebare: "Cât costă transportul?",
    raspuns:
      "Transportul standard prin curier costă 99 MDL și este gratuit pentru comenzile de peste 1.300 MDL. Mesele și celelalte produse voluminoase se livrează prin curier de marfă, cu un cost fix de 590 MDL, indiferent de valoarea comenzii.",
  },
  {
    categorie: "Comenzi și livrare",
    intrebare: "De ce mesele au transport separat?",
    raspuns:
      "O masă cântărește între 19 și 58 kg și depășește dimensiunile acceptate de curierii obișnuiți. O expediem prin curier de marfă, pe palet, cu termen de 5–10 zile lucrătoare. Costul de 590 MDL acoperă manipularea și ambalarea specială, nu se cumulează pe bucată.",
  },
  {
    categorie: "Comenzi și livrare",
    intrebare: "Pot ridica personal comanda?",
    raspuns:
      "Da. Ridicarea din Cluj-Napoca este gratuită și o alegi la finalizarea comenzii. Te anunțăm pe e-mail când coletul este pregătit. Programul de ridicare este luni–vineri 09:00–18:00 și sâmbătă 10:00–14:00.",
  },

  // ── Produse și echipament ──
  {
    categorie: "Produse și echipament",
    intrebare: "Ce mâner îmi trebuie dacă abia încep?",
    raspuns:
      "Mânerul ciocan Hammer H2 este cel mai simplu de învățat, pentru că priza neutră nu cere control fin al încheieturii. Următorul pas logic este Pronator P1, care acoperă pronația și presiunea laterală. Cele două acoperă majoritatea traseelor de lucru din primul an.",
  },
  {
    categorie: "Produse și echipament",
    intrebare: "Mesele voastre sunt omologate de o federație?",
    raspuns:
      "Nu. Mesele sunt construite la dimensiunile din regulamentul internațional — înălțime a blatului de 104 cm, perne de cot de 15 × 15 cm, pini la 41 cm — dar nu avem o omologare oficială emisă de o federație. Descrierile se referă la cote, nu la o certificare.",
  },
  {
    categorie: "Produse și echipament",
    intrebare: "Ce diferență este între bandajele de 60 și cele de 90 cm?",
    raspuns:
      "Lungimea determină câte ture poți face în jurul încheieturii și, implicit, cât de fermă este susținerea. Cele de 60 cm sunt potrivite pentru antrenamentul zilnic, cele de 90 cm pentru serii maximale și pentru ziua de competiție. Dacă ai încheietura groasă, alege direct 90 cm.",
  },
  {
    categorie: "Produse și echipament",
    intrebare: "Ce am nevoie ca să montez un sistem de scripeți acasă?",
    raspuns:
      "Un perete de beton sau cărămidă plină, un sistem Pulley Pro, un cablu de oțel și cel puțin un mâner. Discurile se prind în suportul inclus. Nu monta sistemul în rigips sau în BCA fără ancore chimice dimensionate corespunzător.",
  },

  // ── Retur și garanție ──
  {
    categorie: "Retur și garanție",
    intrebare: "Pot returna un produs dacă m-am răzgândit?",
    raspuns:
      "Da. Ai la dispoziție 14 zile calendaristice de la primirea coletului ca să te retragi din contract, fără să motivezi decizia. Produsul trebuie să fie în aceeași stare în care l-ai primit. Costul returului îl suporți tu, cu excepția cazului în care produsul a fost livrat greșit sau este defect.",
  },
  {
    categorie: "Retur și garanție",
    intrebare: "Cum returnez efectiv un produs?",
    raspuns:
      "Ne scrii pe comenzi@hookandpress.md cu numărul comenzii și produsele pe care vrei să le returnezi. Îți răspundem cu adresa de retur și cu formularul de retragere. După ce primim coletul și verificăm produsul, îți restituim suma în maximum 14 zile, pe aceeași metodă de plată.",
  },
  {
    categorie: "Retur și garanție",
    intrebare: "Ce garanție au produsele?",
    raspuns:
      "Toate produsele beneficiază de garanția legală de conformitate de 2 ani, conform legislației în vigoare. Mesele au în plus o garanție extinsă de structură — 36 de luni pentru Titan Pro și 24 de luni pentru Forge Club. Garanția nu acoperă uzura normală a tapițeriei sau a chingilor.",
  },
  {
    categorie: "Retur și garanție",
    intrebare: "Produsele de igienă personală se pot returna?",
    raspuns:
      "Creta lichidă și gelul răcoritor pot fi returnate doar sigilate. Odată desigilate, dreptul de retragere nu se mai aplică, din motive de igienă. Restul produselor se returnează fără această restricție.",
  },

  // ── Plată și facturare ──
  {
    categorie: "Plată și facturare",
    intrebare: "Ce metode de plată acceptați?",
    raspuns:
      "Momentan acceptăm plata ramburs la curier și transferul bancar. Plata cu cardul online nu este disponibilă încă — opțiunea apare dezactivată la finalizarea comenzii. Pentru transfer bancar, primești IBAN-ul și detaliile după plasarea comenzii.",
  },
  {
    categorie: "Plată și facturare",
    intrebare: "Prețurile includ TVA?",
    raspuns:
      "Da. Toate prețurile afișate pe site sunt exprimate în lei moldovenești (MDL) și includ TVA. Nu apar costuri suplimentare la finalizarea comenzii, în afara transportului, care este afișat separat înainte de confirmare.",
  },
  {
    categorie: "Plată și facturare",
    intrebare: "Primesc factură?",
    raspuns:
      "Da. Factura se emite pentru fiecare comandă și o primești pe e-mail, în format PDF, după expediere. Dacă ai nevoie de factură pe firmă, completează datele societății în câmpul de observații la finalizarea comenzii.",
  },
  {
    categorie: "Plată și facturare",
    intrebare: "Emiteți facturi pentru cluburi și pentru achiziții publice?",
    raspuns:
      "Da. Pentru cluburi sportive, săli și instituții emitem ofertă și factură cu termen de plată. Scrie-ne pe comenzi@hookandpress.md cu lista de produse și cu datele de facturare, iar noi îți trimitem oferta în cel mult două zile lucrătoare.",
  },
];
