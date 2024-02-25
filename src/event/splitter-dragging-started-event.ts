import { DockSplitter } from '../dock-splitter';

export class SplitterDraggingStartedEvent extends Event {
    public static readonly NAME = 'splitter-drag-started';

    public constructor(
        public readonly splitter: DockSplitter,
        public readonly startX: number,
        public readonly startY: number,
    ) {
        super(SplitterDraggingStartedEvent.NAME);
    }
}
