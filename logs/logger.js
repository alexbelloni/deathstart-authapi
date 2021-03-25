const morgan = require('morgan');
const uuid = require('node-uuid');

morgan.token('key', req =>  req.id );

module.exports = (app) => {
    app.use( (req, res, next)=> {
        req.id = uuid.v4()
        next();
      });

    app.use(
        morgan('{"key": ":key", "remote_addr": ":remote-addr", "remote_user": ":remote-user", "date": ":date[clf]", "method": ":method", "url": ":url", "http_version": ":http-version", "status": ":status", "result_length": ":res[content-length]", "referrer": ":referrer", "user_agent": ":user-agent", "response_time": ":response-time"}', {
            //skip: (req, res) => { return res.statusCode < 400 },
            "stream": {
                write: message => { console.log(message); }
            }
        })
    )
}