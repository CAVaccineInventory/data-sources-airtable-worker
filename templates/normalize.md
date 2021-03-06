[![learn our pipeline: normalize](https://img.shields.io/static/v1?label=learn%20our%20pipeline&message=normalize&style=social)](https://github.com/CAVaccineInventory/vaccine-feed-ingest/wiki/Runner-pipeline-stages#normalize)

Blocked by #[issueNumber]

Normalize existing [`.ndjson`](http://ndjson.org/) records into [the Vaccinate The States data schema](https://github.com/CAVaccineInventory/vaccine-feed-ingest/wiki/Normalized-Location-Schema).

Read all files in the directory passed as the second argument (`sys.argv[2]`), transform each record into the normalized schema (filling in as much detail as possible), then output them to new files in the directory passed as the first argument (`sys.argv[1]`).

Check the wiki to learn more about the purpose of the normalize stage and how to get set up for development!

### Tips

1. Fetch and parse data for this site before you start developing:
    ```sh
    poetry run vaccine-feed-ingest fetch [runnerPath]
    poetry run vaccine-feed-ingest parse [runnerPath]
    ```

1. While working on your code, run it at any point:
    ```sh
    poetry run vaccine-feed-ingest normalize [runnerPath]
    ```

### Example
[Parsed files for `ak/arcgis`](https://github.com/CAVaccineInventory/vaccine-feed-ingest-results/tree/main/ak/arcgis/parsed) are converted to [normalized files](https://github.com/CAVaccineInventory/vaccine-feed-ingest-results/tree/main/ak/arcgis/normalized)
