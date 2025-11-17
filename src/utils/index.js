export const formatFCFA = (value) => {
    const num = Number(value);
    if (isNaN(num)) return value || 'N/A';


    if (num >= 1000000)
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M FCFA';


    if (num >= 1000)
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k FCFA';


    return num.toLocaleString() + ' FCFA';
};