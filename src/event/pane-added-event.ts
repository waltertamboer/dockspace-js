import { DockPane } from '../dock-pane';

export class PaneAddedEvent extends Event {
    public static readonly NAME = 'pane-added';

    public constructor(
        public readonly pane: DockPane,
        public readonly insertedBefore: DockPane | null,
    ) {
        super(PaneAddedEvent.NAME);
    }
}
