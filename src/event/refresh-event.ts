import { DockSpace } from '../dock-space';

export class RefreshEvent extends Event {
    public static readonly NAME = 'refresh';

    public constructor(
        public readonly dockSpace: DockSpace,
    ) {
        super(RefreshEvent.NAME);
    }
}
