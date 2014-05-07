var qtdatastream = require('./qtdatastream');

var Iterator = function(items, callback, context) {
    this.index = 0;
    this.items = items;
    this.callbackValue = callback;
    this.context = context;
};

Iterator.prototype = {
    first: function() {
        this.reset();
        return this.next();
    },
    next: function() {
        var key = Object.keys(this.items[this.index])[0];
        var valType = this.items[this.index][key];
        var params = [];
        if (typeof valType === "string") { // it is a USERTYPE
            params.push(qtdatastream.Types.USERTYPE);
            params.push(valType);
        } else {
            params.push(valType);
        }
        var val = params;
        if (typeof this.callbackValue === 'function') {
            val = this.callbackValue.apply(this.context, params);
        }
        this.index++;
        return {
            key: key,
            value: val
        };
    },
    hasNext: function() {
        return this.index < this.items.length;
    },
    reset: function() {
        this.index = 0;
    },
    each: function(callback) {
        for (var item = this.first(); this.hasNext(); item = this.next()) {
            callback(item);
        }
    }
};

module.exports = Iterator;
