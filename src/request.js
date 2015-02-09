//@exclude

'use strict';
/*globals Silkroad,module,require */

//@endexclude


// Request module
//
//
Silkroad.request = {};

//nodejs
if (typeof module !== 'undefined' && module.exports) {
    var http = require('http');

    Silkroad.request.send = function(options) {
        options = options || {};
        var that = this,
            callback = options.succes;

        var req = http.request(options, function(res) {
            var str = '';

            res.on('data', function(chunk) {
                str += chunk;
            });

            res.on('end', function() {
                if (typeof callback === 'function') {
                    //add notification to event response
                    callback.call(that, str);
                }
            });

        });

        req.end();

        return req;
    };


    module.exports = Silkroad.request;
}

//browser
if (typeof window !== 'undefined') {

    Silkroad.request.send = function(options) {
        options = options || {};

        var xhr = new XMLHttpRequest(),
            url,
            headers = typeof options.headers === 'object' ? options.headers : {},
            callbackSuccess = options.success && typeof options.success === 'function' ? options.success : undefined,
            callbackError = options.error && typeof options.error === 'function' ? options.error : undefined;
        //callbackError = options.error && typeof options.error === 'function' ? options.error : undefined;


        try {
            //url = options.hostname + ':' + options.port + options.path;
            url = options.url;
        } catch (Ex) {
            url = undefined;
        }

        var method = String((options.type || 'GET')).toUpperCase();

        if (!url) {
            throw new Error('You must define an url');
        }

        xhr.open(method, url, true);

        /* add request headers */
        for (var header in headers) {
            if (headers.hasOwnProperty(header)) {
                xhr.setRequestHeader(header, headers[header]);
            }
        }

        var promise = new Promise(function(resolve, reject) {
            //response recieved
            xhr.onload = function(xhr) {

                xhr = xhr.target || xhr || {};

                if (callbackSuccess) {
                    callbackSuccess.call(this, xhr.responseText, xhr.status, xhr);
                }

                resolve(xhr.responseText);
                //delete callbacks
            }.bind(this);

            xhr.onerror = function(xhr) {
                if (callbackError) {
                    callbackError.call(this, xhr, xhr.status, xhr.error);
                }
                reject(xhr.responseText);
                //delete callbacks
            }.bind(this);

        });

        if (options.data) {
            xhr.send(options.data);
        } else {
            xhr.send();
        }


        return promise;


    };


}