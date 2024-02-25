export class LinkedListNode<T> {
    public constructor(
        private _value: T,
        private _next: LinkedListNode<T> | null,
        private _previous: LinkedListNode<T> | null,
    ) {
    }

    public get value(): T {
        return this._value;
    }

    public set value(value: T) {
        this._value = value;
    }

    public get next(): LinkedListNode<T> | null {
        return this._next;
    }

    public set next(value: LinkedListNode<T> | null) {
        this._next = value;
    }

    public get previous(): LinkedListNode<T> | null {
        return this._previous;
    }

    public set previous(value: LinkedListNode<T> | null) {
        this._previous = value;
    }
}
