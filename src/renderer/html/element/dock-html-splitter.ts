import { DockHtmlElement } from './dock-html-element';
import { DockPosition } from '../../../dock-position';
import { DockSize } from '../../../dock-size';
import { DockSplitterDirection } from '../../../dock-splitter-direction';
import { HtmlRenderer } from '../html-renderer';
import { SplitterDraggingStartedEvent } from '../../../event/splitter-dragging-started-event';
import { DockSpace } from '../../../dock-space';
import { DockHtmlPane } from './dock-html-pane';
import { DockSplitter } from '../../../dock-splitter';
import { DockPane } from '../../../dock-pane';
import { DockContainer } from '../../../dock-container';

export class DockHtmlSplitter extends DockHtmlElement implements DockSplitter {
    private _position: DockPosition;
    private _size: DockSize;

    public constructor(
        private readonly _dockSpace: DockSpace,
        private readonly _renderer: HtmlRenderer,
        private readonly _container: DockContainer,
    ) {
        super();

        this._position = new DockPosition(0, 0);
        this._size = new DockSize(0, 0);

        this._element = document.createElement('div');

        if (this._container.getSplitterDirection() === DockSplitterDirection.Horizontal) {
            this.size.height = this._renderer.splitterSize;

            this._element.setAttribute('class', 'dockspace-splitter-horizontal');
            this._element.setAttribute('style', 'height: ' + this.size.height + 'px; width: 100%;');
        } else {
            this.size.width = this._renderer.splitterSize;

            this._element.setAttribute('class', 'dockspace-splitter-vertical');
            this._element.setAttribute('style', 'width: ' + this.size.width + 'px; height: 100%;');
        }

        this._element.addEventListener('pointerdown', (evt: PointerEvent) => {
            if (!this._renderer.interactive) {
                evt.preventDefault();
                evt.stopImmediatePropagation();
                return;
            }

            this._dockSpace.eventManager.dispatchEvent(
                new SplitterDraggingStartedEvent(
                    this,
                    evt.clientX,
                    evt.clientY,
                ),
            );
        });
    }

    public get parentContainer(): DockContainer {
        return this._container;
    }

    public get previousPane(): DockPane {
        if (this.previousSibling === null) {
            throw new Error('Failed to get previous pane.');
        }

        return (this.previousSibling as DockHtmlPane).pane;
    }

    public get nextPane(): DockPane {
        if (this.nextSibling === null) {
            throw new Error('Failed to get previous pane.');
        }

        return (this.nextSibling as DockHtmlPane).pane;
    }

    public get position(): DockPosition {
        return this._position;
    }

    public set position(value: DockPosition) {
        this._position = value;
    }

    public get size(): DockSize {
        return this._size;
    }

    public set size(value: DockSize) {
        this._size = value;
    }

    public refresh(): void {
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
        this.element.style.width = `${this.size.width}px`;
        this.element.style.height = `${this.size.height}px`;
    }

    protected getDebugLabel(): string {
        return 'dock-splitter';
    }
}
