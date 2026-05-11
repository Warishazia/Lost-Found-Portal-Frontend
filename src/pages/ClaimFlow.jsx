import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/Api';

const ClaimFlow = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [myClaims, setMyClaims] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('claim');
  const [formData, setFormData] = useState({
    claimMessage: '',
    proofDescription: '',
    proofLocation: '',
    proofDate: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemRes, claimsRes, myClaimsRes] = await Promise.all([
          api.get(`/items/${itemId}`),
          api.get(`/claims/item/${itemId}`),
          api.get('/claims/my-claims'),
        ]);

        setItem(itemRes.data);
        setClaims(claimsRes.data.claims);
        setMyClaims(myClaimsRes.data.claims);
      } catch (err) {
        setError('Failed to load claim information');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [itemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.claimMessage || !formData.proofDescription) {
      setError('Claim message and proof description are required');
      return false;
    }
    return true;
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await api.post('/claims', {
        itemId,
        claimMessage: formData.claimMessage,
        proofDescription: formData.proofDescription,
        proofLocation: formData.proofLocation,
        proofDate: formData.proofDate,
      });

      alert('Claim submitted successfully!');
      setFormData({
        claimMessage: '',
        proofDescription: '',
        proofLocation: '',
        proofDate: '',
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit claim');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptClaim = async (claimId) => {
    if (window.confirm('Accept this claim?')) {
      try {
        await api.put(`/claims/${claimId}/accept`);
        alert('Claim accepted successfully!');
        navigate('/');
      } catch (err) {
        alert('Failed to accept claim');
      }
    }
  };

  const handleRejectClaim = async (claimId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason !== null) {
      try {
        await api.put(`/claims/${claimId}/reject`, { rejectionReason: reason });
        alert('Claim rejected successfully!');
        navigate('/');
      } catch (err) {
        alert('Failed to reject claim');
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const isOwner = item.postedBy._id === userId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="card mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">{item.title}</h1>
        <p className="text-gray-600">Manage claims for this item</p>
      </div>

      {}
      <div className="flex gap-4 mb-8 border-b">
        {!isOwner && (
          <button
            onClick={() => setTab('claim')}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              tab === 'claim'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Submit Claim
          </button>
        )}

        {!isOwner && (
          <button
            onClick={() => setTab('my-claims')}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              tab === 'my-claims'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            My Claims ({myClaims.length})
          </button>
        )}

        {isOwner && (
          <button
            onClick={() => setTab('received-claims')}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              tab === 'received-claims'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Received Claims ({claims.length})
          </button>
        )}
      </div>

      {}
      {tab === 'claim' && !isOwner && (
        <div className="card">
          <h2 className="text-2xl font-bold text-primary mb-6">Submit Your Claim</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmitClaim} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Why do you claim this item? *
              </label>
              <textarea
                name="claimMessage"
                value={formData.claimMessage}
                onChange={handleChange}
                className="input-field h-24 resize-none"
                placeholder="e.g., This is my iPhone. I lost it on..."
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Proof Description *
              </label>
              <textarea
                name="proofDescription"
                value={formData.proofDescription}
                onChange={handleChange}
                className="input-field h-24 resize-none"
                placeholder="Describe identifying features (IMEI, serial number, case condition, etc.)"
                disabled={submitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Where did you lose it?
                </label>
                <input
                  type="text"
                  name="proofLocation"
                  value={formData.proofLocation}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Library 2nd Floor"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  When did you lose it?
                </label>
                <input
                  type="date"
                  name="proofDate"
                  value={formData.proofDate}
                  onChange={handleChange}
                  className="input-field"
                  disabled={submitting}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary font-semibold py-3 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          </form>
        </div>
      )}

      {}
      {tab === 'my-claims' && !isOwner && (
        <div>
          {myClaims.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-600">You have no claims on items yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myClaims.map((claim) => (
                <div key={claim._id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-primary">
                        {claim.itemId.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Claimed: {new Date(claim.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        claim.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : claim.status === 'accepted'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-3">{claim.claimMessage}</p>

                  {claim.status === 'rejected' && claim.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-100 rounded-lg">
                      <p className="text-red-700 text-sm">
                        <span className="font-semibold">Rejection Reason:</span>{' '}
                        {claim.rejectionReason}
                      </p>
                    </div>
                  )}

                  {claim.status === 'accepted' && (
                    <div className="mt-3 p-3 bg-green-100 rounded-lg">
                      <p className="text-green-700 text-sm font-semibold">
                        ✅ Your claim was accepted! Item owner will contact you.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {}
      {tab === 'received-claims' && isOwner && (
        <div>
          {claims.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-600">No claims received yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {claims.map((claim) => (
                <div key={claim._id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-primary">
                        {claim.claimedBy.name}
                      </h3>
                      <p className="text-sm text-gray-500">{claim.claimedBy.email}</p>
                      {claim.claimedBy.phone && (
                        <p className="text-sm text-gray-500">📱 {claim.claimedBy.phone}</p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        claim.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : claim.status === 'accepted'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-3">
                    <span className="font-semibold">Claim:</span> {claim.claimMessage}
                  </p>

                  <p className="text-gray-700 mb-3">
                    <span className="font-semibold">Proof:</span>{' '}
                    {claim.proofDetails.description}
                  </p>

                  {claim.status === 'pending' && (
                    <div className="flex gap-4 mt-4">
                      <button
                        onClick={() => handleAcceptClaim(claim._id)}
                        className="flex-1 btn-primary"
                      >
                        Accept Claim
                      </button>
                      <button
                        onClick={() => handleRejectClaim(claim._id)}
                        className="flex-1 btn-outline"
                      >
                        Reject Claim
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClaimFlow;
