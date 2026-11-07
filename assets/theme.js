// Apply the saved preference before styles load; storage is optional.
(() => {
  const system = matchMedia('(prefers-color-scheme: dark)');
  let preference = 'system';
  try { preference = localStorage.getItem('mini-research-theme') || 'system'; } catch {}
  if (!['system', 'light', 'dark'].includes(preference)) preference = 'system';
  function apply() {
    const theme = preference === 'system' ? (system.matches ? 'dark' : 'light') : preference;
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#101019' : '#f7f6fb');
    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.textContent = `Theme: ${preference}`;
      button.setAttribute('aria-label', `Theme: ${preference}. Switch to ${preference === 'system' ? 'dark' : preference === 'dark' ? 'light' : 'system'} theme`);
    });
  }
  apply();
  system.addEventListener('change', apply);
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.hidden = false;
      button.addEventListener('click', () => {
        preference = {system: 'dark', dark: 'light', light: 'system'}[preference];
        try { localStorage.setItem('mini-research-theme', preference); } catch {}
        apply();
      });
    });
    apply();
  });
})();
