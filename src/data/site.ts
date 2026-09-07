// Fuente única de verdad para SEO, canonical, OG y JSON-LD.
// TODO: cuando tengas el dominio final, cambia `url` aquí y en `astro.config.mjs` (site).
export const site = {
  name: "Gabriela Orozco Vásquez",
  shortName: "Gabriela Orozco",
  role: "Ciencia de Datos · Desarrollo de Software",
  tagline: "Transformo datos en decisiones",
  description:
    "Portafolio de Gabriela Orozco Vásquez, Tecnóloga en Desarrollo de Software (IU Colegio Mayor del Cauca) y futura Ingeniera Informática orientada a Ciencia de Datos. Python, SQL, EDA y desarrollo de software para convertir datos en decisiones.",
  keywords: [
    "Gabriela Orozco Vásquez",
    "Ciencia de Datos",
    "Data Science Colombia",
    "Análisis de datos",
    "EDA",
    "Machine Learning",
    "Python",
    "SQL",
    "Ingeniería Informática",
    "Desarrollo de Software",
    "Popayán",
    "Cauca",
    "Portafolio",
  ],
  // Origen + base del sitio. GitHub Pages de proyecto vive bajo un subpath;
  // con dominio propio final, deja `base: ""` y cambia `origin`.
  // TODO: cuando tengas el dominio final, actualiza `origin` aquí y `site`/`base`
  // en `astro.config.mjs` (los tres van de la mano).
  origin: "https://gabi-vasquez.github.io",
  base: "/portafolio",
  locale: "es_CO",
  language: "es",
  themeColor: "#881337",
  author: "Gabriela Orozco Vásquez",
  location: {
    city: "Popayán",
    region: "Cauca",
    country: "Colombia",
    countryCode: "CO",
  },
  socials: {
    github: "https://github.com/gabi-vasquez",
    // TODO: reemplazar por las URLs reales cuando se confirmen los slugs.
    linkedin:
      "https://www.linkedin.com/search/results/all/?keywords=Gabriela%20Orozco%20V%C3%A1squez",
    kaggle: "https://www.kaggle.com/",
  },
  // Imagen Open Graph 1200×630 generada (ver scripts/generate-seo-assets.mjs).
  ogImagePath: "/og-image.jpg",
  portraitPath: "/gabi.jpeg",
} as const;

export const siteUrl = `${site.origin}${site.base}`;

/** URL absoluta (canonical, OG) incluyendo el subpath de despliegue. */
export const absoluteUrl = (path = "/") =>
  `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

/** Ruta de un asset en `public/` con el `base` de despliegue aplicado. */
export const asset = (path: string) =>
  `${site.base}${path.startsWith("/") ? path : `/${path}`}`;
