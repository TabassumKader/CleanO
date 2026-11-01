"use client";

import { useState } from "react";
import { Download, Share2 } from "react-feather";
import { Button } from "@/components/sds";

export function ReceiptActions({ receiptId }: { receiptId: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `CLEAN - O e-receipt ${receiptId}`, url });
        return;
      } catch {
        // User closed the share sheet; fall back to copying.
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="print-hide" style={{ display: "flex", gap: 16 }}>
      <Button variant="neutral" iconStart={<Share2 size={16} />} onClick={share}>
        {copied ? "Link copied" : "Share"}
      </Button>
      <Button iconStart={<Download size={16} />} onClick={() => window.print()}>
        Download PDF
      </Button>
    </div>
  );
}
