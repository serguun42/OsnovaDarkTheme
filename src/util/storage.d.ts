/**
 * @param {string} iName
 * @param {string} iValue
 * @param {{infinite?: true, erase?: true, Path?: string, Domain?: string}} [iOptions]
 * @returns {void}
 */
export function SetRecord(iName: string, iValue: string, iOptions?: {
    infinite?: true;
    erase?: true;
    Path?: string;
    Domain?: string;
}): void;
/**
 * @param {string} iName
 * @returns {string | undefined}
 */
export function GetRecord(iName: string): string | undefined;
