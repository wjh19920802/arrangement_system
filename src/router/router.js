import Main from '@/views/Main.vue';
import Cookies from "js-cookie";

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['@/views/login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => { require(['@//views/error-page/403.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => { require(['@/views/error-page/500.vue'], resolve); }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: '首页', name: 'home_index', component: resolve => { require(['@/views/home/home.vue'], resolve); } },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: resolve => { require(['@/views/own-space/own-space.vue'], resolve); } },
        { path: 'message', title: '消息中心', name: 'message_index', component: resolve => { require(['@/views/message/message.vue'], resolve); } },
        { path: '/notice/noticeDetail/:id', title: '公告详情', name: 'notice_detail', component: resolve => { require(['@/views/lesson-plan/notice_detail.vue'], resolve); } },
        { path: '/lesson/listDetail/:id', title: '列表详情', name: 'lesson_listDetail', component: resolve => { require(['@/views/lesson-plan/lesson_listDetail.vue'], resolve); } },
        { path: '/lesson/applyDetail/:id', title: '申请详情', name: 'lesson_applyDetail', component: resolve => { require(['@/views/lesson-plan/lesson_applyDetail.vue'], resolve); } },
        { path: '/lesson/examineDetail/:id', title: '审核详情', name: 'lesson_examineDetail', component: resolve => { require(['@/views/lesson-plan/lesson_examineDetail.vue'], resolve); } },
        { path: '/lesson/planDetail/:id', title: '课程规划详情', name: 'lesson_planDetail', component: resolve => { require(['@/views/lesson-plan/lesson_planDetail.vue'], resolve); } },
        { path: '/template/planDetail/:id', title: '母版规划详情', name: 'template_planDetail', component: resolve => { require(['@/views/lesson-plan/template_planDetail.vue'], resolve); } },
        { path: '/lesson/confirmDetail/:id', title: '确认详情', name: 'lesson_confirmDetail', component: resolve => { require(['@/views/lesson-plan/lesson_confirmDetail.vue'], resolve); } },
        { path: '/lesson/applyErpDetail/:id', title: '班次详情', name: 'lesson_erpDetail', component: resolve => { require(['@/views/lesson-plan/lesson_applyErpDetail.vue'], resolve); } },
        { path: '/lesson/addErp', title: '添加Erp', name: 'lesson_addErp', component: resolve => { require(['@/views/lesson-plan/lesson_addErp.vue'], resolve); } },
        { path: '/teachers/detail', title: '档案详情', name: 'teacher_detail', component: resolve => { require(['@/views/teacher-manage/detail.vue'], resolve); } },
        { path: '/teacher_apply/applyDetail', title: '确认详情', name: 'apply_detail', component: resolve => { require(['@/views/teacher-apply/apply_detail.vue'], resolve); } },
        { path: '/arrange/arrange', title: '排课', name: 'arrange_lesson', component: resolve => { require(['@/views/arrange/arrange.vue'], resolve); } },
        { path: '/role/role_edit', title: '修改权限', name: 'role_edit', component: resolve => { require(['@/views/system-setting/role_edit.vue'], resolve);} },
        { path: '/add/:id', title: '母版添加', name: 'template_add', component: resolve => { require(['@/views/lesson-plan/template_add.vue'], resolve); } },
        { path: '/role/role_edit', title: '修改角色默认权限', name: 'role_edit', component: resolve => { require(['@/views/system-setting/role_edit.vue'], resolve);} },
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
// path、title --- 二级|三级标题
// icon --- 图标
// name --- 对应页面跳转 todo:与 文件名 保持一致
// 一级标题 --- 文件夹  二级标题|三级标题 --- notice_add
// parent --- 对应的一级标题的index （可优化）
export let baseRouter = [
    /*{
      path: '/access',
      icon: 'key',
      name: 'access',
      title: '权限管理',
      parent: 0,
      component: Main,
      children: [
        { path: 'index', title: '权限管理', name: 'access_index', component: resolve => { require(['@/views/lesson-plan/access_test.vue'], resolve); }}
      ]
    },*/
    {
      path: '/notice',
      icon: 'heart',
      name: 'notice',
      title: '公告相关',
      parent: 1,
      access:1,
      component: Main,
      children: [
        { path: 'add', title: '公告添加',access:1,name: 'notice_add', component: resolve => { require(['@/views/lesson-plan/notice_add.vue'], resolve); } },
        { path: 'manage', title: '公告列表',access:1,name: 'notice_manage', child:['notice_detail'], component: resolve => { require(['@/views/lesson-plan/notice_manage.vue'], resolve); } },
      ]
    },
    {
      path: '/lesson',
      icon: 'ionic',
      name: 'lesson',
      title: '课程相关',
      parent: 1,
      access:1,
      component: Main,
      children: [
        { path: 'manage', title: '课程列表',access:1,name: 'lesson_manage', child:['lesson_listDetail'], component: resolve => { require(['@/views/lesson-plan/lesson_manage.vue'], resolve); } },
        { path: 'apply', title: '课程申请', access:1,name: 'lesson_apply', child:['lesson_applyDetail'], component: resolve => { require(['@/views/lesson-plan/lesson_apply.vue'], resolve); } },
        { path: 'examine', title: '课程审核', access:1,name: 'lesson_examine', child:['lesson_examineDetail'], component: resolve => { require(['@/views/lesson-plan/lesson_examine.vue'], resolve); } },
        { path: 'plan', title: '课程规划',access:1, name: 'lesson_plan', child:['lesson_planDetail'], component: resolve => { require(['@/views/lesson-plan/lesson_plan.vue'], resolve); } },
        { path: 'confirm', title: '课程确认', access:1,name: 'lesson_confirm', child:['lesson_confirmDetail'], component: resolve => { require(['@/views/lesson-plan/lesson_confirm.vue'], resolve); } },
        { path: 'classes-apply', title: '班次申请',access:1, name: 'classes_apply', child:['lesson_erpDetail', 'lesson_addErp'], component: resolve => { require(['@/views/lesson-plan/class_apply.vue'], resolve); } },
      ]
    },
    {
        path: '/template',
        icon: 'ios-pricetag',
        name: 'template',
        title: '母版管理',
        parent: 1,
        access:1,
        component: Main,
        children: [
            // { path: 'add', title: '母版添加', name: 'template_add', component: resolve => { require(['@/views/lesson-plan/template_add.vue'], resolve); } },
            { path: 'manage', title: '母版管理',access:1, name: 'template_manage', child:['template_add'], component: resolve => { require(['@/views/lesson-plan/template_manage.vue'], resolve); } },
            { path: 'plan', title: '母版规划',access:1, name: 'template_plan', component: resolve => { require(['@/views/lesson-plan/template_plan.vue'], resolve); } },
        ]
    },
    {
      path: '/teacher/manage',
      icon: 'person-stalker',
      name: 'teachers_manage',
      title: '师资列表',
      parent: 2,
      access:1,
      component: Main,
      children: [
        { path: 'teachers_manage_index', title: '师资列表', access:1,name: 'teacher_manage_index', child:['teacher_detail'], component: resolve => { require(['@/views/teacher-manage/manage.vue'], resolve); } },
      ]
    },
    {
      path: '/teacher/add',
      icon: 'person-add',
      name: 'teachers_add',
      title: '添加师资',
      parent: 2,
      component: Main,
      children: [
        { path: 'teachers_add_index', title: '添加师资', access:1,name: 'teacher_add_index', component: resolve => { require(['@/views/teacher-manage/add.vue'], resolve); } },
      ]
    },
    {
      path: '/teacher_apply/unfinished',
      icon: 'ios-paper-outline',
      name: 'teacher_apply_unfinished',
      title: '未申请',
      parent: 3,
      access:1,
      component: Main,
      children: [
        { path: 'teacher_apply_unfinished_index', title: '未申请', access:1,name: 'teacher_unfinished_index', component: resolve => { require(['@/views/teacher-apply/unfinished.vue'], resolve); } },
      ]
    },
    {
      path: '/teacher_apply/draft',
      icon: 'ios-box-outline',
      name: 'teacher_apply_draft',
      title: '待定课程',
      parent: 3,
      access:1,
      component: Main,
      children: [
        { path: 'teacher_apply_draft_index', title: '待定课程', access:1,name: 'teacher_draft_index', component: resolve => { require(['@/views/teacher-apply/draft.vue'], resolve); } },
      ]
    },
    {
      path: '/teacher_apply/passed',
      icon: 'ios-flag-outline',
      name: 'teacher_apply_passed',
      title: '已申请',
      parent: 3,
      access:1,
      component: Main,
      children: [
        { path: 'teacher_apply_passed_index', title: '已申请',access:1, name: 'teacher_passed_index', component: resolve => { require(['@/views/teacher-apply/passed.vue'], resolve); } },
      ]
    },
    {
      path: '/teacher_apply/rejected',
      icon: 'ios-undo-outline',
      name: 'teacher_apply_rejected',
      title: '已驳回',
      parent: 3,
      access:1,
      component: Main,
      children: [
        { path: 'teacher_apply_rejected_index', title: '已驳回',access:1, name: 'teacher_rejected_index', component: resolve => { require(['@/views/teacher-apply/rejected.vue'], resolve); } },
      ]
    },
    {
      path: '/teacher_apply/canceled',
      icon: 'ios-trash-outline',
      name: 'teacher_apply_canceled',
      title: '已取消',
      parent: 3,
      access:1,
      component: Main,
      children: [
        { path: 'teacher_apply_canceled_index', title: '已取消',access:1, name: 'teacher_canceled_index', component: resolve => { require(['@/views/teacher-apply/canceled.vue'], resolve); } },
      ]
    },
    {
      path: '/arrange/unarrange',
      icon: 'radio-waves',
      name: 'arrangement_unarrange',
      title: '待排课',
      parent: 4,
      access:1,
      component: Main,
      children: [
        { path: 'student', title: '学员课程',access:1,name: 'unarrange_student', child:['arrange_lesson'], component: resolve => { require(['@/views/arrange/unarrangeStudent.vue'], resolve); } },
        //{ path: 'teacher', title: '师资培训',access:1, name: 'unarrange_teacher', component: resolve => { require(['@/views/arrange/unarrangeTeacher.vue'], resolve); } },
      ]
    },
    {
      path: '/arrange/examine',
      icon: 'ios-search-strong',
      name: 'arrangement_examine',
      title: '省级排课审核',
      parent: 4,
      access:1,
      component: Main,
      children: [
        { path: 'arrangement_examine_index', title: '省级排课审核',access:1, name: 'arrange_examine_index', component: resolve => { require(['@/views/arrange/arrange_examine.vue'], resolve); } },
      ]
    },
    {
      path: '/arrange/arranged',
      icon: 'checkmark',
      name: 'arrangement_arranged',
      title: '已排课',
      parent: 4,
      access:1,
      component: Main,
      children: [
        { path: 'arrangement_arranged_index', title: '已排课', access:1,name: 'arrange_arranged_index', component: resolve => { require(['@/views/arrange/arranged.vue'], resolve); } },
      ]
    },
    {
      path: '/arrange/path',
      icon: 'pin',
      name: 'arrangement_path',
      title: '排课进度查询',
      parent: 4,
      access:1,
      component: Main,
      children: [
        { path: 'arrangement_path_index', title: '排课进度查询',access:1, name: 'arrange_path_index', component: resolve => { require(['@/views/arrange/arranged_path.vue'], resolve); } },
      ]
    },
    {
      path: '/role',
      icon: 'person',
      name: 'role',
      title: '角色管理',
      parent: 8,
      access:1,
      component: Main,
      children: [
        { path: 'role_list', title: '角色列表', name: 'role_list', component: resolve => { require(['@/views/system-setting/role_list.vue'], resolve);} },
        { path: 'role_set', title: '分配角色',access:1, name: 'role_set', component: resolve => { require(['@/views/system-setting/role_set.vue'], resolve);} },
        // { path: 'role_member', title: '角色人员列表', name: 'role_member', component: resolve => { require(['@/views/system-setting/role_member.vue'], resolve);} }
      ]
    }
];

let currentMenu = parseInt(localStorage.getItem('currentMenu')) || 0;
let menuList = JSON.parse(localStorage.getItem('menuList'));
let access = +Cookies.get('access');
export let appRouter = baseRouter.filter((item, index) => {
  // if(item.parent == currentMenu && item.access.indexOf(access) >= 0 ) return item
  // let hasAccess = function () {
  //   if(Util.showThisRoute(item.access, access) || item.access === undefined){return true}
  //   else if()
  // }
  if(item.parent  == currentMenu) {    //获取当前点击的一级菜单下所有的二级菜单
    JSON.parse(localStorage.getItem('secondMenuList')).forEach((item1)=>{    //遍历有权限的二级菜单
      if(item1.parentId == item.parent && item1.permissionCode == item.name) {
        item.access = 0;
        item1.menus.forEach((item3)=>{
          item.children.forEach((item4)=>{
            if(item3.permissionCode == item4.name) {
              item4.access = 0;
            }
          })
        })
      }
    })
    console.log(item)
    return item
  }
})

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    ...appRouter,
    ...baseRouter,
    page500,
    page403,
    page404
];
