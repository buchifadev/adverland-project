// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract AdverLand {
    uint256 counter = 0; // keeps track of number of adverts created
    address payable owner; // contract deployer
    uint256 totalViews; // total views from all adverts due for withdrawal
    uint256 constant viewCost = 10**18; // cost advertiser pay per view of their advert
    uint256 constant baseDeposit = 2 * 10**18; // minum deposit for advertisement

    uint256[] activeAdverts;
    mapping(uint256 => Advert) allAdverts;
    mapping(uint256 => mapping(address => bool)) alreadyViewed;

    struct Advert {
        address owner;
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

    // View an advertisement and get paid 
    function viewAdvert(uint256 advertIndex) public {
        require(
            allAdverts[advertIndex].owner != msg.sender,
            "Can't view own advert"
        );
        require(
            !alreadyViewed[advertIndex][msg.sender],
            "Already viewed"
        );
        bool isActive = false;
        // confirm if advert has enough funds to fund it                
        for (uint256 i = 0; i < activeAdverts.length; i++) {
            if (activeAdverts[i] == advertIndex) {
                isActive = true;
                break;
            }
        }
        require(isActive, "Advert not active at the moment");        
        allAdverts[advertIndex].balance -= viewCost;        
        allAdverts[advertIndex].views += 1;        
        totalViews += 1;        
        uint256 value = viewCost / 2;
        payable(msg.sender).transfer(value);
        // keep track of adverts user has viewed        
        alreadyViewed[advertIndex][msg.sender] = true;

        // proceed to confirm advert balance
        uint256 adBal = allAdverts[advertIndex].balance;
        // deactivate advert in the case of insufficient funds
        if (adBal < viewCost) {            
            int256 index = -1;
            for (uint256 i = 0; i < activeAdverts.length; i++) {
                if (i == advertIndex) {
                    index = int256(i);
                    break;
                }
            }            
            if (index >= 0) {
                activeAdverts[uint256(index)] = activeAdverts[
                    activeAdverts.length - 1
                ];
                activeAdverts.pop();
            }
        }
    }

    // create a new advert and send to platform
    function createAdvert(
        string memory name,
        string memory description,
        string memory imageUrl
    ) public payable {
        require(
            msg.value >= baseDeposit,
            "Send more funds or check base deposit to learn more"
        );
        allAdverts[counter] = Advert(
            msg.sender,
            name,
            description,
            imageUrl,
            msg.value,
            0
        );
        activeAdverts.push(counter);
        counter += 1;
    }

    // fund advert
    function fundAdvert(uint256 advertIndex) public payable {
        require(
            allAdverts[advertIndex].owner == msg.sender,
            "Unauthorised to fund advert"
        );
        require(
            msg.value >= 10**18,
            "Insufficient amount sent"
        );
        // update advert balance
        allAdverts[advertIndex].balance += msg.value;
        bool isActive = false;
        // activate advert and add to platform
        for (uint256 i = 0; i < activeAdverts.length; i++) {
            if (activeAdverts[i] == advertIndex) {
                isActive = true;
                break;
            }
        }        
        if (!isActive) {
            activeAdverts.push(advertIndex);
        }
    }

    // return IDs of active adverts
    function allActiveAdverts() public view returns (uint256[] memory) {
        return activeAdverts;
    }

    // check more info about an advert
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

    // claim funds in contract
    function claimFees() public isOwner {
        uint256 accumulatedFees = (totalViews * 10**18) / 2;
        payable(owner).transfer(accumulatedFees);
        // reset accumulated views
        totalViews = 0;
    }

    // view contract balance
    function viewContractBalance()
        public
        view
        isOwner
        returns (uint256)
    {
        return address(this).balance;
    }

    // return total advert views
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

    //
    function viewCounter() public view returns (uint256) {
        return counter;
    }
    
    // 
    function viewOwner() public view returns (address) {
        return owner;
    }
}
