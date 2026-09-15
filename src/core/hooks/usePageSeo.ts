import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SeoMetadata {
  title: string;
  description: string;
  keywords?: string;
}

const SEO_DIRECTORY: Record<string, SeoMetadata> = {
  '/': {
    title: 'Invernadero Pimentón Quíbor — La Cigarronera | Agrovenecua',
    description: 'Casa de cultivo 1.000 m² para 2.500 plantas de Pimentón Magistral F1 en Valle de Quíbor, Lara. Retorno comprobado, pozo propio a 60m y nutrición AIFA.',
    keywords: 'invernadero quibor, casa de malla 50 mesh, pimenton lara, pozo profundo cuara, fertirriego aifa',
  },
  '/cockpit': {
    title: 'Cockpit Agronómico & Gemelo Digital 3D | La Cigarronera Quíbor',
    description: 'Centro de control técnico: Climatología NASA MERRA-2, cálculo de VPD foliar, riego FAO-56, balance iónico y fenología GDD para tomate y pimentón.',
    keywords: 'vpd quibor, grados dia pimenton, riego fao56, merra-2 quibor, lixiviacion salinidad pozo',
  },
  '/calculo-pozo': {
    title: 'Calculadora Hidrogeológica Pozo 60m — Cuara, Quíbor | Agrovenecua',
    description: 'Modelo Theis y Cooper-Jacob para pozo profundo en la Formación Cuara. Abatimiento dinámico, caudal continuo de 2.5 L/s y aforo con bomba sumergible.',
    keywords: 'pozo quibor, aljibe cuara, theis hidrogeologia, bomba sumergible 2hp, abatimiento pozo',
  },
  '/malla-50mesh': {
    title: 'Malla Anti-Insectos 50 Mesh 110gsm — Cotizador Oficial | Agrovenecua',
    description: 'Cotizador oficial de rollos de malla anti-insectos 50×25 hilos/pulgada monofilamento virgen HDPE. Bloqueo 100% de mosca blanca y trips en Quíbor.',
    keywords: 'malla 50 mesh quibor, rollo malla anti insectos venezuela, exclusion mosca blanca, malla 110 gsm',
  },
  '/catalogo-invernaderos': {
    title: 'Catálogo de Invernaderos Leader Greenhouse | Agrovenecua',
    description: 'Modelos multicapilla góticos AGRO-U3, U4 y U5. Estructuras de acero galvanizado reforzadas para vientos dominantes del Este en Lara.',
    keywords: 'leader greenhouse venezuela, invernaderos goticos, casas de cultivo acero galvanizado',
  },
  '/admin': {
    title: 'Panel de Control SQLite & Data Baking | La Cigarronera',
    description: 'Consola administrativa local para actualizar costos, cultivos, matrices bioclimáticas y parámetros hídricos sin base de datos en nube.',
    keywords: 'admin agrovenecua, sqlite data baking, configuracion quibor',
  },
};

export function usePageSeo(): void {
  const location = useLocation();

  useEffect(() => {
    const meta = SEO_DIRECTORY[location.pathname] || SEO_DIRECTORY['/'];
    document.title = meta.title;

    // Actualizar meta description
    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.setAttribute('name', 'description');
      document.head.appendChild(descTag);
    }
    descTag.setAttribute('content', meta.description);

    // Actualizar meta keywords si aplica
    if (meta.keywords) {
      let keywordsTag = document.querySelector('meta[name="keywords"]');
      if (!keywordsTag) {
        keywordsTag = document.createElement('meta');
        keywordsTag.setAttribute('name', 'keywords');
        document.head.appendChild(keywordsTag);
      }
      keywordsTag.setAttribute('content', meta.keywords);
    }
  }, [location.pathname]);
}
