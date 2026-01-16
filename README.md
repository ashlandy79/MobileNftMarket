RN NFT Gallery DApp 项目文档
项目概述
项目名称: RN NFT Gallery

项目类型: 移动端跨平台 DApp (Decentralized Application)

核心功能: 一个基于 React Native 的移动应用，允许用户通过 WalletConnect 连接他们的区块链钱包（如 MetaMask），并查看其在不同链上（以太坊、Polygon）拥有的 NFT 资产。

技术目标: 深入实践 React Native 开发、以太坊区块链交互（Ethers.js）、钱包集成（WalletConnect）、状态管理（Zustand/Recoil）和跨端开发，打造一个符合行业标准的 DApp 原型。

技术栈
框架: React Native (Expo)

区块链交互: Ethers.js (v5)

钱包连接: WalletConnect (v1.0 或最新稳定版)

状态管理: Zustand (轻量级优先) 或 Recoil

UI 库: React Native Paper

节点服务: Alchemy 或 Infura (用于可靠地读取链上数据)

测试网络: Polygon Mumbai 或 Ethereum Goerli

项目结构 (预期)
text
ashMobileNFT/
├── frontend/                 # React Native 前端项目
│   ├── assets/               # 静态资源（图片、字体等）
│   ├── components/           # 可复用组件
│   │   ├── WalletConnectButton.js
│   │   ├── NFTList.js
│   │   └── NFTCard.js
│   ├── hooks/                # 自定义 Hooks
│   │   └── useNFTs.js
│   ├── stores/               # 状态管理
│   │   └── useWalletStore.js
│   ├── constants/            # 常量配置
│   │   └── index.js
│   ├── utils/                # 工具函数
│   │   └── web3.js
│   ├── App.js                # 主组件
│   ├── app.json              # Expo 配置
│   └── package.json
└── contracts/                # Solidity 智能合约项目
    ├── contracts/            # 合约源文件
    │   └── MyNFT.sol         # 示例 NFT 合约
    ├── scripts/              # 部署脚本
    │   └── deploy.js
    ├── test/                 # 测试文件
    │   └── MyNFT.test.js
    ├── hardhat.config.js     # Hardhat 配置
    └── package.json
开发流程与核心任务
第一阶段：环境搭建与初始化 (Day 1)
初始化项目:

bash
npm install -g expo-cli
expo init frontend
cd frontend
（选择 blank template）

安装核心依赖:

bash
npm install ethers@^5.7.0
npm install @walletconnect/web3-provider @walletconnect/utils
npm install zustand # 或 recoil
npm install react-native-paper
expo install expo-web-browser expo-crypto
第二阶段：核心功能开发 (Day 2-8)
模块 1: 钱包连接 (Wallet Integration)
组件: components/WalletConnectButton.js

状态: stores/useWalletStore.js (管理 address, provider, isConnected)

功能:

初始化 WalletConnect Provider。

实现 connectWallet() 函数，触发连接并弹出二维码。

使用 expo-web-browser 或 Linking API 处理移动端重定向至钱包 App。

监听连接/断开事件，更新全局状态。

实现 disconnectWallet() 函数。

模块 2: 链上数据读取 (On-Chain Data Reading)
Hook: hooks/useNFTs.js

功能:

从状态库中获取已连接的 address 和 provider。

使用 Alchemy 或 Infura 的节点 API（通过 ethers.providers.JsonRpcProvider 初始化），调用其 getNftsForOwner 方法获取指定地址的 NFT。这是最简单的方式。

处理加载和错误状态。

将获取到的 NFT 列表（包含 name, image, tokenId）返回。

模块 3: UI 实现 (UI Implementation)
组件: components/NFTList.js (使用 FlatList 渲染列表)

组件: components/NFTCard.js (渲染单个 NFT 的卡片的样式)

功能:

在 App.js 中集成 WalletConnectButton 和 NFTList。

根据连接状态显示不同的 UI（未连接时显示连接按钮，已连接时显示地址和 NFT 列表）。

在 NFTCard 中使用 Image 组件加载并显示 NFT 图片。

实现下拉刷新功能以重新获取 NFT。

第三阶段：测试与构建 (Day 9-10)
测试:

在 Expo Go App 中进行真机调试（iOS & Android）。

测试完整的用户流程：连接 -> 查看 NFT -> 断开。

处理异常情况（网络错误、用户拒绝连接、无 NFT 等）。

构建:

构建 Android APK 用于演示：

bash
expo build:android
（可选）如有 Apple 开发者账号，可构建 iOS IPA。

“真实上链”说明
本项目通过以下方式实现真实链上交互，无需部署智能合约：

连接真实钱包: 集成 WalletConnect，用户连接的是他们的主网/测试网钱包（如 MetaMask）。

交互真实测试网: 项目将配置为与 Polygon Mumbai 测试网 或 Ethereum Goerli 测试网 交互。

读取真实链上数据: 通过 Alchemy/Infura 的节点服务，从上述测试网实时读取用户的 NFT 数据。

测试: 用户需要拥有测试网 NFT 和测试币（Matic/Mumbai ETH）才能完整测试。可以从像 OpenSea Testnets 这样的平台获取测试 NFT。
