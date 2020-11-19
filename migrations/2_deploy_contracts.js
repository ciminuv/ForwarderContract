const Forwarder = artifacts.require("Forwarder");

module.exports = function(deployer) {
  deployer.deploy(Forwarder, '0x69c8C80B579588C22715D4FB21833659F9452D53');
};
