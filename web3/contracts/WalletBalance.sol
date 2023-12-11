// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract WalletBalance {
    IERC20 public WMatic;
    AggregatorV3Interface internal reservesWMatic;

    address base_asset_address = 0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747;
    address quot_asset_address = 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889;
    uint80 _roundId = 10;
    /**
     * Aggregator: WMatic reserve and WMatic supply
     * WMatic Address: 0xb0897686c545045aFc77CF20eC7A532E3120E0F1
     * Reserves Address: 0x3d2341ADb2D31f1c5530cDC622016af293177AE0
     */
    constructor() {
        WMatic = IERC20(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599);
        reservesWMatic = AggregatorV3Interface(
            0xB622b7D6d9131cF6A1230EBa91E5da58dbea6F59
        );
    }



    function getMaticBalance(address entry) public view returns(int256){
        (, int256 answer,,,) = getRoundData(base_asset_address,quot_asset_address, _roundId);
        return answer;
    }



function getRoundData(
  uint80 _roundId
)
  public
  view
  override()
  returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
{
  return super.getRoundData(_roundId);
}

function hasAccess(address _user, bytes memory _calldata) public view virtual override returns (bool) {
  return super.hasAccess(_user, _calldata) || _user == tx.origin;
}









    //Returns the latest Supply info
    function getSupply() public view returns (uint256) {
        return WMatic.totalSupply();
    }

    //Returns the latest Reserves info
    function getLatestReserves() public view returns (int) {
        (
            ,
            /* uint80 roundID */ int answer /* uint startedAt */ /* uint updatedAt */ /* uint80 answeredInRound */,
            ,
            ,

        ) = reservesWMatic.latestRoundData();
        return answer;
    }

    //Determines if supply has exceeded reserves
    function isWMaticHealthOK() public view returns (bool) {
        return getLatestReserves() >= int(getSupply());
    }
}
