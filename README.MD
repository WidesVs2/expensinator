# WidesVs2 Expensinator

This web app is a simple expense tracker with user authentication. This was built for demonstration but is fully functional and safe to use. Although, truthfully, this kind of thing relies on user input to be meaningful, and if you're already disciplined enough to remember to do so, you most likely got a good grasp of your finances anyways. Haha. There are currently no plans to extend the features of this app. Feel free to use the code base as a starting point for your own projects.

## How to Use

To see the app in action, go to {PLACEHOLDER} or clone this repository into an empty directory on your local machine.

NOTE: This repository contains server side code and the BUILT result of a react front end. This repository is the production builds of server and client side code. Each section has their own repositories for development seperately.

Once downloaded to your local machine, run npm install. Create a .env file in the root, and supply it with neccessary environment variables as follows

```
    EMAIL_USER=<your-info>
    EMAIL_PASS=<your-info>
    SECONDARY_EMAIL=<your-info>
    DB_USER=<your-info>
    DB_PASS=<your-info>
    DB_NAME=<your-info>
    JWT_SECRET=<your-info>
    ADMIN_ACCOUNT_ID=<your-info>
```

NOTE: Admin account id is not neccesary for app funtionality. However, if you want this functionality, be sure to check your MongoDB Database for the \_id value and plug it into the ADMIN_ACCOUNT_ID variable.

Once these steps are complete, insure you are in the root directory of the app, then enter npm run dev to start nodemon and navigate your browser to http://localhost:5000.
