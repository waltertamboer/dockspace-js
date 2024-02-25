import { DockContainer } from './dock-container';
import { DockSplitterDirection } from './dock-splitter-direction';

export class DockContainerRow extends DockContainer {
    /**
     * @inheritDoc
     */
    public getSplitterDirection(): DockSplitterDirection {
        return DockSplitterDirection.Horizontal;
    }
}
