
<p align="center"><a href="https://tettekete.github.io/vscode-exact-occurrence-selector-extension/">English</a> / 日本語</p>

**目次**

- [Exact Occurrence Selector](#exact-occurrence-selector)
	- [概要](#概要)
	- [背景](#背景)
	- [ワード境界の自動判定について](#ワード境界の自動判定について)
- [使い方](#使い方)
	- [ショートカットキーの設定](#ショートカットキーの設定)
- [コマンド一覧](#コマンド一覧)
	- [`ExactOccurrenceSelector: Add next occurrence`](#exactoccurrenceselector-add-next-occurrence)
	- [`ExactOccurrenceSelector: Add previous occurrence`](#exactoccurrenceselector-add-previous-occurrence)
	- [`ExactOccurrenceSelector: Select all occurrences`](#exactoccurrenceselector-select-all-occurrences)
	- [`ExactOccurrenceSelector: Change boundary handling config`](#exactoccurrenceselector-change-boundary-handling-config)
	- [`ExactOccurrenceSelector: Change case sensitivity config`](#exactoccurrenceselector-change-case-sensitivity-config)
- [コンフィグ項目一覧](#コンフィグ項目一覧)
	- [Case Sensitive](#case-sensitive)
	- [Boundary Handling](#boundary-handling)
- [バグ報告と要望について](#バグ報告と要望について)


# Exact Occurrence Selector

## 概要

本機能拡張は VSCode の `Selection`（選択）メニューにある以下のコマンドと同等の機能を提供します。そして、`Case Sensitive`（大文字と小文字を区別する）などの検索オプションを独立して保持します。

- `Add Next Occurrence` /「次の出現箇所を追加」
- `Add Previous Occurrence` /「前の出現箇所を追加」
- `Select All Occurrences` /「すべての出現箇所を選択」

デフォルトの設定では大文字と小文字を区別し、ワード境界を自動判定して次の "Occurrence（出現箇所）" を選択します。


## 背景

VSCode 標準の `Add Next Occurrence` , `Add Previous Occurrence` , `Select All Occurrences` は通常のテキスト検索機能のオプションを参照して検索を行います。

例えば `Add Next Occurrence` を実行すると、前回テキスト検索を行った時の `Case Sensitive`（大文字と小文字を区別する）設定や `March whole word`（単語単位で検索する）設定に基づいて次の "Occurrences（出現箇所）" が選択されます。

前回のテキスト検索に必要だった検索オプションが次の `Add Next Occurrence` の時に必要なオプションと一致するとは限りません。しかも `Add Next Occurrence` を実行するときはそのオプションを変更出来ません。一度テキスト検索を行い適切なオプションに設定し直す必要があります。

`Add Next Occurrence` による選択範囲の追加は、変数名や関数名の書き換えを行う目的で使うことが多いため、ほとんどのケースで厳密なマッチを必要とするでしょう（`item` と言う変数名を変更するとき `processItems()` の `Item` まで書き換えたいケースは希でしょう）。

つまり、**この機能拡張はそれらの設定を通常のテキスト検索の検索オプションと独立させるために作られた機能拡張です。**


## ワード境界の自動判定について

本機能拡張はワード境界の自動判定機能が備わっており、デフォルトで「自動判定する」設定になっています。

ワード境界の自動判定とは、選択した文字列が非英数字[^1]に囲われているとき、自動的にそのテキストを独立したワードと見做し、同様に非英数字に囲われたワードを次の "Occurrence（出現箇所）" 対象として選択する機能です。

**例: ワード境界が自動的に設定されるケース**

```ts
const item = "MyItem";
const resultItem = pickFromItems( [item] );
```

このコードで最初に登場する `item` は非英数字に囲まれているため独立したワードとして扱われます。この `item` を選択して `ExactOccurrenceSelector: Select all occurrences` し `name` に書き換えると以下の様になります。


```ts
const name = "MyItem";
const resultItem = pickFromItems( [name] );
```

**例: ワード境界無しと判定されるケース**

次に `"MyItem"` の `Item` を選択して `Name` に書き換えた場合、`Item` は独立したワードではないので、以下の様に `resultItem` も `pickFromItems` も書き換え対象になります。

```ts
const name = "MyName";
const resultName = pickFromNames( [name] );
```


これらの挙動が気に入らない場合はコンフィグの `Boundary Handling` を `never` に設定してください。ワード境界に関する判定を無視する様になります。

逆に `Boundary Handling` コンフィグに `always` を指定すると、例えば先ほどの `"MyItem"` の `Item` も独立したワードと見做され `resultItem` も `pickFromItems` も書き換え対象とならなくなります。


[^1]: ここで言う英数字には `_` を含みます。また行頭行末も非英数字扱いとなります。


# 使い方

コマンドパレットから以下のコマンドで実行する事ができます。

- `ExactOccurrenceSelector: Add Next Occurrence`
- `ExactOccurrenceSelector: Add Previous Occurrence`
- `ExactOccurrenceSelector: Select All Occurrences`

VSCode 組み込みの `Add next occurrence` の代わりに使用するのであればショートカットキーの差し替えを行って下さい。


## ショートカットキーの設定

VSCode 標準の `Add next occurrence` のショートカット(Win: `ctrl` + `D` / mac: `cmd` + `D`)を置き換える場合、以下の手順で置き換えられます。

1. 「Preferences」>「Keyboard Shortcuts」( Win:`ctrl` + `k`,`ctrl` + `s` / mac:`cmd`+`k`,`cmd`+`s`)を開く
2. 既存の設定を削除する
   1. テキスト入力フィールドに `Add Selection To Next Find Match` または `editor.action.addSelectionToNextFindMatch` と入力し、既存の設定を検索する
   2. 検索結果からコンテキストメニューを開き `Remove Keybinding` で削除する
3. `ExactOccurrenceSelector: Add Next Occurrence` のショートカットを設定する
   1. テキスト入力フィールドからコマンドを検索して選択する
      - `exact-occurrence-selector.addNextOccurrence` または `ExactOccurrenceSelector: Add next occurrence` を入力する
   2. ダブルクリックしてキーバインドを設定する
      - Windows `ctrl` + `D` / macOS `cmd` + `D` を入力する
   3. コンテキストメニューから `Change When Expression` を選び `editorFocus` と入力する（オプション）


デフォルトのキーバインドを変更しない場合、 2 番をスキップし、3 番の工程で好きなキーバインドを設定してください。


# コマンド一覧

## `ExactOccurrenceSelector: Add next occurrence`

**コマンドID**: `exact-occurrence-selector.addNextOccurrence`

VSCode 標準の `Add next occurrence` に相当する機能を提供します。


## `ExactOccurrenceSelector: Add previous occurrence`

**コマンドID**: `exact-occurrence-selector.addPreviousOccurrence`

VSCode 標準の `Add previous occurrence` に相当する機能を提供します。


## `ExactOccurrenceSelector: Select all occurrences`

**コマンドID**: `exact-occurrence-selector.selectAllOccurrences`

VSCode 標準の `Select all occurrences` に相当する機能を提供します。


## `ExactOccurrenceSelector: Change boundary handling config`

**コマンドID**: `exact-occurrence-selector.changeBoundaryHandlingConfig`

コマンドパレットから `Boundary Handling` コンフィグを変更する為のコマンドです。

コマンドパレットで `exact` `config` などと入力すれば素早くアクセスしてコンフィグを変更する事ができます。


## `ExactOccurrenceSelector: Change case sensitivity config`

**コマンドID**: `exact-occurrence-selector.changeCaseSensitiveConfig`

コマンドパレットから `Case Sensitive` コンフィグを変更する為のコマンドです。

コマンドパレットで `exact` `config` などと入力すれば素早くアクセスしてコンフィグを変更する事ができます。


# コンフィグ項目一覧

## Case Sensitive

**コンフィグID**: `exactOccurrenceSelector.caseSensitive`

大文字小文字の区別を行うかどうかの設定です。デフォルトは true で区別します。

## Boundary Handling

**コンフィグID**: `exactOccurrenceSelector.boundaryHandling`

ワード境界の扱い方に関する設定です。デフォルトは `auto` です。

- `auto`: 選択テキストの両端が非英数字である時、独立したワードと見做して次の「出現箇所」を探します。
- `always`: 選択テキストを必ず独立したワードと見做して次の「出現箇所」を探します。
- `never`: ワード境界を無視します。


# バグ報告と要望について

この拡張機能に関するバグの報告や要望がある場合は、GitHub の [Issue ページ](https://github.com/tettekete/vscode-exact-occurrence-selector-extension/issues)を通じてご連絡ください。