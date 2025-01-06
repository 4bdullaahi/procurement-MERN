import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderManagement = () => {
    const [items, setItems] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [completedOrders, setCompletedOrders] = useState([]); // For storing the report data

    // Fetch items for the dropdown selection
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/item'); // Replace with your actual API endpoint
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };
        fetchItems();
    }, []);

    // Update total amount when order items change
    useEffect(() => {
        const total = orderItems.reduce((acc, item) => acc + item.total, 0);
        setTotalAmount(total);
    }, [orderItems]);

    const handleAddItem = () => {
        if (!selectedItem) return;

        const existingItem = items.find(item => item._id === selectedItem);
        if (!existingItem) return;

        const itemTotal = quantity * existingItem.unitPrice;
        const newItem = { ...existingItem, quantity, total: itemTotal };
        setOrderItems([...orderItems, newItem]);
        setSelectedItem(null);
        setQuantity(1);
    };

    const submitOrder = () => {
        setShowPaymentModal(true);
    };

    const submitPayment = () => {
        setShowPaymentModal(false);
        setShowSummaryModal(true);

        // Save order to the report table after payment
        const completedOrder = {
            items: orderItems,
            totalAmount,
            paymentMethod,
            date: new Date().toLocaleDateString()
        };
        setCompletedOrders([...completedOrders, completedOrder]); // Add completed order to report data
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Order Management</h2>

            {/* Order Section */}
            <div style={styles.form}>
                <select
                    value={selectedItem || ''}
                    onChange={(e) => setSelectedItem(e.target.value)}
                    style={styles.input}
                >
                    <option value="" disabled>Select Item</option>
                    {items.map(item => (
                        <option key={item._id} value={item._id}>
                            {item.itemName} - ${item.unitPrice} (In stock: {item.stockQuantity})
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    style={styles.input}
                    min="1"
                />
                <button onClick={handleAddItem} style={styles.button}>Add Item</button>
            </div>

            {/* Order Items Table */}
            <div style={styles.tableContainer}>
                <h3>Order Report</h3>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderItems.map((item, index) => (
                            <tr key={index}>
                                <td>{item.itemName}</td>
                                <td>{item.quantity}</td>
                                <td>${item.unitPrice.toFixed(2)}</td>
                                <td>${item.total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="3"><strong>Total Amount</strong></td>
                            <td><strong>${totalAmount.toFixed(2)}</strong></td>
                        </tr>
                    </tfoot>
                </table>
                {orderItems.length > 0 && (
                    <button onClick={submitOrder} style={styles.button}>Submit Order</button>
                )}
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>Payment</h3>
                        <p>Total Amount Due: ${totalAmount.toFixed(2)}</p>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            style={styles.input}
                        >
                            <option value="" disabled>Select Payment Method</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Cash">Cash</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                        <button onClick={submitPayment} style={styles.button}>Submit Payment</button>
                    </div>
                </div>
            )}

            {/* Summary Modal */}
            {showSummaryModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>Order Summary</h3>
                        <ul>
                            {orderItems.map((item, index) => (
                                <li key={index}>
                                    {item.itemName} - {item.quantity} x ${item.unitPrice.toFixed(2)} = ${item.total.toFixed(2)}
                                </li>
                            ))}
                        </ul>
                        <p>Total Payment: ${totalAmount.toFixed(2)}</p>
                        <p>Payment Method: {paymentMethod}</p>
                        <button onClick={() => setShowSummaryModal(false)} style={styles.button}>Close</button>
                    </div>
                </div>
            )}

            {/* Report Table */}
            <div style={styles.tableContainer}>
                <h3>Completed Orders</h3>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total Amount</th>
                            <th>Payment Method</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completedOrders.map((order, index) => (
                            <tr key={index}>
                                <td>{order.date}</td>
                                <td>
                                    {order.items.map((item, idx) => (
                                        <div key={idx}>{item.itemName} - {item.quantity} x ${item.unitPrice.toFixed(2)}</div>
                                    ))}
                                </td>
                                <td>${order.totalAmount.toFixed(2)}</td>
                                <td>{order.paymentMethod}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Inline Styles
const styles = {
    container: { fontFamily: 'Arial, sans-serif', margin: '20px' },
    heading: { marginBottom: '20px', color: '#333' },
    form: { marginBottom: '20px' },
    input: { display: 'block', margin: '10px 0', padding: '10px', width: '100%', maxWidth: '300px' },
    button: { padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', marginTop: '10px' },
    tableContainer: { marginTop: '20px' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
    modal: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', maxWidth: '400px', width: '90%', textAlign: 'center' },
};

export default OrderManagement;
