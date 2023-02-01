## Graphql
### Tasks:
1. Add logic to the restful endpoints (users, posts, profiles, member-types folders in ./src/routes).  
   1.1. npm run test - 100%  
2. Add logic to the graphql endpoint (graphql folder in ./src/routes).  
Constraints and logic for gql queries should be done based on restful implementation.  
For each subtask provide an example of POST body in the PR.  
All dynamic values should be sent via "variables" field.  
If the properties of the entity are not specified, then return the id of it.  
`userSubscribedTo` - these are users that the current user is following.  
`subscribedToUser` - these are users who are following the current user.  
  
   * Get gql requests:
   
   2.1. Get users, profiles, posts, memberTypes - 4 operations in one query.
   ```
   query {
      users {id}
      posts {id}
      profiles {id}
      memberTypes {id}
   }
   ```
   2.2. Get user, profile, post, memberType by id - 4 operations in one query.
   ```
   query ($userId: ID!, $profileId: ID!, $postId: ID!, $memberTypeId: idMemberType!){
    user(id:  $userId) { id }
    profile(id: $profileId) { id }
    post(id:  $postId) { id }
    memberType(data: {
        id: $memberTypeId
    }) { id }
   }
   ```
   2.3. Get users with their posts, profiles, memberTypes.  
   ```
   query {
    users {
        profile {
            id
            city
            memberTypeId
        }
        id
        posts {
            id
        }
        memberType {
            id
        }
    }
   }
   ```
   2.4. Get user by id with his posts, profile, memberType.
   ```
   query ($id: ID!){
    user(id:  $id) {
        id
        lastName
        firstName
        posts {
            id
        }
        profile {
            id
        }
        memberType {
            id
        }
    }
   }
   ```
   2.5. Get users with their `userSubscribedTo`, profile.
   ```
   query {
    users {
        id
        userSubscribedTo {
            id
        }
        profile {
            id
        }
    }
   }
   ```
   2.6. Get user by id with his `subscribedToUser`, posts.
   ```
   query ($id: ID!){
    user(id: $id) {
        id
        subscribedToUser {
            id
        }
        posts {
            id
        }
    }
   }
   ```
   2.7. Get users with their `userSubscribedTo`, `subscribedToUser` (additionally for each user in `userSubscribedTo`, `subscribedToUser` add their `userSubscribedTo`, `subscribedToUser`).
   ```
   query {
    users {
        id
        userSubscribedTo {
            id
            userSubscribedTo {
            id
        }
        subscribedToUser {
            id
        }
        }
        subscribedToUser {
            id
            userSubscribedTo {
            id
        }
        subscribedToUser {
            id
        }
        }
        profile {
            id
        }
    }
   }
   ```
   * Create gql requests:   
   2.8. Create user.
   ```
   mutation ($data: createUser){
    addUser (data: $data)
    {
        id
        firstName
        lastName
    }
   }
   ```
   2.9. Create profile.
   ```
   mutation ($data: createProfiles) {
    addProfile (
        data : $data
    ) {
        id
        sex
        memberTypeId
        avatar
        birthday
        country
        street
        city
        userId
    }
   }
   ```
   2.10. Create post.
   ```
   mutation ($data: createPost) {
    addPost (
        data : $data
    ) {
        id
        content
        userId
        title
    }
   }
   ```
   * Update gql requests:  
   2.12. Update user.
   ```
   mutation ($data: updateUser){
    updateUser (
        data: $data
    ){
        id
        firstName
        lastName
    }
   }
   ```
   2.13. Update profile.  
   ```
   mutation ($data: updateProfiles){
    updateProfile (
        data: $data
    ) {
        id
        sex
        memberTypeId
        avatar
        birthday
        country
        street
        city
        userId
    }
   }
   ```
   2.14. Update post.
   ```
   mutation ($data: updatePost){
    updatePost (
        data: $data
    ) {
        id
        title
        content
        userId
    }
   }
   ```
   2.15. Update memberType.
   ```
   mutation ($data: updateMemberType){
    updateMemberType (
        data: $data
    ) {
        id
        discount
        monthPostsLimit
    }
   }
   ```
   2.16. Subscribe to; unsubscribe from.
   ```
   mutation ($data: subscribeUserData){
    subscribeTo (
        data: $data
    ) {
        id
    }
   }
   
   mutation ($data: unsubscribeUserData){
    unsubscribeFrom (
        data: $data
    ) {
        id
    }
   }
   ```

3. Solve `n+1` graphql problem with [dataloader](https://www.npmjs.com/package/dataloader) package in all places where it should be used.  
   You can use only one "findMany" call per loader to consider this task completed.  
   It's ok to leave the use of the dataloader even if only one entity was requested. But additionally (no extra score) you can optimize the behavior for such cases => +1 db call is allowed per loader.  
   3.1. List where the dataloader was used with links to the lines of code (creation in gql context and call in resolver).  
4. Limit the complexity of the graphql queries by their depth with [graphql-depth-limit](https://www.npmjs.com/package/graphql-depth-limit) package.   
   4.1. Provide a link to the line of code where it was used.
   ```
   Implemented in /src/routes/graphql/index.ts on lines 53-61
   ```
   4.2. Specify a POST body of gql query that ends with an error due to the operation of the rule. Request result should be with `errors` field (and with or without `data:null`) describing the error.
   ```
   query {
    users {
        id
        userSubscribedTo {
            id
            userSubscribedTo {
            id
            userSubscribedTo {
            id
        }
        subscribedToUser {
            id
        }
        }
        subscribedToUser {
            id
        }
        }
    }
   }
   ```
