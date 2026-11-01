"use client";

import { Download, Printer } from "react-feather";
import { Button } from "@/components/sds";

/** Print and "Download PDF" both open the browser's print dialog (choose "Save as PDF"). */
export function PrintActions() {
  return (
    <div className="print-hide" style={{ display: "flex", gap: 16 }}>
      <Button variant="neutral" iconStart={<Printer size={16} />} onClick={() => window.print()}>
        Print
      </Button>
      <Button iconStart={<Download size={16} />} onClick={() => window.print()}>
        Download PDF
      </Button>
    </div>
  );
}
