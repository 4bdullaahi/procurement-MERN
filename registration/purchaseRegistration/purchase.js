// PurchaseManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';

const PurchaseManagement = () => {
  const [purchases, setPurchases] = useState([]);
  const [orders, setOrders] = useState([]); // State to store available orders for the dropdown
  const [newPurchase, setNewPurchase] = useState({
    orderId: '',
    supplierName: '',
    itemName: '',
    orderedQuantity: '',
    unitPrice: '',
    totalPrice: '',
    orderDate: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPurchases();
    fetchOrders();
  }, []);

  // Fetch all purchases
  const fetchPurchases = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/purchase');
      setPurchases(response.data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  // Fetch all orders for the dropdown
  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/order');
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Add a new purchase
  const handleAddPurchase = async () => {
    const totalPrice = newPurchase.orderedQuantity * newPurchase.unitPrice;
    try {
      const response = await axios.post('http://localhost:5000/api/purchase', { ...newPurchase, totalPrice });
      setPurchases([...purchases, response.data]);
      handleClose();
    } catch (error) {
      console.error("Error adding purchase:", error);
    }
  };

  // Set up the purchase to edit
  const handleEdit = (purchase) => {
    setNewPurchase(purchase);
    setEditingId(purchase._id);
    setShowModal(true);
  };

  // Update a purchase
  const handleUpdatePurchase = async () => {
    const totalPrice = newPurchase.orderedQuantity * newPurchase.unitPrice;
    try {
      const response = await axios.put(`http://localhost:5000/api/purchase/${editingId}`, { ...newPurchase, totalPrice });
      setPurchases(purchases.map(p => (p._id === editingId ? response.data : p)));
      handleClose();
    } catch (error) {
      console.error("Error updating purchase:", error);
    }
  };

  // Delete a purchase
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/purchase/${id}`);
      setPurchases(purchases.filter(p => p._id !== id));
    } catch (error) {
      console.error("Error deleting purchase:", error);
    }
  };

  // Handle submit for both add and update
  const handleSubmit = () => {
    if (editingId) {
      handleUpdatePurchase();
    } else {
      handleAddPurchase();
    }
  };

  // Close modal and reset form
  const handleClose = () => {
    setShowModal(false);
    setNewPurchase({
      orderId: '',
      supplierName: '',
      itemName: '',
      orderedQuantity: '',
      unitPrice: '',
      totalPrice: '',
      orderDate: ''
    });
    setEditingId(null);
  };

  return (
    <div className="container mt-5">
      <h2>Purchase Management</h2>
      <Button onClick={() => setShowModal(true)} variant="primary" className="my-3">Add New Purchase</Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Supplier Name</th>
            <th>Item Name</th>
            <th>Ordered Quantity</th>
            <th>Unit Price</th>
            <th>Total Price</th>
            <th>Order Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map(purchase => (
            <tr key={purchase._id}>
              {/* Display orderId as the specific property you want, like orderId._id */}
              <td>{purchase.orderId?._id || purchase.orderId}</td> 
              <td>{purchase.supplierName}</td>
              <td>{purchase.itemName}</td>
              <td>{purchase.orderedQuantity}</td>
              <td>{purchase.unitPrice}</td>
              <td>{purchase.totalPrice}</td>
              <td>{new Date(purchase.orderDate).toLocaleDateString()}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(purchase)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(purchase._id)} className="ml-2">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Add/Edit Purchase */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit Purchase' : 'Add Purchase'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formOrderId">
              <Form.Label>Order ID</Form.Label>
              <Form.Control
                as="select"
                value={newPurchase.orderId}
                onChange={(e) => setNewPurchase({ ...newPurchase, orderId: e.target.value })}
                required
              >
                <option value="">Select Order ID</option>
                {orders.map(order => (
                  <option key={order._id} value={order._id}>
                    {order._id} - {order.itemName} (Requested: {order.requestedQuantity})
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formSupplierName">
              <Form.Label>Supplier Name</Form.Label>
              <Form.Control 
                type="text" 
                value={newPurchase.supplierName} 
                onChange={(e) => setNewPurchase({ ...newPurchase, supplierName: e.target.value })} 
                placeholder="Enter supplier name" 
                required
              />
            </Form.Group>
            <Form.Group controlId="formItemName">
              <Form.Label>Item Name</Form.Label>
              <Form.Control 
                type="text" 
                value={newPurchase.itemName} 
                onChange={(e) => setNewPurchase({ ...newPurchase, itemName: e.target.value })} 
                placeholder="Enter item name" 
                required
              />
            </Form.Group>
            <Form.Group controlId="formOrderedQuantity">
              <Form.Label>Ordered Quantity</Form.Label>
              <Form.Control 
                type="number" 
                value={newPurchase.orderedQuantity} 
                onChange={(e) => setNewPurchase({ ...newPurchase, orderedQuantity: e.target.value })} 
                placeholder="Enter quantity ordered" 
                required
              />
            </Form.Group>
            <Form.Group controlId="formUnitPrice">
              <Form.Label>Unit Price</Form.Label>
              <Form.Control 
                type="number" 
                value={newPurchase.unitPrice} 
                onChange={(e) => setNewPurchase({ ...newPurchase, unitPrice: e.target.value })} 
                placeholder="Enter unit price" 
                required
              />
            </Form.Group>
            <Form.Group controlId="formOrderDate">
              <Form.Label>Order Date</Form.Label>
              <Form.Control 
                type="date" 
                value={newPurchase.orderDate} 
                onChange={(e) => setNewPurchase({ ...newPurchase, orderDate: e.target.value })} 
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingId ? 'Update Purchase' : 'Add Purchase'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PurchaseManagement;
