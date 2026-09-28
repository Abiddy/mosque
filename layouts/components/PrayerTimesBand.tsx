import { useEffect, useMemo, useState } from "react";

type PrayerRow = { name: string; starts: string; iqama: string | null };

type MasjidalPayload = {
  source: "masjidal";
  date?: { readable?: string };
  prayers?: PrayerRow[];
  jumuah?: { label: string; time: string }[];
};

const TZ = "America/Los_Angeles";

/** Upstream times usually omit AM/PM, so infer it from the prayer. */
function toMinutes(time: string, prayer: string): number | null {
  const m = time.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const meridiem = m[3]?.toUpperCase();
  if (meridiem === "PM" && h !== 12) h += 12;
  else if (meridiem === "AM" && h === 12) h = 0;
  else if (!meridiem) {
    if (prayer === "Dhuhr" && h < 10) h += 12;
    if (["Asr", "Maghrib", "Isha"].includes(prayer) && h < 12) h += 12;
  }
  return h * 60 + min;
}

function nowMinutesInTz(): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h * 60 + m;
}

function useNowMinutes() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(nowMinutesInTz());
    const id = setInterval(() => setNow(nowMinutesInTz()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function splitMeridiem(time: string, prayer: string) {
  const explicit = time.match(/(AM|PM)$/i)?.[0];
  const clock = time.replace(/\s?(AM|PM)$/i, "");
  if (explicit) return { clock, meridiem: explicit.toUpperCase() };
  const mins = toMinutes(time, prayer);
  return { clock, meridiem: mins === null ? "" : mins >= 12 * 60 ? "PM" : "AM" };
}

function withMeridiem(time: string, prayer: string) {
  const { clock, meridiem } = splitMeridiem(time, prayer);
  return meridiem ? `${clock} ${meridiem}` : clock;
}

const ORDINALS = ["1st", "2nd", "3rd"];

/** Fixed-width time columns keep every row aligned regardless of prayer name length. */
const ROW_GRID =
  "grid grid-cols-[minmax(0,1fr)_84px_84px] items-center gap-2 px-4 font-instrument-sans min-[400px]:grid-cols-[minmax(0,1fr)_96px_96px] sm:grid-cols-[minmax(0,1fr)_150px_150px] sm:gap-6 sm:px-8";

function TimeCell({
  label,
  time,
  serif = false,
}: {
  label: string;
  time: string;
  serif?: boolean;
}) {
  const { clock, meridiem } = splitMeridiem(time, "");
  return (
    <span className="flex flex-col items-start">
      <span className="text-[9px] uppercase tracking-[0.18em] text-white/45 sm:text-[11px] sm:tracking-[0.2em]">
        {label}
      </span>
      <span
        className={`whitespace-nowrap tabular-nums text-white ${
          serif
            ? "font-instrument-serif text-[26px] leading-none sm:text-[36px]"
            : "text-lg font-medium leading-tight sm:text-2xl"
        }`}
      >
        {clock}
        {meridiem && (
          <span className="ml-1 font-instrument-sans text-[10px] font-normal uppercase text-white/55 sm:text-xs">
            {meridiem}
          </span>
        )}
      </span>
    </span>
  );
}

const pillClass =
  "rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md";

export default function PrayerTimesBand() {
  const [payload, setPayload] = useState<MasjidalPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const now = useNowMinutes();

  useEffect(() => {
    let cancelled = false;

    const load = async (attempt = 1): Promise<void> => {
      try {
        const r = await fetch("/api/prayerTimes", { cache: "no-store" });
        const json = await r.json();

        if (!r.ok) {
          if (r.status >= 500 && attempt < 3) {
            await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
            if (!cancelled) return load(attempt + 1);
            return;
          }
          throw new Error(json?.error || "Request failed");
        }

        if (!cancelled) {
          setPayload(json);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Something went wrong");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const prayers = payload?.prayers ?? [];
  const jumuah = payload?.jumuah ?? [];
  const daily = prayers.filter((p) => p.name !== "Sunrise");

  const nextName = useMemo(() => {
    if (now === null || daily.length === 0) return null;
    const timed = daily
      .map((p) => ({ name: p.name, at: toMinutes(p.starts, p.name) }))
      .filter((p): p is { name: string; at: number } => p.at !== null);
    return (timed.find((p) => p.at > now) ?? timed[0])?.name ?? null;
  }, [now, daily]);

  if (loading || error) {
    return (
      <p className="w-full text-center font-instrument-sans text-sm text-white/60">
        {loading ? "Loading prayer times…" : error}
      </p>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[860px]">
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2 font-instrument-sans text-[11px] text-white/70 sm:mb-5 sm:text-sm">
        {jumuah.map((j, i) => (
          <span
            key={j.label}
            className={`${pillClass} whitespace-nowrap rounded-full px-3 py-1.5 sm:px-4 sm:py-2`}
          >
            <span className="text-white/45">
              {ORDINALS[i] ?? `${i + 1}th`} Jumu&apos;ah Khutbah
            </span>{" "}
            <span className="tabular-nums text-white">{j.time}</span>
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:gap-3">
        {daily.map((p) => {
          const active = p.name === nextName;
          return (
            <div
              key={p.name}
              className={`${pillClass} ${ROW_GRID} py-3.5 transition-colors sm:py-5 ${
                active ? "border-white/30 bg-white/[0.1]" : ""
              }`}
            >
              <span className="truncate text-[11px] uppercase tracking-[0.18em] text-white/75 sm:text-sm sm:tracking-[0.24em]">
                {p.name}
              </span>
              <TimeCell label="Starts" time={withMeridiem(p.starts, p.name)} />
              <TimeCell
                serif
                label="Iqamah"
                time={p.iqama ? withMeridiem(p.iqama, p.name) : "—"}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
