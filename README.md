# ClearlyDefined Web App

This project implements the website for [ClearlyDefined](https://clearlydefined.io). It's a relatively straightforward React app that serves mainly as a portal to discover and curate project data managed by the ClearDefined service.

The doc has a [guide to using the website](https://docs.clearlydefined.io/using-data) to browse, inspect and curate data.

# Getting started in the code

If you are interested in working on the code for the website, follow the steps below. If you want to get the whole ClearlyDefined infrastructure running on you machine, check out the [system quick start guide](https://github.com/clearlydefined/service/readme.md).

1.  The site is based on [React]() so you need to [install NPM]().
1.  Clone [this repo](https://github.com/clearlydefined/website.git) using `git clone https://github.com/clearlydefined/website.git` or equivalent.
1.  In a command shell, set the following environment variable (the syntax will depend on your choice of shell):
    - `REACT_APP_SERVER=https://dev-api.clearlydefined.io`
1.  Change to the website repo directory (e.g., `cd <dir where you cloned website>`)
1.  Run `npm install` in the root as well as in `./components`
1.  Run `npm link ./components`
1.  Run `npm start`

This sequence will get the code for site, fetch all the prerequisites, build the site, start it running and open a browser on http://localhost:3000. In the end you should see the ClearlyDefined homepage in your browser.

This simple setup uses the _development_ instance of the service. That may be highly volatile and will change without notice.
Having said that, we use it all the time so you're probably good. If you want setup your own service (and crawler for that matter), use the [simple local system setup guide](https://docs.clearlydefined.io/contributing-code) that has only a few more steps and gets you running all of ClearlyDefined on you local machine.

The extra npm install and link commands are needed becuase this repo includes some generally useful React components that are
published as a separate NPM package that is, by default, installed from npmjs.com. In order to develop these components,
you need to link the component directory. Note that you will have to redo the link step each time you run `npm install`.

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
