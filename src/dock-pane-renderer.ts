import { DockPane } from './dock-pane';
import { Renderer } from './renderer/renderer';

/**
 * The DockPaneRenderer is used to populate the pane with content.
 * Depending on the render system, a different renderer can be injected.
 */
export interface DockPaneRenderer {
    render(renderer: Renderer, pane: DockPane): void;
}
