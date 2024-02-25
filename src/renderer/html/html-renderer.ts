import { DockHtmlSpaceContainer } from './element/dock-html-space-container';
import { DockSpace } from '../../dock-space';
import { Renderer } from '../renderer';
import { RefreshEvent } from '../../event/refresh-event';
import { SplitterDraggingStartedEvent } from '../../event/splitter-dragging-started-event';
import { SplitterDraggingStoppedEvent } from '../../event/splitter-dragging-stopped-event';
import { DockSplitterDirection } from '../../dock-splitter-direction';
import { PaneAddedEvent } from '../../event/pane-added-event';
import { buildHtmlPane } from './element/buld-html-panes';
import { PaneRemovedEvent } from '../../event/pane-removed-event';
import { HtmlRendererElementMap } from './html-renderer-element-map';
import { PaneMovementStartedEvent } from '../../event/pane-movement-started-event';
import { PaneMovementStoppedEvent } from '../../event/pane-movement-stopped-event';
import { PanePointerEnterEvent } from '../../event/pane-pointer-enter-event';
import { DockPane } from '../../dock-pane';
import { DockContainer } from '../../dock-container';

export class HtmlRenderer implements Renderer {
    private _interactive: boolean;
    private _splitterSize: number;
    private _elementMap: HtmlRendererElementMap;
    private _dockSpaceContainerElement: DockHtmlSpaceContainer;

    private _movingSplitterEvent: SplitterDraggingStartedEvent | null;
    private _movingSplitterX: number;
    private _movingSplitterY: number;

    private _movingPaneEvent: PaneMovementStartedEvent | null;

    private _activePane: DockPane | null;
    private _activePaneTarget: 'top' | 'bottom' | 'left' | 'right' | null;
    private _ghostPaneElement: HTMLElement | null;

    public constructor(
        private readonly _targetElement: HTMLElement,
        private readonly _dockSpace: DockSpace,
    ) {
        this._interactive = true;
        this._splitterSize = 5;
        this._elementMap = new HtmlRendererElementMap();
        this._dockSpaceContainerElement = new DockHtmlSpaceContainer(this._dockSpace, this, this._targetElement);
        // this._dockSpaceContainerElement.debug();

        this._movingSplitterEvent = null;
        this._movingSplitterX = 0;
        this._movingSplitterY = 0;

        this._movingPaneEvent = null;

        this._activePane = null;
        this._activePaneTarget = null;
        this._ghostPaneElement = null;

        this.refresh();

        this._dockSpace.eventManager.addEventListener(RefreshEvent.NAME, () => this.refresh());

        this._dockSpace.eventManager.addEventListener(
            PaneAddedEvent.NAME,
            // @ts-ignore
            (event: PaneAddedEvent): void => {
                if (!event.pane.parentContainer) {
                    throw new Error('Pane is added without a parent. This should not happen.');
                }

                const dockHtmlContainer = this._elementMap.get(
                    event.pane.parentContainer.id
                );

                if (!dockHtmlContainer) {
                    throw new Error('Failed to find registered element.');
                }

                buildHtmlPane(
                    this._dockSpace,
                    this,
                    dockHtmlContainer,
                    event.pane.parentContainer,
                    event.pane,
                    event.insertedBefore,
                );

                this.refresh();
            }
        );

        this._dockSpace.eventManager.addEventListener(
            PaneRemovedEvent.NAME,
            // @ts-ignore
            (event: PaneRemovedEvent): void => {
                const removedPaneElement = this._elementMap.get(event.removedPane.id);

                if (!removedPaneElement) {
                    throw new Error('Failed to find the element with id ' + event.removedPane.id);
                }

                removedPaneElement.remove();

                this.cleanParentContainers(event.removedFromContainer);

                this.refresh();
            }
        );

        this._dockSpace.eventManager.addEventListener(
            SplitterDraggingStartedEvent.NAME,
            // @ts-ignore
            (event: SplitterDraggingStartedEvent): void => {
                this._movingSplitterEvent = event;
                this._movingSplitterX = event.startX;
                this._movingSplitterY = event.startY;
            },
        );

        this._dockSpace.eventManager.addEventListener(
            PanePointerEnterEvent.NAME,
            // @ts-ignore
            (event: PanePointerEnterEvent): void => {
                this._activePane = event.pane;
            },
        );

        this._dockSpace.eventManager.addEventListener(
            PaneMovementStartedEvent.NAME,
            // @ts-ignore
            (event: PaneMovementStartedEvent): void => {
                this._movingPaneEvent = event;
                this._ghostPaneElement = this.elements.get(event.pane.id).element.cloneNode(true) as HTMLElement;
            },
        );

        this._dockSpace.eventManager.addEventListener(
            PaneMovementStoppedEvent.NAME,
            // @ts-ignore
            (event: PaneMovementStoppedEvent): void => {
                if (this._activePane !== null && this._activePane.id !== event.pane.id && this._ghostPaneElement !== null) {
                    this.handlePaneMovementDrop();
                }

                if (this._ghostPaneElement !== null) {
                    this._ghostPaneElement.remove();
                    this._ghostPaneElement = null;
                }

                this._movingPaneEvent = null;
            },
        );

        window.addEventListener('resize', (evt) => {
            this.refresh();
        });

        document.body.addEventListener('pointermove', (evt: PointerEvent): void => {
            if (this._movingPaneEvent !== null) {
                this.handlePaneMovement(evt);
            } else if (this._movingSplitterEvent !== null) {
                this.handleSplitterMovement(evt);
            }
        });

        document.body.addEventListener('pointerup', (evt: PointerEvent): void => {
            if (this._movingPaneEvent !== null) {
                this._dockSpace.eventManager.dispatchEvent(new PaneMovementStoppedEvent(
                    this._movingPaneEvent.pane,
                    evt.clientX,
                    evt.clientY,
                ));
            }

            if (this._movingSplitterEvent !== null) {
                this._dockSpace.eventManager.dispatchEvent(new SplitterDraggingStoppedEvent(
                    this._movingSplitterEvent.splitter,
                    evt.clientX,
                    evt.clientY,
                ));

                this._movingSplitterEvent = null;
            }
        });
    }

