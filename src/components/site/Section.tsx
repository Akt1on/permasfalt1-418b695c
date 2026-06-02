import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Section({ id, eyebrow, title, subtitle, children, className = "" }: {
  id?: string; eyebrow?: string; title?: ReactNode; subtitle?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <motion.section
      id={id}
      className={`py-20 md:py-28 ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container-x">
        {(eyebrow || title || subtitle) && (
          <div className="max-w-3xl mb-14">
            {eyebrow && <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">{eyebrow}</div>}
            {title && <h2 className="text-4xl md:text-5xl font-bold leading-[1.05]">{title}</h2>}
            {subtitle && <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </motion.section>
  );
}
