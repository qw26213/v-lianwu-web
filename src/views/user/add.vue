<template>
  <div class="app-container">
      <el-form ref="dataForm" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
          <el-form-item label="权限组名" prop="name">
            <el-input v-model="roleName" placeholder="权限组名" />
          </el-form-item>
          <el-form-item label="权限选择" prop="name">
            <el-tree v-loading="dataLoading" :data="list" show-checkbox node-key="id" :props="defaultProps" default-expand-all ref="tree"></el-tree>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="back()">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
  </div>
</template>
<script>
import { getPermiss,getRoles,addRole,updateRole } from '@/api/user'
import permission from '@/directive/permission'
export default {
  name: 'roleAdd',
  directives: { permission },
  data() {
    return {
      dataLoading:false,
      list:[],
      roleName:'',
      curItemId:'',
      dialogStatus:'',
      listLoading:false,
      permissionIdList:[],
      dialogFormVisible:false,
      defaultProps: {
          children: 'children',
          label: 'label'
      }
    }
  },
  mounted() {
    if(!sessionStorage.roleInfo){
      this.dialogStatus = 'create'
    }else{
      var obj = JSON.parse(sessionStorage.roleInfo);
      this.curItemId = obj.id
      this.dialogStatus = 'update'
      this.roleName = obj.name
      this.permissionIdList = obj.permissionIdList
    }
    this.getList()
  },
  methods: {
    getCheckedNodes(){
      var permission = []
      var roles = this.$refs.tree.getCheckedNodes()
      for(var i=0;i<roles.length;i++){
        permission.push(roles[i].id)
      }
      return permission
    },
    createData(){
      var obj = {
        userCount:10,
        name:this.roleName,
        permissionIdList:this.getCheckedNodes()
      }
      addRole(obj).then(res => {
        if(res.data.error==0){
          this.$router.go(-1);
          this.$message.success('添加权限成功')
        }else{
          this.$message.error(res.data.message)
        }
      }).catch(error => {

      })
    },
    back(){
      this.$router.go(-1)
    },
    updateData() {
      let obj = {
        userCount:10,
        name:this.roleName,
        permissionIdList:this.getCheckedNodes()
      };
      obj.id = this.curItemId;
      updateRole(obj).then(res => {
        if(res.data.error==0){
          this.$router.go(-1);
          this.$store.dispatch('user/changeRoles', 'admin')
          this.$message.success('修改权限成功')
        }else{
          this.$message.error(res.data.message)
        }
      })
    },
    async getList() {
      this.dataLoading=true
      const { data } = await getPermiss()
      const { error, message } = data
      this.dataLoading=false
      if (error == '0') {
        this.list = data.data
        if(sessionStorage.roleInfo){
          this.$nextTick(()=>{
            this.$refs.tree.setCheckedKeys(this.permissionIdList);
          })
        }
      } else {
        console.log(message)
      }
    }
  }
}

</script>
<style scoped>
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}

</style>
