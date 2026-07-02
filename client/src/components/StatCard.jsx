const accentClasses = {
  blue: 'bg-blue-50 text-blue-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  violet: 'bg-violet-50 text-violet-700',
};

function StatCard({ title, value, helper, accent = 'blue' }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <span
          className={`grid h-10 w-10 place-items-center rounded-xl text-sm font-bold ${
            accentClasses[accent] || accentClasses.blue
          }`}
        >
          {title.charAt(0)}
        </span>
      </div>
      {helper && <p className="mt-4 text-xs text-slate-500">{helper}</p>}
    </article>
  );
}

export default StatCard;
