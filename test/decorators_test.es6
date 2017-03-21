const { types } = require('../index');

exports.decorators = {
  setUp: function(done) {
    types.QUserType.register('NetworkId', types.Types.INT);

    @types.exportable
    @types.usertype('NetworkInfo')
    class Network {

      @types.exportas(types.QUserType.get('NetworkId'), 'NetworkId')
      get networkId() {
        return this.id;
      }

      @types.exportas(types.QBool, 'UseRandomServer')
      useRandomServer = false;

      @types.exportas(types.QStringList, 'Perform')
      perform = [];

      @types.exportas(types.QString, 'AutoIdentifyService')
      autoIdentifyService = 'NickServ';

      @types.exportas(types.QUInt)
      autoReconnectInterval = 60;

      @types.exportas(types.QString)
      nullStr = null;

      constructor(id, ...args) {
        this.id = id;
        this._shouldnt_be_exported = 'blob';
        Object.assign(this, ...args);
      }
    }

    this.network = new Network(1, {
      useRandomServer: false,
      perform: [ 'a', 'b' ]
    });
    this.out = {
      __obj: {
        NetworkId: { __obj: 1, name: 'NetworkId' },
        UseRandomServer: { __obj: false },
        Perform: { __obj: [ 'a', 'b' ] },
        AutoIdentifyService: { __obj: 'NickServ' },
        autoReconnectInterval: { __obj: 60 },
        nullStr: { __obj: null }
      }
    };
    done();
  },
  'no args': function(test) {
    const qobj = types.QClass.from(this.network);
    test.deepEqual(qobj, this.out);
    test.done();
  }
};