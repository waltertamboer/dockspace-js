import { DockPane } from '../dock-pane';

export class PaneMovementStartedEvent extends Event {
    public static readonly NAME = 'pane-movement-started';

    public constructor(
        public readonly pane: DockPane,
        public readonly startX: number,
        public readonly startY: number,
    ) {
        super(PaneMovementStartedEvent.NAME);
    }
}
