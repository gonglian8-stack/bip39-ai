"""Generate cross-check fixtures with the independent Python reference
implementation (trezor/python-mnemonic). Output is committed and compared by
tests/crosscheck.test.ts, so the site's TypeScript stack is checked against a
second implementation, not only against itself.

Usage: python scripts/crosscheck.py > tests/fixtures/crosscheck.json
"""
import hashlib
import json
import random
import importlib.metadata

from mnemonic import Mnemonic

rng = random.Random(39)  # deterministic, fixtures are test data only
m = Mnemonic("english")
passphrases = ["", "TREZOR", "trezor", "correct horse", "pässwörd", "パスワード"]
cases = []
for i in range(120):
    ent_bytes = [16, 20, 24, 28, 32][i % 5]
    entropy = bytes(rng.getrandbits(8) for _ in range(ent_bytes))
    words = m.to_mnemonic(entropy)
    passphrase = passphrases[i % len(passphrases)]
    seed = Mnemonic.to_seed(words, passphrase)
    cases.append({
        "entropy": entropy.hex(),
        "mnemonic": words,
        "passphrase": passphrase,
        "seed": seed.hex(),
        "checksum_hash": hashlib.sha256(entropy).hexdigest(),
    })

# Invalid checksums: swap the last word for another word until the checksum fails.
invalid = []
for c in cases[:40]:
    ws = c["mnemonic"].split()
    for cand in m.wordlist:
        trial = " ".join(ws[:-1] + [cand])
        if not m.check(trial):
            invalid.append(trial)
            break

print(json.dumps({
    "generator": f"python-mnemonic {importlib.metadata.version('mnemonic')}",
    "valid": cases,
    "invalid": invalid,
}, ensure_ascii=False, indent=1))
