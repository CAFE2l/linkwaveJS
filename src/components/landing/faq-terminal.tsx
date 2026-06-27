"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const questions = [
  { q: "O que é o LinkWave?", a: "É uma plataforma que permite criar uma página única e compartilhável com todos os seus links. Ideal para perfis do Instagram, TikTok, cartões de visita digitais e muito mais." },
  { q: "É gratuito mesmo?", a: "Sim! O plano gratuito inclui tudo que você precisa para começar. Sem cartão de crédito, sem surpresas." },
  { q: "Posso personalizar a aparência?", a: "Com certeza. Você pode escolher cores, temas, fontes, posição do banner e muito mais. Sua página fica com a sua cara." },
  { q: "Funciona no celular?", a: "Sim! O LinkWave é 100% responsivo e otimizado para todos os dispositivos — celular, tablet e desktop." },
  { q: "Como compartilhar meus links?", a: "Você recebe um link único (seudominio.com/seuusuario) para colocar na bio do Instagram, WhatsApp, email, cartão de visita ou onde quiser." },
  { q: "Meus dados estão seguros?", a: "Sim. Utilizamos Supabase como banco de dados, com autenticação segura e criptografia. Seus dados são seus." },
];

function useTypewriter(text: string, speed: number = 25, enabled: boolean = true) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text);
      return;
    }
    indexRef.current = 0;
    setDisplayed("");

    timerRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed, enabled]);

  return displayed;
}

function Dot({ color }: { color: string }) {
  return (
    <span
      className="terminal-dot"
      style={{ background: color }}
    />
  );
}

function TerminalLine({ text, prefix = "$" }: { text: string; prefix?: string }) {
  const [revealed, setRevealed] = useState(false);
  const lineRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !doneRef.current) {
          doneRef.current = true;
          setRevealed(true);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const displayed = useTypewriter(text, 20, revealed);

  return (
    <div ref={lineRef} className="terminal-line">
      <span className="terminal-prompt">{prefix}</span>
      <span className="terminal-text">{displayed}</span>
      {revealed && displayed.length < text.length && (
        <span className="terminal-cursor" />
      )}
    </div>
  );
}

function AnswerBlock({ answer }: { answer: string }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !doneRef.current) {
          doneRef.current = true;
          setShow(true);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const displayed = useTypewriter(answer, 15, show);

  return (
    <div ref={ref} className="terminal-answer">
      <span className="terminal-prompt">{'>'}</span>
      <span className="terminal-answer-text">{displayed}</span>
      {show && displayed.length < answer.length && (
        <span className="terminal-cursor" />
      )}
    </div>
  );
}

export function FAQ() {
  const [selected, setSelected] = useState<number | null>(null);
  const [bootDone, setBootDone] = useState(false);
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setBootDone(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const handleQuestion = useCallback((i: number) => {
    setSelected((prev) => (prev === i ? null : i));
  }, []);

  return (
    <section className="mx-auto max-w-3xl px-5 py-20 md:py-28" id="faq">
      <div className="text-center mb-10">
        <span className="glass-tag">FAQ</span>
        <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl text-ocean">
          Dúvidas frequentes
        </h2>
        <p className="mt-3 text-base text-muted max-w-md mx-auto">
          Pergunte ao assistente LinkWave.
        </p>
      </div>

      <div className="terminal-container">
        {/* Title Bar */}
        <div className="terminal-titlebar">
          <div className="terminal-dots">
            <Dot color="#ff5f57" />
            <Dot color="#ffbd2e" />
            <Dot color="#28c840" />
          </div>
          <span className="terminal-title">linkwave ~ faq</span>
          <span className="terminal-title-spacer" />
        </div>

        {/* Body */}
        <div className="terminal-body">
          {/* Boot messages */}
          <TerminalLine text="Inicializando assistente LinkWave..." prefix="$" />
          {bootDone && (
            <>
              <TerminalLine text="Olá, eu sou o assistente LinkWave." prefix="$" />
              <TerminalLine text="Escolha uma pergunta abaixo:" prefix="$" />
              <div className="terminal-separator" />
            </>
          )}

          {/* Questions */}
          <div className="terminal-questions">
            {questions.map((item, i) => (
              <div key={i} className="terminal-q-wrap">
                <button
                  onClick={() => handleQuestion(i)}
                  className={`terminal-question ${selected === i ? "active" : ""}`}
                >
                  <span className="terminal-q-icon">{selected === i ? "▾" : "▸"}</span>
                  <span>{item.q}</span>
                </button>

                {selected === i && (
                  <div className="terminal-answer-wrap">
                    <AnswerBlock answer={item.a} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom cursor */}
          <div className="terminal-bottom-line">
            <span className="terminal-prompt">$</span>
            <span className="terminal-cursor blink" />
          </div>
        </div>
      </div>
    </section>
  );
}
