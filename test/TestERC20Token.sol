// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestERC20Token is Context, ERC20 {
  constructor () public ERC20("TestERC20Token", "TET") {
    _mint(_msgSender(), 10000 * (10 ** uint256(decimals())));
  }
}
