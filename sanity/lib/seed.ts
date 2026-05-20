import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token:      process.env.SANITY_API_TOKEN!,
  useCdn:     false,
});

// ─────────────────────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────────────────────

const BRANDS = [
  { name: "Apple",    country: "USA",          website: "https://apple.com",             isFeatured: true  },
  { name: "Samsung",  country: "South Korea",  website: "https://samsung.com",           isFeatured: true  },
  { name: "Google",   country: "USA",          website: "https://store.google.com",      isFeatured: false },
  { name: "Tecno",    country: "China",        website: "https://tecno.com",             isFeatured: true  },
  { name: "Infinix",  country: "China",        website: "https://infinixmobility.com",   isFeatured: false },
  { name: "Anker",    country: "China",        website: "https://anker.com",             isFeatured: false },
  { name: "Baseus",   country: "China",        website: "https://baseus.com",            isFeatured: false },
  { name: "Romoss",   country: "China",        website: "https://romoss.com",            isFeatured: false },
  { name: "Xiaomi",   country: "China",        website: "https://mi.com",                isFeatured: false },
  { name: "Sony",     country: "Japan",        website: "https://sony.com",              isFeatured: false },
  { name: "Dell",     country: "USA",          website: "https://dell.com",              isFeatured: false },
  { name: "HP",       country: "USA",          website: "https://hp.com",                isFeatured: false },
  { name: "Lenovo",   country: "China",        website: "https://lenovo.com",            isFeatured: false },
  { name: "Asus",     country: "Taiwan",       website: "https://asus.com",              isFeatured: false },
  { name: "Garmin",   country: "USA",          website: "https://garmin.com",            isFeatured: false },
  { name: "Oraimo",   country: "China",        website: "https://oraimo.com",            isFeatured: true  },
  { name: "Belkin",   country: "USA",          website: "https://belkin.com",            isFeatured: false },
  { name: "Logitech", country: "Switzerland",  website: "https://logitech.com",          isFeatured: false },
];

const CATEGORIES = [
  { title: "Phones",       slug: "phones",       icon: "Smartphone",      order: 1, isFeatured: true  },
  { title: "Laptops",      slug: "laptops",      icon: "Laptop",          order: 2, isFeatured: true  },
  { title: "Smartwatches", slug: "smartwatches", icon: "Watch",           order: 3, isFeatured: true  },
  { title: "Power Banks",  slug: "power-banks",  icon: "BatteryCharging", order: 4, isFeatured: true  },
  { title: "Earbuds",      slug: "earbuds",      icon: "Headphones",      order: 5, isFeatured: true  },
  { title: "Accessories",  slug: "accessories",  icon: "Cable",           order: 6, isFeatured: true  },
];

