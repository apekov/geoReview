// const closeButton = document.querySelector('.close_window');
// const windowBlock = document.querySelector('.review_block');
//
// closeButton.addEventListener('click', () => {
//     windowBlock.style.display = 'none';
// });

function renderHtml(templateName, obj) {
  let template = document.querySelector(templateName).textContent;
  let render = Handlebars.compile(template);
  let inner = document.querySelector('.result');
  let html = render(obj);
  console.log(obj);
  // console.log(html);
  inner.innerHTML = html;
}
;
