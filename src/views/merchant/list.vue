<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-select size="small" v-model="listQuery.bd" placeholder="所属BD" clearable style="width: 130px" class="filter-item">
        <el-option v-for="item in [0,1,2]" :key="item" :label="item" :value="item" />
      </el-select> -->
      <el-input size="small" v-model="listQuery.merchantName" placeholder="商户名称" style="width: 200px;" class="filter-item" />
      <el-input size="small" v-model="listQuery.merchantId" placeholder="商户编号" style="width: 200px;" class="filter-item" />
      <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate" v-permission="['C010102']">新增</el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="{row}">
          <span>{{row.dateCreated}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户名称">
        <template slot-scope="{row}">
          <span>{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户编号">
        <template slot-scope="{row}">
          <span>{{row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="门店数" width="100">
        <template slot-scope="{row}">
          <span>{{row.storeCount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备数" width="100">
        <template slot-scope="{row}">
          <span v-if="row.deviceCount>0" class="pointer" @click="toDevice(row.id)">{{row.deviceCount}}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="所属BD">
        <template slot-scope="{row}">
          <span>{{row.bd}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="toModify(row.id)" v-permission="['C010101','C010103']">编辑</el-button>
          <el-button type="default" size="mini" @click="toStore(row.id)" v-permission="['C010104','C010105','C010106']">门店管理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { getMerchants } from '@/api/user'

import waves from '@/directive/waves'
import permission from '@/directive/permission'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
  name: 'merchantList',
  components: { Pagination },
  directives: { waves,permission },
  data() {
    return {
      tableKey: 0,
      tableData: null,
      total: 0,
      listLoading: true,
      listQuery: {
        bd:'',
        page: 1,
        pageSize:20,
        merchantId: '',
        merchantName: ''
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getMerchants(this.listQuery).then(response => {
        this.listLoading = false
        this.tableData = response.data.data.list
        this.total = response.data.data.pageResponse.totalCount
      })
    },
    toDevice(id){
      this.$router.push('/deviceList?merchantId='+id);
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    toStore(id){
      this.$router.push('/merchantStores?id='+id+'&redirect='+this.$route.fullPath);
    },
    toModify(id){
      this.$router.push('/merchantModify?id='+id);
    },
    handleCreate() {
      this.$router.push('/merchantAdd');
    }
  }
}
</script>
<style scoped>
  .pointer{cursor: pointer;text-decoration: underline;}
</style>
