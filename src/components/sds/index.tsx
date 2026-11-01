/*
 * Lightweight React versions of the Simple Design System (SDS) components the
 * CLEAN - O Figma file uses through Code Connect. Styling comes from the SDS
 * tokens declared in globals.css.
 */
import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  CSSProperties,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { ChevronDown, Search as SearchIcon } from "react-feather";
import s from "./sds.module.css";

function cx(...names: (string | false | null | undefined)[]) {
  return names.filter(Boolean).join(" ");
}

/* Button */

type ButtonVariant = "primary" | "neutral" | "subtle" | "danger";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: "medium" | "small";
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  block?: boolean;
  href?: string;
  /** Render `href` as a plain link (full page load, never prefetched), e.g. for /logout. */
  plainLink?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function Button({
  variant = "primary",
  size = "medium",
  iconStart,
  iconEnd,
  block,
  href,
  plainLink,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = cx(
    s.button,
    s[variant],
    size === "small" && s.buttonSmall,
    block && s.buttonBlock,
    className,
  );
  const content = (
    <>
      {iconStart}
      {children}
      {iconEnd}
    </>
  );
  if (href && plainLink) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
}

/* Icon button */

type IconButtonProps = {
  label: string;
  variant?: "neutral" | "subtle";
  size?: "medium" | "small";
  href?: string;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export function IconButton({
  label,
  variant = "subtle",
  size = "medium",
  href,
  children,
  className,
  ...rest
}: IconButtonProps) {
  const classes = cx(
    s.iconButton,
    variant === "neutral" && s.iconButtonNeutral,
    size === "small" && s.iconButtonSmall,
    className,
  );
  if (href) {
    return (
      <Link href={href} className={classes} aria-label={label} title={label}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} aria-label={label} title={label} {...rest}>
      {children}
    </button>
  );
}

/* Tag */

export type TagScheme = "positive" | "warning" | "danger" | "neutral" | "brand";

const tagSchemeClass: Record<TagScheme, string> = {
  positive: s.tagPositive,
  warning: s.tagWarning,
  danger: s.tagDanger,
  neutral: s.tagNeutral,
  brand: s.tagBrand,
};

export function Tag({
  scheme = "neutral",
  className,
  children,
}: {
  scheme?: TagScheme;
  className?: string;
  children: ReactNode;
}) {
  return <span className={cx(s.tag, tagSchemeClass[scheme], className)}>{children}</span>;
}

/** Single-choice chips drawn as Tags: neutral when off, brand when selected. */
export function ChoiceChips<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={option === value}
          className={cx(s.tag, s.chip, option === value ? s.tagBrand : s.tagNeutral)}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function ProgressBar({
  value,
  label,
  tone = "positive",
}: {
  value: number;
  label: string;
  tone?: "positive" | "warning" | "danger" | "brand";
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={s.progress}
      role="progressbar"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cx(s.progressValue, tone === "warning" && s.progressWarning, tone === "danger" && s.progressDanger, tone === "brand" && s.progressBrand)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

/* Navigation pill */

export function NavigationPill({
  href,
  active,
  lang,
  children,
}: {
  href: string;
  active?: boolean;
  lang?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      lang={lang}
      className={cx(s.pill, active && s.pillActive)}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}

export function PillButton({
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { lang?: string }) {
  return (
    <button type="button" className={cx(s.pill, className)} {...rest}>
      {children}
    </button>
  );
}

/* Avatar */

export function Avatar({ initials, name }: { initials: string; name?: string }) {
  return (
    <span className={s.avatar} title={name} aria-label={name}>
      {initials}
    </span>
  );
}

/** Avatar that opens an account menu. */
export function AvatarButton({
  initials,
  label,
  ...rest
}: { initials: string; label: string } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  return (
    <button type="button" className={cx(s.avatar, s.avatarButton)} aria-label={label} title={label} {...rest}>
      {initials}
    </button>
  );
}

/* Search */

/**
 * Search field. By default it is a GET form (submits `name` to `action`);
 * pass `value` + `onValueChange` to filter in place instead.
 */
export function Search({
  name = "q",
  placeholder,
  defaultValue,
  value,
  onValueChange,
  action,
  className,
}: {
  name?: string;
  placeholder: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  action?: string;
  className?: string;
}) {
  return (
    <form
      role="search"
      action={action}
      className={cx(s.search, className)}
      onSubmit={onValueChange ? (e) => e.preventDefault() : undefined}
    >
      <input
        className={s.searchInput}
        type="search"
        name={name}
        placeholder={placeholder}
        defaultValue={onValueChange ? undefined : defaultValue}
        value={onValueChange ? value : undefined}
        onChange={onValueChange ? (e) => onValueChange(e.target.value) : undefined}
        aria-label={placeholder}
      />
      <button type="submit" className={s.searchButton} aria-label="Search">
        <SearchIcon size={16} />
      </button>
    </form>
  );
}

/* Form fields */

type FieldChrome = {
  label?: string;
  description?: string;
  error?: string;
  lang?: string;
  className?: string;
};

function FieldShell({
  id,
  label,
  description,
  error,
  lang,
  className,
  children,
}: FieldChrome & { id: string; children: ReactNode }) {
  return (
    <div className={cx(s.field, className)} lang={lang}>
      {label && (
        <label htmlFor={id} className={s.fieldLabel}>
          {label}
        </label>
      )}
      {description && <p className={s.fieldDescription}>{description}</p>}
      {children}
      {error && <p className={s.fieldError}>{error}</p>}
    </div>
  );
}

export function InputField({
  id,
  label,
  description,
  error,
  lang,
  className,
  ...input
}: FieldChrome & { id: string } & Omit<InputHTMLAttributes<HTMLInputElement>, "className">) {
  return (
    <FieldShell id={id} label={label} description={description} error={error} lang={lang} className={className}>
      <input id={id} className={s.control} aria-invalid={error ? true : undefined} {...input} />
    </FieldShell>
  );
}

export function TextareaField({
  id,
  label,
  description,
  error,
  lang,
  className,
  ...textarea
}: FieldChrome & { id: string } & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className">) {
  return (
    <FieldShell id={id} label={label} description={description} error={error} lang={lang} className={className}>
      <textarea id={id} className={cx(s.control, s.textarea)} {...textarea} />
    </FieldShell>
  );
}

export function SelectField({
  id,
  label,
  description,
  error,
  lang,
  className,
  options,
  ...select
}: FieldChrome & {
  id: string;
  options: readonly (string | { value: string; label: string })[];
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "className">) {
  return (
    <FieldShell id={id} label={label} description={description} error={error} lang={lang} className={className}>
      <div className={s.selectWrap}>
        <select id={id} className={cx(s.control, s.select)} aria-label={label ? undefined : id} {...select}>
          {options.map((option) => {
            const { value, label: text } =
              typeof option === "string" ? { value: option, label: option } : option;
            return (
              <option key={value} value={value}>
                {text}
              </option>
            );
          })}
        </select>
        <ChevronDown size={16} className={s.selectChevron} />
      </div>
    </FieldShell>
  );
}

export function SwitchField({
  label,
  description,
  checked,
  defaultChecked,
  onChange,
  disabled,
}: {
  label: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className={s.switchField} style={disabled ? { cursor: "not-allowed" } : undefined}>
      <span className={s.switchText}>
        <span className="t-body">{label}</span>
        {description && <span className="t-body c-secondary">{description}</span>}
      </span>
      <input
        type="checkbox"
        role="switch"
        className={cx(s.switchInput, "visually-hidden")}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        readOnly={!onChange && checked !== undefined}
        onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
      />
      <span className={s.switchTrack} aria-hidden />
    </label>
  );
}

/* Tabs */

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
}: {
  tabs: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div className={s.tabs} role="tablist" aria-label={label}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={tab.value === value}
          className={cx(s.tab, tab.value === value && s.tabActive)}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* Notification */

export function Notification({
  icon,
  title,
  children,
  className,
}: {
  icon?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx(s.notification, className)} role="status">
      {icon && <span className={s.notificationIcon}>{icon}</span>}
      <div className={s.notificationText}>
        <p className="t-body-strong">{title}</p>
        {children && <div className="t-body">{children}</div>}
      </div>
    </div>
  );
}

/* Card and divider (local building blocks used across every screen) */

export function Card({
  gap = 12,
  padding = 16,
  tone = "default",
  className,
  style,
  as: Element = "div",
  children,
}: {
  gap?: 8 | 12 | 16 | 24;
  padding?: 16 | 24 | 32;
  tone?: "default" | "warning" | "positive";
  className?: string;
  style?: CSSProperties;
  as?: "div" | "section" | "article" | "aside";
  children: ReactNode;
}) {
  return (
    <Element
      className={cx(s.card, tone === "warning" && s.cardWarning, tone === "positive" && s.cardPositive, className)}
      style={{ gap, padding, ...style }}
    >
      {children}
    </Element>
  );
}

export function Divider() {
  return <hr className={s.divider} />;
}
