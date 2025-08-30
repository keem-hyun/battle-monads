// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/AggregatorV3Interface.sol";

contract PriceFeeds {
    AggregatorV3Interface internal btcUsdPriceFeed;
    AggregatorV3Interface internal ethUsdPriceFeed;

    /**
     * Network: Sepolia
     * BTC/USD: 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
     * ETH/USD: 0x694AA1769357215DE4FAC081bf1f309aDC325306
     */
    constructor() {
        btcUsdPriceFeed = AggregatorV3Interface(0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43);
        ethUsdPriceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
    }

    function getBTCPrice() public view returns (int256) {
        (
            ,
            int256 price,
            ,
            ,
            
        ) = btcUsdPriceFeed.latestRoundData();
        return price;
    }

    function getETHPrice() public view returns (int256) {
        (
            ,
            int256 price,
            ,
            ,
            
        ) = ethUsdPriceFeed.latestRoundData();
        return price;
    }

    function getBTCPriceWithTimestamp() public view returns (int256, uint256) {
        (
            ,
            int256 price,
            ,
            uint256 updatedAt,
            
        ) = btcUsdPriceFeed.latestRoundData();
        return (price, updatedAt);
    }

    function getETHPriceWithTimestamp() public view returns (int256, uint256) {
        (
            ,
            int256 price,
            ,
            uint256 updatedAt,
            
        ) = ethUsdPriceFeed.latestRoundData();
        return (price, updatedAt);
    }

    function getDecimals(address priceFeed) public view returns (uint8) {
        return AggregatorV3Interface(priceFeed).decimals();
    }
}