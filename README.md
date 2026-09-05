# RH Early Meme Scout

**Live: <https://anyixuan798-wq.github.io/rh-early-meme-scout/>**

Robinhood Chain(chainId `4663`)早期 meme 研究台:Pons 刚毕业雷达、五条硬过滤、仓位建议、观察仓哨兵。

**只做发现 / 打分 / 告警,不下单。** 绝大多数新币会归零。只用愿意全亏的钱。

## 这是什么版本

本仓库是 [xiaoyang111222/rh-early-meme-scout](https://github.com/xiaoyang111222/rh-early-meme-scout) 的**静态改造版**:

- 原版是 TanStack Start 全栈应用(SSR + 登录 + 数据库),需 Node 服务器运行
- 本版剥掉服务端,扫描逻辑(**Pons 工厂事件 → 链上体检 → 聪明钱 → 过滤打分**)全部在你浏览器里跑,数据直连公开 API,无账号、无服务器、纯静态部署在 GitHub Pages
- 唯一例外:股票代币列表(`api.robinhood.com/rhj/assets` 无 CORS 头,浏览器调不了)→ 由 GitHub Actions 每 6 小时在服务器端抓一次生成快照 `public/data/stocks.json`,随站发布

## 本地运行

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 产出 dist/ (静态站点)
```

⚠️ 本地开发注意:**Blockscout API 对 `http://` 来源的 Referer 一律回 500**(https 正常)。本地 dev 是 http,雷达页会一直报 500 扫不出数据——这是上游 API 的行为,不是代码 bug。本地要看到真数据:用 https 起本地服务(自签证书 + `--ignore-certificate-errors`)或直接看线上站。其余数据源(DexScreener / RPC / 股票快照)不受影响。

## 数据从哪来

| 模块 | 来源 | 模式 |
| --- | --- | --- |
| 新币 / 毕业 | Pons 工厂事件(Blockscout) | 浏览器直连(ACAO \*) |
| 盘口 / 价格 / 配对 | DexScreener | 浏览器直连(ACAO \*) |
| 持有人 / 前十 / 锁仓 / 转账 | Blockscout + Pons locker | 浏览器直连(ACAO \*) |
| ERC-20 name/symbol | Robinhood Chain RPC `eth_call` | 浏览器直连(ACAO \*) |
| 股票代币 | `api.robinhood.com/rhj/assets` → 快照 | Actions cron + 同源静态 JSON |
| 叙事打分 | xAI API(需 `XAI_API_KEY`) | 静态版无密钥 → 显示"暂时不可用" |

拿不到的数字写 `UNKNOWN`,并当红灯。

## 仓位(仅建议)

- Tier 1 $10 · 止损 -30% · 止盈 +200% 全清
- Tier 2 $30 · 止损 -30% · +100% 先卖一半
- Tier 3 $60 · 同样止损止盈
- 同时最多 5 个观察仓 · 横盘 48h 释放资金

## 说明

- 扫描每 90 秒内走模块缓存,手动可点「立即扫描」强制刷新;雷达页每 10 分钟自动重扫
- 观察仓存在浏览器 localStorage,不跨设备
- 原版全栈代码(登录/数据库/SSR)见上游仓库,本版为只读研究用途
- 这不是投资建议,也不构成任何交易指令
