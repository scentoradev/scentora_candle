# `store`

## Purpose / Má»¥c Ä‘Ă­ch
- English: This folder stores shared client state management logic for data that must be accessed across multiple components or pages.
- Tiáº¿ng Viá»‡t: ThÆ° má»¥c nĂ y lÆ°u logic quáº£n lĂ½ state dĂ¹ng chung phĂ­a client cho dá»¯ liá»‡u cáº§n Ä‘Æ°á»£c truy cáº­p á»Ÿ nhiá»u component hoáº·c nhiá»u trang.

## What should live here / NĂªn Ä‘áº·t gĂ¬ á»Ÿ Ä‘Ă¢y
- English: Zustand stores, Redux slices, context state modules, selectors, and shared state actions.
- Tiáº¿ng Viá»‡t: Zustand store, Redux slice, module state cá»§a context, selector vĂ  action state dĂ¹ng chung.
- English: Centralized state that should not be recreated inside each component.
- Tiáº¿ng Viá»‡t: State trung tĂ¢m khĂ´ng nĂªn bá»‹ táº¡o láº¡i bĂªn trong tá»«ng component riĂªng láº».

## What should not live here / KhĂ´ng nĂªn Ä‘áº·t á»Ÿ Ä‘Ă¢y
- English: One-off local component state or server-only logic.
- Tiáº¿ng Viá»‡t: Local state chá»‰ dĂ¹ng má»™t láº§n trong component hoáº·c logic chá»‰ cháº¡y phĂ­a server.

## Example / VĂ­ dá»¥
- English: `auth-store.ts`, `theme-store.ts`, `sidebar-store.ts`
- Tiáº¿ng Viá»‡t: `auth-store.ts`, `theme-store.ts`, `sidebar-store.ts`

