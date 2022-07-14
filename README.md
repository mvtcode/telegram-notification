# telegram-notification
telegram notification bot

Đây là project gửi notification trên telegram và firebase

## Cấu hình Telegram

### Telegram
Trước tiên cần tạo bot telegram

- Trong telegram, tìm kiếm user có tên [BotFather](https://t.me/BotFather)
- Nhập `/newbot`
- Tiếp theo đặt tên bot, chú ý suffix của bot là _bot hoặc bot
- Sau khi xong, sẽ có link bot và token

Sau đó config vào project:

```
copy .env.example .env

### edit config
MONGODB_URI=mongodb://127.0.0.1:27017/notifications?retryWrites=true&w=majority # config db mongo
TELEGRAM_BOT_USERNAME=test_bot # tên bot vừa tạo
TELEGRAM_TOKEN=5565036395:AAHWCW20GMMg... # token của bot
TELEGRAM_ADMIN=1396805576 # id cảu người tạo, lấy cái này bằng các chat với bot để lấy id chính mình, chỉ có id này mới đc thực hiện một vài command
```

### Tính năng

#### Bot

- Chat private - phần này sẽ lấy đc id của người chat - sẽ lưu vào db để gửi notification sau này
- Bot đc thêm vào group - sẽ đc lưu vào db để gửi notification sau này
- Bot bị xóa khỏi group - tự động xóa group tương ứng sẽ ko gửi notification sau này

#### Admin

Admin sẽ có một vài feature command line

- /echo <message>: test thông tin project có start hay ko, và phản hồi lại message bạn đã gửi
- /list [page] [limit] [enable | disable] lấy danh sách user, group trong db
- /detail chi tiết id của user | group
- /enable <id>: enable notification - update db isEnable = true
- /disable <id>: disable notification - update db isEnable = false
- /send <id> <message>: admin sẽ gửi đoạn chat cho một user khác

## Firebase

- Tạo project truy cập vào [firebase](https://console.firebase.google.com/)
- Cấu hình Cloud Messaging
- Xong download file key vào thư mục `config` và đặt tên file là `serviceAccountKey.json`

Bạn hoàn toàn có thể ko động đến firebase trong src/index.js không sử dụng đến file modules/firebase/firebase

## Start project

Yêu cầu máy đc cài sẵn nodejs v14

```
npm i

# build
npm run build

```

## Author

Email: [macvantan@gmail.com](mailto:macvantan@gmail.com)

Fb: [fb/mvt.hp.star](https://www.facebook.com/mvt.hp.star)

Skype: [trai_12a1](skype:trai_12a1?chat)
