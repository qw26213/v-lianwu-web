<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input size="small" v-model="listQuery.storeName" placeholder="门店名称" style="width: 200px;" class="filter-item" />
      <el-input size="small" v-model="listQuery.bizLicenseNo" placeholder="门店编号" style="width: 200px;" class="filter-item" />
      <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate" v-permission="['C010105']">新增门店</el-button>
      <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-download" @click="downloadModel">下载模板</el-button>
      <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handDownload" v-permission="['C020102']">门店导入</el-button>
    </div>
    <input enctype="multipart/form-data" id="uploadFile1" type="file" @change="importDevice($event)" />
    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="{row}">
          <span>{{row.dateCreated}}</span>
        </template>
      </el-table-column>
      <el-table-column label="门店名称">
        <template slot-scope="{row}">
          <span>{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="门店编号">
        <template slot-scope="{row}">
          <span>{{row.id}}</span>
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
          <el-button type="primary" size="mini" @click="toModify(row.id)" v-permission="['C010104','C010106']">编辑</el-button>
          <el-button type="primary" size="mini" @click="showBind1(row)" v-permission="['C010104','C010106']">绑定设备</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog title="绑定设备至门店" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="60px">
        <el-form-item label="门店号:">
          <el-input v-model="temp.storeId" placeholder="门店号" disabled/>
        </el-form-item>
        <el-form-item label="设备号:">
          <el-input v-model="temp.deviceId" placeholder="设备号"/>
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
import { listStore,bindDevice,downloadStoreTemplateUrl } from '@/api/user'
import waves from '@/directive/waves'
import permission from '@/directive/permission'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
  name: 'merchantStores',
  components: { Pagination },
  directives: { waves,permission },
  data() {
    return {
      itemId:this.$route.query.id,
      tableKey: 0,
      tableData: null,
      total: 0,
      listLoading: true,
      listQuery: {
        merchantId:this.$route.query.id,
        page: 1,
        pageSize:20,
        storeId: '',
        storeName: ''
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
  mounted() {
    this.getList()
  },
  watch:{
    'itemId'(){
      this.getList()
    }
  },
  methods: {
    showBind1(obj){
      this.temp.storeId = obj.id
      this.dialogFormVisible = true
    },
    getList() {
      this.listLoading = true
      listStore(this.listQuery).then(response => {
        this.listLoading = false
        this.tableData = response.data.data.storeDtos
        this.total = response.data.data.pageResponse.totalCount
      })
    },
    handleBind() {
      if(this.temp.deviceId==""){
        this.$message.error('设备号不能为空');return
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    downloadModel(){
      var url = ''
      downloadStoreTemplateUrl().then(response => {
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
      document.getElementById("uploadFile1").click();
    },
    importDevice(event){
      let formData = new FormData();
      var fileObj = event.currentTarget.files[0];
      console.log(fileObj);
      if(fileObj==null||fileObj==undefined){return;}
      formData.append("multipartFile", fileObj);
      this.$axios({
          url: '/operator/operation/importStore.json?merchantId='+this.itemId,
          method: 'POST',
          data: formData,
          timeout: 10000,
          headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
          if (res.data.error == '0') {
            this.$message({
              showClose: true,
              message: '门店导入成功',
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
    toDevice(id){
      this.$router.push('/deviceList?storeId='+id);
    },
    toModify(id){
      this.$router.push('/merchantStoreModify?id='+id+'&mId='+this.$route.query.id);
    },
    handleCreate() {
      this.$router.push('/merchantStoreAdd?mId='+this.$route.query.id);
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464

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
<style scoped>
  .pointer{cursor: pointer;text-decoration: underline;}
  #uploadFile1{display: none;}
</style>
