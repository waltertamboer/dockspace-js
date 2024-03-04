import { DockHtmlRenderer } from '../dock-html-renderer';
import { DockPane } from '../../../dock-pane';
import { DockHtmlElement } from './dock-html-element';
import { DockSpace } from '../../../dock-space';
import { PanePointerEnterEvent } from '../../../event/pane-pointer-enter-event';
import { PanePointerLeaveEvent } from '../../../event/pane-pointer-leave-event';

export class DockHtmlPane extends DockHtmlElement {
    public constructor(
        private readonly _dockSpace: DockSpace,
        private readonly _renderer: DockHtmlRenderer,
        private readonly _pane: DockPane,
    ) {
        super();

        this._renderer.elements.register(this._pane.id, this);

        this._element = document.createElement('div');
        this._element.setAttribute('class', 'dockspace-pane');
        this._element.setAttribute('data-id', this._pane.id.toString());
        this._element.addEventListener('pointerenter', (evt: PointerEvent): void => {
            this._dockSpace.eventManager.dispatchEvent(new PanePointerEnterEvent(this._pane));
        });
        this._element.addEventListener('pointerleave', (evt: PointerEvent): void => {
            this._dockSpace.eventManager.dispatchEvent(new PanePointerLeaveEvent(this._pane));
        });

        this._pane.renderer?.build(this._renderer, this._pane);
    }

    public get pane(): DockPane {
        return this._pane;
    }

    public refresh(): void {
        this.element.style.left = `${this.pane.position.x}px`;
        this.element.style.top = `${this.pane.position.y}px`;
        this.element.style.width = `${this.pane.size.width}px`;
        this.element.style.height = `${this.pane.size.height}px`;

        this.element.setAttribute('data-pos-x', this.pane.position.x.toString());
        this.element.setAttribute('data-pos-y', this.pane.position.y.toString());
        this.element.setAttribute('data-size-w', this.pane.size.width.toString());
        this.element.setAttribute('data-size-h', this.pane.size.height.toString());

        // const content = this.element.querySelector('.content') as HTMLElement;
        // content.innerHTML =
    }

    public remove(): void {
        super.remove();

        // Remove the splitter:
        if (this.nextSibling !== null) {
            this.nextSibling.remove();
        } else if (this.previousSibling !== null) {
            this.previousSibling.remove();
        }

        // Unregister the element:
        this._renderer.elements.delete(this._pane.id);
    }

    protected getDebugLabel(): string {
        return 'dock-pane: ' + this._pane.id.toString();
    }
}
