// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4.0;

contract Whitelist {

  uint8 public maxWhiteListedAddresses;

  uint8 public numAddressWhitelisted;

  mapping(address => bool) public whitelistedAddresses; 


  constructor(uint8 _maxWhiteListedAddresses) {
    maxWhiteListedAddresses = _maxWhiteListedAddresses;   
  }

  function addAddressToWhiteList () public {
    require(!whitelistedAddresses[msg.sender] , "Sender already in the Whitelist");
    require(numAddressWhitelisted < maxWhiteListedAddresses , "Set limit reached!");
    whitelistedAddresses[msg.sender] = true ;
    numAddressWhitelisted += 1;
    
  }

}


