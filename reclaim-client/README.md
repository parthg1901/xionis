# Neutron Client Contract

## Compiling contracts

In the root directory, populate your wasmkit.config.js.example:
```bash
const neutron_testnet_accounts = [
  {
    name: 'account_0',
    address: '', // your neutron address
    mnemonic: ''// your mnemonic key
  },
];
```

To compile your contracts: 
```bash
wasmkit compile
```

## Running script

```bash
wasmkit run scripts/verify.ts
```

