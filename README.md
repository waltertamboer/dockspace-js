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

Next create the style, an example can be found here. You can adjust it according 
to your needs.

If you change the size of the splitter, you also need to set the splitter size in 
JS. It's used to calculate positions. Setting the splitter size is done on the 
renderer.

```js
renderer.splitterSize = 5;
```

## Usage

The first step is to setup the dockspace.
