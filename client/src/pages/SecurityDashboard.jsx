import ErrorMessage from '../components/ErrorMessage.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';

function SecurityDashboard() {
  return (
    <div className="space-y-7">
      <PageHeader
        title="Security dashboard"
        description="Monitor visitor movement and gate activity."
        action={
          <button className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            Add visitor
          </button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Visitors inside" value="23" helper="7 entered this hour" />
        <StatCard title="Expected today" value="18" helper="6 pending arrival" accent="emerald" />
        <StatCard title="Pending approval" value="4" helper="Resident confirmation needed" accent="amber" />
      </section>

      <ErrorMessage message="Emergency alerts and gate incidents will be displayed in this area." />
    </div>
  );
}

export default SecurityDashboard;
