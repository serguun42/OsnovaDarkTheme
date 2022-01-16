export namespace FullpageEditor {
    const lastStatus: boolean;
    const interruptingChecker: boolean;
    function disabled(): void;
    function enable(): void;
}
/**
 * @param {boolean} iFullpageEditorStatus
 * @returns {void}
 */
export function SetFullpageEditor(iFullpageEditorStatus: boolean): void;
