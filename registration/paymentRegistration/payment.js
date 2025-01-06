import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Button, Modal, Form, Container } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [newPaymentData, setNewPaymentData] = useState({
    orderId: '',
    amountPaid: '',
    paymentMethod: '',
    paymentStatus: 'Pending',
    transactionId: '',
    notes: '',
  });

  // Fetch payments on component mount
  useEffect(() => {
    fetchPayments();
  }, []);

const fetchPayments = async () =>{
  try{
    const response = await axios.get('http://localhost:5000/api/payment');
    setPayments(response.data);
  } catch{
    console.error("eror fetching payments : ", error);
  }
};

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/payment/${id}`);
      fetchPayments();
      toast.error("Payment deleted successfully");
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  const handleEdit = (payment) => {
    setSelectedPayment(payment);
    setNewPaymentData({
      orderId: payment.orderId,
      amountPaid: payment.amountPaid,
      paymentMethod: payment.paymentMethod,
      paymentStatus: payment.paymentStatus,
      transactionId: payment.transactionId,
      notes: payment.notes,
    });
    setShowModal(true);
  };

  const handleUpdatePayment = async () => {
    try {
      await axios.put(`http://localhost:5000/api/payment/${selectedPayment._id}`, newPaymentData);
      setShowModal(false);
      fetchPayments();
      toast.success("Payment updated successfully");
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  const handleAddPayment = async () => {
    try {
      await axios.post('http://localhost:5000/api/payments', newPaymentData);
      setShowAddModal(false);
      fetchPayments();
      toast.success("Payment added successfully");
    } catch (error) {
      console.error("Error adding payment:", error);
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredPayments = payments.filter((payment) =>
    payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { name: 'Order ID', selector: (row) => row.orderId, sortable: true },
    { name: 'Payment Date', selector: (row) => new Date(row.paymentDate).toLocaleDateString(), sortable: true },
    { name: 'Amount Paid', selector: (row) => `$${row.amountPaid.toFixed(2)}`, sortable: true },
    { name: 'Method', selector: (row) => row.paymentMethod },
    { name: 'Status', selector: (row) => row.paymentStatus, sortable: true },
    { name: 'Transaction ID', selector: (row) => row.transactionId || "N/A" },
    {
      name: 'Actions',
      cell: (row) => (
        <div style={{ display: 'flex', gap: '5px' }}>
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
        <h2>Payment Management</h2>
      </div>
      <Button variant="primary" onClick={() => setShowAddModal(true)} style={{ float: 'right' }}>
        Add New Payment
      </Button>
      <input
        type="text"
        placeholder="Search by Transaction ID"
        value={searchTerm}
        onChange={handleSearch}
        className="form-control mb-3 mt-4"
      />
      <DataTable
        columns={columns}
        data={filteredPayments}
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

      {/* Modal for Updating Payment */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formOrderId">
              <Form.Label>Order ID</Form.Label>
              <Form.Control
                type="text"
                value={newPaymentData.orderId}
                onChange={(e) => setNewPaymentData({ ...newPaymentData, orderId: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formAmountPaid">
              <Form.Label>Amount Paid</Form.Label>
              <Form.Control
                type="number"
                value={newPaymentData.amountPaid}
                onChange={(e) => setNewPaymentData({ ...newPaymentData, amountPaid: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formPaymentMethod">
              <Form.Label>Payment Method</Form.Label>
              <Form.Control
                as="select"
                value={newPaymentData.paymentMethod}
                onChange={(e) => setNewPaymentData({ ...newPaymentData, paymentMethod: e.target.value })}
              >
                <option value="">Select Payment Method</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Online Payment">Online Payment</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formPaymentStatus">
              <Form.Label>Payment Status</Form.Label>
              <Form.Control
                as="select"
                value={newPaymentData.paymentStatus}
                onChange={(e) => setNewPaymentData({ ...newPaymentData, paymentStatus: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formTransactionId">
              <Form.Label>Transaction ID</Form.Label>
              <Form.Control
                type="text"
                value={newPaymentData.transactionId}
                onChange={(e) => setNewPaymentData({ ...newPaymentData, transactionId: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formNotes">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newPaymentData.notes}
                onChange={(e) => setNewPaymentData({ ...newPaymentData, notes: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleUpdatePayment}>Update Payment</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Adding New Payment */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formOrderId">
              <Form.Label>Order ID</Form.Label>
              <Form.Control
                type="text"
                value={newPaymentData.orderId}
                onChange={(e) => setNewPaymentData({ ...newPaymentData, orderId                : e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formAmountPaid">
                <Form.Label>Amount Paid</Form.Label>
                <Form.Control
                  type="number"
                  value={newPaymentData.amountPaid}
                  onChange={(e) => setNewPaymentData({ ...newPaymentData, amountPaid: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formPaymentMethod">
                <Form.Label>Payment Method</Form.Label>
                <Form.Control
                  as="select"
                  value={newPaymentData.paymentMethod}
                  onChange={(e) => setNewPaymentData({ ...newPaymentData, paymentMethod: e.target.value })}
                >
                  <option value="">Select Payment Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Online Payment">Online Payment</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formPaymentStatus">
                <Form.Label>Payment Status</Form.Label>
                <Form.Control
                  as="select"
                  value={newPaymentData.paymentStatus}
                  onChange={(e) => setNewPaymentData({ ...newPaymentData, paymentStatus: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formTransactionId">
                <Form.Label>Transaction ID</Form.Label>
                <Form.Control
                  type="text"
                  value={newPaymentData.transactionId}
                  onChange={(e) => setNewPaymentData({ ...newPaymentData, transactionId: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formNotes">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newPaymentData.notes}
                  onChange={(e) => setNewPaymentData({ ...newPaymentData, notes: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
            <Button variant="primary" onClick={handleAddPayment}>Add Payment</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  };
  
  export default PaymentManagement;
  
