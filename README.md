# node-qtdatastream

Nodejs lib which can read/write Qt formatted Datastreams.

For the moment the following types are handled for reading and writing:
  QBool, QUInt, QMap, QList, QString, QVariant, QStringList, QShort, QInt, QByteArray, QUserType, QDateTime, QTime, QChar

## Getting Started
Install the module with `npm install node-qtdatastream --production`,
or `npm install node-qtdatastream` for development purpose.

## Documentation
[Technical documentation](http://magne4000.github.io/qtdatastream/)

### Type inference
Javascript types are automatically converted to Qt Types, and vice versa.

By Writer:

* string -> QString
* number -> QUInt
* boolean -> QBool
* Array -> QList&lt;QVariant&lt;?&gt;&gt;
* Date -> QDateTime
* Object -> QMap&lt;QString, QVariant&lt;?&gt;&gt;
* Q\*\*\* -> Q\*\*\*

By Reader:

* QString -> string
* QUInt -> number
* QInt -> number
* QShort -> number
* QBool -> boolean
* QList -> Array
* QStringList -> Array&lt;string&gt;
* QByteArray -> Buffer
* QMap -> Object
* QUserType -> Object
* QDateTime -> Date
* QTime -> number
* QChar -> string

#### QUserType special treatment
QUserType are special types defined by user (QVariant::UserType).

QUserType are defined like this `<size:uint32><bytearray of size>`. bytearray
can be casted to string (but it is not a string as intended by Qt,
because it is UTF8 and not UTF16) : `bytearray.toString()`. The resulting string
is the QUserType key.

##### Reader
The Reader use an internal mechanism to know which parser must be used for each
QUserType, they are defined like this :
```javascript
qtdatastream.registerUserType("NetworkId", qtdatastream.Types.INT); //NetworkId here is our key
```

This tell the reader to decode `NetworkId` bytearray like and INT. But those
structures can be much more complicated :
```javascript
qtdatastream.registerUserType("BufferInfo", [
    {id: qtdatastream.Types.INT},
    {network: qtdatastream.Types.INT},
    {type: qtdatastream.Types.SHORT},
    {group: qtdatastream.Types.INT},
    {name: qtdatastream.Types.BYTEARRAY}
]);
```

The bytearray corresponding to this structure look like this :
```
  <int32><int32><int16><int32><qbytearray>
```

The whole new type will be put in a new Object, the `id` key will contain the first
&lt;int32&gt;, the `network` key will contain the second &lt;int32&gt;, etc.
The definition is contained into an array to force a parsing order (here, `id` will
always be the first &lt;int32&gt; block).


UserTypes can also be nested, by specifying the USERTYPE name instead of Qt type :
```javascript
qtdatastream.registerUserType("BufferInfoContainer", [
    {id: qtdatastream.Types.INT},
    {bufferInfo: "BufferInfo"}
]);
```

##### Writer
Custom UserTypes must be defined as in Reader, with the help of `qtdatastream.registerUserType` method.

Writing UserType is done as follow:
```javascript
new Writer({
    "BufferInfo": new QUserType("BufferInfo", {
        id: 2,
        network: 4,
        type: 5,
        group: 1,
        name: "BufferInfo2"
    })
});
```

See test folder for details.

## Examples
### Basic usage
```javascript
var net = require('net'),
    qtdatastream = require('qtdatastream'),
    QtSocket = qtdatastream.Socket;
var client = net.Socket();

// Connect to a Qt socket
// and write something into the socket
client.connect(65000, "domain.tld", function(){
    var qtsocket = new QtSocket(client);
    
    // Here data is the already parsed response
    qtsocket.on('data', function(data) {
        //...
    });
    
    // Write something to the socket
    qtsocket.write({
        "AString": "BString",
        "CString": 42
    });
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

client.on('data', function(data) {
    var reader = new Reader(data);
    var parsedData = data.parse();
    //...
});

//NB: It is not advisable to use net.Socket directly because buffers are received
//in chunks. Using qtdatastream.Socket allows to ignore this. Moreover, its parses
//automatically the buffers.
```

## Debugging
Debug mode can be activated by setting environment variable QTDSDEBUG in your shell before launching your program:
```
export QTDSDEBUG="ON"
```

## Release History
* v0.3.3
  * New type : QChar
* v0.3.2
  * Fix steam parsing
* v0.3.1
  * Fix QByteArray writing
* v0.3.0
  * New Socket class returning 'data' event only when full parseable buffer received.
  It also have a write(...) method to write data to the buffer without directly
  using Writer class.
* v0.2.5
  * Fix writing userTypes and byteArrays
* v0.2.4
  * Add the possibility to nest userTypes
* v0.2.3
  * Fix QDateTime Reader
* v0.2.2
  * New type : QDateTime
* v0.2.1
  * New types : QUserType, QByteArray
* v0.2.0
  * New types : QInt, QStringList, QShort
* v0.1.0
  * Initial release
  * Tested only tested with Qt protocol v10

## License
Copyright (c) 2014 Joël Charles  
Licensed under the MIT license.
