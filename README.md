# node-qtdatastream

Nodejs lib which can read/write Qt formatted Datastreams.

For the moment the following types are handled for reading and writing: QBool, QUInt, QMap, QList, QString, QVariant

## Getting Started
Install the module with `npm install node-qtdatastream --production`,
or `npm install node-qtdatastream` for development purpose.

## Documentation
[Technical documentation](http://magne4000.github.io/qtdatastream/)

### Type inference
Javascript type are automatically converted to Qt Types following by Writer:

* string -> QString
* number -> QUInt
* boolean -> QBool
* Array -> QList&lt;QVariant&lt;?&gt;&gt;
* Object -> QMap&lt;QString, QVariant&lt;?&gt;&gt;

And by Reader:

* QString -> string
* QUInt -> number
* QBool -> boolean
* QList -> Array
* QMap -> Object

## Examples
### Basic usage
```javascript
var net = require('net'),
    Writer = require('qtdatastream').Writer,
    Reader = require('qtdatastream').Reader;
var client = net.Socket();

// Connect to a Qt socket
// and write something into the socket
client.connect(65000, "domain.tld", function(){
    var writer = new Writer({
        "AString": "BString",
        "CString": ["DString", 1, 4, true],
        "EString": ""
    });
    
    client.write(writer.getBuffer());
});

// Read data from the socket
client.on('data', function(data) {
    var reader = new Reader(data);
    var parsedObject = reader.parse();
    //...
});
```

### Extended usage
```javascript
var net = require('net'),
    Writer = require('qtdatastream').Writer,
    Reader = require('qtdatastream').Reader;
var client = net.Socket();

// Connect to a Qt socket
// and write something into the socket
client.connect(65000, "domain.tld", function(){
    var writer = new Writer({
        "AString": new QVariant(new QString("BString")),
        "CString": new QVariant(new QUInt(42))
    });
    client.write(writer.getBuffer());
});
```

## Release History
### v0.1.0
* Initial release
* Tested only tested with Qt protocol v10

## License
Copyright (c) 2014 Joël Charles  
Licensed under the MIT license.
