pragma solidity ^0.7.0;

import "./Forwarder.sol";

contract ForwarderFactory {
  event ForwarderCreated(address forwarderAddress);

  function create(address payable destination) public returns (Forwarder forwarder) {
    Forwarder forwarder = new Forwarder(destination);
    emit ForwarderCreated(address(forwarder));
  }
}
