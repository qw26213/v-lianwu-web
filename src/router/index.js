import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
var payUrl = process.env.VUE_APP_PAY_CONFIG_URL;
/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path*',
    component: () => import('@/views/redirect/index')
  }]
}, {
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
}, {
  path: '/404',
  component: () => import('@/views/error-page/404'),
  hidden: true
}, {
  path: '/401',
  component: () => import('@/views/error-page/401'),
  hidden: true
}, {
  path: '/',
  component: Layout,
  redirect: '/home',
  children: [{
    path: 'home',
    component: () => import('@/views/home/index'),
    name: 'home',
    meta: { title: '主页', icon: 'home', affix: true }
  }]
}]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [{
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [{
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },{
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
        }
      },{
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }
    ]
  },{
    path: '/merchant',
    component: Layout,
    redirect: '/merchant/merchantList',
    alwaysShow: true,
    name: 'merchant',
    meta: {
      title: '商户管理',
      icon: 'table',
      roles: ['C01', 'C0101', 'C010101', 'C010102', 'C010103', 'C010104', 'C010105', 'C010106']
    },
    children: [{
      path: 'merchantList',
      component: () => import('@/views/merchant/list'),
      name: 'merchantList',
      meta: {
        noCache: true,
        title: '商户列表',
        roles: ['C0101', 'C010101', 'C010102', 'C010103', 'C010104', 'C010105', 'C010106']
      }
    },{
      path: 'merchantCheck',
      component: () => import('@/views/merchant/check'),
      name: 'merchantCheck',
      meta: {
        noCache: true,
        title: '商户审核',
        roles: ['C0102', 'C010201', 'C010202']
      }
    },{
      path: '/storeCheck',
      component: () => import('@/views/merchant/storeCheck'),
      name: 'merchantStoreCheck',
      meta: {
        noCache: true,
        title: '门店审核',
        roles: ['C0103', 'C010301', 'C010302']
      }
    },{
      path: 'merchantCertify',
      component: () => import('@/views/merchant/certify'),
      name: 'merchantCertify',
      meta: {
        noCache: true,
        title: '用户实名审核',
        roles: ['C0104', 'C010401', 'C010402']
      }
    },{
      path: '/merchantAdd',
      component: () => import('@/views/merchant/add'),
      name: 'merchantAdd',
      hidden: true,
      meta: {
        title: '新建商户'
      }
    },{
      path: '/merchantModify',
      component: () => import('@/views/merchant/add'),
      name: 'merchantModify',
      hidden: true,
      meta: {
        title: '修改商户'
      }
    },{
      path: '/merchantAudit',
      component: () => import('@/views/merchant/audit'),
      name: 'merchantAudit',
      hidden: true,
      meta: {
        title: '审核商户'
      }
    },{
      path: '/storeAudit',
      component: () => import('@/views/merchant/storeAudit'),
      name: 'storeAudit',
      hidden: true,
      meta: {
        title: '审核门店'
      }
    },{
      path: '/merchantStores',
      component: () => import('@/views/merchant/storelist'),
      name: 'merchantStores',
      hidden: true,
      meta: {
        noCache: true,
        title: '门店管理'
      }
    },{
      path: '/merchantStoreAdd',
      component: () => import('@/views/merchant/storeAdd'),
      name: 'merchantStoreAdd',
      hidden: true,
      meta: {
        title: '新增门店'
      }
    },{
      path: '/merchantStoreModify',
      component: () => import('@/views/merchant/storeAdd'),
      name: 'merchantStoreAdd',
      hidden: true,
      meta: {
        title: '修改门店'
      }
    }]
  }, {
    path: '/device',
    component: Layout,
    redirect: '/device/deviceList',
    name: 'device',
    meta: {
      title: '设备管理',
      icon: 'device',
      roles: ['C02', 'C0201', 'C0202', 'C020101', 'C020102', 'C020103', 'C020201']
    },
    children: [{
      path: '/deviceList',
      component: () => import('@/views/device/list'),
      name: 'deviceList',
      meta: {
        noCache: true,
        title: '设备列表',
        roles: ['C0201', 'C020101', 'C020102', 'C020103']
      }
    }, {
      path: '/deviceListing',
      component: () => import('@/views/device/listing'),
      name: 'deviceListing',
      meta: {
        title: '申请记录',
        roles: ['C020101']
      }
    },{
      path: '/deviceDetail',
      component: () => import('@/views/device/detail'),
      name: 'deviceDetail',
      hidden: true,
      meta: {
        title: '设备详情',
        roles: ['C0201', 'C020101', 'C020102', 'C020103']
      }
    }]
  }, {
    path: '/checkData',
    component: Layout,
    redirect: '/check/data',
    name: 'check',
    meta: {
      title: '数据报表',
      icon: 'chart',
      roles: ['C03', 'C0301', 'C030101']
    },
    children: [{
      path: 'checkOrder',
      component: () => import('@/views/check/data'),
      name: 'checkOrder',
      meta: { title: '统一核销', roles: ['C030101'] }
    }]
  },{
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: payUrl,
        meta: { title: '支付配置', icon: 'money', roles: ['C05'] }
      }
    ]
  }, {
    path: '/user',
    component: Layout,
    redirect: '/user/userList',
    name: 'user',
    meta: {
      title: '用户管理',
      icon: 'peoples',
      roles: ['C04', 'C0401', 'C0402', 'C040101', 'C040102', 'C040103', 'C040201', 'C040202']
    },
    children: [{
      path: 'userList',
      component: () => import('@/views/user/list'),
      name: 'userList',
      meta: {
        noCache: true,
        title: '用户列表',
        roles: ['C0401', 'C040101', 'C040102', 'C040103']
      }
    }, {
      path: 'userRole',
      component: () => import('@/views/user/role'),
      name: 'userRole',
      meta: {
        noCache: true,
        title: '权限管理',
        roles: ['C0402', 'C040201', 'C040202','C040203']
      }
    },{
      path: '/roleAdd',
      component: () => import('@/views/user/add'),
      name: 'roleAdd',
      hidden: true,
      meta: {
        title: '新建权限'
      }
    },{
      path: '/roleModify',
      component: () => import('@/views/user/add'),
      name: 'roleModify',
      hidden: true,
      meta: {
        noCache: true,
        title: '修改权限'
      }
    }]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
