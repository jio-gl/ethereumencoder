# EVM Interfaces Supported in Ethereum Encoder

This document provides a comprehensive overview of the Ethereum Virtual Machine (EVM) interfaces supported in the Ethereum Encoder UI. These interfaces are pre-configured in the AbiEncoder.jsx component for easy encoding and decoding of contract interactions.

## Table of Contents
- [Token Standards](#token-standards)
- [Access Control](#access-control)
- [DeFi Protocols](#defi-protocols)
- [Oracle Services](#oracle-services)
- [NFT Standards](#nft-standards)
- [Governance](#governance)
- [Utility](#utility)

## Token Standards

### ERC20 - Token Standard
The ERC20 standard defines a common interface for fungible tokens on Ethereum.

**Key Functions:**
- `transfer(address to, uint256 amount)`: Transfers tokens to another address
- `approve(address spender, uint256 amount)`: Approves another address to spend tokens
- `transferFrom(address from, address to, uint256 amount)`: Transfers tokens on behalf of another address
- `balanceOf(address account)`: Returns the token balance of an account
- `allowance(address owner, address spender)`: Returns the amount of tokens approved for spending

**Use Cases:**
- Creating and managing fungible tokens
- Building token-based applications
- Implementing token economics

**References:**
- [EIP-20](https://eips.ethereum.org/EIPS/eip-20)
- [OpenZeppelin ERC20](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20)

### ERC721 - Non-Fungible Token
The ERC721 standard defines a common interface for non-fungible tokens (NFTs).

**Key Functions:**
- `transferFrom(address from, address to, uint256 tokenId)`: Transfers an NFT to another address
- `approve(address to, uint256 tokenId)`: Approves another address to transfer an NFT
- `setApprovalForAll(address operator, bool approved)`: Approves or disapproves an operator to manage all NFTs
- `ownerOf(uint256 tokenId)`: Returns the owner of an NFT
- `balanceOf(address owner)`: Returns the number of NFTs owned by an address

**Use Cases:**
- Creating unique digital assets
- Building NFT marketplaces
- Implementing digital collectibles

**References:**
- [EIP-721](https://eips.ethereum.org/EIPS/eip-721)
- [OpenZeppelin ERC721](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721)

### ERC1155 - Multi Token
The ERC1155 standard defines a common interface for multi-token contracts.

**Key Functions:**
- `safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)`: Transfers tokens to another address
- `balanceOf(address account, uint256 id)`: Returns the balance of a specific token
- `balanceOfBatch(address[] accounts, uint256[] ids)`: Returns the balances of multiple tokens for multiple accounts
- `setApprovalForAll(address operator, bool approved)`: Approves or disapproves an operator to manage all tokens

**Use Cases:**
- Creating multi-token contracts
- Building gaming assets
- Implementing tokenized items with different properties

**References:**
- [EIP-1155](https://eips.ethereum.org/EIPS/eip-1155)
- [OpenZeppelin ERC1155](https://docs.openzeppelin.com/contracts/4.x/api/token/erc1155)

### ERC777 - Advanced Token
An advanced token standard with hooks for token senders and receivers.

**Key Functions:**
- `send(address recipient, uint256 amount, bytes data)`: Sends tokens to a recipient with additional data

**Use Cases:**
- Creating tokens with advanced transfer mechanisms
- Implementing token hooks for custom behavior

**References:**
- [EIP-777](https://eips.ethereum.org/EIPS/eip-777)

## Access Control

### Ownable - Access Control
A simple access control mechanism that assigns an "owner" to a contract.

**Key Functions:**
- `owner()`: Returns the address of the current owner
- `transferOwnership(address newOwner)`: Transfers ownership to a new address
- `renounceOwnership()`: Renounces ownership of the contract

**Use Cases:**
- Implementing basic access control
- Managing contract upgrades
- Controlling administrative functions

**References:**
- [OpenZeppelin Ownable](https://docs.openzeppelin.com/contracts/4.x/api/access#Ownable)

### AccessControl - RBAC
A more flexible access control mechanism based on roles.

**Key Functions:**
- `hasRole(bytes32 role, address account)`: Checks if an account has a specific role
- `getRoleAdmin(bytes32 role)`: Returns the admin role for a specific role
- `grantRole(bytes32 role, address account)`: Grants a role to an account
- `revokeRole(bytes32 role, address account)`: Revokes a role from an account

**Use Cases:**
- Implementing role-based access control
- Managing complex permission systems
- Controlling access to different contract functions

**References:**
- [OpenZeppelin AccessControl](https://docs.openzeppelin.com/contracts/4.x/api/access#AccessControl)

### Pausable - Circuit Breaker
A mechanism to pause contract functionality in case of emergencies.

**Key Functions:**
- `pause()`: Pauses the contract
- `unpause()`: Unpauses the contract
- `paused()`: Checks if the contract is paused

**Use Cases:**
- Implementing emergency stops
- Adding circuit breakers to contracts
- Managing contract upgrades

**References:**
- [OpenZeppelin Pausable](https://docs.openzeppelin.com/contracts/4.x/api/security#Pausable)

## DeFi Protocols

### Uniswap V2 - Router
The Uniswap V2 Router interface for token swaps.

**Key Functions:**
- `swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)`: Swaps an exact amount of tokens for another token
- `swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)`: Swaps an exact amount of tokens for ETH
- `swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)`: Swaps an exact amount of ETH for tokens

**Use Cases:**
- Implementing token swaps
- Building DeFi applications
- Creating liquidity pools

**References:**
- [Uniswap V2 Documentation](https://docs.uniswap.org/contracts/v2/reference/smart-contracts/router-02)

### Uniswap V2 - Pair
The Uniswap V2 Pair interface for liquidity pools.

**Key Functions:**
- `token0()`: Returns the address of the first token in the pair
- `token1()`: Returns the address of the second token in the pair
- `getReserves()`: Returns the current reserves of both tokens
- `swap(uint256 amount0Out, uint256 amount1Out, address to, bytes data)`: Performs a swap within the pair

**Use Cases:**
- Interacting with liquidity pools
- Checking token reserves
- Performing swaps directly with pairs

**References:**
- [Uniswap V2 Documentation](https://docs.uniswap.org/contracts/v2/reference/smart-contracts/pair)

### Uniswap V3 - Router
The Uniswap V3 Router interface for advanced token swaps.

**Key Functions:**
- `exactInput(ExactInputParams params)`: Swaps an exact amount of input tokens for as many output tokens as possible
- `exactInputSingle(ExactInputSingleParams params)`: Swaps an exact amount of input tokens for as many output tokens as possible through a single pool

**Use Cases:**
- Implementing advanced token swaps
- Building DeFi applications with concentrated liquidity
- Creating more efficient trading strategies

**References:**
- [Uniswap V3 Documentation](https://docs.uniswap.org/contracts/v3/reference/core/SwapRouter)

### Sablier - Stream V2
The Sablier interface for token streaming.

**Key Functions:**
- `getStream(uint256 streamId)`: Returns information about a token stream
- `withdrawFromStream(uint256 streamId, uint256 amount)`: Withdraws tokens from a stream
- `cancelStream(uint256 streamId)`: Cancels a token stream

**Use Cases:**
- Implementing token vesting
- Creating subscription services
- Building payroll systems

**References:**
- [Sablier Documentation](https://docs.sablier.com/)

## Oracle Services

### Chainlink - Price Feed
The Chainlink Price Feed interface for accessing price data.

**Key Functions:**
- `latestRoundData()`: Returns the latest price data
- `getRoundData(uint80 _roundId)`: Returns price data for a specific round
- `decimals()`: Returns the number of decimals in the price feed
- `description()`: Returns a description of the price feed

**Use Cases:**
- Accessing real-world price data
- Building price-dependent applications
- Implementing price oracles

**References:**
- [Chainlink Price Feeds](https://docs.chain.link/data-feeds/price-feeds)

### Chainlink - VRF V2
The Chainlink VRF V2 interface for generating verifiable random numbers.

**Key Functions:**
- `requestRandomWords(uint32 numWords, uint64 subscriptionId, uint16 minimumRequestConfirmations, uint32 callbackGasLimit, bytes32 keyHash)`: Requests random words

**Use Cases:**
- Generating random numbers for games
- Implementing fair selection mechanisms
- Building lottery systems

**References:**
- [Chainlink VRF V2](https://docs.chain.link/vrf/v2/introduction)

### Chainlink - Automation
The Chainlink Automation interface for automated contract execution.

**Key Functions:**
- `checkUpkeep(bytes checkData)`: Checks if upkeep is needed
- `performUpkeep(bytes performData)`: Performs the upkeep

**Use Cases:**
- Automating contract maintenance
- Implementing time-based actions
- Building scheduled operations

**References:**
- [Chainlink Automation](https://docs.chain.link/chainlink-automation/introduction)

## NFT Standards

### ERC2981 - NFT Royalty
The ERC2981 standard for NFT royalties.

**Key Functions:**
- `royaltyInfo(uint256 tokenId)`: Returns royalty information for a token

**Use Cases:**
- Implementing NFT royalties
- Building NFT marketplaces with royalty support
- Creating creator-owned NFTs

**References:**
- [EIP-2981](https://eips.ethereum.org/EIPS/eip-2981)

### ERC4907 - Rental NFT
The ERC4907 standard for rentable NFTs.

**Key Functions:**
- `setUser(uint256 tokenId, address user, uint64 expires)`: Sets a user for a token with an expiration time

**Use Cases:**
- Implementing NFT rentals
- Building NFT lending platforms
- Creating time-limited access to NFTs

**References:**
- [EIP-4907](https://eips.ethereum.org/EIPS/eip-4907)

### ERC5192 - Soulbound NFT
The ERC5192 standard for non-transferable NFTs.

**Key Functions:**
- `locked(uint256 tokenId)`: Checks if a token is locked (non-transferable)

**Use Cases:**
- Implementing non-transferable NFTs
- Building identity systems
- Creating achievement tokens

**References:**
- [EIP-5192](https://eips.ethereum.org/EIPS/eip-5192)

## Governance

### OpenZeppelin - Governor
The OpenZeppelin Governor interface for on-chain governance.

**Key Functions:**
- `propose(address[] targets, uint256[] values, bytes[] calldatas, string description)`: Creates a new proposal
- `execute(uint256 proposalId)`: Executes a proposal
- `state(uint256 proposalId)`: Returns the current state of a proposal

**Use Cases:**
- Implementing DAO governance
- Building decentralized decision-making systems
- Creating upgrade mechanisms

**References:**
- [OpenZeppelin Governor](https://docs.openzeppelin.com/contracts/4.x/api/governance#Governor)

### OpenZeppelin - Votes
The OpenZeppelin Votes interface for token-weighted voting.

**Key Functions:**
- `getVotes(address account)`: Returns the current voting power of an account
- `getPastVotes(address account, uint256 timepoint)`: Returns the voting power of an account at a specific timepoint
- `delegate()`: Delegates voting power to another address

**Use Cases:**
- Implementing token-weighted voting
- Building governance systems
- Creating delegation mechanisms

**References:**
- [OpenZeppelin Votes](https://docs.openzeppelin.com/contracts/4.x/api/governance#Votes)

### TimelockController - Governance
The TimelockController interface for time-locked operations.

**Key Functions:**
- `schedule(bytes32 id, address target, uint256 value, bytes data, bytes32 predecessor, bytes32 salt, uint256 delay)`: Schedules an operation
- `execute(bytes32 id, address target, uint256 value, bytes data, bytes32 predecessor, bytes32 salt)`: Executes a scheduled operation

**Use Cases:**
- Implementing time-locked operations
- Building governance systems with delays
- Creating upgrade mechanisms with timelocks

**References:**
- [OpenZeppelin TimelockController](https://docs.openzeppelin.com/contracts/4.x/api/governance#TimelockController)

## Utility

### ERC165 - Interface Detection
The ERC165 standard for interface detection.

**Key Functions:**
- `supportsInterface(bytes4 interfaceId)`: Checks if a contract implements a specific interface

**Use Cases:**
- Detecting contract capabilities
- Building interoperable contracts
- Implementing interface checks

**References:**
- [EIP-165](https://eips.ethereum.org/EIPS/eip-165)

### ERC677 - TransferAndCall Token
The ERC677 standard for tokens with callbacks.

**Key Functions:**
- `transferAndCall(address to, uint256 value, bytes data)`: Transfers tokens and calls a function on the recipient

**Use Cases:**
- Implementing token callbacks
- Building interoperable tokens
- Creating tokens with additional functionality

**References:**
- [EIP-677](https://github.com/ethereum/EIPs/issues/677)

### ERC2612 - Permit
The ERC2612 standard for gasless approvals.

**Key Functions:**
- `permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)`: Approves spending without requiring a transaction from the owner
- `nonces(address owner)`: Returns the current nonce for an owner
- `DOMAIN_SEPARATOR()`: Returns the domain separator for the contract

**Use Cases:**
- Implementing gasless approvals
- Building better UX for token approvals
- Creating more efficient token interactions

**References:**
- [EIP-2612](https://eips.ethereum.org/EIPS/eip-2612)

### ERC4626 - Tokenized Vault
The ERC4626 standard for tokenized vaults.

**Key Functions:**
- `deposit(uint256 assets, address receiver)`: Deposits assets into the vault
- `withdraw(uint256 assets, address receiver, address owner)`: Withdraws assets from the vault
- `convertToAssets(uint256 shares)`: Converts shares to assets
- `convertToShares(uint256 assets)`: Converts assets to shares
- `totalAssets()`: Returns the total amount of assets in the vault

**Use Cases:**
- Implementing yield-generating vaults
- Building tokenized strategies
- Creating composable DeFi products

**References:**
- [EIP-4626](https://eips.ethereum.org/EIPS/eip-4626)

### ERC3156 - Flash Loans
The ERC3156 standard for flash loans.

**Key Functions:**
- `flashLoan(address token, uint256 amount)`: Borrows tokens for a single transaction

**Use Cases:**
- Implementing flash loans
- Building arbitrage systems
- Creating complex DeFi strategies

**References:**
- [EIP-3156](https://eips.ethereum.org/EIPS/eip-3156)

## How to Use These Interfaces

The Ethereum Encoder UI provides a user-friendly way to interact with these interfaces:

1. Select the interface from the dropdown menu
2. Choose the function you want to encode
3. Fill in the required parameters
4. Click "Encode" to generate the encoded data
5. Optionally, enter a target address and click "Send Transaction" to execute the function

For read-only functions, the UI will automatically call the function and display the result.

## References

- [Ethereum Improvement Proposals (EIPs)](https://eips.ethereum.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/4.x/)
- [Uniswap Documentation](https://docs.uniswap.org/)
- [Chainlink Documentation](https://docs.chain.link/)
- [Sablier Documentation](https://docs.sablier.com/) 