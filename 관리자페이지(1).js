const dropdownBtn = document.querySelector('.dropdown-btn');
const dropdownMenu = document.querySelector('.dropdown-menu');

dropdownBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // 클릭 이벤트가 document로 전파되지 않게
  dropdownMenu.style.display = 
    dropdownMenu.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', () => {
  dropdownMenu.style.display = 'none';
});
