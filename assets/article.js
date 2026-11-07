// Desktop exposes the contents; phones keep the reading-first disclosure.
const contents = document.querySelector('.toc');
const wide = window.matchMedia('(min-width: 1000px)');
function adaptContents() { contents.open = wide.matches; }
adaptContents();
wide.addEventListener('change', adaptContents);
const query = new URL(location.href).searchParams.get('from');
if (query) {
  document.querySelectorAll('a[href="../#explore"], a[data-explore-home]').forEach(link => {
    const url = new URL(link.getAttribute('href'), location.href);
    url.searchParams.set('q', query);
    url.hash = 'explore';
    link.href = url.href;
  });
}
document.querySelectorAll('a[href="#contents"]').forEach(link => {
  link.addEventListener('click', () => { contents.open = true; });
});
const sectionLinks = [...contents.querySelectorAll('a')];
const sections = [...document.querySelectorAll('.prose section[id]')];
function markCurrentSection() {
  const current = sections.filter(section => section.getBoundingClientRect().top <= 120).at(-1) || sections[0];
  sectionLinks.forEach(link => {
    if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
document.addEventListener('scroll', markCurrentSection, {passive:true});
markCurrentSection();
