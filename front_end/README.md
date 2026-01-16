app/
├── (auth)/             # 身份验证/引导流程
│   └── welcome.tsx     # 引导页
├── (tabs)/             # 主功能区 (即使不显式显示 Tab 条，也可以这样组织)
│   ├── index.tsx       # 首页
│   ├── ranking.tsx     # 排行榜页
│   └── profile.tsx     # 个人中心
├── nft/
│   └── [id].tsx        # NFT 详情页 
├── _layout.tsx         # 根布局 (控制 Stack)
└── +not-found.tsx

对app/_layout.tsx进行重新引入以及配置
在 (tabs)/_layout.tsx 中设置 display: 'none'