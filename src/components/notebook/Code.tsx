import type { ReactNode } from 'react'

const TOKEN =
  /(#.*$)|("[^"]*"|'[^']*')|\b(from|import|def|return|for|in|if|and|not|print|None|True|False)\b|\b(\d[\d_.]*)\b|([A-Za-z_]\w*)(?=\()/gm

/** Coloration syntaxique minimale, façon Python, pour le code des cellules. */
function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  for (const match of code.matchAll(TOKEN)) {
    const index = match.index ?? 0
    if (index > last) out.push(code.slice(last, index))
    const [text, comment, str, keyword, num, fn] = match
    const cls = comment ? 'tok-com' : str ? 'tok-str' : keyword ? 'tok-kw' : num ? 'tok-num' : fn ? 'tok-fn' : ''
    out.push(
      <span key={index} className={cls}>
        {text}
      </span>,
    )
    last = index + text.length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}

export function Code({ code, caret = false }: { code: string; caret?: boolean }) {
  return (
    <pre className="overflow-x-auto font-mono text-[13px] leading-6 text-paper sm:text-sm">
      <code>
        {highlight(code)}
        {caret && (
          <span aria-hidden="true" className="ml-px inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-accent" />
        )}
      </code>
    </pre>
  )
}
