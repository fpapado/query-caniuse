# query-browserslist

A little CLI to query browserslist data, and output it on the terminal.
Useful if you want to quickly copy-paste these values, e.g. in a spreadsheet or a chat.
Data is queried locally, via [caniuse-db](npm.im/caniuse-db).

NOTE: Some data might be missing, for example data coming from MDN (usually prefixed `mdn-api` on caniuse, such as https://caniuse.com/mdn-api_url_canparse_static)

Usage (you will need node an pnpm):

```shell
pnpm install

# You can use either a caniuse URL or the feature name
# Output is tsv by default, which you can copy into a spreadsheet
node query.mjs query css-focus-visible
node query.mjs query https://caniuse.com/css-focus-visible

# table output option
node query.mjs query https://caniuse.com/css-focus-visible --format table
```
