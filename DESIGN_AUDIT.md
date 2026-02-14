# Nisse — Design System Audit
# Nuvarande kod vs. DESIGN_SYSTEM.md
# ═══════════════════════════════════════════════════

## Sammanfattning

| Område              | Status | Avvikelser |
|---------------------|--------|------------|
| Färger              | ❌ Helt annorlunda palett | 18 avvikelser |
| Typografi           | ❌ Fel fonter | 2 avvikelser |
| Knappar             | ❌ Inkonsekvent | 5 avvikelser |
| Kort                | ⚠️ Delvis | 3 avvikelser |
| Inputs              | ⚠️ Delvis | 2 avvikelser |
| Loader              | ❌ Fel färg | 2 avvikelser |
| Toast/Notifications | ❌ Saknas helt | Finns ej |
| Success-animationer | ❌ Saknas helt | Finns ej |
| Error-hantering     | ⚠️ Minimal | 3 avvikelser |
| Bottennav           | ❌ Saknas helt | Finns ej |
| Skeleton loaders    | ⚠️ Minimal | 2 avvikelser |
| Spacing             | ⚠️ Inkonsekvent | Blandad |
| Animationer         | ✅ Bra grund | 1 avvikelse |
| Ikon-system         | ✅ Konsekvent Lucide | OK |

---

## 1. FÄRGER — ❌ Helt annorlunda palett

### Nuvarande kod använder:
```
brand:   #D4572A (bränd orange/röd)
warm:    #FAF7F2 → #1A150D (beige/brun skala)
forest:  #4A7C59 (grön)
gold:    #C4982B (guld)
```

### Design system kräver:
```
accent-teal:   #2ABFBF (turkos)
accent-orange: #FF7A50 (varm orange)
text-primary:  #1A1A2E (mörk marinblå)
bg:            #F5F5F7 (cool grå)
surface:       #FFFFFF
```

### Åtgärd:
Hela Tailwind-paletten behöver bytas ut. Den nuvarande "varma/jordiga" 
paletten ska ersättas med den "rena/moderna" designsystem-paletten.

