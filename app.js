/* ─── Fino Masque DZ — Landing logic ──────────
   - Gallery thumbnail switcher
   - Wilaya → commune cascade
   - Auto-update total with shipping by wilaya
   - Algerian phone validation (05/06/07 + 8 digits)
   - Submit to Google Apps Script webhook
─────────────────────────────────────────────── */

// ⚠️ REMPLACE par ton URL Apps Script (voir webhook-google-apps-script.gs)
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzuz5PrOuB80NAQJqBZSStRV6ZKA7QavVK_0dd9TndF0bcN5WVIWVGEXBmvF2Y5BGZBVQ/exec";

// Page Facebook — redirection après commande validée (anti double-commande)
const FACEBOOK_PAGE_URL = "https://www.facebook.com/profile.php?id=61574647624792";
const REDIRECT_DELAY_SECONDS = 3;

const PRODUCT_NAME = "Fino Premium Touch — ماسك الشعر الياباني 230g";
const PRODUCT_ID = "fino-masque-230g";

const DEBUG = /localhost|127\.0\.0\.1/.test(location.hostname);
function dlog(){ if (DEBUG) console.warn.apply(console, arguments); }

if (WEBHOOK_URL.includes('REPLACE_WITH') || !/^https:\/\/script\.google\.com\//.test(WEBHOOK_URL)) {
  console.error('Fino: WEBHOOK_URL not configured');
  document.addEventListener('DOMContentLoaded', () => {
    if (els.submitBtn) { els.submitBtn.disabled = true; els.submitBtn.textContent = '⚠️ النموذج غير مفعّل — اتصلي بنا'; }
  });
}

const els = {
  galleryMain: document.getElementById("galleryMain"),
  thumbs: document.querySelectorAll(".thumb"),
  form: document.getElementById("orderForm"),
  fullName: document.getElementById("fullName"),
  phone: document.getElementById("phone"),
  wilaya: document.getElementById("wilaya"),
  commune: document.getElementById("commune"),
  address: document.getElementById("address"),
  quantity: document.getElementById("quantity"),
  sumProduct: document.getElementById("sumProduct"),
  sumShipping: document.getElementById("sumShipping"),
  sumShippingNote: document.getElementById("sumShippingNote"),
  sumTotal: document.getElementById("sumTotal"),
  submitBtn: document.getElementById("submitBtn"),
  formSuccess: document.getElementById("formSuccess"),
  formError: document.getElementById("formError"),
  priceRelay: document.getElementById("priceRelay"),
  priceHome: document.getElementById("priceHome"),
};

const deliveryRadios = document.querySelectorAll('input[name="deliveryType"]');
function getDeliveryType() {
  const checked = document.querySelector('input[name="deliveryType"]:checked');
  return checked ? checked.value : "home";
}

let WILAYAS = [];

const fmt = (n) => Math.round(n) + " دج";

// ─── Attribution helpers (UTM, fbclid, _fbp, _fbc, referrer, UA) ─
function getCookie(n){return (document.cookie.match(new RegExp('(?:^|; )'+n+'=([^;]*)'))||[])[1]||'';}
function getAttribution(){
  const u = new URL(location.href);
  return {
    utm_source: u.searchParams.get('utm_source')||'',
    utm_medium: u.searchParams.get('utm_medium')||'',
    utm_campaign: u.searchParams.get('utm_campaign')||'',
    utm_content: u.searchParams.get('utm_content')||'',
    utm_term: u.searchParams.get('utm_term')||'',
    fbclid: u.searchParams.get('fbclid')||'',
    fbp: getCookie('_fbp'),
    fbc: getCookie('_fbc'),
    referrer: document.referrer||'',
    pageUrl: location.href,
    userAgent: navigator.userAgent
  };
}

