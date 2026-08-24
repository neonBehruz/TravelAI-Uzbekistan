# 📱 SAFAR AI — Mobil Ilova (APK / PWA) Bo'yicha Qo'llanma

Safar AI to'liq **Progressive Web App (PWA)** va **Native Mobil Ilova (APK)** arxitekturasi asosida tayyorlandi.

---

## 🚀 1. To'g'ridan-to'g'ri Telefonga O'rnatish (PWA / APK Rejimi)

Ilova to'liq ekranli mobil ilova sifatida ishlaydi:
- **Android (Chrome)**: `http://localhost:5173` (yoki domeningiz) ga kiring ➡️ Saytdagi **"O'rnatish"** tugmasini bosing yoki brauzer menyusidan **"Bosh ekranga qo'shish"**ni tanlang. Ilova telefon menyusida alohida APK kabi paydo bo'ladi.
- **iPhone / iPad (Safari)**: Saytga kiring ➡️ Pastdagi **"Ulashish" (Share)** ➡️ **"Bosh ekranga qo'shish" (Add to Home Screen)** ni bosing.

---

## 📦 2. Haqiqiy Android `.apk` Fayl Qilish (Capacitor / Bubblewrap)

Agar siz Google Play Store yoki do'stlaringizga `.apk` fayl sifatida tarqatmoqchi bo'lsangiz:

### Usul 1: Capacitor orqali Android Studio APK
```bash
cd frontend

# 1. Capacitor o'rnatish
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initsializatsiya
npx cap init "SAFAR AI" "uz.safarai.travel" --web-dir "dist"

# 3. Production build olish
npm run build

# 4. Android platformasini qo'shish
npx cap add android

# 5. Android Studio orqali ochish va APK yig'ish
npx cap open android
```
*Android Studio ochilganda `Build -> Build Bundle(s) / APK(s) -> Build APK(s)` bosilsa, tayyor `app-release.apk` fayli hosil bo'ladi.*

### Usul 2: Bubblewrap (TWA — Trusted Web Activity)
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://your-domain.com/manifest.webmanifest
bubblewrap build
```

---

## ✨ Mobil Ilova Xususiyatlari

- 📱 **Titanium Phone APK Simulator**: Katta kompyuter ekranida ham haqiqiy smartfon korpusi (Dynamic Island, 5G, batareya, soat) bilan sinab ko'rish imkoniyati.
- ⚡ **Oflayn Kesh (Service Worker)**: Internet sust bo'lganda ham xarita va ma'lumotlar xotirada saqlanadi.
- 📳 **Haptic Feedback**: Tugmalar va tablarni bosganda telefon tebranishi.
- 📷 **Kamera AI Skaneri**: Telefon kamerasidan jonli foydalanib obidalarni tanish.
- 🎙️ **Ovozli Tarjimon & Gid**: Real-vaqt mikrofon va ovozli suhbat.
