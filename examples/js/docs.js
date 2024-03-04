function appendMenuItem(menu, url, label) {
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.innerText = label;

    const li = document.createElement('li');
    li.appendChild(a);

    menu.appendChild(li);
}

const menu = document.getElementById('docs-side-bar-menu');

appendMenuItem(menu, '01-panes.html', '01: Setting up panes');
appendMenuItem(menu, '02-row-container.html', '02: A row container');
appendMenuItem(menu, '03-grow-factor.html', '03: Set the grow factor');
appendMenuItem(menu, '04-no-interaction.html', '04: No interaction');
appendMenuItem(menu, '05-splitter-size.html', '05: Splitter size');
appendMenuItem(menu, '06-pane-builder.html', '06: Pane Builder');
appendMenuItem(menu, '07-tabbar-html-builder.html', '07: Tabbar Builder');
appendMenuItem(menu, '08-canvas-renderer.html', '08: Canvas renderer');
