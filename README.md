# Motoshare Backend README & Documentation
<p align="center">
  <a herf="https://github.com/HiIamJeff67/MotoShare">
    <img src="https://wwlrotbiuxxgezibxngr.supabase.co/storage/v1/object/public/DecoratingPictures/motorbike.jpg" width="240" alt="MotoShare Logo" />
  </a>
</p>

<p align="center">A backend application built with various technologies or tools below.</p>
<p align="center">
  <a href="https://nestjs.com/" target="_blank">
    <img src="https://img.shields.io/badge/NestJS-Framework-brightgreen.svg" alt="NestJS" />
  </a>
  <a href="https://orm.drizzle.team/" target="_blank">
    <img src="https://img.shields.io/badge/Drizzle-SQL%20Framework-blue.svg" alt="Drizzle" />
  </a>
  <a href="https://neon.tech/" target="_blank">
    <img src="https://img.shields.io/badge/Neon-Database%20Hosting-orange.svg" alt="Neon" />
  </a>
  <a href="https://supabase.com/" target="_blank">
    <img src="https://img.shields.io/badge/Supabase-Storage%20for%20Online%20Photos-red.svg" alt="Supabase" />
  </a>
  <a href="https://www.postgresql.org/" target="_blank">
    <img src="https://img.shields.io/badge/PostgreSQL-Database-purple.svg" alt="PostgreSQL" />
  </a>
  <a href="https://vercel.com/" target="_blank">
    <img src="https://img.shields.io/badge/Vercel-Deployment%20%26%20API%20Hosting-lightblue.svg" alt="Vercel" />
  </a>
  <a href="https://render.com/" target="_blank">
    <img src="https://img.shields.io/badge/Render-Deployment%20%26%20API%20Hosting-yellow.svg" alt="Render" />
  </a>
  <a href="https://stripe.com/" target="_blank">
    <img src="https://img.shields.io/badge/Stripe-Payment%20API-pink.svg" alt="Stripe" />
  </a>
  <a href="https://www.npmjs.com/package/bcrypt" target="_blank">
    <img src="https://img.shields.io/badge/Bcrypt-Sensitive%20Data%20Hashing-lightgrey.svg" alt="Bcrypt" />
  </a>
  <a href="https://www.typescriptlang.org/" target="_blank">
    <img src="https://img.shields.io/badge/TypeScript-Main%20Programming%20Language-blueviolet.svg" alt="TypeScript" />
  </a>
  <a href="https://github.com/marak/Faker.js/" target="_blank">
    <img src="https://img.shields.io/badge/Faker-Seeding%20to%20Database-orange.svg" alt="Faker" />
  </a>
  <a href="https://socket.io/" target="_blank">
    <img src="https://img.shields.io/badge/WebSocket%20%26%20Socket.io-Realtime%20Response-yellowgreen.svg" alt="WebSocket & Socket.io" />
  </a>
  <a href="https://nodemailer.com/" target="_blank">
    <img src="https://img.shields.io/badge/Mailer-Send%20Special%20Mail%20for%20Validation%2C%20Welcome%2C%20etc.-lightcoral.svg" alt="Mailer" />
  </a>
  <a href="https://jwt.io/" target="_blank">
    <img src="https://img.shields.io/badge/JWT-Bearer%20Token-forestgreen.svg" alt="JWT" />
  </a>
</p>

## Overview

This repository contains the backend services for the Motoshare application, which includes functionalities for both passengers and riders (ridders). The services are designed to handle various operations such as authentication, payment processing, notifications, and user preferences, etc.

## Brief Preface

由於我們對於這個專題題目的許多地方具有爭議，也非常重視且小心的處理每個細節跟 API 運作方式、資料邏輯等等，所以你將會看到幾乎所有模組底下的 Controller 對於 Error Type 具有特定的引用來自於 /src/exceptions（詳細 Error 種類的管理與規範放在 Trello 的規範板上面），同時我們也對於很多模組底下的 Service 內的 function 也實作 SQL transaction，用於確保多個指令去更新 database 時，可以具有原子性（atomic），使得 database 的資料可以被完善保護。
且由於我們的 database 採雙使用者（Passenger、Ridder）的形式，所以大量實作 transaction 我們認為勢在必行，即使這會導致後端撰寫的 Service 之 API 邏輯會非常冗長（很多模組光 Service 就有大約 600 ~ 1000 行的程式碼，再加上 Controller 應該往往會有 1500 行以上），由此也可見到我們團隊成員的用心良苦 😅。

