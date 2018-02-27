# ClearlyDefined Web App

This project implements the website for [ClearlyDefined](https://clearlydefined.io). It's a relatively straightforward React app that serves mainly as a portal to discover project data and to create and review new curations of project data.

# Getting Started
1. Set the following environment variables:
   * REACT_APP_SERVER=[http://localhost:4000 | https://dev-api.clearlydefined.io | ...] -- Note the default is http://localhost:4000 so you can leave this unset if your service is also local.
1. `npm install && npm start`

That installs all the dependencies and starts the website on http://localhost:3000.

Initially there is not much on the site unless you login (see top right corner). Contact the project team 
for credentials if needed. In the near future that will all be opened up but for now we need a little more control.

Please refer to the [service's quick start guide](https://github.com/clearlydefined/service/blob/master/README.md) for information on how to setup a local instance of the `service`.

# Using the site

## Curation
On the **Curation** tab you will see several views of the harvested and curated data. This is likely to change
rapidly in the near future so the doc here will be sparse. Throughout the curation part of the site you can use URLs following this pattern

```
https://clearlydefined.io/curation/type/provider/namespace/name/revision/pr/number
```

Where the segments have following values:

* type -- the type of the component you are looking for. For exammple, npm, git, nuget, maven, ... This talks about the *shape* of the component.
* provider -- where the component can be found. Examples include npmjs, mavencentral, github, nuget, ...
* namespace -- many component systems have namespaces. GitHub orgs, NPM namespace, Maven group id, ... This segment must be supplied. If your component does not have a namespace, use '-' (ASCII hyphen).
* name -- the name of the component you want. Given the `namespace` segment mentioned above, this is just the simple name.
* revision -- components typically have some differentiator like a version or commit id. Use that here. If this segment is omitted, the latest revision is used (if that makes sense for the provider).
* pr -- literally the string `pr`. This is a marker segment and must be included if you are looking for the 
results of applying a particular curation PR to the harvested and curated data for a component
* number -- the GitHub PR number to apply to the existing harvested and curated data.

### Examples

* https://clearlydefined.io/curation/npm/npmjs/-/react/2.20.1
* https://clearlydefined.io/curation/npm/npmjs/@someNamespace/coolpackage/1.13/pr/37
* https://clearlydefined.io/curation/git/github/clearlydefined/service/0.1.0

# ClearlyDefined, defined.

## Mission
Help FOSS projects be more successful through clearly defined project data.

For more details on the project, check out the [wiki](../../../clearlydefined/wiki).

# Contributing

This project welcomes contributions and suggestions, and we've documented the details of contribution policy [here](CONTRIBUTING.md).

The [Code of Conduct](CODE_OF_CONDUCT.md) for this project is details how the community interacts in
an inclusive and respectful manner. Please keep it in mind as you engage here.
