import type { ReactNode } from "react";
import s from "./DataTable.module.css";

/** Room kept for each column without a fixed width before the table scrolls sideways. */
const FLEX_COLUMN_MIN = 140;

export type Column<T> = {
  key: string;
  header: string;
  /** Fixed width in px; omit to let the column take the remaining space. */
  width?: number;
  align?: "left" | "right";
  render: (row: T) => ReactNode;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  caption,
  highlight,
  empty = "Nothing to show.",
  lang,
  onRowClick,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  caption?: string;
  highlight?: (row: T) => boolean;
  empty?: ReactNode;
  /** "bn" switches header and cell text to the Bangla text styles. */
  lang?: "bn";
  /** Makes rows selectable with mouse or keyboard (use in client components). */
  onRowClick?: (row: T) => void;
}) {
  const headClass = lang === "bn" ? "t-bangla-strong c-secondary" : "t-caption-strong c-secondary";
  const cellClass = lang === "bn" ? "t-bangla-small" : "t-small";
  const minWidth = columns.reduce((sum, column) => sum + (column.width ?? FLEX_COLUMN_MIN), 0);
  return (
    <div className={s.wrap} lang={lang}>
      <table className={s.table} style={{ minWidth }}>
        {caption && <caption className="visually-hidden">{caption}</caption>}
        <colgroup>
          {columns.map((column) => (
            <col key={column.key} style={column.width ? { width: column.width } : undefined} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={headClass}
                style={{ textAlign: column.align ?? "left" }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className={`${cellClass} c-secondary`}>
                {empty}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className={[highlight?.(row) && s.highlight, onRowClick && s.clickable].filter(Boolean).join(" ") || undefined}
              aria-selected={onRowClick ? Boolean(highlight?.(row)) : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              onKeyDown={
                onRowClick
                  ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onRowClick(row);
                      }
                    }
                  : undefined
              }
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cellClass}
                  style={{ textAlign: column.align ?? "left" }}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
