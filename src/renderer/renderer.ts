export interface Renderer {
    /**
     * Checks if interactive mode is enabled.
     *
     * @return Returns true when the renderer is interactive; false otherwise.
     */
    get interactive(): boolean;

    /**
     * Enables or disables interactive mode.
     *
     * @param value The value to set.
     */
    set interactive(value: boolean);

    /**
     * Refreshes the renderer.
     */
    refresh(): void;
}
