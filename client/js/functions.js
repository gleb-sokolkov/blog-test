

function clampString(str, a, b) {
    if (!str) return '';
    return Math.floor(Math.max(a, Math.min(str, b))).toString();
}

function clampStringFloat(str, a, b) {
    if (!str) return '';
    return Math.max(a, Math.min(str, b)).toString();
}

export { clampString, clampStringFloat };