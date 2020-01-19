<template>
  <div class="app-container">
    <el-tabs v-model="activeStatus" @tab-click="handleClick">
      <el-tab-pane label="待审核" name="0" />
      <el-tab-pane label="已通过" name="1" />
      <el-tab-pane label="不通过" name="-1" />
    </el-tabs>
    <div class="filter-container">
      <!-- <el-select size="small" v-model="listQuery.status" placeholder="审核类型" clearable style="width: 130px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select> -->
      <el-input size="small" v-model="listQuery.merchantName" placeholder="商户名称" style="width: 200px;" class="filter-item" />
      <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
      <el-table-column :label="activeStatus=='0'?'提交审核时间':(activeStatus=='1'?'通过审核时间':'不通过审核时间')">
        <template slot-scope="{row}">
          <span>{{row.dateCreated}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户名称">
        <template slot-scope="{row}">
          <span>{{row.merchantName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人电话">
        <template slot-scope="{row}">
          <span>{{row.contactPhone}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核意见" align="center" v-if="activeStatus==-1">
        <template slot-scope="{row}">
          <span>{{row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" v-if="activeStatus==0">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="detail(row)" v-permission="['C010201','C010202']">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
import { listMerchantAudit } from '@/api/user'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import permission from '@/directive/permission'
export default {
  name: 'merchantCheck',
  components: { Pagination },
  directives: { waves,permission },
  data() {
    return {
      activeStatus: '0',
      tableKey: 0,
      tableData: null,
      total: 0,
      listLoading: true,
      listQuery: {
        id:'',
        status: '',
        page: 1,
        merchantName: ''
      },
      dialogFormVisible:false,
      temp:{
        contactPhone:'',
        remark:''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleClick(tab, event) {
      this.getList();
    },
    getList() {
      this.listLoading = true
      this.listQuery.status = this.activeStatus;
      listMerchantAudit(this.listQuery).then(response => {
        this.listLoading = false
        this.tableData = response.data.data
        this.total = response.data.data.length
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    detail(obj){
      this.$router.push('/merchantAudit?id='+obj.id);
    },
  }
}

</script>
