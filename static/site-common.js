// static/site-common.js

// 전역 꼬릿말 문구
const GLOBAL_FOOTER_TEXT =
  "제작자: 씩씩하고 귀여운 고주무관 · Contact: edusproutcmomics@naver.com · 학교 공식 홈페이지가 아닌, 개인적인 토이 프로젝트입니다.";

// 작성자 메모 공통 내용 (HTML 허용)
const GLOBAL_AUTHOR_NOTE_HTML = `
  <p class="author-note-line">
    이 페이지는 행정업무 공부 & 업무 효율화를 위한 개인 실험용 도구입니다.
  </p>
  <p class="author-note-line">
    내용이 실제 지침과 다르거나, 오류·개선 의견이 있으면 위 이메일로 편하게 알려 주세요.
  </p>
`;

// DOM 로드 후 공통 요소 주입
document.addEventListener("DOMContentLoaded", () => {
  // 꼬릿말 채우기
  document.querySelectorAll("[data-global-footer]").forEach((el) => {
    el.textContent = GLOBAL_FOOTER_TEXT;
  });

  // 작성자 메모 채우기
  document.querySelectorAll("[data-author-note]").forEach((el) => {
    el.innerHTML = GLOBAL_AUTHOR_NOTE_HTML;
  });

  // 우클릭 방지 (사이트 전체 적용)
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
});