## Diagram & Other Docs

麻煩請在 /docs 底下查看，那裡放了包含：
- (`ErrorTypesDefinition`) Obsidian 裡用於記錄所有後端發送至前端的錯誤類型以分享給同組成員方便他們觀看並在偵錯時提供更詳細的資訊，跟 `/src/exceptions` 裡面的所有 Exception 是相呼應的，當初是透過 Obsidian 寫的，那麼輸出後自然是 `Markdown(.md)` 檔。
- (`PostmanExports/`) Postman 測試用的所有 API，可以在 Postman 當中點擊 Import 然後加入你想要的版本的 json 檔。
- (`SystemDiagrams/`) Class Diagram，後端與前端互動的詳細情況，以及後端所有模組等等。
- (`database schema.drawio.png`, `database schema.drawio.xml`, `database schema(abandon).mdj`) Database Schema，有 StarUML 的檔案（但是是舊版），也有 png 檔跟 xml 檔（這是新版，透過 draw.io 製作）。
- (`user story.svg`) User Story，這是使用者故事，為 svg 檔，它是蠻早的版本，非必要請不要參考這個版本的 User Story。

### Passenger Series

- **PassengerService**
  - **主要方法**：
    - `getPassengerWithInfoByUserId(userId: string)`: 根據用戶 ID 獲取乘客信息。
    - `updatePassengerInfoByUserId(userId: string, info: UpdatePassengerInfoDto)`: 更新乘客信息。
    - `resetPassengerAccessTokenById(id: string)`: 重置乘客的訪問令牌。

- **PassengerAuthService**
  - **主要方法**：
    - `sendAuthenticationCodeById(id: string, title: string)`: 發送身份驗證碼給指定的乘客。
    - `validatePassengerInfo(dto: ValidatePassengerInfoDto)`: 驗證乘客信息。

- **PassengerBankService**
  - **主要方法**：
    - `createPaymentIntentForAddingBalance(userId: string, userName: string, email: string, amount: number)`: 創建支付意圖以增加餘額。
    - `getMyBalance(userId: string)`: 獲取乘客的餘額。

- **PassengerNotificationService**
  - **主要方法**：
    - `createPassengerNotificationByUserId(notification: NotificationTemplateInterface)`: 根據用戶 ID 創建乘客通知。
    - `updatePassengerNotificationToReadStatus(id: string, userId: string)`: 更新乘客通知為已讀狀態。

- **PassengerPreferencesService**
  - **主要方法**：
    - `createPassengerPreferenceByPreferenceUserName(userId: string, preferenceUserName: string)`: 根據偏好用戶名創建乘客偏好。
    - `deletePassengerPreferenceByUserIdAndPreferenceUserId(userId: string, preferenceUserName: string)`: 刪除乘客的偏好設置。

- **PassengerRecordService**
  - **主要方法**：
    - `storeSearchRecordByUserId(id: string, storePassengerRecordDto: StorePassengerRecordDto)`: 根據用戶 ID 存儲搜索記錄。
    - `getSearchRecordsByUserId(id: string)`: 獲取用戶的搜索記錄。

- **PassengerInviteService**
  - **主要方法**：
    - `createPassengerInvite(dto: CreatePassengerInviteDto)`: 創建乘客邀請。
    - `deletePassengerInviteById(id: string, inviterId: string)`: 根據邀請 ID 刪除乘客邀請。

### Ridder Series

- **RidderService**
  - **主要方法**：
    - `getRidderWithInfoByUserId(userId: string)`: 根據用戶 ID 獲取車主信息。
    - `updateRidderInfoByUserId(userId: string, info: UpdateRidderInfoDto)`: 更新車主信息。

- **RidderAuthService**
  - **主要方法**：
    - `sendAuthenticationCodeById(id: string, title: string)`: 發送身份驗證碼給指定的車主。
    - `validateRidderInfo(dto: ValidateRidderInfoDto)`: 驗證車主信息。

- **RidderBankService**
  - **主要方法**：
    - `createPaymentIntentForAddingBalance(userId: string, userName: string, email: string, amount: number)`: 創建支付意圖以增加車主餘額。
    - `getMyBalance(userId: string)`: 獲取車主的餘額。

