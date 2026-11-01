"use client";

import type { ComponentProps } from "react";
import { SelectField } from "@/components/sds";

/** A SelectField that submits its surrounding GET form as soon as the value changes. */
export function AutoSubmitSelect(props: Omit<ComponentProps<typeof SelectField>, "onChange">) {
  return <SelectField {...props} onChange={(e) => e.currentTarget.form?.requestSubmit()} />;
}
