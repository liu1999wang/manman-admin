<template>
  <div class="app-container">
    <el-header>
      <el-row :gutter="20">
        <el-col :span="3" :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
          <el-button type="danger" @click="delpermission">
            {{ $t('admin.permission.alldelete') }}
          </el-button>
        </el-col>
        <el-col :span="3" :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
          <el-input v-model="listQuery.per_name" :placeholder="$t('form.name')" @input="getList" />
        </el-col>
        <el-col :span="3" :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
          <el-button type="primary" @click="handleAddPermission">
            {{ $t('admin.permission.addpermission') }}
          </el-button>
        </el-col>
        <el-col :span="6" :offset="12" :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
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
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('admin.permission.name')">
        <template slot-scope="{row}">
          <span>{{ row.per_name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('admin.permission.url')">
        <template slot-scope="{row}">
          <span>{{ row.per_url }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" :label="$t('admin.permission.parent')">
        <template slot-scope="{row}">
          <span>{{ row.parent }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" :label="$t('admin.permission.show')" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.is_show | statusFilter">
            {{ row.is_show === 1 ? $t('admin.permission.show') : $t('admin.permission.hide') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('admin.permission.actions')" width="260">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEditPermission(row.id)">{{ $t('form.edit') }}</el-button>
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
      <el-form :model="permission" label-width="80px" label-position="left">
        <el-form-item :label="$t('form.name')">
          <el-input v-model="permission.per_name" />
        </el-form-item>
        <el-form-item :label="$t('admin.permission.url')">
          <el-input
            v-model="permission.per_url"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
          />
        </el-form-item>
        <el-form-item :label="$t('admin.permission.parent')">
          <el-select v-model="permission.parent" filterable :placeholder="$t('form.please_select')">
            <el-option key="0" label="0" value="0" />
            <el-option v-for="item in list" :key="item.value" :label="item.per_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('admin.permission.show')">
          <el-radio-group v-model="permission.is_show">
            <el-radio :label="1">{{ $t('admin.permission.show') }}</el-radio>
            <el-radio :label="0">{{ $t('admin.permission.hide') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          {{ $t('form.cancel') }}
        </el-button>
        <el-button v-if="dialogType=='admin.permission.addpermission'" type="primary" @click="addPermission">
          {{ $t('form.confirm') }}
        </el-button>
        <el-button v-if="dialogType=='admin.permission.editpermission'" type="primary" @click="editPermission">
          {{ $t('form.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, geteditPermission, addpermission, editpermission, delpermission } from '@/api/permission'

export default {
  name: 'InlineEditTable',
  filters: {
    statusFilter(statu) {
      return statu ? 'success' : 'info'
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
      permission: {},
      dialogVisible: false,
      dialogType: 'admin.permission.addpermission',
      multipleSelection: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await list(this.listQuery)
      this.list = data.data
      this.listQuery.total = data.total
      this.listQuery.last_page = data.last_page
      this.listLoading = false
    },
    async handleEditPermission(permission_id) {
      this.permission = (await geteditPermission(permission_id)).data
      this.dialogType = 'admin.permission.editpermission'
      this.dialogVisible = true
    },
    async handleAddPermission() {
      this.permission = {}
      this.dialogType = 'admin.permission.addpermission'
      this.dialogVisible = true
    },
    async addPermission() {
      const { message } = await addpermission(this.permission)
      this.$message({
        message: message,
        type: 'success'
      })
      this.permission = {}
      this.dialogVisible = false
      this.getList()
    },
    async editPermission() {
      const { message } = await editpermission(this.permission)
      this.$message({
        message: message,
        type: 'success'
      })
      this.permission = {}
      this.dialogVisible = false
      this.getList()
    },
    sizepage(val) {
      this.listQuery.limit = val
      this.getList()
    },
    currentpage(val) {
      this.listQuery.page = val
      this.getList()
    },
    clearSelection() {
      this.$refs.multipleTable.clearSelection()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    delpermission() {
      const ids = []
      const data = {}
      this.multipleSelection.map(v => {
        ids.push(v.id)
      })
      data.ids = ids.join(',')
      console.log(data)
      this.$confirm(this.$t('popup.deletetext'), this.$t('popup.hint'), {
        confirmButtonText: this.$t('popup.confirm'),
        cancelButtonText: this.$t('popup.cancel'),
        type: 'warning'
      }).then(async() => {
        const { message } = await delpermission(data)
        this.$message({
          type: 'success',
          message: message
        })
        this.getList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('popup.cancel')
        })
        this.getList()
      })
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
