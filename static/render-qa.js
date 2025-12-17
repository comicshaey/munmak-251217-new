// /static/render-qa.js
// 단일업무 문서(doc-a4) + 탭 문서(tabs) 통합 뷰어

(async function () {
  const root = document.querySelector("#qaRoot");
  if (!root) return;

  const id = (location.hash || "").replace("#", "").trim();
  if (!id) {
    root.innerHTML = `<div class="badge-soft">문서 ID가 없습니다. 홈에서 다시 들어와 주세요.</div>`;
    return;
  }

  const res = await fetch("/data/qa-pages.json", { cache: "no-store" });
  const pages = await res.json();

  const page = pages.find(p => p.id === id);
  if (!page) {
    root.innerHTML = `<div class="badge-soft">문서를 찾지 못했습니다: ${escapeHtml(id)}</div>`;
    return;
  }

  document.title = page.title || document.title;

  if (page.type === "doc-a4") renderDocA4(page);
  else if (page.type === "tabs") renderTabs(page);
  else {
    root.innerHTML = `<div class="badge-soft">알 수 없는 문서 타입: ${escapeHtml(page.type)}</div>`;
  }

  function renderDocA4(p) {
    root.innerHTML = `
      <div class="doc-a4-wrap">
        <article class="doc-a4">
          <header class="doc-a4-header">
            <div class="doc-a4-title">${escapeHtml(p.title)}</div>
            ${p.meta ? `<div class="doc-a4-meta">${escapeHtml(p.meta)}</div>` : ""}
          </header>

          ${p.intro ? `<p>${escapeHtml(p.intro)}</p>` : ""}

          ${(p.sections ?? []).map(sec => `
            <h2>${escapeHtml(sec.h2)}</h2>
            ${(sec.blocks ?? []).map(renderBlock).join("")}
          `).join("")}

          ${p.note ? `<p style="margin-top:18px;font-size:0.85rem;color:#777;">${escapeHtml(p.note)}</p>` : ""}
        </article>
      </div>
    `;
  }

  function renderTabs(p) {
    const tabs = p.tabs ?? [];
    const firstKey = tabs[0]?.key ?? "tab1";

    root.innerHTML = `
      <h1 class="page-title">${escapeHtml(p.title)}</h1>
      ${p.subtitle ? `<p class="page-subtitle">${escapeHtml(p.subtitle)}</p>` : ""}

      <div class="tabs-root" data-tabs-root>
        <div class="tabs-list">
          ${tabs.map((t, i) => `
            <button type="button" class="tab-button ${i === 0 ? "is-active" : ""}" data-tab-target="${escapeHtml(t.key)}">
              ${escapeHtml(t.label)}
            </button>
          `).join("")}
        </div>

        ${tabs.map((t, i) => `
          <div class="tab-panel ${i === 0 ? "is-active" : ""}" data-tab-panel="${escapeHtml(t.key)}">
            ${(t.blocks ?? []).map(renderBlock).join("")}
          </div>
        `).join("")}
      </div>
    `;

    // 탭 클릭 동작 (site.js랑 충돌 안 나게 여기서만 처리)
    const buttons = Array.from(root.querySelectorAll("[data-tab-target]"));
    const panels = Array.from(root.querySelectorAll("[data-tab-panel]"));

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-tab-target");
        buttons.forEach(b => b.classList.toggle("is-active", b === btn));
        panels.forEach(pn => pn.classList.toggle("is-active", pn.getAttribute("data-tab-panel") === key));
      });
    });

    // 혹시 탭이 비었을 때 대비
    if (!tabs.length) {
      root.innerHTML = `<div class="badge-soft">탭 데이터가 비어 있습니다.</div>`;
    }
  }

  function renderBlock(b) {
    const type = b.type;
    if (type === "p") return `<p>${escapeHtml(b.text).replaceAll("\n", "<br/>")}</p>`;
    if (type === "ul") return `<ul>${(b.items ?? []).map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ul>`;
    if (type === "ol") return `<ol>${(b.items ?? []).map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ol>`;
    if (type === "h3") return `<h3>${escapeHtml(b.text)}</h3>`;
    if (type === "small") return `<p style="font-size:0.85rem;color:#777;">${escapeHtml(b.text)}</p>`;
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
