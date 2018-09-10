function renderHtml(templateName, obj) {
  let template = document.querySelector(templateName).textContent;
  let render = Handlebars.compile(template);
  let inner = document.querySelector('.result');
  let html = render(obj);
  inner.innerHTML = html;
}
