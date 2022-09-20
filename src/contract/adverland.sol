// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract AdverLand {
    uint256 counter = 0; // keeps track of number of adverts created
    address payable owner; // contract deployer
    uint256 totalViews; // total views from all adverts due for withdrawal
    uint256 constant viewCost = 1 ether; // cost advertiser pay per view of their advert
    uint256 constant baseDeposit = 2 ether; // minum deposit for advertisement


    mapping(uint256 => Advert) private allAdverts;
    mapping(uint256 => mapping(address => bool)) private alreadyViewed;

    struct Advert {
        address owner;
        bool active;
        string name;
        string description;
        string imageUrl;
        uint256 balance;
        uint256 views;
    }

    modifier isOwner() {
        require(
            payable(msg.sender) == owner,
            "Action authorized to only platform account"
        );
        _;
    }

    constructor() {
        owner = payable(msg.sender);
    }

    /// @dev allow users to  view an advertisement and get paid
    /// @notice Users are paid only once per advert 
    function viewAdvert(uint256 advertIndex) public {
        Advert storage currentAdvert = allAdverts[advertIndex];
        require(
            currentAdvert.owner != msg.sender,
            "Can't view own advert"
        );
        require(
            !alreadyViewed[advertIndex][msg.sender],
            "Already viewed"
        );
        require(currentAdvert.active, "Advert not active at the moment");        
        currentAdvert.balance -= viewCost;        
        currentAdvert.views += 1;        
        totalViews += 1;        
        uint256 valueAmount = viewCost / 2;
                
        // keep track of adverts user has viewed        
        alreadyViewed[advertIndex][msg.sender] = true;

        // proceed to confirm advert balance
        // deactivate advert in the case of insufficient funds
        if (currentAdvert.balance < viewCost) {            
            currentAdvert.active = false;
        }

        (bool success,) = payable(msg.sender).call{value: valueAmount}("");
        require(success, "Transfer failed");
    }

    /// @dev creates a new advert and send to platform
    /// @notice Input data can't contain empty values
    /// @notice base deposit must be sent to cover the costs of running the advert
    function createAdvert(
        string calldata name,
        string calldata description,
        string calldata imageUrl
    ) public payable {
        require(bytes(name).length > 0, "Empty name");
        require(bytes(description).length > 0, "Empty description");
        require(bytes(imageUrl).length > 0, "Empty imageUrl");
        require(
            msg.value >= baseDeposit,
            "Send more funds or check base deposit to learn more"
        );
        allAdverts[counter] = Advert(
            msg.sender,
            true,
            name,
            description,
            imageUrl,
            msg.value,
            0 // views initialized as zero
        );
        counter += 1;
    }

    /// @dev funds an advert
    /// @notice only the owner of the advert can fund the balance
    function fundAdvert(uint256 advertIndex) public payable {
        Advert storage currentAdvert = allAdverts[advertIndex];
        require(
            currentAdvert.owner == msg.sender,
            "Unauthorised to fund advert"
        );
        require(!currentAdvert.active, "You can only fund inactive adverts");
        require(
            msg.value >= 1 ether,
            "Insufficient amount sent"
        );
                
        // activate advert and add to platform
        currentAdvert.active = true;
        // update advert balance
        currentAdvert.balance += msg.value;    
    }

    /// @dev get info about an advert
    function advertDetails(uint256 advertIndex)
        public
        view
        returns (
            address,
            string memory,
            string memory,
            string memory,
            uint256,
            uint256
        )
    {       
        return (
            allAdverts[advertIndex].owner,
            allAdverts[advertIndex].name,
            allAdverts[advertIndex].description,
            allAdverts[advertIndex].imageUrl,
            allAdverts[advertIndex].balance,
            allAdverts[advertIndex].views
        );
    }

    /// @dev claim accumulatedFees due in contract
    /// @notice Only the owner of the smart contract can claim the accumulated fees
    function claimFees() public payable isOwner {
        uint256 accumulatedFees = (totalViews * 1 ether) / 2;
        // reset accumulated views
        totalViews = 0;
        (bool success,) = payable(owner).call{value: accumulatedFees}("");
        require(success, "Claim failed");
        
    }

    /// @dev view contract balance
    function viewContractBalance()
        public
        view
        isOwner
        returns (uint256)
    {
        return address(this).balance;
    }

    /// @return total advert views
    function viewAccumulatedViews()
        public
        view
        isOwner
        returns (uint256)
    {
        return totalViews;  
    }

    // return minimum deposit for an advert
    function viewMinimumDeposit() public pure returns (uint256) {
        return baseDeposit;
    }


    function viewCounter() public view returns (uint256) {
        return counter;
    }
    
    
    function viewOwner() public view returns (address) {
        return owner;
    }
}
