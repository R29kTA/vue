<script setup lang="ts">
import {onMounted, reactive, ref, watch} from 'vue'
import {getLogByPage,getLogByPageAndName} from "@/api/data";
import {ElNotification} from "element-plus";

const currentPage = ref(1)
const username = ref('')
const page = reactive({
  totalElements:0,
  size: 5,
})
defineOptions({
  name: "Log"
});
const logs = reactive([])
onMounted(()=>{
  fetchData()
})
watch(currentPage,(newValue,oldValue)=>{
  fetchData()
})
function fetchData() {
  if (username.value.length>0){
    getLogByPageAndName(currentPage.value,page.size,username.value).then(resp =>{
      const code = parseInt(resp.code)
      if (code == 200){
        const data = resp.data.content
        logs.length = 0
        page.totalElements = resp.data.totalElements
        for (let i = 0; i < data.length; i++) {
          logs.push(data[i])
        }
      }else {
        ElNotification({
          title: 'Error',
          message: `${resp.msg}>>用户名：[${username.value}]`,
          type: 'error',
        })
      }
    })
  }else {
    getLogByPage(currentPage.value,page.size).then(resp =>{
      const data = resp.data.content
      logs.length = 0
      page.totalElements = resp.data.totalElements
      for (let i = 0; i < data.length; i++) {
        logs.push(data[i])
      }
    })
  }
}


</script>

<template>
  <div>
    用户：
    <el-input
        v-model="username"
        class="w-50 m-2"
        size="default"
        placeholder="请输入用户名"
        clearable
        style="width: 120px"
    />
    <el-button type="primary">搜索</el-button>
    <el-timeline>
      <el-timeline-item :timestamp="item.date" placement="top" v-for="(item,index) in logs">
        <el-card>
          <h4>用户：<el-text class="mx-1" type="primary">{{item.username}}[{{item.userId}}]</el-text>
            <el-text class="mx-1" type="success">{{item.action}}</el-text>
            <el-text class="mx-1" type="primary">{{item.device}}[{{item.deviceId}}]</el-text>
            <el-text class="mx-1" type="danger">状态为{{item.status}}</el-text>
          </h4>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <div style="display: flex;justify-content: center;align-items: center;">
      <el-pagination
          small
          background
          layout="prev, pager, next"
          :total="page.totalElements"
          class="mt-4"
          v-model:current-page="currentPage"
          :default-page-size="page.size"
      />
    </div>
  </div>
</template>
