"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle } from "react-feather";
import d from "@/components/dashboard.module.css";
import { Button, Card, InputField, Notification, SelectField, SwitchField } from "@/components/sds";

export type SettingsToggle = { id: string; label: string; description: string; on: boolean };

/** Account settings shared by the officer and provider dashboards (kept in page state in this MVP). */
export function SettingsForm({
  profile,
  toggles,
}: {
  profile: { name: string; organisation: string; mobile: string };
  toggles: SettingsToggle[];
}) {
  const [name, setName] = useState(profile.name);
  const [mobile, setMobile] = useState(profile.mobile);
  const [language, setLanguage] = useState("en");
  const [state, setState] = useState(() => Object.fromEntries(toggles.map((t) => [t.id, t.on])));
  const [saved, setSaved] = useState(false);

  function save(event: FormEvent) {
    event.preventDefault();
    setSaved(true);
  }

  const changed = () => setSaved(false);

  return (
    <form onSubmit={save} className={d.stack} style={{ gap: 16, maxWidth: 720 }}>
      <Card gap={16} padding={24}>
        <h2 className="t-body-strong">Profile</h2>
        <InputField
          id="settings-name"
          label="Name shown to others"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            changed();
          }}
        />
        <InputField id="settings-org" label="Organisation" value={profile.organisation} readOnly />
        <InputField
          id="settings-mobile"
          label="Mobile number for SMS alerts"
          type="tel"
          value={mobile}
          onChange={(e) => {
            setMobile(e.target.value);
            changed();
          }}
        />
        <SelectField
          id="settings-language"
          label="Language"
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            changed();
          }}
          options={[
            { value: "en", label: "English" },
            { value: "bn", label: "বাংলা (coming soon)" },
          ]}
        />
      </Card>
      <Card gap={16} padding={24}>
        <h2 className="t-body-strong">Notifications</h2>
        {toggles.map((toggle) => (
          <SwitchField
            key={toggle.id}
            label={toggle.label}
            description={toggle.description}
            checked={state[toggle.id]}
            onChange={(on) => {
              setState((current) => ({ ...current, [toggle.id]: on }));
              changed();
            }}
          />
        ))}
      </Card>
      <div className={d.rowWide}>
        <Button type="submit">Save settings</Button>
      </div>
      {saved && (
        <Notification icon={<CheckCircle size={20} />} title="Settings saved">
          Alerts go to {mobile}.
        </Notification>
      )}
    </form>
  );
}
