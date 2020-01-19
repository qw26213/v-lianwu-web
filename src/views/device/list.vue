<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input size="small" v-model="listQuery.deviceId" placeholder="设备号" style="width: 200px;" class="filter-item" />
      <el-input size="small" v-model="listQuery.merchantId" placeholder="商户号" style="width: 200px;" class="filter-item" />
      <el-input size="small" v-model="listQuery.storeId" placeholder="门店号" style="width: 200px;" class="filter-item" />
      <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-download" @click="downloadModel">下载模板</el-button>
      <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handDownload" v-permission="['C020102']">设备导入</el-button>
      <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-download" @click="handleExport" v-permission="['C020103']">设备导出</el-button>
    </div>
    <input enctype="multipart/form-data" id="uploadFile" type="file" @change="importDevice($event)" />
    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
      <el-table-column label="设备号">
        <template slot-scope="{row}">
          <span>{{row.name}}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="{row}">
          <span style="color:#E6A23C" v-if="row.status==1">未绑定</span>
          <span style="color:#409EFF" v-if="row.status==2">已绑定</span>
        </template>
      </el-table-column>
      <el-table-column label="绑定时间" align="left" width="160">
        <template slot-scope="{row}">
          <span>{{row.dateBind}}</span>
        </template>
      </el-table-column>
      <el-table-column label="解绑时间" align="left" width="160">
        <template slot-scope="{row}">
          <span>{{row.dateUnbind}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220" class-name="small-padding" v-permission="['C020101']">
        <template slot-scope="{row}">
          <el-button type="default" size="mini" @click="toDetail(row)">查看详情</el-button>
          <el-button v-if="row.status==2" type="primary" size="mini" @click="handBind1(row.id)">解绑门店</el-button>
          <el-button v-if="row.status==1" type="primary" size="mini" @click="showBind1(row)">绑定门店</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="绑定门店至设备" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="60px">
        <el-form-item label="设备号:">
          <el-input v-model="temp.deviceId" placeholder="设备号" disabled/>
        </el-form-item>
        <el-form-item label="门店号:">
          <el-input v-model="temp.storeId" placeholder="门店号" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleBind()">确定</el-button>
      </div>
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getDevices,downloadDeviceTemplate,unBindDeviceFromStore,unBindDeviceFromMerchant,bindDevice } from '@/api/user'

import waves from '@/directive/waves'
import permission from '@/directive/permission'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
  name: 'deviceList',
  components: { Pagination },
  directives: { waves,permission },
  data() {
    return {
      tableKey: 0,
      tableData: null,
      total: 0,
      dialogType:'',
      listLoading: true,
      listQuery: {
        deviceId:'',
        page: 1,
        merchantId: '',
        storeId: ''
      },
      showReviewer: false,
      temp: {
        deviceId: '',
        storeId: ''
      },
      dialogFormVisible: false,
      dialogStatus: ''
    }
  },
  created() {
    if(this.$route.query.merchantId){
      this.listQuery.merchantId = this.$route.query.merchantId
    }
    if(this.$route.query.storeId){
      this.listQuery.storeId = this.$route.query.storeId
    }
    this.getList()
  },
  methods: {
    showBind1(obj){
      this.temp.deviceId = obj.id
      this.dialogFormVisible = true
    },
    showBind2(obj){
      this.temp.deviceId = obj.id
      this.temp.storeId = obj.storeId
      this.dialogFormVisible = true
      this.dialogType = 'merchant'
    },
    toDetail(row){
      this.$router.push('/deviceDetail?id='+row.id)
    },
    handleBind() {
      if(this.temp.storeId==""){
        this.$message.error('门店号不能为空');return
      }
      bindDevice(this.temp).then(res => {
        if(res.data.error==0){
          this.getList();
          this.dialogFormVisible = false
          this.$message.success('设备绑定成功')
        }else{
          this.$message.error(res.data.message)
        }
      })
    },
    handBind1(id){
      this.$confirm('您确认要解绑门店吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        unBindDeviceFromMerchant({deviceId:id}).then(response => {
          if(response.data.error=='0'){
            this.getList()
            this.$message.success('解绑门店成功');
          }else{
              this.$message.error(response.data.message)
          }
        })
      });
    },
    handleExport() {
      var base = process.env.VUE_APP_BASE_API;
      window.location.href = base + '/operator/operation/downloadDevices.json?sn='+this.listQuery.deviceId+'&merchantId='+this.listQuery.merchantId+'&storeId='+this.listQuery.storeId;
      setTimeout(()=>{
        this.$message.success('设备导出成功');
      },1000)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getList() {
      this.listLoading = true
      getDevices(this.listQuery).then(response => {
        this.listLoading = false
        this.tableData = response.data.data.dtos
        this.total = response.data.data.pageResponse.totalCount
      })
    },
    downloadModel(){
      var url = ''
      downloadDeviceTemplate().then(response => {
        this.$message({
          showClose: true,
          message: '模板下载成功',
          type: 'success'
        });
        url = response.data.data
        window.location.href = url
      })
    },
    handDownload(){
      document.getElementById("uploadFile").click();
    },
    importDevice(event){
      let formData = new FormData();
      var fileObj = event.currentTarget.files[0];
      console.log(fileObj);
      if(fileObj==null||fileObj==undefined){return;}
      formData.append("multipartFile", fileObj);
      this.$axios({
          url: '/operator/operation/importDevice.json',
          method: 'POST',
          data: formData,
          timeout: 10000,
          headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
          if (res.data.error == '0') {
            this.$message({
              showClose: true,
              message: '设备导入成功',
              type: 'success'
            });
            this.getList();
          } else {
              this.$message.error(res.data.message)
          }
      }).catch(res=>{
          this.$message.error('上传失败');
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
  }
}
</script>
<style>
.filter-item{position: relative;}
#uploadFile{display: none;}
</style>
