# RPS Game

## Table of Contents
- [Introduction](#introduction)
- [Repository Structure](#Repository)
- [How to Run](#how-to-run)
- [Demo](#demo)
- [Challenges and Their Solutions](#challenges-and-their-solutions)

## Introduction
This project is an RPSSL game build upon blockchain, the game is a spin on classic Rock Paper scissors with two more available options, Lizard and Spock. T
It has been built using Next.js frontend and using wagmi(viem) library to intract with the block chain, The project also uses Web3Modal to semlessly switch between various chain and wallets for this demo we will be using metamask and sepoila chain.

##  Repository Structure()

```sh
└── rps-game/
    ├── README.md
    ├── netlify.toml
    ├── next.config.mjs
    ├── package-lock.json
    ├── package.json
    ├── public
    │   ├── next.svg
    │   └── vercel.svg
    ├── src
    │   ├── app
    │   ├── blockchain
    │   ├── components
    │   ├── constants
    │   ├── contexts
    │   ├── hooks
    │   └── utils
    └── tsconfig.json
```

###  Installation

<h4>From <code>source</code></h4>

> 1. Clone the rps-game repository:
>
> ```console
> $ git clone https://github.com/madhurMongia/rps-game
> ```
>
> 2. Change to the project directory:
> ```console
> $ cd rps-game
> ```
>
> 3. Install the dependencies:
> ```console
> $ npm install
> ```
> 4. start the next.js server:
> ```console
> $ npm run dev
> ```
> 4.navigate to :
> ```console
> $ http://localhost:3000/ 
> ```

##How to Play
[![Watch the video]](https://screenrec.com/share/cpBQFDo5Yd)

## Challenges and Their Solutions
1. # Securing the Salt: Ensuring Move Privacy and Preventing XSS Vulnerabilities

**Problem**: Implementing a secure salting mechanism for hashing player moves presents a challenge. Hashing the player's move on the blockchain would reveal the move to block explorers, compromising the game's integrity. Hashing the move on the frontend and storing the salt in the browser's storage is also vulnerable to Cross-Site Scripting (XSS) attacks.

**Solution**: To address these concerns, we can leverage Next.js Server Actions to hash the player's move on the server-side. This approach ensures that the move remains private and is not exposed to the blockchain or potential XSS vulnerabilities. Additionally, we can enhance security by hashing the salt using a private key stored securely on the server. The hashed salt can then be returned to the frontend and stored in the browser's localStorage, mitigating the risk of XSS attacks while maintaining the integrity of the salting mechanism.

2. # Determining Game State and Winner for Player 2: Leveraging Transaction Monitoring

**Problem**: The provided smart contract does not emit events, making it challenging to listen for events and determine the current state of the game. Without events, it becomes difficult to know whether the game has been resolved, if a player has timed out, or who the winner is by solely relying on available contract variables.

**Solution**: To overcome this limitation, the solution involves monitoring transactions instead of listening for events. While transactions are not indexed, we can leverage block explorers or listen for new blocks being mined and filter the transactions for specific methods, such as solve, j1Timeout, and j2Timeout.
By listening for the solve transaction on the blockchain, Player 2 can calculate the winner based on the provided move hashes and the revealed salts. Additionally, by monitoring the j1Timeout and j2Timeout transactions, we can determine if either player has timed out during the game.
