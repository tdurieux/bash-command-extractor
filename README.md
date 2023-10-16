# Bash Command Extractor

## Usage
```
npm i -g @tdurieux/bash-command-extractor
bash-command-extractor <bash_code>
```

## Example

`./bash-command-extractor "sudo apt install git"`

```json
[
  {
    "annotations": [
      "SC-SUDO"
    ],
    "command": "sudo",
    "args": []
  },
  {
    "annotations": [
      "SC-APT-INSTALL"
    ],
    "command": "apt",
    "args": [
      {
        "annotations": [],
        "content": "install"
      },
      {
        "annotations": [
          "SC-APT-PACKAGE"
        ],
        "content": "git"
      }
    ]
  }
]
```