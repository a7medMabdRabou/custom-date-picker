# islamic-ksa-calender (محدد التقويم الهجري)

[![npm version](https://img.shields.io/npm/v/islamic-ksa-calender.svg?style=flat-square)](https://www.npmjs.com/package/islamic-ksa-calender)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?style=flat-square)](https://stenciljs.com)

مكتبة ويب خفيفة وسريعة لتحديد التاريخ الهجري (تقويم أم القرى / المملكة العربية السعودية) تعمل بسلاسة كمكون ويب (Web Component) مع جميع أطر العمل: **HTML, React, Angular, Vue, Next.js** وأي بيئة جافاسكريبت.

A modern, lightweight Hijri (Islamic / Umm al-Qura / Saudi Arabia) datepicker web component. Works seamlessly across **Vanilla HTML, React, Angular, Vue, Next.js**, and beyond.

---

## ✨ Features / المميزات

- 📅 **Umm al-Qura Hijri Calendar** — دقة عالية في حساب التقويم الهجري المعتمد في المملكة العربية السعودية.
- ⚡ **Auto-close on Select** — يُغلق محدد التاريخ تلقائياً بمجرد اختيار اليوم أو زر "اليوم".
- 🎯 **Auto-close on Click Outside** — إغلاق ذكي عند النقر خارج التقويم مع عدم التأثر بحقول الإدخال.
- 🚫 **Disable Future Dates** — دعم خاصية منع اختيار التواريخ المستقبلية (`disable-future`) المناسبة لتواريخ الميلاد والتسجيل.
- 📆 **Max Date Limit** — إمكانية تحديد حد أقصى للتاريخ (`max-date`).
- 🌐 **Arabic & English** — دعم كامل للغتين العربية والإنجليزية وأيام الأسبوع وأسماء الأشهر الهجرية.
- 🔄 **Two-way Sync & Events** — إرسال حدث `change` قياسي تلقائياً عند تغيير القيمة لتحديث النماذج والأطر.
- 🔌 **Universal Compatibility** — يعمل مع React, Vue, Angular, Svelte, Next.js, أو كملف HTML مستقل.

---

## 📦 Installation / التثبيت

### 1. Via NPM

```bash
npm install islamic-ksa-calender
```

or via Yarn:

```bash
yarn add islamic-ksa-calender
```

or via pnpm:

```bash
pnpm add islamic-ksa-calender
```

---

### 2. Via CDN (بدون تثبيت - مباشرة في المتصفح)

#### Option A: unpkg (NPM CDN)

```html
<script type="module" src="https://unpkg.com/islamic-ksa-calender@latest/dist/islamic-ksa-calender/islamic-ksa-calender.esm.js"></script>
<script nomodule src="https://unpkg.com/islamic-ksa-calender@latest/dist/islamic-ksa-calender/islamic-ksa-calender.js"></script>
```

#### Option B: jsDelivr (GitHub CDN)

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/a7medMabdRabou/custom-date-picker@main/dist/islamic-ksa-calender/islamic-ksa-calender.esm.js"></script>
```

---

### 3. Local / Standalone (بدون مدير حزم)

انسخ مجلد `dist/islamic-ksa-calender/` إلى مشروعك، ثم أضف في صفحتك:

```html
<script type="module" src="./dist/islamic-ksa-calender/islamic-ksa-calender.esm.js"></script>
```

راجع ملف [STANDALONE-FILES.md](STANDALONE-FILES.md) لمزيد من التفاصيل.

---

## 🚀 Usage Examples / أمثلة الاستخدام

### 1. Plain HTML / JavaScript

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>تجربة محدد التاريخ الهجري</title>
  <script type="module" src="https://unpkg.com/islamic-ksa-calender@latest/dist/islamic-ksa-calender/islamic-ksa-calender.esm.js"></script>
</head>
<body>

  <!-- Input Field -->
  <input type="text" id="hijri-date" placeholder="اختر التاريخ">

  <!-- Datepicker Component -->
  <datepicker-hijri reference="hijri-date" placement="bottom"></datepicker-hijri>

  <script>
    document.getElementById('hijri-date').addEventListener('change', (e) => {
      console.log('Selected date:', e.target.value);
    });
  </script>

</body>
</html>
```

---

### 2. React / Next.js

In your `index.js`, `App.js`, or root component:

```tsx
import React, { useEffect, useState } from 'react';
import { defineCustomElements } from 'islamic-ksa-calender/loader';

// Initialize the web component once in your app
if (typeof window !== 'undefined') {
  defineCustomElements(window);
}

export default function DatePickerExample() {
  const [date, setDate] = useState('');

  return (
    <div style={{ padding: '2rem', direction: 'rtl' }}>
      <label htmlFor="birthDate">تاريخ الميلاد الهجري:</label>
      <input
        type="text"
        id="birthDate"
        value={date}
        placeholder="1445/01/01"
        onChange={(e) => setDate(e.target.value)}
      />

      {/* Hijri Datepicker */}
      <datepicker-hijri
        reference="birthDate"
        disable-future
        placement="bottom"
        date-format="iYYYY/iMM/iDD"
      ></datepicker-hijri>
    </div>
  );
}
```

> **Note for Next.js (SSR):** Wrap `defineCustomElements` inside `useEffect` or check `typeof window !== 'undefined'` since web components are client-side only.

---

### 3. Vue 3 / Vite

In your `main.js`:

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import { defineCustomElements } from 'islamic-ksa-calender/loader';

defineCustomElements();

const app = createApp(App);
app.mount('#app');
```

In your component (`.vue`):

```html
<template>
  <div dir="rtl">
    <input type="text" id="vueHijriDate" v-model="selectedDate" placeholder="اختر التاريخ">
    <datepicker-hijri reference="vueHijriDate" placement="bottom" disable-future></datepicker-hijri>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const selectedDate = ref('');
</script>
```

---

### 4. Angular

In `main.ts` or `app.module.ts`:

```typescript
import { defineCustomElements } from 'islamic-ksa-calender/loader';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

defineCustomElements();

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
```

In your template (`app.component.html`):

```html
<input type="text" id="angularHijriDate" placeholder="اختر التاريخ">
<datepicker-hijri reference="angularHijriDate" placement="bottom"></datepicker-hijri>
```

---

## ⚙️ Properties & Attributes / الخصائص

| Attribute | Property | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `reference` | `reference` | `string` | **Required** | مُعرّف (`id`) عنصر الإدخال `input` أو الزر المرتبط. |
| `placement` | `placement` | `string` | `'bottom'` | موضع ظهور التقويم (`'bottom'`, `'top'`, `'right'`, `'left'`, `'auto'`). |
| `date-format` | `dateFormat` | `string` | `'iYYYY/iMM/iDD'` | صيغة التاريخ الهجري (راجع [moment-hijri](https://github.com/xsoh/moment-hijri)). |
| `selected-date` | `selectedDate` | `string` | `''` | التاريخ المحدد مبدئياً. |
| `disable-future` | `disableFuture` | `boolean` | `false` | تعطيل اختيار التواريخ المستقبلية (اليوم هو الحد الأقصى). |
| `disable-past` | `disablePast` | `boolean` | `false` | تعطيل اختيار التواريخ السابقة (اليوم هو الحد الأدنى - مناسب للحجوزات). |
| `max-date` | `maxDate` | `string` | `undefined` | حد أقصى مخصص للتاريخ (أي تاريخ بعده يكون معطلاً). |
| `min-date` | `minDate` | `string` | `undefined` | حد أدنى مخصص للتاريخ (أي تاريخ قبله يكون معطلاً). |
| `on-date-select-close` | `onDateSelectClose` | `boolean` | `true` | إغلاق التقويم تلقائياً بمجرد اختيار التاريخ (مفعل افتراضياً). |
| `bgcolor` | `bgcolor` | `string` | `'#f0f0f0'` | لون خلفية جميع خلايا التواريخ وزر "اليوم". |
| `selectedColor` | `selectedColor` | `string` | `'black'` | لون خلفية التاريخ المحدد حالياً (`selected`). |
| `textColor` | `textColor` | `string` | `'black'` | لون النص لأرقام الأيام وزر اليوم. |
| `selectedTextColor` | `selectedTextColor` | `string` | `'white'` | لون النص للتاريخ المحدد حالياً. |
| `hide-today` | `hideToday` | `boolean` | `false` | إخفاء زر "اليوم" من أسفل التقويم. |
| `today-text` | `todayText` | `string` | `'اليوم'` / `'Today'` | نص مخصص لزر "اليوم". |
| `placeholder` | `placeholder` | `string` | `undefined` | نص تلميحي (`placeholder`) يُضاف تلقائياً لحقل الإدخال المرتبط. |
| `disabled` | `disabled` | `boolean` | `false` | تعطيل محدد التاريخ وحقل الإدخال بالكامل. |
| `z-index` | `zIndex` | `string` | `'99999'` | ترتيب الطبقات (`z-index`) لحاوية التقويم المنبثقة. |
| `lang-code` | `langCode` | `string` | `'ar'` | لغة العرض (`'ar'` للعربية أو `'en'` للإنجليزية). |

---

## 🛠️ Common Use Cases / سيناريوهات شائعة

### منع التواريخ السابقة (مثل حجوزات الفنادق والرحلات):
```html
<input type="text" id="bookingDate" placeholder="تاريخ الحجز">
<datepicker-hijri reference="bookingDate" disable-past placement="bottom"></datepicker-hijri>
```

### تحديد نطاق زمني (Min & Max Date):
```html
<input type="text" id="rangeDate" placeholder="اختر تاريخاً ضمن النطاق">
<datepicker-hijri
  reference="rangeDate"
  min-date="1446/01/01"
  max-date="1446/12/30"
  placement="bottom"
></datepicker-hijri>
```

### إخفاء زر اليوم وتعيين تلميح تلقائي (Placeholder):
```html
<input type="text" id="dobInput">
<datepicker-hijri reference="dobInput" disable-future hide-today placeholder="اختر تاريخ الميلاد"></datepicker-hijri>
```

### تخصيص الألوان بالكامل (خلفية ونصوص):
```html
<input type="text" id="customTheme" placeholder="اختر التاريخ">
<datepicker-hijri
  reference="customTheme"
  bgcolor="#1e293b"
  textColor="#f8fafc"
  selectedColor="#3b82f6"
  selectedTextColor="#ffffff"
  placement="bottom"
></datepicker-hijri>
```

### ألوان مخصصة لخلفية التواريخ والتاريخ المحدد (Custom Colors):
```html
<input type="text" id="styledDate" placeholder="اختر التاريخ">
<datepicker-hijri
  reference="styledDate"
  bgcolor="#e8f5e9"
  selectedColor="#2e7d32"
  placement="bottom"
></datepicker-hijri>
```

### منع التواريخ المستقبلية (مثل تاريخ الميلاد أو الهوية):
```html
<input type="text" id="dob" placeholder="تاريخ الميلاد">
<datepicker-hijri reference="dob" disable-future placement="bottom"></datepicker-hijri>
```

### تحديد حد أقصى مخصص للتاريخ:
```html
<input type="text" id="reservation" placeholder="تاريخ الحجز">
<datepicker-hijri reference="reservation" max-date="1447/12/29" placement="bottom"></datepicker-hijri>
```

### استخدام صيغة مخصصة (مثل الشرطات):
```html
<input type="text" id="customFormat" placeholder="1445-02-15">
<datepicker-hijri reference="customFormat" date-format="iYYYY-iMM-iDD" placement="bottom"></datepicker-hijri>
```

### إبقاء التقويم مفتوحاً بعد الاختيار (اختياري):
```html
<datepicker-hijri reference="myInput" on-date-select-close="false"></datepicker-hijri>
```

---

## 🚢 Publishing to NPM / النشر على NPM

لإعادة نشر تحديثات الحزمة على npm:

1. تأكد من تسجيل الدخول إلى حسابك في npm:
   ```bash
   npm login
   ```
2. قم ببناء المكتبة:
   ```bash
   npm run build
   ```
3. نشر المكتبة:
   ```bash
   npm publish --access public
   ```

---

## 💻 Pushing to GitHub / الرفع إلى GitHub

```bash
git add .
git commit -m "feat: publish islamic-ksa-calender v1.0.0 with auto-close and clean structure"
git push origin main
```

---

## 📄 License / الترخيص

مرخص تحت رخصة [MIT License](LICENSE). مفتوح المصدر ومتاح للاستخدام التجاري والشخصي.
