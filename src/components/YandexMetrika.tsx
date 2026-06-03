import { useEffect } from 'react';

const YandexMetrika = () => {
  useEffect(() => {
    const scriptId = 'yandex-metrika';

    if (document.getElementById(scriptId)) return;

    (function (m: any, e: any, t: any, r: any, i: any, k: any, a: any) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
      m[i].l = 1 * new Date();
      k = e.createElement(t);
      a = e.getElementsByTagName(t)[0];
      k.async = 1;
      k.src = r;
      k.id = scriptId;
      a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=109627922', 'ym');

    (window as any).ym(109627922, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
      ecommerce: "dataLayer"
    });
  }, []);

  return (
    <noscript>
      <div>
        <img 
          src="https://mc.yandex.ru/watch/109627922" 
          style={{ position: 'absolute', left: '-9999px' }} 
          alt="" 
        />
      </div>
    </noscript>
  );
};

export default YandexMetrika;
