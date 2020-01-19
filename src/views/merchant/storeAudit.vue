<template>
    <div class="formDiv">
        <el-form ref="dataForm" label-width="120px">
            <el-form-item label="门店名称:" prop="name" :class="{'red':temp.updateField&&temp.updateField.indexOf('storeName')>=0}">
                <span v-text="temp.storeName"></span>
            </el-form-item>
            <el-form-item label="手机号:" prop="contactPhone" :class="{'red':temp.updateField&&temp.updateField.indexOf('contactPhone')>=0}">
                <span v-text="temp.contactPhone"></span>
            </el-form-item>
            <el-form-item label="地址:" prop="address" :class="{'red':temp.updateField&&temp.updateField.indexOf('area')>=0&&temp.updateField&&temp.updateField.indexOf('address')>=0}">
                <span>{{temp.province}}{{temp.city}}{{temp.area}}{{temp.address}}</span>
            </el-form-item>
            <el-form-item label="负责人姓名:" prop="managerName" :class="{'red':temp.updateField&&temp.updateField.indexOf('contactName')>=0}">
                <span v-text="temp.contactName"></span>
            </el-form-item>
            <el-form-item label="负责人身份证号:" prop="managerIdcard" :class="{'red':temp.updateField&&temp.updateField.indexOf('managerIdcard')>=0}">
                <span v-text="temp.managerIdcard"></span>
            </el-form-item>
            <el-form-item label="门头照:" prop="frontImg" :class="{'red':temp.updateField&&temp.updateField.indexOf('frontImg')>=0}">
                <div class="uploadDiv" :style="{backgroundImage:'url('+basePicUrl+temp.frontImg + '/resize_450_300/mode_fill)'}"></div>
            </el-form-item>
            <el-form-item label="内景照:" prop="premisesImg" :class="{'red':temp.updateField&&temp.updateField.indexOf('premisesImg')>=0}">
                <div class="uploadDiv" :style="{backgroundImage:'url('+basePicUrl+temp.premisesImg + '/resize_450_300/mode_fill)'}"></div>
            </el-form-item>
            <el-form-item label="审核意见:">
                <el-input v-model="remark" placeholder="审核意见" />
            </el-form-item>
            <el-form-item v-permission="['C010302']">
                <el-button type="primary" @click="handleCheck(1)">审核通过</el-button>
                <el-button type="warning" @click="handleCheck(-1)">审核不通过</el-button>
                <el-button @click="$router.go(-1)">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
var basePicUrl = 'https://upic.juniuo.com/file/picture/'
import { storeAuditDetail, storeAudit } from '@/api/user'
import permission from '@/directive/permission'
export default {
    name:'storeAudit',
    directives: { permission },
    data() {
        return {
            basePicUrl: basePicUrl,
            industys: [],
            remark: '',
            temp: {
                contactPhone: "",
                industryId: "",
                bizLicenseNo: "",
                bizLicensePic: '',
                storeName: '',
                contactEmail: '',
                contactPhone: '',
                contactName: '',
                managerIdcard: '',
                frontImg: '',
                premisesImg: '',
                updateField: '111'
            }
        }
    },
    created() {
        this.getData()
    },
    methods: {
        async getData() {
            if (this.$route.query.id) {
                const { data } = await storeAuditDetail({ id: this.$route.query.id });
                this.temp = data.data
            }
        },
        handleCheck(status) {
            if (status == -1 && this.remark == "") {
                this.$message.error("请填写审核意见")
                return
            }
            var obj = {
                id: this.$route.query.id,
                passStatus: status,
                remark: this.remark
            }
            storeAudit(obj).then(response => {
                if (response.data.error == '0') {
                    this.$router.go(-1)
                    this.$message.success("您已完成审核")
                } else {
                    this.$message.error(response.data.message)
                }
            })
        }
    }
}
</script>
<style scoped>
.formDiv {
    width: 600px;
    margin: 50px auto;
}

.uploadDiv {
    border: 1px #eee solid;
    background-color: #fff;
    width: 180px;
    height: 120px;
    border-radius: 6px;
    overflow: hidden;
    background: #f7f7f7;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
</style>
<style>
.el-form-item--medium.red .el-form-item__label {
  color: #F56C6C;
}
</style>