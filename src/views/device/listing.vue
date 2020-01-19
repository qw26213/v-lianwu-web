<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input size="small" v-model="listQuery.deviceId" placeholder="商户名" style="width: 200px;" class="filter-item" />
      <el-input size="small" v-model="listQuery.storeId" placeholder="门店号" style="width: 200px;" class="filter-item" />
      <!-- <el-select size="small" v-model="listQuery.bd" placeholder="审核状态" clearable style="width: 130px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select> -->
      <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="商户名">
        <template slot-scope="{row}">
          <span>{{row.merchantName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="门店名">
        <template slot-scope="{row}">
          <span>{{row.storeName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备数量">
        <template slot-scope="{row}">
          <span>{{row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleCreate(row)">绑定</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="设备绑定" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px">
        <el-form-item label="门店号:" prop="storeId">
          <el-input v-model="temp.storeId" placeholder="门店号" disabled />
        </el-form-item>
        <el-form-item label="商户号:" prop="merchantId">
          <el-input v-model="temp.merchantId" placeholder="商户号" disabled />
        </el-form-item>
        <el-form-item label="设备号:" prop="deviceId">
        <el-select v-model="temp.deviceId" clearable filterable remote reserve-keyword placeholder="设备号" :remote-method="remoteMethod1" :loading="loading1" style="width:380px" size="small" @focus="getDeviceList('')" @clear="clertInput()">
          <el-option v-for="item in deviceList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleBind()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listUnbindDevice,bindDevice,getDevices } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'deviceListing',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      total: 0,
      loading1:false,
      deviceData:[],
      deviceList:[],
      listLoading: true,
      listQuery: {
        deviceId:'',
        page: 1,
        merchantId: '',
        merchantName: ''
      },
      showReviewer: false,
      temp: {
        deviceId: '',
        storeId: '',
        applyId:'',
        merchantId:''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [],
      rules: {
        storeId: [{ required: true, message: '门店号不能为空', trigger: 'change' }],
        merchantId: [{ required: true, message: '商户号不能为空', trigger: 'change' }],
        deviceId: [{ required: true, message: '设备号不能为空', trigger: 'change' }],
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    clertInput(){
      this.listQuery.storeId = '';
    },
    getDeviceList(id){
      getDevices({deviceId:id,page:1,pageSize:20}).then(res => {
        this.loading1 = false;
        this.deviceData = res.data.data.dtos
        this.deviceList = this.deviceData.map(item => {
          return { value: item.id, label: item.id };
        });
      })
    },
    remoteMethod1(query) {
      if (query !== '') {
        this.loading1 = true;
        this.getDeviceList(query);
      } else {
        this.deviceList = [];
      }
    },
    getList() {
      this.listLoading = true
      listUnbindDevice(this.listQuery).then(response => {
        this.listLoading = false
        this.tableData = response.data.data
      })
    },
    handleCreate(obj) {
      this.dialogFormVisible = true
      this.temp.merchantId = obj.merchantId
      this.temp.deviceId = ''
      this.temp.storeId = obj.storeId
      this.temp.applyId = obj.id
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleBind() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          bindDevice(this.temp).then(res => {
            if(res.data.error==0){
              this.getList();
              this.dialogFormVisible = false
              this.$message({
                message: '绑定成功',
                type: 'success'
              })
            }else{
              this.$message.error(res.data.message)
            }
          })
        }
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
  }
}
</script>
