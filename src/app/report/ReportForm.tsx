"use client";

import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { CheckCircle, Upload, X } from "react-feather";
import d from "@/components/dashboard.module.css";
import {
  Button,
  Card,
  ChoiceChips,
  InputField,
  Notification,
  SelectField,
  SwitchField,
  TextareaField,
} from "@/components/sds";
import { problemTypes, type ProblemType } from "@/data/reports";
import s from "./report.module.css";

const OFFICIAL_RATE = 100;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const recentDates = [
  "Sat, 31 Oct 2026",
  "Fri, 30 Oct 2026",
  "Thu, 29 Oct 2026",
  "Wed, 28 Oct 2026",
  "Tue, 27 Oct 2026",
  "Mon, 26 Oct 2026",
  "Sun, 25 Oct 2026",
];

export function ReportForm({ publicReport, homeHref }: { publicReport: boolean; homeHref: string }) {
  const [problem, setProblem] = useState<ProblemType>("Charged above official fee");
  const [date, setDate] = useState("Thu, 29 Oct 2026");
  const [amount, setAmount] = useState("150");
  const [details, setDetails] = useState(
    "The collector asked for Tk 150 for October. The receipt shows Tk 100.",
  );
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string>();
  const [dragging, setDragging] = useState(false);
  const [anonymous, setAnonymous] = useState(true);
  const [amountError, setAmountError] = useState<string>();
  const [submitted, setSubmitted] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const feeProblem = problem === "Charged above official fee";

  function pickPhoto(file: File | undefined) {
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setPhotoError("Choose a JPG or PNG photo.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("The photo is larger than 5 MB.");
      return;
    }
    setPhotoError(undefined);
    setPhoto(file);
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    pickPhoto(event.dataTransfer.files[0]);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (feeProblem) {
      const charged = Number(amount);
      if (!amount || Number.isNaN(charged) || charged <= 0) {
        setAmountError("Enter the amount you were charged in taka.");
        return;
      }
    }
    setAmountError(undefined);
    setSubmitted(`SC-${1043 + Math.floor(Math.random() * 50)}`);
  }

  if (submitted) {
    return (
      <Card gap={16} padding={24} className={d.grow}>
        <Notification icon={<CheckCircle size={20} />} title={`Report ${submitted} submitted`}>
          {problem} on {date}. It has been sent to Ward 20 Van Service, who have 48 hours to respond
          before it goes to the zonal office.
          {anonymous && " Your name and flat are hidden from the provider."}
        </Notification>
        <div className={d.rowWide}>
          <Button href={homeHref}>{publicReport ? "Back to ward dashboard" : "Back to dashboard"}</Button>
          <Button variant="subtle" href={publicReport ? "/how-it-works" : "/reports"}>
            {publicReport ? "How reports are handled" : "See my reports"}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card gap={16} padding={24} className={d.grow}>
      <form onSubmit={submit} className={s.form}>
        <div className={s.fieldset}>
          <p className="t-body-strong">What happened?</p>
          <ChoiceChips options={problemTypes} value={problem} onChange={setProblem} label="What happened?" />
        </div>

        <div className={s.pair}>
          <SelectField
            id="date"
            label="When did it happen?"
            options={recentDates}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {feeProblem && (
            <InputField
              id="amount"
              label="Amount charged (Tk)"
              description={`Official rate for Ward 20: Tk ${OFFICIAL_RATE}`}
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
              error={amountError}
            />
          )}
        </div>

        <TextareaField
          id="details"
          label="Details (optional)"
          rows={2}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />

        <div className={s.photo}>
          <p className="t-body" id="photo-label">
            Photo evidence (optional)
          </p>
          {photo ? (
            <div className={s.photoChosen}>
              <span className="t-small">{photo.name}</span>
              <span className="t-caption c-secondary">{(photo.size / 1024).toFixed(0)} KB</span>
              <Button variant="subtle" size="small" iconStart={<X size={16} />} onClick={() => setPhoto(null)}>
                Remove
              </Button>
            </div>
          ) : (
            <button
              type="button"
              className={`${s.dropzone} ${dragging ? s.dropzoneActive : ""}`}
              aria-labelledby="photo-label"
              onClick={() => fileInput.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
            >
              <Upload size={32} />
              <span className="t-small c-secondary">
                Drag a photo here or browse your files (JPG or PNG, up to 5 MB)
              </span>
            </button>
          )}
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png"
            hidden
            onChange={(e) => pickPhoto(e.target.files?.[0])}
          />
          {photoError && <p className="t-small" style={{ color: "var(--sds-color-text-danger-on-danger-secondary)" }}>{photoError}</p>}
        </div>

        <SwitchField
          label="Report anonymously"
          description={
            publicReport
              ? "You are not logged in, so this report is anonymous."
              : "Your name and flat are hidden from the service provider."
          }
          checked={publicReport || anonymous}
          disabled={publicReport}
          onChange={publicReport ? undefined : setAnonymous}
        />

        <div className={d.rowWide}>
          <Button type="submit">Submit report</Button>
          <Button variant="subtle" href={homeHref}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
