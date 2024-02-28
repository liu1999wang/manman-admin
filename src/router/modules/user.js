/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const userRouter = {
  path: '/user',
  component: Layout,
  redirect: '/user/list',
  name: 'User',
  meta: {
    title: 'user',
    icon: 'peoples'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/user/list'),
      name: 'list',
      meta: { title: 'userlist' }
    },
    {
      path: 'moneys_statement',
      component: () => import('@/views/user/money_statement'),
      namr: 'moneysstatement',
      meta: { title: 'moneysstatement' }
    }
  ]
}
export default userRouter
