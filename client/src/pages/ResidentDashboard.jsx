import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';

function ResidentDashboard() {
  return (
    <div className="space-y-7">
      <PageHeader
        title="Resident dashboard"
        description="Track payments, requests, and community updates."
        action={
          <button className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            Raise complaint
          </button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Maintenance due" value="₹3,500" helper="Due on 10 July" accent="amber" />
        <StatCard title="Open requests" value="2" helper="One update today" />
        <StatCard title="Expected visitors" value="3" helper="For today" accent="emerald" />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="text-lg font-semibold text-slate-900">Community notices</h2>
        <p className="mt-2 text-sm text-slate-500">
          New announcements and important society notices will appear here.
        </p>
      </section>
    </div>
  );
}

export default ResidentDashboard;