const PRODUCTS = [
  // PHONES
  {
    id: "p001", name: "iPhone 16 Pro Max", slug: "iphone-16-pro-max", brand: "Apple",
    category: "phones", price: 2350000, discountPrice: 2199000,
    shortDescription: "6.9\" Super Retina XDR · A18 Pro · 48MP ProCamera System",
    description: "The iPhone 16 Pro Max pushes the boundaries of what a smartphone can do. The A18 Pro chip delivers desktop-class performance, the 48MP ProCamera system captures cinematic detail, and the titanium design is as stunning as it is durable.",
    specs: [
      { key: "Display",      value: "6.9\" Super Retina XDR OLED, ProMotion 120Hz" },
      { key: "Processor",    value: "A18 Pro chip (3nm)" },
      { key: "RAM",          value: "8GB" },
      { key: "Storage",      value: "256GB / 512GB / 1TB" },
      { key: "Main Camera",  value: "48MP Fusion + 48MP Ultrawide + 12MP 5× Tetraprism" },
      { key: "Front Camera", value: "12MP TrueDepth" },
      { key: "Battery",      value: "4685 mAh, 30W MagSafe" },
      { key: "OS",           value: "iOS 18" },
      { key: "Dimensions",   value: "163 × 77.6 × 8.25 mm" },
      { key: "Weight",       value: "227g" },
    ],
    rating: 4.9, reviewCount: 5421, stockCount: 35,
    isFeatured: true, isNew: true, isBestseller: true,
    tags: ["5g", "flagship", "ios", "magsafe"],
  },
  {
    id: "p002", name: "Samsung Galaxy S25 Ultra", slug: "samsung-galaxy-s25-ultra", brand: "Samsung",
    category: "phones", price: 2100000, discountPrice: 1950000,
    shortDescription: "6.9\" Dynamic AMOLED · Snapdragon 8 Elite · 200MP · S Pen",
    description: "The Galaxy S25 Ultra is Samsung's most powerful phone ever. With a built-in S Pen, 200MP quad-camera array, and the fastest Snapdragon 8 Elite chip.",
    specs: [
      { key: "Display",     value: "6.9\" Dynamic AMOLED 2X, QHD+, 120Hz" },
      { key: "Processor",   value: "Snapdragon 8 Elite" },
      { key: "RAM",         value: "12GB LPDDR5X" },
      { key: "Storage",     value: "256GB / 512GB / 1TB" },
      { key: "Main Camera", value: "200MP + 50MP ultrawide + 10MP + 50MP periscope" },
      { key: "Battery",     value: "5000 mAh, 45W fast charge, 15W wireless" },
      { key: "OS",          value: "Android 15, One UI 7" },
      { key: "S Pen",       value: "Included" },
    ],
    rating: 4.8, reviewCount: 3874, stockCount: 52,
    isFeatured: true, isNew: true, isBestseller: true,
    tags: ["5g", "s-pen", "amoled", "flagship"],
  },
  {
    id: "p003", name: "Google Pixel 9 Pro", slug: "google-pixel-9-pro", brand: "Google",
    category: "phones", price: 1480000, discountPrice: 1350000,
    shortDescription: "6.3\" LTPO OLED · Tensor G4 · 7 Years Updates",
    description: "The Pixel 9 Pro is Google's most refined phone. Tensor G4 powers on-device AI features like Magic Eraser, Best Take, and Call Screen.",
    specs: [
      { key: "Display",   value: "6.3\" LTPO OLED, 1-120Hz, 2992×1344" },
      { key: "Processor", value: "Google Tensor G4" },
      { key: "RAM",       value: "16GB" },
      { key: "Storage",   value: "128GB / 256GB / 512GB / 1TB" },
      { key: "Camera",    value: "50MP + 48MP ultrawide + 48MP 5× telephoto" },
      { key: "Battery",   value: "4700 mAh, 37W, 23W wireless" },
      { key: "OS",        value: "Android 15 (pure)" },
      { key: "Updates",   value: "7 years OS + security" },
    ],
    rating: 4.7, reviewCount: 2134, stockCount: 80,
    isFeatured: false, isNew: true, isBestseller: false,
    tags: ["ai", "camera", "pure-android"],
  },
  {
    id: "p004", name: "Samsung Galaxy A55 5G", slug: "samsung-galaxy-a55-5g", brand: "Samsung",
    category: "phones", price: 580000, discountPrice: 520000,
    shortDescription: "6.6\" Super AMOLED · Exynos 1480 · 50MP OIS · IP67",
    description: "Flagship-level design at a mid-range price with 120Hz Super AMOLED, OIS, and IP67.",
    specs: [
      { key: "Display",          value: "6.6\" Super AMOLED, FHD+, 120Hz" },
      { key: "Processor",        value: "Exynos 1480 (4nm)" },
      { key: "RAM",              value: "8GB" },
      { key: "Storage",          value: "128GB / 256GB" },
      { key: "Main Camera",      value: "50MP OIS + 12MP ultrawide + 5MP macro" },
      { key: "Battery",          value: "5000 mAh, 25W" },
      { key: "Water Resistance", value: "IP67" },
      { key: "OS",               value: "Android 14, One UI 6.1" },
    ],
    rating: 4.5, reviewCount: 4210, stockCount: 145,
    isFeatured: false, isNew: false, isBestseller: true,
    tags: ["5g", "mid-range", "amoled", "ip67"],
  },
  {
    id: "p005", name: "Tecno Phantom V Flip2", slug: "tecno-phantom-v-flip2", brand: "Tecno",
    category: "phones", price: 720000, discountPrice: 649000,
    shortDescription: "6.9\" Foldable AMOLED · Dimensity 8020 · Dual Screen",
    description: "Nigeria's favourite flip phone gets better with a vibrant cover display and 45W fast charge.",
    specs: [
      { key: "Display",   value: "6.9\" AMOLED (inner) + 1.32\" cover display" },
      { key: "Processor", value: "MediaTek Dimensity 8020" },
      { key: "RAM",       value: "8GB" },
      { key: "Storage",   value: "256GB" },
      { key: "Camera",    value: "50MP + 13MP ultrawide" },
      { key: "Battery",   value: "4000 mAh, 45W" },
      { key: "OS",        value: "Android 14, HiOS 14" },
    ],
    rating: 4.4, reviewCount: 1203, stockCount: 60,
    isFeatured: true, isNew: true, isBestseller: false,
    tags: ["foldable", "flip", "amoled"],
  },
  {
    id: "p006", name: "Infinix Note 40 Pro", slug: "infinix-note-40-pro", brand: "Infinix",
    category: "phones", price: 320000, discountPrice: 285000,
    shortDescription: "6.78\" AMOLED · 100W Thunder Charge · 50MP AI Camera",
    description: "Built for Nigeria with 100W wired charging that takes you from 0 to 100% in under 30 minutes.",
    specs: [
      { key: "Display",   value: "6.78\" AMOLED, FHD+, 120Hz" },
      { key: "Processor", value: "Helio G99 Ultimate" },
      { key: "RAM",       value: "12GB (8GB + 4GB extended)" },
      { key: "Storage",   value: "256GB" },
      { key: "Camera",    value: "50MP AI + 2MP depth" },
      { key: "Battery",   value: "5000 mAh, 100W Thunder Charge" },
      { key: "OS",        value: "Android 14, XOS 14" },
    ],
    rating: 4.4, reviewCount: 3187, stockCount: 200,
    isFeatured: false, isNew: false, isBestseller: true,
    tags: ["fast-charge", "budget", "amoled"],
  },

  // LAPTOPS
  {
    id: "l001", name: "Apple MacBook Pro 14\" M4", slug: "macbook-pro-14-m4", brand: "Apple",
    category: "laptops", price: 3850000, discountPrice: 3599000,
    shortDescription: "14\" Liquid Retina XDR · M4 Pro · 24GB · Up to 22hr battery",
    description: "The MacBook Pro 14-inch with M4 Pro — outrageous performance, stunning display, and all-day battery.",
    specs: [
      { key: "Display",   value: "14.2\" Liquid Retina XDR, 3024×1964, ProMotion" },
      { key: "Processor", value: "Apple M4 Pro (12-core CPU, 20-core GPU)" },
      { key: "Memory",    value: "24GB Unified Memory" },
      { key: "Storage",   value: "512GB SSD" },
      { key: "Battery",   value: "Up to 22 hours" },
      { key: "Ports",     value: "3× Thunderbolt 5, HDMI 2.1, SD, MagSafe 3" },
      { key: "Weight",    value: "1.62 kg" },
      { key: "OS",        value: "macOS Sequoia" },
    ],
    rating: 4.9, reviewCount: 3201, stockCount: 20,
    isFeatured: true, isNew: true, isBestseller: true,
    tags: ["workstation", "creative", "macos", "m4"],
  },
  {
    id: "l002", name: "Dell XPS 15 OLED", slug: "dell-xps-15-oled", brand: "Dell",
    category: "laptops", price: 2850000, discountPrice: 2599000,
    shortDescription: "15.6\" 3.5K OLED · Core Ultra 9 · RTX 4070 · 32GB",
    description: "The ultimate Windows creative laptop with a breathtaking 3.5K OLED display and RTX 4070.",
    specs: [
      { key: "Display",   value: "15.6\" 3.5K OLED, 3456×2160, 60Hz, 100% DCI-P3" },
      { key: "Processor", value: "Intel Core Ultra 9 185H" },
      { key: "GPU",       value: "NVIDIA RTX 4070 (8GB)" },
      { key: "Memory",    value: "32GB DDR5" },
      { key: "Storage",   value: "1TB NVMe SSD" },
      { key: "Battery",   value: "Up to 13 hours" },
      { key: "Weight",    value: "1.86 kg" },
      { key: "OS",        value: "Windows 11 Pro" },
    ],
    rating: 4.8, reviewCount: 1543, stockCount: 18,
    isFeatured: true, isNew: false, isBestseller: false,
    tags: ["oled", "creative", "gaming", "windows"],
  },
  {
    id: "l005", name: "Asus ROG Zephyrus G16", slug: "asus-rog-zephyrus-g16", brand: "Asus",
    category: "laptops", price: 3200000, discountPrice: 2899000,
    shortDescription: "16\" 2.5K 240Hz · Ryzen AI 9 · RTX 4080 · 32GB",
    description: "The gaming laptop for those who won't compromise — RTX 4080 power in a slim chassis.",
    specs: [
      { key: "Display",   value: "16\" QHD+ 2560×1600, 240Hz, 100% DCI-P3" },
      { key: "Processor", value: "AMD Ryzen AI 9 HX 370" },
      { key: "GPU",       value: "NVIDIA RTX 4080 (12GB)" },
      { key: "Memory",    value: "32GB DDR5" },
      { key: "Storage",   value: "1TB NVMe PCIe 4.0" },
      { key: "Weight",    value: "1.95 kg" },
      { key: "OS",        value: "Windows 11 Home" },
    ],
    rating: 4.8, reviewCount: 1102, stockCount: 15,
    isFeatured: true, isNew: true, isBestseller: false,
    tags: ["gaming", "rtx4080", "240hz"],
  },

  // SMARTWATCHES
  {
    id: "w001", name: "Apple Watch Series 10", slug: "apple-watch-series-10", brand: "Apple",
    category: "smartwatches", price: 720000, discountPrice: 665000,
    shortDescription: "46mm LTPO AMOLED · ECG · Sleep Apnea Detection · Titanium",
    description: "The thinnest Apple Watch ever with sleep apnea detection, ECG, and the brightest display to date.",
    specs: [
      { key: "Display",          value: "46mm LTPO AMOLED, Always-On" },
      { key: "Health",           value: "ECG, SpO2, Sleep Apnea (FDA-cleared), Crash Detection" },
      { key: "Battery",          value: "Up to 18 hours (36hr low power)" },
      { key: "Water Resistance", value: "50m" },
      { key: "Connectivity",     value: "Wi-Fi 6, Bluetooth 5.3, NFC" },
      { key: "Material",         value: "Titanium / Aluminium" },
    ],
    rating: 4.9, reviewCount: 6201, stockCount: 55,
    isFeatured: true, isNew: true, isBestseller: true,
    tags: ["ecg", "sleep-apnea", "ios", "titanium"],
  },
  {
    id: "w002", name: "Samsung Galaxy Watch 7", slug: "samsung-galaxy-watch-7", brand: "Samsung",
    category: "smartwatches", price: 485000, discountPrice: 440000,
    shortDescription: "47mm BioActive Sensor · Exynos W1000 · Body Composition",
    description: "Samsung's most advanced health sensors — body composition, ECG, blood pressure, all in one watch.",
    specs: [
      { key: "Display",          value: "47mm Super AMOLED, 480×480" },
      { key: "Processor",        value: "Exynos W1000 (3nm)" },
      { key: "Health",           value: "BioActive Sensor, ECG, Blood Pressure, Body Composition" },
      { key: "Battery",          value: "7 days typical" },
      { key: "Water Resistance", value: "5 ATM + IP68" },
      { key: "OS",               value: "Wear OS 5 + One UI Watch 6" },
    ],
    rating: 4.7, reviewCount: 2341, stockCount: 70,
    isFeatured: false, isNew: true, isBestseller: true,
    tags: ["health", "body-composition", "android"],
  },
  {
    id: "w004", name: "Xiaomi Smart Band 9 Pro", slug: "xiaomi-smart-band-9-pro", brand: "Xiaomi",
    category: "smartwatches", price: 85000, discountPrice: 72000,
    shortDescription: "1.74\" AMOLED · 21-day battery · 150+ Workout Modes",
    description: "Premium features at an incredible price — 21-day battery, SpO2, and 150+ workout modes.",
    specs: [
      { key: "Display",          value: "1.74\" AMOLED, Always-On" },
      { key: "Battery",          value: "21 days typical" },
      { key: "Water Resistance", value: "5 ATM" },
      { key: "Health",           value: "SpO2, Heart Rate, Stress, Sleep" },
      { key: "Sports",           value: "150+ workout modes" },
      { key: "Connectivity",     value: "Bluetooth 5.3" },
    ],
    rating: 4.5, reviewCount: 8921, stockCount: 250,
    isFeatured: false, isNew: true, isBestseller: true,
    tags: ["budget", "fitness", "amoled"],
  },

  // POWER BANKS
  {
    id: "pb001", name: "Anker Prime 27,650mAh", slug: "anker-prime-27650", brand: "Anker",
    category: "power-banks", price: 195000, discountPrice: 169000,
    shortDescription: "27,650mAh · 250W Max Output · Charge Laptop + 2 Phones",
    description: "Anker's most powerful power bank — 250W max charges a MacBook Pro while powering two other devices.",
    specs: [
      { key: "Capacity",      value: "27,650 mAh" },
      { key: "Max Output",    value: "250W (USB-C1)" },
      { key: "Ports",         value: "2× USB-C, 1× USB-A" },
      { key: "Self-Recharge", value: "170W in ~37 min" },
      { key: "Weight",        value: "635g" },
    ],
    rating: 4.8, reviewCount: 3412, stockCount: 65,
    isFeatured: true, isNew: false, isBestseller: true,
    tags: ["250w", "laptop-charging", "gan"],
  },
  {
    id: "pb002", name: "Baseus Blade 100W", slug: "baseus-blade-100w", brand: "Baseus",
    category: "power-banks", price: 95000, discountPrice: 82000,
    shortDescription: "20,000mAh · 100W PD · Ultra-Slim 10.9mm",
    description: "Impossibly slim at 10.9mm — charges laptops at 100W PD and slips into the thinnest bags.",
    specs: [
      { key: "Capacity",   value: "20,000 mAh" },
      { key: "Max Output", value: "100W PD" },
      { key: "Thickness",  value: "10.9mm" },
      { key: "Weight",     value: "415g" },
      { key: "Ports",      value: "2× USB-C, 1× USB-A" },
    ],
    rating: 4.6, reviewCount: 5621, stockCount: 120,
    isFeatured: false, isNew: false, isBestseller: true,
    tags: ["slim", "100w", "laptop"],
  },
  {
    id: "pb003", name: "Romoss Sense 8P+ 30,000mAh", slug: "romoss-sense-8p-30000", brand: "Romoss",
    category: "power-banks", price: 45000, discountPrice: 38000,
    shortDescription: "30,000mAh · 22.5W · Triple Output · Perfect for NEPA",
    description: "The go-to power bank for NEPA situations — keeps your devices charged through extended outages.",
    specs: [
      { key: "Capacity",   value: "30,000 mAh" },
      { key: "Max Output", value: "22.5W" },
      { key: "Ports",      value: "2× USB-A, 1× USB-C, 1× Micro-USB (in)" },
      { key: "Weight",     value: "570g" },
    ],
    rating: 4.4, reviewCount: 12034, stockCount: 400,
    isFeatured: false, isNew: false, isBestseller: true,
    tags: ["high-capacity", "nepa", "budget"],
  },
  {
    id: "pb004", name: "Xiaomi 33W Pocket Edition", slug: "xiaomi-33w-pocket-edition", brand: "Xiaomi",
    category: "power-banks", price: 28000,
    shortDescription: "10,000mAh · 33W Two-Way Fast Charge · Ultra Compact",
    description: "Xiaomi's most portable power bank — 33W two-way fast charging in a pocket-sized form.",
    specs: [
      { key: "Capacity",      value: "10,000 mAh" },
      { key: "Max Output",    value: "33W" },
      { key: "Self-Recharge", value: "33W" },
      { key: "Weight",        value: "220g" },
      { key: "Ports",         value: "1× USB-C, 1× USB-A" },
    ],
    rating: 4.5, reviewCount: 15201, stockCount: 500,
    isFeatured: false, isNew: false, isBestseller: true,
    tags: ["compact", "budget", "fast-charge"],
  },

  // EARBUDS
  {
    id: "e001", name: "Apple AirPods Pro 2", slug: "airpods-pro-2", brand: "Apple",
    category: "earbuds", price: 620000, discountPrice: 579000,
    shortDescription: "H2 Chip · Adaptive ANC · Hearing Aid · 30hr total",
    description: "AirPods Pro 2 — clinically validated hearing aids with Personalised Spatial Audio and Adaptive ANC.",
    specs: [
      { key: "Chip",             value: "Apple H2" },
      { key: "ANC",              value: "Adaptive Transparency + Active Noise Cancellation" },
      { key: "Spatial Audio",    value: "Personalised + head-tracked" },
      { key: "Battery",          value: "6h (buds) + 24h (case), MagSafe charging" },
      { key: "Water Resistance", value: "IP54" },
      { key: "Codec",            value: "AAC, Apple Lossless (ALAC)" },
    ],
    rating: 4.9, reviewCount: 9871, stockCount: 95,
    isFeatured: true, isNew: false, isBestseller: true,
    tags: ["anc", "spatial-audio", "ios"],
  },
  {
    id: "e002", name: "Sony WF-1000XM5", slug: "sony-wf-1000xm5", brand: "Sony",
    category: "earbuds", price: 490000, discountPrice: 430000,
    shortDescription: "Industry-leading ANC · LDAC Hi-Res · 36hr total · Multipoint",
    description: "Sony's finest earbuds — industry-best ANC, LDAC Hi-Res audio, Multipoint for two devices.",
    specs: [
      { key: "Drivers",          value: "8.4mm Dynamic" },
      { key: "ANC",              value: "Integrated Processor V2 + QN2e" },
      { key: "Battery",          value: "8h (buds) + 24h (case)" },
      { key: "Charging",         value: "USB-C + wireless Qi" },
      { key: "Water Resistance", value: "IPX4" },
      { key: "Codec",            value: "LDAC, AAC, SBC" },
      { key: "Connection",       value: "Multipoint (2 devices)" },
    ],
    rating: 4.8, reviewCount: 4523, stockCount: 80,
    isFeatured: true, isNew: false, isBestseller: true,
    tags: ["anc", "ldac", "hi-res"],
  },
  {
    id: "e004", name: "Oraimo FreePods 4", slug: "oraimo-freepods-4", brand: "Oraimo",
    category: "earbuds", price: 25000, discountPrice: 20000,
    shortDescription: "ANC · 30hr total · ENC Calls · Made for Africa",
    description: "Africa's favourite earbuds — ANC, ENC calls, and 30 hours battery at a price that makes sense.",
    specs: [
      { key: "ANC",              value: "35dB noise reduction" },
      { key: "Battery",          value: "6h (buds) + 24h (case)" },
      { key: "Call Quality",     value: "4-mic ENC" },
      { key: "Water Resistance", value: "IPX5" },
      { key: "Connectivity",     value: "Bluetooth 5.3" },
      { key: "Charging",         value: "USB-C" },
    ],
    rating: 4.4, reviewCount: 21034, stockCount: 500,
    isFeatured: false, isNew: false, isBestseller: true,
    tags: ["anc", "budget", "africa"],
  },

  // ACCESSORIES
  {
    id: "a001", name: "Anker 13-in-1 Thunderbolt Hub", slug: "anker-13in1-thunderbolt-hub", brand: "Anker",
    category: "accessories", price: 185000, discountPrice: 159000,
    shortDescription: "Thunderbolt 4 · Dual 4K · 100W PD · 2.5G Ethernet",
    description: "One Thunderbolt 4 cable → 13 ports. Dual 4K, 100W laptop charging, 2.5G Ethernet.",
    specs: [
      { key: "Interface",      value: "Thunderbolt 4" },
      { key: "Ports",          value: "2× TB4, 3× USB-A 3.2, 2× USB-C, HDMI, DP, 2.5G ETH, SD, 3.5mm" },
      { key: "Power Delivery", value: "100W" },
      { key: "Max Resolution", value: "Dual 4K @ 60Hz" },
      { key: "Material",       value: "Aluminium alloy" },
    ],
    rating: 4.7, reviewCount: 2341, stockCount: 85,
    isFeatured: false, isNew: false, isBestseller: true,
    tags: ["thunderbolt4", "hub", "4k"],
  },
  {
    id: "a002", name: "Belkin 3-in-1 MagSafe Charger", slug: "belkin-3in1-magsafe-charger", brand: "Belkin",
    category: "accessories", price: 98000, discountPrice: 85000,
    shortDescription: "15W MagSafe · Apple Watch · AirPods · MFi Certified",
    description: "Charge your entire Apple ecosystem at once — MagSafe iPhone, Apple Watch, and AirPods. MFi certified.",
    specs: [
      { key: "iPhone Output",  value: "15W MagSafe" },
      { key: "Watch Output",   value: "5W fast charge" },
      { key: "AirPods Output", value: "5W Qi" },
      { key: "Certification",  value: "Apple MFi" },
      { key: "Cable",          value: "2m USB-C" },
    ],
    rating: 4.6, reviewCount: 3210, stockCount: 120,
    isFeatured: false, isNew: false, isBestseller: true,
    tags: ["magsafe", "wireless", "apple"],
  },
  {
    id: "a003", name: "Logitech MX Master 3S", slug: "logitech-mx-master-3s", brand: "Logitech",
    category: "accessories", price: 145000, discountPrice: 129000,
    shortDescription: "8K DPI · Whisper-Quiet Clicks · MagSpeed Scroll · 3-Device",
    description: "The world's most advanced mouse — whisper-quiet clicks, MagSpeed scrolling, 3 computers simultaneously.",
    specs: [
      { key: "Sensor",       value: "Darkfield High Precision, 200–8000 DPI" },
      { key: "Scroll",       value: "MagSpeed electromagnetic" },
      { key: "Battery",      value: "70 days, USB-C" },
      { key: "Connection",   value: "Bluetooth + Logi Bolt USB" },
      { key: "Multi-device", value: "Up to 3 computers" },
    ],
    rating: 4.9, reviewCount: 7821, stockCount: 95,
    isFeatured: true, isNew: false, isBestseller: true,
    tags: ["productivity", "ergonomic", "multi-device"],
  },
  {
    id: "a004", name: "Samsung 65W GaN Trio Charger", slug: "samsung-65w-gan-trio-charger", brand: "Samsung",
    category: "accessories", price: 35000, discountPrice: 28000,
    shortDescription: "65W GaN · 3 Ports (2× USB-C + USB-A) · Global Compatible",
    description: "Charge laptop, phone, and tablet from one tiny GaN adapter. Globally compatible, folds flat for travel.",
    specs: [
      { key: "Total Output",  value: "65W" },
      { key: "Ports",         value: "2× USB-C (PD), 1× USB-A" },
      { key: "Technology",    value: "GaN III" },
      { key: "Compatibility", value: "Universal (100–240V)" },
      { key: "Weight",        value: "120g" },
    ],
    rating: 4.6, reviewCount: 4512, stockCount: 300,
    isFeatured: false, isNew: false, isBestseller: true,
    tags: ["gan", "charger", "travel", "65w"],
  },
];

