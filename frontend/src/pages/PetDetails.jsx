// PetDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import TreatmentForm from '../components/TreatmentForm';
import TreatmentList from '../components/TreatmentList';

const PetDetails = () => {
  const { petId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // state for pet info, treatments, edit mode, and form data
  const [pet, setPet] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: '',
    owner: { name: '', phone: '', email: '' },
  });

  // fetch pet details from API when component mounts or petId changes
  useEffect(() => {
    const fetchPet = async () => {
      try {
        // send GET request to get pet inffo by id
        const res = await axiosInstance.get(`/api/pets/${petId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPet(res.data);
        setTreatments(res.data.treatments || []);
        // prefilling form
        setForm({
          name: res.data.name || '',
          species: res.data.species || '',
          breed: res.data.breed || '',
          age: res.data.age ?? '',
          gender: res.data.gender || '',
          owner: {
            name: res.data.owner?.name || '',
            phone: res.data.owner?.phone || '',
            email: res.data.owner?.email || '',
          },
        });
      } catch (err) {
        alert('Failed to fetch pet details.');
      }
    };

    if (user?.token) fetchPet();
  }, [petId, user]);

  // handle form input changes (including nested owner fields)
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('owner.')) {
      const k = name.split('.')[1];
      setForm((f) => ({ ...f, owner: { ...f.owner, [k]: value } }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  // save updated pet details
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name.trim(),
        species: form.species.trim(),
        breed: form.breed.trim() || undefined,
        age: form.age === '' ? undefined : Number(form.age),
        gender: form.gender || undefined,
        owner: {
          name: form.owner.name.trim(),
          phone: form.owner.phone.trim(),
          email: form.owner.email.trim() || undefined,
        },
      };
      // send PUT request to update pet
      const res = await axiosInstance.put(`/api/pets/${petId}`, payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      // update pets in local state
      setPet(res.data);
      setEditing(false);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||        // <-- backend message
        err?.response?.data?.error ||
        'Update failed. Please try again.';
      alert(msg);
      console.log('Update pet error:', err?.response?.data);
    }
  };

  if (!pet) return <p>Loading...</p>;

  // render UI for pet details page
  return (
    <div className="container mx-auto px-4 py-8 mb-5 mt-5">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/pets')}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Back
        </button>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Edit Info
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              form="pet-edit-form"
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Save
            </button>
            <button
              onClick={() => {
                // reset form back to pet values and exit edit mode
                setForm({
                  name: pet.name || '',
                  species: pet.species || '',
                  breed: pet.breed || '',
                  age: pet.age ?? '',
                  gender: pet.gender || '',
                  owner: {
                    name: pet.owner?.name || '',
                    phone: pet.owner?.phone || '',
                    email: pet.owner?.email || '',
                  },
                });
                setEditing(false);
              }}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Info section */}
      {!editing ? (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Pet info card */}
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Pet info</h2>
            <p className="mb-2"><strong>Name:</strong> {pet.name || ''}</p>
            <p className="mb-2"><strong>Species:</strong> {pet.species || ''}</p>
            <p className="mb-2"><strong>Breed:</strong> {pet.breed || ''}</p>
            <p className="mb-2"><strong>Gender:</strong> {pet.gender || ''}</p>
            <p><strong>Age:</strong> {pet.age ?? ''}</p>
          </div>

          {/* Owner info card */}
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Owner info</h2>
            <p className="mb-2"><strong>Name:</strong> {pet.owner?.name || ''}</p>
            <p className="mb-2"><strong>Phone Number:</strong> {pet.owner?.phone || ''}</p>
            <p><strong>Email Address:</strong> {pet.owner?.email || ''}</p>
          </div>

          {/* Pet image card */}
          <div className="w-full md:w-64 flex items-center justify-center rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <img
              src={`/images/pet2.png` || '/images/pets/default.jpg'}
              alt={pet.name || 'Pet'}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

      ) : (
        <form
          id="pet-edit-form"
          onSubmit={handleSave}
          className="bg-white border border-gray-200 rounded-xl p-4 grid gap-3 md:grid-cols-2 mt-2"
        >
          {/* Pet fields */}
          <div className="grid gap-2">
            <label className="font-semibold">Pet Information</label>
            <input
              className="border rounded px-3 py-2"
              placeholder="Name"
              name="name"
              value={form.name}
              onChange={onChange}
              required
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Species"
              name="species"
              value={form.species}
              onChange={onChange}
              required
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Breed"
              name="breed"
              value={form.breed}
              onChange={onChange}
            />
            <div className="flex gap-2">
              <input
                type="number"
                className="border rounded px-3 py-2 w-1/2"
                placeholder="Age"
                name="age"
                value={form.age}
                onChange={onChange}
                min="0"
              />
              <select
                className="border rounded px-3 py-2 w-1/2"
                name="gender"
                value={form.gender}
                onChange={onChange}
              >
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Owner fields */}
          <div className="grid gap-2">
            <label className="font-semibold">Owner Information</label>
            <input
              className="border rounded px-3 py-2"
              placeholder="Owner Name"
              name="owner.name"
              value={form.owner.name}
              onChange={onChange}
              required
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Owner Phone"
              name="owner.phone"
              value={form.owner.phone}
              onChange={onChange}
              required
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Owner Email"
              name="owner.email"
              value={form.owner.email}
              onChange={onChange}
              type="email"
            />
          </div>
        </form>
      )}
      {/* Appointment */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => navigate(`/pets/${petId}/appointments`)}
          className="inline-flex items-center gap-2 rounded px-4 py-2
               bg-red-500 text-white hover:bg-red-600
               focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
               disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Open appointments"
          disabled={!petId}
          title={petId ? "View appointments" : "Missing pet id"}
        >
          Appointment
        </button>
      </div>

      {/* Treatments */}
      <h2 className="text-xl font-bold mt-6 mb-2">Treatments</h2>
      <TreatmentForm petId={petId} treatments={treatments} setTreatments={setTreatments} />
      <TreatmentList petId={petId} treatments={treatments} setTreatments={setTreatments} />
    </div>
  );
};

export default PetDetails;
