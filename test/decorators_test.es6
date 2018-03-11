const { types, transform, serialization: { Serializable, serialize } } = require('../index');

exports.decorators = {
  setUp: function(done) {
    types.QUserType.register('NetworkId', types.Types.INT);
    types.QUserType.register('NetworkInfo', types.Types.MAP);

    @Serializable('NetworkInfo')
    class Network {

      @serialize(types.QUserType.get('NetworkId'), 'NetworkId')
      get networkId() {
        return this.id;
      }

      @serialize(types.QBool, {in: 'UseRandomServerIn', out: 'UseRandomServerOut'})
      useRandomServer = false;

      @serialize(types.QStringList, 'Perform')
      perform = [];

      @serialize(types.QString, 'AutoIdentifyService')
      autoIdentifyService = 'NickServ';

      @serialize(types.QUInt)
      autoReconnectInterval = 60;

      @serialize(types.QString)
      nullStr = null;

      constructor(id, ...args) {
        this.id = id;
        this._shouldnt_be_exported = 'blob';
        Object.assign(this, ...args);
      }
    }

    this.network = new Network(1, {
      UseRandomServerIn: false,
      perform: [ 'a', 'b' ]
    });
    this.networkobj = {
      useRandomServer: false,
      perform: [ 'a', 'b' ],
      autoIdentifyService: 'NickServ',
      autoReconnectInterval: 60,
      nullStr: null,
      id: 1,
      _shouldnt_be_exported: 'blob'
    };
    this.out = {
      __obj: {
        NetworkId: { __obj: 1, name: 'NetworkId' },
        UseRandomServerOut: { __obj: false },
        Perform: { __obj: [ 'a', 'b' ] },
        AutoIdentifyService: { __obj: 'NickServ' },
        autoReconnectInterval: { __obj: 60 },
        nullStr: { __obj: null }
      },
      name: 'NetworkInfo'
    };
    done();
  },
  'no args': function(test) {
    test.deepEqual(this.network, this.networkobj);
    const qobj = types.QClass.from(this.network);
    test.deepEqual(qobj, this.out);
    test.done();
  }
};

exports.decorators_export = {
  setUp: function(done) {
    @Serializable()
    class Test {

      _export() {
        return {
          a: {
            b: 2,
          },
          c: 'test'
        };
      }
    }

    this.test = new Test();
    this.out = {
      __obj: {
        a: {
          b: 2,
        },
        c: 'test',
      }
    };
    done();
  },
  'no args': function(test) {
    const qobj = types.QClass.from(this.test);
    test.deepEqual(qobj, this.out);
    test.done();
  }
};

exports.decorators_serialization = {
  setUp: function(done) {
    types.QUserType.register('NetworkId', types.Types.INT);
    types.QUserType.register('NetworkInfo', types.Types.MAP);
    types.QUserType.register('Network::Server', types.Types.MAP);

    this.wt = new transform.WriteTransform();
    this.rt = new transform.ReadTransform();

    @Serializable('Network::Server')
    class Server {
      @serialize(types.QString, "Host")
      host;

      constructor(args) {
        Object.assign(this, args);
      }
    }

    @Serializable('NetworkInfo')
    class Network {

      @serialize(types.QUserType.get('NetworkId'), 'NetworkId')
      get networkId() {
        return this.id;
      }

      @serialize(types.QBool, 'UseRandomServer')
      useRandomServer = false;

      @serialize(types.QList.of(Server), 'Servers')
      servers = [];

      constructor(id, ...args) {
        this.id = id;
        Object.assign(this, ...args);
      }
    }

    this.network = new Network(1, {
      useRandomServer: false,
      servers: [ { host: 'myHost' } ]
    });
    this.out = {
      NetworkId: 1,
      UseRandomServer: false,
      Servers: [ { Host: 'myHost' } ]
    };
    done();
  },
  'no args': function(test) {
    this.wt.on('data', (chunk) => {
      this.rt.write(chunk);
    });
    this.rt.on('data', (chunk) => {
      test.deepEqual(this.out, chunk);
      test.done();
    });
    this.wt.write(this.network);
  }
};