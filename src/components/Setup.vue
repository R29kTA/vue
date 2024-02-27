<script setup lang="ts">
import {onMounted, reactive, ref, toRefs, watch} from "vue";
import {setConfig} from "@/api/data";
import {ElMessage} from "element-plus";

const props = defineProps(['visible'])
const setupVisible = ref(false)
const locationMsg = ref("点击获取定位")
const formInline = reactive({
  name: '',
  powerRate: '',
  area: '',
  powerLimit: '',
  powerSwitch: false,
  latitude:0,
  longitude:0
})
function getLocation() {
  let options = {
    enableHighAccuracy: true,
    maximumAge: 1000
  };
  locationMsg.value = "获取定位中..."
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options)
  } else {
    locationMsg.value ="您的浏览器不支持地理位置定位！"
  }
}
function onSuccess(position:any) {
  formInline.latitude = position.coords.latitude
  formInline.longitude = position.coords.longitude
  locationMsg.value = "定位获取成功"
}
function onError(error:any) {
  switch (error.code) {
    case 1:
      locationMsg.value ="位置服务被拒绝！"
      break;
    case 2:
      locationMsg.value ="暂时获取不到位置信息！"
      break;
    case 3:
      locationMsg.value ="获取信息超时！"
      break;
    case 4:
      locationMsg.value ="未知错误！"
      break;
  }
}
watch(props, (newValue, oldValue) => {
  setupVisible.value = newValue.visible
})
onMounted(()=>{

})
const onSubmit = () => {
  if (formInline.area.length > 0
      &&
      formInline.powerRate.length > 0
      &&
      formInline.powerLimit.length > 0
      &&
      formInline.area.length>0
      &&
      formInline.latitude>0
      &&
      formInline.longitude>0
  ){
    setConfig(formInline).then(resp =>{
      if (resp.code==200){
        setupVisible.value = false
      }else {
        console.log(resp.msg)
      }
    })
  }else {
    ElMessage.error('请将表单填写完整！')
  }

}
</script>

<template>
  <el-dialog
      v-model="setupVisible"
      title="Welcome,请完成初始设置."
      width="50%" center
      :modal="true"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
  >
    <div>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="家庭名称">
          <el-input v-model="formInline.name" placeholder="我的家" clearable/>
        </el-form-item>

        <el-form-item label="电价">
          <el-input v-model="formInline.powerRate" placeholder="0.6/度" clearable/>
        </el-form-item>
        <el-form-item label="用电限制">
          <el-input v-model="formInline.powerLimit" placeholder="500度" clearable/>
        </el-form-item>
        <el-form-item label="面积">
          <el-input v-model="formInline.area" placeholder="120㎡" clearable/>
        </el-form-item>
        <el-form-item label="限额关闭设备">
          <el-switch v-model="formInline.powerSwitch" />
        </el-form-item>
        <el-form-item label="获取定位">
          <el-button @click="getLocation">{{locationMsg}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="onSubmit">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
