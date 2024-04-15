import request from "@/utils/auth-request.js";

// 查询部门列表
export function deptPageList(data) {
  return request({
    url: "/system/dept/list",
    method: "post",
    data,
  });
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return request({
    url: "/system/dept/list/exclude/" + deptId,
    method: "get",
  });
}

// 查询部门详细
export function getDept(deptId) {
  return request({
    url: "/system/dept/" + deptId,
    method: "get",
  });
}

// 查询部门下拉树结构
export function deptTreeSelect() {
  return request({
    url: "/system/dept/treeselect",
    method: "post",
  });
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
  return request({
    url: "/system/dept/roleDeptTreeselect/" + roleId,
    method: "get",
  });
}

// 新增部门
export function deptNewAdd(data) {
  return request({
    url: "/system/dept/add",
    method: "post",
    data: data,
  });
}

// 修改部门
export function deptUpdate(data) {
  return request({
    url: "/system/dept/update",
    method: "post",
    data: data,
  });
}

// 删除部门
export function deptRemove(deptId) {
  return request({
    url: "/system/dept/remove",
    method: "post",
    data: { id: deptId },
  });
}
