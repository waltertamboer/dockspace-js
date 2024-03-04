import { DockHtmlElement } from './element/dock-html-element';

export class DockHtmlRendererElementMap {
    private readonly _items: Map<number, DockHtmlElement>;

    public constructor() {
        this._items = new Map<number, DockHtmlElement>();
    }

    public delete(id: number): void {
        this._items.delete(id);
    }

    public get(id: number): DockHtmlElement {
        const result = this._items.get(id) ?? null;

        if (result === null) {
            throw new Error('Failed to get element with id ' + id);
        }

        return result;
    }

    public register(id: number, element: DockHtmlElement) {
        this._items.set(id, element);
    }
}
