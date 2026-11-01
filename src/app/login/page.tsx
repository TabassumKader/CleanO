import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckCircle } from "react-feather";
import { LoginHeader } from "@/components/headers";
import { LogoMark } from "@/components/layout";
import { LoginForm, LoginFormFromUrl } from "./LoginForm";
import s from "./login.module.css";

export const metadata: Metadata = { title: "Log in" };

const benefits = [
  "Confirm daily pickups for your building",
  "Keep a digital receipt for every payment",
  "Report a problem and follow the response",
  "Collectors, providers and officers use the same records",
];

/** S2 · Log in with mobile number. */
export default function LoginPage() {
  return (
    <>
      <LoginHeader />
      <main className={s.main}>
        <div className={s.row}>
          <section className={s.pitch}>
            <LogoMark size={64} />
            <p className="t-bangla-heading" lang="bn">
              স্বচ্ছ সেবা, পরিচ্ছন্ন শহর
            </p>
            <p className="t-subheading c-secondary">Transparent service, clean city</p>
            <ul className={s.benefits}>
              {benefits.map((benefit) => (
                <li key={benefit} className={s.benefit}>
                  <CheckCircle size={20} className={s.check} aria-hidden />
                  <span className="t-body">{benefit}</span>
                </li>
              ))}
            </ul>
          </section>
          <Suspense fallback={<LoginForm />}>
            <LoginFormFromUrl />
          </Suspense>
        </div>
      </main>
    </>
  );
}
