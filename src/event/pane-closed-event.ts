import { DockPane } from '../dock-pane';

export class PaneClosedEvent extends Event {
    public static readonly NAME = 'pane-closed';

    public constructor(
        public readonly pane: DockPane,
    ) {
        super(PaneClosedEvent.NAME);
    }
}
