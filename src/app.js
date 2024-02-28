
const express = require('express');
const productsRouter = require('./routes/products.routes')
const cartsRouter = require('./routes/carts.routes')
const viewsRouter = require('./routes/views.routes');
const socket = require('socket.io');
const messageModel = require('./dao/models/message.model.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const userRoutes = require('./routes/user.routes.js');
const sessionRoutes = require('./routes/session.routes.js');

const app = express();
const PORT = 8080;
require('./database.js');

//Handlebars
const exphbs = require('express-handlebars');
const hbs = exphbs.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    },
    helpers: {
        renderPartial: function (header, context) {
            return hbs.handlebars.partials[header](context);
        }
    }
});



// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./src/public'));
app.use(cookieParser());
app.use(session({
    secret: 'secretCoder',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://nesmanpro:g4ECFS0wHimlGF18@cluster0.we6hggz.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0',
        ttl: 90
    }),
}))



//Configuramos handlebars:
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './src/views')


// Routing
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/', viewsRouter);



// Iniciar el servidor
const httpServer = app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})

// *** Chat *** //
// socket.io

// Creamos instancia de socket.io

const io = new socket.Server(httpServer);


io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado!');

    socket.on('messages', async data => {

        // Guardar en mongo
        await messageModel.create(data);

        // Obtengo messages y madno a cliente
        const message = await messageModel.find();
        io.sockets.emit('messageLogs', message);


    })
})
