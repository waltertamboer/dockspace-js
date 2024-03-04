import { DockPane } from '../../../dock-pane';
import { DockHtmlElement } from '../element/dock-html-element';
import { DockHtmlRenderer } from '../dock-html-renderer';
import { DockPaneHtmlBuilder } from './dock-pane-html-builder';
import { DockSpace } from '../../../dock-space';
import { PaneMovementStartedEvent } from '../../../event/pane-movement-started-event';
import { PaneClosedEvent } from '../../../event/pane-closed-event';

export abstract class DockTabbarHtmlBuilder extends DockPaneHtmlBuilder {
    public constructor(
        private readonly _dockSpace: DockSpace,
    ) {
        super();
    }

    protected abstract getHeaderLabel(renderer: DockHtmlRenderer, pane: DockPane): string;

    protected abstract buildTab(renderer: DockHtmlRenderer, parentElement: HTMLElement, pane: DockPane): void;

    protected buildHtml(renderer: DockHtmlRenderer, parentElement: DockHtmlElement, pane: DockPane): void {
        const paneElement = renderer.elements.get(pane.id);

        const containerElement = paneElement.element;
        containerElement.classList.add('dockspace-pane-tabbed');

        this.buildHeader(renderer, pane, containerElement);
        this.buildContent(renderer, pane, containerElement);
    }

    protected handleCloseButtonClick(evt: MouseEvent, pane: DockPane): void {
        const event = new PaneClosedEvent(pane);

        this._dockSpace.eventManager.dispatchEvent(event);

        if (event.defaultPrevented) {
            return;
        }

        evt.preventDefault();
        evt.stopImmediatePropagation();

        pane.parentContainer?.removePane(pane);
    }

    protected buildHeader(renderer: DockHtmlRenderer, pane: DockPane, containerElement: HTMLElement): void {
        const containerHeader = document.createElement('div');
        containerHeader.classList.add('dockspace-pane-tabbar-header');
        containerHeader.addEventListener('pointerdown', (evt: PointerEvent): void => {
            this.triggerPaneMovement(pane, evt);
        });
        containerElement.appendChild(containerHeader);

        this.buildHeaderContent(renderer, pane, containerHeader);
    }

    protected buildHeaderContent(renderer: DockHtmlRenderer, pane: DockPane, containerHeader: HTMLDivElement) {
        const title = document.createElement('span');
        title.classList.add('dockspace-pane-tabbar-header-title');
        title.innerHTML = this.getHeaderLabel(renderer, pane);
        containerHeader.appendChild(title);

        const closeButton = document.createElement('button');
        closeButton.classList.add('dockspace-pane-tabbar-header-close-button');
        closeButton.addEventListener('click', (evt: MouseEvent): void => {
            this.handleCloseButtonClick(evt, pane);
        });
        containerHeader.appendChild(closeButton);
    }

    protected buildContent(renderer: DockHtmlRenderer, pane: DockPane, containerElement: HTMLElement): void {
        const contentContainer = document.createElement('div');
        contentContainer.classList.add('dockspace-pane-tabbar-content');
        containerElement.appendChild(contentContainer);

        this.buildTab(renderer, contentContainer, pane);
    }

    private triggerPaneMovement(pane: DockPane, evt: PointerEvent) {
        this._dockSpace.eventManager.dispatchEvent(new PaneMovementStartedEvent(
            pane,
            evt.clientX,
            evt.clientY,
        ));
    }
}
