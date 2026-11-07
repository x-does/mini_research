#!/usr/bin/env python3
"""Render committed Markdown into buildless GitHub Pages articles.

Run from any directory with Python Markdown installed. Generated pages are committed.
"""
from pathlib import Path
import html
import re
import markdown

ROOT = Path(__file__).resolve().parents[1]
FOLDER = ROOT / 'research/gpu-credits'


def render(source, output, title, deck, label):
    text = (FOLDER / source).read_text()
    text = re.sub(r'^# .+\n', '', text, count=1)
    text = text.replace('](README.md)', '](./)').replace('](ACCOUNTS.md)', '](accounts.html)').replace('](TRAINING.md)', '](training.html)')
    # Python Markdown fences must start at the root; preserve numbered-list restarts.
    text = re.sub(r'^ {3}(.*)$', r'\1', text, flags=re.M)
    body = markdown.markdown(text, extensions=['tables', 'fenced_code', 'toc', 'sane_lists'])
    headings = re.findall(r'<h2 id="([^"]+)">(.+?)</h2>', body)
    # Sections enable reading position and ordinary anchor navigation without JS.
    parts = re.split(r'(?=<h2 id=")', body)
    body = parts[0] + ''.join(
        '<section id="' + re.search(r'<h2 id="([^"]+)"', part).group(1)
        + '">' + re.sub(r'<h2 id="[^"]+"', '<h2', part, count=1) + '</section>'
        for part in parts[1:])
    body = re.sub(r'<table>(.*?)</table>',
                  r'<div class="table-scroll" role="region" aria-label="Research comparison table" tabindex="0"><table>\1</table></div>',
                  body, flags=re.S)
    if source == 'README.md':
        chart = '<figure class="budget-chart"><strong>GPU-only hours within $30</strong>'
        for gpu, hours in [('T4', 50.8), ('L4', 37.5), ('L40S', 15.4), ('A100 80 GB', 12.0), ('H100', 7.6)]:
            chart += (f'<div class="budget-row"><span>{gpu}</span><div class="budget-track" aria-hidden="true">'
                      f'<div class="budget-bar" style="width:{hours / 50.8 * 100:.2f}%"></div></div>'
                      f'<span>{hours:.1f} h</span></div>')
        chart += '<figcaption>Calculated from Modal’s published GPU rates, checked 7 Nov 2026. CPU, RAM and other costs reduce available hours. This is not a training-speed benchmark; rates and calculations appear in the table below.</figcaption></figure>'
        target = '<section id="what-30-of-training-compute-could-mean">'
        # Put the figure after the explanation, before the rate table.
        start = body.index(target)
        pos = body.index('<div class="table-scroll"', start)
        body = body[:pos] + chart + body[pos:]
    toc = ''.join(f'<a href="#{anchor}">{name}</a>' for anchor, name in headings)
    title_attr = html.escape(title, quote=True)
    result = f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="{html.escape(deck, quote=True)}">
  <title>{title_attr} — Mini Research</title>
  <link rel="icon" href="../../assets/favicon.svg" type="image/svg+xml">
  <script src="../../assets/theme.js"></script>
  <link rel="stylesheet" href="../../assets/style.css"><link rel="stylesheet" href="../../assets/modern.css"><link rel="stylesheet" href="../../assets/research.css">
  <script src="../../assets/article.js" defer></script>
</head>
<body class="research-article">
  <a class="skip-link" href="#article">Skip to article</a>
  <header class="site-header wrap"><a class="wordmark" href="../../"><span class="brand-symbol" aria-hidden="true">✳</span> mini research.</a><nav aria-label="Main navigation"><a href="../../#explore" data-explore-home>Explore</a><a class="about-link" href="../">The notebook</a><button class="theme-toggle" type="button" hidden>Theme: system</button></nav></header>
  <main class="wrap">
    <header class="article-header"><div class="breadcrumb"><a href="../../#explore" data-explore-home>All explorations</a><span>/</span><a href="./">Research 002</a></div><p class="eyebrow">PERSONAL AI · SOURCES CHECKED 7 NOV 2026</p><h1>{html.escape(title)}</h1><p class="article-deck">{html.escape(deck)}</p><div class="article-meta"><span>{label}</span><span>Updated <time datetime="2026-11-07">7 Nov 2026</time></span></div><nav class="research-actions" aria-label="Research resources"><a href="./">Research overview</a><a href="training.html">Training method →</a><a href="accounts.html">Accounts &amp; access →</a><a href="https://github.com/x-does/mini_research/blob/main/research/gpu-credits/{source}">Markdown source ↗</a></nav></header>
    <div class="article-layout"><details class="toc" id="contents"><summary>On this page</summary>{toc}</details><article class="prose" id="article"><nav class="reading-navigation" aria-label="Reading navigation"><a href="#contents">Contents ↑</a><a href="../../#explore" data-explore-home>All explorations ←</a></nav>{body}<div class="article-end"><a href="../../#explore" data-explore-home>Back to all explorations ←</a></div></article></div>
  </main>
  <footer class="site-footer wrap"><a class="wordmark" href="../../">✳ mini research.</a><a href="accounts.html">Account setup →</a><a href="../../#explore" data-explore-home>All explorations ←</a></footer>
</body>
</html>
'''
    (FOLDER / output).write_text(result)


if __name__ == '__main__':
    render('README.md', 'index.html', 'Free compute. A smaller personal agent.',
           'Signup credits, training compute and a practical experiment for an agent that runs on devices below 8 GB RAM.', 'Research 002 · Exploratory findings')
    render('ACCOUNTS.md', 'accounts.html', 'The accounts. The access. The first experiment.',
           'Choose a compute account, authorize the training environment, and prepare a private data handoff.', 'Research 002 · Setup companion')

    render('TRAINING.md', 'training.html', 'A small model. A long conversation.',
           'A LoRA and retrieval experiment that turns 250k-context conversations into short, verified training episodes.', 'Research 002 · Proposed training method')
