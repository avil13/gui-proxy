const debug = true;

const log = (...str) => {
    if (!debug) {
        return;
    }

    str.map((v => {
        if (typeof v === 'object') {
            console.log(`%c data ==>`, 'color:#5cff63;', v);
        } else {
            console.log(`%c ${v}`, 'color:#5cff63;');
        }
    }));
};


let _connected = false;


export default function Chat() {
    if (!(this instanceof Chat)) {
        return new Chat();
    }

    Chat.queue = [];

    var socket = require('socket.io-client')('http://localhost:9090');

    debugger;
    fetch(`/_port_`)
        .then(res => res.json())
        .then(data => {
            debugger;
        })
        .catch(err => console.log(err));

    /* ----
    socket.on('connect', () => {
        _connected = true
        log('Create connection!');

        Chat.queue.forEach((v) => {
            this[v.method].apply(this, v.args);
        });
        Chat.queue = [];
    });

    socket.on('disconnect', () => {
        _connected = false
        log('Connection is lost...');
    });
    // */

    // get list from back
    this.getList = () => {
        if (toQueue('getList')) {
            return log("Can't get list");
        }

        log("socket.emit('get_config_list');");
        socket.emit('get_config_list');
    };

    // get new event from back
    this.get = (callback) => {
        if (toQueue('get', callback)) {
            return log("Can't do Log");
        }

        socket.on('get_config', (res) => {
            if (typeof callback === 'function') {
                if (res && res.data) {
                    callback(res.data);
                }
            }
        });
    };

    // send new event to back
    this.set = (data) => {
        if (toQueue('set', data)) {
            return log("Can't find connection...");
        }

        const req = {
            data: data
        };

        log("socket.emit('set_config', req);", data);
        socket.emit('set_config', req);
    };

    // get new event from back
    this.log = (callback) => {
        if (toQueue('log', callback)) {
            return log("Can't do Log");
        }

        socket.on('log', (res) => {
            if (typeof callback === 'function') {
                if (res && res.data) {
                    callback(res.data);
                }
            }
        });
    };
}


/**
 * проверяем есть ли соединение с сокетом, если нет то ставим запрос в очередь
 * 
 * @param {any} method 
 * @param {any} args 
 * @returns 
 */
function toQueue(method, ...args) {
    if (_connected) {
        return false;
    }

    if (Chat.queue.length < 20) {
        Chat.queue.push({ method, args });
    } else {
        console.log('Queue is full');
    }

    return true;
}