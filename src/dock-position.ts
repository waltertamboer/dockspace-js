export class DockPosition {
    public constructor(
        private _x: number,
        private _y: number,
    ) {
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public set x(value: number) {
        this._x = value;
    }

    public set y(value: number) {
        this._y = value;
    }
}
