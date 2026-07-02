import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';

function AdminDashboard() {
  return (
    <div className="space-y-7">
      <PageHeader
        title="Admin dashboard"
        description="A quick view of your society's operations and collections."
        action={
          <button className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            Add announcement
          </button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total residents" value="248" helper="12 joined this month" />
        <StatCard title="Collected dues" value="₹4.8L" helper="92% collection rate" accent="emerald" />
        <StatCard title="Open complaints" value="14" helper="4 need attention" accent="amber" />
        <StatCard title="Active visitors" value="23" helper="Currently inside" accent="violet" />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="text-lg font-semibold text-slate-900">Recent activity</h2>
        <p className="mt-2 text-sm text-slate-500">
          Society updates, payments, and service requests will appear here.
        </p>
      </section>
    </div>
  );
}

export default AdminDashboard;
