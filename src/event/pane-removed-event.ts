import { DockPane } from '../dock-pane';
import { DockContainer } from '../dock-container';

export class PaneRemovedEvent extends Event {
    public static readonly NAME = 'pane-removed';

    public constructor(
        public readonly removedPane: DockPane,
        public readonly removedFromContainer: DockContainer,
    ) {
        super(PaneRemovedEvent.NAME);
    }
}
