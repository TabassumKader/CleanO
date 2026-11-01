"use client";

import { useMemo, useState } from "react";
import { Download, Image as ImageIcon } from "react-feather";
import d from "@/components/dashboard.module.css";
import { DataTable } from "@/components/DataTable";
import { KeyValue } from "@/components/layout";
import { Timeline } from "@/components/Timeline";
import { Button, Card, Divider, Search, SelectField, Tabs, Tag, TextareaField } from "@/components/sds";
import {
  complaints as allComplaints,
  complaintStatus,
  formatAge,
  providerForWard,
  zoneWards,
  type Complaint,
  type ComplaintStatus,
  type ComplaintStep,
} from "@/data/officer";
import { problemTypes } from "@/data/reports";
import s from "../officer.module.css";

export type QueueTab = "all" | "overdue" | "awaiting" | "escalated" | "resolved";

const PAGE_SIZE = 10;

const tabStatuses: Record<QueueTab, (status: ComplaintStatus) => boolean> = {
  all: (status) => status !== "resolved",
  overdue: (status) => status === "overdue",
  awaiting: (status) => status === "new" || status === "with-provider",
  escalated: (status) => status === "escalated",
  resolved: (status) => status === "resolved",
};

const tabLabels: Record<QueueTab, string> = {
  all: "All",
  overdue: "Overdue",
  awaiting: "Awaiting provider",
  escalated: "Escalated",
  resolved: "Resolved this week",
};

type Update = Pick<Complaint, "status" | "steps">;

function nowLabel() {
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString("en-GB", { month: "short" });
  const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase();
  return `${day} ${month}, ${time}`;
}

function settle(steps: ComplaintStep[]): ComplaintStep[] {
  return steps.map((step) => (step.state === "current" ? { ...step, state: "done" } : step));
}

