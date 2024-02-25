import { DockPane } from '../dock-pane';

export class PanePointerEnterEvent extends Event {
    public static readonly NAME = 'pane-pointer-enter-started';

    public constructor(
        public readonly pane: DockPane,
    ) {
        super(PanePointerEnterEvent.NAME);
    }
}
