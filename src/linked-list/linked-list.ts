import { LinkedListNode } from './linked-list-node';
import { DockItem } from '../dock-item';

export class LinkedList<T> {
    private _head: LinkedListNode<T> | null;
    private _tail: LinkedListNode<T> | null;

    public constructor() {
        this._head = null;
        this._tail = null;
    }

    public get length(): number {
        let result = 0;
        let node = this._head;

        while (node !== null) {
            result++;

            node = node.next;
        }

        return result;
    }

    public get head(): LinkedListNode<T> | null {
        return this._head;
    }

    public get tail(): LinkedListNode<T> | null {
        return this._tail;
    }

    public append(value: T): LinkedListNode<T> {
        if (this._head === null || this._tail === null) {
            this._head = new LinkedListNode(value, null, null);
            this._tail = this._head;

            return this._head;
        }

        const node = new LinkedListNode(value, null, this._tail);

        this._tail.next = node;
        this._tail = node;

        return this._tail;
    }

    public clear(): void {
        this._head = null;
        this._tail = null;
    }

    public findNode(value: T): LinkedListNode<T> | null {
        let node = this._head;

        while (node !== null) {
            if (node.value === value) {
                return node;
            }

            node = node.next;
        }

        return null;
    }

    public forEachNode(callback: (value: LinkedListNode<T>, index: number) => void): void {
        let node = this._head;
        let index = 0;

        while (node !== null) {
            callback(node, index);

            node = node.next;
            index++;
        }
    }

    public forEach(callback: (value: T, index: number) => void): void {
        this.forEachNode(
            (node, index) => {
                callback(node.value, index);
            }
        );
    }

    public removeValue(value: T): boolean {
        let currNode = this._head;

        while (currNode !== null) {
            if (currNode.value === value) {
                this.removeNode(currNode);
                return true;
            }

            currNode = currNode.next;
        }

        return false;
    }

    public removeNode(node: LinkedListNode<T>): void {
        let prevNode = node.previous;

        if (prevNode === null) {
            this._head = node.next;

            if (this._head !== null) {
                this._head.previous = null;
            }
        } else {
            prevNode.next = node.next;

            if (prevNode.next !== null) {
                prevNode.next.previous = prevNode;
            }
        }
    }

    public debug(): void {
        let currNode = this._head;

        while (currNode !== null) {
            const dockItem = currNode.value as DockItem;

            console.log('- ' + dockItem.id);

            currNode = currNode.next;
        }
    }
}
