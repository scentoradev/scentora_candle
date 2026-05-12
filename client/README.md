# Next Client Template

## Clone repo nĂ y
```bash
git clone  https://github.com/Jye-a-dev/template_next_client.git
```
Template khá»Ÿi táº¡o cho frontend dĂ¹ng **Next.js App Router** theo hÆ°á»›ng dá»… má»Ÿ rá»™ng, rĂµ layout, rĂµ route group, vĂ  Ä‘á»§ gá»n Ä‘á»ƒ lĂ m base cho project má»›i.

## Stack hiá»‡n táº¡i

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint

Template nĂ y phĂ¹ há»£p khi báº¡n muá»‘n báº¯t Ä‘áº§u vá»›i má»™t client app báº±ng Next.js nhÆ°ng váº«n giá»¯ cáº¥u trĂºc folder rĂµ tá»« Ä‘áº§u Ä‘á»ƒ má»Ÿ rá»™ng tiáº¿p cho `public`, `auth`, `dashboard`, `services`, `store`, `types`, `utils`.

## 1. Project nĂ y Ä‘ang setup theo kiá»ƒu nĂ o?

Repo hiá»‡n táº¡i lĂ  kiá»ƒu:

`Next.js + React + TypeScript + Tailwind CSS + App Router`

ÄĂ¢y lĂ  setup phĂ¹ há»£p cho:

- Website cĂ³ nhiá»u khu vá»±c giao diá»‡n
- Dashboard hoáº·c admin panel
- Client app cáº§n chia layout theo nhĂ³m route
- Dá»± Ă¡n muá»‘n chuáº©n bá»‹ sáºµn khung `public`, `auth`, `dashboard`
- Team muá»‘n Ä‘i theo file-based routing cá»§a Next.js

Template nĂ y hiá»‡n Ä‘ang lĂ  má»™t base giao diá»‡n tá»‘i giáº£n:

- Ä‘Ă£ cĂ³ route group `app/(public)`
- Ä‘Ă£ cĂ³ khung layout `@base` vĂ  `(public)`
- Ä‘Ă£ cĂ³ folder placeholder cho `auth` vĂ  `dashboard`
- Ä‘Ă£ cĂ³ cĂ¡c folder ná»n cho `services`, `store`, `types`, `utils`, `hooks`, `libs`, `constants`

## 2. Khi nĂ o nĂªn dĂ¹ng template nĂ y?

NĂªn dĂ¹ng template nĂ y khi báº¡n cáº§n:

- file-based routing cá»§a Next.js
- layout theo khu vá»±c nhÆ° `public`, `auth`, `dashboard`
- kháº£ nÄƒng má»Ÿ rá»™ng dáº§n tá»« template nhá» lĂªn project lá»›n
- React + TypeScript nhÆ°ng khĂ´ng muá»‘n tá»± dá»±ng cáº¥u trĂºc tá»« Ä‘áº§u

KhĂ´ng nĂªn dĂ¹ng template nĂ y náº¿u báº¡n cáº§n má»™t project cá»±c nhá» chá»‰ cĂ³ 1 Ä‘áº¿n 2 component demo. Khi Ä‘Ă³ `create-next-app` máº·c Ä‘á»‹nh lĂ  Ä‘á»§.

## 3. Khi nĂ o nĂªn chá»n Next.js thay vĂ¬ React + Vite?

NĂªn chá»n **Next.js** khi báº¡n muá»‘n:

- routing theo file/folder
- layout lá»“ng nhau
- metadata theo route
- kháº£ nÄƒng má»Ÿ rá»™ng sang SSR, SSG hoáº·c full-stack sau nĂ y
- tá»• chá»©c app theo App Router ngay tá»« Ä‘áº§u

NĂªn chá»n **React + Vite** náº¿u báº¡n chá»‰ cáº§n má»™t SPA client-side ráº¥t gá»n, khĂ´ng cáº§n cÆ¡ cháº¿ route/layout kiá»ƒu Next.js, vĂ  muá»‘n setup tá»‘i thiá»ƒu hÆ¡n.

