<template>
  <div class="app-container">
    <el-tabs v-model="activeStatus" @tab-click="handleClick">
      <el-tab-pane label="待审核" name="0" />
      <el-tab-pane label="已通过" name="1" />
      <el-tab-pane label="不通过" name="-1" />
    </el-tabs>
    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
      <el-table-column :label="activeStatus=='0'?'提交审核时间':(activeStatus=='10'?'通过审核时间':'不通过审核时间')">
        <template slot-scope="{row}">
          <span>{{row.dateCreated}}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="{row}">
          <span>{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号">
        <template slot-scope="{row}">
          <span>{{row.idcard}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人电话">
        <template slot-scope="{row}">
          <span>{{row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核意见" align="center" v-if="activeStatus==-1">
        <template slot-scope="{row}">
          <span>{{row.memo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" v-if="activeStatus==0">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" v-permission="['C010401','C010402']" @click="showDialog(row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
    <el-dialog title="实名审核" :visible.sync="dialogFormVisible" width="740px">
      <div class="imgTit clearfix">
        <p>身份证正面照</p>
        <p style="margin-left: 20px;">身份证背面照</p>
        <p style="margin-left: 20px;">手持身份证照</p>
      </div>
      <div class="clearfix mb20">
        <div class="frontImg" @click="clickImg(idcardImgFace)" :style="{backgroundImage:'url('+basePicUrl+idcardImgFace+'/resize_400_300/mode_fill)'}" style="margin-right: 20px;"></div>
        <div class="frontImg" @click="clickImg(idcardImgBack)" :style="{backgroundImage:'url('+basePicUrl+idcardImgBack+'/resize_400_300/mode_fill)'}" style="margin-right: 20px;"></div>
        <div class="frontImg" @click="clickImg(idcardImgHold)" :style="{backgroundImage:'url('+basePicUrl+idcardImgHold+'/resize_400_300/mode_fill)'}"></div>
      </div>
      <el-form ref="dataForm" label-position="left" label-width="75px">
        <el-form-item label="审核意见:">
          <el-input v-model="remark" placeholder="审核意见" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center" v-permission="['C010402']">
        <el-button type="primary" @click="handleCheck(1)">审核通过</el-button>
        <el-button type="default" @click="handleCheck(-1)">审核不通过</el-button>
      </div>
    </el-dialog>
    <div class="imgView" v-show="showImg" @click="hideImg">
      <div class="imgLayer"></div>
      <div class="img" :style="{backgroundImage:'url('+basePicUrl+imgSrc+'/resize_800_600/mode_fill)'}"></div>
    </div>
  </div>
</template>
<script>
var basePicUrl = 'https://upic.juniuo.com/file/picture/'
import { listCertUser,certUser } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import permission from '@/directive/permission' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'merchantCertify',
  components: { Pagination },
  directives: { waves,permission },
  data() {
    return {
      showImg:false,
      imgSrc:'',
      basePicUrl:basePicUrl,
      curItemId:'',
      activeStatus: '0',
      tableKey: 0,
      tableData: null,
      total: 0,
      listLoading: true,
      listQuery: {},
      dialogFormVisible:false,
      idcardImgFace:'',
      idcardImgBack:'',
      idcardImgHold:'',
      remark:''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    hideImg(){
      this.showImg = false;
    },
    clickImg(src) {
      this.showImg = true;
      this.imgSrc = src;
    },
    handleClick(tab, event) {
      this.getList();
    },
    showDialog(obj){
      this.curItemId = obj.id
      this.idcardImgFace = obj.idcardImgFace
      this.idcardImgBack = obj.idcardImgBack
      this.idcardImgHold = obj.idcardImgHold
      this.dialogFormVisible = true
    },
    getList() {
      this.listLoading = true
      this.listQuery.certStatus = this.activeStatus;
      listCertUser(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
        this.total = res.data.data.length
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCheck(status){
      if(status==-1&&this.remark==""){
        this.$message.error('不通过请填写审核意见');return
      }
      var obj = {
        id:this.curItemId,
        certStatus:status,
        memo:this.remark
      }
      certUser(obj).then(res => {
        if(res.data.error==0){
          this.getList();
          this.dialogFormVisible = false
          this.$message.success("您已完成审核")
        }else{
          this.$message.error(res.data.message)
        }
      });
    },
  }
}
</script>
<style scoped>
.imgTit{margin-top:-20px;}
.imgTit p{float: left;width: 220px;margin-bottom: 8px;text-align: center;}
.mb20{margin-bottom: 20px}
.frontImg{width: 220px;height: 160px;float: left;border: 1px #eee solid;background: #f7f7f7;background-repeat: no-repeat;background-size: 100% 100%;border-radius: 6px}
.imgView{z-index:9999;width:100%;height:100%;position: fixed;top: 0;left: 0}
.imgView .imgLayer{position:fixed;z-index:999;top:0;left:0;background:rgba(0,0,0,0.7);width:100%;height:100%;overflow:hidden;}
.imgView .img{width:800px;display:block;position:absolute;left:0;right:0;margin:auto;z-index:1000;background-repeat: no-repeat;background-size: 100% 100%;top: 0;bottom: 0;height: 600px}
</style>