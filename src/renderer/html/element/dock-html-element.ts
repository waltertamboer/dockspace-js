export abstract class DockHtmlElement {
    public parentNode: DockHtmlElement | null;
    public firstChild: DockHtmlElement | null;
    public lastChild: DockHtmlElement | null;
    public nextSibling: DockHtmlElement | null;
    public previousSibling: DockHtmlElement | null;

    protected _element: HTMLElement | null;

    public constructor() {
        this.parentNode = null;
        this.firstChild = null;
        this.lastChild = null;
        this.nextSibling = null;
        this.previousSibling = null;

        this._element = null;
    }

    public get element(): HTMLElement {
        if (this._element === null) {
            throw new Error('No element has been build.');
        }

        return this._element;
    }

    public append(node: DockHtmlElement): void {
        this.insertBefore(node, null);
    }

    public insertBefore(node: DockHtmlElement, referencedNode: DockHtmlElement | null): void {
        node.parentNode = this;

        if (referencedNode === null) {
            if (this.lastChild === null) {
                this.firstChild = node;
                this.lastChild = node;
            } else {
                node.previousSibling = this.lastChild;

                this.lastChild.nextSibling = node;
                this.lastChild = node;
            }

            return;
        }

        const prev = referencedNode.previousSibling;

        if (prev !== null) {
            prev.nextSibling = node;
        }

        node.previousSibling = prev;
        node.nextSibling = referencedNode;

        referencedNode.previousSibling = node;

        if (this.firstChild === referencedNode) {
            this.firstChild = node;
        }
    }

    public remove(): void {
        this._element?.remove();

        if (this.parentNode !== null) {
            if (this.parentNode.firstChild === this) {
                this.parentNode.firstChild = this.nextSibling;
            }

            if (this.parentNode.lastChild === this) {
                this.parentNode.lastChild = this.previousSibling;
            }
        }

        if (this.previousSibling !== null) {
            this.previousSibling.nextSibling = this.nextSibling;
        }

        if (this.nextSibling !== null) {
            this.nextSibling.previousSibling = this.previousSibling;
        }
    }

    /**
     * Writes the element to the console including all its children.
     *
     * @param depth The depth to debug at.
     * @param maxIterations The maximum iterations that are allowed to be ran.
     *
     * @return Returns the content as a string.
     */
    public debug(depth: number = 0, maxIterations: number = 1024): string {
        let result = '&nbsp;'.repeat(depth * 4) + '- node: '
            + this.getDebugLabel()
            + ' - prev: ' + this.previousSibling?.getDebugLabel()
            + ' - next: ' + this.nextSibling?.getDebugLabel()
            + '<br>';

        let node = this.firstChild;
        let iterationCounter = maxIterations;

        while (node !== null && iterationCounter > 0) {
            result += node.debug(depth + 1, maxIterations);

            node = node.nextSibling;

            --iterationCounter;
        }

        if (iterationCounter === 0 && node !== null) {
            throw new Error('Infinite loop detected in debug method.');
        }

        return result;
    }

    /**
     * Retrieves the debug label for this element.
     *
     * @return Returns the debug label as a string.
     */
    protected abstract getDebugLabel(): string;

    /**
     * Refreshes the element by updating it.
     */
    public abstract refresh(): void;
}
