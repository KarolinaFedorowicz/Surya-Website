/**
 * Primitives — the design system. SURYA_CACAO_BUILD_PLAN.md §3.1, P1–P14.
 *
 * "Nothing else in the codebase defines a color, a font, or a spacing value."
 * All 14 are reusable; there are no unique primitives.
 */

export { Section, type SectionProps, type Tone } from "./Section"; // P1
export { Display, type DisplayProps } from "./Display"; // P2
export { Eyebrow } from "./Eyebrow"; // P3
export { Prose } from "./Prose"; // P4
export { Button, type ButtonProps } from "./Button"; // P5
export { TextLink, type TextLinkProps } from "./TextLink"; // P6
export { HairlineRule } from "./HairlineRule"; // P7
export { GrainOverlay, type GrainStrength } from "./GrainOverlay"; // P8
export { Frame, type FrameProps } from "./Frame"; // P9
export { Field, type FieldProps } from "./Field"; // P10
export { Input } from "./Input"; // P11
export { Textarea } from "./Textarea"; // P12
export { Select, type SelectOption } from "./Select"; // P13
export { Pill, type PillProps } from "./Pill"; // P14
