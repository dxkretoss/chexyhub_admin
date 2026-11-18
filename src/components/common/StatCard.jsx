import React from 'react';

export function StatCard({ title, value, change, icon: Icon, note }) {
  return (
    <div className="bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 p-5 sm:p-6 transition-all hover:border-black/30 dark:hover:border-white/30">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-stone-500">
          {title}
        </span>
        {Icon && (
          <div className="p-2 border border-black/10 dark:border-white/10 text-stone-600 dark:text-stone-300">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="font-serif text-2xl sm:text-3xl font-normal text-black dark:text-white">
          {value}
        </h3>
      </div>

      {(change || note) && (
        <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500 font-light border-t border-black/5 dark:border-white/5 pt-2.5">
          {change && (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              {change}
            </span>
          )}
          {note && <span>{note}</span>}
        </div>
      )}
    </div>
  );
}
