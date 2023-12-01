// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

contract ReserveRegistry {
    // Struct to store information about a reserver
    struct ReserverInfo {
        bool isActive;
        // Add any additional information about the reserver
    }

    // Mapping from reserver's address to ReserverInfo
    mapping(address => ReserverInfo) private _reservers;

    // Event emitted upon reserver registration
    event ReserverRegistered(address reserver);

    // Event emitted upon reserver deactivation
    event ReserverDeactivated(address reserver);

    // Modifier to ensure only the owner (MainERC3525 contract) can perform certain actions
    modifier onlyOwner() {
        require(msg.sender == owner, "ReserveRegistry: Only owner can perform this action");
        _;
    }

    // Address of the owner (MainERC3525 contract)
    address public owner;

    constructor() {
        // Set the contract owner to the address deploying the contract
        owner = msg.sender;
    }

    // Function to register a reserver
    function registerReserver(address reserver) external onlyOwner {
        require(!_reservers[reserver].isActive, "ReserveRegistry: Reserver already registered");

        // Set reserver as active
        _reservers[reserver] = ReserverInfo(true);

        // Emit event
        emit ReserverRegistered(reserver);
    }

    // Function to deactivate a reserver
    function deactivateReserver(address reserver) external onlyOwner {
        require(_reservers[reserver].isActive, "ReserveRegistry: Reserver not registered");

        // Deactivate reserver
        _reservers[reserver].isActive = false;

        // Emit event
        emit ReserverDeactivated(reserver);
    }

    // Function to check if a reserver is active
    function isReserverActive(address reserver) external view returns (bool) {
        return _reservers[reserver].isActive;
    }

    // Additional functions for querying reserver information...

    // Additional functions for managing reserver information...

    // You may add more functions based on your specific requirements

}


/*
Explanation:

1. **ReserverInfo Struct:**
   - A structure to store information about a reserver, including whether they are active. You can add more fields for additional information.

2. **_reservers Mapping:**
   - Mapping from a reserver's address to ReserverInfo to keep track of registered reservers.

3. **ReserverRegistered and ReserverDeactivated Events:**
   - Events emitted upon reserver registration and deactivation for transparency and tracking.

4. **onlyOwner Modifier:**
   - A modifier to ensure that certain functions can only be called by the owner (MainERC3525 contract).

5. **owner Variable:**
   - The address of the owner (MainERC3525 contract).

6. **registerReserver Function:**
   - Allows the owner to register a reserver by marking them as active in the _reservers mapping.

7. **deactivateReserver Function:**
   - Allows the owner to deactivate a reserver by marking them as inactive in the _reservers mapping.

8. **isReserverActive Function:**
   - Allows external callers to check if a specific reserver is currently active.
*/