// ─── Gallery thumbnail switcher ─────────────
els.thumbs.forEach((btn) => {
  btn.addEventListener("click", () => {
    const src = btn.getAttribute("data-src");
    els.galleryMain.src = src;
    els.thumbs.forEach((b) => {
      b.classList.remove("thumb--active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("thumb--active");
    btn.setAttribute("aria-pressed", "true");
  });
});

// ─── Load wilayas + communes from JSON ──────
async function loadWilayas() {
  try {
    const res = await fetch("wilayas-communes.json", { cache: "no-cache" });
    const data = await res.json();
    WILAYAS = data.wilayas || [];

    els.wilaya.innerHTML =
      '<option value="">— اختر الولاية —</option>' +
      WILAYAS.map(
        (w) =>
          `<option value="${w.code}" data-name-fr="${w.name_fr}">${w.code} - ${w.name_ar} (${w.name_fr})</option>`
      ).join("");
  } catch (err) {
    console.error("Erreur chargement wilayas-communes.json:", err);
    els.wilaya.innerHTML = '<option value="">⚠️ خطأ في تحميل الولايات</option>';
  }
}

// ─── Wilaya → commune cascade ───────────────
els.wilaya.addEventListener("change", () => {
  const code = els.wilaya.value;
  const w = WILAYAS.find((x) => x.code === code);

  if (!w) {
    els.commune.innerHTML = '<option value="">— اختر الولاية أولاً —</option>';
    els.commune.disabled = true;
    updateSummary();
    return;
  }

  els.commune.innerHTML =
    '<option value="">— اختر البلدية —</option>' +
    (w.communes || []).map((c) => `<option value="${c}">${c}</option>`).join("") +
    '<option value="__other__">أخرى (سأكتبها في العنوان)</option>';
  els.commune.disabled = false;

  updateSummary();
});

// ─── Quantity / wilaya / commune / delivery type → recompute summary ─
// Multiple events to catch all browser quirks (Safari iOS, in-app browsers)
els.quantity.addEventListener("change", updateSummary);
els.quantity.addEventListener("input", updateSummary);
els.commune.addEventListener("change", updateSummary);
deliveryRadios.forEach((r) => r.addEventListener("change", updateSummary));

// ─── Facebook Pixel: AddToCart (quantity change → mid-funnel retargeting) ─
if (els.quantity) {
  els.quantity.addEventListener('change', () => {
    if (typeof fbq !== 'function') return;
    const qty = parseInt(els.quantity.value,10)||1;
    const unit = parseInt(els.quantity.options[els.quantity.selectedIndex].getAttribute('data-unit'),10);
    fbq('track','AddToCart',{content_name:PRODUCT_NAME,content_ids:[PRODUCT_ID],content_type:'product',num_items:qty,value:unit*qty,currency:'DZD'}, {eventID:(window.__finoEvtId||'')+'-atc-'+qty});
  });
}

function updateSummary() {
  const qty = parseInt(els.quantity.value, 10) || 1;
  const unit = parseInt(
    els.quantity.options[els.quantity.selectedIndex].getAttribute("data-unit"),
    10
  );
  const product = unit * qty;
  els.sumProduct.textContent = fmt(product);

  const code = els.wilaya.value;
  const w = WILAYAS.find((x) => x.code === code);

  if (!w) {
    els.sumShipping.textContent = "—";
    els.sumShippingNote.textContent = "(اختر الولاية)";
    els.sumTotal.textContent = "—";
    if (els.priceRelay) els.priceRelay.textContent = "—";
    if (els.priceHome) els.priceHome.textContent = "—";
    return;
  }

  if (els.priceRelay) els.priceRelay.textContent = fmt(w.shipping_relay);
  if (els.priceHome) els.priceHome.textContent = fmt(w.shipping_home);

  const deliveryType = getDeliveryType();
  const shipping = deliveryType === "home" ? w.shipping_home : w.shipping_relay;
  const label = deliveryType === "home" ? "توصيل للمنزل" : "نقطة استلام";

  els.sumShipping.textContent = fmt(shipping);
  els.sumShippingNote.textContent = `(${w.name_ar} — ${label})`;
  els.sumTotal.textContent = fmt(product + shipping);
}

// ─── Validation helpers ─────────────────────
function setError(field, message) {
  const fieldEl = field.closest(".field");
  if (fieldEl) fieldEl.classList.add("field--invalid");
  const err = document.querySelector(`[data-error-for="${field.id}"]`);
  if (err) err.textContent = message;
}
function clearError(field) {
  const fieldEl = field.closest(".field");
  if (fieldEl) fieldEl.classList.remove("field--invalid");
  const err = document.querySelector(`[data-error-for="${field.id}"]`);
  if (err) err.textContent = "";
}
function clearAllErrors() {
  ["fullName", "phone", "wilaya", "commune", "address"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) clearError(el);
  });
}

function normalizePhone(raw) {
  return (raw || "").replace(/[\s.\-]/g, "");
}
function isValidDzPhone(raw) {
  const p = normalizePhone(raw);
  return /^0(5|6|7)[0-9]{8}$/.test(p);
}

function validate() {
  clearAllErrors();
  let ok = true;

  if (els.fullName.value.trim().length < 3) {
    setError(els.fullName, "الرجاء كتابة الاسم الكامل (3 حروف على الأقل)");
    ok = false;
  }
  if (!isValidDzPhone(els.phone.value)) {
    setError(els.phone, "رقم هاتف غير صحيح. مثال: 0555123456");
    ok = false;
  }
  if (!els.wilaya.value) {
    setError(els.wilaya, "الرجاء اختيار الولاية");
    ok = false;
  }
  if (!els.commune.value) {
    setError(els.commune, "الرجاء اختيار البلدية");
    ok = false;
  }
  if (els.address.value.trim().length < 10) {
    setError(els.address, "الرجاء كتابة العنوان التفصيلي (10 حروف على الأقل)");
    ok = false;
  }
  return ok;
}

// ─── Submit handler ─────────────────────────
els.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  els.formSuccess.hidden = true;
  els.formError.hidden = true;

  if (!validate()) {
    const first = document.querySelector(".field--invalid input, .field--invalid select, .field--invalid textarea");
    if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const qty = parseInt(els.quantity.value, 10) || 1;
  const unit = parseInt(
    els.quantity.options[els.quantity.selectedIndex].getAttribute("data-unit"),
    10
  );
  const wilayaCode = els.wilaya.value;
  const w = WILAYAS.find((x) => x.code === wilayaCode);
  const product = unit * qty;
  const deliveryType = getDeliveryType();
  const deliveryLabel = deliveryType === "home" ? "À domicile" : "Point Relais";
  const shipping = w
    ? (deliveryType === "home" ? w.shipping_home : w.shipping_relay) ?? 0
    : 0;
  const taggedAddress = `[${deliveryLabel}] ${els.address.value.trim()}`;

  // Generate Lead eventId BEFORE building payload so it's included in the POST body
  // (used for server-side CAPI dedup against the client-side Pixel Lead event below).
  const leadEventId = (window.__finoEvtId || ((crypto.randomUUID && crypto.randomUUID()) || String(Date.now())+Math.random().toString(36).slice(2))) + '-ld';

  const payload = {
    product: PRODUCT_NAME,
    fullName: els.fullName.value.trim(),
    phone: normalizePhone(els.phone.value),
    wilayaCode,
    wilayaNameAr: w ? w.name_ar : "",
    wilayaNameFr: w ? w.name_fr : "",
    commune: els.commune.value,
    address: taggedAddress,
    deliveryType,
    deliveryLabel,
    quantity: qty,
    unitPriceDA: unit,
    productPriceDA: product,
    shippingDA: shipping,
    totalDA: product + shipping,
    pageUrl: window.location.href,
    userAgent: navigator.userAgent,
    submittedAt: new Date().toISOString(),
    eventId: leadEventId,
  };

  // Merge attribution data (UTM, fbclid, _fbp, _fbc, referrer, UA) for back-office + CAPI
  Object.assign(payload, getAttribution());

  els.submitBtn.disabled = true;
  els.submitBtn.textContent = "⏳ جاري الإرسال...";

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    showSuccessPanel(payload);

    if (typeof fbq === "function") {
      fbq("track", "Lead", {
        content_name: PRODUCT_NAME,
        content_ids: [PRODUCT_ID],
        content_type: "product",
        content_category: "Beaute",
        num_items: payload.quantity,
        value: payload.totalDA,
        currency: "DZD",
      }, { eventID: leadEventId });
      // Purchase: fires on form submit (pragmatic MVP — includes no-shows but gives Meta signal to optimize).
      // To be replaced by CAPI server-side fire (on operator status='confirmé') once CAPI token configured.
      fbq("track", "Purchase", {
        content_name: PRODUCT_NAME,
        content_ids: [PRODUCT_ID],
        content_type: "product",
        content_category: "Beaute",
        num_items: payload.quantity,
        value: payload.totalDA,
        currency: "DZD",
      }, { eventID: leadEventId.replace('-ld', '-pur') });
    }
  } catch (err) {
    dlog("Submit error:", err);
    els.formError.hidden = false;
    els.formError.scrollIntoView({ behavior: "smooth", block: "center" });
    els.submitBtn.disabled = false;
    els.submitBtn.textContent = "✅ أكّدي الطلب — تدفعي غير كي يوصلك";
  }
});

