import { DockContainer } from './dock-container';
import { DockPosition } from './dock-position';
import { DockSize } from './dock-size';
import { DockSpace } from './dock-space';
import { DockContainerRow } from './dock-container-row';
import { LinkedListNode } from './linked-list/linked-list-node';

export abstract class DockItem {
    /**
     *  A static counter to determine the id for the next dock item.
     *
     *  @private
     */
    private static idGenerator: number = 0;

    /**
     * A unique id assigned to the dock item.
     *
     * @private
     */
    private _id: number;

    /**
     * The parent container of this dock item.
     * The parent can change when a dock pane is moved from one place to another.
     *
     * @private
     */
    private _parentContainer: DockContainer | null;

    /**
     * The position of this dock item.
     * The position is a normalized value between 0 and 1. It's relative to the parent item.
     *
     * @private
     */
    private _position: DockPosition;

    /**
     * The size of this dock item.
     * The size is a normalized value between 0 and 1. It's relative to the parent item.
     *
     * @private
     */
    private _size: DockSize;

    /**
     * Initializes a new instance of this class.
     *
     * @param dockSpace The dock space to which this item belongs.
     *
     * @protected
     */
    protected constructor(
        public readonly dockSpace: DockSpace,
    ) {
        this._id = DockItem.idGenerator++;
        this._parentContainer = null;
        this._position = new DockPosition(0, 0);
        this._size = new DockSize(0, 0);
    }

    public get id(): number {
        return this._id;
    }

    public get parentContainer(): DockContainer | null {
        return this._parentContainer;
    }

    public set parentContainer(value: DockContainer | null) {
        this._parentContainer = value;
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

    public normalizeSize(width: number, height: number): DockSize {
        return new DockSize(width, height);
    }
}
