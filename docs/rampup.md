# New developer rampup / training

The website is a simple React app, see the [README](/README.md) for basic info. These are suggested steps / tips to get familiar with the codebase:

0. Clone the repo.
0. Run `npm install`
0. Run `npm test` make sure tests pass.
0. Take a look at the scripts in `package.json`
0. To run locally, take a look at the `start` script or `start:*-api`
    * The website just talks to the service, you can point to the global dev or prod service. The 'local' env assumes you are running the service locally.
0. `npm run start:dev-api` starts the site up on localhost:3000, and opens a brower window to it.
0. Use the React Chrome plugin to help with development

## Making a contribution

0. Update a package version in package.json for an example contribution
0. Open a PR against master branch.
    * We have a master and prod branch on GitHub that correspond to dev and prod enviornments
0. Take a look at pipelines running for website
    * https://dev.azure.com/clearlydefined/ClearlyDefined/_build?definitionId=23&_a=summary 
    * https://dev.azure.com/clearlydefined/ClearlyDefined/_build?definitionId=28&_a=summary
0. First one uses azure-pipelines.yaml in repo, you can view that file to see what is running
0. Second one is e2e test, graphical setup of pipeline in AzDO
    * Points to netlify preview.
    * Uses ‘jest’ framework
0. Get your PR reviewed/merged
0. Once PR is merged:
   * Pipelines runs to build and push container image to ACR, also artifact: drop
   * Release: Deploys to Azure App Service (Linux/Docker), runs e2e test against dev.
0. Can test change in dev environment now. (If it were more than a package version change)
0. Can push from master to prod, will start production build (requires write access)
    * Builds and pushes image to ACR.
    * Prod Release has two deployments: US and Europe, just deploys and restarts
0. View portal: clearlydefined-dev, clearlydefined-prod, clearly-defined-prod-europe (requires portal access)
0. Can double check that deployment was good in activity log

## Management in Portal
*	Scale out settings to handle traffic
*	Traffic Manager: clearlydefined-prod
*	Location based rules, no easy way to hit Europe deployment from US (vpn?)

## Dependency Security Management

This project uses two tools to monitor (and fix) vulnerabilities in this project's dependencies.

### Dependabot

* [Dependabot](https://docs.github.com/en/free-pro-team@latest/github/managing-security-vulnerabilities/about-dependabot-security-updates) is a GitHub Security Feature. It tracks vulnerabilities in several languages including JavaScript.
* When Dependabot detects any vulnerabilities in the [GitHub Advisory Database](https://docs.github.com/en/free-pro-team@latest/github/managing-security-vulnerabilities/browsing-security-vulnerabilities-in-the-github-advisory-database), it sends a notification and may also open a pull request to fix the vulnerability.
* Only project maintainers can see Dependabot alerts

### Snyk
* [Synk Open Source](https://solutions.snyk.io/snyk-academy/open-source) is similar to Dependabot, though not GitHub specific. It also tracks vulnerabilities in dependencies.
* When Synk detects a vulnerability in the [Synk Intel Vulnerability Database](https://snyk.io/product/vulnerability-database/), it also opens a pull request with a fix for the vulnerability.
* Everyone can see pull requests opened by Snyk, but only members of the Clearly Defined organization on Snyk can see details of the vulnerability.
* If you do not have access to the Clearly Defined Snyk organization, reach out to @nellshamrell 

### Why both?

We are using both Dependabot and Snyk partly for experimental purposes but also because they use different vulnerability databases. One may detect a vulnerability that the other does not. At some point we may settle on one, but currently lose nothing by having both.
