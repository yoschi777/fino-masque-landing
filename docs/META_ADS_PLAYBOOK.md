# 🎯 Fino Masque DZ — Meta Ads Playbook MVP

Playbook complet pour lancer la première campagne Fino sur Meta Ads (Facebook + Instagram).
Format : **MVP test 7 jours**, budget contrôlé, identification du créative gagnant avant scale.

> **Lis ce doc avant de cliquer sur "Créer une campagne".** Toutes les valeurs à utiliser sont notées noir sur blanc.

---

## ⚡ Quick reference (à coller dans un sticky note)

```
Pixel ID          : 2142594929860134
Page Facebook     : facebook.com/profile.php?id=61574647624792
Domain landing    : https://finomasquedz.netlify.app/
Webhook OK        : ✅ deployed, 32 cols, attribution OK
Conversion event  : Lead (form submit)
Default placement : Facebook Feed + Instagram Feed
Default audience  : Broad DZ, Women, 22-45
Default budget    : 10€/jour CBO
Default duration  : 7 jours puis kill/scale
KPI clés          : CTR > 1.5%, CPL < 800 DA, ROAS > 1.8
```

---

## 📋 1. PRE-FLIGHT CHECKLIST (avant de cliquer "Créer")

Coche ces 12 points AVANT de lancer la 1ère pub. Si un point n'est pas vert, NE LANCE PAS.

### Tracking
- [ ] Pixel `2142594929860134` chargé sur la landing (vérifié via Meta Pixel Helper Chrome extension)
- [ ] Events PageView + ViewContent firent au load
- [ ] InitiateCheckout fire au focus du 1er champ form
- [ ] AddToCart fire au changement de quantité
- [ ] Lead fire au submit success
- [ ] eventID dédup présent sur chaque event (pour CAPI futur)

### Landing
- [ ] Landing hébergée sur HTTPS (Netlify : ✅ par défaut)
- [ ] Mobile portrait testé sur vrai téléphone (Android Chrome + Safari iOS si possible)
- [ ] Form complet bout en bout (téléphone réel → ligne dans le Sheet)
- [ ] Webhook répond `{ok:true}` au POST
- [ ] Redirection post-order vers page Facebook OK

### Compliance
- [ ] Aucune mention "Shiseido" sur la landing (= softened OK)
- [ ] Pas de claim médical/santé non prouvé ("guérit", "100% scientifique")
- [ ] Politique de confidentialité (à ajouter post-MVP)
- [ ] Mentions légales DZ (Loi 18-05) — manquantes : à ajouter post-MVP

