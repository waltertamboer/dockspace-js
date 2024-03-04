import { DockContainer } from '../../../dock-container';
import { DockContainerColumn } from '../../../dock-container-column';
import { DockContainerRow } from '../../../dock-container-row';
import { DockHtmlColumnContainer } from './dock-html-column-container';
import { DockHtmlElement } from './dock-html-element';
import { DockHtmlPane } from './dock-html-pane';
import { DockHtmlRowContainer } from './dock-html-row-container';
import { DockHtmlSplitter } from './dock-html-splitter';
import { DockPane } from '../../../dock-pane';
import { DockSpace } from '../../../dock-space';
import { DockHtmlRenderer } from '../dock-html-renderer';

function findHtmlElement(parentNode: DockHtmlElement, referenceNode: DockPane): DockHtmlElement | null {
    let node = parentNode.firstChild;

    while (node !== null) {
        if (node instanceof DockHtmlPane && node.pane === referenceNode) {
            return node;
        }

        node = node.nextSibling;
    }

    return null;
}

function registerNode(
    parentNode: DockHtmlElement,
    referenceNode: DockPane | null,
    nextNode: DockHtmlElement,
): void {
    nextNode.parentNode = parentNode;

    if (referenceNode === null) {
        parentNode.element.appendChild(nextNode.element);

        parentNode.append(nextNode);
    } else {
        let referenceNodeHtmlElement = findHtmlElement(parentNode, referenceNode);

        if (referenceNodeHtmlElement === null) {
            throw new Error('Failed to find the reference node html element with the id ' + referenceNode.id);
        }

        if (referenceNodeHtmlElement.previousSibling !== null) {
            referenceNodeHtmlElement = referenceNodeHtmlElement.previousSibling;
        }

        let referenceNodeElement = parentNode.element.querySelector('[data-id="' + referenceNode.id + '"]');

        if (referenceNodeElement && referenceNodeElement.previousElementSibling) {
            referenceNodeElement = referenceNodeElement.previousElementSibling;
        }

        if (referenceNodeElement === null) {
            throw new Error('Failed to find the reference node with the id ' + referenceNode.id);
        }

        parentNode.element.insertBefore(nextNode.element, referenceNodeElement);
        parentNode.insertBefore(nextNode, referenceNodeHtmlElement);
    }
}

export function buildHtmlPane(
    dockSpace: DockSpace,
    renderer: DockHtmlRenderer,
    parentNode: DockHtmlElement,
    container: DockContainer,
    pane: DockPane,
    insertBefore: DockPane | null,
): void {
    const addSplitter: boolean = parentNode.lastChild !== null;
    if (addSplitter) {
        registerNode(parentNode, insertBefore, new DockHtmlSplitter(dockSpace, renderer, container));
    }

    switch (true) {
        case pane instanceof DockContainerColumn:
            registerNode(parentNode, insertBefore, new DockHtmlColumnContainer(dockSpace, renderer, pane));
            break;

        case pane instanceof DockContainerRow:
            registerNode(parentNode, insertBefore, new DockHtmlRowContainer(dockSpace, renderer, pane));
            break;

        default:
            registerNode(parentNode, insertBefore, new DockHtmlPane(dockSpace, renderer, pane));
            break;
    }
}

export function buildHtmlPanes(
    dockSpace: DockSpace,
    renderer: DockHtmlRenderer,
    parentNode: DockHtmlElement,
    container: DockContainer,
): void {
    container.panes.forEach(pane => buildHtmlPane(
        dockSpace,
        renderer,
        parentNode,
        container,
        pane,
        null,
    ));
}
