//SPDX-License-Identifier: Unlicense


pragma solidity ^ 0.8.4;



contract Whitelist {



  //upper limit
  uint8 public maxWhitelistedAddresses;

  mapping(address => bool) public whitelistedAddresses ;

  //count
  uint8 public numAddressesWhitelisted ;

  constructor (uint8 _maxWhitelistedAddresses){
    maxWhitelistedAddresses = _maxWhitelistedAddresses;
  }


  function addAddressToWhitelist() public {
    require(!whitelistedAddresses[msg.sender] , "You have already been whitelisted");
    require(numAddressesWhitelisted < maxWhitelistedAddresses, "Limit Reached");
    
    whitelistedAddresses[msg.sender] = true ;
    numAddressesWhitelisted += 1;
  }



} 
