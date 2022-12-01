# Advent of Code 2022
This repo holds my code solutions to the AoC challenges.

## Building

`npm run build`

## Directory Layout

```
├── data
│   └── <day>
│       ├── data.txt
│       └── test.txt
└── src
    └── <day>
        ├── index.ts
        └── <challenge-title>.ts
```

## Testing challenge solution

`node ./dist/<day> --test`
This executes the challenge with the `test.txt` data.

## Executing challenge with given data

`node ./dist/<day>`
This executes the challenge with the `data.txt` data.

## Executing challenge with additional log level

`node ./dist<day> --log-level debug`
