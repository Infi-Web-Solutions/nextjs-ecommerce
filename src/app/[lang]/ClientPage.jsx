// 'use client';
// import { useEffect } from 'react';

// export default function ClientPage({ dictionary }) {
//   return (
//     <main>
//       <h1>{dictionary.title}</h1>
//       <p>{dictionary.description}</p>
//     </main>
//   );
// }

'use client';
import { useTranslations } from '@/lib/TranslationsProvider';

export default function ClientPage() {
  const t = useTranslations();

  return (
    // <div>
    //   <h1>{t('navbar.home')}</h1>
    //   <p>{t('product.availableProducts')}</p>
    //   <p>{t('product.availableProductsitem')}</p>
    //   <p>{t('product.availableProductsitem2')}</p>
    // </div>
    <></>
  );
}

