<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">联物运营后台登录</h3>
      </div>

      <el-form-item prop="mobile">
        <span class="svg-container"><svg-icon icon-class="user" /></span>
        <el-input ref="mobile" v-model="loginForm.mobile" placeholder="用户名" name="mobile" type="text" tabindex="1" autocomplete="on"/>
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container"><svg-icon icon-class="password" /></span>
        <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="密码" name="password"
          tabindex="2" autocomplete="on" @keyup.native="checkCapslock" @blur="capsTooltip = false" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item class="checkCode" prop="isPassed">
        <drag-verify :width="390" :height="40" text="向右滑动" success-text="验证成功" :background="background" text-size="15px"
         :progress-bar-bg="progressBarBg" :completed-bg="completedBg" :handler-bg="handlerBg" :handler-icon="handlerIcon" :success-icon="successIcon" 
         :circle="false" @passcallback="passcallback" v-if="loadSurvey"></drag-verify>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin" :disabled="loginForm.isPassed==0">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import { validMobile } from '@/utils/validate'
import dragVerify from 'vue-drag-verify'
export default {
  name: 'Login',
  components:{dragVerify},  
  data() {
    const validateMobile = (rule, value, callback) => {
      if (!validMobile(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码至少6位'))
      } else {
        callback()
      }
    }
    const validatePassed = (rule, value, callback) => {
      if (value==0) {
        callback(new Error('请完成拖拽验证'))
      } else {
        callback()
      }
    }
    return {
      handlerIcon:'el-icon-arrow-right',
      successIcon:'el-icon-check',
      background:'#cccccc',
      progressBarBg:'#FFFF99',
      completedBg:'#66cc66',
      handlerBg:'#fff',
      textSize:'15px',
      loginForm: {
        mobile: '',
        password: '',
        isPassed:0
      },
      loadSurvey:true,
      loginRules: {
        mobile: [{ required: true, trigger: 'blur', validator: validateMobile }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        isPassed: [{ required: true, trigger: 'blur', validator: validatePassed }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.loginForm.mobile === '') {
      this.$refs.mobile.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    resetChild(){
      this.loadSurvey = false
      this.loginForm.isPassed = 0
      this.$nextTick(()=>{
        this.loadSurvey = true
      })
    },
    passcallback(){
      this.loginForm.isPassed = 1
    },
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      console.log(this.loginForm.isPassed)
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then((res) => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            }).catch((err) => {
              this.resetChild();
              this.$message.error(err)
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>
<style scoped>
  .checkCode{height: 38px;overflow: hidden;margin-bottom: 30px;width: 388px;border-radius: 4px;}
</style>
<style lang="scss">
$bg:#283443;
$light_gray:#fff;
$cursor: #fff;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
.checkCode .el-form-item__error{margin-top:30px}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 460px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
