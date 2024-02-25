import { DockPane } from '../dock-pane';

export class PaneMovementStoppedEvent extends Event {
    public static readonly NAME = 'pane-movement-stopped';

    public constructor(
        public readonly pane: DockPane,
        public readonly endX: number,
        public readonly endY: number,
    ) {
        super(PaneMovementStoppedEvent.NAME);
    }
}
