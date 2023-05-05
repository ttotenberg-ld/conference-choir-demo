function getTable() {
    let params = new URLSearchParams(document.location.search);
    let table = Number(params.get('table'));
    if (table) {
        return table;
    } else {
        return 40;
    }
}

export default getTable;