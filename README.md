# HOOK & PRESS — magazin de echipament pentru armwrestling

Magazin online multi-pagină, în limba română, cu prețuri în RON. Fără bază de
date, fără backend, fără autentificare și fără procesare de plăți: toate datele
sunt statice și tipate, în `src/data/`.

Construit cu Next.js 16 (App Router), TypeScript strict, Tailwind CSS v4 și
`lucide-react` ca singură dependență de interfață.

---

## Comenzi

```bash
npm install       # instalează dependențele
npm run dev       # server de dezvoltare
npm run build     # build de producție
npm start         # servește build-ul de producție
npm run lint      # ESLint
npm run imagini   # regenerează ilustrațiile din public/
npx tsc --noEmit  # verificare de tipuri
```

Portul implicit este 3000. Pentru altul: `npx next start -p 3100`.

---

## Harta rutelor

| Rută | Conținut | Randare |
|---|---|---|
| `/` | Acasă: hero, categorii, bestselleruri, noutăți, testimoniale, newsletter | statică |
| `/produse` | Catalog complet, cu filtre, sortare și paginare | statică |
| `/produse/[slug]` | Pagină de produs (40 de rute) | statică, `generateStaticParams` |
| `/categorii` | Lista celor 6 categorii | statică |
| `/categorii/[slug]` | Produsele unei categorii (6 rute) | statică, `generateStaticParams` |
| `/cautare?q=` | Rezultate de căutare, insensibile la diacritice | dinamică |
| `/cos` | Coșul de cumpărături | statică (conținut din `localStorage`) |
| `/checkout` | Formular de comandă simulat | statică, `noindex` |
| `/comanda-finalizata` | Confirmare comandă | statică, `noindex` |
| `/favorite` | Lista de favorite | statică (conținut din `localStorage`) |
| `/despre-noi`, `/contact` | Pagini de prezentare | statice |
| `/ghid-marimi`, `/ghid-echipament` | Ghiduri | statice |
| `/intrebari-frecvente` | 16 întrebări, 4 categorii, JSON-LD `FAQPage` | statică |
| `/livrare-si-retur` | Termene, costuri, procedura de retur | statică |
| `/termeni-si-conditii` | Termeni, inclusiv secțiunea SAL/ANPC | statică |
| `/politica-de-confidentialitate`, `/politica-cookies` | Documente GDPR | statice |
| `/blog`, `/blog/[slug]` | 4 articole | statice, `generateStaticParams` |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | Fișiere generate | statice |

76 de pagini generate la build, dintre care 67 sunt listate în sitemap.

---

## Structura proiectului

```
src/
├── app/          rutele (App Router)
├── components/   layout · produs · catalog · cos · checkout · contact · home · ui
├── data/         produse.ts · categorii.ts · articole.ts · faq.ts · site.ts · judete.ts
├── lib/          cart-context.tsx · wishlist.ts · filters.ts · format.ts · seo.ts · utils.ts
└── types/        index.ts
```

**Tot ce ține de brand stă în `src/data/site.ts`** — nume, contact, CUI, praguri
de livrare, zile de retur, rețele sociale. Schimbarea numelui magazinului
înseamnă modificarea unei singure constante.

---

## Imagini

Toate imaginile sunt fișiere locale din `public/`. Nu există nicio dependență de
un serviciu extern de imagini, iar `next.config.ts` nu are nevoie de
`remotePatterns`.

### Cum sunt generate

`scripts/genereaza-imagini.mjs` conține câte un desen vectorial pentru fiecare
dintre cele 42 de produse, în stil de desen tehnic.

Tema cromatică este roșie: corpul fiecărui produs stă în familia roșu — de la
cărămidă și bordo până la roșu aprins — diferențiat prin ton de la o piesă la
alta, ca produsele să nu se confunde între ele în grila de catalog. Fundalul
rămâne neutru, ca produsul să dea culoarea. Neutrele apar doar unde materialul
chiar le cere: crom la pini, rulmenți și carabiniere, oțel la cabluri, alb la
cretă. Fără ele desenul și-ar pierde lizibilitatea.

Paleta este definită într-un singur loc, în obiectul `M` din capul scriptului.
Schimbarea temei înseamnă modificarea acelor valori și o rulare de script.

Scriptul randează desenele cu `sharp` și scrie 117 fișiere WebP (circa 1,5 MB în
total):

```bash
npm run imagini
```

| Destinație | Format | Conținut |
|---|---|---|
| `public/produse/{seed}-{n}.webp` | 900 × 900 | 105 imagini, 2–4 per produs |
| `public/categorii/{slug}.webp` | 1200 × 800 | compoziție din două desene reprezentative |
| `public/blog/{slug}.webp` | 1600 × 900 | compoziție tematică pentru fiecare articol |
| `public/hero.webp` | 1000 × 1250 | imaginea din hero |
| `public/contact-harta.webp` | 900 × 675 | reper vizual pe pagina de contact |

Cele 2–4 imagini ale unui produs nu sunt desene diferite, ci încadrări diferite
ale aceluiași obiect: vedere completă, vedere înclinată cu linie de cotă,
detaliu decupat și vedere mică pe caroiaj tehnic. Obiectul este decupat automat
și centrat, așa că toate ilustrațiile se așază identic în cadru.

Desenele nu conțin text — astfel randarea nu depinde de fonturile instalate pe
mașina care rulează scriptul.

### Cum le înlocuiești cu fotografii reale

Nu trebuie modificat niciun fișier de cod. Pune fotografiile în `public/`,
peste cele generate, păstrând exact aceleași nume:

```
public/produse/pronator-p1-1.webp
public/produse/pronator-p1-2.webp
public/produse/pronator-p1-3.webp
```

