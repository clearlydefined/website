# ClearlyDefined Web App

This project implements the website for [ClearlyDefined](https://clearlydefined.io). It's a relatively straightforward React app that serves mainly as a portal to discover and curate project data managed by the ClearDefined service.


The doc has a [guide to using the website](https://docs.clearlydefined.io/using-data) to browse, inspect and curate data.

# Getting started in the code

If you are interested in working on the code for the website, follow the steps below. 

## Fastest Set Up

The quickest way to get a fully functional local ClearlyDefined set up (including the website) is to use the [Dockerized ClearlyDefined environment setup](https://github.com/clearlydefined/docker_dev_env_experiment). This runs all services locally and does not require access to the ClearlyDefined Azure account.

## Alternative Set Up

Some parts of this set up may require access to the ClearlyDefined Azure Account.

1.  The site is based on [React]() so you need to [install NPM]().
1.  Clone [this repo](https://github.com/clearlydefined/website.git) using `git clone https://github.com/clearlydefined/website.git` or equivalent.
1.  Change to the website repo directory (e.g., `cd <dir where you cloned website>`)
1.  Run `npm install`
1.  Run `npm start`

This sequence will get the code for site, fetch all the prerequisites, build the site, start it running and open a browser on http://localhost:3000. You should see the ClearlyDefined website and be able to browse the data etc. If you login (top right corner), more functionality will light up.

This simple setup uses the _development_ instance of the service. That may be highly volatile and will change without notice.

Since you are not forced to consume only the local APIs, but you can even consume directly the remote development or production APIs, for the `website` repo only you are able to point out different APIs endpoints, depending on your needs, using different kinds of npm scripts: - `npm start` use the default environment, which is actually the DEV environment, and it refers to development APIs - `npm run start:dev-api` points out specifically to the development APIs - `npm run start:local-api` points out the local environment, which works only if the service repo is started - `npm run start:prod-api` points out specifically to the production APIs

### Running e2e Tests

If you want to test the development running e2e tests, just simply run:

- `npm run e2e:test` runs all the test that are saved into the folder `e2e/tests/`

You can write your own tests, just create a new file inside the `e2e/tests/` folder.
All e2e are written using `jest` and `puppeteer`.

Note that by default all the e2e tests runs checking the development website on https://dev.clearlydefined.io
If you want to run test on your local environment, you should run:

- `npm start` start the website as normal. Builds the application and starts it on localhost:3000
- `npm run e2e:test` run all the test checking on http://localhost:3000

# Contributing

This project welcomes contributions and suggestions, and we've documented the details in the [contribution policy](CONTRIBUTING.md).

The [Code of Conduct](CODE_OF_CONDUCT.md) for this project is details how the community interacts in
an inclusive and respectful manner. Please keep it in mind as you engage here.

## Workareas

### Responsiveness

Well, the title says it. The site is not particularly responsive. Somethings are ok, most are not. The use of large
text editor areas makes things tough. We may need some alternative experiences or simply disable them in
more constrained environments. Ideally mobile users would be able to at least browse and do rudimentary data
entry. Even on desktops, users looking to dock half-screen windows to the side of their monitors may be a bit cramped.

Overall we need a design that talks about what is possible on different form-factors and user scenarios, and then
a mess of work to make that happen.

### Contribution workflow

Currently there are few affordances for a normal user to contribute a little bit of data for a component let alone anything for a component that is not already in the system.

- YAML is ok to read but is less fun to create. Certainly for non-techies. Certainly without auto-complete and schema validation. Those could be added to the editors (there are issues for that) but it is still not the most approachable.
- There is no story for contributing data for something that is not already “in the system”. You can’t pick it from the selection box for example. The only option is to queue it for harvesting. Harvest queuing is not exposed to the masses at this point.

We need a simple perhaps form-based experience where users can fill in the data they have and create whole new definition
entries in the system. One idea is to enable some lightweight scanning that just does top level licenses, source location,
etc. and populates the system. Then, at a later date, the full ScanCode style tools can be run and the data built out.

Understanding an optimal user experience for this will be key to making it compelling.

### Implementation validation

The first version of the web app was written by React/Redux newbie (the author of this text so I can say that).
While it may be ok, there are likely untold bad practices and less than optimal code patterns. Data
management via Redux is likely one of the key culprits.

Having some folks who have a proven deep understanding Redux and React take a look at the setup and help it mature into
a world-class React app would be fantastic.
