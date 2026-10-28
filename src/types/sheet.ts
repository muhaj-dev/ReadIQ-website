// One choice in a picker (the Add Deadline subject / type / reminder / repeat lists).

export type SheetOption = {
  label: string;
  /** "Custom" opens a follow-up picker → renders a chevron, not a check. */
  chevron?: boolean;
};
