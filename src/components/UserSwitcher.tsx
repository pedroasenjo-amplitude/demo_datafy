import { useEffect, useRef, useState } from 'react';

import { personas } from '../data/personas';
import { useUserStore } from '../store/useUserStore';

/**
 * Avatar del top bar con el selector de usuario simulado. Cambiar de persona
 * resetea el userId y manda `identify` con sus user properties.
 */
export function UserSwitcher(): JSX.Element {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const persona = useUserStore((s) => s.persona);
  const userId = useUserStore((s) => s.userId);
  const switchPersona = useUserStore((s) => s.switchPersona);

  // Cerrar al hacer click fuera y con Escape, como cualquier menu de verdad.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent): void => {
      if (containerRef.current?.contains(event.target as Node) === false) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Cambiar de usuario simulado"
        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-surface-elevated ring-2 ring-black/40 transition hover:scale-105"
      >
        {persona === null ? (
          <span className="text-xs font-semibold text-subdued">?</span>
        ) : (
          <img src={persona.avatarUrl} alt="" className="h-full w-full object-cover" />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-md bg-surface-elevated p-1 shadow-2xl ring-1 ring-white/10"
        >
          <p className="px-3 pb-1 pt-2 text-[11px] uppercase tracking-wide text-subdued">
            Usuario simulado
          </p>

          {personas.map((candidate) => {
            const isActive = candidate.id === persona?.id;
            return (
              <button
                key={candidate.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  switchPersona(candidate);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded px-3 py-2 text-left transition hover:bg-surface-hover"
              >
                <img
                  src={candidate.avatarUrl}
                  alt=""
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span
                    className={`block truncate text-sm ${
                      isActive ? 'text-accent' : 'text-white'
                    }`}
                  >
                    {candidate.name}
                  </span>
                  <span className="block truncate text-xs text-subdued">
                    {candidate.plan} · {candidate.country} · {candidate.favoriteGenre}
                  </span>
                </span>
              </button>
            );
          })}

          <p className="mt-1 border-t border-white/10 px-3 py-2 font-mono text-[10px] text-subdued">
            {userId}
          </p>
        </div>
      )}
    </div>
  );
}