    public get elements(): HtmlRendererElementMap {
        return this._elementMap;
    }

    public get interactive(): boolean {
        return this._interactive;
    }

    public set interactive(value: boolean) {
        this._interactive = value;
    }

    public get splitterSize(): number {
        return this._splitterSize;
    }

    public set splitterSize(value: number) {
        this._splitterSize = value;
    }

    public refresh(): void {
        this._dockSpaceContainerElement.refresh();
    }

    private handlePaneMovement(evt: PointerEvent): void {
        if (!this._movingPaneEvent || this._activePane === null || !this._activePane.parentContainer) {
            return;
        }

        const pane = this._movingPaneEvent.pane;
        const paneParent = pane.parentContainer;

        if (!paneParent) {
            return;
        }

        if (this._activePane.id !== pane.id && this._ghostPaneElement !== null) {
            const activeElement = this.elements.get(this._activePane.id);
            activeElement.element.appendChild(this._ghostPaneElement);

            let parentContainer: DockContainer | null = this._activePane.parentContainer;
            let posX = evt.clientX;
            let posY = evt.clientY;

            while (parentContainer !== null) {
                posX -= parentContainer.position.x;
                posY -= parentContainer.position.y;

                parentContainer = parentContainer.parentContainer;
            }

            const halfHeight = this._activePane.size.height / 2;
            const halfWidth = this._activePane.size.width / 2;

            const heightBoundary = this._activePane.size.height / 3;
            const widthBoundary = this._activePane.size.width / 2;
            const bottomOffset = this._activePane.position.y + this._activePane.size.height - heightBoundary;

            this._ghostPaneElement.classList.add('dockspace-pane-ghost');

            if (posY <= this._activePane.position.y + heightBoundary) {
                this._activePaneTarget = 'top';

                this._ghostPaneElement.style.left = '0px';
                this._ghostPaneElement.style.top = '0px';
                this._ghostPaneElement.style.height = halfHeight + 'px';
                this._ghostPaneElement.style.width = this._activePane.size.width + 'px';
            } else if (posY >= bottomOffset) {
                this._activePaneTarget = 'bottom';

                this._ghostPaneElement.style.left = '0px';
                this._ghostPaneElement.style.top = halfHeight + 'px';
                this._ghostPaneElement.style.height = halfHeight + 'px';
                this._ghostPaneElement.style.width = this._activePane.size.width + 'px';
            } else if (posX < this._activePane.position.x + widthBoundary) {
                this._activePaneTarget = 'left';

                this._ghostPaneElement.style.left = '0px';
                this._ghostPaneElement.style.top = '0px';
                this._ghostPaneElement.style.height = this._activePane.size.height + 'px';
                this._ghostPaneElement.style.width = halfWidth + 'px';
            } else {
                this._activePaneTarget = 'right';

                this._ghostPaneElement.style.left = halfWidth + 'px';
                this._ghostPaneElement.style.top = '0px';
                this._ghostPaneElement.style.height = this._activePane.size.height + 'px';
                this._ghostPaneElement.style.width = halfWidth + 'px';
            }
        }
    }

