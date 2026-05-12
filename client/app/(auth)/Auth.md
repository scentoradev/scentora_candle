# `app/(auth)`

## Purpose / Má»¥c Ä‘Ă­ch
- English: This folder contains authentication routes such as login, register, forgot password, reset password, or verify account screens.
- Tiáº¿ng Viá»‡t: ThÆ° má»¥c nĂ y chá»©a cĂ¡c route liĂªn quan Ä‘áº¿n xĂ¡c thá»±c nhÆ° Ä‘Äƒng nháº­p, Ä‘Äƒng kĂ½, quĂªn máº­t kháº©u, Ä‘áº·t láº¡i máº­t kháº©u hoáº·c xĂ¡c minh tĂ i khoáº£n.

## What should live here / NĂªn Ä‘áº·t gĂ¬ á»Ÿ Ä‘Ă¢y
- English: Route files like `page.tsx`, nested layouts, loading states, and auth-specific UI pages.
- Tiáº¿ng Viá»‡t: CĂ¡c file route nhÆ° `page.tsx`, layout lá»“ng nhau, tráº¡ng thĂ¡i loading vĂ  cĂ¡c trang giao diá»‡n dĂ nh riĂªng cho xĂ¡c thá»±c.
- English: Form pages that only exist for signing in or managing access.
- Tiáº¿ng Viá»‡t: CĂ¡c trang form chá»‰ phá»¥c vá»¥ Ä‘Äƒng nháº­p hoáº·c quáº£n lĂ½ quyá»n truy cáº­p.

## What should not live here / KhĂ´ng nĂªn Ä‘áº·t á»Ÿ Ä‘Ă¢y
- English: Shared business logic, API clients, or reusable validation helpers. Those should go into `services`, `libs`, `utils`, or `types`.
- Tiáº¿ng Viá»‡t: Logic nghiá»‡p vá»¥ dĂ¹ng chung, API client hoáº·c helper validation tĂ¡i sá»­ dá»¥ng. CĂ¡c pháº§n Ä‘Ă³ nĂªn Ä‘áº·t trong `services`, `libs`, `utils` hoáº·c `types`.

## Example / VĂ­ dá»¥
- English: `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`
- Tiáº¿ng Viá»‡t: `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`

