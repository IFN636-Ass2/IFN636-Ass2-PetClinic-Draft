import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const TreatmentList = ({ petId, treatments, setTreatments }) => {
  const { user } = useAuth();

  // handle delete treatment
  const handleDelete = async (treatId) => {
    // alert user before delete
    if (!window.confirm('Delete this treatment?')) return;
    
    // if accept delete, send DELETE request
    try {
      const res = await axiosInstance.delete(`/api/pets/${petId}/treatment/${treatId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      // update treatment list after deletion
      setTreatments(res.data.treatments);
    } catch (err) {
      console.error('DELETE treatment error:', err);
      alert('Failed to delete treatment.');
    }
  };

  // if no treatments available, return no treatment
  if (!treatments || treatments.length === 0) {
    return <p>No treatments yet.</p>;
  };

  // render the treatment cards
  return (
    <div>
      {treatments.map((t) => (
        <div key={t._id} className="bg-gray-100 p-3 mb-2 rounded flex justify-between">
          {/* treatment information */}
          <div>
            <p><strong>Date:</strong> {new Date(t.date).toLocaleDateString()}</p>
            <p><strong>Description:</strong> {t.description}</p>
            <p><strong>Vet:</strong> {t.vet}</p>
            <p><strong>Treatment Cost:</strong> ${t.treatmentCost}</p>
            {t.medicineCost !== undefined && (
              <p><strong>Medicine Cost:</strong> ${t.medicineCost}</p>
            )}
            <p><strong>Payment surcharge:</strong> ${t.paymentFee}</p>
            <p><strong>Total Cost:</strong> ${t.totalCost}</p>
          </div>

          {/* delete button */}
          <button
            onClick={() => handleDelete(t._id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 h-fit"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default TreatmentList;
