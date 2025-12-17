// /static/ui-common.js
// UI 전역 공통: 메뉴 토글, 위로가기 버튼

document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     모바일 메뉴 토글
     ========================= */
  const nav = document.getElementById("siteNav");
  const toggleBtn = document.getElementById("navToggle");

  if (nav && toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      nav.classList.toggle("is-open");
    });
  }

  /* =========================
     위로가기 버튼
     ========================= */
  const scrollBtn = document.getElementById("scrollTopBtn");

  if (scrollBtn) {
    const onScroll = () => {
      scrollBtn.style.display = window.scrollY > 300 ? "inline-flex" : "none";
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
