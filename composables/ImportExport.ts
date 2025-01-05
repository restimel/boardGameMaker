
const CSVSeparator = ';';

function download(content: string, dataType: string, filename: string) {
    /* Create a download link */
    const downloadLink = document.createElement('a');

    downloadLink.setAttribute('href', `data:${dataType};charset=utf-8,${encodeURIComponent(content)}`);
    downloadLink.setAttribute('download', filename);
    downloadLink.setAttribute('target', '_blank');

    /* add the link to the DOM and auto-click on it */
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

export function exportToCSV(data: object[], filename = 'boardGameMaker.csv') {
    const csvData = convertToCSV(data);
    const name = filename.endsWith('.csv') ? filename : `${filename}.csv`;

    download(csvData, 'text/csv', name);
}

export function exportToJSON(data: object, filename = 'boardGameMaker.json'): string {
    try {
        const jsonData = convertToJSON(data);
        const name = filename.endsWith('.json') ? filename : `${filename}.json`;

        download(jsonData, 'text/json', name);
    } catch (err) {
        return (err as Error).message;
    }

    return '';
}

export function importFromCSV(text: string): object[] | string {
    try {
        const rows = text.split('\n');
        const header = parseCSVrow(rows[0]) as string[];

        const values = rows.slice(1).map((row) => {
            const rowValue = parseCSVrow(row);

            if (rowValue.length !== header.length) {
                if (rowValue.length === 0
                    || (rowValue.length === 1 && !rowValue[0])
                ) {
                    return undefined;
                }

                throw new Error('All rows have not the same length');
            }

            const value = rowValue.reduce((memo, val, index) => {
                const key = header[index];

                (memo as any)[key] = val;

                return memo;
            }, {});

            return value;
        }).filter((row) => row !== undefined) as object[];

        return values;
    } catch (err) {
        return (err as Error).message;
    }
}

export function importFromJSON(text: string): object | string {
    try {
        const value = JSON.parse(text);

        return value;
    } catch (err) {
        return (err as Error).message;
    }
}

function convertToCSV(data: object[]): string {
    /* Extract all keys from objects */
    const keys = Array.from(new Set(data.flatMap(Object.keys)));

    const headers = keys.map((key) => `"${key.replaceAll('"', '\\"')}"`).join(CSVSeparator);

    const rows = data.map(
        (row) => keys.map(
            (key) => JSON.stringify((row as any)[key] ?? '')
        ).join(CSVSeparator)
    );

    const csvRows = [
        headers,
        ...rows,
    ];

    return csvRows.join('\n');
}

function convertToJSON(data: object): string {
    return JSON.stringify(data, undefined, '  ');
}

function modifyStr(str: string, index: number, value: string): string {
    return str.slice(0, index) + value + str.slice(index + 1);
}

function parseCSVrow(row: string, splitChar = ';'): Array<string | number> {
    let index = -1;
    let modifiedRow = row;
    let strLength = modifiedRow.length;
    let isInQuote = false;
    const STRING_QUOTE = '"';
    const SPLIT_CHAR = splitChar || ';';
    const SPLIT_NEWCHAR = '\0';

    while(++index < strLength) {
        const char = modifiedRow[index];

        switch (char) {
            case STRING_QUOTE:
                /* Remove this character */
                modifiedRow = modifyStr(modifiedRow, index, '');
                if (isInQuote) {
                    /* Check next character, if it is a " it means it should display it,
                     * so we skip it. */
                    if (modifiedRow[index] !== STRING_QUOTE) {
                        index--;
                        strLength--;
                        isInQuote = false;
                    }
                } else {
                    index--;
                    strLength--;
                    isInQuote = true;
                }
                break;
            case SPLIT_CHAR:
                if (!isInQuote) {
                    modifiedRow = modifyStr(modifiedRow, index, SPLIT_NEWCHAR);
                }
                break;
            case SPLIT_NEWCHAR:
                console.warn('The character "%s" is inside the file, it will create some issues.', SPLIT_NEWCHAR);
                break;
        }
    }

    const values = modifiedRow.split(SPLIT_NEWCHAR);

    return values.map((value) => {
        if (!value) {
            return '';
        }

        if (/^[-+\d.]+$/.test(value)) {
            return parseFloat(value);
        }

        return value;
    });
}