- **RidderNotificationService**
  - **主要方法**：
    - `createRidderNotificationByUserId(notification: NotificationTemplateInterface)`: 根據用戶 ID 創建車主通知。
    - `updateRidderNotificationToReadStatus(id: string, userId: string)`: 更新車主通知為已讀狀態。

- **RidderPreferencesService**
  - **主要方法**：
    - `createRidderPreferenceByPreferenceUserName(userId: string, preferenceUserName: string)`: 根據偏好用戶名創建車主偏好。
    - `deleteRidderPreferenceByUserIdAndPreferenceUserId(userId: string, preferenceUserName: string)`: 刪除車主的偏好設置。

- **RidderInviteService**
  - **主要方法**：
    - `createRidderInvite(dto: CreateRidderInviteDto)`: 創建車主邀請。
    - `deleteRidderInviteById(id: string, inviterId: string)`: 根據邀請 ID 刪除車主邀請。

- **RidderRecordService**
  - **主要方法**：
    - `storeSearchRecordByUserId(id: string, storeRidderRecordDto: StoreRidderRecordDto)`: 根據用戶 ID 存儲車主搜索記錄。
    - `getSearchRecordsByUserId(id: string)`: 獲取車主的搜索記錄。

## Class Relationships

- **Service 與 Database**: 每個 Service 通常會依賴於一個資料庫連接（`DrizzleDB`），用於執行 CRUD 操作。
- **Service 與 Notification**: `PassengerNotificationService` 和 `RidderNotificationService` 負責處理通知的創建和更新，並且可能會被其他 Service 調用以發送通知。
- **Service 與 Auth**: `PassengerAuthService` 和 `RidderAuthService` 負責處理身份驗證和授權，並且會與其他 Service 交互以驗證用戶的身份。

## Hightlight Technologies

- **Vercel Cron Job（排程器）**: 透過 Vercel 支援的 Cron Job，在 `vercel.json` 底下裡的 "cron" 欄位指定並告訴 Vercel 在什麼樣的週期下要跑什麼 API，具體要跑的 API 則是寫在 `/src/cron` 這個 folder 底下，直接轉寫成 NestJS Module，然後做成 RESTful API。主要安排的部分依照時間分成2個 Cron Job（因為 Vercel 免費版只支援最多2個 Cron Job，也就是說 `vercel.json` 裡面只能指定2個，因此濃縮所有工作至此2個）
  - 其中一個主要用於自動把週期性訂單轉成一般訂單以實現需求文件的其中一項：週期性訂單需求，就是指定給 vercel 的 "path": `/api/cron/mainCronJobWorkflowWeekly`的 那個，他會把目前所有的 PeriodicPurchaseOrder 依照其中兩個欄位 startAfter 和 endedAt 來指定訂單開始與結束的時間（只參考時間，不參考幾年幾月幾日，所以儲存格式為9999-12-31T????），在透過 PeriodicPurchaseOrder 的另一個欄位 scheduledDay 來指定會在星期幾，進而在每週日的 22:00 建立下一週的訂單（將PeriodicPurchaseOrder 轉換成 PurchaseOrder）。＊同理 PeriodicSupplyOrder 和 SupplyOrder。
  - 另一個主要用於維護資料庫中已過期的訂單（PurchaseOrder 或 SupplyOrder）、已過期的邀請（PassengerInvite 或 RidderInvite）、開始時間到了但是尚未開始的進行中的訂單（Order），舉例：
    - PurchaseOrder 當初建立所期望的開始以及結束時間（startAfter 和 endedAt）已經超過現在，但是還留著（留在 PurchaseOrder，注意：我們的PurchaseOrder 跟 SupplyOrder 代表正在張貼給他人看，他人可以邀請，如果有指定 autoAccept 也可以直接開始，開始後就不再是 PurchaseOrder，而是 Order，且原本的 PurchaseOrder 不會直接消失，但他的狀態會被更新成 EXPIRED，這是用來在日後如果訂單（Order）被取消，可以再返還狀態回到 POSTED），那我們會透過這個 Cron Job 來把它轉成 EXPIRED。
    - 另外除狀態更新，一些例子像是已經取消或是過期超過一週的訂單，包括 PurchaseOrder、SupplyOrder、PassengerInvite、RidderInvite、Order，這個 Cron Job 也會將其從 database 裡永久刪除。

