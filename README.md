[![NPM](https://nodei.co/npm/qtdatastream.png)](https://npmjs.org/package/qtdatastream)

[![Build Status](https://travis-ci.org/magne4000/node-qtdatastream.svg?branch=es2015)](https://travis-ci.org/magne4000/node-qtdatastream)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Javascript [QDatastream](http://doc.qt.io/qt-4.8/qdatastream.html) (de)serializer.

List of types handled for (de)serialization:
  QBool, QShort, QInt, QInt64, QUInt, QUInt64, QDouble, QMap, QList, QString, QVariant, QStringList, QByteArray, QUserType, QDateTime, QTime, QChar, QInvalid

## Getting Started
Install the module with `npm install node-qtdatastream --production`,
or `npm install node-qtdatastream` for development purpose.

## Documentation
[Technical documentation](http://magne4000.github.io/qtdatastream/1.0.0/)

### Type inference
Javascript types can be automatically converted to Qt Types, and here is the default behavior

#### javascript to QClass
| javascript | QClass                                 |
|------------|----------------------------------------|
| string     | QString                                |
| number     | QUInt                                  |
| boolean    | QBool                                  |
| Array      | QList&lt;QVariant&lt;?&gt;&gt;         |
| Date       | QDateTime                              |
| Map        | QMap&lt;QString, QVariant&lt;?&gt;&gt; |
| Object     | QMap&lt;QString, QVariant&lt;?&gt;&gt; |

#### QClass to javascript
Qt Types are also converted to native javascript type automatically upon reading

| QClass      | javascript          |
|-------------|---------------------|
| QString     | string              |
| QUInt       | number              |
| QInt        | number              |
| QUInt64     | number              |
| QInt64      | number              |
| QDouble     | number              |
| QShort      | number              |
| QBool       | number              |
| QList       | Array               |
| QStringList | Array&lt;string&gt; |
| QByteArray  | Buffer              |
| QMap        | Object              |
| QUserType   | Object              |
| QDateTime   | Date                |
| QTime       | number              |
| QChar       | string              |
| QInvalid    | undefined           |

#### QUserType special treatment
QUserType are special types defined by user (QVariant::UserType).

QUserType are defined like this `<size:uint32><bytearray of size>`. bytearray
can be casted to string (but it is not a string as intended by Qt,
because it is UTF8 and not UTF16) : `bytearray.toString()`. The resulting string
is the QUserType key.

##### Reader
The Reader use an internal mechanism to know which parser must be used for each
QUserType. They are defined like this:
```javascript
const { QUserType } = require('qtdatastream').types;
QUserType.register("NetworkId", qtdatastream.Types.INT); //NetworkId here is our key
```

This tell the reader to decode `NetworkId` bytearray like and INT. But those
structures can be much more complicated:
```javascript
const { QUserType } = require('qtdatastream').types;
QUserType.register("BufferInfo", [
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


UserTypes can also be nested, by specifying the usertype name instead of Qt type :
```javascript
QUserType.register("BufferInfoContainer", [
    {id: qtdatastream.Types.INT},
    {bufferInfo: "BufferInfo"} // here we reference the BufferInfo QUserType
]);
```
Keep in mind that if a usertype `X` references usertype `Y`, `Y` should be declared before `X`.

##### Writer
Custom usertypes can be defined as for Reader, with the help of `QUserType.register` method.

Writing UserType is done as follow:
```javascript
const { Socket } = require('qtdatastream').socket;
const { QUserType } = require('qtdatastream').types;
const qtsocket = new Socket(myRealSocket);

const data = {
    "BufferInfo": new QUserType("BufferInfo", {
        id: 2,
        network: 4,
        type: 5,
        group: 1,
        name: "BufferInfo name"
    })
});

qtsocket.write(data);
```
Some more examples can be found in test folder.

## Example
```javascript
const { Socket } = require('qtdatastream').socket;
const { QUserType } = require('qtdatastream').types;
const net = require('net');

var client = net.Socket();

// Connect to a Qt socket
// and write something into the socket
client.connect(65000, "domain.tld", function(){
    const qtsocket = new Socket(client);

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

## Debugging
Debug mode can be activated by setting environment variable DEBUG in your shell before launching your program:
```
export DEBUG="qtdatastream:*"
```

## License
Copyright (c) 2017 Joël Charles
Licensed under the MIT license.
