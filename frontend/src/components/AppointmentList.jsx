import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AppointmentList = ({ appointments, setAppointments, setEditingAppointment }) => {
  const { user } = useAuth();

  // handle deleting appointment
  const handleDelete = async (appointmentId) => {
    // alert user before delete
    if (!window.confirm('Delete this appointment?')) return;

    // if accept delete, send DELETE request
    try {
      await axiosInstance.delete(`/api/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      // remove the deleted appointment from local state
      setAppointments(prev => prev.filter(appt => appt._id !== appointmentId));
    } catch (error) {
      alert('Failed to delete appointment.');
    }
  };

  // show no appointments
  if (!appointments?.length) return <p>No appointments yet.</p>;

  // show appointment based on date
  const toTime = (d) => {
    const t = new Date(d).getTime();
    return Number.isNaN(t) ? Infinity : t;
  };
  const sortedAppointments = [...appointments].sort(
    (a, b) => toTime(a.date) - toTime(b.date)
  );

  // render the appointment cards
  return (
    <div className="grid gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
      {sortedAppointments.map((appt) => (
        <div
          key={appt._id}
          className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-md"
        >
          {/* icon */}
          <img
            src="/images/appointment.png"
            alt="Appointment"
            className="absolute right-6 top-6 h-12 w-12 object-contain opacity-90"
          />

          {/* header */}
          <h2 className="mb-3 text-lg font-extrabold tracking-tight">
            Pet: {appt.petId.name || appt.pet?.name || '—'}
          </h2>

          {/* info */}
          <div className="space-y-1 text-[15px]">
            <p className="text-gray-600">
              <span className="font-medium">Owner:</span>{' '}
              {appt.petId.owner.name || appt.owner?.name || '—'}{' '}
              {appt.petId.owner.phone || appt.owner?.phone ? (
                <> - {appt.petId.owner.phone || appt.owner?.phone}</>
              ) : null}
            </p>
            <p className="text-gray-500">
              <span className="font-medium">Date:</span>{' '}
              {appt.date
                ? new Date(appt.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
                : '—'}
            </p>
            {appt.description ? (
              <p className="pt-1 text-gray-700">{appt.description}</p>
            ) : null}
          </div>

          {/* button */}
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setEditingAppointment(appt)
              }}
              className="flex-1 rounded-xl bg-yellow-500 px-5 py-2.5 font-semibold text-white shadow hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDelete(appt._id)}
              className="flex-1 rounded-xl bg-red-500 px-5 py-2.5 font-semibold text-white shadow hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentList;
