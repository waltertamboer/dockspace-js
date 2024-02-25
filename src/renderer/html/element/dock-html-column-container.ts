import { DockContainerColumn } from '../../../dock-container-column';
import { HtmlRenderer } from '../html-renderer';
import { DockHtmlElement } from './dock-html-element';
import { buildHtmlPanes } from './buld-html-panes';
import { DockHtmlPane } from './dock-html-pane';
import { DockHtmlSplitter } from './dock-html-splitter';
import { DockSpace } from '../../../dock-space';

export class DockHtmlColumnContainer extends DockHtmlElement {
    public constructor(
        private readonly _dockSpace: DockSpace,
        private readonly _renderer: HtmlRenderer,
        private readonly _container: DockContainerColumn,
    ) {
        super();

        this._renderer.elements.register(this._container.id, this);

        this._element = document.createElement('div');
        this._element.setAttribute('class', 'dockspace-container-column');
        this._element.setAttribute('data-id', this._container.id.toString());

        buildHtmlPanes(this._dockSpace, this._renderer, this, this._container);
    }

    public get pane(): DockContainerColumn {
        return this._container;
    }

    public refresh(): void {
        this.element.style.left = `${this._container.position.x}px`;
        this.element.style.top = `${this._container.position.y}px`;
        this.element.style.width = `${this._container.size.width}px`;
        this.element.style.height = `${this._container.size.height}px`;

        this.element.setAttribute('data-pos-x', this.pane.position.x.toString());
        this.element.setAttribute('data-pos-y', this.pane.position.y.toString());
        this.element.setAttribute('data-size-w', this.pane.size.width.toString());
        this.element.setAttribute('data-size-h', this.pane.size.height.toString());

        const totalPanes = this._container.panes.length;
        const totalSplitters = totalPanes - 1;

        const totalWidth = this._container.size.width - (totalSplitters * this._renderer.splitterSize);
        const totalHeight = this._container.size.height;

        const totalBoxes = this._container.calculateGrowFactorBoxes();
        const paneBoxWidth = totalWidth / totalBoxes;

        let position = 0;

        let node: DockHtmlElement | null = this.firstChild;

        while (node !== null) {
            const paneNode = node as DockHtmlPane;
            paneNode.element.setAttribute('data-grow-factor', paneNode.pane.growFactor.toString());

            const normalizedSize = paneNode.pane.size;
            normalizedSize.width = paneBoxWidth * paneNode.pane.growFactor;
            normalizedSize.height = totalHeight;

            paneNode.pane.position.x = position;
            paneNode.pane.position.y = 0;
            paneNode.pane.size = normalizedSize;
            paneNode.refresh();

            position += paneNode.pane.size.width;

            if (paneNode.nextSibling !== null) {
                const splitterNode = paneNode.nextSibling as DockHtmlSplitter;
                splitterNode.position.x = position;
                splitterNode.size.width = this._renderer.splitterSize;
                splitterNode.size.height = totalHeight;
                splitterNode.refresh();

                position += splitterNode.size.width;
            }

            node = node.nextSibling?.nextSibling ?? null;
        }
    }

    public remove(): void {
        super.remove();

        // Remove the splitter:
        if (this.nextSibling !== null) {
            this.nextSibling.remove();
        } else if (this.previousSibling !== null) {
            this.previousSibling.remove();
        }

        this._renderer.elements.delete(this._container.id);
    }

    protected getDebugLabel(): string {
        return 'dock-container-column: ' + this._container.id;
    }
}
