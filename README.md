# data-sources-airtable

Polls our data source tracking Airtable and automatically creates issues for newly approved sources.

**Required env variables:**
```
AIRTABLE_KEY=[airtable api key]
AIRTABLE_BASE=[airtable base id]
GH_KEY=[github personal token]
GH_USER=[name of the user who owns the repo where issues should be created]
REPO=[name of github repo to create issues]
```

Templates are available to be modified in `templates/`