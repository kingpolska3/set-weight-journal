import { useMemo, useState } from "react";
import { Activity } from "lucide-react";
import {
  LEVEL_FILL,
  LEVEL_LABEL,
  levelFor,
  muscleStats,
  type Level,
  type MuscleKey,
  type MuscleStat,
} from "@/lib/muscle-map";
import { formatDatePL, type Session } from "@/lib/workout-store";

type Shape =
  | { kind: "rect"; x: number; y: number; w: number; h: number; r: number }
  | { kind: "ellipse"; cx: number; cy: number; rx: number; ry: number };

type Region = { muscle: MuscleKey; shapes: Shape[] };

const FRONT: Region[] = [
  {
    muscle: "barki",
    shapes: [
      { kind: "ellipse", cx: 39, cy: 43, rx: 9, ry: 7 },
      { kind: "ellipse", cx: 81, cy: 43, rx: 9, ry: 7 },
    ],
  },
  {
    muscle: "klatka",
    shapes: [
      { kind: "rect", x: 46, y: 40, w: 13, h: 16, r: 5 },
      { kind: "rect", x: 61, y: 40, w: 13, h: 16, r: 5 },
    ],
  },
  { muscle: "brzuch", shapes: [{ kind: "rect", x: 50, y: 58, w: 20, h: 27, r: 6 }] },
  {
    muscle: "biceps",
    shapes: [
      { kind: "ellipse", cx: 34, cy: 60, rx: 6, ry: 12 },
      { kind: "ellipse", cx: 86, cy: 60, rx: 6, ry: 12 },
    ],
  },
  {
    muscle: "przedramiona",
    shapes: [
      { kind: "ellipse", cx: 30, cy: 85, rx: 5, ry: 13 },
      { kind: "ellipse", cx: 90, cy: 85, rx: 5, ry: 13 },
    ],
  },
  {
    muscle: "uda-przod",
    shapes: [
      { kind: "rect", x: 44, y: 92, w: 14, h: 44, r: 7 },
      { kind: "rect", x: 62, y: 92, w: 14, h: 44, r: 7 },
    ],
  },
  {
    muscle: "lydki",
    shapes: [
      { kind: "rect", x: 45, y: 142, w: 12, h: 32, r: 6 },
      { kind: "rect", x: 63, y: 142, w: 12, h: 32, r: 6 },
    ],
  },
];

const BACK: Region[] = [
  {
    muscle: "barki",
    shapes: [
      { kind: "ellipse", cx: 39, cy: 43, rx: 9, ry: 7 },
      { kind: "ellipse", cx: 81, cy: 43, rx: 9, ry: 7 },
    ],
  },
  { muscle: "plecy-gora", shapes: [{ kind: "rect", x: 45, y: 39, w: 30, h: 27, r: 7 }] },
  { muscle: "plecy-dol", shapes: [{ kind: "rect", x: 49, y: 68, w: 22, h: 16, r: 5 }] },
  {
    muscle: "triceps",
    shapes: [
      { kind: "ellipse", cx: 34, cy: 60, rx: 6, ry: 12 },
      { kind: "ellipse", cx: 86, cy: 60, rx: 6, ry: 12 },
    ],
  },
  {
    muscle: "przedramiona",
    shapes: [
      { kind: "ellipse", cx: 30, cy: 85, rx: 5, ry: 13 },
      { kind: "ellipse", cx: 90, cy: 85, rx: 5, ry: 13 },
    ],
  },
  {
    muscle: "posladki",
    shapes: [
      { kind: "rect", x: 45, y: 87, w: 14, h: 17, r: 7 },
      { kind: "rect", x: 61, y: 87, w: 14, h: 17, r: 7 },
    ],
  },
  {
    muscle: "uda-tyl",
    shapes: [
      { kind: "rect", x: 44, y: 106, w: 14, h: 32, r: 7 },
      { kind: "rect", x: 62, y: 106, w: 14, h: 32, r: 7 },
    ],
  },
  {
    muscle: "lydki",
    shapes: [
      { kind: "rect", x: 45, y: 142, w: 12, h: 32, r: 6 },
      { kind: "rect", x: 63, y: 142, w: 12, h: 32, r: 6 },
    ],
  },
];

const BASE = "oklch(0.26 0.01 285)";

