import { EventManager } from './event-manager';

/**
 * An event manager that uses the document to listen for events.
 */
export class DocumentEventManager implements EventManager {
    /**
     * @inheritDoc
     */
    public addEventListener(type: string, callback: (event: Event) => void): void {
        document.addEventListener(type, callback);
    }

    /**
     * @inheritDoc
     */
    public removeEventListener(type: string, callback: (event: Event) => void): void {
        document.removeEventListener(type, callback);
    }

    /**
     * @inheritDoc
     */
    public dispatchEvent(event: Event): void {
        document.dispatchEvent(event);
    }
}
