// VendorManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Button, Modal, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [newVendorData, setNewVendorData] = useState({ name: '', contactPerson: '', email: '', phone: '' });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vendor');
      setVendors(response.data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/vendor/${id}`);
      fetchVendors();
      toast.error("Vendor deleted successfully");
    } catch (error) {
      console.error("Error deleting vendor:", error);
    }
  };

  const handleEdit = (vendor) => {
    setSelectedVendor(vendor);
    setNewVendorData({ name: vendor.name, contactPerson: vendor.contactPerson, email: vendor.email, phone: vendor.phone });
    setShowModal(true);
  };

  const handleUpdateVendor = async () => {
    try {
      await axios.put(`http://localhost:5000/api/vendor/${selectedVendor._id}`, newVendorData);
      setShowModal(false);
      fetchVendors();
      toast.success("Vendor updated successfully");
    } catch (error) {
      console.error("Error updating vendor:", error);
    }
  };

  const handleAddVendor = async () => {
    try {
      await axios.post('http://localhost:5000/api/vendor', newVendorData);
      setShowAddModal(false);
      fetchVendors();
      toast.success("Vendor added successfully");
    } catch (error) {
      console.error("Error adding vendor:", error);
    }
  };

  const columns = [
    { name: 'Name', selector: (row) => row.name, sortable: true },
    { name: 'Contact Person', selector: (row) => row.contactPerson },
    { name: 'Email', selector: (row) => row.email },
    { name: 'Phone', selector: (row) => row.phone },
    {
      name: 'Actions',
      cell: (row) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="outline-warning" size="sm" style={buttonStyle} onClick={() => handleEdit(row)}>
            Update
          </Button>
          <Button variant="outline-danger" size="sm" style={buttonStyle} onClick={() => handleDelete(row._id)}>
            Delete
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // Custom button style
  const buttonStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '8px 15px',
    borderRadius: '5px',
    minWidth: '80px',
    transition: 'all 0.3s ease',
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div style={{ maxWidth: '1500px', width: '100%', padding: '15px', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}>
        <h2 className="mb-4 text-center">Vendor Management</h2>
        <Button variant="primary" className="mb-3" onClick={() => { setShowAddModal(true); setNewVendorData({ name: '', contactPerson: '', email: '', phone: '' }); }}>
          Add New Vendor
        </Button>
        <DataTable
          columns={columns}
          data={vendors}
          pagination
          highlightOnHover
        />

        {/* Notification Container */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

        {/* Modal for Updating Vendor */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Vendor</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formVendorName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newVendorData.name}
                  onChange={(e) => setNewVendorData({ ...newVendorData, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formContactPerson">
                <Form.Label>Contact Person</Form.Label>
                <Form.Control
                  type="text"
                  value={newVendorData.contactPerson}
                  onChange={(e) => setNewVendorData({ ...newVendorData, contactPerson: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formVendorEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={newVendorData.email}
                  onChange={(e) => setNewVendorData({ ...newVendorData, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formVendorPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={newVendorData.phone}
                  onChange={(e) => setNewVendorData({ ...newVendorData, phone: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
            <Button variant="primary" onClick={handleUpdateVendor}>Update Vendor</Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for Adding New Vendor */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Vendor</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formVendorName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newVendorData.name}
                  onChange={(e) => setNewVendorData({ ...newVendorData, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formContactPerson">
                <Form.Label>Contact Person</Form.Label>
                <Form.Control
                  type="text"
                  value={newVendorData.contactPerson}
                  onChange={(e) => setNewVendorData({ ...newVendorData, contactPerson: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formVendorEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={newVendorData.email}
                  onChange={(e) => setNewVendorData({ ...newVendorData, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formVendorPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={newVendorData.phone}
                  onChange={(e) => setNewVendorData({ ...newVendorData, phone: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
            <Button variant="primary" onClick={handleAddVendor}>Add Vendor</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default VendorManagement;
