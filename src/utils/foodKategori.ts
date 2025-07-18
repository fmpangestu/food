export function getKategori(menu: string): string {
  const lower = menu.toLowerCase();

  if (
    lower.includes("buah") ||
    lower.includes("alpukat") ||
    lower.includes("apel") ||
    lower.includes("mangga") ||
    lower.includes("melon") ||
    lower.includes("naga") ||
    lower.includes("pepaya") ||
    lower.includes("semangka")
  )
    return "Buah";
  // Sayur & Sup: Prioritaskan dulu
  if (
    lower.includes("sup") ||
    lower.includes("sayur") ||
    lower.includes("brokoli") ||
    lower.includes("kangkung") ||
    lower.includes("bayam") ||
    lower.includes("buncis") ||
    lower.includes("selada") ||
    lower.includes("wortel") ||
    lower.includes("kacang panjang") ||
    lower.includes("sawi") ||
    lower.includes("tumis")
    // lower.includes("mangkuk") // untuk sayur asem, sayur bening, sup kentang
  )
    return "Sayur";

  // Pokok
  if (
    lower.includes("nasi") ||
    lower.includes("kentang") ||
    lower.includes("oat") ||
    lower.includes("roti") ||
    lower.includes("sandwich") ||
    lower.includes("bubur ayam")
  )
    return "Pokok";

  // Lauk Hewani
  if (
    lower.includes("ayam") ||
    lower.includes("ikan") ||
    lower.includes("daging") ||
    lower.includes("udang") ||
    lower.includes("telur") ||
    lower.includes("salad ayam")
  )
    return "Lauk Hewani";

  // Lauk Nabati
  if (
    lower.includes("tempe") ||
    lower.includes("tahu") ||
    lower.includes("pepes")
  )
    return "Lauk Nabati";

  // Salad
  if (lower.includes("salad")) return "Salad";

  return "Lainnya";
}
