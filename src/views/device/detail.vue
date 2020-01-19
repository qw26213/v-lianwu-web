<template>
    <div class="app-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>扫码次数趋势</span>
              <div style="float: right; padding: 3px 0">
                  <el-button size="mini" type="default" @click="getPrevData()">上一天</el-button>
                  <span>{{curDate}}</span>
                  <el-button size="mini" type="default" @click="getNextData()">下一天</el-button>
              </div>
            </div>
            <div ref="chart" style="height:320px;width:100%"></div>
        </el-card>
        <el-card class="box-card1">
          <div slot="header" class="clearfix"><span>设备详情</span></div>
          <div class="text clearfix">
            <p class="item">设备编号：{{deviceInfo.device_en}}</p>
            <p class="item">硬件序列号：{{deviceInfo.device_sn}}</p>
            <p class="item">设备状态：{{deviceInfo.device_status==1?'未激活':deviceInfo.device_status==2?'激活':'锁定'}}</p>
            <p class="item">首次登记时间：{{deviceInfo.create_time}}</p>
            <p class="item">最后在线时间：{{deviceInfo.online_time}}</p>
            <p class="item">手机卡序列号：{{deviceInfo.sim_sn}}</p>
            <p class="item">网络类型：{{deviceInfo.network_type}}</p>
            <p class="item">网络运营商：{{deviceInfo.network_operator_type}}</p>
            <p class="item">安卓版本：{{deviceInfo.android_version}}</p>
            <p class="item">系统API级别：{{deviceInfo.android_api_level}}</p>
            <p class="item">OTA版本名称：{{deviceInfo.ota_version_name}}</p>
            <p class="item">OTA版本号：{{deviceInfo.ota_version}}</p>
            <p class="item">总容量：{{deviceInfo.total_volumn}}</p>
            <p class="item">剩余容量：{{deviceInfo.free_volumn}}</p>
            <!-- <p class="item">网络运营商名称：{{deviceInfo.network_operator_name}}</p> -->
            <!-- <p class="item">网络状态：{{deviceInfo.network_status}}</p> -->
            <!-- <p class="item">归属账号：{{deviceInfo.email}}</p> -->
            <p class="item">打印机状态：{{deviceInfo.printer_state|format}}</p>
            <p class="item">打印机浓度：{{deviceInfo.printer_concentration}}</p>
            <p class="item">CPU使用率：{{deviceInfo.cpu_rate}}</p>
            <p class="item">内存使用率：{{deviceInfo.memory_rate}}</p>
            <p class="item">存储使用率：{{deviceInfo.storage_rate}}</p>
            <p class="item">WiFi信号强度：{{deviceInfo.wifi_signal_strength}}</p>
            <p class="item">wifi mac地址：{{deviceInfo.wifi_mac}}</p>
            <p class="item">WiFi连接速度：{{deviceInfo.wifi_link_speed}}</p>
            <p class="item">无线路由器：{{deviceInfo.wireless_router_name}}</p>
            <p class="item">无线路由地址：{{deviceInfo.wireless_router_address}}</p>
            <p class="item">移动网络信号强度：{{deviceInfo.wireless_signal_strength}}</p>
            <p class="item">移动传输速度：{{deviceInfo.wireless_link_speed}}</p>
            <p class="item">蓝牙名称：{{deviceInfo.bt_name}}</p>
            <p class="item">蓝牙地址：{{deviceInfo.bt_address}}</p>
            <p class="item">屏幕分辨率：{{deviceInfo.display_resolution}}</p>
            <p class="item">屏幕DPI：{{deviceInfo.display_dpi}}</p>
            <p class="item">imei号：{{deviceInfo.imei}}</p>
          </div>
        </el-card>
    </div>
</template>
<script>
import echarts from 'echarts';
import { getScodeNum,getDeviceInfo } from '@/api/user'
import { getNowDate, getDateByDate, getPrevDate, getNextDate } from '@/utils'
require('echarts/theme/macarons');
import resize from '@/views/home/admin/components/mixins/resize'
export default {
    mixins: [resize],
    data() {
        return {
            initData: [],
            isBottom:false,
            curDate: "",
            queryObj: {
                pageIndex: 1,
                pageSize: 24,
                deviceSN: this.$route.query.id
            },
            chart: null,
            chartData: {
                xData: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
                yData: [],
            },
            deviceInfo:{}
        }
    },
    filters: {
      format: function(num) {
          if (num==1) { return '高' }
          if (num==2) { return '中' }
          if (num==3) { return '低' }
          if (num==0) { return '正常' }
      }
    },
    watch: {
        chartData: {
            deep: true,
            handler(val) {
                this.setOptions(val)
            }
        }
    },
    mounted() {
        this.curDate = getNowDate()
        this.$nextTick(() => {
            this.chart = echarts.init(this.$refs.chart, 'macarons')
            this.getData(this.curDate)
        })
    },
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        this.chart.dispose()
        this.chart = null
    },
    methods: {
        getPrevData() {
            this.curDate = getPrevDate(this.curDate)
            for (var i = 0; i < this.initData.length; i++) {
                if (this.initData[i].day == getPrevDate(this.curDate)) {
                    this.initChart(this.curDate);
                    return;
                }
            }
            this.queryObj.pageIndex = this.queryObj.pageIndex + 1
            this.getData(this.curDate)
        },
        getNextData() {
            if(this.curDate==getNowDate()){
              this.$message.error("请查看当前日期之前的数据");
              return;
            }
            this.curDate = getNextDate(this.curDate)
            for (var i = 0; i < this.initData.length; i++) {
                if (this.initData[i].day == getNextDate(this.curDate)) {
                    this.initChart(this.curDate);
                    return;
                }
            }
            this.queryObj.pageIndex = this.queryObj.pageIndex + 1
            this.getData(this.curDate)
        },
        getData(someDate) {
            getScodeNum(this.queryObj).then(res => {
                var listdata = res.data.data.scanLogList;
                this.initData = this.initData.concat(listdata);
                this.initChart(someDate);
            });
            getDeviceInfo({
                sn:this.$route.query.id
            }).then(res => {
                this.deviceInfo = res.data.data;
            });
        },
        initChart(someDate) {
            var showData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            if(this.initData.length>0){
              for (var i = 0; i < this.initData.length; i++) {
                  if (this.initData[i].day == someDate) {
                      var j = this.initData[i].time;
                      showData[j] = this.initData[i].scanCount
                  }
              }
            }
            this.chartData.yData = showData;
            this.setOptions(this.chartData)
        },
        setOptions({ xData, yData } = {}) {
            this.chart.setOption({
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {type : 'shadow'}
                },
                grid: {
                    left: '0%',
                    right: '0%',
                    bottom: '0%',
                    top: '2%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : xData,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        minInterval: 1
                    }
                ],
                series : [
                    {
                        name:'扫码次数',
                        type:'bar',
                        barWidth: '60%',
                        data:yData
                    }
                ]
            })
        }
    }
}
</script>
<style scoped>
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 8px;width: 33.3%;float: left;margin-top: 8px;font-size: 14px;
  }
  .clearfix:after {
    clear: both
  }
  .box-card1 {
    width: 100%;
    margin-top: 10px
  }
</style>