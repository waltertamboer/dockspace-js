import { DockHtmlElement } from '../element/dock-html-element';
import { DockPaneRenderer } from '../../../dock-pane-renderer';
import { DockPane } from '../../../dock-pane';
import { HtmlRenderer } from '../html-renderer';
import { Renderer } from '../../renderer';

export abstract class PaneHtmlRenderer implements DockPaneRenderer {
    public render(renderer: Renderer, pane: DockPane): void {
        const parentElement = this.getParentElement(renderer, pane);

        this.renderHtml(renderer as HtmlRenderer, parentElement, pane);
    }

    protected abstract renderHtml(renderer: HtmlRenderer, parentElement: DockHtmlElement, pane: DockPane): void;

    private getParentElement(renderer: Renderer, pane: DockPane): DockHtmlElement {
        const htmlRenderer = renderer as HtmlRenderer;

        return htmlRenderer.elements.get(pane.id);
    }
}
