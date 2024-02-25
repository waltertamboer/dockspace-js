import { DockPane } from './dock-pane';
import { DockSpace } from './dock-space';
import { DockSplitterDirection } from './dock-splitter-direction';
import { PaneAddedEvent } from './event/pane-added-event';
import { PaneRemovedEvent } from './event/pane-removed-event';

export abstract class DockContainer extends DockPane {
    /**
     * A list of all panes.
     *
     * @protected
     */
    protected _panes: DockPane[];

    /**
     * Initializes a new instance of this class.
     *
     * @param dockSpace The dock space to which this container should be added.
     */
    public constructor(dockSpace: DockSpace) {
        super(dockSpace, null);

        this._panes = [];
    }

    /**
     * Gets the direction of the splitter.
     *
     * @protected
     */
    public abstract getSplitterDirection(): DockSplitterDirection;

    /**
     * Gets all the panes of this container.
     *
     * @return Returns the panes.
     */
    public get panes(): DockPane[] {
        return this._panes;
    }

    public calculateGrowFactorBoxes(): number {
        let result = 0;

        this.panes.forEach(
            (item: DockPane) => {
                result += item.growFactor;
            }
        );

        return result;
    }

    /**
     * Appends a pane to this container.
     *
     * @param pane The pane to append to this container.
     */
    public append(pane: DockPane): void {
        this.insertBefore(pane, null);
    }

    /**
     * Inserts a pane before the given pane.
     *
     * @param pane The new pane to insert.
     * @param targetPane The pane to insert before.
     */
    public insertBefore(pane: DockPane, targetPane: DockPane | null): void {
        pane.parentContainer?.removePane(pane);
        pane.parentContainer = this;

        if (targetPane === null) {
            this._panes.push(pane);
        } else {
            const index = this._panes.indexOf(targetPane);

            if (index === -1) {
                throw new Error('Invalid target pane given. Pane is part of the container with id ' + this.id);
            }


            this._panes.splice(index, 0, pane);
        }

        this.dockSpace.eventManager.dispatchEvent(new PaneAddedEvent(pane, targetPane));
    }

    /**
     * Removes the given pane from this container or from one of the child containers.
     *
     * @param paneToRemove The pane to remove.
     *
     * @return Returns true when the pane was removed; false otherwise.
     */
    public removePane(paneToRemove: DockPane): boolean {
        const indexToRemove = this._panes.indexOf(paneToRemove);

        if (indexToRemove === -1) {
            return false;
        }

        this._panes.splice(indexToRemove, 1);

        const container = paneToRemove.parentContainer;
        if (!container) {
            throw new Error('Cannot remove a pane that does not have a parent container.');
        }

        paneToRemove.parentContainer = null;

        this.dockSpace.eventManager.dispatchEvent(new PaneRemovedEvent(paneToRemove, container));

        return true;
    }
}
