import { DockHtmlColumnContainer } from './dock-html-column-container';
import { DockHtmlElement } from './dock-html-element';
import { DockSpace } from '../../../dock-space';
import { HtmlRenderer } from '../html-renderer';

export class DockHtmlSpaceContainer extends DockHtmlElement {
    public constructor(
        private readonly _dockSpace: DockSpace,
        private readonly _renderer: HtmlRenderer,
        private readonly _targetElement: HTMLElement,
    ) {
        super();

        this.parentNode = null;
        this.firstChild = this.lastChild = new DockHtmlColumnContainer(
            this._dockSpace,
            this._renderer,
            this._dockSpace.container,
        );
        this.firstChild.parentNode = this;
        this.lastChild.parentNode = this;

        this._element = document.createElement('div');
        this._element.setAttribute('class', 'dockspace');
        this._element.appendChild(this.firstChild.element);

        this._targetElement.appendChild(this._element);
    }

    public refresh(): void {
        if (this._renderer.interactive) {
            this._element?.classList.remove('dockspace-readonly');
        } else {
            this._element?.classList.add('dockspace-readonly');
        }

        const width = this._targetElement.offsetWidth;
        const height = this._targetElement.offsetHeight;

        this.element.style.width = `${width}px`;
        this.element.style.height = `${height}px`;

        this._dockSpace.container.size = this._dockSpace.container.normalizeSize(width, height);

        this.firstChild?.refresh();
    }

    protected getDebugLabel(): string {
        return 'dockspace';
    }
}
