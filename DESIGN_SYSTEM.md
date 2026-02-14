# Nisse — Designsystem v1.0
# ═══════════════════════════════════════════════════════
# Detta dokument är den enda källan till sanning för all UI/UX.
# Varje komponent, sida och vy MÅSTE följa detta system.
# Lägg denna fil i roten av repot som DESIGN_SYSTEM.md
# ═══════════════════════════════════════════════════════
## 1. Färgpalett
### Primära färger
```
--color-bg:           #F5F5F7    ← Global bakgrund (aldrig vit)
--color-surface:      #FFFFFF    ← Kort, modaler, inputs
--color-text-primary: #1A1A2E    ← Rubriker, primär text
--color-text-secondary: #8E8E93  ← Hjälptext, placeholders, metadata
--color-text-muted:   #C7C7CC    ← Inaktiva element, dividers
```
### Accentfärger
```
--color-accent-teal:     #2ABFBF  ← Primär CTA, badges, aktiv state, framgång
--color-accent-teal-light: #E8F8F8 ← Bakgrund för teal-badges
--color-accent-orange:   #FF7A50  ← Sekundär accent, varningar, ta-bort-knappar
--color-accent-orange-light: #FFF0EB ← Bakgrund för orange badges
--color-accent-gold:     #FFD60A  ← Stjärnor, premium, inspiration-ikoner
--color-accent-gold-light: #FFF9E0 ← Bakgrund för guld-badges
```
### Funktionella färger
```
--color-success:   #34C759  ← Checkmarks, sparade, avklarade steg
--color-error:     #FF3B30  ← Felmeddelanden, validering
--color-warning:   #FF9500  ← Varningar, tidskritiskt
--color-info:      #007AFF  ← Informativa meddelanden
```
### Knappfärger
```
--color-btn-primary-bg:   #1A1A2E  ← Svart, pill-formad
--color-btn-primary-text: #FFFFFF
--color-btn-secondary-bg: #FFFFFF  ← Vit med border
--color-btn-secondary-border: #E5E5EA
--color-btn-danger-bg:    #FF7A50  ← Orange, cirkulär (X-knappar)
```
### REGLER:
- Använd ALDRIG andra färger än dessa
- Bakgrunden är ALLTID #F5F5F7, aldrig rent vitt
- Kort/ytor är ALLTID #FFFFFF
- Text är ALDRIG rent svart (#000000), använd #1A1A2E
## 2. Typografi
### Font
```
Font-familj: "SF Pro Display", "Inter", -apple-system, sans-serif
```
### Skala
```
--text-hero:    32px / bold / -0.5px letter-spacing    ← Sidrubriker ("Vad har du i köket?")
--text-title:   24px / bold / -0.3px letter-spacing    ← Receptnamn, sektionsrubriker
--text-heading: 20px / semibold                        ← Kort-titlar, dialogrubriker
--text-body:    16px / regular / 1.5 line-height       ← Brödtext, beskrivningar
--text-label:   14px / medium                          ← Knappar, ingrediens-namn
--text-caption: 12px / medium / 0.5px letter-spacing   ← Metadata, badges, timestamps
--text-tiny:    10px / semibold / 1px letter-spacing   ← Kategori-etiketter (versaler)
```
### REGLER:
- Rubriker är ALLTID bold eller semibold, aldrig regular
- Brödtext är ALLTID regular, aldrig bold
- Använd ALDRIG all-caps utom för --text-tiny (kategori-etiketter)
- Emoji i rubriker är OK och uppmuntras (t.ex. "Kycklinggryta 🍗")
## 3. Spacing & Layout
### Spacing-skala (8px bas)
```
--space-xs:   4px     ← Mellan ikon och text i inline-element
--space-sm:   8px     ← Mellan relaterade element (badge + badge)
--space-md:   16px    ← Padding i kort, mellan listelement
--space-lg:   24px    ← Mellan sektioner, sidopadding
--space-xl:   32px    ← Mellan stora sektioner
--space-2xl:  48px    ← Top-padding på sidor
```
### Layout-regler
```
Sidopadding:      24px (alltid, alla sidor)
Kort-padding:     16px
Max bredd:        390px (mobil), 680px (tablet), 1080px (desktop)
Bottennav-höjd:   80px (+ safe area)
Safe area bottom: env(safe-area-inset-bottom)
```
### REGLER:
- ALDRIG 0 padding — minst 4px
- Sidopadding är ALLTID 24px på mobil
- Mellan kort: ALLTID 12px gap
- Sista elementet på sida: ALLTID minst 100px margin-bottom (för bottennav)
## 4. Rundning & Skuggor
### Border-radius
```
--radius-xs:    8px    ← Badges, små element
--radius-sm:    12px   ← Input-fält, mindre knappar
--radius-md:    16px   ← Kort, modaler
--radius-lg:    20px   ← Stora kort, hero-bilder
--radius-full:  9999px ← Pill-knappar, avatarer, cirkulära knappar
```
### Skuggor
```
--shadow-sm:     0 1px 3px rgba(0,0,0,0.04)              ← Ingrediens-rader
--shadow-md:     0 2px 12px rgba(0,0,0,0.06)              ← Kort, input-fält
--shadow-lg:     0 8px 30px rgba(0,0,0,0.08)              ← Modaler, aktiva kort
--shadow-glow:   0 0 0 4px rgba(42,191,191,0.15)          ← Focus-state på inputs
--shadow-btn:    0 4px 12px rgba(26,26,46,0.15)            ← Primary buttons
```
### REGLER:
- Skuggor är ALLTID mjuka (aldrig mer än 0.1 opacity)
- Hover-state: gå från shadow-md till shadow-lg
- Focus-state: ALLTID shadow-glow (teal ring)
- ALDRIG borders på kort — använd skuggor istället
- Undantag: input-fält har 1px border #E5E5EA
## 5. Ikoner & Emoji
### Ikon-bibliotek
```
Lucide React — ENDA ikonsystemet
Import: import { Search, Heart, Plus, ArrowLeft, ... } from 'lucide-react'
Storlekar: 16px (inline), 20px (knappar), 24px (navigation), 32px (feature)
Stroke-width: 1.5 (aldrig 2)
```
### Emoji som ingrediens-ikoner
```
Placering: I en 40x40px ruta med --color-bg bakgrund, radius-sm
Storlek: 24px
Använd för: ingredienser, kategorier, mattyper
Ingrediens-emojis:
🍗 Kyckling    🥩 Nötfärs    🐟 Lax/Fisk    🥚 Ägg
🍝 Pasta       🍚 Ris        🥔 Potatis      🍞 Bröd
🍅 Tomat       🧅 Lök        🧄 Vitlök       🥕 Morot
🥒 Gurka       🌽 Majs       🍄 Svamp         🫑 Paprika
🧀 Ost         🥛 Mjölk      🧈 Smör          🍋 Citron
🌶️ Chili       🌿 Basilika   🧂 Salt          🫒 Olivolja
```
### REGLER:
- ALDRIG blanda ikonbibliotek
- ALDRIG använda Font Awesome, Heroicons, etc.
- Emoji används BARA för mat-relaterade ikoner
- UI-ikoner (pilar, menyer, hjärtan) är ALLTID Lucide
## 6. Komponenter
### 6.1 Knappar
#### Primary Button (huvudaktion)
```
Bakgrund:     #1A1A2E (svart)
Text:         #FFFFFF, --text-label, medium
Padding:      14px 28px
Border-radius: 9999px (pill)
Skugga:       --shadow-btn
Ikon:         ArrowRight (→) 16px, till höger
Hover:        opacity 0.9
Active:       scale(0.97)
Disabled:     opacity 0.4
Loading:      Spinner ersätter ikon (se Loaders)
```
Används för: "Hitta recept", "Börja laga", "Spara", "Nästa steg"
#### Secondary Button
```
Bakgrund:     #FFFFFF
Border:       1px solid #E5E5EA
Text:         #1A1A2E, --text-label
Padding:      12px 24px
Border-radius: 9999px
Hover:        border-color #2ABFBF, text-color #2ABFBF
```
Används för: "Avbryt", "Visa mer", sekundära val
#### Icon Button (cirkulär)
```
Storlek:      40x40px
Border-radius: 9999px
Bakgrund:     #FFFFFF (default) eller #FF7A50 (danger)
Ikon:         20px centrerad
```
Används för: Ta bort (X), Favorit (♡), Tillbaka (←), Meny (⋯)
#### Ghost Button
```
Bakgrund:     transparent
Text:         #2ABFBF, --text-label, medium
Padding:      8px 16px
Hover:        bakgrund #E8F8F8
```
Används för: "Testa! →", "Visa alla", textlänkar
### REGLER:
- VARJE sida har MAX 1 primary button (den viktigaste aktionen)
- Primary button är ALLTID pill-formad, ALLTID svart
- Primary button placeras ALLTID i botten av sidan, centrerad, med 24px padding
- Destruktiva knappar (ta bort) är ALLTID orange cirkulära, ALDRIG röda
- Knappar har ALLTID minst 44px touch target (tillgänglighet)
### 6.2 Kort (Cards)
#### Standard-kort
```
Bakgrund:     #FFFFFF
Border-radius: 16px
Padding:      16px
Skugga:       --shadow-md
Hover:        --shadow-lg, translateY(-2px), transition 200ms
```
#### Bild-kort (receptkort på hemskärmen)
```
Border-radius: 20px
Overflow:     hidden
Bild:         fyller hela kortet, object-fit cover
Overlay:      gradient från transparent till rgba(0,0,0,0.6) i botten
Text:         vit, i botten av kortet
Badge:        uppe till vänster, i kortet
Hjärta:       uppe till höger, vit cirkulär ikon-knapp
```
#### List-kort (ingrediens-rader)
```
Bakgrund:     #FFFFFF
Border-radius: 12px
Padding:      12px 16px
Skugga:       --shadow-sm
Layout:       flex row, align-center
              [Emoji-ruta 40px] [Namn flex-1] [Action 32px]
Gap:          12px
```
### REGLER:
- Kort har ALDRIG borders, BARA skuggor
- Kort har ALLTID hover/press-animation
- Bild-kort har ALLTID gradient-overlay för läsbarhet
- ALDRIG nesta kort i kort
### 6.3 Input-fält
```
Bakgrund:     #FFFFFF
Border:       1px solid #E5E5EA
Border-radius: 12px
Padding:      14px 16px
Font:         --text-body
Placeholder:  --color-text-muted
Focus:        border-color #2ABFBF, --shadow-glow
Error:        border-color #FF3B30, shadow 0 0 0 4px rgba(255,59,48,0.1)
```
### REGLER:
- ALLA inputs ser likadana ut överallt
- Focus-state är ALLTID teal glow
- Error-state är ALLTID röd glow
- Inputs har ALDRIG inbyggda browser-stilar (appearance: none)
### 6.4 Badges
#### Teal badge (kategori, status)
```
Bakgrund:     #E8F8F8
Text:         #2ABFBF, --text-caption, semibold
Padding:      4px 12px
Border-radius: 8px
```
#### Orange badge (highlight, nummer)
```
Bakgrund:     #FFF0EB
Text:         #FF7A50, --text-caption, semibold
```
#### Svart badge (primär info)
```
Bakgrund:     #1A1A2E
Text:         #FFFFFF
```
### 6.5 Bottennav
```
Position:     fixed bottom
Bakgrund:     #FFFFFF
Höjd:         80px + safe-area-inset-bottom
Border-top:   ingen (använd skugga)
Skugga:       0 -4px 20px rgba(0,0,0,0.04)
Layout:       5 ikoner, jämnt fördelade
Ikoner:       24px, stroke-width 1.5
Inaktiv:      #C7C7CC
Aktiv:        #1A1A2E (svart) med filled variant
              + 4px prick under i #2ABFBF
Tabs:
1. 🏠 Hem (Home)
2. 🔍 Sök (Search)
3. ➕ Ny (PlusCircle) — centrerad, 48px, teal bakgrund
4. ❤️ Favoriter (Heart)
5. 👤 Profil (User)
```
### REGLER:
- Bottennav syns ALLTID utom i matlagningsläge
- Aktiv tab har ALLTID svart ikon + teal prick
- Mitt-knappen (Plus) är ALLTID större och teal
## 7. Animationer & Transitions
### Globala transitions
```
--transition-fast:   150ms ease
--transition-normal: 200ms ease
--transition-slow:   300ms ease-out
--transition-spring: 300ms cubic-bezier(0.34, 1.56, 0.64, 1)
```
### Sideövergångar
```
Ny sida in:     fadeIn 200ms + slideUp 20px
Sida ut:        fadeOut 150ms
Tillbaka:       slideRight 200ms
```
### Element-animationer
```
Kort hover:     translateY(-2px) + shadow-lg, 200ms
Knapp press:    scale(0.97), 100ms
Knapp release:  scale(1), --transition-spring
Lista-element:  staggered fadeIn, 50ms delay per element
```
### REGLER:
- VARJE interaktivt element har en transition
- ALDRIG animation längre än 400ms
- ALDRIG använda `ease-in` (känns trögt) — använd `ease` eller `ease-out`
- Staggered animationer: max 50ms delay, max 8 element
## 8. Loaders & States
### 8.1 Spinner (enda loadern)
```
Design:       Cirkulär, 2px stroke
Färg:         #2ABFBF (teal)
Storlekar:    16px (inline/knappar), 24px (kort), 40px (helsida)
Animation:    rotate 360° per 800ms, ease-in-out
```
### 8.2 Skeleton loader (för innehåll)
```
Bakgrund:     linear-gradient(90deg, #F0F0F0 25%, #E0E0E0 50%, #F0F0F0 75%)
Animation:    shimmer 1.5s infinite
Border-radius: samma som elementet den ersätter
```
### 8.3 States för alla vyer
#### Loading state
- Knappar: Spinner ersätter ikon, text kvar, disabled
- Kort: Skeleton med shimmer
- Helsida: Centrerad 40px spinner + text under ("Letar recept...")
- Listor: 3 skeleton-rader
#### Empty state
- Centrerat: Stor emoji (64px) + rubrik + beskrivning + CTA-knapp
- Exempel: 🍽️ "Inga recept ännu" / "Sök efter ditt första recept"
#### Error state
- Inline: Röd text under fältet, shake-animation (3px, 300ms)
- Toast: Slide-down från toppen, röd vänsterborder, auto-dismiss 4s
- Helsida: Centrerat: ⚠️ + rubrik + "Försök igen"-knapp
#### Success state
- Toast: Slide-down, teal vänsterborder, checkmark-ikon, auto-dismiss 3s
- Inline: Teal checkmark + text, fade-in
- Sparad: Hjärta fyller i med pop-animation (scale 1→1.3→1, 300ms)
### REGLER:
- ALDRIG visa en blank sida — ALLTID skeleton eller spinner
- Loaders är ALLTID teal
- Error är ALLTID röd med shake
- Success är ALLTID teal med checkmark
- Toasts dismissar ALLTID automatiskt (3-4s)
- SAMMA loader-komponent överallt — ingen variation
## 9. Toasts & Notifications
### Toast-komponent (enda notification-systemet)
```
Position:       fixed top, centrerad, 90% bredd
Bakgrund:       #FFFFFF
Border-radius:  12px
Skugga:         --shadow-lg
Padding:        14px 16px
Layout:         [Ikon 20px] [Text flex-1] [Dismiss X]
Typer:
- Success:  teal vänsterborder (3px), CheckCircle-ikon i teal
- Error:    röd vänsterborder, AlertCircle-ikon i röd
- Warning:  orange vänsterborder, AlertTriangle-ikon i orange
- Info:     blå vänsterborder, Info-ikon i blå
Animation in:   slideDown + fadeIn, 300ms
Animation ut:   slideUp + fadeOut, 200ms
Auto-dismiss:   3s (success), 5s (error), 4s (warning/info)
```
### REGLER:
- MAX 1 toast synlig åt gången (ny ersätter gammal)
- Toasts blockerar ALDRIG interaktion
- VARJE framgångsrik aktion bekräftas med toast
- VARJE fel visas med toast (+ inline om relevant)
## 10. Matlagningsvy (Cooking Mode) — Speciella regler
```
Bakgrund:     #1A1A2E (mörk — mindre störande i köket)
Text:         #FFFFFF
Kort:         rgba(255,255,255,0.1) bakgrund, 16px radius
Knappar:      #2ABFBF (teal), stor text
Font-storlek: 1.5x normal (läsbart på avstånd)
Steg-indikator: Horisontell progress-bar i toppen
                Avklarade: teal
                Aktuellt: pulserande teal
                Kommande: rgba(255,255,255,0.2)
Timer:        Stor cirkulär countdown (120px)
              Teal ring som minskar
              Tid i center: 48px bold
              Pulserar sista 30 sekunderna
Mikrofon:     Stor cirkulär knapp (64px) i botten
              Idle: vit outline
              Listening: teal, pulserande ring
              Processing: teal spinner
```
## 11. Responsivitet
### Breakpoints
```
Mobil:    < 640px   (primär — designa för denna först)
Tablet:   640-1024px
Desktop:  > 1024px
```
### Anpassningar
```
Mobil:   1 kolumn, bottennav, full-bredd kort
Tablet:  2 kolumner för receptkort, sidonav möjlig
Desktop: 3 kolumner, sidonav, bredare kort med mer info
```
### REGLER:
- ALLTID mobile-first
- Bottennav på mobil, sidonav på desktop
- Bild-kort: full bredd på mobil, grid på tablet+
- Touch targets: minst 44x44px på alla interaktiva element
## 12. Tillgänglighet
### REGLER:
- ALLA knappar har aria-label
- ALLA bilder har alt-text
- Focus-ordning följer visuell ordning
- Kontrast: minst 4.5:1 för text, 3:1 för stora element
- Skärmläsare: Alla ikoner har sr-only text
- Reducerad rörelse: respektera prefers-reduced-motion
## 13. Namnkonvention för komponenter
```
Återanvändbara (i /components):
  Button.js          — Alla knapp-varianter via props (variant="primary|secondary|ghost|icon")
  Card.js             — Alla kort-varianter (variant="standard|image|list")
  Input.js            — Text-input med alla states
  Badge.js            — Alla badge-varianter
  Toast.js            — Toast-notification system
  Spinner.js          — Enda loadern
  Skeleton.js         — Skeleton loader
  BottomNav.js        — Navigering
  EmptyState.js       — Tom-vy med emoji + text + CTA
  Modal.js            — Alla modaler/dialogs
Sidspecifika (i /app):
  page.js             — Hemskärm
  recipe/[id]/page.js — Receptvy
  cooking/page.js     — Matlagningsvy
  shopping/page.js    — Inköpsvy
  profile/page.js     — Profilsida
```
### REGLER:
- En komponent per fil
- ALLA varianter av ett element i SAMMA komponent (via props)
- ALDRIG skapa en ny knapp-komponent — använd Button med variant-prop
- ALDRIG duplicera styling — extrahera till komponent
## 14. Checklista innan varje commit
- [ ] Följer alla färger paletten? (inga egna färger)
- [ ] Använder rätt typografi-skala?
- [ ] Har alla interaktiva element transitions?
- [ ] Finns loading, empty, error states?
- [ ] Är primary button pill-formad och svart?
- [ ] Är spacing konsekvent (8px-grid)?
- [ ] Fungerar på 390px bredd?
- [ ] Har alla knappar minst 44px touch target?
- [ ] Används Lucide för ikoner och emoji för mat?
- [ ] Visas toast vid framgång/fel?
