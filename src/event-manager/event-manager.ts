/**
 * The representation of an event manager.
 */
export interface EventManager {
    /**
     * Adds an event listener to the event manager.
     *
     * @param type The event type to listen to.
     * @param callback The callback to call when the event is invoked.
     */
    addEventListener(type: string, callback: (event: Event) => void): void;

    /**
     * Removes an event listener from the event manager.
     *
     * @param type The event type to stop listening to.
     * @param callback The callback to remove.
     */
    removeEventListener(type: string, callback: (event: Event) => void): void;

    /**
     * Dispatches an event to the event manager.
     *
     * @param event The event to dispatch.
     */
    dispatchEvent(event: Event): void;
}
