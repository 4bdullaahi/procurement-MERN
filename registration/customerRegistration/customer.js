// CustomerManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Button, Modal, Form, Container } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: { street: '', city: '', state: '', zipCode: '' },
  });

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/customer');
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/customer/${id}`);
      fetchCustomers();
      toast.error("Customer deleted successfully");
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setNewCustomerData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });
    setShowModal(true);
  };

  const handleUpdateCustomer = async () => {
    try {
      await axios.put(`http://localhost:5000/api/customer/${selectedCustomer._id}`, newCustomerData);
      setShowModal(false);
      fetchCustomers();
      toast.success("Customer updated successfully");
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleAddCustomer = async () => {
    try {
      await axios.post('http://localhost:5000/api/customer', newCustomerData);
      setShowAddModal(false);
      fetchCustomers();
      toast.success("Customer added successfully");
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { name: 'Name', selector: (row) => row.name, sortable: true },
    { name: 'Email', selector: (row) => row.email },
    { name: 'Phone', selector: (row) => row.phone },
    {
      name: 'Actions',
      cell: (row) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="outline-primary" size="sm" onClick={() => handleEdit(row)} style={buttonStyle}>
            Update
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row._id)} style={buttonStyle}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const buttonStyle = {
    padding: '8px 15px',
    borderRadius: '5px',
    fontWeight: 'bold',
    minWidth: '80px',
  };

  return (
    <Container className="my-5">
      <div className="text-center mb-4">
        <h2>Customer Management</h2>
      </div>
      <Button variant="primary" onClick={() => setShowAddModal(true)} style={{ float: 'right' }}>
        Add New Customer
      </Button>
      <input
        type="text"
        placeholder="Search Customers"
        value={searchTerm}
        onChange={handleSearch}
        className="form-control mb-3 mt-4"
      />
      <DataTable
        columns={columns}
        data={filteredCustomers}
        pagination
        highlightOnHover
        striped
        style={{
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          overflow: 'hidden',
        }}
        customStyles={{
          headCells: {
            style: {
              fontWeight: 'bold',
              backgroundColor: '#f7f7f7',
            },
          },
          cells: {
            style: {
              padding: '10px',
            },
          },
        }}
      />

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Modal for Updating Customer */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCustomerName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newCustomerData.name}
                onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formCustomerEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newCustomerData.email}
                onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formCustomerPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={newCustomerData.phone}
                onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleUpdateCustomer}>Update Customer</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Adding New Customer */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCustomerName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newCustomerData.name}
                onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formCustomerEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newCustomerData.email}
                onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formCustomerPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={newCustomerData.phone}
                onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formCustomerAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Street"
                value={newCustomerData.address.street}
                onChange={(e) => setNewCustomerData({ ...newCustomerData, address: { ...newCustomerData.address, street: e.target.value } })}
              />
              <Form.Control
                type="text"
                placeholder="City"
                value={newCustomerData.address.city}
                onChange={(e) => setNewCustomerData({ ...newCustomerData, address: { ...newCustomerData.address, city: e.target.value } })}
              />
              <Form.Control
                type="text"
                placeholder="State"
                value={newCustomerData.address.state}
                onChange={(e) => setNewCustomerData({ ...newCustomerData, address: { ...newCustomerData.address, state: e.target.value } })}
              />
              <Form.Control
                type="text"
                placeholder="Zip Code"
                value={newCustomerData.address.zipCode}
                onChange={(e) => setNewCustomerData({ ...newCustomerData, address: { ...newCustomerData.address, zipCode: e.target.value } })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddCustomer}>Add Customer</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CustomerManagement;
