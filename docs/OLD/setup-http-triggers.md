# 为云函数设置 HTTP 触发器

## 问题
云函数已部署，但未配置 HTTP 触发器。
这导致尝试通过 HTTP 调用它们时出现 "Network request failed" 错误。

## 解决方案: 通过 CloudBase 控制台添加 HTTP 触发器

由于 CLI 不支持直接创建 HTTP 触发器，请使用 Web 控制台：

### 步骤:

1. **登录 CloudBase 控制台**
   - 访问: https://console.cloud.tencent.com/tcb
   - 选择环境: `cloud1-1gjcyrdd7ab927c6`

2. **导航到云函数**
   - 点击左侧菜单中的 "云函数"
   - 您应该能看到已部署的函数

3. **为每个函数添加 HTTP 触发器**

   对于每个函数 (user-register, user-login, user-reset-password, user-update-profile):

   a. 点击函数名称
   b. 转到 "触发器配置" 选项卡
   c. 点击 "创建触发器"
   d. 选择 "HTTP" 作为触发器类型
   e. 配置触发器:
      - **触发路径**: 使用函数名称 (例如 `/user-register`)
      - **鉴权**: 对于公开端点选择 "免鉴权"
      - 或者如果您想要 CloudBase 认证，使用 "需要鉴权"
   f. 点击 "确定"

4. **获取 HTTP 访问 URL**

   创建触发器后，您将获得如下 URL:
   ```
   https://cloud1-1gjcyrdd7ab927c6-1387301748.ap-shanghai.app.tcloudbase.com/user-register
   https://cloud1-1gjcyrdd7ab927c6-1387301748.ap-shanghai.app.tcloudbase.com/user-login
   https://cloud1-1gjcyrdd7ab927c6-1387301748.ap-shanghai.app.tcloudbase.com/user-reset-password
   https://cloud1-1gjcyrdd7ab927c6-1387301748.ap-shanghai.app.tcloudbase.com/user-update-profile
   ```

5. **验证 URL 是否与您的 .env 配置匹配**

   当前 .env 设置:
   ```
   EXPO_PUBLIC_API_BASE_URL=https://cloud1-1gjcyrdd7ab927c6-1387301748.ap-shanghai.app.tcloudbase.com
   ```

## 替代方案: 使用 tcb CLI (交互式)

您也可以尝试交互式创建触发器:

```bash
cd cloudbase
tcb functions:trigger:create user-register
tcb functions:trigger:create user-login
tcb functions:trigger:create user-reset-password
tcb functions:trigger:create user-update-profile
```

按照提示选择 HTTP 触发器类型并配置路径。

## 验证设置

添加触发器后，使用以下命令验证:

```bash
tcb functions:detail user-register
```

"Triggers" 字段不应再显示 "None"。

## 使用 curl 测试

直接测试端点:

```bash
curl -X POST \
  https://cloud1-1gjcyrdd7ab927c6-1387301748.ap-shanghai.app.tcloudbase.com/user-register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "displayName": "Test User",
    "role": "LEARNER"
  }'
```

预期响应:
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "...",
    "expiresIn": 604800
  }
}
```