function downloadCsv(rows: Complaint[]) {
  const header = ["ID", "Type", "Ward", "Building", "Age", "Status", "Reported"];
  const body = rows.map((c) => [c.id, c.type, String(c.ward), c.building, formatAge(c.ageHours), complaintStatus[c.status].label, c.reported]);
  const csv = [header, ...body].map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "zone-1-complaints.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function ComplaintQueue({
  initialQuery,
  initialTab,
  initialWard,
  initialId,
}: {
  initialQuery: string;
  initialTab: QueueTab;
  initialWard?: number;
  initialId?: string;
}) {
  const [tab, setTab] = useState<QueueTab>(initialTab);
  const [query, setQuery] = useState(initialQuery);
  const [ward, setWard] = useState(initialWard ? String(initialWard) : "all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState<"oldest" | "newest">("oldest");
  const [updates, setUpdates] = useState<Record<string, Update>>({});
  const [selectedId, setSelectedId] = useState(
    allComplaints.find((c) => c.id.toLowerCase() === initialId?.toLowerCase())?.id ?? "SC-1042",
  );
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [note, setNote] = useState("");
  const [announcement, setAnnouncement] = useState("");

  const complaints = useMemo(
    () => allComplaints.map((c) => (updates[c.id] ? { ...c, ...updates[c.id] } : c)),
    [updates],
  );

  const counts = Object.fromEntries(
    (Object.keys(tabStatuses) as QueueTab[]).map((t) => [t, complaints.filter((c) => tabStatuses[t](c.status)).length]),
  ) as Record<QueueTab, number>;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return complaints
      .filter((c) => tabStatuses[tab](c.status))
      .filter((c) => ward === "all" || String(c.ward) === ward)
      .filter((c) => type === "all" || c.type === type)
      .filter(
        (c) =>
          !q ||
          c.id.toLowerCase().includes(q) ||
          c.building.toLowerCase().includes(q) ||
          `ward ${c.ward}`.includes(q.startsWith("ward") ? q : `ward ${q}`),
      )
      .sort((a, b) => (sort === "oldest" ? b.ageHours - a.ageHours : a.ageHours - b.ageHours));
  }, [complaints, tab, ward, type, query, sort]);

  const selected = complaints.find((c) => c.id === selectedId) ?? rows[0];

  function act(action: "ask" | "resolve" | "escalate") {
    if (!selected) return;
    const when = nowLabel();
    const detail = note.trim() ? `${when} · Note: ${note.trim()}` : when;
    const next: Record<typeof action, Update> = {
      ask: {
        status: "with-provider",
        steps: [...settle(selected.steps), { title: "Officer asked provider to respond by 2 Nov", detail, state: "current" }],
      },
      resolve: {
        status: "resolved",
        steps: [...settle(selected.steps), { title: "Resolved by the zonal office", detail, state: "done" }],
      },
      escalate: {
        status: "escalated",
        steps: [...settle(selected.steps), { title: "Escalated to the city administrator", detail, state: "current" }],
      },
    };
    setUpdates((current) => ({ ...current, [selected.id]: next[action] }));
    setNote("");
    setAnnouncement(`${selected.id}: ${next[action].steps.at(-1)!.title}.`);
  }

  return (
    <>
      <div className={s.header}>
        <div className={s.headerText}>
          <h1 className="t-heading">Complaints</h1>
          <p className="t-small c-secondary">
            Zone 1 · {counts.all} open · {counts.overdue} overdue · sample data
          </p>
        </div>
        <Button variant="neutral" iconStart={<Download size={16} />} onClick={() => downloadCsv(rows)}>
          Export CSV
        </Button>
      </div>

      <Tabs
        label="Complaint status"
        value={tab}
        onChange={(value) => {
          setTab(value);
          setVisible(PAGE_SIZE);
        }}
        tabs={(Object.keys(tabLabels) as QueueTab[]).map((t) => ({ value: t, label: `${tabLabels[t]} (${counts[t]})` }))}
      />

      <div className={s.filters}>
        <Search
          placeholder="Search by ID, ward or building"
          value={query}
          onValueChange={(value) => {
            setQuery(value);
            setVisible(PAGE_SIZE);
          }}
        />
        <SelectField
          id="ward-filter"
          aria-label="Ward"
          className={s.filterSelect}
          value={ward}
          onChange={(e) => {
            setWard(e.target.value);
            setVisible(PAGE_SIZE);
          }}
          options={[{ value: "all", label: "Ward: all" }, ...zoneWards.map((w) => ({ value: String(w.ward), label: `Ward: ${w.ward}` }))]}
        />
        <SelectField
          id="type-filter"
          aria-label="Type"
          className={s.filterSelectType}
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setVisible(PAGE_SIZE);
          }}
          options={[{ value: "all", label: "Type: all" }, ...problemTypes.map((t) => ({ value: t, label: t }))]}
        />
        <SelectField
          id="sort"
          aria-label="Sort"
          className={s.filterSelectWide}
          value={sort}
          onChange={(e) => setSort(e.target.value as "oldest" | "newest")}
          options={[
            { value: "oldest", label: "Sort: oldest first" },
            { value: "newest", label: "Sort: newest first" },
          ]}
        />
      </div>

      <div className={d.split}>
        <div className={d.splitMain}>
          <DataTable<Complaint>
            caption="Complaints"
            rows={rows.slice(0, visible)}
            rowKey={(c) => c.id}
            highlight={(c) => c.id === selected?.id}
            onRowClick={(c) => setSelectedId(c.id)}
            empty="No complaints match these filters."
            columns={[
              { key: "id", header: "ID", width: 86, render: (c) => c.id },
              { key: "type", header: "Type", render: (c) => c.type },
              { key: "ward", header: "Ward", width: 60, render: (c) => c.ward },
              { key: "building", header: "Building", width: 146, render: (c) => c.building },
              { key: "age", header: "Age", width: 80, render: (c) => formatAge(c.ageHours) },
              {
                key: "status",
                header: "Status",
                width: 156,
                render: (c) => <Tag scheme={complaintStatus[c.status].scheme}>{complaintStatus[c.status].label}</Tag>,
              },
            ]}
          />
          {rows.length > visible && (
            <div>
              <Button variant="subtle" size="small" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Show {Math.min(PAGE_SIZE, rows.length - visible)} more of {rows.length - visible}
              </Button>
            </div>
          )}
        </div>

        {selected && (
          <Card gap={12} className={s.detail} as="aside">
            <div className={d.row}>
              <h2 className={`t-heading ${d.grow}`}>{selected.id}</h2>
              <Tag scheme={complaintStatus[selected.status].scheme}>{complaintStatus[selected.status].label}</Tag>
            </div>
            <p className="t-body-strong">{selected.type}</p>
            <KeyValue labelWidth={120} label="Reported" value={selected.reported} />
            <KeyValue labelWidth={120} label="Reporter" value={selected.reporter} />
            <KeyValue labelWidth={120} label="Building" value={`${selected.building}, Ward ${selected.ward}`} />
            <KeyValue labelWidth={120} label="Provider" value={providerForWard(selected.ward)} />
            {selected.amount && (
              <KeyValue
                labelWidth={120}
                label="Amount"
                value={`Tk ${selected.amount.charged} (rate Tk ${selected.amount.rate})`}
              />
            )}
            <Divider />
            <p className="t-small-strong">Evidence</p>
            {selected.photo ? (
              <div className={s.evidence}>
                <ImageIcon size={32} color="var(--sds-color-icon-default-secondary)" />
                <span className="t-caption c-secondary">{selected.photo}</span>
              </div>
            ) : (
              <p className="t-small c-secondary">No photo attached.</p>
            )}
            <Divider />
            <p className="t-small-strong">Timeline</p>
            <Timeline steps={selected.steps} />
            <Divider />
            <p className="visually-hidden" aria-live="polite">
              {announcement}
            </p>
            {selected.status === "resolved" ? (
              <>
                <p className="t-small c-secondary">This complaint is resolved. No further action is needed.</p>
                <Button variant="neutral" block onClick={() => act("escalate")}>
                  Reopen and escalate
                </Button>
              </>
            ) : (
              <>
                <TextareaField
                  id="internal-note"
                  label="Internal note"
                  placeholder="Add a note for the record"
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <Button block onClick={() => act("ask")}>
                  Ask provider to respond by 2 Nov
                </Button>
                <div className={s.pair}>
                  <Button variant="neutral" onClick={() => act("resolve")}>
                    Mark as resolved
                  </Button>
                  <Button variant="neutral" onClick={() => act("escalate")}>
                    Escalate
                  </Button>
                </div>
              </>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
