// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {
    AggregatorV3Interface internal priceFeed;

    /**
     * Network: Mumbai Testnet
     * Aggregator: MATIC/USD
     * Address: 0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada
     */
    constructor() {
        priceFeed = AggregatorV3Interface(0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada);
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int) {
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return price;
    }

    function getDecimals() public view returns (uint8) {
        return priceFeed.decimals();
    }

    function getUSDToMatic(uint256 _usd, uint8 _usdDecimals) public view returns (uint){
        int _maticUSDPrice = getLatestPrice(); // 8 decimals
        uint8 _decimals = getDecimals();

        // ex: 1 matic = 0.9 $ --> 90_000_000
        uint256 _matics = (_usd * uint(_decimals) / uint(_maticUSDPrice)) * uint(_usdDecimals);
        return _matics;

    }
}