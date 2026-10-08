// DECIZIE: nota este identică pe toate paginile legale, așa că stă într-o
// singură componentă, ca să nu se rescrie în cinci locuri.

export default function LegalNotice() {
  return (
    <p className="mt-12 border-l-2 border-rust-600 bg-rust-100 p-4 text-sm text-ink-700">
      Document-șablon cu conținut demonstrativ. Înainte de publicare,
      verifică-l cu un consilier juridic și completează datele reale ale firmei.
    </p>
  );
}
