import { DockContainerColumn } from './dock-container-column';
import { DocumentEventManager } from './event-manager/document-event-manager';
import { EventManager } from './event-manager/event-manager';
import { DockPane } from './dock-pane';
import { RefreshEvent } from './event/refresh-event';
import { DockPaneBuilder } from './dock-pane-builder';
import { DockContainerRow } from './dock-container-row';

/**
 * The representation of a dock space in which panes exists.
 */
export class DockSpace {
    /**
     * The main container of the dock space.
     * The main container is used to hold panes.
     *
     * @private
     */
    private readonly _container: DockContainerColumn;

    /**
     * The event manager used throughout the dock space to dispatch events.
     * This is used to decouple the models from rendering and makes it possible to inject additional logic.
     *
     * @private
     */
    private readonly _eventManager: EventManager;

    /**
     * Initializes a new instance of this class.
     *
     * @param eventManager The event manager used to dispatch events.
     */
    public constructor(eventManager: EventManager | null = null) {
        this._container = new DockContainerColumn(this);
        this._eventManager = eventManager ?? new DocumentEventManager();
    }

    /**
     * Gets the event manager of the dock space.
     *
     * @return Returns an instance of the event manager responsible for dispatching events.
     */
    public get eventManager(): EventManager {
        return this._eventManager;
    }

    /**
     * Gets the main container of the dock space.
     *
     * @return Returns the container of the dock space to add panes to.
     */
    public get container(): DockContainerColumn {
        return this._container;
    }

    /**
     * Creates a pane within this dock space.
     *
     * @param renderer The renderer used to build the content of the pane.
     *
     * @return Returns the pane that was created.
     */
    public createPane(renderer: DockPaneBuilder | null = null): DockPane {
        return new DockPane(this, renderer);
    }

    /**
     * Creates a column container within this dock space.
     *
     * @return Returns the column container that was created.
     */
    public createColumnContainer(): DockContainerColumn {
        return new DockContainerColumn(this);
    }

    /**
     * Creates a column container within this dock space.
     *
     * @return Returns the column container that was created.
     */
    public createRowContainer(): DockContainerRow {
        return new DockContainerRow(this);
    }

    /**
     * Refreshes the dock space.
     */
    public refresh(): void {
        this._eventManager.dispatchEvent(new RefreshEvent(this));
    }
}
