// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
// Default settings; the options page overrides them.
const TF_DEFAULTS = {
  keywords: [
    "asmongold",
    "asmon",
    "zackrawrr",
    "olympus guild",
    "olympus gilde",
    "gilde olympus",
    "guild olympus",
    "guilde olympus",
    "gremio olympus",
    "<olympus>",
    "#olympus",
    "otk olympus"
  ],
  wholeWord: true,        // "asmon" does not match "asmonaut"
  mode: "placeholder",    // "placeholder" = collapse with notice, "hide" = remove completely
  blockProfiles: true     // cover profile pages whose handle matches a keyword
};
