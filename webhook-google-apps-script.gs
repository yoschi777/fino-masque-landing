/**
 * Fino Masque DZ — Webhook Google Apps Script
 *
 * Reçoit les commandes COD depuis la landing page et les écrit dans le Sheet actif.
 *
 * ── INSTALLATION ──────────────────────────────────────────
 *  1. Ouvre ton Google Sheet (que tu viens de créer)
 *  2. Menu : Extensions → Apps Script
 *  3. Efface le code existant et colle TOUT ce fichier
 *  4. Sauvegarde (Ctrl+S) — donne un nom au projet "Fino Masque Webhook"
 *  5. Clique en haut à droite : "Deploy" → "New deployment"
 *     - Type : Web app (icône engrenage)
 *     - Description : "Fino Webhook v1"
 *     - Execute as : Me (ton compte Google)
 *     - Who has access : ANYONE  ← OBLIGATOIRE
 *  6. Clique "Deploy" → autorise les permissions demandées
 *  7. Copie l'URL "Web app" affichée (format : https://script.google.com/macros/s/AKfyc.../exec)
 *  8. Colle cette URL dans app.js ligne 11 :
 *        const WEBHOOK_URL = "ICI";
 *  9. Test : ouvre l'URL Web app dans ton navigateur — doit afficher "Fino webhook OK"
 * 10. Test commande : soumets un faux ordre depuis ta landing → ligne apparaît dans le Sheet
 *
 * ── OPTIONS AVANCÉES ──────────────────────────────────────
 *  • NOTIFY_EMAIL : email où recevoir une notif à chaque commande (laisse "" pour désactiver)
 *  • DEDUP_MINUTES : fenêtre anti-doublon par téléphone (0 = désactivé)
 *  • Sécurité : "Anyone" est obligatoire car le navigateur du visiteur POST directement
 *    (pas de backend intermédiaire). C'est public en POST uniquement, pas en lecture.
 */

// ─── CONFIG ──────────────────────────────────────────────────
const NOTIFY_EMAIL = "";          // ex: "moi@example.com" pour recevoir notif à chaque commande
const DEDUP_MINUTES = 5;          // anti-doublon : même tel < N min = marqué "⚠️ doublon"
const SHEET_NAME = "Fino - Commandes";   // nom de l'onglet (créé auto si absent)
const PRODUCT_NAME = "Fino Premium Touch — ماسك الشعر الياباني 230g"; // fallback si payload.product absent
const BRAND_COLOR = "#b48a5a";    // Fino gold (pour header)

// ─── HEADERS ─────────────────────────────────────────────────
const HEADERS = [
  "Date réception",
  "Produit",
  "Nom complet",
  "Téléphone",
  "Wilaya (code)",
  "Wilaya (ar)",
  "Wilaya (fr)",
  "Commune",
  "Adresse",
  "Type livraison",
  "Quantité",
  "Prix unitaire (DA)",
  "Prix produit (DA)",
  "Livraison (DA)",
  "Total (DA)",
  "Page",
  "User-Agent",
  "Soumis le (ISO)",
  "Statut",
  "Agent assigné",
  "Tentative 1",
  "Tentative 2",
  "Tentative 3",
  "Résultat final",
  "Notes agent",
  "Bordereau #",
  "eventId",
  "utm_source",
  "utm_campaign",
  "fbclid",
  "fbp",
  "fbc",
];

// ─── ENTRY POINT (POST from landing page) ────────────────────
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Init header row (first run)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet
        .getRange(1, 1, 1, HEADERS.length)
        .setFontWeight("bold")
        .setBackground(BRAND_COLOR)
        .setFontColor("white")
        .setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
      // Reasonable column widths
      sheet.setColumnWidth(1, 140); // date
      sheet.setColumnWidth(2, 180); // produit
      sheet.setColumnWidth(3, 160); // nom
      sheet.setColumnWidth(4, 120); // tel
      sheet.setColumnWidth(9, 280); // adresse
      sheet.setColumnWidth(16, 200); // page
      sheet.setColumnWidth(17, 250); // UA
      sheet.setColumnWidth(19, 130); // statut
    }

    // Dedup check: same phone in last N minutes ?
    let dupTag = "";
    if (DEDUP_MINUTES > 0 && sheet.getLastRow() > 1) {
      const lastRows = Math.min(50, sheet.getLastRow() - 1);
      const range = sheet
        .getRange(sheet.getLastRow() - lastRows + 1, 1, lastRows, 4)
        .getValues(); // cols A..D = date, produit, nom, tel
      const cutoff = Date.now() - DEDUP_MINUTES * 60 * 1000;
      const phone = String(payload.phone || "").trim();
      const dup = range.some(
        (r) => r[3] && String(r[3]).trim() === phone && new Date(r[0]).getTime() >= cutoff
      );
      if (dup) dupTag = "⚠️ doublon";
    }

    const statut = dupTag || "🆕 nouveau";

    sheet.appendRow([
      new Date(),
      payload.product || PRODUCT_NAME,
      payload.fullName || "",
      payload.phone || "",
      payload.wilayaCode || "",
      payload.wilayaNameAr || "",
      payload.wilayaNameFr || "",
      payload.commune || "",
      payload.address || "",
      payload.deliveryLabel || payload.deliveryType || "",
      payload.quantity || 0,
      payload.unitPriceDA || 0,
      payload.productPriceDA || 0,
      payload.shippingDA || 0,
      payload.totalDA || 0,
      payload.pageUrl || "",
      payload.userAgent || "",
      payload.submittedAt || "",
      statut,
      // Call-center columns (agents fill these in manually)
      "", // Agent assigné
      "", // Tentative 1
      "", // Tentative 2
      "", // Tentative 3
      "", // Résultat final
      "", // Notes agent
      "", // Bordereau #
      // Attribution columns (from payload)
      payload.eventId || "",
      payload.utm_source || "",
      payload.utm_campaign || "",
      payload.fbclid || "",
      payload.fbp || "",
      payload.fbc || "",
    ]);

    // Optional email notification
    if (NOTIFY_EMAIL) {
      try {
        const subject = "Nouvelle commande Fino — " + payload.fullName;
        const body = [
          `Nouvelle commande COD reçue ${dupTag ? "(⚠️ doublon possible)" : ""}`,
          ``,
          `Client : ${payload.fullName}`,
          `Tél    : ${payload.phone}`,
          `Wilaya : ${payload.wilayaNameAr} (${payload.wilayaCode}) — ${payload.commune}`,
          `Adresse: ${payload.address}`,
          ``,
          `Produit  : ${payload.product}`,
          `Qté      : ${payload.quantity}`,
          `Livraison: ${payload.deliveryLabel}`,
          `TOTAL    : ${payload.totalDA} DA`,
          ``,
          `Voir Sheet: ${ss.getUrl()}`,
        ].join("\n");
        MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
      } catch (mailErr) {
        Logger.log("Mail send failed: " + mailErr);
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, statut }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Health check — ouvre l'URL Web app dans ton navigateur pour vérifier que le script est déployé
function doGet() {
  return ContentService
    .createTextOutput("Fino Masque webhook OK — utilise POST pour envoyer une commande.")
    .setMimeType(ContentService.MimeType.TEXT);
}
