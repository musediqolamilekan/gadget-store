import { Product } from "@/types";

export const mockProducts: Product[] = [
  // ── PHONES ──────────────────────────────────────────────────
  {
    id: "p001",
    name: "NovaPulse X15 Pro",
    slug: "novapulse-x15-pro",
    brand: "NovaTech",
    category: "phones",
    price: 1199,
    discountPrice: 999,
    shortDescription: "6.7\" LTPO AMOLED · Snapdragon 8 Gen 3 · 200MP Camera",
    description:
      "The NovaPulse X15 Pro redefines what a flagship phone can be. With its ultra-bright 6.7-inch LTPO AMOLED display, next-gen Snapdragon 8 Gen 3 chipset, and a revolutionary 200MP periscope camera system, every moment is captured in breathtaking clarity. Built with aerospace-grade titanium and Gorilla Glass Victus 3.",
    images: [
      { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80", alt: "NovaPulse X15 Pro front", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80", alt: "NovaPulse X15 Pro back" },
    ],
    specs: {
      Display: "6.7\" LTPO AMOLED, 2K+, 120Hz",
      Processor: "Snapdragon 8 Gen 3",
      RAM: "12GB / 16GB LPDDR5X",
      Storage: "256GB / 512GB UFS 4.0",
      "Main Camera": "200MP periscope + 50MP ultrawide + 12MP telephoto",
      "Front Camera": "32MP",
      Battery: "5500 mAh, 100W fast charge, 50W wireless",
      OS: "Android 15",
      Dimensions: "163.3 × 74.4 × 8.4 mm",
      Weight: "218g",
    },
    rating: 4.8,
    reviewCount: 1243,
    stockCount: 47,
    isFeatured: true,
    isNew: true,
    isBestseller: false,
    tags: ["5g", "flagship", "amoled"],
  },
  {
    id: "p002",
    name: "PixelCore 8 Ultra",
    slug: "pixelcore-8-ultra",
    brand: "PixelCore",
    category: "phones",
    price: 849,
    discountPrice: 799,
    shortDescription: "6.3\" pOLED · Tensor G4 · Pure Android 15",
    description:
      "Experience the purest Android with the PixelCore 8 Ultra. Powered by the custom Tensor G4 chip with on-device AI magic, it learns your habits, powers your camera, and keeps you secure.",
    images: [
      { url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80", alt: "PixelCore 8 Ultra", isPrimary: true },
    ],
    specs: {
      Display: "6.3\" pOLED, 2400×1080, 120Hz",
      Processor: "Tensor G4",
      RAM: "12GB",
      Storage: "256GB",
      "Main Camera": "50MP + 48MP ultrawide + 48MP telephoto",
      Battery: "4900 mAh, 30W wired, 23W wireless",
      OS: "Android 15 (pure)",
    },
    rating: 4.6,
    reviewCount: 874,
    stockCount: 120,
    isFeatured: true,
    isNew: false,
    isBestseller: true,
    tags: ["ai", "clean-android", "camera"],
  },

  // ── LAPTOPS ─────────────────────────────────────────────────
  {
    id: "l001",
    name: "AeroBook Pro 16",
    slug: "aerobook-pro-16",
    brand: "AeroTech",
    category: "laptops",
    price: 2199,
    discountPrice: 1899,
    shortDescription: "16\" Mini-LED · M3 Max · 36GB Unified Memory",
    description:
      "The AeroBook Pro 16 is an engineering marvel. A stunning 16-inch Liquid Retina XDR display paired with blazing M3 Max performance, up to 22 hours battery life, and a chassis machined from a single aluminum billet.",
    images: [
      { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80", alt: "AeroBook Pro 16 open", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80", alt: "AeroBook Pro 16 side" },
    ],
    specs: {
      Display: "16.2\" Liquid Retina XDR, 3456×2234, ProMotion",
      Processor: "M3 Max (14-core CPU, 30-core GPU)",
      Memory: "36GB Unified Memory",
      Storage: "1TB SSD",
      Battery: "Up to 22 hours",
      Ports: "3× Thunderbolt 4, HDMI 2.1, SD, MagSafe 3",
      Weight: "2.14 kg",
      OS: "macOS Sequoia",
    },
    rating: 4.9,
    reviewCount: 2019,
    stockCount: 23,
    isFeatured: true,
    isNew: false,
    isBestseller: true,
    tags: ["workstation", "creative", "macos"],
  },
  {
    id: "l002",
    name: "NexSlate X1 Carbon",
    slug: "nexslate-x1-carbon",
    brand: "NexSlate",
    category: "laptops",
    price: 1349,
    shortDescription: "14\" 2.8K OLED · Intel Core Ultra 7 · 32GB DDR5",
    description:
      "Weighing under 1kg yet housing the power of a workstation, the NexSlate X1 Carbon is built for professionals who move fast. Military-grade durability meets beautiful OLED clarity.",
    images: [
      { url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80", alt: "NexSlate X1 Carbon", isPrimary: true },
    ],
    specs: {
      Display: "14\" 2.8K OLED, 2880×1800, 90Hz",
      Processor: "Intel Core Ultra 7 165H",
      Memory: "32GB LPDDR5",
      Storage: "1TB NVMe SSD",
      Battery: "Up to 18 hours",
      Weight: "0.98 kg",
      OS: "Windows 11 Pro",
    },
    rating: 4.7,
    reviewCount: 534,
    stockCount: 38,
    isFeatured: false,
    isNew: true,
    isBestseller: false,
    tags: ["ultralight", "business", "oled"],
  },

  // ── SMARTWATCHES ────────────────────────────────────────────
  {
    id: "w001",
    name: "OmegaWatch Series 9",
    slug: "omegawatch-series-9",
    brand: "OmegaTech",
    category: "smartwatches",
    price: 449,
    discountPrice: 399,
    shortDescription: "LTPO AMOLED · ECG · Blood Glucose · 7-day battery",
    description:
      "Health meets elegance in the OmegaWatch Series 9. Track your ECG, SpO2, blood glucose, and stress levels with FDA-cleared sensors. Seven-day battery life ensures you're always covered.",
    images: [
      { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80", alt: "OmegaWatch Series 9", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80", alt: "OmegaWatch Series 9 side" },
    ],
    specs: {
      Display: "1.99\" LTPO AMOLED, 476 ppi, Always-On",
      Health: "ECG, SpO2, Blood Glucose, HRV, Stress",
      "GPS Bands": "L1 + L5 dual-band",
      Battery: "7 days typical, 20 days power-saver",
      "Water Resistance": "10 ATM",
      Connectivity: "Bluetooth 5.3, Wi-Fi 6, NFC",
      Compatibility: "Android 8+ / iOS 16+",
    },
    rating: 4.7,
    reviewCount: 1102,
    stockCount: 65,
    isFeatured: true,
    isNew: true,
    isBestseller: false,
    tags: ["health", "ecg", "gps"],
  },
  {
    id: "w002",
    name: "ZenBand Lite 3",
    slug: "zenband-lite-3",
    brand: "ZenTech",
    category: "smartwatches",
    price: 149,
    shortDescription: "Slim fitness band · SpO2 · 14-day battery",
    description:
      "Slim, affordable, and packed with health smarts. The ZenBand Lite 3 tracks your fitness 24/7 with an impressive 14-day battery and 50m water resistance.",
    images: [
      { url: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80", alt: "ZenBand Lite 3", isPrimary: true },
    ],
    specs: {
      Display: "1.47\" AMOLED",
      "Battery Life": "14 days",
      "Water Resistance": "5 ATM",
      Sensors: "Heart rate, SpO2, Sleep",
      Connectivity: "Bluetooth 5.2",
    },
    rating: 4.4,
    reviewCount: 3421,
    stockCount: 200,
    isFeatured: false,
    isNew: false,
    isBestseller: true,
    tags: ["budget", "fitness", "slim"],
  },

  // ── POWER BANKS ─────────────────────────────────────────────
  {
    id: "pb001",
    name: "VoltMax Titan 30K",
    slug: "voltmax-titan-30k",
    brand: "VoltMax",
    category: "power-banks",
    price: 89,
    discountPrice: 69,
    shortDescription: "30,000mAh · 140W GaN PD · Charge 4 devices",
    description:
      "The VoltMax Titan 30K is the only power bank you'll ever need. With 140W GaN PD output, charge your laptop at full speed and two phones simultaneously. Aircraft-grade aluminum shell.",
    images: [
      { url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80", alt: "VoltMax Titan 30K", isPrimary: true },
    ],
    specs: {
      Capacity: "30,000 mAh",
      "Max Output": "140W GaN PD",
      Ports: "2× USB-C, 2× USB-A",
      "Self-Recharge": "65W in ~1.5 hours",
      Weight: "620g",
      Dimensions: "160 × 73 × 28 mm",
      Certifications: "CE, FCC, RoHS",
    },
    rating: 4.6,
    reviewCount: 687,
    stockCount: 90,
    isFeatured: false,
    isNew: false,
    isBestseller: true,
    tags: ["140w", "gan", "laptop-charging"],
  },
  {
    id: "pb002",
    name: "SlimCharge Nano 10K",
    slug: "slimcharge-nano-10k",
    brand: "SlimCharge",
    category: "power-banks",
    price: 39,
    shortDescription: "10,000mAh · 22.5W PD · Credit-card slim",
    description:
      "Impossibly thin at just 9.5mm, the SlimCharge Nano 10K slips into any pocket. With 22.5W PD, charge your phone from 0 to 60% in 30 minutes.",
    images: [
      { url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80", alt: "SlimCharge Nano 10K", isPrimary: true },
    ],
    specs: {
      Capacity: "10,000 mAh",
      "Max Output": "22.5W PD",
      Thickness: "9.5mm",
      Weight: "185g",
      Ports: "1× USB-C, 1× USB-A",
    },
    rating: 4.5,
    reviewCount: 2341,
    stockCount: 300,
    isFeatured: false,
    isNew: false,
    isBestseller: true,
    tags: ["slim", "pocket", "pd"],
  },

  // ── EARBUDS ─────────────────────────────────────────────────
  {
    id: "e001",
    name: "SonicAir Pro 4",
    slug: "sonicair-pro-4",
    brand: "SonicLabs",
    category: "earbuds",
    price: 279,
    discountPrice: 229,
    shortDescription: "ANC · Spatial Audio · 36hr total · Transparency Mode",
    description:
      "Immerse yourself with the SonicAir Pro 4. Custom dynamic drivers deliver studio-grade audio, while adaptive ANC blocks the world out — or Transparency Mode brings it in. Up to 36 hours total playback.",
    images: [
      { url: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80", alt: "SonicAir Pro 4", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80", alt: "SonicAir Pro 4 case" },
    ],
    specs: {
      Drivers: "11mm dynamic + planar tweeter",
      ANC: "Adaptive dual-mode, -42dB",
      Battery: "8h (buds) + 28h (case)",
      Charging: "USB-C + wireless",
      "Spatial Audio": "Head-tracked",
      "Water Resistance": "IPX5",
      Codec: "LDAC, AAC, SBC",
    },
    rating: 4.8,
    reviewCount: 3102,
    stockCount: 110,
    isFeatured: true,
    isNew: false,
    isBestseller: true,
    tags: ["anc", "spatial-audio", "ldac"],
  },
  {
    id: "e002",
    name: "BudX Open Air",
    slug: "budx-open-air",
    brand: "BudX",
    category: "earbuds",
    price: 129,
    shortDescription: "Open-ear · 10hr · Crystal-clear calls",
    description:
      "Wear them all day without discomfort. The BudX Open Air sits outside your ear canal for ambient sound awareness while delivering surprisingly full audio.",
    images: [
      { url: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&q=80", alt: "BudX Open Air", isPrimary: true },
    ],
    specs: {
      Design: "Open-ear clip",
      Battery: "10h (buds) + 30h (case)",
      Mic: "4-mic beamforming",
      "Water Resistance": "IPX4",
      Connectivity: "Bluetooth 5.3",
    },
    rating: 4.3,
    reviewCount: 891,
    stockCount: 75,
    isFeatured: false,
    isNew: true,
    isBestseller: false,
    tags: ["open-ear", "all-day", "calls"],
  },

  // ── ACCESSORIES ─────────────────────────────────────────────
  {
    id: "a001",
    name: "MagDock Hub Pro",
    slug: "magdock-hub-pro",
    brand: "MagDock",
    category: "accessories",
    price: 119,
    discountPrice: 99,
    shortDescription: "12-in-1 USB-C Hub · 4K HDMI · 100W PD",
    description:
      "One hub to rule them all. The MagDock Hub Pro turns any USB-C laptop into a fully kitted workstation with 12 ports including Dual 4K HDMI, 2.5G Ethernet, and 100W pass-through charging.",
    images: [
      { url: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=600&q=80", alt: "MagDock Hub Pro", isPrimary: true },
    ],
    specs: {
      Ports: "2× 4K HDMI, 3× USB-A 3.1, 2× USB-C, SD, microSD, 2.5G ETH, 3.5mm",
      "Power Delivery": "100W",
      "Max Resolution": "Dual 4K @ 60Hz",
      Chipset: "Realtek RTL9461",
      Material: "Aluminum alloy",
    },
    rating: 4.6,
    reviewCount: 1204,
    stockCount: 150,
    isFeatured: false,
    isNew: false,
    isBestseller: true,
    tags: ["hub", "4k", "work-from-home"],
  },
  {
    id: "a002",
    name: "GlideCharge 3-in-1 Pad",
    slug: "glidecharge-3in1-pad",
    brand: "GlideCharge",
    category: "accessories",
    price: 59,
    shortDescription: "15W Qi2 · Watch + Earbuds + Phone",
    description:
      "One pad, three devices charging simultaneously. The GlideCharge 3-in-1 supports 15W Qi2 for MagSafe-compatible phones, 5W for earbuds, and a dedicated puck for your smartwatch.",
    images: [
      { url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80", alt: "GlideCharge 3-in-1 Pad", isPrimary: true },
    ],
    specs: {
      "Phone Output": "15W Qi2 / MagSafe",
      "Watch Output": "3W",
      "Earbuds Output": "5W Qi",
      Material: "Vegan leather + aluminum",
      "Cable Length": "1.5m USB-C",
    },
    rating: 4.5,
    reviewCount: 765,
    stockCount: 200,
    isFeatured: false,
    isNew: true,
    isBestseller: false,
    tags: ["wireless", "qi2", "desk"],
  },
];

// ── Helper utilities ─────────────────────────────────────────

export const getFeaturedProducts = (): Product[] =>
  mockProducts.filter((p) => p.isFeatured);

export const getBestsellerProducts = (): Product[] =>
  mockProducts.filter((p) => p.isBestseller).slice(0, 8);

export const getProductBySlug = (slug: string): Product | undefined =>
  mockProducts.find((p) => p.slug === slug);

export const getProductsByCategory = (
  category: string
): Product[] =>
  mockProducts.filter((p) => p.category === category);

export const getRelatedProducts = (
  product: Product,
  limit = 4
): Product[] =>
  mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);

export const CATEGORIES = [
  { key: "phones",       label: "Phones",       icon: "Smartphone" },
  { key: "laptops",      label: "Laptops",       icon: "Laptop" },
  { key: "smartwatches", label: "Smartwatches",  icon: "Watch" },
  { key: "power-banks",  label: "Power Banks",   icon: "BatteryCharging" },
  { key: "earbuds",      label: "Earbuds",        icon: "Headphones" },
  { key: "accessories",  label: "Accessories",   icon: "Cable" },
] as const;

export const BRANDS = [
  ...new Set(mockProducts.map((p) => p.brand)),
];
