import { DockPane } from '../dock-pane';

export class PanePointerLeaveEvent extends Event {
    public static readonly NAME = 'pane-pointer-leave-started';

    public constructor(
        public readonly pane: DockPane,
    ) {
        super(PanePointerLeaveEvent.NAME);
    }
}
