# 🎨 Fino MVP — 5 AI Image Prompts (Pro Ad Creatives)

Stratégie : **AI génère le visuel hero**, mon HTML overlay rajoute le texte/badges/CTAs. Résultat = niveau Vogue/Sephora.

> **Pourquoi ce workflow** : les outils AI image (Midjourney/DALL-E/Ideogram) génèrent une photo de luxe en 30s. Mes prompts sont calibrés pour : 1080×1080 carré FB feed, palette beauté premium, espace négatif pour overlay texte, **zéro brand violation** (pas de logo Shiseido, pas de "Premium Touch" lisible).

---

## 🛠️ Quel outil utiliser

| Outil | Bon pour | Coût |
|-------|----------|------|
| **Midjourney V6** | Cinéma, lumière, ambiance — le + qualitatif | $10/mois |
| **DALL-E 3** (ChatGPT Plus / Bing Free) | Suit strictement les instructions, mains/visages OK | Gratuit via [bing.com/create](https://bing.com/create) |
| **Ideogram 3** | Beauté premium + Arabic text rendering (utile si tu veux inclure du texte AR direct dans l'image) | Free tier 25/jour |
| **Recraft V3** | Product photography super-clean | Free tier 50/mois |

**Mon conseil** : **Bing Image Creator** (gratuit) avec DALL-E 3 — c'est plus que suffisant pour MVP. Sinon Midjourney si tu veux du grain de luxe.

---

## 🔄 Workflow complet (30 min total)

```
1. Tu copies un prompt ci-dessous
2. Colle-le dans ton outil AI préféré
3. Génère 4 variantes par prompt (le tool en propose 4 automatiquement)
4. Choisis la meilleure variante (ton goût)
5. Télécharge en PNG 1080×1080 (force 1:1 ratio)
6. Renomme en `ai-bg-A.jpg` (pour slot A), `ai-bg-B.jpg` etc.
7. Mets les 5 fichiers dans : `creatives/ads/ai-backgrounds/`
8. Tu m'envoies juste un screenshot d'1 image → je code l'overlay HTML correspondant
9. Tu Ctrl+Shift+P "Capture full size screenshot" sur la page HTML → PNG final 1080² prêt à uploader sur Meta Ads Manager
```

---

# 🎨 LES 5 PROMPTS

---

## 🅰️ AD A — Angle PAIN (problème/douleur)

**Mood** : moody, vulnerable, "avant l'utilisation"
**Texte overlay (que j'ajouterai)** :
- Headline : `شعرك خشن ومقصف؟` (ton cheveu est rêche et fendu?)
- Subline : `وقفي المعاناة اليوم`
- Badge : `حل في 5 دقائق`

### 📋 Prompt Midjourney V6
```
Editorial close-up of long damaged hair with visible split ends, dramatic side lighting, deep burgundy and plum gradient background, soft golden rim light, melancholic mood, high-end beauty photography, Vogue magazine style, shallow depth of field, soft focus, textile texture in background, no model face visible, hair as hero element, copper and bronze highlights, cinematic color grading, professional studio photography --ar 1:1 --style raw --v 6
```

### 📋 Prompt DALL-E 3 / Bing Free
```
A premium beauty editorial photograph, square 1:1 format. Subject: a close-up of long dark hair with visible split ends and dry damaged texture, hair flowing diagonally across the frame. Lighting: dramatic side lighting from the upper left, warm golden rim light. Background: rich deep burgundy and dark plum gradient with subtle bokeh. Style: Vogue magazine editorial, melancholic and emotional mood, shallow depth of field. No human face visible. No text or watermarks. Professional studio beauty photography, 8k detail, cinematic color grading. The bottom-right third of the image should have empty negative space for product placement.
```

### Composition note
Hair takes top-left 60% of frame, negative space bottom-right where I'll composite the product. Mood = "before".

---

## 🅱️ AD B — Angle PROMISE (solution/aspiration)

**Mood** : silky, dreamy, satisfaction
**Texte overlay** :
- Headline : `شعرك حرير في 5 دقائق`
- Subline : `ماسك ياباني فاخر`

### 📋 Prompt Midjourney V6
```
Luxurious silk fabric flowing in soft warm light, cream and blush pink color palette, long glossy silky hair cascading like liquid gold, soft pastel background with subtle bokeh, dreamlike beauty editorial, soft diffused lighting from above, sakura petals scattered, no model face, hair flowing diagonally, premium beauty advertising aesthetic, Hermès style, peach and rose gold tones, cinematic depth of field, professional product shoot --ar 1:1 --style raw --v 6
```

### 📋 Prompt DALL-E 3 / Bing Free
```
A dreamy luxury beauty advertisement photograph, square 1:1 format. Subject: extremely glossy silky black hair flowing diagonally across the frame, looking like liquid silk, with subtle highlights catching the light. Background: warm cream and blush pink gradient with soft sakura cherry blossom petals scattered, gentle bokeh. Lighting: soft diffused light from above, golden hour glow. Mood: aspirational, premium, dreamy. Style: Vogue Japan beauty editorial, Hermès aesthetic, peach and rose-gold color palette. No human face visible. The center-right area should have empty soft negative space for a product to be placed later. Professional studio photography, 8k, depth of field. No text or watermarks.
```

### Composition note
Hair top-left, silk flow diagonal. Bottom-center reserved for product. "After/aspiration" feeling.

---

## 🅲 AD C — Angle SOCIAL PROOF (communauté/confiance)

**Mood** : multiple women, joy, salon, sharing
**Texte overlay** :
- Headline : `اخترتو 5000 امرأة`
- Subline : `النتيجة من أول مرة`
- Badge : `+5000 ⭐`

### 📋 Prompt Midjourney V6
```
Three Algerian women in their 30s laughing together in a luxury beauty salon, mirror reflections, warm golden hour light streaming through window, modeled by middle-eastern women with long dark glossy hair, intimate friendship moment, soft focus background, marble counters, rose gold accents, candid lifestyle photography, premium beauty brand aesthetic, peach and warm beige tones, shot on Hasselblad medium format, professional editorial --ar 1:1 --style raw --v 6
```

### 📋 Prompt DALL-E 3 / Bing Free
```
A warm lifestyle photograph, square 1:1 format. Three Middle Eastern / Arab women in their late 20s and early 30s, with long dark glossy healthy hair, laughing together in a luxurious beauty salon. They are looking at each other, NOT at the camera. Setting: marble counter, rose-gold mirror frames, warm wood accents, soft natural window light streaming in from the left. Mood: joyful friendship, premium intimate moment, candid not posed. Color palette: warm peach, beige, gold, soft white. Style: high-end magazine editorial, professional photography, shallow depth of field, beautifully lit. No text or watermarks. The lower portion of the image should have negative space for a product placement. Modest dress, contemporary Algerian/Maghreb style.
```

### Composition note
Women in upper half (don't show full bodies — chest up), product placement in bottom-right corner. Cultural fit Algeria.

---

## 🅳 AD D — Angle MECHANISM (ingrédients/science)

**Mood** : ingredients flatlay, scientific, premium "what's inside"
**Texte overlay** :
- Headline : `غذاء ملكات النحل`
- Subline : `+ 6 زيوت طبيعية`
- Badge : `تركيبة يابانية`

### 📋 Prompt Midjourney V6
```
Flat lay of luxury beauty ingredients on marble surface, golden honeycomb dripping fresh honey, small glass dropper bottles of argan oil, camellia flowers, jojoba leaves, royal jelly in golden droplets, vanilla pods, cream and gold color palette, soft top-down lighting, marble veined background, premium beauty editorial flatlay, organized abundance, rose gold accents, professional product photography, no text, no labels, beautiful composition --ar 1:1 --style raw --v 6
```

### 📋 Prompt DALL-E 3 / Bing Free
```
A luxurious beauty ingredients flat-lay photograph, square 1:1 format, shot top-down. Composition: arranged on a white marble surface, scattered around a central empty circular space: a piece of golden honeycomb with honey dripping, three small clear glass dropper bottles filled with golden amber oil, two pink camellia flowers, fresh green jojoba leaves, golden droplets of royal jelly, a small mortar and pestle, scattered vanilla pods. Lighting: soft top-down natural light, gentle highlights on the glass and honey. Color palette: warm gold, cream, soft pink, marble white, accent green. Mood: premium, abundant, scientific yet natural. Style: Bon Appétit / Vogue Beauty flat-lay editorial, professional studio photography, 8k detail. No text or labels on the bottles. No human elements. The center of the composition has empty circular negative space for a product to be placed later.
```

### Composition note
Top-down flatlay, ingredients arranged in a circle, product centered. "Knowledge/science" angle.

---

## 🅴 AD E — Angle URGENCY (offre/scarcité)

**Mood** : spotlight, sale, attention-grabbing
**Texte overlay** :
- Headline : `اليوم فقط -35%`
- Subline : `الكمية محدودة`
- Badge gros : `-35%`

### 📋 Prompt Midjourney V6
```
Dramatic spotlight beauty product showcase, deep black to burgundy gradient background, single bright spotlight from above creating cinematic shadow, podium-like soft pedestal with rose petals scattered, gold light particles floating, theatrical atmosphere, luxury Black Friday beauty advertising, rich red and gold color palette, cinematic depth, professional product photography, no text, museum lighting --ar 1:1 --style raw --v 6
```

### 📋 Prompt DALL-E 3 / Bing Free
```
A dramatic luxury beauty advertisement photograph, square 1:1 format. Setting: empty stage with a single spotlight beam from upper-left creating dramatic theatrical light. Background: deep gradient from black at the top to rich burgundy red at the bottom. Floor: soft velvet-textured platform with scattered red rose petals and tiny gold light particles in the air, looking magical. Mood: high-stakes luxury sale, Black Friday glamour, exclusive offer. Color palette: deep black, rich burgundy, gold, accent red. Center of the image: empty bright spotlight area for product placement later. Style: museum lighting, cinematic, theatrical, professional studio product photography, 8k detail. No text, no labels, no humans.
```

### Composition note
Spotlight creates focal point in center where I'll composite the product. Dark dramatic = "limited time / scarce".

---

## 🎯 Après génération — Workflow de composition

Une fois que t'as les 5 images, tu m'envoies juste **1 screenshot par image** (ou tu les copies dans `creatives/ads/ai-backgrounds/`) et je :

1. **Composite** : positionne ton `fino-hero.jpg` (cleaned, sans sticker chinois) sur le hero spot de chaque image
2. **Overlay texte** : ajoute headline/subline/badge en arabe darija avec la bonne typographie
3. **Brand tag** : petit "fino" logo discret en bas pour cohérence
4. **Export 1080×1080** : screenshot Chrome → PNG prêt

Total temps post-AI : ~5 min par image.

---

## 💡 Tricks pour Bing Image Creator (gratuit, accessible partout)

1. Va sur https://www.bing.com/create
2. Connecte-toi avec compte Microsoft (gratuit)
3. Tu as 25 "boost" par jour (génération rapide), illimité ensuite (juste plus lent)
4. Colle le prompt **DALL-E 3 / Bing Free** ci-dessus (pas le Midjourney)
5. Tu obtiens 4 variantes par génération
6. Download en PNG haute résolution

Si tu pars en France avec ton phone — l'app Bing image creator marche en mobile, tu peux générer pendant un trajet train/avion.

---

## ⚠️ Validation Meta avant upload

Avant d'uploader la version finale sur Meta Ads :

- [ ] Pas de visage trop proche d'un logo Shiseido réel
- [ ] Pas de copie d'image existante (Google reverse image search 5 images → doit dire "no matches")
- [ ] Pas de claim "100% guérit" ni similaire dans le texte overlay
- [ ] Image originale (générée par toi) — pas copiée d'une autre marque
- [ ] Aucun visage de célébrité reconnaissable (DALL-E a un filtre auto mais vérifie)

---

## 🔄 Variations futures (post-MVP)

Quand on aura identifié le creative gagnant au Jour 7, on génèrera **3 variantes du winner** :
- Variante couleur (rose → bleu nuit)
- Variante texte (autre angle d'attaque)
- Variante composition (close-up vs wide)

Total = test continu de la créative gagnante, jamais "trop de gens ont vu cette image".

---

**Prochaine étape** : Copie le prompt A (PAIN) dans ton outil préféré → génère → envoie-moi le résultat. Je code l'overlay HTML en 2 min.
