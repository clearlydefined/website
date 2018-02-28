# ClearlyDefined Web App

This project implements the website for [ClearlyDefined](https://clearlydefined.io). It's a relatively straightforward React app that serves mainly as a portal to discover and curate project data.

# Using the site

## Browsing
ClearlyDefined is all about making project data easily discoverable and available to people. On the **Browse** tab you will see a search box. Click in there and start typing the name of a project. This will auto-suggest definitions that exist in ClearlyDefined. Pick one of the presented options and the related definition is added to the **Definitions** list. Note that if you are after a definition for a component not shown in the list, ClearlyDefined does not know about it yet.

In the **Definition** list you see a high level summary of the related component -- its license, possible relationship to source in GitHub, a ClearlyDefined score, and more. If you click on an entry in the list, the entry expands to show more detail. The exact content here will change over time as the community learns more about what's most relevant. Typically this additional detail includes release date of the selected revision, details of licenses discovered in the files of the component, as well as a list of attribution parties, and more. Check out the [ClearlyDefined Glossary]() for more info on the various terms you see in the panel.

On the right side of any definition entry (expanded or collapsed) you will see a set of buttons that modify the list itself (adding related definitions or removing the current definition) or take you to alternative views of a definition. Typically hovering over a button will give you an idea of what it does. Go ahead and click around. You won't break anything. 

## Curation
Curation is the act of human vetting, updating and/or supplying of information. In ClearlyDefined that means people filling in gaps where projects were missing data or tools could not find the desired data. Anyone can contribute a curation -- it's just like contributing a bug fix or feature to any other open source project. In fact, it really is just a pull request on the [curation repo](https://github.com/clearlydefined/curated-data).

Key to understanding a definition is understanding how it was put together. That's what's happening on the **Curation** tab. Like the **Browse** tab, there is a definition search box. Just type part of a component name and the system will suggest a related definition. Note that if you get here by clicking the **Curate this entry** button on the **Browse** tab, the appropriate definition will already be selected.

Having selected a definition details about where the defintion's content came from is shown. The top most pane on the tab shows the raw YAML form of the definition. This is the same information shown on the **Browse** tab. There might be a bit more detail but it's basically the same thing. The **Curation** pane shows you the text of any human additions or modifications that went into the final form of the definition. The **Harvested** pane shows the raw text dump of all tool output related to the definition. 

This is pretty overwhelming with lots and lots of detail. Over time, and with your help, we will discover effective ways to ensure that you have enough of the right information at your finger tips to understand the definitions and be confident in their content.

## A note on definition coordinates
As you will have noticed, the same component name (e.g, jquery) shows up multiple times in the suggestion lists. Sometimes in entries that look like GitHub things, sometimes Maven or NPM or ... This in fact reflects reality -- the same project is often packaged or made available in multiple forms. Given the differences between these packaging forms names and even versioning often do not align. For example, the thing you know and commonly refer to as `jquery` is actually called `jquery` on NPM but `jquery/jquery` on GitHub. The version you know as `3.3.1` on NPM is `32b00373b3f42e5cdcb709df53f3b08b7184a944` on GitHub. It's even worse in that various package types can come from different providers. For example, you can install NPMs from GitHub!

This is what we call, _the identity problem_. ClearlyDefined is NOT attempting to solve the identity problem. Instead, we give each unique thing (i.e., component) unique coordinates and then allow for the creation for _links_ between coordinates.

Typical coordinates that you will encounter are a five part path-like structure as follows:

```
npm/npmjs/-/jquery/3.3.1
'''

Or, more generally:

```
type/provider/namespace/name/revision
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



# Getting started in the code
If you are interested in working on the code for the website, follow the steps below. If you want to get the whole ClearlyDefined infrastructure running on you machine, check out the [system quick start guide](https://github.com/clearlydefined/service/readme.md).

1. The site is based on [React]() so you need to [install NPM](). 
1. Clone [this repo](https://github.com/clearlydefined/website.git) using `git clone https://github.com/clearlydefined/website.git` or equivalent.
1. In a command shell, set the following environment variable (the syntax will depend on your choice of shell):
   * `REACT_APP_SERVER=https://dev-api.clearlydefined.io`
1. Change to the website repo directory (e.g., `cd <dir where you cloned website>`)
1. Run `npm install`
1. Run `npm start`

This sequence will get the code for site, fetch all the prerequisites, build the site, start it running and open a browser on http://localhost:3000. In the end you should see the ClearlyDefined homepage in your browser.

# ClearlyDefined, defined.

## Mission
Help FOSS projects be more successful through clearly defined project data.

For more details on the project, check out the [wiki](../../../clearlydefined/wiki).

# Contributing

This project welcomes contributions and suggestions, and we've documented the details of contribution policy [here](CONTRIBUTING.md).

The [Code of Conduct](CODE_OF_CONDUCT.md) for this project is details how the community interacts in
an inclusive and respectful manner. Please keep it in mind as you engage here.
