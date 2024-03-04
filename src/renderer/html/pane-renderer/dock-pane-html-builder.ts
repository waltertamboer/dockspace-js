import { DockHtmlElement } from '../element/dock-html-element';
import { DockPaneBuilder } from '../../../dock-pane-builder';
import { DockPane } from '../../../dock-pane';
import { DockHtmlRenderer } from '../dock-html-renderer';
import { Renderer } from '../../renderer';

export abstract class DockPaneHtmlBuilder implements DockPaneBuilder {
    public build(renderer: Renderer, pane: DockPane): void {
        const parentElement = this.getParentElement(renderer, pane);

        this.buildHtml(renderer as DockHtmlRenderer, parentElement, pane);
    }

    protected abstract buildHtml(renderer: DockHtmlRenderer, parentElement: DockHtmlElement, pane: DockPane): void;

    private getParentElement(renderer: Renderer, pane: DockPane): DockHtmlElement {
        const htmlRenderer = renderer as DockHtmlRenderer;

        return htmlRenderer.elements.get(pane.id);
    }
}
