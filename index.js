const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3030;

app.use(bodyParser.json());

app.use(
    bodyParser.urlencoded({ 
        extended: true,
    })
);

const roleRoutes = require("./routes/role.js");
const vehicleTypeRoutes = require("./routes/vehicletype.js");
const blogPostRoutes = require("./routes/blogpost.js");
const categoryRoutes = require("./routes/category.js");
const orderRoutes = require("./routes/order.js");
const productRoutes = require("./routes/product.js");
const promotionRoutes = require("./routes/promotion.js");
const reservationRoutes = require("./routes/reservation.js");
const serviceRoutes = require("./routes/service.js");
const userRoutes = require("./routes/user.js");


app.use('/roles', roleRoutes);
app.use('/vehicle-type', vehicleTypeRoutes);
app.use('/blog', blogPostRoutes);
app.use('/category', categoryRoutes);
app.use('/order', orderRoutes);
app.use('/product', productRoutes);
app.use('/promotion', promotionRoutes);
app.use('/reservation', reservationRoutes);
app.use('/service', serviceRoutes);
app.use('/user', userRoutes);

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});