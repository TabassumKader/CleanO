"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Button, Card, Divider, InputField, SelectField } from "@/components/sds";
import type { Role } from "@/data/types";
import { isRole, roleHome, roles, setRoleCookie } from "@/lib/session";
import s from "./login.module.css";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 45;

function normaliseMobile(value: string) {
  return value.replace(/[\s-]/g, "");
}

function maskMobile(mobile: string) {
  return `${mobile.slice(0, 5).replace(/\d{3}$/, "XXX")}-XXX${mobile.slice(-3)}`;
}

/** Preselects the role from `?role=` (the landing page's "Continue as …" links). */
export function LoginFormFromUrl() {
  const requested = useSearchParams().get("role") ?? undefined;
  return <LoginForm initialRole={isRole(requested) ? requested : undefined} />;
}

export function LoginForm({ initialRole }: { initialRole?: Role }) {
  const router = useRouter();
  const [role, setRole] = useState<Role>(initialRole ?? roles[0].value);
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState<string>();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [seconds, setSeconds] = useState(0);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  function sendCode(event: FormEvent) {
    event.preventDefault();
    const number = normaliseMobile(mobile);
    if (!/^01[3-9]\d{8}$/.test(number)) {
      setMobileError("Enter an 11-digit mobile number starting with 01.");
      return;
    }
    setMobileError(undefined);
    setSentTo(number);
    setDigits(Array(CODE_LENGTH).fill(""));
    setSeconds(RESEND_SECONDS);
    setTimeout(() => inputs.current[0]?.focus(), 0);
  }

  function setDigit(index: number, value: string) {
    const chars = value.replace(/\D/g, "").split("");
    if (chars.length === 0) {
      setDigits((current) => current.map((d, i) => (i === index ? "" : d)));
      return;
    }
    setDigits((current) => {
      const next = [...current];
      chars.slice(0, CODE_LENGTH - index).forEach((char, offset) => {
        next[index + offset] = char;
      });
      return next;
    });
    inputs.current[Math.min(index + chars.length, CODE_LENGTH - 1)]?.focus();
  }

  function onDigitKey(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  function verify(event: FormEvent) {
    event.preventDefault();
    setRoleCookie(role);
    router.push(roleHome(role));
    router.refresh();
  }

  const complete = digits.every(Boolean);

  return (
    <Card gap={16} padding={32} className={s.card}>
      <h1 className="t-heading">Log in</h1>
      <form onSubmit={sendCode} style={{ display: "contents" }}>
        <SelectField
          id="role"
          label="I am a"
          options={roles}
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
        />
        <InputField
          id="mobile"
          label="Mobile number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="01XXX-XXXXXX"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          error={mobileError}
        />
        <Button type="submit" block disabled={seconds > 0}>
          Send code
        </Button>
      </form>

      {sentTo && (
        <form onSubmit={verify} style={{ display: "contents" }}>
          <Divider />
          <p className="t-small c-secondary" id="code-hint">
            Enter the 6-digit code sent to {maskMobile(sentTo)}
          </p>
          <div className={s.codeRow} role="group" aria-labelledby="code-hint">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputs.current[index] = el;
                }}
                className={`${s.digit} ${digit ? s.digitFilled : ""}`}
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                aria-label={`Digit ${index + 1}`}
                maxLength={CODE_LENGTH}
                value={digit}
                onChange={(e) => setDigit(index, e.target.value)}
                onKeyDown={(e) => onDigitKey(index, e)}
              />
            ))}
          </div>
          <Button type="submit" block disabled={!complete}>
            Verify and continue
          </Button>
          <Button
            variant="subtle"
            size="small"
            className={s.resend}
            disabled={seconds > 0}
            onClick={() => setSeconds(RESEND_SECONDS)}
          >
            {seconds > 0
              ? `Resend code in ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
              : "Resend code"}
          </Button>
          <p className="t-caption c-secondary">Demo: any 6 digits will log you in.</p>
        </form>
      )}

      <Divider />
      <p className="t-small c-secondary">No account? You can still report a problem anonymously.</p>
      <Button variant="neutral" block href="/report?anonymous=1">
        Report without logging in
      </Button>
    </Card>
  );
}
