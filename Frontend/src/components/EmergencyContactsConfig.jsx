import React, { useState, useEffect } from 'react';

const EmergencyContactsConfig = ({ userId, onClose }) => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phoneNumber: '',
    relationship: '',
    isPrimary: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

  useEffect(() => {
    fetchContacts();
  }, [userId]);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiBaseUrl}/emergency-contacts/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      } else {
        setError('Failed to fetch emergency contacts');
      }
    } catch (err) {
      setError('Network error while fetching contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phoneNumber || !newContact.relationship) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/emergency-contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newContact,
          userId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setContacts([...contacts, data]);
        setNewContact({ name: '', phoneNumber: '', relationship: '', isPrimary: false });
        setIsAdding(false);
        setSuccess('Emergency contact added successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to add emergency contact');
      }
    } catch (err) {
      setError('Network error while adding contact');
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!confirm('Are you sure you want to delete this emergency contact?')) {
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/emergency-contacts/${contactId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContacts(contacts.filter(c => c._id !== contactId));
        setSuccess('Emergency contact deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete emergency contact');
      }
    } catch (err) {
      setError('Network error while deleting contact');
    }
  };

  const togglePrimaryContact = async (contactId, isPrimary) => {
    try {
      const response = await fetch(`${apiBaseUrl}/emergency-contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPrimary: !isPrimary }),
      });

      if (response.ok) {
        fetchContacts(); // Refresh to show updated primary status
        setSuccess('Primary contact updated!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update primary contact');
      }
    } catch (err) {
      setError('Network error while updating contact');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Emergency Contacts</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          {/* Add Contact Form */}
          {isAdding && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Add New Emergency Contact</h3>
              <form onSubmit={handleAddContact} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter contact name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={newContact.phoneNumber}
                    onChange={(e) => setNewContact({...newContact, phoneNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., +1234567890"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship *
                  </label>
                  <select
                    value={newContact.relationship}
                    onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select relationship</option>
                    <option value="Family">Family</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPrimary"
                    checked={newContact.isPrimary}
                    onChange={(e) => setNewContact({...newContact, isPrimary: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="isPrimary" className="text-sm text-gray-700">
                    Make this my primary emergency contact
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
                  >
                    Add Contact
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setNewContact({ name: '', phoneNumber: '', relationship: '', isPrimary: false });
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Add Contact Button */}
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200 mb-6"
            >
              + Add Emergency Contact
            </button>
          )}

          {/* Contacts List */}
          {isLoading ? (
            <div className="text-center py-8">Loading contacts...</div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No emergency contacts added yet. Add your first contact above.
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Emergency Contacts</h3>
              {contacts.map((contact) => (
                <div
                  key={contact._id}
                  className={`p-4 border rounded-lg ${contact.isPrimary ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-800">{contact.name}</h4>
                        {contact.isPrimary && (
                          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{contact.phoneNumber}</p>
                      <p className="text-sm text-gray-500">{contact.relationship}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => togglePrimaryContact(contact._id, contact.isPrimary)}
                        className={`text-sm px-3 py-1 rounded ${
                          contact.isPrimary 
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        } transition duration-200`}
                      >
                        {contact.isPrimary ? 'Remove Primary' : 'Make Primary'}
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact._id)}
                        className="text-sm px-3 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300 transition duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Tips:</h4>
            <ul className="space-y-1">
              <li>• Add at least 2-3 emergency contacts for redundancy</li>
              <li>• Your primary contact will be called first in emergencies</li>
              <li>• Make sure phone numbers include country code (e.g., +1 for US)</li>
              <li>• Test your contacts occasionally to ensure they're reachable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactsConfig;