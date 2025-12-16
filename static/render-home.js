// /static/render-home.js
// 홈 카드: JSON 한 번만 고치면 끝나게 만드는 렌더러

(async function () {
  const grid = document.querySelector("#homeGrid");
  if (!grid) return;

  const filterWrap = document.querySelector(".home-filter");
  const filterButtons = filterWrap ? Array.from(filterWrap.querySelectorAll("[data-filter]")) : [];

  const res = await fetch("/data/home-cards.json", { cache: "no-store" });
  const cards = await res.json();

  function cardHtml(item) {
    return `
      <a class="home-card" href="${item.href}" data-category="${item.category}">
        <div class="home-card-tag">${escapeHtml(item.tag)}</div>
        <div class="home-card-title">${escapeHtml(item.title)}</div>
        <div class="home-card-desc">${escapeHtml(item.desc)}</div>
        <div class="home-card-footer">${escapeHtml(item.footer)}</div>
      </a>
    `;
  }

  function render(list) {
    grid.innerHTML = list.map(cardHtml).join("");
  }

  function setActive(btn) {
    filterButtons.forEach(b => b.classList.toggle("is-active", b === btn));
  }

  function applyFilter(filterKey) {
    if (filterKey === "all") return render(cards);
    render(cards.filter(c => c.category === filterKey));
  }

  // 최초 렌더
  render(cards);

  // 필터 버튼 연결
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-filter");
      setActive(btn);
      applyFilter(key);
    });
  });

  // 아주 가벼운 이스케이프 (XSS 방지용 최소)
  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
