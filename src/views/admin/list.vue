<template>
  <div class="app-container">
    <el-header>
      <el-row :gutter="20">
        <el-col :span="3" :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
          <el-input v-model="listQuery.user_name" :placeholder="$t('form.name')" @input="getList" />
        </el-col>
        <el-col :span="3" :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
          <el-input v-model="listQuery.email" :placeholder="$t('form.email')" @input="getList" />
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="handleAddAdmin">
            {{ $t('admin.list.addadmin') }}
          </el-button>
        </el-col>
        <el-col :span="6" :offset="6" :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
          <el-pagination
            :current-page="listQuery.page"
            :page-sizes="[20, 50, 100, 500]"
            :page-size="listQuery.limit"
            layout="prev, pager, next, total"
            :total="listQuery.total"
            @size-change="sizepage"
            @current-change="currentpage"
          />
        </el-col>
      </el-row>
    </el-header>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="50px" align="center" :label="$t('admin.list.head_img')">
        <template slot-scope="{row}">
          <img :src="row.head_img" class="user-avatar">
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('admin.list.user_name')">
        <template slot-scope="{row}">
          <span>{{ row.user_name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('admin.list.email')">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('admin.list.ip')">
        <template slot-scope="{row}">
          <span>{{ row.ip }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" :label="$t('admin.list.address')">
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" :label="$t('admin.list.creation_time')">
        <template slot-scope="{row}">
          <span>{{ row.creation_time }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" :label="$t('admin.list.updata_time')">
        <template slot-scope="{row}">
          <span>{{ row.updata_time }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" :label="$t('admin.list.lately_time')">
        <template slot-scope="{row}">
          <span>{{ row.lately_time | activetime }}{{ $t(row.timesymbol) }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" :label="$t('admin.list.status')" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.state | statusFilter">
            {{ row.state === 1 ? $t('admin.list.normal') : $t('admin.list.disabled') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('admin.list.actions')" width="260">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEditAdmin(row.id)">{{ $t('form.edit') }}</el-button>
          <el-button :type="row.state | statusFilter" size="small" @click="alterState(row.id)">{{ row.state !== 1 ? $t('admin.list.normal') : $t('admin.list.disabled') }}</el-button>
          <el-button size="small" icon="el-icon-s-check" @click="handleEndowRole(row.id)">{{ $t('form.endow') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      :current-page="listQuery.page"
      :page-sizes="[20, 50, 100, 500]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="sizepage"
      @current-change="currentpage"
    />
    <el-dialog :visible.sync="dialogVisible" :title="$t(dialogType)">
      <el-checkbox-group v-if="dialogType==='admin.list.endowrole'" v-model="admin.roles">
        <el-checkbox-button v-for="role in roles" :key="role.id" :label="role.id">{{ role.role_name }}</el-checkbox-button>
      </el-checkbox-group>
      <el-form v-else :model="admin" label-width="80px" label-position="left">
        <el-form-item :label="$t('form.name')">
          <el-input v-model="admin.user_name" />
        </el-form-item>
        <el-form-item v-if="dialogType=='admin.list.newadmin'" :label="$t('form.password')">
          <el-input v-model="admin.user_pass" />
        </el-form-item>
        <el-form-item v-else :label="$t('form.head_img')">
          <el-upload
            class="avatar-uploader"
            name="head_img"
            :action="update_url"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="admin.head_img" :src="admin.head_img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('form.email')">
          <el-input v-model="admin.email" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible = false">
          {{ $t('form.cancel') }}
        </el-button>
        <el-button v-if="dialogType=='admin.list.newadmin'" type="primary" @click="addUser">
          {{ $t('form.confirm') }}
        </el-button>
        <el-button v-else-if="dialogType=='admin.list.editadmin'" type="primary" @click="editUser">
          {{ $t('form.confirm') }}
        </el-button>
        <el-button v-else type="primary" @click="endowrole">
          {{ $t('form.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getuserlist, addUser, alterState, editUser, geteditUser, endowrole } from '@/api/admin'
import { getrolelist } from '@/api/role'
import { getToken } from '@/utils/auth'
export default {
  name: 'AdminList',
  filters: {
    statusFilter(statu) {
      return statu ? 'success' : 'warning'
    },
    stateName(statu) {
      if (statu === 1) {
        return 'disabled'
      }
      return 'normal'
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0
      },
      dialogVisible: false,
      dialogType: 'admin.list.newadmin',
      admin: {},
      updata_url: '',
      headers: {},
      roles: []
    }
  },
  created() {
    this.getList()
    this.update_url = process.env.VUE_APP_BASE_API + 'admin/update'
    this.headers = { 'X-Token': getToken() }
    this.getrolelist()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await getuserlist(this.listQuery)
      const items = data.data
      this.listQuery.total = data.total
      this.listQuery.last_page = data.last_page
      this.list = items.map(v => {
        v.timesymbol = this.$options.filters['timesymbol'](v.lately_time)
        v.roles = []
        for (let index = 0; index < v.admin_role.length; index++) {
          v.roles.push(v.admin_role[index].id)
        }
        return v
      })
      this.listLoading = false
    },
    handleAddAdmin() {
      this.dialogType = 'admin.list.newadmin'
      this.dialogVisible = true
    },
    async handleEditAdmin(admin_id) {
      this.admin = await this.geteditUser(admin_id)
      this.dialogType = 'admin.list.editadmin'
      this.dialogVisible = true
    },
    async geteditUser(admin_id) {
      const { data } = await geteditUser(admin_id)
      data.roles = []
      if (data.admin_role.length) {
        for (let index = 0; index < data.admin_role.length; index++) {
          data.roles.push(data.admin_role[index].id)
        }
      }
      return data
    },
    async handleEndowRole(admin_id) {
      this.getrolelist()
      this.admin = await this.geteditUser(admin_id)
      this.dialogType = 'admin.list.endowrole'
      this.dialogVisible = true
      // console.log(this.admin, 'handleEndowRole')
    },
    async getrolelist() {
      const { data } = await getrolelist()
      this.roles = data.data
    },
    async alterState(admin_id) {
      const { message } = await alterState(admin_id)
      this.$message({
        message: message,
        type: 'success'
      })
      this.getList()
    },
    async addUser() {
      const { message } = await addUser(this.admin)
      this.$message({
        message: message,
        type: 'success'
      })
      this.admin = {}
      this.dialogVisible = false
      this.getList()
    },
    async editUser() {
      const { message } = await editUser(this.admin)
      this.$message({
        message: message,
        type: 'success'
      })
      this.admin = {}
      this.dialogVisible = false
    },
    async endowrole() {
      const admin_roles = []
      admin_roles['id'] = this.admin.id
      admin_roles['role_ids'] = this.admin.roles
      const { message } = await endowrole(admin_roles)
      // console.log(data, 'data', admin_roles)
      this.$message({
        message: message,
        type: 'success'
      })
      this.dialogVisible = false
    },
    handleAvatarSuccess(res, file) {
      const { message } = res
      this.$message({
        message: message,
        type: 'success'
      })
      this.admin.head_img = res.data.path
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
    sizepage(val) {
      this.listQuery.limit = val
      this.getList()
    },
    currentpage(val) {
      this.listQuery.page = val
      this.getList()
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.user-avatar{
    width: 100%;
    height: auto;
    border-radius: 50%;
}
.el-header{
  padding: 0 0px;
}
.avatar{
  width: 100px;
}
.pagination{
  margin: 10px 0;
}
</style>