function ShapeNode({ shape, fill, active }: { shape: Shape; fill: string; active: boolean }) {
  const common = {
    fill,
    stroke: active ? "oklch(0.85 0.16 300)" : "oklch(0.22 0.01 285)",
    strokeWidth: active ? 1.6 : 0.8,
  };
  if (shape.kind === "rect") {
    return <rect x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx={shape.r} {...common} />;
  }
  return <ellipse cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} {...common} />;
}

function BodyView({
  title,
  regions,
  stats,
  selected,
  onSelect,
}: {
  title: string;
  regions: Region[];
  stats: Record<MuscleKey, MuscleStat>;
  selected: MuscleKey | null;
  onSelect: (m: MuscleKey) => void;
}) {
  return (
    <div className="flex-1">
      <p className="mb-1 text-center text-[11px] uppercase tracking-wide text-muted-foreground">{title}</p>
      <svg viewBox="0 0 120 182" className="mx-auto h-auto w-full max-w-[190px]" role="img" aria-label={`Sylwetka – ${title}`}>
        {/* Kontur sylwetki */}
        <circle cx={60} cy={20} r={11} fill={BASE} />
        <rect x={55} y={30} width={10} height={8} rx={3} fill={BASE} />
        <rect x={42} y={38} width={36} height={50} rx={12} fill={BASE} />
        <rect x={27} y={44} width={10} height={54} rx={5} fill={BASE} />
        <rect x={83} y={44} width={10} height={54} rx={5} fill={BASE} />
        <rect x={42} y={86} width={36} height={54} rx={12} fill={BASE} />
        <rect x={43} y={136} width={16} height={40} rx={7} fill={BASE} />
        <rect x={61} y={136} width={16} height={40} rx={7} fill={BASE} />

        {regions.map((region) => {
          const stat = stats[region.muscle];
          const level: Level = levelFor(stat.intensity);
          const active = selected === region.muscle;
          return (
            <g
              key={region.muscle}
              onClick={() => onSelect(region.muscle)}
              className="cursor-pointer"
              style={{ opacity: level === 0 ? 0.5 : 1 }}
            >
              <title>{stat.label}</title>
              {region.shapes.map((shape, i) => (
                <ShapeNode key={i} shape={shape} fill={LEVEL_FILL[level]} active={active} />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function MuscleMap({ sessions }: { sessions: Session[] }) {
  const { stats, total } = useMemo(() => muscleStats(sessions), [sessions]);
  const [selected, setSelected] = useState<MuscleKey | null>(null);
  const detail = selected ? stats[selected] : null;

  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Zaangażowane partie mięśniowe</h2>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Kolor pokazuje, jak mocno trenowałeś daną partię. Kliknij partię, żeby zobaczyć szczegóły.
      </p>

      {total <= 0 ? (
        <p className="mt-3 rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
          Zapisz pierwsze treningi, a sylwetka zacznie się podświetlać.
        </p>
      ) : null}

      <div className="mt-3 flex flex-col gap-4 sm:flex-row">
        <BodyView title="Przód" regions={FRONT} stats={stats} selected={selected} onSelect={setSelected} />
        <BodyView title="Tył" regions={BACK} stats={stats} selected={selected} onSelect={setSelected} />
      </div>

      {detail ? (
        <div className="mt-3 rounded-lg border border-primary/40 bg-primary/5 p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{detail.label}</p>
            <button
              onClick={() => setSelected(null)}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Zamknij
            </button>
          </div>
          <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div>
              <dt className="text-muted-foreground">Treningi tej partii</dt>
              <dd className="font-semibold text-foreground">{detail.sessions}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Serie robocze</dt>
              <dd className="font-semibold text-foreground">{detail.sets}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Objętość</dt>
              <dd className="font-semibold text-foreground">
                {Math.round(detail.volume).toLocaleString("pl-PL")} kg
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Udział w objętości</dt>
              <dd className="font-semibold text-foreground">{(detail.share * 100).toFixed(1)}%</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground">Ostatni trening</dt>
              <dd className="font-semibold text-foreground">
                {detail.lastDate ? formatDatePL(detail.lastDate) : "jeszcze nie trenowano"}
              </dd>
            </div>
          </dl>
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {([0, 1, 2, 3] as Level[]).map((lvl) => (
          <span key={lvl} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: LEVEL_FILL[lvl], opacity: lvl === 0 ? 0.5 : 1 }}
              aria-hidden
            />
            {LEVEL_LABEL[lvl]}
          </span>
        ))}
      </div>
    </section>
  );
}