// ─────────────────────────────────────────────────────────────
// SEED FUNCTIONS
// ─────────────────────────────────────────────────────────────

async function seedBrands(): Promise<Record<string, string>> {
  console.log("\n📦 Seeding brands…");
  const brandIdMap: Record<string, string> = {};
  for (const b of BRANDS) {
    const slug = b.name.toLowerCase().replace(/\s+/g, "-");
    const doc  = await client.createOrReplace({
      _type: "brand",
      _id:   `brand-${slug}`,
      name:  b.name,
      slug:  { _type: "slug", current: slug },
      country:    b.country,
      website:    b.website,
      isFeatured: b.isFeatured,
    });
    brandIdMap[b.name] = doc._id;
    console.log(`  ✅ Brand: ${b.name}`);
  }
  return brandIdMap;
}

async function seedCategories(): Promise<Record<string, string>> {
  console.log("\n📂 Seeding categories…");
  const categoryIdMap: Record<string, string> = {};
  for (const c of CATEGORIES) {
    const doc = await client.createOrReplace({
      _type:      "category",
      _id:        `category-${c.slug}`,
      title:      c.title,
      slug:       { _type: "slug", current: c.slug },
      icon:       c.icon,
      order:      c.order,
      isFeatured: c.isFeatured,
    });
    categoryIdMap[c.slug] = doc._id;
    console.log(`  ✅ Category: ${c.title}`);
  }
  return categoryIdMap;
}

