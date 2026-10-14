// Přepínač ročních dob (zima/léto) – mění úvodní fotku a texty.
(function () {
  var html = document.documentElement;
  var tlacitka = document.querySelectorAll('[data-sezona-volba]');
  function nastav(s) {
    html.dataset.sezona = s;
    tlacitka.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.sezonaVolba === s ? 'true' : 'false'); });
  }
  tlacitka.forEach(function (b) { b.addEventListener('click', function () { nastav(b.dataset.sezonaVolba); }); });
  nastav(html.dataset.sezona || 'leto');
})();

// Rozcestník: najetí na směrovku zvýrazní cíl v plánku a naopak.
(function () {
  function prepni(id, zap) {
    document.querySelectorAll('[data-cil="' + id + '"]').forEach(function (el) { el.classList.toggle('aktivni', zap); });
  }
  document.querySelectorAll('.smerovka, .planek__cil').forEach(function (el) {
    var id = el.getAttribute('data-cil');
    ['mouseenter', 'focus'].forEach(function (e) { el.addEventListener(e, function () { prepni(id, true); }); });
    ['mouseleave', 'blur'].forEach(function (e) { el.addEventListener(e, function () { prepni(id, false); }); });
  });
})();

// Formulář: demo režim neodesílá nic, ostrý režim posílá na endpoint ze site.json.
(function () {
  document.querySelectorAll('form.formular').forEach(function (f) {
    var stav = f.querySelector('.formular-stav');
    f.addEventListener('submit', function (e) {
      var endpoint = f.getAttribute('data-endpoint');
      var demo = f.getAttribute('data-demo') === '1';
      e.preventDefault();
      if (f.querySelector('.past input').value) return;
      if (demo || !endpoint) {
        stav.textContent = 'Ukázka formuláře: nic se neodesílá. Po spuštění webu přijde poptávka rovnou na e-mail pensionu.';
        return;
      }
      stav.textContent = 'Odesílám…';
      fetch(endpoint, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); f.reset(); stav.textContent = 'Děkujeme, poptávka byla odeslána. Ozveme se co nejdřív.'; })
        .catch(function () { stav.textContent = 'Odeslání se nepodařilo. Napište nám prosím e-mailem.'; });
    });
  });
})();
