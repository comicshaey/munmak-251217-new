// ===============================
// UI 공통 동작 스크립트
// - 탭 전환
// - FAQ 아코디언
// - 홈 카드 필터
// - 상단 이동 버튼
// ===============================

document.addEventListener("click", function (e) {

  /* =========================
     탭 전환 처리
     ========================= */
  const tabBtn = e.target.closest("[data-tab-target]");
  if (tabBtn) {
    const targetId = tabBtn.getAttribute("data-tab-target");
    const root = tabBtn.closest("[data-tabs-root]");
    if (!root) return;

    const buttons = root.querySelectorAll("[data-tab-target]");
    const panels = root.querySelectorAll("[data-tab-panel]");

    buttons.forEach((btn) => btn.classList.remove("is-active"));
    panels.forEach((panel) => panel.classList.remove("is-active"));

    tabBtn.classList.add("is-active");

    const targetPanel = root.querySelector(
      `[data-tab-panel="${targetId}"]`
    );
    if (targetPanel) {
      targetPanel.classList.add("is-active");
    }
  }

  /* =========================
     FAQ 아코디언
     ========================= */
  const faqBtn = e.target.closest("[data-faq-toggle]");
  if (faqBtn) {
    const item = faqBtn.closest(".faq-item");
    if (!item) return;

    item.classList.toggle("is-open");
  }

  /* =========================
     홈 카드 필터
     ========================= */
  const filterBtn = e.target.closest("[data-filter]");
  if (filterBtn) {
    const value = filterBtn.getAttribute("data-filter");

    document
      .querySelectorAll("[data-filter]")
      .forEach((b) => b.classList.remove("is-active"));
    filterBtn.classList.add("is-active");

    document.querySelectorAll(".home-card[data-category]").forEach((card) => {
      const cat = card.getAttribute("data-category");
      const show = value === "all" || cat === value;
      card.style.display = show ? "" : "none";
    });
  }

  /* =========================
     상단 이동 버튼 클릭
     ========================= */
  const scrollBtn = e.target.closest("#scrollTopBtn");
  if (scrollBtn) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
});

/* =========================
   스크롤 위치 감지
   ========================= */
document.addEventListener("scroll", function () {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  if (window.scrollY > 200) {
    btn.classList.add("is-visible");
  } else {
    btn.classList.remove("is-visible");
  }
});
