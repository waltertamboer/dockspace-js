import { DockItem } from './dock-item';
import { DockSize } from './dock-size';
import { DockSpace } from './dock-space';
import { DockContainer } from './dock-container';
import { DockPaneBuilder } from './dock-pane-builder';

export class DockPane extends DockItem {
    /**
     * The growth factor of this pane.
     * This is used to calculate the size of the pane relative to the other panes.
     *
     * @private
     */
    private _growFactor: number;

    /**
     * The minimum height of the pane in pixels.
     * Can be set to null if there is no minimum height.
     *
     * @private
     */
    private _minHeight: number | null;

    /**
     * The maximum height of the pane in pixels.
     * Can be set to null if there is no maximum height.
     *
     * @private
     */
    private _maxHeight: number | null;

    /**
     * The minimum width of the pane in pixels.
     * Can be set to null if there is no minimum height.
     *
     * @private
     */
    private _minWidth: number | null;

    /**
     * The maximum width of the pane in pixels.
     * Can be set to null if there is no maximum width.
     *
     * @private
     */
    private _maxWidth: number | null;

    /**
     * Initializes a new instance of this class.
     *
     * @param dockSpace The dock space in which this pane exists.
     * @param parentItem The parent of this pane.
     * @param _renderer The renderer used to draw the pane's content.
     */
    public constructor(
        dockSpace: DockSpace,
        private readonly _renderer: DockPaneBuilder | null,
    ) {
        super(dockSpace);

        this._growFactor = 1;

        this._minHeight = null;
        this._maxHeight = null;

        this._minWidth = null;
        this._maxWidth = null;
    }

    public normalizeSize(width: number, height: number): DockSize {
        width = Math.max(width, this.minWidth ?? width);
        width = Math.min(width, this.maxWidth ?? width);

        height = Math.max(height, this.minHeight ?? height);
        height = Math.min(height, this.maxHeight ?? height);

        return new DockSize(width, height);
    }

    public get growFactor(): number {
        return this._growFactor;
    }

    public set growFactor(value: number) {
        this._growFactor = value;
    }

    public get minHeight(): number | null {
        return this._minHeight;
    }

    public set minHeight(value: number | null) {
        this._minHeight = value;
    }

    public get maxHeight(): number | null {
        return this._maxHeight;
    }

    public set maxHeight(value: number | null) {
        this._maxHeight = value;
    }

    public get minWidth(): number | null {
        return this._minWidth;
    }

    public set minWidth(value: number | null) {
        this._minWidth = value;
    }

    public get maxWidth(): number | null {
        return this._maxWidth;
    }

    public set maxWidth(value: number | null) {
        this._maxWidth = value;
    }

    public get renderer(): DockPaneBuilder | null {
        return this._renderer;
    }
}
