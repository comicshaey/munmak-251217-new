// /static/render-docs-portal.js
// docs-portal: 사이드바/본문을 JSON 하나로 동기화 (실수 원천봉쇄)

(async function () {
  const sidebar = document.querySelector("#docsSidebar");
  const content = document.querySelector("#docsContent");
  const pageTitle = document.querySelector("#docsPageTitle");
  const pageSubtitle = document.querySelector("#docsPageSubtitle");
  if (!sidebar || !content) return;

  const res = await fetch("/data/docs-portal.json", { cache: "no-store" });
  const data = await res.json();

  if (pageTitle) pageTitle.textContent = data.pageTitle ?? "업무 백과사전";
  if (pageSubtitle) pageSubtitle.textContent = data.pageSubtitle ?? "";

  // 사이드바
  sidebar.innerHTML = `
    <div class="docs-sidebar-title">업무 분류</div>
    ${data.groups.map(group => `
      <div class="docs-nav-group" id="${group.sectionId}">
        <div class="docs-nav-group-title">${escapeHtml(group.title)}</div>
        <ul class="docs-nav">
          ${group.docs.map(d => `<li><a href="#${d.id}">${escapeHtml(d.title)}</a></li>`).join("")}
        </ul>
      </div>
    `).join("")}
  `;

  // 본문
  content.innerHTML = data.groups.flatMap(group =>
    group.docs.map(doc => {
      const blocks = (doc.blocks ?? []).map(renderBlock).join("");
      return `
        <article id="${doc.id}" class="docs-section">
          <h2>${escapeHtml(doc.title)}</h2>
          ${blocks}
        </article>
      `;
    })
  ).join("");

  function renderBlock(b) {
    const type = b.type;
    if (type === "p") return `<p>${escapeHtml(b.text)}</p>`;
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
