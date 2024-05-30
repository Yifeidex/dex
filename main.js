document.getElementById('connectWallet').addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        // 请求用户连接 MetaMask 钱包
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            // 确保切换到 Optimism 网络
            await provider.send("wallet_switchEthereumChain", [{ chainId: "0xa" }]); // Optimism 主网的 chainId 是 10
            document.getElementById('swapTokens').disabled = false;
        } catch (error) {
            console.error("Error connecting to MetaMask", error);
        }
    } else {
        alert('Please install MetaMask!');
    }
});

document.getElementById('swapTokens').addEventListener('click', async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const routerAddress = 'UNISWAP_V3_ROUTER_ADDRESS_ON_OPTIMISM';
    const routerABI = ['function exactInputSingle(tuple(uint256 amountIn, uint256 amountOutMinimum, address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint160 sqrtPriceLimitX96) external returns (uint256 amountOut)'];
    const router = new ethers.Contract(routerAddress, routerABI, signer);

    // 参数配置
    const transactionParams = {
        tokenIn: 'WETH_ADDRESS_ON_OPTIMISM',
        tokenOut: 'DAI_ADDRESS_ON_OPTIMISM',
        fee: 3000, // 0.3% 费率层
        recipient: await signer.getAddress(),
        deadline: Math.floor(Date.now() / 1000) + 60 * 10, // 10分钟后超时
        amountIn: ethers.utils.parseEther("0.1"),
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0
    };

    try {
        const tx = await router.exactInputSingle(transactionParams);
        console.log('Transaction hash:', tx.hash);
        await tx.wait();
        console.log('Transaction confirmed');
    } catch (error) {
        console.error('Error executing swap', error);
    }
});
