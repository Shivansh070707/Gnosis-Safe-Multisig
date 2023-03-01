# Gnosis-safe multisig Project

## Project Description

- This is a simple example of implementation for the Gnosis-Safe multi-sig wallet.

---

## Technologies used

- solidity compiler version: `0.8.19`
- [Hardhat](https://hardhat.org/) smart contracts architecture
- [OpenZeppelin contracts](https://openzeppelin.com/)
- [chai](https://www.chaijs.com/) for testing
- [solidity-coverage](https://github.com/sc-forks/solidity-coverage) for generating code coverage
- [truffle [dashboard](https://trufflesuite.com/docs/truffle/how-to/use-the-truffle-dashboard/) for the deployment of the smart contracts

---

## A typical top-level directory layout

```shell
.
├── build                 # deployed addresses and the ABI of the smart contract (scripts/deploy.ts)
├── contracts            # smart contracts solidity files
├── scripts               # deployment scripts (deploy.ts) and other tasks
├── test                  # test scripts
├── .env.example          # environment variables template
├── .gitignore
├── hardhat-config.ts     # hardhat configuration
├── package.json          # project details and dependencies
├── README.md

```

---

## Instructions and hardhat commands

### Installation

1- Clone this repo:

```shell
git clone https://github.com/Shivansh070707/Gnosis-Safe-Multisig
```

2- Install the project dependencies.

This will install the packages mentioned inside the `package.json` file.:

```shell
cd Gnosis-Safe-Multisig
npm install or yarn install
```

### Deployment

- Create the `.env` file following the `.env.example` file and fill in the contents. The values for the `INFURA_API_KEY` can be obtained from the [Infura](https://app.infura.io/) website. If you don't have an account, you can create one for free.

  ```shell
  cp .env.example .env
  ```

  Else, you can comment out the places in the `hardhat.config.ts` file where the `INFURA_API_KEY` is used, to be able to compile the smart contracts.

- Compile the smart contracts. \
  This will compile the smart contract files using the specified solidity compiler in `hardhat.config.ts`.

  ```shell
  npm run compile
  ```

- Instantiate the hardhat local node.

  ```shell
  npx hardhat node
  ```

- Run the project tests using the local node.

  ```shell
  npm run test
  ```

- Deployment of the smart contracts.

  There are two ways of deploying smart contracts:

  - Using private keys:

    The private key needs to be pasted in the .env file and the `accounts` property in the `networks` properties in the `hardhat.config.ts` file needs to be uncommented for the network on which the smart contracts need to deploy, as follows.

    ```shell
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 5,
    },
    ```

  - Without using private keys:

    This lets you deploy the contracts without the need of pasting the private key anywhere in the project and is the preferred way of deployment.

    - Install truffle globally

      ```shell
      npm install -g truffle
      ```

    - Run the truffle dashboard

      ```shell
      truffle dashboard
      ```

    - The browser will open up and then you have to connect with the MetaMask extension. Select the preferred network and the account to deploy the smart contract.

#### Deploy Gnosis-safe

- Before deployment , you need to change the `ENV` variable in `.env` file with the network you want to deploy.example ENV=goerli

  ```shell
  npm run deploy:localhost
  ```

  ```shell
  npm run deploy:goerli
  ```

  ```shell
  npm run deploy:mainnet
  ```

  ```shell
  npm run deploy:truffle
  ```

- `<NETWORK>` can be `localhost`, `goerli`, `mainnet` or any other network that is supported and defined in the `hardhat.config.ts`.

- If the deployment uses the truffle dashboard method, then, switch to the browser and sign the deployment transactions from the MetaMask extension. For the deployment of the `deploy.ts`, there will be **multiple transactions** that need to be signed via Metamask.

- Otherwise, if the deployment uses the private key, the transactions will be signed automatically and will be shown in the terminal.

- After the successful deployment of the smart contracts, a `build` folder comprising the addresses and the ABIs of the deployed smart contracts will be generated.

---

## Author

Shivansh Shrivastava
