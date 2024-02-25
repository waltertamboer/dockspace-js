import { DockContainer } from './dock-container';
import { DockPane } from './dock-pane';
import { DockPosition } from './dock-position';
import { DockSize } from './dock-size';

/**
 * The representation of a splitter between panes.
 */
export interface DockSplitter {
    /**
     * Gets the position of the splitter.
     *
     * @return Returns an instance of DockPosition.
     */
    get position(): DockPosition;
    set position(value: DockPosition);

    /**
     * Gets the size of the splitter.
     *
     * @return Returns an instance of DockSize.
     */
    get size(): DockSize;
    set size(value: DockSize);

    /**
     * Gets the container in which this splitter is located.
     *
     * @return Returns an instance of DockContainer.
     */
    get parentContainer(): DockContainer;

    get previousPane(): DockPane;

    get nextPane(): DockPane;
}
