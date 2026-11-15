# OtpGenSamsung

将 Kotlin 版本的 `OtpGenSamsung` 算法翻译为浏览器 JavaScript，并提供了一个可直接部署到 GitHub Pages 的静态页面。

## 来源说明

[出处](https://gist.github.com/JaapBosheuvel/1e7e7ef8c02f6d6a4989ccfe330c38d6" label="Gist 1e7e7ef)

适用范围：

> Since Samsung Android 15 there is a new OTP key for SysDump utilities. I reverse engineered the SysDump package to find the OTP key generation and made a kotlin equivalent so you can generate the new OTP key to enable features such as Silent Logging.

重点中文翻译：

> 自 Samsung Android 15 起，SysDump 工具新增了一种新的 OTP 密钥。我逆向分析了 SysDump 包，找出了 OTP 密钥的生成逻辑，并制作了一个 Kotlin 对等实现，以便你可以生成新的 OTP 密钥，从而启用诸如 Silent Logging 之类的功能。

这说明该算法的目标是为 Samsung Android 15 及之后系统中的 SysDump 相关能力生成新的 OTP 密钥，用于启用高级功能，例如 Silent Logging。

## 本地使用

直接打开 `index.html`，输入：

- 时间（`datetime-local`）
- 随机码（仅当为 6 位数字时会触发 nonce 模式）

点击“生成OTP”即可得到 6 位数字。

## GitHub Pages 部署

仓库已提供 `.github/workflows/deploy-pages.yml`。

1. 在仓库 **Settings → Pages** 中将 Source 设置为 **GitHub Actions**。
2. 推送到 `main` 分支后会自动部署。
