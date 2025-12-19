/* =====================
   ADS SCRIPTS
===================== */
useEffect(() => {
  // 🔥 POP ADS (from go.html)
  const popScript = document.createElement("script");
  popScript.type = "text/javascript";
  popScript.src = "https://otieu.com/4/10066336";
  popScript.async = true;
  document.body.appendChild(popScript);

  // 🔥 BANNER ADS
  const bannerEl = document.getElementById("banner-ads");
  if (bannerEl) {
    const bannerConfig = document.createElement("script");
    bannerConfig.innerHTML = `
      atOptions = {
        'key' : '5e631078d999c49a9297761881a85126',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;
    bannerEl.appendChild(bannerConfig);

    const bannerScript = document.createElement("script");
    bannerScript.src =
      "https://nervesweedefeat.com/5e631078d999c49a9297761881a85126/invoke.js";
    bannerEl.appendChild(bannerScript);
  }

  // 🔥 SOCIAL / NATIVE ADS
  const socialEl = document.getElementById("social-ads");
  if (socialEl) {
    const socialScript = document.createElement("script");
    socialScript.src =
      "https://nervesweedefeat.com/59/91/44/599144da0922a7186c15f24ecaceef31.js";
    socialEl.appendChild(socialScript);
  }

  // 🔥 QUGE5 ADS
  const qugeScript = document.createElement("script");
  qugeScript.src = "https://quge5.com/88/tag.min.js";
  qugeScript.async = true;
  qugeScript.setAttribute("data-zone", "194391");
  qugeScript.setAttribute("data-cfasync", "false");
  document.body.appendChild(qugeScript);
}, []);
