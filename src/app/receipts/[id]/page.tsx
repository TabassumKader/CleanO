import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Flag } from "react-feather";
import d from "@/components/dashboard.module.css";
import { DataTable } from "@/components/DataTable";
import { KeyValue, LogoMark, PageHeader, PageMain } from "@/components/layout";
import { Button, Card, Divider, Tag } from "@/components/sds";
import { SessionHeader } from "@/components/SessionHeader";
import { findReceipt, receipts, type Receipt } from "@/data/receipts";
import { ReceiptActions } from "./ReceiptActions";
import s from "./receipt.module.css";

export function generateStaticParams() {
  return receipts.map((receipt) => ({ id: receipt.id }));
}

export async function generateMetadata({ params }: PageProps<"/receipts/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: `E-receipt ${id}` };
}

function withinRate(receipt: Receipt) {
  return receipt.amount <= receipt.officialRate;
}

/** S7 · Digital fee receipt. */
export default function ReceiptPage({ params }: PageProps<"/receipts/[id]">) {
  return (
    <>
      <SessionHeader active="Receipts" />
      <PageMain>
        <Suspense fallback={<p className="t-small c-secondary">Loading receipt…</p>}>
          <ReceiptDetails params={params} />
        </Suspense>
      </PageMain>
    </>
  );
}

/** Reads the URL id inside Suspense so the header and layout can render before it resolves. */
async function ReceiptDetails({ params }: Pick<PageProps<"/receipts/[id]">, "params">) {
  const { id } = await params;
  const receipt = findReceipt(id);
  if (!receipt) notFound();

  return (
    <>
      <PageHeader
        title={`E-receipt ${receipt.id}`}
        subtitle={`${receipt.month} waste collection fee`}
        actions={<ReceiptActions receiptId={receipt.id} />}
      />
      <div className={d.split}>
        <Card gap={12} padding={24} className={s.receipt} as="article">
          <div className={d.row}>
            <span className={s.logo}>
              <LogoMark />
              <span className={d.stack}>
                <span className="t-body-strong">CLEAN - O</span>
                <span className="t-bangla-small c-secondary" lang="bn">
                  ক্লিন - ও
                </span>
              </span>
            </span>
            <span className={d.grow} />
            <span className="t-caption c-secondary">{receipt.id}</span>
          </div>
          <Divider />
          <div className={s.amount}>
            <p className="t-small c-secondary">Amount paid</p>
            <p className="t-number">Tk {receipt.amount}</p>
            {withinRate(receipt) ? (
              <Tag scheme="positive">Within official rate (Tk {receipt.officialRate})</Tag>
            ) : (
              <Tag scheme="warning">Above official rate (Tk {receipt.officialRate})</Tag>
            )}
          </div>
          <Divider />
          <KeyValue labelWidth={160} label="Month" value={receipt.month} />
          <KeyValue labelWidth={160} label="Flat" value={receipt.flat} />
          <KeyValue labelWidth={160} label="Ward" value={receipt.ward} />
          <KeyValue labelWidth={160} label="Provider" value={receipt.provider} />
          <KeyValue labelWidth={160} label="Collected by" value={receipt.collectedBy} />
          <KeyValue labelWidth={160} label="Paid on" value={receipt.paidOn} />
          <KeyValue labelWidth={160} label="Method" value={receipt.method} />
          <Divider />
          <div className={s.verify}>
            <Image src="/figma/verification-qr.svg" alt={`Verification code for ${receipt.id}`} width={88} height={88} unoptimized />
            <div className={s.verifyText}>
              <p className="t-small-strong">Scan to verify</p>
              <p className="t-caption c-secondary">
                Anyone can check that this receipt is genuine by scanning the code or entering the
                receipt number on the verification page.
              </p>
            </div>
          </div>
        </Card>

        <section className={`${d.splitMain} print-hide`}>
          <h2 className="t-body-strong">My receipts</h2>
          <DataTable<Receipt>
            caption="My receipts"
            rows={receipts}
            rowKey={(row) => row.id}
            highlight={(row) => row.id === receipt.id}
            columns={[
              {
                key: "month",
                header: "Month",
                render: (row) =>
                  row.id === receipt.id ? (
                    <span aria-current="page">{row.month}</span>
                  ) : (
                    <Link href={`/receipts/${row.id}`}>{row.month}</Link>
                  ),
              },
              { key: "amount", header: "Amount", width: 116, render: (row) => `Tk ${row.amount}` },
              {
                key: "rate",
                header: "Compared with rate",
                width: 186,
                render: (row) =>
                  withinRate(row) ? (
                    <Tag scheme="positive">Within rate</Tag>
                  ) : (
                    <Tag scheme="warning">Above rate</Tag>
                  ),
              },
            ]}
          />
          <div>
            <Button variant="neutral" href="/report" iconStart={<Flag size={16} />}>
              Report a problem with a receipt
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
