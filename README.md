# 今日宜挂机 · 梅尔沃命运之书

网站：https://melvor-oracle.github.io/

主仓库：https://github.com/melvor-oracle/melvor-oracle.github.io

面向 Melvor Idle 2 的非官方娱乐占卜网站：昵称生成虚构生辰，四柱与每日卦象提供取象背景，一键翻开三张塔罗，得到个人游戏宜忌。

## 第一版功能

- 昵称、星座与年份确定默认虚构生辰；相同资料可复现。
- 可修改为任意有效生辰（包括真实生辰），也可恢复自动生成。
- 三张塔罗：今日主运、顺势之事、留心之事；78 张牌、正逆位、无重复抽取。
- 同一资料、塔罗种子和日期下结果固定，按设备当地日期零点换日。
- **逆天改命只替换塔罗种子，生辰、四柱和每日卦象不变。** 新种子仅在当前浏览器保留，影响今天与之后的牌组。
- 点击牌或活动查看解签、读卦，复制不含生辰的今日签文。
- 七项活动每日选出三宜、三忌，中间一项不展示；活动可点击解签。
- 无登录、历史日签、分析统计、广告、联网 AI 或游戏账号连接。

## 宜忌活动

只保留伐木、采矿、钓鱼、狩猎、盗窃、刷怪寻宝、开箱七项。开箱统一包含晶洞、鸟巢／鹰巢、副本宝箱、鱼饵盒和狩猎发现物。刷怪寻宝针对怪物的随机掉落；下副本取得固定宝箱奖励不另列活动。

每日按综合分数排序：前三项为宜，末三项为忌，中间一项不展示。同分使用由个人资料、日期及当前塔罗种子派生的稳定顺序；重复打开不重排。页面与复制签文仅展示三宜三忌，不再提供完整技能目录或筛选。

游戏活动参考：[采集与容器](https://melvor2.com/guides/melvor-idle-2-chests-guide/)、[战斗掉落](https://melvoridle.wiki/melvor-idle-2/mechanics/combat-loot)。

## 直接部署到 GitHub Pages

本项目完全静态，不需要安装依赖、不需要构建、不需要密钥。

### 简单方式：从分支发布

1. 新建一个 GitHub 仓库，例如 `melvor-oracle`。GitHub Free 的 Pages 使用公开仓库。
2. 将本目录内的文件上传到仓库根目录，确保 `index.html` 在根目录。
3. 在仓库 **Settings → Pages → Build and deployment** 选择 **Deploy from a branch**。
4. 分支选择 `main`，目录选择 `/ (root)`，保存。
5. 等待 Pages 发布，地址通常为 `https://你的用户名.github.io/melvor-oracle/`。

使用分支发布时，不需要上传 `.github/workflows/pages.yml`；也可以在仓库禁用该工作流，以免出现不必要的工作流失败。

### 自动检查再发布：GitHub Actions（已附配置）

将完整源码推送到 `main`，在 **Settings → Pages → Source** 选择 **GitHub Actions**，然后在 Actions 页面运行 `Publish GitHub Pages`。之后每次推送到 `main`，将先运行逻辑测试，再部署网页。无需自行填写 Token。

官方说明：[创建 Pages 站点](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)、[使用自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

所有资源均使用相对路径，支持 GitHub 项目子目录。农历库已随项目保存，不依赖第三方 CDN。

## 本地预览与检查

```sh
python -m http.server 8765 --bind 127.0.0.1
# 打开 http://127.0.0.1:8765/
node --test tests/engine.test.cjs
```

也可直接打开 `index.html`；建议通过本地 HTTP 预览，以获得一致的本地存储与复制行为。

## 数据与隐私

用户资料只写入当前站点的浏览器 localStorage，不包含在 URL，不写入仓库，不上传给任何 API。复制的签文只包含昵称、日期、牌名和宜忌，不包含生辰。静态托管商可能记录普通网页访问日志。

清除站点数据会失去自定义生辰、改命种子与揭晓状态；重新填写相同资料能复现默认虚构生辰和初始牌组。没有历史记录；各昵称只保存当前设置和当前揭晓标识。

## 算法约定

- 昵称 NFKC 规范化并去首尾空格，大小写有区别。使用 128 位稳定摘要派生独立的生辰、塔罗随机序列（不用于认证）。有限摘要存在理论碰撞，不承诺无限昵称数学上的一一对应。
- 生日从指定公历年份内符合本站星座区间的日期选取；跨年星座也不会把出生年份改成相邻年。星座日期使用固定娱乐区间，不计算太阳精确入宫。
- 自定义生辰优先于星座和出生年份，不随塔罗种子变化。
- 使用 lunar-javascript 1.7.7。四柱以北京时间钟面计算，年柱依立春、月柱依节气，采用流派 2；无出生地与真太阳时校正，因此不是完整专业命理工具。
- 每日梅花卦取当日农历年月日及出生时辰。出生时辰替代问事时辰是本作约定。月数取绝对值，闰月沿用原月数。
- 只用日主五行、流日日干、体卦五行、日支六合/六冲作基础取象；不以简单五行数量推断喜用神。
- 卡牌和技能都有公开标签，三张牌以不同权重参与推荐；详细计分见 `js/engine.js`。所有分值均为娱乐偏好，绝非游戏成功率。
- `js/tarot.js` 的牌意文字与 `js/art.js` 的矢量线稿为本作原创。

## 文件

| 文件 | 内容 |
| --- | --- |
| `index.html` / `style.css` | 页面、响应式布局、对话框 |
| `js/engine.js` | 生辰与塔罗种子隔离、抽牌、宜忌 |
| `js/calendar.js` | 八卦、六十四卦、活动取象、历法辅助 |
| `js/tarot.js` / `js/art.js` | 78 张牌的解读与原创线稿 |
| `js/app.js` | 表单、保存、每日刷新、翻牌交互 |
| `vendor/` | 本地农历库与其 MIT 许可 |
| `tests/engine.test.cjs` | 稳定性、日期边界、种子隔离与评分测试 |

## 参考与许可

传统取象参考《梅花易数》[卷一](https://zh.wikisource.org/wiki/梅花易數/卷一)、[卷二](https://zh.wikisource.org/wiki/梅花易數/卷二)；历法规则见 [lunar 文档](https://6tail.cn/calendar/lunar.bazi.html)。三牌阵、跨体系权重和游戏映射均是娱乐改编。

本项目原创代码及素材按 [MIT License](LICENSE) 提供。lunar-javascript 另依其 [MIT 许可](vendor/LICENSE-lunar.txt)。Melvor Idle 2 名称与相关商标归其权利人所有。本项目无官方关联，不包含游戏原画或商业塔罗牌图。
