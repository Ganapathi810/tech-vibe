export const formatCount = (number) => {
    if (number >= 1_000_000) {
        const result = (number / 1_000_000).toFixed(1);
        return result.endsWith('.0') ? result.slice(0, -2) + 'M' : result + 'M';
    } else if (number >= 1_000) {
        const result = (number / 1_000).toFixed(1);
        return result.endsWith('.0') ? result.slice(0, -2) + 'K' : result + 'K';
    } else {
        return number == 0 ? "" : number;
    }
}