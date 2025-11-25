# Setup HTTP Triggers for Cloud Functions

## Problem
Cloud functions are deployed but have no HTTP triggers configured.
This causes "Network request failed" errors when trying to call them via HTTP.

## Solution: Add HTTP Triggers via CloudBase Console

Since CLI doesn't support direct HTTP trigger creation, use the web console:

### Steps:

1. **Login to CloudBase Console**
   - Visit: https://console.cloud.tencent.com/tcb
   - Select environment: `cloud1-1gjcyrdd7ab927c6`

2. **Navigate to Cloud Functions**
   - Click "云函数" (Cloud Functions) in left menu
   - You should see your deployed functions

3. **Add HTTP Trigger for each function**

   For each function (user-register, user-login, user-reset-password, user-update-profile):

   a. Click on the function name
   b. Go to "触发器配置" (Trigger Configuration) tab
   c. Click "创建触发器" (Create Trigger)
   d. Select "HTTP" as trigger type
   e. Configure the trigger:
      - **触发路径** (Trigger Path): Use function name (e.g., `/user-register`)
      - **鉴权** (Authentication): Choose "免鉴权" (No Auth Required) for public endpoints
      - Or use "需要鉴权" (Auth Required) if you want CloudBase auth
   f. Click "确定" (Confirm)

4. **Get the HTTP Access URLs**

   After creating triggers, you'll get URLs like:
   ```
   https://cloud1-1gjcyrdd7ab927c6-1387301748.ap-shanghai.app.tcloudbase.com/user-register
   https://cloud1-1gjcyrdd7ab927c6-1387301748.ap-shanghai.app.tcloudbase.com/user-login
   https://cloud1-1gjcyrdd7ab927c6-1387301748.ap-shanghai.app.tcloudbase.com/user-reset-password
   https://cloud1-1gjcyrdd7ab927c6-1387301748.ap-shanghai.app.tcloudbase.com/user-update-profile
   ```

5. **Verify the URLs match your .env configuration**

   Current .env setting:
   ```
   EXPO_PUBLIC_API_BASE_URL=https://cloud1-1gjcyrdd7ab927c6-1387301748.ap-shanghai.app.tcloudbase.com
   ```

## Alternative: Use tcb CLI (Interactive)

You can also try creating triggers interactively:

```bash
cd cloudbase
tcb functions:trigger:create user-register
tcb functions:trigger:create user-login
tcb functions:trigger:create user-reset-password
tcb functions:trigger:create user-update-profile
```

Follow the prompts to select HTTP trigger type and configure paths.

## Verify Setup

After adding triggers, verify with:

```bash
tcb functions:detail user-register
```

The "Triggers" field should no longer show "None".

## Test with curl

Test the endpoint directly:

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

Expected response:
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
