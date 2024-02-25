export class DockSize {
    public constructor(
        public width: number,
        public height: number,
    ) {
    }

    public copy(): DockSize {
        return new DockSize(this.width, this.height);
    }
}
