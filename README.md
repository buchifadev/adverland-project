# AdverLand 

Hello, this is my Celo 101 submission.
It's an advertising dapp that allows people to post advertisements on the platform and pay a base fee for the advertisement. Other users who come to the platform can view the adverts and earn the process. I intend to build something similar to how Brave browser awards brave tokens to users who view advertisements. I will be glad to hear what you guys have to say about it.

**Some things to note while testing the dapp**
- Advert creation cost a minimum of 2 CELO tokens. You can fund the advert with more tokens on the advert page.
- Every view on an advert deducts 1 CELO from the advert balance. Once an advert is out of funds, it is automatically taken out of the dashboard.
- A user can only view and advert once, any other attempt results to an error.
- For every advert a user view, they earn .5 CELO and the remaining .5 CELO goes back to the platform.
- Only the admin can view and withdraw funds accumulated in the platform.

## Testing 
Visit https://buchifadev.github.io/adverland-project to test the dapp on the celo testnet. (Please make sure to have enough CELO before testing the dapp)

## Set up
- Clone using `git clone https://github.com/buchifadev/adverland-project.git`
- Install dependencies using `npm install` or just `yarn` (if you use yarn)
- Run using `npm start`
