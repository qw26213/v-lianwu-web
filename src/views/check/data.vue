<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker size="small" class="filter-item" v-model="dateTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="timeChange" value-format="yyyy-MM-dd"></el-date-picker>
      <el-select v-model="listQuery.merchantId" clearable filterable remote reserve-keyword placeholder="商户名称" :remote-method="remoteMethod1" :loading="loading1" style="width: 200px" size="small" class="filter-item" @focus="getMerchantList('')" @clear="clertInput()">
        <el-option v-for="item in merchantList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select ref="storeInput" v-model="listQuery.storeId" clearable filterable remote reserve-keyword placeholder="门店名称" :remote-method="remoteMethod2" :loading="loading2" style="width: 200px" size="small" class="filter-item" @focus="getStoreList('')">
        <el-option v-for="item in storeList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-download" @click="handleExport">报表导出</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
      <el-table-column label="核销时间" width="170">
        <template slot-scope="{row}">
          <span>{{row.useTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户名称">
        <template slot-scope="{row}">
          <span>{{row.merchantName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="门店名称">
        <template slot-scope="{row}">
          <span>{{row.storeName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备SN" width="165">
        <template slot-scope="{row}">
          <span>{{row.deviceNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="核销平台" width="120">
        <template slot-scope="{row}">
          <span>{{row.platform}}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡券名称">
        <template slot-scope="{row}">
          <span>{{row.couponName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="券金额" width="80">
        <template slot-scope="{row}">
          <span>{{row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="抵扣金额" width="80">
        <template slot-scope="{row}">
          <span>{{row.useAmount}}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { listCheckData,getMerchants,listStore,downloadData } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import {parseTime} from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name:'checkOrder',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      loading1:false,
      loading2:false,
      tableKey: 0,
      dateTime:[],
      merchantData:[],
      merchantList:[],
      storeData:[],
      storeList:[],
      tableData: null,
      total: 0,
      listLoading: true,
      listQuery: {
        startTime:'',
        endTime:'',
        pageSize:20,
        page: 1,
        merchantId: '',
        storeId: ''
      },
      dialogFormVisible: false
    }
  },
  created() {
    var time1 = new Date();
    var time2 = new Date();
    time2.setTime(time1.getTime() - 3600 * 1000 * 24 * 7);

    this.listQuery.endTime = parseTime(time1);
    this.listQuery.startTime = parseTime(time2);

    this.dateTime = [this.listQuery.startTime, this.listQuery.endTime]
    this.getList()
  },
  methods: {
    clertInput(){
      this.listQuery.storeId = '';
    },
    getMerchantList(name){
      getMerchants({merchantName:name,page:1,pageSize:50}).then(res => {
        this.loading1 = false;
        this.merchantData = res.data.data.list
        this.merchantList = this.merchantData.map(item => {
          return { value: item.id, label: item.name };
        });
      })
    },
    handleExport() {
      var base = process.env.VUE_APP_BASE_API;
      window.location.href = base + '/operator/unifyCoupon/downloadData.json?startTime='+this.listQuery.startTime+'&endTime='+this.listQuery.endTime+'&merchantId='+this.listQuery.merchantId+'&storeId='+this.listQuery.storeId;
      setTimeout(()=>{
        this.$message.success('报表导出成功');
      },1000)
    },
    getStoreList(name){
      if(this.listQuery.merchantId)
      listStore({storeName:name,page:1,merchantId:this.listQuery.merchantId,pageSize:50}).then(res => {
        this.loading2 = false;
        this.storeData = res.data.data.storeDtos
        this.storeList = this.storeData.map(item => {
          return { value: item.id, label: item.name };
        });
      })
    },
    remoteMethod1(query) {
      if (query !== '') {
        this.loading1 = true;
        this.getMerchantList(query);
      } else {
        this.merchantList = [];
      }
    },
    remoteMethod2(query) {
      if (query !== '') {
        this.loading1 = true;
        this.getStoreList(query);
      } else {
        this.storeList = [];
      }
    },
    getList() {
      this.listLoading = true
      listCheckData(this.listQuery).then(response => {
        this.listLoading = false
        this.tableData = response.data.data.content
        this.total = response.data.data.totalElements
      })
    },
    timeChange(e){
      if(e){
        this.listQuery.startTime = e[0] + ' 00:00:00'
        this.listQuery.endTime = e[1] + ' 23:59:59'
      }else{
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
  }
}
</script>