Specifikt:
- `brand-400` (#D4572A) → ska bli `teal` (#2ABFBF)
- `warm-50` (#FAF7F2) → ska bli `bg` (#F5F5F7)
- `warm-800` (#2C2417) → ska bli `text-primary` (#1A1A2E)
- `forest-400` (#4A7C59) → ska bli `success` (#34C759)
- `gold` behålls delvis men i ljusare variant

---

## 2. TYPOGRAFI — ❌ Fel fonter

### Nuvarande:
```
display: "DM Serif Display" (serif)
body: "Outfit" (sans-serif)
```

### Design system kräver:
```
"SF Pro Display", "Inter", -apple-system, sans-serif
(samma font för allt, variation via weight/size)
```

### Åtgärd:
- Ta bort DM Serif Display (serif stämmer ej med den rena app-designen)
- Byt till Inter som primär font
- Google Fonts import behöver uppdateras

---

## 3. KNAPPAR — ❌ Inkonsekvent

### Nuvarande:
```css
.btn-primary: bg-brand-400 text-white rounded-xl    ← Fel färg, fel radius
.btn-secondary: bg-white border-warm-200 rounded-xl  ← Fel radius
.btn-ghost: text-warm-500 rounded-lg                  ← OK koncept
```

### Design system kräver:
```css
Primary:   bg-[#1A1A2E] text-white rounded-full (pill) + shadow
Secondary: bg-white border-[#E5E5EA] rounded-full (pill)
Ghost:     text-[#2ABFBF] transparent rounded-full
Icon:      40x40 rounded-full
```

### Avvikelser:
1. Primary button ska vara SVART (#1A1A2E), inte brand-färg
2. Alla knappar ska vara pill-formade (rounded-full), inte rounded-xl
3. Primary button saknar skugga (shadow-btn)
4. Ingen Icon Button-variant finns
5. Knappar sprids som CSS-klasser istf en Button-komponent med props

### Åtgärd:
Skapa en `Button.js` komponent med variant-prop.

---

## 4. KORT — ⚠️ Delvis rätt

### Nuvarande:
```css
.card: bg-white rounded-xl shadow-soft border border-warm-200 p-6
```

### Design system kräver:
```css
Standard: bg-white rounded-[16px] shadow-md (INGEN border)
```

### Avvikelser:
1. Kort har `border` — designsystemet säger ALDRIG borders på kort
2. padding `p-6` (24px) — borde vara `p-4` (16px)
3. Saknar hover-state med shadow-lg + translateY

---

## 5. INPUTS — ⚠️ Delvis rätt

### Nuvarande:
```css
.input-field: border-warm-200 rounded-xl focus:border-brand-400 focus:ring-brand-400/10
```

### Design system kräver:
```css
border-[#E5E5EA] rounded-[12px] focus:border-[#2ABFBF] focus:shadow-glow(teal)
```

### Avvikelser:
1. Focus-glow ska vara teal, inte brand (orange)
2. Border-radius ska vara 12px, inte xl (16px)

---

## 6. LOADER — ❌ Fel färg

### Nuvarande:
```jsx
<Loader2 className="text-brand-400 animate-spin" />  // Orange/röd spinner
```

### Design system kräver:
```
Spinner ska ALLTID vara teal (#2ABFBF)
```

### Avvikelser:
1. Spinner är orange/röd istf teal
2. Ingen dedikerad Spinner-komponent — Loader2 används direkt

---

## 7. TOAST / NOTIFICATIONS — ❌ Saknas helt

### Nuvarande kod:
Inga toast-notifikationer finns. Fel visas inline med:
```jsx
<div className="bg-red-50 border border-red-200 text-red-700 ...">
```

### Design system kräver:
- Dedikerad Toast-komponent
- 4 varianter: success (teal), error (röd), warning (orange), info (blå)
- Slide-down animation, auto-dismiss
- Globalt tillgänglig via hook/context

### Åtgärd:
Bygga Toast.js + useToast() hook + ToastProvider

---

## 8. SUCCESS-ANIMATIONER — ❌ Saknas helt

### Saknas:
- Hjärta pop-animation vid favorit-sparning
- Checkmark-animation vid avklarat steg
- Konfetti/celebration vid färdigt recept
- Knapp-press scale-animation

### Åtgärd:
Lägga till i Button, RecipeCard och steg-komponenter.

---

## 9. ERROR-HANTERING — ⚠️ Minimal

### Nuvarande:
Enkel röd div med text. Ingen shake-animation, ingen toast.

### Design system kräver:
- Shake-animation (3px, 300ms) vid validering
- Röd glow på fält
- Toast för globala fel
- "Försök igen"-knapp vid helsida-fel

---

## 10. BOTTENNAV — ❌ Saknas helt

### Nuvarande:
Top-navbar med hamburger-meny på mobil.

### Design system kräver:
Fixed bottom-nav med 5 tabs:
1. Hem, 2. Sök, 3. Plus (teal, större), 4. Favoriter, 5. Profil

### Åtgärd:
Bygga BottomNav.js, byta layout till top+bottom nav.

---

## 11. SKELETON LOADERS — ⚠️ Minimal

### Nuvarande:
```css
.skeleton: bg-warm-100 animate-pulse rounded-lg
```

### Design system kräver:
Shimmer-effekt (gradient som glider) istf enkel pulse.

---

## 12. SAKNADE KOMPONENTER

Dessa komponenter finns INTE men krävs av designsystemet:

| Komponent      | Prioritet | Beskrivning |
|----------------|-----------|-------------|
| Button.js      | 🔴 Kritisk | Unified knapp med varianter |
| Toast.js       | 🔴 Kritisk | Notification-system |
| Spinner.js     | 🟡 Hög    | Enda loader-komponenten |
| Skeleton.js    | 🟡 Hög    | Shimmer skeleton |
| BottomNav.js   | 🟡 Hög    | Mobil-navigation |
| Badge.js       | 🟢 Medium | Unified badge med varianter |
| EmptyState.js  | 🟢 Medium | Tom-vy med emoji + CTA |
| Modal.js       | 🟢 Medium | Dialog-komponent |
| Card.js        | 🟢 Medium | Unified kort med varianter |
| Input.js       | 🟢 Medium | Unified input med states |

---

## PRIORITERAD ÅTGÄRDSLISTA

### Steg 1: Fundamentet (gör först)
1. Uppdatera tailwind.config.js med ny palett
2. Uppdatera globals.css med nya base styles
3. Byt font från DM Serif/Outfit till Inter

### Steg 2: Kärnkomponenter
4. Skapa Button.js (primary/secondary/ghost/icon)
5. Skapa Toast.js + useToast hook
6. Skapa Spinner.js
7. Skapa Skeleton.js med shimmer

### Steg 3: Layout
8. Skapa BottomNav.js
9. Uppdatera layout.js (bottennav på mobil, topnav på desktop)

### Steg 4: Uppdatera befintliga vyer
10. page.js — ny palett, nya knappar, bottennav
11. SearchBar.js — ny stil, teal focus
12. RecipeCard.js — ta bort borders, nya badges
13. LoadingState.js — teal spinner
14. Login/Register — nya inputs, ny knapp

### Steg 5: Nya states
15. Success-animationer
16. Error shake + toast
17. Empty states med emoji + CTA
