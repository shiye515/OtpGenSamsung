# OtpGenSamsung

将 Kotlin 版本的 `OtpGenSamsung` 算法翻译为浏览器 JavaScript，并提供了一个可直接部署到 GitHub Pages 的静态页面。

## 本地使用

直接打开 `index.html`，输入：

- 时间（`datetime-local`）
- 随机码（仅当为 6 位数字时会触发 nonce 模式）

点击“生成OTP”即可得到 6 位数字。

## GitHub Pages 部署

仓库已提供 `.github/workflows/deploy-pages.yml`。

1. 在仓库 **Settings → Pages** 中将 Source 设置为 **GitHub Actions**。
2. 推送到 `main` 分支后会自动部署。