- **Render WebSocket（即時響應）**: 在 Render 支援之下，我們終於可以實現 API 也可以有通道監聽使用者的操作進而「即時」提醒使用者一些事情，我們實作的方式主要分成 database 更新與紀錄靜態且持久的資料，搭配 Server 的WebSocket 讓使用者獲取即時、最新的資料，如此達成使用者可以即時獲得通知，並可進到通知頁面查看過去的所有通知以及通知內容的詳細情況。具體的所有實作細節放在 `/src/notification/`，WebSocket 賴於 NestJS 的原聲開發方式（Gateway）且放在 `/src/notification/notification.gateway.ts`，而 database 以及 RESTful API 處理靜態儲存與批量通知獲取則是放在 `/src/notification` 之下的 `passengerNofication.controller.ts`, `passengerNofication.service.ts`, `ridderNotification.controller.ts`, `ridderNotification.service.ts`，另外還有 `notificationTemplate/` 這個資料夾，用於儲存所有通知的模板。
  - 通知的模板？因為我想讓其他模組可以在開發的時候簡單的調用通知，然後傳遞一些必要的資訊就好，這使得我後來把 passengerNotification 和 ridderNotification 做成可以快速 Inject 到其他模組，然後透過一個 function call，做到同時加入該通知到 database 又發出 WebSocket 的即時通知給使用者（如果他有在線的話），加上為了讓 WebSocket 通知可以更加方便的直接儲存在 database 而不用過度考慮格式問題，因此我為多種通知情況建立對應的模板。＊這可以在像是 PassengerInvite 建立時看到（也就是當乘客對車主的 SupplyOrder 發出邀請時）（位於`/src/passengerInvite/passengerInvite.service.ts` 的 `createPassengerInviteByOrderId()` 看到接近 return 的地方有個 `this.ridderNotification.createRidderNotificationByUserId()` 並傳入「基於對應通知模板」的參數。
  - Gateway細節？主要有 `handleConnection()` 和 `handleDisconnection()` 來處理用戶初始連接跟斷開連接 WebSocket 的情況所註冊的預設通道，然後透過建立部署階段 SocketMap，當使用者開始監聽 notification 通道（Gateway 名稱）時（也就是當使用者登入後），我們會拿他的 token 去綁定對應的 socketId，而這筆資料會儲存在 SocketMap 裡，以供日後透過使用者 id 去得到該使用者的 socketId 進而 notify 該使用者。
  - 接著透過 service 去引用 gateway 裡面的 `notifyPassenger()`, `notifyRidder()` 這2個 function 來對想要提醒的使用者發送通知。

- **Stripe Webhook（確認完成付款的API）**: 在 Stripe 的支援下，我們得以讓使用者加值他的帳號或是對一筆訂單付款，我們目前包括後端跟前端都只有讓使用者透過 Stripe 加值餘額，然後透過餘額付款。在後端的部分，我們透過前端對後端發送付款請求，然後後端呼叫 Stripe 來產生付款相關資訊（我們使用 PaymentIntent 這個 Stripe 內建的一種付款種類），然後在前端正確完成付款後，讓 Stripe 主動使用我們給予的 Webhook 並攜帶相關用戶資訊，在後端會處理 database 的用戶餘額更新，相繫實作細節放在 `/src/stripe`（用於初始化後端的 Stripe）和 `/src/webhook` （用於給 Stripe 偵測用戶完成付款後調用）以及 `/src/passengerBank`、`/src/ridderBank`。
  - Stripe 呼叫 Webhook 我們怎麼知道他是由 Stripe 發出而不是其他惡意用戶？Stripe 調用 Webhook 時他的 headers 會攜帶一個 type 為 string 的資料名叫：stripe-signature ，這會在 Webhook 的模組裡的一個 function `handleStripeWebhook()` 透過 Stripe 內建的一個方法 `this.stripe.webhooks.constructEvent()` 解析，進而確保這個 Webhook 只有 Stripe 可以調用來更新我們的 database。
  - 用戶付款時，我們也有透過 database 的 transaction 來確保所有帳戶金額操作的原子性（atomic），再度強調，這點其實也可以在很多其他 service 看到（大量應用 transaction的例子）。

