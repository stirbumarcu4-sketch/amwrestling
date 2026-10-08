import type { ComandaSalvata } from "@/types";
import { formatPret } from "@/lib/format";

// Trimite un rezumat al comenzii pe Telegram, ca anunțul să ajungă imediat,
// fără să fie nevoie de deschiderea panoului de administrare.
//
// Datele de autentificare stau în `.env.local`. Dacă lipsesc, funcția nu face
// nimic — magazinul rămâne complet funcțional fără notificări.

const API = "https://api.telegram.org";

/** Telegram respinge mesajul dacă `<`, `>` sau `&` apar neescapate în modul HTML. */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function compuneMesaj(comanda: ComandaSalvata): string {
  const c = comanda.client;

  const produse = comanda.linii
    .map(
      (l) =>
        `• ${l.cantitate} × ${escapeHtml(l.nume)}` +
        (l.marime ? ` (${escapeHtml(l.marime)})` : "") +
        ` — ${formatPret(l.pretUnitar * l.cantitate)}`,
    )
    .join("\n");

  const livrare =
    comanda.costLivrare === 0 ? "gratuită" : formatPret(comanda.costLivrare);

  return [
    `🛒 <b>Comandă nouă — ${escapeHtml(comanda.numar)}</b>`,
    "",
    produse,
    "",
    `Subtotal: ${formatPret(comanda.subtotal)}`,
    `Livrare: ${livrare}`,
    `<b>TOTAL: ${formatPret(comanda.total)}</b>`,
    "",
    `👤 ${escapeHtml(c.prenume)} ${escapeHtml(c.nume)}`,
    `📞 ${escapeHtml(c.telefon)}`,
    `✉️ ${escapeHtml(c.email)}`,
    `📍 ${escapeHtml(c.strada)}, ${escapeHtml(c.localitate)}, r-nul ${escapeHtml(c.raion)}, ${escapeHtml(c.codPostal)}`,
    c.detalii ? `ℹ️ ${escapeHtml(c.detalii)}` : "",
    "",
    `🚚 ${escapeHtml(comanda.metodaLivrare)} · 💳 ${escapeHtml(comanda.metodaPlata)}`,
    comanda.observatii ? `\n📝 ${escapeHtml(comanda.observatii)}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Nu aruncă niciodată: o comandă validă nu trebuie să eșueze fiindcă Telegram
 * e indisponibil. Problemele se scriu în log, comanda rămâne salvată.
 */
export async function anuntaComandaPeTelegram(
  comanda: ComandaSalvata,
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    // Fără timeout, o rețea lentă ar ține cererea de checkout deschisă.
    const raspuns = await fetch(`${API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: compuneMesaj(comanda),
        parse_mode: "HTML",
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!raspuns.ok) {
      console.error(
        `Telegram a refuzat notificarea pentru ${comanda.numar}:`,
        await raspuns.text(),
      );
    }
  } catch (err) {
    console.error(`Notificarea Telegram pentru ${comanda.numar} a eșuat:`, err);
  }
}
