import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import TextFade from "./ui/TextFade";

type PublicQuestion = {
  id: string;
  body: string;
  answer: string;
  answered_at: string | null;
};

const AskQuestionSection = () => {
  const [view, setView] = useState<"form" | "list">("form");
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const ref = useRef(null);

  const fetchQuestions = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/questions");
      const data = await res.json();
      if (res.ok) setQuestions(data.questions ?? []);
    } catch {
      setQuestions([]);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    if (view === "list") fetchQuestions();
  }, [view, fetchQuestions]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setStatus("error");
      setMessage("Please enter your question.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: question }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Something went wrong");

      setStatus("success");
      setMessage(
        data.message ||
          "Thank you. Your question was submitted. Answers appear here once our Sheikh reviews and publishes them."
      );
      setQuestion("");
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    }
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section id="ask-a-question" className="iit-section">
      <div className="iit-card relative mx-auto flex min-h-[min(60vh,520px)] max-w-5xl flex-col items-center justify-center px-5 pb-12 pt-20 md:px-10 md:py-20">
        <button
          type="button"
          onClick={() => setView((v) => (v === "form" ? "list" : "form"))}
          className={`absolute right-4 top-4 z-20 rounded-full border px-4 py-2 font-instrument-sans text-sm transition-colors md:right-6 md:top-6 ${
            view === "list"
              ? "border-white bg-white text-[#0a0f1f]"
              : "border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"
          }`}
        >
          Answers
        </button>

        <div className="relative z-10 w-full max-w-3xl">
          <TextFade className="mb-8 text-center md:mb-10">
            <p className="iit-eyebrow mb-4">Ask the Sheikh</p>
            <h2 className="iit-title">Have a question?</h2>
          </TextFade>

          <div ref={ref} className="relative min-h-[72px]">
            <AnimatePresence mode="wait">
              {view === "form" ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3 md:px-5 md:py-4"
                  >
                    <input
                      id="ask-question"
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      disabled={status === "loading"}
                      placeholder="Ask our Sheikh a Question Anonymously"
                      className="min-w-0 flex-1 border-0 bg-transparent font-instrument-sans text-base text-white placeholder:text-white/40 focus:outline-none focus:ring-0 md:text-lg"
                      autoComplete="off"
                    />
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#0a0f1f] transition-colors hover:bg-white/90 disabled:opacity-50 md:h-10 md:w-10"
                      aria-label="Send question"
                    >
                      <ArrowUp
                        className="h-4 w-4 md:h-[18px] md:w-[18px]"
                        strokeWidth={2}
                      />
                    </button>
                  </form>

                  {message && (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-4 text-center font-instrument-sans text-sm ${
                        status === "success" ? "text-white" : "text-white/60"
                      }`}
                    >
                      {message}
                    </motion.p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  data-lenis-prevent
                  className="max-h-[min(42vh,420px)] overflow-y-auto rounded-2xl border border-white/15 bg-white/[0.06] p-4 md:p-6"
                >
                  {loadingList ? (
                    <p className="py-8 text-center font-instrument-sans text-sm text-white/60">
                      Loading…
                    </p>
                  ) : questions.length === 0 ? (
                    <p className="py-8 text-center font-instrument-sans text-white/60">
                      No published answers yet. Check back soon.
                    </p>
                  ) : (
                    <ul className="space-y-5">
                      {questions.map((q) => (
                        <li
                          key={q.id}
                          className="border-b border-white/10 pb-5 last:border-0 last:pb-0"
                        >
                          <p className="font-instrument-serif text-xl leading-snug text-white md:text-2xl">
                            {q.body}
                          </p>
                          <p className="mt-3 font-instrument-sans text-sm leading-relaxed text-white/70">
                            {q.answer}
                          </p>
                          {q.answered_at && (
                            <p className="mt-2 font-instrument-sans text-xs text-white/40">
                              Answered {formatDate(q.answered_at)}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AskQuestionSection;
