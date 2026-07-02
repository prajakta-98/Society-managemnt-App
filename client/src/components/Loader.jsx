function Loader({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10" role="status">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-100 border-t-brand-600" />
      <span className="text-sm font-medium text-slate-600">{label}</span>
    </div>
  );
}

export default Loader;