### Compte Meta
- [ ] Compte business vérifié (pas d'avertissement actif)
- [ ] Méthode de paiement valide
- [ ] Domain `finomasquedz.netlify.app` verifié dans Business Settings → Brand Safety → Domains
- [ ] Page Facebook avec ≥10 posts organiques (sinon Meta flag "page fraîche")

---

## 🏷️ 2. NAMING CONVENTIONS

**Pourquoi c'est critique :** dans 2 mois quand tu auras 30 ad sets, tu dois savoir d'un coup d'œil qui performe. Sans naming, tu perds 30 min par jour à comprendre tes données.

### Format universel

```
[PRODUCT]_[OBJECTIVE]_[FUNNEL]_[YEAR-WEEK]            ← Campaign
[PRODUCT]_[AUDIENCE]_[GEO]_[PLACEMENT]_[BUDGET]       ← Ad Set
[PRODUCT]_[ANGLE]_[CREATIVE-ID]_[VERSION]             ← Ad
```

### Exemples concrets (à copier-coller)

**Campaign** (1 seule pour le MVP) :
```
FINO_Conv_MVP_2026W23
```

**Ad Set** (1 seule pour MVP, on teste TOUTES les créatives dans le même AS pour CBO) :
```
FINO_Broad_DZ-W22-45_FBIG-Feed_10$
```

**Ads** (5 ads, un par angle créative) :
```
FINO_Pain_A_v1
FINO_Promise_B_v1
FINO_SocialProof_C_v1
FINO_Mechanism_D_v1
FINO_Urgency_E_v1
```

### Dictionnaire des codes

| Champ | Valeurs possibles |
|-------|-------------------|
| **PRODUCT** | `FINO`, `MAGIC` (Magic Mesh), futur produit |
| **OBJECTIVE** | `Conv` (conversion), `Traffic`, `Engagement`, `Awareness` |
| **FUNNEL** | `MVP` (1st test), `Scale` (post-winner), `Retarget`, `LAL-1pct` (lookalike 1%) |
| **AUDIENCE** | `Broad`, `Interest-Beauty`, `LAL-Purchase-1pct`, `Retarget-PageViewers` |
| **GEO** | `DZ-W22-45`, `DZ-North`, `DZ-Algiers-Only`, `DZ-Maghreb` |
| **PLACEMENT** | `FBIG-Feed`, `FBIG-All`, `IG-Reels-Only`, `FB-Feed-Only` |
| **BUDGET** | `5$`, `10$`, `25$`, `100$/day` |
| **ANGLE** | `Pain`, `Promise`, `SocialProof`, `Mechanism`, `Urgency`, `BeforeAfter`, `Testimonial` |
| **CREATIVE-ID** | `A`, `B`, `C`, `D`, `E` (lettres pour images, `V1`, `V2` pour vidéos plus tard) |
| **VERSION** | `v1`, `v2`, `v3` (incrémente quand tu fais une variation du même angle) |

---

## 🎯 3. STRUCTURE CAMPAGNE (MVP)

### Vue d'ensemble

```
📁 Campaign : FINO_Conv_MVP_2026W23
    └─ Budget CBO (Campaign Budget Optimization) : 10$/jour
    │
    └─ 📁 Ad Set : FINO_Broad_DZ-W22-45_FBIG-Feed_10$
        └─ Audience : Broad (women, 22-45, DZ)
        └─ Placement : FB Feed + IG Feed only
        └─ Optimization : Conversions → Lead event
        │
        ├─ 📌 Ad : FINO_Pain_A_v1        (image A)
        ├─ 📌 Ad : FINO_Promise_B_v1     (image B)
        ├─ 📌 Ad : FINO_SocialProof_C_v1 (image C)
        ├─ 📌 Ad : FINO_Mechanism_D_v1   (image D)
        └─ 📌 Ad : FINO_Urgency_E_v1     (image E)
```

### Pourquoi cette structure (CBO + 1 ad set + 5 ads)

| Question | Réponse |
|----------|---------|
| Pourquoi 1 seule ad set ? | Pour l'MVP, on **teste les créatives**, pas les audiences. 1 ad set = 1 audience = on isole la variable créative. |
| Pourquoi CBO et pas ABO ? | CBO laisse Meta distribuer les 10$ vers la créative qui marche le mieux. ABO te force à splitter à la main. Pour MVP cold Pixel = CBO ✅. |
| Pourquoi 5 ads dans 1 ad set ? | Meta a besoin de min 3 ads par ad set pour faire de l'A/B. 5 est le sweet spot pour identifier le winner. |
| Pourquoi Conversions → Lead pas Purchase ? | Le Pixel est jeune, on n'a pas encore 50 Purchases. Lead (form submit) est notre événement le plus fiable. |
| Quand passer en Purchase optimization ? | Après 50 Purchases vérifiés en 7 jours (typiquement post-MVP, après scaling). |

---

## 👥 4. AUDIENCE PRESETS (à créer dans Business Manager > Audiences)

### Audience 1 : Broad DZ Femmes (utilisée pour MVP)

À créer dans Audience > Create > Saved Audience :

| Paramètre | Valeur |
|-----------|--------|
| **Saved Audience Name** | `DZ_Women_22-45_Broad` |
| **Custom Audiences** | (aucune — c'est pour cold traffic) |
| **Locations** | Algeria (entire country) |
| **Age** | 22 — 45 |
| **Gender** | Women only |
| **Languages** | Arabic + French (pour les femmes algériennes bilingues) |
| **Detailed Targeting** | LAISSER VIDE ⚠️ |
| **Connections** | (none) |
| **Advantage detailed targeting** | ✅ ON (laisse Meta élargir) |

**Audience size estimée** : ~6-8 millions de femmes algériennes 22-45 actives sur Meta. C'est large = parfait pour CBO MVP.

### Audience 2 : Retargeting (à créer maintenant, à utiliser post-MVP)

À créer dans Audience > Create > Custom Audience > Website :

| Paramètre | Valeur |
|-----------|--------|
| **Name** | `Fino_Web_ViewContent_30d` |
| **Source** | Pixel `2142594929860134` |
| **Event** | ViewContent |
| **Retention** | 30 days |

Et une 2ème :

| Paramètre | Valeur |
|-----------|--------|
| **Name** | `Fino_Web_AddToCart_NotLead_14d` |
| **Source** | Pixel `2142594929860134` |
| **Event** | AddToCart |
| **EXCLUDE event** | Lead |
| **Retention** | 14 days |

→ Cette 2ème est l'or pur : ce sont les gens qui ont changé la quantité mais n'ont pas soumis. Retargete-les avec un coupon code dans 7-14 jours.

### Audience 3 : Lookalike (à créer après 100+ Leads, post-MVP)

| Paramètre | Valeur |
|-----------|--------|
| **Name** | `Fino_LAL_DZ_Lead_1pct` |
| **Source** | Custom Audience `Fino_Web_Lead_180d` |
| **Location** | Algeria |
| **Size** | 1% |

---

## 📍 5. PLACEMENTS (Manual, pas Advantage+ pour MVP)

### Ce qu'il faut COCHER

| Plateforme | Placement | Cocher ? | Raison |
|------------|-----------|----------|--------|
| Facebook | Feed | ✅ OUI | Placement n°1 pour image statique 1080×1080 |
| Facebook | Marketplace | ❌ NON | Audience commerçante, mauvaise qualité pour beauté |
| Facebook | Video Feeds | ❌ NON | C'est pour vidéo, pas image |
| Facebook | Right Column | ❌ NON | Vieux placement desktop, low quality |
| Facebook | Instant Articles | ❌ NON | News context, distract |
| Facebook | In-stream Videos | ❌ NON | Vidéos uniquement |
| Facebook | Search Results | ❌ NON | Intent-based, pas adapté à cold |
| Instagram | Feed | ✅ OUI | Idéal pour beauté (visuel-first) |
| Instagram | Explore | ⚠️ OPTIONNEL | OK mais low quality, à tester semaine 2 |
| Instagram | Stories | ❌ NON | Vertical 9:16, ton image est 1:1 |
| Instagram | Reels | ❌ NON | Vertical + format vidéo |
| Instagram | Shop | ❌ NON | Pas de catalog produit configuré |
| Audience Network | Tout | ❌ NON | Trafic poubelle |
| Messenger | Tout | ❌ NON | Pas pour cold |

### Résumé en 1 ligne
> **Manual placements → Cocher uniquement : Facebook Feed + Instagram Feed**

---

## 💰 6. BUDGET PLAN 7 JOURS

### Jour 1-3 : Test (30$ total)

```
Budget CBO       : 10$/jour
Total 3 jours    : 30$
Bid strategy     : Lowest cost (laisse Meta apprendre)
Schedule         : Run continuously (pas de dayparting au début)
Optimization     : Maximize conversions
Conversion window: 7 days click + 1 day view
```

### Jour 4 : Décision (analyse 0$)

Connect au matin, vérifie ces metrics par ad :

```
Pour CHAQUE ad (FINO_Pain_A_v1, etc.) :
  CTR (link click)        : > 1.5%  → garder
                            < 0.8%  → killer
  CPM                     : < 350 DA → bon signal
  CPL (cost per Lead)     : < 800 DA → garder
                            > 1500 DA → killer
  Frequency               : < 2     → OK
                            > 3     → fatigué, refresh créa
```

**Action Jour 4 (15 min) :**
1. Pause les ads en dessous des seuils (généralement 2-3 sur 5)
2. Garde les 2-3 winners
3. Si CBO a déjà alloué 60%+ du budget sur 1 ad → c'est le winner clair

### Jour 5-7 : Scale léger (60$ total)

```
Budget CBO       : 20$/jour (×2 vs Jour 1-3)
Total 3 jours    : 60$
Ads actives     : 2-3 winners du Jour 4
Rien d'autre changer (laisse l'algo respirer)
```

### Total MVP : 90$ sur 7 jours

À ~140 DZD/USD = environ **12 600 DZD** pour identifier ton créative gagnant + obtenir tes 1ers Leads.

### Conversion attendue (réaliste pour MVP cold)

```
Spend         : 90$ (12 600 DZD)
CTR moyen     : 1.2-2%
CPL moyen     : 600-1200 DZD
Leads totaux  : 10-21
No-show COD   : 30-50%
Purchases     : 5-12
Revenue       : 5×4300 = 21 500 DZD (min)
              : 12×7500 = 90 000 DZD (max)
ROAS estimé   : 1.7×-7× (large fourchette, normal en MVP)
```

→ **Tu as la réponse au Jour 7** : continuer scale, ou pivoter angle/produit.

---

## 📊 7. KPI DASHBOARD QUOTIDIEN

À ouvrir CHAQUE matin (5 min). Note ces 5 metrics dans un Google Sheet :

| Metric | Bon | OK | Mauvais |
|--------|-----|-----|---------|
| **CPM** (cost per 1000 impressions) | < 250 DA | 250-400 | > 500 |
| **CTR** (link click rate) | > 1.8% | 1-1.8% | < 0.8% |
| **CPL** (cost per Lead) | < 600 DA | 600-1000 | > 1500 |
| **Frequency** (avg impressions/user) | 1-2 | 2-3 | > 3.5 |
| **% Lead-to-Purchase** (Sheet status confirmé) | > 60% | 40-60% | < 30% |

### Quand prendre action

| Signal | Action |
|--------|--------|
| Frequency > 3.5 | Créative fatiguée → préparer variation v2 |
| CTR baisse 30% sur 2 jours | Idem → variation |
| CPL stable mais % Purchase < 30% | Problème call-center ou messaging post-clic |
| 1 ad > 60% du spend (CBO) | C'est le winner → préparer scaling |
| Toutes les ads sous seuils min | Problème de produit/landing, pas créative |

---

## 🛡️ 8. ANTI-BAN BEST PRACTICES (Important pour Fino IP-sensible)

Fino = produit Shiseido = Meta scanne pour brand abuse. Voici comment ne PAS te faire ban :

### À FAIRE ✅

- Utiliser **TES propres photos produit** (la fino-hero.jpg nettoyée, sans sticker)
- Brand = juste "Fino" sur la créative (pas "Shiseido", pas "Premium")
- Mentions "ماسك ياباني" OK (descriptif, pas brand claim)
- Page FB avec contenu organique régulier (3-5 posts/semaine min)
- Ad copy = focus bénéfice, pas claim médical
- Compte business âgé > 30 jours avant de spend > 50$/jour
- Méthode de paiement vérifiée (carte, pas Paypal)

### À NE PAS FAIRE ❌

- ❌ Copier vidéo YouTube/TikTok d'autre vendeur (Music Match + face detection)
- ❌ Utiliser logo Shiseido sur la créative
- ❌ Promettre "100% médical", "approuvé OMS", "guérit tout"
- ❌ Avant/après dramatique (Meta ban beauté avec "before/after" too obvious)
- ❌ Lancer 10$/jour sur un compte fraîchement créé (warm-up obligatoire)
- ❌ Modifier la créative gagnante en plein vol (perd l'apprentissage)
- ❌ Spam de creative similaires (rejected as duplicate)

### Si Meta flag ton ad

1. Lire le motif exact dans Account Quality
2. Ne PAS appel automatique en panique — analyser d'abord
3. Si "Pharmacy & supplements" → enlever toute mention médicale
4. Si "Personal attributes" → enlever "tu as les cheveux secs" → utiliser "le shampooing Fino"
5. Si "Brand IP" → vérifier qu'aucun logo concurrent n'apparaît
6. Réécrire ad copy + resubmit
7. Si déclenché 3× sur même ad account → ouvrir un 2nd account (Business Manager autorise jusqu'à 5)

---

## 🚀 9. STEP-BY-STEP : Créer ta campagne (15 min)

Ouvre [adsmanager.facebook.com](https://adsmanager.facebook.com) → bouton vert **+ Créer**.

### Étape 1 : Choix de l'objectif (10s)

```
[ ] Awareness
[ ] Traffic
[ ] Engagement
[ ] Leads
[x] SALES  ← coche celle-ci
[ ] App promotion
```

Clique **Continuer**.

### Étape 2 : Campaign settings (1 min)

```
Campaign name           : FINO_Conv_MVP_2026W23
Special ad categories  : (aucune — pas crédit/emploi/politique/logement)
Buying type            : Auction
Campaign objective     : Sales (déjà coché)
Advantage campaign budget (CBO): ✅ ON
   → Daily budget      : 10$ USD (≈ 1400 DA)
Schedule               : Start: now • End: dans 7 jours
Campaign bid strategy  : Highest volume (= Lowest cost)
A/B test               : ❌ NON pour MVP
```

Clique **Next**.

### Étape 3 : Ad Set settings (3 min)

```
Ad set name           : FINO_Broad_DZ-W22-45_FBIG-Feed_10$
Conversion location   : Website
Performance goal      : Maximize number of conversions
Pixel                 : Fino (2142594929860134) ← choisir le bon
Conversion event      : Lead ← important !
Cost per result goal  : laisser vide (laisse Meta optimiser)
Dynamic creative      : ❌ NON (on contrôle nos 5 ads)

Budget & schedule     : (hérité du CBO campaign)

Audience controls     :
  Location            : Algeria (uniquement)
  Age                 : 22 — 45
  Gender              : Women
  Detailed targeting  : (vide — broad)
  Languages           : Arabic + French
  Advantage+ audience : ✅ ON (élargit intelligemment)

Placements            : Manual placements
  ✅ Facebook → Feeds → Facebook Feed
  ✅ Instagram → Feeds → Instagram Feed
  ❌ Tout le reste désactivé

Brand safety          :
  Inventory filter   : Standard
  Block lists        : (rien)

Optimisation & delivery:
  Performance goal    : Maximize conversions
  Conversion window   : 7 days after clicking
  Attribution setting : 7-day click or 1-day view (default)
```

Clique **Next**.

### Étape 4 : Créer la 1ère ad (5 min)

```
Identity              :
  Facebook Page      : Magic Mesh DZ (page partagée, ID 61574647624792)
  Instagram account  : (lier ton compte IG si tu en as un, sinon "Use Facebook Page")

Ad name              : FINO_Pain_A_v1
Format               : Single image or video → Image
Image                : Upload ad-A-pain.jpg (depuis creatives/ads/)

Texte principal      : (copie depuis /docs/AD_COPY.md, section A — voir plus bas)
Titre                : (idem)
Description          : (idem)

Call-to-action       : Acheter (Shop now)
Website URL          : https://finomasquedz.netlify.app/?utm_source=facebook&utm_medium=cpc&utm_campaign=FINO_Conv_MVP_2026W23&utm_content=Pain_A
Display link         : finomasquedz.netlify.app

Languages            : (Arabic — laisse Meta auto-translate=OFF)
Tracking             :
  ✅ Facebook pixel: Fino (2142594929860134)
  Conversion API   : (pas configuré pour MVP, on activera post-launch)
  ✅ URL parameters: rien à ajouter (déjà dans URL ci-dessus)
```

### Étape 5 : Dupliquer pour les 4 autres ads (5 min)

Pour les ads B, C, D, E :
1. Clique **Save & Publish** sur la 1ère
2. Retourne dans Ad Set → "Create Ad" → Dupliquer
3. Change : Ad name + Image + Texte + UTM `utm_content=`
4. Repeat ×4

UTM par ad :
- A : `utm_content=Pain_A`
- B : `utm_content=Promise_B`
- C : `utm_content=SocialProof_C`
- D : `utm_content=Mechanism_D`
- E : `utm_content=Urgency_E`

### Étape 6 : Review final + Submit

Avant de cliquer **Publish All** :
- [ ] Tous les ads ont un nom unique
- [ ] Tous pointent vers la bonne URL avec UTM
- [ ] Pixel Fino sélectionné sur tous
- [ ] Conversion event = Lead sur tous
- [ ] Budget Campaign = 10$/jour
- [ ] Schedule = 7 jours
- [ ] Placement = Feed FB + Feed IG only

Clique **Publish all** → Meta review (30 min à 24h, souvent < 2h) → Live.

---

## 📞 10. CALL-CENTER WORKFLOW (Important pour COD)

Quand un Lead arrive dans le Sheet (col Statut = "🆕 nouveau"), voici le workflow recommandé :

### Dans le Sheet Google :

| Colonne | Action |
|---------|--------|
| Agent assigné | Mettre le nom de qui appelle (toi pour MVP) |
| Tentative 1 | Heure de l'appel + résultat (✓ confirmé / ✗ no answer / 🔁 rappeler) |
| Tentative 2 | (si Tentative 1 = no answer, 2h plus tard) |
| Tentative 3 | (si toujours rien, lendemain) |
| Résultat final | ✅ Confirmé / ❌ Annulé / 🚚 Livré / 💰 Payé / 🚫 Refusé |
| Notes agent | Détails ("préfère livraison après 18h", "demande 2 packs", etc.) |
| Bordereau # | Numéro de tracking transporteur (Yalidine, ZR, etc.) |

### SLA recommandé

- **Tentative 1** : dans les 2h après réception du lead (taux confirmation chute après 4h)
- **Tentative 2** : 24h après si pas répondu
- **Tentative 3** : 48h après → si toujours rien, marquer "Résultat = ❌ ne répond pas"

### Taux benchmark Algérie COD

```
Confirmation rate       : 60-75% (de Lead → Confirmé)
Delivery success rate   : 70-85% (de Confirmé → Livré)
Payment rate            : 90-98% (de Livré → Payé)
Net Purchase rate       : 60% × 80% × 95% ≈ 45% des Leads
```

→ Sur 20 Leads MVP, attends-toi à **8-10 Purchases payés**.

---

## 📈 11. POST-MVP : Roadmap scaling (semaines 2-4)

Une fois le winner identifié (Jour 7) :

### Semaine 2 : Variation du winner
- Créer 3 variantes du créative gagnant (couleur, copy, angle léger)
- Nouvelle ad set : `FINO_Conv_Scale_W24` budget 25$/jour
- Tester les variantes contre le winner v1

### Semaine 3 : Lookalike
- 100+ Leads accumulés → créer LAL 1% Algeria from Leads
- Nouvelle ad set : `FINO_LAL-Lead-1pct_DZ-W22-45_FBIG-Feed_30$`
- Garder la broad ad set en parallèle

### Semaine 4 : Retargeting
- Activer Custom Audience `Fino_Web_AddToCart_NotLead_14d`
- Créative spéciale "coupon retargeting" — par exemple "-500 DA إذا طلبت اليوم"
- Budget bas : 5$/jour (petite audience)

### Semaine 5+ : Server-side CAPI
- Configurer CAPI dans Apps Script (token à générer)
- Switch optimization Lead → Purchase
- Lookalike Purchase 1% (plus précis que Lead LAL)

---

## ⚠️ 12. ERREURS COURANTES (à éviter)

| Erreur | Conséquence | Solution |
|--------|-------------|----------|
| 1 ad set par créative (ABO) | Budget gaspillé, mauvaise distribution Meta | CBO + toutes les ads dans 1 ad set |
| Audience trop pointue (interests stack) | Pixel cold → CPL explose | Broad pour les 1ers 7-14 jours |
| Optimiser sur Purchase trop tôt | Meta n'a pas assez d'événements → pause auto | Commencer Lead, switch Purchase après 50+ |
| Modifier les ads en cours | Reset learning phase, CPL × 2 temporairement | Attendre la fin d'apprentissage (50 conversions ou 7 jours) |
| Image trop chargée en texte | Reach réduit silencieusement | Vérifier < 15% via Meta Text Overlay tool |
| Lien manque UTMs | Impossible de tracker quel ad a converti | Toujours UTM même pour MVP |
| Page Facebook avec 0 posts | Meta flag "fake page" | Poster 5-10 posts organiques d'abord |
| Spend > 50$/jour sur compte de < 30 jours | Trigger fraud detection auto | Ramp lentement : 5→10→20→50 sur 2 semaines |

---

## 🆘 Si Meta bloque ton ad : Plan B

1. Ne pas paniquer, lire le motif exact (Account Quality → Rejected Ads)
2. Si rejet sur 1 ad seulement : reformuler ad copy, retirer mots à risque (claim médical, comparaison concurrent)
3. Si rejet sur le compte entier : Appel direct (Meta Business Support → schedule call), expliquer le produit
4. En backup : avoir un **2ème ad account** prêt sur le même Business Manager (Meta autorise 5 ad accounts max)
5. Diversifier : créer aussi compte TikTok Ads + Google Ads en backup

---

## 📚 Ressources externes

- **Meta Business Help** : https://www.facebook.com/business/help
- **Meta Pixel Helper** (Chrome) : https://chrome.google.com/webstore/detail/meta-pixel-helper
- **Pixel testing** : https://business.facebook.com/events_manager → Test events
- **Ad Library** (espionner les concurrents) : https://www.facebook.com/ads/library/?country=DZ
- **Algérie COD Facebook groupes** (pour benchmarks) : "COD Algérie e-commerce" sur FB

---

## 🎯 TL;DR (en 30 secondes)

1. **Campagne unique** `FINO_Conv_MVP_2026W23` en CBO 10$/jour, 7 jours
2. **1 ad set** broad DZ Women 22-45, FB+IG Feed only, optimize Lead
3. **5 ads** (Pain/Promise/SocialProof/Mechanism/Urgency), UTM par ad
4. **Pixel** `2142594929860134`, conversion event `Lead`
5. **Jour 4** : kill 3 plus mauvais, garde 2 winners
6. **Jour 5-7** : scale winners à 20$/jour
7. **Jour 7** : décision finale = scale ou pivot
8. **KPI** : CTR > 1.5%, CPL < 800 DA, ROAS > 1.8

**Budget total MVP : ~90$ (12 600 DZD)** pour identifier le créative gagnant + premiers Leads.

---

*Rédigé pour le launch Fino Masque DZ — version 1.0 (juin 2026). Mettre à jour ce playbook après chaque round (semaine 2, 3, 4) avec les apprentissages.*
