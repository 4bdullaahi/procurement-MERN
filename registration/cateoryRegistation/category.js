// CategoryManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Button, Modal, Form, Container } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    description: '',
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories'); // Updated endpoint
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      fetchCategories();
      toast.error("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setNewCategoryData({
      name: category.name,
      description: category.description,
    });
    setShowModal(true);
  };

  const handleUpdateCategory = async () => {
    try {
      await axios.put(`http://localhost:5000/api/categories/${selectedCategory._id}`, newCategoryData);
      setShowModal(false);
      fetchCategories();
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleAddCategory = async () => {
    try {
      await axios.post('http://localhost:5000/api/categories', newCategoryData);
      setShowAddModal(false);
      fetchCategories();
      toast.success("Category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { name: 'Name', selector: (row) => row.name, sortable: true },
    { name: 'Description', selector: (row) => row.description },
    { name: 'Created At', selector: (row) => new Date(row.createdAt).toLocaleDateString(), sortable: true },
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
        <h2>Category Management</h2>
      </div>
      <Button variant="primary" onClick={() => setShowAddModal(true)} style={{ float: 'right' }}>
        Add New Category
      </Button>
      <input
        type="text"
        placeholder="Search Categories"
        value={searchTerm}
        onChange={handleSearch}
        className="form-control mb-3 mt-4"
      />
      <DataTable
        columns={columns}
        data={filteredCategories}
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

      {/* Modal for Updating Category */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCategoryName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newCategoryData.name}
                onChange={(e) => setNewCategoryData({ ...newCategoryData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formCategoryDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newCategoryData.description}
                onChange={(e) => setNewCategoryData({ ...newCategoryData, description: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleUpdateCategory}>Update Category</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Adding New Category */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCategoryName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newCategoryData.name}
                onChange={(e) => setNewCategoryData({ ...newCategoryData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formCategoryDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newCategoryData.description}
                onChange={(e) => setNewCategoryData({ ...newCategoryData, description: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddCategory}>Add Category</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CategoryManagement;
