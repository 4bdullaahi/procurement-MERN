const express = require('express');
const connectDB = require('./config/db');
// const cors = require('cors');
const cors = require('dotenv');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();

// Middleware
// app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.set('view engine', 'html');
app.engine('html', ejs.renderFile)
app.use(express.static('./public'))

// Connect to MongoDB
connectDB();

// Import routes
const categoryRoutes = require('./routes/category');
app.use('/api/categories', categoryRoutes);
const EmailyRoutes = require('./routes/email');
app.use('/api/send',  EmailyRoutes);

const itemRoutes = require('./routes/item');
app.use('/api/item', itemRoutes);

const LoginRoutes = require('./routes/user');
app.use('/api/register', LoginRoutes);

const vendorRoutes = require('./routes/vendor');
app.use('/api/vendor', vendorRoutes);




const purchaseRoutes = require('./routes/purchase');
app.use('/api/purchase', purchaseRoutes);

const purchaseReciveRoutes = require('./routes/recive');
app.use('/api/recive', purchaseReciveRoutes);

const PaymentRoutes = require('./routes/payment');
app.use('/api/payment', PaymentRoutes);

const OrderRoutes = require('./routes/order');
app.use('/api/order', OrderRoutes);

const CustomerRoutes = require('./routes/customer');
app.use('/api/customer', CustomerRoutes);


const UserRoutes = require('./routes/user');
app.use('/api/user', UserRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${ PORT }`));