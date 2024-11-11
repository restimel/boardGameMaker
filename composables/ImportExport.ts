
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

function parseCSVrow(row: string): Array<string | number> {
    const values = row.split(/("(?:\\.|[^\\"]+)*?"|[^";,]*?)[;,]/g);

    return values.map((value) => {
        if (!value) {
            return '';
        }

        if (!value.startsWith('"') && !/^[-+\d.]+/.test(value)) {
            return value;
        }

        return JSON.parse(value);
    });
}

export function importFromCSV(text: string): object[] | string {
    try {
        const rows = text.split('\n');
        const header = parseCSVrow(rows[0]) as string[];

        const values = rows.slice(1).map((row) => {
            const rowValue = parseCSVrow(row);

            if (rowValue.length !== header.length) {
                throw new Error('All rows have not the same length');
            }

            const value = rowValue.reduce((memo, val, index) => {
                const key = header[index];

                (memo as any)[key] = val;

                return memo;
            }, {});

            return value;
        });

        return values;
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
