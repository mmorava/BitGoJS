var Wallets = require('./wallets');
var Keychains = require('./keychains');

var coinInstances;

var BaseCoin = function(bitgo, coin) {
  this.bitgo = bitgo;
  this.initializeCoin(coin);
  
  var self = this;
  
  this.url = function(suffix) {
    return bitgo._baseUrl + '/api/v2/' + coin + suffix;
  };
  
  this.wallets = function() {
    if (!self.coinWallets) {
      self.coinWallets = new Wallets(bitgo, this);
    }
    return self.coinWallets;
  };
  
  this.keychains = function() {
    if (!self.coinKeychains) {
      self.coinKeychains = new Keychains(bitgo, this);
    }
    return self.coinKeychains;
  };
  
};

BaseCoin.prototype.initializeCoin = function(coin) {

  if (!coinInstances) {
    // initialization has to be asynchronous to avoid circular dependencies
    coinInstances = {
      btc: require('./coins/btc'),
      tbtc: require('./coins/tbtc')
    };
  }

  var coinInstance = coinInstances[coin];
  if (!coinInstance) {
    throw new Error('Coin type ' + coin + ' not supported');
  }
  coinInstance.call(this);

};

BaseCoin.prototype.toJSON = function() {
  return undefined;
};

module.exports = BaseCoin;