    private handleSplitterMovement(evt: PointerEvent): void {
        if (!this._movingSplitterEvent) {
            return;
        }

        const splitter = this._movingSplitterEvent.splitter;

        const splitterParent = splitter.parentContainer;
        const prevPane = splitter.previousPane;
        const nextPane = splitter.nextPane;

        const totalPanes = splitterParent.panes.length;
        const totalSplitters = totalPanes - 1;

        if (splitterParent.getSplitterDirection() === DockSplitterDirection.Horizontal) {
            const diffY = evt.clientY - this._movingSplitterY;

            let minSplitterPosition: number = prevPane.position.y;
            minSplitterPosition += prevPane.minHeight ?? 0;

            let maxSplitterPosition: number = nextPane.position.y + nextPane.size.height;
            maxSplitterPosition -= nextPane.minHeight ?? 0;

            let splitterPosition = splitter.position.y + diffY;
            splitterPosition = Math.max(splitterPosition, minSplitterPosition);
            splitterPosition = Math.min(splitterPosition, maxSplitterPosition);

            splitter.position.y = splitterPosition;
            splitter.size.height = this._splitterSize;

            prevPane.size.height = splitterPosition - prevPane.position.y;

            const oldY = nextPane.position.y;
            nextPane.position.y = splitterPosition + this._splitterSize;
            nextPane.size.height -= nextPane.position.y - oldY;

            // Recalculate growth factors so that the ratio is respected when a resize happens.
            const totalHeight = splitterParent.size.height - (totalSplitters * this._splitterSize);
            const totalBoxes = splitterParent.calculateGrowFactorBoxes();
            const paneBoxHeight = totalHeight / totalBoxes;

            prevPane.growFactor = prevPane.size.height / paneBoxHeight;
            nextPane.growFactor = nextPane.size.height / paneBoxHeight;
        } else {
            const diffX = evt.clientX - this._movingSplitterX;

            let minSplitterPosition: number = prevPane.position.x;
            minSplitterPosition += prevPane.minWidth ?? 0;

            let maxSplitterPosition: number = nextPane.position.x + nextPane.size.width;
            maxSplitterPosition -= nextPane.minWidth ?? 0;

            let splitterPosition = splitter.position.x + diffX;
            splitterPosition = Math.max(splitterPosition, minSplitterPosition);
            splitterPosition = Math.min(splitterPosition, maxSplitterPosition);

            splitter.position.x = splitterPosition;
            splitter.size.width = this._splitterSize;

            prevPane.size.width = splitterPosition - prevPane.position.x;

            const oldX = nextPane.position.x;
            nextPane.position.x = splitterPosition + this._splitterSize;
            nextPane.size.width -= nextPane.position.x - oldX;

            // Recalculate growth factors so that the ratio is respected when a resize happens.
            const totalWidth = splitterParent.size.width - (totalSplitters * this._splitterSize);
            const totalBoxes = splitterParent.calculateGrowFactorBoxes();
            const paneBoxWidth = totalWidth / totalBoxes;

            prevPane.growFactor = prevPane.size.width / paneBoxWidth;
            nextPane.growFactor = nextPane.size.width / paneBoxWidth;
        }

        this._dockSpace.refresh();

        this._movingSplitterX = evt.clientX;
        this._movingSplitterY = evt.clientY;
    }

    private handlePaneMovementDrop(): void {
        switch (this._activePaneTarget) {
            case 'top':
                this.handlePaneMovementDropRow(true);
                break;

            case 'bottom':
                this.handlePaneMovementDropRow(false);
                break;

            case 'left':
                this.handlePaneMovementDropColumn(true);
                break;

            case 'right':
                this.handlePaneMovementDropColumn(false);
                break;

            default:
                throw new Error('Invalid active pane target: ' + this._activePaneTarget);
        }
    }

    private handlePaneMovementDropRow(appendFirst: boolean) {
        const newContainer = this._dockSpace.createRowContainer();

        this.handlePaneMovementDropForContainer(newContainer, appendFirst);
    }

    private handlePaneMovementDropColumn(appendFirst: boolean) {
        const newContainer = this._dockSpace.createColumnContainer();

        this.handlePaneMovementDropForContainer(newContainer, appendFirst);
    }

    private handlePaneMovementDropForContainer(newContainer: DockContainer, appendFirst: boolean): void {
        if (this._activePane === null) {
            throw new Error('Cannot handle drop, no active pane available.');
        }

        if (this._movingPaneEvent === null) {
            throw new Error('Cannot handle drop, no moving pane available.');
        }

        const newParentContainer = this._activePane.parentContainer;
        if (newParentContainer === null) {
            throw new Error('Invalid pane, no parent container found.');
        }

        let oldParentContainer = this._movingPaneEvent.pane.parentContainer;
        if (oldParentContainer === null) {
            throw new Error('Failed to find old parent container.');
        }

        // Reset the grow factors so that they turn out equal.
        this._activePane.growFactor = 1;
        this._movingPaneEvent.pane.growFactor = 1;

        // Insert the new container at the place of the pane we're hovering over.
        newParentContainer.insertBefore(newContainer, this._activePane);

        // Now append the panes to the new container.
        if (appendFirst) {
            newContainer.append(this._movingPaneEvent.pane);
            newContainer.append(this._activePane);
        } else {
            newContainer.append(this._activePane);
            newContainer.append(this._movingPaneEvent.pane);
        }

        // Keep removing parent containers as long as they are empty.
        this.cleanParentContainers(oldParentContainer);

        this._dockSpace.refresh();
    }

    private cleanParentContainers(containerToRemove: DockContainer): void {
        while (containerToRemove !== null && containerToRemove.parentContainer !== null) {
            if (containerToRemove.panes.length !== 0) {
                break;
            }

            containerToRemove.parentContainer.removePane(containerToRemove);

            containerToRemove = containerToRemove.parentContainer;
        }
    }

    public debug(): string {
        return this._dockSpaceContainerElement.debug();
    }
}
