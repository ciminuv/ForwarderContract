pragma solidity ^0.7.0;

import "./IERC20.sol";

contract Forwarder {
  address payable public destination;

	constructor(address payable destinationAddress) public {
		destination = destinationAddress;
	}

	receive() external payable {}

	function flushTokens(address tokenContractAddress) public {
		IERC20 instance = IERC20(tokenContractAddress);
		address forwarderAddress = address(this);
		uint256 forwarderBalance = instance.balanceOf(forwarderAddress);
		if (forwarderBalance == 0) {
			return;
		}
		if (!instance.transfer(destination, forwarderBalance)) {
			revert();
		}
	}

	function flush() public {
		destination.transfer(address(this).balance);
	}
}
