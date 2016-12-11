# Hacker News Who is Hiring Search

> Search hiring threads posted by [whoishiring](https://news.ycombinator.com/user?id=whoishiring) with a regular expression.


## Table of Contents

1. [Usage](#usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)

## Usage

1. Clone this repository
1. Install dependencies and ensure postgresql is running
1. `npm run populateDb`
1. Customize the query in `config.js`
1. `npm run query`

## Requirements

- Node 6.9.1
- PostgreSQL 9.6.1

## Development

### Installing Dependencies

```sh
# From within the project directory
npm install
```