Seed-ul și numărul de imagini sunt argumentele transmise lui `poze(...)` în
`src/data/produse.ts` — de exemplu `poze("pronator-p1", 3)` cere cele trei
fișiere de mai sus. Formatul recomandat rămâne WebP pătrat, 900 × 900 px.

Dacă vrei fotografii în alt format sau în alt folder, modifică funcția `img()`
din capul fișierului `src/data/produse.ts` — este singura linie care compune
adresa unei imagini de produs.

După înlocuire poți șterge `scripts/genereaza-imagini.mjs`.

---

## Cum adaugi un produs nou

1. Deschide `src/data/produse.ts` și adaugă un obiect în tabloul `produse`.
2. Obligatorii: `slug` (unic, fără diacritice), `nume`, `sku` (unic),
   `categorie` (una dintre cele 6 valori din `CategorieSlug`), `pret`,
   `descriereScurta` (max 120 de caractere), `descriere`, `specificatii`,
   `imagini` (2–4) și `stoc`.
3. Opționale: `pretVechi`, `etichete`, `marimi`, `greutateKg`, `voluminos`,
   `rating`, `nrRecenzii`.
4. Rulează `npm run build`. Ruta `/produse/{slug}` se generează automat, iar
   produsul intră în sitemap, în catalog, în filtre și în căutare.

Nu trebuie modificat niciun alt fișier. TypeScript semnalează la build orice
câmp lipsă sau valoare invalidă.

Pentru o categorie nouă, adaugă valoarea în `CategorieSlug`
(`src/types/index.ts`) și o intrare în `src/data/categorii.ts`.

---

## Decizii de implementare

Locurile în care implementarea se abate de la specificația inițială sunt marcate
în cod cu `// DECIZIE:`. Cele care contează:

- **Variabilele de font** se numesc `--font-heading-src` / `--font-body-src`.
  Numele din specificație coincideau cu tokenii Tailwind din `@theme`, ceea ce
  ar fi produs o auto-referință CSS invalidă, iar fonturile nu s-ar fi aplicat.
- **Trei culori au fost închise** față de paleta inițială, pentru a trece pragul
  de contrast de 4,5:1 cerut: `steel-500` de la `#6b7680` la `#606a74` (dădea
  4,30:1 pe `chalk-50`), `moss-600` de la `#2e7d5b` la `#2a7253`, `amber-600` de
  la `#b4791b` la `#90600f` (dădea 3,69:1 pe alb). Pe fundal închis, textul
  secundar folosește `steel-400`, nu `steel-500`.
- **Iconurile de rețele sociale** sunt linkuri text: `lucide-react` 1.x a
  eliminat iconurile de brand.
- **Coșul, favoritele și comanda finalizată** citesc stocarea locală prin
  `useSyncExternalStore`, nu prin `setState` într-un efect. Instantaneul de
  server este gol, deci markup-ul randat pe server coincide cu prima randare din
  client și nu apar diferențe de hidratare.
- **`cn()`** este scris de mână, fiindcă `lucide-react` este singura dependență
  de interfață permisă.

---

## Ce lipsește pentru o lansare reală

Acest proiect este complet la nivel de interfață, dar deliberat incomplet ca
magazin funcțional. Înainte de a vinde efectiv:

- **Plăți.** Nu există procesare de plăți. Opțiunea „Card online” apare
  dezactivată. Integrează un procesator (Stripe, Netopia, EuPlatesc) și mută
  calculul totalului pe server, ca prețurile să nu poată fi modificate din
  client.
- **Comenzi.** Formularul de checkout nu trimite nimic; comanda este salvată
  doar în `sessionStorage`. Ai nevoie de un endpoint care persistă comanda și de
  e-mailuri de confirmare, către client și către magazin.
- **Stoc.** Stările de stoc sunt statice. Un magazin real are nevoie de o sursă
  de adevăr pentru cantități, cu rezervare la plasarea comenzii.
- **Curierat.** Costurile de livrare sunt constante în `site.ts`. Integrarea cu
  un curier aduce calculul real, generarea AWB-ului și urmărirea coletului.
- **Banner de cookies.** În forma actuală site-ul folosește exclusiv stocare
  strict necesară (coș, favorite, confirmare comandă), deci nu are nevoie de
  consimțământ. În momentul în care adaugi analytics, pixeli de marketing sau
  orice serviciu terț, bannerul cu consimțământ granular devine obligatoriu.
- **Verificare juridică.** Termenii și condițiile, politica de confidențialitate
  și politica de cookies sunt **documente-șablon cu conținut demonstrativ**.
  Trebuie verificate de un consilier juridic și completate cu datele reale ale
  firmei. La fel, datele de identificare din `site.ts` (CUI, Reg. Com., adresă,
  telefon) sunt valori-substitut.
- **Fotografii.** Imaginile de produs sunt ilustrații tehnice generate, nu
  fotografii. Sunt corecte ca formă și lizibile în catalog, dar un magazin real
  vinde cu fotografii ale produsului fizic. Înlocuirea nu cere modificări de cod
  — vezi secțiunea *Imagini*.
- **Conținut demonstrativ.** Evaluările produselor, numărul de recenzii și
  testimonialele de pe pagina principală sunt marcate ca atare în interfață și
  trebuie înlocuite cu date reale. Nu există recenzii atribuite unor persoane.
- **Fără omologări.** Textele descriu cote de construcție, nu certificări de
  federație. Nu adăuga afirmații de omologare fără documentul care le susține.

> Structura și textele-șablon sunt livrate ca punct de plecare. Datele reale ale
> firmei și validarea juridică a documentelor rămân în sarcina proprietarului
> magazinului.
