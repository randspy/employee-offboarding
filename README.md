# Installation

The application was developed on MacBook Air M1 with node v22.12.0.

If you have [volta](https://volta.sh) you can install this node version with:

```
volta install node
```

Install dependencies:

```
npm install
```

# Running the application

Server will run on http://localhost:3010/ and client on http://localhost:4200/.

```
npm start
```

Unit tests:

```
npm test
```

# Application's overview

The Application is employee offboarding app.

# Project structure

The app is based on architecture described in [Angular enterprise architecture](https://angularexperts.io/products/ebook-angular-enterprise-architecture).

    app
        core - business logic used by multiply features
        features - business features, contains components and specific business logic
        layout - components used for application layout

In the application have only one feature - offboarding. Still I have decided to create a lazy loaded feature module. I would consider it as a good practice.

# My assumptions and technical choices:

- Server has a response delay for get methods of 0.5 seconds and for post method of 2 seconds. More realistic that instant response.
- For each request I have loading and error states. Nothing fancy. Just displayed text in the UI.
- The search is debounced by 300ms.
- I have tried to wrap the material into a custom components but after doing it only for link button I have decided it would be too much work. Still I would prefer to have a design system for it.
- I have moved country before the phone number in the address form. As normally we would set validators for address fields based on the country. For example postal code and phone number change from country to country. I have specified the validators for Poland.
- For the store I like to use ngrx. It adds a structure to the application. Ngrx signal store looks nice, less structures. Not strong opinion about it yet. The business logic in the store could be moved to the services. The content of isAlreadyOffboarded function in OffboardingEmployeeDetailPageComponent could be considered as business logic leakage. And potentially moved to a service. I would need to think more about the domain.
- in the post api we have an id. I have assumed that it is the id of the employee. But it may not be true. The post example also is missing city field so I have added it.
