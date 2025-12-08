const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Enable CORS
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

server.use(middlewares)
server.use(jsonServer.bodyParser)
server.use(router)

const PORT = process.env.JSON_SERVER_PORT || 3001

server.listen(PORT, () => {
    console.log(`JSON Server is running on http://localhost:${PORT}`)
    console.log('Endpoints:')
    console.log('  - http://localhost:' + PORT + '/users')
    console.log('  - http://localhost:' + PORT + '/conversations')
    console.log('  - http://localhost:' + PORT + '/messages')
    console.log('  - http://localhost:' + PORT + '/friendRequests')
})
