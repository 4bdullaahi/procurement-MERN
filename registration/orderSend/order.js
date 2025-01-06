import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrashAlt, FaPlus, FaDollarSign } from 'react-icons/fa'; // Importing icons

const OrderManagement = () => {
    const [items, setItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [paymentData, setPaymentData] = useState({ paymentMethod: '', notes: '' });

    useEffect(() => {
        fetchItems();
        fetchOrders();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/item');
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/order');
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleAddItem = () => {
        setOrderItems([...orderItems, { item: '', quantity: 1, unitPrice: 0 }]);
    };

    const handleItemChange = (index, field, value) => {
        const updatedOrderItems = [...orderItems];
        if (field === 'item') {
            const selectedItem = items.find(item => item._id === value);
            updatedOrderItems[index] = {
                ...updatedOrderItems[index],
                item: value,
                unitPrice: selectedItem ? selectedItem.unitPrice : 0
            };
        } else if (field === 'quantity') {
            updatedOrderItems[index] = {
                ...updatedOrderItems[index],
                quantity: parseInt(value) || 1
            };
        }
        setOrderItems(updatedOrderItems);
        calculateTotal(updatedOrderItems);
    };

    const calculateTotal = (orderItems) => {
        const total = orderItems.reduce((sum, orderItem) => {
            return sum + (orderItem.unitPrice || 0) * (orderItem.quantity || 1);
        }, 0);
        setTotalAmount(total);
    };

    const handleSubmitOrder = async () => {
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/order/${selectedOrder._id}`, { items: orderItems, totalAmount });
                alert("Order updated successfully!");
            } else {
                const response = await axios.post('http://localhost:5000/api/order', { items: orderItems, totalAmount });
                setSelectedOrder(response.data);
                setShowPaymentModal(true);
                alert("Order created successfully!");
            }
            setShowModal(false);
            fetchOrders();
        } catch (error) {
            console.error("Error submitting order:", error);
        }
    };

    const handleEditOrder = (order) => {
        setSelectedOrder(order);
        setOrderItems(order.items);
        setTotalAmount(order.totalAmount);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            await axios.delete(`http://localhost:5000/api/order/${orderId}`);
            alert("Order deleted successfully!");
            fetchOrders();
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    const handleViewOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowOrderDetailsModal(true);
    };

    const handleSubmitPayment = async () => {
        try {
            await axios.post(`http://localhost:5000/api/payment`, {
                orderId: selectedOrder._id,
                amountPaid: totalAmount,
                paymentMethod: paymentData.paymentMethod,
                paymentStatus: 'Completed',
                notes: paymentData.notes
            });
            alert("Payment successful!");
            setShowPaymentModal(false);
            fetchOrders();
        } catch (error) {
            console.error("Error processing payment:", error);
        }
    };

    const columns = [
        { name: 'Order Date', selector: row => new Date(row.dateOrdered).toLocaleDateString(), sortable: true },
        { name: 'Status', selector: row => row.status || "N/A" },
        { name: 'Total Amount', selector: row => `$${(row.totalAmount || 0).toFixed(2)}`, sortable: true },
        {
            name: 'Actions',
            cell: (row) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="info" size="sm" onClick={() => handleViewOrderDetails(row)} style={{ borderRadius: '4px', padding: '5px 3px' }}>
                        <FaEye /> View
                    </Button>
                    <Button variant="success" size="sm" onClick={() => handleEditOrder(row)} style={{ borderRadius: '4px', padding: '12px 12px' }}>
                        <FaEdit /> Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteOrder(row._id)} style={{ borderRadius: '4px', padding: '13px 2px' }}>
                        <FaTrashAlt /> Delete
                    </Button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">Order Management</h2>
            <Button onClick={() => { setShowModal(true); setIsEditing(false); setOrderItems([]); setTotalAmount(0); }} variant="primary" className="mb-4" style={{ borderRadius: '4px', padding: '8px 16px' }}>
                <FaPlus /> Create New Order
            </Button>
            <DataTable columns={columns} data={orders} pagination highlightOnHover />

            {/* Modal for Creating or Editing Order */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? "Edit Order" : "Create New Order"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {orderItems.map((orderItem, index) => (
                            <div key={index} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Item</Form.Label>
                                    <Form.Control as="select" value={orderItem.item} onChange={(e) => handleItemChange(index, 'item', e.target.value)}>
                                        <option value="">Select an item</option>
                                        {items.map(item => (
                                            <option key={item._id} value={item._id}>
                                                {item.itemName} - ${item.unitPrice.toFixed(2)}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control type="number" value={orderItem.quantity} min="1" onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} />
                                </Form.Group>
                                <p>Subtotal: ${(orderItem.unitPrice * orderItem.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                        <Button variant="outline-primary" onClick={handleAddItem} style={{ borderRadius: '4px', padding: '4px 12px' }}><FaPlus /> Add Another Item</Button>
                        <Alert variant="info" className="mt-3">
                            <strong>Total Amount: </strong> ${totalAmount.toFixed(2)}
                        </Alert>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)} style={{ borderRadius: '4px', padding: '4px 12px' }}>Close</Button>
                    <Button variant="primary" onClick={handleSubmitOrder} style={{ borderRadius: '4px', padding: '4px 12px' }}>{isEditing ? "Update Order" : "Submit Order"}</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Payment */}
            {/* Modal for Payment */} 
            <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title><FaDollarSign /> Confirm Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Payment Method</Form.Label>
                            <Form.Control 
                                as="select" 
                                value={paymentData.paymentMethod} 
                                onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                            >
                                <option value="">Select Payment Method</option>
                                <option value="Cash">Cash</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Online Payment">Online Payment</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Notes</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={paymentData.notes}
                                onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                                placeholder="Additional payment details (optional)"
                            />
                        </Form.Group>
                    </Form>
                    <p className="mt-3"><strong>Total Amount:</strong> ${totalAmount.toFixed(2)}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPaymentModal(false)} style={{ borderRadius: '4px', padding: '4px 12px' }}>Close</Button>
                    <Button variant="success" onClick={handleSubmitPayment} style={{ borderRadius: '4px', padding: '4px 12px' }}>
                        <FaDollarSign /> Confirm Payment
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Displaying Order Details */}
            <Modal show={showOrderDetailsModal} onHide={() => setShowOrderDetailsModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title><FaEye /> Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <>
                            <p><strong>Order Date:</strong> {new Date(selectedOrder.dateOrdered).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> {selectedOrder.status}</p>
                            <p><strong>Total Amount:</strong> ${selectedOrder.totalAmount.toFixed(2)}</p>
                            <h5>Items:</h5>
                            <ul>
                                {selectedOrder.items.map((item, index) => (
                                    <li key={index} style={{ marginBottom: '10px' }}>
                                        <p><strong>Item Name:</strong> {item.itemName || item.item?.itemName}</p>
                                        <p><strong>Quantity:</strong> {item.quantity}</p>
                                        <p><strong>Unit Price:</strong> ${item.unitPrice ? item.unitPrice.toFixed(2) : "0.00"}</p>
                                        <p><strong>Subtotal:</strong> ${(item.unitPrice * item.quantity).toFixed(2)}</p>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowOrderDetailsModal(false)} style={{ borderRadius: '4px', padding: '4px 12px' }}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrderManagement;
