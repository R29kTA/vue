<script setup lang="ts">

import {MoreFilled, Sunny, Sunrise, Sunset, Cloudy} from "@element-plus/icons-vue";
import {getEnvironment} from "@/api/data"
import {onMounted, onUnmounted, reactive} from "vue";

const temperatureF = reactive([])

const data = reactive({
  dayTime: 0,
  humidity: 0,
  dashBoardPer: 0,
  sunrise: "00:00",
  sunset: "24:00",
  temperatureI: 0,
  temperatureN: {
    date: "",
    icon: "",
    max: 0,
    min: 0
  },
  temperatureO: 0,
  windSpeed: 0
})
const colors = [
  {color: '#f56c6c', percentage: 20},
  {color: '#e6a23c', percentage: 40},
  {color: '#5cb87a', percentage: 60},
  {color: '#1989fa', percentage: 80},
  {color: '#000000', percentage: 100},
]
let timer:any;
function getDashBoardPer(){
  const startDate = new Date();
  const [hours, minutes] = data.sunset.split(":");
  const endDate = new Date();
  endDate.setHours(parseInt(hours,10), parseInt(minutes,10), 0, 0);
  const diffInMilliseconds = endDate.getTime() - startDate.getTime();
  const diffInMinutes = diffInMilliseconds / (1000 * 60);
  const per = (1 - (diffInMinutes / data.dayTime)) * 100
  return per > 0 ? parseInt(per,10) : 0
}
onMounted(() => {
  getEnvironment().then(resp => {
    const dat = resp.data
    data.dayTime = dat.dayTime
    data.humidity = dat.humidity
    data.sunrise = dat.sunrise
    data.sunset = dat.sunset
    data.temperatureN = dat.temperatureN
    data.windSpeed = dat.windSpeed
    data.temperatureI = dat.temperatureI
    data.temperatureO = dat.temperatureO
    temperatureF.length = 0
    for (let i = 0; i < dat.temperatureF.length; i++) {
      temperatureF.push(dat.temperatureF[i])
    }
    const percent = getDashBoardPer()
    data.dashBoardPer = percent > 100 ? 100 : percent
    timer = setInterval(() => {
      const percent = getDashBoardPer()
      data.dashBoardPer = percent > 100 ? 100 : percent
    }, 1000 * 60);
  })
});
onUnmounted(() =>{
  clearInterval(timer);
})
</script>

<template>
  <el-card>
    <div style="text-align: center">今日天气</div>
    <div class="flex-container">
      <div class="left-item">
        <el-icon style="font-size: 32px">
          <Sunny/>
        </el-icon>
        {{ data.temperatureN.icon }}
      </div>
      <div class="right-item">
        <el-text class="mx-1" size="large">{{ data.temperatureN.max.toFixed() }}℃</el-text>
        <el-text class="mx-1" size="large">/</el-text>
        <el-text class="mx-1" size="small">{{ data.temperatureN.min.toFixed() }}℃</el-text>
      </div>
    </div>
    <el-divider/>
    <el-timeline>
      <el-timeline-item
          v-for="(activity, index) in temperatureF"
          :key="index"
          :icon="Cloudy"
          :timestamp="activity.date"
      >
        <div class="flex-container">
          <div class="left-item">{{ activity.icon }}</div>
          <div class="right-item">
            <el-text class="mx-1" size="large">{{ activity.max.toFixed() }}℃</el-text>
            <el-text class="mx-1" size="large">/</el-text>
            <el-text class="mx-1" size="small">{{ activity.min.toFixed() }}℃</el-text>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
    <el-divider/>
    <div style="text-align: center">
      <el-progress type="dashboard" :percentage="data.dashBoardPer" :color="colors">
        <template #default="{ percentage }">
          <span class="percentage-label">昼</span>
          <span class="percentage-value">{{ percentage }}%</span>
        </template>
      </el-progress>
    </div>
    <div class="flex-container">
      <div style="display:flex; flex-direction: row;">
        <el-icon>
          <Sunrise/>
        </el-icon>
        <el-text tag="b">{{ data.sunrise }}</el-text>
      </div>
      <div style="display:flex; flex-direction: row;">
        <el-icon>
          <Sunset/>
        </el-icon>
        <el-text tag="b">{{ data.sunset }}</el-text>
      </div>
    </div>
    <el-divider/>
    <div>
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <div class="top-item">
                <el-text>室内温度</el-text>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="bottom-item">
                <el-text tag="b" style="text-align: center">{{ `${data.temperatureI.toFixed()}℃` }}</el-text>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <div class="top-item">
                <el-text>室外温度</el-text>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="bottom-item">
                <el-text tag="b" style="text-align: center">{{ `${data.temperatureO.toFixed()}℃` }}</el-text>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <div class="top-item">
                <el-text>室外湿度</el-text>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="bottom-item">
                <el-text tag="b" style="text-align: center">{{ `${data.humidity * 100}%` }}</el-text>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <div class="top-item">
                <el-text>风速</el-text>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="bottom-item">
                <el-text tag="b" style="text-align: center">{{ data.windSpeed }}KM/H</el-text>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
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
