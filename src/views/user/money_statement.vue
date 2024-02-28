<template>
  <div class="app-container">
    <el-header>
      <el-row :gutter="20">
        <el-col :span="3" :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
          <el-input v-model="listQuery.user_name" :placeholder="$t('form.name')" @input="getList" />
        </el-col>
        <el-col :span="3" :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
          <el-input v-model="listQuery.phone" :placeholder="$t('form.phone')" @input="getList" />
        </el-col>
        <el-col :span="3" :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
          <el-input v-model="listQuery.email" :placeholder="$t('form.email')" @input="getList" />
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="handleadd">
            {{ $t('user.list.adduser') }}
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
    <el-main>
      <el-tabs v-model="listQuery.type" @tab-click="getList">
        <el-tab-pane :label="$t('table.common')" name="1" />
        <el-tab-pane :label="$t('table.vip')" name="2" />
        <el-tab-pane :label="$t('table.virtual')" name="3" />
      </el-tabs>
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="ID" width="80">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column width="50px" align="center" :label="$t('table.head_img')">
          <template slot-scope="{row}">
            <img :src="row.headimg" class="user-avatar">
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.name')">
          <template slot-scope="{row}">
            <span>{{ row.user_name }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.phone')">
          <template slot-scope="{row}">
            <span>{{ row.phone }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.email')">
          <template slot-scope="{row}">
            <span>{{ row.email }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.money')">
          <template slot-scope="{row}">
            <span>{{ row.moneys.money }} <el-link type="primary" @click="editmoney(row.id)">{{ $t('table.revamp') }}</el-link></span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.integral')">
          <template slot-scope="{row}">
            <span>{{ row.moneys.integral }} <el-link type="primary" @click="editintegral(row.id)">{{ $t('table.revamp') }}</el-link></span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.ip')">
          <template slot-scope="{row}">
            <span>{{ row.ip }}</span>
          </template>
        </el-table-column>

        <el-table-column width="120px" align="center" :label="$t('table.address')">
          <template slot-scope="{row}">
            <span>{{ row.address }}</span>
          </template>
        </el-table-column>

        <el-table-column width="180px" align="center" :label="$t('table.creation_time')">
          <template slot-scope="{row}">
            <span>{{ row.creation_time }}</span>
          </template>
        </el-table-column>

        <el-table-column width="180px" align="center" :label="$t('table.updata_time')">
          <template slot-scope="{row}">
            <span>{{ row.updata_time }}</span>
          </template>
        </el-table-column>

        <el-table-column width="180px" align="center" :label="$t('table.lately_time')">
          <template slot-scope="{row}">
            <span>{{ row.last_active_at | activetime }}{{ $t(row.timesymbol) }}</span>
          </template>
        </el-table-column>

        <el-table-column class-name="status-col" :label="$t('table.status')" width="110">
          <template slot-scope="{row}">
            <el-tag :type="row.state | statusFilter">
              {{ row.state === 1 ? $t('table.normal') : $t('table.disabled') }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.actions')" width="260">
          <template slot-scope="{row}">
            <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEdit(row.id)">{{ $t('table.edit') }}</el-button>
            <el-button :type="row.state | statusFilter" size="small" @click="alterState(row.id)">{{ row.state !== 1 ? $t('table.normal') : $t('table.disabled') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

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
      <form-create v-model="fApi" :rule="rule" :value.sync="value" :option="option" />
    </el-dialog>
  </div>
</template>

<script>
import { getuserlist, addUser, geteditUser, editUser, alterState, editIntegral, editMoney } from '@/api/user'
import { getToken } from '@/utils/auth'
export default {
  name: 'Moneystatement',
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
        total: 0,
        type: '1'
      },
      dialogVisible: false,
      dialogType: 'user.list.adduser',
      updata_url: '',
      headers: {},
      fApi: {},
      value: {},
      rule: [],
      option: {
        form: {
          labelWidth: 'auto'
        },
        resetBtn: true
      }
    }
  },
  created() {
    this.getList()
    this.update_url = process.env.VUE_APP_BASE_API + 'admin/update'
    this.headers = { 'X-Token': getToken() }
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await getuserlist(this.listQuery)
      const items = data.data
      this.listQuery.total = data.total
      this.listQuery.last_page = data.last_page
      this.list = items.map(v => {
        v.timesymbol = this.$options.filters['timesymbol'](v.last_active_at)
        return v
      })
      console.log('this.list', this.list)
      this.listLoading = false
    },
    handleadd() {
      this.dialogVisible = true
      this.dialogType = 'user.list.adduser'
      this.rule =
      [{
        type: 'el-row',
        native: true,
        children: [
          {
            type: 'el-col',
            props: {
              span: 24
            },
            children: [
              {
                type: 'input',
                title: this.$t('form.name'),
                field: 'user_name',
                value: null,
                props: { type: 'text' },
                validate: {
                  required: true,
                  message: this.$t('form.required')
                },
                col: { span: 12 }
              },
              {
                type: 'input',
                title: this.$t('form.password'),
                field: 'user_pass',
                value: null,
                props: { type: 'text' },
                col: { span: 12 }
              },
              {
                type: 'input',
                title: this.$t('form.phone'),
                field: 'phone',
                value: null,
                props: { type: 'text' },
                validate: {
                  required: true,
                  message: this.$t('form.required')
                },
                col: { span: 12 }
              },
              {
                type: 'input',
                title: this.$t('form.email'),
                field: 'email',
                value: null,
                props: { type: 'text' },
                col: { span: 12 }
              },
              {
                type: 'upload',
                field: 'headimg',
                title: this.$t('form.head_img'),
                value: null,
                props: {
                  type: 'select',
                  uploadType: 'image',
                  headers: this.headers,
                  action: this.update_url,
                  name: 'headimg',
                  multiple: true,
                  accept: 'image\/*',
                  limit: 1,
                  onSuccess: function(res, file) {
                    file.url = res.data.path
                  }
                }
              },
              {
                type: 'radio',
                title: this.$t('form.type'),
                field: 'type',
                value: 1,
                options: [
                  { value: 1, label: this.$t('form.common'), disabled: false },
                  { value: 2, label: this.$t('form.vip'), disabled: false },
                  { value: 3, label: this.$t('form.virtual'), disabled: false }
                ]
              },
              {
                type: 'input',
                title: this.$t('form.invite_code'),
                field: 'invite',
                value: null,
                props: { type: 'text' },
                col: { span: 24 }
              }
            ]
          }
        ]
      }]
      this.option.onSubmit = async(formData) => {
        const { message } = await addUser(formData)
        this.$message({
          message: message,
          type: 'success'
        })
        this.dialogVisible = false
        this.getList()
      }
    },
    async handleEdit(id) {
      this.rule = []
      const { data } = await geteditUser(id)
      this.rule =
      [{
        type: 'el-row',
        native: true,
        children: [
          {
            type: 'el-col',
            props: {
              span: 24
            },
            children: [
              {
                type: 'hidden',
                field: 'id',
                title: 'id',
                props: {
                  disabled: true
                }
              },
              {
                type: 'input',
                field: 'uuid',
                title: 'uuid',
                props: {
                  disabled: true
                }
              },
              {
                type: 'input',
                title: this.$t('form.name'),
                field: 'user_name',
                value: null,
                props: { type: 'text' },
                validate: {
                  required: true,
                  message: this.$t('form.required')
                },
                col: { span: 12 }
              },
              {
                type: 'input',
                title: this.$t('form.password'),
                field: 'user_pass',
                value: null,
                props: { type: 'text' },
                col: { span: 12 }
              },
              {
                type: 'input',
                title: this.$t('form.phone'),
                field: 'phone',
                value: null,
                props: { type: 'text' },
                validate: {
                  required: true,
                  message: this.$t('form.required')
                },
                col: { span: 12 }
              },
              {
                type: 'input',
                title: this.$t('form.email'),
                field: 'email',
                value: null,
                props: { type: 'text' },
                col: { span: 12 }
              },
              {
                type: 'upload',
                field: 'headimg',
                title: this.$t('form.head_img'),
                value: null,
                props: {
                  type: 'select',
                  uploadType: 'image',
                  headers: this.headers,
                  action: this.update_url,
                  name: 'headimg',
                  multiple: true,
                  accept: 'image\/*',
                  limit: 1,
                  onSuccess: function(res, file) {
                    file.url = res.data.path
                  }
                }
              },
              {
                type: 'radio',
                title: this.$t('form.type'),
                field: 'type',
                value: 1,
                options: [
                  { value: 1, label: this.$t('form.common'), disabled: false },
                  { value: 2, label: this.$t('form.vip'), disabled: false },
                  { value: 3, label: this.$t('form.virtual'), disabled: false }
                ]
              }
            ]
          }
        ]
      }]
      this.value = data
      this.dialogType = 'user.list.edituser'
      this.dialogVisible = true
      this.option.onSubmit = async(formData) => {
        const { message } = await editUser(formData)
        this.$message({
          message: message,
          type: 'success'
        })
        this.dialogVisible = false
        this.getList()
      }
    },
    async alterState(id) {
      const { message } = await alterState(id)
      this.$message({
        message: message,
        type: 'success'
      })
      this.getList()
    },
    editmoney(id) {
      this.dialogVisible = true
      this.dialogType = 'form.money'
      this.rule =
      [{
        type: 'el-row',
        native: true,
        children: [
          {
            type: 'el-col',
            props: {
              span: 24
            },
            children: [
              {
                type: 'hidden',
                field: 'user_id',
                value: id,
                validate: {
                  required: true,
                  message: this.$t('form.required')
                }
              },
              {
                type: 'InputNumber',
                title: this.$t('form.money'),
                field: 'money',
                value: null,
                props: { precision: 2, min: 1, max: 999999999 },
                validate: {
                  required: true,
                  message: this.$t('form.required')
                }
              },
              {
                title: this.$t('form.describe'),
                field: 'describe',
                props: { type: 'textarea', clearable: true },
                value: null,
                validate: {
                  required: true,
                  message: this.$t('form.required')
                }
              },
              {
                type: 'radio',
                title: this.$t('form.type'),
                field: 'type',
                value: 1,
                options: [
                  { value: 0, label: this.$t('form.reduce'), disabled: false },
                  { value: 1, label: this.$t('form.increase'), disabled: false }
                ]
              }
            ]
          }
        ]
      }]
      this.option.onSubmit = async(formData) => {
        const { message } = await editMoney(formData)
        this.$message({
          message: message,
          type: 'success'
        })
        this.dialogVisible = false
        this.getList()
      }
    },
    editintegral(id) {
      this.dialogVisible = true
      this.dialogType = 'form.integral'
      this.rule =
      [{
        type: 'el-row',
        native: true,
        children: [
          {
            type: 'el-col',
            props: {
              span: 24
            },
            children: [
              {
                type: 'hidden',
                field: 'user_id',
                value: id,
                validate: {
                  required: true,
                  message: this.$t('form.required')
                }
              },
              {
                type: 'InputNumber',
                title: this.$t('form.integral'),
                field: 'integral',
                value: null,
                props: { precision: 2, min: 1, max: 999999999 },
                validate: {
                  required: true,
                  message: this.$t('form.required')
                }
              },
              {
                title: this.$t('form.describe'),
                field: 'describe',
                props: { type: 'textarea', clearable: true },
                value: null,
                validate: {
                  required: true,
                  message: this.$t('form.required')
                }
              },
              {
                type: 'radio',
                title: this.$t('form.type'),
                field: 'type',
                value: 1,
                options: [
                  { value: 0, label: this.$t('form.reduce'), disabled: false },
                  { value: 1, label: this.$t('form.increase'), disabled: false }
                ]
              }
            ]
          }
        ]
      }]
      this.option.onSubmit = async(formData) => {
        const { message } = await editIntegral(formData)
        this.$message({
          message: message,
          type: 'success'
        })
        this.dialogVisible = false
        this.getList()
      }
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
.el-header,.el-main{
  padding: 0 0px;
  width: 100%;
}
.avatar{
  width: 100px;
}
.pagination{
  margin: 10px 0;
}
</style>
