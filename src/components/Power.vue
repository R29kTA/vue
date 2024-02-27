<script setup lang="ts">
import {onMounted, onUnmounted, reactive, ref} from 'vue'
import echarts from "@/plugins/echarts"
import {getDayPower, getDevicePower} from "@/api/power"


let chart:echarts.ECharts
const date = ref(1)
const option = reactive({
  title: {
    text: ""
  },
  tooltip: {},
  legend: {
    data: ['耗电量']
  },
  xAxis: {
    data: []
  },
  yAxis: {},
  series: [{
    name: '耗电量',
    type: 'bar',
    data: []
  }]
});
const data =reactive([])

function fetchData(){
  getDayPower(date.value).then(resp =>{
    const data = resp.data
    const day = []
    const power = []
    for (let i = 0; i < data.length; i++) {
      day.push(data[i].day)
      power.push(data[i].power)
    }
    option.xAxis.data=day
    option.series[0].data=power
    chart.setOption(option)
  })
  getDevicePower(date.value).then(resp => {
    const dat = resp.data
    data.length = 0
    for (let i = 0; i < dat.length; i++) {
      data.push(dat[i])
    }
  })
}
onMounted(() => {
  chart = echarts.init(document.getElementById('echarts_box'))
  fetchData()
});
onUnmounted(()=>{
  chart.clear()
})
const options = reactive([])
for (let i = 1;i<13 ;i++ ){
  options.push({
    value: i,
    label: `${i}月`
  })
}
</script>

<template>
  <el-card style="flex: auto;">
    <template #header>
      <div class="flex-container">
        <el-text class="mx-1" type="primary">家电消耗</el-text>
<!--        <el-button type="primary" round>设置</el-button>-->
      </div>
      <div class="card-header">
        <el-select v-model="date"  @change="fetchData" placeholder="Select" size="small" style="width: 80px">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </div>
    </template>
    <div id="echarts_box" style="width: 360px;height: 180px"></div>
    <div style="display: flex;flex-wrap: wrap">
        <div v-for="(item, index) in data" :key="index" style="width: 50%">
            {{ item.name }}({{ item.consume.toFixed(1) }}￥)
            <el-progress :percentage="(((item.consume / item.limit) * 100) | 0)" />
        </div>
    </div>
  </el-card>

</template>

<style scoped lang="scss">
.flex {
  display: flex;
}
.box-card{
  height: 960px;
}
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.container {
  width: 100%;
}

.flex-container {
  display: flex;
  justify-content: space-between;
}

.flex-item {
  flex: 1;
}

.right-button {
  margin-left: 10px;
}
</style>
