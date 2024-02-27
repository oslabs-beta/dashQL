
![dashQL_Logo](https://github.com/oslabs-beta/dashQL/assets/129707410/711f1cc0-6076-4a83-8c27-c70e22a665a9)

![graphql](https://img.shields.io/badge/GraphQl-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![redis](https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white)
![typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)



# About

dashQL is a lightweight GraphQL caching tool utilizing Redis to cache queries at the field level to further improve reponse time and decrease the number of redundant requests required 


# Features
* Allows for caching at the field level from the GraphQL abstract syntax tree
* Ability to handle query requests both with and without an a parameter
* Ability to cache deeply nested queries
* 

# Getting Started
Download dashQL as an npm module and save it to your package.json as a dependency   `npm install dashQL`

# How to Use
1. ? install Redis ?
2. update server routes to /dashQL
3. 

# Demo
Feel free to visit our website to get an interactive demonstration of how our caching tool works and view the significantly improved response times

After entering our site, you will be met with a demonstration with the ability to run GraphQL queries with an interactive selection tool utilizing the Star Wars API.

1. Select the fields you would like to query and a preview of the GraphQL query will be shown

![name mass](https://github.com/oslabs-beta/dashQL/assets/129707410/0ec087f5-788f-4fc3-8c71-91043b2299ef)

2. Click the 'Run Query' button to see the GraphQL query result. The metrics above will show the uncached response time populated on the graph and a cache hit/miss result will be logged to the bar charts. A cache miss will be logged the first time a unique query is run indicating that the query was not found in our cache and will be stored.

![name-mass-time](https://github.com/oslabs-beta/dashQL/assets/129707410/41d99ef2-2a4c-475a-ac4f-1d85b4eaa0eb)


3. This time, select an additional field to query. Then click the 'Run Query' button. The response time has drastically decreased as the previous field level queries were stored in the cache and the server only has to go to the database for one field.

![name-mass-eye color](https://github.com/oslabs-beta/dashQL/assets/129707410/da64d56d-ecde-4d2b-81b3-13181ca7c1b7)

4. Feel free to play around with nested queries by selecting 'Species' or queries without an '_id' argument.

![nested](https://github.com/oslabs-beta/dashQL/assets/129707410/5fbbf576-308a-4d01-afc1-3bcf99af4177)
In this last example, you will notice the response time is decreased even further on the third query request as now all information is coming from the cache. 

5. Lastly, click the 'Clear Cache' button to clear the cache and start over. 



# Contributing to dashQL
The team at dashQL is excited you are interested in contributing to dashQL. 
1. Fork repo from the `dev` branch
2. Create your feature branch (`git checkout -b feature/yourFeature`)
3. Stage and commit your changes (`git commit -m "added cool new feature"`)
4. Push to branch (`git push origin feature/yourFeature`)
5. Open a pull request to `dev` which will be reviewed by one of the dashQL authors prior to merge

## Roadmap for Future Development
- [ ] Handle mutations
- [ ] End-to-end testing
- [ ] Additional eviction strategies
- [ ] Security features

# Authors
Dan Bonney [LinkedIn](https://www.linkedin.com/in/dan-bonney/) | [Github](https://github.com/D-Bonney)  
Meredith Fronheiser  [LinkedIn](https://www.linkedin.com/in/meredith-fronheiser/) | [Github](https://github.com/mfronheiser)  
Kevin Klochan  [LinkedIn](https://www.linkedin.com/in/kevin-klochan-7a0ba7218/) | [Github](https://github.com/kevinklochan)  
Drew Williams  [LinkedIn](https://www.linkedin.com/in/andrew-vaughan-williams/) | [Github](https://github.com/avwilliams1995)



Please ⭐ our repo if you've found this useful, we want to be able to help as many of developers as we can!
