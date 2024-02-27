<script setup lang="ts">

import {House} from "@element-plus/icons-vue";
import {onMounted, reactive, ref, watch} from "vue";
import {
  getAirConditioning,
  getAllDevice,
  getConfig,
  getDevicesByType,
  setAirConditioning,
  getDeviceByPage,
  postDevice, updateDeviceStatus
} from "@/api/data";
import {ElNotification} from "element-plus";


const area = ref(0)
const air = reactive({
  id: 0,
  temperature: 16,
  mode: false,
  runtime: 0
})
const currentPage = ref(1)
const page = reactive({
  totalElements:0,
  size: 4,
})
const devices = reactive([])
const airList = reactive([])
const airConditioning = ref(0)
onMounted(() => {
  fetchData()
  fetchDevice()
})
watch(airConditioning, (newValue, oldValue) => {
  getAirConditioning(newValue).then(resp => {
    const data = resp.data
    air.temperature = data.temperature
    air.mode = data.mode
    air.runtime = data.runtime
    air.id = data.id
  })
})
watch(currentPage, (newValue, oldValue) => {
  fetchDevice()
})
function fetchDevice() {
  getDeviceByPage(currentPage.value,page.size).then(resp =>{
    const data = resp.data
    page.totalElements = data.totalElements
    devices.length = 0;
    const content = data.content
    for (let i = 0; i < content.length; i++) {
      devices.push(content[i])
    }
  })
}
function handleAirTabClick(pane: any, ev: any) {
  airConditioning.value = pane.paneName
}

function fetchData() {
  getConfig().then(resp => {
    const data = resp.data
    area.value = data.area
  })
  getDevicesByType("空调").then(resp => {
    const data = resp.data
    airList.length = 0
    for (let i = 0; i < data.length; i++) {
      airList.push(data[i])
    }
    airConditioning.value = airList[0].id
  })
}

function onSliderChange() {
  air.id = airConditioning.value
  setAirConditioning(air).then(resp => {
    const code = resp.code
    if (code == 200) {
      ElNotification({
        title: 'Success',
        message: `调整温度:${air.temperature}℃,状态:${air.mode ? "热" : "冷"} 成功`,
        type: 'success',
      })
    } else {
      ElNotification({
        title: 'Error',
        message: `${resp.msg}`,
        type: 'error',
      })
    }
  })
}
function onButtonClick(id:any,status:boolean){
  updateDeviceStatus({id:id,status:status}).then((resp)=>{
    const code = resp.code
    if (code == 200) {
      ElNotification({
        title: 'Success',
        message: `更新设备状态成功`,
        type: 'success',
      })
    } else {
      ElNotification({
        title: 'Error',
        message: `${resp.msg}`,
        type: 'error',
      })
    }
  })
}
</script>

<template>
  <el-card class="box-card">
    <div class="flex-container">
      <el-tabs v-model="airConditioning" @tab-click="handleAirTabClick" style="width: 100%">
        <el-tab-pane :label="item.name" :name="item.id" v-for="(item, index) in airList">
          <div style=" display: flex;justify-content: space-between;">
            <div>温度调节</div>
            <div>
              <el-switch
                  v-model="air.mode"
                  active-text="热"
                  inactive-text="冷"
                  @click="onSliderChange"
              />
            </div>
          </div>
          <el-slider :min="16" :max="30" v-model="air.temperature" :step="1" show-stops @change="onSliderChange"/>
        </el-tab-pane>
      </el-tabs>

    </div>
    <el-divider/>
    <div style="text-align: center">
      <div class="flex-container">
        <div class="left-item">
          <el-row>
            <el-col :span="24">
              <div class="top-item">室内面积</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="bottom-item">{{ area }}㎡</div>
            </el-col>
          </el-row>
        </div>
        <div class="right-item">
          <el-row>
            <el-col :span="24">
              <div class="top-item">控温时间</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="bottom-item">{{ air.runtime }}m</div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <el-divider/>
    <div class="flex-container">
      <el-text class="mx-1" type="primary">我的设备</el-text>
    </div>
    <div>
      <div>
        <div style="display: flex;flex-wrap: wrap">
          <el-card style="width: 180px;height: 180px;margin: 5px" v-for="(item, index) in devices">
            <div class="container">
              <el-row>
                <el-col :span="24">
                  <div class="top-item">
                    <div class="flex-container">
                      <div class="left-item"></div>
                      <div class="right-item">
                        <el-switch
                            v-model="item.status"
                            @click="onButtonClick(item.id,item.status)"
                        />
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <div class="middle-item" style="text-align: center">
                    <el-icon style="font-size: 32px">
                      <House/>
                    </el-icon>
                  </div>
                </el-col>
              </el-row>
              <div class="bottom-item" style="text-align: center">{{item.name}}</div>
            </div>
          </el-card>
        </div>
        <div style="display: flex;justify-content: center;align-items: center;">
          <el-pagination
              small
              background
              layout="prev, pager, next"
              :total="page.totalElements"
              class="mt-4"
              v-model:current-page="currentPage"
              :default-page-size="4"
          />
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
}

.flex {
  display: flex;
}

.box-card {
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
