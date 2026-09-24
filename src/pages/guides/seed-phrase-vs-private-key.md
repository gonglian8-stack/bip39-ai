---
layout: ../../layouts/Guide.astro
title: "Seed Phrase vs Private Key: What's the Difference?"
description: "A seed phrase backs up every key in a wallet; a private key controls one address. How they relate, why you can't go backwards, and which to back up."
h1: "Seed Phrase vs Private Key"
summary: "A seed phrase is a backup of the whole wallet: every private key is derived from it. A private key controls a single address. You can get keys from a phrase, but never the phrase from a key."
published: "2026-09-24"
related: ["what", "converter", "passphrase"]
---

## Short answer

| | Seed phrase (BIP39 mnemonic) | Private key |
|---|---|---|
| What it is | 12–24 words encoding random entropy | A 256-bit number |
| Controls | Every account and address in the wallet | One address (one key pair) |
| Typical format | Words from a [2048-word list](/bip39-word-list/) | Hex, or WIF (starts with `5`, `K` or `L` for Bitcoin) |
| Standard | BIP39 | Depends on the chain (e.g. secp256k1) |
| Can recreate the other? | Yes → derives all private keys | No → cannot recover the phrase |

## How one becomes the other

A modern wallet builds keys in layers:

1. **Entropy** — 128–256 random bits.
2. **Mnemonic** — the entropy plus a checksum, written as words ([BIP39](/what-is-bip39/)).
3. **Seed** — 512 bits from PBKDF2-HMAC-SHA512 over the words and an optional [passphrase](/bip39-passphrase/).
4. **Master key** — derived from the seed ([BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)).
5. **Private keys** — a tree of keys derived from the master key along *derivation paths* such as `m/84'/0'/0'/0/0` (BIP44/49/84/86).
6. **Addresses** — computed from each private key's public key.

Every arrow goes one way. Hash functions and key derivation cannot be reversed, so a private key reveals nothing about the phrase it came from.

You can watch steps 1–3 with official test vectors in the [converter](/bip39-converter/). This site deliberately stops at the seed and never displays private keys.

## Why the seed phrase matters more

- **One backup covers everything.** A single phrase recreates every account on every supported chain, including addresses you haven't used yet.
- **Leaking it leaks everything.** Anyone with the phrase (and passphrase, if you set one) controls all the funds.
- **Leaking one private key** exposes only the funds at that address. Other addresses in the wallet remain safe unless the attacker also has the extended public key (xpub) for that branch, in which case related keys can be computed.

## "I have 12 words but my wallet shows different addresses"

The same phrase can produce different addresses when:

- a different **passphrase** is used (every passphrase produces a separate wallet);
- the wallet uses a different **derivation path** or address type;
- the words are from a **non-BIP39 scheme** (for example Electrum seeds), which look similar but derive keys differently.

## What to back up

- **Back up the seed phrase**, and the passphrase separately if you use one. Write it down offline; don't photograph it or store it in the cloud.
- **Don't back up individual private keys** from an HD wallet — the phrase already covers them.
- **Never type either into a website**, chat or support form. Legitimate wallets and support staff never ask for them.

> Experimenting? Use the official test vectors on this site, or the [offline tool](/bip39-offline/) with networking turned off.
