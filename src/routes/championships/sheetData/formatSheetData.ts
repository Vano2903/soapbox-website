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

	const rows = json.sheets[0].data[0].rowData ?? [];
	const html: string[] = ['<table class="table-auto border-collapse border border-gray-500 w-full">'];

	const prevCellStyles = [];

	for (let r = 0; r < rows.length; r++) {
		const row = rows[r]?.values ?? [];
		html.push('<tr>');

		for (let c = 0; c < row.length; c++) {
			const cell = row[c];

			// Check for merged cell
			if (merges.has(`${r},${c}`)) continue;

			const value = cell?.formattedValue ?? (cell?.userEnteredValue ? "" : null);
			const content = value === null ? "" : escapeHtml(value);

			const styleParts: string[] = [];

			const format = cell?.effectiveFormat ?? {};
			const padding = format.padding ?? {};
			const borders = format.borders ?? {};
			const textFormat = format.textFormat ?? {};

			const isFirstCell = c === 0;
			const inherit = isFirstCell ? {} : (prevCellStyles[c - 1] ?? {});

			// Background
			styleParts.push(`background-color: ${rgbToCss(format.backgroundColor)};`);
			// Padding
			styleParts.push(`padding-top: ${padding.top ?? 1}px;`);
			styleParts.push(`padding-right: ${padding.right ?? 1}px;`);
			styleParts.push(`padding-bottom: ${padding.bottom ?? 1}px;`);
			styleParts.push(`padding-left: ${padding.left ?? 1}px;`);
			// Borders
			styleParts.push(`border-top: ${borderToCss(borders.top)};`);
			styleParts.push(`border-right: ${borderToCss(borders.right)};`);
			styleParts.push(`border-bottom: ${borderToCss(borders.bottom)};`);
			styleParts.push(`border-left: ${borderToCss(borders.left)};`);
			// Alignment
			styleParts.push(`text-align: ${cell?.horizontalAlignment ?? 'left'};`);
			styleParts.push(`vertical-align: ${cell?.verticalAlignment ?? 'top'};`);
			// Font
			styleParts.push(`color: ${rgbToCss(textFormat.foregroundColor ?? inherit.color)};`);
			styleParts.push(`font-family: ${textFormat.fontFamily ?? inherit.fontFamily ?? 'inherit'};`);
			styleParts.push(`font-size: ${textFormat.fontSize ?? inherit.fontSize ?? 12}px;`);
			if (textFormat.bold ?? inherit.bold) styleParts.push('font-weight: bold;');
			if (textFormat.italic ?? inherit.italic) styleParts.push('font-style: italic;');
			if (textFormat.strikethrough ?? inherit.strikethrough) styleParts.push('text-decoration: line-through;');
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
			let rowspan = 1, colspan = 1;
			for (const m of json.sheets[0].merges ?? []) {
				if (m.startRowIndex === r && m.startColumnIndex === c) {
					rowspan = (m.endRowIndex ?? r + 1) - r;
					colspan = (m.endColumnIndex ?? c + 1) - c;
					break;
				}
			}

			const span = `${rowspan > 1 ? ` rowspan="${rowspan}"` : ''}${colspan > 1 ? ` colspan="${colspan}"` : ''}`;
			html.push(`<td${span} style="${styleParts.join('')}">${content}</td>`);
		}

		html.push('</tr>');
	}

	html.push('</table>');
	return html.join('\n');
}

// Utility functions
function rgbToCss(color?: { red?: number; green?: number; blue?: number }): string {
	if (!color) return "inherit";
	const r = Math.round((color.red ?? 0) * 255);
	const g = Math.round((color.green ?? 0) * 255);
	const b = Math.round((color.blue ?? 0) * 255);
	return `rgb(${r}, ${g}, ${b})`;
}

function borderToCss(border: any): string {
	if (!border) return "none";
	const style = border.style?.toLowerCase() ?? "solid";
	const width = border.width ? `${border.width}px` : "1px";
	const color = rgbToCss(border.color);
	return `${width} ${style} ${color}`;
}

function escapeHtml(text: string): string {
	return text.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}