async function seedProducts(
  brandIdMap: Record<string, string>,
  categoryIdMap: Record<string, string>
) {
  console.log("\n🛍  Seeding products…");

  const colorMap: Record<string, string> = {
    phones:        "06b6d4",
    laptops:       "06b6d4",
    smartwatches:  "06b6d4",
    "power-banks": "f59e0b",
    earbuds:       "7c3aed",
    accessories:   "06b6d4",
  };

  for (const p of PRODUCTS) {
    const brandId    = brandIdMap[p.brand];
    const categoryId = categoryIdMap[p.category];

    if (!brandId) {
      console.warn(`  ⚠️  Brand not found: ${p.name} (${p.brand})`);
      continue;
    }
    if (!categoryId) {
      console.warn(`  ⚠️  Category not found: ${p.name} (${p.category})`);
      continue;
    }

    const accent = colorMap[p.category] ?? "06b6d4";
    const label  = encodeURIComponent(p.name.replace(/['"]/g, ""));

    await client.createOrReplace({
      _type: "product",
      _id:   `product-${p.id}`,
      name:  p.name,
      slug:  { _type: "slug", current: p.slug },
      brand:    { _type: "reference", _ref: brandId    },
      category: { _type: "reference", _ref: categoryId },
      price:            p.price,
      discountPrice:    (p as any).discountPrice,
      shortDescription: p.shortDescription,
      description: [
        {
          _type: "block", _key: "intro", style: "normal", markDefs: [],
          children: [{ _type: "span", _key: "text", text: p.description, marks: [] }],
        },
      ],
      images: [
        {
          _type: "productImage", _key: "primary",
          alt: p.name, isPrimary: true,
          image: {
            _type: "image",
            asset: {
              _type: "reference",
              _sanityAsset: `image@https://placehold.co/600x600/1e293b/${accent}?text=${label}`,
            },
          },
        },
      ],
      specs:        p.specs,
      rating:       p.rating,
      reviewCount:  p.reviewCount,
      stockCount:   p.stockCount,
      isFeatured:   p.isFeatured,
      isNew:        p.isNew,
      isBestseller: p.isBestseller,
      tags:         p.tags,
    });

    console.log(`  ✅ Product: ${p.name}`);
  }
}

/** 
 * Patches ONLY the category field on already-seeded products.
 * Run this if you seeded products before categories existed.
 */
async function patchProductCategories(categoryIdMap: Record<string, string>) {
  console.log("\n🔧 Patching product category references…");

  for (const p of PRODUCTS) {
    const categoryId = categoryIdMap[p.category];
    if (!categoryId) {
      console.warn(`  ⚠️  Category not found for patch: ${p.name} (${p.category})`);
      continue;
    }

    await client
      .patch(`product-${p.id}`)
      .set({ category: { _type: "reference", _ref: categoryId } })
      .commit();

    console.log(`  ✅ Patched: ${p.name} → ${p.category}`);
  }
}

// ─────────────────────────────────────────────────────────────
// MAIN  —  controls what runs
// ─────────────────────────────────────────────────────────────
async function main() {
  const mode = process.argv[2] ?? "all";

  console.log("🚀 Horlarz Gadgets — Sanity Seed");
  console.log(`   Project : ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`   Dataset : ${process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production"}`);
  console.log(`   Mode    : ${mode}\n`);

  try {
    if (mode === "all") {
      // Full seed — brands → categories → products
      const brandIdMap    = await seedBrands();
      const categoryIdMap = await seedCategories();
      await seedProducts(brandIdMap, categoryIdMap);

    } else if (mode === "categories") {
      // Seed categories only
      await seedCategories();

    } else if (mode === "patch") {
      // Already have brands + products — just patch category references
      const categoryIdMap = await seedCategories();
      await patchProductCategories(categoryIdMap);

    } else {
      console.error(`❌ Unknown mode: "${mode}". Use: all | categories | patch`);
      process.exit(1);
    }

    console.log("\n✨ Done! Open Sanity Studio to verify.\n");
  } catch (err) {
    console.error("\n❌ Seed failed:", err);
    process.exit(1);
  }
}

main();