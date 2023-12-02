// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @dev Extension of ERC1155 that adds the ownership percentage feature.
 */
contract FractionalERC1155 is ERC1155, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    mapping(uint256 id => mapping(address account => uint256))
        private _balances;

    mapping(uint256 id => mapping(address account => uint256))
        private _ownershipPercentage;

    mapping(uint256 id => uint8) private _holdersCount;

    string private _uri;

    event FractionTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 percentage
    );
    event FractionMinted(
        uint256 indexed tokenId,
        address indexed to,
        uint256 amount,
        uint256 percentage
    );

    constructor(string memory uri_) ERC1155(uri_) {
        // _uri = uri_;
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(MINTER_ROLE, _msgSender());
    }

    modifier onlyMinter() {
        require(
            hasRole(MINTER_ROLE, _msgSender()),
            "FractionalERC1155: must have minter role to mint"
        );
        _;
    }

    // Do we need fractional mint?
    function mintFraction(
        address to,
        uint256 tokenId,
        uint256 amount,
        uint256 percentage,
        bytes memory data
    ) external onlyMinter {
        require(
            to != address(0),
            "FractionalERC1155: mint to the zero address"
        );

        _balances[tokenId][to] += amount;
        _ownershipPercentage[tokenId][to] += percentage;

        emit TransferSingle(_msgSender(), address(0), to, tokenId, amount);
        emit FractionTransferred(tokenId, address(0), to, amount, percentage);
    }

    function mintWithFractionalOwnership(
        address[] memory to,
        uint256 tokenId, // Should generate
        uint256[] memory amount, // ??
        uint8[] memory percentage,
        bytes memory data // ??
    ) external onlyMinter {
        require(
            to.length == percentage.length,
            "FractionalERC1155: Missmatch on receivers and percentages length"
        );

        uint8 length;
        uint8 sumOfPercentage;

        for (uint8 i; i < length; i++) {
            require(
                to[i] != address(0),
                "FractionalERC1155: mint to the zero address"
            );
            sumOfPercentage += percentage[i];
        }

        require(
            sumOfPercentage == 100,
            "FractionalERC1155: invalid sum of percentage"
        );

        for (uint8 i; i < length; i++) {
            _ownershipPercentage[tokenId][to[i]] = percentage[i];
            _balances[tokenId][to[i]] = amount[i];

            emit FractionMinted(tokenId, to[i], amount[i], percentage[i]);
        }
        _holdersCount[tokenId] = uint8(to.length);
    }

    function uri(
        uint256 /*tokenId*/
    ) public view virtual override returns (string memory) {
        return _uri;
        // return string(abi.encodePacked(_uri, tokenId.toString()));
    }

    function balanceOf(
        address account,
        uint256 id
    ) public view virtual override returns (uint256) {
        return _balances[id][account];
    }

    function balanceOfPercentage(
        address account,
        uint256 id
    ) public view returns (uint256) {
        return _ownershipPercentage[id][account];
    }

    function transferFraction(
        address to,
        uint256 tokenId,
        uint256 amount,
        uint256 percentage,
        bytes memory data
    ) external virtual {
        require(
            to != address(0),
            "FractionalERC1155: transfer to the zero address"
        );
        require(
            _ownershipPercentage[tokenId][_msgSender()] >= percentage,
            "FractionalERC1155: insufficient ownership percentage"
        );

        _safeTransferFrom(_msgSender(), to, tokenId, amount, data);

        _ownershipPercentage[tokenId][_msgSender()] -= percentage;
        _ownershipPercentage[tokenId][to] += percentage;

        emit FractionTransferred(tokenId, _msgSender(), to, amount, percentage);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(AccessControl, ERC1155) returns (bool) {
        return
            interfaceId == type(IERC1155).interfaceId ||
            interfaceId == type(IERC1155MetadataURI).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
