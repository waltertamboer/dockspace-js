import { DockSplitter } from '../dock-splitter';

export class SplitterDraggingStoppedEvent extends Event {
    public static readonly NAME = 'splitter-drag-stopped';

    public constructor(
        public readonly splitter: DockSplitter,
        public readonly stopX: number,
        public readonly stopY: number,
    ) {
        super(SplitterDraggingStoppedEvent.NAME);
    }
}
