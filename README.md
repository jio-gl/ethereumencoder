# Ethereum Encoder

A web application for encoding Ethereum contract interactions. This tool helps developers and users interact with smart contracts by providing a user-friendly interface for encoding function calls according to the Ethereum ABI specification.

## Features

- Encode function calls for popular Ethereum standards and protocols
- Support for multiple token standards (ERC20, ERC721, ERC1155)
- Integration with popular DeFi protocols (Uniswap V2/V3)
- Oracle services integration (Chainlink)
- NFT standards support
- Governance and access control interfaces
- Utility functions for common operations

## Supported EVM Interfaces

The application supports a wide range of Ethereum Virtual Machine (EVM) interfaces, including:

- **Token Standards**: ERC20, ERC721, ERC1155, ERC777
- **Access Control**: Ownable, AccessControl, Pausable
- **DeFi Protocols**: Uniswap V2/V3, Sablier
- **Oracle Services**: Chainlink Price Feed, VRF, Automation
- **NFT Standards**: ERC2981, ERC4907, ERC5192
- **Governance**: OpenZeppelin Governor, Votes, TimelockController
- **Utility**: ERC165, ERC677, ERC2612, ERC4626, ERC3156

For detailed documentation on each interface and its functions, see [EVM Interfaces Documentation](docs/evm-interfaces.md).

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MetaMask or another Web3 wallet

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ethereum-encoder.git
cd ethereum-encoder
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Connect your Web3 wallet (MetaMask recommended)
2. Select the interface you want to interact with
3. Choose the function you want to encode
4. Fill in the required parameters
5. Click "Encode" to generate the encoded data
6. Optionally, enter a target address and click "Send Transaction" to execute the function

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the Apache License, Version 2.0 - see the [LICENSE](LICENSE) file for details.
