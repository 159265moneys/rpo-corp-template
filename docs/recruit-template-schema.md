# Recruit Template Spreadsheet Schema

運送業界向け採用サイトテンプレを量産するための入力項目。
スプシでは1行=1社にして、CSVまたはJSONへ変換して `data/config.json` に流し込む想定。

## Minimum Columns

| column | example | usage |
| --- | --- | --- |
| company.name | ミギノ運送株式会社 | ヘッダー、フッター、ページタイトル |
| company.nameShort | ミギノ運送 | 本文内の短縮表記 |
| company.nameEn | MIGINO TRANSPORT CO., LTD. | ロゴ横、英字装飾 |
| company.addressZip | 135-0061 | フッター住所 |
| company.address | 東京都江東区豊洲3-2-20 | フッター住所 |
| company.phone | 03-5500-0000 | 電話導線 |
| company.email | info@example.co.jp | 問い合わせ導線 |
| page.title | 採用情報 \| ミギノ運送株式会社 | SEOタイトル |
| page.description | ミギノ運送株式会社の採用情報... | SEO説明文 |
| recruit.hero.line1 | 当たり前を | FV見出し1行目 |
| recruit.hero.line2 | 届けるために | FV見出し2行目 |
| recruit.hero.lead1 | いつでも、どこでも、 | FVリード1行目 |
| recruit.hero.lead2 | どんなときでも、 | FVリード2行目 |
| recruit.hero.lead3 | 安心安全に | FVリード3行目 |
| recruit.hero.lead4 | お客様のもとへ | FVリード4行目 |
| recruit.hero.lead5 | お荷物をお届けします。 | FVリード5行目 |
| recruit.hero.mainImage | assets/images/company-a-hero.jpg | FVメイン画像 |
| recruit.hero.subImage | assets/images/company-a-sub.jpg | FVサブ画像 |
| recruit.hero.driveImage | assets/images/company-a-drive.jpg | FVサブ画像 |
| recruit.hero.fleetImage | assets/images/company-a-fleet.jpg | FVサブ画像 |
| recruit.message.label | ABOUT MIGINO | メッセージ英字ラベル |
| recruit.message.title | 「運ぶ」を、\n誇れる仕事に。 | メッセージ見出し |
| recruit.message.body | 未経験から始めて... | メッセージ本文 |
| recruit.message.image | assets/images/company-a-message.jpg | メッセージ画像 |
| recruit.proof.item1Value | 47 | 実績カード1の数値 |
| recruit.proof.item1Label | 年の安定基盤 | 実績カード1の補足 |
| recruit.proof.item2Value | 87 | 実績カード2の数値 |
| recruit.proof.item2Label | 名の現場チーム | 実績カード2の補足 |
| recruit.proof.item3Value | 110 | 実績カード3の数値 |
| recruit.proof.item3Label | 日以上の休日 | 実績カード3の補足 |
| recruit.jobs.lead | 現場を動かすドライバー... | 募集職種セクション導入文 |
| recruit.cta.title | まずは話を、\n聞きに来てください。 | CTA見出し |
| recruit.cta.text | 応募の前に... | CTA本文 |

## JSON Columns

複数件あるブロックは、スプシの1セルにJSON配列として入れる。
`scripts/build-config-from-csv.mjs` は `[` または `{` で始まるセルをJSONとして読み込む。

| column | shape | usage |
| --- | --- | --- |
| recruit.positions | `[{ "id": "driver", "navTitle": "ドライバー", ... }]` | 職種タブ |
| recruit.voices | `[{ "role": "DRIVER / 入社3年", "name": "佐藤 健太", ... }]` | 社員インタビュー |
| recruit.dayFlow | `[{ "time": "06:30", "title": "出社・点呼", ... }]` | 1日の流れ |
| recruit.benefits | `[{ "icon": "calendar", "title": "免許取得支援", ... }]` | 福利厚生 |
| recruit.faq | `[{ "q": "未経験でも応募できますか？", "a": "はい..." }]` | FAQ |

### Example: recruit.positions

```json
[
  {
    "id": "driver",
    "navTitle": "ドライバー",
    "navSub": "Driver",
    "label": "DRIVER",
    "icon": "truck",
    "image": "assets/images/recruit-art-driver.jpg",
    "title": "4tルート配送ドライバー",
    "lead": "近距離ルート配送を担当します。未経験の方も同乗研修から始められます。",
    "rows": [
      { "label": "雇用形態", "value": "正社員" },
      { "label": "給与", "value": "月給28万円〜38万円" },
      { "label": "勤務時間", "value": "7:00〜16:00" },
      { "label": "休日休暇", "value": "月8日休み" },
      { "label": "応募資格", "value": "普通免許以上" },
      { "label": "待遇", "value": "社会保険完備／免許取得支援" }
    ]
  }
]
```

## Recommended Research Columns

営業前リサーチで集めると、生成コピーの精度が上がる項目。

| column | memo |
| --- | --- |
| source.websiteUrl | 既存コーポレートサイトURL |
| source.recruitUrl | 既存採用ページURL |
| research.area | 拠点/配送エリア |
| research.businessType | 一般貨物、冷凍冷蔵、建材、食品、倉庫など |
| research.mainCustomers | 食品メーカー、建設会社、EC倉庫など |
| research.openRoles | 募集中職種 |
| research.licenseSupport | 免許取得支援の有無 |
| research.salaryRange | 求人票にある給与レンジ |
| research.holidays | 休日、年間休日 |
| research.benefits | 手当、寮、制服、研修など |
| research.strengths | 地域密着、創業年数、車両台数、安全性など |
| research.painGuess | 採用で困っていそうなこと |

## Dynamic Blocks

現在、以下のブロックは `data/config.json` から動的生成できる。

- `recruit.positions[]`: 職種タブを配列から生成
- `recruit.voices[]`: 社員インタビューを配列から生成
- `recruit.benefits[]`: 福利厚生カードを配列から生成
- `recruit.faq[]`: FAQを配列から生成
- `recruit.dayFlow[]`: 1日の流れを配列から生成
