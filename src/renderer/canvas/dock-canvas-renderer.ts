import { DockSpace } from '../../dock-space';
import { Renderer } from '../renderer';
import { RefreshEvent } from '../../event/refresh-event';
import { SplitterDraggingStartedEvent } from '../../event/splitter-dragging-started-event';
import { PaneAddedEvent } from '../../event/pane-added-event';
import { PaneRemovedEvent } from '../../event/pane-removed-event';
import { PaneMovementStartedEvent } from '../../event/pane-movement-started-event';
import { PaneMovementStoppedEvent } from '../../event/pane-movement-stopped-event';
import { PanePointerEnterEvent } from '../../event/pane-pointer-enter-event';
import { DockContainer } from '../../dock-container';
import { DockPane } from '../../dock-pane';
import { DockRect } from '../../dock-rect';

export class DockCanvasRenderer implements Renderer {
    private _interactive: boolean;
    private _splitterSize: number;
    private _renderArea: DockRect;

    public constructor(
        private readonly _context: CanvasRenderingContext2D,
        private readonly _dockSpace: DockSpace,
        renderArea: DockRect | null,
    ) {
        this._interactive = true;
        this._splitterSize = 5;
        this._renderArea = renderArea || new DockRect(
            0,
            0,
            this._context.canvas.width,
            this._context.canvas.height,
        );

        this.refresh();

        this._dockSpace.eventManager.addEventListener(RefreshEvent.NAME, () => this.refresh());

        this._dockSpace.eventManager.addEventListener(
            PaneAddedEvent.NAME,
            // @ts-ignore
            (event: PaneAddedEvent): void => {
                // @todo

                this.refresh();
            }
        );

        this._dockSpace.eventManager.addEventListener(
            PaneRemovedEvent.NAME,
            // @ts-ignore
            (event: PaneRemovedEvent): void => {
                // @todo

                this.refresh();
            }
        );

        this._dockSpace.eventManager.addEventListener(
            SplitterDraggingStartedEvent.NAME,
            // @ts-ignore
            (event: SplitterDraggingStartedEvent): void => {
                // @todo
            },
        );

        this._dockSpace.eventManager.addEventListener(
            PanePointerEnterEvent.NAME,
            // @ts-ignore
            (event: PanePointerEnterEvent): void => {
                // @todo
            },
        );

        this._dockSpace.eventManager.addEventListener(
            PaneMovementStartedEvent.NAME,
            // @ts-ignore
            (event: PaneMovementStartedEvent): void => {
                // @todo
            },
        );

        this._dockSpace.eventManager.addEventListener(
            PaneMovementStoppedEvent.NAME,
            // @ts-ignore
            (event: PaneMovementStoppedEvent): void => {
                // @todo
            },
        );

        window.addEventListener('resize', (evt) => {
            this.refresh();
        });

        document.body.addEventListener('pointermove', (evt: PointerEvent): void => {
            // @todo
        });

        document.body.addEventListener('pointerup', (evt: PointerEvent): void => {
            // @todo
        });
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

    public get renderArea(): DockRect {
        return this._renderArea;
    }

    public set renderArea(value: DockRect) {
        this._renderArea = value;
    }

    public refresh(): void {
        this._context.clearRect(
            this._renderArea.x,
            this._renderArea.y,
            this._renderArea.width,
            this._renderArea.height,
        );

        this._context.fillStyle = "#d9d9d9";
        this._context.fillRect(
            this._renderArea.x,
            this._renderArea.y,
            this._renderArea.width,
            this._renderArea.height,
        );

        this._context.fillStyle = "#000";
        this._context.font = '20px Georgia';
        this._context.fillText('Not implemented yet. Will you contribute to this project?', 20, 50);

        this.refreshPane(this._dockSpace.container);
    }

    private refreshPane(pane: DockPane): void {
        console.log(pane);
    }
}
