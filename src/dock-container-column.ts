import { DockContainer } from './dock-container';
import { DockSplitterDirection } from './dock-splitter-direction';

export class DockContainerColumn extends DockContainer {
    /**
     * @inheritDoc
     */
    public getSplitterDirection(): DockSplitterDirection {
        return DockSplitterDirection.Vertical;
    }
}
