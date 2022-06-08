const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3030;
const AuthUtils = require("./utils/auth.js");

require('dotenv').config();

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

app.use('/roles', AuthUtils.validateToken, roleRoutes);
app.use('/vehicle-type', AuthUtils.validateToken, vehicleTypeRoutes);
app.use('/blog', AuthUtils.validateToken, blogPostRoutes);
app.use('/category', AuthUtils.validateToken, categoryRoutes);
app.use('/order', AuthUtils.validateToken, orderRoutes);
app.use('/product', AuthUtils.validateToken, productRoutes);
app.use('/promotion', AuthUtils.validateToken, promotionRoutes);
app.use('/reservation', AuthUtils.validateToken, reservationRoutes);
app.use('/service', AuthUtils.validateToken, serviceRoutes);
app.use('/user', AuthUtils.validateToken, userRoutes);


app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
});

app.post("/refreshToken", AuthUtils.validateToken, AuthUtils.refreshToken);
app.post("/removeToken", AuthUtils.validateToken, AuthUtils.removeToken);

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});