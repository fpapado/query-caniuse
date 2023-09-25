# query-browserslist

A little CLI to query browserslist data, and output it on the terminal.
Useful if you want to quickly copy-paste these values, e.g. in a spreadsheet or a chat.

Usage:

```shell
pnpm install

# tsv by default
node query.mjs query https://caniuse.com/css-focus-visible

# table option
node query.mjs query https://caniuse.com/css-focus-visible --format table
```
