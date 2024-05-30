document.addEventListener('DOMContentLoaded', function() {
    const connectWalletButton = document.getElementById('connectWallet');
    const swapButton = document.getElementById('swapButton');
    const amountInInput = document.getElementById('amountIn');
    const tokenInSelect = document.getElementById('tokenIn');
    const amountOutInput = document.getElementById('amountOut');
    const tokenOutSelect = document.getElementById('tokenOut');
    const txHashElement = document.getElementById('txHash');
    const transactionDetails = document.getElementById('transactionDetails');

    let signer, provider;

     // 钱包连接功能
  const connectButton = document.getElementById("connectButton");
  if (connectButton) {
    connectButton.addEventListener("click", async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          const balance = await provider.getBalance(address);
          const balanceInEth = ethers.utils.formatEther(balance);
          walletAddress.innerText = address;
          walletBalance.innerText = balanceInEth;
          if (walletInfo) {
            walletInfo.classList.remove("hidden");
          }
        } catch (error) {
          console.error("Error connecting to wallet:", error);
        }
      } else {
        console.log("MetaMask is not installed!");
      }
    });
  }

    swapButton.addEventListener('click', async () => {
        const amountIn = ethers.utils.parseUnits(amountInInput.value, 'ether');
        const tokenIn = tokenInSelect.value;
        const tokenOut = tokenOutSelect.value;

        const uniswapRouterAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564';
        const uniswapRouterABI = [ /[
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "src",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "guy",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "wad",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "dst",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "wad",
                "type": "uint256"
            }
        ],
        "name": "Deposit",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "src",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "dst",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "wad",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "src",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "wad",
                "type": "uint256"
            }
        ],
        "name": "Withdrawal",
        "type": "event"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "guy",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "wad",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "dst",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "wad",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "src",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "dst",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "wad",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "wad",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
]/ ];

        async function swapETHforDAI(amountIn, amountOutMin, slippage, deadlineMinutes = 30) {
    if (!signer) {
        alert("Please connect your wallet first.");
        return;
    }
    const amountOutMinAdjusted = ethers.utils.parseEther((amountIn * (1 - slippage)).toString());
    const deadline = Math.floor(Date.now() / 1000) + deadlineMinutes * 60;

    try {
        const tx = await uniswapRouter.swapExactInputSingle({
            tokenIn: ethers.constants.AddressZero, // ETH
            tokenOut: '0xda10009cbd5d07dd0cecc66161fc93d7c9000', // DAI address on Optimism
            amountIn: ethers.utils.parseEther(amountIn),
            amountOutMinimum: amountOutMinAdjusted,
            deadline: deadline,
            sqrtPriceLimitX96: 0
        });
        console.log('Transaction submitted! Hash:', tx.hash);
        await tx.wait();
        console.log('Transaction confirmed!');
    } catch (error) {
        console.error('Swap failed:', error);
        alert('Swap failed: ' + error.message);
    }
}
