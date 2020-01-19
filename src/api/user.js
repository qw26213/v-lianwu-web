import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/operator/user/login.json',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/operator/user/userInfo.json',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getPermiss(){
  return request({
    url: '/operator/user/listPermission.json',
    method: 'get'
  })
}

export function getRoles(){
  return request({
    url: '/operator/user/listRole.json',
    method: 'get'
  })
}

export function getUser(data){
  return request({
    url: '/operator/user/listUser.json',
    method: 'get',
    params:data
  })
}

export function addRole(data){
  return request({
    url: '/operator/user/addRole.json',
    method: 'post',
    data
  })
}
export function updateRole(data){
  return request({
    url: '/operator/user/updateRole.json',
    method: 'post',
    data
  })
}

export function addUser(data){
  return request({
    url: '/operator/user/addUser.json',
    method: 'post',
    data
  })
}

export function updateUser(data){
  return request({
    url: '/operator/user/updateUser.json',
    method: 'post',
    data
  })
}

export function getMerchants(data){
  return request({
    url: '/operator/operation/listMerchant.json',
    method: 'get',
    params:data
  })
}

export function listMerchantAudit(data){
  return request({
    url: '/operator/operation/listMerchantAudit.json',
    method: 'get',
    params:data
  })
}

export function getDevices(data){
  return request({
    url: '/operator/operation/listDevice.json',
    method: 'get',
    params:data
  })
}

export function getIndustys(data){
  return request({
    url: '/merchant/op/listIndustry.json',
    method: 'get',
    params:data
  })
}

export function addMerchant(data){
  return request({
    url: '/operator/operation/addMerchant.json',
    method: 'post',
    data
  })
}

export function updateMerchant(data){
  return request({
    url: '/operator/operation/updateMerchant.json',
    method: 'post',
    data
  })
}

export function getMerchant(data){
  return request({
    url: '/operator/operation/getMerchant.json',
    method: 'get',
    params:data
  })
}

export function listUnbindDevice(data){
  return request({
    url: '/operator/operation/listUnbindDevice.json',
    method: 'get',
    params:data
  })
}
// 下载设备导入模板
export function downloadDeviceTemplate(data){
  return request({
    url: '/operator/operation/downloadDeviceTemplateUrl.json',
    method: 'get',
    params:data
  })
}

// 下载门店导入模板
export function downloadStoreTemplateUrl(data){
  return request({
    url: '/operator/operation/downloadStoreTemplateUrl.json',
    method: 'get',
    params:data
  })
}

// 设备导入
export function importDevice(data){
  return request({
    url: '/operator/operation/importDevice.json',
    method: 'post',
    data
  })
}

// 设备门店解绑
export function unBindDeviceFromStore(data){
  return request({
    url: '/operator/operation/unBindDeviceFromStore.json',
    method: 'get',
    params:data
  })
}

// 设备商户解绑
export function unBindDeviceFromMerchant(data){
  return request({
    url: '/operator/operation/unBindDeviceFromMerchant.json',
    method: 'get',
    params:data
  })
}
// 设备商户解绑
export function bindDevice(data){
  return request({
    url: '/operator/operation/bindDevice.json',
    method: 'post',
    data
  })
}
// 商户审核
export function merchantAudit(data){
  return request({
    url: '/operator/operation/merchantAudit.do',
    method: 'post',
    params:data
  })
}

// 商户审核详情
export function merchantAuditDetail(data){
  return request({
    url: '/operator/operation/merchantAuditDetail.json',
    method: 'get',
    params:data
  })
}

// 门店列表
export function listStore(data){
  return request({
    url: '/operator/operation/listStore.json',
    method: 'get',
    params:data
  })
}

// 门店详情
export function getStore(data){
  return request({
    url: '/operator/operation/getStore.json',
    method: 'get',
    params:data
  })
}

// 添加门店
export function addStore(data){
  return request({
    url: '/operator/operation/addStore.json',
    method: 'post',
    data
  })
}
// 修改门店
export function updateStore(data){
  return request({
    url: '/operator/operation/updateStore.json',
    method: 'post',
    data
  })
}

export function listStoreAudit(data){
  return request({
    url: '/operator/operation/listStoreAudit.json',
    method: 'get',
    params:data
  })
}

// 门店审核详情
export function storeAuditDetail(data){
  return request({
    url: '/operator/operation/storeAuditDetail.json',
    method: 'get',
    params:data
  })
}

// 审核门店
export function storeAudit(data){
  return request({
    url: '/operator/operation/storeAudit.do',
    method: 'post',
    params:data
  })
}

// 实名认证列表
export function listCertUser(data){
  return request({
    url: '/operator/operation/listCertUser.json',
    method: 'get',
    params:data
  })
}

// 实名认证审核
export function certUser(data){
  return request({
    url: '/operator/operation/certUser.do',
    method: 'post',
    params:data
  })
}

// 统一核销
export function listCheckData(data){
  return request({
    url: '/operator/unifyCoupon/listData.json',
    method: 'get',
    params:data
  })
}

// 报表导出
export function downloadData(data){
  return request({
    url: '/operator/unifyCoupon/downloadData.json',
    method: 'get',
    params:data
  })
}

// 修改密码
export function updatePassword(data){
  return request({
    url: '/operator/user/updatePassword.json',
    method: 'post',
    data
  })
}

// 修改密码
export function getScodeNum(data){
  return request({
    url: 'http://logserv.lianwuzizai.com/api/app-log/api/deviceLog/listScanLog',
    method: 'post',
    params:data
  })
}

export function getDeviceInfo(data){
  return request({
    url: '/operator/operation/deviceInfo.json',
    method: 'get',
    params:data
  })
}