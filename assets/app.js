// The HTML is the catalog. Search enhances real, discoverable links.
const search = document.querySelector('#search');
const results = document.querySelector('#results');
const projects = [...document.querySelectorAll('.project-card')];
const empty = document.querySelector('#empty-state');
const count = document.querySelector('#result-count');
const clear = document.querySelector('#clear-search');
const topics = [...document.querySelectorAll('.topic-node')];
const shortcuts = document.querySelector('#section-results');
search.value = new URL(location.href).searchParams.get('q') || '';

function render() {
  const query = search.value.trim();
  const words = query.toLocaleLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').trim().split(/\s+/);
  let matches = 0;
  const matchedTopics = topics.filter(topic => words.every(word => `${topic.textContent} ${topic.dataset.search}`.toLocaleLowerCase().includes(word)));
  const partialTopics = query && !matchedTopics.length ? topics.filter(topic => words.some(word => `${topic.textContent} ${topic.dataset.search}`.toLocaleLowerCase().includes(word))) : [];
  for (const project of projects) {
    const relatedTopics = topics.filter(topic => topic.dataset.project === project.id);
    const text = `${project.textContent} ${project.dataset.search} ${relatedTopics.map(topic => `${topic.textContent} ${topic.dataset.search}`).join(' ')}`.toLocaleLowerCase();
    const visible = words.every(word => text.includes(word));
    project.hidden = !visible;
    if (visible) matches++;
  }
  document.querySelectorAll('.topic-map[data-project]').forEach(map => {
    map.hidden = document.getElementById(map.dataset.project).hidden;
  });
  results.hidden = matches === 0;
  empty.hidden = matches !== 0;
  clear.hidden = search.value.length === 0;
  count.hidden = !query;
  document.querySelector('#search-scope').hidden = Boolean(query);
  count.textContent = `${matches} ${matches === 1 ? 'exploration' : 'explorations'} matching “${query}”`;
  topics.forEach(topic => {
    topic.classList.toggle('topic-match', Boolean(query) && matchedTopics.includes(topic));
  });
  const topicNames = matchedTopics.map(topic => topic.querySelector('span:nth-child(2)').childNodes[0].textContent.trim());
  document.querySelector('#map-caption').textContent = query && topicNames.length
    ? `Matching ${topicNames.length === 1 ? 'section' : 'sections'}: ${topicNames.join(', ')}. Open a highlighted topic to jump there.`
    : 'Each branch opens a section of The making of Mini Research.';
  if (query && topicNames.length) count.textContent += ` · ${topicNames.length} matching ${topicNames.length === 1 ? 'section' : 'sections'}`;
  shortcuts.replaceChildren();
  const suggestedTopics = matchedTopics.length ? matchedTopics : partialTopics;
  shortcuts.hidden = !query || !matches || suggestedTopics.length === 0;
  if (query && matches) suggestedTopics.forEach(topic => {
    const link = document.createElement('a');
    const destination = new URL(topic.getAttribute('href'), location.href);
    destination.searchParams.set('from', query);
    link.href = destination.href;
    const name = topic.querySelector('span:nth-child(2)').childNodes[0].textContent.trim();
    link.textContent = `Read ${name} →`;
    shortcuts.append(link);
  });
  if (query && matches && !matchedTopics.length) {
    const explanation = document.createElement('p');
    explanation.className = 'match-explanation';
    explanation.textContent = partialTopics.length
      ? 'Your words match across the catalog. These sections cover some of them; no single section matches every word.'
      : 'Matched an exploration’s title, summary, or catalog keywords.';
    shortcuts.prepend(explanation);
    shortcuts.hidden = false;
  }
  const url = new URL(location.href);
  if (query) url.searchParams.set('q', query);
  else url.searchParams.delete('q');
  history.replaceState(null, '', url);
  document.querySelectorAll('.feature-link, .topic-node').forEach(link => {
    const destination = new URL(link.getAttribute('href'), location.href);
    if (query) destination.searchParams.set('from', query);
    else destination.searchParams.delete('from');
    link.href = destination.href;
  });
  document.querySelector('#empty-description').textContent = `No exploration titles, summaries, or connected topics match “${query}”. Try GPU credits, accounts, design, or accessibility.`;
}

function resetSearch() {
  search.value = '';
  render();
  search.focus();
}

search.addEventListener('input', render);
clear.addEventListener('click', resetSearch);
document.querySelector('#reset').addEventListener('click', resetSearch);
search.addEventListener('keydown', event => {
  if (event.key === 'Escape' && search.value) {
    event.preventDefault();
    resetSearch();
  }
});
document.querySelector('#search-controls').hidden = false;
document.querySelector('#search-scope').hidden = false;
search.setAttribute('aria-describedby', 'search-scope');
render();
window.addEventListener('popstate', () => {
  search.value = new URL(location.href).searchParams.get('q') || '';
  render();
});
