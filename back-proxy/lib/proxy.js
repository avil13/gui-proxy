process.on(`uncaughtException`, console.error);

var http = require('http');
var url = require('url');
var argv = require('../lib/arguments');
var Admin = require('./admin');


const log = {
    callback() {},

    log(str) {
        if (typeof log.callback === 'function') {
            log.callback(str);
        }
    },

    event(callback) {
        log.callback = callback;
    }
};

const actions = {
    port: argv.port || argv.p || 9090,

    set routes(_r) {
        if (Array.isArray(_r)) {
            routes = _r;
        }
    },

    get list() {
        return routes;
    },

    log: log.event.bind(log)
};


const admin = Admin({
    server: actions.port,
    socket: (1 + actions.port)
});


// list of routes gettted on start config
var routes = (function(path) {
    var src = __dirname.split(/\\|\//);
    var _path = [].concat(src, path.split(/\\|\//));
    return require(_path.join('/'));
})(argv.conf || argv.c || '../config') || [];




// ===
// TODO
var _extend = function(obj1, obj2, path) {
    var _obj2_path = obj2.path;
    if (obj2.path && Array.isArray(obj2.path)) {
        if (obj2.path.length === 2) {
            _obj2_path = path.replace(obj2.path[0], obj2.path[1]);
        } else {
            log.log('Not all `path` params');
        }
    }
    for (var k in obj2) {
        if (obj2.hasOwnProperty(k)) {
            obj1[k] = obj2[k];
        }
    }
    obj1.path = _obj2_path || obj1.path;

    return obj1;
};

// TODO
var getOpt = function(path, method, headers) {
    // TODO: set default options
    var result = {
        hostname: 'localhost', // request.headers.host,
        port: 4200,
        path: path,
        method: method,
        headers: headers
    };

    if (path === '/') {
        return _extend(result, routes[routes.length - 1], path);
    }

    let obj;

    for (var i = 0; i < routes.length; i++) {
        obj = routes[i];

        log.log(path, obj._path);

        if (path.indexOf(obj._path) > -1 || (path[0]).indexOf(obj._path) > -1) {
            result = _extend(result, obj, path);
            break;
        }
    }

    return result;
};


// Validation
if (routes.length === 0) {
    console.log('No params in config');
    process.exit(1);
}

// === === === //

actions.server = http.createServer(function(request, response) {
    if (admin.check(request, response)) {
        console.log('reserved path');
        return;
    }

    // 
    var url_parts = url.parse(request.url);

    var options = getOpt(url_parts.path, request.method, request.headers);

    var info = [
        `[${options.method}]:`,
        `${request.headers.host}${request.url}`,
        `⇒`,
        `${options.hostname}:${options.port}${options.path}`
    ].join(' ');

    var request_data;

    var proxy_client = http.request(options, function(res) {

        res.on('data', function(chunk) {
            response.write(chunk, 'binary');
        });

        res.on('end', function() {
            response.end();
        });

        res.on('error', function(e) {
            log.log(`Error with client  ${e}`);
        });

        log.log(info);
        log.log(`statusCode: ${res.statusCode} \n\n`);

        response.writeHead(res.statusCode, res.headers);
    });


    request.on('data', function(chunk) {
        request_data = request_data + chunk;
        proxy_client.write(chunk, 'binary');
    });

    request.on('end', function() {
        proxy_client.end();
    });

    request.on('error', function(e) {
        log.log(`Problem with request ${e}`);
    });

}).listen(actions.port);

console.log('Started proxy on port: ' + actions.port)


module.exports = actions;