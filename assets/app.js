// Project metadata lives on the semantic HTML cards: useful with or without JS.
const projects = [...document.querySelectorAll('.project-node')];
const search = document.querySelector('#search');
const atlas = document.querySelector('#atlas');
const empty = document.querySelector('#empty-state');
const count = document.querySelector('#result-count');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const viewButtons = [...document.querySelectorAll('[data-view]')];
let category = 'all';
let view = window.matchMedia('(max-width: 760px)').matches ? 'list' : 'map';

function render() {
  const query = search.value.trim().toLocaleLowerCase();
  let matches = 0;
  for (const project of projects) {
    const text = `${project.textContent} ${project.dataset.search}`.toLocaleLowerCase();
    const visible = (category === 'all' || project.dataset.category === category)
      && query.split(/\s+/).every(word => text.includes(word));
    project.hidden = !visible;
    if (visible) matches++;
  }
  atlas.hidden = matches === 0;
  empty.hidden = matches !== 0;
  atlas.classList.toggle('list-view', view === 'list');
  count.textContent = `${matches} ${matches === 1 ? 'exploration' : 'explorations'} to discover`;
  document.querySelector('#empty-description').textContent = query
    ? `No published ideas match “${search.value.trim()}”. Try another topic or clear your filters.`
    : 'This corner of the atlas is still waiting for its first published idea.';
  filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  viewButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
}

search.addEventListener('input', render);
filterButtons.forEach(button => button.addEventListener('click', () => {category = button.dataset.filter; render();}));
viewButtons.forEach(button => button.addEventListener('click', () => {view = button.dataset.view; render();}));
document.querySelector('#reset').addEventListener('click', () => {category = 'all'; search.value = ''; render(); search.focus();});
document.querySelector('#toolbar').hidden = false;
document.querySelector('#filters').hidden = false;
render();
