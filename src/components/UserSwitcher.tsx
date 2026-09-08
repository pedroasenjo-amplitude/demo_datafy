import { useState } from 'react';

import { personas } from '../data/personas';
import { useUserStore } from '../store/useUserStore';

/** Selector de usuario simulado: resetea el userId y manda user properties. */
export function UserSwitcher(): JSX.Element {
  const [open, setOpen] = useState(false);
  const persona = useUserStore((s) => s.persona);
  const userId = useUserStore((s) => s.userId);
  const switchPersona = useUserStore((s) => s.switchPersona);

  return (
    <div className="relative">
      {open && (
        <ul className="absolute bottom-full left-0 z-20 mb-2 w-full overflow-hidden rounded-lg border border-white/10 bg-surface-raised shadow-2xl">
          {personas.map((candidate) => (
            <li key={candidate.id}>
              <button
                type="button"
                onClick={() => {
                  switchPersona(candidate);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-surface-hover"
              >
                <img
                  src={candidate.avatarUrl}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm text-neutral-100">
                    {candidate.name}
                  </span>
                  <span className="block text-xs text-neutral-400">
                    {candidate.plan} · {candidate.country} · {candidate.favoriteGenre}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
        }}
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-lg bg-surface-raised px-3 py-2 text-left transition hover:bg-surface-hover"
      >
        {persona === null ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs text-neutral-300">
            ?
          </span>
        ) : (
          <img
            src={persona.avatarUrl}
            alt=""
            className="h-8 w-8 rounded-full object-cover"
          />
        )}

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm text-neutral-100">
            {persona?.name ?? 'Usuario anonimo'}
          </span>
          <span className="block truncate font-mono text-[10px] text-neutral-500">
            {userId}
          </span>
        </span>

        <span aria-hidden="true" className="text-neutral-500">
          {open ? '▾' : '▸'}
        </span>
      </button>
    </div>
  );
}
