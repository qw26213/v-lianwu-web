<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />
    <el-row :gutter="32">
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartData" />
        </div>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import TodoList from './components/TodoList'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    TodoList
  },
  data() {
    return {
      lineChartData: {
        expectedData: [100, 120, 161, 134, 105, 160,120, 60, 200, 184,220, 250],
        actualData: [120, 60, 100, 154, 162, 140,120, 60, 100, 154, 320, 145]
      }
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
