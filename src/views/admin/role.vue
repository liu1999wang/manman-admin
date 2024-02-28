<template>
  <div class="app-container">
    <el-header>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-button type="primary" @click="handleAddRole">
            {{ $t('admin.role.addrole') }}
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

      <el-table-column width="180px" align="center" :label="$t('admin.role.name')">
        <template slot-scope="{row}">
          <span>{{ row.role_name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('admin.role.describe')">
        <template slot-scope="{row}">
          <span>{{ row.describe }}</span>
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
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEditRole(row.id)">{{ $t('form.edit') }}</el-button>
          <el-button :type="row.state | statusFilter" size="small" @click="alterState(row.id)">{{ row.state !== 1 ? $t('admin.role.normal') : $t('admin.role.disabled') }}</el-button>
          <el-button size="small" icon="el-icon-s-check" @click="handleEndowPermission(row.id)">{{ $t('form.accredit') }}</el-button>
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
      <el-tree v-if="dialogType==='admin.role.endowpermission'" ref="tree" :data="permissions" :default-checked-keys="role.permissions" :props="defaultProps" show-checkbox node-key="id" class="permission-tree" />
      <el-form v-else :model="role" label-width="80px" label-position="left">
        <el-form-item :label="$t('form.name')">
          <el-input v-model="role.role_name" />
        </el-form-item>
        <el-form-item :label="$t('form.describe')">
          <el-input
            v-model="role.describe"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          {{ $t('form.cancel') }}
        </el-button>
        <el-button v-if="dialogType=='admin.role.newrole'" type="primary" @click="addRole">
          {{ $t('form.confirm') }}
        </el-button>
        <el-button v-if="dialogType=='admin.role.editrole'" type="primary" @click="editRole">
          {{ $t('form.confirm') }}
        </el-button>
        <el-button v-else type="primary" @click="endowpermission">
          {{ $t('form.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getrolelist, addRole, alterState, editRole, geteditRole, endowpermission } from '@/api/role'
import { getpermissionlist } from '@/api/permission'
export default {
  name: 'InlineEditTable',
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
        limit: 10,
        total: 0
      },
      role: {},
      dialogType: '',
      dialogVisible: false,
      permissions: [{}],
      defaultProps: {
        children: 'children',
        label: 'per_name'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await getrolelist(this.listQuery)
      const items = data.data
      this.listQuery.total = data.total
      this.listQuery.last_page = data.last_page
      this.list = items.map(v => {
        v.role_permission = []
        for (let index = 0; index < v.role_permission.length; index++) {
          v.role_permission.push(v.role_permission[index].id)
        }
        return v
      })
      this.listLoading = false
    },
    handleAddRole() {
      this.role = {}
      this.dialogType = 'admin.role.newrole'
      this.dialogVisible = true
    },
    async handleEditRole(role_id) {
      this.role = (await geteditRole(role_id)).data
      // console.log(this.role)
      this.dialogType = 'admin.role.editrole'
      this.dialogVisible = true
    },
    async handleEndowPermission(role_id) {
      this.role = await this.geteditRole(role_id)
      await this.getPermissionlist()
      this.dialogType = 'admin.role.endowpermission'
      this.dialogVisible = true
      // console.log(this.role, this.permissions)
    },
    async geteditRole(role_id) {
      const { data } = await geteditRole(role_id)
      data.permissions = []
      for (let index = 0; index < data.role_permission.length; index++) {
        data.permissions.push(data.role_permission[index].id)
      }
      return data
    },
    async getPermissionlist() {
      const { data } = await getpermissionlist()
      this.permissions = data
    },
    async addRole() {
      const { message } = await addRole(this.role)
      this.$message({
        message: message,
        type: 'success'
      })
      this.role = {}
      this.dialogVisible = false
      this.getList()
    },
    async editRole() {
      const { message } = await editRole(this.role)
      this.$message({
        message: message,
        type: 'success'
      })
      this.role = {}
      this.dialogVisible = false
      this.getList()
    },
    async endowpermission() {
      const roles_permissions = []
      roles_permissions['id'] = this.role.id
      roles_permissions['per_ids'] = this.$refs.tree.getCheckedKeys()
      const { message } = await endowpermission(roles_permissions)
      this.$message({
        message: message,
        type: 'success'
      })
      this.dialogVisible = false
    },
    async alterState(role_id) {
      const { message } = await alterState(role_id)
      this.$message({
        message: message,
        type: 'success'
      })
      this.getList()
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
.el-header{
  padding: 0 0px;
}
.pagination{
  margin: 10px 0;
}
</style>
