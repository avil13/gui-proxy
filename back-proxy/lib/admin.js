const fs = require('fs');
const url = require('url');

module.exports = Admin;


function Admin(options = {}) {
    if (!(this instanceof Admin)) {
        return new Admin(options);
    }

    /**
     * Checks if the path matches the reserved value
     * @param {string} path
     * @param {Object} res http response module
     * @return {boolean}
     */
    this.check = (req, res) => {
        const _uri = url.parse(req.url);
        // /socket.io/

        const re = /^\/(_admin_|_port_|favicon\.ico).*/g; // for choose path
        const re_f = /^(\/_admin_|_port_)(.*)$/g; // for choose file
        const _path = _uri.pathname.replace(re, '$1');

        switch (_path) {
            case '_admin_':
                const _f = _uri.pathname.replace(re_f, '$2');

                console.log(`${__dirname}/../../front-proxy${_f || '/index.html'}`);

                fs.readFile(`${__dirname}/../../front-proxy${_f || '/index.html'}`, 'utf-8', (err, data) => {
                    if (!!err) {
                        return console.error(err);
                    }
                    res.end(data);
                });
                return true;

            case '_port_':
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(options));
                return true;

            case 'favicon.ico':
                res.end(`data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAACbUlEQVRIx7WUsU/qUBTGv96WSlWeEBZijJggxrREdwYixMnByYEyOvgfsBAMG0xuDsZ/QGc3NDFhgTioiYsmkhBYGLSBkLYR0va8gSjvQXiIT7/l5ibfOd/v3pN7gSmVSMTj8ThRfzdYk8lkMpl83/+AVFVVVXU0eHiVJEmSpB8DIcpkMplsdhCYz+fzhQJROBwOh8PDQN+oQCAQCASIRFEURZHI45GkP0/e7Xa73e70AMJnjel0Op1OA6oaDB4eAkAw6PcDvZ5t6zrw/Hx2trAw/cHYZ426ruu6DtzcGEYuBzQa19etFvD4WKtls4AoRqMPDwBjjLGPrt84ilgsFovF6EOapmmaRiP6O/jbAIguL4vFYpHGqlKpVCoVomq1Wq1Wibxer9fn+w+Q9+cUiUQikQhNrfdgWZZlWf4yyGhj27Zt254MUK/X6/X6F0aiKIqiKIOCYRmGYRjGZADLsizLIgqFQqHV1SkAnp5OTn79ItK0qyuPZ7SxaZqmaU4GKJfPzxmbfAPc/f3pqaIQLS8vLtZqgOP0bYyJoiAARC5Xrwf4/Vtbb2+Th1YqlUqlErC01GgkEkCz2WxyHLC+LsuiCAiCJLlcgM+3vd3pcBzXaJTLR0dEs7Ptdv+D4TiOG/A6DsBxQKvV621sAGtru7vl8ngAjuvXv7xcXIgiwNjMjCj2h+k4fQfPA4LA8xwHCO323V2hABiG223bwPy8xwMAbvfcHGMAY32j47y+3t4OAsZpZ2dzEwAsy7IcBxAExhwHMIxOx3GAlZVUyjT/1WFIudzenstFlEpFo9M8o+Pj/X2eJzo4SCR4fnzdb2N4Pyv9cduVAAAAAElFTkSuQmCC`);
                return true;

            default:
                return false;
        }
    };
};