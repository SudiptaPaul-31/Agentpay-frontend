import { type HTMLAttributes, type ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: ReactNode;
  footer?: ReactNode;
};

export function Card({ title, footer, children, className = "", ...rest }: CardProps) {
  return (
    <section
      className={`rounded-lg border border-zinc-200 p-4 dark:border-zinc-800 ${className}`}
      {...rest}
    >
      {title && <header className="mb-2 font-medium">{title}</header>}
      <div>{children}</div>
      {footer && (
        <footer className="mt-3 border-t border-zinc-100 pt-3 text-xs text-zinc-500 dark:border-zinc-800">
          {footer}
        </footer>
      )}
    </section>
  );
}
