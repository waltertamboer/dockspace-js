# dockspace-js

A Typescript/Javascript library to create dockspace where panes can be managed.

## Installation

### The library

Add the library to your project via NPM or Yarn:

```bash
$ npm install @waltertamboer/dockspace-js
```

```bash
$ yarn add @waltertamboer/dockspace-js
```

### The stylesheet

Next create a stylesheet, an example can be found 
[here](https://github.com/waltertamboer/experiment-dockspacejs/blob/master/public/css/dockspace.css). 
The stylesheet is important because it sets the position to absolute for the containers.
Obviously, you can adjust it according to your needs.

The size of the splitter is not handled in the stylesheet but is handled in Javascript. 
This is done because positions of panes are calculated and depend on the size of the splitter.
Setting the splitter size is done on the renderer.

```js
renderer.splitterSize = 5;
```

## Usage

### Setup the Dockspace
The first step is to setup the dockspace. The dockspace is a model that holds all the pane's.

```ts
function runApp(): void {
    const dockSpace = new DockSpace();
    
    // ...
}

window.addEventListener('DOMContentLoaded', () => {
    runApp();
});
```

### Register pane's

Now that the dockspace is created, we can create panes and add them to the dockspace. The default 
container for the dockspace is a column container. This means that panes that are added to it, are 
divided by a vertical splitter.

```ts
function runApp(): void {
    const dockSpace = new DockSpace();
    
    // ...

    const pane1 = dockSpace.createPane();
    const pane2 = dockSpace.createPane();

    dockSpace.container.append(pane1);
    dockSpace.container.append(pane2);
}
```

### Setup renderer

Next we need to setup the renderer. Let's setup an HTML renderer. The refresh method should be called to render 
the dockspace.

```ts
function runApp(): void {
    const dockSpace = new DockSpace();
    
    // ...
    
    const targetElement = document.getElementById('container');

    if (!targetElement) {
        throw new Error("Failed to find element with id 'container'.");
    }

    const renderer = new HtmlRenderer(targetElement, dockSpace);
    renderer.interactive = true;
    renderer.splitterSize = 5;
    renderer.refresh();
}
```

### Using Row and Column containers

It's possible to add row and column containers. These containers are pane's as well.

```ts
function runApp(): void {
    const dockSpace = new DockSpace();

    const pane1 = dockSpace.createPane();
    dockSpace.container.append(pane1);

    const pane2 = dockSpace.createRowContainer();
    dockSpace.container.append(pane2);

    const pane3 = dockSpace.createPane();
    pane2.append(pane3);

    const pane4 = dockSpace.createPane();
    pane2.append(pane4);

    // ...
}
```

### Applying grow factors

Grow factors can be used to determine the size of a pane. The grow factor is respected even when the
viewport is resized. This way the pane's maintain their aspect ratio.

For each container, the grow factor is accumulated for every pane. Let's say there are two panes
and both of them have a grow factor of 1. That means both of them have an equal size. If the second
pane would have a grow factor of 2, we would calculate the size like this:
- Calculate the total sum of the grow factors: `totalFactor = 1 + 2 = 3`
- Calculate the size of a single pane: `singlePaneWidth = containerWidth / totalFactor;`
- Now calculate the size of a pane based on the grow factor: `paneWidth = singlePaneWidth * pane.growFactor`

The grow factor can be set on each pane:

```ts
function runApp(): void {
    const dockSpace = new DockSpace();

    const pane = dockSpace.createPane();

    pane.growFactor = 2;
}
```

### Using pane renderers

A pane renderer is a way to populate the content of the pane. The type of pane renderer depends on the type
of renderer that is being used. When the HTML renderer is used, you can extend the PaneHtmlRenderer class.

```ts
function runApp(): void {
    const dockSpace = new DockSpace();

    // ...
    
    const pane = dockSpace.createPane(new (class extends PaneHtmlRenderer {
        protected getHeaderLabel(renderer: HtmlRenderer, pane: DockPane): string {
            return 'Pane ' + pane.id.toString();
        }

        protected renderHtml(renderer: HtmlRenderer, parentElement: DockHtmlElement, pane: DockPane): void {
            const div = buildDiv(renderer, pane);

            div.style.backgroundColor = 'pink';

            parentElement.element.appendChild(div);
        }
    })());

    // ...
}
```

### Drag and drop pane's to different locations

In order to drag and drop pane's you can extend the TabbarHtmlRenderer renderer. This makes it 
possible to drag and drop a pane to a different location.

```ts
function runApp(): void {
    const dockSpace = new DockSpace();

    // ...

    const pane = dockSpace.createPane(new (class extends TabbarHtmlRenderer {
        protected getHeaderLabel(renderer: HtmlRenderer, pane: DockPane): string {
            return 'Pane ' + pane.id.toString();
        }

        protected renderTab(renderer: HtmlRenderer, parentElement: HTMLElement, pane: DockPane): void {
            const div = buildDiv(renderer, pane);

            div.style.backgroundColor = 'pink';

            parentElement.appendChild(div);
        }
    })(dockSpace));
    
    // ...
}
```
