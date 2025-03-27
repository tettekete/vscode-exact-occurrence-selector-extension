
**Table of Contents**

- [Exact Occurrence Selector](#exact-occurrence-selector)
	- [Overview](#overview)
	- [Background](#background)
	- [About Automatic Word Boundary Detection](#about-automatic-word-boundary-detection)
- [Usage](#usage)
	- [Setting Shortcut Keys](#setting-shortcut-keys)
- [List of Commands](#list-of-commands)
	- [`ExactOccurrenceSelector: Add next occurrence`](#exactoccurrenceselector-add-next-occurrence)
	- [`ExactOccurrenceSelector: Add previous occurrence`](#exactoccurrenceselector-add-previous-occurrence)
	- [`ExactOccurrenceSelector: Select all occurrences`](#exactoccurrenceselector-select-all-occurrences)
	- [`ExactOccurrenceSelector: Change boundary handling config`](#exactoccurrenceselector-change-boundary-handling-config)
	- [`ExactOccurrenceSelector: Change case sensitivity config`](#exactoccurrenceselector-change-case-sensitivity-config)
- [List of Config Items](#list-of-config-items)
	- [Case Sensitive](#case-sensitive)
	- [Boundary Handling](#boundary-handling)
- [Bug Reports and Feature Requests](#bug-reports-and-feature-requests)


# Exact Occurrence Selector

## Overview

This extension provides functionality equivalent to the commands found in the VSCode Selection menu, while maintaining independent search options such as Case Sensitive:

- `Add Next Occurrence`
- `Add Previous Occurrence`
- `Select All Occurrences`

By default, it operates with Case Sensitivity and automatically determines word boundaries to select the next "Occurrence".


## Background

The standard VSCode commands `Add Next Occurrence`, `Add Previous Occurrence`, and `Select All Occurrences` use options from normal text search functionality.

For example, executing `Add Next Occurrence` selects the next "Occurrences" based on the `Case Sensitive` and `Match whole word` settings from the last text search. The search options needed for a previous text search may not match those needed for the next `Add Next Occurrence`, and these options cannot be changed during the execution of `Add Next Occurrence`. You must perform a text search again with the appropriate options set. What kind of punishment game is this, anyway?

Adding selections via `Add Next Occurrence` is often used for purposes like renaming variable or function names, where a strict match is usually required. For example, when you intend to rename a variable named `item`, it is rare that you would also want to change the part of the function name `processItems()` that includes `Item`.

**This extension was created to keep these settings independent of the normal text search options.**


## About Automatic Word Boundary Detection

This extension comes with automatic word boundary detection, which is set to "auto" by default.

Automatic word boundary detection considers a selected text string as an standalone word when it is surrounded by non-alphanumeric characters, except for `_` (underscore), which is treated as an alphanumeric character. Non-alphanumeric here includes line starts and ends as non-alphanumeric.

**Example: Case with automatic word boundary set**

```ts
const item = "MyItem";
const resultItem = pickFromItems([item]);
```

In this code, the first `item` is surrounded by non-alphanumeric characters, so it is treated as an standalone word. Selecting this `item` and using `ExactOccurrenceSelector: Select all occurrences` to change it to `name` would result in:

```ts
const name = "MyItem";
const resultItem = pickFromItems([name]);
```

**Example: Case without a word boundary**

If you select `Item` in `"MyItem"` and change it to `Name`, both `resultItem` and `pickFromItems` would be affected because `Item` is not a standalone word:

```ts
const name = "MyName";
const resultName = pickFromNames([name]);
```

If you dislike this behavior, please set the `Boundary Handling` config to `never`. It will ignore word boundary judgments.

Conversely, setting `Boundary Handling` to `always` will ensure that even parts like `Item` in `"MyItem"` are not affected during replacements, such as not affecting `resultItem` or `pickFromItems`.


# Usage

You can execute the following commands from the command palette:

- `ExactOccurrenceSelector: Add Next Occurrence`
- `ExactOccurrenceSelector: Add Previous Occurrence`
- `ExactOccurrenceSelector: Select All Occurrences`

If replacing the built-in VSCode `Add next occurrence`, you will need to change the shortcut key.


## Setting Shortcut Keys

To replace the standard VSCode `Add next occurrence` shortcut (Win: `ctrl` + `D` / mac: `cmd` + `D`), follow these steps:

1. Open "Preferences" > "Keyboard Shortcuts" (Win: `ctrl` + `k`, `ctrl` + `s` / mac: `cmd`+`k`, `cmd`+`s`)
2. Remove the existing setting:
   1. Enter `Add Selection To Next Find Match` or `editor.action.addSelectionToNextFindMatch` in the text input field and search for the existing setting.
   2. Open the context menu from the search result and select `Remove Keybinding` to delete it.
3. Set the shortcut for `ExactOccurrenceSelector: Add Next Occurrence`:
   1. Search for the command in the text input field and select it.
      - Enter `exact-occurrence-selector.addNextOccurrence` or `ExactOccurrenceSelector: Add next occurrence`.
   2. Double-click to set the key binding.
      - Enter Windows `ctrl` + `D` / macOS `cmd` + `D`.
   3. Optionally, select `Change When Expression` from the context menu and enter `editorFocus`.

If you do not want to change the default key binding, skip step 2 and set your preferred key binding in step 3.


# List of Commands

## `ExactOccurrenceSelector: Add next occurrence`

**Command ID**: `exact-occurrence-selector.addNextOccurrence`

Provides functionality equivalent to the standard VSCode `Selection` > `Add next occurrence`.


## `ExactOccurrenceSelector: Add previous occurrence`

**Command ID**: `exact-occurrence-selector.addPreviousOccurrence`

Provides functionality equivalent to the standard VSCode `Selection` > `Add previous occurrence`.


## `ExactOccurrenceSelector: Select all occurrences`

**Command ID**: `exact-occurrence-selector.selectAllOccurrences`

Provides functionality equivalent to the standard VSCode `Selection` > `Select all occurrences`.


## `ExactOccurrenceSelector: Change boundary handling config`

**Command ID**: `exact-occurrence-selector.changeBoundaryHandlingConfig`

A command to change the `Boundary Handling` config from the command palette. Quickly access and change the config by typing `exact` and `config` in the command palette.


## `ExactOccurrenceSelector: Change case sensitivity config`

**Command ID**: `exact-occurrence-selector.changeCaseSensitiveConfig`

A command to change the `Case Sensitive` config from the command palette. Quickly access and change the config by typing `exact` and `config` in the command palette.


# List of Config Items

## Case Sensitive

**Config ID**: `exactOccurrenceSelector.caseSensitive`

Controls whether to differentiate between uppercase and lowercase letters. The default setting is true, meaning it differentiates.


## Boundary Handling

**Config ID**: `exactOccurrenceSelector.boundaryHandling`

Settings related to how word boundaries are handled. The default is `auto`.

- `auto`: Treats the selected text as an standalone word if both ends are surrounded by non-alphanumeric characters, and searches for the next "Occurrence".
- `always`: Always treats the selected text as an standalone word, regardless of surrounding characters, and searches for the next "Occurrence".
- `never`: Ignores word boundaries.



# Bug Reports and Feature Requests

If you encounter any bugs or have any suggestions, please let us know by [submitting an issue on our GitHub page](https://github.com/tettekete/vscode-exact-occurrence-selector-extension/issues).

