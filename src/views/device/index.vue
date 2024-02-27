<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {deleteDevice, getAllDevice, postDevice} from "@/api/data"
import {ElMessage} from "element-plus";

defineOptions({
  name: "Device"
});

const tableData = reactive([])
const formInline = reactive({
  id: null,
  name: "",
  type: "",
  status: "",
  runtime: 0,
  powerLimit: 0,
  powerSwitch: false
})
const dialogVisible = ref(false)
const dialogMsg = ref("msg")
onMounted(() => {
  fetchData()
})


function fetchData() {
  getAllDevice().then(resp => {
    const data = resp.data
    tableData.length = 0
    for (let i = 0; i < data.length; i++) {
      tableData.push(data[i])
    }
  })
}


function handleDelete(row: any) {
  deleteDevice(row).then(resp => {
    if (resp.code == 200) {
      fetchData()
    }
  })
}

function handleAdd() {
  dialogMsg.value = "添加设备"
  dialogVisible.value = true
  formInline.id=null

}
function onSubmit() {
  if (checkData()){
    postDevice(formInline).then(() =>{
      dialogVisible.value = false
      fetchData()
    })
  }
}
function checkData() {
  if (formInline.name.length > 0
      &&
      formInline.powerLimit > 0
      &&
      formInline.type.length > 0
  ){
    return true
  }else {
    ElMessage.error('请将内容填写完整！')
    return false
  }
}

function handleEdit(row: any) {
  dialogMsg.value = "修改设备"
  dialogVisible.value = true
  formInline.id = row.id
  formInline.name = row.name
  formInline.type = row.type
  formInline.powerLimit = row.powerLimit
  formInline.runtime = row.runtime
  formInline.status = row.status
  formInline.powerSwitch = row.powerSwitch
}

</script>

<template>
  <div>
    <!--    用户：-->
    <!--    <el-select v-model="value" class="m-2" placeholder="Select">-->
    <!--      <el-option-->
    <!--          v-for="item in options"-->
    <!--          :key="item.value"-->
    <!--          :label="item.label"-->
    <!--          :value="item.value"-->
    <!--      />-->
    <!--    </el-select>-->
    <!--    <el-button type="primary">搜索</el-button>-->
    <el-button type="primary" @click="handleAdd">添加设备</el-button>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="Id" width="50"/>
      <el-table-column prop="name" label="名称" width="180"/>
      <el-table-column prop="type" label="类型"/>
      <el-table-column prop="status" label="状态"/>
      <el-table-column prop="runtime" label="运行时间"/>
      <el-table-column prop="powerLimit" label="电源功耗限制"/>
      <el-table-column prop="powerSwitch" label="限额关闭开关"/>
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="{index,row}">
          <el-button
              type="info"
              @click="handleEdit(row)"
          >修改
          </el-button
          >
          <el-popconfirm title="确定删除吗?"
                         @confirm="handleDelete(row)"
          >
            <template #reference="key">
              <el-button
                  type="danger"
              >删除
              </el-button
              >
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
        v-model="dialogVisible"
        :title="dialogMsg"
        width="500"
    >
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="设备名称">
          <el-input v-model="formInline.name" placeholder="卧室的灯" clearable/>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-input v-model="formInline.type" placeholder="电灯" clearable/>
        </el-form-item>
        <el-form-item label="耗电限制">
          <el-input v-model="formInline.powerLimit" placeholder="100" clearable/>
        </el-form-item>
        <el-form-item label="耗尽断电">
          <el-switch v-model="formInline.powerSwitch"></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="onSubmit">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
