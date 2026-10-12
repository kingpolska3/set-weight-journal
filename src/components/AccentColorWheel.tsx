import { useEffect, useRef, useState } from "react";
import { ACCENTS, type ThemeSettings } from "@/lib/theme";
import { Button } from "@/components/ui/button";

export function AccentColorWheel({ theme, onChange }: { theme: ThemeSettings; onChange: (color: string) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const change = useRef(onChange);
  change.current = onChange;
  const picker = useRef<{ color: { hexString: string }; setOptions: (options: { color: string }) => void } | null>(null);
  const color = theme.customColor ?? ACCENTS[theme.accent].swatch;
  const initial = useRef(color);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void import("@jaames/iro").then(({ default: iro }) => {
      if (cancelled || !host.current) return;
      const instance = iro.ColorPicker(host.current, { width: 216, color: initial.current,
        layout: [{ component: iro.ui.Wheel }, { component: iro.ui.Slider, options: { sliderType: "value" } }] });
      instance.on("input:change", (selected: { hexString: string }) => change.current(selected.hexString));
      picker.current = instance;
    });
    return () => { cancelled = true; picker.current = null; host.current?.replaceChildren(); };
  }, [open]);
  useEffect(() => { initial.current = color; if (picker.current && picker.current.color.hexString.toLowerCase() !== color.toLowerCase()) picker.current.setOptions({ color }); }, [color]);
  return <div className="mt-4 space-y-3">
    <Button variant="outline" className="w-full justify-between" onClick={() => setOpen(!open)} aria-expanded={open}>
      <span className="flex items-center gap-2"><span className="h-5 w-5 rounded-full border border-border bg-primary" /> Kolor akcentu</span>
      <span className="text-xs text-muted-foreground">{color}</span>
    </Button>
    {open ? <div className="flex flex-col items-center gap-3">
      <div ref={host} role="group" aria-label="Koło barw" className="min-h-64 w-[216px]" />
      <label className="flex items-center gap-3 text-xs text-muted-foreground">Kolor akcentu
        <input type="color" aria-label="Kolor akcentu" value={color} onChange={(e) => onChange(e.target.value)} className="h-9 w-12 rounded-md border border-input bg-secondary p-1" />
      </label>
    </div> : null}
  </div>;
}