                                  {day.exercises.map((ex, i) => {
                                    const warm = ex.sets.filter((s) => s.warmup);
                                    const work = ex.sets.filter((s) => !s.warmup);
                                    const fmt = (s: {
                                      reps: string;
                                      weight: string;
                                      warmup?: boolean;
                                    }) => {
                                      const w = s.weight?.trim() ? `${s.weight} kg` : "— kg";
                                      return `${s.reps || "—"} × ${w}`;
                                    };
                                    return (
                                      <li
                                        key={ex.id || i}
                                        className="rounded-md border border-border/60 bg-background/40 px-2 py-1.5 text-xs"
                                      >
                                        <p className="font-medium text-foreground">
                                          {i + 1}. {ex.name}
                                        </p>
                                        {warm.length > 0 ? (
                                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                                            <span className="font-semibold uppercase tracking-wide">
                                              Rozgrzewka:{" "}
                                            </span>
                                            {warm.map((s, k) => `R${k + 1} ${fmt(s)}`).join(" · ")}
                                          </p>
                                        ) : null}
                                        {work.length > 0 ? (
                                          <p className="mt-0.5 text-[11px] text-foreground/90">
                                            <span className="font-semibold text-primary">Serie: </span>
                                            {work.map((s, k) => `${k + 1}. ${fmt(s)}`).join(" · ")}
                                          </p>
                                        ) : null}
                                        {ex.range ? (
                                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                                            Zakres:{" "}
                                            <span className="text-foreground">{ex.range}</span>
                                          </p>
                                        ) : null}
                                        {ex.rest ? (
                                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                                            Przerwa:{" "}
                                            <span className="text-foreground">{ex.rest}</span>
                                          </p>
                                        ) : null}
                                        {ex.note ? (
                                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                                            Uwagi:{" "}
                                            <span className="text-foreground">{ex.note}</span>
                                          </p>
                                        ) : null}
                                      </li>
                                    );
                                  })}
