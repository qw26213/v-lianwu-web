<template>
  <div class="formDiv">
    <el-form ref="dataForm" label-width="120px">
      <el-form-item label="商户名称:" prop="name" :class="{'red':temp.updateField&&temp.updateField.indexOf('name')>=0}">
        <span v-text="temp.merchantName"></span>
      </el-form-item>
      <el-form-item label="手机号:" prop="contactPhone" :class="{'red':temp.updateField&&temp.updateField.indexOf('contactPhone')>=0}">
        <span v-text="temp.contactPhone"></span>
      </el-form-item>
      <el-form-item label="行业类别:" prop="industryId" :class="{'red':temp.updateField&&temp.updateField.indexOf('industryId')>=0}">
        <span v-text="temp.industryId"></span>
      </el-form-item>
      <el-form-item label="营业执照号码:" prop="bizLicenseNo" :class="{'red':temp.updateField&&temp.updateField.indexOf('bizLicenseNo')>=0}">
        <span v-text="temp.bizLicenseNo"></span>
      </el-form-item>
      <el-form-item label="营业执照:" prop="bizLicensePic" :class="{'red':temp.updateField&&temp.updateField.indexOf('bizLicensePic')>=0}">
        <div class="uploadDiv" :style="{backgroundImage:'url(' + basePicUrl+temp.bizLicensePic+'/resize_450_300/mode_fill)'}"></div>
      </el-form-item>
      <el-form-item label="负责人姓名:" prop="managerName" :class="{'red':temp.updateField&&temp.updateField.indexOf('managerName')>=0}">
        <span v-text="temp.managerName"></span>
      </el-form-item>
      <el-form-item label="负责人身份证号:" prop="managerIdcard" :class="{'red':temp.updateField&&temp.updateField.indexOf('managerIdcard')>=0}">
        <span v-text="temp.managerIdcard"></span>
      </el-form-item>
      <el-form-item label="身份证正面照:" prop="idcardImgFace" :class="{'red':temp.updateField&&temp.updateField.indexOf('idcardImgFace')>=0}">
        <div class="uploadDiv" :style="{backgroundImage:'url(' + basePicUrl+temp.idcardImgFace+'/resize_450_300/mode_fill)'}"></div>
      </el-form-item>
      <el-form-item label="身份证背面照:" prop="idcardImgBack" :class="{'red':temp.updateField&&temp.updateField.indexOf('idcardImgBack')>=0}">
        <div class="uploadDiv" :style="{backgroundImage:'url(' + basePicUrl+temp.idcardImgBack+'/resize_450_300/mode_fill)'}"></div>
      </el-form-item>
      <el-form-item v-if="temp.managerType==1" label="授权书:" prop="entrustPaper" :class="{'red':temp.updateField&&temp.updateField.indexOf('entrustPaper')>=0}">
        <div class="uploadDiv" :style="{backgroundImage:'url(' + basePicUrl+temp.entrustPaper+'/resize_300_300/mode_fill)'}"></div>
      </el-form-item>
      <el-form-item label="审核意见:">
        <el-input v-model="remark" placeholder="审核意见" />
      </el-form-item>
      <el-form-item v-permission="['C010202']">
        <el-button type="primary" @click="handleCheck(1)">审核通过</el-button>
        <el-button type="waining" @click="handleCheck(-1)">审核不通过</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
var basePicUrl = 'https://upic.juniuo.com/file/picture/'
import {merchantAuditDetail,merchantAudit} from '@/api/user'
import permission from '@/directive/permission'
export default {
  name: 'merchantAudit',
  directives: { permission },
  data() {
    return {
      basePicUrl:basePicUrl,
      industys:[],
      remark:'',
      temp:{
        contactPhone:"",
        industryId:"",
        bizLicenseNo:"",
        bizLicensePic:'',
        merchantName:'',
        contactEmail:'',
        contactPhone:'',
        managerName:'',
        managerIdcard:'',
        idcardImgFace:'',
        idcardImgBack:'',
        entrustPaper:'',
        updateField:''
      }
    }
  },
  created(){
    this.getData()
  },
  methods: {
    async getData(){
      if(this.$route.query.id){
        const { data } = await merchantAuditDetail({id:this.$route.query.id});
        this.temp = data.data
      }
    },
    handleCheck(status){
      if(status==-1&&this.remark==""){
        this.$message.error("请填写审核意见");return
      }
      var obj = {
        id:this.$route.query.id,
        passStatus:status,
        remark:this.remark
      }
      merchantAudit(obj).then(res => {
        if(res.data.error=='0'){
          this.$router.go(-1)
          this.$message.success("您已完成审核")
        }else{
          this.$message.error(res.data.message)
        }
      })
    }
  }
}
</script>
<style>
.el-form-item--medium.red .el-form-item__label {color: #F56C6C;}
</style>
<style scoped>
.formDiv {width: 600px;margin: 50px auto;}
.uploadDiv{border: 1px #eee solid;background-color: #fff;width: 180px;height: 120px;border-radius: 6px;overflow: hidden;background: #f7f7f7;background-repeat: no-repeat;background-size: 100% 100%;}
</style>