- **Mailer（寄送信件服務）**: 透過 Mailer，我們得以向使用者發送包括歡迎信、驗證信，或是讓使用者對我們的管理員信箱（motoshare767@gmail.com）發送回報信，主要實作部分放在 `/src/email`，一樣可以 Inject 給其他模組，讓其他模組也可以呼叫這個模組來選擇時機寄信給使用者，這裡也有製作信件模板，主要用於給使用者更好的體驗，信件模板位於 `/src/email/emailTemplate`。
  - 在 /src/passengerAuth 和 `/src/ridderAuth` 底下的 `API：sendAuthCodeForEmail`, `sendAuthCodeToResetForgottenPassword`, `sendAuthCodeToResetEmailOrPassword` 都是透過寄送驗證信給使用者，然後讓使用者在拿到信中的 AuthCode（六碼數字）後攜帶著這個 AuthCode 和一些必要資訊跑另外三個對應的 API：`validateAuthCodeForEmail`, `validateAuthCodeToResetForgottenPassword`, `validateAuthCodeToResetEmailOrPassword`，進而完成相關驗證或重設服務。
  - 歡迎信包括兩種版本，一個是小彩蛋，如果使用者的名稱裡面有我們後端的開發者的名字，那他顯示一小段驚喜留言在歡迎信的下方，要得到歡迎信的話，請使用可以接收到信件的信箱，或是註冊使用 Google 註冊並在之後查看 Gmail。
  - 回報信則是只會寄到我們的管理員信箱，也是有搭配模板做一點小小的排版，以便後續維護人員觀感上的體驗。

- **Trigger Setup（Trigger Builder）**: 單純透過撰寫一些 function 用來對 host database 的 Neon 建置 Trigger 使用，由於 Neon 沒有方法可以像是建立 Table 那樣的方式在 code base 撰寫程式碼，所以我做了一個小功能，實作部分放在 `/src/triggers`，然後透過 `package.json` 內的一個自訂的開發指令 db:setup-trigger，後面再接在 `/src/triggers` 裡要建置到 Neon 的 Trigger 之檔案位置，舉例：我寫好一個 Function 和 Trigger 在 `/src/triggers/passengerNotification.trigger.ts` 裡（我是透過先寫好 function 再在檔案最下方呼叫它來執行），那我可以透過執行 `npm run db:setup-trigger passengerNotification.trigger` 來執行它並實際建置我要的 Trigger，這也仰賴在 `/src/scripts` 裡的 `setup-trigger.ts` 來達成。

- **Faker Seeding（快速批量建立虛構使用者資料到 database 以供測試）**: 透過轉寫不同 Operator 在 `/src/seeds/` 裡的所有 "_" 開頭的 TypeScript 檔案，引用 Faker 擴充套件來完成虛構用戶資料的生成。目前只有實作到自動建立 Passenger, Ridder, PurchaseOrder（Passenger 的訂單）, SupplyOrder（Ridder 的訂單）, PassengerInvite（Passenger 對 Ridder 的訂單之邀請）, RidderInvite（Ridder 對 Passenger 的訂單之邀請）。＊方法就不多贅述，你可以在上述位置查看所有檔案內的程式碼，裡面的 function 名稱很好地詮釋了具體運作的細

## Deployment

- **Vercel**: https://motoshare-backend.vercel.app
  - ✅ 具有較穩定連線狀況，平均 delay-time 在 500~2000 ms，若處理註冊可能會需要較長時間。
  - ✅ 免費版支援最多2個排程器，目前主要用於維護 database 中的資料。
  - ❌ 不支援 WebSocket，無法接收並傳遞即時訊息。

- **Render**: https://motoshare-x7gp.onrender.com
  - ❌ 伺服器有分兩種狀態，active 和 idle，為了節省資源，Render 常常會在 API 不頻繁呼叫時自主進到idle 狀態，而這個從 idle 狀態轉到 active 狀態的所需時間非常漫長，早成許久沒跑過 API 之後要登入或註冊，這個步驟所花的 delay-time 常常會來到分鐘級，造成 API 的不穩定。
  - ✅ 如前述，但是進入到 active 狀態後，平均 delay-time 大概只有 300 ~ 500 ms，非常快速。
  - ❌ 不支援排程器。
  - ✅ 支援 WebSocket，可以讓託管部署的伺服器有 WebSocket 的 Gateway 通道，使得我們可以指定特定通道監聽。
