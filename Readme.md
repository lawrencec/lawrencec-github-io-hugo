# Nodetraveller.com blog (Hugo style) ![.github/workflows/gh-pages.yml](https://github.com/lawrencec/lawrencec.github.com-hugo/workflows/.github/workflows/gh-pages.yml/badge.svg)

This blog uses Hugo and Github actions for deployment.

## Local use

The following serves a local build and exposes the blog at `http://localhost:1313`.

```shell script
docker-compose up
```

## Workflows

### Github

The [.github/workflows/gh-pages.yml](.github/workflows/gh-pages.yml) defines the push to github pages workflow. 
After successful completion, a hugo build (public folder) will be pushed to the [gh-pages](https://github.com/lawrencec/lawrencec.github.com-hugo/tree/gh-pages) branch.

