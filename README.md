# Publixmon (HackGT 8 Project)
## Contributors
 - Rohan Agarwal
 - Saigautam Bonam
 - Kinshuk Phalke
## Inspiration
To transform the experience of shopping with gamification, we looked to past games that took the world by storm and brought people together. Two phenomena stood out to us:

1. **Classic Pokémon games**: millions of people spending countless hours and meeting and trading with others, all to grow their collection of virtual characters. Pokémon has one of the largest and strongest communities in the world decades later.

2. **Toys in cereal boxes**: every kid always hoped for one of these and got excited over every new box that was purchased.

_What if the same excitement was brought to the average retail store?_ It would drive traffic and sales for stores and brands while making the experience more enjoyable and potentially affordable for consumers.

## What it does
Publixmon brings fun, affordability, and community to the average retail store. 

With every checkout, the mobile app has a chance to give the user a unique virtual art piece based on a product they bought. Van Gogh meets bananas? "The Scream" meets Cinnamon Toast Crunch? They can all be yours! We've implemented a ML style transfer to generate the image as well as an NFT blockchain that integrates with purchase history.

When users walk into their local store and scan a QR code at the entrance, they can see other active users who are in the store at the same time. Different people can find each other in the store using location technology to socialize, see each other's collections of virtual toys, and trade them to grow their collection.

A user's collection is auto-scored based on size and variety of collectibles. The more a user engages, the more savings they can earn through barcode coupons!

## How we built it
Shopping history was attained through NCR Business Services Platform API.

Virtual toys were generated using machine learning style transfer in OpenCV and NFTs implemented in Solidity.

We used Flask, Node.js, Firebase, and Heroku for the backend and React Native for the frontend.

Other miscellaneous tech we used includes QR codes, location tracking, and more.

## Challenges we ran into
The biggest challenges we ran into all had to do with using technologies we had never used before, specifically NCR's API and Solidity. Through independent research, working with mentors, and troubleshooting together, we were able to get it working.

## Accomplishments that we're proud of
We're proud of building a functioning, original app that we believe has potential to improve the retail experience for both sides. We're also proud of being able to do so by learning and using the latest technologies, such as machine learning and crypto. Finally, it was great to team up with people we hadn't worked with before, learn each other's strengths, and build something together we were all interested in.

## What we learned
We learned several new technologies and how to integrate them together into one system. Outside of technical skills, we also learned a lot about the space of retail through our brainstorming and research.

## What's next for Publixmon
Next is to take the app from a proof-of-concept to a production-ready app, fleshing out features like location mapping and NFT trading, partnering with retailers to implement features such as real purchase history and promotions, and expanding the uniqueness and value of the collectibles we offer. We also want to experiment with better algorithms for rewarding users with collectibles and promotions.

## More on the project
See a demo on [YouTube](https://youtu.be/Ox_4EWKmk7k) and our [DevPost](https://devpost.com/software/publixmon) for more info.

