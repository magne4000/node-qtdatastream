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
    next: function(valCallback) {
        var key = Object.keys(this.items[this.index])[0];
        var valType = this.items[this.index][key];
        var val = this.callbackValue.apply(this.context, [valType]);
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
