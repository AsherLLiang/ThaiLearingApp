# CloudBase Setup Guide

## Issue: HTTPService Not Activated

### Error Message
```
{
  "code": "HTTPSERVICE_NONACTIVATED",
  "message": "HTTPService is not activated"
}
```

### Root Cause
The Tencent CloudBase HTTP Service is not activated for your environment. This service is required to access cloud functions via HTTP requests.

### Solution Steps

1. **Login to CloudBase Console**
   - Visit: https://console.cloud.tencent.com/tcb
   - Select environment: `cloud1-1gjcyrdd7ab927c6`

2. **Activate HTTP Service**
   - Navigate to "云函数" (Cloud Functions) in the left menu
   - Find "HTTP 访问服务" (HTTP Access Service)
   - Click to activate the service
   - Follow the prompts to complete activation

3. **Configure HTTP Access**
   - After activation, configure the access path
   - Set appropriate permissions (authentication required/public access)
   - Note the HTTP trigger URL format

4. **Verify the Service**
   - After activation, test the registration function again
   - Check the console logs for successful requests

### Alternative: Use CloudBase Native SDK

If you don't want to use HTTP Service, you can use the CloudBase native SDK instead:

**Pros:**
- No need to activate HTTP Service
- More integrated with CloudBase features
- Better for WeChat Mini Programs

**Cons:**
- Requires significant code changes
- Different architecture pattern

### Current Configuration

**Environment ID:** `cloud1-1gjcyrdd7ab927c6`
**Region:** `ap-shanghai`
**API Base URL:** `https://cloud1-1gjcyrdd7ab927c6.service.tcloudbase.com`

### Cloud Functions Deployed

- `user-register` - User registration
- `user-login` - User authentication
- `user-reset-password` - Password reset
- `user-update-profile` - Profile updates

### Next Steps

1. ✅ Activate HTTP Service in CloudBase console
2. Test registration again
3. If successful, proceed with other features
4. If issues persist, check cloud function logs in the console

### Support Links

- [CloudBase Error Codes](https://docs.cloudbase.net/error-code/service)
- [HTTP Service Documentation](https://docs.cloudbase.net/http-service/)
- [Cloud Functions Guide](https://docs.cloudbase.net/cloud-function/)
