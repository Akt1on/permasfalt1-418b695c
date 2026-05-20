import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Calculator as CalcIcon } from "lucide-react";
import { IMaskInput } from "react-imask";
import { Section } from "@/components/site/Section";
import { supabase } from "@/integrations/supabase/client";
import { notifyLead } from "@/lib/notify-lead";
import { toast } from "sonner";

type Answer = { type: string; coverage: string; area: number; timing: string };

const TYPES = [
  { id: "yard", label: "Двор / парковка", k: 1.0 },
  { id: "road", label: "Дорога / проезд", k: 1.15 },
  { id: "industrial", label: "Промплощадка / склад", k: 1.25 },
  { id: "private", label: "Частная территория", k: 0.95 },
];
const COVERAGE = [
  { id: "asphalt", label: "Асфальт", base: 1500 },
  { id: "tiles", label: "Тротуарная плитка", base: 2200 },
  { id: "crushed", label: "Щебёночное покрытие", base: 700 },
  { id: "concrete", label: "Бетонная стяжка", base: 2400 },
];
const TIMING = [
  { id: "asap", label: "В течение недели" },
  { id: "month", label: "В течение месяца" },
  { id: "season", label: "В этом сезоне" },
  { id: "consult", label: "Просто консультация" },
];

export function Quiz() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answer>({ type: "", coverage: "", area: 200, timing: "" });
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const cov = COVERAGE.find((c) => c.id === a.coverage);
  const typ = TYPES.find((t) => t.id === a.type);
  const price = cov && typ ? Math.round(a.area * cov.base * typ.k) : 0;
  const totalSteps = 4;

  const submit = async () => {
    if (phone.replace(/\D/g, "").length < 11) { toast.error("Введите корректный телефон"); return; }
    setSubmitting(true);
    const summary = [
      `Тип: ${TYPES.find((t) => t.id === a.type)?.label}`,
      `Покрытие: ${cov?.label}`,
      `Площадь: ${a.area} м²`,
      `Сроки: ${TIMING.find((t) => t.id === a.timing)?.label}`,
      `Расчётная стоимость: ~${price.toLocaleString("ru-RU")} ₽`,
    ].join(" • ");
    const { error } = await supabase.from("leads").insert({
      name: name || null, phone, message: summary, source: "quiz",
    });
    setSubmitting(false);
    if (error) { toast.error("Не удалось отправить. Попробуйте позже."); return; }
    notifyLead({ name: name || null, phone, message: summary, source: "quiz" }).catch(() => {});
    setDone(true);
    toast.success("Заявка принята!");
  };

  const next = () => setStep((s) => Math.min(s + 1, totalSteps));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const canNext = (() => {
    if (step === 0) return !!a.type;
    if (step === 1) return !!a.coverage;
    if (step === 2) return a.area >= 10;
    if (step === 3) return !!a.timing;
    return true;
  })();

  return (
    <Section
      eyebrow="Квиз-калькулятор"
      title={<>Узнайте стоимость <span className="text-gradient-gold">за 60 секунд</span></>}
      subtitle="Ответьте на 4 вопроса — рассчитаем предварительную смету и перезвоним в течение 15 минут."
    >
      <div className="max-w-3xl mx-auto">
        <div className="glass rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

          {/* Progress */}
          {!done && (
            <div className="mb-8 relative">
              <div className="flex items-center justify-between mb-3 text-xs uppercase tracking-widest text-muted-foreground">
                <span>Шаг {Math.min(step + 1, totalSteps + 1)} из {totalSteps + 1}</span>
                {price > 0 && step > 0 && (
                  <span className="flex items-center gap-1.5 text-primary font-semibold">
                    <CalcIcon className="h-3.5 w-3.5" />
                    ~ {price.toLocaleString("ru-RU")} ₽
                  </span>
                )}
              </div>
              <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-primary/60"
                  initial={false}
                  animate={{ width: `${((step + 1) / (totalSteps + 1)) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 relative">
                <div className="h-20 w-20 mx-auto rounded-full btn-gold grid place-items-center mb-6">
                  <Check className="h-10 w-10" />
                </div>
                <h3 className="font-display text-3xl font-bold mb-3">Заявка принята!</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Перезвоним в течение 15 минут с точной сметой по вашему объекту.
                  Предварительная стоимость: <span className="text-primary font-bold">~{price.toLocaleString("ru-RU")} ₽</span>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                {step === 0 && (
                  <Step title="Какой объект нужно благоустроить?">
                    <Grid>
                      {TYPES.map((t) => (
                        <Choice key={t.id} active={a.type === t.id} onClick={() => { setA({ ...a, type: t.id }); setTimeout(next, 150); }}>
                          {t.label}
                        </Choice>
                      ))}
                    </Grid>
                  </Step>
                )}

                {step === 1 && (
                  <Step title="Какое покрытие планируете?">
                    <Grid>
                      {COVERAGE.map((c) => (
                        <Choice key={c.id} active={a.coverage === c.id} onClick={() => { setA({ ...a, coverage: c.id }); setTimeout(next, 150); }}>
                          <div>{c.label}</div>
                          <div className="text-xs text-muted-foreground mt-1 normal-case">от {c.base.toLocaleString("ru-RU")} ₽/м²</div>
                        </Choice>
                      ))}
                    </Grid>
                  </Step>
                )}

                {step === 2 && (
                  <Step title="Какая площадь объекта?">
                    <div className="bg-surface-2/50 rounded-2xl p-6 sm:p-8">
                      <div className="flex items-baseline gap-3 mb-6 justify-center">
                        <input
                          type="number" min={10} value={a.area}
                          onChange={(e) => setA({ ...a, area: Math.max(10, Number(e.target.value) || 10) })}
                          className="bg-transparent border-b-2 border-primary text-5xl sm:text-6xl font-display font-bold w-40 text-center focus:outline-none"
                        />
                        <span className="text-muted-foreground text-xl">м²</span>
                      </div>
                      <input
                        type="range" min={10} max={3000} step={10} value={a.area}
                        onChange={(e) => setA({ ...a, area: Number(e.target.value) })}
                        className="w-full accent-primary"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>10 м²</span><span>3000 м²</span>
                      </div>
                      {price > 0 && (
                        <div className="mt-6 text-center">
                          <div className="text-xs uppercase tracking-widest text-muted-foreground">Предварительно</div>
                          <div className="font-display text-3xl sm:text-4xl font-bold text-gradient-gold mt-1">
                            {price.toLocaleString("ru-RU")} ₽
                          </div>
                        </div>
                      )}
                    </div>
                  </Step>
                )}

                {step === 3 && (
                  <Step title="Когда планируете начать?">
                    <Grid>
                      {TIMING.map((t) => (
                        <Choice key={t.id} active={a.timing === t.id} onClick={() => { setA({ ...a, timing: t.id }); setTimeout(next, 150); }}>
                          {t.label}
                        </Choice>
                      ))}
                    </Grid>
                  </Step>
                )}

                {step === 4 && (
                  <Step title="Куда отправить расчёт?">
                    <div className="grid gap-4 max-w-md mx-auto">
                      <div className="text-center mb-2">
                        <div className="text-xs uppercase tracking-widest text-muted-foreground">Ваша предварительная стоимость</div>
                        <div className="font-display text-4xl sm:text-5xl font-bold text-gradient-gold mt-2">
                          {price.toLocaleString("ru-RU")} ₽
                        </div>
                      </div>
                      <input
                        value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя (необязательно)"
                        className="bg-input border border-border rounded-lg px-4 py-3.5 focus:border-primary focus:outline-none"
                      />
                      <IMaskInput
                        mask="+7 (000) 000-00-00" value={phone}
                        onAccept={(v: string) => setPhone(v)}
                        placeholder="+7 (___) ___-__-__"
                        className="bg-input border border-border rounded-lg px-4 py-3.5 focus:border-primary focus:outline-none"
                      />
                      <button onClick={submit} disabled={submitting}
                        className="btn-gold rounded-lg px-6 py-4 font-semibold uppercase tracking-wide text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                        {submitting ? "Отправка…" : <>Получить точную смету <ArrowRight className="h-4 w-4" /></>}
                      </button>
                      <p className="text-[11px] text-muted-foreground text-center">
                        Нажимая кнопку, вы соглашаетесь на обработку персональных данных
                      </p>
                    </div>
                  </Step>
                )}

                <div className="mt-8 flex items-center justify-between">
                  <button
                    onClick={back} disabled={step === 0}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="h-4 w-4" /> Назад
                  </button>
                  {step < 4 && step !== 0 && step !== 1 && step !== 3 && (
                    <button
                      onClick={next} disabled={!canNext}
                      className="btn-gold rounded-lg px-6 py-2.5 font-semibold text-sm flex items-center gap-2 disabled:opacity-50"
                    >
                      Далее <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-xl sm:text-2xl font-bold mb-6 text-center">{title}</h3>
      {children}
    </div>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-3">{children}</div>;
}
function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-5 rounded-xl border-2 transition font-semibold uppercase tracking-wide text-sm ${
        active ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 bg-surface-2/30"
      }`}
    >
      {children}
    </button>
  );
}
