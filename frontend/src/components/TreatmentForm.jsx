import { useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const METHODS = ['Credit Card', 'Cash', 'Apple Pay'];

const TreatmentForm = ({ petId, setTreatments }) => {
  const { user } = useAuth();
  const empty = { date: '', description: '', vet: '', treatmentCost: '', medicineCost: '', paymentMethod: 'Cash' };
  
  // form data state for all input fields
  const [formData, setForm] = useState(empty);

  // update form state when any input field changes
  const onChange = (e) => setForm({ ...formData, [e.target.name]: e.target.value });

  // handle form submission for adding new treatment
  const handleSubmit = async (e) => {
    e.preventDefault();

    // require fields
    if (!formData.date || !formData.vet || !formData.treatmentCost || !formData.description) {
    alert('Please fill in all required fields.');
    return;
    };
    
    // prepare payload to convert costs to numbers and include medicineCost only if not empty
    try {
      const payload = {
        date: formData.date,
        description: formData.description,
        vet: formData.vet,
        treatmentCost: Number(formData.treatmentCost),
        paymentMethod: formData.paymentMethod,
        ...(formData.medicineCost !== '' ? { medicineCost: Number(formData.medicineCost) } : {}),
      };

      // send POST request to create treatment
      const { data: added } = await axiosInstance.post(
        `/api/pets/${petId}/treatment`,
        payload,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // update treatment list in local state
      setTreatments((prev) => ([...(prev || []), added]));
      
      // reset form
      setForm(empty);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to add treatment.';
      console.error('ADD treatment error:', err?.response ?? err);
      alert(msg);
    }
  };

  // render form UI for treatment creation
  return (
  <form
    onSubmit={handleSubmit}
    className="bg-gray-50 p-4 rounded border mb-4 grid gap-2 md:grid-cols-6"
  >
    {/* input fields */}
    <input
      type="date"
      name="date"
      value={formData.date}
      onChange={onChange}
      required
    />
    <input
      type="text"
      name="description"
      placeholder="Description"
      value={formData.description}
      onChange={onChange}
      required
    />
    <input
      type="text"
      name="vet"
      placeholder="Vet Name"
      value={formData.vet}
      onChange={onChange}
      required
    />
    <input
      type="number"
      step="0.01"
      name="treatmentCost"
      placeholder="Treatment Cost"
      value={formData.treatmentCost}
      onChange={onChange}
      required
    />
    <input
      type="number"
      step="0.01"
      name="medicineCost"
      placeholder="Medicine Cost"
      value={formData.medicineCost}
      onChange={onChange}
    />

    <select
        name="paymentMethod"
        value={formData.paymentMethod}
        onChange={onChange}
        required
        className="border rounded px-2 py-1"
        aria-label="Payment Method"
      >
        {METHODS.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

   {/* submit button */}
    <button
      type="submit"
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Add
    </button>
  </form>
);

};

export default TreatmentForm;
