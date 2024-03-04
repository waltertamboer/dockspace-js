import { DockPane } from './dock-pane';
import { Renderer } from './renderer/renderer';

/**
 * The DockPaneBuilder is used to populate the pane with content.
 * Depending on the build system, a different renderer can be injected.
 */
export interface DockPaneBuilder {
    build(renderer: Renderer, pane: DockPane): void;
}
