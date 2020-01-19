<template>
  <div class="formDiv">
    <el-form ref="dataForm" label-width="120px" :rules="rules" :model="temp">
      <el-form-item label="商户名称" prop="name">
        <el-input v-model="temp.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="contactPhone">
        <el-input v-model="temp.contactPhone"></el-input>
      </el-form-item>
      <el-form-item label="行业类别" prop="industryId">
        <el-select v-model="temp.industryId" placeholder="请选择行业类别">
          <el-option v-for="item in industys" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="营业执照号码" prop="bizLicenseNo">
        <el-input v-model="temp.bizLicenseNo"></el-input>
      </el-form-item>
      <el-form-item label="营业执照" prop="bizLicensePic">
        <div class="uploadDiv" :style="{backgroundImage:'url('+basePicUrl+temp.bizLicensePic + '/resize_450_300/mode_fill)'}">
            <input enctype="multipart/form-data" type="file" accept="image/*" @change="uploadImg($event,'bizLicensePic')" />
            <i class="el-icon-plus avatar-uploader-icon"></i>
        </div>
      </el-form-item>
      <el-form-item label="负责人姓名" prop="managerName">
        <el-input v-model="temp.managerName"></el-input>
      </el-form-item>
      <el-form-item label="负责人身份证号" prop="managerIdcard">
        <el-input v-model="temp.managerIdcard"></el-input>
      </el-form-item>
      <el-form-item label="身份证正面照" prop="idcardImgFace">
        <div class="uploadDiv" :style="{backgroundImage:'url('+basePicUrl+temp.idcardImgFace + '/resize_450_300/mode_fill)'}">
            <input enctype="multipart/form-data" type="file" accept="image/*" @change="uploadImg($event,'idcardImgFace')" />
            <i class="el-icon-plus avatar-uploader-icon"></i>
        </div>
      </el-form-item>
      <el-form-item label="身份证背面照" prop="idcardImgBack">
        <div class="uploadDiv" :style="{backgroundImage:'url('+basePicUrl+temp.idcardImgBack + '/resize_450_300/mode_fill)'}">
            <input enctype="multipart/form-data" type="file" accept="image/*" @change="uploadImg($event,'idcardImgBack')" />
            <i class="el-icon-plus avatar-uploader-icon"></i>
        </div>
      </el-form-item>
      <el-form-item label="授权书" prop="entrustPaper" v-if="temp.managerType==2">
        <div class="uploadDiv" :style="{backgroundImage:'url('+basePicUrl+temp.entrustPaper + '/resize_450_300/mode_fill)'}">
            <input enctype="multipart/form-data" type="file" accept="image/*" @change="uploadImg($event,'entrustPaper')" />
            <i class="el-icon-plus avatar-uploader-icon"></i>
        </div>
      </el-form-item>
      <el-form-item v-permission="['C010102','C010103']">
        <el-button type="primary" @click="save">{{$route.query.id?'确认修改':'确定添加'}}</el-button>
        <el-button @click="$router.replace('/merchant/merchantList')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
var basePicUrl = 'https://upic.juniuo.com/file/picture/'
import { getIndustys,addMerchant,updateMerchant,getMerchant} from '@/api/user'
import permission from '@/directive/permission'
export default {
  name:'merchantAdd',
  directives: { permission },
  data() {
    return {
      basePicUrl:basePicUrl,
      industys:[],
      temp:{
        contactPhone:"",
        industryId:"",
        bizLicenseNo:"",
        bizLicensePic:'',
        name:'',
        contactEmail:'',
        contactPhone:'',
        managerName:'',
        managerIdcard:'',
        idcardImgFace:'',
        idcardImgBack:'',
        entrustPaper:''
      },
      rules: {
        name: [{ required: true, message: '商户名称不能为空', trigger: 'change' }],
        contactPhone: [{ required: true, message: '手机号不能为空', trigger: 'change' }],
        industryId:[{ required: true, message: '请选择行业类别', trigger: 'change' }],
        bizLicenseNo: [{ required: true, message: '营业执照号码不能为空', trigger: 'change' }],
        bizLicensePic: [{ required: true, message: '请上传营业执照', trigger: 'change' }],
        managerName: [{ required: true, message: '负责人姓名不能为空', trigger: 'change' }],
        managerIdcard: [{ required: true, message: '身份证号不能为空', trigger: 'change' }]
        // idcardImgFace: [{ required: true, message: '请上传身份证正面', trigger: 'change' }],
        // idcardImgBack: [{ required: true, message: '请上传身份证背面', trigger: 'change' }],
        // entrustPaper: [{ required: true, message: '请上传授权书', trigger: 'change' }],
      },
    }
  },
  created(){
    this.getData()
  },
  methods: {
    async getData(){
      const { data } = await getIndustys();
      this.industys = data.data
      if(this.$route.query.id){
        const { data } = await getMerchant({id:this.$route.query.id});
        this.temp = data.data
      }
    },
    uploadImg(event,name){
      let formData = new FormData();
      var fileObj = event.currentTarget.files[0];
      console.log(fileObj);
      if(fileObj==null||fileObj==undefined){return;}
      formData.append("multipartFile", fileObj);
      this.$axios({
          url: '/common/uploadImage.json',
          method: 'POST',
          data: formData,
          timeout: 10000,
          headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
          if (res.data.error === '0') {
              this.temp[name] = res.data.data
          } else {
              this.$message.error(res.data.message);
          }
      }).catch(res=>{
              this.$message.error('上传失败');
      })
    },
    save() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var obj = {
            "bizLicenseNo": this.temp.bizLicenseNo,
            "bizLicensePic": this.temp.bizLicensePic,
            "contactEmail": this.temp.contactEmail,
            "contactIdcard": this.temp.contactIdcard,
            "contactName": this.temp.managerName,
            "contactPhone": this.temp.contactPhone,
            "entrustPaper": this.temp.entrustPaper,
            "idcardImgBack": this.temp.idcardImgBack,
            "idcardImgFace": this.temp.idcardImgFace,
            "industryId": this.temp.industryId,
            "logo": "",
            "managerIdcard": this.temp.managerIdcard,
            "managerName": this.temp.managerName,
            "managerType": 0,
            "mobile": this.temp.contactPhone,
            "name": this.temp.name,
            "password": "",
            "validCode": ""
          }
          if(this.$route.query.id){
            obj.id = this.$route.query.id;
            updateMerchant(obj).then(res=>{
              if(res.data.error==0){
                this.$router.go(-1);
                this.$message.success('修改商户成功');
              }else{
                this.$message.error(res.data.message);
              }
            });
          }else{
            addMerchant(obj).then(res=>{
              if(res.data.error==0){
                this.$router.go(-1);
                this.$message.success('添加商户成功');
              }else{
                this.$message.error(res.data.message);
              }
            });
          }
        }
      })
    }
  }
}
</script>
<style scoped>
.formDiv {width: 600px;margin: 50px auto;}
.avatar-uploader-icon {font-size: 28px;color: #8c939d;width: 180px;height: 120px;line-height: 120px;text-align: center;}
.uploadDiv{border: 1px #eee solid;width: 180px;height: 120px;border-radius: 6px;background: #f7f7f7;background-repeat: no-repeat;background-size: 100% 100%;overflow: hidden;position: relative;}
.uploadDiv input{opacity: 0;position:absolute;top: 0;top: 0;width: 100%;height: 100%;}
</style>
