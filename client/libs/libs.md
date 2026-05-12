# `libs`

## Purpose / Má»¥c Ä‘Ă­ch
- English: This folder contains low-level library setup and integration code that connects the app to third-party packages or shared internal infrastructure.
- Tiáº¿ng Viá»‡t: ThÆ° má»¥c nĂ y chá»©a pháº§n thiáº¿t láº­p thÆ° viá»‡n má»©c tháº¥p vĂ  mĂ£ tĂ­ch há»£p Ä‘á»ƒ káº¿t ná»‘i app vá»›i package bĂªn thá»© ba hoáº·c háº¡ táº§ng dĂ¹ng chung ná»™i bá»™.

## What should live here / NĂªn Ä‘áº·t gĂ¬ á»Ÿ Ä‘Ă¢y
- English: HTTP client setup, authentication adapters, date libraries, logger setup, environment readers, and package wrappers.
- Tiáº¿ng Viá»‡t: Cáº¥u hĂ¬nh HTTP client, adapter xĂ¡c thá»±c, thÆ° viá»‡n ngĂ y giá», thiáº¿t láº­p logger, pháº§n Ä‘á»c biáº¿n mĂ´i trÆ°á»ng vĂ  wrapper cho package.
- English: Thin integration code that other layers import.
- Tiáº¿ng Viá»‡t: MĂ£ tĂ­ch há»£p má»ng Ä‘á»ƒ cĂ¡c táº§ng khĂ¡c import láº¡i sá»­ dá»¥ng.

## What should not live here / KhĂ´ng nĂªn Ä‘áº·t á»Ÿ Ä‘Ă¢y
- English: Route UI, page components, or business use-case orchestration.
- Tiáº¿ng Viá»‡t: Giao diá»‡n route, component trang hoáº·c pháº§n Ä‘iá»u phá»‘i use-case nghiá»‡p vá»¥.

## Example / VĂ­ dá»¥
- English: `axios.ts`, `auth-client.ts`, `env.ts`, `dayjs.ts`
- Tiáº¿ng Viá»‡t: `axios.ts`, `auth-client.ts`, `env.ts`, `dayjs.ts`

