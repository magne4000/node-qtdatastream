const { types } = require('../index');
import { traits } from 'traits-decorator';

exports.decorators = {
  setUp: function(done) {
    types.QUserType.register('NetworkId', types.Types.INT);

    @traits(types.Exportable)
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
      obj: {
        NetworkId: { obj: 1, name: 'NetworkId' },
        UseRandomServer: { obj: false },
        Perform: { obj: [ 'a', 'b' ] },
        AutoIdentifyService: { obj: 'NickServ' },
        autoReconnectInterval: { obj: 60 },
        nullStr: { obj: null }
      }
    };
    done();
  },
  'no args': function(test) {
    const qclass = types.QClass.from(this.network);
    test.deepEqual(qclass.obj, this.out);
    test.done();
  }
};