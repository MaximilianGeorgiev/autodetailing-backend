const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3030;
const AuthUtils = require("./utils/auth.js");
const cors = require('cors');

require('dotenv').config();

app.use(bodyParser.json());
app.use(cors());

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
const pictureRoutes = require("./routes/picture.js");

// some APIs require auth for all CRUD operations, some are configured in their respective route files
app.use('/roles', roleRoutes);
app.use('/vehicle-type', AuthUtils.validateToken, vehicleTypeRoutes);
app.use('/blog', blogPostRoutes);
app.use('/category', AuthUtils.validateToken, categoryRoutes);
app.use('/order', AuthUtils.validateToken, orderRoutes);
app.use('/product', productRoutes);
app.use('/promotion', promotionRoutes);
app.use('/reservation', reservationRoutes);
app.use('/service', serviceRoutes);
app.use('/user', userRoutes);
app.use('/picture', pictureRoutes);


app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
});

app.post("/refreshToken", AuthUtils.validateToken, AuthUtils.refreshToken);
app.post("/removeToken", AuthUtils.validateToken, AuthUtils.removeToken);

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});