Project nĂ y Ä‘ang Ä‘i theo hÆ°á»›ng **Next.js App Router**, khĂ´ng pháº£i `React + Vite + React Router`.

## 4. CĂ i vĂ  cháº¡y project

### YĂªu cáº§u

- Node.js 20+
- npm 10+

### CĂ i dependency

```bash
npm install
```

### Cháº¡y mĂ´i trÆ°á»ng dev

```bash
npm run dev
```

### Build production

```bash
npm run build
```

### Cháº¡y production server

```bash
npm run start
```

### Lint

```bash
npm run lint
```

## 5. Cáº¥u trĂºc thÆ° má»¥c hiá»‡n táº¡i

```text
app/
â”œâ”€ (auth)/
â”‚  â””â”€ Auth.md
â”œâ”€ (dashboard)/
â”‚  â””â”€ Dashbaord.md
â”œâ”€ (public)/
â”‚  â”œâ”€ layout.tsx
â”‚  â””â”€ page.tsx
â””â”€ globals.css

components/
â”œâ”€ layouts/
â”‚  â”œâ”€ (dashboard)/
â”‚  â”‚  â””â”€ dashboeard.md
â”‚  â”œâ”€ (public)/
â”‚  â”‚  â”œâ”€ Footer/
â”‚  â”‚  â”‚  â””â”€ PublicFooter.tsx
â”‚  â”‚  â”œâ”€ Navbar/
â”‚  â”‚  â”‚  â””â”€ PublicNavbar.tsx
â”‚  â”‚  â””â”€ PublicSetup.tsx
â”‚  â””â”€ @base/
â”‚     â”œâ”€ Footer/
â”‚     â”‚  â””â”€ BaseFooter.tsx
â”‚     â””â”€ Navbar/
â”‚        â””â”€ BaseNavbar.tsx
â””â”€ pages/
   â””â”€ MainPage/
      â””â”€ Index.tsx

constants/
hooks/
libs/
middlewares/
public/
â”œâ”€ img/
â”‚  â””â”€ img.md
services/
store/
types/
utils/
```

## 6. Ă nghÄ©a chĂ­nh cá»§a tá»«ng pháº§n

- `app/`: nÆ¡i chá»©a route theo chuáº©n App Router cá»§a Next.js
- `app/(public)`: khu vá»±c public hiá»‡n Ä‘ang Ä‘Æ°á»£c render tháº­t
- `app/(auth)`: nÆ¡i chuáº©n bá»‹ cho cĂ¡c route xĂ¡c thá»±c
- `app/(dashboard)`: nÆ¡i chuáº©n bá»‹ cho cĂ¡c route sau Ä‘Äƒng nháº­p
- `components/layouts/@base`: cĂ¡c khung layout gá»‘c, chá»‰ lo pháº§n shell
- `components/layouts/(public)`: cĂ¡c layout component dĂ nh riĂªng cho public area
- `components/pages`: UI page-level Ä‘Ă£ tĂ¡ch khá»i route file
- `constants`: nÆ¡i Ä‘á»ƒ háº±ng sá»‘ cá»‘ Ä‘á»‹nh
- `hooks`: nÆ¡i Ä‘á»ƒ custom hooks
- `libs`: nÆ¡i Ä‘á»ƒ setup thÆ° viá»‡n dĂ¹ng chung
- `middlewares`: nÆ¡i Ä‘á»ƒ helper cho middleware hoáº·c logic guard
- `services`: nÆ¡i Ä‘á»ƒ logic gá»i API hoáº·c orchestration dá»¯ liá»‡u
- `store`: nÆ¡i Ä‘á»ƒ state dĂ¹ng chung náº¿u project cáº§n
- `types`: nÆ¡i Ä‘á»ƒ type/interface dĂ¹ng chung
- `utils`: nÆ¡i Ä‘á»ƒ helper function thuáº§n
- `public/img`: nÆ¡i Ä‘á»ƒ static image phá»¥c vá»¥ trá»±c tiáº¿p qua URL

