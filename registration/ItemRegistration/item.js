// ItemManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Button, Modal, Form, Container } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ItemManagement = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [newItem, setNewItem] = useState({
        itemName: '',
        stockQuantity: '',
        unitPrice: '',
        category: '',
        vendor: '',
        description: '',
    });

    useEffect(() => {
        fetchItems();
        fetchCategories();
        fetchVendors();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/item');
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const fetchCategories = async () =>{
        try{
            const response = await axios.get('http://localhost:5000/api/categories');
            setCategories(response.data);
        } catch{
            consol.error("error fetching categories: ",error);
        }
    };
    const fetchVendors = async ()=>{
        try{
            const response = await axios.get('http://localhost:5000/api/vendor');
            setVendors(response.data);
        } catch {
            consol.error("error fetching vendros : ",erorr);
        }
    };

    const handleAddItem = async () => {
        try {
            await axios.post('http://localhost:5000/api/item', newItem);
            fetchItems();
            setShowModal(false);
            toast.success("Item added successfully");
        } catch (error) {
            console.error("Error adding item:", error);
            toast.error("Failed to add item");
        }
    };

    const handleUpdateItem = async () => {
        try {
            await axios.put(`http://localhost:5000/api/item/${selectedItem._id}`, newItem);
            fetchItems();
            setShowModal(false);
            toast.success("Item updated successfully");
        } catch (error) {
            console.error("Error updating item:", error);
            toast.error("Failed to update item");
        }
    };

    const handleDeleteItem = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/item/${id}`);
            fetchItems();
            toast.error("Item deleted successfully");
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Failed to delete item");
        }
    };

    const openModal = (item = null) => {
        setIsEditing(!!item);
        setSelectedItem(item);
        setNewItem(
            item
                ? { ...item, category: item.category?._id || '', vendor: item.vendor?._id || '' }
                : {
                      itemName: '',
                      stockQuantity: '',
                      unitPrice: '',
                      category: '',
                      vendor: '',
                      description: '',
                  }
        );
        setShowModal(true);
    };

    const handleSave = () => {
        if (isEditing) {
            handleUpdateItem();
        } else {
            handleAddItem();
        }
    };

    const columns = [
        { name: 'Item Name', selector: (row) => row.itemName, sortable: true },
        { name: 'Stock Quantity', selector: (row) => row.stockQuantity },
        { name: 'Unit Price', selector: (row) => row.unitPrice },
        { name: 'Category', selector: (row) => row.category?.name || '' },
        { name: 'Vendor', selector: (row) => row.vendor?.name || '' },
        {
            name: 'Actions',
            cell: (row) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button variant="outline-primary" size="sm" onClick={() => openModal(row)} style={buttonStyle}>
                        Update
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteItem(row._id)} style={buttonStyle}>
                        Delete
                    </Button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const buttonStyle = {
        padding: '8px 15px',
        borderRadius: '5px',
        minWidth: '80px',
        fontWeight: 'bold',
        transition: 'all 0.3s ease',
    };

    return (
        <Container className="my-5">
            <div className="text-center mb-4">
                <h2>Item Management</h2>
            </div>
            <Button variant="primary" className="mb-3" onClick={() => openModal()} style={{ float: 'right' }}>
                Add New Item
            </Button>
            <DataTable
                columns={columns}
                data={items}
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

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Update Item' : 'Add New Item'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formItemName">
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newItem.itemName}
                                onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formStockQuantity">
                            <Form.Label>Stock Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                value={newItem.stockQuantity}
                                onChange={(e) => setNewItem({ ...newItem, stockQuantity: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formUnitPrice">
                            <Form.Label>Unit Price</Form.Label>
                            <Form.Control
                                type="number"
                                value={newItem.unitPrice}
                                onChange={(e) => setNewItem({ ...newItem, unitPrice: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCategory">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                as="select"
                                value={newItem.category}
                                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formVendor">
                            <Form.Label>Vendor</Form.Label>
                            <Form.Control
                                as="select"
                                value={newItem.vendor}
                                onChange={(e) => setNewItem({ ...newItem, vendor: e.target.value })}
                            >
                                <option value="">Select Vendor</option>
                                {vendors.map((vendor) => (
                                    <option key={vendor._id} value={vendor._id}>
                                        {vendor.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={newItem.description}
                                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                rows={3}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        {isEditing ? 'Update Item' : 'Add Item'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ItemManagement;
