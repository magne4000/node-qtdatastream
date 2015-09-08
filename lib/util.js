
//Fix for Buffer.toString function
exports.str = function(obj) {
    var str = obj.toString();
    return str.replace('\0', '');
};
