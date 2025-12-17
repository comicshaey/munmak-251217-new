/* =====================================================
   docs-portal 렌더링 + 사이드바 네비게이션 컨트롤
   ===================================================== */

/*
  JSON 구조 예시 (data/docs-portal.json)

  {
    "title": "업무 백과사전",
    "subtitle": "교직원이 자주 헷갈리는 행정업무 정리",
    "sections": [
      {
        "id": "pay",
        "title": "급여 · 수당",
        "items": [
          {
            "id": "pay-basic",
            "title": "기본급 지급 기준",
            "content": "<p>내용 HTML</p>"
          }
        ]
      }
    ]
  }
*/

document.addEventListener("DOMContentLoaded", () => {
  loadDocsPortal();
});

async function loadDocsPortal() {
  try {
    const res = await fetch("/data/docs-portal.json");
    if (!res.ok) throw new Error("JSON 로드 실패");

    const data = await res.json();

    renderPageHeader(data);
    renderSidebar(data);
    renderContent(data);

    // ✅ 렌더링 끝난 뒤 네비게이션 활성화
    initDocsPortalNav();

  } catch (err) {
    console.error(err);
  }
}

/* ============================
   페이지 타이틀
   ============================ */
function renderPageHeader(data) {
  const titleEl = document.getElementById("docsPageTitle");
  const subtitleEl = document.getElementById("docsPageSubtitle");

  if (titleEl && data.title) titleEl.textContent = data.title;
  if (subtitleEl && data.subtitle) subtitleEl.textContent = data.subtitle;
}

/* ============================
   사이드바 렌더링
   ============================ */
function renderSidebar(data) {
  const sidebar = document.getElementById("docsSidebar");
  if (!sidebar) return;

  let html = "";

  data.sections.forEach(section => {
    html += `
      <div class="docs-sidebar-group">
        <strong class="docs-sidebar-title">${section.title}</strong>
    `;

    section.items.forEach(item => {
      html += `
        <a href="#${item.id}" data-doc-link>
          ${item.title}
        </a>
      `;
    });

    html += `</div>`;
  });

  sidebar.innerHTML = html;
}

/* ============================
   본문 렌더링
   ============================ */
function renderContent(data) {
  const content = document.getElementById("docsContent");
  if (!content) return;

  let html = "";

  data.sections.forEach(section => {
    html += `
      <section class="docs-section">
        <h2>${section.title}</h2>
    `;

    section.items.forEach(item => {
      html += `
        <article id="${item.id}" class="docs-article">
          <h3>${item.title}</h3>
          ${item.content}
        </article>
      `;
    });

    html += `</section>`;
  });

  content.innerHTML = html;
}

/* ===============================
   사이드바 스크롤 / 하이라이트
   =============================== */
function initDocsPortalNav() {
  const sidebar = document.getElementById("docsSidebar");
  const content = document.getElementById("docsContent");
  if (!sidebar || !content) return;

  const header = document.querySelector(".site-header");
  const headerH = header ? header.offsetHeight : 0;
  const OFFSET = headerH + 12;

  const links = Array.from(
    sidebar.querySelectorAll('a[href^="#"]')
  );

  if (!links.length) return;

  const idToLink = new Map();
  links.forEach(a => {
    const id = a.getAttribute("href").slice(1);
    idToLink.set(id, a);
  });

  const sections = [];
  idToLink.forEach((_, id) => {
    const el = document.getElementById(id);
    if (el) sections.push(el);
  });

  /* ---- 클릭 스크롤 ---- */
  sidebar.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href.startsWith("#")) return;

    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();

    const y =
      target.getBoundingClientRect().top +
      window.pageYOffset -
      OFFSET;

    window.scrollTo({
      top: y,
      behavior: "smooth"
    });

    history.replaceState(null, "", `#${id}`);
  });

  /* ---- 활성화 토글 ---- */
  function setActive(id) {
    links.forEach(a => a.classList.remove("is-active"));
    const a = idToLink.get(id);
    if (a) a.classList.add("is-active");
  }

  /* ---- 스크롤 감지 ---- */
  const io = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) =>
        a.boundingClientRect.top - b.boundingClientRect.top
      );

    if (visible.length) {
      setActive(visible[0].target.id);
    } else {
      const y = window.scrollY + OFFSET + 1;
      let current = sections[0];
      for (const sec of sections) {
        if (sec.offsetTop <= y) current = sec;
        else break;
      }
      setActive(current.id);
    }
  }, {
    rootMargin: `-${OFFSET}px 0px -70% 0px`,
    threshold: 0.2
  });

  sections.forEach(sec => io.observe(sec));

  /* ---- 초기 hash 처리 ---- */
  const initHash = location.hash.replace("#", "");
  if (initHash && document.getElementById(initHash)) {
    setActive(initHash);

    const target = document.getElementById(initHash);
    const y =
      target.getBoundingClientRect().top +
      window.pageYOffset -
      OFFSET;

    window.scrollTo({ top: y, behavior: "auto" });
  } else {
    setActive(sections[0].id);
  }
}
