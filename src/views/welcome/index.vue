<script setup lang="ts">
import PowerCs from "@/components/Power.vue";
import Weather from "@/components/Weather.vue";
import Device from "@/components/Device.vue";
import Setup from "@/components/Setup.vue";
import {onMounted, reactive, ref} from "vue";
import {getConfig} from "@/api/data";

defineOptions({
  name: "Welcome"
});
const setupVisible = ref(false)
function checkFirst(){
  getConfig().then(resp =>{
    const data = resp.data
    if (data == null){
      setupVisible.value = true
    }
  })
}
function t(){
  setupVisible.value=true
}
onMounted(() => {
  checkFirst()
})
</script>

<template>
  <div>
    <el-row :gutter="5">
      <el-col :span="9">
        <el-card>
          <el-row class="flex">
            <el-card style="flex: auto;height: 300px">
              <img src="src/assets/index.jpg" alt="index">
              <div style="text-align: end">
                <el-button @click="t" type="primary">设置</el-button>
              </div>
            </el-card>
          </el-row>
          <el-row>
            <PowerCs/>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="6">
        <weather/>
      </el-col>
      <el-col :span="9">
        <Device/>
      </el-col>
    </el-row>
    <Setup :visible="setupVisible"/>
  </div>
</template>
<style>
.flex {
  display: flex;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
