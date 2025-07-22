// Response without includeGridData=true
export function formatSheetData(values: string[][]): string {
	let html = '<table class="table-auto border-collapse border border-gray-500 w-full">';

	for (let i = 0; i < values.length; i++) {
		const row = values[i];
		const isHeader = i === 0;

		html += '<tr>';
		for (const cell of row) {
			html += `<${isHeader ? 'th' : 'td'} class="border border-gray-400 px-2 py-1 text-left">${cell}</${isHeader ? 'th' : 'td'}>`;
		}
		html += '</tr>';
	}

	html += '</table>';
	return html;
}

// Response with includeGridData=true
export function formatSheetDataFromFullJson(json: any): string {
	const merges = new Set<string>();
	for (const m of json.sheets[0].merges ?? []) {
		for (let r = m.startRowIndex; r < m.endRowIndex; r++) {
			for (let c = m.startColumnIndex; c < m.endColumnIndex; c++) {
				if (r !== m.startRowIndex || c !== m.startColumnIndex) {
					merges.add(`${r},${c}`);
				}
			}
		}
	}

	// console.log(merges)

	const dataStartRow = json.sheets[0].data[0].startRow;
	const dataStartColumn = json.sheets[0].data[0].startColumn;
	const rows = json.sheets[0].data[0].rowData ?? [];
	const html: string[] = ['<table class="table-auto border-collapse w-full">'];

	const prevCellStyles = [];

	for (let r = 0; r < rows.length; r++) {
		const row = rows[r]?.values ?? [];
		const htmlRow: string[] = ['<tr>'];
		let skipRow = false;

		for (let c = 0; c < row.length; c++) {
			const cell = row[c];

			// Check for merged cell
			// if (merges.has(`${r},${c}`)) continue;

			if (merges.has(`${r + (dataStartRow ?? 0)},${c + (dataStartColumn ?? 0)}`)) continue;

			// this do not skip empty row
			// const value = cell?.formattedValue ?? (cell?.userEnteredValue ? "" : null);
			// const content = value === null ? "" : escapeHtml(value);

			// if content == null -> Skip the row (empty row)
			const value = cell?.formattedValue ?? (cell?.userEnteredValue ? null : '');
			const content = value === null ? null : escapeHtml(value);
			if (content === null) {
				skipRow = true;
				continue;
			}

			const styleParts: string[] = [];

			const format = cell?.effectiveFormat ?? {};
			const padding = format.padding ?? {};
			const borders = format.borders ?? {};
			const textFormat = format.textFormat ?? {};

			const isFirstCell = c === 0;
			const inherit = isFirstCell ? {} : (prevCellStyles[c - 1] ?? {});

			// Background [OK]
			styleParts.push(`background-color: ${rgbToCss(format.backgroundColor)};`);
			// Padding [OK]
			styleParts.push(`padding-top: ${padding.top ?? 2}px;`);
			styleParts.push(`padding-right: ${padding.right ?? 3}px;`);
			styleParts.push(`padding-bottom: ${padding.bottom ?? 2}px;`);
			styleParts.push(`padding-left: ${padding.left ?? 3}px;`);
			// Borders [OK]
			styleParts.push(`border-top: ${borderToCss(borders.top)};`);
			styleParts.push(`border-right: ${borderToCss(borders.right)};`);
			styleParts.push(`border-bottom: ${borderToCss(borders.bottom)};`);
			styleParts.push(`border-left: ${borderToCss(borders.left)};`);
			// Alignment [OK]
			styleParts.push(`text-align: ${format?.horizontalAlignment?.toLowerCase() ?? 'left'};`);
			styleParts.push(`vertical-align: ${format?.verticalAlignment?.toLowerCase() ?? 'top'};`);
			// Font
			styleParts.push(`color: ${rgbToCss(textFormat.foregroundColor ?? inherit.color)};`);
			styleParts.push(`font-family: ${textFormat.fontFamily ?? inherit.fontFamily ?? 'inherit'};`);
			styleParts.push(
				`font-size: ${Math.round((textFormat.fontSize ?? inherit.fontSize ?? 8) * 1.2)}px;`
			);
			if (textFormat.bold ?? inherit.bold) styleParts.push('font-weight: bold;');
			if (textFormat.italic ?? inherit.italic) styleParts.push('font-style: italic;');
			if (textFormat.strikethrough ?? inherit.strikethrough)
				styleParts.push('text-decoration: line-through;');
			if (textFormat.underline ?? inherit.underline) styleParts.push('text-decoration: underline;');

			// Save for inheritance
			prevCellStyles[c] = {
				color: textFormat.foregroundColor,
				fontFamily: textFormat.fontFamily,
				fontSize: textFormat.fontSize,
				bold: textFormat.bold,
				italic: textFormat.italic,
				strikethrough: textFormat.strikethrough,
				underline: textFormat.underline
			};

			// Colspan/Rowspan for merged
			let rowspan = 1,
				colspan = 1;
			for (const m of json.sheets[0].merges ?? []) {
				if (m.startRowIndex === r + dataStartRow && m.startColumnIndex === c + dataStartColumn) {
					rowspan = (m.endRowIndex ?? r + 1) - dataStartRow - r;
					colspan = (m.endColumnIndex ?? c + 1) - dataStartColumn - c;
					break;
				}
			}

			const span = `${rowspan > 1 ? ` rowspan="${rowspan}"` : ''}${colspan > 1 ? ` colspan="${colspan}"` : ''}`;
			htmlRow.push(`<td${span} style="${styleParts.join('')}">${content}</td>`);
			//htmlRow.push(`<td${span} style="${styleParts.join('')}"><div${r >= 3 ? " style=\"max-height:30px\"" : ""}>${content}</div></td>`);
			//htmlRow.push(`<td${span} style="${styleParts.join('')}"><div style=${r >= 3 ? "max-height:30px;min-width:max-content;overflow:hidden;" : ""}>${content}</div></td>`);
		}

		htmlRow.push('</tr>');
		if (!skipRow) {
			html.push(htmlRow.join('\n'));
		}
	}

	html.push('</table>');
	return html.join('\n');
}

// Utility functions
function rgbToCss(color?: { red?: number; green?: number; blue?: number }): string {
	if (!color) return 'inherit';
	const r = Math.round((color.red ?? 0) * 255);
	const g = Math.round((color.green ?? 0) * 255);
	const b = Math.round((color.blue ?? 0) * 255);
	return `rgb(${r}, ${g}, ${b})`;
}

function borderToCss(border: any): string {
	if (!border) return 'none';
	const style =
		(border.style?.includes('SOLID') ? 'solid' : border.style?.toLowerCase()) ?? 'solid';
	const width = border.width ? `${border.width}px` : '1px';
	const color = rgbToCss(border.color);
	return `${width} ${style} ${color}`;
}

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}