## 7. Luá»“ng render hiá»‡n táº¡i cá»§a app

Luá»“ng cÆ¡ báº£n hiá»‡n táº¡i:

```text
Request "/"
-> app/(public)/layout.tsx
-> components/layouts/(public)/PublicSetup.tsx
-> PublicNavbar
-> BaseNavbar
-> app/(public)/page.tsx
-> components/pages/MainPage/Index.tsx
-> PublicFooter
-> BaseFooter
```

Ă nghÄ©a:

- `layout.tsx` lo khung ngoĂ i cĂ¹ng cá»§a route group
- `PublicSetup.tsx` compose navbar, ná»™i dung vĂ  footer
- `PublicNavbar.tsx` vĂ  `PublicFooter.tsx` truyá»n ná»™i dung vĂ o base layout
- `BaseNavbar.tsx` vĂ  `BaseFooter.tsx` chá»‰ lĂ  khung nháº­n `props`
- `page.tsx` chá»‰ render page component chĂ­nh

## 8. Quy Æ°á»›c layout hiá»‡n táº¡i

Project Ä‘ang Ä‘i theo hÆ°á»›ng:

- `@base` chá»‰ lĂ  khung
- layout cá»¥ thá»ƒ sáº½ truyá»n ná»™i dung vĂ o base qua `props`
- pháº§n setup theo khu vá»±c nhÆ° `public` sáº½ lĂ  nÆ¡i gá»i navbar, footer vĂ  bá»c `children`

VĂ­ dá»¥:

- `BaseNavbar.tsx`: nháº­n `brand`, `action`
- `BaseFooter.tsx`: nháº­n `left`, `right`
- `PublicNavbar.tsx`: truyá»n brand/action cá»¥ thá»ƒ cho public area
- `PublicFooter.tsx`: truyá»n ná»™i dung footer cá»¥ thá»ƒ cho public area
- `PublicSetup.tsx`: compose `PublicNavbar`, `children`, `PublicFooter`

CĂ¡ch chia nĂ y giĂºp:

- base component sáº¡ch hÆ¡n
- layout dá»… tĂ¡i sá»­ dá»¥ng
- ná»™i dung theo tá»«ng khu vá»±c khĂ´ng bá»‹ cá»©ng trong base

## 9. Tailwind trong project nĂ y

Project hiá»‡n dĂ¹ng **Tailwind CSS 4** qua CSS import:

```css
@import "tailwindcss";
```

Hiá»‡n táº¡i project chÆ°a dĂ¹ng `@tailwindcss/vite` vĂ¬ Ä‘Ă¢y lĂ  repo Next.js, khĂ´ng pháº£i Vite app.

NĂªn dĂ¹ng Tailwind trong repo nĂ y cho:

- layout
- spacing
- typography
- border
- responsive

Khi project lá»›n hÆ¡n, cĂ³ thá»ƒ chuáº©n hĂ³a tiáº¿p:

- color tokens
- spacing tokens
- reusable wrappers
- component variants

## 10. TypeScript trong project nĂ y

Project Ä‘ang báº­t TypeScript vá»›i cáº¥u hĂ¬nh Ä‘á»§ dĂ¹ng cho Next.js:

- `strict: true`
- alias `@/*`
- `moduleResolution: "bundler"`
- plugin Next.js trong `tsconfig.json`

NĂªn giá»¯ nguyĂªn hÆ°á»›ng:

- type dĂ¹ng chung Ä‘áº·t trong `types/`
- prop type Ä‘áº·t gáº§n component náº¿u chá»‰ dĂ¹ng cá»¥c bá»™
- trĂ¡nh Ä‘á»ƒ type ráº£i rĂ¡c khĂ´ng cĂ³ tá»• chá»©c

## 11. Quy táº¯c tá»• chá»©c code nĂªn giá»¯

