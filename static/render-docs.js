// /static/render-docs.js
// 업무 백과사전 렌더러 (신 JSON 스펙 대응: level / emphasis)

(async function () {
  const sidebar = document.getElementById("docsSidebar");
  const content = document.getElementById("docsContent");
  if (!sidebar || !content) return;

  let data;
  try {
    const res = await fetch("/data/docs-portal.json", { cache: "no-store" });
    data = await res.json();
  } catch (err) {
    console.error("[render-docs] JSON 로드 실패:", err);
    sidebar.innerHTML = "";
    content.innerHTML = `<p class="muted">데이터를 불러오지 못했습니다.</p>`;
    return;
  }

  const allDocs = (data.groups ?? []).flatMap(g => g.docs ?? []);

  // =========================
  // 사이드바 렌더
  // =========================
  sidebar.innerHTML = (data.groups ?? []).map(group => {
    const groupTitle = escapeHtml(group.title);
    const groupDocs = (group.docs ?? []).map(doc => `
      <a href="#${escapeHtml(doc.id)}" data-doc-id="${escapeHtml(doc.id)}">
        ${escapeHtml(doc.title)}
      </a>
    `).join("");

    // 섹션 제목을 시각적으로 구분(굵기/크기 차이는 CSS에서)
    return `
      <div class="docs-group">
        <div class="docs-group-title section-title">${groupTitle}</div>
        ${groupDocs}
      </div>
    `;
  }).join("");

  // =========================
  // 본문 렌더
  // =========================
  function renderDoc(docId) {
    const doc = allDocs.find(d => d.id === docId);

    if (!doc) {
      content.innerHTML = `<p class="muted">문서를 찾을 수 없습니다.</p>`;
      return;
    }

    content.innerHTML = `
      <article>
        <h1 class="page-title doc-title">${escapeHtml(doc.title)}</h1>
        ${(doc.blocks ?? []).map(renderBlock).join("")}
      </article>
    `;

    // 본문 렌더 후 상단으로 살짝 정렬(선호에 따라 제거 가능)
    content.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // =========================
  // 클릭 이벤트
  // =========================
  sidebar.addEventListener("click", (e) => {
    const link = e.target.closest("[data-doc-id]");
    if (!link) return;

    e.preventDefault();
    const id = link.getAttribute("data-doc-id");
    if (!id) return;

    location.hash = id;
    renderDoc(id);
  });

  // =========================
  // 초기 진입/해시 변경 대응
  // =========================
  function getHashId() {
    return (location.hash || "").replace("#", "").trim();
  }

  function boot() {
    const initialId = getHashId();
    if (initialId) {
      renderDoc(initialId);
      return;
    }

    // 해시가 없으면 첫 문서 자동 표시 (선택사항)
    const first = allDocs[0]?.id;
    if (first) {
      location.hash = first;
      renderDoc(first);
    } else {
      content.innerHTML = `<p class="muted">표시할 문서가 없습니다.</p>`;
    }
  }

  window.addEventListener("hashchange", () => {
    const id = getHashId();
    if (id) renderDoc(id);
  });

  boot();

  /* =========================
     블록 렌더
     ========================= */
  function renderBlock(b) {
    const type = b?.type;

    if (type === "p") {
      const cls = b.emphasis === "strong" ? ' class="text-strong"' : "";
      return `<p${cls}>${escapeHtml(b.text)}</p>`;
    }

    if (type === "ul") {
      const items = (b.items ?? []).map(i => `<li>${escapeHtml(i)}</li>`).join("");
      return `<ul>${items}</ul>`;
    }

    if (type === "ol") {
      const items = (b.items ?? []).map(i => `<li>${escapeHtml(i)}</li>`).join("");
      return `<ol>${items}</ol>`;
    }

    if (type === "h3") {
      return `<h3>${escapeHtml(b.text)}</h3>`;
    }

    return "";
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
