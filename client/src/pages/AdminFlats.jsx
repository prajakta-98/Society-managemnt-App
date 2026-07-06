import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../api/axios.js';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Loader from '../components/Loader.jsx';
import PageHeader from '../components/PageHeader.jsx';

const flatTypes = ['1BHK', '2BHK', '3BHK'];
const occupancyStatuses = ['VACANT', 'OCCUPIED'];
const inputClasses =
  'mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-50';

const emptyForm = {
  wing: '',
  flatNumber: '',
  floor: '',
  type: '1BHK',
  occupancyStatus: 'VACANT',
  ownerName: '',
  residentId: '',
};

function getResponseData(response) {
  return response.data?.data ?? response.data;
}

function getErrorMessage(error, fallback) {
  return error.response?.data?.message || error.message || fallback;
}

function getResidentId(residentId) {
  if (!residentId) return '';
  return typeof residentId === 'object' ? residentId._id || residentId.id || '' : residentId;
}

function Modal({ title, description, onClose, children }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div>
            <h2 id="modal-title" className="text-lg font-semibold text-slate-900">
              {title}
            </h2>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeWidth="2" d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FlatFormModal({ mode, flat, isSaving, error, onSave, onClose }) {
  const [form, setForm] = useState(() =>
    flat
      ? {
          wing: flat.wing || '',
          flatNumber: flat.flatNumber || '',
          floor: flat.floor ?? '',
          type: flat.type || '1BHK',
          occupancyStatus: flat.occupancyStatus || 'VACANT',
          ownerName: flat.ownerName || '',
          residentId: getResidentId(flat.residentId),
        }
      : emptyForm,
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave({
      ...form,
      wing: form.wing.trim(),
      flatNumber: form.flatNumber.trim(),
      floor: Number(form.floor),
      ownerName: form.ownerName.trim(),
      residentId: form.residentId.trim() || null,
    });
  }

  const isEditing = mode === 'edit';

  return (
    <Modal
      title={isEditing ? 'Edit flat' : 'Create flat'}
      description={
        isEditing
          ? `Update the details for ${flat.wing}-${flat.flatNumber}.`
          : 'Add a new flat to the society directory.'
      }
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          {error && <div className="sm:col-span-2"><ErrorMessage message={error} /></div>}

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Wing</span>
            <input
              autoFocus
              required
              name="wing"
              value={form.wing}
              onChange={handleChange}
              disabled={isSaving}
              placeholder="A"
              className={inputClasses}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Flat number</span>
            <input
              required
              name="flatNumber"
              value={form.flatNumber}
              onChange={handleChange}
              disabled={isSaving}
              placeholder="101"
              className={inputClasses}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Floor</span>
            <input
              required
              type="number"
              step="1"
              name="floor"
              value={form.floor}
              onChange={handleChange}
              disabled={isSaving}
              placeholder="1"
              className={inputClasses}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Flat type</span>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              disabled={isSaving}
              className={inputClasses}
            >
              {flatTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Occupancy status</span>
            <select
              name="occupancyStatus"
              value={form.occupancyStatus}
              onChange={handleChange}
              disabled={isSaving}
              className={inputClasses}
            >
              {occupancyStatuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Owner name</span>
            <input
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              disabled={isSaving}
              placeholder="Optional"
              className={inputClasses}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Resident ID</span>
            <input
              name="residentId"
              value={form.residentId}
              onChange={handleChange}
              disabled={isSaving}
              placeholder="Optional resident ObjectId"
              className={inputClasses}
            />
          </label>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : isEditing ? 'Save changes' : 'Create flat'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function DeleteConfirmation({ flat, isDeleting, error, onConfirm, onClose }) {
  return (
    <Modal
      title="Delete flat?"
      description="This action cannot be undone."
      onClose={onClose}
    >
      <div className="p-5 sm:p-6">
        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
        <p className="text-sm leading-6 text-slate-600">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-slate-900">Flat {flat.wing}-{flat.flatNumber}</span>?
        </p>
      </div>
      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? 'Deleting...' : 'Delete flat'}
        </button>
      </div>
    </Modal>
  );
}

function StatusBadge({ status }) {
  const isOccupied = status === 'OCCUPIED';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isOccupied ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isOccupied ? 'bg-blue-500' : 'bg-emerald-500'}`} />
      {status}
    </span>
  );
}

function AdminFlats() {
  const [flats, setFlats] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [formModal, setFormModal] = useState(null);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [flatToDelete, setFlatToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFlats = useCallback(async (signal) => {
    setIsLoading(true);
    setLoadError('');
    try {
      const response = await api.get('/flats', { signal });
      const data = getResponseData(response);
      setFlats(Array.isArray(data) ? data : []);
    } catch (error) {
      if (error.code !== 'ERR_CANCELED') {
        setLoadError(getErrorMessage(error, 'Unable to load flats.'));
      }
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchFlats(controller.signal);
    return () => controller.abort();
  }, [fetchFlats]);

  const filteredFlats = useMemo(() => {
    const query = search.trim().toLowerCase();
    return flats.filter((flat) => {
      const matchesSearch =
        !query ||
        String(flat.wing || '').toLowerCase().includes(query) ||
        String(flat.flatNumber || '').toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'ALL' || flat.occupancyStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [flats, search, statusFilter]);

  function openCreateModal() {
    setFormError('');
    setFormModal({ mode: 'create', flat: null });
  }

  function openEditModal(flat) {
    setFormError('');
    setFormModal({ mode: 'edit', flat });
  }

  function closeFormModal() {
    if (!isSaving) setFormModal(null);
  }

  async function handleSave(payload) {
    setIsSaving(true);
    setFormError('');
    try {
      if (formModal.mode === 'create') {
        const response = await api.post('/flats', payload);
        const createdFlat = getResponseData(response);
        setFlats((current) => [createdFlat, ...current]);
      } else {
        const response = await api.patch(`/flats/${formModal.flat._id}`, payload);
        const updatedFlat = getResponseData(response);
        setFlats((current) =>
          current.map((flat) => (flat._id === updatedFlat._id ? updatedFlat : flat)),
        );
      }
      setFormModal(null);
    } catch (error) {
      setFormError(getErrorMessage(error, 'Unable to save the flat.'));
    } finally {
      setIsSaving(false);
    }
  }

  function openDeleteConfirmation(flat) {
    setDeleteError('');
    setFlatToDelete(flat);
  }

  function closeDeleteConfirmation() {
    if (!isDeleting) setFlatToDelete(null);
  }

  async function handleDelete() {
    setIsDeleting(true);
    setDeleteError('');
    try {
      await api.delete(`/flats/${flatToDelete._id}`);
      setFlats((current) => current.filter((flat) => flat._id !== flatToDelete._id));
      setFlatToDelete(null);
    } catch (error) {
      setDeleteError(getErrorMessage(error, 'Unable to delete the flat.'));
    } finally {
      setIsDeleting(false);
    }
  }

  function resetFilters() {
    setSearch('');
    setStatusFilter('ALL');
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Flats"
        description="Manage flat details, ownership, and occupancy status."
        action={
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            <span className="text-lg leading-none">+</span>
            Add flat
          </button>
        }
      />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="grid gap-3 border-b border-slate-200 p-4 sm:grid-cols-[minmax(0,1fr)_220px] sm:p-5">
          <label className="relative block">
            <span className="sr-only">Search flats</span>
            <svg
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by wing or flat number"
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
          </label>

          <label>
            <span className="sr-only">Filter by occupancy status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            >
              <option value="ALL">All occupancy statuses</option>
              {occupancyStatuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
        </div>

        {isLoading ? (
          <Loader label="Loading flats" />
        ) : loadError ? (
          <div className="p-5 sm:p-6"><ErrorMessage message={loadError} onRetry={() => fetchFlats()} /></div>
        ) : flats.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-xl text-slate-500">⌂</div>
            <h2 className="mt-4 font-semibold text-slate-900">No flats added yet</h2>
            <p className="mt-1 text-sm text-slate-500">Create the first flat in your society directory.</p>
            <button type="button" onClick={openCreateModal} className="mt-5 text-sm font-semibold text-brand-600 hover:text-brand-700">
              Add your first flat
            </button>
          </div>
        ) : filteredFlats.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <h2 className="font-semibold text-slate-900">No matching flats</h2>
            <p className="mt-1 text-sm text-slate-500">Try a different search or occupancy filter.</p>
            <button type="button" onClick={resetFilters} className="mt-4 text-sm font-semibold text-brand-600 hover:text-brand-700">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead className="bg-slate-50">
                  <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3.5">Flat</th>
                    <th className="px-5 py-3.5">Floor</th>
                    <th className="px-5 py-3.5">Type</th>
                    <th className="px-5 py-3.5">Owner</th>
                    <th className="px-5 py-3.5">Resident ID</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFlats.map((flat) => (
                    <tr key={flat._id} className="text-sm text-slate-600 hover:bg-slate-50/70">
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">{flat.wing}-{flat.flatNumber}</td>
                      <td className="whitespace-nowrap px-5 py-4">{flat.floor}</td>
                      <td className="whitespace-nowrap px-5 py-4">{flat.type}</td>
                      <td className="whitespace-nowrap px-5 py-4">{flat.ownerName || '—'}</td>
                      <td className="max-w-48 truncate px-5 py-4 font-mono text-xs" title={getResidentId(flat.residentId)}>
                        {getResidentId(flat.residentId) || '—'}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4"><StatusBadge status={flat.occupancyStatus} /></td>
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => openEditModal(flat)} className="rounded-lg px-2.5 py-1.5 font-semibold text-brand-600 hover:bg-brand-50 hover:text-brand-700">Edit</button>
                          <button type="button" onClick={() => openDeleteConfirmation(flat)} className="rounded-lg px-2.5 py-1.5 font-semibold text-red-600 hover:bg-red-50 hover:text-red-700">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-200 px-5 py-3 text-sm text-slate-500">
              Showing {filteredFlats.length} of {flats.length} flats
            </div>
          </>
        )}
      </section>

      {formModal && (
        <FlatFormModal
          key={`${formModal.mode}-${formModal.flat?._id || 'new'}`}
          mode={formModal.mode}
          flat={formModal.flat}
          isSaving={isSaving}
          error={formError}
          onSave={handleSave}
          onClose={closeFormModal}
        />
      )}

      {flatToDelete && (
        <DeleteConfirmation
          flat={flatToDelete}
          isDeleting={isDeleting}
          error={deleteError}
          onConfirm={handleDelete}
          onClose={closeDeleteConfirmation}
        />
      )}
    </div>
  );
}

export default AdminFlats;
