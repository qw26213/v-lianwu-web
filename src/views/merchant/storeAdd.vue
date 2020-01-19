<template>
  <div class="formDiv">
    <el-form ref="dataForm" label-width="120px" :rules="rules" :model="temp">
      <el-form-item label="门店名称" prop="name">
        <el-input v-model="temp.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="contactPhone">
        <el-input v-model="temp.contactPhone"></el-input>
      </el-form-item>
      <el-form-item label="所在区域">
        <Areas @giveData="areaData" :addressCode="addressCode"></Areas>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="temp.address"></el-input>
      </el-form-item>
      <!-- <el-form-item label="营业执照号码" prop="bizLicenseNo">
        <el-input v-model="temp.bizLicenseNo"></el-input>
      </el-form-item>
      <el-form-item label="营业执照" prop="bizLicensePic">
        <div class="uploadDiv" :style="{backgroundImage:'url(' + temp.bizLicensePic + ')'}">
            <input enctype="multipart/form-data" type="file" accept="image/*" @change="uploadImg($event,'bizLicensePic')" />
            <i class="el-icon-plus avatar-uploader-icon"></i>
        </div>
      </el-form-item> -->
      <el-form-item label="负责人姓名" prop="contactName">
        <el-input v-model="temp.contactName"></el-input>
      </el-form-item>
      <el-form-item label="门头照" prop="frontImg">
        <div class="uploadDiv" :style="{backgroundImage:'url('+basePicUrl+temp.frontImg + '/resize_450_300/mode_fill)'}">
            <input enctype="multipart/form-data" type="file" accept="image/*" @change="uploadImg($event,'frontImg')" />
            <i class="el-icon-plus avatar-uploader-icon"></i>
        </div>
      </el-form-item>
      <el-form-item label="内景照" prop="premisesImg">
        <div class="uploadDiv" :style="{backgroundImage:'url('+basePicUrl+temp.premisesImg + '/resize_450_300/mode_fill)'}">
            <input enctype="multipart/form-data" type="file" accept="image/*" @change="uploadImg($event,'premisesImg')" />
            <i class="el-icon-plus avatar-uploader-icon"></i>
        </div>
      </el-form-item>
      <el-form-item v-permission="['C010105','C010106']">
        <el-button type="primary" @click="save">{{$route.query.id?'确认修改':'确定添加'}}</el-button>
        <el-button @click="$router.replace('/merchantStores?id='+$route.query.mId)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
var basePicUrl = 'https://upic.juniuo.com/file/picture/'
import Areas from "@/components/areas";
import { getIndustys,addStore,updateStore,getStore} from '@/api/user'
import permission from '@/directive/permission'
export default {
  name:'merchantStoreAdd',
  components: { Areas },
  directives: { permission },
  data() {
    return {
      basePicUrl:basePicUrl,
      industys:[],
      temp:{
        contactPhone:"",
        address:"",
        bizLicenseNo:"",
        bizLicensePic:'',
        name:'',
        contactEmail:'',
        contactPhone:'',
        managerName:'',
        managerIdcard:'',
        frontImg:'',
        premisesImg:'',
        province:'',
        city:"",
        area:""
      },
      addressCode:{},
      rules: {
        name: [{ required: true, message: '门店名称不能为空', trigger: 'change' }],
        contactPhone: [{ required: true, message: '手机号不能为空', trigger: 'change' }],
        area:[{ required: true, message: '请选择所在区域', trigger: 'change' }],
        address:[{ required: true, message: '详细地址不能为空', trigger: 'change' }],
        // bizLicenseNo: [{ required: true, message: '营业执照号码不能为空', trigger: 'change' }],
        // bizLicensePic: [{ required: true, message: '请上传营业执照', trigger: 'change' }],
        contactName: [{ required: true, message: '负责人姓名不能为空', trigger: 'change' }]
        // frontImg: [{ required: true, message: '身份证号不能为空', trigger: 'change' }]
        // premisesImg: [{ required: true, message: '请上传内景照', trigger: 'change' }]
      },
    }
  },
  created(){
    this.getData()
  },
  methods: {
    getData(){
      if(this.$route.query.id){
        getStore({id:this.$route.query.id}).then(res=>{
          if(res.data.error==0){
            this.temp = res.data.data
            this.addressCode = {
              province:this.temp.province,
              city:this.temp.city,
              area:this.temp.area
            }
          }
        });
      }
    },
    areaData(data){
        this.temp.province = data.split("-")[0]
        this.temp.city = data.split("-")[1]
        this.temp.area = data.split("-")[2]
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
          if (res.data.error == '0') {
              this.temp[name] = res.data.data
          } else {
              this.$message.error('上传失败');
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
            "contactName": this.temp.contactName,
            "contactPhone": this.temp.contactPhone,
            "entrustPaper": this.temp.entrustPaper,
            "frontImg": this.temp.frontImg,
            "premisesImg": this.temp.premisesImg,
            "address": this.temp.address,
            "managerIdcard": this.temp.managerIdcard,
            "managerName": this.temp.contactName,
            "managerType": 0,
            "mobile": this.temp.contactPhone,
            "province":this.temp.province,
            "city":this.temp.city,
            "area":this.temp.area,
            "name": this.temp.name,
            "password": "",
            "validCode": "",
            "merchantId":this.$route.query.mId
          }
          if(this.$route.query.id){
            obj.id = this.$route.query.id;
            updateStore(obj).then(res=>{
              if(res.data.error==0){
                this.$router.go(-1);
                this.$message({
                  showClose: true,
                  message: '修改门店成功',
                  type: 'success'
                });
              }else{
                  this.$message.error('修改门店失败');
              }
            });
          }else{
            addStore(obj).then(res=>{
              if(res.data.error==0){
                this.$router.go(-1);
                this.$message({
                  showClose: true,
                  message: '添加门店成功',
                  type: 'success'
                });
              }else{
                this.$message.error('添加门店失败');
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
.uploadDiv{border: 1px #eee solid;background-color: #fff;width: 180px;height: 120px;border-radius: 6px;overflow: hidden;background: #f7f7f7;background-repeat: no-repeat;background-size: 100% 100%;overflow: hidden;position: relative;}
.uploadDiv input{opacity: 0;position:absolute;top: 0;top: 0;width: 100%;height: 100%;}
</style>
