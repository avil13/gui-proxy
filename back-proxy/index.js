
let server = require('http').createServer();
let io = require('socket.io')(server);

const proxy = require('./lib/proxy');


io.on('connection', (client) => {
    // client.on('event', (data) => {});
    // client.on('disconnect', () => {});

    // get from front
    client.on('set_config', (req) => {
        // sent to front
        if(req && req.data){
            proxy.routes = req.data;
        }
        client.emit('get_config', { data: proxy.list });
        
        console.log('proxy.list');
    });

    client.on('get_config_list', () => {
        // send list of routes to front
        client.emit('get_config', { data: proxy.list });
    });

    proxy.log((data) => {
        client.emit('log', { data: data });
    });
});

const port = 1 + proxy.port;

server.listen(port);
console.log(`socket port: ${port}`);
