export const currentDateCZE = (type: 'datetime' | 'unix_timestamp' | 'locate_cz' = 'unix_timestamp') => {
    let d = Date.now();

    if (type == 'datetime') {
        return new Date(d);
    }

    if (type == 'locate_cz') {
        let locateD = new Date(d)
        return locateD.toLocaleString("cz-CS")
    }

    return Math.floor(d / 1000);
}

export default currentDateCZE;