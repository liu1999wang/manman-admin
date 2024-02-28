/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const adminRouter = {
  path: '/admin',
  component: Layout,
  redirect: '/admin/list',
  name: 'Admin',
  meta: {
    title: 'admin',
    icon: 'peoples'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/admin/list'),
      name: 'list',
      meta: { title: 'adminlist' }
    },
    {
      path: 'role',
      component: () => import('@/views/admin/role'),
      name: 'role',
      meta: { title: 'adminrole' }
    },
    {
      path: 'permission',
      component: () => import('@/views/admin/permission'),
      name: 'permission',
      meta: { title: 'adminpermission' }
    }
  ]
}
export default adminRouter