- `page.tsx` chá»‰ nĂªn lo ghĂ©p mĂ n hĂ¬nh á»Ÿ má»©c route
- `components/pages` nĂªn chá»©a UI theo page nhÆ°ng tĂ¡ch khá»i route file
- `components/layouts` chá»‰ nĂªn lo shell vĂ  structure
- `@base` khĂ´ng nĂªn chá»©a ná»™i dung cá»©ng theo tá»«ng khu vá»±c
- `services` khĂ´ng render UI
- `hooks` khĂ´ng chá»©a JSX
- `utils` nĂªn lĂ  pure function cĂ ng nhiá»u cĂ ng tá»‘t
- `types` nĂªn lĂ  nÆ¡i táº­p trung contract dĂ¹ng chung

## 12. HÆ°á»›ng má»Ÿ rá»™ng há»£p lĂ½ cho repo nĂ y

Tá»« base hiá»‡n táº¡i, báº¡n cĂ³ thá»ƒ má»Ÿ rá»™ng thĂªm:

- auth flow
- protected dashboard routes
- middleware guard
- API client wrapper
- env config
- global store
- form library nhÆ° React Hook Form
- schema validation báº±ng Zod
- loading state vĂ  error boundary
- toast system
- theme switch

Náº¿u app lá»›n dáº§n, cĂ³ thá»ƒ bá»• sung thĂªm:

- `features/`
- `schemas/`
- `providers/`
- `api/`

## 13. Khi nĂ o nĂªn tĂ¡ch theo feature?

NĂªn tĂ¡ch theo feature khi:

- app cĂ³ nhiá»u module nghiá»‡p vá»¥ rĂµ rĂ ng
- má»—i module cĂ³ page, service, type, hook riĂªng
- team cĂ³ nhiá»u ngÆ°á»i cĂ¹ng lĂ m song song

VĂ­ dá»¥ sau nĂ y:

```text
features/
â”œâ”€ auth/
â”œâ”€ dashboard/
â”œâ”€ profile/
â””â”€ orders/
```

Náº¿u project váº«n nhá», giá»¯ cáº¥u trĂºc hiá»‡n táº¡i lĂ  Ä‘á»§ vĂ  dá»… Ä‘á»c hÆ¡n.

## 14. Checklist khi dĂ¹ng template nĂ y Ä‘á»ƒ báº¯t Ä‘áº§u project má»›i

- Ä‘á»•i tĂªn metadata vĂ  brand theo dá»± Ă¡n tháº­t
- thĂªm route tháº­t vĂ o `app/(public)`, `app/(auth)`, `app/(dashboard)`
- bá»• sung middleware náº¿u cĂ³ protected route
- thĂªm service layer Ä‘á»ƒ gá»i backend
- chuáº©n hĂ³a type dĂ¹ng chung
- thĂªm state management náº¿u app cáº§n
- thá»‘ng nháº¥t naming convention tá»« Ä‘áº§u
- giá»¯ `base` lĂ  khung, khĂ´ng nhĂ©t ná»™i dung nghiá»‡p vá»¥ vĂ o Ä‘Ă³

## 15. TĂ³m táº¯t

Náº¿u báº¡n muá»‘n má»™t base Next.js cĂ³:

- App Router
- cáº¥u trĂºc layout rĂµ
- route group rĂµ
- component base/public tĂ¡ch vai trĂ² rĂµ
- sáºµn chá»— Ä‘á»ƒ scale tiáº¿p

thĂ¬ repo nĂ y Ä‘ang Ä‘i Ä‘Ăºng hÆ°á»›ng.

NĂ³ khĂ´ng cĂ²n lĂ  template `React + Vite + React Router`, mĂ  lĂ  má»™t **Next.js client-oriented template** vá»›i cáº¥u trĂºc Ä‘á»§ sáº¡ch Ä‘á»ƒ phĂ¡t triá»ƒn tiáº¿p thĂ nh website, dashboard hoáº·c frontend app cĂ³ nhiá»u khu vá»±c giao diá»‡n.

