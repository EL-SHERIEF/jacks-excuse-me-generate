import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Almarai } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react"; // optional

// ---------------------- FONTS ----------------------
const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  display: "swap",
  variable: "--font-almarai",
});

const headingFont = localFont({
  src: "./fonts/PixelAE-Bold.ttf",
  variable: "--font-heading",
  display: "swap",
});

// ---------------------- SITE CONSTANTS ----------------------
const SITE_URL = "https://o3zorni.vercel.app/";
const SITE_NAME = "أعذرني";
const SITETAG = "أعذرني - أول تقنية ذكاء اصطناعي لخدمة تكاسل وأعذار الفريلانسرز";
const OG_IMAGE = `${SITE_URL}/og.webp`;
const ICON_192 = "/apple-icon.png";
const ICON_512 = "/apple-icon.png";
const MANIFEST = "/manifest.json";
const VERBOSE_ANALYTICS = false;

const today = new Date().toISOString();

// ---------------------- JSON-LD ----------------------
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: `${SITE_NAME} AI`,
      url: SITE_URL,
      logo: `${SITE_URL}/apple-icon.png`,
      sameAs: [],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          availableLanguage: ["Arabic"],
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "ar-EG",
      description:
        "أول تقنية ذكاء اصطناعي لخدمة تكاسل وأعذار الفريلانسرز للفريلانسرز — اعمل أعذار مضحكة، مقنعة أو درامية بضغطة زر، مدعوم بجوجل جيميناي.",
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}#software`,
      name: `${SITE_NAME} - أول تقنية ذكاء اصطناعي لخدمة تكاسل وأعذار الفريلانسرز`,
      url: SITE_URL,
      description:
        "أول أداة مصرية لكتابة أعذار فريلانسر باللهجة المصرية، مدعومة بالكامل بالذكاء الاصطناعي.",
      applicationCategory: "Communication, CreativeTool",
      operatingSystem: "Web",
      author: { "@type": "Person", name: "Ahmed Elsherief" },
      datePublished: today,
      dateModified: today,
      image: OG_IMAGE,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EGP",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "125",
      },
    },
  ],
};

// ---------------------- NEXT METADATA ----------------------
export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — أول تقنية ذكاء اصطناعي لخدمة تكاسل وأعذار الفريلانسرز`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "أول تقنية ذكاء اصطناعي لخدمة تكاسل وأعذار الفريلانسرز مخصص للفريلانسرز — أعذار مضحكة، مقنعة أو درامية جاهزة للاستخدام. مجاني وسهل وسريع — مدعوم بتقنيات الذكاء الاصطناعي.",
  keywords: [
    "مولد الأعذار",
    "أعذار مصرية",
    "أعذار فريلانسر",
    "أعذار للشغل باللهجة المصرية",
    "أعذار مضحكة مصرية",
    "مولد أعذار AI",
    "أعذار جاهزة",
    "عذر للعميل",
    "عذر للتأخير",
    "عذر للمشروع",
    "ذكاء اصطناعي بالعربية",
    "جوجل جيميناي بالعربي",
    "مولد أعذار الفريلانسر",
    "أول مولد أعذار مصري",
  ],
  authors: [{ name: "Ahmed Elsherief" }, { name: `${SITE_NAME} AI` }],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL + "/",
    languages: {
      "ar-EG": SITE_URL + "/",
    },
  },
  openGraph: {
    title: `${SITE_NAME} — أول تقنية ذكاء اصطناعي لخدمة تكاسل وأعذار الفريلانسرز`,
    description:
      "اختار نوع العذر (مضحك — مقنع — درامي) واخرج عذر جاهز باللهجة المصرية في ثواني. مناسب للفريلانسرز والموظفين.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — opengraph`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — أول تقنية ذكاء اصطناعي لخدمة تكاسل وأعذار الفريلانسرز`,
    description:
      "اعذرني — مولد أعذار مصري للفريلانسرز مدعوم بالذكاء الاصطناعي. جرّبه الآن!",
    images: [OG_IMAGE],
    creator: "@Fullstackahmed",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ---------------------- ROOT LAYOUT ----------------------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar-EG"
      dir="rtl"
      className={`${headingFont.variable} ${almarai.variable}`}
    >
      <head>
        {/* 🔥 Performance + SEO */}
        <meta name="theme-color" content="#0f172a" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Language" content="ar-EG" />
        <meta name="language" content="Arabic (Egypt)" />
        <meta name="geo.region" content="EG" />
        <meta name="referrer" content="origin-when-cross-origin" />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
        <link rel="manifest" href={MANIFEST} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href={ICON_192} />
        <link rel="canonical" href={SITE_URL + "/"} />
        <link rel="alternate" hrefLang="ar-EG" href={SITE_URL + "/"} />

        {/* Preconnect + DNS Prefetch */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Preload Key Assets */}
        <link rel="preload" as="image" href={OG_IMAGE} />
        <link rel="preload" as="font" href="/fonts/PixelAE-Bold.ttf" type="font/ttf" crossOrigin="anonymous" />

        {/* ✅ JSON-LD Structured Data */}
        <Script
          id="ld-json"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(jsonLd)}
        </Script>
      </head>

      <body className={`${almarai.className} antialiased`}>
        {children}
        <Toaster position="top-center" richColors />

        {/* Analytics */}
        {VERBOSE_ANALYTICS && <Analytics />}

        {/* Fallback for crawlers */}
        <noscript>
          <div style={{ display: "none" }}>
            <link rel="canonical" href={SITE_URL + "/"} />
          </div>
        </noscript>
      </body>
    </html>
  );
}
