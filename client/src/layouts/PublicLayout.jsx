import { Outlet } from 'react-router-dom';

function PublicLayout() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="relative z-10 w-full max-w-md">
        <Outlet />
      </div>
    </main>
  );
}

export default PublicLayout;
