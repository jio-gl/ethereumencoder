import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';
import { ERC20_ABI } from '../constants/erc20Abi';
import { ERC721_ABI } from '../constants/erc721Abi';
import { ERC1155_ABI } from '../constants/erc1155Abi';
import { Link } from 'react-router-dom';

// Add more standard ABIs
const STANDARD_ABIS = {
  'ERC20 - Token Standard': ERC20_ABI,
  'ERC721 - Non-Fungible Token': ERC721_ABI,
  'ERC1155 - Multi Token': ERC1155_ABI,
  'ERC165 - Interface Detection': [
    {
      "inputs": [{"internalType": "bytes4", "name": "interfaceId", "type": "bytes4"}],
      "name": "supportsInterface",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  'ERC677 - TransferAndCall Token': [
    {
      "inputs": [
        {"internalType": "address", "name": "to", "type": "address"},
        {"internalType": "uint256", "name": "value", "type": "uint256"},
        {"internalType": "bytes", "name": "data", "type": "bytes"}
      ],
      "name": "transferAndCall",
      "outputs": [{"internalType": "bool", "name": "success", "type": "bool"}],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  'ERC2612 - Permit': [
    {
      "inputs": [],
      "name": "DOMAIN_SEPARATOR",
      "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
      "name": "nonces",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "owner", "type": "address"},
        {"internalType": "address", "name": "spender", "type": "address"},
        {"internalType": "uint256", "name": "value", "type": "uint256"},
        {"internalType": "uint256", "name": "deadline", "type": "uint256"},
        {"internalType": "uint8", "name": "v", "type": "uint8"},
        {"internalType": "bytes32", "name": "r", "type": "bytes32"},
        {"internalType": "bytes32", "name": "s", "type": "bytes32"}
      ],
      "name": "permit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  'Ownable - Access Control': [
    {
      "inputs": [],
      "name": "owner",
      "outputs": [{"internalType": "address", "name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  'AccessControl - RBAC': [
    {
      "inputs": [{"internalType": "bytes32", "name": "role", "type": "bytes32"}],
      "name": "getRoleAdmin",
      "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "bytes32", "name": "role", "type": "bytes32"},
        {"internalType": "address", "name": "account", "type": "address"}
      ],
      "name": "grantRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "bytes32", "name": "role", "type": "bytes32"},
        {"internalType": "address", "name": "account", "type": "address"}
      ],
      "name": "hasRole",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "bytes32", "name": "role", "type": "bytes32"},
        {"internalType": "address", "name": "account", "type": "address"}
      ],
      "name": "revokeRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  'Pausable - Circuit Breaker': [
    {
      "inputs": [],
      "name": "pause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paused",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unpause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  'ERC1967Proxy - Upgradeable': [
    {
      "inputs": [],
      "name": "implementation",
      "outputs": [{"internalType": "address", "name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "address", "name": "newImplementation", "type": "address"}],
      "name": "upgradeTo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "newImplementation", "type": "address"},
        {"internalType": "bytes", "name": "data", "type": "bytes"}
      ],
      "name": "upgradeToAndCall",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ],
  'ERC20Mintable - Token Minting': [
    {
      "inputs": [
        {"internalType": "address", "name": "to", "type": "address"},
        {"internalType": "uint256", "name": "amount", "type": "uint256"}
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "mintingFinished",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  'ERC20Burnable - Token Burning': [
    {
      "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "account", "type": "address"},
        {"internalType": "uint256", "name": "amount", "type": "uint256"}
      ],
      "name": "burnFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  'TimelockController - Governance': [
    {
      "inputs": [
        {"internalType": "bytes32", "name": "id", "type": "bytes32"},
        {"internalType": "address", "name": "target", "type": "address"},
        {"internalType": "uint256", "name": "value", "type": "uint256"},
        {"internalType": "bytes", "name": "data", "type": "bytes"},
        {"internalType": "bytes32", "name": "predecessor", "type": "bytes32"},
        {"internalType": "bytes32", "name": "salt", "type": "bytes32"},
        {"internalType": "uint256", "name": "delay", "type": "uint256"}
      ],
      "name": "schedule",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "bytes32", "name": "id", "type": "bytes32"},
        {"internalType": "address", "name": "target", "type": "address"},
        {"internalType": "uint256", "name": "value", "type": "uint256"},
        {"internalType": "bytes", "name": "data", "type": "bytes"},
        {"internalType": "bytes32", "name": "predecessor", "type": "bytes32"},
        {"internalType": "bytes32", "name": "salt", "type": "bytes32"}
      ],
      "name": "execute",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ],
  'ERC4626 - Tokenized Vault': [
    {
      "inputs": [],
      "name": "totalAssets",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "assets", "type": "uint256"},
        {"internalType": "address", "name": "receiver", "type": "address"},
        {"internalType": "address", "name": "owner", "type": "address"}
      ],
      "name": "withdraw",
      "outputs": [{"internalType": "uint256", "name": "shares", "type": "uint256"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "assets", "type": "uint256"},
        {"internalType": "address", "name": "receiver", "type": "address"}
      ],
      "name": "deposit",
      "outputs": [{"internalType": "uint256", "name": "shares", "type": "uint256"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "address", "name": "", "type": "address"}],
      "name": "convertToAssets",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "address", "name": "", "type": "address"}],
      "name": "convertToShares",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  'ERC777 - Advanced Token': [
    {
      "inputs": [
        {"internalType": "address", "name": "recipient", "type": "address"},
        {"internalType": "uint256", "name": "amount", "type": "uint256"},
        {"internalType": "bytes", "name": "data", "type": "bytes"}
      ],
      "name": "send",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  'ERC2981 - NFT Royalty': [
    {
      "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
      "name": "royaltyInfo",
      "outputs": [
        {"internalType": "address", "name": "receiver", "type": "address"},
        {"internalType": "uint256", "name": "royaltyAmount", "type": "uint256"}
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  'ERC3156 - Flash Loans': [
    {
      "inputs": [
        {"internalType": "address", "name": "token", "type": "address"},
        {"internalType": "uint256", "name": "amount", "type": "uint256"}
      ],
      "name": "flashLoan",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  'ERC4907 - Rental NFT': [
    {
      "inputs": [
        {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
        {"internalType": "address", "name": "user", "type": "address"},
        {"internalType": "uint64", "name": "expires", "type": "uint64"}
      ],
      "name": "setUser",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  'ERC5192 - Soulbound NFT': [
    {
      "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
      "name": "locked",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  'Chainlink - Price Feed': [
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "description",
      "outputs": [{"internalType": "string", "name": "", "type": "string"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint80", "name": "_roundId", "type": "uint80"}],
      "name": "getRoundData",
      "outputs": [
        {"internalType": "uint80", "name": "roundId", "type": "uint80"},
        {"internalType": "int256", "name": "answer", "type": "int256"},
        {"internalType": "uint256", "name": "startedAt", "type": "uint256"},
        {"internalType": "uint256", "name": "updatedAt", "type": "uint256"},
        {"internalType": "uint80", "name": "answeredInRound", "type": "uint80"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "latestRoundData",
      "outputs": [
        {"internalType": "uint80", "name": "roundId", "type": "uint80"},
        {"internalType": "int256", "name": "answer", "type": "int256"},
        {"internalType": "uint256", "name": "startedAt", "type": "uint256"},
        {"internalType": "uint256", "name": "updatedAt", "type": "uint256"},
        {"internalType": "uint80", "name": "answeredInRound", "type": "uint80"}
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  'Chainlink - VRF V2': [
    {
      "inputs": [
        {"internalType": "uint32", "name": "numWords", "type": "uint32"},
        {"internalType": "uint64", "name": "subscriptionId", "type": "uint64"},
        {"internalType": "uint16", "name": "minimumRequestConfirmations", "type": "uint16"},
        {"internalType": "uint32", "name": "callbackGasLimit", "type": "uint32"},
        {"internalType": "bytes32", "name": "keyHash", "type": "bytes32"}
      ],
      "name": "requestRandomWords",
      "outputs": [{"internalType": "uint256", "name": "requestId", "type": "uint256"}],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  'Chainlink - Automation': [
    {
      "inputs": [
        {"internalType": "bytes", "name": "checkData", "type": "bytes"}
      ],
      "name": "checkUpkeep",
      "outputs": [
        {"internalType": "bool", "name": "upkeepNeeded", "type": "bool"},
        {"internalType": "bytes", "name": "performData", "type": "bytes"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "bytes", "name": "performData", "type": "bytes"}
      ],
      "name": "performUpkeep",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  'Sablier - Stream V2': [
    {
      "inputs": [
        {"internalType": "uint256", "name": "streamId", "type": "uint256"}
      ],
      "name": "getStream",
      "outputs": [
        {"internalType": "address", "name": "sender", "type": "address"},
        {"internalType": "address", "name": "recipient", "type": "address"},
        {"internalType": "uint256", "name": "deposit", "type": "uint256"},
        {"internalType": "address", "name": "tokenAddress", "type": "address"},
        {"internalType": "uint256", "name": "startTime", "type": "uint256"},
        {"internalType": "uint256", "name": "stopTime", "type": "uint256"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "streamId", "type": "uint256"},
        {"internalType": "uint256", "name": "amount", "type": "uint256"}
      ],
      "name": "withdrawFromStream",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "streamId", "type": "uint256"}],
      "name": "cancelStream",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  'OpenZeppelin - Governor': [
    {
      "inputs": [
        {"internalType": "uint256", "name": "proposalId", "type": "uint256"}
      ],
      "name": "state",
      "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address[]", "name": "targets", "type": "address[]"},
        {"internalType": "uint256[]", "name": "values", "type": "uint256[]"},
        {"internalType": "bytes[]", "name": "calldatas", "type": "bytes[]"},
        {"internalType": "string", "name": "description", "type": "string"}
      ],
      "name": "propose",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "proposalId", "type": "uint256"}],
      "name": "execute",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ],
  'OpenZeppelin - Votes': [
    {
      "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
      "name": "getVotes",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "account", "type": "address"},
        {"internalType": "uint256", "name": "timepoint", "type": "uint256"}
      ],
      "name": "getPastVotes",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "delegate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  'Uniswap V2 - Router': [
    {
      "inputs": [
        {"internalType": "uint256", "name": "amountIn", "type": "uint256"},
        {"internalType": "uint256", "name": "amountOutMin", "type": "uint256"},
        {"internalType": "address[]", "name": "path", "type": "address[]"},
        {"internalType": "address", "name": "to", "type": "address"},
        {"internalType": "uint256", "name": "deadline", "type": "uint256"}
      ],
      "name": "swapExactTokensForTokens",
      "outputs": [{"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "amountIn", "type": "uint256"},
        {"internalType": "uint256", "name": "amountOutMin", "type": "uint256"},
        {"internalType": "address[]", "name": "path", "type": "address[]"},
        {"internalType": "address", "name": "to", "type": "address"},
        {"internalType": "uint256", "name": "deadline", "type": "uint256"}
      ],
      "name": "swapExactTokensForETH",
      "outputs": [{"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "amountOutMin", "type": "uint256"},
        {"internalType": "address[]", "name": "path", "type": "address[]"},
        {"internalType": "address", "name": "to", "type": "address"},
        {"internalType": "uint256", "name": "deadline", "type": "uint256"}
      ],
      "name": "swapExactETHForTokens",
      "outputs": [{"internalType": "uint256[]", "name": "amounts", "type": "uint256[]"}],
      "stateMutability": "payable",
      "type": "function"
    }
  ],
  'Uniswap V2 - Pair': [
    {
      "inputs": [],
      "name": "token0",
      "outputs": [{"internalType": "address", "name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "token1",
      "outputs": [{"internalType": "address", "name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getReserves",
      "outputs": [
        {"internalType": "uint112", "name": "reserve0", "type": "uint112"},
        {"internalType": "uint112", "name": "reserve1", "type": "uint112"},
        {"internalType": "uint32", "name": "blockTimestampLast", "type": "uint32"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "amount0Out", "type": "uint256"},
        {"internalType": "uint256", "name": "amount1Out", "type": "uint256"},
        {"internalType": "address", "name": "to", "type": "address"},
        {"internalType": "bytes", "name": "data", "type": "bytes"}
      ],
      "name": "swap",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  'Uniswap V2 - Factory': [
    {
      "inputs": [
        {"internalType": "address", "name": "tokenA", "type": "address"},
        {"internalType": "address", "name": "tokenB", "type": "address"}
      ],
      "name": "createPair",
      "outputs": [{"internalType": "address", "name": "pair", "type": "address"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "tokenA", "type": "address"},
        {"internalType": "address", "name": "tokenB", "type": "address"}
      ],
      "name": "getPair",
      "outputs": [{"internalType": "address", "name": "pair", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  'Uniswap V3 - Router': [
    {
      "inputs": [
        {
          "components": [
            {"internalType": "bytes", "name": "path", "type": "bytes"},
            {"internalType": "address", "name": "recipient", "type": "address"},
            {"internalType": "uint256", "name": "deadline", "type": "uint256"},
            {"internalType": "uint256", "name": "amountIn", "type": "uint256"},
            {"internalType": "uint256", "name": "amountOutMinimum", "type": "uint256"}
          ],
          "internalType": "struct ExactInputParams",
          "name": "params",
          "type": "tuple"
        }
      ],
      "name": "exactInput",
      "outputs": [{"internalType": "uint256", "name": "amountOut", "type": "uint256"}],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {"internalType": "address", "name": "tokenIn", "type": "address"},
            {"internalType": "address", "name": "tokenOut", "type": "address"},
            {"internalType": "uint24", "name": "fee", "type": "uint24"},
            {"internalType": "address", "name": "recipient", "type": "address"},
            {"internalType": "uint256", "name": "deadline", "type": "uint256"},
            {"internalType": "uint256", "name": "amountIn", "type": "uint256"},
            {"internalType": "uint256", "name": "amountOutMinimum", "type": "uint256"},
            {"internalType": "uint160", "name": "sqrtPriceLimitX96", "type": "uint160"}
          ],
          "internalType": "struct ExactInputSingleParams",
          "name": "params",
          "type": "tuple"
        }
      ],
      "name": "exactInputSingle",
      "outputs": [{"internalType": "uint256", "name": "amountOut", "type": "uint256"}],
      "stateMutability": "payable",
      "type": "function"
    }
  ],
  'Uniswap V3 - Pool': [
    {
      "inputs": [],
      "name": "slot0",
      "outputs": [
        {"internalType": "uint160", "name": "sqrtPriceX96", "type": "uint160"},
        {"internalType": "int24", "name": "tick", "type": "int24"},
        {"internalType": "uint16", "name": "observationIndex", "type": "uint16"},
        {"internalType": "uint16", "name": "observationCardinality", "type": "uint16"},
        {"internalType": "uint16", "name": "observationCardinalityNext", "type": "uint16"},
        {"internalType": "uint8", "name": "feeProtocol", "type": "uint8"},
        {"internalType": "bool", "name": "unlocked", "type": "bool"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "int24", "name": "tickLower", "type": "int24"}],
      "name": "ticks",
      "outputs": [
        {"internalType": "uint128", "name": "liquidityGross", "type": "uint128"},
        {"internalType": "int128", "name": "liquidityNet", "type": "int128"},
        {"internalType": "uint256", "name": "feeGrowthOutside0X128", "type": "uint256"},
        {"internalType": "uint256", "name": "feeGrowthOutside1X128", "type": "uint256"},
        {"internalType": "int56", "name": "tickCumulativeOutside", "type": "int56"},
        {"internalType": "uint160", "name": "secondsPerLiquidityOutsideX128", "type": "uint160"},
        {"internalType": "uint32", "name": "secondsOutside", "type": "uint32"},
        {"internalType": "bool", "name": "initialized", "type": "bool"}
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  'Uniswap V3 - Factory': [
    {
      "inputs": [
        {"internalType": "address", "name": "tokenA", "type": "address"},
        {"internalType": "address", "name": "tokenB", "type": "address"},
        {"internalType": "uint24", "name": "fee", "type": "uint24"}
      ],
      "name": "createPool",
      "outputs": [{"internalType": "address", "name": "pool", "type": "address"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "tokenA", "type": "address"},
        {"internalType": "address", "name": "tokenB", "type": "address"},
        {"internalType": "uint24", "name": "fee", "type": "uint24"}
      ],
      "name": "getPool",
      "outputs": [{"internalType": "address", "name": "pool", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    }
  ]
};

// Helper function to check if a type is a number type
const isNumberType = (type) => {
  return type.includes('int') || type.includes('uint');
};

// Helper function to format value based on decimals
const formatValue = (value, decimals) => {
  try {
    if (!value) return '';
    return ethers.formatUnits(value, decimals);
  } catch (error) {
    return value;
  }
};

// Helper function to parse value with decimals
const parseValue = (value, decimals) => {
  try {
    if (!value) return '0';
    return ethers.parseUnits(value, decimals).toString();
  } catch (error) {
    return value;
  }
};

// Add this helper function at the top with the other helpers
const isArrayType = (type) => {
  return type.includes('[]');
};

const getBaseType = (type) => {
  return type.replace('[]', '');
};

// Add this helper function near the other error parsing functions
const isEOAError = (error) => {
  return error.message.includes('code=CALL_EXCEPTION') || 
         error.message.includes('missing revert data in call exception') ||
         error.message.includes('cannot estimate gas') ||
         error.message.includes('External transactions to internal accounts cannot include data') ||
         error.message.includes('could not coalesce error');
};

// Update the parseExecutionError function
const parseExecutionError = (error) => {
  // Check if it's an EOA error
  if (isEOAError(error)) {
    return {
      title: 'Invalid Target Address',
      message: 'The address you are trying to interact with appears to be a regular wallet (EOA) and not a smart contract.',
      details: 'Smart contract functions can only be called on contract addresses. Please verify that:\n\n' +
              '1. You are using the correct contract address\n' +
              '2. The contract is deployed on the current network\n' +
              '3. You are not trying to call a function on a regular wallet address',
      type: 'eoa-error'
    };
  }

  // Check if it's an execution revert error
  if (error.message.includes('execution reverted')) {
    const revertMatch = error.message.match(/reason="([^"]+)"/);
    const revertReason = revertMatch ? revertMatch[1] : 'Unknown reason';
    
    const dataMatch = error.message.match(/transaction=({[^}]+})/);
    let txDetails = '';
    if (dataMatch) {
      try {
        const txData = JSON.parse(dataMatch[1].replace(/([a-zA-Z0-9_]+):/g, '"$1":'));
        txDetails = `\n\nTransaction Details:\n- From: ${txData.from}\n- To: ${txData.to}\n- Data: ${txData.data}`;
      } catch (e) {
        console.error('Error parsing transaction details:', e);
      }
    }
    
    return {
      title: 'Transaction Would Fail',
      message: `The transaction would fail if executed. This usually means a condition in the contract's code is not met.${txDetails}`,
      details: `Revert reason: ${revertReason}`,
      type: 'execution-revert'
    };
  }
  
  if (error.message.includes('insufficient funds')) {
    return {
      title: 'Insufficient Funds',
      message: 'You do not have enough funds to cover the transaction cost (gas * price + value).',
      type: 'funds'
    };
  }
  
  if (error.message.includes('user rejected')) {
    return {
      title: 'Transaction Rejected',
      message: 'You rejected the transaction in your wallet.',
      type: 'user-rejected'
    };
  }

  return {
    title: 'Transaction Error',
    message: 'An error occurred while trying to send the transaction.',
    details: error.message,
    type: 'unknown'
  };
};

const AbiEncoder = () => {
  const [selectedStandard, setSelectedStandard] = useState('');
  const [customAbi, setCustomAbi] = useState('');
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState('');
  const [functionInputs, setFunctionInputs] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [inputDecimals, setInputDecimals] = useState({});
  const [advancedInputs, setAdvancedInputs] = useState({});
  const [targetAddress, setTargetAddress] = useState('');
  const [encodedData, setEncodedData] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [displayValues, setDisplayValues] = useState({});
  const [addressValidation, setAddressValidation] = useState({});
  const [targetAddressValidation, setTargetAddressValidation] = useState(null);
  const [transactionHash, setTransactionHash] = useState('');
  const [arrayInputs, setArrayInputs] = useState({});
  const [arrayInputModes, setArrayInputModes] = useState({});
  const [readResult, setReadResult] = useState(null);
  const [readResultDecimals, setReadResultDecimals] = useState(18);
  // Add state for ETH value
  const [includeEthValue, setIncludeEthValue] = useState(false);
  const [ethValue, setEthValue] = useState('');
  const [ethValueDecimals, setEthValueDecimals] = useState(18);

  // Connect to wallet
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setProvider(provider);
        setSigner(signer);
        setIsConnected(true);
      } else {
        alert('Please install MetaMask to send transactions!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  // Parse ABI and extract functions
  const parseFunctions = (abi) => {
    try {
      const parsed = typeof abi === 'string' ? JSON.parse(abi) : abi;
      return parsed.filter(item => item.type === 'function');
    } catch (error) {
      console.error('Error parsing ABI:', error);
      return [];
    }
  };

  // Handle ABI selection
  useEffect(() => {
    if (selectedStandard && !isAdvancedMode) {
      setCustomAbi('');
      const functions = parseFunctions(STANDARD_ABIS[selectedStandard]);
      setFunctionInputs(functions);
    }
  }, [selectedStandard, isAdvancedMode]);

  // Handle custom ABI input
  const handleCustomAbiChange = (abiString) => {
    setCustomAbi(abiString);
    try {
      const functions = parseFunctions(abiString);
      setFunctionInputs(functions);
    } catch (error) {
      console.error('Invalid ABI format');
    }
  };

  // Add this function to handle array input initialization
  const initializeArrayInput = (name) => {
    setArrayInputs(prev => ({
      ...prev,
      [name]: [0] // Start with one element
    }));
    setInputValues(prev => ({
      ...prev,
      [name]: [''] // Start with one empty value
    }));
    setDisplayValues(prev => ({
      ...prev,
      [name]: [''] // Start with one empty display value
    }));
  };

  // Modify handleFunctionSelect to initialize array inputs
  const handleFunctionSelect = (functionName) => {
    setSelectedFunction(functionName);
    setInputValues({});
    setInputDecimals({});
    setAdvancedInputs({});
    setDisplayValues({});
    setArrayInputs({}); // Reset array inputs
    
    const selectedFuncDef = functionInputs.find(f => f.name === functionName);
    if (selectedFuncDef) {
      const defaultValues = {};
      const defaultDecimals = {};
      const defaultAdvanced = {};
      const defaultDisplay = {};
      const defaultArrays = {};
      
      selectedFuncDef.inputs.forEach(input => {
        if (isArrayType(input.type)) {
          defaultArrays[input.name] = [0];
          defaultValues[input.name] = [''];
          defaultDisplay[input.name] = [''];
        } else {
          defaultValues[input.name] = '';
          defaultDisplay[input.name] = '';
        }
        defaultDecimals[input.name] = isNumberType(getBaseType(input.type)) ? 18 : 0;
        defaultAdvanced[input.name] = false;
      });
      
      setInputValues(defaultValues);
      setInputDecimals(defaultDecimals);
      setAdvancedInputs(defaultAdvanced);
      setDisplayValues(defaultDisplay);
      setArrayInputs(defaultArrays);
    }
  };

  // Add function to handle adding new array element
  const addArrayElement = (name) => {
    setArrayInputs(prev => ({
      ...prev,
      [name]: [...prev[name], prev[name].length]
    }));
    setInputValues(prev => ({
      ...prev,
      [name]: [...prev[name], '']
    }));
    setDisplayValues(prev => ({
      ...prev,
      [name]: [...prev[name], '']
    }));
  };

  // Add function to handle removing array element
  const removeArrayElement = (name, index) => {
    setArrayInputs(prev => ({
      ...prev,
      [name]: prev[name].filter((_, i) => i !== index)
    }));
    setInputValues(prev => ({
      ...prev,
      [name]: prev[name].filter((_, i) => i !== index)
    }));
    setDisplayValues(prev => ({
      ...prev,
      [name]: prev[name].filter((_, i) => i !== index)
    }));
  };

  // Add this before the handleInputChange function
  const validateAddress = (address, name) => {
    // Always show validation for addresses that start with 0x
    if (address.startsWith('0x')) {
      // Check for correct length (42 characters for Ethereum addresses)
      if (address.length !== 42) {
        setAddressValidation(prev => ({
          ...prev,
          [name]: false // Invalid length
        }));
        return;
      }

      // Only do checksum validation if address contains uppercase characters
      if (!/[A-Z]/.test(address)) {
        setAddressValidation(prev => ({
          ...prev,
          [name]: null // Valid length but no checksum needed
        }));
        return;
      }

      try {
        // Try to get checksum address - this will throw if invalid
        ethers.getAddress(address);
        setAddressValidation(prev => ({
          ...prev,
          [name]: true // Valid checksum
        }));
      } catch (error) {
        setAddressValidation(prev => ({
          ...prev,
          [name]: false // Invalid checksum
        }));
      }
    } else {
      // Clear validation if not starting with 0x
      setAddressValidation(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Modify handleArrayTextInput to only use comma separator
  const handleArrayTextInput = (name, text, type) => {
    // Split by commas and clean up values
    const values = text.split(',')
      .map(v => v.trim())
      .filter(v => v !== '');
    
    setArrayInputs(prev => ({
      ...prev,
      [name]: values.map((_, i) => i)
    }));
    setDisplayValues(prev => ({
      ...prev,
      [name]: values
    }));
    
    // Handle the raw values based on type
    if (isNumberType(getBaseType(type)) && !advancedInputs[name]) {
      const rawValues = values.map(val => {
        try {
          return parseValue(val, inputDecimals[name]);
        } catch (error) {
          return val;
        }
      });
      setInputValues(prev => ({
        ...prev,
        [name]: rawValues
      }));
    } else {
      setInputValues(prev => ({
        ...prev,
        [name]: values
      }));
    }

    // Handle address validation for each value
    if (getBaseType(type) === 'address') {
      values.forEach((value, index) => {
        validateAddress(value, `${name}_${index}`);
      });
    }
  };

  // Modify handleInputChange to handle array inputs
  const handleInputChange = (name, value, type, index = null) => {
    try {
      if (index !== null) {
        // Handle array input
        const newDisplayValues = [...(displayValues[name] || [])];
        newDisplayValues[index] = value;
        setDisplayValues(prev => ({
          ...prev,
          [name]: newDisplayValues
        }));

        const newInputValues = [...(inputValues[name] || [])];
        if (isNumberType(getBaseType(type)) && !advancedInputs[name]) {
          try {
            newInputValues[index] = parseValue(value, inputDecimals[name]);
          } catch (error) {
            console.log('Parsing error:', error);
          }
        } else {
          newInputValues[index] = value;
        }
        setInputValues(prev => ({
          ...prev,
          [name]: newInputValues
        }));

        // Validate address if needed
        if (getBaseType(type) === 'address') {
          validateAddress(value, `${name}_${index}`);
        }
      } else {
        // Handle non-array input (existing logic)
        setDisplayValues({
          ...displayValues,
          [name]: value
        });
        
        if (isNumberType(type) && !advancedInputs[name]) {
          try {
            const parsedValue = parseValue(value, inputDecimals[name]);
            setInputValues({
              ...inputValues,
              [name]: parsedValue
            });
          } catch (error) {
            console.log('Parsing error:', error);
          }
        } else {
          setInputValues({
            ...inputValues,
            [name]: value
          });
        }

        if (type === 'address') {
          validateAddress(value, name);
        }
      }
    } catch (error) {
      console.error('Error handling input change:', error);
    }
  };

  // Modify the toggleAdvancedInput function
  const toggleAdvancedInput = (name) => {
    setAdvancedInputs(prev => ({
      ...prev,
      [name]: !prev[name]
    }));

    // Check if it's an array input
    if (isArrayType(functionInputs.find(f => f.name === selectedFunction)?.inputs.find(i => i.name === name)?.type)) {
      const currentValues = inputValues[name] || [];
      const currentDisplay = displayValues[name] || [];
      
      // When switching to raw mode
      if (!advancedInputs[name]) {
        // Keep the raw values as is
        setInputValues(prev => ({
          ...prev,
          [name]: currentValues
        }));
        // Format display values from raw values
        setDisplayValues(prev => ({
          ...prev,
          [name]: currentValues.map(val => formatValue(val, inputDecimals[name]))
        }));
      } else {
        // When switching to formatted mode
        // Parse display values to raw values
        setInputValues(prev => ({
          ...prev,
          [name]: currentDisplay.map(val => parseValue(val, inputDecimals[name]))
        }));
        // Keep the display values as is
        setDisplayValues(prev => ({
          ...prev,
          [name]: currentDisplay
        }));
      }
    } else {
      // Handle non-array inputs (single values)
      const currentValue = inputValues[name] || '';
      const currentDisplay = displayValues[name] || '';
      
      if (!advancedInputs[name]) {
        // Switching to raw mode
        setInputValues(prev => ({
          ...prev,
          [name]: currentValue
        }));
        setDisplayValues(prev => ({
          ...prev,
          [name]: formatValue(currentValue, inputDecimals[name])
        }));
      } else {
        // Switching to formatted mode
        setInputValues(prev => ({
          ...prev,
          [name]: parseValue(currentDisplay, inputDecimals[name])
        }));
        setDisplayValues(prev => ({
          ...prev,
          [name]: currentDisplay
        }));
      }
    }
  };

  // Handle decimals change
  const handleDecimalsChange = (name, decimals) => {
    setInputDecimals(prev => ({
      ...prev,
      [name]: parseInt(decimals)
    }));
    // Reset both raw and display values
    setInputValues(prev => ({
      ...prev,
      [name]: ''
    }));
    setDisplayValues(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  // Encode function data
  const encodeFunction = () => {
    try {
      const abi = isAdvancedMode ? JSON.parse(customAbi) : STANDARD_ABIS[selectedStandard];
      const iface = new ethers.Interface(abi);
      const funcFragment = functionInputs.find(f => f.name === selectedFunction);
      
      if (!funcFragment) return;

      const params = funcFragment.inputs.map(input => inputValues[input.name]);
      const encoded = iface.encodeFunctionData(selectedFunction, params);
      // Store the full hex string (with 0x) for transactions
      setEncodedData(encoded);
    } catch (error) {
      console.error('Error encoding function:', error);
      toast.error('Error encoding function. Please check your inputs.', {
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '10px',
          border: '1px solid #444',
        },
      });
    }
  };

  // Update the target address validation function similarly
  const validateTargetAddress = (address) => {
    if (address.startsWith('0x')) {
      if (address.length !== 42) {
        setTargetAddressValidation(false);
        return;
      }

      if (!/[A-Z]/.test(address)) {
        setTargetAddressValidation(null);
        return;
      }

      try {
        ethers.getAddress(address);
        setTargetAddressValidation(true);
      } catch (error) {
        setTargetAddressValidation(false);
      }
    } else {
      setTargetAddressValidation(null);
    }
  };

  // Modify target address handler
  const handleTargetAddressChange = (value) => {
    setTargetAddress(value);
    validateTargetAddress(value);
  };

  // Send transaction
  const sendTransaction = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (!encodedData) {
      toast.error('Please encode the function call first', {
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '10px',
          border: '1px solid #444',
        },
      });
      return;
    }

    try {
      const tx = {
        to: targetAddress,
        data: encodedData
      };

      // Add value if ETH is being sent
      if (includeEthValue && ethValue) {
        try {
          tx.value = ethers.parseUnits(ethValue, ethValueDecimals);
        } catch (error) {
          toast.error('Invalid ETH value', {
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '10px',
              border: '1px solid #444',
            },
          });
          return;
        }
      }

      const transaction = await signer.sendTransaction(tx);
      setTransactionHash(transaction.hash);
      toast.success('Transaction sent successfully!', {
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '10px',
          border: '1px solid #444',
        },
      });
    } catch (error) {
      console.error('Error sending transaction:', error);
      
      const errorInfo = parseExecutionError(error);
      
      // Modify the error toast in sendTransaction function
      toast.error(
        <div className="flex flex-col gap-3 max-w-full">
          <div className="flex justify-between items-start">
            <div className="font-extrabold text-xl text-red-400">{errorInfo.title}</div>
            <button
              onClick={() => toast.dismiss()}
              className="text-gray-400 hover:text-gray-200 transition-colors p-1 hover:bg-gray-800 rounded"
              title="Dismiss"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-sm text-yellow-200/90 italic">{errorInfo.message.split('Transaction Details:')[0]}</div>
          {errorInfo.details && (
            <div className="mt-1 p-3 bg-gray-900/50 rounded-lg text-xs font-mono text-orange-300/90 border border-red-900/30 shadow-inner">
              <div className="break-words whitespace-pre-wrap font-semibold">{errorInfo.details}</div>
            </div>
          )}
          <div className="text-xs mt-2">
            <div className="font-bold mb-2 text-blue-400/90 uppercase tracking-wider">Transaction Details:</div>
            <div className="grid grid-cols-[60px,1fr] gap-2 bg-gray-900/30 p-3 rounded-lg border border-gray-800">
              <div className="text-gray-400 font-medium">From:</div>
              <div className="break-all font-mono text-emerald-300/90 font-semibold">{error.transaction?.from}</div>
              <div className="text-gray-400 font-medium">To:</div>
              <div className="break-all font-mono text-emerald-300/90 font-semibold">{error.transaction?.to}</div>
              <div className="text-gray-400 font-medium">Data:</div>
              <div className="break-all font-mono text-[11px] text-emerald-300/90 font-semibold">{error.transaction?.data}</div>
            </div>
          </div>
        </div>,
        {
          duration: 0,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            borderRadius: '12px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            padding: '20px',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
            overflowWrap: 'break-word',
            wordBreak: 'break-all'
          },
          icon: '⚠️',
        }
      );
      setTransactionHash('');
    }
  };

  // Add function to check if function is read-only
  const isReadFunction = (funcFragment) => {
    return funcFragment?.stateMutability === 'view' || funcFragment?.stateMutability === 'pure';
  };

  // Add function to call read functions
  const callReadFunction = async () => {
    if (!targetAddress || !encodedData) {
      toast.error('Please encode the function call and provide a target address', {
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '10px',
          border: '1px solid #444',
        },
      });
      return;
    }

    try {
      const contract = new ethers.Contract(
        targetAddress,
        isAdvancedMode ? JSON.parse(customAbi) : STANDARD_ABIS[selectedStandard],
        provider || new ethers.JsonRpcProvider('http://localhost:8545')
      );

      const funcFragment = functionInputs.find(f => f.name === selectedFunction);
      const params = funcFragment.inputs.map(input => inputValues[input.name]);
      
      const result = await contract[selectedFunction](...params);
      setReadResult(result);
      
      toast.success('Function call successful!', {
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '10px',
          border: '1px solid #444',
        },
      });
    } catch (error) {
      console.error('Error calling read function:', error);
      toast.error(`Error: ${error.message}`, {
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '10px',
          border: '1px solid #444',
        },
      });
    }
  };

  // Helper function to format the read result for display
  const formatReadResult = (result) => {
    if (result === null || result === undefined) return 'null';
    
    if (Array.isArray(result)) {
      // Handle array results
      return `[${result.map(item => formatReadResult(item)).join(', ')}]`;
    } else if (typeof result === 'object' && result._isBigNumber) {
      // Handle BigNumber results with decimal formatting
      try {
        return `${formatValue(result, readResultDecimals)} (raw: ${result.toString()})`;
      } catch (error) {
        return result.toString();
      }
    } else if (typeof result === 'object') {
      // Handle object results (structs)
      return JSON.stringify(result, (_, v) => 
        typeof v === 'bigint' ? v.toString() : v
      , 2);
    } else if (typeof result === 'bigint') {
      // Handle bigint results with decimal formatting
      try {
        return `${formatValue(result, readResultDecimals)} (raw: ${result.toString()})`;
      } catch (error) {
        return result.toString();
      }
    }
    
    return result.toString();
  };

  // Helper function to get raw value from result
  const getRawValue = (result) => {
    if (result === null || result === undefined) return 'null';
    if (typeof result === 'object' && result._isBigNumber) {
      return result.toString();
    }
    if (typeof result === 'bigint') {
      return result.toString();
    }
    return result.toString();
  };

  // Add this before the return statement
  useEffect(() => {
    // Load Lato font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-green-400">Ethereum ABI Encoder ⬡</h1>
        
        {/* Mode Switch */}
        <div className="mb-6">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isAdvancedMode}
              onChange={(e) => setIsAdvancedMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-300">Advanced Mode</span>
          </label>
        </div>

        {/* ABI Selection/Input */}
        <div className="mb-6">
          {!isAdvancedMode ? (
            <select
              value={selectedStandard}
              onChange={(e) => setSelectedStandard(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded p-2"
            >
              <option value="">Select ERC Standard or EVM Interface</option>
              {Object.keys(STANDARD_ABIS).map(standard => (
                <option key={standard} value={standard}>{standard}</option>
              ))}
            </select>
          ) : (
            <textarea
              value={customAbi}
              onChange={(e) => handleCustomAbiChange(e.target.value)}
              placeholder="Paste your ABI here (JSON format)"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded p-2 h-32 font-mono"
            />
          )}
        </div>

        {/* Function Selection */}
        <div className="mb-6">
          <select
            value={selectedFunction}
            onChange={(e) => handleFunctionSelect(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded p-2"
          >
            <option value="">Select Function</option>
            {functionInputs.map(func => (
              <option key={func.name} value={func.name}>{func.name}</option>
            ))}
          </select>
        </div>

        {/* Function Parameters */}
        {selectedFunction && (
          <div className="mb-6">
            <h3 className="text-xl mb-4 text-green-400">Function Parameters</h3>
            {functionInputs
              .find(f => f.name === selectedFunction)
              ?.inputs.map(input => (
                <div key={input.name} className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-medium">
                      {input.name} ({input.type})
                    </label>
                    <div className="flex items-center gap-4">
                      {isArrayType(input.type) && (
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={arrayInputModes[input.name]}
                            onChange={(e) => {
                              const isTextMode = e.target.checked;
                              setArrayInputModes(prev => ({
                                ...prev,
                                [input.name]: isTextMode
                              }));

                              // When switching from Text Mode to Individual Rows
                              if (!isTextMode && displayValues[input.name]?.[0]) {
                                // Split the text by commas or newlines and clean up values
                                const values = displayValues[input.name][0]
                                  .split(/[,\n]/)
                                  .map(v => v.trim())
                                  .filter(v => v !== '');

                                // Update array inputs state
                                setArrayInputs(prev => ({
                                  ...prev,
                                  [input.name]: values.map((_, i) => i)
                                }));

                                // Update display and input values
                                setDisplayValues(prev => ({
                                  ...prev,
                                  [input.name]: values
                                }));

                                // Handle the raw values based on type
                                if (isNumberType(getBaseType(input.type)) && !advancedInputs[input.name]) {
                                  const rawValues = values.map(val => {
                                    try {
                                      return parseValue(val, inputDecimals[input.name]);
                                    } catch (error) {
                                      return val;
                                    }
                                  });
                                  setInputValues(prev => ({
                                    ...prev,
                                    [input.name]: rawValues
                                  }));
                                } else {
                                  setInputValues(prev => ({
                                    ...prev,
                                    [input.name]: values
                                  }));
                                }

                                // Handle address validation for each value
                                if (getBaseType(input.type) === 'address') {
                                  values.forEach((value, index) => {
                                    validateAddress(value, `${input.name}_${index}`);
                                  });
                                }
                              }
                              // When switching to Text Mode
                              else if (isTextMode && displayValues[input.name]?.length > 0) {
                                // Join existing values with commas
                                const textValue = displayValues[input.name].join(', ');
                                setDisplayValues(prev => ({
                                  ...prev,
                                  [input.name]: [textValue]
                                }));
                              }
                            }}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          <span className="ms-2 text-xs font-medium text-gray-300">Text Mode</span>
                        </label>
                      )}
                      {isNumberType(getBaseType(input.type)) && (
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={advancedInputs[input.name]}
                            onChange={() => toggleAdvancedInput(input.name)}
                            className="sr-only peer"
                          />
                          <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                          <span className="ms-2 text-xs font-medium text-gray-300">Raw Value</span>
                        </label>
                      )}
                    </div>
                  </div>
                  
                  {isArrayType(input.type) ? (
                    arrayInputModes[input.name] ? (
                      // Text mode for array input
                      <div className="space-y-2">
                        <textarea
                          value={displayValues[input.name]?.join(', ') || ''}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            // Store the raw input value
                            setDisplayValues(prev => ({
                              ...prev,
                              [input.name]: [newValue] // Store as single value to preserve commas/newlines
                            }));
                            
                            // Process the input when encoding
                            const values = newValue
                              .split(/[,\n]/) // Split by either commas or newlines
                              .map(v => v.trim())
                              .filter(v => v !== '');
                            
                            setArrayInputs(prev => ({
                              ...prev,
                              [input.name]: values.map((_, i) => i)
                            }));
                            
                            // Handle the raw values based on type
                            if (isNumberType(getBaseType(input.type)) && !advancedInputs[input.name]) {
                              const rawValues = values.map(val => {
                                try {
                                  return parseValue(val, inputDecimals[input.name]);
                                } catch (error) {
                                  return val;
                                }
                              });
                              setInputValues(prev => ({
                                ...prev,
                                [input.name]: rawValues
                              }));
                            } else {
                              setInputValues(prev => ({
                                ...prev,
                                [input.name]: values
                              }));
                            }

                            // Handle address validation for each value
                            if (getBaseType(input.type) === 'address') {
                              values.forEach((value, index) => {
                                validateAddress(value, `${input.name}_${index}`);
                              });
                            }
                          }}
                          className="w-full h-48 bg-gray-900 border border-gray-700 text-white rounded p-2 font-mono resize-y"
                          placeholder={`Enter ${getBaseType(input.type)} values\nSeparate values by commas or newlines\nExample:\n10\n20\n30\n\nor: 10, 20, 30`}
                          spellCheck="false"
                        />
                        {isNumberType(getBaseType(input.type)) && !advancedInputs[input.name] && (
                          <div className="flex gap-2 items-center">
                            <select
                              value={inputDecimals[input.name]}
                              onChange={(e) => handleDecimalsChange(input.name, e.target.value)}
                              className="w-24 bg-gray-900 border border-gray-700 text-white rounded p-2"
                            >
                              {[0, 6, 8, 18].map(d => (
                                <option key={d} value={d}>{d} dec</option>
                              ))}
                            </select>
                            <div className="text-xs text-gray-400 flex-1">
                              Raw values: [{inputValues[input.name]?.join(', ')}]
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Individual input mode
                      <div className="space-y-2">
                        {arrayInputs[input.name]?.map((_, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                value={advancedInputs[input.name] ? 
                                  inputValues[input.name]?.[index] || '' : 
                                  displayValues[input.name]?.[index] || ''}
                                onChange={(e) => handleInputChange(input.name, e.target.value, input.type, index)}
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded p-2"
                                placeholder={`Enter ${getBaseType(input.type)}`}
                              />
                              {getBaseType(input.type) === 'address' && addressValidation[`${input.name}_${index}`] !== null && (
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                                  {addressValidation[`${input.name}_${index}`] ? (
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {isNumberType(getBaseType(input.type)) && !advancedInputs[input.name] && (
                              <select
                                value={inputDecimals[input.name]}
                                onChange={(e) => handleDecimalsChange(input.name, e.target.value)}
                                className="w-24 bg-gray-900 border border-gray-700 text-white rounded p-2"
                              >
                                {[0, 6, 8, 18].map(d => (
                                  <option key={d} value={d}>{d} dec</option>
                                ))}
                              </select>
                            )}
                            
                            <button
                              onClick={() => removeArrayElement(input.name, index)}
                              className="p-2 bg-red-600 hover:bg-red-700 rounded"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        
                        <button
                          onClick={() => addArrayElement(input.name)}
                          className="mt-2 w-full p-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                          Add Element
                        </button>
                        
                        {isNumberType(getBaseType(input.type)) && !advancedInputs[input.name] && (
                          <div className="mt-1 text-xs text-gray-400">
                            Raw values: [{inputValues[input.name]?.join(', ')}]
                          </div>
                        )}
                      </div>
                    )
                  ) : (
                    // Non-array input (existing code)
                    <div className="flex gap-2 relative">
                      <input
                        type="text"
                        value={advancedInputs[input.name] ? inputValues[input.name] : (displayValues[input.name] || '')}
                        onChange={(e) => handleInputChange(input.name, e.target.value, input.type)}
                        className="flex-1 bg-gray-900 border border-gray-700 text-white rounded p-2"
                        placeholder={`Enter ${input.type}`}
                      />
                      
                      {isNumberType(input.type) && !advancedInputs[input.name] && (
                        <select
                          value={inputDecimals[input.name]}
                          onChange={(e) => handleDecimalsChange(input.name, e.target.value)}
                          className="w-24 bg-gray-900 border border-gray-700 text-white rounded p-2"
                        >
                          {[0, 6, 8, 18].map(d => (
                            <option key={d} value={d}>{d} dec</option>
                          ))}
                        </select>
                      )}

                      {input.type === 'address' && addressValidation[input.name] !== null && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                          {addressValidation[input.name] ? (
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!isArrayType(input.type) && isNumberType(input.type) && !advancedInputs[input.name] && (
                    <div className="mt-1 text-xs text-gray-400">
                      Raw value: {inputValues[input.name] || '0'}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* Target Address */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Target Contract Address</label>
          <div className="relative">
            <input
              type="text"
              value={targetAddress}
              onChange={(e) => handleTargetAddressChange(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded p-2"
              placeholder="0x..."
            />
            {targetAddressValidation !== null && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                {targetAddressValidation ? (
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ETH Value Input */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeEthValue}
                onChange={(e) => setIncludeEthValue(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-300">Include ETH Value</span>
            </label>
          </div>
          
          {includeEthValue && (
            <div className="flex gap-2 items-center bg-gray-800 p-4 rounded-lg border border-gray-700">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={ethValue}
                  onChange={(e) => setEthValue(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded p-2"
                  placeholder="Enter ETH amount"
                />
              </div>
              <select
                value={ethValueDecimals}
                onChange={(e) => setEthValueDecimals(parseInt(e.target.value))}
                className="w-24 bg-gray-900 border border-gray-700 text-white rounded p-2"
              >
                {[0, 6, 8, 18].map(d => (
                  <option key={d} value={d}>{d} dec</option>
                ))}
              </select>
              {ethValue && (
                <div className="text-xs text-gray-400 ml-2">
                  Raw: {ethValue ? ethers.parseUnits(ethValue || '0', ethValueDecimals).toString() : '0'} wei
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={encodeFunction}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Encode Function Call
          </button>
          
          {selectedFunction && isReadFunction(functionInputs.find(f => f.name === selectedFunction)) && (
            <button
              onClick={callReadFunction}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Read Value
            </button>
          )}
        </div>

        {/* Read Function Result */}
        {readResult !== null && (
          <div className="mb-6">
            <h3 className="text-xl mb-4 text-blue-400">Read Result</h3>
            <div className="bg-gray-800 border border-gray-700 rounded p-4 font-mono relative group">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start gap-2">
                  <pre className="whitespace-pre-wrap break-all text-sm">
                    {formatReadResult(readResult)}
                  </pre>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const formattedResult = formatReadResult(readResult);
                        navigator.clipboard.writeText(formattedResult);
                        toast.success('Formatted result copied!', {
                          style: {
                            background: '#333',
                            color: '#fff',
                            borderRadius: '10px',
                            border: '1px solid #444',
                          },
                          icon: '📋',
                        });
                      }}
                      className="p-2 hover:bg-gray-700 rounded-lg flex-shrink-0 group relative"
                      title="Copy formatted value"
                    >
                      <svg className="w-5 h-5 text-blue-400 hover:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="hidden group-hover:block absolute -top-8 right-0 bg-gray-900 text-xs text-gray-300 px-2 py-1 rounded">
                        Copy formatted
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        const rawValue = getRawValue(readResult);
                        navigator.clipboard.writeText(rawValue);
                        toast.success('Raw value copied!', {
                          style: {
                            background: '#333',
                            color: '#fff',
                            borderRadius: '10px',
                            border: '1px solid #444',
                          },
                          icon: '📋',
                        });
                      }}
                      className="p-2 hover:bg-gray-700 rounded-lg flex-shrink-0 group relative"
                      title="Copy raw value"
                    >
                      <svg className="w-5 h-5 text-green-400 hover:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="hidden group-hover:block absolute -top-8 right-0 bg-gray-900 text-xs text-gray-300 px-2 py-1 rounded">
                        Copy raw
                      </span>
                    </button>
                  </div>
                </div>
                {(typeof readResult === 'bigint' || (typeof readResult === 'object' && readResult._isBigNumber)) && (
                  <div className="flex items-center gap-2 mt-2">
                    <label className="text-sm text-gray-400">Decimals:</label>
                    <select
                      value={readResultDecimals}
                      onChange={(e) => setReadResultDecimals(parseInt(e.target.value))}
                      className="bg-gray-900 border border-gray-700 text-white rounded p-1 text-sm"
                    >
                      {[0, 6, 8, 18].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Encoded Data */}
        {encodedData && (
          <div className="mb-6">
            <h3 className="text-xl mb-4 text-green-400">Encoded Data</h3>
            <div className="bg-gray-800 border border-gray-700 rounded p-4 font-mono break-all relative group">
              <div className="flex justify-between items-start gap-2">
                <div className="break-all">{encodedData.slice(2)}</div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(encodedData.slice(2));
                    toast.success('Encoded data copied to clipboard!', {
                      style: {
                        background: '#333',
                        color: '#fff',
                        borderRadius: '10px',
                        border: '1px solid #444',
                      },
                      icon: '📋',
                    });
                  }}
                  className="p-2 hover:bg-gray-700 rounded-lg flex-shrink-0"
                  title="Copy to clipboard"
                >
                  <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Send Transaction Button */}
        <button
          onClick={sendTransaction}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          {isConnected ? 'Send Transaction' : 'Connect Wallet & Send'}
        </button>

        {/* Transaction Hash Display */}
        {transactionHash && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-xl mb-2 text-green-400">Transaction Sent!</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Hash:</span>
              <a
                href={`https://etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-400 hover:text-purple-300 break-all"
              >
                {transactionHash}
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(transactionHash);
                  toast.success('Hash copied to clipboard!', {
                    style: {
                      background: '#333',
                      color: '#fff',
                      borderRadius: '10px',
                      border: '1px solid #444',
                    },
                  });
                }}
                className="ml-2 p-1 hover:bg-gray-700 rounded"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-16 pb-8 border-t border-gray-800">
        <div className="flex items-center justify-center mt-8 space-x-4">
          <span className="text-gray-400">Sponsor:</span>
          <a 
            href="https://multiguard.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden">
              <img 
                src="/assets/images/logo192.png" 
                alt="MultiGuard Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-['Lato'] font-bold text-blue-400">MultiGuard</span>
              <span className="text-gray-400 text-sm ml-2">multisig gov made simple</span>
            </div>
          </a>
        </div>
        
        <div className="flex items-center justify-center mt-4">
          <a 
            href="https://github.com/jio-gl/ethereumencoder" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>Report bugs on GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AbiEncoder; 