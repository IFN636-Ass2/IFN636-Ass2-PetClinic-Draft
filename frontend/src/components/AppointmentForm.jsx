import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';


const AppointmentForm = ({ 
  appointments, 
  setAppointments, 
  editingAppointment, 
  setEditingAppointment, 
  petId,
  canCreate = true }) => {
  const { user } = useAuth();
  const isEditing = !!editingAppointment;
  

  // form data state for all input fields
  const [formData, setFormData] = useState({
    petName: '',
    ownerName: '',
    ownerPhone: '',
    date: '',
    description: ''
  });

  // datetime
  const toLocalInputValue = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  };

  // populate form fields when editing an existing appointment
  useEffect(() => {
    if (editingAppointment) {
      setFormData({
        petName: editingAppointment.petId.name,
        ownerName: editingAppointment.petId.owner.name,
        ownerPhone: editingAppointment.petId.owner.phone,
        date: toLocalInputValue(editingAppointment.date), // prefill datetime-local
        description: editingAppointment.description,
      });
    } else {
      // if no appointment is being edited, reset form to empty values
      setFormData({ petName: '', ownerName: '', ownerPhone: '', date: '', description: '' });
    }
  }, [editingAppointment]);

  // handle form submission for creating or updating an appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

    // require fields
    // if (!formData.petName || !formData.ownerName || !formData.ownerPhone || !formData.date) {
    //   alert('Please fill in all required fields.');
    //   return;
    // }
    // convert datetime-local string to ISO before sending
    const payload = { ...formData, date: new Date(formData.date).toISOString() };
    try {
      // if edit appointment, send PUT request (update)
      if (editingAppointment) {
        // update existing appointment
        const response = await axiosInstance.put(`/api/appointments/${editingAppointment._id}`, payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        // update appointment in local state
        setAppointments(appointments.map((apt) => (apt._id === response.data._id ? response.data : apt)));
      }
      // if not, send POST request (create)
      else {
        // create new appointment
        const response = await axiosInstance.post('/api/appointments', { ...payload, petId }, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        console.log(response.data)

        // add new appointment to local state
        setAppointments([...appointments, response.data]);
      }

      // slear editing mode and reset form
      setEditingAppointment(null);
      setFormData({ petName: '', ownerName: '', ownerPhone: '', date: '', description: '' });
    } catch (error) {
      alert('Failed to save appointment.');
    }
  };
  
  if (!isEditing && !canCreate) return null;
  // return the form UI for creating or editing an appointment
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingAppointment ? 'Edit Appointment' : 'Add Appointment'}</h1>
      {/* input fields */}
      <input
        type="text"
        placeholder="Pet Name"
        value={formData.petName}
        onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        disabled={Boolean(editingAppointment)}

        hidden={!Boolean(editingAppointment)}
      />
      <input
        type="text"
        placeholder="Owner Name"
        value={formData.ownerName}
        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        disabled={Boolean(editingAppointment)}
        hidden={!Boolean(editingAppointment)}
      />
      <input
        type="text"
        placeholder="Owner Phone"
        value={formData.ownerPhone}
        onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        disabled={Boolean(editingAppointment)}
        hidden={!Boolean(editingAppointment)}
      />
      {/* Date & Time input */}
      <input
        type="datetime-local"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      {/* submit button: label changed based on create or edit mode */}
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
        {editingAppointment ? 'Update Appointment' : 'Add Appointment'}
      </button>
    </form>
  );
};

export default AppointmentForm;