// ─── Success panel + redirect to Facebook page ──
function showSuccessPanel(payload) {
  document.getElementById("successName").textContent = payload.fullName;
  document.getElementById("successPhone").textContent = payload.phone;
  document.getElementById("successProduct").textContent = "Fino Premium Touch";
  document.getElementById("successQty").textContent = payload.quantity + " قطعة";
  document.getElementById("successTotal").textContent = payload.totalDA.toLocaleString("fr-FR") + " دج";

  els.form.style.display = "none";
  els.formError.hidden = true;
  els.formSuccess.hidden = false;
  els.formSuccess.scrollIntoView({ behavior: "smooth", block: "start" });

  let remaining = REDIRECT_DELAY_SECONDS;
  const countdownEl = document.getElementById("successCountdown");
  countdownEl.textContent = remaining;
  const timer = setInterval(() => {
    remaining -= 1;
    countdownEl.textContent = remaining;
    if (remaining <= 0) {
      clearInterval(timer);
      window.location.href = FACEBOOK_PAGE_URL;
    }
  }, 1000);
}

// ─── Facebook Pixel: InitiateCheckout (1ère interaction avec le formulaire) ─
let checkoutInitiated = false;
function trackInitiateCheckout() {
  if (checkoutInitiated || typeof fbq !== "function") return;
  checkoutInitiated = true;
  const qty = parseInt(els.quantity.value, 10) || 1;
  const unit = parseInt(
    els.quantity.options[els.quantity.selectedIndex].getAttribute("data-unit"),
    10
  );
  fbq("track", "InitiateCheckout", {
    content_name: PRODUCT_NAME,
    content_ids: [PRODUCT_ID],
    content_type: "product",
    num_items: qty,
    value: unit * qty,
    currency: "DZD",
  }, {eventID: (window.__finoEvtId || "fino") + "-ic"});
}
[els.fullName, els.phone, els.wilaya, els.address].forEach((f) => {
  if (f) f.addEventListener("focus", trackInitiateCheckout, { once: true });
});

// ─── Live validation feedback (UX) ──────────
[els.fullName, els.phone, els.address].forEach((f) => {
  f.addEventListener("input", () => clearError(f));
});
[els.wilaya, els.commune].forEach((f) => {
  f.addEventListener("change", () => clearError(f));
});

// ─── Init ───────────────────────────────────
loadWilayas().then(updateSummary);

// ─── Sticky mobile CTA — hide when form in viewport ──
const _sCta = document.getElementById('stickyCta');
const _of = document.getElementById('order-form');
if (_sCta && _of && 'IntersectionObserver' in window){
  new IntersectionObserver(([e])=>_sCta.classList.toggle('is-hidden', e.isIntersecting),{threshold:.1}).observe(_of);
}
