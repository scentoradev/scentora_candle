# `middlewares`

## Purpose / Má»¥c Ä‘Ă­ch
- English: This folder is for middleware-related helpers or logic that control access, request flow, redirects, and security checks before a page or API handler runs.
- Tiáº¿ng Viá»‡t: ThÆ° má»¥c nĂ y dĂ¹ng cho helper hoáº·c logic liĂªn quan middleware Ä‘á»ƒ kiá»ƒm soĂ¡t quyá»n truy cáº­p, luá»“ng request, chuyá»ƒn hÆ°á»›ng vĂ  kiá»ƒm tra báº£o máº­t trÆ°á»›c khi trang hoáº·c API handler cháº¡y.

## What should live here / NĂªn Ä‘áº·t gĂ¬ á»Ÿ Ä‘Ă¢y
- English: Auth guards, path matchers, role checks, locale redirects, and reusable middleware helper functions.
- Tiáº¿ng Viá»‡t: Auth guard, path matcher, kiá»ƒm tra role, chuyá»ƒn hÆ°á»›ng theo ngĂ´n ngá»¯ vĂ  cĂ¡c helper middleware tĂ¡i sá»­ dá»¥ng.
- English: Shared logic that can support a root `middleware.ts` file.
- Tiáº¿ng Viá»‡t: Logic dĂ¹ng chung Ä‘á»ƒ há»— trá»£ cho file `middleware.ts` á»Ÿ root.

## What should not live here / KhĂ´ng nĂªn Ä‘áº·t á»Ÿ Ä‘Ă¢y
- English: UI components, client-side hooks, or page-specific business logic.
- Tiáº¿ng Viá»‡t: UI component, hook phĂ­a client hoáº·c logic nghiá»‡p vá»¥ chá»‰ dĂ nh cho má»™t trang cá»¥ thá»ƒ.

## Example / VĂ­ dá»¥
- English: `auth-guard.ts`, `match-protected-route.ts`, `role-access.ts`
- Tiáº¿ng Viá»‡t: `auth-guard.ts`, `match-protected-route.ts`, `role-access.ts`

