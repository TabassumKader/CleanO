import type { Metadata } from "next";
import { Anek_Bangla, Public_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Suspense, type CSSProperties, type ReactNode } from "react";
import { ArrowRight, Check } from "react-feather";
import { LanguageToggle } from "@/components/HeaderMenus";
import { LogoMark } from "@/components/layout";
import { RevealRoot } from "@/components/RevealRoot";
import { wards } from "@/data/wards";
import { currentRole } from "@/lib/serverSession";
import { roleHome } from "@/lib/session";
import s from "./landing.module.css";

/* Anek Bangla's Latin and Bangla were designed together, so headings read as one voice in both scripts. */
const heading = Anek_Bangla({ subsets: ["bengali", "latin"], axes: ["wdth"], variable: "--font-heading" });
const body = Public_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: { absolute: "CLEAN - O · Track household waste collection in your ward" },
  description:
    "Residents, caretakers, collectors, service providers and city officers in Dhaka share one record of every pickup, payment and complaint.",
};

export default function LandingPage() {
  return (
    <RevealRoot className={`${s.page} ${heading.variable} ${body.variable}`}>
      <header className={s.header}>
        <div className={s.headerInner}>
          <Link href="/" className={s.brand} aria-label="CLEAN - O home">
            <LogoMark />
            <span className={s.brandText}>
              CLEAN - O
              <span lang="bn">ক্লিন - ও</span>
            </span>
          </Link>
          <nav className={s.nav} aria-label="Primary">
            <Link href="/wards">Ward dashboards</Link>
            <a href="#how">How it works</a>
            <a href="#faq">Questions</a>
          </nav>
          <div className={s.headerActions}>
            <LanguageToggle to="bn" />
            <Suspense fallback={<HeaderAccountLink />}>
              <SessionHeaderAccountLink />
            </Suspense>
            <Link href="/wards" className={`${s.button} ${s.buttonSmall}`}>
              Check your ward
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className={s.hero}>
          <div className={s.container}>
            <div className={s.heroText}>
              <h1 className={s.h1}>
                Track household waste collection in your ward
                <span className={s.h1Bangla} lang="bn">
                  আপনার ওয়ার্ডের বর্জ্য সংগ্রহের হিসাব দেখুন
                </span>
              </h1>
              <div className={s.heroAside}>
                <p className={s.lede}>
                  Residents, building caretakers, collectors, service providers and Dhaka South City
                  Corporation officers share one record of every pickup, payment and complaint. Anyone
                  can see a ward&apos;s record without an account.
                </p>
                <div className={s.actions}>
                  <Link href="/wards" className={s.button}>
                    Check your ward
                  </Link>
                  <Suspense fallback={<HeroAccountLink />}>
                    <SessionHeroAccountLink />
                  </Suspense>
                </div>
                <p className={s.status}>Working prototype. All names and figures are sample data.</p>
              </div>
            </div>

            <figure className={s.heroShot}>
              <Image
                src="/landing/ward-record.png"
                alt="The public ward dashboard for Ward 20: 86% pickup reliability, an official fee of Tk 100 against Tk 150 typically paid, 18 of 24 complaints resolved, and a day-by-day pickup record for October."
                width={2496}
                height={1300}
                sizes="(max-width: 1280px) 100vw, 1200px"
                priority
              />
            </figure>
          </div>
        </section>

        <section className={s.facts} aria-labelledby="facts-title">
          <div className={s.container}>
            <h2 id="facts-title" className="visually-hidden">
              What the ward dashboard shows
            </h2>
            <dl className={s.factGrid}>
              <div data-reveal style={{ "--delay": "0ms" } as CSSProperties}>
                <dt>Pickup record</dt>
                <dd>
                  Each day of the month is marked collected, missed or not confirmed, based on what
                  caretakers, collectors and residents report.
                </dd>
              </div>
              <div data-reveal style={{ "--delay": "100ms" } as CSSProperties}>
                <dt>Fees</dt>
                <dd>
                  The official DSCC rate sits next to what residents actually report paying, so an
                  overcharge in the ward is visible to everyone.
                </dd>
              </div>
              <div data-reveal style={{ "--delay": "200ms" } as CSSProperties}>
                <dt>Complaints</dt>
                <dd>
                  How many complaints were raised this month, how many were resolved, and how many are
                  waiting on the service provider.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section id="how" className={s.features} aria-label="How it works for each group">
          <div className={s.container}>
            <Feature
              label="Residents"
              title="Pay the official fee and keep the receipt"
              intro="Every payment your service provider records creates an e-receipt with the official rate printed on it, so an overcharge shows up straight away."
              points={[
                "Scan the QR code on a receipt to check it is genuine",
                "See which days this week your building was collected",
                "Report a problem with or without your name",
              ]}
              link={{ href: "/login?role=resident", label: "Open the resident dashboard" }}
              image={
                <Image
                  src="/landing/receipt-october.png"
                  alt="An e-receipt for October 2026: Tk 100 paid for flat 4B, within the official rate of Tk 100, with a QR code to verify it."
                  width={1120}
                  height={1152}
                  sizes="(max-width: 960px) 80vw, 420px"
                />
              }
              tall
            />
            <Feature
              label="Caretakers and collectors"
              title="Confirm each pickup at the building gate"
              intro="Collectors scan the QR sticker on each building and choose collected, waste not ready or building closed. The route list is in Bangla and keeps working without a connection."
              points={[
                "Caretakers confirm or flag a missed day in one tap",
                "Check-ins are sent when the network comes back",
                "Residents see the result the same morning",
              ]}
              link={{ href: "/login?role=collector", label: "Open the collector route" }}
              image={
                <Image
                  src="/landing/collector-route-bn.png"
                  alt="The collector's route for Ward 20 in Bangla: 18 of 42 buildings collected, 23 still to visit and one problem, with a button to mark each remaining building as collected."
                  width={2496}
                  height={1280}
                  sizes="(max-width: 960px) 100vw, 700px"
                />
              }
              reverse
            />
            <Feature
              label="City corporation and service providers"
              title="Deal with complaints before they pile up"
              intro="Complaints go to the service provider first. If there is no reply within 48 hours, the zonal office sees them in an overdue queue with the evidence and timeline attached."
              points={[
                "Filter the queue by ward, type and age",
                "Ask the provider to respond, resolve, or escalate further",
                "A 7-day report for each zone is put together automatically",
              ]}
              link={{ href: "/login?role=officer", label: "Open the zonal officer view" }}
              bleed="112%"
              image={
                <Image
                  src="/landing/complaint-queue.png"
                  alt="The zonal officer's complaint queue for Zone 1: 37 open complaints, 9 overdue, with complaint SC-1042 open in a side panel showing its evidence and timeline."
                  width={2320}
                  height={1528}
                  sizes="(max-width: 960px) 100vw, 700px"
                />
              }
            />
          </div>
        </section>

        <section className={s.process} aria-labelledby="process-title">
          <div className={s.container}>
            <div className={s.sectionIntro} data-reveal>
              <h2 id="process-title" className={s.h2}>
                What happens after you report a problem
              </h2>
              <p>
                Every report has an owner and a deadline. You can follow it from your dashboard, or
                from the reference number if you reported without logging in.
              </p>
            </div>
            <ol className={s.timeline} data-reveal>
              <Stage index={0} time="0 hours" title="Sent to the service provider">
                The provider for your ward is notified straight away, with any photo you added.
              </Stage>
              <Stage index={1} time="Within 48 hours" title="The provider replies">
                They can fix the problem, explain what happened, or ask you for more information.
              </Stage>
              <Stage index={2} time="After 48 hours" title="Escalated to the zonal office">
                If the provider has not replied, the report moves to the zonal officer&apos;s overdue
                queue.
              </Stage>
              <Stage index={3} time="Closed" title="You confirm the outcome" last>
                The report is closed when it is resolved, and the ward&apos;s complaint figures update.
              </Stage>
            </ol>
            <Link href="/reports/SC-1042" className={s.textLink}>
              Follow an example report, SC-1042 <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </section>

        <section className={s.lookup} aria-labelledby="lookup-title">
          <div className={`${s.container} ${s.lookupGrid}`}>
            <div data-reveal>
              <h2 id="lookup-title" className={s.h2}>
                Every ward&apos;s record is public
              </h2>
              <p className={s.sectionText}>
                Search by ward number or area. You do not need an account to see collection, fees or
                complaints for a ward.
              </p>
            </div>
            <div data-reveal style={{ "--delay": "100ms" } as CSSProperties}>
              <form action="/wards" role="search" className={s.search}>
                <label htmlFor="ward-search" className={s.searchLabel}>
                  Ward number or area
                </label>
                <div className={s.searchRow}>
                  <input id="ward-search" type="search" name="q" placeholder="For example, 20 or Dhanmondi" />
                  <button type="submit" className={s.button}>
                    Search
                  </button>
                </div>
              </form>
              <p className={s.sampleWards}>
                Sample data is available for{" "}
                {wards.map((ward, i) => (
                  <span key={ward.id}>
                    <Link href={`/wards?q=${ward.id}`} className={s.nowrap}>
                      {ward.name} ({ward.areas[0]})
                    </Link>
                    {i < wards.length - 2 ? ", " : i === wards.length - 2 ? " and " : "."}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className={s.faq} aria-labelledby="faq-title">
          <div className={`${s.container} ${s.faqGrid}`}>
            <h2 id="faq-title" className={s.h2} data-reveal>
              Questions
            </h2>
            <div className={s.faqList} data-reveal style={{ "--delay": "100ms" } as CSSProperties}>
              <Question q="Do I need an account to report a problem?">
                No. Anyone can report a missed pickup, an overcharge or waste left on the road. If you
                log in, you can follow the report and add information later.
              </Question>
              <Question q="What is the official fee?">
                In Ward 20 the Dhaka South City Corporation rate for household collection is Tk 100 a
                month. Each e-receipt shows the official rate for your ward next to the amount you
                paid.
              </Question>
              <Question q="Will the collector or provider see my name?">
                Not if you report anonymously. The service provider sees only the building and ward.
                City corporation officers can see who reported, so that false reports can be followed
                up.
              </Question>
              <Question q="What if a collector has no internet connection?">
                The collector app keeps check-ins on the phone and sends them when the connection
                returns, so a weak signal does not lose the day&apos;s record.
              </Question>
              <Question q="Is this a live service?">
                Not yet. CLEAN - O is a working prototype. The wards, names, addresses and figures you
                see are sample data.
              </Question>
            </div>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={`${s.container} ${s.footerGrid}`}>
          <div className={s.footerBrand}>
            <span className={s.brand}>
              <LogoMark />
              <span className={s.brandText}>
                CLEAN - O
                <span lang="bn">ক্লিন - ও</span>
              </span>
            </span>
            <p>A shared record of household waste collection for Dhaka&apos;s wards.</p>
          </div>
          <nav aria-label="Public pages">
            <p className={s.footerHeading}>Public</p>
            <Link href="/wards">Ward dashboards</Link>
            <Link href="/weekly-report">Weekly zone report</Link>
            <Link href="/report?anonymous=1">Report a problem</Link>
            <Link href="/how-it-works">All screens</Link>
          </nav>
          <nav aria-label="Log in">
            <p className={s.footerHeading}>Log in as</p>
            <Link href="/login?role=resident">Resident</Link>
            <Link href="/login?role=caretaker">Building caretaker</Link>
            <Link href="/login?role=collector">Collector</Link>
            <Link href="/login?role=officer">Zonal officer</Link>
            <Link href="/login?role=provider">Service provider</Link>
          </nav>
          <div>
            <p className={s.footerHeading}>About</p>
            <p>Prepared by Tabassum Kader Tunaz</p>
            <p>Version 1.0, 31 October 2026</p>
            <p>Prototype with sample data</p>
          </div>
        </div>
      </footer>
    </RevealRoot>
  );
}

function Feature({
  label,
  title,
  intro,
  points,
  link,
  image,
  reverse,
  tall,
  bleed = "135%",
}: {
  label: string;
  title: string;
  intro: string;
  points: string[];
  link: { href: string; label: string };
  image: ReactNode;
  reverse?: boolean;
  tall?: boolean;
  /** How far a wide screenshot runs past the panel edge. */
  bleed?: string;
}) {
  return (
    <article className={`${s.feature} ${reverse ? s.featureReverse : ""}`}>
      <div className={s.featureText} data-reveal>
        <p className={s.label}>{label}</p>
        <h2 className={s.h2}>{title}</h2>
        <p className={s.sectionText}>{intro}</p>
        <ul className={s.points}>
          {points.map((point) => (
            <li key={point}>
              <Check size={18} aria-hidden />
              {point}
            </li>
          ))}
        </ul>
        <Link href={link.href} className={s.textLink}>
          {link.label} <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
      <div
        className={`${s.panel} ${tall ? s.panelCentered : ""}`}
        style={{ "--bleed": bleed, "--delay": "120ms" } as CSSProperties}
        data-reveal
      >
        {image}
      </div>
    </article>
  );
}

function Stage({
  index,
  time,
  title,
  last,
  children,
}: {
  index: number;
  time: string;
  title: string;
  last?: boolean;
  children: ReactNode;
}) {
  return (
    <li className={`${s.stage} ${last ? s.stageLast : ""}`} style={{ "--i": index } as CSSProperties}>
      <p className={s.stageTime}>{time}</p>
      <span className={s.stageMarker} aria-hidden />
      <h3 className={s.h3}>{title}</h3>
      <p className={s.stageText}>{children}</p>
    </li>
  );
}

function Question({ q, children }: { q: string; children: ReactNode }) {
  return (
    <details className={s.question}>
      <summary>{q}</summary>
      <p>{children}</p>
    </details>
  );
}

/* Signed-in visitors are offered their dashboard instead of "Log in". */

function HeaderAccountLink({ href = "/login", label = "Log in" }: { href?: string; label?: string }) {
  return (
    <Link href={href} className={s.headerLink}>
      {label}
    </Link>
  );
}

async function SessionHeaderAccountLink() {
  const role = await currentRole();
  return role ? <HeaderAccountLink href={roleHome(role)} label="My dashboard" /> : <HeaderAccountLink />;
}

function HeroAccountLink({ href = "/login", label = "Log in" }: { href?: string; label?: string }) {
  return (
    <Link href={href} className={`${s.button} ${s.buttonSecondary}`}>
      {label}
    </Link>
  );
}

async function SessionHeroAccountLink() {
  const role = await currentRole();
  return role ? <HeroAccountLink href={roleHome(role)} label="Go to my dashboard" /> : <HeroAccountLink />;
}
