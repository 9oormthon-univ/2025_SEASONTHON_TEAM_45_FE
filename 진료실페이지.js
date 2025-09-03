  const dropdownBtn = document.querySelector('.dropdown-btn');
const dropdownMenu = document.querySelector('.dropdown-menu');

dropdownBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  dropdownMenu.style.display = 
    dropdownMenu.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', () => {
  dropdownMenu.style.display = 'none';
});

        document.addEventListener('DOMContentLoaded', () => {
    // 뒤로가기 버튼 기능
    const backLink = document.querySelector('.back-link');
    if (backLink) {
        backLink.addEventListener('click', (e) => {
            e.preventDefault(); // 기본 링크 동작 방지
            window.history.back(); // 브라우저의 이전 페이지로 이동
        });
    }

    const applyButton = document.querySelector('.apply-button');
    if (applyButton) {
        applyButton.addEventListener('click', () => {
            alert('변경사항이 적용되었습니다.');
        });
    }
});
